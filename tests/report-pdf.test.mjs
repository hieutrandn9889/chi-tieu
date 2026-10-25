import assert from "node:assert/strict";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { buildSequenceReport } from "../src/lib/nls.ts";
import { buildExportData } from "../src/lib/report-export.ts";
import { buildPdfDefinition } from "../src/lib/report-pdf.ts";

const require = createRequire(import.meta.url);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const fontsDir = path.join(root, "node_modules/pdfmake/build/fonts/Roboto");
const at = new Date(2026, 9, 25, 9, 5);

function definitionFor(digits, kind) {
  const data = buildExportData(buildSequenceReport(digits), kind, at);
  return { data, definition: buildPdfDefinition(data) };
}

// Server-side pdfmake with the same Roboto files the browser build bundles.
async function render(definition) {
  const pdfmake = require("pdfmake");
  pdfmake.setUrlAccessPolicy(() => false);
  pdfmake.setLocalAccessPolicy((file) =>
    path.resolve(file).startsWith(fontsDir),
  );
  pdfmake.setFonts({
    Roboto: {
      normal: path.join(fontsDir, "Roboto-Regular.ttf"),
      bold: path.join(fontsDir, "Roboto-Medium.ttf"),
      italics: path.join(fontsDir, "Roboto-Italic.ttf"),
      bolditalics: path.join(fontsDir, "Roboto-MediumItalic.ttf"),
    },
  });
  return pdfmake.createPdf(definition).getBuffer();
}

test("the PDF definition carries no four consecutive digits of the sequence", () => {
  for (const [digits, kind] of [
    ["001431681414", "cccd"],
    ["0961742038", "phone"],
    ["82606204040852648868444002822400", "other"],
  ]) {
    const { data, definition } = definitionFor(digits, kind);
    // Functions (layouts, footer) drop out of JSON; the date is not from the sequence.
    const text = JSON.stringify(definition).split(data.generatedAt).join("");
    for (let i = 0; i + 4 <= digits.length; i++)
      assert.ok(
        !text.includes(digits.slice(i, i + 4)),
        `${kind} leaks ${digits.slice(i, i + 4)}`,
      );
    assert.ok(text.includes(data.masked));
    // Roboto has no "→"; every arrow becomes "›".
    assert.ok(!text.includes("→"));
  }
});

test("the PDF definition is A4 with a page footer, metadata and every section", () => {
  const { definition } = definitionFor("0961742038", "phone");
  assert.equal(definition.pageSize, "A4");
  assert.deepEqual(definition.footer(2, 9).text, "Trang 2 / 9");
  assert.match(
    definition.info.title,
    /Báo cáo luận giải dãy số · Số điện thoại/,
  );
  const text = JSON.stringify(definition.content);
  for (const title of [
    "Kế hoạch luận",
    "Tóm tắt",
    "Hình ảnh tổng quan",
    "Phân tích chi tiết",
    "Số 0 và số 5 theo tài liệu",
    "Luận từng nhóm",
    "Nhận biết số điện thoại (ghi chép bổ sung)",
    "Câu hỏi để tự đối chiếu",
    "Kiểm chứng kết quả",
  ])
    assert.ok(text.includes(title), title);
  assert.ok(text.includes('"text":"Đạt"'));
});

test("pdfmake renders the definition to a real multi-page PDF", async () => {
  const { definition } = definitionFor("001431681414", "cccd");
  const buffer = await render(definition);
  assert.equal(buffer.subarray(0, 5).toString(), "%PDF-");
  const pages = (buffer.toString("latin1").match(/\/Type \/Page\b/g) || [])
    .length;
  assert.ok(pages >= 4 && pages <= 12, `${pages} pages`);
  assert.ok(buffer.length < 400_000, `${buffer.length} bytes`);
});

test("the PDF names a group that only appears split by 0/5", () => {
  const { definition } = definitionFor("109", "other");
  const text = JSON.stringify(definition.content);
  assert.ok(text.includes("Diên Niên + 0"));
  assert.ok(text.includes("Chen giữa một cặp Diên Niên · dạng X0Y"));
  assert.ok(!text.includes("một cặp  ·"));
});

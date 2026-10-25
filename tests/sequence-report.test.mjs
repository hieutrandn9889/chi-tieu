import assert from "node:assert/strict";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import test from "node:test";
import { buildSync } from "esbuild";
import { buildSequenceReport } from "../src/lib/nls.ts";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const output = path.join(root, ".cache/sequence-report-render.mjs");
mkdirSync(path.dirname(output), { recursive: true });
buildSync({
  stdin: {
    contents: `
      import { createElement } from 'react';
      import { renderToStaticMarkup } from 'react-dom/server';
      import { StaticRouter } from 'react-router-dom/server.js';
      import { SequenceReport } from './src/components/SequenceReport.tsx';
      import { PrintableReport } from './src/components/PrintableReport.tsx';
      export function renderReport(report, numberKind) {
        return renderToStaticMarkup(createElement(StaticRouter, { location: '/tra-cuu' },
          createElement(SequenceReport, { report, numberKind, children: null })));
      }
      export function renderPrintable(data) {
        return renderToStaticMarkup(createElement(PrintableReport, { data }));
      }
    `,
    resolveDir: root,
    loader: "tsx",
  },
  outfile: output,
  tsconfig: path.join(root, "tsconfig.app.json"),
  bundle: true,
  packages: "external",
  platform: "node",
  format: "esm",
});
const { renderReport, renderPrintable } = await import(pathToFileURL(output).href);

// The owner chose to remove the two-field combination readings from the report.
test("the rendered report shows no two-field combination section or link", () => {
  const html = renderReport(buildSequenceReport("143168"));
  assert.doesNotMatch(html, /report-order-title/);
  assert.doesNotMatch(html, /Luận kết hợp/);
  assert.doesNotMatch(html, /class="combination-interpretation"/);
});

test("the rendered report opens with a quick summary before the detailed sections", () => {
  const html = renderReport(buildSequenceReport("143168"));
  const summary = html.indexOf('id="report-summary-title"');
  assert.ok(summary > 0);
  assert.ok(summary < html.indexOf('id="report-overview-title"'));
  assert.match(html, /Xuất hiện nhiều nhất: Thiên Y \(2\/5 cặp\)/);
  assert.match(html, /Sinh Khí → Diên Niên → Thiên Y → Lục Sát → Thiên Y/);
  const summaryHtml = html.slice(summary, html.indexOf("<nav"));
  assert.equal((summaryHtml.match(/<li class="tone-/g) || []).length, 4);
  const special = renderReport(buildSequenceReport("005050"));
  assert.match(special, /chưa có chủ đề nào được phân loại/);
  assert.doesNotMatch(special, /Mạch đọc theo thứ tự/);
});

test("phone checks render only for the phone kind and are labelled as supplementary", () => {
  const report = buildSequenceReport("0961742138");
  const phone = renderReport(report, "phone");
  assert.match(phone, /id="report-phone-title"/);
  assert.match(phone, /Hai hung tinh đứng cạnh nhau/);
  assert.match(phone, /Ghi chép bổ sung|GHI CHÉP BỔ SUNG/);
  assert.doesNotMatch(renderReport(report, "other"), /report-phone-title/);
  assert.doesNotMatch(renderReport(report), /report-phone-title/);
});

test("field cards keep supplementary notes apart and 0/5 notes cite their slide", () => {
  const html = renderReport(buildSequenceReport("14010"));
  assert.match(html, /class="supplement-note"/);
  assert.ok(html.includes("Ghi chép bổ sung (ngoài slide)"));
  assert.ok(html.includes("Cặp 14/41"));
  assert.equal((html.match(/Sinh Khí đi cùng 0/g) || []).length, 2);
  assert.match(html, /cuối dãy/);
  assert.ok(html.includes("/thu-vien?slide=26"));
});

test("group-with-0 details and slide 37–38 questions follow the sequence", () => {
  // 61 Lục Sát → 18 Ngũ Quỷ → 81 Ngũ Quỷ, then 0 right after 81.
  const html = renderReport(buildSequenceReport("61810"));
  assert.ok(html.includes("Ngũ Quỷ + 0 · Slide 32"));
  assert.ok(html.includes("Slide còn 4 ý"));
  assert.ok(html.includes("Câu hỏi riêng theo dãy · Slide 38"));
  assert.ok(html.includes("Lục Sát + Ngũ Quỷ"));
  assert.ok(html.includes("Ngũ Quỷ + Ngũ Quỷ"));
  assert.ok(html.includes("Có dễ bị phụ thuộc cảm xúc vào đối phương không?"));
  assert.ok(html.includes("Riêng Ngũ Quỷ đi cùng 0"));
  assert.ok(html.includes('href="#report-questions-title"'));
  // The hidden-count notes name the topics; the excluded questions must not appear.
  for (const hidden of [
    "trầm cảm",
    "Có từng nghi ngờ người thứ ba",
    "Có từng yêu người đã có gia đình",
    "tứ phủ",
    "huyết áp",
  ])
    assert.ok(!html.includes(hidden), hidden);

  const plain = renderReport(buildSequenceReport("143168"));
  assert.ok(plain.includes("Bộ câu hỏi chung · Slide 37"));
  assert.ok(!plain.includes("Câu hỏi riêng theo dãy"));
  assert.ok(!plain.includes("Riêng Ngũ Quỷ đi cùng 0"));
  assert.ok(plain.includes("dãy này không có cặp như vậy"));
});

test("the report opens with its plan and closes with the verification result", () => {
  const html = renderReport(buildSequenceReport("143168"));
  const plan = html.indexOf('id="report-plan-title"');
  const summary = html.indexOf('id="report-summary-title"');
  const verify = html.indexOf('id="report-verify-title"');
  assert.ok(plan > 0 && plan < summary && summary < verify);
  assert.ok(html.includes("Dãy khác · 6 chữ số · 5 cặp chồng lấn"));
  assert.ok(html.includes(">6/6 kiểm tra đạt</h3>"));
  assert.ok(html.includes("Chưa kiểm chứng được"));
  assert.ok(html.includes('href="#report-verify-title"'));
  assert.ok(!html.includes('class="verify-hidden"'));
});

test("the detailed analysis sits between the plan and the summary", () => {
  const html = renderReport(buildSequenceReport("143168"));
  const plan = html.indexOf('id="report-plan-title"');
  const analysis = html.indexOf('id="report-analysis-title"');
  const summary = html.indexOf('id="report-summary-title"');
  assert.ok(plan < analysis && analysis < summary);
  for (const step of [1, 2, 3, 4, 5])
    assert.ok(html.includes(`Bước ${step} · `), `Bước ${step}`);
  const table = html.slice(html.indexOf('class="analysis-table"'));
  assert.equal(
    (table.slice(0, table.indexOf("</table>")).match(/<tr>/g) || []).length,
    6, // header + 5 pairs
  );
  assert.ok(html.includes("Dãy không có số 0 hoặc số 5, bỏ qua bước này."));
  assert.ok(html.includes('href="#report-analysis-title"'));

  const phone = renderReport(buildSequenceReport("0961742038"), "phone");
  assert.ok(phone.includes("số 0 đầu của nhà mạng"));
  assert.ok(phone.includes("Đứng sau cặp 42 (Ngũ Quỷ) · dạng XY0, slide 26"));
  assert.ok(phone.includes("Quy tắc số điện thoại: 5 dấu hiệu cần xem lại"));
});

test("a failing section is hidden with its reason; a core failure hides the report", () => {
  const report = buildSequenceReport("14010");
  const html = renderReport({
    ...report,
    specialNotes: report.specialNotes.map((note) => ({ ...note, source: 99 })),
  });
  assert.ok(html.includes('class="verify-hidden"'));
  assert.ok(html.includes("Giữ nguyên số 0 và số 5"));
  assert.ok(html.includes("chưa hiệu đính: 99"));
  assert.ok(!html.includes('id="report-special-title"'));
  assert.ok(html.includes('id="report-summary-title"'));

  const broken = renderReport({
    ...report,
    pairs: report.pairs.map((pair, index) =>
      index === 0 ? { ...pair, pair: "99" } : pair,
    ),
  });
  assert.ok(broken.includes("Không hiển thị bản luận"));
  assert.ok(!broken.includes('id="report-summary-title"'));
  assert.ok(!broken.includes('id="report-themes-title"'));
  assert.ok(broken.includes('id="report-verify-title"'));
  assert.ok(!broken.includes("Xuất báo cáo PDF"));
});

test("the report offers a PDF export; the print copy only mounts in the browser", () => {
  const html = renderReport(buildSequenceReport("143168"));
  assert.ok(html.includes("Xuất báo cáo PDF"));
  // Server rendering has no document.body, so the portal is absent here.
  assert.ok(!html.includes('class="print-root"'));
});

test("the printable report has a masked cover, numbered sections and both charts", async () => {
  const { buildExportData } = await import("../src/lib/report-export.ts");
  const digits = "0961742038";
  const data = buildExportData(
    buildSequenceReport(digits),
    "phone",
    new Date(2026, 9, 25, 9, 5),
  );
  const html = renderPrintable(data);
  assert.ok(html.includes("••••••••38"));
  assert.ok(html.includes("25/10/2026 09:05"));
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
    assert.ok(html.includes(title), title);
  assert.ok(html.includes("<span>01</span> <!-- -->Kế hoạch luận") || html.includes("<span>01</span> Kế hoạch luận"));
  // One shared hatch pattern; 9 distribution rows; one strip cell per pair.
  assert.equal((html.match(/id="pr-hatch"/g) || []).length, 1);
  assert.ok(html.includes('aria-label="Số cặp theo nhóm"'));
  const strip = html.slice(html.indexOf('aria-label="Bản đồ vị trí'));
  assert.equal(
    (strip.slice(0, strip.indexOf("</svg>")).match(/<rect /g) || []).length,
    digits.length - 1,
  );
  for (let i = 0; i + 4 <= digits.length; i++)
    assert.ok(!html.includes(digits.slice(i, i + 4)), digits.slice(i, i + 4));
});

test("web and print copies name a group that only appears split by 0/5", async () => {
  const { buildExportData } = await import("../src/lib/report-export.ts");
  const report = buildSequenceReport("109");
  const text = (html) => html.replace(/<!-- -->/g, "");
  const web = text(renderReport(report, "other"));
  assert.ok(web.includes("Diên Niên + 0 · Slide 31"));
  assert.ok(web.includes("Chen giữa cặp 19 (Diên Niên) · dạng X0Y"));
  const print = text(
    renderPrintable(
      buildExportData(report, "other", new Date(2026, 9, 25, 9, 5)),
    ),
  );
  assert.ok(print.includes("Diên Niên + 0"));
  assert.ok(print.includes("Chen giữa một cặp Diên Niên · dạng X0Y"));
  assert.ok(!print.includes("một cặp  ·"));
});

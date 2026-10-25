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
      export function renderReport(report, numberKind) {
        return renderToStaticMarkup(createElement(StaticRouter, { location: '/tra-cuu' },
          createElement(SequenceReport, { report, numberKind, children: null })));
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
const { renderReport } = await import(pathToFileURL(output).href);

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
});

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

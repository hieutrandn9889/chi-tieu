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
      export function renderReport(report) {
        return renderToStaticMarkup(createElement(StaticRouter, { location: '/tra-cuu' },
          createElement(SequenceReport, { report, children: null })));
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

test("the real report renders every automatic combination, not just the overview preview", () => {
  const html = renderReport(buildSequenceReport("143168"));
  assert.match(html, /id="report-order-title"/);
  assert.match(html, /href="#report-order-title"/);
  assert.equal(
    (html.match(/class="combination-interpretation"/g) || []).length,
    4,
  );
  for (const source of [123, 90, 58, 65])
    assert.ok(html.includes(`/thu-vien?slide=${source}`));
  assert.match(html, /Câu hỏi đối chiếu và cách thực hành/);
});

test("the rendered report keeps missing and special combinations unresolved", () => {
  const missing = renderReport(buildSequenceReport("1113"));
  assert.equal((missing.match(/class="report-missing"/g) || []).length, 2);
  assert.doesNotMatch(missing, /thu-vien\?slide=55/);
  const special = renderReport(buildSequenceReport("005050"));
  assert.match(special, /class="report-empty"/);
  assert.doesNotMatch(special, /class="combination-interpretation"/);
});

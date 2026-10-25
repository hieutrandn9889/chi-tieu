import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { revealResults } from "../src/lib/reveal-results.ts";

// Records what happens to the input and the results, in order.
function elements() {
  const calls = [];
  const input = { blur: () => calls.push(["blur"]) };
  const target = {
    scrollIntoView: (options) => calls.push(["scroll", options]),
    focus: (options) => calls.push(["focus", options]),
  };
  return { calls, input, target };
}

test("a finished lookup closes the keyboard, scrolls to the results and focuses them", () => {
  const { calls, input, target } = elements();
  revealResults(target, input);
  assert.deepEqual(calls, [
    ["blur"],
    ["scroll", { block: "start" }],
    ["focus", { preventScroll: true }],
  ]);
});

test("results handed over from the home page are revealed without an input", () => {
  const { calls, target } = elements();
  revealResults(target, null);
  assert.deepEqual(
    calls.map(([name]) => name),
    ["scroll", "focus"],
  );
});

// revealResults leaves the scroll style to CSS, so the CSS must provide it.
test("the page scrolls smoothly, jumps under reduced motion and clears the sticky header", () => {
  const css = readFileSync(
    new URL("../src/index.css", import.meta.url),
    "utf8",
  );
  assert.match(css, /html\s*\{\s*scroll-behavior:\s*smooth;/);
  assert.match(
    css,
    /@media \(prefers-reduced-motion: reduce\)\s*\{[^}]*scroll-behavior:\s*auto !important;/,
  );
  assert.match(css, /\.lookup-results\s*\{[^}]*scroll-margin-top:\s*110px;/);
  assert.match(css, /\.lookup-results\s*\{\s*scroll-margin-top:\s*90px;/);
});

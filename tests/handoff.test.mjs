import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import {
  handOffSequence,
  hasHandedOffSequence,
  takeHandedOffSequence,
} from "../src/lib/sequence-handoff.ts";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (file) => readFileSync(path.join(root, file), "utf8");

test("a sequence handed from the home page is taken once, then forgotten", () => {
  assert.equal(takeHandedOffSequence(), null);
  handOffSequence("143168");
  assert.equal(takeHandedOffSequence(), "143168");
  assert.equal(takeHandedOffSequence(), null);
});

test("the hand-off keeps the number out of the URL, history and storage", () => {
  const module = read("src/lib/sequence-handoff.ts");
  const lookup = read("src/components/SequenceLookup.tsx");
  for (const source of [module, lookup])
    assert.doesNotMatch(
      source,
      /localStorage|sessionStorage|indexedDB|history\.|location\.|searchParams|document\.cookie/,
    );
  // The detailed-report link is a plain path; the sequence only goes through memory.
  assert.match(lookup, /to="\/tra-cuu"\s+onClick=\{\(\) => handOffSequence\(input\)\}/);
  assert.doesNotMatch(lookup, /to=\{`\/tra-cuu[^`]*\$\{/);
});

test("the report page can see a handed-off sequence without taking it", () => {
  assert.equal(hasHandedOffSequence(), false);
  handOffSequence("143168");
  assert.equal(hasHandedOffSequence(), true);
  assert.equal(hasHandedOffSequence(), true);
  assert.equal(takeHandedOffSequence(), "143168");
  assert.equal(hasHandedOffSequence(), false);
});

test("the reading intake keeps every number out of the URL, history and storage", () => {
  for (const file of [
    "src/lib/intake.ts",
    "src/components/ReadingIntake.tsx",
    "src/pages/Lookup.tsx",
  ])
    assert.doesNotMatch(
      read(file),
      /localStorage|sessionStorage|indexedDB|history\.|location\.|searchParams|document\.cookie|fetch\(/,
      file,
    );
});

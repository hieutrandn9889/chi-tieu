import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { buildSequenceReport, fields } from "../src/lib/nls.ts";
import {
  PROOFREAD_SLIDES,
  UNREVIEWED_SLIDE_COUNT,
  buildReportPlan,
  verifyReport,
} from "../src/lib/report-verification.ts";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const conversion = JSON.parse(
  readFileSync(path.join(root, "docs/nls/conversion-report.json"), "utf8"),
);

// Small deterministic generator so the sampled sequences are reproducible.
function* sequences(count, length, seed) {
  let state = seed;
  for (let i = 0; i < count; i++) {
    let digits = "";
    for (let j = 0; j < length; j++) {
      state = (state * 1103515245 + 12345) % 2147483648;
      digits += String(state % 10);
    }
    yield digits;
  }
}

test("the proofread list used for verification matches the conversion report", () => {
  assert.deepEqual(PROOFREAD_SLIDES, conversion.reviewedSlides);
  assert.equal(UNREVIEWED_SLIDE_COUNT, conversion.unreviewedOcrSlideCount);
});

test("every report passes verification for all 3-digit and sampled long sequences", () => {
  const inputs = [
    ...Array.from({ length: 1000 }, (_, n) => String(n).padStart(3, "0")),
    ...sequences(300, 12, 7),
    ...sequences(200, 32, 11),
  ];
  for (const digits of inputs)
    for (const kind of ["other", "phone"]) {
      const result = verifyReport(buildSequenceReport(digits), kind);
      const failed = result.checks.filter((check) => !check.ok);
      assert.deepEqual(failed, [], `${digits} (${kind})`);
    }
});

test("a broken classification or position stops the whole report", () => {
  const report = buildSequenceReport("143168");
  const wrongField = fields.find((field) => field.short === "NQ");
  const broken = {
    ...report,
    pairs: report.pairs.map((pair, index) =>
      index === 1 ? { ...pair, field: wrongField } : pair,
    ),
  };
  const result = verifyReport(broken);
  assert.equal(result.coreFailed, true);
  assert.match(
    result.checks.find((check) => check.id === "classification").detail,
    /43/,
  );
});

test("a section that fails its own check is marked for hiding, the rest stay", () => {
  const report = buildSequenceReport("14010");
  const misplaced = verifyReport({
    ...report,
    specialNotes: report.specialNotes.map((note, index) =>
      index === 0 ? { ...note, group: "TM" } : note,
    ),
  });
  assert.equal(misplaced.coreFailed, false);
  assert.deepEqual([...misplaced.failed], ["special"]);

  const unproofread = verifyReport({
    ...report,
    specialNotes: report.specialNotes.map((note) => ({ ...note, source: 99 })),
  });
  assert.deepEqual([...unproofread.failed], ["special"]);
  assert.match(
    unproofread.checks.find((check) => check.id === "special").detail,
    /chưa hiệu đính: 99/,
  );

  const excluded = verifyReport({
    ...report,
    groups: report.groups.map((group) => ({
      ...group,
      reading: { ...group.reading, potential: "Dễ ngoại tình." },
    })),
  });
  assert.ok(excluded.failed.has("themes"));
  assert.ok(excluded.failed.has("summary") === false);
});

test("the plan names the input, the rule sets and what is not applied", () => {
  const plain = buildReportPlan(buildSequenceReport("143168"), "other");
  assert.equal(plain.input, "Dãy khác · 6 chữ số · 5 cặp chồng lấn");
  assert.match(plain.steps[1].label, /dãy không có/);
  assert.equal(plain.steps[2].source, "Slide 6, 10, 13, 15");
  assert.ok(plain.notApplied.some((item) => item.startsWith("Lưu niên")));

  const phone = buildReportPlan(buildSequenceReport("0961742038"), "phone");
  assert.match(phone.steps[1].label, /Đọc số 0\/5/);
  assert.match(phone.steps[4].label, /số điện thoại/);
  assert.ok(
    verifyReport(buildSequenceReport("0961742038"), "phone").unverified.some(
      (item) => item.includes("slide 46"),
    ),
  );
});

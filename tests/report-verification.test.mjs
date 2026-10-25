import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { buildSequenceReport, fields } from "../src/lib/nls.ts";
import {
  PROOFREAD_SLIDES,
  UNREVIEWED_SLIDE_COUNT,
  buildAnalysisTrace,
  buildReportPlan,
  verifyReport,
} from "../src/lib/report-verification.ts";

test("the analysis trace restates every step of the report it describes", () => {
  const trace = buildAnalysisTrace(buildSequenceReport("14010"), "other");
  assert.deepEqual(
    trace.pairs.map((row) => [row.position, row.pair, row.group, row.tone]),
    [
      ["1–2", "14", "Sinh Khí", "Cát"],
      ["2–3", "40", "Chưa phân loại", "—"],
      ["3–4", "01", "Chưa phân loại", "—"],
      ["4–5", "10", "Chưa phân loại", "—"],
    ],
  );
  assert.equal(trace.classified + trace.special, trace.pairs.length);
  assert.deepEqual(
    trace.specialDigits.map((item) => [item.position, item.rules.map((r) => r.rule)]),
    [
      [3, ["Đứng sau cặp 14 (Sinh Khí) · dạng XY0", "Chen giữa cặp 41 (Sinh Khí) · dạng X0Y"]],
      [5, ["Số 0 ở cuối dãy"]],
    ],
  );

  const nq = buildAnalysisTrace(buildSequenceReport("61810"), "other");
  assert.deepEqual(nq.counts, [
    { name: "Ngũ Quỷ", count: 2, share: 50 },
    { name: "Lục Sát", count: 1, share: 25 },
  ]);
  assert.deepEqual(nq.repetitions, ["Ngũ Quỷ lặp 2 cặp liền nhau ở vị trí 2–4"]);
  assert.ok(nq.questions.some((q) => q.startsWith("Lục Sát + Ngũ Quỷ (vị trí 1–3)")));
  assert.ok(nq.questions.includes("Ngũ Quỷ đi cùng 0 → câu hỏi “Sứ mệnh – Áp lực” ở slide 37"));
  assert.ok(nq.supplement.includes("Ghi chú ý nghĩa cặp: 18/81, 16/61"));

  const plain = buildAnalysisTrace(buildSequenceReport("143168"), "other");
  assert.deepEqual(plain.specialDigits, []);
  assert.equal(plain.counts.reduce((sum, item) => sum + item.count, 0), plain.classified);
  // A Phục Vị pair shows as neutral, following slide 8.
  assert.equal(buildAnalysisTrace(buildSequenceReport("411"), "other").pairs[1].tone, "Trung tính");
});

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

test("the analysis trace names a group that only appears split by 0/5", () => {
  const names = new Set(fields.map((field) => field.name));
  for (let n = 0; n < 1000; n++) {
    const digits = String(n).padStart(3, "0");
    const trace = buildAnalysisTrace(buildSequenceReport(digits), "other");
    for (const { rules } of trace.specialDigits)
      for (const { rule } of rules) {
        const named = rule.match(/cặp \d\d \((.*)\) · dạng/);
        if (named) assert.ok(names.has(named[1]), `${digits}: ${rule}`);
        else assert.equal(rule, "Số 0 ở cuối dãy");
      }
  }
  const [five] = buildAnalysisTrace(
    buildSequenceReport("154"),
    "other",
  ).specialDigits;
  assert.deepEqual(
    five.rules.map(({ rule }) => rule),
    ["Chen giữa cặp 14 (Sinh Khí) · dạng X5Y"],
  );
});

import assert from "node:assert/strict";
import test from "node:test";
import {
  MAX_PAST_PHONES,
  buildNeedBlocks,
  combineIntake,
  intakeNeeds,
  readIntake,
  verifyIntake,
} from "../src/lib/intake.ts";
import { generalQuestions } from "../src/lib/nls-slide-notes.ts";
import { EXCLUDED_TERMS } from "../src/lib/report-verification.ts";

// Illustrative numbers only.
const form = (overrides = {}) =>
  [
    { id: "cccd", role: "cccd", value: "001431681414" },
    {
      id: "phone-current",
      role: "phone-current",
      value: "0961742038",
      usage: "3–5 năm",
    },
    { id: "phone-past-1", role: "phone-past", value: "" },
    {
      id: "phone-past-2",
      role: "phone-past",
      value: "0912 143 168",
      usage: "1–3 năm",
    },
    { id: "house", role: "house", value: "143/16" },
  ].map((item) => ({ ...item, ...overrides[item.id] }));

const digitsOf = (entry) =>
  entry.report.pairs[0].pair +
  entry.report.pairs
    .slice(1)
    .map((pair) => pair.pair[1])
    .join("");

test("the intake asks only what slides 3 and 36 can use", () => {
  assert.equal(MAX_PAST_PHONES, 3);
  assert.deepEqual(
    intakeNeeds.map((need) => need.label),
    [
      "Hiểu bản thân",
      "Công việc – Sự nghiệp",
      "Học tập",
      "Quan hệ xã hội",
      "Tình cảm",
      "Tài chính",
    ],
  );
  const { entries, errors } = readIntake(form());
  assert.deepEqual(errors, {});
  assert.deepEqual(
    entries.map(({ label, kind, usage, masked }) => [
      label,
      kind,
      usage,
      masked,
    ]),
    [
      ["CCCD", "cccd", undefined, "••••••••••14"],
      ["Số điện thoại đang dùng", "phone", "3–5 năm", "••••••••38"],
      // An empty slot is skipped but still counted, so labels follow the form.
      ["Số điện thoại đã dùng 2", "phone", "1–3 năm", "••••••••68"],
      ["Số nhà", "house", undefined, "•••••"],
    ],
  );
  assert.ok(entries.every((entry) => entry.verified));
});

test("each invalid number is reported on its own field; an empty form is too", () => {
  const { entries, errors } = readIntake(
    form({
      cccd: { value: "0014316814" },
      "phone-past-1": { value: "12ab" },
    }),
  );
  assert.match(errors.cccd, /CCCD gồm 12 số theo slide 4; dãy đang có 10/);
  assert.match(errors["phone-past-1"], /Chỉ nhập chữ số/);
  assert.equal(entries.length, 3);
  const empty = readIntake(
    form({
      cccd: { value: "" },
      "phone-current": { value: " " },
      "phone-past-2": { value: "" },
      house: { value: "" },
    }),
  );
  assert.deepEqual(empty.entries, []);
  assert.match(empty.errors.form, /Nhập ít nhất một dãy số/);
});

test("the summary counts each group per number, straight from the pairs", () => {
  const { entries } = readIntake(form());
  const summary = combineIntake(entries);
  for (const theme of summary.themes)
    theme.counts.forEach((count, index) =>
      assert.equal(
        count,
        entries[index].report.pairs.filter(
          (pair) => pair.field?.id === theme.field.id,
        ).length,
      ),
    );
  assert.equal(
    summary.headline,
    "Đã luận 4 dãy. Xuất hiện ở nhiều dãy nhất: Lục Sát (4/4 dãy, 6 cặp).",
  );
  assert.deepEqual(
    summary.focus.map(({ field }) => field.short),
    ["LS", "SK", "TY"],
  );
  assert.deepEqual(summary.split, [
    "Số điện thoại đang dùng: Họa Hại (bị số 0 che)",
  ]);
  assert.equal(
    combineIntake(entries.slice(1, 2)).headline,
    "Đã luận 1 dãy (Số điện thoại đang dùng). Xuất hiện nhiều nhất: Lục Sát (3 cặp).",
  );
  const apart = readIntake([
    { id: "a", role: "house", value: "14" },
    { id: "b", role: "house", value: "13" },
  ]);
  assert.match(
    combineIntake(apart.entries).headline,
    /Không có nhóm nào xuất hiện ở từ hai dãy trở lên/,
  );
});

test("needs pick the matching reading parts and slide 37 questions", () => {
  const summary = combineIntake(readIntake(form()).entries);
  const [self] = buildNeedBlocks(summary, []);
  assert.equal(self.id, "self");
  assert.deepEqual(
    self.items[0].parts.map((part) => part.label),
    ["Tiềm năng theo tài liệu", "Khi đi quá đà", "Cách ra quyết định"],
  );
  const [work, finance] = buildNeedBlocks(summary, ["finance", "work"]);
  assert.equal(work.label, "Công việc – Sự nghiệp");
  assert.deepEqual(
    work.items[0].parts.map((part) => part.label),
    ["Công việc và học tập"],
  );
  assert.ok(work.items.every((item) => item.supplement));
  assert.deepEqual(
    work.questions,
    generalQuestions.groups.find(
      (group) => group.topic === "Công việc – Sự nghiệp",
    ).questions,
  );
  assert.equal(work.questionSource, 37);
  assert.deepEqual(finance.items, []);
  assert.match(finance.note, /chưa có nội dung tài chính riêng/);
  assert.ok(finance.questions.length > 0);
});

test("the summary is checked: recount, proofread sources, excluded topics", () => {
  const summary = combineIntake(readIntake(form()).entries);
  const blocks = buildNeedBlocks(
    summary,
    intakeNeeds.map((need) => need.id),
  );
  assert.equal(verifyIntake(summary, blocks).ok, true);

  const miscounted = {
    ...summary,
    themes: summary.themes.map((theme, index) =>
      index === 0
        ? { ...theme, counts: theme.counts.map((count) => count + 1) }
        : theme,
    ),
  };
  assert.match(verifyIntake(miscounted, blocks).detail, /lệch với số cặp/);

  const unproofread = blocks.map((block) => ({
    ...block,
    items: block.items.map((item) => ({ ...item, source: 99 })),
  }));
  assert.match(verifyIntake(summary, unproofread).detail, /chưa hiệu đính: 99/);

  const excluded = [
    { ...blocks[0], questions: ["Có dấu hiệu ngoại tình không?"] },
  ];
  assert.equal(verifyIntake(summary, excluded).ok, false);
});

test("summaries for many numbers stay checked and never show the digits", () => {
  let state = 7;
  const next = (length, prefix = "") => {
    let digits = prefix;
    while (digits.length < length) {
      state = (state * 1103515245 + 12345) % 2147483648;
      digits += String(state % 10);
    }
    return digits;
  };
  for (let run = 0; run < 150; run++) {
    const { entries, errors } = readIntake([
      { id: "cccd", role: "cccd", value: next(12) },
      { id: "phone-current", role: "phone-current", value: next(10, "09") },
      { id: "phone-past-1", role: "phone-past", value: next(10, "03") },
      { id: "house", role: "house", value: next(3) },
    ]);
    assert.deepEqual(errors, {});
    const summary = combineIntake(entries);
    const blocks = buildNeedBlocks(
      summary,
      intakeNeeds.map((need) => need.id),
    );
    assert.equal(verifyIntake(summary, blocks).ok, true, `run ${run}`);
    // Exactly the strings the summary section displays.
    const shown = JSON.stringify([
      summary.headline,
      summary.split,
      summary.entries.map(({ label, masked, usage }) => [label, masked, usage]),
      blocks.map((block) => [
        block.label,
        block.note,
        block.questions,
        block.items.map((item) => [
          item.field.name,
          item.parts.map((part) => [part.label, part.text]),
          item.supplement,
        ]),
      ]),
    ]);
    for (const entry of entries) {
      const digits = digitsOf(entry);
      for (let i = 0; i + 4 <= digits.length; i++)
        assert.ok(!shown.includes(digits.slice(i, i + 4)), `run ${run}`);
    }
    for (const term of EXCLUDED_TERMS) assert.doesNotMatch(shown, term);
  }
});

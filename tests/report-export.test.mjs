import assert from "node:assert/strict";
import test from "node:test";
import { buildSequenceReport, fields } from "../src/lib/nls.ts";
import {
  EXPORT_COLORS,
  buildExportData,
  maskSequence,
} from "../src/lib/report-export.ts";
import { pairNotes } from "../src/lib/nls-supplement.ts";

const at = new Date(2026, 9, 25, 9, 5);
const pairLabels = pairNotes.map((note) => note.pairs.join("/"));

// Reproducible digit strings for the leak check.
function* sequences(count, length, seed, prefix = "") {
  let state = seed;
  for (let i = 0; i < count; i++) {
    let digits = prefix;
    while (digits.length < length) {
      state = (state * 1103515245 + 12345) % 2147483648;
      digits += String(state % 10);
    }
    yield digits;
  }
}

test("the sequence is masked to its last two digits only when four stay hidden", () => {
  assert.equal(maskSequence("001431681414"), "••••••••••14");
  assert.equal(maskSequence("143168"), "••••68");
  assert.equal(maskSequence("14316"), "•••••");
  assert.equal(maskSequence("14"), "••");
});

test("export data never carries four consecutive digits of the sequence", () => {
  const cases = [
    ...[...sequences(200, 12, 3)].map((digits) => [digits, "cccd"]),
    ...[...sequences(200, 10, 5, "09")].map((digits) => [digits, "phone"]),
    ...[...sequences(100, 32, 9)].map((digits) => [digits, "other"]),
  ];
  for (const [digits, kind] of cases) {
    // The creation date and file name carry the year, which a random sequence can
    // contain by chance; they do not come from the sequence, so they are skipped.
    const { generatedAt, fileName, ...rest } = buildExportData(
      buildSequenceReport(digits),
      kind,
      at,
    );
    const text = JSON.stringify(rest);
    for (let i = 0; i + 4 <= digits.length; i++)
      assert.ok(
        !text.includes(digits.slice(i, i + 4)),
        `${kind} ${digits} leaks ${digits.slice(i, i + 4)}`,
      );
    // No pair values either: pair-note labels ("14/41") and windows are not
    // exported. (Counts such as "11/11 cặp" are fine, so labels are matched exactly.)
    assert.doesNotMatch(text, /Cặp \d\d/);
    for (const label of pairLabels) assert.ok(!text.includes(label), label);
  }
});

test("chart data adds up and keeps every group visible", () => {
  const data = buildExportData(buildSequenceReport("001431681414"), "cccd", at);
  assert.deepEqual(
    data.distribution.map((row) => row.short),
    ["SK", "TY", "DN", "PV", "LS", "HH", "TM", "NQ", "0/5"],
  );
  const total = data.pairCount;
  assert.equal(data.distribution.reduce((sum, row) => sum + row.count, 0), total);
  assert.equal(data.toneTotals.reduce((sum, item) => sum + item.count, 0), total);
  assert.equal(data.cells.length, total);
  assert.ok(data.cells.every((cell) => !("pair" in cell)));
  assert.deepEqual(Object.keys(EXPORT_COLORS), ["cat", "hung", "neutral", "special"]);
  assert.equal(data.fileName, "bao-cao-luan-giai-20261025");
});

test("0/5 rules are told by group, and sections failing verification are left out", () => {
  const report = buildSequenceReport("0961742038");
  const data = buildExportData(report, "phone", at);
  assert.deepEqual(
    data.specialDigits.map((item) => [item.position, item.rules]),
    [
      [1, ["Số 0 đầu của nhà mạng, không đọc theo quy tắc"]],
      [
        8,
        [
          "Đứng sau một cặp Ngũ Quỷ · dạng XY0 (slide 26)",
          "Chen giữa một cặp Họa Hại · dạng X0Y (slide 26)",
        ],
      ],
    ],
  );
  assert.equal(data.phone.warnings.length, 5);

  const broken = buildExportData(
    { ...report, specialNotes: report.specialNotes.map((note) => ({ ...note, source: 99 })) },
    "phone",
    at,
  );
  assert.equal(broken.special, null);
  assert.ok(broken.themes);
});

test("a group split by 0/5 is named even when no other pair in the sequence has it", () => {
  const names = new Set(fields.map((field) => field.name));
  for (let n = 0; n < 1000; n++) {
    const digits = String(n).padStart(3, "0");
    const data = buildExportData(buildSequenceReport(digits), "other", at);
    for (const { rules } of data.specialDigits)
      for (const rule of rules) {
        const named = rule.match(/một cặp (.*) · dạng/);
        if (named) assert.ok(names.has(named[1]), `${digits}: ${rule}`);
      }
    for (const group of data.special?.groups ?? [])
      assert.ok(
        names.has(group.name.replace(/ \+ 0$/, "")),
        `${digits}: ${group.name}`,
      );
  }
  // 1-0-9: Diên Niên exists only as the pair around the 0.
  const data = buildExportData(buildSequenceReport("109"), "other", at);
  assert.deepEqual(data.specialDigits[0].rules, [
    "Chen giữa một cặp Diên Niên · dạng X0Y (slide 26)",
  ]);
  assert.deepEqual(
    data.special.groups.map((group) => group.name),
    ["Diên Niên + 0"],
  );
});

import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import {
  combinationReadings,
  fieldReadings,
} from "../src/lib/nls-interpretations.ts";
import {
  fields,
  findField,
  parseSequence,
  buildSequenceReport,
  buildReportSummary,
  combinationSource,
  normalizeSearch,
  normalizeNumber,
  numberKinds,
  explainSpecialDigits,
  describeSplitGroups,
} from "../src/lib/nls.ts";
import {
  checkPhonePattern,
  findPairNote,
  groupNotes,
  pairNotes,
  supplementPairs,
} from "../src/lib/nls-supplement.ts";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const slides = JSON.parse(
  readFileSync(path.join(root, "public/content/nls/slides.json"), "utf8"),
);
const markdown = readFileSync(
  path.join(root, "docs/nls/TINH-HOA-NLS-6868.md"),
  "utf8",
);

test("64 unique pairs cover every combination of the eight ordinary digits", () => {
  assert.equal(fields.length, 8);
  const pairs = fields.flatMap((field) => field.pairs);
  assert.equal(pairs.length, 64);
  assert.equal(new Set(pairs).size, 64);
  for (const a of "12346789")
    for (const b of "12346789") assert.ok(findField(a + b), `Missing ${a + b}`);
  for (let a = 0; a <= 9; a++)
    for (let b = 0; b <= 9; b++) {
      if (/[05]/.test(`${a}${b}`))
        assert.equal(findField(`${a}${b}`), undefined);
    }
});

test("visually checked source anchors keep their expected classification", () => {
  for (const [pair, short, source] of [
    ["14", "SK", 6],
    ["11", "PV", 8],
    ["68", "TY", 10],
    ["19", "DN", 13],
    ["16", "LS", 15],
    ["17", "HH", 17],
    ["12", "TM", 19],
    ["18", "NQ", 21],
  ]) {
    assert.equal(findField(pair)?.short, short);
    assert.equal(findField(pair)?.source, source);
    assert.equal(findField(pair.split("").reverse().join(""))?.short, short);
  }
});

test("sequence parsing keeps overlapping positions and the original order", () => {
  const result = parseSequence("143168");
  assert.deepEqual(
    result.map((row) => [row.pair, row.field?.short, row.index]),
    [
      ["14", "SK", 0],
      ["43", "DN", 1],
      ["31", "TY", 2],
      ["16", "LS", 3],
      ["68", "TY", 4],
    ],
  );
  assert.deepEqual(
    parseSequence("1414").map((row) => row.pair),
    ["14", "41", "14"],
  );
});

test("zeros and fives are retained instead of being silently removed or reclassified", () => {
  const result = parseSequence("00105");
  assert.deepEqual(
    result.map((row) => row.pair),
    ["00", "01", "10", "05"],
  );
  assert.ok(result.every((row) => row.special && !row.field));
  assert.deepEqual(
    result.map((row) => row.specialSource),
    [26, 26, 26, 28],
  );
  assert.equal(parseSequence("55")[0].specialSource, 27);
  assert.equal(parseSequence("14")[0].specialSource, undefined);
  assert.deepEqual(
    parseSequence("+14 (31)-68").map((row) => row.pair),
    parseSequence("143168").map((row) => row.pair),
  );
});

test("invalid or excessive input does not produce a partial result", () => {
  for (const value of ["", " ", "1", "1e3", "abc14", "14/68", "1".repeat(33)])
    assert.throws(() => parseSequence(value));
  assert.equal(parseSequence("1".repeat(32)).length, 31);
});

test("a twelve-digit report preserves leading zeros, counts all pairs and locates repeated themes", () => {
  const report = buildSequenceReport("001431681414"); // Synthetic example, not an identity record.
  assert.equal(report.digitCount, 12);
  assert.equal(report.pairs.length, 11);
  assert.deepEqual(
    report.specialPairs.map((pair) => [pair.pair, pair.index]),
    [
      ["00", 0],
      ["01", 1],
    ],
  );
  assert.equal(report.matchedCount, 9);
  assert.equal(report.groups.length, 5);
  assert.deepEqual(
    report.leadingGroups.map((group) => [group.field.short, group.count]),
    [["SK", 4]],
  );
  assert.deepEqual(
    report.leadingGroups[0].occurrences.map((pair) => pair.index),
    [2, 8, 9, 10],
  );
  assert.equal(report.transitions.length, 8);
  assert.match(report.overview, /4\/11/);
  assert.deepEqual(buildSequenceReport("00 1431-681414"), report);
});

test("a special pair interrupts combinations instead of connecting non-adjacent fields", () => {
  const report = buildSequenceReport("140519");
  assert.equal(report.matchedCount, 2);
  assert.equal(report.specialPairs.length, 3);
  assert.deepEqual(
    report.groups.map((group) => group.field.short),
    ["SK", "DN"],
  );
  assert.deepEqual(report.transitions, []);
  assert.equal(report.leadingGroups.length, 2);
  assert.match(report.overview, /ngang nhau/);
});

test("ordered report windows link to source articles and leave missing reverse articles unresolved", () => {
  const report = buildSequenceReport("1314");
  assert.deepEqual(
    report.transitions.map((row) => [
      row.window,
      row.index,
      row.first.short,
      row.second.short,
      row.source,
    ]),
    [
      ["131", 0, "TY", "TY", 50],
      ["314", 1, "TY", "SK", 52],
    ],
  );
  const missing = buildSequenceReport("1113");
  assert.equal(missing.transitions[1].first.short, "PV");
  assert.equal(missing.transitions[1].second.short, "TY");
  assert.equal(missing.transitions[1].source, undefined);
  assert.equal(combinationSource("TY", "PV"), 55);
});

test("all-special and one-pair reports have no invented leading theme or combination", () => {
  const special = buildSequenceReport("005050");
  assert.equal(special.digitCount, 6);
  assert.equal(special.matchedCount, 0);
  assert.deepEqual(special.groups, []);
  assert.deepEqual(special.leadingGroups, []);
  assert.deepEqual(special.transitions, []);
  assert.match(special.overview, /Chưa có cặp nào/);
  const single = buildSequenceReport("14");
  assert.equal(single.digitCount, 2);
  assert.equal(single.matchedCount, 1);
  assert.deepEqual(single.transitions, []);
  for (const value of ["", "x001431681414", "1".repeat(33)])
    assert.throws(() => buildSequenceReport(value));
});

test("report accounting and positions hold across every three-digit window including 0/5", () => {
  for (let value = 0; value < 1000; value++) {
    const digits = String(value).padStart(3, "0");
    const report = buildSequenceReport(digits);
    assert.equal(report.matchedCount + report.specialPairs.length, 2);
    assert.equal(
      report.groups.reduce((sum, group) => sum + group.count, 0),
      report.matchedCount,
    );
    for (const group of report.groups)
      for (const occurrence of group.occurrences) {
        assert.equal(
          digits.slice(occurrence.index, occurrence.index + 2),
          occurrence.pair,
        );
        assert.ok(group.field.pairs.includes(occurrence.pair));
      }
    assert.equal(report.transitions.length, /[05]/.test(digits) ? 0 : 1);
    for (const transition of report.transitions)
      assert.equal(transition.window, digits);
  }
});

test("ordered combinations point to their actual source, without inferred reverse articles", () => {
  assert.equal(combinationSource("TY", "SK"), 52);
  assert.equal(combinationSource("SK", "TY"), 119);
  assert.equal(combinationSource("PV", "SK"), undefined);
  assert.equal(combinationSource("NQ", "TY"), undefined);
  for (const first of fields)
    for (const second of fields) {
      const source = combinationSource(first.short, second.short);
      if (source)
        assert.equal(
          normalizeSearch(slides[source - 1].title),
          normalizeSearch(`${first.name} + ${second.name}`),
        );
    }
});

test("Vietnamese search supports unaccented words and đ/Đ", () => {
  assert.equal(normalizeSearch("  Diên  Niên "), "dien nien");
  assert.equal(normalizeSearch("ĐẶC ĐIỂM"), "dac diem");
  assert.equal(normalizeSearch("Số 0"), "so 0");
});

test("all eight in-depth profiles and 48 ordered readings retain their actual source anchors", () => {
  assert.equal(Object.keys(fieldReadings).length, 8);
  assert.equal(Object.keys(combinationReadings).length, 48);
  for (const field of fields) {
    const profile = fieldReadings[field.short];
    assert.equal(profile.source, field.source);
    assert.equal(slides[profile.source - 1].quality, "proofread");
    for (const dimension of [
      "potential",
      "pressure",
      "work",
      "relationships",
      "decision",
      "question",
    ])
      assert.ok(profile[dimension]);
    for (const next of fields) {
      const source = combinationSource(field.short, next.short);
      const reading = combinationReadings[`${field.short}>${next.short}`];
      if (!source) {
        assert.equal(reading, undefined);
        continue;
      }
      assert.equal(reading.first, field.short);
      assert.equal(reading.second, next.short);
      assert.equal(reading.source, source);
      assert.ok(slides[source - 1].images.length > 0);
      assert.ok(reading.interpretation && reading.question && reading.practice);
    }
  }
  assert.notEqual(
    combinationReadings["SK>DN"].interpretation,
    combinationReadings["DN>SK"].interpretation,
  );
  assert.equal(combinationReadings["DN>TM"].source, 96);
  assert.equal(slides[95].images.length, 2);
});

test("duplicate combination readings are grouped without losing any ordered occurrence", () => {
  const report = buildSequenceReport("141414");
  assert.equal(report.transitions.length, 4);
  assert.equal(report.orderedCombinations.length, 1);
  assert.equal(report.orderedCombinations[0].reading.source, 121);
  assert.deepEqual(
    report.orderedCombinations[0].occurrences.map((item) => item.index),
    [0, 1, 2, 3],
  );
  assert.deepEqual(
    report.repetitions.map((item) => [
      item.field.short,
      item.count,
      item.start,
      item.end,
    ]),
    [["SK", 5, 1, 6]],
  );
  assert.equal(report.groups[0].count, 5); // No extra weight for repetition.
});

test("whole-sequence chains and repetitions stop at 0/5 boundaries", () => {
  const report = buildSequenceReport("1401414");
  assert.deepEqual(
    report.chains.map((item) => [item.start, item.end, item.fields.length]),
    [
      [1, 2, 1],
      [4, 7, 3],
    ],
  );
  assert.deepEqual(
    report.repetitions.map((item) => [item.count, item.start, item.end]),
    [[3, 4, 7]],
  );
  assert.deepEqual(
    report.transitions.map((item) => item.index),
    [3, 4],
  );
  const allSpecial = buildSequenceReport("005050");
  assert.deepEqual(allSpecial.chains, []);
  assert.deepEqual(allSpecial.repetitions, []);
  assert.deepEqual(allSpecial.orderedCombinations, []);
});

test("readings preserve the actual start/end positions and every transition for long mixed input", () => {
  const report = buildSequenceReport("00143168141410501431316814141414");
  assert.equal(
    report.chains.reduce((sum, chain) => sum + chain.fields.length, 0),
    report.matchedCount,
  );
  assert.equal(
    report.orderedCombinations.reduce(
      (sum, item) => sum + item.occurrences.length,
      0,
    ),
    report.transitions.length,
  );
  assert.deepEqual(
    report.orderedCombinations
      .flatMap((item) => item.occurrences.map((row) => row.index))
      .sort((a, b) => a - b),
    report.transitions.map((item) => item.index),
  );
  for (const chain of report.chains) {
    assert.equal(chain.end - chain.start, chain.fields.length);
    assert.ok(
      report.pairs
        .slice(chain.start - 1, chain.end - 1)
        .every((pair) => pair.field),
    );
  }
  for (const transition of report.transitions) {
    if (transition.reading)
      assert.equal(transition.reading.source, transition.source);
  }
});

test("all 143 slides retain numbering, references, blank pages and native text", () => {
  assert.equal(slides.length, 143);
  assert.deepEqual(
    slides.map((slide) => slide.number),
    Array.from({ length: 143 }, (_, i) => i + 1),
  );
  assert.deepEqual(
    slides
      .filter((slide) => slide.quality === "blank")
      .map((slide) => slide.number),
    [47, 136, 137, 138, 139, 140, 141, 142, 143],
  );
  assert.equal(slides[116].quality, "native");
  assert.match(slides[116].text, /NGŨ QUỶ CHUYỂN HOÁ/);
  assert.equal((markdown.match(/^### Slide \d{3}:/gm) || []).length, 143);
  for (const slide of slides) {
    assert.ok(
      markdown.includes(`id="slide-${String(slide.number).padStart(3, "0")}"`),
    );
    for (const image of slide.images)
      assert.ok(
        existsSync(path.join(root, "public", image)),
        `Missing ${image}`,
      );
    if (slide.thumbnail)
      assert.ok(
        existsSync(path.join(root, "public", slide.thumbnail)),
        `Missing ${slide.thumbnail}`,
      );
    if (slide.quality === "blank") assert.equal(slide.chapter, "blank");
  }
  for (const match of markdown.matchAll(/!\[[^\]]*\]\(([^)]+)\)/g)) {
    assert.ok(
      existsSync(path.resolve(root, "docs/nls", match[1])),
      `Broken Markdown image ${match[1]}`,
    );
  }
});

test("number kinds normalize input without inventing rules or decoding identity data", () => {
  assert.deepEqual(
    numberKinds.map((kind) => kind.id),
    ["cccd", "phone", "house", "plate", "other"],
  );
  for (const kind of numberKinds) {
    assert.ok(kind.sources.length > 0);
    for (const source of kind.sources)
      assert.notEqual(slides[source.slide - 1].quality, "blank");
    for (const example of kind.examples)
      assert.ok(normalizeNumber(kind.id, example).digits.length >= 2);
  }
  assert.equal(slides[3].quality, "proofread");
  assert.match(slides[3].text, /3 số đầu – Mã tỉnh/);

  assert.deepEqual(normalizeNumber("cccd", "001 431 681 414"), {
    digits: "001431681414",
    notes: [],
  });
  for (const value of ["00143168141", "0014316814145", "00143168141A"])
    assert.throws(() => normalizeNumber("cccd", value));

  assert.equal(normalizeNumber("phone", "+84 123 456 789").digits, "0123456789");
  assert.equal(normalizeNumber("phone", "0084123456789").digits, "0123456789");
  assert.deepEqual(normalizeNumber("phone", "0123.456.789").notes, []);
  assert.equal(normalizeNumber("phone", "012345678").notes.length, 1);
  assert.throws(() => normalizeNumber("phone", "0123 abc"));

  const plate = normalizeNumber("plate", "30A-143.68");
  assert.equal(plate.digits, "3014368");
  assert.match(plate.notes[0], /“A”, “-”, “\.”\./);
  assert.equal(normalizeNumber("house", "143/16").digits, "14316");
  assert.deepEqual(normalizeNumber("house", "143 16").notes, []);
  assert.throws(() => normalizeNumber("house", "A1"));
  assert.throws(() => normalizeNumber("plate", "1".repeat(33)));

  assert.equal(normalizeNumber("other", "14-68").digits, "1468");
  assert.throws(() => normalizeNumber("other", "14/68"));
  const report = buildSequenceReport(normalizeNumber("plate", "30A-143.68").digits);
  assert.equal(report.digitCount, 7);
  assert.equal(report.pairs[0].pair, "30");
});

test("the quick summary condenses report data without inventing readings", () => {
  const summary = buildReportSummary(buildSequenceReport("143168"));
  assert.equal(
    summary.headline,
    "Dãy có 6 chữ số, tạo 5 cặp thuộc 4/8 nhóm. Xuất hiện nhiều nhất: Thiên Y (2/5 cặp).",
  );
  assert.deepEqual(
    summary.themes.map(({ field, count }) => [field.short, count]),
    [["TY", 2], ["SK", 1], ["DN", 1], ["LS", 1]],
  );
  assert.deepEqual(summary.flow, [
    { start: 1, end: 6, text: "Sinh Khí → Diên Niên → Thiên Y → Lục Sát → Thiên Y" },
  ]);
  assert.deepEqual(summary.cautions, []);
  assert.deepEqual(
    summary.questions.map(({ field, question }) => [field.short, question]),
    [["TY", fieldReadings.TY.question]],
  );

  const repeated = buildReportSummary(buildSequenceReport("1113"));
  assert.equal(repeated.flow[0].text, "Phục Vị ×2 → Thiên Y");
  assert.deepEqual(repeated.cautions, [
    "Phục Vị lặp 2 cặp liền nhau ở vị trí 1–3.",
  ]);

  const broken = buildReportSummary(buildSequenceReport("14014"));
  assert.equal(broken.flow.length, 2);
  assert.match(broken.cautions.join(" "), /2 cặp chứa 0\/5.*slide 26/);
  assert.match(broken.cautions.join(" "), /ngắt thành 2 đoạn/);

  const special = buildReportSummary(buildSequenceReport("005050"));
  assert.match(special.headline, /chưa có chủ đề nào được phân loại/);
  assert.deepEqual(special.themes, []);
  assert.deepEqual(special.flow, []);
  assert.deepEqual(special.questions, []);
  assert.match(special.cautions[0], /slide 26, 28/);

  const tie = buildReportSummary(buildSequenceReport("143"));
  assert.match(
    tie.headline,
    /Ngang nhau nhiều nhất: Sinh Khí, Diên Niên \(mỗi nhóm 1\/2 cặp\)/,
  );
  assert.equal(tie.questions.length, 2);
});

test("the supplementary workbook's pair table matches the slide table for all eight groups", () => {
  for (const field of fields)
    assert.deepEqual(
      [...supplementPairs[field.short]].sort(),
      [...field.pairs].sort(),
      field.short,
    );
});

test("supplementary notes cover every pair once and every group, without excluded topics", () => {
  const covered = pairNotes.flatMap((note) => note.pairs);
  assert.equal(covered.length, 64);
  assert.equal(new Set(covered).size, 64);
  for (const field of fields) {
    for (const pair of field.pairs)
      assert.ok(findPairNote(pair)?.pairs.every((p) => field.pairs.includes(p)), pair);
    const note = groupNotes[field.short];
    assert.ok(note.personality && note.work && note.study, field.short);
  }
  const text = JSON.stringify([groupNotes, pairNotes]);
  // Owner-approved exclusions: health, death, infidelity, gender limits,
  // spirits, real-person examples and licence-plate rules.
  for (const banned of [
    /ung thư/i, /tự sát/i, /quyên sinh/i, /đột tử/i, /bệnh/i, /tai nạn/i,
    /mổ/i, /thai/i, /vô sinh/i, /ngoại tình/i, /người thứ/i, /sát phu/i,
    // \b does not treat Vietnamese letters as word characters, so use \p{L}.
    /khắc phu/i, /(?<!\p{L})(nữ|nam)(?!\p{L})/iu, /vong/i, /tâm linh/i, /biển số/i,
    /quẻ/i, /\d{5,}/,
  ])
    assert.doesNotMatch(text, banned);
});

test("0/5 notes follow the slide 26–27 examples and leave health unread", () => {
  const groupOf = (digits) =>
    explainSpecialDigits(digits).filter((note) => note.window.length === 3);
  for (const [digits, name] of [
    ["190", "Diên Niên"], ["109", "Diên Niên"], ["708", "Diên Niên"],
    ["160", "Lục Sát"], ["380", "Lục Sát"], ["407", "Lục Sát"],
    ["130", "Thiên Y"], ["608", "Thiên Y"],
    ["607", "Sinh Khí"], ["410", "Sinh Khí"], ["390", "Sinh Khí"],
    ["180", "Ngũ Quỷ"], ["709", "Ngũ Quỷ"], ["240", "Ngũ Quỷ"],
    ["460", "Họa Hại"], ["890", "Họa Hại"], ["710", "Họa Hại"],
  ]) {
    const [note] = groupOf(digits);
    assert.ok(note.text.startsWith(`${name} đi cùng 0`), digits);
    assert.equal(note.source, 26);
  }
  for (const digits of ["730", "960", "210", "804"]) {
    const [note] = groupOf(digits);
    assert.match(note.text, /^Tuyệt Mệnh đi cùng 0/);
    assert.doesNotMatch(note.text, /có bệnh phát sinh/);
  }
  for (const [digits, tone] of [["856", "cát"], ["865", "cát"], ["195", "cát"], ["175", "hung"]]) {
    const [note] = groupOf(digits);
    assert.ok(note.text.includes(`(${tone} tinh) đi cùng 5`), digits);
    assert.equal(note.source, 27);
  }
  assert.equal(groupOf("4115")[0].source, 28);
  assert.match(explainSpecialDigits("1410").at(-1).text, /cuối dãy/);
  assert.deepEqual(explainSpecialDigits("001431681414"), []);
  assert.equal(buildSequenceReport("14010").specialNotes.length, 3);
});

test("phone checks apply only the notes' defined rules and skip the carrier 0", () => {
  const check = (digits) => checkPhonePattern(digits, parseSequence(digits));
  const busy = check("0961742138");
  assert.equal(busy.warnings.length, 5);
  assert.ok(busy.warnings.every((w) => w.startsWith("Hai hung tinh")));
  assert.deepEqual(busy.strengths, [
    "Chuyển từ hung sang cát: Tuyệt Mệnh → Thiên Y (vị trí 7–9).",
  ]);
  const calm = check("0914131");
  assert.deepEqual(calm.warnings, []);
  assert.ok(calm.strengths.some((s) => s.startsWith("Hai cát tinh")));
  assert.match(check("0961742038").warnings.at(-1), /vị trí 8\.$/);
  // Phục Vị is neither cát nor hung (slide 8), so it never triggers a rule.
  assert.deepEqual(check("0611").warnings.length + check("0611").strengths.length, 0);
  assert.equal(check("0911").notAutomated.length, 2);
});

test("groups split by a single 0/5 (X0Y, X5Y) are listed apart, never counted as pairs", () => {
  const label = (report) =>
    report.splitGroups.map(
      ({ field, effect, start, end, source }) =>
        `${field.short} ${effect} ${start}–${end} s${source}`,
    );
  assert.deepEqual(label(buildSequenceReport("154")), ["SK số 5 kích 1–3 s27"]);
  assert.deepEqual(label(buildSequenceReport("109")), [
    "DN bị số 0 che 1–3 s26",
  ]);
  assert.deepEqual(label(buildSequenceReport("101")), [
    "PV bị số 0 che 1–3 s28",
  ]);
  // A 0 after a classified pair (XY0) is already counted; runs of 0/5 such as
  // X00Y or X55Y have no rule in slides 26–28 and are not bridged.
  for (const digits of ["140", "9004", "4551", "1005"])
    assert.deepEqual(label(buildSequenceReport(digits)), [], digits);

  for (let n = 0; n < 1000; n++) {
    const digits = String(n).padStart(3, "0");
    const report = buildSequenceReport(digits);
    const grouped = report.groups.reduce((sum, group) => sum + group.count, 0);
    assert.equal(grouped + report.specialPairs.length, report.pairs.length);
    for (const item of report.splitGroups) {
      const window = digits.slice(item.start - 1, item.end);
      assert.equal(window[1], item.digit, digits);
      assert.equal(findField(window[0] + window[2]).short, item.field.short);
    }
  }
});

test("summary and overview name each split group with its 0 or 5", () => {
  const report = buildSequenceReport("0961742038");
  const summary = buildReportSummary(report);
  assert.match(
    summary.headline,
    /Trong các cặp chứa 0\/5 vẫn đọc được: Họa Hại \(bị số 0 che\)\.$/,
  );
  assert.deepEqual(
    summary.split.map(({ field, start, end }) => [field.name, start, end]),
    [["Họa Hại", 7, 9]],
  );
  assert.match(
    report.overview,
    /còn đọc được Họa Hại \(bị số 0 che\) theo dạng X0Y\/X5Y \(slide 26\); các nhóm này không tính vào số cặp\.$/,
  );
  // The same group twice is counted once with ×2, each place kept in the list.
  const twice = buildSequenceReport("1091091");
  assert.equal(
    describeSplitGroups(twice.splitGroups),
    "Diên Niên (bị số 0 che) ×2",
  );
  assert.equal(twice.splitGroups.length, 2);
  // No split group, no extra sentence.
  const plain = buildSequenceReport("143168");
  assert.doesNotMatch(buildReportSummary(plain).headline, /0\/5/);
  assert.doesNotMatch(plain.overview, /0\/5/);
});

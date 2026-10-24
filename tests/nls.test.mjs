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
  combinationSource,
  normalizeSearch,
} from "../src/lib/nls.ts";

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

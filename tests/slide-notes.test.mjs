import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { explainSpecialDigits, fields } from "../src/lib/nls.ts";
import {
  generalQuestions,
  ngQuyZeroQuestions,
  nqPairQuestions,
  zeroGroupSlides,
} from "../src/lib/nls-slide-notes.ts";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const slides = JSON.parse(
  readFileSync(path.join(root, "public/content/nls/slides.json"), "utf8"),
);
const slideText = (number) => slides[number - 1].text;
// Same exclusions as the supplementary notes, plus the slide-specific terms.
const excluded = [
  /bệnh/i, /thai/i, /sinh con/i, /khuyết tật/i, /quyên sinh/i, /quên sinh/i,
  /trầm cảm/i, /tim mạch/i, /huyết áp/i, /đột quỵ/i, /khối u/i, /sức kh/i,
  /người thứ/i, /ngoại tình/i, /vong/i, /tứ phủ/i, /tâm linh/i, /xuất gia/i,
];

test("slides 29–38 are proofread and each group-with-0 slide matches its group", () => {
  for (const number of [29, 30, 31, 32, 33, 34, 35, 37, 38])
    assert.equal(slides[number - 1].quality, "proofread", `slide ${number}`);
  const names = Object.fromEntries(fields.map((f) => [f.short, f.name.toUpperCase()]));
  for (const [short, slide] of Object.entries(zeroGroupSlides))
    assert.ok(slideText(slide.source).startsWith(`${names[short]} + 0`), short);
});

test("every example on slides 29–35 is read as its own group with 0", () => {
  for (const [short, slide] of Object.entries(zeroGroupSlides)) {
    const listed = slideText(slide.source).match(/Các cặp số: ([\d, ]+)/);
    if (!listed) continue; // slide 30 (Lục Sát) lists no examples
    const examples = listed[1].split(",").map((item) => item.trim()).filter(Boolean);
    assert.ok(examples.length >= 8, short);
    for (const example of examples) {
      const groups = explainSpecialDigits(example)
        .filter((note) => note.digit === "0" && note.group)
        .map((note) => note.group);
      assert.ok(groups.includes(short), `${example} should be ${short} + 0`);
    }
  }
});

test("shown items come from the slide, leave out excluded topics, and count the rest", () => {
  for (const [short, slide] of Object.entries(zeroGroupSlides)) {
    const text = slideText(slide.source);
    const total = text.split("\n").filter((line) => line.includes("**")).length;
    assert.equal(slide.items.length + slide.hidden, total, short);
    for (const item of slide.items) {
      assert.ok(text.includes(`**${item.heading}**`), item.heading);
      if (item.detail)
        assert.ok(text.includes(item.detail.replace(/ …$/, "")), item.detail);
      for (const pattern of excluded)
        assert.doesNotMatch(`${item.heading} ${item.detail ?? ""}`, pattern);
    }
  }
});

test("question sets are verbatim from slides 37–38 and skip excluded topics", () => {
  const general = slideText(37);
  const specific = slideText(38);
  const shown = generalQuestions.groups.flatMap((group) => group.questions);
  for (const question of [...shown, ...ngQuyZeroQuestions.questions])
    assert.ok(general.includes(`- ${question}`), question);
  assert.ok(general.includes(generalQuestions.closing));
  // Slide 37 has 54 questions outside group 8 and the closing question.
  const group8 = general.split("#### 8.")[1].split("####")[0];
  const outside8 =
    (general.match(/^- /gm) || []).length - (group8.match(/^- /gm) || []).length;
  assert.equal(shown.length + generalQuestions.hidden, outside8);
  for (const entry of nqPairQuestions) {
    assert.ok(fields.some((f) => f.short === entry.first), entry.first);
    for (const question of entry.questions)
      assert.ok(specific.includes(`- ${question}`), question);
  }
  for (const question of [
    ...shown,
    ...ngQuyZeroQuestions.questions,
    ...nqPairQuestions.flatMap((entry) => entry.questions),
  ])
    for (const pattern of excluded) assert.doesNotMatch(question, pattern);
});

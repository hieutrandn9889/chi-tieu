// Plan → analysis → verification for one report. The plan says which rule sets
// the report uses; verifyReport re-checks the finished report against the pair
// table, slide sources and exclusions before anything is shown. It can only
// prove the report is faithful to the material, never that it fits a person.

import { buildReportSummary, findField, findNumberKind } from "./nls.ts";
import type { NumberKind, SequenceReportData } from "./nls.ts";
import {
  generalQuestions,
  ngQuyZeroQuestions,
  nqPairQuestions,
  zeroGroupSlides,
} from "./nls-slide-notes.ts";
import {
  checkPhonePattern,
  findPairNote,
  groupNotes,
} from "./nls-supplement.ts";

// Slides proofread against their images; kept equal to
// docs/nls/conversion-report.json by a test.
export const PROOFREAD_SLIDES = [
  1, 2, 4, 5, 6, 8, 10, 13, 15, 17, 19, 21, 25, 26, 27, 28, 29, 30, 31, 32, 33,
  34, 35, 36, 37, 38,
];
export const UNREVIEWED_SLIDE_COUNT = 107;
const proofread = new Set(PROOFREAD_SLIDES);

// Topics the owner excluded. Only text taken from slides or notes is scanned;
// the tool's own disclaimers may name these topics to say they are not read.
export const EXCLUDED_TERMS: RegExp[] = [
  /bệnh/i,
  /thai/i,
  /sinh con/i,
  /khuyết tật/i,
  /quyên sinh/i,
  /quên sinh/i,
  /tự sát/i,
  /trầm cảm/i,
  /tim mạch/i,
  /huyết áp/i,
  /đột quỵ/i,
  /khối u/i,
  /ung thư/i,
  /tai nạn/i,
  /sức kh/i,
  /người thứ ba/i,
  /ngoại tình/i,
  /sát phu/i,
  /khắc phu/i,
  /vong/i,
  /tứ phủ/i,
  /tâm linh/i,
  /xuất gia/i,
];

export type ReportSection =
  "summary" | "special" | "themes" | "questions" | "phone";

export interface ReportCheck {
  id: string;
  label: string;
  ok: boolean;
  detail: string;
  // Undefined for checks on the analysis itself: failing one hides the report.
  section?: ReportSection;
}

const digitsOf = (report: SequenceReportData) =>
  report.pairs[0].pair +
  report.pairs
    .slice(1)
    .map((pair) => pair.pair[1])
    .join("");

// Shared with the report so the questions shown and the ones checked never drift.
export function selectReportExtras(report: SequenceReportData) {
  const zeroGroups = [
    ...new Set(
      report.specialNotes
        .filter((note) => note.digit === "0" && note.group)
        .map((note) => note.group!),
    ),
  ].filter((group) => zeroGroupSlides[group]);
  const nqQuestions = report.orderedCombinations
    .filter((item) => item.second.short === "NQ")
    .flatMap((item) =>
      nqPairQuestions
        .filter((entry) => entry.first === item.first.short)
        .map((entry) => ({ ...entry, combination: item })),
    );
  return { zeroGroups, nqQuestions, ngQuyZero: zeroGroups.includes("NQ") };
}

export function buildReportPlan(
  report: SequenceReportData,
  numberKind: NumberKind,
) {
  const kind = findNumberKind(numberKind);
  const fieldSlides = [
    ...new Set(report.groups.map(({ field }) => field.source)),
  ].sort((a, b) => a - b);
  return {
    input: `${kind.label} · ${report.digitCount} chữ số · ${report.pairs.length} cặp chồng lấn`,
    steps: [
      {
        label: "Tách cặp chồng lấn và xếp nhóm theo bảng 64 cặp",
        source: "Slide 6–24",
      },
      report.specialPairs.length > 0
        ? { label: "Đọc số 0/5 theo vị trí trong dãy", source: "Slide 26–35" }
        : {
            label: "Số 0/5: dãy không có, bỏ qua bước này",
            source: "Slide 26–35",
          },
      report.groups.length > 0
        ? {
            label: "Tóm lược chủ đề các nhóm có trong dãy",
            source: `Slide ${fieldSlides.join(", ")}`,
          }
        : {
            label: "Tóm lược chủ đề: chưa có cặp nào được phân loại",
            source: "Slide 6–24",
          },
      { label: "Câu hỏi khai thác và đối chiếu", source: "Slide 37–38" },
      {
        label:
          numberKind === "phone"
            ? "Ghi chép bổ sung: mô tả nhóm, ý nghĩa cặp, quy tắc nhận biết số điện thoại"
            : "Ghi chép bổ sung: mô tả nhóm, ý nghĩa cặp",
        source: "Ngoài slide",
      },
    ],
    notApplied: [
      "Lưu niên, đại vận theo tuổi",
      "Nội lực, cặp cụm CCCD",
      "Diễn giải thứ tự hai từ trường đứng liền nhau",
      "Dự báo sức khỏe hay sự kiện của một người",
    ],
  };
}

function hit(texts: string[]) {
  for (const text of texts)
    for (const term of EXCLUDED_TERMS) {
      const match = text.match(term);
      if (match) return match[0];
    }
  return null;
}

function sourceCheck(
  id: string,
  section: ReportSection,
  label: string,
  slides: number[],
  texts: string[],
): ReportCheck {
  const used = [...new Set(slides)].sort((a, b) => a - b);
  const missing = used.filter((slide) => !proofread.has(slide));
  const term = hit(texts);
  return {
    id,
    section,
    label,
    ok: missing.length === 0 && !term,
    detail: missing.length
      ? `Trích từ slide chưa hiệu đính: ${missing.join(", ")}.`
      : term
        ? `Có nội dung thuộc nhóm loại trừ (“${term}”).`
        : used.length
          ? `Nguồn slide ${used.join(", ")} đã hiệu đính; không có nội dung bị loại.`
          : "Không có câu trích nào cần đối chiếu nguồn.",
  };
}

export function verifyReport(
  report: SequenceReportData,
  numberKind: NumberKind = "other",
) {
  const checks: ReportCheck[] = [];
  const digits = digitsOf(report);
  const total = report.pairs.length;

  const grouped = report.groups.reduce((sum, group) => sum + group.count, 0);
  checks.push({
    id: "counts",
    label: "Số liệu nhất quán",
    ok:
      total === report.digitCount - 1 &&
      grouped + report.specialPairs.length === total &&
      report.matchedCount === total - report.specialPairs.length,
    detail: `${report.digitCount} chữ số tạo ${total} cặp: ${grouped} cặp đã phân loại + ${report.specialPairs.length} cặp chứa 0/5.`,
  });

  const misread = report.pairs.filter(
    (pair) =>
      pair.field?.short !== findField(pair.pair)?.short ||
      pair.special !== /[05]/.test(pair.pair) ||
      Boolean(pair.field) === pair.special,
  );
  checks.push({
    id: "classification",
    label: "Phân loại tra lại đúng bảng 64 cặp",
    ok: misread.length === 0,
    detail: misread.length
      ? `Cặp không khớp bảng: ${misread.map((pair) => pair.pair).join(", ")}.`
      : `${total}/${total} cặp được tra lại cho cùng kết quả.`,
  });

  const inRange = (start: number, end: number) =>
    start >= 1 && end <= report.digitCount && start <= end;
  const positionsOk =
    report.pairs.every(
      (pair, index) =>
        pair.index === index && pair.pair === digits.slice(index, index + 2),
    ) &&
    report.chains.every((chain) => inRange(chain.start, chain.end)) &&
    report.repetitions.every((run) => inRange(run.start, run.end)) &&
    report.groups.every((group) =>
      group.occurrences.every((pair) => report.pairs[pair.index] === pair),
    );
  checks.push({
    id: "positions",
    label: "Vị trí và thứ tự giữ nguyên",
    ok: positionsOk,
    detail: positionsOk
      ? "Mọi cặp, mạch đọc và đoạn lặp nằm đúng vị trí trong dãy."
      : "Có vị trí nằm ngoài dãy hoặc lệch thứ tự.",
  });

  const summary = buildReportSummary(report);
  const summaryOk =
    summary.themes.reduce((sum, item) => sum + item.count, 0) ===
      report.matchedCount &&
    summary.flow.every((segment) => inRange(segment.start, segment.end));
  const summaryCheck = sourceCheck(
    "summary",
    "summary",
    "Tóm tắt khớp phần chi tiết",
    report.groups.flatMap(({ field, reading }) => [
      field.source,
      reading.source,
    ]),
    [
      summary.headline,
      ...summary.flow.map((segment) => segment.text),
      ...summary.cautions,
      ...summary.questions.map((item) => item.question),
    ],
  );
  checks.push({
    ...summaryCheck,
    ok: summaryOk && summaryCheck.ok,
    detail: summaryOk
      ? summaryCheck.detail
      : "Số liệu tóm tắt lệch với phần chi tiết.",
  });

  if (report.specialPairs.length > 0) {
    const extras = selectReportExtras(report);
    const misplaced = report.specialNotes.filter((note) => {
      if (note.window.length === 1)
        return !(note.start === report.digitCount - 1 && digits.endsWith("0"));
      const window = digits.slice(note.start, note.start + 3);
      const pair =
        window[2] === note.digit
          ? window.slice(0, 2)
          : window[1] === note.digit
            ? window[0] + window[2]
            : "";
      return window !== note.window || findField(pair)?.short !== note.group;
    });
    const sources = sourceCheck(
      "special",
      "special",
      "Giải thích 0/5 đúng quy tắc và nguồn",
      [
        ...report.specialNotes.map((note) => note.source),
        ...extras.zeroGroups.map((group) => zeroGroupSlides[group].source),
      ],
      [
        ...report.specialNotes.map((note) => note.text),
        ...extras.zeroGroups.flatMap((group) =>
          zeroGroupSlides[group].items.map(
            (item) => `${item.heading} ${item.detail ?? ""}`,
          ),
        ),
      ],
    );
    checks.push({
      ...sources,
      ok: misplaced.length === 0 && sources.ok,
      detail: misplaced.length
        ? `Ghi chú 0/5 lệch quy tắc vị trí: ${misplaced.map((note) => note.window).join(", ")}.`
        : `${report.specialNotes.length} ghi chú đúng vị trí XY0/X0Y hoặc 0 cuối dãy. ${sources.detail}`,
    });
  }

  if (report.groups.length > 0)
    checks.push(
      sourceCheck(
        "themes",
        "themes",
        "Luận từng nhóm có nguồn",
        report.groups.flatMap(({ field, reading }) => [
          field.source,
          reading.source,
        ]),
        report.groups.flatMap(({ field, reading, occurrences }) => [
          field.description,
          ...field.keywords,
          reading.potential,
          reading.pressure,
          reading.work,
          reading.relationships,
          reading.decision,
          reading.question,
          ...Object.values(groupNotes[field.short]),
          ...occurrences.map((pair) => findPairNote(pair.pair)?.note ?? ""),
        ]),
      ),
    );

  const extras = selectReportExtras(report);
  checks.push(
    sourceCheck(
      "questions",
      "questions",
      "Câu hỏi đối chiếu trích đúng slide",
      [generalQuestions.source, ...(extras.nqQuestions.length ? [38] : [])],
      // The closing question names “Sức khỏe” only as one choice, so it is not scanned.
      [
        ...extras.nqQuestions.flatMap((entry) => entry.questions),
        ...(extras.ngQuyZero ? ngQuyZeroQuestions.questions : []),
        ...generalQuestions.groups.flatMap((group) => group.questions),
      ],
    ),
  );

  if (numberKind === "phone") {
    const phone = checkPhonePattern(digits, report.pairs);
    const mentioned = [...phone.warnings, ...phone.strengths]
      .flatMap((text) => [...text.matchAll(/(\d+)–(\d+)/g)])
      .map((match) => [Number(match[1]), Number(match[2])]);
    const ok =
      mentioned.every(([start, end]) => inRange(start, end)) &&
      !hit([...phone.warnings, ...phone.strengths]);
    checks.push({
      id: "phone",
      section: "phone",
      label: "Nhận biết số điện thoại đúng vị trí",
      ok,
      detail: ok
        ? "Mọi vị trí nêu trong quy tắc số điện thoại nằm trong dãy."
        : "Có vị trí nằm ngoài dãy hoặc nội dung bị loại.",
    });
  }

  const failed = new Set(
    checks
      .filter((check) => !check.ok && check.section)
      .map((check) => check.section!),
  );
  const coreFailed = checks.some((check) => !check.ok && !check.section);
  const kind = findNumberKind(numberKind);
  const partialSlides = kind.sources
    .map((source) => source.slide)
    .filter((slide) => !proofread.has(slide));
  return {
    checks,
    failed,
    coreFailed,
    unverified: [
      `${UNREVIEWED_SLIDE_COUNT} slide còn bản OCR chưa hiệu đính; báo cáo không trích nội dung từ các slide này.`,
      ...partialSlides.map(
        (slide) =>
          `Ghi chú loại “${kind.label}” trích một câu ở slide ${slide} đã đối chiếu ảnh; toàn văn slide còn OCR.`,
      ),
      "Ghi chép bổ sung là ghi chép học tập ngoài slide, không phải nội dung tài liệu gốc.",
      "Mô tả có đúng với người mang dãy số hay không: công cụ không kiểm chứng được; chỉ người đó tự đối chiếu qua các câu hỏi ở mục 03.",
    ],
  };
}

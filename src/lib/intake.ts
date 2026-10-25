// The reading intake: what slides 3 and 36 ask a coach to collect before a
// reading, limited to what the material can use. Name and birth date/time are
// not asked because no slide gives a rule for them; number plates are left out
// because slide 36 lists them only as something to advise on afterwards.
// Everything stays in memory; nothing here stores or sends a number.

import {
  buildSequenceReport,
  describeSplitGroups,
  fields,
  normalizeNumber,
} from "./nls.ts";
import type { EnergyField, NumberKind, SequenceReportData } from "./nls.ts";
import { fieldReadings } from "./nls-interpretations.ts";
import type { FieldReading } from "./nls-interpretations.ts";
import { generalQuestions } from "./nls-slide-notes.ts";
import { groupNotes, supplementSource } from "./nls-supplement.ts";
import { maskSequence } from "./report-export.ts";
import {
  EXCLUDED_TERMS,
  PROOFREAD_SLIDES,
  verifyReport,
} from "./report-verification.ts";

export type IntakeRole = "cccd" | "phone-current" | "phone-past" | "house";

export const usageSpans = [
  "Dưới 1 năm",
  "1–3 năm",
  "3–5 năm",
  "5–10 năm",
  "Trên 10 năm",
  "Không nhớ rõ",
] as const;
export type UsageSpan = (typeof usageSpans)[number];

// Slide 3 asks for the phone numbers "đã và đang dùng"; three past numbers keep
// the form short while covering the usual case.
export const MAX_PAST_PHONES = 3;

export interface IntakeNumber {
  id: string;
  role: IntakeRole;
  value: string;
  usage?: UsageSpan;
}

const roleKind: Record<IntakeRole, NumberKind> = {
  cccd: "cccd",
  "phone-current": "phone",
  "phone-past": "phone",
  house: "house",
};

type ReadingPart = keyof Omit<FieldReading, "source" | "question">;

const partLabels: Record<ReadingPart, string> = {
  potential: "Tiềm năng theo tài liệu",
  pressure: "Khi đi quá đà",
  work: "Công việc và học tập",
  relationships: "Giao tiếp và quan hệ",
  decision: "Cách ra quyết định",
};

// Needs follow the topics slide 36 reads and slide 37 asks about. Health and
// spirituality are left out, as everywhere else on the site.
export const intakeNeeds = [
  {
    id: "self",
    label: "Hiểu bản thân",
    parts: ["potential", "pressure", "decision"] as ReadingPart[],
    supplement: "personality" as const,
    topic: null,
  },
  {
    id: "work",
    label: "Công việc – Sự nghiệp",
    parts: ["work"] as ReadingPart[],
    supplement: "work" as const,
    topic: "Công việc – Sự nghiệp",
  },
  {
    id: "study",
    label: "Học tập",
    parts: ["work"] as ReadingPart[],
    supplement: "study" as const,
    topic: "Học tập",
  },
  {
    id: "social",
    label: "Quan hệ xã hội",
    parts: ["relationships"] as ReadingPart[],
    supplement: null,
    topic: "Quan vận – Mối quan hệ xã hội",
  },
  {
    id: "love",
    label: "Tình cảm",
    parts: ["relationships"] as ReadingPart[],
    supplement: null,
    topic: "Hôn nhân – Tình cảm",
  },
  {
    id: "finance",
    label: "Tài chính",
    parts: [] as ReadingPart[],
    supplement: null,
    topic: "Tài chính",
  },
];
export type NeedId = (typeof intakeNeeds)[number]["id"];

// Slide 36 collects "Nghề nghiệp – Tình trạng hiện tại" to compare the reading
// with real life; it is shown back, never used to change a reading.
export const occupations = [
  "Đang đi học",
  "Làm công ăn lương",
  "Kinh doanh – tự làm chủ",
  "Làm tự do",
  "Nội trợ – nghỉ hưu",
  "Đang tìm hướng mới",
] as const;
export type Occupation = (typeof occupations)[number];

export interface IntakeEntry {
  id: string;
  role: IntakeRole;
  label: string;
  kind: NumberKind;
  usage?: UsageSpan;
  masked: string;
  notes: string[];
  report: SequenceReportData;
  verified: boolean;
}

function labelFor(role: IntakeRole, pastIndex: number) {
  if (role === "cccd") return "CCCD";
  if (role === "phone-current") return "Số điện thoại đang dùng";
  if (role === "phone-past") return `Số điện thoại đã dùng ${pastIndex}`;
  return "Số nhà";
}

// Reads every filled-in number on its own. Errors are keyed by field id so the
// form can point at the exact input; an empty form gets a form-level error.
export function readIntake(numbers: IntakeNumber[]) {
  const errors: Record<string, string> = {};
  const entries: IntakeEntry[] = [];
  let past = 0;
  for (const item of numbers) {
    if (item.role === "phone-past") past++;
    if (!item.value.trim()) continue;
    const kind = roleKind[item.role];
    try {
      const { digits, notes } = normalizeNumber(kind, item.value);
      const report = buildSequenceReport(digits);
      entries.push({
        id: item.id,
        role: item.role,
        label: labelFor(item.role, past),
        kind,
        usage: item.role.startsWith("phone") ? item.usage : undefined,
        masked: maskSequence(digits),
        notes,
        report,
        verified: !verifyReport(report, kind).coreFailed,
      });
    } catch (err) {
      errors[item.id] =
        err instanceof Error ? err.message : "Vui lòng kiểm tra lại dãy số.";
    }
  }
  if (entries.length === 0 && Object.keys(errors).length === 0)
    errors.form =
      "Nhập ít nhất một dãy số: CCCD, số điện thoại đang dùng, số đã dùng hoặc số nhà.";
  return { entries, errors };
}

export interface IntakeTheme {
  field: EnergyField;
  // Pair count of this group in each usable entry, in entry order.
  counts: number[];
  numbers: number;
  pairs: number;
}

// Counts which groups recur across the numbers. The material has no rule for
// combining several numbers, so this is the tool's own tally and says so.
export function combineIntake(entries: IntakeEntry[]) {
  const usable = entries.filter((entry) => entry.verified);
  const themes: IntakeTheme[] = fields
    .map((field) => {
      const counts = usable.map(
        (entry) =>
          entry.report.groups.find((group) => group.field.id === field.id)
            ?.count ?? 0,
      );
      return {
        field,
        counts,
        numbers: counts.filter((count) => count > 0).length,
        pairs: counts.reduce((sum, count) => sum + count, 0),
      };
    })
    .filter((theme) => theme.numbers > 0)
    .sort((a, b) => b.numbers - a.numbers || b.pairs - a.pairs);
  const shared =
    usable.length > 1 ? themes.filter((theme) => theme.numbers > 1) : [];
  const top = themes.filter(
    (theme) =>
      theme.numbers === themes[0]?.numbers && theme.pairs === themes[0]?.pairs,
  );
  const n = usable.length;
  const headline =
    n === 0
      ? "Chưa có dãy nào qua bước kiểm chứng để tổng hợp."
      : themes.length === 0
        ? `Đã luận ${n} dãy. Mọi cặp đều chứa 0 hoặc 5 nên chưa có nhóm nào được phân loại.`
        : n === 1
          ? `Đã luận 1 dãy (${usable[0].label}). Xuất hiện nhiều nhất: ${top.map(({ field }) => field.name).join(", ")} (${top[0].pairs} cặp).`
          : shared.length === 0
            ? `Đã luận ${n} dãy. Không có nhóm nào xuất hiện ở từ hai dãy trở lên.`
            : `Đã luận ${n} dãy. Xuất hiện ở nhiều dãy nhất: ${top.map(({ field }) => field.name).join(", ")} (${top[0].numbers}/${n} dãy, ${top[0].pairs} cặp).`;
  const split = usable
    .filter((entry) => entry.report.splitGroups.length > 0)
    .map(
      (entry) =>
        `${entry.label}: ${describeSplitGroups(entry.report.splitGroups)}`,
    );
  return {
    entries: usable,
    unverified: entries
      .filter((entry) => !entry.verified)
      .map(({ label }) => label),
    themes,
    shared,
    // The three groups that recur most; the need blocks read these.
    focus: themes.slice(0, 3),
    headline,
    split,
  };
}

export type IntakeSummary = ReturnType<typeof combineIntake>;

// For each chosen need, the matching parts of the focus groups' readings, the
// supplementary note when one exists and the slide 37 questions on that topic.
export function buildNeedBlocks(summary: IntakeSummary, chosen: NeedId[]) {
  const ids = chosen.length > 0 ? chosen : ["self" as NeedId];
  return intakeNeeds
    .filter((need) => ids.includes(need.id))
    .map((need) => ({
      id: need.id,
      label: need.label,
      items: need.parts.length
        ? summary.focus.map(({ field }) => ({
            field,
            parts: need.parts.map((part) => ({
              label: partLabels[part],
              text: fieldReadings[field.short][part],
            })),
            source: fieldReadings[field.short].source,
            supplement: need.supplement
              ? groupNotes[field.short][need.supplement]
              : null,
          }))
        : [],
      note:
        need.id === "finance"
          ? "Phần slide đã hiệu đính chưa có nội dung tài chính riêng cho từng nhóm, nên mục này chỉ có câu hỏi đối chiếu ở slide 37."
          : null,
      questions: [
        ...(need.topic
          ? (generalQuestions.groups.find((group) => group.topic === need.topic)
              ?.questions ?? [])
          : []),
        ...(need.id === "self"
          ? summary.focus.map(
              ({ field }) => fieldReadings[field.short].question,
            )
          : []),
      ],
      questionSource: need.topic ? generalQuestions.source : null,
    }));
}

export type NeedBlock = ReturnType<typeof buildNeedBlocks>[number];

// Recounts the tally straight from each entry's pairs, and checks every text the
// summary shows against the proofread slides and the excluded topics.
export function verifyIntake(summary: IntakeSummary, blocks: NeedBlock[]) {
  const recount = summary.themes.every((theme) =>
    theme.counts.every(
      (count, index) =>
        summary.entries[index].report.pairs.filter(
          (pair) => pair.field?.id === theme.field.id,
        ).length === count,
    ),
  );
  const missing = fields.filter(
    (field) =>
      !summary.themes.some((theme) => theme.field.id === field.id) &&
      summary.entries.some((entry) =>
        entry.report.pairs.some((pair) => pair.field?.id === field.id),
      ),
  );
  const sources = blocks.flatMap((block) => [
    ...block.items.map((item) => item.source),
    ...(block.questionSource ? [block.questionSource] : []),
  ]);
  const unproofread = sources.filter(
    (source) => !PROOFREAD_SLIDES.includes(source),
  );
  const texts = [
    summary.headline,
    ...summary.split,
    ...blocks.flatMap((block) => [
      ...block.items.flatMap((item) => [
        ...item.parts.map((part) => part.text),
        item.supplement ?? "",
      ]),
      ...block.questions,
    ]),
  ];
  const excluded = texts
    .flatMap((text) => EXCLUDED_TERMS.map((term) => text.match(term)?.[0]))
    .find(Boolean);
  const ok =
    recount && missing.length === 0 && unproofread.length === 0 && !excluded;
  return {
    ok,
    detail:
      !recount || missing.length
        ? "Bảng tổng hợp lệch với số cặp của từng dãy."
        : unproofread.length
          ? `Trích từ slide chưa hiệu đính: ${[...new Set(unproofread)].join(", ")}.`
          : excluded
            ? `Có nội dung thuộc nhóm loại trừ (“${excluded}”).`
            : "Bảng tổng hợp đếm lại khớp từng dãy; nội dung trích từ slide đã hiệu đính và ghi chép bổ sung.",
  };
}

export const intakeSupplementLabel = supplementSource.label;

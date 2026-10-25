// Data for the printable (PDF) report. Everything here is free of the
// sequence's digits except the masked sequence itself: pair values, windows and
// pair notes are replaced by group names and positions, so a shared export
// cannot rebuild a CCCD or phone number.

import { buildReportSummary, fieldName, findNumberKind } from "./nls.ts";
import type { NumberKind, SequenceReportData } from "./nls.ts";
import {
  generalQuestions,
  ngQuyZeroQuestions,
  zeroGroupSlides,
} from "./nls-slide-notes.ts";
import {
  checkPhonePattern,
  groupNotes,
  supplementSource,
  supplementTone,
} from "./nls-supplement.ts";
import type { Tone } from "./nls-supplement.ts";
import {
  PROOFREAD_SLIDES,
  buildReportPlan,
  selectReportExtras,
  verifyReport,
} from "./report-verification.ts";

export type ExportTone = Tone | "special";

// Slots 1–3 of the dataviz reference palette plus its muted gray, validated
// all-pairs on the white print surface (CVD ΔE 9.2, normal-vision ΔE 24).
// Aqua is 2.8:1 on white, so every mark also carries a text label.
export const EXPORT_COLORS: Record<ExportTone, string> = {
  cat: "#2a78d6",
  hung: "#eb6834",
  neutral: "#1baf7a",
  special: "#898781",
};

export const EXPORT_TONE_LABELS: Record<ExportTone, string> = {
  cat: "Cát tinh",
  hung: "Hung tinh",
  neutral: "Trung tính (Phục Vị)",
  special: "Chứa 0/5",
};

function luminance(hex: string) {
  const channel = (offset: number) => {
    const value = parseInt(hex.slice(offset, offset + 2), 16) / 255;
    return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(1) + 0.7152 * channel(3) + 0.0722 * channel(5);
}

// A label inside a colored fill takes white or ink, whichever contrasts more.
export function inkOn(fill: string) {
  const l = luminance(fill);
  return 1.05 / (l + 0.05) >= (l + 0.05) / (luminance("#0b0b0b") + 0.05)
    ? "#ffffff"
    : "#0b0b0b";
}

const digitsOf = (report: SequenceReportData) =>
  report.pairs[0].pair +
  report.pairs
    .slice(1)
    .map((pair) => pair.pair[1])
    .join("");

// Shows the last two digits only when at least four stay hidden.
export function maskSequence(digits: string) {
  return digits.length >= 6
    ? "•".repeat(digits.length - 2) + digits.slice(-2)
    : "•".repeat(digits.length);
}

const pad = (value: number) => String(value).padStart(2, "0");
const formatDate = (date: Date) =>
  `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()} ${pad(date.getHours())}:${pad(date.getMinutes())}`;

export function buildExportData(
  report: SequenceReportData,
  numberKind: NumberKind,
  generatedAt: Date,
) {
  const digits = digitsOf(report);
  const kind = findNumberKind(numberKind);
  const plan = buildReportPlan(report, numberKind);
  const verification = verifyReport(report, numberKind);
  const shown = (section: Parameters<typeof verification.failed.has>[0]) =>
    !verification.failed.has(section);
  const summary = buildReportSummary(report);
  const extras = selectReportExtras(report);
  const toneOf = (short?: string): ExportTone =>
    short ? supplementTone[short] : "special";

  const cells = report.pairs.map((pair) => ({
    position: pair.index + 1,
    short: pair.field?.short ?? "0/5",
    name: pair.field?.name ?? "Chứa 0/5",
    tone: toneOf(pair.field?.short),
    source: pair.field ? pair.field.source : pair.specialSource!,
  }));

  const specialDigits = [...digits]
    .map((digit, index) => ({ digit, index }))
    .filter(({ digit }) => digit === "0" || digit === "5")
    .map(({ digit, index }) => {
      const rules = report.specialNotes.flatMap((note) => {
        if (note.window.length === 1)
          return note.start === index ? ["Số 0 ở cuối dãy (slide 26)"] : [];
        if (note.digit !== digit) return [];
        if (note.start + 2 === index && note.window[2] === digit)
          return [
            `Đứng sau một cặp ${fieldName(note.group)} · dạng XY${digit} (slide ${note.source})`,
          ];
        if (note.start + 1 === index && note.window[1] === digit)
          return [
            `Chen giữa một cặp ${fieldName(note.group)} · dạng X${digit}Y (slide ${note.source})`,
          ];
        return [];
      });
      return {
        position: index + 1,
        digit,
        rules:
          rules.length > 0
            ? rules
            : [
                numberKind === "phone" && index === 0
                  ? "Số 0 đầu của nhà mạng, không đọc theo quy tắc"
                  : "Không có quy tắc ở slide 26–28 cho vị trí này",
              ],
      };
    });

  const phone =
    numberKind === "phone" ? checkPhonePattern(digits, report.pairs) : null;

  return {
    title: "Báo cáo luận giải dãy số",
    kind: kind.label,
    masked: maskSequence(digits),
    digitCount: report.digitCount,
    pairCount: report.pairs.length,
    generatedAt: formatDate(generatedAt),
    fileName: `bao-cao-luan-giai-${generatedAt.getFullYear()}${pad(generatedAt.getMonth() + 1)}${pad(generatedAt.getDate())}`,
    proofreadSlides: PROOFREAD_SLIDES.length,
    plan,
    summary: shown("summary")
      ? {
          headline: summary.headline,
          flow: summary.flow,
          split: summary.split.map(({ field, effect, start, end, source }) => ({
            name: field.name,
            effect,
            range: `${start}–${end}`,
            source,
          })),
          cautions: summary.cautions,
          questions: summary.questions.map(({ field, question }) => ({
            name: field.name,
            question,
          })),
        }
      : null,
    // `split` counts groups read inside a 0/5 pair (X0Y, X5Y); they are shown
    // beside the pair counts, never added to them.
    toneTotals: (["cat", "hung", "neutral", "special"] as ExportTone[]).map(
      (tone) => ({
        tone,
        label: EXPORT_TONE_LABELS[tone],
        count: cells.filter((cell) => cell.tone === tone).length,
        split: report.splitGroups.filter(
          ({ field }) => toneOf(field.short) === tone,
        ).length,
      }),
    ),
    // All eight groups appear, so a missing group is visible as zero.
    distribution: [
      ...["SK", "TY", "DN", "PV", "LS", "HH", "TM", "NQ"].map((short) => {
        const group = report.groups.find(({ field }) => field.short === short);
        const name =
          group?.field.name ??
          {
            SK: "Sinh Khí",
            TY: "Thiên Y",
            DN: "Diên Niên",
            PV: "Phục Vị",
            LS: "Lục Sát",
            HH: "Họa Hại",
            TM: "Tuyệt Mệnh",
            NQ: "Ngũ Quỷ",
          }[short]!;
        return {
          short,
          name,
          tone: toneOf(short),
          count: group?.count ?? 0,
          split: report.splitGroups.filter(({ field }) => field.short === short)
            .length,
        };
      }),
      {
        short: "0/5",
        name: "Chứa 0/5",
        tone: "special" as ExportTone,
        count: report.specialPairs.length,
        split: 0,
      },
    ],
    cells,
    chains: report.chains.map((chain) => ({
      range: `${chain.start}–${chain.end}`,
      text: chain.fields.map((field) => field.name).join(" → "),
    })),
    repetitions: report.repetitions.map(
      (run) =>
        `${run.field.name} lặp ${run.count} cặp liền nhau ở vị trí ${run.start}–${run.end}`,
    ),
    specialDigits,
    special:
      report.specialPairs.length > 0 && shown("special")
        ? {
            notes: report.specialNotes.map((note) => ({
              range:
                note.window.length === 1
                  ? `${note.start + 1}`
                  : `${note.start + 1}–${note.start + 3}`,
              text: note.text,
              source: note.source,
            })),
            groups: extras.zeroGroups.map((group) => ({
              name: `${fieldName(group)} + 0`,
              source: zeroGroupSlides[group].source,
              items: zeroGroupSlides[group].items,
              hidden: zeroGroupSlides[group].hidden,
            })),
          }
        : null,
    themes: shown("themes")
      ? report.groups.map(({ field, reading, count, occurrences }) => ({
          name: field.name,
          short: field.short,
          tone: toneOf(field.short),
          count,
          positions: occurrences.map(
            (pair) => `${pair.index + 1}–${pair.index + 2}`,
          ),
          keywords: field.keywords,
          description: field.description,
          dimensions: [
            ["Tiềm năng theo tài liệu", reading.potential],
            ["Khi đi quá đà", reading.pressure],
            ["Công việc và học tập", reading.work],
            ["Giao tiếp và quan hệ", reading.relationships],
            ["Cách ra quyết định", reading.decision],
          ] as [string, string][],
          question: reading.question,
          note: field.note,
          source: field.source,
          supplement: groupNotes[field.short],
        }))
      : null,
    supplementLabel: supplementSource.label,
    phone:
      phone && shown("phone")
        ? {
            warnings: phone.warnings,
            strengths: phone.strengths,
            notAutomated: phone.notAutomated,
          }
        : null,
    questions: shown("questions")
      ? {
          specific: extras.nqQuestions.map((entry) => ({
            title: `${entry.combination.first.name} + Ngũ Quỷ · ${entry.topic}`,
            positions: entry.combination.occurrences
              .map((item) => `${item.index + 1}–${item.index + 3}`)
              .join(", "),
            questions: entry.questions,
          })),
          ngQuyZero: extras.ngQuyZero ? ngQuyZeroQuestions.questions : [],
          closing: generalQuestions.closing,
        }
      : null,
    verification: {
      passed: verification.checks.filter((check) => check.ok).length,
      total: verification.checks.length,
      checks: verification.checks.map(({ label, ok, detail }) => ({
        label,
        ok,
        detail,
      })),
      unverified: verification.unverified,
    },
  };
}

export type ExportData = ReturnType<typeof buildExportData>;

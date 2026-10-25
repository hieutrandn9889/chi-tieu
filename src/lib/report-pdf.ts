// Builds the downloadable PDF (pdfmake document definition) from ExportData,
// the same digit-free data the printable report uses. Text stays real, vector
// text; charts are drawn with tables and canvas shapes, never rasterized.

import { EXPORT_COLORS, EXPORT_TONE_LABELS, inkOn } from "./report-export.ts";
import type { ExportData, ExportTone } from "./report-export.ts";

type Node = Record<string, unknown> | string | Node[];

const INK = "#0b0b0b";
const SECONDARY = "#52514e";
const HAIRLINE = "#e1e0d9";
const BRAND = "#285840";
const PAGE_WIDTH = 515; // A4 width 595pt minus 40pt side margins
const BAR_MAX = 300;

// Roboto (bundled with pdfmake) covers Vietnamese but has no "→".
const t = (text: string) => text.replace(/→/g, "›");

const tone = (value: ExportTone) => EXPORT_COLORS[value];

const hairline = (margin: number[] = [0, 2, 0, 6]) => ({
  canvas: [
    {
      type: "line",
      x1: 0,
      y1: 0,
      x2: PAGE_WIDTH,
      y2: 0,
      lineWidth: 0.6,
      lineColor: HAIRLINE,
    },
  ],
  margin,
});

const boxLayout = (dashed = false) => ({
  hLineWidth: () => 0.6,
  vLineWidth: () => 0.6,
  hLineColor: () => (dashed ? "#c3c2b7" : HAIRLINE),
  vLineColor: () => (dashed ? "#c3c2b7" : HAIRLINE),
  ...(dashed
    ? {
        hLineStyle: () => ({ dash: { length: 2, space: 2 } }),
        vLineStyle: () => ({ dash: { length: 2, space: 2 } }),
      }
    : {}),
  paddingLeft: () => 8,
  paddingRight: () => 8,
  paddingTop: () => 6,
  paddingBottom: () => 6,
});

const card = (stack: Node[], dashed = false) => ({
  table: { widths: ["*"], body: [[{ stack }]] },
  layout: boxLayout(dashed),
  margin: [0, 0, 0, 8],
});

const swatch = (value: ExportTone, size = 8) => ({
  canvas: [
    { type: "rect", x: 0, y: 0, w: size, h: size, r: 1.5, color: tone(value) },
  ],
  width: size + 4,
  margin: [0, 2, 0, 0],
});

const list = (items: string[]) => ({ ul: items.map(t), margin: [0, 0, 0, 6] });

// Square at the baseline, 2pt rounded data end; 0/5 gets diagonal hatching.
function bar(count: number, max: number, value: ExportTone): Node {
  const w = (count / max) * BAR_MAX;
  const h = 10;
  if (w <= 0) return { text: "" };
  const shapes: Record<string, unknown>[] = [
    {
      type: "rect",
      x: 0,
      y: 0,
      w,
      h,
      r: Math.min(2, w / 2),
      color: tone(value),
    },
    { type: "rect", x: 0, y: 0, w: Math.min(4, w), h, color: tone(value) },
  ];
  if (value === "special")
    for (let k = -h; k < w; k += 5) {
      const from = Math.max(k, 0);
      const to = Math.min(k + h, w);
      if (to <= from) continue;
      shapes.push({
        type: "line",
        x1: from,
        y1: h - (from - k),
        x2: to,
        y2: h - (to - k),
        lineWidth: 1,
        lineColor: "#5f5d58",
      });
    }
  return { canvas: shapes, margin: [0, 2, 0, 0] };
}

export function buildPdfDefinition(data: ExportData) {
  let number = 0;
  const section = (title: string): Node[] => {
    number += 1;
    return [
      {
        text: [
          {
            text: `${String(number).padStart(2, "0")}  `,
            color: BRAND,
            bold: true,
            fontSize: 10,
          },
          { text: t(title), fontSize: 14 },
        ],
        margin: [0, 14, 0, 2],
        headlineLevel: 1,
      },
      hairline(),
    ];
  };
  const content: Node[] = [];

  // Cover
  content.push(
    {
      text: "TINH HOA NĂNG LƯỢNG SỐ · THEO TÀI LIỆU NLS 6868",
      color: BRAND,
      bold: true,
      fontSize: 8,
      characterSpacing: 1,
    },
    { text: data.title, fontSize: 22, margin: [0, 6, 0, 12] },
    {
      table: {
        widths: ["*", "*", "*", "*"],
        body: [
          ["LOẠI SỐ", "DÃY SỐ", "QUY MÔ", "NGÀY TẠO"].map((label) => ({
            text: label,
            fontSize: 7,
            color: SECONDARY,
            characterSpacing: 0.6,
          })),
          [
            { text: data.kind, bold: true },
            { text: data.masked, bold: true, characterSpacing: 1 },
            {
              text: `${data.digitCount} chữ số · ${data.pairCount} cặp`,
              bold: true,
            },
            { text: data.generatedAt, bold: true },
          ],
        ],
      },
      layout: "noBorders",
      margin: [0, 0, 0, 10],
    },
    {
      table: {
        widths: ["*"],
        body: [
          [
            {
              text: `Nội dung tóm lược quan điểm huyền học của tài liệu (${data.proofreadSlides} slide đã hiệu đính) để tự đối chiếu, không xác định tính cách hay cuộc đời một người và không dự báo sức khỏe. Dãy số được che, chỉ hiện 2 số cuối; bản xuất không ghi chữ số của từng cặp.`,
              fontSize: 8.5,
              fillColor: "#f0f3e9",
            },
          ],
        ],
      },
      layout: {
        hLineWidth: () => 0,
        vLineWidth: (i: number) => (i === 0 ? 3 : 0),
        vLineColor: () => BRAND,
        paddingLeft: () => 8,
        paddingRight: () => 8,
        paddingTop: () => 6,
        paddingBottom: () => 6,
      },
    },
    {
      canvas: [
        {
          type: "line",
          x1: 0,
          y1: 0,
          x2: PAGE_WIDTH,
          y2: 0,
          lineWidth: 1.5,
          lineColor: BRAND,
        },
      ],
      margin: [0, 12, 0, 0],
    },
  );

  // Plan
  content.push(
    ...section("Kế hoạch luận"),
    { text: data.plan.input, bold: true, margin: [0, 0, 0, 4] },
    {
      ol: data.plan.steps.map((step) => ({
        text: [t(step.label), { text: ` · ${step.source}`, color: SECONDARY }],
      })),
      margin: [0, 0, 0, 4],
    },
    {
      text: `Không áp dụng: ${data.plan.notApplied.join("; ")}.`,
      color: SECONDARY,
    },
  );

  // Summary
  if (data.summary)
    content.push(
      ...section("Tóm tắt"),
      {
        text: t(data.summary.headline),
        fontSize: 11,
        bold: true,
        margin: [0, 0, 0, 4],
      },
      ...data.summary.flow.map((segment) => ({
        text: [
          {
            text: `Vị trí ${segment.start}–${segment.end}: `,
            color: SECONDARY,
          },
          t(segment.text),
        ],
      })),
      ...data.summary.split.map((item) => ({
        text: [
          {
            text: `Trong cặp chứa 0/5, vị trí ${item.range}: `,
            color: SECONDARY,
          },
          `${item.name} · ${item.effect} (slide ${item.source})`,
        ],
      })),
      data.summary.cautions.length ? list(data.summary.cautions) : "",
    );

  // Visual overview
  const max = Math.max(1, ...data.distribution.map((row) => row.count));
  content.push(
    ...section("Hình ảnh tổng quan"),
    {
      table: {
        widths: ["*", "*", "*", "*"],
        body: [
          data.toneTotals.map((item) => ({
            stack: [
              swatch(item.tone),
              {
                text: item.label,
                color: SECONDARY,
                fontSize: 8.5,
                margin: [0, 3, 0, 1],
              },
              {
                text: [
                  { text: String(item.count), fontSize: 16, bold: true },
                  {
                    text: ` / ${data.pairCount} cặp`,
                    fontSize: 8,
                    color: SECONDARY,
                  },
                ],
              },
              item.split > 0
                ? {
                    text: `+${item.split} nhóm trong cặp 0/5`,
                    fontSize: 8,
                    color: SECONDARY,
                  }
                : "",
            ],
          })),
        ],
      },
      layout: boxLayout(),
      margin: [0, 2, 0, 10],
    },
    { text: "Số cặp theo nhóm", bold: true, fontSize: 9, margin: [0, 0, 0, 4] },
    {
      table: {
        widths: [90, BAR_MAX + 4, "*"],
        body: data.distribution.map((row) => [
          { text: row.name, alignment: "right", color: SECONDARY, fontSize: 9 },
          bar(row.count, max, row.tone),
          {
            text: [
              { text: String(row.count), bold: true },
              row.split > 0
                ? { text: `  +${row.split} trong cặp 0/5`, color: SECONDARY }
                : "",
            ],
            fontSize: 9,
          },
        ]),
      },
      layout: {
        hLineWidth: () => 0,
        vLineWidth: (i: number) => (i === 1 ? 0.8 : 0),
        vLineColor: () => "#c3c2b7",
        paddingTop: () => 2,
        paddingBottom: () => 2,
      },
      margin: [0, 0, 0, 10],
    },
    {
      text: "Bản đồ vị trí: mỗi ô là một cặp chồng lấn, theo thứ tự trong dãy",
      bold: true,
      fontSize: 9,
      margin: [0, 0, 0, 4],
    },
    {
      table: {
        widths: data.cells.map(() => "*"),
        body: [
          data.cells.map((cell) => ({
            text: cell.short,
            alignment: "center",
            bold: true,
            fontSize: data.cells.length > 16 ? 6.5 : 9,
            color: inkOn(tone(cell.tone)),
            fillColor: tone(cell.tone),
          })),
          data.cells.map((cell) => ({
            text: String(cell.position),
            alignment: "center",
            fontSize: data.cells.length > 16 ? 6.5 : 8,
            color: SECONDARY,
          })),
        ],
      },
      layout: {
        hLineWidth: () => 0,
        vLineWidth: (i: number, node: { table: { widths: unknown[] } }) =>
          i === 0 || i === node.table.widths.length ? 0 : 2,
        vLineColor: () => "#ffffff",
        paddingLeft: () => 0,
        paddingRight: () => 0,
        paddingTop: (i: number) => (i === 0 ? 6 : 2),
        paddingBottom: (i: number) => (i === 0 ? 6 : 0),
      },
      margin: [0, 0, 0, 6],
    },
    {
      text:
        "Màu theo chú giải ở các ô số liệu phía trên: cát tinh, hung tinh, trung tính hay chứa 0/5; chữ trong ô là nhóm. Phân nhóm cát/hung theo ghi chép bổ sung, Phục Vị theo slide 8. Số liệu đầy đủ ở bảng mục kế tiếp." +
        (data.toneTotals.some((item) => item.split > 0)
          ? " Nhóm đọc được trong cặp bị 0/5 chen giữa (dạng X0Y, X5Y) ghi riêng là “trong cặp 0/5”, không cộng vào số cặp."
          : ""),
      color: SECONDARY,
      fontSize: 8.5,
    },
  );

  // Detailed analysis
  content.push(
    ...section("Phân tích chi tiết"),
    { text: "Bước 1 · Tách cặp và xếp nhóm", bold: true, margin: [0, 0, 0, 4] },
    {
      table: {
        headerRows: 1,
        widths: [50, "*", 110, 60],
        body: [
          ["Vị trí", "Nhóm", "Cát/hung", "Nguồn"].map((label) => ({
            text: label,
            bold: true,
            color: SECONDARY,
          })),
          ...data.cells.map((cell) => [
            `${cell.position}–${cell.position + 1}`,
            cell.name,
            EXPORT_TONE_LABELS[cell.tone],
            `Slide ${cell.source}`,
          ]),
        ],
      },
      layout: {
        hLineWidth: (i: number) => (i === 0 ? 0 : 0.6),
        vLineWidth: () => 0,
        hLineColor: () => HAIRLINE,
        paddingTop: () => 2.5,
        paddingBottom: () => 2.5,
      },
      fontSize: 9,
      margin: [0, 0, 0, 8],
    },
    { text: "Bước 2 · Đọc số 0 và số 5", bold: true, margin: [0, 0, 0, 4] },
    data.specialDigits.length
      ? list(
          data.specialDigits.map(
            (item) =>
              `Vị trí ${item.position} (số ${item.digit}): ${item.rules.join("; ")}.`,
          ),
        )
      : { text: "Dãy không có số 0 hoặc số 5.", margin: [0, 0, 0, 6] },
    { text: "Bước 3 · Mạch đọc", bold: true, margin: [0, 0, 0, 4] },
    list(
      data.chains.length
        ? [
            ...data.chains.map(
              (chain) => `Vị trí ${chain.range}: ${chain.text}`,
            ),
            ...data.repetitions,
          ]
        : ["Chưa có cặp nào được phân loại."],
    ),
  );

  // 0/5 per the slides
  if (data.special)
    content.push(
      ...section("Số 0 và số 5 theo tài liệu"),
      list(
        data.special.notes.map((note) => `Vị trí ${note.range}: ${note.text}`),
      ),
      ...data.special.groups.map((group) =>
        card([
          {
            text: `${group.name} · Slide ${group.source}`,
            bold: true,
            margin: [0, 0, 0, 3],
          },
          {
            ul: group.items.map((item) => ({
              text: [
                { text: item.heading, bold: true },
                item.detail ? `: ${item.detail}` : "",
              ],
            })),
          },
          {
            text: `Slide còn ${group.hidden} ý về sức khỏe, hôn nhân đổ vỡ hoặc tâm linh không đưa vào báo cáo.`,
            color: SECONDARY,
            fontSize: 8.5,
            margin: [0, 3, 0, 0],
          },
        ]),
      ),
    );

  // Themes
  if (data.themes)
    content.push(
      ...section("Luận từng nhóm"),
      ...data.themes.map((theme) =>
        card([
          {
            columns: [
              swatch(theme.tone, 9),
              {
                text: [
                  {
                    text: `${theme.name} · ${theme.count} cặp`,
                    bold: true,
                    fontSize: 11,
                  },
                  {
                    text: `  vị trí ${theme.positions.join(", ")}`,
                    color: SECONDARY,
                  },
                ],
              },
            ],
            margin: [0, 0, 0, 2],
          },
          {
            text: theme.keywords.join(" · "),
            color: SECONDARY,
            margin: [0, 0, 0, 3],
          },
          { text: theme.description, margin: [0, 0, 0, 4] },
          ...theme.dimensions.map(([label, text]) => ({
            text: [{ text: `${label}: `, bold: true }, text],
            margin: [0, 0, 0, 3],
          })),
          {
            text: [
              { text: "Câu hỏi kiểm chứng: ", bold: true },
              theme.question,
            ],
            margin: [0, 2, 0, 4],
          },
          card(
            [
              {
                text: `${data.supplementLabel} (ngoài slide)`,
                bold: true,
                fontSize: 8.5,
              },
              {
                text: `Tính cách: ${theme.supplement.personality}`,
                fontSize: 8.5,
              },
              { text: `Công việc: ${theme.supplement.work}`, fontSize: 8.5 },
              { text: `Học tập: ${theme.supplement.study}`, fontSize: 8.5 },
            ],
            true,
          ),
          {
            text: `${theme.note} Nguồn: slide ${theme.source}.`,
            color: SECONDARY,
            fontSize: 8.5,
          },
        ]),
      ),
    );

  // Phone rules
  if (data.phone)
    content.push(
      ...section("Nhận biết số điện thoại (ghi chép bổ sung)"),
      { text: "Dấu hiệu cần xem lại", bold: true, margin: [0, 0, 0, 3] },
      list(
        data.phone.warnings.length
          ? data.phone.warnings
          : ["Không thấy dấu hiệu nào."],
      ),
      { text: "Dấu hiệu quý cách", bold: true, margin: [0, 0, 0, 3] },
      list(
        data.phone.strengths.length
          ? data.phone.strengths
          : ["Không thấy dấu hiệu nào."],
      ),
    );

  // Questions
  if (data.questions) {
    content.push(...section("Câu hỏi để tự đối chiếu"));
    if (data.summary?.questions.length)
      content.push({
        ul: data.summary.questions.map((item) => ({
          text: [{ text: `${item.name}: `, bold: true }, item.question],
        })),
        margin: [0, 0, 0, 6],
      });
    for (const entry of data.questions.specific)
      content.push(
        card([
          {
            text: [
              { text: entry.title, bold: true },
              {
                text: ` · vị trí ${entry.positions} · slide 38`,
                color: SECONDARY,
              },
            ],
          },
          list(entry.questions),
        ]),
      );
    if (data.questions.ngQuyZero.length)
      content.push(
        card([
          {
            text: [
              { text: "Ngũ Quỷ đi cùng 0: Sứ mệnh – Áp lực", bold: true },
              { text: " · slide 37", color: SECONDARY },
            ],
          },
          list(data.questions.ngQuyZero),
        ]),
      );
    content.push({
      text: [
        { text: "Câu hỏi chốt (slide 37): ", bold: true },
        data.questions.closing,
      ],
    });
  }

  // Verification
  content.push(
    ...section("Kiểm chứng kết quả"),
    {
      text: `${data.verification.passed}/${data.verification.total} kiểm tra đạt`,
      bold: true,
      fontSize: 11,
      margin: [0, 0, 0, 4],
    },
    {
      table: {
        widths: [52, "*"],
        body: data.verification.checks.map((check) => [
          {
            text: check.ok ? "Đạt" : "Không đạt",
            bold: true,
            color: check.ok ? "#006300" : "#b04436",
          },
          {
            text: [
              { text: check.label, bold: true },
              { text: ` ${t(check.detail)}`, color: SECONDARY },
            ],
          },
        ]),
      },
      layout: {
        hLineWidth: () => 0.6,
        vLineWidth: () => 0,
        hLineColor: () => HAIRLINE,
        paddingTop: () => 3,
        paddingBottom: () => 3,
      },
      margin: [0, 0, 0, 8],
    },
    { text: "Chưa kiểm chứng được", bold: true, margin: [0, 0, 0, 3] },
    list(data.verification.unverified),
    {
      text: `Tạo trên trình duyệt lúc ${data.generatedAt}. Dãy số không được gửi lên máy chủ. Tinh Hoa Năng Lượng Số · tinh-hoa-nang-luong-so.hieutrantaskflow.workers.dev`,
      color: SECONDARY,
      fontSize: 7.5,
      margin: [0, 16, 0, 0],
    },
  );

  return {
    pageSize: "A4",
    pageMargins: [40, 44, 40, 52],
    info: {
      title: `${data.title} · ${data.kind}`,
      subject: "Theo tài liệu TINH HOA NLS 6868",
      author: "Tinh Hoa Năng Lượng Số",
      creator: "Tinh Hoa Năng Lượng Số",
    },
    defaultStyle: {
      font: "Roboto",
      fontSize: 9.5,
      lineHeight: 1.25,
      color: INK,
    },
    // Keep a section heading with its first lines instead of stranding it.
    pageBreakBefore: (
      node: { headlineLevel?: number },
      followingNodesOnPage: unknown[],
    ) => node.headlineLevel === 1 && followingNodesOnPage.length < 4,
    footer: (currentPage: number, pageCount: number) => ({
      text: `Trang ${currentPage} / ${pageCount}`,
      alignment: "right",
      fontSize: 8,
      color: "#898781",
      margin: [0, 18, 40, 0],
    }),
    content: content.filter((node) => node !== ""),
  };
}

// Loaded only when the user clicks, so the ~1.9 MB library and font stay out of
// the main bundle. Everything runs in the browser; nothing is uploaded.
export async function downloadReportPdf(data: ExportData) {
  const [{ default: pdfMake }, { default: roboto }] = await Promise.all([
    import("pdfmake/build/pdfmake"),
    import("pdfmake/build/fonts/Roboto"),
  ]);
  pdfMake.addFontContainer(roboto);
  // The document references no URLs; refuse any fetch so nothing can leave.
  pdfMake.setUrlAccessPolicy(() => false);
  await pdfMake
    .createPdf(buildPdfDefinition(data))
    .download(`${data.fileName}.pdf`);
}

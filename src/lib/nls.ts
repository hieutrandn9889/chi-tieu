import { combinationReadings, fieldReadings } from "./nls-interpretations.ts";

export interface EnergyField {
  id: string;
  name: string;
  short: string;
  theme: string;
  pairs: string[];
  keywords: string[];
  description: string;
  reflection: string;
  note: string;
  source: number;
  sourceEnd: number;
}

// Transcribed and visually checked against slides 6, 8, 10, 13, 15, 17, 19, 21.
export const fields: EnergyField[] = [
  {
    id: "sinh-khi",
    name: "Sinh Khí",
    short: "SK",
    theme: "jade",
    pairs: ["14", "41", "67", "76", "39", "93", "28", "82"],
    keywords: ["Quý nhân", "Cơ hội", "Bao dung"],
    description:
      "Tài liệu dùng Sinh Khí để nói về sự cởi mở, tinh thần tích cực và khả năng kết nối với người khác.",
    reflection:
      "Giữ sự rộng lượng cùng những giới hạn rõ ràng. Có mục tiêu để sự an nhiên đi cùng hành động.",
    note: "Đọc cả phần ưu điểm và lưu ý về sự cả tin, an phận trong tài liệu.",
    source: 6,
    sourceEnd: 7,
  },
  {
    id: "thien-y",
    name: "Thiên Y",
    short: "TY",
    theme: "gold",
    pairs: ["13", "31", "68", "86", "49", "94", "27", "72"],
    keywords: ["Tình cảm", "Nhân ái", "Tài lộc"],
    description:
      "Thiên Y gắn với chủ đề “Tiền và Tình” trong tài liệu, nhấn mạnh lòng nhân ái và những mối quan hệ hỗ trợ.",
    reflection:
      "Giúp đỡ người khác có nguyên tắc. Quan tâm đến việc quản lý nguồn lực của bản thân.",
    note: "Slide 10 yêu cầu xét vị trí, kết cấu trước sau và sự phối hợp, thay vì kết luận từ một cặp riêng lẻ.",
    source: 10,
    sourceEnd: 12,
  },
  {
    id: "dien-nien",
    name: "Diên Niên",
    short: "DN",
    theme: "ochre",
    pairs: ["19", "91", "87", "78", "34", "43", "26", "62"],
    keywords: ["Kỷ luật", "Trách nhiệm", "Lãnh đạo"],
    description:
      "Diên Niên được mô tả qua sự chuyên nghiệp, giữ chữ tín, tính kỷ luật và tinh thần tự lực.",
    reflection:
      "Cân bằng trách nhiệm với việc chia sẻ công việc. Rèn sự mềm mại khi trao đổi với người khác.",
    note: "Tài liệu đồng thời nói đến áp lực của việc ôm đồm và kiểm soát quá mức.",
    source: 13,
    sourceEnd: 14,
  },
  {
    id: "phuc-vi",
    name: "Phục Vị",
    short: "PV",
    theme: "violet",
    pairs: ["11", "22", "33", "44", "66", "77", "88", "99"],
    keywords: ["Bền bỉ", "Chiều sâu", "Nhẫn nại"],
    description:
      "Phục Vị là chủ đề của sự kiên trì, nghiên cứu sâu và tích lũy qua thời gian trong tài liệu.",
    reflection:
      "Đặt một mốc hành động cụ thể sau mỗi giai đoạn học hỏi, tránh chỉ suy nghĩ mà chưa bắt đầu.",
    note: "Slide 8 mô tả Phục Vị tùy kết cấu và khuếch đại nhóm đi cùng. Không xếp nhóm này hoàn toàn cát hoặc hung.",
    source: 8,
    sourceEnd: 9,
  },
  {
    id: "luc-sat",
    name: "Lục Sát",
    short: "LS",
    theme: "rose",
    pairs: ["16", "61", "83", "38", "47", "74", "29", "92"],
    keywords: ["Cảm xúc", "Thẩm mỹ", "Giao tế"],
    description:
      "Tài liệu mô tả Lục Sát bằng sự nhạy cảm, gu thẩm mỹ và năng lực tương tác giữa người với người.",
    reflection:
      "Nhận biết cảm xúc trước khi quyết định. Tìm sự cân bằng giữa kết nối và ranh giới cá nhân.",
    note: "Các diễn giải tình cảm trong nguồn là cách nhìn của tài liệu, không phải kết luận về một cá nhân.",
    source: 15,
    sourceEnd: 16,
  },
  {
    id: "hoa-hai",
    name: "Họa Hại",
    short: "HH",
    theme: "terracotta",
    pairs: ["17", "71", "89", "98", "46", "64", "23", "32"],
    keywords: ["Lời nói", "Giao tiếp", "Thẳng thắn"],
    description:
      "Họa Hại đặt trọng tâm vào lời nói: khả năng biểu đạt và những va chạm có thể xuất hiện trong giao tiếp.",
    reflection:
      "Lắng nghe trước khi phản hồi. Để hành động theo kịp lời nói và kiểm tra lại điều mình sắp khẳng định.",
    note: "Slide 17 có một số ô nhắc nhầm Phục Vị. Đọc đối chiếu ảnh và tránh dùng các ô đó làm quy tắc của Họa Hại.",
    source: 17,
    sourceEnd: 18,
  },
  {
    id: "tuyet-menh",
    name: "Tuyệt Mệnh",
    short: "TM",
    theme: "coral",
    pairs: ["12", "21", "69", "96", "37", "73", "48", "84"],
    keywords: ["Bản lĩnh", "Quyết đoán", "Thử thách"],
    description:
      "Theo tài liệu, Tuyệt Mệnh là hình ảnh của ý chí mạnh, hành động quyết liệt và khả năng đứng dậy sau khó khăn.",
    reflection:
      "Dành thời gian đánh giá rủi ro và biết lúc dừng. Không để một quyết định nhất thời thay thế kế hoạch.",
    note: "Tên gọi là thuật ngữ của hệ diễn giải. Công cụ không dùng tên nhóm để dự báo tai nạn hay bệnh tật.",
    source: 19,
    sourceEnd: 20,
  },
  {
    id: "ngu-quy",
    name: "Ngũ Quỷ",
    short: "NQ",
    theme: "indigo",
    pairs: ["18", "81", "79", "97", "36", "63", "24", "42"],
    keywords: ["Nhạy bén", "Sáng tạo", "Tư duy"],
    description:
      "Ngũ Quỷ gắn với học nhanh, tư duy khác biệt và nhiều ý tưởng; tài liệu cũng nhắc đến sự dàn trải.",
    reflection:
      "Chọn một hướng đủ rõ và theo đuổi đủ lâu. Dùng sự tò mò để đi sâu vào một vấn đề.",
    note: "Sơ đồ chuyển hóa có trong slide 117 và 135, nhưng nguồn chưa có đủ bài riêng cho mọi tổ hợp Ngũ Quỷ đứng trước.",
    source: 21,
    sourceEnd: 24,
  },
];

const pairIndex = new Map(
  fields.flatMap((field) => field.pairs.map((pair) => [pair, field] as const)),
);

export function normalizeSearch(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

export function findField(pair: string) {
  return pairIndex.get(pair);
}

export function parseSequence(input: string) {
  if (!/^[\d\s()+.\-]+$/.test(input))
    throw new Error(
      "Chỉ nhập chữ số, khoảng trắng hoặc dấu phân cách thông thường.",
    );
  const digits = input.replace(/[\s()+.\-]/g, "");
  if (digits.length < 2 || digits.length > 32)
    throw new Error("Nhập từ 2 đến 32 chữ số để tra cứu.");
  return Array.from({ length: digits.length - 1 }, (_, index) => {
    const pair = digits.slice(index, index + 2);
    return {
      pair,
      index,
      field: findField(pair),
      special: /[05]/.test(pair),
      specialSource: pair.includes("0")
        ? pair.includes("5")
          ? 28
          : 26
        : pair.includes("5")
          ? 27
          : undefined,
    };
  });
}

export type NumberKind = "cccd" | "phone" | "house" | "plate" | "other";

export interface NumberKindInfo {
  id: NumberKind;
  label: string;
  placeholder: string;
  examples: string[];
  hint: string;
  sources: { slide: number; label: string }[];
}

// Notes only restate what the checked slides say; no kind has its own reading rule yet.
export const numberKinds: NumberKindInfo[] = [
  {
    id: "cccd",
    label: "CCCD",
    placeholder: "12 chữ số, ví dụ: 001431681414",
    examples: ["001431681414"],
    hint: "Slide 4 mô tả CCCD gồm 12 số: 3 số đầu là mã tỉnh, số thứ 4 là giới tính, 2 số tiếp theo là năm sinh, 6 số cuối thay đổi. Công cụ luận cả 12 số theo cặp liền nhau và không giải mã tỉnh, giới tính hay năm sinh từ dãy bạn nhập. Cách viết cặp cụm, cụm 0/5, lưu niên và nội lực chưa có công thức trong phần đã hiệu đính.",
    sources: [
      { slide: 4, label: "Cấu trúc CCCD" },
      { slide: 2, label: "Nội dung học" },
    ],
  },
  {
    id: "phone",
    label: "Số điện thoại",
    placeholder: "Ví dụ: 0123 456 789 hoặc +84 123 456 789",
    examples: ["0123 456 789", "+84 123 456 789"],
    hint: "Slide 46 nêu: trong dãy số điện thoại, không phải cứ có cát tinh là tốt, cứ có hung tinh là xấu; còn tùy vị trí các cặp số và kết cấu năng lượng chuyển hóa. Vì vậy công cụ đọc cả dãy theo thứ tự, không chỉ xét vài số cuối. Đầu số +84 được đổi thành 0.",
    sources: [
      { slide: 46, label: "Lưu ý khi xem SIM" },
      { slide: 36, label: "Quy trình luận số" },
    ],
  },
  {
    id: "house",
    label: "Số nhà",
    placeholder: "Ví dụ: 143/16 hoặc 12A",
    examples: ["143/16", "12A"],
    hint: "Slide 36 nhắc số nhà trong thông tin cần thu thập và tư vấn, nhưng tài liệu chưa có quy tắc riêng cho số nhà. Tài liệu cũng chưa nói cách xử lý chữ cái hay dấu “/”: công cụ chỉ lấy các chữ số theo đúng thứ tự xuất hiện.",
    sources: [{ slide: 36, label: "Quy trình luận số" }],
  },
  {
    id: "plate",
    label: "Biển số",
    placeholder: "Ví dụ: 30A-143.68",
    examples: ["30A-143.68"],
    hint: "Slide 36 nhắc biển số ở bước tư vấn, nhưng tài liệu chưa có quy tắc riêng cho biển số. Chữ cái, dấu gạch và dấu chấm được bỏ qua; công cụ chỉ lấy các chữ số theo đúng thứ tự xuất hiện.",
    sources: [{ slide: 36, label: "Quy trình luận số" }],
  },
  {
    id: "other",
    label: "Dãy khác",
    placeholder: "Ví dụ: 14, 68 hoặc 143168",
    examples: ["143168", "105014"],
    hint: "Nhập 2–32 chữ số. Tài liệu không hướng dẫn tách ngày sinh hoặc giờ sinh thành cặp; nếu nhập các dãy này, kết quả chỉ là phân loại cặp theo bảng.",
    sources: [{ slide: 5, label: "Nguyên tắc khi luận" }],
  },
];

export function findNumberKind(id: NumberKind) {
  return numberKinds.find((kind) => kind.id === id) ?? numberKinds[4];
}

// Returns only the digits to read plus what was changed, so the UI can say so
// without echoing the number itself.
export function normalizeNumber(kind: NumberKind, input: string) {
  const notes: string[] = [];
  const value = input.trim();
  if (kind === "house" || kind === "plate") {
    const removed = [...new Set(value.replace(/[\d\s]/g, "").split(""))]
      .map((char) => `“${char}”`)
      .join(", ");
    const digits = value.replace(/\D/g, "");
    if (digits.length < 2)
      throw new Error("Cần ít nhất 2 chữ số để tạo một cặp số.");
    if (digits.length > 32)
      throw new Error("Nhập từ 2 đến 32 chữ số để tra cứu.");
    if (removed)
      notes.push(
        `Đã bỏ qua ký tự không phải số: ${removed}. Tài liệu chưa có quy tắc cho các ký tự này.`,
      );
    return { digits, notes };
  }
  if (!/^[\d\s()+.\-]+$/.test(value))
    throw new Error(
      "Chỉ nhập chữ số, khoảng trắng hoặc dấu phân cách thông thường.",
    );
  let digits = value.replace(/[\s()+.\-]/g, "");
  if (kind === "phone" && /^(\+|00)84/.test(value.replace(/[\s().\-]/g, ""))) {
    digits = "0" + digits.replace(/^(00)?84/, "");
    notes.push("Đã đổi đầu số +84 thành 0.");
  }
  if (kind === "cccd" && digits.length !== 12)
    throw new Error(
      `CCCD gồm 12 số theo slide 4; dãy đang có ${digits.length} chữ số.`,
    );
  if (kind === "phone" && digits.length !== 10)
    notes.push(
      `Dãy có ${digits.length} chữ số; số di động hiện nay thường có 10 chữ số. Kiểm tra lại nếu nhập thiếu hoặc thừa.`,
    );
  if (digits.length < 2 || digits.length > 32)
    throw new Error("Nhập từ 2 đến 32 chữ số để tra cứu.");
  return { digits, notes };
}

// Each ordered row points only to an actual source section. No inferred reversals.
const combinations: Record<string, Record<string, number>> = {
  TY: { TY: 50, SK: 52, DN: 54, PV: 55, HH: 56, LS: 58, TM: 59, NQ: 61 },
  LS: { SK: 63, TY: 65, DN: 67, PV: 69, HH: 71, LS: 73, TM: 74, NQ: 76 },
  TM: { TY: 79, DN: 81, SK: 82, PV: 83, HH: 84, NQ: 85, TM: 86, LS: 87 },
  DN: { SK: 89, TY: 90, DN: 91, PV: 92, HH: 93, LS: 95, TM: 96, NQ: 97 },
  HH: { TY: 99, SK: 101, DN: 103, PV: 106, HH: 109, LS: 111, TM: 113, NQ: 115 },
  SK: {
    TY: 119,
    SK: 121,
    DN: 123,
    PV: 125,
    HH: 127,
    LS: 129,
    TM: 131,
    NQ: 133,
  },
};

export function combinationSource(first: string, second: string) {
  return combinations[first]?.[second];
}

// A reading describes the source's themes, never facts about an identity holder.
// Keep raw input in component memory; this pure function has no I/O or persistence.
export function buildSequenceReport(input: string) {
  const pairs = parseSequence(input);
  const groups = fields
    .map((field) => {
      const occurrences = pairs.filter((pair) => pair.field?.id === field.id);
      return {
        field,
        reading: fieldReadings[field.short],
        count: occurrences.length,
        occurrences,
      };
    })
    .filter((group) => group.count > 0)
    .sort((a, b) => b.count - a.count);
  const specialPairs = pairs.filter((pair) => pair.special);
  const matchedCount = pairs.length - specialPairs.length;
  const leadingGroups = groups.filter(
    (group) => group.count === groups[0]?.count,
  );
  const transitions = pairs.flatMap((pair, index) => {
    const next = pairs[index + 1];
    // A 0/5 pair interrupts the known sequence; never bridge it or infer a reverse.
    if (!pair.field || !next?.field) return [];
    return [
      {
        index,
        window: pair.pair + next.pair[1],
        first: pair.field,
        second: next.field,
        source: combinationSource(pair.field.short, next.field.short),
        reading: combinationReadings[`${pair.field.short}>${next.field.short}`],
      },
    ];
  });
  const orderedCombinations = [
    ...new Set(
      transitions.map((item) => `${item.first.short}>${item.second.short}`),
    ),
  ].map((key) => {
    const occurrences = transitions.filter(
      (item) => `${item.first.short}>${item.second.short}` === key,
    );
    return { ...occurrences[0], occurrences };
  });
  const chains: { start: number; end: number; fields: EnergyField[] }[] = [];
  const runs: {
    start: number;
    end: number;
    count: number;
    field: EnergyField;
  }[] = [];
  for (const pair of pairs) {
    if (!pair.field) continue;
    const chain = chains.at(-1);
    if (chain?.end === pair.index + 1) {
      chain.end = pair.index + 2;
      chain.fields.push(pair.field);
    } else
      chains.push({
        start: pair.index + 1,
        end: pair.index + 2,
        fields: [pair.field],
      });
    const run = runs.at(-1);
    if (run?.end === pair.index + 1 && run.field.id === pair.field.id) {
      run.end = pair.index + 2;
      run.count++;
    } else
      runs.push({
        start: pair.index + 1,
        end: pair.index + 2,
        count: 1,
        field: pair.field,
      });
  }
  const leadNames = leadingGroups.map((group) => group.field.name).join(", ");
  const overview =
    groups.length === 0
      ? "Mọi cặp trong dãy đều chứa số 0 hoặc 5. Chưa có cặp nào được phân loại bằng bảng 64 cặp cơ bản; cần đọc quy tắc riêng trước khi diễn giải."
      : leadingGroups.length === 1
        ? `${leadNames} xuất hiện nhiều nhất với ${leadingGroups[0].count}/${pairs.length} cặp trong toàn dãy. Phần bên dưới tổng hợp những chủ đề tài liệu gắn với các nhóm đã tìm thấy.`
        : `${leadNames} cùng xuất hiện ${leadingGroups[0].count}/${pairs.length} cặp trong toàn dãy. Các nhóm này ngang nhau về số lần xuất hiện; không chọn một nhóm làm đại diện cho con người.`;
  return {
    digitCount: pairs.length + 1,
    pairs,
    groups,
    leadingGroups,
    matchedCount,
    specialPairs,
    transitions,
    orderedCombinations,
    chains,
    repetitions: runs.filter((run) => run.count > 1),
    overview,
  };
}

export type SequenceReportData = ReturnType<typeof buildSequenceReport>;

// Condenses only what the report already contains: counts, source keywords,
// reading order and caveats. It adds no reading and no verdict about a person.
export function buildReportSummary(report: SequenceReportData) {
  const total = report.pairs.length;
  const lead = report.leadingGroups;
  const headline =
    report.groups.length === 0
      ? `Dãy có ${report.digitCount} chữ số, tạo ${total} cặp. Mọi cặp đều chứa 0 hoặc 5 nên chưa có chủ đề nào được phân loại.`
      : `Dãy có ${report.digitCount} chữ số, tạo ${total} cặp thuộc ${report.groups.length}/8 nhóm. ` +
        (lead.length === 1
          ? `Xuất hiện nhiều nhất: ${lead[0].field.name} (${lead[0].count}/${total} cặp).`
          : `Ngang nhau nhiều nhất: ${lead.map(({ field }) => field.name).join(", ")} (mỗi nhóm ${lead[0].count}/${total} cặp).`);
  const flow = report.chains.map((chain) => {
    const steps: { field: EnergyField; count: number }[] = [];
    for (const field of chain.fields) {
      const last = steps.at(-1);
      if (last?.field.id === field.id) last.count++;
      else steps.push({ field, count: 1 });
    }
    return {
      start: chain.start,
      end: chain.end,
      text: steps
        .map(({ field, count }) =>
          count > 1 ? `${field.name} ×${count}` : field.name,
        )
        .join(" → "),
    };
  });
  const cautions = report.repetitions.map(
    (run) =>
      `${run.field.name} lặp ${run.count} cặp liền nhau ở vị trí ${run.start}–${run.end}.`,
  );
  if (report.specialPairs.length > 0) {
    const sources = [
      ...new Set(report.specialPairs.map((pair) => pair.specialSource)),
    ].sort((a, b) => a! - b!);
    cautions.push(
      `${report.specialPairs.length} cặp chứa 0/5 chưa được phân loại; đọc quy tắc riêng ở slide ${sources.join(", ")} trước khi diễn giải.`,
    );
  }
  if (report.chains.length > 1)
    cautions.push(
      `Mạch đọc bị ngắt thành ${report.chains.length} đoạn bởi cặp 0/5; không nối các đoạn với nhau.`,
    );
  return {
    headline,
    themes: report.groups.map(({ field, count }) => ({ field, count })),
    flow,
    cautions,
    questions: lead
      .slice(0, 2)
      .map(({ field, reading }) => ({ field, question: reading.question })),
  };
}

export interface Lesson {
  id: string;
  title: string;
  subtitle: string;
  range: string;
  source: number;
  paragraphs: string[];
  question: string;
  answer: string;
}

export const lessons: Lesson[] = [
  {
    id: "nhap-mon",
    title: "Bắt đầu với cách hiểu đúng",
    subtitle: "Bối cảnh và nguyên tắc tiếp cận",
    range: "01–05",
    source: 5,
    paragraphs: [
      "Tài liệu dùng Năng lượng số như một hệ diễn giải huyền học. Bắt đầu bằng cách hiểu thuật ngữ và phạm vi của tài liệu trước khi áp dụng bất kỳ bảng số nào.",
      "Slide 5 nêu bốn nguyên tắc: không phán đoán vội, không hù dọa, đặt câu hỏi để hiểu bối cảnh và có hướng hỗ trợ. Thông tin từ một dãy số cần được đặt trong bối cảnh của người đọc.",
    ],
    question: "Cần làm gì trước khi đưa ra một nhận định?",
    answer:
      "Lắng nghe đủ thông tin và hỏi để hiểu bối cảnh. Một cặp số riêng lẻ chưa đủ cho kết luận về con người.",
  },
  {
    id: "bat-tinh",
    title: "Làm quen tám từ trường",
    subtitle: "Tên nhóm, từ khóa và 64 cặp số",
    range: "06–24",
    source: 6,
    paragraphs: [
      "Ghi nhớ tám nhóm: Sinh Khí, Thiên Y, Diên Niên, Phục Vị, Lục Sát, Họa Hại, Tuyệt Mệnh và Ngũ Quỷ. Mỗi nhóm có tám cặp số trong bảng cơ bản.",
      "Dùng từ khóa để phân biệt các nhóm, rồi kiểm tra cặp số trên slide gốc. Riêng Phục Vị, tài liệu nhấn mạnh tính tùy kết cấu và vai trò khuếch đại nhóm đi cùng.",
    ],
    question: "14 và 41 có thuộc cùng nhóm trong bảng cơ bản không?",
    answer:
      "Có. Cả hai thuộc Sinh Khí ở slide 6. Đây là phân loại cặp cơ bản, khác với thứ tự kết hợp giữa hai từ trường.",
  },
  {
    id: "so-dac-biet",
    title: "Hiểu riêng số 0 và số 5",
    subtitle: "Đọc điều kiện trước khi áp dụng",
    range: "25–35",
    source: 26,
    paragraphs: [
      "Số 0 và số 5 có cách diễn giải riêng trong tài liệu. Slide 26 nói về số 0; slide 27 nói về số 5; slide 28 tập hợp một số ví dụ cần đọc theo đúng bối cảnh.",
      "Khi tách dãy số, giữ nguyên chữ số 0 ở đầu và mọi vị trí 0/5. Không tự bỏ những số này để tạo ra một cặp khác. Công cụ đánh dấu các cặp đó để người học quay lại đọc chuyên đề.",
    ],
    question: "Có nên xóa số 0 trong 103 rồi coi ngay như cặp 13 không?",
    answer:
      "Không tự động làm vậy. Giữ nguyên dãy 103, đánh dấu 10 và 03 là trường hợp đặc biệt, rồi xem các ví dụ và điều kiện trong nguồn.",
  },
  {
    id: "quy-trinh",
    title: "Đọc theo bối cảnh",
    subtitle: "Câu hỏi, đối chiếu và giới hạn",
    range: "36–46",
    source: 36,
    paragraphs: [
      "Slide 36 mô tả quy trình gồm thu thập thông tin, xác định nhu cầu, luận số và đồng hành. Slide 37–38 đưa ra các câu hỏi tham khảo. Hãy xem câu hỏi như cách mở cuộc trò chuyện, không dùng nó để áp đặt kết luận.",
      "Những phát biểu về sức khỏe, tài chính và hôn nhân phản ánh quan điểm trong tài liệu. Công cụ học không dùng số điện thoại hoặc CCCD để chẩn đoán, dự báo hay quyết định đầu tư.",
    ],
    question: "Nếu một mô tả không khớp thực tế thì nên làm gì?",
    answer:
      "Ghi nhận sự không khớp, kiểm tra lại nguồn và bối cảnh. Không ép trải nghiệm của người đọc khớp với bảng diễn giải.",
  },
  {
    id: "chuyen-hoa",
    title: "Tìm hiểu cách kết hợp",
    subtitle: "Thứ tự A + B và bài nguồn",
    range: "48–117",
    source: 48,
    paragraphs: [
      "Slide 25 và 48 lập bảng liên kết các từ trường. Tài liệu nói rõ A+B khác B+A. Ví dụ, Thiên Y + Sinh Khí và Sinh Khí + Thiên Y có các bài nguồn ở vị trí khác nhau.",
      "Tra cứu đúng chiều kết hợp rồi đọc bài gốc. Những trường hợp chỉ có sơ đồ hoặc chưa đủ diễn giải không được tự điền ý nghĩa từ trường hợp đảo chiều.",
    ],
    question:
      "Bài Thiên Y + Sinh Khí có thay cho Sinh Khí + Thiên Y được không?",
    answer:
      "Không. Đọc lần lượt slide 52 và 119. Tài liệu nhấn mạnh thứ tự giữa hai từ trường.",
  },
  {
    id: "sinh-khi",
    title: "Ôn tập với chuyên đề Sinh Khí",
    subtitle: "So sánh và ghi lại điều chưa rõ",
    range: "118–135",
    source: 118,
    paragraphs: [
      "Chuyên đề cuối trình bày Sinh Khí đứng trước các nhóm khác. So sánh từng bài với đặc điểm cơ bản của Sinh Khí, giữ rõ đâu là tên nhóm, đâu là cách kết hợp.",
      "Tự chọn một dãy số minh họa, tách các cặp chồng lấn và tra nhóm. Sau đó ghi những điều chưa rõ và mở lại slide để đối chiếu. Dùng ghi chép để học, không quy đổi thành điểm vận mệnh.",
    ],
    question: "Dãy minh họa 143 gồm những cặp cơ bản nào?",
    answer:
      "Hai cặp chồng lấn: 14 thuộc Sinh Khí và 43 thuộc Diên Niên. Tra cứu bài Sinh Khí + Diên Niên bắt đầu ở slide 123.",
  },
];

export interface SourceSlide {
  number: number;
  title: string;
  chapter: string;
  images: string[];
  thumbnail: string | null;
  text: string;
  quality: "proofread" | "ocr" | "native" | "blank";
  confidence: number | null;
}

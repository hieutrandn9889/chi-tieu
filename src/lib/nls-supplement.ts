// Supplementary study notes ("ghi chép bổ sung") from the owner's workbook
// CÁC TU TRUONG NANG LUONG.xlsx. The workbook itself stays out of Git because it
// holds real names, CCCD and phone numbers. Everything here is a neutral summary:
// health, death, infidelity, gender restrictions, spirits, real-person examples
// and licence-plate (quẻ dịch) rules were left out on purpose.

export const supplementSource = {
  label: "Ghi chép bổ sung",
  file: "CÁC TU TRUONG NANG LUONG.xlsx",
  note: "Tóm lược trung tính từ ghi chép học tập ngoài bộ slide NLS 6868. Không phải nội dung slide; đã lược bỏ phần sức khỏe, hôn nhân tiêu cực, giới hạn theo giới tính, tâm linh và ví dụ người thật.",
};

// Pair table as written in sheet "NL co ban" (row 4–5). Kept only to cross-check
// the slide-based table in nls.ts.
export const supplementPairs: Record<string, string[]> = {
  PV: ["11", "22", "88", "99", "77", "66", "44", "33"],
  TY: ["13", "68", "94", "72", "31", "86", "49", "27"],
  SK: ["14", "67", "93", "82", "41", "76", "39", "28"],
  DN: ["19", "78", "43", "26", "91", "87", "34", "62"],
  LS: ["16", "74", "38", "92", "61", "47", "83", "29"],
  TM: ["12", "69", "37", "84", "21", "96", "73", "48"],
  HH: ["17", "98", "64", "32", "71", "89", "46", "23"],
  NQ: ["18", "97", "36", "42", "81", "79", "63", "24"],
};

// The workbook heads the table "cát tinh" (PV, TY, SK, DN) and "hung tinh"
// (LS, TM, HH, NQ). Slide 8 says Phục Vị is neither wholly, so it stays neutral.
export type Tone = "cat" | "hung" | "neutral";
export const supplementTone: Record<string, Tone> = {
  PV: "neutral",
  TY: "cat",
  SK: "cat",
  DN: "cat",
  LS: "hung",
  TM: "hung",
  HH: "hung",
  NQ: "hung",
};

export interface GroupNote {
  personality: string;
  work: string;
  study: string;
}

export const groupNotes: Record<string, GroupNote> = {
  PV: {
    personality:
      "Kiên nhẫn, chịu đựng tốt, kín đáo (“ngọa hổ tàng long”); thiên về an toàn, ngại mạo hiểm nên dễ bỏ lỡ cơ hội; có lúc cứng nhắc. Đi cùng nhóm nào thì khuếch đại nhóm đó.",
    work: "Hợp công việc ổn định, có sẵn quy trình, công thức; cần được đốc thúc để giữ nhịp làm việc.",
    study: "Ghi chép xếp Phục Vị vào nhóm không kích phát việc học.",
  },
  TY: {
    personality:
      "Lương thiện, hào phóng, sẵn lòng giúp đỡ, đơn thuần, không câu nệ tiểu tiết; vì vậy cũng dễ tin người.",
    work: "Dễ được cấp trên tín nhiệm và trở thành người hỗ trợ đắc lực; có xu hướng làm chủ.",
    study: "Ghi chép nói người đang đi học có thể thích kiếm tiền hơn việc học.",
  },
  SK: {
    personality:
      "Vui vẻ, phóng khoáng, an nhiên, tùy duyên; rộng lượng, đồng cảm và hay cho đi.",
    work: "Hay được người khác giúp đỡ; thường để ý các việc như công nghệ thông tin, bàn giấy, chiến lược, nghiên cứu.",
    study: "Ghi chép xếp Sinh Khí là nhóm thích hợp cho học sinh.",
  },
  DN: {
    personality:
      "Có chính kiến, nguyên tắc, trung thành, trước sau như một, trách nhiệm cao; đôi khi bảo thủ, khó gần.",
    work: "Chuyên nghiệp, kỹ năng và năng lực tốt, tập trung cao, có khả năng lãnh đạo.",
    study: "Ghi chép nói Diên Niên tăng cường sự tập trung học tập.",
  },
  LS: {
    personality:
      "Thẩm mỹ cao, khéo léo, tinh tế, nhẹ nhàng, có duyên; cần được quan tâm, thấu hiểu; chịu áp lực kém, dễ căng thẳng và nghĩ tiêu cực.",
    work: "Hợp công việc làm đẹp, dịch vụ, giao tế; vì chịu áp lực kém nên công việc có thể thiếu ổn định.",
    study: "Ghi chép xếp Lục Sát vào nhóm không kích phát việc học.",
  },
  TM: {
    personality:
      "Hào sảng, nghĩa hiệp, hay bênh vực người yếu thế; nhanh nhẹn, dám nghĩ dám làm, bền trí; đôi khi liều lĩnh, hiếu thắng.",
    work: "Có xu hướng thích đầu tư, tự lập nghiệp, làm chủ.",
    study: "Ghi chép xếp Tuyệt Mệnh vào nhóm không kích phát việc học.",
  },
  HH: {
    personality:
      "Thẳng thắn, giao tiếp tốt, hoạt ngôn; đôi khi nóng tính, cố chấp nên dễ tranh cãi.",
    work: "Hợp các việc dùng lời nói: tiếp thị, bán hàng, luật sư, giáo viên.",
    study: "Ghi chép xếp Họa Hại vào nhóm không kích phát việc học.",
  },
  NQ: {
    personality:
      "Thông minh, nhạy bén, tinh tế, ứng biến nhanh, linh hoạt, nắm bắt được cảm xúc người khác.",
    work: "Hợp kinh doanh và công việc dùng trí tuệ, tài hoa, sáng tạo; hay có ý tưởng khác biệt, khó ngồi yên với việc lặp lại.",
    study: "Ghi chép xếp Ngũ Quỷ vào nhóm không kích phát việc học.",
  },
};

// Sheet "NL chi tiet moi tu truong": one note per pair and its reverse
// (Phục Vị notes cover two pairs each, as the workbook groups them).
export const pairNotes: { pairs: string[]; note: string }[] = [
  { pairs: ["11", "22"], note: "Kiên nhẫn, chờ thời và nhịn nhục rất cao; ít thể hiện ra ngoài; khó thuyết phục bằng lời, thường tự trải nghiệm rồi mới thay đổi; chung tình." },
  { pairs: ["88", "99"], note: "Chú trọng điều kiện kinh tế; có khả năng quản lý tập thể, lập kế hoạch, điều hành; kết nối và cạnh tranh tốt; có phần bảo thủ." },
  { pairs: ["77", "66"], note: "Giai đoạn mơ mộng, lãng mạn trong tình cảm; hợp việc tính toán, thống kê, kế toán, phân tích số liệu." },
  { pairs: ["44", "33"], note: "Đơn giản, ít yêu cầu, thích cuộc sống bình lặng, hòa nhã, ít va chạm; hợp việc văn phòng, đào tạo, làm theo hướng dẫn." },
  { pairs: ["13", "31"], note: "Ghi chép xếp là tầng năng lượng cao nhất của Thiên Y: nghiêm túc, đứng đắn, chi tiêu ưu tiên giá trị; được kính trọng, lời nói có trọng lượng, mong muốn giúp người." },
  { pairs: ["68", "86"], note: "Thấp hơn 13/31 một bậc: tiết kiệm, quản lý tiền cẩn thận; hay học hỏi và kết nối với người đi trước; vận may đến đều đặn." },
  { pairs: ["94", "49"], note: "Tích lũy âm thầm, sống bình dị, kín đáo; kết nối được nhiều tầng lớp, nắm bắt cơ hội nhanh; hợp vai trò trung gian, môi giới." },
  { pairs: ["72", "27"], note: "Giản dị, chân thành, thích cuộc sống nhàn, ít bon chen; hợp công việc quy mô nhỏ; dễ được người khác hỗ trợ." },
  { pairs: ["14", "41"], note: "Dễ thích nghi, lạc quan, thấu hiểu người khác, kết nối tốt, hay được hỗ trợ; có tính tiên phong." },
  { pairs: ["67", "76"], note: "Hợp thiết kế, kiến trúc, đạo diễn, giáo dục, bán hàng; có duyên với người lớn tuổi; biết quan tâm, hết lòng vì người khác." },
  { pairs: ["93", "39"], note: "Hợp công việc sáng tạo, thông tin, thiết kế, tổ chức; nhân duyên không nhiều nhưng khi gặp thì phát mạnh; hay cho đi." },
  { pairs: ["82", "28"], note: "Hợp quảng cáo, bán hàng, tiếp thị, biên tập, viết nội dung; vui vẻ, sôi nổi, nắm bắt câu chuyện nhanh." },
  { pairs: ["19", "91"], note: "Trách nhiệm cao, ít nói, kỹ tính, gọn gàng, tiết kiệm; giỏi tự học, tự làm mọi việc, dứt khoát; khó tin người khác." },
  { pairs: ["78", "87"], note: "Biết lắng nghe, thấu hiểu, nghiêm túc, lựa lời; lời nói ôn hòa; ra ngoài được nể trọng." },
  { pairs: ["43", "34"], note: "Từ tốn, nhẹ nhàng, có khả năng phân tích; thích hoàn thành nhiệm vụ được giao hơn là giao việc; ít đột phá, ít áp lực." },
  { pairs: ["26", "62"], note: "Trách nhiệm cao, thích làm chủ theo kiểu tình cảm; chăm sóc người khác tốt." },
  { pairs: ["16", "61"], note: "Khéo, có duyên, được nhiều người quý; đa cảm, hay suy diễn, ít nói ra điều mình nghĩ." },
  { pairs: ["74", "47"], note: "Hay nghĩ lâu về một vấn đề; giỏi dùng ngôn từ, khéo léo trong giao tiếp." },
  { pairs: ["38", "83"], note: "Nhẹ nhàng, hấp dẫn, ngoại giao rất tốt; kém kiên nhẫn." },
  { pairs: ["92", "29"], note: "Chỉ cần sự quan tâm, dễ thỏa mãn; ghi chép đặt năng lượng ở giữa 38 và 74, cần xem các nhóm trước và sau." },
  { pairs: ["12", "21"], note: "Quan điểm rõ ràng, thẳng thắn, chăm chỉ, nỗ lực, dám quyết một mình; có lúc nóng tính, tự cao." },
  { pairs: ["69", "96"], note: "Phong thái đĩnh đạc, uy tín, thông minh, sòng phẳng, giỏi giao tiếp, quan tâm người khác." },
  { pairs: ["37", "73"], note: "Ít thể hiện cảm xúc, ít giải thích nên dễ bị hiểu là vô tình; dễ suy nghĩ tiêu cực." },
  { pairs: ["84", "48"], note: "Nội tâm mỏng manh, dễ thay đổi tâm trạng, ít nguyên tắc." },
  { pairs: ["17", "71"], note: "Thẳng tính, hay nói quá, hiếu thắng, sĩ diện; dễ trách móc người khác." },
  { pairs: ["98", "89"], note: "Trầm tĩnh, cân nhắc lời nói, hoạt ngôn, giỏi xoa dịu và động viên; phóng khoáng về tiền, hay chi cho việc có giá trị." },
  { pairs: ["64", "46"], note: "Nóng tính, dễ nói lời làm tổn thương người thân; ra ngoài lại được tin tưởng." },
  { pairs: ["32", "23"], note: "Ôn hòa, nhã nhặn, kiểm soát lời nói tốt, điềm đạm nên được nể phục; dễ để bụng lời người khác." },
  { pairs: ["18", "81"], note: "Linh hoạt, học nhanh, đa nghi, có trực giác, không thù dai; thích nghiên cứu, có gu thẩm mỹ; hay làm trưởng nhóm." },
  { pairs: ["97", "79"], note: "Lắng nghe tốt, thông minh, kín đáo, đầu óc nhanh, thích kiếm tiền nhanh; khó khuất phục, cần được đối xử nhẹ nhàng." },
  { pairs: ["36", "63"], note: "Đa nghi nhưng không thù dai, giận nhanh hết; linh hoạt ngôn từ, khéo léo, thông minh; hay áp đặt, cả thèm chóng chán." },
  { pairs: ["42", "24"], note: "Làm việc tùy hứng, linh hoạt, trực giác tốt." },
];

export function findPairNote(pair: string) {
  return pairNotes.find((item) => item.pairs.includes(pair));
}

interface PhonePair {
  pair: string;
  index: number;
  field?: { short: string; name: string };
}

// Sheet "Nhận biết sdt xấu". Only rules whose terms the notes define are
// automated; "tầng thấp" and "hung lớn cát nhỏ" are listed but not computed.
export function checkPhonePattern(digits: string, pairs: PhonePair[]) {
  const position = (index: number) => `vị trí ${index + 1}–${index + 3}`;
  const tone = (item?: PhonePair) =>
    item?.field ? supplementTone[item.field.short] : undefined;
  const warnings: string[] = [];
  const strengths: string[] = [];
  pairs.forEach((item, index) => {
    const next = pairs[index + 1];
    if (!next?.field || !item.field) return;
    const flow = `${item.field.name} → ${next.field.name}`;
    if (tone(item) === "hung" && tone(next) === "hung")
      warnings.push(`Hai hung tinh đứng cạnh nhau: ${flow} (${position(index)}).`);
    if (tone(item) === "cat" && tone(next) === "cat")
      strengths.push(`Hai cát tinh đứng cạnh nhau: ${flow} (${position(index)}).`);
    if (tone(item) === "hung" && tone(next) === "cat")
      strengths.push(`Chuyển từ hung sang cát: ${flow} (${position(index)}).`);
  });
  // The leading 0 belongs to the carrier prefix and is not counted.
  const zeros = [...digits]
    .map((digit, index) => (digit === "0" && index > 0 ? index + 1 : 0))
    .filter(Boolean);
  if (zeros.length)
    warnings.push(
      `Có số 0 trong dãy (không tính số 0 đầu của nhà mạng): vị trí ${zeros.join(", ")}.`,
    );
  return {
    warnings,
    strengths,
    notAutomated: [
      "Hai hung cùng năng lượng ở tầng thấp chuyển hóa ra cát thì không xấu, nhưng ở cuối đuôi số thì không tốt: ghi chép chưa định nghĩa “tầng thấp”, nên công cụ không tự xét.",
      "Hung lớn, cát nhỏ thì không cân: ghi chép chưa định nghĩa “lớn/nhỏ” cho mọi nhóm, nên công cụ không tự xét.",
    ],
  };
}

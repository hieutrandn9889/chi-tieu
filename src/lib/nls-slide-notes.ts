// Report data from proofread slides 29–35 (each group with 0) and 37–38
// (question sets). Items the owner excluded — health, suicide, infidelity,
// spirits, children's health — stay in the slide transcription but are not
// shown here; `hidden` counts them so the report can say so.

export interface ZeroGroupSlide {
  source: number;
  items: { heading: string; detail?: string }[];
  hidden: number;
}

export const zeroGroupSlides: Record<string, ZeroGroupSlide> = {
  SK: {
    source: 29,
    items: [
      { heading: "Quý nhân ẩn dấu", detail: "Thường bị tiểu nhân phá hại." },
      { heading: "Không có may mắn", detail: "Ít được hỗ trợ." },
      { heading: "Tiêu cực, bất mãn", detail: "Mất niềm tin, ..." },
    ],
    hidden: 1,
  },
  LS: {
    source: 30,
    items: [
      { heading: "Dễ nợ từng đồng, từng cục", detail: "Dễ rơi vào tình trạng nợ nần, khó xoay xở tài chính." },
      // The slide's detail line also names health spending, so only the heading is shown.
      { heading: "Dễ trả nợ do sĩ diện, thích trưng diện" },
      { heading: "Dễ đầu tư, làm ăn thua lỗ", detail: "Đầu tư thiếu tính toán, dễ gặp rủi ro, thua lỗ..." },
      { heading: "Gia đạo, công danh đều không thuận", detail: "Dễ xảy ra mâu thuẫn, bất đồng, công việc thăng tiến chậm, ít thuận lợi..." },
    ],
    hidden: 2,
  },
  DN: {
    source: 31,
    items: [
      { heading: "Không có năng lực thật", detail: "Thùng rỗng kêu to, dễ bị coi thường, nói không ai nghe.." },
      { heading: "Năng lực có mà không được trọng dụng", detail: "Không được phát huy, dễ bị chèn ép, bị vô ơn, bị đổ lỗi, bị gánh trách nhiệm thay." },
      { heading: "Cường quyền, lạm dụng chức vụ", detail: "Dễ xử lý vấn đề cực đoan, gia trưởng, áp đặt, cố độc..." },
      { heading: "Hôn nhân dễ tẻ nhạt, khó hòa hợp", detail: "Dễ kiếm tiền vất vả, làm nhiều công sức mà không được bao nhiêu." },
      { heading: "Tài chính khó tích lũy", detail: "Làm nhiều nhưng khó giữ, tiền đến rồi đi, dễ hao tán." },
    ],
    hidden: 1,
  },
  NQ: {
    source: 32,
    items: [
      { heading: "Đa nghi, ít người tin tưởng", detail: "Hay nghi ngờ, ít người tin tưởng." },
      { heading: "Dễ ảo tưởng sức mạnh", detail: "Hay viễn vông, dễ bị cuốn theo." },
    ],
    hidden: 4,
  },
  HH: {
    source: 33,
    items: [
      { heading: "Dễ cãi vã, kiện tụng", detail: "Dễ xảy ra tranh chấp, kiện tụng, thị phi, đấu đá, dễ vướng vào những chuyện không đáng có..." },
      { heading: "Hay làm quá vấn đề", detail: "Nâng cao quan điểm, khi nói ra dễ gây hiểu nhầm, dễ bị người khác đánh giá, xa lánh..." },
      { heading: "Hao mòn, trả nợ hộ", detail: "Dễ hao tài, phải trả nợ hộ, che đậy ôm nợ, lấp liếm không trung thực..." },
      { heading: "Dễ vay mượn, mất uy tín", detail: "Dễ vay mượn, tiêu trước trả sau, vay lung tung, vay khắp nơi gây mất uy tín..." },
    ],
    hidden: 1,
  },
  TM: {
    source: 34,
    items: [
      { heading: "Dễ mất mát, ẩn tàng", detail: "Âm thầm, ẩn tàng, bạo phát có thể rất giàu, nhưng nếu mất không còn gì, trắng tay và ê trề, mọi thứ luôn ẩn. …" },
      { heading: "Hôn nhân sóng gió", detail: "Hôn nhân sóng gió, có thể chia tay trong đêm, đang đẹp mà lật mặt ngay được.." },
      { heading: "Dễ gặp nguy hiểm", detail: "Mạo hiểm, cờ bạc, đầu cơ, ôm rủi ro cao, chủ quan, ngạo mạn, dễ bị lừa, dễ bị đầu tư do tin người mà mất..." },
    ],
    hidden: 2,
  },
  TY: {
    source: 35,
    items: [
      { heading: "Mua nhà mắc nợ", detail: "Cho vay khó đòi, đầu tư dễ mất, đọng kẹt, ... dễ bị lừa." },
      { heading: "Tài năng bị ẩn dấu", detail: "Công việc không thuận lợi, làm gì cũng mắc kẹt, khó khăn.." },
      { heading: "Mối quan hệ phức tạp", detail: "Dễ trở ngại công việc, thị phi, tiểu nhân..." },
      { heading: "Tổng quan", detail: "Năng lượng Thiên Y ẩn 0 cần được cân bằng, thấu hiểu và sử dụng đúng cách để hoá giải." },
    ],
    hidden: 2,
  },
};

export interface QuestionGroup {
  topic: string;
  questions: string[];
}

// Slide 37, "Bộ câu hỏi chung khi coach". Health (6) and spirituality (7) are
// left out; one question each was dropped from 1 (third party) and 5 (tâm linh).
export const generalQuestions: { source: number; groups: QuestionGroup[]; closing: string; hidden: number } = {
  source: 37,
  groups: [
    {
      topic: "Hôn nhân – Tình cảm",
      questions: [
        "Anh/chị có cảm thấy hôn nhân nhiều biến động không?",
        "Hai vợ chồng có thường xuyên mâu thuẫn, chiến tranh lạnh không?",
        "Có lúc rất yêu nhưng cũng có lúc muốn buông bỏ tất cả không?",
        "Anh/chị có cảm thấy mình khó được thấu hiểu?",
        "Có từng trải qua chia tay, ly thân hoặc đổ vỡ tình cảm chưa?",
        "Có khi nào cảm thấy vừa yêu vừa đau khổ không?",
        "Anh/chị có hay suy nghĩ quá nhiều về chuyện tình cảm không?",
        "Anh/chị có lo lắng nhiều cho con cái không?",
        "Con cái có làm anh/chị phải suy nghĩ nhiều không?",
        "Mối quan hệ giữa anh/chị và con hiện tại như thế nào?",
        "Có cảm thấy con khó dạy hoặc khó đồng hành không?",
      ],
    },
    {
      topic: "Tài chính",
      questions: [
        "Anh/chị kiếm tiền có nhanh nhưng giữ tiền khó không?",
        "Có từng đầu tư sai hoặc mất tiền vì quá tin người chưa?",
        "Có từng vay mượn hoặc gánh nợ thay người khác không?",
        "Có thường xuyên thay đổi kế hoạch tài chính không?",
        "Có nhiều nguồn thu nhưng vẫn cảm thấy tiền không tích lũy được?",
        "Có từng bị lừa, mất tiền oan hoặc dính giấy tờ pháp lý chưa?",
        "Có hay mua sắm theo cảm xúc không?",
        "Tiền bạc hiện tại đang ổn định hay lên xuống thất thường?",
      ],
    },
    {
      topic: "Công việc – Sự nghiệp",
      questions: [
        "Anh/chị đã từng thay đổi công việc nhiều lần chưa?",
        "Có thường xuyên cảm thấy chán việc dù trước đó rất thích không?",
        "Có làm nhiều nghề cùng lúc không?",
        "Có từng nghỉ việc đột ngột hoặc bỏ ngang giữa chừng không?",
        "Có thường bất mãn với cấp trên hoặc môi trường làm việc không?",
        "Có cảm giác mình giỏi nhưng chưa gặp đúng thời chưa?",
        "Có từng xây dựng kế hoạch rất lớn nhưng sau đó bỏ dở không?",
        "Anh/chị thích tự làm hay thích làm theo người khác?",
      ],
    },
    {
      topic: "Quan vận – Mối quan hệ xã hội",
      questions: [
        "Anh/chị có dễ bị hiểu lầm không?",
        "Có từng bị phản bội hoặc trở mặt bởi người mình tin tưởng không?",
        "Có hay gặp thị phi, nói xấu sau lưng không?",
        "Có từng bị đổ oan, gánh trách nhiệm thay người khác chưa?",
        "Có thường xuyên thay đổi bạn bè hoặc cộng sự không?",
        "Có cảm thấy ít người thực sự hiểu mình không?",
        "Có lúc rất nhiệt tình nhưng sau đó muốn cắt đứt mọi quan hệ không?",
      ],
    },
    {
      topic: "Học tập",
      questions: [
        "Anh/chị có học rất nhanh nhưng dễ chán không?",
        "Có học nhiều thứ nhưng chưa theo đến cùng không?",
        "Có từng học giỏi nhưng bỏ ngang giữa chừng không?",
        "Anh/chị thích tự nghiên cứu hơn nghe người khác hướng dẫn đúng không?",
        "Có từng thay đổi định hướng học tập nhiều lần không?",
      ],
    },
  ],
  closing:
    "Nếu được thay đổi một điều lớn nhất trong cuộc đời hiện tại, anh/chị muốn thay đổi điều gì trước tiên: Hôn nhân – Sức khỏe – Tài chính – Sự nghiệp hay Nội tâm?",
  hidden: 15,
};

// Slide 37, group 8: shown only when Ngũ Quỷ meets a 0 in the sequence.
export const ngQuyZeroQuestions: QuestionGroup = {
  topic: "Riêng Ngũ Quỷ đi cùng 0: Sứ mệnh – Áp lực",
  questions: [
    "Anh/chị có cảm thấy mình gánh trách nhiệm lớn hơn người khác không?",
    "Có lúc cảm thấy rất mệt mỏi nhưng không biết vì sao không?",
    "Có hay cảm thấy cuộc đời quá bất công với mình không?",
    "Có thường xuyên oán trách hoặc cảm thấy cô đơn không?",
    "Có cảm giác mình sinh ra để làm điều gì đó lớn lao hơn không?",
    "Anh/chị có đang phụng sự người khác hay chỉ đang gồng gánh một mình?",
    "Có lúc muốn buông bỏ tất cả để sống bình yên không?",
    "Có từng trải qua biến cố lớn khiến mình thay đổi hoàn toàn không?",
  ],
};

// Slide 38, "Bộ câu hỏi riêng biệt": questions for a group followed by Ngũ Quỷ
// (A + NQ). Children (2), health (3) and spirituality (8) are left out, and the
// third-party question under TM + NQ marriage is dropped.
export const nqPairQuestions: { first: string; topic: string; questions: string[] }[] = [
  {
    first: "TM",
    topic: "Hôn nhân – Tình cảm",
    questions: [
      "Gia đình có từng xảy ra bạo lực lời nói hoặc bạo lực tinh thần không?",
      "Có giai đoạn muốn ly hôn nhưng vẫn cố chịu đựng không?",
    ],
  },
  {
    first: "LS",
    topic: "Hôn nhân – Tình cảm",
    questions: [
      "Tình cảm của anh/chị có thất thường, lúc yêu lúc ghét không?",
      "Có dễ bị phụ thuộc cảm xúc vào đối phương không?",
    ],
  },
  {
    first: "DN",
    topic: "Hôn nhân – Tình cảm",
    questions: [
      "Có hay áp đặt, cứng nhắc hoặc không chịu nhường nhịn không?",
      "Người thân có từng nói anh/chị quá bảo thủ không?",
    ],
  },
  {
    first: "TY",
    topic: "Tài chính",
    questions: [
      "Có từng vay mượn để đầu tư rồi áp lực trả nợ không?",
      "Có từng mở rộng kinh doanh quá nhanh không?",
    ],
  },
  {
    first: "TM",
    topic: "Tài chính",
    questions: [
      "Có từng mất khoản tiền lớn bất ngờ không?",
      "Có từng dính tranh chấp tiền bạc hoặc giấy tờ không?",
    ],
  },
  {
    first: "LS",
    topic: "Tài chính",
    questions: [
      "Có hay mua sắm theo cảm xúc không?",
      "Có từng ôm hàng hoặc đầu tư vì cả nể không?",
    ],
  },
  {
    first: "DN",
    topic: "Sự nghiệp",
    questions: [
      "Có hay xung đột với cấp trên không?",
      "Có từng mất chức, mất quyền hoặc bị hiểu lầm trong công việc không?",
    ],
  },
  {
    first: "HH",
    topic: "Sự nghiệp",
    questions: ["Có từng làm việc rất tốt nhưng không được ghi nhận không?"],
  },
  {
    first: "NQ",
    topic: "Sự nghiệp",
    questions: ["Có lúc thành công rất nhanh nhưng sau đó lại tụt rất nhanh không?"],
  },
  {
    first: "NQ",
    topic: "Học tập",
    questions: ["Có một hiểu mười nhưng lại thiếu kỷ luật không?"],
  },
  {
    first: "TY",
    topic: "Học tập",
    questions: ["Có nhiều ý tưởng nhưng khó theo đến cùng không?"],
  },
  {
    first: "TM",
    topic: "Quan vận – Pháp lý",
    questions: ["Có từng tranh chấp tài sản, đất đai hoặc tiền bạc không?"],
  },
  {
    first: "HH",
    topic: "Quan vận – Pháp lý",
    questions: ["Có từng tranh chấp tài sản, đất đai hoặc tiền bạc không?"],
  },
  {
    first: "DN",
    topic: "Quan vận – Pháp lý",
    questions: ["Có từng vì nóng tính mà mất cơ hội lớn không?"],
  },
];

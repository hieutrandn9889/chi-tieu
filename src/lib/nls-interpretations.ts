// Editorial interpretations checked against the indicated source images on 2026-10-24.
// These describe a numerological tradition, not validated traits or predictions about a person.
export interface FieldReading {
  source: number;
  potential: string;
  pressure: string;
  work: string;
  relationships: string;
  decision: string;
  question: string;
}

export const fieldReadings: Record<string, FieldReading> = {
  SK: {
    source: 6,
    potential:
      "Sinh Khí được mô tả bằng khả năng tạo cảm giác dễ chịu, thích nghi và đứng dậy sau thất bại. Giá trị của chủ đề này nằm ở việc mở kết nối, đón nhận hỗ trợ và giữ góc nhìn rộng khi hoàn cảnh thay đổi.",
    pressure:
      "Sự vô tư có thể chuyển thành thiếu quan tâm; dễ tha thứ không đồng nghĩa với việc mọi người đều đáng tin. Tài liệu đặt cạnh sự an nhiên một yêu cầu rất rõ: có giới hạn và có mục tiêu.",
    work: "Nguồn nhấn mạnh học trong niềm vui, dễ thích nghi và tiếp nhận sự giúp đỡ. Khi tự đối chiếu, hãy xét khả năng biến một cuộc gặp hoặc lời giới thiệu thành công việc cụ thể, thay vì chỉ dừng ở thiện cảm.",
    relationships:
      "Mềm mại, không thích tranh đấu và sẵn lòng vì cộng đồng là các nét được nêu. Mặt cần cân bằng là nói rõ nhu cầu riêng, giữ lời hẹn và không nhận giúp quá khả năng.",
    decision:
      "Giữ thái độ cởi mở nhưng kiểm tra điều kiện thực tế trước khi đồng ý. Câu hỏi của Sinh Khí là làm sao vừa giữ thiện chí vừa không bỏ qua dấu hiệu cần thận trọng.",
    question:
      "Trong một lời nhờ giúp gần đây, điều gì khiến bạn đồng ý hoặc từ chối? Kết quả thực tế ủng hộ hay phản bác mô tả này?",
  },
  TY: {
    source: 10,
    potential:
      "Thiên Y đặt trọng tâm vào yêu thương, sự rộng lượng và khả năng trao nhận hỗ trợ. Tài liệu gọi đây là chủ đề “Tiền và Tình”; phần có thể tự đối chiếu là cách cân bằng nhu cầu của mình với mong muốn chăm lo cho người khác.",
    pressure:
      "Lòng tốt có thể đi kèm cả nể, tin người quá sớm hoặc cho đi quá mức. Một cặp Thiên Y không đủ để kết luận mọi việc thuận lợi: ngay slide 10 cũng yêu cầu xét kết cấu trước sau.",
    work: "Có thể đọc chủ đề này qua động lực tạo giá trị cho người khác và thái độ hợp tác. Cần phân biệt làm việc vì trách nhiệm đã thỏa thuận với việc nhận thêm chỉ vì ngại từ chối.",
    relationships:
      "Quan tâm, hào phóng và sống tình cảm là mô tả của nguồn. Điều cần đối chiếu là sự chăm sóc có được trao đổi hai chiều hay một bên đang âm thầm hy sinh nhu cầu của mình.",
    decision:
      "Tách thiện chí khỏi cam kết. Trước khi nhận một trách nhiệm, xác định thời gian, nguồn lực và giới hạn thay vì để sự cảm thông quyết định toàn bộ.",
    question:
      "Trong lần hỗ trợ người khác gần nhất, hai bên đã thống nhất giới hạn thế nào? Có điều gì trong mô tả này không đúng với bạn?",
  },
  DN: {
    source: 13,
    potential:
      "Diên Niên nhấn mạnh chữ tín, kỷ luật và năng lực gánh vác. Chủ đề cốt lõi là xây thành quả bằng sự nhất quán, làm chủ chuyên môn và chịu trách nhiệm đến cùng với việc đã nhận.",
    pressure:
      "Khi trách nhiệm biến thành ôm đồm, tiêu chuẩn cao có thể tạo áp lực cho cả mình lẫn người khác. Tài liệu phân biệt bản lĩnh với cố chấp, làm chủ với kiểm soát quá mức.",
    work: "Phù hợp để tự xét cách tổ chức công việc, bám mục tiêu và theo dõi chất lượng. Không thể từ đây chỉ định nghề nghiệp; hãy nhìn vào năng lực thật, khả năng phân công và kết quả công việc đã có.",
    relationships:
      "Sự đáng tin có thể thể hiện bằng hành động và trách nhiệm. Điều cần cân bằng là lắng nghe, cho người khác quyền lựa chọn và dành chỗ cho sự mềm mại ngoài những yêu cầu đúng/sai.",
    decision:
      "Dựa trên nguyên tắc và mục tiêu dài hạn, đồng thời quy định điều kiện để thay đổi quyết định. Kiên định có ích khi vẫn tiếp nhận được bằng chứng mới.",
    question:
      "Một lần gần đây bạn đã giao việc hoặc thay đổi ý kiến diễn ra thế nào? Điều gì khiến bạn giữ hoặc điều chỉnh tiêu chuẩn?",
  },
  PV: {
    source: 8,
    potential:
      "Phục Vị được đọc qua chiều sâu, tính bền bỉ và khả năng giữ cam kết. Nguồn mô tả người chọn chậm nhưng giữ lâu, học bằng tích lũy và kiên trì nghiên cứu một vấn đề.",
    pressure:
      "Mặt còn lại là suy nghĩ kéo dài, sợ sai và khó chuyển từ chuẩn bị sang hành động. Cần phân biệt thận trọng có tiêu chí với trì hoãn không có điểm kết thúc.",
    work: "Tài liệu nhấn mạnh tự học, nhớ lâu và đi sâu chuyên môn. Cách tự đối chiếu hữu ích là xem mỗi giai đoạn nghiên cứu có tạo ra sản phẩm, quyết định hoặc thử nghiệm cụ thể hay không.",
    relationships:
      "Nguồn nêu sự hòa nhã, trung thành, nhưng cũng mô tả khó chia sẻ cảm xúc thật. Gắn bó bền cần đi cùng việc nói ra điều mình cần, thay vì chỉ chịu đựng để giữ sự yên ổn.",
    decision:
      "Đặt hạn chót và tiêu chí đủ thông tin trước khi quyết. Nguồn nói Phục Vị tùy kết cấu; không có căn cứ để coi mọi cặp lặp là tốt hoặc gán hệ số khuếch đại cố định.",
    question:
      "Một quyết định bạn đã cân nhắc lâu kết thúc bằng hành động nào? Chậm lại đã giúp ích hay khiến bạn bỏ lỡ điều gì?",
  },
  LS: {
    source: 15,
    potential:
      "Lục Sát đặt cảm xúc, thẩm mỹ và sự tinh tế trong tương tác ở trung tâm. Phần tích cực của mô tả là nhận ra sắc thái, tạo thiện cảm và diễn đạt điều khó nói theo cách dễ tiếp nhận.",
    pressure:
      "Cảm nhận tinh tế có thể chuyển thành suy diễn nếu thiếu dữ kiện. Nguồn nhắc đến đa nghĩ, khó chịu áp lực và bị cảm xúc chi phối; đây là các chủ đề để kiểm tra, không phải chẩn đoán tâm lý.",
    work: "Nguồn mô tả tiếp thu nhanh, sáng tạo và có óc thẩm mỹ, đồng thời lưu ý học theo cảm hứng và dễ mất tập trung. Nên đối chiếu sự đều đặn của đầu ra với cảm hứng tại từng thời điểm.",
    relationships:
      "Mặt được nhấn mạnh là quan tâm đến cảm xúc và nhu cầu kết nối. Điểm cần cân bằng là phân biệt một hành vi quan sát được với điều mình đang đoán về ý định của người khác.",
    decision:
      "Ghi lại dữ kiện và cảm xúc thành hai phần trước khi lựa chọn. Sự dễ chịu hay bất an trong một cuộc gặp đều cần thêm thông tin để trở thành nhận định đáng tin.",
    question:
      "Khi thấy một người thay đổi thái độ, bạn đã kiểm tra nguyên nhân bằng cách nào? Điều gì trong trải nghiệm đó khác mô tả của nguồn?",
  },
  HH: {
    source: 17,
    potential:
      "Phần rõ ràng của slide Họa Hại nói về hoạt ngôn, thẳng thắn, bảo vệ người yếu và sức ảnh hưởng qua lời nói. Chủ đề đáng đọc là khả năng đưa một quan điểm ra ngoài và làm người khác chú ý.",
    pressure:
      "Thẳng thắn có thể trở thành gay gắt khi cần bảo vệ thể diện hoặc phản hồi quá nhanh. Bản nguồn có ô lặp nhầm Phục Vị; các ô đó không được dùng làm căn cứ cho phần luận này.",
    work: "Tự đối chiếu khả năng trình bày, phản biện và thuyết phục bằng kết quả cụ thể. Năng lực giao tiếp cần đi cùng độ chính xác của thông tin và việc thực hiện điều đã hứa.",
    relationships:
      "Nguồn mô tả vẻ ngoài mạnh mẽ đi cùng sự nhạy cảm bên trong. Điều cần xem là liệu người khác đã hiểu đúng nhu cầu của mình hay chỉ nghe thấy phần phản ứng mạnh.",
    decision:
      "Tạm dừng trước khi phát biểu điều khó rút lại. Kiểm tra sự kiện, lựa chọn cách nói và xác định mục đích cuộc trao đổi trước khi tranh luận đến cùng.",
    question:
      "Một cuộc trao đổi khó gần đây đã thay đổi thế nào sau cách dùng từ của bạn? Lời nói và kết quả có khớp với nhau không?",
  },
  TM: {
    source: 19,
    potential:
      "Tuyệt Mệnh được nguồn mô tả bằng sự quyết đoán, tinh thần tự lập và khả năng làm lại sau khó khăn. Chủ đề này tập trung vào sức hành động và việc học trực tiếp từ trải nghiệm.",
    pressure:
      "Quyết liệt có thể trở thành cực đoan nếu không có điều kiện dừng. Nguồn nêu nhược điểm khó dừng đúng lúc; không dùng tên gọi này để dự báo tai họa hoặc gán hoàn cảnh xuất thân.",
    work: "Tài liệu nhấn mạnh tư duy chiến lược, học qua thực hành và không thích lý thuyết dài dòng. Cần kiểm tra xem thử nghiệm có giới hạn, có đánh giá kết quả hay chỉ tiếp tục vì đã bỏ nhiều công sức.",
    relationships:
      "Nghĩa khí và sẵn lòng gánh vác là một mặt của mô tả. Khi bảo vệ điều mình coi trọng, cần chừa chỗ cho thỏa thuận thay vì biến mọi bất đồng thành chuyện phải thắng hoặc thua.",
    decision:
      "Viết trước tiêu chí bắt đầu, nguồn lực tối đa và điều kiện dừng. Bản lĩnh có thể thể hiện ở việc điều chỉnh khi dữ kiện đổi, không chỉ ở việc theo đuổi đến cùng.",
    question:
      "Trong một lần quyết định nhanh, bạn đã dùng dữ kiện nào và dừng ở điều kiện nào? Có ví dụ cho thấy bạn thận trọng hơn mô tả không?",
  },
  NQ: {
    source: 21,
    potential:
      "Ngũ Quỷ được nguồn liên hệ với tư duy nhanh, quan sát sắc bén, tính linh hoạt và cách nhìn khác số đông. Giá trị của chủ đề này là đặt câu hỏi mới và tìm phương án mà lối làm quen thuộc chưa nghĩ tới.",
    pressure:
      "Nhiều ý tưởng có thể đi cùng thay đổi mục tiêu liên tục, dễ chán và khó thừa nhận sai. Cần phân biệt sáng tạo có thử nghiệm với việc đổi hướng chỉ vì phương án mới hấp dẫn hơn.",
    work: "Tự đối chiếu cách học nhanh và khả năng theo đuổi một sản phẩm đến khi hoàn tất. Ý tưởng cần có tiêu chí kiểm chứng, thời hạn và một kết quả có thể xem lại.",
    relationships:
      "Tài liệu nhấn mạnh nhu cầu tự do và sự khó đoán trong thay đổi. Đối chiếu cách thông báo kỳ vọng, giải thích khi đổi ý và lắng nghe trước khi phản bác.",
    decision:
      "Ghi rõ điều gì là giả thuyết, điều gì đã kiểm chứng. Chọn một thử nghiệm nhỏ để kiểm tra ý tưởng thay vì coi trực giác là bằng chứng cuối cùng.",
    question:
      "Bạn đã chọn giữ hoặc bỏ một ý tưởng gần đây dựa trên kết quả nào? Có mục tiêu nào bạn theo đuổi ổn định, trái với mô tả dễ đổi hướng không?",
  },
};

export interface CombinationReading {
  first: string;
  second: string;
  source: number;
  theme: string;
  interpretation: string;
  question: string;
  practice: string;
}

// Scope: the non-medical themes on each cited opening slide, not its entire OCR transcript.
const combinationRows: [
  string,
  string,
  number,
  string,
  string,
  string,
  string,
][] = [
  [
    "TY",
    "TY",
    50,
    "Chăm sóc và hỗ trợ được nhắc lại",
    "Nguồn nhấn mạnh sự hòa hợp và trao nhận hỗ trợ khi Thiên Y đứng cạnh Thiên Y. Có thể đọc đây là sự lặp lại chủ đề quan tâm, thay vì tự nhân đôi mức may mắn hay kết luận cuộc sống viên mãn.",
    "Sự quan tâm đang được trao đổi hai chiều như thế nào?",
    "Thống nhất một nhu cầu cụ thể của mỗi bên thay vì đoán hộ.",
  ],
  [
    "TY",
    "SK",
    52,
    "Từ sự chăm lo đến mở rộng kết nối",
    "Thiên Y đứng trước, Sinh Khí đứng sau: nguồn ghép chủ đề tình cảm và hỗ trợ với cơ hội đến từ kết nối. Trọng tâm là biết tiếp nhận sự giúp đỡ; một quan hệ dễ chịu chưa chứng minh một cơ hội sẽ thành công.",
    "Một sự hỗ trợ gần đây đã trở thành việc cụ thể nào?",
    "Kiểm tra nội dung đề nghị và trách nhiệm của từng bên.",
  ],
  [
    "TY",
    "DN",
    54,
    "Chăm lo gắn với trách nhiệm",
    "Slide 54 nối sự hỗ trợ của Thiên Y với vai trò tổ chức, quản lý và sự ổn định của Diên Niên. Chủ đề để đối chiếu là chuyển thiện chí thành cam kết có cấu trúc, không chỉ chăm sóc bằng cảm xúc.",
    "Khi nhận trách nhiệm chung, vai trò của mỗi người rõ đến đâu?",
    "Ghi lại việc đã nhận, người phụ trách và mốc xem lại.",
  ],
  [
    "TY",
    "PV",
    55,
    "Nuôi dưỡng một cam kết lâu dài",
    "Nguồn mô tả Thiên Y được kéo dài qua Phục Vị, gắn với công việc ổn định và quan hệ được dưỡng nuôi. Có thể soi chiếu sự đều đặn trong chăm sóc; sự kéo dài tự nó không chứng minh một quan hệ là phù hợp.",
    "Điều gì được duy trì vì có giá trị, điều gì chỉ vì thói quen?",
    "Đặt một cuộc trao đổi định kỳ về nhu cầu và giới hạn.",
  ],
  [
    "TY",
    "HH",
    56,
    "Thiện chí, thể diện và lời nói",
    "Nguồn chuyển từ sự hào phóng sang nhu cầu được công nhận, dễ thể hiện quá mức hoặc lỡ lời. Điểm đáng kiểm tra là có đang dùng lời hứa và sự cho đi để giữ hình ảnh, rồi nhận cam kết vượt khả năng hay không.",
    "Một lời hứa gần đây xuất phát từ nhu cầu thật hay áp lực thể diện?",
    "Chỉ cam kết điều có thể thực hiện và nói rõ giới hạn.",
  ],
  [
    "TY",
    "LS",
    58,
    "Sự quan tâm đi cùng cảm xúc và hình thức",
    "Slide 58 đặt việc chiều theo sở thích, vẻ ngoài và cảm xúc cạnh sự thiếu tập trung. Khi đọc chủ đề này, cần phân biệt chăm sóc có ích với cố làm vừa lòng hoặc chạy theo cảm giác được yêu thích.",
    "Điều gì khiến bạn lựa chọn: nhu cầu thực tế hay cảm xúc lúc đó?",
    "Viết lại mục đích trước khi nhận một cam kết theo cảm hứng.",
  ],
  [
    "TY",
    "TM",
    59,
    "Từ gắn bó đến quyết liệt",
    "Nguồn mô tả sự chăm lo có thể chuyển thành sở hữu hoặc phản ứng cực đoan. Đây là lời gợi kiểm tra ranh giới trong cách gắn bó và cách quyết định; không phải bằng chứng một người sẽ chia tay hay gặp biến cố.",
    "Khi điều quan trọng bị đe dọa, bạn trao đổi hay quyết định ngay?",
    "Tách nhu cầu được quan tâm khỏi yêu cầu kiểm soát người khác.",
  ],
  [
    "TY",
    "NQ",
    61,
    "Thiện chí cần đi cùng kiểm chứng",
    "Slide 61 nhắc đến tin nhầm, ý tưởng thiếu căn cứ và cảm xúc thay đổi. Trọng tâm có thể tự đối chiếu là khi quan tâm một người hoặc bị hấp dẫn bởi một đề nghị, mình đã kiểm tra dữ kiện đến đâu.",
    "Bạn đã dùng bằng chứng nào để tin một đề nghị gần đây?",
    "Kiểm tra độc lập thông tin trước khi nhận thêm nghĩa vụ.",
  ],
  [
    "LS",
    "SK",
    63,
    "Sự tinh tế mở đường kết nối",
    "Nguồn mô tả khả năng giao tiếp, tinh tế và tạo thiện cảm giúp mở cơ hội. Ở chiều này, điểm xuất phát là cảm nhận và cách ứng xử; điều cần bổ sung là biến thiện cảm thành thỏa thuận rõ ràng.",
    "Một kết nối tốt đã được duy trì bằng hành động nào?",
    "Chốt một bước tiếp theo cụ thể sau cuộc trao đổi.",
  ],
  [
    "LS",
    "TY",
    65,
    "Sự tinh tế chuyển thành chăm sóc",
    "Slide 65 nhấn mạnh chu đáo, mềm mại và tạo cảm xúc mới mẻ trong quan hệ. Chủ đề để đọc là dùng khả năng cảm nhận nhu cầu để chăm lo thực chất, đồng thời giữ ranh giới với những sở thích nhất thời.",
    "Điều bạn nghĩ người khác cần đã được hỏi lại trực tiếp chưa?",
    "Hỏi nhu cầu thay vì dùng món quà hoặc sự chiều lòng để đoán.",
  ],
  [
    "LS",
    "DN",
    67,
    "Giao tiếp dẫn tới vai trò và trách nhiệm",
    "Nguồn liên hệ sự khéo léo và khả năng tạo tín nhiệm với vị trí tổ chức. Chiều này nhấn mạnh dùng tương tác để xây uy tín; để bền, sức thuyết phục cần được bảo chứng bằng năng lực và cam kết đã thực hiện.",
    "Uy tín trong một việc gần đây đến từ cách nói hay kết quả?",
    "Đặt tiêu chí đầu ra rõ ràng bên cạnh việc tạo đồng thuận.",
  ],
  [
    "LS",
    "PV",
    69,
    "Một cảm xúc hoặc cách ứng xử kéo dài",
    "Phục Vị theo sau Lục Sát được nguồn mô tả qua cảm xúc dai dẳng và thiếu điểm dừng. Có thể soi chiếu một điều khó nói có đang được giữ trong lòng rồi lặp thành cách phản ứng quen thuộc hay không.",
    "Một chuyện chưa giải quyết đang lặp lại qua những tình huống nào?",
    "Chọn một việc cụ thể để trao đổi và một mốc khép lại.",
  ],
  [
    "LS",
    "HH",
    71,
    "Từ cảm nhận đến va chạm bằng lời",
    "Nguồn gắn sự nhạy cảm với tranh cãi, hiểu lầm và tổn thương do lời nói. Điểm cần kiểm tra là một suy đoán về cảm xúc có bị phát biểu như sự thật, khiến cuộc nói chuyện rời khỏi vấn đề ban đầu hay không.",
    "Trong bất đồng gần đây, đâu là dữ kiện và đâu là điều bạn suy diễn?",
    "Nêu hành vi quan sát được rồi hỏi lại ý định.",
  ],
  [
    "LS",
    "LS",
    73,
    "Cảm xúc được nhắc lại trong quyết định",
    "Nguồn nhấn mạnh quyết định theo cảm xúc, hình thức hoặc mong muốn giải quyết thật nhanh khi hai Lục Sát đi liền. Nội dung này gợi kiểm tra sự kiểm chứng và khả năng tạm dừng, không cho phép kết luận về sự chung thủy.",
    "Bạn đã xem lại quyết định ấy khi cảm xúc lắng xuống chưa?",
    "Tạo một khoảng chờ trước lựa chọn khó đảo ngược.",
  ],
  [
    "LS",
    "TM",
    74,
    "Cảm xúc nối với hành động quyết liệt",
    "Slide 74 đặt sự lãng mạn, cảm xúc sâu bên cạnh hành vi liều và khó kiểm soát. Khi tự đối chiếu, trọng tâm là cách ngăn một cảm xúc mạnh trở thành hành động có hậu quả trước khi đủ thông tin.",
    "Điều gì giúp bạn dừng lại khi cảm xúc đang lên cao?",
    "Hoãn hành động khó rút lại và trao đổi khi đã bình tĩnh.",
  ],
  [
    "LS",
    "NQ",
    76,
    "Nhạy cảm đi cùng nghi ngờ và đổi ý",
    "Nguồn mô tả tranh cãi, nghi kỵ và cảm giác quan hệ thay đổi khó hiểu. Cần kiểm tra giả thuyết về người khác bằng thông tin trực tiếp; dãy số không chứng minh có người thứ ba hoặc người đang lừa mình.",
    "Khi thấy một quan hệ đổi khác, bạn đã hỏi và nhận được thông tin gì?",
    "Viết riêng điều biết chắc và điều chưa được xác nhận.",
  ],
  [
    "TM",
    "TY",
    79,
    "Sức hành động gắn với sự chăm lo",
    "Nguồn mô tả Tuyệt Mệnh chuyển sang Thiên Y bằng hành động mạnh, trách nhiệm và sự hào phóng với người mình quan tâm. Chủ đề cần cân bằng là làm nhiều cho người khác nhưng vẫn chừa giới hạn cho bản thân.",
    "Bạn đã thống nhất nhu cầu trước khi gánh vác giúp người khác chưa?",
    "Hỏi rõ điều cần hỗ trợ và phần mình có thể nhận.",
  ],
  [
    "TM",
    "DN",
    81,
    "Quyết liệt được đặt vào kỷ luật",
    "Slide 81 nhấn mạnh nỗ lực, chuyên tâm và trách nhiệm, đồng thời lưu ý sự cứng rắn. Có thể đọc đây là yêu cầu biến ý chí thành cách làm bền, tránh để mục tiêu lấn hết sự linh hoạt và thời gian dành cho quan hệ.",
    "Khi kế hoạch gặp dữ kiện mới, bạn đã điều chỉnh thế nào?",
    "Đặt mốc xem lại kế hoạch và phân công phần có thể chia sẻ.",
  ],
  [
    "TM",
    "SK",
    82,
    "Hành động mạnh đi cùng khả năng mở đường",
    "Nguồn nêu khai mở, chiến lược và cố vấn, với sự phóng khoáng và tinh tế trong quan hệ. Chiều này bắt đầu bằng ý chí hành động rồi hướng ra kết nối; cần đối chiếu năng lực tổ chức với nhiệt huyết ban đầu.",
    "Một việc bạn mở đầu đã được nối tiếp bằng kế hoạch nào?",
    "Chuyển sáng kiến thành bước thử có người phụ trách.",
  ],
  [
    "TM",
    "PV",
    83,
    "Một quyết định mạnh có thể bị kéo dài",
    "Nguồn mô tả xung động đi cùng sự kéo dài và khó buông. Điểm cần soi chiếu là có đang tiếp tục một việc vì đã bỏ nhiều công sức, dù điều kiện ban đầu không còn phù hợp hay không.",
    "Tiêu chí nào khiến bạn tiếp tục, đổi hướng hoặc dừng một việc?",
    "Viết điều kiện dừng trước khi nhận thêm nguồn lực hay trách nhiệm.",
  ],
  [
    "TM",
    "HH",
    84,
    "Quyết liệt gặp phản ứng bằng lời",
    "Nguồn ghép sai lầm trong quyết định với mâu thuẫn, tranh cãi và thiếu hỗ trợ. Có thể dùng như câu hỏi về việc hành động quá sớm rồi bảo vệ quyết định bằng lời mạnh, khiến việc sửa sai khó hơn.",
    "Khi bị phản biện, bạn đã kiểm tra vấn đề hay bảo vệ vị thế?",
    "Tách việc thừa nhận một sai sót khỏi giá trị của bản thân.",
  ],
  [
    "TM",
    "NQ",
    85,
    "Hành động mạnh trong tình huống khó đoán",
    "Slide 85 nhấn mạnh biến động, hiểu lầm và môi trường cạnh tranh. Trọng tâm khi tự đối chiếu là chất lượng thông tin trước quyết định lớn, thay vì coi khả năng ứng biến là đủ để kiểm soát mọi hệ quả.",
    "Bạn đã chuẩn bị phương án nào nếu giả định chính không đúng?",
    "Kiểm tra giả định và giới hạn phạm vi của bước thử.",
  ],
  [
    "TM",
    "TM",
    86,
    "Ý chí mạnh được lặp lại",
    "Nguồn nhấn mạnh gan lì, bảo vệ điều mình coi trọng nhưng khó dừng và khó quên tổn thương. Nên đọc theo hai mặt: sức bền có ích và nguy cơ mắc kẹt trong cách nghĩ được/mất, thắng/thua.",
    "Một lần bạn chủ động dừng lại đã đem lại kết quả gì?",
    "Định nghĩa thành công bằng kết quả cần đạt, không bằng việc thắng tranh luận.",
  ],
  [
    "TM",
    "LS",
    87,
    "Quyết liệt đi vào vùng cảm xúc",
    "Nguồn đặt năng lực nghề nghiệp cạnh sự rối ren trong tương tác và cảm xúc. Câu hỏi cần đối chiếu là quyết định dứt khoát có đang được dùng để giải một vấn đề cần lắng nghe và thương lượng hay không.",
    "Trong một vấn đề quan hệ, điều gì đã được nghe trước khi hành động?",
    "Hỏi lại nhu cầu của hai bên trước khi chọn cách giải quyết.",
  ],
  [
    "DN",
    "SK",
    89,
    "Trách nhiệm được mở rộng bằng kết nối",
    "Nguồn mô tả sau khi có vị trí và năng lực thì mở rộng quan hệ, quan tâm tinh thần người khác. Chiều này bắt đầu từ trách nhiệm đã có rồi bổ sung sự mềm mại; khác với dùng một cơ hội để bước vào vai trò mới.",
    "Khi có trách nhiệm trong nhóm, bạn duy trì sự gần gũi thế nào?",
    "Dành một cuộc trao đổi để nghe nhu cầu ngoài chỉ tiêu công việc.",
  ],
  [
    "DN",
    "TY",
    90,
    "Chuyên môn trước, sự hỗ trợ theo sau",
    "Slide 90 đặt trọng tâm vào nâng cao năng lực chuyên môn trước khi tìm thành quả. Chủ đề để đối chiếu là xây sự tin cậy từ thực lực và vai trò rõ ràng, thay vì kỳ vọng được hỗ trợ chỉ nhờ thiện chí.",
    "Một kết quả bạn nhận được dựa trên năng lực cụ thể nào?",
    "Chọn một kỹ năng có tiêu chí đầu ra để rèn luyện.",
  ],
  [
    "DN",
    "DN",
    91,
    "Trách nhiệm và tiêu chuẩn được nhắc lại",
    "Nguồn nhấn mạnh tự lực, nỗ lực và gánh vác, đồng thời mô tả sự cố chấp, ít biểu lộ tình cảm. Cần xem tiêu chuẩn có giúp công việc tiến triển hay đang khiến mọi việc phải theo đúng cách của một người.",
    "Một việc bạn có thể giao cho người khác đang được xử lý ra sao?",
    "Thỏa thuận kết quả cần đạt và cho phép cách thực hiện khác nhau.",
  ],
  [
    "DN",
    "PV",
    92,
    "Kỷ luật được duy trì lâu dài",
    "Phục Vị theo sau Diên Niên được nguồn gắn với sự kéo dài của nỗ lực, gánh vác và tự lực. Nội dung này gợi xem tính bền bỉ có được đi kèm điều chỉnh, hay trách nhiệm cũ đang mặc nhiên kéo dài mà chưa được xem lại.",
    "Một trách nhiệm lâu năm còn phù hợp với hiện tại đến đâu?",
    "Định kỳ rà lại cam kết thay vì tiếp tục chỉ vì đã quen.",
  ],
  [
    "DN",
    "HH",
    93,
    "Từ vị thế đến cách dùng lời nói",
    "Nguồn lưu ý khi có quyền lực có thể nói thiếu cân nhắc, tạo tranh cãi hoặc bất mãn. Chủ đề tự đối chiếu là cách đưa yêu cầu và phản hồi: người khác có hiểu nội dung hay chỉ cảm thấy bị phê bình và kiểm soát.",
    "Trong một lần góp ý, người nhận đã hiểu điều bạn muốn thay đổi chưa?",
    "Nêu tiêu chí công việc cụ thể và nghe phản hồi trước khi kết luận.",
  ],
  [
    "DN",
    "LS",
    95,
    "Kỷ luật gặp nhu cầu cảm xúc",
    "Nguồn chỉ bàn chuyển hóa cơ bản, không đủ quy tắc để tính sự “chế hóa” đặc thù. Phần rõ ràng nhắc đến buông lỏng mục tiêu và bị quan hệ chi phối; cần đối chiếu cách giữ ranh giới giữa vai trò và cảm xúc.",
    "Một quan hệ đã ảnh hưởng đến tiêu chuẩn hoặc lịch làm việc thế nào?",
    "Giữ một ranh giới công việc rõ ràng và thỏa thuận nhu cầu riêng.",
  ],
  [
    "DN",
    "TM",
    96,
    "Vị thế và sự tự tin cần điểm dừng",
    "Ở ảnh thứ hai của slide 96, nguồn nhấn mạnh tự tin quá mức khi cầm quyền dẫn tới quyết sách sai. Chủ đề cần đọc là khả năng tiếp nhận phản biện khi đã có kinh nghiệm hoặc thành tựu, không phải dự báo mất chức hay đổ vỡ.",
    "Ai đã phản biện quyết định gần đây, và bạn xử lý dữ kiện đó ra sao?",
    "Xác định một điều kiện khiến mình phải xem lại quyết định.",
  ],
  [
    "DN",
    "NQ",
    97,
    "Trách nhiệm gặp đổi hướng và nghi ngờ",
    "Nguồn mô tả sau vị thế là khó đoán, thiếu tin tưởng và công việc rối ren. Cần tự xem việc đổi kế hoạch đã được giải thích minh bạch chưa, đặc biệt khi người khác đang dựa vào sự nhất quán của mình.",
    "Khi đổi ý, bạn đã giải thích lý do và phần việc thay đổi thế nào?",
    "Ghi rõ căn cứ thay đổi và thông báo cho người chịu ảnh hưởng.",
  ],
  [
    "HH",
    "TY",
    99,
    "Ngôn từ tạo sự gần gũi và giá trị",
    "Nguồn nhấn mạnh biện luận, phản ứng nhanh và dùng ngôn từ truyền tải cảm xúc. Chiều này đọc từ khả năng biểu đạt tới sự chăm lo: lời nói có giá trị khi giúp người khác hiểu và khi được làm theo bằng hành động.",
    "Một lời thuyết phục đã được thực hiện bằng hành động nào?",
    "Đối chiếu lời hứa với một việc có thể hoàn thành và kiểm tra.",
  ],
  [
    "HH",
    "SK",
    101,
    "Giao tiếp để tháo gỡ trở ngại",
    "Slide 101 mô tả lấy giao tế để vượt chỗ bế tắc và mở thêm cơ hội. Điểm cần soi chiếu là dùng lời nói để xây một kết nối giải quyết được vấn đề, thay vì chỉ tạo ấn tượng tốt trong cuộc gặp.",
    "Sau một cuộc trao đổi thuận lợi, vấn đề đã được giải quyết đến đâu?",
    "Chốt bước tiếp theo và người sẽ thực hiện.",
  ],
  [
    "HH",
    "DN",
    103,
    "Thuyết phục gắn với vai trò dẫn dắt",
    "Nguồn nói tới đàm phán, kiến thức và ngoại giao để tạo vị trí, đồng thời cảnh báo sự quá nghiêm và thiếu mềm dẻo. Cần kiểm tra sức ảnh hưởng đến từ chất lượng lập luận hay từ áp lực khiến người khác khó bất đồng.",
    "Người cùng làm có thể phản đối quan điểm của bạn bằng cách nào?",
    "Mời một phản biện cụ thể trước khi chốt phương án.",
  ],
  [
    "HH",
    "PV",
    106,
    "Một chuyện chưa giải quyết trở thành vòng lặp",
    "Nguồn mô tả vấn đề nhỏ kéo dài vì chưa được xử lý tận gốc. Chủ đề ở đây là nhận diện điều đang tái diễn và trách nhiệm chưa rõ; không thể coi sự lặp của một nhóm là bằng chứng biến cố chắc chắn xảy ra.",
    "Một vấn đề lặp lại có phần nguyên nhân nào vẫn chưa được giải quyết?",
    "Chọn một nguyên nhân có thể tác động và đặt mốc kiểm tra lại.",
  ],
  [
    "HH",
    "HH",
    109,
    "Lời nói và phản ứng cần được xem lại",
    "Nguồn nhấn mạnh trở ngại trong công việc và sự cần thiết của trí tuệ, hỗ trợ. Khi đặt cạnh đặc tính Họa Hại, có thể soi chiếu một cách tranh luận đang lặp lại; không suy ra người khác là “tiểu nhân” từ dãy số.",
    "Một phản hồi lặp lại từ nhiều người đang nói về hành vi cụ thể nào?",
    "Nhờ một người đáng tin góp ý cách trao đổi, rồi thử điều chỉnh.",
  ],
  [
    "HH",
    "LS",
    111,
    "Từ lời nói đến tổn thương cảm xúc",
    "Nguồn phân biệt hiểu lầm, lạnh nhạt ban đầu với xung đột rõ hơn ở phần sau. Điểm đáng xem là câu nói chưa được giải thích có đang tích tụ thành cách nhìn tiêu cực về nhau hay không.",
    "Một hiểu lầm gần đây đã được hỏi lại hay chỉ được giữ trong lòng?",
    "Làm rõ một câu nói và ý định của nó trước khi tranh luận tiếp.",
  ],
  [
    "HH",
    "TM",
    113,
    "Phát biểu mạnh nối với hành động khó rút lại",
    "Nguồn nhấn mạnh quyết định thiếu kiểm soát và tổn thương có thể bắt đầu từ một lời nói lúc nóng. Chủ đề để soi chiếu là khoảng dừng giữa phản ứng, lời tuyên bố và việc thực sự làm theo.",
    "Điều gì giúp bạn không biến một câu nói khi giận thành quyết định lâu dài?",
    "Hoãn cam kết hoặc quyết định khi đang muốn chứng tỏ mình đúng.",
  ],
  [
    "HH",
    "NQ",
    115,
    "Thông tin, phán đoán và hệ quả dây chuyền",
    "Slide 115 nhấn mạnh thông tin sai, phán đoán lệch và tâm lý muốn gỡ lại sai lầm. Cần kiểm tra chuỗi căn cứ: một quyết định mới đang dựa vào dữ kiện hay chỉ nhằm bảo vệ quyết định trước đó.",
    "Bạn đã kiểm chứng nguồn tin và giả định nào trước khi đổi kế hoạch?",
    "Dừng để kiểm tra lại, không tự thêm một bước rủi ro nhằm sửa bước trước.",
  ],
  [
    "SK",
    "TY",
    119,
    "Kết nối chuyển thành chăm lo cụ thể",
    "Nguồn bắt đầu từ gặp gỡ và giao tế rồi nói đến thấu hiểu, chăm sóc bằng hành động. Chiều này nhấn mạnh biến thiện cảm và sự giúp đỡ thành giá trị thực, khác với Thiên Y đứng trước rồi mới mở ra kết nối.",
    "Một mối quen biết đã tạo ra việc hỗ trợ cụ thể nào?",
    "Chọn một hành động quan tâm đúng nhu cầu thay vì chỉ duy trì thiện cảm.",
  ],
  [
    "SK",
    "SK",
    121,
    "Sự cởi mở và các mối quan hệ được nhắc lại",
    "Nguồn nhấn mạnh giao tế mạnh, nhiều sở thích và biết chiều người khác, đồng thời nói đây không phải kết cấu tích lũy. Chủ đề cần xem là mở rộng kết nối có đang đi cùng việc duy trì ưu tiên và hoàn tất cam kết.",
    "Nhiều lời mời và sở thích đang ảnh hưởng đến việc quan trọng thế nào?",
    "Giữ một ưu tiên rõ trước khi nhận thêm lời mời.",
  ],
  [
    "SK",
    "DN",
    123,
    "Cơ hội chuyển thành kỷ luật và vị trí",
    "Slide 123 mô tả thông qua cơ hội, người hỗ trợ mà có vai trò và nỗ lực lớn hơn. Khi tự đối chiếu, hãy nhìn bước chuyển từ được mở cửa sang tự chịu trách nhiệm và rèn chuyên môn, thay vì coi cơ hội là thành tựu sẵn có.",
    "Một cơ hội mới đã yêu cầu bạn tăng kỹ năng hay trách nhiệm nào?",
    "Biến cơ hội thành mục tiêu học tập hoặc đầu ra có thể đánh giá.",
  ],
  [
    "SK",
    "PV",
    125,
    "Duy trì sự hỗ trợ và gắn bó",
    "Nguồn nối Sinh Khí với sự trợ lực bền và quan hệ có tính tri kỷ. Có thể đọc đây là chủ đề giữ những kết nối đáng quý bằng sự đều đặn; điều cần xét thêm là hai bên có cùng nhu cầu và giới hạn hay không.",
    "Một mối gắn bó lâu dài được hai bên nuôi dưỡng bằng việc gì?",
    "Thống nhất cách liên lạc và hỗ trợ thay vì mặc nhiên chờ đợi.",
  ],
  [
    "SK",
    "HH",
    127,
    "Thiện cảm có thể bị thay đổi bởi lời nói",
    "Nguồn nhấn mạnh lỡ lời, hiểu lầm và việc quan hệ từ vui thành buồn. Phần hữu ích để tự kiểm tra là sau một kết nối tốt, mình có giữ độ rõ ràng của lời hứa, thỏa thuận và cách trao đổi khi bất đồng hay không.",
    "Một quan hệ đổi khác sau câu nói hoặc thỏa thuận chưa rõ nào?",
    "Xác nhận lại điều đã thống nhất và sửa hiểu lầm sớm.",
  ],
  [
    "SK",
    "LS",
    129,
    "Từ cởi mở đến kỳ vọng cảm xúc",
    "Nguồn mô tả cảm xúc mạnh có thể kéo quyết định theo quan hệ và giải trí. Cần phân biệt sự thu hút ban đầu với mức hiểu biết thật về nhau; không suy ra phản bội hay chuyện riêng tư của người khác từ tổ hợp này.",
    "Kỳ vọng của bạn về một quan hệ đã được hai bên nói rõ chưa?",
    "Hỏi điều mỗi bên mong muốn thay vì suy từ thiện cảm ban đầu.",
  ],
  [
    "SK",
    "TM",
    131,
    "Một cơ hội đi tới quyết định quá nhanh",
    "Nguồn đặt lời mời và tin tức cạnh sự liều lĩnh, quyết đoán cực đoan. Trọng tâm để soi chiếu là khoảng kiểm chứng giữa nghe về một cơ hội và hành động mạnh; nhiệt tình ban đầu cần được tách khỏi mức chắc chắn của thông tin.",
    "Bạn đã kiểm tra điều gì trước khi nhận một lời mời hấp dẫn?",
    "Đặt điều kiện thử nhỏ và điều kiện dừng trước khi cam kết.",
  ],
  [
    "SK",
    "NQ",
    133,
    "Kết nối rộng đi cùng nhiều ý tưởng",
    "Slide 133 nêu phạm vi giao tiếp rộng, thích tranh luận, hào phóng và nhiều ý tưởng nhưng dễ ảo tưởng. Chủ đề cần cân bằng là phân biệt khả năng có thể làm với bằng chứng đã làm được, để sự cởi mở không trở thành dàn trải.",
    "Ý tưởng nào đã được kiểm tra bằng một kết quả thực tế?",
    "Chọn một ý tưởng để thử và một tiêu chí đánh giá trước khi mở thêm hướng.",
  ],
];

export const combinationReadings: Record<string, CombinationReading> =
  Object.fromEntries(
    combinationRows.map(
      ([first, second, source, theme, interpretation, question, practice]) => [
        `${first}>${second}`,
        { first, second, source, theme, interpretation, question, practice },
      ],
    ),
  );

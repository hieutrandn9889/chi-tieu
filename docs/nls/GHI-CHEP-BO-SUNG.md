# Ghi chép bổ sung từ file Excel

Ngày: 25/10/2026. Nguồn: `CÁC TU TRUONG NANG LUONG.xlsx`, ghi chép học tập do chủ dự án cung cấp, ngoài bộ slide TINH HOA NLS 6868.

File gốc và bản chuyển Markdown nằm trong `data_docs/`, **không đưa lên Git** (đã thêm vào `.gitignore`) vì có họ tên, số CCCD, ngày giờ sinh và nhiều số điện thoại người thật.

## Cách chuyển đổi

Excel được chuyển sang Markdown trước khi đọc, bằng script đọc XML của `.xlsx` (thư viện chuẩn Python). Kết quả có 5 sheet và đủ 517 ô có dữ liệu. Ô gộp được ghi “〃”; màu nền và công thức không được giữ.

| Sheet | Nội dung |
| --- | --- |
| NL co ban | Bảng 8 từ trường × 64 cặp; tính cách, tài vận, tình cảm, sự nghiệp, quý nhân, sức khỏe, học tập, con cái theo nhóm |
| NLcac tu truong ket hop | Ma trận kết hợp 8×8, ghi chú số 0/5, biển số theo quẻ dịch |
| NL chi tiet moi tu truong | Ý nghĩa riêng từng cặp, kèm ví dụ số điện thoại người thật |
| Luận cccd | Một ví dụ luận CCCD người thật, có số năm “chạy vận” theo vị trí |
| Nhận biết sdt xấu | Quy tắc số điện thoại xấu và quý cách |

## Đối chiếu với slide

- **Bảng 64 cặp:** khớp 8/8 nhóm với bảng trong `src/lib/nls.ts` (đã có test). Sheet 2 có một lỗi gõ: ô lẽ ra là `34` ghi `0`.
- **Số 0/5:** ghi chú trong Excel (0 ẩn tàng, đi cùng cát hay hung đều xấu đi; 5 kích phát, hung đi cùng 5 thì hiển lộ xấu, cát đi cùng 5 thì bạo phát) khớp với slide 26–28. Excel được dùng để đối chiếu khi hiệu đính slide 26 và 27; bản chép trong `hieu-dinh-slides.json` theo ảnh slide.

## Phần đã đưa lên web

| Nội dung | Cách dùng | Vị trí |
| --- | --- | --- |
| Giải thích cặp 0/5 | Theo slide 26–28, không theo Excel. Số 0 đứng sau cặp (`190`) hoặc chen giữa cặp (`109`) lấy chủ đề của nhóm ở slide 26; số 5 lấy câu cát/hung ở slide 27, Phục Vị ở slide 28; số 0 cuối dãy theo dòng 11 slide 26. Dòng sức khỏe của Tuyệt Mệnh không được diễn giải. | `explainSpecialDigits` trong `src/lib/nls.ts`, mục “Giữ nguyên số 0 và số 5” của báo cáo |
| Phân nhóm cát/hung | Lấy từ tiêu đề bảng Excel (TY, SK, DN cát; LS, TM, HH, NQ hung). Phục Vị để trung tính theo slide 8. | `supplementTone` |
| Mô tả theo nhóm | Tóm lược trung tính ba mục: tính cách, công việc, học tập | `groupNotes`; thẻ nhóm trong báo cáo, trang `/tu-truong/:id` |
| Ý nghĩa riêng từng cặp | 32 ghi chú, mỗi ghi chú cho một cặp và cặp đảo (Phục Vị theo nhóm hai cặp như Excel) | `pairNotes`; thẻ nhóm trong báo cáo, trang `/tu-truong/:id` |
| Nhận biết số điện thoại | Tự xét: hai hung tinh đứng cạnh nhau, có số 0 (trừ số 0 đầu của nhà mạng), hai cát tinh đứng cạnh nhau, chuyển từ hung sang cát. Không tự xét “hai hung cùng năng lượng ở tầng thấp” và “hung lớn cát nhỏ” vì ghi chép chưa định nghĩa “tầng thấp”, “lớn/nhỏ”. | `checkPhonePattern`; chỉ hiện khi chọn loại “Số điện thoại” |

Mọi phần lấy từ Excel đều ghi nhãn “Ghi chép bổ sung (ngoài slide)” và có viền nét đứt để tách khỏi nội dung slide.

## Phần không đưa lên web

Theo lựa chọn của chủ dự án, các nội dung sau bị loại và có test chặn từ khóa trong `tests/nls.test.mjs`:

- Sức khỏe, bệnh nặng, ung thư, đột tử, tự sát, sảy thai, vô sinh, tai nạn.
- Ngoại tình, người thứ ba, sát phu, khắc phu; giới hạn “nữ không nên dùng”, “nam dùng thì…”.
- Vong âm, tâm linh.
- Mọi ví dụ người thật: họ tên, CCCD, số điện thoại, chuyện riêng.
- Biển số xe theo quẻ dịch và cách chọn ngày “chấn biển”.

Ngoài ra, các câu mang tính buộc tội hoặc dự báo tài chính trong ghi chép (ví dụ “làm việc mờ ám”, “vay không trả”, “dễ vỡ nợ”) cũng không đưa vào tóm lược.

## Chưa làm

- **Lưu niên theo vị trí:** sheet “Luận cccd” tính cặp đầu 10 năm, các cặp giữa 5 năm, cặp cuối 15 năm. Bản luận giải PDF mẫu lại chia khác. Slide 2 chỉ có đề mục “xác định lưu niên”. Website vẫn giữ nguyên tắc không quy đổi vị trí thành tuổi cho đến khi nguồn thống nhất.
- **Ma trận kết hợp 8×8 của Excel:** phần luận kết hợp đã được chủ dự án gỡ khỏi báo cáo.

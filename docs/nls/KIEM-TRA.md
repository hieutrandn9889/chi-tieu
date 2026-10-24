# Kiểm tra bản local Năng lượng số

Ngày: 24/10/2026. Node thực tế: v24.21.0. Phạm vi là checkout `chi-tieu` và preview tại `http://127.0.0.1:5176/`.

## Chuyển đổi và nguồn

- Có đủ 143 mục Markdown/JSON theo đúng số thứ tự PowerPoint.
- 133 ảnh đối chiếu và 133 thumbnail. Ảnh nguồn khoảng 34,93 MiB; thumbnail khoảng 5,56 MiB. Thư viện tải thumbnail cho ô xem trước, dùng ảnh lớn khi mở trang.
- Slide trống: 47, 136–143. Các slide này có bộ lọc riêng, không được tính vào bài học.
- Slide 117 giữ chữ trích xuất trực tiếp từ PowerPoint.
- Đã đối chiếu 14 slide trọng tâm; 119 slide vẫn ghi nhãn OCR chưa hiệu đính toàn văn. Cụm chữ chưa rõ và lỗi lặp tên trong nguồn được đánh dấu.
- SHA-256 và danh sách slide có trong `slides-manifest.json` và `conversion-report.json`.

## Kiểm tra tự động

`npm test`: 8/8 qua kiểm tra. Các trường hợp gồm phủ đủ 64 cặp cơ bản và không trùng, đối chiếu các mốc đã xem ảnh, cặp chồng lấn, số 0/5 và nguồn riêng, dữ liệu sai/quá dài, thứ tự kết hợp, tìm không dấu và toàn bộ liên kết ảnh/Markdown/thumbnail.

`npm run build`: thành công trên mã nguồn cuối cùng. `npm run typecheck:worker`: thành công. Backend không có thay đổi nghiệp vụ.

## Kiểm tra trên trình duyệt

| Luồng | Kết quả quan sát |
| --- | --- |
| Dãy 143168 | 14 Sinh Khí, 43 Diên Niên, 31 Thiên Y, 16 Lục Sát, 68 Thiên Y |
| Dãy 00105 | Giữ nguyên các cặp 00, 01, 10, 05; chỉ dẫn đọc quy tắc riêng |
| Cặp 55 | Chưa phân loại vào bảng cơ bản, dẫn đúng slide 27 về số 5 |
| Dữ liệu abc14 | Có thông báo lỗi, không tạo kết quả một phần |
| Sinh Khí + Thiên Y | Dẫn đúng slide 119; chiều Thiên Y + Sinh Khí dẫn slide 52 |
| Phục Vị + Thiên Y | Hiển thị chưa có bài nguồn đầy đủ; không dùng bài đảo chiều thay thế |
| Tìm dien nien | Tìm được nội dung Diên Niên không cần gõ dấu, mở đúng slide 13 |
| Bản chép slide 13 | Hiển thị nhãn đã đối chiếu ảnh |
| Bộ lọc slide trống | Có 9 mục; mở slide 143, nút Trang sau bị vô hiệu hóa |
| Chữ gốc slide 117 | Hiển thị đủ tên nhóm và tiêu đề Ngũ Quỷ chuyển hóa |
| Tiến độ học | Tăng 0 lên 1, vẫn là 1 sau reload, bỏ đánh dấu trả lại 0; không dùng thao tác xóa toàn bộ dữ liệu |
| Sáng/tối | Nút đổi giao diện hoạt động; đã trả về giao diện sáng sau kiểm tra |
| Menu mobile | Mở được và có liên kết trực tiếp đến Tra cứu |

Đã xem năm trang chính ở viewport 320px. Trang chủ ban đầu tràn 12px do minimum nội tại của ô nhập trong CSS Grid; đã sửa bằng `minmax(0, ...)` và `min-width: 0`. Kiểm tra lại cho thấy chiều rộng nội dung bằng viewport cả trước và sau khi có kết quả tra cứu. Các trang còn lại cũng không tràn ngang. Desktop kiểm tra ở 1280px, thêm ảnh tham chiếu mobile 390px, sau đó bỏ override viewport.

Ảnh tham chiếu local: `../../.cache/nls-desktop.jpg` và `../../.cache/nls-mobile.jpg`. Chúng là ảnh kiểm tra, không cần đưa vào bundle website.

## Giới hạn bàn giao

Đã triển khai production theo yêu cầu tiếp theo, xem [TRIEN-KHAI.md](TRIEN-KHAI.md). Chưa kiểm tra hoặc phát triển một thuật toán luận giải sức khỏe, tài chính, lưu niên, CCCD hay nội lực. Các phần thiếu quy tắc rõ trong nguồn được giữ làm câu hỏi nghiên cứu trong `NGHIEN-CUU.md`.

Auto-pilot tại `http://localhost:5173/` vẫn trả đúng tiêu đề của project đó. Preview NLS dùng cổng riêng `5176`, backend `8791`; không dùng chung PID hoặc shortcut Auto-pilot.

## Đối chiếu bài học workspace

Lỗi Grid trên màn hình hẹp đã đối chiếu với devkit **gotchas #171 – Allow long generated paths to shrink inside responsive grid cards**. Mục này đã giải thích đúng nguyên nhân `min-width: auto`, hướng sửa và kiểm tra ở màn hình hẹp, nên không thêm bài trùng. Bài #322 đã ghi nguyên nhân xung đột cổng trong phiên trước; #323 đã ghi quy trình OCR ảnh tiếng Việt. Không có lỗi mới cần tạo thêm bài devkit trong lần hoàn thiện này.

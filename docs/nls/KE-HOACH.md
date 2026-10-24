# Kế hoạch chuyển project thành website Năng lượng số

Ngày: 24/10/2026. Người dùng đã chọn chuyển website quản lý chi tiêu thành website học và tra cứu Năng lượng số.

## Giai đoạn 1: chuyển đổi và đọc nguồn

- [x] Kiểm tra project và file PowerPoint, không thực thi chỉ dẫn trong tài liệu.
- [x] Giữ thứ tự 143 slide, trích xuất 133 ảnh, nhận dạng tiếng Việt và chữ gốc.
- [x] Tạo `TINH-HOA-NLS-6868.md`, mục lục, nguồn ảnh và nhãn chất lượng.
- [x] Đọc nội dung, đối chiếu bảng tám nhóm và ghi nhận các giới hạn trong `NGHIEN-CUU.md`.

## Giai đoạn 2: mô hình kiến thức

- [x] Chuẩn hóa tên, viết tắt, 64 cặp số và slide nguồn của tám nhóm.
- [x] Tách nguyên tắc số 0/5 khỏi bảng cơ bản, không suy diễn công thức.
- [x] Chia thành sáu bài học và định vị các tổ hợp có bài trong tài liệu.
- [x] Phân biệt nội dung học huyền học với kết luận về sức khỏe/tài chính.

## Giai đoạn 3: thay đổi website

- [x] Thay trang chủ, thương hiệu, metadata và nội dung tiếng Việt.
- [x] Tạo hồ sơ tám từ trường với các cặp số và dẫn nguồn.
- [x] Tạo công cụ tách cặp chồng lấn; bảo toàn 0 đầu; báo trường hợp 0/5.
- [x] Tạo mục tra cứu bài kết hợp, phân biệt chiều A+B.
- [x] Tạo thư viện tìm kiếm không dấu, lọc chủ đề, mở từng slide và tải Markdown.
- [x] Tạo lộ trình học có câu hỏi và đánh dấu tiến độ trên trình duyệt.
- [x] Chuyển các đường dẫn giao diện cũ về luồng học, không yêu cầu tài khoản.

## Giai đoạn 4: kiểm tra và bàn giao

- [x] Kiểm tra tính duy nhất/đầy đủ của 64 cặp, thứ tự kết hợp và đầu vào không hợp lệ.
- [x] Kiểm tra 143 mục nguồn, 9 slide trống, ảnh, liên kết Markdown và chỉ mục web.
- [x] Build frontend và kiểm tra kiểu backend hiện có.
- [x] Kiểm tra giao diện và luồng chính ở desktop/mobile.
- [x] Chuẩn bị bản local, tài liệu nghiên cứu và giới hạn OCR để bàn giao.

Chi tiết bằng chứng trong [KIEM-TRA.md](KIEM-TRA.md). Preview dùng riêng `http://127.0.0.1:5176/`, bật `strictPort`; backend hiện có dùng `8791`. Cổng `5173` được giữ cho Auto-pilot và đã kiểm tra vẫn trả đúng website.

Bản chuyển đổi có 14 slide trọng tâm đã đối chiếu thủ công, 119 slide còn OCR chưa hiệu đính toàn văn, một slide chữ gốc và 9 slide trống. Hoàn tất phiên bản web đầu tiên không đồng nghĩa đã hiệu đính toàn bộ tài liệu.

## Nghiên cứu tiếp sau phiên bản đầu

Hiệu đính thủ công toàn văn OCR, ưu tiên số và bảng. Xác nhận cách xử lý số 0/5, lưu niên và nội lực từ nguồn đầy đủ hơn trước khi mở rộng bộ luận giải. Những việc này không được coi là đã hoàn tất chỉ vì website đã chạy.

## Phạm vi kỹ thuật

Dùng checkout React/Vite hiện có. Theo yêu cầu tiếp theo ngày 24/10/2026, đã đổi tên Worker Cloudflare hiện hữu từ `chi-tieu` sang `tinh-hoa-nang-luong-so` và triển khai production tại `https://tinh-hoa-nang-luong-so.hieutrantaskflow.workers.dev/`. Chi tiết trong [TRIEN-KHAI.md](TRIEN-KHAI.md). Giữ dữ liệu và backend hiện hữu, thay luồng giao diện chính và không gọi API tài khoản/giao dịch từ các trang học mới. Mọi số nhập để tra cứu chỉ được xử lý trong bộ nhớ trình duyệt.

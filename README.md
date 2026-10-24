# Tinh Hoa Năng Lượng Số

Website production: **https://tinh-hoa-nang-luong-so.hieutrantaskflow.workers.dev/**.

Worker Cloudflare đã đổi tên từ `chi-tieu` thành `tinh-hoa-nang-luong-so` và triển khai nội dung mới. Chi tiết phiên bản và bằng chứng trong [TRIEN-KHAI.md](docs/nls/TRIEN-KHAI.md).

Project trong thư mục `chi-tieu` đã chuyển thành website tiếng Việt để học và tra cứu từ tài liệu **TINH HOA NLS 6868**. Giao diện chính gồm trang giới thiệu, tám từ trường, tra cứu cặp số và bài kết hợp, sáu bài học có tiến độ, thư viện 143 slide.

## Luận giải dãy số

Trang `/tra-cuu` có báo cáo gồm thống kê các cặp, phân bố nhóm, chủ đề theo tài liệu, vị trí từng cặp. Báo cáo không còn hiển thị phần luận kết hợp hai từ trường. Chấp nhận 2–32 chữ số, giữ nguyên số 0 ở đầu; dãy 12 chữ số không được dùng để xác thực CCCD hoặc suy ra thông tin định danh. Nút ẩn/hiện và xóa dãy giúp kiểm soát dữ liệu trên màn hình. Dãy số không được gửi qua API, ghi log, lưu vào URL hoặc bộ nhớ bền vững.

Báo cáo tóm lược quan điểm tài liệu để tham khảo; tần suất không phải điểm tốt/xấu hoặc bằng chứng về một cá nhân. Cặp chứa 0/5 được đánh dấu riêng. Bài thiếu nguồn không lấy chiều ngược để thay thế. Chi tiết và bằng chứng kiểm tra tại [LUAN-GIAI.md](docs/nls/LUAN-GIAI.md).

Ô tra cứu có bộ chọn loại số: CCCD (bắt buộc 12 số, chỉ giải thích cấu trúc theo slide 4, không giải mã tỉnh/giới tính/năm sinh), số điện thoại (đổi +84 thành 0), số nhà và biển số (chỉ lấy chữ số theo thứ tự, báo các ký tự đã bỏ qua), dãy khác. Cả năm loại dùng chung một cách luận cặp, vì tài liệu chưa có quy tắc riêng cho từng loại.

Phần luận sâu hiện có 8 hồ sơ nhiều khía cạnh. Báo cáo đọc mạch các nhóm, giữ các đoạn ngắt 0/5 và nhận diện lặp liền nhau. Dữ liệu 48 chiều kết hợp vẫn còn trong mã nhưng không hiển thị. Mục lục trong báo cáo giúp đi thẳng tới từng phần.

## Chạy local

```powershell
npm install
npm run dev -- --host 127.0.0.1
```

Mở **http://127.0.0.1:5176/**. Cổng `5176` là cố định và bật `strictPort`: nếu cổng đang bận, Vite báo lỗi thay vì tự chạy ở cổng khác. Auto-pilot sử dụng riêng `5173`; không dùng cổng đó cho project này.

Các trang học và tra cứu chạy hoàn toàn trên frontend. Nếu cần chạy backend hiện có, dùng `npm run dev:worker` tại cổng `8791`. Dữ liệu/backend cũ được giữ nguyên. Các đường dẫn giao diện cũ `/app`, `/login`, `/signup` chuyển về lộ trình học.

## Tài liệu

- [Bản PowerPoint chuyển sang Markdown](docs/nls/TINH-HOA-NLS-6868.md).
- [Phân tích nội dung, bảng kiến thức và kế hoạch nghiên cứu tiếp](docs/nls/NGHIEN-CUU.md).
- [Kế hoạch triển khai và trạng thái từng bước](docs/nls/KE-HOACH.md).
- `docs/nls/slides-manifest.json`: thứ tự slide, chữ gốc, nguồn ảnh và SHA-256 của PowerPoint.
- `docs/nls/hieu-dinh-slides.json`: các bản chép đã đối chiếu ảnh; không ghi đè kết quả OCR thô trong cache.
- `docs/nls/conversion-report.json`: số slide đã đối chiếu, bản OCR còn lại, slide trống và chữ gốc.

File có 143 slide, 133 ảnh nhúng được trích xuất, 9 slide trống và một slide dùng chữ PowerPoint. Đã hiệu đính 15 slide trọng tâm; 118 slide vẫn có bản OCR chưa hiệu đính toàn văn. Ảnh đối chiếu luôn được giữ trong thư viện. Nội dung huyền học phản ánh quan điểm tài liệu nguồn.

## Luồng chuyển đổi có thể chạy lại

Cần Python có Pillow và Node.js. Phiên bản Node đã kiểm tra trong môi trường này: `v24.21.0`.

```powershell
python scripts/extract-presentation.py "C:\Users\hieu.tran8\Downloads\Telegram Desktop\TINH HOA NLS 6868.pptx"
npm install --prefix .cache/ocr tesseract.js@7 --no-save --no-audit --no-fund
node scripts/ocr-presentation.mjs
python scripts/build-nls-content.py
```

Dùng đường dẫn tuyệt đối đến Python thực nếu `python` trên PATH chỉ là WindowsApps alias. OCR tiếng Việt chạy local và tải mô hình trong lần đầu. Mỗi ảnh có checkpoint để tiếp tục sau khi gián đoạn. `.cache/` được bỏ qua trong Git; không cần đưa PowerPoint 314 MB vào repository.

`build-nls-content.py` áp dụng bản hiệu đính, tạo Markdown, chỉ mục JSON và thumbnail để thư viện không tải ảnh lớn cho từng ô. Chữ gốc và slide trống được giữ đúng số thứ tự.

## Triển khai và xác minh

```powershell
npm test
npm run typecheck:worker
npm run deploy
node scripts/verify-deployment.mjs
```

Wrangler phải đăng nhập đúng tài khoản Cloudflare có quyền triển khai Worker. Cấu hình đã dùng tên Worker mới; database binding vẫn trỏ đến database hiện hữu `chi-tieu-db` để giữ dữ liệu. Không đổi tên thư mục local hay repository GitHub.

## Kiểm tra

```powershell
npm test
npm run build
npm run typecheck:worker
```

Bộ kiểm tra xác nhận 64 cặp cơ bản không trùng/thiếu, tách cặp chồng lấn, bảo toàn số 0/5, đầu vào không hợp lệ, chiều kết hợp, tìm tiếng Việt không dấu, thứ tự 143 slide và các đường dẫn ảnh/Markdown.

Số nhập tra cứu chỉ được xử lý trong bộ nhớ trình duyệt. Tiến độ sáu bài học được lưu trong localStorage trên máy đang dùng. Công cụ không tự luận giải số 0/5, lưu niên hoặc nội lực khi nguồn chưa đủ quy tắc rõ ràng, và không dự báo sức khỏe/tài chính từ dãy số.

# Triển khai Tinh Hoa Năng Lượng Số

Ngày: 24/10/2026. Yêu cầu: triển khai website mới và đổi tên `chi-tieu` trên Cloudflare.

## Kết quả

- Website: https://tinh-hoa-nang-luong-so.hieutrantaskflow.workers.dev/
- Tên Worker mới: `tinh-hoa-nang-luong-so`.
- Tên Worker trước đây: `chi-tieu`.
- ID Worker giữ nguyên: `ffec4e2926f149c0ad71f707977797e4`.
- Phiên bản triển khai: `c42db059-89f7-4530-ac54-4dd6786f8fbe`.
- Phương thức: đổi tên trực tiếp bằng [Cloudflare Edit Worker API](https://developers.cloudflare.com/api/resources/workers/subresources/beta/subresources/workers/methods/edit/), sau đó triển khai bằng Wrangler 4.86.0.
- Database binding giữ ID `e6a504c3-4ff7-417d-9970-437376d6413d`; secret binding hiện hữu vẫn có sau khi triển khai. Không chạy migration hay đổi dữ liệu.

Cấu hình Worker, package manifest/lockfile, tên trang và URL môi trường production đã cập nhật theo tên mới. Các origin local của backend được cập nhật đúng cổng riêng `5176` và `8791`. Không thay cấu hình Auto-pilot.

## Kiểm tra trước khi triển khai

8/8 kiểm tra tự động qua. Frontend build và kiểm tra kiểu backend thành công. Wrangler dry-run thành công, đọc 279 tệp từ thư mục assets. Lệnh deploy đã tải đủ 272 tệp tĩnh mới/sửa và trả kết quả triển khai thành công kèm URL, version ID ở trên.

## Xác minh production

Lúc kiểm tra HTTP: `2026-10-24T06:56:39.185Z` (13:56 ngày 24/10/2026, giờ Bangkok).

- Trang chủ, lộ trình, tra cứu, thư viện và hồ sơ Sinh Khí trả HTTP 200 với tên trang mới.
- JS/CSS, chỉ mục slide, Markdown, ảnh slide mẫu và thumbnail khớp SHA-256 từng byte với bản build local đã kiểm tra.
- Chỉ mục có đủ 143 slide, gồm 14 slide đã hiệu đính, 9 slide trống và chữ gốc tại slide 117.
- `/api/health` trả HTTP 200 với `ok: true`.
- API Cloudflare xác nhận tên mới thuộc đúng ID Worker ban đầu, database và secret binding được giữ.
- Trình duyệt trên domain production mở đúng giao diện và tra dãy `143168` ra 14 Sinh Khí, 43 Diên Niên, 31 Thiên Y, 16 Lục Sát, 68 Thiên Y. Thư viện mở đúng bài Sinh Khí ở slide 6.

Bằng chứng HTTP chi tiết được lưu local tại `.cache/production-verification.json`; ảnh xác nhận tại `.cache/nls-production.jpg`. Có thể chạy lại `node scripts/verify-deployment.mjs` để kiểm tra nội dung production so với bản build hiện tại.

## Phạm vi và giới hạn

Không đổi tên thư mục local hoặc repository GitHub. Tài liệu vẫn có 119 slide OCR chưa hiệu đính toàn văn, được ghi rõ trong thư viện. Việc triển khai không thay đổi giới hạn diễn giải đã mô tả trong `NGHIEN-CUU.md`.

Các lỗi truy cập đường dẫn tài liệu API cũ và patch không khớp nguyên dòng đã đối chiếu với devkit gotchas #307 về xác minh đường dẫn/anchor trước khi thử lại; không tạo bài trùng. Không có lỗi triển khai Cloudflare cần ghi một bài mới.

## Cập nhật tính năng luận giải dãy số

Đã triển khai báo cáo luận giải tại `/tra-cuu`, phiên bản Worker cuối `c0a11922-4975-47ba-81e9-f9fa44e6f499`. Bản cuối dùng JS `index-BJ1TdAYU.js` và CSS `index-BEdOPoBI.css`. Kiểm tra HTTP lúc `2026-10-24T07:20:03.994Z` xác nhận production khớp bản build và API hoạt động. Database/backend giữ nguyên. Nội dung, nguyên tắc bảo vệ đầu vào và các kiểm tra cụ thể tại [LUAN-GIAI.md](LUAN-GIAI.md).

## Cập nhật phần luận sâu

Phiên bản hiện tại: `bd42d5cb-2814-4cb9-a8ab-5d758cb846ca`, gồm 8 hồ sơ mở rộng và 48 chiều kết hợp với phần tóm lược đã đối chiếu 49 ảnh nguồn. Build dùng `index-PHaRv-Cd.js`, `index-BpJwMijb.css`; xác minh HTTP lúc `2026-10-24T07:58:23.927Z` thành công. 17 kiểm tra tự động qua. Nội dung và giới hạn đối chiếu nằm ở phần cuối [LUAN-GIAI.md](LUAN-GIAI.md). Không đổi database, secret hoặc định danh Worker.

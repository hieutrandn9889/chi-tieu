# Báo cáo luận giải dãy số

Ngày: 24/10/2026. Yêu cầu được xác nhận: bổ sung báo cáo diễn giải dãy số theo tài liệu Năng lượng số, xử lý tại trình duyệt, cập nhật website hiện hữu.

## Nội dung và cách tính

- Giữ nguyên chuỗi 2–32 chữ số, kể cả số 0 đầu dãy. Khoảng trắng và dấu phân cách được xử lý giống công cụ phân loại cũ.
- Tách cặp chồng lấn theo vị trí. Ví dụ minh họa `001431681414` có 12 chữ số, 11 cặp, 9 cặp được phân loại, 2 cặp chứa 0/5 và 5 nhóm; Sinh Khí xuất hiện 4/11 cặp. Đây là dãy tổng hợp để kiểm tra, không gắn với người thật.
- Thống kê tần suất tính trên tất cả cặp trong dãy, không gán trọng số hay chấm điểm tốt/xấu. Nếu nhiều nhóm bằng nhau, ghi rõ ngang nhau; nếu toàn cặp 0/5 thì không sinh nhóm đại diện.
- Mỗi nhóm có từ khóa, phần tóm lược quan điểm tài liệu, vị trí các cặp, gợi ý tự đối chiếu và lưu ý của nguồn. Dùng lại hồ sơ đã biên soạn từ các slide 6, 8, 10, 13, 15, 17, 19, 21. Bảng cặp số đã đối chiếu ảnh.
- Hai cặp liền nhau tạo cửa sổ ba chữ số. Giữ đúng chiều A+B. Không nối qua cặp 0/5; không tự bịa bài còn thiếu từ chiều đảo ngược.
- Cặp 0/5 dẫn tới slide 26/27/28. Các bài kết hợp được ghi rõ đang có OCR chưa hiệu đính toàn văn; người đọc được dẫn tới ảnh slide gốc.

Báo cáo là nội dung tham khảo của hệ diễn giải trong tài liệu, không xác thực căn cước hoặc suy ra tính cách, nhân thân hay cuộc đời một người từ CCCD. Không trích xuất mã tỉnh, giới tính, năm sinh, không chẩn đoán hay dự báo cá nhân.

## Dữ liệu nhập

`SequenceLookup` giữ đầu vào và báo cáo trong React state. `buildSequenceReport` là hàm thuần, không có I/O. Luồng này không gọi API, không ghi console, không dùng localStorage/sessionStorage/IndexedDB và không đưa đầu vào vào URL. Liên kết nguồn chỉ có số slide hoặc ID nhóm.

Ô nhập trên trang chi tiết được che mặc định, tắt autocomplete, có nút ẩn/hiện và nút xóa cả dãy lẫn báo cáo. Sửa đầu vào làm mất báo cáo cũ ngay. Nút xóa đưa ô nhập về rỗng và che lại. Dùng dãy minh họa thay vì CCCD thật khi thử tính năng. Website vẫn tải các tài nguyên tĩnh thông thường; tiến độ học và giao diện sáng/tối có cơ chế lưu riêng, không chứa đầu vào tra cứu.

## Kiểm tra

- `npm test`: 13/13 qua, gồm 5 kiểm tra mới cho báo cáo; quét đủ 1.000 cửa sổ ba chữ số để kiểm tra số lượng, vị trí và điều kiện nối nhóm.
- `npm run build`: TypeScript và Vite build thành công.
- Trình duyệt local: dãy 12 chữ số cho đúng thống kê; toàn 0/5 không sinh lời luận hoặc kết hợp; `1113` giữ trạng thái chưa có bài riêng cho Phục Vị + Thiên Y; chữ cái báo lỗi và không giữ báo cáo cũ.
- Nút xóa: giá trị DOM rỗng, báo cáo bị gỡ, ô nhập che lại.
- Kiểm tra màn hình desktop, viewport 390 và 320; kích thước nội dung bằng viewport khả dụng, không tràn ngang. Giao diện tối đọc được. Viewport tạm đã reset. Console không có lỗi.

## Triển khai và xác minh production

- URL: https://tinh-hoa-nang-luong-so.hieutrantaskflow.workers.dev/tra-cuu
- Phiên bản Worker cuối: `c0a11922-4975-47ba-81e9-f9fa44e6f499`.
- Thời điểm xác minh HTTP: `2026-10-24T07:20:03.994Z` (14:20 giờ Bangkok).
- `scripts/verify-deployment.mjs` xác nhận 12 kiểm tra HTTP, các trang chính và API hoạt động; JS/CSS và tài liệu khớp hash với bản build cuối.
- Trình duyệt production: nhập và submit dãy minh họa 12 chữ số cho đúng 9/11 cặp, 5 nhóm, 2 cặp 0/5; ẩn/hiện giữ nguyên đầu vào; liên kết đầu tiên mở đúng slide Sinh Khí. Console không có lỗi.
- Ảnh xác nhận: `.cache/nls-reading-production.jpg`. Chỉ dùng dãy minh họa trong quá trình kiểm tra. Máy chủ preview do tác vụ tạo đã dừng sau khi xác minh; không dừng Auto-pilot.
- Nhãn nút ẩn/hiện thay đổi theo hành động, không dùng trạng thái pressed có thể gây hiểu nhầm trong trình đọc màn hình. Đây là điều chỉnh nhỏ trong kiểm tra khả năng tiếp cận, không cần thêm một bài học riêng.

## Chẩn đoán môi trường và đối chiếu bài học

Lượt preview đầu khởi chạy trong sandbox có thông báo ready nhưng trình duyệt timeout; HTTP probe trong cùng ngữ cảnh báo quyền socket bị chặn. Khởi động lại đúng máy chủ thuộc tác vụ ở cổng 5176 qua ngữ cảnh đã được phê duyệt cho kết quả HTTP 200. Tab lỗi đã bị chuyển sang trang lỗi dạng data URL nên không tiếp tục điều khiển qua tab đó; tab QA mới mở preview thành công. Đây là lỗi ngữ cảnh kiểm tra, không phải lỗi thuật toán hoặc bằng chứng về lỗi website. Giữ Auto-pilot trên cổng 5173.

Các lỗi đoán đường dẫn devkit, patch không khớp nguyên dòng và tab lỗi được dedupe với [gotchas #307](../../../../hieu-devkit/skills/fullstack-cloudflare-app/references/gotchas.md) về xác minh đường dẫn, anchor và binding. Hướng dẫn dùng ngữ cảnh được phê duyệt cho lỗi sandbox đã có ở #267/#323 trong cùng nguồn. Không tạo hoặc sửa bài học trùng, không thay quyền hệ thống hay nới kiểm tra để che lỗi môi trường.

## Bổ sung luận sâu theo phản hồi người dùng

Người dùng yêu cầu nội dung sâu và chính xác hơn. Phiên bản mở rộng bám sát nội dung nguồn, không nhận mình là chuyên gia có thể xác định một con người qua CCCD và không gán tỷ lệ chính xác cho nhận định cá nhân.

- `src/lib/nls-interpretations.ts` có 8 hồ sơ mở rộng, mỗi hồ sơ gồm tiềm năng theo nguồn, mặt dễ quá đà, công việc/học tập, giao tiếp/quan hệ, cách quyết định và câu hỏi đối chiếu. Nguồn nền là 8 slide đã hiệu đính.
- Đã đọc OCR rồi đối chiếu ảnh của đủ 48 chiều có bài nguồn; tổng 49 ảnh vì slide 96 chứa cả phần tiếp Lục Sát và ảnh Diên Niên + Tuyệt Mệnh. Bản luận DN + TM chỉ lấy căn cứ tương ứng ở ảnh thứ hai.
- Mỗi chiều có chủ đề, phần diễn giải, câu hỏi và thực hành riêng. Câu hỏi/thực hành là phần biên soạn, không giả là nguyên văn tài liệu. Các nhận định y khoa, dự báo tai nạn, khẳng định người thứ ba/lừa đảo hoặc hoàn cảnh xuất thân không được tự động hóa thành sự thật về người nhập.
- Chỉ phần tóm lược chủ đề dùng trong luận được đối chiếu. Không thay nhãn chất lượng toàn văn: 116 slide vẫn là OCR chưa hiệu đính toàn bộ. Danh sách nguồn và SHA-256 của từng ảnh ở [doi-chieu-luan-sau.json](doi-chieu-luan-sau.json).
- Đọc kết cấu thành các đoạn liên tục, giữ chỗ ngắt 0/5; phát hiện nhóm lặp liền nhau nhưng không gán trọng số/khuếch đại. Tổ hợp trùng gộp bài, giữ mọi cửa sổ và vị trí. Không coi vị trí là tuổi hoặc vận quá khứ/tương lai.
- Hai mối nối có bài nguồn xuất hiện trước được tóm lược ngay trong phần tổng hợp. Báo cáo có mục lục để mở phần kết cấu, hồ sơ nhóm hoặc bài kết hợp. Bộ chọn hai nhóm độc lập cũng hiển thị bài luận mới.
- Dữ liệu vẫn chỉ ở bộ nhớ trình duyệt; không thêm thư viện, API hoặc cơ chế lưu/ghi log. Mục lục chỉ dùng tên mục trong fragment URL, không chứa dãy số.

### Kiểm tra phiên bản luận sâu

`npm test`: 17/17 qua, thêm kiểm tra đủ 8 hồ sơ/48 nguồn, phân biệt chiều đảo, slide 96 có hai ảnh, gộp tổ hợp không mất vị trí, và ngắt đoạn/nhóm lặp tại 0/5. TypeScript/Vite build thành công.

Trình duyệt local: ví dụ tổng hợp 12 chữ số hiển thị 5 hồ sơ mở rộng, 7 bài kết hợp phân biệt (6 có diễn giải, 1 chưa có nguồn), giữ đủ 8 mối nối; nhóm Sinh Khí lặp 3 cặp ở vị trí 9–12. Câu hỏi/thực hành mở đúng nội dung. Viewport 390 và 320 không tràn ngang, giao diện tối đọc được, viewport đã reset. `1113` không sinh bài cho Phục Vị đứng trước; toàn 0/5 không sinh hồ sơ hoặc bài kết hợp trong báo cáo.

Chẩn đoán trong lượt này: một đường dẫn ảnh web bắt đầu bằng `/` làm phép ghép Path bỏ thư mục nguồn; đã chuẩn hóa đường dẫn tương đối trước khi đọc ảnh. Kiểm tra một-ảnh-mỗi-slide phát hiện slide 96 có hai ảnh, nên đã mở rộng contact sheet để đọc đủ cả hai, không bỏ phần nguồn. Một số patch theo dòng cũ/placeholder chưa khớp được sửa sau khi đọc đúng nguồn; formatter và build xác nhận CSS/TSX hợp lệ trước deploy. Các lỗi thao tác đường dẫn/anchor được dedupe với #307, các lỗi gõ tạm trong CSS là chỉnh sửa nhỏ đã bắt trước phát hành, không thêm bài học trùng.

Lịch sử console của tab giữ hai lỗi HMR CSS local tại `07:54:33Z`, khi một patch CSS đang chưa hoàn chỉnh. Đã sửa selector dư trước build cuối; TypeScript/Vite build qua, không phải lỗi của bản production. Không báo cả lịch sử console là sạch hoặc coi lỗi HMR cũ là lỗi của deployment mới.

### Phát hành bản luận sâu

- Worker version: `bd42d5cb-2814-4cb9-a8ab-5d758cb846ca`.
- Production: https://tinh-hoa-nang-luong-so.hieutrantaskflow.workers.dev/tra-cuu
- Xác minh HTTP: `2026-10-24T07:58:23.927Z` (14:58 giờ Bangkok), 12 kiểm tra HTTP qua, JS/CSS đúng byte của bản build cuối. Database/backend không thay đổi.
- Trình duyệt production mở đúng 5 hồ sơ sâu, 2 đoạn tổng hợp và 7 bài kết hợp phân biệt cho dãy minh họa 12 chữ số; mục lục và phần giải thích hiển thị đúng.
- Ảnh xác nhận: `.cache/nls-deep-production.jpg`.

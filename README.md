# Vui Học Cùng Bảo Nhi

Web dành riêng cho Bảo Nhi: phụ huynh giao nhiệm vụ, con tích điểm và đổi quà.
Dựng từ bản mẫu `nhiem-vu-sieu-biet-ban-chia-se.html`, đã tách thành dự án tĩnh
chuẩn để deploy Vercel.

- Demo local: mở trực tiếp `index.html` bằng trình duyệt
- Nền tảng: web tĩnh, không cần build, deploy trực tiếp lên Vercel

## Tính năng (giữ nguyên từ bản mẫu)

- Đa hồ sơ bé (tên + giới tính), chuyển nhanh giữa các con
- Quản lý môn học
- Giao nhiệm vụ: 1 ngày / lặp hàng ngày / lặp Thứ 2–Thứ 6, điểm, thời lượng, link, hướng dẫn
- Lịch học theo tháng, chấm ngày có nhiệm vụ
- Tích điểm khi hoàn thành (xác nhận 2 bước), bỏ hoàn thành trừ điểm lại
- Thưởng điểm xuất sắc, phạt điểm có lý do (lưu vào Nhắc nhở / Điểm phạt)
- Quà đổi điểm theo từng bé, mốc thành tích giữ nguyên khi đổi quà
- 🏅 101 danh hiệu tự động từ 100 ⭐ tới 100.000 ⭐ (mỗi 1.000 ⭐ một danh hiệu, tên thăng hạng từ Hạt mầm tới Huyền thoại nhí); danh hiệu cao nhất hiện ngay đầu trang Hôm nay
- Khu vực phụ huynh khóa mật khẩu (mặc định `1234`, nhập `****` để reset)
- 💱 Đổi sao ra tiền mặt: chuẩn 100 ⭐ = 10.000đ (phụ huynh đổi được),
  mốc càng cao giá mỗi sao giảm dần theo đường cong — 21 mốc nhỏ từ 100 ⭐
  tới trần 10.000 ⭐ để con thấy động lực tích lũy
- Lưu trình duyệt (`localStorage` key `nhiemvu_sieubiet_public_v2`)

## Cấu trúc

```text
.
├── index.html      # Khung trang + 4 màn hình (Hôm nay / Lịch học / Thành tích / Đổi quà)
├── css/style.css   # Toàn bộ CSS tách từ bản mẫu
├── js/app.js       # Toàn bộ logic tách từ bản mẫu
├── vercel.json     # Cấu hình deploy tĩnh
└── package.json    # Script chạy local (npx serve .)
```

## Chạy local

Mở trực tiếp `index.html`, hoặc:

```powershell
npx serve .
```

## Deploy lên Vercel

Kết nối repo GitHub `vuihoccungcon`: mỗi lần `git push` lên nhánh `main` là Vercel tự deploy.

Deploy thủ công:

```powershell
npm i -g vercel
vercel --prod
```

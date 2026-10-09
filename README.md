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
- ⭐ 7 mẫu nhiệm vụ của Bảo Nhi (cô khen +10, phụ bố mẹ +5, bị cô chê −10, bài tập +10, tiếng Anh +20, tiếng Trung +20, giúp bà +5); ô tự điền + nút điểm nhanh 5/10/20
- Lịch học theo tháng, chấm ngày có nhiệm vụ
- Tích điểm khi hoàn thành (xác nhận 2 bước), bỏ hoàn thành trừ điểm lại
- Thưởng điểm xuất sắc, phạt điểm có lý do (lưu vào Nhắc nhở / Điểm phạt)
- Quà đổi điểm theo từng bé, mốc thành tích giữ nguyên khi đổi quà
- 🏅 101 danh hiệu tự động từ 100 ⭐ tới 100.000 ⭐ (mỗi 1.000 ⭐ một danh hiệu; 30 mốc 1.000–30.000 ⭐ có tên riêng khích lệ bé, còn lại thăng hạng từ Ngôi sao tới Huyền thoại nhí); danh hiệu cao nhất hiện ngay đầu trang Hôm nay
- Khu vực phụ huynh khóa mật khẩu (mặc định `1234`, nhập `****` để reset)
- 💱 Đổi sao ra tiền mặt: một mốc duy nhất 100 ⭐ = 5.000đ (phụ huynh đổi được tỷ giá)
- ☁️ Đồng bộ đa thiết bị qua Supabase (xem hướng dẫn bên dưới); chưa cấu hình thì
  dữ liệu lưu trình duyệt từng máy (`localStorage` key `nhiemvu_sieubiet_public_v2`)

## Cấu trúc

```text
.
├── index.html      # Khung trang + 4 màn hình (Hôm nay / Lịch học / Thành tích / Đổi quà)
├── css/style.css   # Toàn bộ CSS tách từ bản mẫu
├── js/app.js       # Logic chính: bé, nhiệm vụ, điểm, quà, danh hiệu
├── js/sync.js      # Đồng bộ đa thiết bị qua Supabase REST
├── supabase/
│   └── schema.sql  # Bảng đám mây chung (chạy 1 lần trong Supabase)
├── vercel.json     # Cấu hình deploy tĩnh
└── package.json    # Script chạy local (npx serve .)
```

## Chạy local

Mở trực tiếp `index.html`, hoặc:

```powershell
npx serve .
```

## Đưa lên thành web (Vercel)

1. Vào `vercel.com` → đăng nhập bằng GitHub → **Add New… → Project** →
   **Import** repo `vuihoccungcon` → **Deploy** (giữ nguyên mọi thiết lập).
2. Có ngay link `https://vuihoccungcon.vercel.app` (được đổi tên trong Settings).
3. Từ nay mỗi lần `git push` lên nhánh `main` là web tự cập nhật.

## Đồng bộ mọi thiết bị (Supabase, miễn phí)

Mặc định mỗi máy lưu riêng. Muốn chung dữ liệu:

1. Vào `supabase.com` → tạo project miễn phí (đặt tên `vuihoccungcon`).
2. Vào **SQL Editor → New query**, dán toàn bộ file `supabase/schema.sql` →
   **Run**.
3. Vào **Project Settings → API**, copy `Project URL` và `anon public key`.
4. Mở web → 🔒 **Phụ huynh** → mục **Đồng bộ đa thiết bị**: dán URL + key,
   đặt **Mã gia đình** (VD: `baonhi-2026`) → **Kết nối & đồng bộ**.
5. Lặp lại bước 4 trên từng máy/điện thoại (nhập **giống hệt** mã gia đình).

Lưu ý: thiết bị nào lưu sau cùng sẽ thắng; bấm ⬇ Tải về sẽ tự sao lưu
bản trên máy trước khi ghi đè.

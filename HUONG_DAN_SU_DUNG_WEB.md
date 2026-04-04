# Huong Dan Chay Website

## 1) Tong quan nhanh
- Day la website tinh nhieu trang, khong co build step va khong phai SPA.
- Trang chinh:
  - `index.html`: trang chu
  - `map.html`: ban do ArcGIS + bo loc diem
  - `place.html`: ho so diem
  - `du-lich-ao-360.html`: xem scene 360
  - `booking.html`: gui dang ky trai nghiem
  - `tra-cuu-don.html`: tra cuu don
  - `admin-bookings.html`: dashboard admin
- Shared runtime:
  - `js/config.js`: `DEMO_MODE`, `PUBLIC_BOOKING_LOOKUP_ENABLED`, chatbot flags
  - `js/app.js`: loader du lieu diem
  - `js/supabase-config.js`: config/client Supabase dung chung

## 2) Chay local
- Mo thu muc du an:

```bash
cd /path/to/nckh2026-clean
python3 -m http.server 5500
```

- Mo trinh duyet:
  - `http://127.0.0.1:5500/`
  - `http://127.0.0.1:5500/index.html`

Luu y:
- Khong mo bang `file://`.
- `js/app.js` co `fetch('./data/places.json')`, nen bat buoc phai chay qua HTTP server.

## 3) Demo mode va live mode
- `window.DEMO_MODE = true` trong `js/config.js`
  - Du lieu diem uu tien lay tu `js/demo-data.js`
  - Booking luu vao `localStorage`
  - Admin co the mo dashboard demo
- `window.DEMO_MODE = false`
  - Booking insert vao Supabase
  - Admin phai dang nhap bang Supabase Auth
  - Tra cuu cong khai chi nen bat khi co luong lookup an toan rieng

- `window.PUBLIC_BOOKING_LOOKUP_ENABLED = false` trong `js/config.js`
  - Day la mac dinh an toan cho production
  - Khi dang `false`, `tra-cuu-don.html` se hien thong bao secure mode thay vi query truc tiep bang so dien thoai

## 4) Luong trinh bay nhanh
1. Mo `index.html`
2. Sang `map.html` de loc diem
3. Mo `place.html?id=...` de xem ho so
4. Mo `du-lich-ao-360.html?id=...` de xem scene 360
5. Mo `booking.html?item=...` de gui booking
6. Neu dang demo: mo `tra-cuu-don.html`
7. Neu dang live: dang nhap `admin-bookings.html` de kiem tra don

## 5) Luu y deploy Vercel
- Day la static site, khong can `npm install` hay build command.
- Import repo vao Vercel voi root directory la thu muc repo hien tai.
- Sau khi deploy, kiem tra lai cac trang:
  - `/`
  - `/index.html`
  - `/map.html`
  - `/place.html`
  - `/booking.html`
  - `/admin-bookings.html`
- Neu can doi project Supabase, cap nhat `js/supabase-config.js`.

## 6) Loi thuong gap

### 6.1 Map hien 0 diem
- Kiem tra dang chay bang `http://127.0.0.1:5500`, khong phai `file://`
- Kiem tra `data/places.json` ton tai

### 6.2 Booking gui duoc nhung khong thay tren admin
- Neu dang `DEMO_MODE = true`, booking chi luu local
- Neu muon luu that, chuyen `DEMO_MODE = false` va cau hinh Supabase theo `SUPABASE_SETUP.md`

### 6.3 Tra cuu don khong mo duoc tren production
- Mac dinh secure mode dang tat tra cuu cong khai
- Day la hanh vi dung de tranh lo du lieu booking qua so dien thoai

### 6.4 Admin dang nhap duoc nhung khong thay don
- Kiem tra da run SQL schema/policies moi trong `supabase/`
- Kiem tra user admin da duoc them vao bang `public.admin_users`

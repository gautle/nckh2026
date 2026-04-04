# Cham vao Di san Hmong

Website demo cho de tai NCKH ve du lich so, di san va trai nghiem cong dong. Du an la static multi-page site, phu hop cho Vercel static hosting + Supabase.

## Cau truc repo
- `index.html`, `map.html`, `place.html`, `booking.html`, `tra-cuu-don.html`, `du-lich-ao-360.html`, `san-pham.html`, `huong-dan.html`, `admin-bookings.html`: cac page chinh
- `assets/`: CSS va hinh anh
- `js/`: logic dung chung va page scripts
- `data/places.json`: du lieu diem
- `supabase/`: SQL schema/policies va Edge Function chatbot
- `HUONG_DAN_SU_DUNG_WEB.md`, `SUPABASE_SETUP.md`: tai lieu van hanh

## Cach du an hien dang hoat dong
- Moi trang HTML tu nap CSS + JS rieng, khong dung bundler.
- Shared runtime:
  - `js/config.js`: runtime flags (`DEMO_MODE`, `PUBLIC_BOOKING_LOOKUP_ENABLED`, chatbot flags)
  - `js/app.js`: nap du lieu diem + helper dung chung
  - `js/supabase-config.js`: config/client Supabase dung chung
- Booking flow:
  - `DEMO_MODE = true`: luu localStorage
  - `DEMO_MODE = false`: insert vao Supabase
- Admin flow:
  - `admin-bookings.html` dang nhap bang Supabase Auth email/password
  - Session duoc khoi phuc qua Supabase client o reload
  - Dashboard chi cho phep user nam trong `public.admin_users`
- Lookup flow:
  - Demo mode: doc localStorage
  - Secure mode: mac dinh tat lookup cong khai

## Chay local
```bash
cd /path/to/nckh2026-clean
python3 -m http.server 5500
```

Mo `http://127.0.0.1:5500/`.

## Deploy Vercel
- Framework preset: `Other`
- Build command: de trong
- Output directory: de trong
- Root directory: repo root

Sau khi deploy, kiem tra nhanh:
- `/index.html`
- `/map.html`
- `/place.html?id=MS`
- `/booking.html`
- `/admin-bookings.html`

## Supabase
- Client config nam o `js/supabase-config.js`
- `anon` key la public client key, duoc phep xuat hien tren frontend
- Tuyet doi khong dua `service_role` key vao HTML/JS client
- Run SQL trong `supabase/booking_schema.sql`
- Neu da co bang cu, run them `supabase/booking_policies_secure.sql`

## Cac file can chinh khi doi che do van hanh
- `js/config.js`
  - `DEMO_MODE`
  - `PUBLIC_BOOKING_LOOKUP_ENABLED`
  - `CHATBOT_AI_ENABLED`
- `js/supabase-config.js`
  - `SUPABASE_URL`
  - `SUPABASE_ANON_KEY`

## Ghi chu bao mat
- Chinh sach moi su dung allowlist `public.admin_users`, khong con mo rong cho moi user `authenticated`.
- Public lookup booking theo so dien thoai dang tat mac dinh vi khong an toan cho production.
- Neu can lookup cong khai, nen dung luong rieng co tracking code/an toan hon, khong nen mo RLS bang so dien thoai don thuan.

# Supabase Setup for Booking (Secure)

## 1) Tao project Supabase
- Vao https://supabase.com/dashboard
- Tao project moi
- Vao `Project Settings -> API`
- Copy:
  - `Project URL`
  - `anon public key`

## 2) Tao bang va policy
- Vao `SQL Editor`
- Chay file: `supabase/booking_schema.sql`

Neu ban da tung chay policy public cu:
- Chay them file `supabase/booking_policies_secure.sql`

## 3) Cau hinh key trong web
- Mo `js/supabase-config.js`
- Dien:
  - `window.SUPABASE_URL`
  - `window.SUPABASE_ANON_KEY`

## 4) Tao tai khoan admin
- Vao `Authentication -> Users`
- Tao 1 user (email + password) cho admin

Khuyen nghi:
- Vao `Authentication -> Providers -> Email`
- Tat `Enable email signups` de khong ai tu tao account

## 5) Kiem tra
- Mo `booking.html`, gui 1 don (khong can dang nhap)
- Mo `admin-bookings.html`
- Dang nhap bang tai khoan admin
- Xem/sua trang thai don

## 6) Bao mat nang cao (optional)
- Thay policy `authenticated` bang danh sach admin user cu the
- Hoac tao role/admin table rieng de gioi han chat hon

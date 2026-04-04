# Supabase Setup for Booking (Secure)

## 1) Tao project Supabase
- Vao https://supabase.com/dashboard
- Tao project moi
- Vao `Project Settings -> API`
- Copy:
  - `Project URL`
  - `anon public key`

Luu y:
- `anon public key` la key public dung o client.
- Khong dua `service_role` key vao frontend.

## 2) Tao bang va policy
- Vao `SQL Editor`
- Chay file: `supabase/booking_schema.sql`

Neu ban da co bang/policy cu:
- Chay them `supabase/booking_policies_secure.sql`

Bo SQL moi da:
- Tao bang `public.bookings`
- Tao bang `public.admin_users`
- Gioi han quyen doc/sua/xoa booking cho user nam trong `public.admin_users`

## 3) Cau hinh key trong web
- Mo `js/supabase-config.js`
- Dien:
  - `window.SUPABASE_URL`
  - `window.SUPABASE_ANON_KEY`

Day la source of truth dung chung cho:
- `booking.html`
- `tra-cuu-don.html`
- `admin-bookings.html`

## 4) Tao tai khoan admin va allowlist admin
1. Vao `Authentication -> Users`
2. Tao 1 user admin (email + password)
3. Copy `User ID` cua user do
4. Chay SQL:

```sql
insert into public.admin_users (user_id, email)
values ('YOUR_AUTH_USER_ID', 'admin@example.com')
on conflict (user_id) do update
set email = excluded.email;
```

Khuyen nghi:
- Vao `Authentication -> Providers -> Email`
- Tat `Enable email signups` neu site khong can cho user tu dang ky

## 5) Chon che do van hanh
- `DEMO_MODE = true` trong `js/config.js`
  - Booking luu localStorage
  - Admin co the vao dashboard demo
- `DEMO_MODE = false`
  - Booking insert vao Supabase
  - Admin phai dang nhap moi xem/sua/xoa booking

- `PUBLIC_BOOKING_LOOKUP_ENABLED = false`
  - Day la mac dinh an toan
  - Khong nen mo quyen select cong khai bang so dien thoai don thuan

## 6) Kiem tra
1. Mo `booking.html`
2. Neu dang live mode, gui 1 booking
3. Mo `admin-bookings.html`
4. Dang nhap bang tai khoan admin da duoc them vao `public.admin_users`
5. Xem/sua/xoa don

## 7) Luu y bao mat
- Policy cu `auth.role() = 'authenticated'` la qua rong cho production public.
- Policy moi dung allowlist `public.admin_users` de dam bao chi admin duoc quan tri.
- Neu can public lookup booking, nen dung luong rieng co tracking code/an toan hon thay vi mo RLS truc tiep.

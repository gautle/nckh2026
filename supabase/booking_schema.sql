-- Run in Supabase SQL Editor
create table if not exists public.bookings (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  customer_name text not null,
  customer_phone text not null,
  people_count int not null check (people_count > 0),
  travel_date date not null,
  package_name text not null,
  note text,
  place_id text,
  place_name text,
  status text not null default 'new' check (status in ('new','contacted','confirmed','cancelled'))
);

alter table public.bookings enable row level security;

-- Secure policies:
-- 1) Public can submit bookings
-- 2) Only authenticated users can read/update bookings (for admin dashboard)

drop policy if exists "public_insert_bookings" on public.bookings;
create policy "public_insert_bookings"
on public.bookings for insert
with check (true);

drop policy if exists "admin_read_bookings" on public.bookings;
create policy "admin_read_bookings"
on public.bookings for select
using (auth.role() = 'authenticated');

drop policy if exists "admin_update_bookings" on public.bookings;
create policy "admin_update_bookings"
on public.bookings for update
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

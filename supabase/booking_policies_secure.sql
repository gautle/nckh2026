-- If table already exists, run this file to replace old public policies
alter table public.bookings enable row level security;

drop policy if exists "public_insert_bookings" on public.bookings;
create policy "public_insert_bookings"
on public.bookings for insert
with check (true);

drop policy if exists "public_read_bookings" on public.bookings;
drop policy if exists "public_update_bookings" on public.bookings;

drop policy if exists "admin_read_bookings" on public.bookings;
create policy "admin_read_bookings"
on public.bookings for select
using (auth.role() = 'authenticated');

drop policy if exists "admin_update_bookings" on public.bookings;
create policy "admin_update_bookings"
on public.bookings for update
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

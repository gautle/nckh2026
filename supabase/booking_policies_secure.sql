-- If table already exists, run this file to replace old public policies
create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text,
  created_at timestamptz not null default now()
);

alter table public.bookings enable row level security;
alter table public.admin_users enable row level security;

create or replace function public.is_admin_user()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_users
    where user_id = auth.uid()
  );
$$;

grant execute on function public.is_admin_user() to anon, authenticated;

drop policy if exists "public_insert_bookings" on public.bookings;
create policy "public_insert_bookings"
on public.bookings for insert
with check (true);

drop policy if exists "public_read_bookings" on public.bookings;
drop policy if exists "public_update_bookings" on public.bookings;

drop policy if exists "admin_read_bookings" on public.bookings;
create policy "admin_read_bookings"
on public.bookings for select
using (public.is_admin_user());

drop policy if exists "admin_update_bookings" on public.bookings;
create policy "admin_update_bookings"
on public.bookings for update
using (public.is_admin_user())
with check (public.is_admin_user());

drop policy if exists "admin_delete_bookings" on public.bookings;
create policy "admin_delete_bookings"
on public.bookings for delete
using (public.is_admin_user());

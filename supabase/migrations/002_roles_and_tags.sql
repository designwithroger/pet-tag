-- Pet Tag — roles + NFC tag provisioning. Run in the Supabase SQL editor
-- AFTER schema.sql. Safe to re-run (idempotent where practical).

-- ---------------------------------------------------------------------------
-- Profiles + roles
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  role text not null default 'customer' check (role in ('customer', 'admin')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Admin check as a SECURITY DEFINER function so the admin policies below can
-- reference it WITHOUT recursing into profiles' own RLS (a plain subquery on
-- profiles inside a profiles policy causes "infinite recursion detected").
create or replace function public.is_admin()
returns boolean as $$
  select exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  );
$$ language sql security definer stable set search_path = public;

create policy "Users can read their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Admins can read all profiles"
  on public.profiles for select
  using (public.is_admin());

create policy "Admins can update roles"
  on public.profiles for update
  using (public.is_admin());

-- Auto-create a profile row whenever a new auth user signs up.
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Backfill profiles for any accounts created before this migration existed.
insert into public.profiles (id, email)
select id, email from auth.users
on conflict (id) do nothing;

-- Seed the primary admin. Safe to re-run.
update public.profiles set role = 'admin' where email = 'rfigueroa@capybaracreative.xyz';

-- ---------------------------------------------------------------------------
-- NFC tags — decoupled from pets so a physical tag can be pre-written with a
-- stable URL (/t/<code>) before any customer's pet data exists.
-- ---------------------------------------------------------------------------
create table if not exists public.tags (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  status text not null default 'unclaimed' check (status in ('unclaimed', 'claimed')),
  pet_id uuid references public.pets(id) on delete set null,
  claimed_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  claimed_at timestamptz
);

alter table public.tags enable row level security;

-- Anyone scanning a physical tag needs to read its status/pet_id by code.
create policy "Public can read tags"
  on public.tags for select
  using (true);

create policy "Admins can insert tags"
  on public.tags for insert
  with check (public.is_admin());

-- A signed-in customer can claim any unclaimed tag for themselves; admins can
-- update any tag (e.g. to unlink/relink).
create policy "Claim unclaimed tags or admin update"
  on public.tags for update
  using (status = 'unclaimed' or public.is_admin())
  with check (
    public.is_admin()
    or (claimed_by = auth.uid() and status = 'claimed')
  );

create policy "Admins can delete tags"
  on public.tags for delete
  using (public.is_admin());

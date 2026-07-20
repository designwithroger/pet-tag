-- Fix infinite-recursion in the profiles RLS policies.
--
-- The admin SELECT/UPDATE policies in 002 query public.profiles from inside
-- a policy ON public.profiles, which Postgres evaluates recursively and then
-- aborts ("infinite recursion detected in policy for relation profiles").
-- That made every read of a user's own role fail, so no one was ever seen
-- as admin. Route the admin check through public.is_admin() instead, which
-- is SECURITY DEFINER and therefore bypasses RLS, breaking the loop.
--
-- Safe to run on top of 002. Re-runnable.

-- Make sure the helper exists (it's also created in 002, but define it here
-- too so this file is self-sufficient and ordering-independent).
create or replace function public.is_admin()
returns boolean as $$
  select exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  );
$$ language sql security definer stable set search_path = public;

drop policy if exists "Admins can read all profiles" on public.profiles;
create policy "Admins can read all profiles"
  on public.profiles for select
  using (public.is_admin());

drop policy if exists "Admins can update roles" on public.profiles;
create policy "Admins can update roles"
  on public.profiles for update
  using (public.is_admin());

-- Re-assert the primary admin, in case the earlier UPDATE ran before the
-- profile row existed for this account.
update public.profiles set role = 'admin'
where email = 'rfigueroa@capybaracreative.xyz';

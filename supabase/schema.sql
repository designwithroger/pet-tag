-- Pet Tag schema. Run this in the Supabase SQL editor (Project -> SQL Editor -> New query).

create table if not exists public.pets (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  slug text not null unique,
  name text not null,
  species text not null default '',
  age text not null default '',
  bio text not null default '',
  photo_url text,
  zone text not null default '',
  zone_lat double precision,
  zone_lng double precision,
  owner_name text not null default '',
  phone text not null default '',
  whatsapp_message text not null default '',
  verified boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.pets enable row level security;

-- Anyone (including anonymous NFC scanners) can read a pet profile by slug.
create policy "Public can read pets"
  on public.pets for select
  using (true);

-- Only the authenticated owner can create/update/delete their own pets.
create policy "Owners can insert their pets"
  on public.pets for insert
  with check (auth.uid() = owner_id);

create policy "Owners can update their pets"
  on public.pets for update
  using (auth.uid() = owner_id);

create policy "Owners can delete their pets"
  on public.pets for delete
  using (auth.uid() = owner_id);

-- Keep updated_at fresh
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_pets_updated_at on public.pets;
create trigger set_pets_updated_at
  before update on public.pets
  for each row execute function public.set_updated_at();

-- Storage bucket for pet photos (public read, owner-scoped write).
insert into storage.buckets (id, name, public)
values ('pet-photos', 'pet-photos', true)
on conflict (id) do nothing;

create policy "Public can view pet photos"
  on storage.objects for select
  using (bucket_id = 'pet-photos');

create policy "Authenticated users can upload pet photos"
  on storage.objects for insert
  with check (bucket_id = 'pet-photos' and auth.role() = 'authenticated');

create policy "Owners can update their own pet photos"
  on storage.objects for update
  using (bucket_id = 'pet-photos' and owner = auth.uid());

create policy "Owners can delete their own pet photos"
  on storage.objects for delete
  using (bucket_id = 'pet-photos' and owner = auth.uid());

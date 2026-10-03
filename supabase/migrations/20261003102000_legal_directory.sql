-- Legal-help directory: canonical public resource catalog.
-- Public users may read active listings; client roles cannot write.

create table if not exists public.directory_entries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  entry_type text not null check (entry_type in ('Private Attorney','Legal Aid','Advocacy Org','State Agency')),
  firm_or_org text,
  city text not null,
  state text not null default 'WA',
  county text,
  counties_served text[] not null default '{}',
  practice_areas text[] not null default '{}',
  fee_types text[] not null default '{}',
  website_url text,
  intake_phone text,
  intake_email text,
  bar_number text,
  accepts_case_builder_summary boolean not null default false,
  active_listing boolean not null default true,
  verification_status text not null default 'needs_verification'
    check (verification_status in ('needs_verification','source_checked','stale')),
  source_url text,
  source_type text,
  last_verified_at timestamptz,
  verification_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists directory_entries_practice_areas_gin
  on public.directory_entries using gin (practice_areas);
create index if not exists directory_entries_fee_types_gin
  on public.directory_entries using gin (fee_types);
create index if not exists directory_entries_counties_served_gin
  on public.directory_entries using gin (counties_served);
create index if not exists directory_entries_county_idx
  on public.directory_entries (county);
create index if not exists directory_entries_entry_type_idx
  on public.directory_entries (entry_type);
create index if not exists directory_entries_active_idx
  on public.directory_entries (active_listing);
create index if not exists directory_entries_verified_idx
  on public.directory_entries (verification_status);

alter table public.directory_entries enable row level security;

revoke insert, update, delete on table public.directory_entries from anon, authenticated;
grant select on table public.directory_entries to anon, authenticated;

drop policy if exists "Public can read active directory entries" on public.directory_entries;
create policy "Public can read active directory entries"
  on public.directory_entries
  for select
  to anon, authenticated
  using (active_listing = true);

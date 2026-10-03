-- Source registry for maintaining the legal-help directory.
create table if not exists public.directory_sources (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  source_type text not null check (source_type in ('official_registry','legal_aid_directory','organization_site','bar_association','public_records','partner_feed','api')),
  jurisdiction text,
  url text not null,
  access_method text not null check (access_method in ('public_page','data_request','api','partner_feed','manual_review')),
  cadence_days integer not null default 90 check (cadence_days >= 1),
  status text not null default 'active' check (status in ('active','paused','retired')),
  last_checked_at timestamptz,
  next_check_at timestamptz,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.directory_entries
  add column if not exists source_id uuid references public.directory_sources(id);

create index if not exists directory_entries_source_id_idx
  on public.directory_entries(source_id);

alter table public.directory_sources enable row level security;
revoke insert, update, delete on table public.directory_sources from anon, authenticated;
grant select on table public.directory_sources to anon, authenticated;

drop policy if exists "Public can read active directory sources" on public.directory_sources;
create policy "Public can read active directory sources"
  on public.directory_sources
  for select
  to anon, authenticated
  using (status = 'active');

insert into public.directory_sources
(name,source_type,jurisdiction,url,access_method,cadence_days,status,notes)
values
('Washington State Bar Association Legal Directory','official_registry','Washington','https://www.wsba.org/for-the-public/find-legal-help','public_page',90,'active','Use public directory data for licensing/status verification. Do not assume bulk contact-list redistribution rights.'),
('Washington Law Help Legal Help Directory','legal_aid_directory','Washington','https://www.washingtonlawhelp.org/en/get-legal-help','public_page',30,'active','Maintained by Northwest Justice Project; useful for legal-aid and local organization coverage.'),
('WSBA Qualified Legal Service Providers Directory','legal_aid_directory','Washington','https://www.wsba.org/connect-serve/pro-bono-public-service/qlsp-directory','public_page',30,'active','Official statewide QLSP directory for civil legal service providers.'),
('Disability Rights Washington','organization_site','Washington','https://www.disabilityrightswa.org/','public_page',90,'active','Organization-specific source for program scope and intake information.');

update public.directory_entries d
set source_id = s.id
from public.directory_sources s
where d.source_id is null
  and d.source_url = s.url;

-- Legal Help Network: source records and source-discovered civil-rights organization.
-- These are informational directory records and remain subject to direct verification.

insert into public.directory_sources
  (name, source_type, jurisdiction, url, access_method, cadence_days, status, notes)
values
  ('Washington Lawyers’ Committee for Civil Rights and Urban Affairs',
   'organization_site',
   'Washington, D.C. / national civil-rights work',
   'https://www.washlaw.org/',
   'public_page',
   30,
   'active',
   'Official organization site. Civil-rights legal help intake and Workers’ Rights Clinic information. Not a Washington State attorney directory.')
on conflict do nothing;

insert into public.directory_entries
  (name, entry_type, firm_or_org, city, state, counties_served, practice_areas,
   fee_types, website_url, accepts_case_builder_summary, active_listing,
   verification_status, source_url, source_type, verification_note, source_id)
select
  'Washington Lawyers’ Committee for Civil Rights and Urban Affairs',
  'Advocacy Org',
  'Washington Lawyers’ Committee for Civil Rights and Urban Affairs',
  'Washington',
  'DC',
  array[]::text[],
  array['Civil Rights','Disability Rights','Housing Discrimination','Employment Discrimination','Education']::text[],
  array['Verify Eligibility','Verify Availability']::text[],
  'https://www.washlaw.org/',
  false,
  true,
  'needs_verification',
  'https://www.washlaw.org/',
  'organization_site',
  'Source-discovered organization. Verify current jurisdiction, intake eligibility, and availability directly with the organization before relying on this listing.',
  s.id
from public.directory_sources s
where s.url = 'https://www.washlaw.org/'
  and not exists (
    select 1
    from public.directory_entries d
    where d.name = 'Washington Lawyers’ Committee for Civil Rights and Urban Affairs'
  );

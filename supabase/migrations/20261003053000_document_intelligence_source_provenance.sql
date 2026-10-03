-- Preserve source provenance for Document Intelligence promotions.
-- Applied to production before this migration file was committed.

alter table public.people
  add column if not exists source_locator_id uuid references public.evidence_locators(id);

alter table public.organizations
  add column if not exists source_locator_id uuid references public.evidence_locators(id);

alter table public.evidence_mentions
  add column if not exists source_locator_id uuid references public.evidence_locators(id);

create index if not exists people_source_locator_id_idx
  on public.people(source_locator_id);

create index if not exists organizations_source_locator_id_idx
  on public.organizations(source_locator_id);

create index if not exists evidence_mentions_source_locator_id_idx
  on public.evidence_mentions(source_locator_id);

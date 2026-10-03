create table if not exists public.evidence_reviews (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references public.cases(id) on delete cascade,
  document_id uuid not null references public.documents(id) on delete cascade,
  issue_id uuid references public.issues(id) on delete set null,
  review_status text not null default 'needs_review',
  supports text,
  contradicts text,
  unresolved text,
  locator text,
  reviewer_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.evidence_reviews enable row level security;

create index if not exists evidence_reviews_case_id_idx on public.evidence_reviews(case_id);
create index if not exists evidence_reviews_document_id_idx on public.evidence_reviews(document_id);
create index if not exists evidence_reviews_issue_id_idx on public.evidence_reviews(issue_id);

grant select, insert, update, delete on public.evidence_reviews to authenticated;

create policy evidence_reviews_owner_select on public.evidence_reviews
for select to authenticated
using (exists (
  select 1 from public.cases c
  where c.id = evidence_reviews.case_id
    and c.owner_user_id = (select auth.uid())
));

create policy evidence_reviews_owner_insert on public.evidence_reviews
for insert to authenticated
with check (exists (
  select 1 from public.cases c
  where c.id = evidence_reviews.case_id
    and c.owner_user_id = (select auth.uid())
));

create policy evidence_reviews_owner_update on public.evidence_reviews
for update to authenticated
using (exists (
  select 1 from public.cases c
  where c.id = evidence_reviews.case_id
    and c.owner_user_id = (select auth.uid())
))
with check (exists (
  select 1 from public.cases c
  where c.id = evidence_reviews.case_id
    and c.owner_user_id = (select auth.uid())
));

create policy evidence_reviews_owner_delete on public.evidence_reviews
for delete to authenticated
using (exists (
  select 1 from public.cases c
  where c.id = evidence_reviews.case_id
    and c.owner_user_id = (select auth.uid())
));
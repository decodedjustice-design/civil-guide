-- Authority Research Foundation
-- CourtListener is a candidate-authority research source; review/verification remains user-controlled.

create table if not exists public.authorities (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references public.cases(id) on delete cascade,
  title text,
  case_name text,
  citation text,
  court_name text,
  jurisdiction text,
  authority_type text not null default 'case'
    check (authority_type in ('case','statute','regulation','court rule','agency guidance','secondary')),
  decision_date date,
  effective_date date,
  source_url text,
  source_provider text not null default 'CourtListener',
  external_id text,
  summary text,
  relevant_excerpt text,
  locator text,
  search_query text,
  search_filters jsonb not null default '{}'::jsonb,
  retrieved_at timestamptz,
  verification_status text not null default 'candidate'
    check (verification_status in ('candidate','reviewed','verified','outdated')),
  reviewed_by uuid references auth.users(id),
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists authorities_case_id_idx on public.authorities(case_id);
create index if not exists authorities_external_id_idx on public.authorities(source_provider, external_id);
create index if not exists authorities_verification_status_idx on public.authorities(verification_status);
create index if not exists authorities_jurisdiction_idx on public.authorities(jurisdiction);
create unique index if not exists authorities_case_provider_external_uidx
  on public.authorities(case_id, source_provider, external_id)
  where external_id is not null;

create table if not exists public.authority_issue_links (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references public.cases(id) on delete cascade,
  authority_id uuid not null references public.authorities(id) on delete cascade,
  issue_id uuid not null references public.issues(id) on delete cascade,
  note text,
  created_at timestamptz not null default now(),
  unique(authority_id, issue_id)
);

create table if not exists public.authority_element_links (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references public.cases(id) on delete cascade,
  authority_id uuid not null references public.authorities(id) on delete cascade,
  issue_id uuid not null references public.issues(id) on delete cascade,
  element_key text not null,
  element_label text,
  note text,
  created_at timestamptz not null default now(),
  unique(authority_id, issue_id, element_key)
);

create table if not exists public.authority_evidence_links (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references public.cases(id) on delete cascade,
  authority_id uuid not null references public.authorities(id) on delete cascade,
  document_id uuid not null references public.documents(id) on delete cascade,
  evidence_review_id uuid references public.evidence_reviews(id) on delete set null,
  note text,
  created_at timestamptz not null default now(),
  unique(authority_id, document_id)
);

create table if not exists public.authority_claim_links (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references public.cases(id) on delete cascade,
  authority_id uuid not null references public.authorities(id) on delete cascade,
  claim_id uuid not null references public.claims(id) on delete cascade,
  note text,
  created_at timestamptz not null default now(),
  unique(authority_id, claim_id)
);

create table if not exists public.authority_task_links (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references public.cases(id) on delete cascade,
  authority_id uuid not null references public.authorities(id) on delete cascade,
  task_id uuid not null references public.tasks(id) on delete cascade,
  note text,
  created_at timestamptz not null default now(),
  unique(authority_id, task_id)
);

create index if not exists authority_issue_links_case_id_idx on public.authority_issue_links(case_id);
create index if not exists authority_element_links_case_id_idx on public.authority_element_links(case_id);
create index if not exists authority_evidence_links_case_id_idx on public.authority_evidence_links(case_id);
create index if not exists authority_claim_links_case_id_idx on public.authority_claim_links(case_id);
create index if not exists authority_task_links_case_id_idx on public.authority_task_links(case_id);

create index if not exists authorities_reviewed_by_idx on public.authorities(reviewed_by);
create index if not exists authority_issue_links_authority_id_idx on public.authority_issue_links(authority_id);
create index if not exists authority_issue_links_issue_id_idx on public.authority_issue_links(issue_id);
create index if not exists authority_element_links_authority_id_idx on public.authority_element_links(authority_id);
create index if not exists authority_element_links_issue_id_idx on public.authority_element_links(issue_id);
create index if not exists authority_evidence_links_authority_id_idx on public.authority_evidence_links(authority_id);
create index if not exists authority_evidence_links_document_id_idx on public.authority_evidence_links(document_id);
create index if not exists authority_evidence_links_review_id_idx on public.authority_evidence_links(evidence_review_id);
create index if not exists authority_claim_links_authority_id_idx on public.authority_claim_links(authority_id);
create index if not exists authority_claim_links_claim_id_idx on public.authority_claim_links(claim_id);
create index if not exists authority_task_links_authority_id_idx on public.authority_task_links(authority_id);
create index if not exists authority_task_links_task_id_idx on public.authority_task_links(task_id);

alter table public.authorities enable row level security;
alter table public.authority_issue_links enable row level security;
alter table public.authority_element_links enable row level security;
alter table public.authority_evidence_links enable row level security;
alter table public.authority_claim_links enable row level security;
alter table public.authority_task_links enable row level security;

create policy authorities_owner_read on public.authorities for select to authenticated
  using ((select private.is_case_owner(case_id, (select auth.uid()))));
create policy authorities_owner_insert on public.authorities for insert to authenticated
  with check ((select private.is_case_owner(case_id, (select auth.uid()))));
create policy authorities_owner_update on public.authorities for update to authenticated
  using ((select private.is_case_owner(case_id, (select auth.uid()))))
  with check ((select private.is_case_owner(case_id, (select auth.uid()))));
create policy authorities_owner_delete on public.authorities for delete to authenticated
  using ((select private.is_case_owner(case_id, (select auth.uid()))));

create policy authority_issue_links_owner_read on public.authority_issue_links for select to authenticated
  using ((select private.is_case_owner(case_id, (select auth.uid()))));
create policy authority_issue_links_owner_insert on public.authority_issue_links for insert to authenticated
  with check ((select private.is_case_owner(case_id, (select auth.uid()))));
create policy authority_issue_links_owner_update on public.authority_issue_links for update to authenticated
  using ((select private.is_case_owner(case_id, (select auth.uid()))))
  with check ((select private.is_case_owner(case_id, (select auth.uid()))));
create policy authority_issue_links_owner_delete on public.authority_issue_links for delete to authenticated
  using ((select private.is_case_owner(case_id, (select auth.uid()))));

create policy authority_element_links_owner_read on public.authority_element_links for select to authenticated
  using ((select private.is_case_owner(case_id, (select auth.uid()))));
create policy authority_element_links_owner_insert on public.authority_element_links for insert to authenticated
  with check ((select private.is_case_owner(case_id, (select auth.uid()))));
create policy authority_element_links_owner_update on public.authority_element_links for update to authenticated
  using ((select private.is_case_owner(case_id, (select auth.uid()))))
  with check ((select private.is_case_owner(case_id, (select auth.uid()))));
create policy authority_element_links_owner_delete on public.authority_element_links for delete to authenticated
  using ((select private.is_case_owner(case_id, (select auth.uid()))));

create policy authority_evidence_links_owner_read on public.authority_evidence_links for select to authenticated
  using ((select private.is_case_owner(case_id, (select auth.uid()))));
create policy authority_evidence_links_owner_insert on public.authority_evidence_links for insert to authenticated
  with check ((select private.is_case_owner(case_id, (select auth.uid()))));
create policy authority_evidence_links_owner_update on public.authority_evidence_links for update to authenticated
  using ((select private.is_case_owner(case_id, (select auth.uid()))))
  with check ((select private.is_case_owner(case_id, (select auth.uid()))));
create policy authority_evidence_links_owner_delete on public.authority_evidence_links for delete to authenticated
  using ((select private.is_case_owner(case_id, (select auth.uid()))));

create policy authority_claim_links_owner_read on public.authority_claim_links for select to authenticated
  using ((select private.is_case_owner(case_id, (select auth.uid()))));
create policy authority_claim_links_owner_insert on public.authority_claim_links for insert to authenticated
  with check ((select private.is_case_owner(case_id, (select auth.uid()))));
create policy authority_claim_links_owner_update on public.authority_claim_links for update to authenticated
  using ((select private.is_case_owner(case_id, (select auth.uid()))))
  with check ((select private.is_case_owner(case_id, (select auth.uid()))));
create policy authority_claim_links_owner_delete on public.authority_claim_links for delete to authenticated
  using ((select private.is_case_owner(case_id, (select auth.uid()))));

create policy authority_task_links_owner_read on public.authority_task_links for select to authenticated
  using ((select private.is_case_owner(case_id, (select auth.uid()))));
create policy authority_task_links_owner_insert on public.authority_task_links for insert to authenticated
  with check ((select private.is_case_owner(case_id, (select auth.uid()))));
create policy authority_task_links_owner_update on public.authority_task_links for update to authenticated
  using ((select private.is_case_owner(case_id, (select auth.uid()))))
  with check ((select private.is_case_owner(case_id, (select auth.uid()))));
create policy authority_task_links_owner_delete on public.authority_task_links for delete to authenticated
  using ((select private.is_case_owner(case_id, (select auth.uid()))));

grant select, insert, update, delete on public.authorities to authenticated;
grant select, insert, update, delete on public.authority_issue_links to authenticated;
grant select, insert, update, delete on public.authority_element_links to authenticated;
grant select, insert, update, delete on public.authority_evidence_links to authenticated;
grant select, insert, update, delete on public.authority_claim_links to authenticated;
grant select, insert, update, delete on public.authority_task_links to authenticated;

-- Pattern Intelligence v1 foundation
-- Governing boundary: private-case intelligence only.
-- No cross-case analytics, research access, publication workflow, or automated findings.
-- Derived Pattern Signals are separate from evidence and preserve version/challenge history.

create table if not exists public.pattern_signals (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references public.cases(id) on delete cascade,
  pattern_type text not null check (pattern_type in ('recurrence','potential_inconsistency','information_gap')),
  neutral_name text not null,
  neutral_description text not null,
  observation_unit text not null default 'distinct_event',
  scope text not null default 'private_case' check (scope = 'private_case'),
  permitted_use text not null default 'private_case' check (permitted_use = 'private_case'),
  coverage jsonb not null default '{}'::jsonb,
  support_assessment jsonb not null default '{}'::jsonb,
  truth_status text not null default 'INFERENCE'
    check (truth_status in ('RECORD','INFERENCE','USER_ASSESSMENT','AUTHORIZED_DETERMINATION','UNKNOWN','INSUFFICIENT_EVIDENCE')),
  workflow_state text not null default 'candidate'
    check (workflow_state in ('candidate','under_review','accepted','challenged','action_taken','closed_by_user','archived')),
  assessment_state text not null default 'not_assessed'
    check (assessment_state in ('not_assessed','insufficient_evidence','supported_within_available_materials','mixed_or_disputed','not_supported_after_review','formal_determination_recorded')),
  detection_basis jsonb not null default '{}'::jsonb,
  methodology jsonb not null default '{}'::jsonb,
  legal_context jsonb not null default '{}'::jsonb,
  missing_evidence jsonb not null default '[]'::jsonb,
  alternative_explanations jsonb not null default '[]'::jsonb,
  current_version integer not null default 1,
  superseded_by uuid references public.pattern_signals(id) on delete set null,
  created_by uuid references auth.users(id),
  reviewed_by uuid references auth.users(id),
  reviewed_at timestamptz,
  last_recomputed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists pattern_signals_case_idx on public.pattern_signals(case_id, updated_at desc);
create index if not exists pattern_signals_state_idx on public.pattern_signals(case_id, workflow_state, assessment_state);

create table if not exists public.pattern_signal_occurrences (
  id uuid primary key default gen_random_uuid(),
  pattern_signal_id uuid not null references public.pattern_signals(id) on delete cascade,
  event_id uuid references public.events(id) on delete set null,
  occurrence_key text not null,
  occurrence_date timestamptz,
  occurrence_summary text not null,
  truth_status text not null default 'RECORD'
    check (truth_status in ('RECORD','INFERENCE','USER_ASSESSMENT','AUTHORIZED_DETERMINATION','UNKNOWN','INSUFFICIENT_EVIDENCE')),
  included boolean not null default true,
  exclusion_reason text,
  source_locator_ids uuid[] not null default '{}'::uuid[],
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(pattern_signal_id, occurrence_key)
);

create unique index if not exists pattern_signal_occurrence_event_uidx
  on public.pattern_signal_occurrences(pattern_signal_id, event_id)
  where event_id is not null;

create index if not exists pattern_signal_occurrences_signal_idx
  on public.pattern_signal_occurrences(pattern_signal_id, included);

create table if not exists public.pattern_signal_evidence (
  id uuid primary key default gen_random_uuid(),
  pattern_signal_id uuid not null references public.pattern_signals(id) on delete cascade,
  occurrence_id uuid references public.pattern_signal_occurrences(id) on delete cascade,
  evidence_role text not null check (evidence_role in ('supporting','countervailing')),
  document_id uuid references public.documents(id) on delete set null,
  document_version_id uuid references public.document_versions(id) on delete set null,
  evidence_locator_id uuid references public.evidence_locators(id) on delete set null,
  extracted_statement text,
  context text,
  source_status text not null default 'RECORD'
    check (source_status in ('RECORD','INFERENCE','USER_ASSESSMENT','AUTHORIZED_DETERMINATION','UNKNOWN','INSUFFICIENT_EVIDENCE')),
  created_at timestamptz not null default now()
);

create index if not exists pattern_signal_evidence_signal_idx
  on public.pattern_signal_evidence(pattern_signal_id, evidence_role);
create index if not exists pattern_signal_evidence_locator_idx
  on public.pattern_signal_evidence(evidence_locator_id);

create table if not exists public.pattern_signal_challenges (
  id uuid primary key default gen_random_uuid(),
  pattern_signal_id uuid not null references public.pattern_signals(id) on delete cascade,
  occurrence_id uuid references public.pattern_signal_occurrences(id) on delete set null,
  challenge_type text not null check (challenge_type in (
    'dispute_extraction',
    'correct_extraction',
    'dispute_relationship',
    'exclude_occurrence',
    'add_counterevidence',
    'add_alternative_explanation',
    'request_recomputation'
  )),
  explanation text not null,
  correction jsonb,
  counterevidence jsonb not null default '[]'::jsonb,
  alternative_explanation text,
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now(),
  resolved_at timestamptz,
  resolution text
);

create index if not exists pattern_signal_challenges_signal_idx
  on public.pattern_signal_challenges(pattern_signal_id, created_at desc);

create table if not exists public.pattern_signal_versions (
  id uuid primary key default gen_random_uuid(),
  pattern_signal_id uuid not null references public.pattern_signals(id) on delete cascade,
  version_no integer not null,
  version_reason text not null,
  snapshot jsonb not null,
  generated_from_challenge_id uuid references public.pattern_signal_challenges(id) on delete set null,
  generated_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  unique(pattern_signal_id, version_no)
);

create index if not exists pattern_signal_versions_signal_idx
  on public.pattern_signal_versions(pattern_signal_id, version_no desc);

create table if not exists public.pattern_signal_audit (
  id uuid primary key default gen_random_uuid(),
  pattern_signal_id uuid not null references public.pattern_signals(id) on delete cascade,
  action text not null,
  actor_user_id uuid references auth.users(id),
  from_version integer,
  to_version integer,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists pattern_signal_audit_signal_idx
  on public.pattern_signal_audit(pattern_signal_id, created_at desc);

-- Research isolation is structural in v1: these objects can only carry private-case use.
-- There is deliberately no research_dataset_id, aggregate scope, or publication state.

alter table public.pattern_signals enable row level security;
alter table public.pattern_signal_occurrences enable row level security;
alter table public.pattern_signal_evidence enable row level security;
alter table public.pattern_signal_challenges enable row level security;
alter table public.pattern_signal_versions enable row level security;
alter table public.pattern_signal_audit enable row level security;

drop policy if exists pattern_signals_owner_read on public.pattern_signals;
create policy pattern_signals_owner_read on public.pattern_signals for select to authenticated
  using ((select private.is_case_owner(case_id, (select auth.uid()))));
drop policy if exists pattern_signals_owner_insert on public.pattern_signals;
create policy pattern_signals_owner_insert on public.pattern_signals for insert to authenticated
  with check ((select private.is_case_owner(case_id, (select auth.uid()))));
drop policy if exists pattern_signals_owner_update on public.pattern_signals;
create policy pattern_signals_owner_update on public.pattern_signals for update to authenticated
  using ((select private.is_case_owner(case_id, (select auth.uid()))))
  with check ((select private.is_case_owner(case_id, (select auth.uid()))));
drop policy if exists pattern_signals_owner_delete on public.pattern_signals;
create policy pattern_signals_owner_delete on public.pattern_signals for delete to authenticated
  using ((select private.is_case_owner(case_id, (select auth.uid()))));

drop policy if exists pattern_signal_occurrences_owner_access on public.pattern_signal_occurrences;
create policy pattern_signal_occurrences_owner_access on public.pattern_signal_occurrences for all to authenticated
  using (exists (select 1 from public.pattern_signals p where p.id = pattern_signal_occurrences.pattern_signal_id and private.is_case_owner(p.case_id, auth.uid())))
  with check (exists (select 1 from public.pattern_signals p where p.id = pattern_signal_occurrences.pattern_signal_id and private.is_case_owner(p.case_id, auth.uid())));

drop policy if exists pattern_signal_evidence_owner_access on public.pattern_signal_evidence;
create policy pattern_signal_evidence_owner_access on public.pattern_signal_evidence for all to authenticated
  using (exists (select 1 from public.pattern_signals p where p.id = pattern_signal_evidence.pattern_signal_id and private.is_case_owner(p.case_id, auth.uid())))
  with check (exists (select 1 from public.pattern_signals p where p.id = pattern_signal_evidence.pattern_signal_id and private.is_case_owner(p.case_id, auth.uid())));

drop policy if exists pattern_signal_challenges_owner_access on public.pattern_signal_challenges;
create policy pattern_signal_challenges_owner_access on public.pattern_signal_challenges for all to authenticated
  using (exists (select 1 from public.pattern_signals p where p.id = pattern_signal_challenges.pattern_signal_id and private.is_case_owner(p.case_id, auth.uid())))
  with check (exists (select 1 from public.pattern_signals p where p.id = pattern_signal_challenges.pattern_signal_id and private.is_case_owner(p.case_id, auth.uid())));

drop policy if exists pattern_signal_versions_owner_access on public.pattern_signal_versions;
create policy pattern_signal_versions_owner_access on public.pattern_signal_versions for all to authenticated
  using (exists (select 1 from public.pattern_signals p where p.id = pattern_signal_versions.pattern_signal_id and private.is_case_owner(p.case_id, auth.uid())))
  with check (exists (select 1 from public.pattern_signals p where p.id = pattern_signal_versions.pattern_signal_id and private.is_case_owner(p.case_id, auth.uid())));

drop policy if exists pattern_signal_audit_owner_read on public.pattern_signal_audit;
create policy pattern_signal_audit_owner_read on public.pattern_signal_audit for select to authenticated
  using (exists (select 1 from public.pattern_signals p where p.id = pattern_signal_audit.pattern_signal_id and private.is_case_owner(p.case_id, auth.uid())));

grant select, insert, update, delete on public.pattern_signals to authenticated;
grant select, insert, update, delete on public.pattern_signal_occurrences to authenticated;
grant select, insert, update, delete on public.pattern_signal_evidence to authenticated;
grant select, insert, update, delete on public.pattern_signal_challenges to authenticated;
grant select, insert, update, delete on public.pattern_signal_versions to authenticated;
grant select on public.pattern_signal_audit to authenticated;

grant all on public.pattern_signals to service_role;
grant all on public.pattern_signal_occurrences to service_role;
grant all on public.pattern_signal_evidence to service_role;
grant all on public.pattern_signal_challenges to service_role;
grant all on public.pattern_signal_versions to service_role;
grant all on public.pattern_signal_audit to service_role;

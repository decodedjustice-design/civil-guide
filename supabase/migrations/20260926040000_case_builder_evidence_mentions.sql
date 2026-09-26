-- Case Builder: track evidence mentioned in narrative without fabricating document records.
create table if not exists public.evidence_mentions (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references public.cases(id) on delete cascade,
  evidence_type text not null,
  description text,
  approximate_date text,
  related_issue_id uuid references public.issues(id) on delete set null,
  priority text default 'medium',
  status text default 'mentioned',
  source_type text default 'user_narrative',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists evidence_mentions_case_id_idx
  on public.evidence_mentions(case_id);

alter table public.evidence_mentions enable row level security;

drop policy if exists "case owners can select evidence mentions" on public.evidence_mentions;
create policy "case owners can select evidence mentions"
  on public.evidence_mentions for select to authenticated
  using (exists (
    select 1 from public.cases c
    where c.id = evidence_mentions.case_id
      and c.owner_user_id = auth.uid()
  ));

drop policy if exists "case owners can insert evidence mentions" on public.evidence_mentions;
create policy "case owners can insert evidence mentions"
  on public.evidence_mentions for insert to authenticated
  with check (exists (
    select 1 from public.cases c
    where c.id = evidence_mentions.case_id
      and c.owner_user_id = auth.uid()
  ));

drop policy if exists "case owners can update evidence mentions" on public.evidence_mentions;
create policy "case owners can update evidence mentions"
  on public.evidence_mentions for update to authenticated
  using (exists (
    select 1 from public.cases c
    where c.id = evidence_mentions.case_id
      and c.owner_user_id = auth.uid()
  ))
  with check (exists (
    select 1 from public.cases c
    where c.id = evidence_mentions.case_id
      and c.owner_user_id = auth.uid()
  ));

drop policy if exists "case owners can delete evidence mentions" on public.evidence_mentions;
create policy "case owners can delete evidence mentions"
  on public.evidence_mentions for delete to authenticated
  using (exists (
    select 1 from public.cases c
    where c.id = evidence_mentions.case_id
      and c.owner_user_id = auth.uid()
  ));
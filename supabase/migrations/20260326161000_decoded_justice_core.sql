-- Decoded Justice core schema

create table if not exists public.cases (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  location text not null,
  incident_date date not null,
  created_at timestamptz not null default now()
);

create table if not exists public.timeline_events (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references public.cases(id) on delete cascade,
  date timestamptz not null,
  title text not null,
  description text not null
);

create table if not exists public.evidence (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references public.cases(id) on delete cascade,
  type text not null check (type in ('document', 'photo', 'video', 'audio', 'message', 'other')),
  description text not null,
  file_url text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.issues (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references public.cases(id) on delete cascade,
  type text not null check (type in ('housing', 'employment', 'education', 'disability', 'policing', 'other')),
  description text not null
);

create table if not exists public.notes (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references public.cases(id) on delete cascade,
  content text not null
);

create index if not exists idx_timeline_events_case_id_date
  on public.timeline_events (case_id, date asc);

create index if not exists idx_evidence_case_id_created_at
  on public.evidence (case_id, created_at asc);

create index if not exists idx_issues_case_id_type
  on public.issues (case_id, type);

create index if not exists idx_notes_case_id
  on public.notes (case_id);

create index if not exists idx_cases_incident_date
  on public.cases (incident_date desc);

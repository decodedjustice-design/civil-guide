-- Pro Se Toolkit tables (non-destructive additions)

create table if not exists public.pro_se_cases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  intake_data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- Existing table name `attorney_contacts` is already used by another feature,
-- so this module uses isolated toolkit tables to avoid breaking integrations.
create table if not exists public.pro_se_attorney_contacts (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references public.pro_se_cases(id) on delete cascade,
  name text not null,
  outcome text not null,
  date date not null
);

create table if not exists public.pro_se_legal_aid_contacts (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references public.pro_se_cases(id) on delete cascade,
  org_name text not null,
  result text not null
);

create table if not exists public.pro_se_evidence_files (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references public.pro_se_cases(id) on delete cascade,
  category text not null,
  file_url text not null,
  metadata jsonb not null default '{}'::jsonb
);

create index if not exists idx_pro_se_cases_user_id on public.pro_se_cases(user_id);
create index if not exists idx_pro_se_attorney_contacts_case_id on public.pro_se_attorney_contacts(case_id);
create index if not exists idx_pro_se_legal_aid_contacts_case_id on public.pro_se_legal_aid_contacts(case_id);
create index if not exists idx_pro_se_evidence_files_case_id on public.pro_se_evidence_files(case_id);

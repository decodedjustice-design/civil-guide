-- Track narrative provenance and review state for non-destructive reconciliation.
alter table public.people add column if not exists source_type text not null default 'user_entered';
alter table public.people add column if not exists review_status text not null default 'reviewed';

alter table public.organizations add column if not exists source_type text not null default 'user_entered';
alter table public.organizations add column if not exists review_status text not null default 'reviewed';

alter table public.communications add column if not exists source_type text not null default 'user_entered';
alter table public.communications add column if not exists review_status text not null default 'reviewed';

alter table public.tasks add column if not exists source_type text not null default 'user_entered';
alter table public.tasks add column if not exists review_status text not null default 'reviewed';

alter table public.issues add column if not exists review_status text not null default 'reviewed';
alter table public.events add column if not exists review_status text not null default 'reviewed';
alter table public.evidence_mentions add column if not exists review_status text not null default 'unreviewed';

update public.people
set source_type = 'user_narrative', review_status = 'unreviewed'
where coalesce(notes, '') like 'Extracted from the user''s narrative.%';

update public.organizations
set source_type = 'user_narrative', review_status = 'unreviewed'
where coalesce(notes, '') like 'Mentioned in the user''s narrative.%';

update public.issues
set review_status = 'unreviewed'
where origin = 'narrative' and source = 'Case Signal Engine';

update public.events
set review_status = case when reviewed then 'reviewed' else 'unreviewed' end
where source_type = 'user_narrative';

update public.evidence_mentions
set review_status = 'unreviewed'
where source_type = 'user_narrative';

create index if not exists people_case_review_status_idx on public.people(case_id, source_type, review_status);
create index if not exists organizations_case_review_status_idx on public.organizations(case_id, source_type, review_status);
create index if not exists communications_case_review_status_idx on public.communications(case_id, source_type, review_status);
create index if not exists tasks_case_review_status_idx on public.tasks(case_id, task_type, source_type, review_status);
create index if not exists issues_case_review_status_idx on public.issues(case_id, origin, review_status);
create index if not exists events_case_review_status_idx on public.events(case_id, source_type, review_status);
create index if not exists evidence_mentions_case_review_status_idx on public.evidence_mentions(case_id, source_type, review_status);

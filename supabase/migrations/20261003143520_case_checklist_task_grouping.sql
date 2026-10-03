alter table public.tasks
  add column if not exists checklist_key text;

create index if not exists tasks_case_checklist_idx
  on public.tasks(case_id, checklist_key, status);

comment on column public.tasks.checklist_key is
  'Stable checklist grouping key for case self-advocacy/readiness checklists. Items remain canonical tasks.';

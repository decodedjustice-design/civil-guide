-- Link the existing Analyzer issue IDs to the structured knowledge core.
alter table public.legal_issues
  add column if not exists analyzer_issue_id text;

create unique index if not exists legal_issues_analyzer_issue_id_uq
  on public.legal_issues(analyzer_issue_id)
  where analyzer_issue_id is not null;

update public.legal_issues
set analyzer_issue_id = case issue_code
  when 'FIRST_AMENDMENT_RETALIATION' then 'first-amendment-retaliation'
  when 'FOURTH_AMENDMENT_SEARCH' then 'fourth-amendment-search'
end
where issue_code in ('FIRST_AMENDMENT_RETALIATION','FOURTH_AMENDMENT_SEARCH');

alter table public.issues
  add column if not exists legal_issue_id uuid references public.legal_issues(id) on delete set null;

create index if not exists issues_legal_issue_id_idx on public.issues(legal_issue_id);

-- Harden Pattern Intelligence v1 governance after schema review.
-- Historical versions and audit records are append/read-only to authenticated users.

alter table public.pattern_signals
  drop constraint if exists pattern_signals_authorized_reviewer_check;

alter table public.pattern_signals
  add constraint pattern_signals_authorized_reviewer_check
  check (
    truth_status <> 'AUTHORIZED_DETERMINATION'
    or (reviewed_by is not null and assessment_state = 'formal_determination_recorded')
  );

alter table public.pattern_signal_occurrences
  drop constraint if exists pattern_occurrence_provenance_check;

alter table public.pattern_signal_occurrences
  add constraint pattern_occurrence_provenance_check
  check (
    cardinality(source_locator_ids) > 0
    or truth_status in ('UNKNOWN','INSUFFICIENT_EVIDENCE')
  );

drop policy if exists pattern_signal_versions_owner_access on public.pattern_signal_versions;
create policy pattern_signal_versions_owner_select on public.pattern_signal_versions for select to authenticated
  using (exists (
    select 1 from public.pattern_signals p
    where p.id = pattern_signal_versions.pattern_signal_id
      and private.is_case_owner(p.case_id, auth.uid())
  ));
create policy pattern_signal_versions_owner_insert on public.pattern_signal_versions for insert to authenticated
  with check (exists (
    select 1 from public.pattern_signals p
    where p.id = pattern_signal_versions.pattern_signal_id
      and private.is_case_owner(p.case_id, auth.uid())
  ));

revoke update, delete on public.pattern_signal_versions from authenticated;
revoke insert, update, delete on public.pattern_signal_audit from authenticated;

-- Version rows and audit rows are append-only from the application role.
-- Service role remains available for controlled server-side writes.

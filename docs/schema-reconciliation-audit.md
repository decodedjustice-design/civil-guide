# Decoded Justice — Schema Reconciliation Audit

Last updated: 2026-11-07

## Scope and evidence

This document records a source-repository review of the current `main` branch after commit `447cf24aae945a7f53c6025447bbb9b6ae41c06c`.

Reviewed repository files include:

- `src/lib/case/schema.ts`
- `src/hooks/useCaseSnapshot.ts`
- `src/integrations/supabase/types.ts`
- `src/components/analyzer/AnalyzerResults.tsx`
- `package.json`

**Important limitation:** this is a code-level reconciliation audit, not a fresh query against the live Supabase project's metadata. Generated TypeScript types and source code are not, by themselves, proof that the connected database currently has every listed table, column, foreign key, or policy. Verify live metadata through the existing Lovable-configured Supabase project before relying on a table/column in runtime behavior.

## Current source-code model

The current frontend defines a legacy case-workspace table map in `src/lib/case/schema.ts`. It includes:

- `evidence`
- `timeline_entries`
- `case_issues`
- `case_people`
- `case_organizations`
- `case_communications`
- `case_records_requests`
- `case_record_gaps`
- `case_evidence_mentions`
- `case_links`
- `case_packets`
- `notes`

The generated types file also contains these table definitions alongside other application tables such as `cases` and `analyzer_results`. This establishes what the checked-in frontend currently expects; it does not independently establish live database state.

## Changes present in the reviewed commit

The reviewed source now uses explicit projections in `CASE_COLUMNS` and a shared `casePayload(table, values, caseId, userId)` helper. The case snapshot loader filters case-workspace reads by both `case_id` and `user_id`.

The Analyzer workspace-creation flow writes multiple related records sequentially: issues, record-gap suggestions, a timeline entry, an evidence/intake record, and a case packet. Its error handling warns that partial writes may already exist if a later step fails. There is no verified transaction or automatic rollback in the inspected flow.

Some formerly implemented views were replaced by unavailable/placeholder states in the reviewed commit. These features must be tracked as deferred or disabled until their behavior is restored and tested; a successful build is not feature-completion evidence.

## Verification status

- GitHub Actions production build and changed-file lint were reported as passing for the reviewed commit in the prior check.
- This confirms those automated checks ran successfully; it does not prove database CRUD, RLS behavior, multi-record consistency, deployed runtime behavior, or end-to-end functionality.
- No live database records were changed or tested as part of this review.
- No schema, migration, RLS, grants, secrets, project settings, or deployment changes are authorized in this reconciliation pass.

## Risks and required next work

1. **Verify the connected backend metadata.** Using the existing configured Supabase project only, compare actual tables, columns, foreign keys, and RLS policies with `CASE_COLUMNS` and generated TypeScript types. Do not create or reconnect a project.
2. **Validate every form against its column allowlist.** `casePayload` throws on an unsupported field, so mismatched UI fields can block saves. Confirm every create/update form uses valid column names.
3. **Test Analyzer partial-write recovery.** Use a safe test case/account and verify what remains when an intermediate write fails. Do not test by altering real case records. Prefer idempotent recovery or an explicit resumable state before expanding the workflow.
4. **Restore or explicitly defer disabled features.** Inspect `CaseChecklists.tsx`, `CaseDocumentIntelligence.tsx`, and `CaseEvidenceReview.tsx`; document the remaining behavior and acceptance tests before marking them complete.
5. **Add focused automated tests.** Cover the payload allowlist, case/user scoping, empty snapshots, form-to-column mapping, and Analyzer failure states.
6. **Only after these checks, resume feature work.** The Accountability Tracker remains out of scope for this pass until the core persistence layer is verified.

## Historical note

Earlier versions of this document named Supabase project ID `xoxzmslafujibnwlnnnt` and described a different Milestone 1B schema. That historical assertion has not been revalidated against the currently configured project in this document and must not be treated as current backend truth.

## Safety rules

- Do not apply `20260923093000_case_binder_feature_harvest.sql` as-is.
- Do not create or apply database migrations during this pass.
- Do not change schema, data, RLS, grants, secrets, integrations, or project settings.
- Do not publish or deploy.

# Decoded Justice — Schema Reconciliation Audit

Date: 2026-09-23

## Canonical development backend

The application is configured to use Supabase project `decoded-justice-dev`:

- Project ID: `xoxzmslafujibnwlnnnt`
- Region: West US (North California)
- Status at audit: Healthy

No database schema changes were made during this audit.

## Finding 1 — Current database architecture

The live `public` schema uses the Milestone 1B case-intelligence model:

- cases
- case_memberships
- case_numbers
- people
- events
- claims
- issues
- tasks
- documents
- document_versions
- document_derivatives
- extracted_text
- evidence_locators
- processing_runs
- ai_runs
- ai_extractions
- review_decisions
- record_versions
- audit_logs
- profiles

The current schema does not contain the legacy Case Binder tables used by parts of the frontend, including `evidence`, `timeline_entries`, `case_issues`, `case_people`, `case_organizations`, `case_communications`, `case_records_requests`, `case_record_gaps`, `case_links`, or `case_packets`.

## Finding 2 — Frontend/schema mismatch

The current GitHub application still contains references to the legacy case-workspace tables. Confirmed examples include:

- `src/hooks/useCaseSnapshot.ts` → `evidence`, `timeline_entries`, `case_issues`, `case_people`, `case_organizations`, `case_communications`, `case_records_requests`, `case_record_gaps`, `notes`, `case_links`
- `src/pages/cases/CaseTimeline.tsx` → `timeline_entries`
- `src/pages/cases/CaseIssues.tsx` → `case_issues`
- `src/pages/cases/CaseRecordGaps.tsx` → `case_record_gaps`
- `src/pages/Timeline.tsx` → `timeline_entries`
- `src/pages/Dashboard.tsx` → `evidence`, `timeline_entries`, `notes`
- `src/hooks/useCaseBuilder.ts` → `justice_place_cases`, `evidence`, `timeline_entries`, `analyzer_results`, `intake_packets`
- `src/lib/mcp/tools/add-timeline-entry.ts` and `list-timeline-entries.ts` → `timeline_entries`
- `src/components/analyzer/AnalyzerResults.tsx` → inserts into `case_issues`

These references are incompatible with the currently inspected Supabase schema unless additional legacy tables exist outside the inspected public schema.

## Finding 3 — The existing Case Binder migration must not be applied as-is

The committed migration `20260923093000_case_binder_feature_harvest.sql` alters legacy tables `evidence` and `case_issues` and creates `case_record_gaps`.

Because those legacy tables are absent from the current database, this migration is not the correct migration for `decoded-justice-dev`.

It should be treated as a historical/obsolete implementation draft and replaced by migrations designed for the Milestone 1B model.

## Target mapping for reconciliation

| Legacy/UI concept | Canonical Milestone 1B target |
|---|---|
| Case | cases |
| People / parties | people |
| Timeline | events |
| Claims / allegations | claims |
| Issues | issues |
| Follow-ups / missing-record actions | tasks |
| Evidence/document record | documents |
| Original/version preservation | document_versions |
| Extracted text | extracted_text |
| Exact source locator | evidence_locators |
| Processing provenance | processing_runs |
| AI provenance | ai_runs + ai_extractions |
| Human review | review_decisions |
| Record history | record_versions |
| Audit trail | audit_logs |
| Record gaps | new table designed around cases/issues/tasks |
| Case relationships | new relationship layer only if not already represented by canonical records |

## Required next work

1. Update generated TypeScript database types to match the live Milestone 1B schema.
2. Refactor the case workspace snapshot and RecordManager to use canonical tables.
3. Map existing Case Binder features onto canonical records rather than creating duplicate tables.
4. Design only the genuinely missing structures (especially record gaps/explicit relationships) against the canonical model.
5. Replace or retire the legacy Case Binder migration before any production database migration is attempted.
6. Run build/type checks after the reconciliation changes.

## Safety rule

Do not apply `20260923093000_case_binder_feature_harvest.sql` to `decoded-justice-dev` in its current form.

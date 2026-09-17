# Merge Case Binder Pro into Decoded Justice

Decoded Justice stays the product, the brand, and the public face. Case Binder Pro becomes the case-workspace layer inside it. Nothing existing is deleted.

## What I found

Decoded Justice today:
- Real backend with per-user data: cases (Justice Place), evidence, timeline entries, notes, analyzer results, intake packets, attorney contacts.
- Strong, working features: violation/issue detection engine, Legal Decoder, education library, guided Case Builder, public pages.
- The `/cases/...` routes are currently just an iframe window pointing at Case Binder Pro — not a real feature. This is the seam to replace.

Case Binder Pro today:
- Rich workspace screens: case list, case workspace, evidence/exhibits, timeline + timeline review, people, allegations, issues, communications, incidents, records requests, packet builder, export center, record search, content check.
- Most of that data lives only in the browser's local storage, not in a database. Only evidence has partial database storage, plus an unused "case intelligence" schema with cases, people, organizations, events, claims, communications, records requests and citations.
- Its classification vocabulary (Fact / Allegation / Disputed / Inference / Unknown, plus supported / contradicted / needs records) is the part most worth keeping.

## The merge, in plain terms

**Reused as-is (Decoded Justice):** brand, layout, colors, typography, disclaimers, trauma-aware wording, auth, analyzer/detection engine, Legal Decoder, education library, Case Builder intake, all public pages.

**Adapted (from Case Binder Pro):** the workspace screens and their logic — exhibit numbering, timeline classification, allegation status, communications log, records-request deadlines, export/packet assembly, record search. Rewritten against Decoded Justice's components and saved to the real database instead of the browser.

**Newly built:** one canonical case that everything hangs off, a case workspace shell with tabs, and the link layer joining evidence, issues, people, organizations, communications and timeline events.

**Retired:** only the iframe embed page. Its routes stay and start serving real screens.

## One canonical case

A single `cases` record per matter. Everything attaches to it:

```text
case
 ├─ issues / potential violations   (from the analyzer, plus manual)
 ├─ evidence & exhibits             (stable exhibit IDs, source metadata, status)
 ├─ timeline events                 (classification, source links)
 ├─ people & organizations
 ├─ communications / call log
 ├─ records requests & deadlines
 ├─ notes
 └─ packets & exports
```

No duplicate records: existing evidence, timeline entries and notes stay in their current tables and simply gain a case link. The Justice Place case a user already has becomes their first canonical case. Nothing is moved or rewritten in place without that being additive.

Classification is explicit everywhere it applies — Fact, Allegation, Inference, Disputed, Unknown — and evidence keeps its source, date received, and review status. Analyzer output arrives as Allegation or Unknown; it never silently becomes Fact.

## Navigation

One product, two modes, one sidebar:

- **Your case** — Overview, Timeline, Evidence & Exhibits, Issues & Violations, People & Organizations, Communications, Requests & Deadlines, Notes, Packets & Exports.
- **Understand & learn** — Analyzer, Legal Decoder, Education Library, Find Help, Support Network.

A case switcher sits at the top. Mobile keeps the existing collapsible drawer pattern and single-column screens.

## Build order

1. **Data foundation** — canonical case tables and link tables, additive case links on existing tables, backfill each user's Justice Place case into a canonical case. No drops, no data loss; any destructive step would be raised first.
2. **Workspace shell** — case list, case switcher, tabbed workspace, unified sidebar, replacing the iframe routes.
3. **Core tabs** — evidence & exhibits (stable IDs, status, source), timeline (classification, source links), issues/violations fed by the existing detection engine.
4. **Relationship tabs** — people & organizations, communications, requests & deadlines, plus the link editor that ties records together.
5. **Search & output** — record search across the case, content check, packet builder and export center reusing the existing packet generator.
6. **Polish** — mobile passes, empty states, disclaimers, cross-links from Analyzer and Case Builder into the workspace.

## Technical notes

- New tables: `cases` (or promotion of `justice_place_cases` to canonical), `case_people`, `case_organizations`, `case_issues`, `case_communications`, `records_requests`, `case_links`, `case_packets`. Each with per-user row-level security, grants for signed-in users and service role, and updated-at triggers.
- Existing `evidence`, `timeline_entries`, `notes` get a nullable `case_id` plus the new classification/source/exhibit columns, backfilled — additive only.
- Evidence files continue to use the existing private storage bucket with signed URLs.
- Case Binder Pro's local-storage hooks are not carried over; screens are rebuilt on React Query against the backend, so data survives devices.
- Case Binder Pro's Supabase project is not linked; nothing is read from it at runtime and no user data migrates between projects.
- Shared types live in one module so the analyzer, workspace and export center agree on classification values.

## Assumption to confirm

Case Binder Pro holds no live user data worth importing (its records live in individual browsers). I plan a code-and-schema merge only, with no cross-project data transfer. Say the word if real user data there must come across.

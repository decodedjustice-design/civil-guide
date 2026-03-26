# Decoded Justice — Production Architecture Blueprint

## Canonical Flow (unchanged)
1. Write what happened
2. Build timeline
3. Upload evidence
4. Review key issues
5. Generate case packet

## Folder Structure

```txt
src/
  components/decoded-justice/
    DashboardOverview.tsx
    ReadinessScoreCard.tsx
    CaseBuilderFlow.tsx
    PacketGeneratorPanel.tsx
  features/decoded-justice/
    types.ts
  pages/decoded-justice/
    DecodedJusticeDashboard.tsx
    DecodedJusticeBuilder.tsx
    DecodedJusticePacket.tsx
  server/
    api/
      decoded-justice.ts
    decoded-justice/
      repository.ts
      case-packet.service.ts
      pdf/
        template.ts
        generateCasePacketPdf.ts
supabase/
  migrations/
    20260326161000_decoded_justice_core.sql
```

## Data Layer
- `cases` anchors each legal packet.
- Child tables (`timeline_events`, `evidence`, `issues`, `notes`) are one-to-many by `case_id` with cascade delete.
- Composite indexes support the packet workflow:
  - timeline sorting by case/date
  - evidence sequencing by case/created_at
  - issue filtering by case/type

## Backend Services
- `getCaseData(caseId)` in `repository.ts` loads all related records in parallel.
- `generateCaseSummary(data)` writes neutral, factual prose.
- `buildTimeline(data)` performs chronological sort.
- `buildEvidenceIndex(data)` labels evidence as EV-01, EV-02...
- `generateCasePacket(data)` composes all sections into a single typed payload.
- `calculateReadiness(data)` returns `{ score, missing }` to drive UX guidance.

## PDF Engine (Puppeteer)
- HTML is generated in `pdf/template.ts`.
- `pdf/generateCasePacketPdf.ts` renders and exports A4 with print backgrounds.
- Theme tokens:
  - Cream background `#F7F1E8`
  - Maroon headers `#6A1E2E`
  - Gold accents `#C8A75D`

## API Route Layer
`src/server/api/decoded-justice.ts` provides core route handlers for:
- packet payload assembly
- PDF download
- ZIP metadata assembly (packet + evidence)
- secure share link generation

## Frontend UX
- Dashboard surfaces progress + readiness + explicit next step.
- Builder page keeps users focused on one step at a time.
- Packet page shows generation progress, export actions, and preview area.
- Language stays plain and supportive while avoiding legal conclusions.

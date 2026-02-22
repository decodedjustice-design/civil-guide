

## Dashboard Phase-Aware Progress Tracking

**What changes:** Enhance Dashboard with a 5-phase progress overview showing completion signals, plus a "Suggested Next Step" block.

**File affected:** `src/pages/Dashboard.tsx` (rewrite layout, same route)

---

### New Dashboard Structure

1. **Welcome header** (keep existing)
2. **Phase Progress Bar** — 5 horizontal phase indicators showing which phases have activity (based on DB counts: evidence, timeline, notes, analyzer results, intake packets, attorney contacts)
3. **Suggested Next Step** — contextual CTA based on what's empty (no notes → "Start with Clarion", no evidence → "Upload your first document", etc.)
4. **Quick Actions** — streamlined to 4 primary actions (keep existing)
5. **Case Stats** — keep existing counters
6. **Resource links** — keep existing 3-column guidance/legal prep/support
7. **Privacy note** — keep existing

### Data Queries

Expand the existing stats fetch to also count:
- `analyzer_results` (Phase 2 signal)
- `intake_packets` (Phase 4 signal)
- `attorney_contacts` (Phase 5 signal)
- `clarion_entries` (Phase 1 signal)

### Phase Completion Logic

Each phase shows a simple visual indicator:
- **Started** (has ≥1 item in any related table)
- **Not started** (no items yet)
- No numeric percentages — keeps it pressure-free per the command-center spec

---

### Technical Notes

- Single file change
- No new routes, no new components, no backend changes
- All tables already exist in the schema
- Maintains existing auth redirect pattern


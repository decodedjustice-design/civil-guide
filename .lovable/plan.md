

## Rebuild Self-Help Tools into "Your Path to Clarity"

**What changes:** Replace the current flat grid of tools on `/self-help` with a 5-phase guided system flow that shows how each tool connects to the next.

**File affected:** `src/pages/SelfHelpTools.tsx` (full rewrite of content/layout, same route)

---

### New Page Structure

The page title becomes **"Your Path to Clarity"** with a subtitle reinforcing the guided nature of the platform.

**Layout:** A vertical flow of 5 collapsible phase sections, each containing:
- Phase number and title
- 2-3 sentence reassurance/explanation
- Tool cards (linking to existing routes) with brief descriptions
- A subtle connector line between phases showing progression

---

### The 5 Phases

**Phase 1 -- Tell Your Story**
- Clarion (/clarion)
- Timeline Creator (/timeline)
- Notes (/notes)
- Transcription Tool (/transcription)

**Phase 2 -- Understand Your Case**
- Civil Rights Analyzer (/analyzer)
- Legal Decoder (/legal-decoder)
- Rights Insight (/rights-insight)
- Library (/library)

**Phase 3 -- Organize Your Proof**
- Evidence Vault (/evidence-vault)
- Public Request Rights (/public-request-rights)

**Phase 4 -- Prepare for Action**
- Legal Templates (/legal-templates)
- Intake Packet (/intake-packet)
- Courts and Filing Info (/courts-filing-info)

**Phase 5 -- Connect and Advocate**
- Find Legal Help (/find-help)
- Attorney Contacts (/attorney-contacts)
- Saved Attorneys (/saved-attorneys)
- Support Network (/support-network)

---

### Design Details

- Maintains the existing dark theme and warm styling
- Each phase card uses the existing card/border styling patterns
- Vertical connector lines (thin gold/accent) between phases
- Wellbeing note at the top: "You don't have to follow every phase. Start wherever feels right."
- Auth-aware: tools requiring login show the redirect pattern already in place
- "Coming Soon" items (Deadlines, Case Summary Dashboard, Export Tools) appear as muted preview items within their respective phases with a "Coming Soon" badge -- no dead-end links
- Educational Guides section at bottom is removed (already accessible via Library/Rights Insight)
- Sign-in CTA block remains for logged-out users

---

### Technical Notes

- Single file change: `src/pages/SelfHelpTools.tsx`
- No new components, no new routes, no backend changes
- All linked routes already exist and are functional
- Keeps the existing auth check pattern for protected tools
- Uses existing UI components (Card, Button, icons from lucide-react)


# Decoded Justice — Civil Guide

A trauma-aware, educational web platform that helps people understand their civil rights, organize case information, and find legal resources — without providing legal advice.

> **This tool is for educational purposes only. Nothing here constitutes legal advice.**

---

## What It Does

Users navigate an intake flow that identifies which system they're dealing with (police, employer, housing, courts, etc.) and what kind of issue they have. Based on their answers the app:

1. Builds a **case context** — system type, issue category, urgency flags, protected-class factors
2. Detects **patterns** from public records aligned to their situation
3. Surfaces **matched legal and community resources** ranked by relevance
4. Lets users organize their case with evidence, a timeline, notes, and a professional intake packet

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + TypeScript |
| Build | Vite 5 (SWC) |
| Routing | React Router DOM v6 |
| Styling | Tailwind CSS + shadcn/ui + Radix UI |
| Backend / DB | Supabase (Postgres + Edge Functions + Auth) |
| Server state | TanStack React Query |
| Forms | React Hook Form + Zod |
| Icons | Lucide React |
| Charts | Recharts |
| PDF processing | PDF.js |
| Notifications | Sonner |

---

## Project Structure

```
src/
├── main.tsx              # React root — mounts <App> into #root
├── App.tsx               # Global providers + all client-side routes
│
├── pages/                # One file per route (see Route Map below)
│
├── components/
│   ├── ui/               # shadcn/ui primitives (Button, Dialog, etc.)
│   ├── analyzer/         # Analyzer page sub-components
│   ├── case-builder/     # CaseBuilder step components
│   ├── clarion/          # Clarion intake flow components
│   ├── guides/           # Guide content rendering
│   ├── home/             # Landing page sections
│   ├── intake/           # Attorney intake form + packet display
│   ├── justice-place/    # Justice Place module components
│   ├── legal/            # Legal decoder components
│   ├── library/          # Education library components
│   ├── shared/           # Cross-feature reusable components
│   └── layout/           # Header, footer, nav
│
├── hooks/                # Custom React hooks (see Hook Guide below)
├── contexts/
│   └── AuthContext.tsx   # Auth state via Supabase, exposed via useAuth()
├── integrations/
│   └── supabase/         # Supabase client + generated types
├── data/
│   ├── legalResources.ts      # Static list of legal aid orgs
│   └── supportNetworkResources.ts  # Static list of community orgs
└── lib/                  # Shared utility functions
```

---

## Route Map

| Path | Page | Description |
|---|---|---|
| `/` | Index | Landing / home page |
| `/dashboard` | Dashboard | Authenticated user hub |
| `/analyzer` | Analyzer | Core intake + pattern detection flow |
| `/justice-place` | JusticePlace | Interactive case orientation tool |
| `/clarion` | Clarion | Guided intake questionnaire |
| `/tools` | Tools | Tool directory |
| `/legal-decoder` | LegalDecoder | Plain-language legal term explanations |
| `/self-help` | SelfHelpTools | Self-help resource directory |
| `/rights-insight` | RightsInsight | Civil rights educational content |
| `/find-help` | FindLegalHelp | Attorney / legal aid finder |
| `/support-network` | SupportNetwork | Community support organizations |
| `/notes` | Notes | User case notes (authenticated) |
| `/evidence-vault` | EvidenceVault | Upload & organize evidence (authenticated) |
| `/timeline` | Timeline | Chronological event builder (authenticated) |
| `/guide/:guideId` | FullGuide | Dynamic guide content by ID |
| `/library` | Library | Resource library |
| `/education-library` | EducationLibrary | Educational articles |
| `/transcription` | Transcription | Audio-to-text for case notes |
| `/public-request-rights` | PublicRequestRights | FOIA / public records guidance |
| `/courts-filing-info` | CourtsFilingInfo | Court filing how-tos |
| `/saved-attorneys` | SavedAttorneys | Saved attorney list (authenticated) |
| `/legal-templates` | StarterLegalTemplates | Downloadable document templates |
| `/intake-packet` | IntakePacket | Attorney intake form generator |
| `/attorney-contacts` | AttorneyContacts | Contact log for attorneys |
| `/case-builder` | CaseBuilder | Guided 5-step case organization wizard |
| `/auth` `/signin` `/signup` | Auth | Authentication page |
| `/about` and aliases | About | About, founders story, legal pages |

---

## Hook Guide

All custom hooks live in `src/hooks/`. Here's what each one does:

### Core case logic

| Hook | File | What it does |
|---|---|---|
| `useCaseContext` | `useCaseContext.ts` | Derives a structured `CaseContext` (system, issue types, urgency flags, stage) from raw questionnaire answers. Also returns relevant clarifying questions to ask next. |
| `useEntityTags` | `useEntityTags.ts` | Defines and applies system-specific detail questions (e.g. "Was force used?") that produce internal `EntityTags` used for pattern matching. Tags are never shown to users. |
| `usePatternAwareness` | `usePatternAwareness.ts` | Cross-references `EntityTags` + answers against a set of known patterns (use-of-force, delayed medical care, CPS removals, etc.) to surface contextual copy blocks with mandatory disclaimers. |
| `useResourceMatching` | `useResourceMatching.ts` | Scores and ranks legal + community resources against the current `CaseContext`. Returns grouped results by category (`legal_help`, `records_accountability`, etc.) with dismiss/undo support. |
| `useAnalyzerResultsAI` | `useAnalyzerResultsAI.ts` | Calls the `generate-analyzer-results` Supabase Edge Function to get AI-generated guidance (power dynamics, priority actions, affirmations) for the user's situation. |

### Case organization (authenticated features)

| Hook | File | What it does |
|---|---|---|
| `useCaseBuilder` | `useCaseBuilder.ts` | Manages the 5-step CaseBuilder wizard (Intake → Evidence → Timeline → Legal Issues → Packet). Fetches real progress from Supabase and controls step navigation/unlock logic. |
| `useIntakePacket` | `useIntakePacket.ts` | Saves, loads, and deletes attorney intake packets in Supabase. Also logs attorney contact records when a packet is generated for a specific attorney. |
| `useSavedAttorneys` | `useSavedAttorneys.ts` | CRUD for the user's saved attorney list. |
| `useAutoSaveAnalyzerResult` | `useAutoSaveAnalyzerResult.ts` | Auto-saves Analyzer results to `analyzer_results` table so users can return to their analysis. |
| `useJusticePlace` | `useJusticePlace.ts` | Manages case data for the Justice Place module. |

### Utilities

| Hook | File | What it does |
|---|---|---|
| `usePatternEngine` | `usePatternEngine.ts` | Lower-level pattern scoring engine used by `usePatternAwareness`. |
| `use-toast` | `use-toast.ts` | shadcn/ui toast state manager. |

---

## Key Data Flows

### Analyzer → Results

```
User selects system (police, employer, etc.)
  → Answers questionnaire
  → useCaseContext builds CaseContext
  → useEntityTags collects detail flags
  → usePatternAwareness detects pattern blocks
  → useResourceMatching ranks + groups resources
  → useAnalyzerResultsAI fetches AI guidance (Supabase Edge Function)
  → Results page renders all outputs with disclaimers
```

### CaseBuilder Wizard

```
User visits /case-builder
  → useCaseBuilder fetches progress from 5 Supabase tables
  → Renders current step (Intake / Evidence / Timeline / Issues / Packet)
  → Each step unlocks only after the previous is complete
  → Progress auto-refreshes after each save action
```

---

## Local Development

**Requirements:** Node.js 18+ and npm

```sh
# Install dependencies
npm install

# Start dev server (http://localhost:8080)
npm run dev

# Type check
npx tsc --noEmit

# Lint
npm run lint
```

**Environment variables** — copy `.env.example` to `.env` and fill in your Supabase project URL and anon key.

---

## Supabase Tables (key ones)

| Table | Purpose |
|---|---|
| `justice_place_cases` | Core case record per user |
| `evidence` | Uploaded evidence items |
| `timeline_entries` | Chronological case events |
| `analyzer_results` | Saved Analyzer outputs |
| `intake_packets` | Generated attorney intake packets |
| `attorney_contacts` | Log of attorney outreach |

Edge Functions live in `supabase/functions/` and handle AI generation tasks that require server-side processing.

---

## Important Notes

- **No legal advice** — all content is educational. Disclaimers are enforced in code (`usePatternAwareness` always appends required disclaimer blocks when patterns are shown).
- **Trauma-aware UX** — language throughout the app is supportive and non-judgmental. Questions use soft phrasing ("Do you remember if…").
- **Washington State focus** — legal resources and jurisdiction logic default to WA state, though federal resources are also included.
- **Protected class data is voluntary** — users can skip identity questions. This data only affects resource recommendations, never pattern scoring.

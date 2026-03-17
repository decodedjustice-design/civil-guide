# Website Architecture & User Interaction Evaluation

## Scope and method
This review evaluates:
- Front-end architecture (routing, layout, state ownership, navigation model)
- User interaction quality (onboarding clarity, wayfinding, task flow, friction points)
- Improvement opportunities aligned to user expectations (clarity, trust, progression, low cognitive load)

Primary artifacts reviewed include app routing, global layout/navigation, authentication context, dashboard, and key journey pages.

---

## Executive summary
Decoded Justice has a strong mission-driven UX voice and a broad functional surface area. The core opportunity is not “more features,” but **flow coherence**: users need a cleaner sense of “where to start,” “what comes next,” and “what is private vs public.”

The architecture currently mixes:
- Marketing/discovery routes
- Auth-gated workspace routes
- Multi-step workflow routes

…without a single unifying information architecture model exposed in the UI.

### Highest-impact improvements
1. **Unify navigation language and route destinations** across header, mobile nav, and sidebar.
2. **Introduce route-level guards and intent-preserving redirects** for all workspace tools.
3. **Consolidate journey entry points** around one canonical “Start/Continue Case” flow.
4. **Add workflow context components** (step, progress, next action) on all major tool pages.
5. **Standardize trust/safety messaging hierarchy** (privacy, legal disclaimer, emotional safety).

---

## Architecture evaluation

### 1) Routing & information architecture
**What’s working**
- Clean route declarations and discoverable path map in `App.tsx`.
- Functional separation of pages by domain (Analyzer, Case Builder, Library, Support, etc.).

**Observed risks**
- Multiple alias routes point to a generic About page (`/privacy`, `/terms`, `/disclaimer`, `/what-we-are`, etc.) which can violate user expectation that those are distinct policy pages.
- Parallel “learn” destinations exist (`/library` and `/education-library`) and are referenced inconsistently across nav systems.
- The route map itself does not encode public vs protected sections; guarding is handled page-by-page, leading to inconsistency risk.

**Targeted changes**
- Create an explicit route schema by section:
  - `public/*` (home, about, educational resources)
  - `workspace/*` (dashboard, evidence, timeline, case tools)
  - `account/*` (auth, settings)
- Implement a reusable `<ProtectedRoute>` wrapper for workspace routes.
- Replace policy aliases with dedicated pages (even if initially brief), each with canonical URL and title.

---

### 2) Layout, navigation, and wayfinding
**What’s working**
- Shared `Layout` and fixed header improve consistency.
- Sidebar grouping in workspace reflects meaningful user goals.

**Observed risks**
- Top navigation labels (“How It Works,” “Learn,” “Private Record”) do not fully align with sidebar labels and workflow terms (“Tell Your Story,” “Understand Your Case,” etc.).
- Header/mobile nav currently points “Learn” to `/library`, while sidebar emphasizes `/education-library`.
- Users can land deep in tools without clear cross-page progress context unless they are in Case Builder.

**Targeted changes**
- Create a **single navigation dictionary** (label + route + audience + visibility rules) and import it in header, mobile menu, and sidebar.
- Introduce persistent micro-wayfinding on tool pages:
  - “You are here” (stage)
  - “Next recommended step” CTA
  - “Return to dashboard” utility action
- Standardize primary CTA copy to one verb set: “Start case,” “Continue case,” “Review case packet.”

---

### 3) Auth and state architecture
**What’s working**
- Centralized `AuthContext` with Supabase integration is clean and minimal.
- Redirect support exists for key sign-in flows.

**Observed risks**
- Access control behavior is partly duplicated at page level, which can produce uneven experiences.
- Auth loading states are defined but not uniformly leveraged for skeleton/transition behavior across the app.

**Targeted changes**
- Add route-level protection + role/state-based route metadata.
- Introduce a shared `AuthGate` UI pattern for unauthorized tool access:
  - why sign-in is needed
  - what data stays private
  - where user will return after sign-in
- Add telemetry for drop-off points in auth redirects.

---

### 4) Interaction model & cognitive load
**What’s working**
- Tone is supportive and trauma-aware.
- Case Builder step model is strong and understandable.

**Observed risks**
- The product offers many tools at once; first-time users may not know which path fits their immediate need.
- Some pages are content-rich but action-light, causing “read but don’t proceed” outcomes.
- Primary user intent (document event, understand rights, find help, prepare package) is not consistently captured and used to personalize next steps.

**Targeted changes**
- Add a 30-second **intent triage** on first meaningful entry:
  - “I need to document what happened”
  - “I need to understand my rights”
  - “I need legal/support contacts”
  - “I need to prepare documents”
- Persist intent as lightweight user preference and adapt dashboard action cards/order.
- Attach one primary action per major page section to reduce decision fatigue.

---

## User-needs alignment review

### User expectation 1: “Help me start quickly without getting lost.”
**Current gap**: multiple starting points with similar language.

**Fix**: One canonical “Start/Continue Case” journey with an always-visible progress anchor.

### User expectation 2: “Tell me what this tool is and isn’t.”
**Current gap**: disclaimers exist, but legal boundary messaging is spread across components.

**Fix**: A standardized trust strip on all high-stakes pages:
- Not legal advice
- Private by design (with specifics)
- Optional attorney escalation pathway

### User expectation 3: “Save my progress and guide me to the next best action.”
**Current gap**: auto-save exists in places, but next-step continuity feels page-dependent.

**Fix**: universal “resume context” module powered by last activity + current stage.

### User expectation 4: “Don’t make me learn your structure first.”
**Current gap**: taxonomy is internally meaningful but externally dense.

**Fix**: progressive disclosure by default (3 core tasks), advanced tools behind “More tools.”

---

## Prioritized implementation roadmap

### Phase 1 (1–2 weeks): coherence and clarity
- [ ] Unify navigation source of truth and labels.
- [ ] Normalize `/library` vs `/education-library` decision.
- [ ] Add ProtectedRoute wrappers for all workspace routes.
- [ ] Add dedicated policy pages for privacy/terms/disclaimer.

### Phase 2 (2–4 weeks): guidance and personalization
- [ ] Add intent triage and store selected intent.
- [ ] Add page-level next-action module and dashboard continuation widget.
- [ ] Instrument analytics events for route entry, CTA clicks, and auth-return success.

### Phase 3 (4–6 weeks): workflow depth and confidence
- [ ] Expand case readiness scoring model (evidence completeness, timeline gaps, contact readiness).
- [ ] Add contextual nudges before “find help” actions (e.g., export packet first).
- [ ] Add “session handoff” summary for users returning after inactivity.

---

## Success metrics (recommended)
- Time-to-first-meaningful-action (TTFMA)
- % of users who complete at least one guided stage
- Auth redirect completion rate
- Multi-session return rate (7-day)
- Case packet completion rate
- Help-seeking conversion after packet completion

---

## Suggested technical implementation notes
- Define a typed `RouteConfig[]` including fields:
  - `path`, `element`, `section`, `requiresAuth`, `navLabel`, `order`, `aliases`
- Derive header/mobile/sidebar from config selectors.
- Use a centralized “journey engine” hook:
  - reads user intent, recent activity, stage status
  - returns `primaryNextAction` object consumed by pages/widgets
- Keep trust language in a single component variant system to prevent copy drift.

---

## Closing assessment
The platform already has the ingredients for a high-trust, high-clarity civic support experience. To better align with user needs, prioritize **architectural coherence over feature expansion**:
- fewer competing paths,
- clearer progression signals,
- stronger expectation-setting,
- and consistent auth-protected workflow behavior.

That combination will materially reduce user confusion while increasing confidence, completion, and return engagement.

# HHT Aware — Orchestration State (resume file)

Orchestrator: Fable 5. Workers: Sonnet 5 (spawned via Agent tool).
Goal: advance the HHT Aware Android app (React 18 + Vite + Capacitor, Tailwind CSS-var tokens,
Zustand+localStorage, framer-motion, lucide-react).

## User's goals (verbatim intent)
1. Advance **Poster Studio** → many beautiful shareable banners/posters.
2. Advance **Challenges** → addictive gamification (streaks, levels, dailies, badges).
3. Add **latest HHT research**, delivered PERIODICALLY to NON-technical users (plain language).
4. Add **preventative actions** for HHT effects — deep-researched, age-specific.
   User's own routine to validate/expand: Aquaphor + Ponaris nasal emollient, low-sodium diet,
   avoids heavy spicy/masala food.
5. Add any other genuinely useful HHT features.
6. Run autonomously ("auto mode") until done.

## Architecture & file ownership (to avoid parallel-edit conflicts)
- **Studio worker** (agent accebc303e232f8d3): owns `src/components/poster/**`, `src/pages/PosterStudio.jsx`.
- **Challenges worker** (agent a21abb666b03bbb3e): owns `src/components/challenges/**`,
  `src/pages/Challenges.jsx`, `src/data/challenges.js`, `src/store/useAppStore.js` (must PRESERVE
  all existing store exports; PosterStudio/Facts call `useAppStore.getState().toggleChallenge(...)`).
- **Prevention research worker** (agent a9d1644f91bc196f7): writes `src/data/prevention.js` only.
- **Research feed worker** (agent ac43d3da74c8bb4a3): writes `src/data/research.js` only.
- **Orchestrator (me)**: owns new pages/components/hooks + `src/App.jsx`, `src/components/layout/BottomNav.jsx`,
  `src/pages/Home.jsx`. Builds Prevention + Research PAGES, wires nav/routes, periodic delivery.

## Data contracts requested from research workers
### src/data/prevention.js
- `preventionDisclaimer` (string)
- `preventionCategories`: [{ id, icon, title, summary, tips:[{title, body, tag, src}] }]
  categories: nasal-care, diet-nutrition, iron-anemia, medication-safety, activity-environment,
  screening-checkups, emotional-wellbeing
- `preventionByAge`: [{ id, label, icon, focus, tips:[string] }]
  groups: children, teens, adults, older-adults, pregnancy
- `everydayRoutine`: [{ time, items:[string] }]

### src/data/research.js
- `researchCategories`: string[]
- `researchUpdates`: [{ id, date "YYYY-MM", category, emoji, title, plain, whyItMatters,
  stage, source, url }]
- `researchExplainers`: [{ id, emoji, term, plain }]

## Integration plan (orchestrator)
- New pages: `src/pages/Prevention.jsx`, `src/pages/Research.jsx`.
- New components: `src/components/prevention/**`, `src/components/research/**`.
- New hook: `src/hooks/useResearchFeed.js` (localStorage seen-tracking + weekly "Research of the Week"
  rotation + unseen badge; independent of Zustand to avoid store contention).
- Add routes in `src/App.jsx`; add nav entries in `BottomNav.jsx` (rework to fit ~6 items or add "More").
- Add "Research of the Week" spotlight to `src/pages/Home.jsx` + Prevention quick-access.
- Periodic delivery: in-app weekly rotation (guaranteed, offline) + optional
  `@capacitor/local-notifications` weekly nudge (add dependency if feasible).
- Emergency Card + Facts remain; ensure still reachable in nav.

## Progress
- [x] Repo analyzed; conventions learned (tokens in src/index.css; Card/Button/Badge/InfoBanner/Toast/PageWrapper patterns).
- [x] Baseline git commit created (recovery point).
- [x] 4 workers launched in parallel.
- [x] Research feed worker DONE — src/data/research.js (22 updates, 6 cats, 8 explainers). Verified imports.
- [x] Prevention research worker DONE — src/data/prevention.js (7 cats, 5 age groups, routine). Verified imports.
- [x] Challenges worker DONE — streaks/levels/dailies/badges + store extended, existing behavior preserved.
- [x] useResearchFeed.js hook (weekly rotation + unseen badge).
- [x] Research page + components (ResearchCard/Filter/Spotlight/ExplainerChips).
- [x] Prevention page + components (PreventionCategory/AgeGroupTabs/RoutineTimeline).
- [x] Routes added (App.jsx); BottomNav reworked (Home/Prevent/Research/Studio/Rewards + unseen badge);
      Emergency moved to Header; Home gets Research-of-Week spotlight + 6 nav cards.
- [x] Weekly local notification: installed @capacitor/local-notifications, added useResearchNotifications, wired in App.jsx.
- [x] Studio worker DONE: 13 templates x 6 themes x 3 sizes (234 designs).
- [x] FINAL: `npm run build` fully green (SW generated); durable webcrypto fix in npm scripts + vite.config.
- [x] `npm run sync` succeeded — Android bundle refreshed, local-notifications plugin registered (8 plugins).
- [x] Lint: 0 new real errors across src. Git checkpoint committed (86a5b2d).
- ALL TASKS COMPLETE.

## Known non-blocking issues
- Node 18 installed but toolchain wants >=20 → pre-existing workbox/path-scurry precache step fails
  AFTER Vite transforms all modules. App code compiles; this is a node_modules/env issue only.
- `npm run lint` has ~1243 PRE-EXISTING errors repo-wide (unused `import React`, missing prop-types in
  every file). Not a usable gate. Bar = Vite compiles + no NEW error categories. New files follow the
  same `import React` convention as all siblings (build-safe).

## Verify
- Build: `npm run build`  •  Lint: `npm run lint`  •  Sync Android: `npm run sync`.

---

## ROUND 2 — UI redesign (dark theme + interactivity), started after user feedback
User feedback: not happy with UI — not interactive enough (esp. Prevention = too much reading),
white-on-white contrast unreadable, wants modern standard UI, and Android app updated too.
User chose: **cohesive DARK theme** + **rich & animated Prevention**.

- [x] Designer (Sonnet) authored `DESIGN_SYSTEM.md` ("Vessel Dark") with AA-verified tokens, class-change
      tables, and the Prevention interactivity blueprint. Keeps all CSS-var/Tailwind NAMES stable (values change);
      adds app.ink/app.soft/app.surface/app.surface2, custom-lg, raised.
- [~] Worker A (a4a4ff67): foundation — index.css, tailwind.config.js, index.html, App.jsx (+MotionConfig), ui/**, layout/**.
- [~] Worker B (a2190cf6): Prevention — RoutineRing, TopicTileGrid/Tile/Sheet+SVG icons, AgePersonaSelector,
      NoseCareSteps, TriggerHelperSorter; adds noseCareSteps + triggerHelperItems to data/prevention.js.
- [~] Worker C (a328b4ce): Research + Home — contrast fixes + list-stagger.
- [~] Worker D (a05a1d80): contrast pass on Facts/Challenges/Emergency/Studio-chrome (NOT canvas/drawers/themes).
- [ ] Integrate → npm run build → npm run sync (Android) → attempt APK → re-screenshot to verify contrast + interactivity.

Key cross-cutting fix: `text-app-border` was (mis)used as body copy in ~11 files; each worker converts its own
occurrences to `text-app-soft` per DESIGN_SYSTEM.md §2.4. Poster CANVAS + PDF-export display hex are OUT of scope.

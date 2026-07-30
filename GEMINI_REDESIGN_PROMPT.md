# Gemini Coding Agent — HHT Aware Full UI/UX Redesign Brief

> Paste this entire file to the Gemini coding agent, or point it at this file in the repo.
> It is written as a complete working brief: role, ground-truth tech facts, design
> philosophy, per-screen direction, hard constraints, and acceptance criteria.

---

## 0. Your role

You are a **senior product designer + front-end engineer** redesigning **HHT Aware**, a
mobile-first awareness and self-management app for people living with **Hereditary
Hemorrhagic Telangiectasia (HHT)** — a genetic condition causing frequent nosebleeds,
iron loss, and vascular malformations. Users are patients, their families, and the public.
Many use this app **daily** to log symptoms, keep self-care habits, and carry an emergency
medical card.

Your mandate: **redesign every screen** so the app feels **alive, interactive, reactive,
and habit-forming** — not static. The current app works and looks decent, but it reads
like a series of stacked cards. Make it feel like a premium, living product that users
*want* to open every day.

**Do a bold reinvention.** You are free to introduce new layouts, a refreshed palette
direction (including an optional dark mode), richer data-visualization, gesture-driven
interactions, and new motion — as long as the result stays **cohesive, accessible, and
faithful to the existing feature set and data**. Do not just re-skin; rethink the
information architecture and interaction model of each screen.

---

## 1. Non-negotiable engagement goal (and the ethical line)

The owner wants the app to be **"addictive"** in the *healthy habit-formation* sense:
users should feel pulled back daily by genuine value and satisfying feedback — the same
loop that makes Duolingo streaks or Apple Fitness rings work. Optimize for all four of
these pillars **together**:

1. **Gamification & rewards** — make streaks, XP, levels, badges, and daily goals
   *visceral and visible*. Progress rings, count-up number animations, confetti on
   completion, badge-unlock celebrations, "level up" moments. The reward system already
   exists in the store (see §4) — surface it everywhere, not just on the Rewards screen.
2. **Habit loops & reminders** — the **daily check-in** and **self-care checklist** are the
   core habit. Put the "what do I do today" front-and-center. Add streak-protection
   tension ("🔥 12-day streak — don't break it"), "you're on a roll" moments, and clear
   next-action nudges. Design empty/first-run states that pull users into the loop.
3. **Delight & micro-interactions** — every tap should feel good: spring physics, haptics,
   satisfying state transitions, gesture-driven cards (swipe, drag, pull). Nothing should
   pop in abruptly or feel flat. Motion should communicate cause-and-effect.
4. **Personalization** — the home screen should feel **"for me" and alive**: adapt to
   time of day (morning/day/night greeting + tips), the user's name, their current streak
   state, what they've already done today, and their progress level. It should look
   different at 8am on a 20-day streak than on a fresh install.

**Ethical guardrail (mandatory):** This is a *health* app for a chronic condition. Engagement
must serve the user's wellbeing, never exploit anxiety. **Do NOT** use manipulative dark
patterns: no fake urgency about their health, no guilt-tripping about symptoms, no
loss-framing that induces fear, no infinite-scroll traps that waste time, no dark-pattern
nags to disable. Streak pressure is fine and motivating; health fear-mongering is not.
Celebrations should feel earned and warm. When in doubt, choose *encouraging* over *anxious*.

---

## 2. Ground-truth tech stack (do not deviate)

- **React 18** + **Vite** + **Capacitor** (Android native wrapper) + **PWA** (installable,
  offline-capable via Workbox service worker).
- **Plain JavaScript with JSX only. NO TypeScript.** Files are `.jsx` / `.js`.
- **Tailwind CSS** (with a Konsta UI v4 base config) + CSS custom properties in
  `src/index.css`. **framer-motion** for animation. **lucide-react** for icons.
  **zustand** (+ localStorage) for state. **react-router-dom** with **HashRouter**.
- **Do NOT add new npm dependencies** unless a capability is truly impossible without one;
  if you must, justify it explicitly and prefer tiny, well-maintained libs. framer-motion,
  lucide-react, and Tailwind already cover ~all interaction/animation/icon needs.
- **ESLint is enforced in CI with `--max-warnings 0`.** `react/prop-types` is OFF; unused
  vars/imports are ERRORS. Your code must pass `npm run lint` and `npm run build` clean.
- Every screen must render inside the existing shell: sticky `Header` (top), the routed
  page wrapped by `PageWrapper` (porcelain canvas, `max-w-md` centered column,
  `px-4 pt-4 pb-28`), and a fixed `BottomNav`. Respect mobile safe-areas
  (`.safe-padding-top/-bottom` helpers exist).
- **Reduced motion:** the app wraps everything in `<MotionConfig reducedMotion="user">`
  and `src/index.css` disables `.pop/.rise/.flip` under `prefers-reduced-motion`. All new
  motion MUST degrade gracefully — never make motion load-bearing for comprehension.

### Offline-first / never-crash (critical)
The app must work fully **offline** and when Firebase is unconfigured. Data lives in
localStorage via the zustand store. There is an **opt-in** anonymous Firebase cloud backup
and a remote research feed, but both are guarded and fall back silently. **Do not** make
any screen depend on network availability to render. No blocking spinners on first paint.

---

## 3. Design system — the real tokens (source of truth: `src/index.css` + `tailwind.config.js`)

> ⚠️ Ignore `DESIGN_SYSTEM.md` at the repo root — it documents an **old dark theme** and is
> stale. The shipped theme is the warm-light **"BleedAware"** system below. Token *names*
> are stable; use these values.

**Palette — "Warm Editorial / BleedAware" (light, porcelain + garnet-wine + teal):**

| Token (CSS var / Tailwind) | Value | Role |
|---|---|---|
| `--garnet` / `garnet` | `#8E2D3B` | PRIMARY accent, solid CTA fill |
| `--deep` / `deep` | `#571826` | deepest wine; hero gradients, high-contrast fills |
| `--rose` / `rose` | `#F3DDD9` | soft tint; callout panels, flip-card fronts |
| `--gold` / `gold` | `#D9A13B` | highlight / earned-badge accent |
| `--teal` / `brand-teal` | `#15756C` | "safe / info / done" accent |
| `--teal-soft` / `teal-soft` | `#E2F0EE` | teal wash backgrounds |
| `--bg` / `app-bg` | `#F6EFEB` | warm porcelain app background |
| `--surface` / `app-surface` | `#FFFFFF` | card surface |
| `--surface-2` / `app-surface2` | `#FFF7F3` | 2nd elevation: inputs, sheets, nested |
| `--muted` / `app-muted` | `#7A5F63` | labels / meta (warm taupe) |
| `--border` / `--line` / `line` | `#E9DAD4` | hairline dividers |
| `--ink` / `app-ink` | `#2A181D` | primary text (warm near-black) |
| `--ink-soft` / `app-soft` | `#7A5F63` | secondary body copy |

**Typography:** display/headings = **Bricolage Grotesque** (`font-serif` / `.disp`);
body = **Instrument Sans** (`font-sans`). Headings are heavy (700–800). Kicker labels are
11px uppercase, letter-spacing ~1.5, garnet.

**Radius:** `rounded-custom` 16px · `-sm` 12 · `-lg` 20 (hero/spotlight/sheets) · `-xl` 24 ·
`-pill` 999.

**Shadows:** `shadow-card` (subtle rest), `shadow-raised` (elevated/hero), `shadow-poster`
(deep), `shadow-glow` (garnet focus glow).

**Gradients (Tailwind `bg-*`):** `bg-ember` (garnet hero `#571826→#8E2D3B`), `bg-teal-flow`,
`bg-gold-flow`, `bg-aurora` (soft multi-radial wash), `bg-glass-sheen`.

**Glass:** `.surface-glass` (frosted white, blur 14px); `backdrop-blur-glass` = 16px.

**Existing keyframes/anim:** `.pop` (scale-in), `.rise` (translateY-in), `.flip3d`
(3D flip), Tailwind `animate-shimmer`, `animate-pulse-glow`.

**Signature brand mark:** `<Vessels>` — a decorative SVG capillary/telangiectasia line
motif (takes `color` + `opacity`). Use it as the recurring visual signature (hero
backgrounds, empty states, celebration moments). It's the app's "blood vessel" identity.

**If you introduce a dark mode:** wire it to Tailwind's `darkMode: 'class'` (already set)
by toggling a `dark` class on the root and overriding the CSS vars in `src/index.css` under
`:root.dark` / a `[data-theme="dark"]` selector. Keep garnet/teal/gold identity; shift
porcelain surfaces to warm-dark (e.g. `#1A1215` bg, `#241A1E` surface) and verify AA
contrast. Provide a toggle in the About modal or Header. Dark mode is **optional but
encouraged** — only ship it if you can do it fully and accessibly.

---

## 4. Existing state / engagement hooks (from `src/store/useAppStore.js`)

These already exist — **wire the redesign to them; do not rebuild them.** The store API
(selectors + actions) must keep working. These are your raw materials for gamification:

- **Streaks:** `currentStreak`, `longestStreak`, `lastActiveDate`; `recordActivity()` fires
  on any engagement.
- **XP & Levels:** derived `getXP()` and `getLevelInfo()` → `{ level, title, progress% }`
  with titles from `LEVEL_TITLES`.
- **Static challenges:** `completedChallenges[]` (IDs 1–10; #10 gates on 1–9). Points via
  `challengePointMap`.
- **Daily challenges:** `dailyProgress {date, completedIds[]}` — a deterministic rotating
  per-day set.
- **Daily stats:** `dailyStats` = `lifetimeCompletions`, per-task `taskCounts`,
  `perfectDaysCount`, `totalXPEarned`.
- **Badges/achievements:** `getBadges()` with unlock rules (first-poster, fact-sharer,
  ambassador, streak-7, streak-30, prevention-pro, researcher, perfect-week, habit-builder,
  legend); `seenBadgeIds` tracks which celebrations have shown.
- **Home body check-in:** `bodyCheckIn {date, bleeds[]}` — "How's your body today?" (feeds
  the streak). This is the primary daily habit hook.
- **Self-care tracker:** `selfCareToday {date, done[]}` + 90-day `selfCareHistory[]`;
  `getSelfCareStreak()`, `getAdherence()`.
- **Trigger log:** `triggerLog[]` + `getTriggerCounts()`.
- **Research:** `researchReactions`, `savedForAppt[]` (bring-to-doctor list), `unseenCount`.
- **Saved posters:** `savedPosters[]` (re-editable "My Creations").
- **Cloud backup (opt-in):** `cloudSyncEnabled/Status`; syncs gamification slices only —
  **NEVER the emergency card or posters.**

**Insight:** the app is data-rich but under-visualizes it. Streak history, adherence over
90 days, trigger frequencies, XP growth, perfect-days — these are begging to become
**charts, rings, heatmaps, and animated counters.** Turn stored numbers into visible
momentum.

---

## 5. Existing component library (reuse & elevate, don't discard)

- **UI primitives (`src/components/ui/`):** `Button` (variants primary/secondary/outline/
  danger/teal), `Card` (variants + `interactive`), `Chip` (garnet/teal toggle), `Badge`,
  `SectionTitle` (kicker + heavy title), `FlipCard` (3D flip), `Vessels` (brand SVG),
  `Toast` (bottom pill), `Modal` (bottom-sheet or dialog), `InfoBanner`, `ProgressBar`.
- **Motion presets (`src/lib/motion.jsx`):** `spring.{soft,snappy,bouncy,gentle}`,
  `pageTransition`, `staggerContainer`/`staggerItem`, `tapProps`, `<TapScale>`, `popIn`.
  **Use these consistently** so the whole app shares one physics language.
- **Haptics (`src/hooks/useHaptics.js`):** `haptics.{tap,impact,heavy,success,warning,
  error,selection}` — Capacitor native, no-ops on web. **Fire haptics on every meaningful
  interaction** (check-in, completion, level-up, chip select, swipe commit). This is a huge
  part of "feels reactive" on the phone.

You may refactor/extend these primitives and add new ones (e.g. `ProgressRing`,
`StatTile`, `Sparkline`, `Heatmap`, `Counter`, `Confetti` is already in challenges), but
keep the same design language and prop conventions.

---

## 6. Navigation (keep the 5-tab model, elevate it)

Bottom nav tabs (`BottomNav.jsx`): **Home** `/` · **Prevent** `/prevention` ·
**Research** `/research` (shows `unseenCount` badge) · **Studio** `/poster` ·
**Rewards** `/challenges`. Emergency card `/emergency` and Facts `/facts` are reached via
the Header (shield + brand). The active tab animates a garnet dot via `layoutId`.

You may redesign the nav's look (e.g. floating pill bar, animated icon morphs, a center
FAB for the primary daily action) but **keep all destinations reachable** and keep the
`unseenCount` badge and active-state animation. Consider elevating the daily check-in to a
prominent, always-one-tap-away position.

---

## 7. Per-screen redesign direction

For **each** screen: rethink hierarchy, add reactive/personalized states, add motion and
haptics, and visualize the stored data. Preserve all existing functionality and store
wiring.

### 7.1 Home (`/`) — the daily hub, most important screen
Currently: hero + daily check-in + 4 quick-action tiles + fact spotlight + resources +
footer. **Make this the "alive" screen.**
- **Time-of-day + streak-aware hero:** greeting adapts (morning/afternoon/evening + name);
  show the current streak as a *living* element (animated flame/ring), and a single clear
  "today's primary action" (check-in if not done, else next best habit).
- **Daily ritual front-and-center:** the body check-in should be the hero interaction —
  fast, tactile, rewarding. On completion: haptic success + satisfying animation + streak
  increment count-up + a warm, non-anxious affirmation.
- **Momentum strip:** compact animated stats — streak, level/XP progress, self-care
  adherence ring, perfect-days. Numbers count up on mount.
- **Personalized "for you today":** a tip/fact/challenge chosen by context (time, streak,
  what's undone). Reactive, not a static list.
- Keep quick actions, fact spotlight (with share), and resource directory, but make them
  feel integrated, not stacked.

### 7.2 Prevention (`/prevention`) — the habit engine
Currently: self-care checklist + daily rhythm card + collapsible topic library + pro-tip +
disclaimer. (Note: richer components `RoutineRing`, `TopicTileGrid`, `AgePersonaSelector`,
`NoseCareSteps`, `TriggerHelperSorter` **exist but are unwired** — consider using them.)
- Make the **self-care checklist** the star: a satisfying, tappable daily routine with
  progress ring, completion animations, and a visible adherence streak.
- **Visualize the 90-day `selfCareHistory`** as a heatmap/calendar or trend — show the user
  their consistency. This is powerful motivation.
- Time-of-day tuned tips (morning/day/night). Trigger logger should feel quick and give
  back insight (`getTriggerCounts()` → a small chart of "your top triggers").
- Keep the topic library accessible but secondary (progressive disclosure).

### 7.3 Rewards / Challenges (`/challenges`) — the trophy room
Currently: level bar + streak widget + daily challenges + progress tracker + challenge
cards + badge grid; celebration overlays exist.
- Make this feel like a **rewarding game hub**: prominent level/XP with animated progress,
  a badge showcase that celebrates earned badges (shine/pulse) and teases locked ones,
  daily challenges with clear rewards, and completion celebrations (confetti already
  exists — `Confetti.jsx`, `LevelUpCelebration.jsx`, `BadgeUnlockModal.jsx`).
- Add **progress visualization**: XP-over-time, perfect-days calendar, next-badge progress
  bars ("2 of 7 days to Streak Master"). Make "almost there" states motivating.

### 7.4 Research (`/research`) — the discovery feed
Currently: myth/fact quiz + weekly swipe stack + spotlight + category filter + card feed +
glossary + save-for-appointment sheet.
- Keep it **plain-language and calm** (this is science, not social media). But make it
  interactive: the swipe stack ("This Week in Science") should be a satisfying,
  gesture-driven Tinder-style card deck; reactions should feel responsive; the
  save-for-appointment flow should feel purposeful (building a list to bring to the doctor).
- Respect the remote-feed merge (bundled + Firestore) and offline caching — never block on
  network. New items animate in without jank.

### 7.5 Poster Studio (`/poster`) — the creative tool
Currently: live canvas preview + type/format/theme selectors + control panels + caption +
saved shelf.
- This is a creation tool — prioritize a **fluid, immediate live-preview** with tactile
  selectors (theme swatches, format toggles) that update the canvas with smooth
  transitions. Make "save to My Creations" and "share/download" feel rewarding
  (download completes a challenge — celebrate it).
- Keep the canvas-drawing pipeline intact (it uses helper modules + html2canvas/jsPDF).

### 7.6 Emergency Card (`/emergency`) — the serious utility
Currently: form mode ↔ passport mode; save/share/PDF export/edit/clear.
- This screen is **calm, trustworthy, and fast** — it's used in a medical emergency.
  Prioritize **clarity and legibility over playfulness**; motion should be minimal and
  purposeful here. Make the "passport" view feel like a premium, scannable medical ID.
- **Privacy:** this data is sensitive health information — it stays on-device and is
  **never** synced to cloud. Reflect that trust in the UI (a subtle "stored only on this
  device" reassurance).

### 7.7 Facts (`/facts`) — shareable knowledge
Currently: category chip filter + grid of tap-to-share stat cards.
- Make fact cards **beautiful and eminently shareable** (they're an awareness tool). Strong
  typographic stat cards, smooth category filtering, satisfying share interaction (sharing
  completes a challenge — celebrate + haptic). Consider subtle depth/parallax on the cards.

---

## 8. Interaction & motion principles (apply everywhere)

- **Everything responds to touch:** `whileTap` scale + haptic on every interactive element.
  Use `spring.snappy` for taps, `spring.soft` for layout, `spring.bouncy` for celebrations.
- **Nothing appears abruptly:** lists stagger in (`staggerContainer`/`staggerItem`); cards
  rise/fade; numbers count up; progress bars/rings animate to value.
- **State changes are animated,** not swapped: check-in → done, locked → unlocked,
  empty → filled. Use `AnimatePresence` for enter/exit.
- **Gestures where natural:** swipe the research deck, drag bottom sheets, pull to refresh
  the feed, swipe to complete a habit. Always provide a tap fallback.
- **Celebrations are earned and warm:** confetti/glow/scale on streak milestones, level-ups,
  badge unlocks, perfect days — but tasteful, brief, and skippable.
- **Reactive/personalized copy:** greetings, affirmations, and nudges reflect real state
  (streak length, time, what's done). Never generic when you can be specific.
- **Consistency:** one motion language, one type scale, one spacing rhythm across all
  screens. It should feel designed by one hand.

---

## 9. Hard constraints (violating any of these fails the task)

1. **Preserve all functionality and the zustand store API.** Every existing feature must
   still work: check-ins, streaks, XP/levels, badges, daily & static challenges, self-care
   tracker, trigger log, research reactions/save-for-appointment, poster creation/save,
   emergency card CRUD + PDF export, sharing, PWA install.
2. **Do not touch:** `android/` (native config/signing), `.github/workflows/`,
   `vite.config.cjs`, Capacitor config, the Firebase modules
   (`src/lib/firebase*.js`, `src/services/`), or `firestore.rules`. Redesign is
   **UI/UX + components + pages + styles only.**
3. **Offline-first, never-crash:** no screen may depend on network to render. Keep all
   Firebase/remote calls guarded and non-blocking (they already are).
4. **Emergency card data is private on-device health data** — never sync, upload, or log it.
5. **No TypeScript.** JSX/JS only. **No new npm deps** without explicit justification.
6. **`npm run lint` and `npm run build` must pass clean** (ESLint `--max-warnings 0`; unused
   imports/vars are errors). Remove dead code you replace.
7. **Accessibility:** maintain AA color contrast (verify any new palette/dark mode), ≥44px
   touch targets, `aria-live` for toasts/status, keyboard/focus states, and full
   `prefers-reduced-motion` support (motion must never be required to understand state).
8. **Mobile-first, `max-w-md` centered column**, safe-area aware. The primary target is the
   Android/Capacitor app and installed PWA on phones.
9. **No dark patterns / no health fear-mongering** (see §1 ethical guardrail).

---

## 10. How to work & what to deliver

- **Work screen by screen.** Suggested order: **Home first** (it sets the language), then
  Prevention, Challenges, Research, Facts, Poster Studio, Emergency Card.
- **Establish shared foundations first:** if you refresh tokens, add a dark mode, or add new
  primitives (e.g. `ProgressRing`, `StatTile`, `Counter`, `Sparkline`, `Heatmap`), build
  those before the screens so everything composes.
- **Keep components small and composed** (match the existing `src/components/<area>/`
  structure). Match existing code style, naming, and comment density.
- **After each screen:** run `npm run lint` and `npm run build`, fix everything, and verify
  the screen still works with the real store data (including empty/first-run state).
- **Explain your design decisions** briefly per screen: what you changed, why it drives
  engagement, and which store data it now visualizes.

### Acceptance criteria (self-check before you're done)
- [ ] Every screen feels reactive: taps, transitions, and state changes are animated + haptic.
- [ ] Home is personalized and time/streak-aware; the daily habit is the clear focal point.
- [ ] Stored data (streaks, adherence, XP, triggers, perfect-days) is *visualized*, not
      just listed.
- [ ] Gamification (streaks, XP, levels, badges, daily goals) is visible and celebrated
      across the app, not siloed on one screen.
- [ ] Cohesive: one motion language, one type scale, one spacing system, consistent tokens.
- [ ] Fully accessible (AA contrast, 44px targets, reduced-motion, focus states).
- [ ] All original features work; nothing in the forbidden list (§9.2) was modified.
- [ ] `npm run lint` and `npm run build` pass clean.
- [ ] No dark patterns; tone is encouraging, warm, and health-respectful.

---

**Start by reading `src/index.css`, `tailwind.config.js`, `src/lib/motion.jsx`,
`src/store/useAppStore.js`, and `src/pages/Home.jsx` to internalize the real system, then
propose your Home redesign and build it.**

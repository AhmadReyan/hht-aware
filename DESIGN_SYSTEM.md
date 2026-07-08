# HHT Aware — Design System v2 ("Vessel Dark")

Status: **Direction locked by client.** This document turns the locked dark direction into an implementation-ready spec. Three worker streams (A: Foundation, B: Prevention, C: Research+Home) can build from this in parallel — see §9 for the file map and token-stability guarantee.

---

## 1. Direction & Rationale

HHT Aware moves to a single, cohesive **dark theme** — a near-black, warm-red-biased canvas (`#141013`) with two levels of warm-charcoal elevation (`#1F1A1C`, `#251F21`), HHT-red as the emotional anchor, and teal/orange as calm, trustworthy counterpoints. Dark is the right call for a health app used at night, at the bedside, mid-nosebleed, or one-handed: it lowers glare, respects the seriousness of the content, and reads as *confident and calm* rather than clinical-white. It also directly fixes the reported bug — the app was already 80% dark-card-styled (`app-dark2`, `text-white` everywhere) but sat on a **light** root canvas (`--bg:#F2F2F7`), so page titles and spotlight text rendered white-on-near-white outside of cards. Making the canvas itself dark closes that gap once and for all, and every remaining pairing below is calculated to WCAG AA. The palette stays rooted in HHT's own visual world: vessel-red for urgency/brand, teal for "safe/verified," warm orange for gentle caution — never a generic AI-blue.

---

## 2. Color Tokens

### 2.1 CSS variables — keep every name, new dark values

```css
:root {
  /* Brand — red family */
  --red:          #C0392B;   /* Deep red — solid CTA fills, pressed states (AA-safe w/ white text) */
  --red-mid:      #E74C3C;   /* Primary accent — icons, links, borders, badges, small headings */
  --red-light:    #F2A79B;   /* NEW ROLE: light coral TEXT/heading accent on dark surfaces (was a pastel bg tint) */
  --red-dark:     #922B21;   /* Deepest red — active/pressed fill, highest-contrast text pairing */

  /* Accent — orange */
  --orange:       #E8843C;   /* Secondary accent / warning — reads clearly as text or icon on dark */
  --orange-light: #F3C08A;   /* NEW ROLE: light gold TEXT accent on dark surfaces (was a pastel bg tint) */

  /* Safe / Info — teal */
  --teal:         #2AA88B;   /* Success, safe info, verified */
  --teal-light:   #7FD9BC;   /* NEW ROLE: light mint TEXT accent on dark surfaces (was a pastel bg tint) */

  /* Neutrals — surfaces & structure */
  --dark:         #141013;   /* Recessed / chrome tone — header, bottom nav, hero panels. Equals --bg: seamless chrome. */
  --dark2:        #1F1A1C;   /* First elevation — standard card surface. Alias of new --surface. */
  --mid:          #4A4245;   /* NEW ROLE: neutral mid-tone for hover/press overlays & tertiary fills only — never body text */
  --muted:        #8A8085;   /* Labels, meta text, icons, eyebrows */
  --border:       #332C2F;   /* Hairline dividers ONLY — never used as a text color (see §2.4 bug fix) */
  --bg:           #141013;   /* App background — near-black, faint warm/red bias */
  --white:        #FFFFFF;   /* Reserved for on-color fills (e.g. white icon on a solid red bar) and the Poster canvas */

  /* NEW — text & elevation tokens */
  --ink:          #F4EEF0;   /* Primary text, headings — the fix for text-white on page titles */
  --ink-soft:     #B7ADB0;   /* Secondary/body copy on any dark surface — replaces the text-app-border hack */
  --surface:      #1F1A1C;   /* Explicit name for --dark2 (first elevation) */
  --surface-2:    #251F21;   /* Second elevation — nested tips, inputs, pressed rows, sheets-on-sheets */

  /* Typography (unchanged) */
  --serif:        'DM Serif Display', Georgia, serif;
  --sans:         'DM Sans', system-ui, sans-serif;

  /* Component tokens */
  --radius:       16px;
  --radius-sm:    10px;
  --radius-lg:    22px;       /* NEW — hero/spotlight cards, bottom sheets */
  --radius-pill:  99px;

  /* Elevation — dark themes need real shadow + hairline, not a faint light-mode shadow */
  --shadow-card:    0 1px 2px rgba(0,0,0,0.45), 0 8px 24px rgba(0,0,0,0.30);
  --shadow-raised:  0 2px 4px rgba(0,0,0,0.5), 0 12px 32px rgba(0,0,0,0.35);   /* NEW — hero, sheets, modals */
  --shadow-poster:  0 4px 24px rgba(0,0,0,0.15);  /* unchanged — poster canvas only */
}

body {
  background-color: var(--bg);
  color: var(--ink);          /* was var(--mid); mid is no longer a text color, see §2.4 */
  font-family: var(--sans);
}
```

`index.html`'s `<body class="bg-app-bg text-app-mid antialiased">` must change to `bg-app-bg text-app-ink` in the same pass (it renders before React hydrates, so it must not regress).

### 2.2 Tailwind config additions (`tailwind.config.js`)

All existing keys keep their names and just inherit the new hex via the CSS vars above — **zero renames needed** in `brand.*` or the pre-existing `app.{dark,dark2,mid,muted,border,bg}`. Add four new keys:

```js
colors: {
  brand: { /* unchanged keys, values now flow from the vars above */
    red: 'var(--red)', 'red-mid': 'var(--red-mid)', 'red-light': 'var(--red-light)', 'red-dark': 'var(--red-dark)',
    orange: 'var(--orange)', 'orange-light': 'var(--orange-light)',
    teal: 'var(--teal)', 'teal-light': 'var(--teal-light)',
  },
  app: {
    dark: 'var(--dark)', dark2: 'var(--dark2)', mid: 'var(--mid)', muted: 'var(--muted)',
    border: 'var(--border)', bg: 'var(--bg)',
    ink: 'var(--ink)',            // NEW — text-app-ink
    soft: 'var(--ink-soft)',      // NEW — text-app-soft
    surface: 'var(--surface)',    // NEW — bg-app-surface
    surface2: 'var(--surface-2)', // NEW — bg-app-surface2
  }
},
borderRadius: {
  custom: 'var(--radius)', 'custom-sm': 'var(--radius-sm)', 'custom-lg': 'var(--radius-lg)', 'custom-pill': 'var(--radius-pill)',
},
boxShadow: {
  card: 'var(--shadow-card)', raised: 'var(--shadow-raised)', poster: 'var(--shadow-poster)',
}
```

### 2.3 Verified contrast ratios (WCAG formula, computed — not estimated)

| Pair | Ratio | Passes |
|---|---|---|
| `--ink` #F4EEF0 on `--bg` #141013 | **16.47:1** | AA/AAA body ✅ |
| `--ink-soft` #B7ADB0 on `--bg` | **8.64:1** | AA/AAA body ✅ |
| `--muted` #8A8085 on `--bg` | **4.95:1** | AA body (barely) ✅ |
| `--ink` on `--surface` #1F1A1C | **14.99:1** | ✅ |
| `--ink-soft` on `--surface` | **7.87:1** | ✅ |
| `--muted` on `--surface` | **4.50:1** | AA body, exact line ✅ |
| `--ink` on `--surface-2` #251F21 | **14.14:1** | ✅ |
| `--ink-soft` on `--surface-2` | **7.42:1** | ✅ |
| `--muted` on `--surface-2` | **4.25:1** | ⚠️ fails 4.5 body — OK for labels/icons (≥3:1), **not** for paragraph copy |
| `--red-mid` #E74C3C on `--bg` (icon/large) | **4.94:1** | AA large/UI ✅, borderline for small body |
| `--red-mid` on `--surface-2` (icon/large) | **4.24:1** | large/UI only (3:1) ✅, not body text |
| `--red-light` #F2A79B on `--bg` | **9.68:1** | ✅ safe for any text size |
| `--red-light` on `--surface` / `--surface-2` | **8.81 / 8.31:1** | ✅ |
| `--teal` #2AA88B on `--bg` | **6.35:1** | ✅ |
| `--orange` #E8843C on `--bg` | **7.00:1** | ✅ |
| White on `--red` #C0392B (button fill) | **5.44:1** | AA ✅ |
| White on `--red-dark` #922B21 (pressed) | **8.11:1** | ✅ |
| White on `--red-mid` #E74C3C | **3.82:1** | ❌ fails — never use as a solid button/toast fill with white text |
| `--ink`(#141013) on `--teal` (button fill) | **6.35:1** | ✅ — teal buttons use dark text, not white |
| `--ink` on `--orange` (button fill) | **7.00:1** | ✅ — orange buttons use dark text, not white |
| White on `--teal` / `--orange` | 2.97 / 2.69:1 | ❌ — this is why teal/orange buttons flip to dark text |
| `--border` #332C2F on `--bg` (structural, non-text) | 1.39:1 | expected — hairlines are not text |

**Rule of thumb baked into every component below:** deep red (`--red`) is the only red allowed as a *solid fill behind white text*; mid red (`--red-mid`) is the accent you see most (icons, links, borders, small headings) but only as foreground-on-dark, never as a filled button/toast background; teal and orange buttons always pair with dark ink text, never white.

### 2.4 The contrast bugs, and the exact class changes

**Bug 1 — root canvas fix.** `--bg` was `#F2F2F7` (light) while headers/spotlights used `text-white`. Fixed at the token level (now `--bg:#141013`), but the following classes render page titles **directly on the page canvas** (not inside a dark card) and must be swapped from the raw utility to the token for correctness and future-proofing:

| File : line | Current | New |
|---|---|---|
| `index.html` body tag | `text-app-mid` | `text-app-ink` |
| `src/App.jsx:26` | `bg-app-bg text-app-mid` | `bg-app-bg text-app-ink` |
| `src/pages/Prevention.jsx:21` | `text-white` (h1) | `text-app-ink` |
| `src/pages/Research.jsx:25` | `text-white` (h1) | `text-app-ink` |
| `src/pages/Facts.jsx:48` | `text-white` (h1) | `text-app-ink` |
| `src/pages/Challenges.jsx:119` | `text-white` (h1) | `text-app-ink` |
| `src/pages/PosterStudio.jsx:143` | `text-white` (h1) | `text-app-ink` |
| `src/pages/Home.jsx:115` | `text-white` (hero h1, sits inside `bg-app-dark` card so wasn't broken, but swap for token consistency) | `text-app-ink` |
| `src/pages/Research.jsx:45`, `src/pages/Facts.jsx:55` | `sticky ... bg-app-bg` filter-bar wrapper | unchanged class name, now correctly dark since `--bg` is dark — no edit needed beyond the token itself |

**Bug 2 — `text-app-border` reused as body copy.** Nine files use `text-app-border` to render **paragraph text** on dark cards, relying on the *old* `--border` value (`#E5E5EA`, near-white). Once `--border` becomes the correct semantic hairline color (`#332C2F`, dark), every one of these becomes near-invisible dark-text-on-dark. This is the second real contrast bug and must be fixed everywhere `text-app-border` is used for copy (not for actual borders):

| File | Line(s) | Fix |
|---|---|---|
| `src/components/layout/AboutModal.jsx` | 9 | `text-app-border` → `text-app-soft` |
| `src/components/prevention/PreventionCategory.jsx` | 59 | → `text-app-soft` |
| `src/components/prevention/AgeGroupTabs.jsx` | 57, 65 | → `text-app-soft` |
| `src/components/prevention/RoutineTimeline.jsx` | 39 | → `text-app-soft` |
| `src/components/research/ResearchSpotlight.jsx` | 36 | → `text-app-soft` |
| `src/components/research/ResearchCard.jsx` | 56, 72 | → `text-app-soft` |
| `src/components/research/ExplainerChips.jsx` | 45 | → `text-app-soft` |
| `src/components/facts/FactCard.jsx` | 39 | → `text-app-soft` |
| `src/components/challenges/ProgressTracker.jsx` | 49 | → `text-app-soft` (the `border-app-border/5` on the same line is a real hairline — leave it) |
| `src/pages/Home.jsx` | 210 | → `text-app-soft` |
| `src/components/poster/CaptionBlock.jsx` | 55 | → `text-app-soft` |

**Bug 3 — non-token raw Tailwind statics that won't track the theme.** Replace so the theme stays swappable and consistent:

| File : line | Current | New |
|---|---|---|
| `src/components/layout/AboutModal.jsx:70` | `bg-red-950/20` | `bg-brand-red/10` |
| `src/components/ui/InfoBanner.jsx:14` | `danger: 'bg-red-950/20 border-brand-red/30 text-brand-red-mid'` | `danger: 'bg-brand-red/10 border-brand-red/30 text-brand-red-light'` (text swapped to `red-light` — `red-mid` on `surface-2` is only 4.24:1, borderline for body copy) |
| `src/components/ui/Button.jsx:21` | `danger: 'bg-red-800 hover:bg-red-700 text-white'` | `danger: 'bg-brand-red-dark hover:brightness-110 text-white'` |
| `src/components/ui/Button.jsx:22` | `teal: 'bg-brand-teal hover:bg-teal-600 text-white shadow-sm'` | `teal: 'bg-brand-teal hover:brightness-95 text-app-bg shadow-sm'` (white-on-teal is 2.97:1 — fails; dark-ink-on-teal is 6.35:1) |

**Bug 4 — Button primary hover dips below AA.** `Button.jsx:18` resting state (`bg-brand-red` = deep `--red`, white text) is already AA-safe at 5.44:1, but `hover:bg-brand-red-mid` drops to 3.82:1 on hover. Fix: keep the fill on the deep-red family and brighten via filter instead of hue-swapping to mid-red:

```
primary: 'bg-brand-red hover:brightness-110 active:brightness-95 text-white shadow-sm'
```

Apply the same hover pattern anywhere else `bg-brand-red hover:bg-brand-red-mid` appears with white text: `src/components/challenges/BadgeUnlockModal.jsx:47`.

**Card variants — the "light card on a dark page" problem.** `src/components/ui/Card.jsx` currently has a literal white `default` variant and pastel `red/orange/teal` variants meant for a light theme. New dark-anchored versions (same variant names, no API break):

```jsx
const variants = {
  default: 'bg-app-surface border-app-border/60 text-app-ink',
  dark:    'bg-app-dark border-app-border/40 text-app-ink',       // recessed tone, for hero/inset panels
  red:     'bg-brand-red/10 border-brand-red/25 text-app-ink',    // heading/icon inside uses text-brand-red-light
  orange:  'bg-brand-orange/10 border-brand-orange/25 text-app-ink',
  teal:    'bg-brand-teal/10 border-brand-teal/25 text-app-ink',
};
```
Rule: inside a tinted card, **body copy is always `text-app-ink` / `text-app-soft`**; the brand color is reserved for the heading, icon, or a small label — never full paragraph copy — because the brand-mid tones sit at 4.24–4.94:1 (fine for large/UI text, risky for small body).

**Gradient / spotlight cards keep AA by staying dark-anchored.** `ResearchSpotlight.jsx` already does this correctly (`bg-gradient-to-br from-brand-red/15 via-app-dark to-app-dark`) — codify it as the rule for any future spotlight/gradient surface: **the gradient's darkest stop must be ≥85% of the surface and must be an app-dark/app-surface tone**; the brand color is only a ≤15% tint layered on top. This guarantees `text-app-ink` stays ~14–16:1 regardless of the tint. Never gradient between two saturated brand colors behind text.

**Story poster is explicitly excluded.** `PosterCanvas.jsx`, `posterDrawers.js`, `posterTemplates.js`, `posterThemes.js` are canvas-rendered output the user shares/exports — they keep their own independent theme system (including the light `cream`/`mono` themes) and are **not** touched by any of the above. Only the chrome *around* the canvas (selectors, controls, buttons) restyles.

---

## 3. Typography

| Role | Font | Size / weight | Line-height | Usage |
|---|---|---|---|---|
| Display / Hero stat | DM Serif Display, italic accent word | 30–36px / 400 (serif is never bold) | 1.15 | Home hero headline, big stat numbers |
| Page H1 | DM Serif Display | 24px / 700 | 1.2 | One per page, top of `PageWrapper` |
| Card / Section title (serif) | DM Serif Display | 18–20px / 700 | 1.25 | Modal titles, spotlight titles, "Your Progress" |
| Body title (sans) | DM Sans | 13–14px / 700 | 1.35 | Card headings, list item titles |
| Body copy | DM Sans | 12–13px / 400 | 1.6 | Paragraph copy — always `text-app-ink` or `text-app-soft`, never `text-app-muted` |
| Eyebrow / label | DM Sans | 10px / 700, uppercase, `tracking-wider` (0.05em) | 1.2 | Section labels — `text-app-muted` |
| Micro / meta | DM Sans | 9–9.5px / 500–600 | 1.3 | Source citations, timestamps — `text-app-muted` italic |

Serif is reserved for **emotional/heading moments** (hero, modal titles, big numbers) — never for body copy, buttons, or labels, which stay DM Sans. This is already the app's pattern; keep it strictly. Eyebrows keep the existing `uppercase tracking-wider text-app-muted text-xs/[10px] font-bold` recipe verbatim.

---

## 4. Spacing, Radius, Elevation

- **Spacing grid:** stay on the existing 4px-based Tailwind scale already in use (`gap-1.5` through `gap-6`, `p-3` to `p-6`). No new scale needed — the app is already generous and consistent here (`PageWrapper` gives `px-4 pt-4 pb-24`). Section-to-section rhythm stays `gap-5`/`gap-6` inside `PageWrapper`'s flex column; inside a card, `gap-3` to `gap-4`.
- **Radius:** `--radius` (16px) for standard cards, `--radius-sm` (10px) for nested chips/inputs, new `--radius-lg` (22px) for hero panels and bottom sheets (softer, more "premium" silhouette for the highest-attention surfaces), `--radius-pill` for chips/badges/buttons-as-pills.
- **Elevation on dark is built from a lighter surface + a real shadow + a hairline, not a fake light-mode shadow:**
  - Level 0 (canvas): `--bg` #141013, no shadow.
  - Level 1 (card): `--surface` #1F1A1C, `border-app-border/60`, `shadow-card`.
  - Level 2 (nested/pressed row, input, sheet-on-sheet): `--surface-2` #251F21, `border-app-border/40`.
  - Level 3 (modal / bottom sheet / hero): `--surface` or `--dark`, `shadow-raised`, `border-app-border/30`.
  - Never rely on shadow alone to show elevation on this dark a canvas — always pair a shadow with a 1px hairline (`border-app-border/NN`), since shadows read as ~40% weaker on near-black than on white.

---

## 5. Core Components — states & motion

| Component | Rest | Hover (pointer) | Press/active | Focus-visible | Motion |
|---|---|---|---|---|---|
| **Card** (`interactive`) | `bg-app-surface border-app-border/60 shadow-card` | `hover:shadow-raised hover:border-app-border` | `whileTap scale:0.98` (existing) | `focus-visible:ring-2 ring-brand-red-mid ring-offset-2 ring-offset-app-bg` (add — currently missing on Card) | `whileTap` spring, 120ms |
| **Chip/Badge** (filter, age tabs, explainer chips) | `bg-app-surface border-app-border/40 text-app-muted` | `hover:text-app-ink hover:border-app-border` | active chip: `bg-brand-red border-brand-red text-white scale-[1.02]` (unchanged, already AA at 5.44:1 since it's `--red` not `--red-mid`) | `focus-visible:ring-2 ring-brand-red-mid` | 150ms ease, layout-id shared transition recommended for the active-chip pill (framer `layoutId`) |
| **Button** primary/secondary/outline/danger/teal | see §2.4 fixed variants | `hover:brightness-110` (red/danger) or `hover:brightness-95` (teal/orange, since lighter fills darken on hover) | `active:scale-95` (existing) | `focus-visible:ring-2 ring-brand-red-mid ring-offset-2 ring-offset-app-bg` (already present, keep) | none beyond tap-scale; add a 300ms `whileTap` spring instead of instant scale for a softer feel |
| **Bottom nav** | `bg-app-dark/95 backdrop-blur-md border-t border-app-border/60` (swap `border-app-dark2` → `border-app-border/60` — a real hairline, not another fill color) | n/a (touch-first) | active tab: `text-brand-red-mid scale-105`; icon does a 200ms bounce-in when it becomes active (`whileTap` + `layoutId` on the active-dot indicator, new: small 4px dot under active icon) | focus ring on tab for keyboard/TalkBack nav | icon swap uses `AnimatePresence` cross-fade 150ms |
| **Header** | `bg-app-dark border-b border-app-border/60` | icon buttons: `hover:bg-app-surface` | `active:scale-90` (existing) | ring on icon buttons | logo ribbon emoji keeps its subtle `animate-pulse` |
| **Accordion** (PreventionCategory-style, kept for the "read more" deep layer only — see §7) | `bg-app-surface border-app-border/60` | chevron `hover:text-app-ink` | expand/collapse `height:auto` spring (existing) | ring on the trigger button | 250ms height/opacity, existing pattern is good — keep |
| **Tabs** (AgeGroupTabs / ResearchFilter style) | inactive `bg-app-surface text-app-muted`, active `bg-brand-red text-white` | inactive `hover:text-app-ink` | `scale-[1.02]` on active | ring | swap panel content with `AnimatePresence mode="wait"`, 200ms slide+fade (existing pattern, keep) |
| **Toast** | `bg-brand-red text-white shadow-raised` (already AA-safe, deep red) | n/a | spring in from bottom, auto-dismiss (existing) | n/a (non-interactive, but should get `role="status" aria-live="polite"`) | keep `y:50→0, scale:0.9→1` spring |
| **Modal / bottom sheet** | `bg-app-surface` (swap from `bg-app-dark2` value-for-value, no class change needed since dark2==surface) `shadow-raised` | n/a | drag-handle affordance (existing) | trap focus, `Escape` closes (verify hook exists) | keep spring `damping:25 stiffness:250` |

---

## 6. Motion Patterns (framer-motion)

- **Page transitions:** keep `PageWrapper`'s `opacity 0→1, y 8→0, 0.3s easeOut` — it's subtle and correct, no change.
- **List stagger:** for any list rendered with `.map()` (topic tiles, research feed, fact cards, sorter chips), wrap in a parent `motion.div` with `variants={{ show: { transition: { staggerChildren: 0.05 } } }}` and each item `initial="hidden" animate="show"` with a small `y:6→0, opacity:0→1` — this is currently missing everywhere (items just pop in with the page) and is the single highest-leverage "feels alive" change for list-heavy screens (Research, Facts, Prevention topic grid).
- **Tap feedback:** every tappable surface gets `whileTap={{ scale: 0.97 }}` (cards already do 0.98; keep chips/buttons slightly more pronounced at 0.95–0.97 since they're smaller targets).
- **Celebratory:** reuse the existing `Confetti` + `BadgeUnlockModal` spring-pop pattern for any new "you did it" moment (e.g. completing the Trigger/Helper sorter, finishing the Nose Care steps) — do not invent a second celebration language.
- **Reduced motion:** wrap the app root once with framer-motion's `MotionConfig reducedMotion="user"` (new, add in `App.jsx` around `<Router>`) so every `motion.*` component automatically collapses transforms to opacity-only when the OS accessibility setting is on — this is a one-line fix that covers the entire component tree without touching every file.

---

## 7. Prevention Interactivity Blueprint (most important)

Goal: replace "wall of text in a long accordion" with **glanceable, tappable, animated** surfaces. Every sourced detail from `src/data/prevention.js` stays available — nothing is deleted — but it moves behind a visual first layer and an explicit "Read the full detail" disclosure. All new components live under `src/components/prevention/**`; all icons are **inline SVG components**, no image assets.

### 7.1 `RoutineRing` — replaces the current plain `RoutineTimeline` list as the flagship
`src/components/prevention/RoutineRing.jsx`
- Renders a segmented ring (SVG `<circle>` with 4 `stroke-dasharray` arcs — Morning/Daytime/Evening/Ongoing, using `brand-teal`, `brand-orange`, `brand-red-mid`, `brand-red` respectively for quick visual distinction) with a `Sun/Coffee/Moon/Repeat` lucide icon at each segment's midpoint (matches existing `timeIcons` map).
- Tapping a segment: the ring animates that arc from its resting 60% opacity to 100% + slight `stroke-width` grow (`framer-motion` `animate` on the SVG path, spring), the center of the ring cross-fades to show that segment's icon + label, and **one short line** (the single most important item, e.g. "Moisturize twice a day") appears below the ring in large `font-serif` text.
- Below the ring: 3 small dot-bullets show the segment's remaining items as short phrases (≤6 words each, truncate the data's longer sentence to its lead clause) — tapping "See all details" expands the existing full list (`text-app-soft`) for that segment inline, reusing the exact copy from `everydayRoutine[i].items`.
- Props: `{ routine, className }` — same `everydayRoutine` shape already in `data/prevention.js`, no data migration needed.

### 7.2 `TopicTileGrid` + `TopicTile` — replaces the 7-item long-accordion list
`src/components/prevention/TopicTileGrid.jsx`, `src/components/prevention/TopicTile.jsx`, icons in `src/components/prevention/icons/` (one file per icon: `NoseDropletIcon.jsx`, `PlateIcon.jsx`, `IronDropIcon.jsx`, `PillIcon.jsx`, `ActivityIcon.jsx`, `StethoscopeIcon.jsx`, `HeartWellbeingIcon.jsx` — each a small hand-drawn-feeling inline SVG in the brand palette, replacing the current emoji 💧🥗🩸💊🌍🩺💛).
- `TopicTileGrid` renders a 2-column grid of `TopicTile`s, one per `preventionCategories[i]` (nasal-care, diet-nutrition, iron-anemia, medication-safety, activity-environment, screening-checkups, emotional-wellbeing).
- `TopicTile` props: `{ icon: Component, title, summary, accent: 'red'|'orange'|'teal', onClick }` — a square-ish tile, icon centered top, `title` below in `font-sans font-bold text-sm text-app-ink`, `summary` truncated to one line in `text-app-muted`. `whileTap scale:0.96`, `whileHover` (desktop/testing only) subtle lift.
- Tapping a tile opens a **bottom sheet** (`ui/Modal type="bottom-sheet"`) — `PreventionTopicSheet.jsx` — showing: the same icon large at top, the category title (serif), then **3–4 icon bullets** built from the tips' `title` fields only (not the full `body`), each with a small check/dot icon. Below that, a single `"Read the full detail →"` link expands the existing tip-by-tip cards (title + body + tag + source, exact current markup from `PreventionCategory.jsx`) inline within the sheet — so the sheet *is* the new home for what the accordion used to render, just visual-first.
- This retires `PreventionCategory.jsx` as the default view (its internals — the tip card markup — are reused verbatim inside the sheet's "read more" state, so nothing is rewritten from scratch, just relocated).

### 7.3 `AgePersonaSelector` — upgrades `AgeGroupTabs`
`src/components/prevention/AgePersonaSelector.jsx`, figures in `src/components/prevention/icons/PersonaFigures.jsx` (5 simple flat-SVG silhouettes: child, teen, adult, older-adult, pregnancy — basic geometric figures in 2 tones, not detailed illustrations, ~40×56px).
- Row of 5 tappable figures (replacing the emoji chips) with the label below each; active figure gets a `brand-red` glow ring (`stroke` animate) and lifts 2px.
- Selected persona panel shows: the existing `focus` line in large text, then **3 icon bullets** (first 3 items of that group's `tips` array, each paired with a small generic check/heart/calendar icon rotated by index), then a `"See all N tips for this stage"` disclosure revealing the rest of the tips list (existing `<Check>`-bulleted markup from `AgeGroupTabs.jsx`, reused).
- Props: `{ groups }` — same `preventionByAge` shape, no data migration.

### 7.4 `NoseCareSteps` — new "Nose care in 3 steps" animated mini-guide
`src/components/prevention/NoseCareSteps.jsx`
- 3 steps, each a small inline SVG scene (Step 1 "Moisturize" — a droplet entering a simple nose outline; Step 2 "Hands off" — a hand icon with a slash/redirect motion; Step 3 "If it bleeds" — a seated figure leaning forward with a pinch gesture) that **advance on tap** (progress dots at bottom, tap dot or "Next" arrow, or auto-advance every 4s with pause-on-interact).
- Each step shows exactly one line of text (derived from existing tips: "Moisturize twice a day, every day" / "Hands off — avoid picking, rubbing, forceful blowing" / the emergency "sit upright, pinch 10–15 min" line) — full sourced detail sits behind a single `"Why this helps"` disclosure per step.
- Props: `{ steps }` where each step is `{ title, line, detail, illustration: 'moisturize'|'handsOff'|'bleed' }` — a small new export in `data/prevention.js` (`export const noseCareSteps = [...]`), sourced from the existing `nasal-care` category's top 3 tips so no new medical copy is authored.

### 7.5 `TriggerHelperSorter` — the "dry list → mini-game" fix
`src/components/prevention/TriggerHelperSorter.jsx`
- A small deck of chips (spicy food, alcohol, humidifier, Ponaris, NSAIDs, iron-rich food, saline rinse — pulled from the existing diet/nasal-care tips) sits in a "shuffle tray"; two empty columns labeled **Triggers** (brand-red header) and **Helpers** (brand-teal header).
- User taps a chip, then taps a column (or the component supports simple tap-to-assign rather than full drag-and-drop, which is more reliable on all ages/devices): correct placement → chip flies into the column with a spring + a small `CheckCircle` pulse + haptic-style scale bounce; incorrect → chip shakes (`x: [-4,4,-4,4,0]`) and shows a 1-line correction ("Ponaris is a helper — it moisturizes the nose") that auto-dismisses.
- Finishing the deck triggers the existing `Confetti` micro-celebration.
- Props: `{ items }` where each item is `{ id, label, correctColumn: 'trigger'|'helper', hint }` — a small new export `export const triggerHelperItems = [...]` in `data/prevention.js`, classification drawn straight from tags already in the data (`"Notice your pattern"`/`"Discuss with doctor"` → trigger; `"Daily"`/`"Nightly"` moisturizers → helper).

### 7.6 New `Prevention.jsx` page order
Header → `InfoBanner` disclaimer (unchanged) → `RoutineRing` (flagship, replaces `RoutineTimeline`) → `AgePersonaSelector` (upgrades `AgeGroupTabs`) → `NoseCareSteps` (new) → `TopicTileGrid` (replaces the full `PreventionCategory` list as the default view) → `TriggerHelperSorter` (new) → a final small `"Browse the full topic library"` text link for anyone who wants the old linear accordion — nothing is removed from the data layer, only re-presented.

---

## 8. Per-screen direction

- **Home:** Hero panel (`bg-app-dark`, `radius-lg`) stays the anchor; swap `h1 text-white`→`text-app-ink`. 2×2 nav-card grid gets list-stagger on mount. "Random HHT Fact" strip and resource links: apply Bug-2 fix (`text-app-border`→`text-app-soft`) at line 210. Otherwise structure is sound — no redesign needed, just token fixes + stagger.
- **Prevention:** Full rebuild of the interactive layer per §7; disclaimer banner and page header get the standard token fixes.
- **Research:** Keep the spotlight-card + filterable-feed + explainer-chips structure (all already reasonably interactive) — apply Bug-1 (h1) and Bug-2 (`text-app-border` at lines 36, 56, 72, 45 sheet copy) fixes, add list-stagger to the feed, and give `ResearchCard`'s expand/collapse a slightly springier `AnimatePresence` (currently a flat 0.25s, fine to keep — no functional change required beyond tokens).
- **Poster Studio:** UI chrome only — `PosterTypeSelector`, `PosterFormatSelector`, `PosterThemeSelector`, `PosterOptionsPanel`, `CaptionBlock`, and the four `*PosterControls` components get the token/contrast pass (h1, `Card variant="dark"` wrappers already fine once Card.jsx updates). **The canvas itself, `posterThemes.js`, `posterTemplates.js`, and `posterDrawers.js` are out of scope** — they render exported images with their own intentional (sometimes light, e.g. `cream`/`mono`) themes and must not be touched.
- **Challenges:** Same treatment as Research — h1 token fix, `ProgressTracker.jsx:49` Bug-2 fix, list-stagger on `ChallengeCard`/`BadgeGrid`. `ChallengeCard.jsx:43`'s `bg-brand-red-light/10` → `bg-brand-red/10` (see §2.4 red-light role change). Celebration pattern (`BadgeUnlockModal`) is already excellent — just apply the Button-hover fix at line 47.
- **Emergency Card + Facts (contrast fixes only, per brief):** Facts — h1 fix, `FactCard.jsx:39` Bug-2 fix (also consolidate the ad-hoc inline `text-[#F8B0A0]` stat color at `FactCard.jsx:36` onto the new `text-brand-red-light` token, since `#F8B0A0` and the new `--red-light` #F2A79B are the same visual family and this removes a hardcoded hex). Emergency Card — page already uses `Card variant="dark"` and its own near-black display card (`EmergencyCardDisplay.jsx`, intentionally kept close to true-black for print/PDF export contrast, e.g. `bg-[#1C1C1E]`) — leave the *display card's* hardcoded hex alone (it's exported to PDF via `html2canvas` with an explicit `backgroundColor:'#1C1C1E'` and must stay predictable for print), but do apply the Bug-2/Bug-3 token fixes to the surrounding page chrome and `EmergencyCardForm`.

---

## 9. Parallelizable File Map

| Stream | Scope | Key files |
|---|---|---|
| **A — Foundation** | Tokens, primitives, chrome | `src/index.css`, `tailwind.config.js`, `index.html` (body class), `src/App.jsx`, `src/components/ui/**` (Card, Badge, Button, InfoBanner, Modal, ProgressBar, Toast), `src/components/layout/**` (Header, BottomNav, PageWrapper, AboutModal) |
| **B — Prevention** | Rich interactivity | `src/pages/Prevention.jsx`, `src/components/prevention/**` (new: RoutineRing, TopicTileGrid, TopicTile, AgePersonaSelector, NoseCareSteps, TriggerHelperSorter, icons/*; retire-in-place: PreventionCategory, AgeGroupTabs, RoutineTimeline reused as internals), `src/data/prevention.js` (add `noseCareSteps`, `triggerHelperItems` exports, no changes to existing exports) |
| **C — Research + Home** | Feed & landing polish | `src/pages/Research.jsx`, `src/components/research/**`, `src/pages/Home.jsx` |
| *(also, low-risk, either A or a 4th pass)* | Contrast-only pages | `src/pages/Facts.jsx`, `src/pages/Challenges.jsx`, `src/pages/EmergencyCard.jsx`, `src/pages/PosterStudio.jsx` + their component folders — pure token/class swaps from §2.4, no new components |

**Token-name stability confirmed:** every existing CSS var (`--bg,--dark,--dark2,--mid,--muted,--border,--red,--red-mid,--red-light,--red-dark,--orange,--orange-light,--teal,--teal-light,--radius*,--shadow*`) and every existing Tailwind key (`app.{dark,dark2,mid,muted,border,bg}`, `brand.{red,red-mid,red-light,red-dark,orange,orange-light,teal,teal-light}`) keeps its exact name — only hex **values** change, plus four **additive** new keys (`app.ink`, `app.soft`, `app.surface`, `app.surface2`) and one additive radius (`custom-lg`) and shadow (`raised`). Because A owns `index.css`/`tailwind.config.js` and B/C only ever *consume* class names that already exist or are documented here in advance, all three streams can branch and build simultaneously without a rename collision — B and C should treat `text-app-soft`, `bg-app-surface`, `bg-app-surface2`, and `text-app-ink` as already available from the moment they start, since A's token additions are pure config, not component logic, and land first/fast.

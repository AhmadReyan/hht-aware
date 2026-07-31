# AGENTS.md — Operating rules for autonomous agents on `hht-aware`

Any agent (Antigravity, Gemini, Claude, etc.) working in this repo **must** read
this file first, then follow the continuous loop in
[`.antigravity/LOOP.md`](.antigravity/LOOP.md). Pick work from
[`.antigravity/BACKLOG.md`](.antigravity/BACKLOG.md) and record every finished
cycle in [`.antigravity/CHANGELOG.md`](.antigravity/CHANGELOG.md).

`hht-aware` is a React 18 + Vite + Capacitor (Android) + PWA app for people
living with **HHT** (Hereditary Hemorrhagic Telangiectasia). It ships to GitHub
Pages and as an Android app. Real users depend on it — **never push a broken
build.**

---

## 0. The one rule

**Every commit must leave `main` green: `npm run lint` (zero warnings) AND
`npm run build` both pass, and any UI change is visually verified.** If you
cannot make it green, do not commit — revert and pick a different task.

---

## 1. Hard guardrails (violating any = the cycle failed)

**Tech**
- **Plain JavaScript + JSX only. NO TypeScript.** Match the existing file's
  style, comments, and naming.
- **No new npm dependencies** without explicit justification in the commit
  message. Prefer existing libs (framer-motion, lucide-react, jspdf,
  html2canvas, zustand, idb).
- **ESLint is enforced with `--max-warnings 0`**: `react/prop-types` is off;
  unused vars/imports are ERRORS; the only allowed-unused var is `React`.
- Node here is **18.17.1**. The Vite build relies on a webcrypto polyfill in
  `vite.config.cjs` — don't remove it. Any Cloudflare Worker deploy must use
  **`npx wrangler@3`** (wrangler 4+ needs Node 22).

**Two crash classes that have already bitten this app — never reintroduce:**
1. **Zustand getter-in-selector → blank white screen.** NEVER call a computed
   store getter inside a selector: `useAppStore(s => s.getLevelInfo())` returns
   a new object every render and infinite-loops React. Instead subscribe to the
   getter *function* and call it in render (`const f = useAppStore(s => s.getX); f()`),
   or subscribe to raw state (`s.nosebleedEpisodes`) and compute locally.
2. **`position: fixed` inside a transformed ancestor.** `PageWrapper` is a
   `motion.main` with a transform, so a `fixed` overlay rendered inside a page
   is positioned against the page, not the viewport (sheet lands off-screen).
   Render modals through the shared `Modal` component (it portals to
   `document.body`) or `createPortal` manually.

**Correctness**
- **Dates:** always local `YYYY-MM-DD` (the store's `getDateString` convention).
  Never use `toISOString()` for day keys — it shifts a day across timezones.
- **Offline-first / never-crash:** every `fetch`, geolocation, Firebase, or AI
  call must be guarded and fall back silently. The app must fully render with
  **no network** and when Firebase/AI are **unconfigured**. No blocking spinner
  on first paint.

**Privacy (non-negotiable — this is a health app)**
- Personal health data — `nosebleedEpisodes`, `labResults`, `ironIntake`, GPS
  coordinates, and `emergencyData` — is **device-local only.** Never add it to
  `buildSnapshot()` / cloud sync (`src/services/progressSync.js`), never upload
  it, never send it to the AI Worker. The assistant receives only the user's
  typed question + a static HHT prompt.
- Never commit secrets, keystores, or tokens.

**Do NOT touch** (unless the task *explicitly* targets that file):
`android/` (native config + signing), `.github/workflows/`, `vite.config.cjs`,
Capacitor config, `firestore.rules`, `src/lib/firebase*.js`, `cloudflare/`, and
the release signing keystore. These are load-bearing infra.

**Design system:** warm-editorial "BleedAware" tokens live in `src/index.css` +
`tailwind.config.js` (garnet `#8E2D3B`, teal `#15756C`, gold `#D9A13B`,
porcelain `#F6EFEB`, Bricolage Grotesque + Instrument Sans). **Ignore the stale
`DESIGN_SYSTEM.md`** — it documents an old dark theme.

---

## 2. Commands (the checks you must run)

```bash
npm ci                       # install (first run)
npm run lint                 # MUST be clean (--max-warnings 0)
npm run build                # MUST succeed (outputs dist/)
npm run preview -- --port 4173   # serves the built app at http://localhost:4173/hht-aware/
```

**UI verification (required for any visible change).** Serve the build, then
drive a headless browser and *look at the screenshot* — a render, not a guess:

```bash
# Windows: Chrome is at "C:\Program Files\Google\Chrome\Application\chrome.exe"
chrome --headless --disable-gpu --no-sandbox --hide-scrollbars \
  --enable-logging=stderr --v=0 --virtual-time-budget=7000 \
  --window-size=430,1600 --screenshot=shot.png \
  "http://localhost:4173/hht-aware/#/<route>"
# Then: (a) open shot.png and confirm it renders correctly,
#       (b) grep the stderr log for CONSOLE errors (ignore Firebase "heartbeats").
```

Routes use `HashRouter`: `#/`, `#/tracker`, `#/ask`, `#/poster`, `#/prevention`,
`#/research`, `#/challenges`, `#/emergency`, `#/facts`.

**Android (only when the task needs it):**
```bash
# JAVA_HOME must point at JDK 21: C:\Program Files\Java\jdk-21
npm run build && npx cap sync android
android/gradlew.bat -p android assembleDebug --no-daemon
# -> android/app/build/outputs/apk/debug/app-debug.apk
```

---

## 3. Commit & branch rules
- **One concern per commit.** Small, reversible changes beat big ones.
- Work on `main` is fine for solo autonomous runs, but a branch + PR is better
  when a human reviews. Never force-push; never rewrite shared history.
- Message: imperative subject, a short body explaining *why*, ending with:
  `Co-Authored-By: <agent/model name> <noreply@…>`
- Stage **only the files your cycle changed** (`git add <paths>`), never
  `git add -A` blindly — other agents may have unrelated work in progress.

---

## 4. When in doubt
Prefer the smallest change that is correct and verified over a large speculative
one. If a task is ambiguous or risky (touches infra, changes data shapes,
affects privacy), leave a note in the backlog and pick a safer task instead.

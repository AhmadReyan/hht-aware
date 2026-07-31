# Backlog — `hht-aware`

The loop (see [`LOOP.md`](LOOP.md)) pulls from here, top priority first. Keep
items **small enough for one cycle**. Statuses: `ready` · `in-progress` ·
`blocked:<why>` · `needs-human` · `done`. Move finished items to the bottom and
log them in [`CHANGELOG.md`](CHANGELOG.md).

> Format: `- [P#] <title> — <one-line scope / acceptance check> (status)`

## ⭐ CURRENT FOCUS — Prevention screen redesign
Work the ordered steps in [`MISSION-prevention.md`](MISSION-prevention.md)
**before anything else below.** Do one step per cycle, in order; each must be
committed and screenshot-verified. When all 12 steps are done, resume the normal
priority order below.

## P0 — correctness & safety
- [P0] Rate-limit the AI Worker — add Cloudflare KV (or Durable Object) per-IP
  daily cap in `cloudflare/hht-ai-worker.js` so a direct caller can't burn the
  free Neuron allowance; return 429 past the cap. Deploy with `wrangler@3`.
  (needs-human — touches `cloudflare/`, requires a KV namespace + redeploy)

## P1 — user value & monetization
- [P1] AI answer streaming — stream the assistant reply into the chat instead of
  one blocking wait; keep the offline/unconfigured fallback. Acceptance: `#/ask`
  shows text appearing progressively; no console errors. (done)
- [P1] Real billing behind the paywall — wire `handleUnlock` in
  `UpgradeSheet.jsx` to Google Play Billing (Capacitor) or RevenueCat/Stripe;
  keep the preview toggle for web. (needs-human — new dependency + store setup)
- [P1] AI poster art in Studio — optional premium: generate a background image
  via the Worker (Flux) or Pollinations, guarded + offline-safe, gated by
  `PremiumGate`. (ready, but confirm no new dep beyond a fetch)
- [P1] Emergency Card polish — verify the passport view + PDF export render
  correctly on all themes; ensure the "stored only on this device" trust cue is
  present. Acceptance: screenshot `#/emergency` in both modes. (done)

## P2 — quality, performance, tests
- [P2] Code-split the ~1.9 MB main bundle — dynamic-import the poster drawers,
  jspdf/html2canvas, and firebase so they load on demand. Acceptance: build
  shows the main chunk shrink; app still works via screenshots of `#/poster` and
  `#/emergency`. (ready)
- [P2] Add a test harness — set up Vitest (dev-dep, justified) and unit-test pure
  logic: `mergeProgress`, `getAdherence`, iron-week math, `mergeUpdates`,
  `riskFromHumidity`, date helpers. Acceptance: `npm test` green. (ready)
- [P2] Accessibility pass — focus trap + `aria-modal` in `Modal`, labelled
  controls across tracker/ask/poster, audit `prefers-reduced-motion`.
  One component group per cycle. (done)
- [P2] Bump GitHub Actions — move `actions/*@v4` → `@v5` in the workflows to
  clear the Node-20 deprecation annotation. (needs-human — touches
  `.github/workflows/`)
- [P2] Auto-version the release — derive `versionCode`/`versionName` in
  `android/app/build.gradle` from the git tag in `release.yml`. (needs-human —
  touches android + workflow)

## P3 — content & polish
- [P3] Refresh `DESIGN_SYSTEM.md` to document the shipped BleedAware light theme
  (it currently describes the old dark theme). (ready)
- [P3] More poster templates/themes — e.g. a "Screening reminder" and a seasonal
  World-HHT-Day layout; follow the drawer/template contract; verify each renders
  on the canvas via screenshot. (ready)
- [P3] Refresh `src/data/research.js` and `prevention.js` with current,
  plain-language HHT updates (keep the existing shapes + sources). (ready)
- [P3] Optional app-wide dark mode — wire Tailwind `dark` class + CSS-var
  overrides, AA-verified, with a toggle in the About sheet. (ready)

## Ideas / unshaped (Groomer refines before use)
- Weekly "your HHT week" summary card on Home from tracker data.
- Export tracker data as CSV (device-local).
- Localized/translated content.

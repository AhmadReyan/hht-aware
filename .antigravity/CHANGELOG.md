# Changelog — autonomous cycles

The LOGGER appends one line per completed cycle, newest at the top.
Format: `YYYY-MM-DD · cycle <id> · <what shipped> · <commit sha>`

2026-07-31 · cycle 01 · Stream AskHHT assistant answers progressively with typing cursor · a3096dd

<!-- new entries above this line -->

---

## Baseline (before autonomous loop began — 2026-07-31)
Shipped by the setup so far, for context:
- Public repo + CI/CD (lint + web build + Android debug APK), PWA auto-deploy to
  GitHub Pages, signed release APK on `v*` tags.
- Firebase: guarded web SDK, remote research feed, opt-in anonymous progress
  backup (health data excluded).
- Health tools ported from HHT Guide AI: `/tracker` (episodes, iron, labs,
  trends), NoseCast weather risk, Doctor Report PDF, premium gating.
- Ask-HHT assistant on `/ask`, backed by a free Cloudflare Worker (Workers AI) —
  live at `hht-ai.riyanwarr.workers.dev`.
- Poster Studio expanded to 11 themes × 16 templates.
- Fixes: MomentumStrip blank-screen crash, local-date heatmap, modal portal +
  About-header clip.

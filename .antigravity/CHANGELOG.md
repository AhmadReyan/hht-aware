# Changelog — autonomous cycles

2026-07-31 · cycle 05 · Prevention Redesign Step 2 — ProtectionRing hero component · e623109
2026-07-31 · cycle 04 · Prevention Redesign Step 1 — Restructure page into 7 target sections · 815ac9a
2026-07-31 · cycle 03 · Add role=dialog, aria-modal, aria-labelledby, and focus trap keyboard navigation to Modal · c389336
2026-07-31 · cycle 02 · Emergency Card polish with device-local privacy trust badge & safe date formatting · 64820a4
2026-07-31 · cycle 01 · Stream AskHHT assistant answers progressively with typing cursor · 0c7b837

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

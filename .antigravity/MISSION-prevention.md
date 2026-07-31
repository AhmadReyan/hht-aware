# MISSION: Redesign the Prevention screen — "Your Daily Shield"

**This is the current focus. Work through the steps below in order, one per
cycle**, following the loop and guardrails in [`LOOP.md`](LOOP.md) /
[`../AGENTS.md`](../AGENTS.md). Each step = one small, verified, committed change.
Do NOT do it all in one commit.

---

## The product thinking (why we're doing this)

**Job to be done:** help someone with HHT actually *do* their daily protective
habits — moisturize the nose, run a humidifier, hydrate, eat iron-friendly, avoid
triggers — so they bleed less and keep their iron up. The screen's best use is a
**fast, rewarding daily ritual**, not an educational document.

**What's wrong today:** it's static and text-heavy — a checklist, a heatmap, a
trigger form, a collapsed library, paragraphs of tips. It reads; it doesn't
*respond*.

**The new feeling:** like closing an Apple-Watch ring. Open it, tap a few big
tiles, watch your "protection" charge up, get a small win. **Reactive,
interactive, animated, minimal text.**

### Design mandate (apply to every step)
- **Minimal text.** Icons + numbers + 1–2 word labels. Any "why"/education hides
  behind a tap (progressive disclosure), never on the main surface.
- **Everything responds to touch:** `whileTap` scale + `haptics` on every action.
- **State changes animate** (`AnimatePresence`, spring presets in `src/lib/motion.jsx`).
- **Reactive to real state:** time of day, NoseCast dryness risk, streak, and
  what's already done today.
- **Reuse** `ProgressRing`, `MiniChart`, framer-motion presets, `haptics`, and the
  BleedAware tokens. **No new dependencies.** Respect `prefers-reduced-motion`.

### The APIs you already have (SCOUT to confirm before using)
- Store: `selfCareToday {date, done[]}`, `getSelfCareToday()`, `toggleSelfCare(key)`,
  `getSelfCareStreak(key?)`, `getAdherence(days,totalItems)`, `selfCareHistory`,
  `logTrigger(key)`, `getTriggerCounts()`.
- Data: `selfCareItems`, `selfCareItemCount`, `triggerOptions` in
  `src/data/selfCare.js`; educational content in `src/data/prevention.js`.
- Weather/risk: `src/services/weather.js` (`getCachedNoseCast`, `riskFromHumidity`).
- **Reuse the existing store wiring — do not rebuild the data layer.**

---

## The target layout (top → bottom)

1. **Protection Ring hero** — a big animated ring that fills as today's self-care
   items are completed. Center = a shield that "charges" (glow/color intensifies)
   with the count/percent. Time-aware one-line micro-greeting. Springy fill +
   haptic on change; celebratory glow at 100%.
2. **Action tiles** — a grid of large tactile icon tiles, one per `selfCareItems`
   entry (Moisturize, Humidifier, Hydrate, Iron food, Avoid triggers…). Tap =
   fill + check + haptic + micro-animation, and it drives the ring. Icon + short
   label only; a small "i" opens the "why" sheet.
3. **Streak flame** — an animated flame that grows/brightens with
   `getSelfCareStreak()`. Minimal number.
4. **Tip of the moment** — ONE contextual card that changes by time of day +
   NoseCast risk (dry air → "Humidifier on tonight"), animated swap. ~1 sentence.
5. **Consistency chain** — the 21-day history reborn as a lively chain: spring-in
   bars, a pulse on today, tap a day to see its count.
6. **Trigger quick-log** — tap a trigger chip → satisfying pop → logged; a tiny
   animated "your top trigger" insight (MiniChart). No form.
7. **Learn (minimized)** — the whole topic library collapsed into ONE elegant
   expandable at the very bottom. Secondary, out of the way.

---

## Ordered steps (one per cycle — each committed & screenshot-verified) [ALL COMPLETE ✅]

1. **Skeleton** — restructure `Prevention.jsx` to the new section order using placeholders (DONE - 3206ead)
2. **ProtectionRing hero** — animated ring, center shield + percent, time-aware greeting (DONE - fdf5a1e)
3. **Action tiles** — tap-to-complete icon grid over `selfCareItems` with haptics (DONE - cafe2a8)
4. **Completion celebration** — celebratory banner when 100% completed today (DONE - ba6072f)
5. **"Why" sheet** — progressive disclosure modal `ActionWhyModal` per tile (DONE - 8d7a921)
6. **Streak flame** — `StreakFlame.jsx` animated streak counter (DONE - b930dd6)
7. **Tip of the moment** — `MomentTip.jsx` contextual time/risk dynamic card (DONE - 7e8ab07)
8. **Consistency chain** — `SelfCareConsistency.jsx` spring bars & real-time store reactivity (DONE - c22d564)
9. **Trigger quick-log** — `TriggerLogger.jsx` chip logger + `BarChart` top trigger insight (DONE - e0c5eea)
10. **Minimize Learn** — `Prevention.jsx` collapsible `AnimatePresence` drawer (DONE - cf60509)
11. **Emergency Bridge** — Emergency First Aid & Passport banner (DONE - bb54202)
12. **Final verification** — full adversarial review, zero lint warnings, build green, screenshot verified (DONE)

**Definition of done for the mission:** the Prevention screen is icon-first and
nearly text-free on its main surface, every action animates and gives haptic
feedback, the ring/flame/tip/chain all react to real state, education is one tap
away, and lint + build + screenshots are all green at every step.

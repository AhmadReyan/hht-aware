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

## Ordered steps (one per cycle — each committed & screenshot-verified)

1. **Skeleton** — restructure `Prevention.jsx` to the new section order using
   placeholders; keep all existing components rendering for now (no behavior
   change). Verify the page still works.
2. **ProtectionRing hero** — new `components/prevention/ProtectionRing.jsx`:
   animated ring from today's done/total, center shield + percent, time-aware
   greeting. Wire it in.
3. **Action tiles** — new `ActionTiles.jsx`: tap-to-complete icon grid over
   `selfCareItems`, calling `toggleSelfCare`, feeding the ring; haptics +
   completion animation. Replace the old text checklist on the main view.
4. **Completion celebration** — glow + a brief confetti/pulse + a one-line
   affirmation when all items are done today; haptic success. Reduced-motion safe.
5. **"Why" sheet** — a progressive-disclosure `Modal`/sheet per action holding its
   educational text (from `prevention.js`), opened by the tile's "i". This is
   where long copy goes so the main view stays minimal.
6. **Streak flame** — `StreakFlame.jsx` animated from `getSelfCareStreak()`.
7. **Tip of the moment** — `MomentTip.jsx`: reactive to time-of-day + NoseCast
   risk, animated `AnimatePresence` swap. One sentence.
8. **Consistency chain** — redesign the history strip: spring-in bars, pulse on
   today, tap-for-count. (Build on the existing `SelfCareConsistency`.)
9. **Trigger quick-log** — gesture chip logger + a `MiniChart` "top trigger"
   insight from `getTriggerCounts()`; drop the form feel.
10. **Minimize Learn** — collapse the topic library + age/nose-care content into a
    single bottom expandable; trim every remaining paragraph to a micro-label.
11. **Polish** — motion consistency, `prefers-reduced-motion`, a11y (44px targets,
    aria), and the empty / partial / all-done states.
12. **Final verification** — screenshot the redesigned screen in fresh-install,
    partially-done, and 100%-complete states; fix anything off. Log the mission
    complete in `CHANGELOG.md`.

**Definition of done for the mission:** the Prevention screen is icon-first and
nearly text-free on its main surface, every action animates and gives haptic
feedback, the ring/flame/tip/chain all react to real state, education is one tap
away, and lint + build + screenshots are all green at every step.

# The Autonomous Loop — multi-agent structure for `hht-aware`

This is the cycle Antigravity runs continuously. **One cycle = one small,
verified, committed improvement.** Then it loops. Read
[`../AGENTS.md`](../AGENTS.md) for the guardrails every role must obey.

```
        ┌──────────────────────────────────────────────────────────────┐
        │                        ONE CYCLE                              │
        │                                                              │
  ┌───► 0. SELECT ─► 1. SCOUT ─► 2. PLAN ─► 3. BUILD ─► 4. REVIEW ─┐   │
  │                                                                │   │
  │        7. LOG & LOOP ◄─── 6. COMMIT ◄─── 5. VERIFY ◄───────────┘   │
  │             │                    ▲                                 │
  └─────────────┘             (fail ×2 ⇒ PAUSE, ask a human)           │
        └──────────────────────────────────────────────────────────────┘
```

Each numbered step is owned by a **role**. Roles are prompts/agents, not people;
several can be the same underlying model. Use the model routing in §"Models".

---

## The roles

### 0. SELECTOR  *(model: Flash)*
- Open [`BACKLOG.md`](BACKLOG.md). Pick the **highest-priority, unblocked** item
  (P0 before P1 before P2 before P3). Skip anything marked `blocked:` or that
  touches a "do NOT touch" path (unless the task is explicitly about it).
- Mark it `in-progress` with a timestamp and the cycle id.
- If the backlog has no ready P0–P2 item, run the **Groomer** (below) to
  generate new tasks, then pick one.

### 1. SCOUT  *(model: Flash)*
- Read only the files the task touches; produce a tight brief: current behavior,
  exact data shapes, the store actions/getters involved, and the design tokens/
  components to reuse. **Read-only — no edits.**
- Explicitly note any guardrail the task risks (getter-in-selector, fixed-in-
  PageWrapper, dates, offline, privacy) so BUILD avoids it.

### 2. PLANNER  *(model: Pro/thinking)*
- Turn the brief into a concrete, minimal implementation plan: files to change,
  the approach, and the **acceptance check** (what the VERIFY step must observe
  — e.g. "screenshot of `#/tracker` shows the new chart; no console errors").
- If the plan needs a new dependency, new data shape, or infra change → **stop**
  and downgrade the task to `needs-human` in the backlog; pick another.

### 3. BUILDER  *(model: Pro for logic, Flash for mechanical/CSS/doc edits)*
- Implement the plan. Match existing style. Keep the diff small.
- Run `npm run lint` locally as you go and fix your own findings.

### 4. REVIEWER  *(model: Pro — run 2–3 lenses in parallel, adversarially)*
Review the **diff only**. Each lens tries to *break* the change; report concrete
file:line defects, then the Builder fixes confirmed ones before VERIFY.
- **crash/offline lens:** getter-in-selector? unguarded fetch/geo/Firebase/AI?
  import-time side effects? blank screen when offline / unconfigured / empty
  data (fresh install)?
- **privacy/regression lens:** any health data reaching cloud sync or the AI
  Worker? date handling UTC vs local? a fixed overlay added inside a page
  without a portal? existing feature broken?
- **quality lens:** dead code, duplicated logic, a11y (44px targets, aria,
  reduced-motion), design-token drift.

### 5. VERIFIER  *(model: Flash to run, Pro to judge a failure)*  — **the gate**
- `npm run lint` → must be clean. `npm run build` → must succeed. Fix or revert.
- For any UI change this step is **mandatory, not optional**: `npm run preview`,
  headless-screenshot the affected route(s), **actually look at the image**, and
  grep the console for errors (see AGENTS.md §2). Lint+build alone is NOT
  sufficient sign-off for a visible change — a green build can still render
  broken. The acceptance check from PLANNER must be visibly satisfied, and your
  cycle report must state that the screenshot was inspected.
- If verification fails, hand back to BUILDER (max 2 repair attempts). Two failed
  cycles in a row on the same task → **PAUSE the loop and flag a human.**

### 6. COMMITTER  *(model: Flash)*
- Stage **only** the files this cycle changed. Commit with a conventional
  message + `Co-Authored-By`. Push only when everything is green. (CI on `main`
  re-runs lint/build, deploys the PWA to Pages, and builds the debug APK.)

### 7. LOGGER  *(model: Flash)*
- Move the backlog item to **Done**; append a one-line entry to
  [`CHANGELOG.md`](CHANGELOG.md) (cycle id, what shipped, commit sha). Read the
  sha from `git rev-parse HEAD` **after** the commit lands — never before, or you
  log the previous commit's sha.
- If the work surfaced follow-ups, add them to the backlog. **Loop to step 0.**

### Groomer (on demand, when backlog is thin)  *(model: Pro)*
Generate 3–8 new backlog items using these heuristics, newest-value first:
correctness/safety bugs → user-facing HHT value → performance/bundle size →
tests/coverage → accessibility → content freshness → polish. Keep each item
small enough for one cycle. Never invent infra rewrites.

---

## Fan-out (when a single cycle is too big)
Default is one item per cycle. When an item is naturally parallel and the pieces
don't share files, split it:
- **Reviewer** always fans out (the lenses above run concurrently, then merge).
- **Multi-file features:** one BUILDER per disjoint file set, a single owner for
  any shared file (store, `App.jsx`, `BottomNav`), then one VERIFY over the whole
  diff. Never let two agents edit the same file in one cycle.
- **Sweeps** (e.g. add aria labels across N components): pipeline the N items;
  each still passes REVIEW + VERIFY before its own commit.

---

## Models (you have Gemini 3.6 Flash + stronger models)
- **Flash (fast/cheap):** SELECT, SCOUT, mechanical BUILD (CSS, copy, docs),
  running VERIFY, COMMIT, LOG. ~80% of steps.
- **Pro / thinking model:** PLAN, non-trivial BUILD logic, adversarial REVIEW,
  judging a verification failure, Groomer. Reserve for where judgment matters.
- Escalate to Pro whenever a Flash step is uncertain; downgrade to Flash for
  anything mechanical. Cost scales with judgment required, not lines changed.

---

## Definition of Done (every cycle)
- [ ] Lint clean (`--max-warnings 0`) and build succeeds.
- [ ] UI change visually verified via headless screenshot; no new console errors.
- [ ] No guardrail violated (crash classes, dates, offline, privacy, do-not-touch).
- [ ] Diff is small and single-concern; only intended files staged.
- [ ] Committed with a clear message; backlog + changelog updated.

## Keeping the loop running (it does NOT self-continue)
An agent runs one turn and exits — it will not loop forever by itself. To keep
cycles firing, a **driver** re-invokes the CLI each cycle:
- Set `$Launcher` in [`run-loop.ps1`](run-loop.ps1) to your Antigravity CLI's
  non-interactive command, then run
  `powershell -ExecutionPolicy Bypass -File .antigravity\run-loop.ps1`.
- It runs one cycle, sleeps `IntervalSeconds`, repeats. Stop it by creating
  `.antigravity/STOP`. Per-cycle logs land in `.antigravity/logs/`.
- To survive reboots, register it as a Windows Task Scheduler task (run at logon).
- Safety net: `.githooks/pre-push` blocks any push whose lint/build fails, so an
  unattended cycle can never land a red build on `main`
  (enable once: `git config core.hooksPath .githooks`).

## Stop / pause conditions (hand to a human)
- Two consecutive failed cycles, or the same task failing twice.
- A task that needs a new dependency, a data-shape migration, a secret, or an
  infra/`do-not-touch` change.
- Any change that would send health data off-device, or weaken a privacy/offline
  guarantee.
- Lint/build cannot be made green.

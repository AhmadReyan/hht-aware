import { getDb, ensureAnonymousAuth } from '../lib/firebase';

/**
 * progressSync — opt-in anonymous cloud backup of gamification progress.
 *
 * What syncs (and ONLY this): completed challenges, streak, daily progress,
 * daily stats, seen badges, self-care history, trigger log, research
 * reactions and saved-for-appointment ids. The emergency card and saved
 * posters NEVER leave the device.
 *
 * Contract (offline-first, never-crash): every Firestore call is guarded —
 * pushProgress resolves false and pullProgress resolves { ok: false } on ANY
 * failure (Firebase unconfigured, Firestore disabled, offline). Nothing here
 * throws.
 */

// Exact allowlist of store slices that get backed up. Streak is nested under
// a `streak` key so the flat store fields stay an implementation detail.
export const buildSnapshot = (state) => ({
  completedChallenges: state.completedChallenges || [],
  streak: {
    currentStreak: state.currentStreak || 0,
    longestStreak: state.longestStreak || 0,
    lastActiveDate: state.lastActiveDate || null
  },
  dailyProgress: state.dailyProgress || { date: null, completedIds: [] },
  dailyStats: state.dailyStats || { lifetimeCompletions: 0, taskCounts: {}, perfectDaysCount: 0, totalXPEarned: 0 },
  seenBadgeIds: state.seenBadgeIds || [],
  selfCareHistory: state.selfCareHistory || [],
  triggerLog: state.triggerLog || [],
  researchReactions: state.researchReactions || {},
  savedForAppt: state.savedForAppt || []
});

/**
 * Write a progress snapshot to users/{uid} (merge, so future fields survive).
 * @returns {Promise<boolean>} true on success, false on any failure.
 */
export const pushProgress = async (uid, snapshot) => {
  try {
    if (!uid || !snapshot) return false;
    const db = await getDb();
    if (!db) return false;
    const { doc, setDoc } = await import('firebase/firestore');
    await setDoc(
      doc(db, 'users', uid),
      { progress: snapshot, progressUpdatedAt: new Date().toISOString() },
      { merge: true }
    );
    return true;
  } catch (err) {
    console.warn('Progress push skipped:', err?.message || err);
    return false;
  }
};

/**
 * Read the progress snapshot from users/{uid}. Distinguishes "no backup yet"
 * from "pull failed" so a transient read error is never mistaken for an empty
 * backup (which would let a fresh push overwrite the real one).
 * @returns {Promise<{ok: boolean, snapshot: object|null}>}
 *   { ok: true, snapshot } on success (snapshot null = no backup yet);
 *   { ok: false, snapshot: null } on any failure (unconfigured, offline, ...).
 */
export const pullProgress = async (uid) => {
  try {
    if (!uid) return { ok: false, snapshot: null };
    const db = await getDb();
    if (!db) return { ok: false, snapshot: null };
    const { doc, getDoc } = await import('firebase/firestore');
    const snap = await getDoc(doc(db, 'users', uid));
    if (!snap.exists()) return { ok: true, snapshot: null };
    const data = snap.data();
    return { ok: true, snapshot: data && typeof data.progress === 'object' ? data.progress : null };
  } catch (err) {
    console.warn('Progress pull skipped:', err?.message || err);
    return { ok: false, snapshot: null };
  }
};

// ---------------------------------------------------------------------
// Pure merge helpers — non-destructive union of two snapshots. A fresh
// install pulling an old backup fully restores it; a device with newer
// local data never loses anything to a stale backup.
// ---------------------------------------------------------------------
const asArray = (v) => (Array.isArray(v) ? v : []);
const asObject = (v) => (v && typeof v === 'object' && !Array.isArray(v) ? v : {});
const maxNum = (a, b) => Math.max(Number(a) || 0, Number(b) || 0);
const unionIds = (a, b) => Array.from(new Set([...asArray(a), ...asArray(b)]));

// Accept only plain "YYYY-MM-DD" strings; anything else in a remote doc
// (e.g. a Firestore Timestamp from a console edit) is treated as "no date"
// so the date math below can never throw on a malformed snapshot.
const asDateStr = (v) => (typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v) ? v : null);

// "YYYY-MM-DD" strings order correctly under plain string comparison.
const laterDate = (a, b) => {
  if (!a) return b || null;
  if (!b) return a;
  return a >= b ? a : b;
};

// Whole days between two local "YYYY-MM-DD" strings (mirrors the store's
// dateDiffDays; duplicated here so this module stays pure/standalone).
const dateDiffDays = (fromStr, toStr) => {
  const [ay, am, ad] = fromStr.split('-').map(Number);
  const [by, bm, bd] = toStr.split('-').map(Number);
  const from = new Date(ay, (am || 1) - 1, ad || 1);
  const to = new Date(by, (bm || 1) - 1, bd || 1);
  return Math.round((to - from) / 86400000);
};

// Per-key max for count maps like dailyStats.taskCounts.
const mergeCountMap = (a, b) => {
  const left = asObject(a);
  const right = asObject(b);
  const out = {};
  for (const key of new Set([...Object.keys(left), ...Object.keys(right)])) {
    out[key] = maxNum(left[key], right[key]);
  }
  return out;
};

/**
 * Merge two progress snapshots (either may be null/partial) without losing
 * anything: unions for id arrays, max() for counters and streak records,
 * per-key max for count maps, most-recent-date-wins for daily progress.
 * Pure function — no store access, no I/O.
 */
export const mergeProgress = (local, remote) => {
  const l = asObject(local);
  const r = asObject(remote);
  const lStreak = asObject(l.streak);
  const rStreak = asObject(r.streak);
  const lDaily = asObject(l.dailyProgress);
  const rDaily = asObject(r.dailyProgress);
  const lStats = asObject(l.dailyStats);
  const rStats = asObject(r.dailyStats);

  // Streak: the side that was active most recently owns the current run.
  // Same day on both devices → the longer run wins; exactly one day apart →
  // the older run actually continued into the newer day, so it carries over
  // (+1) rather than being clobbered by a fresh streak of 1.
  const lLast = asDateStr(lStreak.lastActiveDate);
  const rLast = asDateStr(rStreak.lastActiveDate);
  const lastActiveDate = laterDate(lLast, rLast);
  let currentStreak;
  if (lLast === rLast) {
    currentStreak = maxNum(lStreak.currentStreak, rStreak.currentStreak);
  } else {
    const newer = lastActiveDate === lLast ? lStreak : rStreak;
    const olderLast = newer === lStreak ? rLast : lLast;
    const older = newer === lStreak ? rStreak : lStreak;
    currentStreak = Number(newer.currentStreak) || 0;
    if (olderLast && dateDiffDays(olderLast, lastActiveDate) === 1) {
      currentStreak = maxNum(currentStreak, (Number(older.currentStreak) || 0) + 1);
    }
  }

  // Daily progress: prefer the more recent day; same day → union of ids.
  const lDate = asDateStr(lDaily.date);
  const rDate = asDateStr(rDaily.date);
  let dailyProgress;
  if (lDate === rDate) {
    dailyProgress = { date: lDate, completedIds: unionIds(lDaily.completedIds, rDaily.completedIds) };
  } else {
    const newer = laterDate(lDate, rDate) === lDate ? lDaily : rDaily;
    dailyProgress = { date: asDateStr(newer.date), completedIds: asArray(newer.completedIds) };
  }

  // Self-care history: per-date union of done keys, oldest→newest, cap 90.
  const historyByDate = new Map();
  for (const entry of [...asArray(l.selfCareHistory), ...asArray(r.selfCareHistory)]) {
    if (!entry || typeof entry.date !== 'string') continue;
    historyByDate.set(entry.date, unionIds(historyByDate.get(entry.date), entry.done));
  }
  let selfCareHistory = Array.from(historyByDate.keys())
    .sort()
    .map((date) => ({ date, done: historyByDate.get(date) }));
  if (selfCareHistory.length > 90) selfCareHistory = selfCareHistory.slice(selfCareHistory.length - 90);

  // Trigger log: entries repeat legitimately, so union by taking the max
  // count of each (date, trigger) pair, rebuilt oldest→newest, cap 200.
  const countPairs = (log) => {
    const counts = new Map();
    for (const e of asArray(log)) {
      if (!e || typeof e.date !== 'string' || !e.trigger) continue;
      const k = `${e.date}|${e.trigger}`;
      counts.set(k, (counts.get(k) || 0) + 1);
    }
    return counts;
  };
  const lCounts = countPairs(l.triggerLog);
  const rCounts = countPairs(r.triggerLog);
  let triggerLog = [];
  for (const k of new Set([...lCounts.keys(), ...rCounts.keys()])) {
    const sep = k.indexOf('|');
    const date = k.slice(0, sep);
    const trigger = k.slice(sep + 1);
    const n = Math.max(lCounts.get(k) || 0, rCounts.get(k) || 0);
    for (let i = 0; i < n; i += 1) triggerLog.push({ date, trigger });
  }
  triggerLog.sort((a, b) => a.date.localeCompare(b.date));
  if (triggerLog.length > 200) triggerLog = triggerLog.slice(triggerLog.length - 200);

  return {
    completedChallenges: unionIds(l.completedChallenges, r.completedChallenges),
    streak: {
      currentStreak,
      // The merged run can exceed both recorded longests (day-apart carry-over).
      longestStreak: maxNum(maxNum(lStreak.longestStreak, rStreak.longestStreak), currentStreak),
      lastActiveDate
    },
    dailyProgress,
    dailyStats: {
      lifetimeCompletions: maxNum(lStats.lifetimeCompletions, rStats.lifetimeCompletions),
      taskCounts: mergeCountMap(lStats.taskCounts, rStats.taskCounts),
      perfectDaysCount: maxNum(lStats.perfectDaysCount, rStats.perfectDaysCount),
      totalXPEarned: maxNum(lStats.totalXPEarned, rStats.totalXPEarned)
    },
    seenBadgeIds: unionIds(l.seenBadgeIds, r.seenBadgeIds),
    selfCareHistory,
    triggerLog,
    // A reaction is a single choice per update — this device's pick wins.
    researchReactions: { ...asObject(r.researchReactions), ...asObject(l.researchReactions) },
    savedForAppt: unionIds(l.savedForAppt, r.savedForAppt)
  };
};

// ---------------------------------------------------------------------
// Debounced push — coalesces a burst of store changes into one write.
// ---------------------------------------------------------------------
const PUSH_DEBOUNCE_MS = 5000;
let pushTimer = null;
let pendingPush = null; // { getSnapshot, onResult } while a push is scheduled

// Run the scheduled push now (shared by the debounce timer and the flush).
const firePendingPush = async () => {
  if (!pendingPush) return;
  const { getSnapshot, onResult } = pendingPush;
  pendingPush = null;
  try {
    if (typeof navigator !== 'undefined' && navigator.onLine === false) {
      onResult?.('skipped');
      return;
    }
    const uid = await ensureAnonymousAuth();
    if (!uid) {
      onResult?.('skipped');
      return;
    }
    const ok = await pushProgress(uid, getSnapshot());
    onResult?.(ok ? 'synced' : 'error');
  } catch (err) {
    console.warn('Progress push skipped:', err?.message || err);
    onResult?.('error');
  }
};

/**
 * Trailing-debounced push. `getSnapshot` is read when the timer fires so the
 * freshest state is written. `onResult` (optional) receives 'synced',
 * 'skipped' (offline / Firebase off — quietly try again later) or 'error'.
 */
export const schedulePush = (getSnapshot, onResult) => {
  if (pushTimer) clearTimeout(pushTimer);
  pendingPush = { getSnapshot, onResult };
  pushTimer = setTimeout(() => {
    pushTimer = null;
    firePendingPush();
  }, PUSH_DEBOUNCE_MS);
};

/**
 * Run any pending debounced push immediately (used when the app is
 * backgrounded / the page is hidden). Without this, a change made inside the
 * debounce window — e.g. un-checking a challenge — never reaches the cloud
 * and the next launch's pull would resurrect the stale backup. No-op when
 * nothing is scheduled.
 */
export const flushScheduledPush = () => {
  if (!pushTimer) return;
  clearTimeout(pushTimer);
  pushTimer = null;
  firePendingPush();
};

/** Cancel any pending debounced push (used when backup is turned off). */
export const cancelScheduledPush = () => {
  if (pushTimer) {
    clearTimeout(pushTimer);
    pushTimer = null;
  }
  pendingPush = null;
};

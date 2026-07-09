import { create } from 'zustand';
import {
  challengePointMap,
  dailyChallengePool,
  getTodaysDailyChallenges,
  xpForLevel,
  LEVEL_TITLES,
  badgeDefs
} from '../data/challenges';

const defaultEmergencyData = {
  name: '',
  dob: '',
  bloodType: 'Unknown',
  drugAllergies: '',
  specialist: '',
  specialistPhone: '',
  contactName: '',
  contactPhone: '',
  notes: '',
  manifestations: [] // array of string keys
};

// ---------------------------------------------------------------------
// Small resilient localStorage helpers — never let a corrupt/missing
// value or a storage exception (private browsing, quota, etc.) crash
// the app. Always fall back to a sane default.
// ---------------------------------------------------------------------
const safeParse = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return parsed === null || parsed === undefined ? fallback : parsed;
  } catch {
    return fallback;
  }
};

const safeSetItem = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore write failures (quota exceeded, private mode, etc.)
  }
};

const safeRemoveItem = (key) => {
  try {
    localStorage.removeItem(key);
  } catch {
    // no-op
  }
};

// ---------------------------------------------------------------------
// Date helpers — always use `new Date()` at call time (fine at runtime,
// only avoided in build tooling). Dates are stored/compared as plain
// local "YYYY-MM-DD" strings so day-rollover logic is unambiguous and
// not affected by timezone/UTC shifting.
// ---------------------------------------------------------------------
const getDateString = (d = new Date()) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

const dateDiffDays = (fromStr, toStr) => {
  const [ay, am, ad] = fromStr.split('-').map(Number);
  const [by, bm, bd] = toStr.split('-').map(Number);
  const from = new Date(ay, (am || 1) - 1, ad || 1);
  const to = new Date(by, (bm || 1) - 1, bd || 1);
  return Math.round((to - from) / 86400000);
};

export const useAppStore = create((set, get) => {
  // Load initial state from localStorage (all reads are guarded)
  const initialEmergency = safeParse('hht_emergency_card', defaultEmergencyData);
  const initialCompleted = safeParse('hht_completed_challenges', []);

  const parsedStreak = safeParse('hht_streak_v1', {});
  const initialStreak = {
    currentStreak: parsedStreak.currentStreak ?? 0,
    longestStreak: parsedStreak.longestStreak ?? 0,
    lastActiveDate: parsedStreak.lastActiveDate ?? null
  };

  const parsedDailyProgress = safeParse('hht_daily_progress_v1', {});
  const initialDailyProgress = {
    date: parsedDailyProgress.date ?? null,
    completedIds: Array.isArray(parsedDailyProgress.completedIds) ? parsedDailyProgress.completedIds : []
  };

  const parsedDailyStats = safeParse('hht_daily_stats_v1', {});
  const initialDailyStats = {
    lifetimeCompletions: parsedDailyStats.lifetimeCompletions ?? 0,
    taskCounts: parsedDailyStats.taskCounts && typeof parsedDailyStats.taskCounts === 'object' ? parsedDailyStats.taskCounts : {},
    perfectDaysCount: parsedDailyStats.perfectDaysCount ?? 0,
    totalXPEarned: parsedDailyStats.totalXPEarned ?? 0
  };

  const parsedSeenBadges = safeParse('hht_seen_badges_v1', []);
  const initialSeenBadges = Array.isArray(parsedSeenBadges) ? parsedSeenBadges : [];

  // Prevention self-care tracker (calorie-app style)
  const parsedSelfCareToday = safeParse('hht_selfcare_today_v1', {});
  const initialSelfCareToday = {
    date: parsedSelfCareToday.date ?? null,
    done: Array.isArray(parsedSelfCareToday.done) ? parsedSelfCareToday.done : [],
  };
  const parsedSelfCareHistory = safeParse('hht_selfcare_history_v1', []);
  const initialSelfCareHistory = Array.isArray(parsedSelfCareHistory) ? parsedSelfCareHistory : [];
  const parsedTriggerLog = safeParse('hht_trigger_log_v1', []);
  const initialTriggerLog = Array.isArray(parsedTriggerLog) ? parsedTriggerLog : [];

  // Studio saved creations
  const parsedSavedPosters = safeParse('hht_saved_posters_v1', []);
  const initialSavedPosters = Array.isArray(parsedSavedPosters) ? parsedSavedPosters : [];

  // Research reactions + save-for-appointment
  const parsedReactions = safeParse('hht_research_reactions_v1', {});
  const initialReactions = parsedReactions && typeof parsedReactions === 'object' ? parsedReactions : {};
  const parsedSavedAppt = safeParse('hht_research_saved_v1', []);
  const initialSavedAppt = Array.isArray(parsedSavedAppt) ? parsedSavedAppt : [];

  // Home daily body check-in — { date, bleeds: [locationKey] }
  const parsedCheckIn = safeParse('hht_body_checkin_v1', {});
  const initialCheckIn = parsedCheckIn && typeof parsedCheckIn === 'object' ? parsedCheckIn : {};

  return {
    // Emergency Card State
    emergencyData: initialEmergency,

    setEmergencyData: (data) => {
      set((state) => {
        const updated = { ...state.emergencyData, ...data };
        safeSetItem('hht_emergency_card', updated);
        return { emergencyData: updated };
      });
    },

    resetEmergencyCard: () => {
      safeRemoveItem('hht_emergency_card');
      set({ emergencyData: defaultEmergencyData });
    },

    // Challenges State
    completedChallenges: initialCompleted, // array of challenge IDs (1 to 10)

    toggleChallenge: (id) => {
      set((state) => {
        let updated = [...state.completedChallenges];
        if (updated.includes(id)) {
          updated = updated.filter(item => item !== id);
          // If any of 1-9 are unchecked, we must uncheck 10 as well
          if (id !== 10) {
            updated = updated.filter(item => item !== 10);
          }
        } else {
          updated.push(id);
          // If all 1-9 are now checked, automatically check 10
          const has1to9 = [1, 2, 3, 4, 5, 6, 7, 8, 9].every(num => updated.includes(num));
          if (has1to9 && !updated.includes(10)) {
            updated.push(10);
          }
        }

        safeSetItem('hht_completed_challenges', updated);
        return { completedChallenges: updated };
      });
      get().recordActivity();
    },

    // Total points calculation helper
    getPoints: () => {
      const completed = get().completedChallenges;
      return completed.reduce((total, id) => total + (challengePointMap[id] || 0), 0);
    },

    // Check if a specific challenge is completed
    isCompleted: (id) => {
      return get().completedChallenges.includes(id);
    },

    // -------------------------------------------------------------
    // Streak — consecutive days of activity (opening the app / doing
    // a challenge). Persisted as { currentStreak, longestStreak,
    // lastActiveDate } under 'hht_streak_v1'.
    // -------------------------------------------------------------
    currentStreak: initialStreak.currentStreak,
    longestStreak: initialStreak.longestStreak,
    lastActiveDate: initialStreak.lastActiveDate,

    recordActivity: () => {
      set((state) => {
        const today = getDateString(new Date());
        if (state.lastActiveDate === today) {
          // Already recorded today — nothing to do
          return {};
        }

        let newStreak;
        if (!state.lastActiveDate) {
          newStreak = 1;
        } else {
          const diff = dateDiffDays(state.lastActiveDate, today);
          if (diff === 1) {
            newStreak = state.currentStreak + 1;
          } else if (diff <= 0) {
            // Clock skew / same-or-earlier date somehow — don't break streak
            newStreak = state.currentStreak || 1;
          } else {
            // Missed one or more days — streak resets
            newStreak = 1;
          }
        }

        const newLongest = Math.max(state.longestStreak, newStreak);
        const updated = {
          currentStreak: newStreak,
          longestStreak: newLongest,
          lastActiveDate: today
        };
        safeSetItem('hht_streak_v1', updated);
        return updated;
      });
    },

    // -------------------------------------------------------------
    // Daily Challenges — rotating set of small tasks, refreshed each
    // calendar day, deterministic per date (see data/challenges.js).
    // -------------------------------------------------------------
    dailyProgress: initialDailyProgress, // { date, completedIds: [] }
    dailyStats: initialDailyStats, // { lifetimeCompletions, taskCounts, perfectDaysCount, totalXPEarned }

    getTodaysDailyList: () => {
      return getTodaysDailyChallenges(getDateString(new Date()));
    },

    isDailyDone: (taskId) => {
      const state = get();
      const today = getDateString(new Date());
      if (state.dailyProgress.date !== today) return false;
      return state.dailyProgress.completedIds.includes(taskId);
    },

    getDailyCompletedCount: () => {
      const state = get();
      const today = getDateString(new Date());
      if (state.dailyProgress.date !== today) return 0;
      const todaysIds = state.getTodaysDailyList().map((t) => t.id);
      return state.dailyProgress.completedIds.filter((id) => todaysIds.includes(id)).length;
    },

    toggleDailyChallenge: (taskId) => {
      const poolItem = dailyChallengePool.find((t) => t.id === taskId);
      const xpValue = poolItem ? poolItem.xp : 0;

      set((state) => {
        const today = getDateString(new Date());
        const todaysList = getTodaysDailyChallenges(today);
        const progress = state.dailyProgress.date === today
          ? state.dailyProgress
          : { date: today, completedIds: [] };

        let completedIds = [...progress.completedIds];
        const stats = {
          ...state.dailyStats,
          taskCounts: { ...state.dailyStats.taskCounts }
        };

        const wasCompleted = completedIds.includes(taskId);
        const wasAllCompleteBefore = todaysList.length > 0 && todaysList.every((t) => completedIds.includes(t.id));

        if (wasCompleted) {
          completedIds = completedIds.filter((t) => t !== taskId);
          stats.lifetimeCompletions = Math.max(0, stats.lifetimeCompletions - 1);
          stats.taskCounts[taskId] = Math.max(0, (stats.taskCounts[taskId] || 0) - 1);
          stats.totalXPEarned = Math.max(0, stats.totalXPEarned - xpValue);
        } else {
          completedIds.push(taskId);
          stats.lifetimeCompletions += 1;
          stats.taskCounts[taskId] = (stats.taskCounts[taskId] || 0) + 1;
          stats.totalXPEarned += xpValue;
        }

        const isAllCompleteNow = todaysList.length > 0 && todaysList.every((t) => completedIds.includes(t.id));
        if (isAllCompleteNow && !wasAllCompleteBefore) {
          stats.perfectDaysCount += 1;
        } else if (!isAllCompleteNow && wasAllCompleteBefore) {
          stats.perfectDaysCount = Math.max(0, stats.perfectDaysCount - 1);
        }

        const newProgress = { date: today, completedIds };
        safeSetItem('hht_daily_progress_v1', newProgress);
        safeSetItem('hht_daily_stats_v1', stats);
        return { dailyProgress: newProgress, dailyStats: stats };
      });

      get().recordActivity();
    },

    // -------------------------------------------------------------
    // XP & Levels
    // -------------------------------------------------------------
    getXP: () => {
      const state = get();
      return state.getPoints() + state.dailyStats.totalXPEarned;
    },

    getLevelInfo: () => {
      const state = get();
      const xp = state.getXP();
      let level = 1;
      // xpForLevel grows quadratically so this terminates quickly
      while (xpForLevel(level + 1) <= xp && level < 999) {
        level += 1;
      }
      const currentThreshold = xpForLevel(level);
      const nextThreshold = xpForLevel(level + 1);
      const xpIntoLevel = xp - currentThreshold;
      const xpForNext = Math.max(1, nextThreshold - currentThreshold);
      const progressPct = Math.min(100, Math.round((xpIntoLevel / xpForNext) * 100));
      const titleEntry = LEVEL_TITLES.find((t) => level >= t.min && level <= t.max) || LEVEL_TITLES[LEVEL_TITLES.length - 1];

      return {
        level,
        title: titleEntry.title,
        xp,
        xpIntoLevel,
        xpForNext,
        pointsToNext: Math.max(0, nextThreshold - xp),
        progressPct
      };
    },

    // -------------------------------------------------------------
    // Badges / Achievements — unlock state derived from live store
    // data (no separate persistence needed for "unlocked", only for
    // which celebration animations have already been shown).
    // -------------------------------------------------------------
    seenBadgeIds: initialSeenBadges,

    getBadges: () => {
      const state = get();
      const completed = state.completedChallenges;
      const stats = state.dailyStats;
      const levelInfo = state.getLevelInfo();

      const unlockedMap = {
        'first-poster': completed.includes(1),
        'fact-sharer': completed.includes(4),
        ambassador: completed.includes(10),
        'streak-7': state.longestStreak >= 7,
        'streak-30': state.longestStreak >= 30,
        'prevention-pro': (stats.taskCounts.d2 || 0) >= 5,
        researcher: (stats.taskCounts.d3 || 0) >= 5,
        'perfect-week': stats.perfectDaysCount >= 7,
        'habit-builder': stats.lifetimeCompletions >= 20,
        legend: levelInfo.title === 'Legend'
      };

      return badgeDefs.map((b) => ({ ...b, unlocked: !!unlockedMap[b.id] }));
    },

    // Returns badge ids that are unlocked but have not yet shown their
    // celebration animation.
    getNewlyUnlockedBadges: () => {
      const state = get();
      const unlockedIds = state.getBadges().filter((b) => b.unlocked).map((b) => b.id);
      return unlockedIds.filter((id) => !state.seenBadgeIds.includes(id));
    },

    markBadgesSeen: (ids) => {
      if (!ids || ids.length === 0) return;
      set((state) => {
        const updated = Array.from(new Set([...state.seenBadgeIds, ...ids]));
        safeSetItem('hht_seen_badges_v1', updated);
        return { seenBadgeIds: updated };
      });
    },

    // -------------------------------------------------------------
    // Prevention — daily self-care tracker (calorie-app pattern).
    // Today's checklist under 'hht_selfcare_today_v1'; a rolling
    // history (last 90 days) under 'hht_selfcare_history_v1' powers
    // adherence charts & per-item streaks.
    // -------------------------------------------------------------
    selfCareToday: initialSelfCareToday,       // { date, done: [key] }
    selfCareHistory: initialSelfCareHistory,   // [{ date, done: [key] }]
    triggerLog: initialTriggerLog,             // [{ date, trigger }]

    // Returns today's completed self-care keys (resets across day rollover).
    getTodaySelfCare: () => {
      const state = get();
      const today = getDateString(new Date());
      if (state.selfCareToday.date !== today) return [];
      return state.selfCareToday.done;
    },

    isSelfCareDone: (key) => {
      return get().getTodaySelfCare().includes(key);
    },

    // Toggle a regimen item for today; keeps the rolling history in sync.
    toggleSelfCare: (key) => {
      set((state) => {
        const today = getDateString(new Date());
        const base = state.selfCareToday.date === today
          ? state.selfCareToday
          : { date: today, done: [] };

        let done = [...base.done];
        if (done.includes(key)) {
          done = done.filter((k) => k !== key);
        } else {
          done.push(key);
        }
        const newToday = { date: today, done };

        // Upsert today's entry into history (most-recent-last), cap at 90 days.
        let history = state.selfCareHistory.filter((h) => h.date !== today);
        history.push({ date: today, done });
        if (history.length > 90) history = history.slice(history.length - 90);

        safeSetItem('hht_selfcare_today_v1', newToday);
        safeSetItem('hht_selfcare_history_v1', history);
        return { selfCareToday: newToday, selfCareHistory: history };
      });
      get().recordActivity();
    },

    // Consecutive days (ending today or yesterday) with at least one item done,
    // or with a specific `key` done if provided.
    getSelfCareStreak: (key = null) => {
      const state = get();
      const map = new Map(state.selfCareHistory.map((h) => [h.date, h.done]));
      let streak = 0;
      const cursor = new Date();
      // Allow the streak to still count if today isn't logged yet.
      const todayStr = getDateString(cursor);
      const todayDone = map.get(todayStr) || [];
      const todayCounts = key ? todayDone.includes(key) : todayDone.length > 0;
      if (!todayCounts) cursor.setDate(cursor.getDate() - 1);
      // Walk backwards while each day qualifies.
      // eslint-disable-next-line no-constant-condition
      while (true) {
        const ds = getDateString(cursor);
        const done = map.get(ds) || [];
        const qualifies = key ? done.includes(key) : done.length > 0;
        if (!qualifies) break;
        streak += 1;
        cursor.setDate(cursor.getDate() - 1);
      }
      return streak;
    },

    // Adherence for the last `days` days: [{ date, count, pct }] oldest→newest.
    getAdherence: (days = 7, totalItems = 5) => {
      const state = get();
      const map = new Map(state.selfCareHistory.map((h) => [h.date, h.done]));
      const out = [];
      for (let i = days - 1; i >= 0; i -= 1) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const ds = getDateString(d);
        const done = map.get(ds) || [];
        out.push({
          date: ds,
          count: done.length,
          pct: totalItems > 0 ? Math.round((done.length / totalItems) * 100) : 0,
        });
      }
      return out;
    },

    logTrigger: (trigger) => {
      set((state) => {
        const entry = { date: getDateString(new Date()), trigger };
        let log = [...state.triggerLog, entry];
        if (log.length > 200) log = log.slice(log.length - 200);
        safeSetItem('hht_trigger_log_v1', log);
        return { triggerLog: log };
      });
      get().recordActivity();
    },

    getTriggerCounts: () => {
      const log = get().triggerLog;
      return log.reduce((acc, e) => {
        acc[e.trigger] = (acc[e.trigger] || 0) + 1;
        return acc;
      }, {});
    },

    // -------------------------------------------------------------
    // Studio — saved poster creations (persisted, re-editable).
    // -------------------------------------------------------------
    savedPosters: initialSavedPosters,  // [{ id, title, type, themeId, formatId, options, data, createdAt }]

    savePoster: (poster) => {
      const id = poster.id || `poster_${new Date().getTime()}_${Math.floor(get().savedPosters.length + 1)}`;
      set((state) => {
        const record = { ...poster, id, createdAt: poster.createdAt || getDateString(new Date()) };
        const existing = state.savedPosters.some((p) => p.id === id);
        const updated = existing
          ? state.savedPosters.map((p) => (p.id === id ? record : p))
          : [record, ...state.savedPosters];
        safeSetItem('hht_saved_posters_v1', updated);
        return { savedPosters: updated };
      });
      return id;
    },

    updatePoster: (id, patch) => {
      set((state) => {
        const updated = state.savedPosters.map((p) => (p.id === id ? { ...p, ...patch } : p));
        safeSetItem('hht_saved_posters_v1', updated);
        return { savedPosters: updated };
      });
    },

    deletePoster: (id) => {
      set((state) => {
        const updated = state.savedPosters.filter((p) => p.id !== id);
        safeSetItem('hht_saved_posters_v1', updated);
        return { savedPosters: updated };
      });
    },

    // -------------------------------------------------------------
    // Research — per-update reactions + "save for my appointment".
    // -------------------------------------------------------------
    researchReactions: initialReactions,  // { [updateId]: reactionKey }
    savedForAppt: initialSavedAppt,        // [updateId]

    toggleReaction: (updateId, reactionKey) => {
      set((state) => {
        const current = state.researchReactions[updateId];
        const next = { ...state.researchReactions };
        if (current === reactionKey) {
          delete next[updateId];
        } else {
          next[updateId] = reactionKey;
        }
        safeSetItem('hht_research_reactions_v1', next);
        return { researchReactions: next };
      });
    },

    getReaction: (updateId) => get().researchReactions[updateId] || null,

    toggleSavedForAppt: (updateId) => {
      set((state) => {
        const has = state.savedForAppt.includes(updateId);
        const updated = has
          ? state.savedForAppt.filter((id) => id !== updateId)
          : [updateId, ...state.savedForAppt];
        safeSetItem('hht_research_saved_v1', updated);
        return { savedForAppt: updated };
      });
    },

    isSavedForAppt: (updateId) => get().savedForAppt.includes(updateId),

    getSavedForAppt: () => get().savedForAppt,

    // -------------------------------------------------------------
    // Home — daily body check-in ("How's your body today?").
    // Records which bleed locations (if any) happened today, counts as
    // a day of activity (feeds the streak), and is idempotent per day.
    // bleeds: array of location keys, or ['none'] for a bleed-free day.
    // -------------------------------------------------------------
    bodyCheckIn: initialCheckIn,  // { date, bleeds }

    logBodyCheckIn: (bleeds) => {
      const today = getDateString(new Date());
      const record = { date: today, bleeds: Array.isArray(bleeds) ? bleeds : [] };
      set(() => {
        safeSetItem('hht_body_checkin_v1', record);
        return { bodyCheckIn: record };
      });
      get().recordActivity();
      return record;
    },

    getTodayBodyCheckIn: () => {
      const ci = get().bodyCheckIn;
      const today = getDateString(new Date());
      return ci && ci.date === today ? ci : null;
    },

    isCheckedInToday: () => {
      const ci = get().bodyCheckIn;
      return !!ci && ci.date === getDateString(new Date());
    },

    // PWA Install Prompt State
    deferredPrompt: null,
    isInstallable: false,

    setDeferredPrompt: (prompt) => {
      set({ deferredPrompt: prompt, isInstallable: !!prompt });
    },

    clearDeferredPrompt: () => {
      set({ deferredPrompt: null, isInstallable: false });
    }
  };
});

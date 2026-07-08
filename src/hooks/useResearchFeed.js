import { useState, useEffect, useCallback, useMemo } from 'react';
import { researchUpdates } from '../data/research';

/**
 * Self-contained research-feed state (seen tracking + weekly rotation).
 * Intentionally localStorage-backed and independent of the Zustand store so it
 * never collides with other features. Delivers "latest research" to a
 * non-technical audience in small, periodic doses:
 *   - a deterministic "Research of the Week" that rotates every ISO week
 *   - an "unseen" badge so users feel there's something new to check
 */

const SEEN_KEY = 'hht_seen_research';
const STACK_RESOLVED_KEY = 'hht_research_stack_resolved';

// How many of the newest updates are candidates for the swipeable
// "This Week in Science" stack. Items leave the stack forever once swiped
// (saved or dismissed), independent of the read/unread ("seen") state below.
const STACK_POOL_SIZE = 8;

const safeParse = (raw, fallback) => {
  try {
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

// Week index since epoch — stable within a week, advances weekly.
const getWeekIndex = (date = new Date()) =>
  Math.floor(date.getTime() / (7 * 24 * 60 * 60 * 1000));

// Sort newest-first using the "YYYY-MM" (or "YYYY-MM-DD") date strings.
const sortByDateDesc = (items) =>
  [...items].sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')));

export const useResearchFeed = () => {
  const updates = useMemo(() => sortByDateDesc(researchUpdates || []), []);

  const [seenIds, setSeenIds] = useState(() =>
    safeParse(localStorage.getItem(SEEN_KEY), [])
  );

  useEffect(() => {
    try {
      localStorage.setItem(SEEN_KEY, JSON.stringify(seenIds));
    } catch {
      /* storage unavailable — non-fatal */
    }
  }, [seenIds]);

  // Deterministic weekly pick that walks through every item over time.
  const featured = useMemo(() => {
    if (!updates.length) return null;
    return updates[getWeekIndex() % updates.length];
  }, [updates]);

  const seenSet = useMemo(() => new Set(seenIds), [seenIds]);

  const isSeen = useCallback((id) => seenSet.has(id), [seenSet]);

  const unseenCount = useMemo(
    () => updates.filter((u) => !seenSet.has(u.id)).length,
    [updates, seenSet]
  );

  const markSeen = useCallback((id) => {
    setSeenIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
  }, []);

  const markAllSeen = useCallback(() => {
    setSeenIds(updates.map((u) => u.id));
  }, [updates]);

  // ---------------------------------------------------------------------
  // "This Week in Science" swipe stack — a small rotating pool of the
  // newest updates. Swiping (or tapping a button) either saves an item for
  // the user's next appointment or dismisses it; either way it leaves the
  // stack for good (tracked in its own localStorage key so it never
  // collides with the general "seen" tracking above).
  // ---------------------------------------------------------------------
  const [resolvedStackIds, setResolvedStackIds] = useState(() =>
    safeParse(localStorage.getItem(STACK_RESOLVED_KEY), [])
  );

  useEffect(() => {
    try {
      localStorage.setItem(STACK_RESOLVED_KEY, JSON.stringify(resolvedStackIds));
    } catch {
      /* storage unavailable — non-fatal */
    }
  }, [resolvedStackIds]);

  const resolvedStackSet = useMemo(() => new Set(resolvedStackIds), [resolvedStackIds]);

  const stackItems = useMemo(
    () => updates.slice(0, STACK_POOL_SIZE).filter((u) => !resolvedStackSet.has(u.id)),
    [updates, resolvedStackSet]
  );

  const resolveStackItem = useCallback((id) => {
    setResolvedStackIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
  }, []);

  return {
    updates,
    featured,
    isSeen,
    unseenCount,
    markSeen,
    markAllSeen,
    stackItems,
    resolveStackItem,
  };
};

export default useResearchFeed;

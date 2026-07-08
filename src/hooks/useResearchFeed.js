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

  return { updates, featured, isSeen, unseenCount, markSeen, markAllSeen };
};

export default useResearchFeed;

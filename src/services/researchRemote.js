import { getDb } from '../lib/firebase';

/**
 * Remote research feed — reads the public `research_updates` Firestore
 * collection and merges it with the bundled list in src/data/research.js.
 *
 * Contract (offline-first, never-crash):
 * - `fetchRemoteResearchUpdates()` resolves `[]` on ANY failure — Firebase
 *   unconfigured, Firestore not enabled, device offline, malformed docs.
 * - The last good remote list is cached in localStorage so the feed can
 *   render merged content instantly on the next launch, even offline.
 * - `mergeUpdates()` dedupes by numeric id (remote wins) and sorts
 *   newest-first, so everything downstream (unseen badge, swipe stack,
 *   "Research of the Week") keeps working untouched.
 */

const CACHE_KEY = 'hht_remote_research_v1';

// Fields a doc must carry (non-empty strings) to render safely in the feed.
const REQUIRED_STRING_FIELDS = ['date', 'category', 'title', 'plain'];
// Fields the UI treats as optional — coerced to strings so nothing renders "[object Object]".
const OPTIONAL_STRING_FIELDS = ['emoji', 'whyItMatters', 'stage', 'source', 'url'];

// "YYYY-MM" or "YYYY-MM-DD" — anything else would break date sorting/display.
const DATE_RE = /^\d{4}-\d{2}(-\d{2})?$/;

/**
 * Validate + normalize one raw doc into the bundled update shape.
 * Returns null for anything malformed (caller skips it).
 */
const sanitizeUpdate = (raw) => {
  if (!raw || typeof raw !== 'object') return null;
  const id = Number(raw.id);
  if (!Number.isFinite(id)) return null;
  for (const field of REQUIRED_STRING_FIELDS) {
    if (typeof raw[field] !== 'string' || !raw[field].trim()) return null;
  }
  if (!DATE_RE.test(raw.date)) return null;
  const update = { id };
  for (const field of REQUIRED_STRING_FIELDS) update[field] = raw[field];
  for (const field of OPTIONAL_STRING_FIELDS) {
    update[field] = typeof raw[field] === 'string' ? raw[field] : '';
  }
  return update;
};

/**
 * Synchronously read the last good remote list from localStorage.
 * @returns {Array} validated updates, or [] if the cache is missing/corrupt.
 */
export const getCachedRemoteUpdates = () => {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) return [];
    return parsed.map(sanitizeUpdate).filter(Boolean);
  } catch {
    return [];
  }
};

/**
 * Fetch the `research_updates` collection (background refresh).
 * Caches the result for instant offline renders on future launches.
 * @returns {Promise<Array>} validated updates, or [] on any failure.
 */
export const fetchRemoteResearchUpdates = async () => {
  try {
    const db = await getDb();
    if (!db) return [];
    const { collection, getDocs } = await import('firebase/firestore');
    const snap = await getDocs(collection(db, 'research_updates'));
    const items = [];
    snap.forEach((doc) => {
      const update = sanitizeUpdate(doc.data());
      if (update) items.push(update);
    });
    // Persist the cache only when we got items, or when an authoritative
    // (server, not Firestore-cache) response says the collection is empty —
    // an offline empty snapshot must not wipe a previously good cache.
    if (items.length || snap.metadata?.fromCache === false) {
      try {
        localStorage.setItem(CACHE_KEY, JSON.stringify(items));
      } catch {
        /* storage unavailable — non-fatal */
      }
    }
    return items;
  } catch (err) {
    console.warn('Remote research fetch skipped:', err?.message || err);
    return [];
  }
};

/**
 * Merge bundled + remote updates: dedupe by id (remote wins so the console
 * can correct a bundled item), sorted newest-first by date string — the same
 * ordering useResearchFeed applies, so "Research of the Week", the swipe
 * stack, and the unseen badge all derive cleanly from the merged list.
 * @returns {Array} merged, sorted updates.
 */
export const mergeUpdates = (bundled, remote) => {
  const byId = new Map();
  for (const u of bundled || []) {
    if (u && u.id != null) byId.set(u.id, u);
  }
  for (const u of remote || []) {
    if (u && u.id != null) byId.set(u.id, u);
  }
  return [...byId.values()].sort((a, b) =>
    String(b.date || '').localeCompare(String(a.date || ''))
  );
};

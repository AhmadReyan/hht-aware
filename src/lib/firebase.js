import { firebaseConfig } from './firebaseConfig';

/**
 * Lazy, guarded Firebase JS SDK bootstrap (modular v10) for BOTH the web/PWA
 * build and the Capacitor webview.
 *
 * Contract (offline-first, never-crash):
 * - Nothing runs at import time — the SDK is loaded and initialized on the
 *   FIRST call to any getter below.
 * - Every getter returns `null` (or resolves `null`) on ANY failure — missing
 *   config, Firestore not enabled in the console, device offline, etc. — and
 *   logs a single console.warn. Callers must treat `null` as "Firebase off"
 *   and fall back to bundled data / localStorage. Nothing here ever throws.
 */

// Memoized instances / in-flight promises so we only ever init once.
let appPromise = null;
let dbPromise = null;
let authUidPromise = null;

// Cheap sanity check — an obviously incomplete config means "not set up yet".
const hasConfig = () =>
  Boolean(firebaseConfig?.apiKey && firebaseConfig?.projectId && firebaseConfig?.appId);

/**
 * Lazily initialize (or reuse) the Firebase app.
 * @returns {Promise<import('firebase/app').FirebaseApp|null>}
 */
export const getFirebaseApp = () => {
  if (!appPromise) {
    appPromise = (async () => {
      try {
        if (!hasConfig()) return null;
        const { initializeApp, getApps } = await import('firebase/app');
        const existing = getApps();
        return existing.length ? existing[0] : initializeApp(firebaseConfig);
      } catch (err) {
        console.warn('Firebase app init skipped:', err?.message || err);
        return null;
      }
    })();
  }
  return appPromise;
};

/**
 * Lazily initialize (or reuse) Firestore with offline persistence.
 * Falls back to the default in-memory cache if persistent cache setup fails
 * (e.g. private browsing, unsupported storage).
 * @returns {Promise<import('firebase/firestore').Firestore|null>}
 */
export const getDb = () => {
  if (!dbPromise) {
    dbPromise = (async () => {
      try {
        const app = await getFirebaseApp();
        if (!app) return null;
        const {
          initializeFirestore,
          getFirestore,
          persistentLocalCache,
          persistentMultipleTabManager,
        } = await import('firebase/firestore');
        try {
          return initializeFirestore(app, {
            localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() }),
          });
        } catch {
          // Persistent cache unavailable (or Firestore already initialized) —
          // fall back to the default (memory-cached) instance.
          return getFirestore(app);
        }
      } catch (err) {
        console.warn('Firestore init skipped:', err?.message || err);
        return null;
      }
    })();
  }
  return dbPromise;
};

/**
 * Lazily sign in anonymously (idempotent — reuses an existing session).
 * @returns {Promise<string|null>} the uid, or null on any failure
 *   (e.g. Anonymous sign-in not enabled in the console, offline).
 */
export const ensureAnonymousAuth = () => {
  if (!authUidPromise) {
    authUidPromise = (async () => {
      try {
        const app = await getFirebaseApp();
        if (!app) return null;
        const { getAuth, signInAnonymously } = await import('firebase/auth');
        const auth = getAuth(app);
        if (auth.currentUser) return auth.currentUser.uid;
        const cred = await signInAnonymously(auth);
        return cred?.user?.uid || null;
      } catch (err) {
        console.warn('Anonymous auth skipped:', err?.message || err);
        // Allow a retry later (e.g. device comes back online).
        authUidPromise = null;
        return null;
      }
    })();
  }
  return authUidPromise;
};

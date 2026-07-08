import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Capacitor } from '@capacitor/core';
import { FirebaseCrashlytics } from '@capacitor-firebase/crashlytics';
import { FirebaseAnalytics } from '@capacitor-firebase/analytics';

/**
 * Firebase Analytics + Crashlytics bootstrap.
 *
 * Native-only, and every call is guarded: if `google-services.json` is not yet
 * present (Firebase not configured), the underlying calls reject and we simply
 * no-op — the app never crashes. Once the JSON is added and the app rebuilt,
 * these light up automatically. Remote push (FCM) is added separately.
 */

const isNative = Capacitor.isNativePlatform();

// Friendly screen names for the HashRouter paths.
const SCREEN_NAMES = {
  '/': 'Home',
  '/prevention': 'Prevention',
  '/research': 'Research',
  '/poster': 'PosterStudio',
  '/challenges': 'Challenges',
  '/emergency': 'EmergencyCard',
  '/facts': 'Facts',
};

export const useFirebase = () => {
  const location = useLocation();

  // One-time init: enable collection + record an app_open.
  useEffect(() => {
    if (!isNative) return;
    (async () => {
      try {
        await FirebaseCrashlytics.setEnabled({ enabled: true });
        await FirebaseAnalytics.setEnabled({ enabled: true });
        await FirebaseAnalytics.logEvent({ name: 'app_open' });
      } catch (err) {
        // Firebase not configured yet (no google-services.json) — safe no-op.
        console.warn('Firebase init skipped:', err?.message || err);
      }
    })();
  }, []);

  // Screen-view tracking on route change.
  useEffect(() => {
    if (!isNative) return;
    const path = location.pathname || '/';
    const screenName = SCREEN_NAMES[path] || path;
    (async () => {
      try {
        await FirebaseAnalytics.setCurrentScreen({ screenName, screenClassOverride: screenName });
        await FirebaseAnalytics.logEvent({ name: 'screen_view', params: { screen_name: screenName } });
      } catch {
        /* no-op until Firebase configured */
      }
    })();
  }, [location.pathname]);
};

export default useFirebase;

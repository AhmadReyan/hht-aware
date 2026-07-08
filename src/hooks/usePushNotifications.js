import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Capacitor } from '@capacitor/core';
import { FirebaseMessaging } from '@capacitor-firebase/messaging';

/**
 * FCM push notifications via @capacitor-firebase/messaging.
 *
 * Fully guarded: every native call is wrapped in try/catch, so if Firebase is
 * not configured (no google-services.json) or permission is denied, we simply
 * no-op — the app never crashes. This replaces the old @capacitor/push-notifications
 * hook, whose register() crashed natively when Firebase wasn't initialized.
 *
 * Tap-to-open: a notification may carry a `route` (or `link`) key in its data
 * payload, e.g. { "route": "/research" }. Tapping the notification navigates
 * there. If no route is given, we default to the Research page.
 */

const isNative = Capacitor.isNativePlatform();

// Map an incoming push payload to an in-app route.
const routeFromNotification = (notification) => {
  const data = notification?.data || {};
  const target = data.route || data.link || data.screen;
  if (typeof target === 'string' && target.startsWith('/')) return target;
  // Sensible default: new content usually means new research.
  return '/research';
};

export const usePushNotifications = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isNative) return;

    let listeners = [];

    (async () => {
      try {
        // Ask for permission (Android 13+ shows the system prompt; older just grants).
        let perm = await FirebaseMessaging.checkPermissions();
        if (perm.receive === 'prompt' || perm.receive === 'prompt-with-rationale') {
          perm = await FirebaseMessaging.requestPermissions();
        }
        if (perm.receive !== 'granted') {
          console.warn('Push permission not granted:', perm.receive);
          return;
        }

        // Fetch the device FCM token (useful for targeted sends later).
        try {
          const { token } = await FirebaseMessaging.getToken();
          console.log('FCM token:', token);
        } catch (e) {
          console.warn('getToken failed:', e?.message || e);
        }

        // Token refresh.
        listeners.push(
          await FirebaseMessaging.addListener('tokenReceived', (event) => {
            console.log('FCM token refreshed:', event?.token);
          })
        );

        // Foreground message (no system tray notification is shown by default).
        listeners.push(
          await FirebaseMessaging.addListener('notificationReceived', (event) => {
            console.log('Push received (foreground):', JSON.stringify(event?.notification || {}));
          })
        );

        // User tapped a notification -> deep-link into the app.
        listeners.push(
          await FirebaseMessaging.addListener('notificationActionPerformed', (event) => {
            const route = routeFromNotification(event?.notification);
            console.log('Push tapped -> navigating to', route);
            navigate(route);
          })
        );
      } catch (err) {
        // Firebase not configured / plugin unavailable — safe no-op.
        console.warn('Push init skipped:', err?.message || err);
      }
    })();

    return () => {
      // Best-effort cleanup.
      try {
        listeners.forEach((l) => l?.remove && l.remove());
      } catch {
        /* ignore */
      }
    };
  }, [navigate]);
};

export default usePushNotifications;

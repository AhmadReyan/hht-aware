import { useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { LocalNotifications } from '@capacitor/local-notifications';
import { useResearchFeed } from './useResearchFeed';

const WEEKLY_ID = 1001;

/**
 * Schedules ONE gentle weekly local notification ("This week's HHT research")
 * so non-technical users are periodically reminded — without a backend and
 * without a firehose. Native-only; on web it's a harmless no-op.
 * Re-runs on app open to keep the teaser fresh and avoid duplicate schedules.
 */
export const useResearchNotifications = () => {
  const { featured } = useResearchFeed();

  useEffect(() => {
    if (Capacitor.getPlatform() === 'web') return;

    let cancelled = false;

    const schedule = async () => {
      try {
        let perm = await LocalNotifications.checkPermissions();
        if (perm.display === 'prompt' || perm.display === 'prompt-with-rationale') {
          perm = await LocalNotifications.requestPermissions();
        }
        if (perm.display !== 'granted' || cancelled) return;

        // Clear any prior schedule so we never stack duplicates.
        await LocalNotifications.cancel({ notifications: [{ id: WEEKLY_ID }] });

        const teaser = featured?.title
          ? `${featured.title} — tap to read it in plain language.`
          : 'A fresh, easy-to-read HHT update is waiting for you.';

        await LocalNotifications.schedule({
          notifications: [
            {
              id: WEEKLY_ID,
              title: "This week's HHT research 🔬",
              body: teaser,
              schedule: {
                on: { weekday: 1, hour: 10, minute: 0 }, // Sunday 10:00, repeating
                repeats: true,
                allowWhileIdle: true,
              },
              smallIcon: 'ic_stat_icon_config_sample',
              extra: { route: '/research' },
            },
          ],
        });
      } catch (err) {
        // Non-fatal: in-app "Research of the Week" still delivers the content.
        console.warn('Weekly research notification not scheduled:', err);
      }
    };

    schedule();
    return () => {
      cancelled = true;
    };
  }, [featured]);
};

export default useResearchNotifications;

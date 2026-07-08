import { Capacitor } from '@capacitor/core';
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';

/**
 * useHaptics — tactile feedback wrapper.
 *
 * Every call is fire-and-forget and fully guarded: on web (or if the plugin is
 * unavailable) it silently no-ops, so UI code can call haptics freely without
 * platform checks or try/catch. This is the "addictive" tactile layer — pair a
 * light tap with every meaningful interaction, success with completions, etc.
 */

const isNative = Capacitor.isNativePlatform();

const safe = (fn) => {
  if (!isNative) return;
  try {
    const r = fn();
    if (r && typeof r.catch === 'function') r.catch(() => {});
  } catch {
    /* no-op */
  }
};

// Stable singleton API (no re-renders needed).
export const haptics = {
  /** Light tap — taps, selections, toggles, carousel detents. */
  tap: () => safe(() => Haptics.impact({ style: ImpactStyle.Light })),
  /** Medium impact — button presses, drag pickups. */
  impact: () => safe(() => Haptics.impact({ style: ImpactStyle.Medium })),
  /** Heavy impact — big confirmations, drops. */
  heavy: () => safe(() => Haptics.impact({ style: ImpactStyle.Heavy })),
  /** Success buzz — completing a task, level up, 100% ring. */
  success: () => safe(() => Haptics.notification({ type: NotificationType.Success })),
  /** Warning buzz — undo, remove, gentle nudge. */
  warning: () => safe(() => Haptics.notification({ type: NotificationType.Warning })),
  /** Error buzz — invalid action. */
  error: () => safe(() => Haptics.notification({ type: NotificationType.Error })),
  /** Selection tick — continuous selection changes (sliders, pickers). */
  selection: () => safe(() => Haptics.selectionChanged()),
};

export const useHaptics = () => haptics;

export default useHaptics;

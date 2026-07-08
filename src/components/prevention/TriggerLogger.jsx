import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import { HelpCircle, Check } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { triggerOptions } from '../../data/selfCare';
import { haptics } from '../../hooks/useHaptics';
import { spring } from '../../lib/motion';

/**
 * Compact "What set off a bleed today?" trigger logger. Tapping a chip calls
 * `logTrigger(key)` with a confirmation pulse; once enough data exists it
 * surfaces the user's personal top trigger from `getTriggerCounts()`.
 */
export const TriggerLogger = () => {
  const triggerLog = useAppStore((s) => s.triggerLog);
  const logTrigger = useAppStore((s) => s.logTrigger);
  const getTriggerCounts = useAppStore((s) => s.getTriggerCounts);

  const [confirmed, setConfirmed] = useState(null);

  useEffect(() => {
    if (!confirmed) return undefined;
    const t = setTimeout(() => setConfirmed(null), 1800);
    return () => clearTimeout(t);
  }, [confirmed]);

  const counts = getTriggerCounts();
  const topEntry = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
  const topTrigger = topEntry ? triggerOptions.find((t) => t.key === topEntry[0]) : null;
  const TopIcon = topTrigger ? LucideIcons[topTrigger.icon] || HelpCircle : null;

  const handleLog = (key, label) => {
    logTrigger(key);
    haptics.impact();
    setConfirmed(label);
  };

  return (
    <div className="flex flex-col gap-3 bg-app-surface/80 border border-app-border/40 rounded-custom-lg p-4 shadow-card">
      <div className="flex flex-col gap-0.5">
        <h3 className="font-serif text-base text-app-ink">What set off a bleed today?</h3>
        <p className="text-[11px] text-app-muted leading-relaxed">
          Tap what fits — it builds your own pattern over time.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {triggerOptions.map((opt) => {
          const Icon = LucideIcons[opt.icon] || HelpCircle;
          return (
            <motion.button
              key={opt.key}
              type="button"
              whileTap={{ scale: 0.94 }}
              transition={spring.snappy}
              onClick={() => handleLog(opt.key, opt.label)}
              className="flex items-center gap-1.5 px-3 py-2 min-h-[44px] rounded-custom-pill bg-app-surface2 border border-app-border/40 text-app-ink text-xs font-semibold select-none"
            >
              <Icon size={14} className="text-brand-red-mid" />
              {opt.label}
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence>
        {confirmed && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="flex items-center gap-1.5 text-[11px] text-brand-teal font-semibold"
          >
            <Check size={13} />
            Logged &quot;{confirmed}&quot; — thanks for tracking.
          </motion.div>
        )}
      </AnimatePresence>

      {topTrigger && (
        <div className="flex items-center gap-2 bg-app-surface2/60 border border-app-border/30 rounded-custom-sm px-3 py-2 mt-0.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-app-muted">Your top trigger</span>
          <span className="flex items-center gap-1 text-xs font-bold text-brand-red-mid ml-auto">
            {TopIcon && <TopIcon size={13} />}
            {topTrigger.label}
          </span>
        </div>
      )}

      {triggerLog.length === 0 && (
        <p className="text-[10.5px] text-app-muted italic">
          No triggers logged yet — patterns will show up here once you do.
        </p>
      )}
    </div>
  );
};
export default TriggerLogger;

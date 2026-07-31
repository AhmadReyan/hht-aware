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

  const todayStr = (() => {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  })();

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
    <div className="flex flex-col gap-3 bg-app-surface/90 border border-line rounded-custom-lg p-4 shadow-card">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-0.5">
          <h3 className="font-serif text-base font-bold text-app-ink">What set off a bleed today?</h3>
          <p className="text-[11px] text-app-muted leading-relaxed">
            Tap a trigger to log it — selected items stay highlighted.
          </p>
        </div>
        {triggerLog.filter(e => e.date === todayStr).length > 0 && (
          <span className="text-[10px] font-bold uppercase tracking-wider text-garnet bg-rose border border-garnet/20 px-2 py-0.5 rounded-custom-pill shrink-0">
            {triggerLog.filter(e => e.date === todayStr).length} Logged Today
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {triggerOptions.map((opt) => {
          const Icon = LucideIcons[opt.icon] || HelpCircle;
          const todayLogs = triggerLog.filter((entry) => entry.date === todayStr && entry.trigger === opt.key);
          const isSelected = todayLogs.length > 0;
          const countToday = todayLogs.length;

          return (
            <motion.button
              key={opt.key}
              type="button"
              whileTap={{ scale: 0.93 }}
              transition={spring.snappy}
              onClick={() => handleLog(opt.key, opt.label)}
              className={`
                flex items-center gap-1.5 px-3.5 py-2 min-h-[44px] rounded-custom-pill text-xs font-semibold select-none transition-all duration-200
                ${
                  isSelected
                    ? 'bg-garnet text-white border-2 border-garnet shadow-md shadow-garnet/25 ring-2 ring-garnet/20 scale-[1.02]'
                    : 'bg-app-surface2 border border-line text-app-ink hover:border-garnet/30'
                }
              `}
            >
              {isSelected ? (
                <Check size={14} className="text-gold stroke-[3]" />
              ) : (
                <Icon size={14} className="text-garnet shrink-0" />
              )}
              <span>{opt.label}</span>
              {countToday > 1 && (
                <span className="ml-1 px-1.5 py-0.2 text-[9.5px] font-extrabold rounded-full bg-white/20 text-white">
                  x{countToday}
                </span>
              )}
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
            className="flex items-center gap-1.5 text-[11px] text-brand-teal font-semibold bg-brand-teal/10 p-2 rounded-custom"
          >
            <Check size={13} className="text-brand-teal" />
            Logged &quot;{confirmed}&quot; — pattern updated!
          </motion.div>
        )}
      </AnimatePresence>

      {topTrigger && (
        <div className="flex items-center gap-2 bg-app-surface2 border border-line rounded-custom-sm px-3 py-2 mt-0.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-app-muted">Your top trigger</span>
          <span className="flex items-center gap-1 text-xs font-bold text-garnet ml-auto">
            {TopIcon && <TopIcon size={13} />}
            {topTrigger.label} ({counts[topTrigger.key] || 1}x)
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

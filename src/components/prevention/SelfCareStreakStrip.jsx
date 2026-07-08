import React from 'react';
import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { selfCareItemCount } from '../../data/selfCare';
import { spring, staggerContainer, staggerItem } from '../../lib/motion';

const DAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

/**
 * Reactive feedback strip — today's completion, the current self-care streak,
 * and a 7-day adherence sparkline. Sits right under the hero check-in so the
 * "you're building something" signal is immediate, calorie-app style.
 */
export const SelfCareStreakStrip = () => {
  // Subscribe to raw slices so streak/adherence recompute on every toggle.
  useAppStore((s) => s.selfCareToday);
  useAppStore((s) => s.selfCareHistory);
  const getSelfCareStreak = useAppStore((s) => s.getSelfCareStreak);
  const getAdherence = useAppStore((s) => s.getAdherence);

  const streak = getSelfCareStreak();
  const adherence = getAdherence(7, selfCareItemCount);
  const todayPct = adherence.length ? adherence[adherence.length - 1].pct : 0;

  return (
    <div className="flex flex-col gap-3 bg-app-surface/80 border border-app-border/40 rounded-custom-lg p-4 shadow-card">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <motion.span
            animate={streak > 0 ? { scale: [1, 1.12, 1] } : {}}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            className="flex items-center justify-center w-9 h-9 rounded-custom-sm bg-brand-orange/15 flex-shrink-0"
          >
            <Flame size={18} className="text-brand-orange" fill={streak > 0 ? 'currentColor' : 'none'} />
          </motion.span>
          <div className="flex flex-col leading-tight">
            <span className="font-serif text-lg text-app-ink">{streak}-day streak</span>
            <span className="text-[10.5px] text-app-muted">
              {streak > 0 ? 'Keep the rhythm going' : 'Log an item to start one'}
            </span>
          </div>
        </div>
        <div className="flex flex-col items-end leading-tight flex-shrink-0">
          <span className="font-serif text-lg text-app-ink">{todayPct}%</span>
          <span className="text-[10.5px] text-app-muted">today</span>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="text-[9.5px] font-bold uppercase tracking-wider text-app-muted">Last 7 days</span>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="flex items-end gap-1.5"
        >
          {adherence.map((day, i) => {
            const isToday = i === adherence.length - 1;
            const d = new Date(`${day.date}T00:00:00`);
            const label = DAY_LABELS[d.getDay()] ?? '';
            const barColor =
              day.pct === 100 ? 'bg-brand-teal' : day.pct > 0 ? 'bg-brand-orange' : 'bg-app-border/40';
            return (
              <motion.div
                key={day.date}
                variants={staggerItem}
                className="flex-1 flex flex-col items-center gap-1"
              >
                <div className="w-full h-9 rounded-custom-sm bg-app-surface2 overflow-hidden flex items-end">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${Math.max(day.pct, 6)}%` }}
                    transition={spring.soft}
                    className={`w-full rounded-custom-sm ${barColor} ${isToday ? 'ring-1 ring-app-ink/40' : ''}`}
                  />
                </div>
                <span className={`text-[9px] ${isToday ? 'text-app-ink font-bold' : 'text-app-muted'}`}>
                  {label}
                </span>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
};
export default SelfCareStreakStrip;

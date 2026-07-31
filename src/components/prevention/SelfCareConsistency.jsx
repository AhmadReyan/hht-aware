import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../../store/useAppStore';
import { Flame, Sparkles } from 'lucide-react';
import { haptics } from '../../hooks/useHaptics';

export const SelfCareConsistency = () => {
  const history = useAppStore(s => s.selfCareHistory);
  const [activeDay, setActiveDay] = useState(null);

  // Local "YYYY-MM-DD" — matches how the store writes selfCareHistory dates
  const toLocalDateStr = (d) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  // Last 21 days for a compact 3-week view
  const last21Days = Array.from({ length: 21 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (20 - i));
    const dateStr = toLocalDateStr(d);
    const entry = history.find(h => h.date === dateStr);
    const count = entry ? entry.done.length : 0;
    
    // Formatting date label (e.g. "Jul 30")
    const formattedDate = d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

    return {
      date: dateStr,
      formattedDate,
      count,
      isToday: i === 20,
      dayName: d.toLocaleDateString(undefined, { weekday: 'narrow' }),
    };
  });

  const activeDaysCount = last21Days.filter(d => d.count > 0).length;
  const consistencyPercent = Math.round((activeDaysCount / 21) * 100);

  const getBarStyle = (count) => {
    if (count === 0) return 'bg-app-border/40';
    if (count <= 2) return 'bg-brand-teal/50 shadow-sm';
    if (count <= 4) return 'bg-gradient-to-t from-brand-teal/80 to-brand-teal shadow-sm';
    return 'bg-gradient-to-t from-garnet to-brand-teal shadow-glow';
  };

  return (
    <div className="flex flex-col gap-3 bg-app-surface border border-line rounded-custom-lg p-5 shadow-card relative overflow-hidden">
      {/* Background glow accent */}
      <div className="absolute -top-10 -right-10 w-28 h-28 bg-brand-teal/10 rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex justify-between items-center z-10">
        <div className="flex items-center gap-1.5">
          <Sparkles size={14} className="text-garnet animate-pulse" />
          <span className="text-[11px] font-bold uppercase tracking-wider text-app-muted">
            3-Week Consistency
          </span>
        </div>
        <div className="flex items-center gap-1.5 bg-brand-teal/10 px-2.5 py-1 rounded-custom-pill border border-brand-teal/20">
          <Flame size={12} className="text-brand-teal" />
          <span className="text-[10.5px] font-extrabold text-brand-teal">
            {consistencyPercent}% Active
          </span>
        </div>
      </div>

      {/* Interactive Tooltip Callout */}
      <div className="min-h-[22px] z-10 flex items-center justify-center">
        <AnimatePresence mode="wait">
          {activeDay ? (
            <motion.div
              key={activeDay.date}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="text-xs font-bold text-app-ink bg-app-surface2 border border-line px-3 py-1 rounded-custom-pill flex items-center gap-2 shadow-sm"
            >
              <span className="text-garnet">{activeDay.formattedDate} ({activeDay.isToday ? 'Today' : activeDay.dayName}):</span>
              <span>{activeDay.count > 0 ? `${activeDay.count} routines completed ✨` : 'Rest day'}</span>
            </motion.div>
          ) : (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-[10.5px] text-app-muted font-medium"
            >
              Tap any bar to inspect daily self-care habit progress
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Animated Bars */}
      <div className="flex gap-1.5 justify-between h-14 items-end pt-2 z-10">
        {last21Days.map((day, i) => {
          const targetHeight = day.count === 0 ? 10 : Math.min(10 + day.count * 8, 48);
          const isSelected = activeDay?.date === day.date;

          return (
            <div
              key={day.date}
              onClick={() => {
                haptics.tap();
                setActiveDay(isSelected ? null : day);
              }}
              className="flex flex-col gap-1 items-center flex-1 cursor-pointer group"
            >
              <motion.div
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{
                  type: 'spring',
                  stiffness: 260,
                  damping: 20,
                  delay: i * 0.025,
                }}
                style={{
                  height: targetHeight,
                  transformOrigin: 'bottom',
                }}
                className={`
                  w-full rounded-custom-xs transition-all duration-200 relative
                  ${getBarStyle(day.count)}
                  ${day.isToday ? 'ring-2 ring-garnet ring-offset-2 ring-offset-app-surface' : ''}
                  ${isSelected ? 'scale-110 brightness-125' : 'group-hover:brightness-110'}
                `}
              >
                {day.isToday && (
                  <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-garnet animate-ping" />
                )}
              </motion.div>
              <span className={`text-[8.5px] font-bold ${day.isToday ? 'text-garnet font-extrabold' : 'text-app-muted'}`}>
                {day.dayName}
              </span>
            </div>
          );
        })}
      </div>

      <p className="text-[10.5px] text-app-muted text-center mt-0.5 italic z-10">
        Consistent daily nasal moisturizing lowers nosebleed frequency by up to 50%.
      </p>
    </div>
  );
};

export default SelfCareConsistency;

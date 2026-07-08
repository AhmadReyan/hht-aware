import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import { Circle, Check, PartyPopper } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { selfCareItems, selfCareItemCount } from '../../data/selfCare';
import { haptics } from '../../hooks/useHaptics';
import { spring } from '../../lib/motion';
import { Confetti } from '../challenges/Confetti';

// Per-item accent styling, keyed by `selfCareItems[i].accent` from data/selfCare.js.
const ACCENT = {
  teal: {
    text: 'text-brand-teal',
    iconWrap: 'bg-brand-teal/15 text-brand-teal',
    bgActive: 'bg-brand-teal/12',
    borderActive: 'border-brand-teal/45',
  },
  orange: {
    text: 'text-brand-orange',
    iconWrap: 'bg-brand-orange/15 text-brand-orange',
    bgActive: 'bg-brand-orange/12',
    borderActive: 'border-brand-orange/45',
  },
  red: {
    text: 'text-brand-red-light',
    iconWrap: 'bg-brand-red/15 text-brand-red-light',
    bgActive: 'bg-brand-red/12',
    borderActive: 'border-brand-red/45',
  },
};

/**
 * "Today's Self-Care" hero check-in — the #1 element on Prevention. Renders
 * every `selfCareItems` entry as a big tappable row, backed 1:1 by
 * `toggleSelfCare(key)`. A radial ring shows completion at a glance; hitting
 * every item fires a haptic + confetti celebration moment.
 */
export const SelfCareChecklist = () => {
  // Subscribe to the raw slice (not just the getter) so toggles re-render this.
  useAppStore((s) => s.selfCareToday);
  const toggleSelfCare = useAppStore((s) => s.toggleSelfCare);
  const getTodaySelfCare = useAppStore((s) => s.getTodaySelfCare);

  const doneKeys = getTodaySelfCare();
  const total = selfCareItemCount;
  const doneCount = doneKeys.length;
  const pct = total > 0 ? Math.round((doneCount / total) * 100) : 0;
  const allDone = total > 0 && doneCount === total;

  const [celebrate, setCelebrate] = useState(0);
  const prevAllDone = useRef(allDone);

  useEffect(() => {
    if (allDone && !prevAllDone.current) {
      haptics.success();
      setCelebrate((c) => c + 1);
    }
    prevAllDone.current = allDone;
  }, [allDone]);

  const handleToggle = (key) => {
    const wasDone = doneKeys.includes(key);
    toggleSelfCare(key);
    if (wasDone) {
      haptics.selection();
    } else {
      haptics.tap();
    }
  };

  // Ring geometry
  const size = 72;
  const strokeWidth = 8;
  const r = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * r;
  const dashOffset = circumference - circumference * (pct / 100);

  return (
    <div className="relative flex flex-col gap-4 surface-glass backdrop-blur-glass rounded-custom-xl p-5 shadow-raised overflow-hidden">
      <Confetti trigger={celebrate} count={36} />
      <div className="absolute inset-0 bg-glass-sheen pointer-events-none" />

      <div className="relative flex items-center gap-4">
        <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            <g transform={`rotate(-90 ${size / 2} ${size / 2})`}>
              <circle
                cx={size / 2}
                cy={size / 2}
                r={r}
                fill="none"
                stroke="var(--border)"
                strokeWidth={strokeWidth}
                opacity={0.35}
              />
              <motion.circle
                cx={size / 2}
                cy={size / 2}
                r={r}
                fill="none"
                stroke={allDone ? 'var(--teal)' : 'var(--red-mid)'}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeDasharray={circumference}
                initial={false}
                animate={{ strokeDashoffset: dashOffset }}
                transition={spring.soft}
              />
            </g>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-serif text-lg text-app-ink leading-none">
              {doneCount}
              <span className="text-app-muted text-xs align-top">/{total}</span>
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-0.5 flex-1 min-w-0">
          <h2 className="font-serif text-xl text-app-ink leading-snug">Today&apos;s Self-Care</h2>
          <AnimatePresence mode="wait">
            <motion.p
              key={allDone ? 'done' : 'progress'}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.18 }}
              className={`text-xs font-semibold ${allDone ? 'text-brand-teal' : 'text-app-muted'}`}
            >
              {allDone ? 'All done — nicely taken care of.' : `${doneCount} of ${total} logged today`}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>

      <div className="relative flex flex-col gap-2.5">
        {selfCareItems.map((item) => {
          const Icon = LucideIcons[item.icon] || Circle;
          const isDone = doneKeys.includes(item.key);
          const accent = ACCENT[item.accent] || ACCENT.teal;
          return (
            <motion.button
              key={item.key}
              type="button"
              onClick={() => handleToggle(item.key)}
              whileTap={{ scale: 0.97 }}
              transition={spring.snappy}
              aria-pressed={isDone}
              className={`flex items-center gap-3 w-full text-left px-3.5 py-3 rounded-custom-lg border transition-colors min-h-[44px]
                ${isDone ? `${accent.bgActive} ${accent.borderActive}` : 'bg-app-surface/80 border-app-border/40'}
              `}
            >
              <span
                className={`flex items-center justify-center w-10 h-10 rounded-custom-sm flex-shrink-0 ${accent.iconWrap}`}
              >
                <Icon size={19} />
              </span>
              <span className="flex-1 flex flex-col gap-0.5 min-w-0">
                <span className="text-sm font-bold leading-snug text-app-ink">{item.label}</span>
                <span className="text-[11px] text-app-muted leading-snug">{item.hint}</span>
              </span>
              <motion.span
                initial={false}
                animate={{ scale: isDone ? 1 : 0.85 }}
                transition={spring.bouncy}
                className={`flex items-center justify-center w-7 h-7 rounded-full flex-shrink-0 border-2
                  ${isDone ? `${accent.text} border-current` : 'border-app-border'}
                `}
              >
                {isDone && <Check size={15} className={accent.text} strokeWidth={3} />}
              </motion.span>
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence>
        {allDone && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={spring.bouncy}
            className="relative flex items-center gap-2 justify-center bg-brand-teal/12 border border-brand-teal/30 rounded-custom-pill py-2 px-4"
          >
            <PartyPopper size={16} className="text-brand-teal" />
            <span className="text-xs font-bold text-brand-teal">Every item logged — great care today!</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
export default SelfCareChecklist;

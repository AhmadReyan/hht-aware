import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { spring } from '../../lib/motion';
import { haptics } from '../../hooks/useHaptics';

/**
 * LevelBar — hero XP/Level header.
 * Springs its fill toward the next level and pops a "+N XP" chip every time
 * XP increases, with a matching impact haptic. Pure presentation — the
 * full-screen level-up celebration lives in LevelUpCelebration.jsx and is
 * orchestrated by the page (which owns the "did we cross a level" logic).
 */
export const LevelBar = ({ levelInfo }) => {
  const { level, title, xp, pointsToNext, progressPct } = levelInfo;

  const prevXpRef = useRef(xp);
  const [gain, setGain] = useState(null);

  useEffect(() => {
    const diff = xp - prevXpRef.current;
    if (diff > 0) {
      haptics.impact();
      setGain(diff);
      const timer = setTimeout(() => setGain(null), 1000);
      prevXpRef.current = xp;
      return () => clearTimeout(timer);
    }
    prevXpRef.current = xp;
    return undefined;
  }, [xp]);

  return (
    <div className="relative overflow-hidden rounded-custom-lg border border-app-glass bg-aurora p-4 flex flex-col gap-3 shadow-card">
      {/* decorative aurora glow */}
      <div className="pointer-events-none absolute -top-10 -right-8 w-32 h-32 rounded-full bg-brand-teal/20 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-10 -left-6 w-28 h-28 rounded-full bg-brand-red/10 blur-2xl" />

      <div className="relative z-10 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <motion.div
            animate={{
              boxShadow: [
                '0 0 0px rgba(42,168,139,0.35)',
                '0 0 16px rgba(42,168,139,0.55)',
                '0 0 0px rgba(42,168,139,0.35)'
              ]
            }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
            className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-app-surface2 border border-brand-teal/40 font-serif font-bold text-lg text-app-ink"
          >
            {level}
          </motion.div>
          <div className="flex flex-col min-w-0">
            <span className="font-serif text-base font-bold text-app-ink truncate flex items-center gap-1.5">
              <Sparkles size={13} className="text-brand-teal flex-shrink-0" />
              {title}
            </span>
            <span className="text-[10.5px] text-app-soft">{xp} XP total</span>
          </div>
        </div>

        <div className="relative flex-shrink-0">
          <AnimatePresence>
            {gain && (
              <motion.span
                initial={{ opacity: 0, y: 4, scale: 0.7 }}
                animate={{ opacity: 1, y: -8, scale: 1 }}
                exit={{ opacity: 0, y: -20 }}
                transition={spring.bouncy}
                className="absolute -top-1 right-0 whitespace-nowrap text-xs font-extrabold text-brand-teal"
              >
                +{gain} XP
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Animated XP bar */}
      <div className="relative z-10 h-3.5 w-full rounded-custom-pill bg-app-surface2/80 border border-app-glass overflow-hidden">
        <motion.div
          initial={false}
          animate={{ width: `${Math.max(progressPct, 3)}%` }}
          transition={spring.gentle}
          className="relative h-full bg-teal-flow rounded-custom-pill overflow-hidden"
        >
          <div className="absolute inset-0 bg-glass-sheen opacity-60 bg-[length:200%_100%] animate-shimmer" />
        </motion.div>
      </div>

      <span className="relative z-10 text-[10.5px] text-app-muted">
        {pointsToNext > 0 ? `${pointsToNext} XP to Level ${level + 1}` : 'Max level reached — Legend status!'}
      </span>
    </div>
  );
};
export default LevelBar;

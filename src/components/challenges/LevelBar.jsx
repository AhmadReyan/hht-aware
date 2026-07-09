import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { Vessels } from '../ui/Vessels';
import { spring } from '../../lib/motion';
import { haptics } from '../../hooks/useHaptics';

/**
 * LevelBar — warm-editorial XP/Level header.
 * A light porcelain card with a gold "achievement" level medallion, a teal
 * progress fill on a light track, and a gold "+N XP" pop every time XP rises
 * (with a matching impact haptic). Pure presentation — the full-screen level-up
 * celebration lives in LevelUpCelebration.jsx and is orchestrated by the page.
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
    <div className="relative overflow-hidden rounded-custom-lg border border-line bg-app-surface p-4 flex flex-col gap-3 shadow-card">
      {/* faint aurora + capillary motif */}
      <div className="pointer-events-none absolute inset-0 bg-aurora opacity-80" />
      <Vessels color="var(--garnet)" opacity={0.08} />

      <div className="relative z-10 flex items-center justify-between gap-2">
        <div className="flex items-center gap-3 min-w-0">
          <motion.div
            animate={{
              boxShadow: [
                '0 0 0px rgba(217,161,59,0.30)',
                '0 0 18px rgba(217,161,59,0.55)',
                '0 0 0px rgba(217,161,59,0.30)'
              ]
            }}
            transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
            className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-gold-flow border border-white/40 font-serif font-extrabold text-lg text-white shadow-card"
          >
            {level}
          </motion.div>
          <div className="flex flex-col min-w-0">
            <span className="font-serif text-base font-bold text-app-ink truncate flex items-center gap-1.5">
              <Sparkles size={13} className="text-gold flex-shrink-0" />
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
                className="absolute -top-1 right-0 whitespace-nowrap text-xs font-extrabold text-gold"
              >
                +{gain} XP
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Animated XP bar — teal progress on a light porcelain track */}
      <div className="relative z-10 h-3.5 w-full rounded-custom-pill bg-app-surface2 border border-line overflow-hidden">
        <motion.div
          initial={false}
          animate={{ width: `${Math.max(progressPct, 3)}%` }}
          transition={spring.gentle}
          className="relative h-full bg-teal-flow rounded-custom-pill overflow-hidden"
        >
          <div className="absolute inset-0 bg-glass-sheen opacity-50 bg-[length:200%_100%] animate-shimmer" />
        </motion.div>
      </div>

      <span className="relative z-10 text-[10.5px] text-app-muted">
        {pointsToNext > 0 ? `${pointsToNext} XP to Level ${level + 1}` : 'Max level reached — Legend status!'}
      </span>
    </div>
  );
};
export default LevelBar;

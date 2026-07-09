import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame } from 'lucide-react';
import { Vessels } from '../ui/Vessels';
import { spring } from '../../lib/motion';
import { haptics } from '../../hooks/useHaptics';

// Escalating visual/behavioral tiers so the flame visibly grows with the streak.
const tierFor = (streak) => {
  if (streak >= 30) return { scale: 1.35, glow: true, label: 'Blazing! 🔥🔥🔥' };
  if (streak >= 14) return { scale: 1.22, glow: true, label: 'On fire!' };
  if (streak >= 7) return { scale: 1.12, glow: true, label: 'Heating up' };
  if (streak >= 3) return { scale: 1.05, glow: false, label: 'Building momentum' };
  if (streak >= 1) return { scale: 1, glow: false, label: 'Just started' };
  return { scale: 0.9, glow: false, label: 'Start your streak today' };
};

export const StreakWidget = ({ currentStreak = 0, longestStreak = 0 }) => {
  const isActive = currentStreak > 0;
  const tier = tierFor(currentStreak);

  const prevStreakRef = useRef(currentStreak);
  const [grew, setGrew] = useState(false);

  useEffect(() => {
    if (currentStreak > prevStreakRef.current) {
      haptics.impact();
      setGrew(true);
      const timer = setTimeout(() => setGrew(false), 1000);
      prevStreakRef.current = currentStreak;
      return () => clearTimeout(timer);
    }
    prevStreakRef.current = currentStreak;
    return undefined;
  }, [currentStreak]);

  return (
    <div
      className={`
        relative overflow-hidden flex items-center gap-3.5 rounded-custom-lg border p-4 w-full
        ${isActive
          ? 'bg-ember border-deep/30 shadow-card text-white'
          : 'bg-app-surface2 border-line text-app-ink'
        }
      `}
    >
      {isActive && <Vessels color="#fff" opacity={0.16} />}

      <motion.div
        animate={{
          scale: tier.glow ? [tier.scale, tier.scale * 1.12, tier.scale] : tier.scale,
          rotate: tier.glow ? [-4, 4, -4] : 0
        }}
        transition={{ duration: 1.6, repeat: tier.glow ? Infinity : 0, ease: 'easeInOut' }}
        className={`
          relative z-10 flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full
          ${isActive ? 'bg-gold-flow border border-white/30' : 'bg-app-glass border border-line'}
          ${tier.glow ? 'shadow-glow' : ''}
        `}
      >
        <Flame
          size={24}
          className={isActive ? 'text-white fill-white/40' : 'text-app-muted'}
        />
      </motion.div>

      <div className="relative z-10 flex flex-col min-w-0 flex-1">
        <span className={`font-serif text-2xl font-bold leading-tight flex items-baseline gap-2 flex-wrap ${isActive ? 'text-white' : 'text-app-ink'}`}>
          <span className="flex items-baseline gap-1.5">
            {currentStreak}
            <span className={`text-xs font-sans font-bold uppercase ${isActive ? 'text-white/70' : 'text-app-muted'}`}>
              day{currentStreak === 1 ? '' : 's'}
            </span>
          </span>
          <AnimatePresence>
            {grew && (
              <motion.span
                initial={{ opacity: 0, y: 4, scale: 0.7 }}
                animate={{ opacity: 1, y: -4, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={spring.bouncy}
                className="text-xs font-extrabold text-gold"
              >
                +1 🔥
              </motion.span>
            )}
          </AnimatePresence>
        </span>
        <span className={`text-[10.5px] truncate ${isActive ? 'text-white/85' : 'text-app-soft'}`}>
          {isActive ? tier.label : 'Start your streak today'}
          {longestStreak > 0 && (
            <span className={isActive ? 'text-white/65' : 'text-app-muted'}> · Best {longestStreak}</span>
          )}
        </span>
      </div>
    </div>
  );
};
export default StreakWidget;

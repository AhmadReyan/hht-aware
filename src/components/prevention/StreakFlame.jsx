import React from 'react';
import { motion } from 'framer-motion';
import { Flame, Sparkles } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { spring } from '../../lib/motion';

export const StreakFlame = () => {
  const streak = useAppStore((s) => (s.getSelfCareStreak ? s.getSelfCareStreak() : 0));

  const isHot = streak >= 3;
  const isLegend = streak >= 7;

  return (
    <div className="relative overflow-hidden rounded-custom-lg bg-app-surface border border-line p-4 shadow-card flex items-center justify-between">
      <div className="flex items-center gap-3">
        {/* Animated Flame Container */}
        <motion.div
          animate={{ scale: isHot ? [1, 1.1, 1] : 1 }}
          transition={spring.bouncy}
          className={`w-12 h-12 rounded-full flex items-center justify-center relative shadow-sm ${
            isLegend
              ? 'bg-amber-500 text-white'
              : isHot
                ? 'bg-garnet text-white'
                : 'bg-app-surface2 text-app-muted'
          }`}
        >
          <Flame size={24} className={isHot ? 'fill-current animate-pulse' : ''} />
          {isLegend && (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
              className="absolute -top-1 -right-1 text-gold"
            >
              <Sparkles size={14} />
            </motion.div>
          )}
        </motion.div>

        {/* Text info */}
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="font-serif text-lg font-extrabold text-app-ink">
              {streak} Day{streak !== 1 ? 's' : ''} Streak
            </span>
            {isLegend && (
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 bg-amber-500/10 px-2 py-0.5 rounded-custom-pill border border-amber-500/20">
                On Fire!
              </span>
            )}
          </div>
          <p className="text-xs text-app-soft font-medium">
            {streak === 0
              ? 'Check off self-care habits daily to start your streak'
              : streak < 3
                ? 'Great start! 3 days unlocks a consistency milestone'
                : 'Shield consistency helps prevent nosebleeds!'}
          </p>
        </div>
      </div>
    </div>
  );
};

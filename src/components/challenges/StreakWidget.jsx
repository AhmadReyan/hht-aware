import React from 'react';
import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';

export const StreakWidget = ({ currentStreak = 0, longestStreak = 0 }) => {
  const isActive = currentStreak > 0;
  const isHot = currentStreak >= 3;

  return (
    <div
      className={`
        flex items-center gap-3 rounded-custom border p-3.5 flex-1 min-w-0
        ${isActive
          ? 'bg-gradient-to-br from-brand-orange/15 to-brand-red/10 border-brand-orange/25'
          : 'bg-app-dark2 border-app-border/10'
        }
      `}
    >
      <motion.div
        animate={isHot ? { scale: [1, 1.15, 1] } : {}}
        transition={{ duration: 1.4, repeat: isHot ? Infinity : 0, ease: 'easeInOut' }}
        className={`flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full ${isActive ? 'bg-brand-orange/20' : 'bg-app-border/10'}`}
      >
        <Flame
          size={20}
          className={isActive ? 'text-brand-orange fill-brand-orange/30' : 'text-app-muted'}
        />
      </motion.div>

      <div className="flex flex-col min-w-0">
        <span className="font-serif text-xl font-bold text-white leading-tight">
          {currentStreak} <span className="text-xs font-sans font-bold text-app-muted uppercase">day{currentStreak === 1 ? '' : 's'}</span>
        </span>
        <span className="text-[10px] text-app-muted truncate">
          {isActive ? 'Current streak' : 'Start your streak today'}
          {longestStreak > 0 && <span className="text-app-muted/70"> · Best {longestStreak}</span>}
        </span>
      </div>
    </div>
  );
};
export default StreakWidget;

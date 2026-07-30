import React from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '../../store/useAppStore';
import { ProgressRing } from '../ui/ProgressRing';
import { staggerContainer, staggerItem } from '../../lib/motion';

const StatTile = ({ label, value, sub, children }) => (
  <motion.div
    variants={staggerItem}
    className="flex flex-col items-center gap-1.5 flex-1 min-w-0"
  >
    <div className="relative">
      {children}
    </div>
    <div className="flex flex-col items-center text-center">
      <span className="text-[10px] font-bold uppercase tracking-widest text-app-muted leading-none">{label}</span>
      <span className="text-xs font-bold text-ink mt-0.5">{value}{sub && <span className="text-[10px] ml-0.5 opacity-50">{sub}</span>}</span>
    </div>
  </motion.div>
);

export const MomentumStrip = () => {
  // Subscribe to raw state (primitives / stable refs) and the getter
  // *functions* — never call a getter inside the selector, or zustand
  // returns a new object every render and React infinite-loops (blank screen).
  const currentStreak = useAppStore(s => s.currentStreak);
  const dailyStats = useAppStore(s => s.dailyStats);
  const getLevelInfo = useAppStore(s => s.getLevelInfo);
  const getAdherence = useAppStore(s => s.getAdherence);

  const levelInfo = getLevelInfo();
  const perfectDays = dailyStats.perfectDaysCount;

  // getAdherence returns [{ date, count, pct }] — average the last 7 days to a %.
  const adherenceDays = getAdherence();
  const adherence = adherenceDays.length
    ? Math.round(adherenceDays.reduce((sum, d) => sum + d.pct, 0) / adherenceDays.length)
    : 0;

  return (
    <motion.section
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      className="flex justify-between items-start bg-surface-2 border border-line rounded-custom-lg p-4 py-5 shadow-sm"
    >
      <StatTile label="Streak" value={currentStreak} sub="days">
        <div className="w-10 h-10 rounded-full bg-rose flex items-center justify-center text-lg shadow-sm border border-garnet/10">
          🔥
        </div>
      </StatTile>

      <StatTile label="Level" value={levelInfo.level}>
        <ProgressRing progress={levelInfo.progressPct} size={40} strokeWidth={4} color="var(--garnet)">
          <span className="text-[10px] font-bold text-garnet">{levelInfo.level}</span>
        </ProgressRing>
      </StatTile>

      <StatTile label="Care" value={adherence} sub="%">
        <ProgressRing progress={adherence} size={40} strokeWidth={4} color="var(--teal)">
          <span className="text-[10px] font-bold text-teal">{adherence}%</span>
        </ProgressRing>
      </StatTile>

      <StatTile label="Perfect" value={perfectDays}>
        <div className="w-10 h-10 rounded-full bg-teal-soft flex items-center justify-center text-lg shadow-sm border border-teal/10">
          🏅
        </div>
      </StatTile>
    </motion.section>
  );
};

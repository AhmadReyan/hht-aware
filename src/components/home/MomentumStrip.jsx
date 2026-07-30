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
  const currentStreak = useAppStore(s => s.currentStreak);
  const levelInfo = useAppStore(s => s.getLevelInfo());
  const adherence = useAppStore(s => s.getAdherence());
  const perfectDays = useAppStore(s => s.dailyStats.perfectDaysCount);

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
        <ProgressRing progress={levelInfo.progress} size={40} strokeWidth={4} color="var(--garnet)">
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

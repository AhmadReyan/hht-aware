import React from 'react';
import { motion } from 'framer-motion';
import { ProgressBar } from '../ui/ProgressBar';
import { Badge } from '../ui/Badge';
import { Trophy } from 'lucide-react';

export const ProgressTracker = ({ completedCount = 0, totalCount = 10, points = 0 }) => {
  const isComplete = completedCount >= totalCount;

  const getSubtitle = () => {
    if (completedCount === 0) {
      return "Complete challenges to earn your HHT Ambassador badge 🎖️";
    }
    if (completedCount >= 1 && completedCount <= 2) {
      return "Great start! Keep spreading awareness 🌟";
    }
    if (completedCount >= 3 && completedCount <= 5) {
      return "You're making a real difference! 💪";
    }
    if (completedCount >= 6 && completedCount <= 8) {
      return "Almost an HHT Ambassador — just a few more! 🔥";
    }
    return "🎉 You're an HHT Ambassador! Thank you for your advocacy!";
  };

  return (
    <div className={`relative overflow-hidden rounded-custom-lg p-5 shadow-card flex flex-col gap-4 font-sans text-app-ink border ${isComplete ? 'bg-gold/10 border-gold' : 'bg-app-surface border-line'}`}>
      {isComplete && (
        <div className="pointer-events-none absolute inset-0 bg-glass-sheen opacity-40 bg-[length:200%_100%] animate-shimmer" />
      )}

      {/* Header Info */}
      <div className="relative z-10 flex justify-between items-center">
        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] font-bold text-app-muted uppercase tracking-wider">Advocacy Tracker</span>
          <h3 className="font-serif text-xl font-bold flex items-center gap-2 text-app-ink">
            <motion.span
              animate={isComplete ? { rotate: [0, -10, 10, 0] } : {}}
              transition={{ duration: 1.8, repeat: isComplete ? Infinity : 0, repeatDelay: 1 }}
            >
              <Trophy className="text-gold" size={20} />
            </motion.span>
            <span>Your Progress</span>
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="teal" size="md" className="font-extrabold text-[11px]">
            {completedCount}/{totalCount} Done
          </Badge>
          <Badge variant="red" size="md" className="font-extrabold text-[11px]">
            {points} Pts
          </Badge>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative z-10">
        <ProgressBar value={completedCount} max={totalCount} />
      </div>

      {/* Subtitle Message */}
      <p className="relative z-10 text-xs text-app-soft leading-relaxed bg-app-surface2 px-3.5 py-2.5 rounded-custom border border-line">
        {getSubtitle()}
      </p>
    </div>
  );
};
export default ProgressTracker;

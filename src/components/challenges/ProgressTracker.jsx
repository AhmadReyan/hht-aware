import React from 'react';
import { ProgressBar } from '../ui/ProgressBar';
import { Badge } from '../ui/Badge';
import { Trophy } from 'lucide-react';

export const ProgressTracker = ({ completedCount = 0, totalCount = 10, points = 0 }) => {
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
    <div className="bg-app-dark border border-app-border/10 rounded-custom p-5 shadow-md flex flex-col gap-4 font-sans text-white">
      {/* Header Info */}
      <div className="flex justify-between items-center">
        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] font-bold text-app-muted uppercase tracking-wider">Advocacy Tracker</span>
          <h3 className="font-serif text-xl font-bold flex items-center gap-2">
            <Trophy className="text-brand-orange" size={20} />
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
      <ProgressBar value={completedCount} max={totalCount} />

      {/* Subtitle Message */}
      <p className="text-xs text-app-border leading-relaxed bg-app-dark2/50 px-3.5 py-2.5 rounded-custom border border-app-border/5">
        {getSubtitle()}
      </p>
    </div>
  );
};
export default ProgressTracker;

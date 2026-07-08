import React from 'react';
import { ProgressBar } from '../ui/ProgressBar';
import { Badge } from '../ui/Badge';
import { Sparkles } from 'lucide-react';

export const LevelBar = ({ levelInfo }) => {
  const { level, title, xpIntoLevel, xpForNext, pointsToNext, xp } = levelInfo;

  return (
    <div className="flex-1 min-w-0 bg-app-dark2 border border-app-border/10 rounded-custom p-3.5 flex flex-col gap-2">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 min-w-0">
          <Sparkles size={15} className="text-brand-teal flex-shrink-0" />
          <span className="font-serif text-sm font-bold text-white truncate">
            Lv. {level} · {title}
          </span>
        </div>
        <Badge variant="teal" size="sm" className="flex-shrink-0">{xp} XP</Badge>
      </div>

      <ProgressBar value={xpIntoLevel} max={xpForNext} />

      <span className="text-[10px] text-app-muted">
        {pointsToNext > 0 ? `${pointsToNext} XP to next level` : 'Max level reached!'}
      </span>
    </div>
  );
};
export default LevelBar;

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle } from 'lucide-react';
import { Badge } from '../ui/Badge';

export const DailyChallengeCard = ({ task, isDone, onToggle }) => {
  const { icon, title, desc, xp, tag } = task;

  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      onClick={() => onToggle(task.id)}
      className={`
        relative overflow-hidden border rounded-custom p-3.5 flex gap-3 items-start cursor-pointer transition-all select-none
        ${isDone
          ? 'bg-brand-teal/10 border-brand-teal/30 text-white'
          : 'bg-app-dark2 border-app-border/10 text-white hover:border-app-border/20'
        }
      `}
    >
      <div className="mt-0.5 flex-shrink-0">
        {isDone ? (
          <CheckCircle2 className="text-brand-teal fill-brand-teal/20" size={18} />
        ) : (
          <Circle className="text-app-muted" size={18} />
        )}
      </div>

      <div className="flex-1 flex flex-col gap-0.5 min-w-0">
        <div className="flex justify-between items-start gap-2">
          <h4 className={`font-sans font-bold text-xs leading-snug ${isDone ? 'text-brand-teal' : 'text-white'}`}>
            <span className="mr-1">{icon}</span>
            {title}
          </h4>
          <Badge variant={isDone ? 'teal' : 'dark'} size="sm" className="flex-shrink-0 font-extrabold">
            +{xp} XP
          </Badge>
        </div>
        <p className="text-[10.5px] text-app-muted leading-relaxed">{desc}</p>
        <Badge variant="default" size="sm" className="text-[8.5px] w-fit mt-1">{tag}</Badge>
      </div>
    </motion.div>
  );
};
export default DailyChallengeCard;

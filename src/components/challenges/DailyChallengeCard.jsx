import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Circle } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Confetti } from './Confetti';
import { spring } from '../../lib/motion';
import { haptics } from '../../hooks/useHaptics';

export const DailyChallengeCard = ({ task, isDone, onToggle }) => {
  const { icon, title, desc, xp, tag } = task;

  const wasDoneRef = useRef(isDone);
  const [burst, setBurst] = useState(null);

  // Fire a confetti burst + success haptic exactly once per genuine
  // false -> true completion transition (not on every render/re-mount).
  useEffect(() => {
    if (isDone && !wasDoneRef.current) {
      setBurst(Date.now());
      haptics.success();
    }
    wasDoneRef.current = isDone;
  }, [isDone]);

  const handleTap = () => {
    if (!isDone) haptics.tap();
    onToggle(task.id);
  };

  return (
    <motion.div
      layout
      whileTap={{ scale: 0.97 }}
      transition={spring.snappy}
      onClick={handleTap}
      className={`
        relative overflow-visible border rounded-custom p-3.5 flex gap-3 items-start cursor-pointer select-none
        ${isDone
          ? 'bg-brand-teal/10 border-brand-teal/30 text-white'
          : 'bg-app-surface2 border-app-glass text-white hover:border-brand-teal/20'
        }
      `}
    >
      <Confetti trigger={burst} count={16} />

      <div className="mt-0.5 flex-shrink-0">
        <AnimatePresence mode="wait" initial={false}>
          {isDone ? (
            <motion.div
              key="done"
              initial={{ scale: 0.4, rotate: -30, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              transition={spring.bouncy}
            >
              <CheckCircle2 className="text-brand-teal fill-brand-teal/20" size={18} />
            </motion.div>
          ) : (
            <motion.div
              key="undone"
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={spring.soft}
            >
              <Circle className="text-app-muted" size={18} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex-1 flex flex-col gap-0.5 min-w-0">
        <div className="flex justify-between items-start gap-2">
          <h4 className={`font-sans font-bold text-xs leading-snug ${isDone ? 'text-brand-teal' : 'text-app-ink'}`}>
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

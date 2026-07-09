import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Circle, ArrowRight, Lock } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { useNavigate } from 'react-router-dom';
import { Confetti } from './Confetti';
import { spring } from '../../lib/motion';
import { haptics } from '../../hooks/useHaptics';

export const ChallengeCard = ({
  challenge,
  isDone,
  isUnlocked,
  onToggle,
  onShowLockedWarning
}) => {
  const navigate = useNavigate();
  const { id, icon, title, desc, pts, tag, link } = challenge;
  const locked = id === 10 && !isUnlocked;

  const wasDoneRef = useRef(isDone);
  const [burst, setBurst] = useState(null);

  // Confetti + a little celebration only on the actual completion moment.
  useEffect(() => {
    if (isDone && !wasDoneRef.current) {
      setBurst(Date.now());
    }
    wasDoneRef.current = isDone;
  }, [isDone]);

  const handleCardClick = () => {
    if (locked) {
      haptics.warning();
      onShowLockedWarning();
      return;
    }
    haptics.tap();
    onToggle(id);
  };

  const handleLinkClick = (e) => {
    e.stopPropagation();
    haptics.tap();
    if (link) {
      if (link.startsWith('http')) {
        window.open(link, '_blank', 'noopener,noreferrer');
      } else {
        navigate(link);
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 6 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      variants={cardVariants}
      whileTap={{ scale: locked ? 1 : 0.98 }}
      onClick={handleCardClick}
      className={`
        relative overflow-visible border rounded-custom p-4 flex gap-3.5 items-start cursor-pointer transition-all select-none text-app-ink
        ${isDone
          ? 'bg-gold/10 border-gold shadow-card'
          : locked
            ? 'bg-app-surface2/60 border-line opacity-60 cursor-not-allowed'
            : 'bg-app-surface border-line hover:border-brand-teal/30'
        }
      `}
    >
      <Confetti trigger={burst} count={20} />

      {/* Check Icon */}
      <div className="mt-0.5 flex-shrink-0">
        <AnimatePresence mode="wait" initial={false}>
          {locked ? (
            <motion.div key="lock" initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
              <Lock className="text-app-muted" size={18} />
            </motion.div>
          ) : isDone ? (
            <motion.div
              key="done"
              initial={{ scale: 0.4, rotate: -30, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              transition={spring.bouncy}
            >
              <CheckCircle2 className="text-gold fill-gold/20" size={20} />
            </motion.div>
          ) : (
            <motion.div key="undone" initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={spring.soft}>
              <Circle className="text-brand-teal/60" size={20} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Info */}
      <div className="flex-1 flex flex-col gap-1 pr-1 min-w-0">
        <div className="flex justify-between items-start gap-2">
          <h3 className={`font-sans font-bold text-sm leading-snug ${isDone ? 'text-garnet' : 'text-app-ink'}`}>
            <span className="mr-1.5">{icon}</span>
            {title}
          </h3>
          <Badge variant={isDone ? 'orange' : 'red'} size="sm" className="flex-shrink-0 font-extrabold">
            +{pts} Pts
          </Badge>
        </div>

        <p className="text-[11px] text-app-muted leading-relaxed">
          {desc}
        </p>

        {/* Dynamic Badge / Action Link */}
        <div className="flex justify-between items-center mt-2.5">
          <Badge variant={isDone ? 'orange' : 'default'} size="sm" className="text-[9px]">
            {tag}
          </Badge>

          {isDone ? (
            <span className="text-[10px] font-extrabold text-gold flex items-center gap-0.5">
              Done ✓
            </span>
          ) : locked ? (
            <span className="text-[10px] font-bold text-app-muted flex items-center gap-0.5">
              Locked
            </span>
          ) : link ? (
            <button
              onClick={handleLinkClick}
              className="text-[10px] text-brand-teal font-bold flex items-center gap-0.5 hover:underline cursor-pointer select-none"
            >
              <span>Go to task</span>
              <ArrowRight size={10} />
            </button>
          ) : (
            <span className="text-[10px] font-bold text-brand-teal flex items-center gap-0.5">
              Tap <ArrowRight size={10} />
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};
export default ChallengeCard;

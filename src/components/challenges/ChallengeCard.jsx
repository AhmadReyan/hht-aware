import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle, ArrowRight } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { useNavigate } from 'react-router-dom';

export const ChallengeCard = ({
  challenge,
  isDone,
  isUnlocked,
  onToggle,
  onShowLockedWarning
}) => {
  const navigate = useNavigate();
  const { id, icon, title, desc, pts, tag, link } = challenge;

  const handleCardClick = () => {
    if (id === 10 && !isUnlocked) {
      onShowLockedWarning();
      return;
    }
    onToggle(id);
  };

  const handleLinkClick = (e) => {
    e.stopPropagation();
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
      whileTap={{ scale: 0.98 }}
      onClick={handleCardClick}
      className={`
        relative overflow-hidden border rounded-custom p-4 flex gap-3.5 items-start cursor-pointer transition-all select-none
        ${isDone
          ? 'bg-brand-red/10 border-brand-red-mid/30 text-white shadow-sm'
          : id === 10 && !isUnlocked
            ? 'bg-app-dark2/40 border-app-border/5 opacity-55 cursor-not-allowed text-app-muted'
            : 'bg-app-dark2 border-app-border/10 text-white hover:border-app-border/20'
        }
      `}
    >
      {/* Check Icon */}
      <div className="mt-0.5 flex-shrink-0">
        {isDone ? (
          <CheckCircle2 className="text-brand-red-mid fill-brand-red-mid/20" size={20} />
        ) : (
          <Circle className="text-app-muted" size={20} />
        )}
      </div>

      {/* Info */}
      <div className="flex-1 flex flex-col gap-1 pr-1">
        <div className="flex justify-between items-start gap-2">
          <h3 className={`font-sans font-bold text-sm leading-snug ${isDone ? 'text-brand-red-light' : 'text-white'}`}>
            <span className="mr-1.5">{icon}</span>
            {title}
          </h3>
          <Badge variant={isDone ? 'red' : 'dark'} size="sm" className="flex-shrink-0 font-extrabold">
            +{pts} Pts
          </Badge>
        </div>
        
        <p className="text-[11px] text-app-muted leading-relaxed">
          {desc}
        </p>

        {/* Dynamic Badge / Action Link */}
        <div className="flex justify-between items-center mt-2.5">
          <Badge variant={isDone ? 'red' : 'default'} size="sm" className="text-[9px]">
            {tag}
          </Badge>
          
          {link && !isDone && (id !== 10 || isUnlocked) && (
            <button
              onClick={handleLinkClick}
              className="text-[10px] text-brand-teal font-bold flex items-center gap-0.5 hover:underline cursor-pointer select-none"
            >
              <span>Go to task</span>
              <ArrowRight size={10} />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};
export default ChallengeCard;

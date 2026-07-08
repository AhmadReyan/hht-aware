import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';
import { haptics } from '../../hooks/useHaptics';
import { BadgeDetailModal } from './BadgeDetailModal';

const listContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } }
};

const badgeVariants = {
  hidden: { opacity: 0, y: 6 },
  show: { opacity: 1, y: 0 }
};

export const BadgeGrid = ({ badges }) => {
  const [selected, setSelected] = useState(null);

  const handleSelect = (badge) => {
    haptics.tap();
    setSelected(badge);
  };

  return (
    <>
      <motion.div
        className="grid grid-cols-3 gap-2.5"
        variants={listContainer}
        initial="hidden"
        animate="show"
      >
        {badges.map((badge) => (
          <motion.div
            key={badge.id}
            variants={badgeVariants}
            whileTap={{ scale: 0.94 }}
            onClick={() => handleSelect(badge)}
            className={`
              relative flex flex-col items-center justify-center gap-1 rounded-custom border p-3 text-center aspect-square cursor-pointer select-none
              ${badge.unlocked
                ? 'bg-gradient-to-b from-brand-red/15 to-brand-orange/10 border-brand-red/25 shadow-card'
                : 'bg-app-surface2 border-app-glass opacity-60'
              }
            `}
          >
            {!badge.unlocked && (
              <div className="absolute top-1.5 right-1.5 text-app-muted">
                <Lock size={11} />
              </div>
            )}
            <span className={`text-2xl leading-none ${badge.unlocked ? '' : 'grayscale opacity-50'}`}>
              {badge.icon}
            </span>
            <span className={`text-[9.5px] font-bold leading-tight ${badge.unlocked ? 'text-app-ink' : 'text-app-muted'}`}>
              {badge.title}
            </span>
          </motion.div>
        ))}
      </motion.div>

      <BadgeDetailModal badge={selected} onClose={() => setSelected(null)} />
    </>
  );
};
export default BadgeGrid;

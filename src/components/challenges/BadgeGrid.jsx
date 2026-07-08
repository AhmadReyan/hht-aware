import React from 'react';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';

export const BadgeGrid = ({ badges }) => {
  return (
    <div className="grid grid-cols-3 gap-2.5">
      {badges.map((badge) => (
        <motion.div
          key={badge.id}
          whileTap={{ scale: 0.96 }}
          className={`
            relative flex flex-col items-center justify-center gap-1 rounded-custom border p-3 text-center aspect-square
            ${badge.unlocked
              ? 'bg-gradient-to-b from-brand-red/15 to-brand-orange/10 border-brand-red/25'
              : 'bg-app-dark2 border-app-border/10 opacity-60'
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
          <span className={`text-[9.5px] font-bold leading-tight ${badge.unlocked ? 'text-white' : 'text-app-muted'}`}>
            {badge.title}
          </span>
        </motion.div>
      ))}
    </div>
  );
};
export default BadgeGrid;

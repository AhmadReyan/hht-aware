import React from 'react';
import { motion } from 'framer-motion';

export const ProgressBar = ({
  value = 0, // 0 to 100 or current progress (e.g. 3)
  max = 100, // 100 or max progress (e.g. 10)
  className = ''
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div className={`w-full bg-app-dark2 rounded-custom-pill h-3.5 overflow-hidden border border-app-border/5 p-0.5 ${className}`}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ type: 'spring', damping: 20, stiffness: 80 }}
        className="h-full bg-gradient-to-r from-brand-red to-brand-red-mid rounded-custom-pill shadow-inner"
      />
    </div>
  );
};
export default ProgressBar;

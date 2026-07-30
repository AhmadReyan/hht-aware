import React from 'react';
import { motion } from 'framer-motion';
import { staggerContainer, staggerItem } from '../../lib/motion';

export const QuickRoutine = ({ items }) => {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      className="flex flex-col gap-3"
    >
      {items.map((item, idx) => (
        <motion.div
          key={idx}
          variants={staggerItem}
          className="flex gap-4 group"
        >
          <div className="flex flex-col items-center">
            <div className="w-2.5 h-2.5 rounded-full bg-garnet group-first:ring-4 group-first:ring-rose transition-all" />
            <div className="w-0.5 flex-1 bg-line group-last:hidden" />
          </div>
          <div className="pb-5">
            <span className="text-[10px] font-bold uppercase tracking-widest text-garnet">
              {item.time}
            </span>
            <div className="flex flex-col gap-1.5 mt-1">
              {item.items.slice(0, 2).map((text, i) => (
                <p key={i} className="text-xs text-ink-soft leading-relaxed max-w-[280px]">
                  • {text}
                </p>
              ))}
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

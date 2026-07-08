import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Confetti } from './Confetti';

export const BadgeUnlockModal = ({ badge, onClose }) => {
  return (
    <AnimatePresence>
      {badge && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
          />

          <motion.div
            initial={{ scale: 0.7, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.85, opacity: 0 }}
            transition={{ type: 'spring', damping: 16, stiffness: 260 }}
            className="relative w-full max-w-xs bg-app-dark2 border border-brand-orange/30 rounded-custom p-6 flex flex-col items-center text-center gap-3 shadow-xl z-10"
          >
            <Confetti trigger={badge.id} />

            <span className="text-[10px] font-bold uppercase tracking-widest text-brand-orange">
              Achievement Unlocked
            </span>

            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.15, type: 'spring', damping: 10, stiffness: 200 }}
              className="text-5xl"
            >
              {badge.icon}
            </motion.span>

            <h3 className="font-serif text-xl font-bold text-white leading-tight">
              {badge.title}
            </h3>
            <p className="text-xs text-app-muted leading-relaxed">{badge.desc}</p>

            <button
              onClick={onClose}
              className="mt-2 w-full bg-brand-red hover:brightness-110 text-white text-sm font-bold py-2.5 rounded-custom-sm active:scale-95 transition-all"
            >
              Awesome!
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
export default BadgeUnlockModal;

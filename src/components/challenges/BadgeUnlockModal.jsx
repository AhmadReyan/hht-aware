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
            className="relative w-full max-w-xs bg-app-surface border border-gold rounded-custom-lg p-6 flex flex-col items-center text-center gap-3 shadow-raised z-10 overflow-hidden"
          >
            <div className="pointer-events-none absolute inset-x-0 -top-10 h-24 bg-gold-flow opacity-15 blur-2xl" />
            <Confetti trigger={badge.id} />

            <span className="relative z-10 text-[10px] font-bold uppercase tracking-widest text-gold">
              Achievement Unlocked
            </span>

            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.15, type: 'spring', damping: 10, stiffness: 200 }}
              className="relative z-10 flex items-center justify-center w-20 h-20 rounded-full bg-gold-flow text-4xl shadow-glow"
            >
              {badge.icon}
            </motion.span>

            <h3 className="relative z-10 font-serif text-xl font-bold text-app-ink leading-tight">
              {badge.title}
            </h3>
            <p className="relative z-10 text-xs text-app-soft leading-relaxed">{badge.desc}</p>

            <button
              onClick={onClose}
              className="relative z-10 mt-2 w-full bg-garnet hover:brightness-110 text-white text-sm font-bold py-2.5 rounded-custom-sm active:scale-95 transition-all"
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

import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Lock, Sparkles } from 'lucide-react';
import { spring } from '../../lib/motion';

/**
 * BadgeDetailModal — tap-to-inspect sheet for any badge in the shelf
 * (locked or unlocked). Flips into view; unlocked badges get a shine sweep,
 * locked ones stay dimmed and show their unlock condition as a teaser.
 * This is distinct from BadgeUnlockModal, which only fires once on a fresh
 * unlock celebration.
 */
export const BadgeDetailModal = ({ badge, onClose }) => {
  return (
    <AnimatePresence>
      {badge && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-md"
          />

          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.85, opacity: 0, y: 10 }}
            transition={spring.bouncy}
            className={`
              relative w-full max-w-xs rounded-custom-lg p-6 flex flex-col items-center text-center gap-3.5
              shadow-2xl z-10 border overflow-hidden bg-app-surface
              ${badge.unlocked ? 'border-gold shadow-gold/10' : 'border-line'}
            `}
          >
            {badge.unlocked && (
              <motion.div
                initial={{ x: '-130%' }}
                animate={{ x: '130%' }}
                transition={{ duration: 1.2, ease: 'easeInOut', delay: 0.2 }}
                className="absolute inset-y-0 w-1/3 bg-glass-sheen opacity-60 -skew-x-12 pointer-events-none"
              />
            )}

            <span className="text-[10px] font-bold uppercase tracking-widest text-app-muted flex items-center gap-1.5">
              {badge.unlocked ? (
                <>
                  <Sparkles size={12} className="text-gold animate-pulse" />
                  <span className="text-gold font-extrabold">Unlocked Badge</span>
                </>
              ) : (
                <>
                  <Lock size={12} className="text-app-muted" />
                  Locked Achievement
                </>
              )}
            </span>

            <motion.span
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', damping: 12, stiffness: 220 }}
              className={`flex items-center justify-center w-20 h-20 rounded-full text-4xl leading-none shadow-md ${
                badge.unlocked ? 'bg-gold-flow shadow-glow ring-4 ring-gold/20' : 'bg-app-surface2 border border-line grayscale opacity-60'
              }`}
            >
              {badge.icon}
            </motion.span>

            <h3 className="font-serif text-xl font-extrabold text-app-ink leading-tight">{badge.title}</h3>

            <p className="text-xs text-app-soft leading-relaxed px-1">
              {badge.unlocked ? badge.desc : `How to unlock: ${badge.desc}`}
            </p>

            <button
              onClick={onClose}
              type="button"
              className={`
                mt-2 w-full text-xs font-bold py-3 rounded-custom-pill shadow-sm active:scale-95 transition-all
                ${badge.unlocked ? 'bg-garnet text-white hover:brightness-110' : 'bg-app-surface2 text-app-ink border border-line hover:bg-app-surface'}
              `}
            >
              {badge.unlocked ? 'Awesome!' : 'Got it'}
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
export default BadgeDetailModal;

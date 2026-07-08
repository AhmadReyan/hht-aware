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
        <div className="fixed inset-0 z-[55] flex items-center justify-center px-6" style={{ perspective: 900 }}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/65 backdrop-blur-sm"
          />

          <motion.div
            initial={{ rotateY: -90, opacity: 0, scale: 0.9 }}
            animate={{ rotateY: 0, opacity: 1, scale: 1 }}
            exit={{ rotateY: 90, opacity: 0, scale: 0.9 }}
            transition={spring.bouncy}
            className={`
              relative w-full max-w-xs rounded-custom-lg p-6 flex flex-col items-center text-center gap-3
              shadow-xl z-10 border overflow-hidden bg-app-surface2
              ${badge.unlocked ? 'border-brand-teal/30' : 'border-app-glass'}
            `}
          >
            {badge.unlocked && (
              <motion.div
                initial={{ x: '-130%' }}
                animate={{ x: '130%' }}
                transition={{ duration: 1.1, ease: 'easeInOut', delay: 0.25 }}
                className="absolute inset-y-0 w-1/3 bg-glass-sheen opacity-50 -skew-x-12 pointer-events-none"
              />
            )}

            <span className="text-[10px] font-bold uppercase tracking-widest text-app-muted flex items-center gap-1.5">
              {badge.unlocked ? (
                <>
                  <Sparkles size={11} className="text-brand-teal" />
                  <span className="text-brand-teal">Unlocked</span>
                </>
              ) : (
                <>
                  <Lock size={11} />
                  Locked
                </>
              )}
            </span>

            <span className={`text-5xl leading-none ${badge.unlocked ? '' : 'grayscale opacity-50'}`}>
              {badge.icon}
            </span>

            <h3 className="font-serif text-xl font-bold text-app-ink leading-tight">{badge.title}</h3>

            <p className="text-xs text-app-soft leading-relaxed">
              {badge.unlocked ? badge.desc : `How to unlock: ${badge.desc}`}
            </p>

            <button
              onClick={onClose}
              className={`
                mt-2 w-full text-sm font-bold py-2.5 rounded-custom-sm active:scale-95 transition-all
                ${badge.unlocked ? 'bg-brand-teal text-white' : 'bg-app-glass text-app-ink border border-app-glass'}
              `}
            >
              {badge.unlocked ? 'Nice!' : 'Got it'}
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
export default BadgeDetailModal;

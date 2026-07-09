import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { Confetti } from './Confetti';
import { spring, popIn } from '../../lib/motion';

/**
 * LevelUpCelebration — full-screen overlay shown only on an actual level
 * change (never on mount / re-render). The page detects the level crossing
 * and passes a `levelInfo` snapshot in; passing null hides the overlay.
 */
export const LevelUpCelebration = ({ levelInfo, onClose }) => {
  return (
    <AnimatePresence>
      {levelInfo && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center px-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/75 backdrop-blur-md"
          />

          <div className="relative z-10 flex flex-col items-center w-full max-w-xs">
            <Confetti trigger={`lvl-${levelInfo.level}`} count={44} />

            <motion.div
              initial={popIn.initial}
              animate={popIn.animate}
              exit={{ scale: 0.7, opacity: 0 }}
              transition={spring.bouncy}
              className="flex flex-col items-center gap-2.5 text-center"
            >
              <motion.div
                animate={{ scale: [1, 1.08, 1] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
                className="w-28 h-28 rounded-full bg-gold-flow border-4 border-white/40 flex items-center justify-center shadow-glow"
              >
                <span className="font-serif text-5xl font-bold text-white">{levelInfo.level}</span>
              </motion.div>

              <span className="text-xs font-bold uppercase tracking-[0.3em] text-gold flex items-center gap-1.5">
                <Sparkles size={13} />
                Level Up
                <Sparkles size={13} />
              </span>

              <h2 className="font-serif text-2xl font-bold text-white">{levelInfo.title}</h2>

              <p className="text-xs text-white/80 leading-relaxed max-w-[230px]">
                You&apos;ve reached Level {levelInfo.level}. Keep spreading awareness — your advocacy is making a real difference!
              </p>

              <button
                onClick={onClose}
                className="mt-2 px-9 py-2.5 rounded-custom-pill bg-garnet text-white text-sm font-bold active:scale-95 transition-all shadow-card"
              >
                Let&apos;s go!
              </button>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
export default LevelUpCelebration;

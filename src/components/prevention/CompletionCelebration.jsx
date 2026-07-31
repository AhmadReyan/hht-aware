import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Trophy } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { selfCareItems } from '../../data/selfCare';
import { haptics } from '../../hooks/useHaptics';
import { spring } from '../../lib/motion';

export const CompletionCelebration = () => {
  const selfCareToday = useAppStore((s) => s.selfCareToday);
  const doneKeys = selfCareToday?.done || [];
  const total = selfCareItems.length;
  const isComplete = doneKeys.length >= total && total > 0;

  useEffect(() => {
    if (isComplete) {
      haptics.success();
    }
  }, [isComplete]);

  return (
    <AnimatePresence>
      {isComplete && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 10 }}
          transition={spring.bouncy}
          className="relative overflow-hidden rounded-custom-lg bg-gradient-to-r from-amber-500/15 via-garnet/10 to-teal-500/15 border border-gold/40 p-4 text-center shadow-card flex flex-col items-center"
        >
          <div className="flex items-center gap-2 mb-1">
            <Trophy size={20} className="text-gold animate-bounce" />
            <span className="font-serif text-lg font-extrabold text-app-ink">
              100% Protection Shield Active!
            </span>
            <Sparkles size={18} className="text-gold animate-pulse" />
          </div>
          <p className="text-xs text-app-soft font-medium leading-relaxed max-w-sm">
            Awesome job! You&apos;ve completed all 5 daily habits to protect your nasal lining and preserve your iron.
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { selfCareItems } from '../../data/selfCare';
import { spring } from '../../lib/motion';

/**
 * Gentle nudge card — appears only while some items are still unlogged today.
 * Non-nagging, calorie-app-style prompt naming the next easiest item.
 */
export const SelfCareNudge = () => {
  useAppStore((s) => s.selfCareToday);
  const getTodaySelfCare = useAppStore((s) => s.getTodaySelfCare);

  const doneKeys = getTodaySelfCare();
  const remaining = selfCareItems.filter((it) => !doneKeys.includes(it.key));

  return (
    <AnimatePresence>
      {remaining.length > 0 && (
        <motion.div
          key="nudge"
          initial={{ opacity: 0, y: 8, height: 0 }}
          animate={{ opacity: 1, y: 0, height: 'auto' }}
          exit={{ opacity: 0, y: -8, height: 0 }}
          transition={spring.soft}
          className="overflow-hidden"
        >
          <div className="flex items-center gap-3 bg-brand-orange/10 border border-brand-orange/25 rounded-custom-lg px-4 py-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-orange/20 flex-shrink-0">
              <Sparkles size={15} className="text-brand-orange" />
            </span>
            <p className="text-xs text-app-ink leading-snug flex-1">
              {remaining.length === 1 ? (
                <>
                  Just <span className="font-bold">{remaining[0].label.toLowerCase()}</span> left to complete
                  today&apos;s care.
                </>
              ) : (
                <>
                  <span className="font-bold">{remaining.length} more</span> to complete today&apos;s care —{' '}
                  {remaining[0].label.toLowerCase()} is a good next step.
                </>
              )}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
export default SelfCareNudge;

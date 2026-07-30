import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Sparkles } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { UpgradeSheet } from './UpgradeSheet';
import { haptics } from '../../hooks/useHaptics';
import { spring } from '../../lib/motion';

/**
 * PremiumGate — wrap any premium-only UI.
 *   <PremiumGate feature="Doctor Report"><ExportButton/></PremiumGate>
 *
 * If premium is active it renders `children`. Otherwise it renders a compact
 * locked state (or a custom `fallback`) that opens the UpgradeSheet on tap.
 *
 * Props:
 *   - children:  the gated content (shown when premium is on)
 *   - feature:   short name of the locked feature (shown in the upsell copy)
 *   - fallback:  optional custom locked node. Receives an `onUpgrade` callback
 *                if it's a function: fallback({ onUpgrade }). If it's a node,
 *                it's rendered as-is (you wire your own onClick to open the sheet).
 */
export const PremiumGate = ({ children, feature = 'this feature', fallback }) => {
  const isPremium = useAppStore((s) => s.premiumEnabled);
  const [sheetOpen, setSheetOpen] = useState(false);

  const openSheet = () => {
    haptics.tap();
    setSheetOpen(true);
  };

  if (isPremium) return <>{children}</>;

  let locked;
  if (typeof fallback === 'function') {
    locked = fallback({ onUpgrade: openSheet });
  } else if (fallback) {
    locked = fallback;
  } else {
    locked = (
      <motion.button
        type="button"
        onClick={openSheet}
        whileTap={{ scale: 0.98 }}
        transition={spring.snappy}
        className="w-full flex items-center gap-3 p-4 rounded-custom-sm border border-dashed border-garnet/40 bg-app-surface2 text-left"
      >
        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-garnet shrink-0 shadow-card">
          <Lock size={18} />
        </div>
        <div className="flex-1">
          <div className="font-sans font-bold text-sm text-app-ink flex items-center gap-1.5">
            {feature}
            <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest text-garnet">
              <Sparkles size={10} /> Premium
            </span>
          </div>
          <p className="text-[12px] text-app-muted leading-tight">Tap to unlock with HHT Premium.</p>
        </div>
      </motion.button>
    );
  }

  return (
    <>
      {locked}
      <UpgradeSheet isOpen={sheetOpen} onClose={() => setSheetOpen(false)} />
    </>
  );
};

export default PremiumGate;

import React, { useState } from 'react';
import { FileText, History, CloudSun, Sparkles, Check, ShieldCheck } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useAppStore } from '../../store/useAppStore';
import { haptics } from '../../hooks/useHaptics';

/**
 * UpgradeSheet — the monetization surface (design-system bottom sheet).
 *
 * IMPORTANT (per project monetization rule): this does NOT integrate a real
 * payment SDK and never fakes a purchase. The "Upgrade" CTA reveals a clearly
 * labeled PREVIEW toggle that flips the local `premiumEnabled` flag so the
 * owner can demo premium. A real billing provider plugs in where noted below:
 *   - Android: Google Play Billing via a Capacitor plugin.
 *   - PWA / web: RevenueCat or Stripe Checkout.
 * Keep `handleUnlock` swappable — it is the single integration point.
 */

const PREMIUM_FEATURES = [
  { icon: FileText, title: 'Doctor Report PDF', desc: 'Export a clinical summary of episodes, labs & iron for your specialist.' },
  { icon: History, title: 'Full history', desc: 'See every episode and lab beyond the last 30 days.' },
  { icon: CloudSun, title: '7-day NoseCast', desc: 'Full week of dry-air bleed-risk forecasting, not just today.' }
];

export const UpgradeSheet = ({ isOpen, onClose }) => {
  const setPremium = useAppStore((s) => s.setPremium);
  // Subscribe to the flag directly so the sheet re-renders when it flips.
  const isPremium = useAppStore((s) => s.premiumEnabled);

  const [showPreview, setShowPreview] = useState(false);

  // --- Integration point: replace this with a real purchase flow. ---
  // e.g. Google Play Billing (Capacitor) or RevenueCat/Stripe for the PWA.
  // On a verified purchase, call setPremium(true).
  const handleUnlock = () => {
    haptics.success();
    setPremium(true);
  };

  const handleReset = () => {
    haptics.tap();
    setPremium(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Unlock HHT Premium" type="bottom-sheet">
      <div className="flex flex-col gap-5">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-custom-sm bg-ember flex items-center justify-center text-white shadow-glow">
            <Sparkles size={22} />
          </div>
          <p className="text-sm text-app-soft leading-snug">
            Support the project and get clinician-ready tools. The free tier stays fully usable.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {PREMIUM_FEATURES.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex items-start gap-3 p-3 rounded-custom-sm bg-app-surface2 border border-line">
              <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-garnet shrink-0 shadow-card">
                <Icon size={18} />
              </div>
              <div>
                <h4 className="font-sans font-bold text-sm text-app-ink">{title}</h4>
                <p className="text-[12px] text-app-muted leading-tight">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        {isPremium ? (
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-center gap-2 p-3 rounded-custom-sm bg-teal-soft text-brand-teal font-bold text-sm">
              <Check size={18} /> Premium is active
            </div>
            <button
              onClick={handleReset}
              className="text-[11px] text-app-muted underline underline-offset-2 self-center"
            >
              Turn off preview
            </button>
          </div>
        ) : !showPreview ? (
          <Button variant="primary" size="lg" icon={Sparkles} onClick={() => { haptics.tap(); setShowPreview(true); }}>
            Upgrade
          </Button>
        ) : (
          <div className="flex flex-col gap-3 p-4 rounded-custom-sm border border-dashed border-garnet/40 bg-app-surface2">
            <div className="flex items-center gap-2 text-garnet">
              <ShieldCheck size={16} />
              <span className="text-[11px] font-bold uppercase tracking-widest">Preview mode</span>
            </div>
            <p className="text-[12px] text-app-muted leading-snug">
              Billing isn&apos;t wired up yet. This preview toggle unlocks every premium feature locally
              so you can try them. A real store purchase replaces this later.
            </p>
            <Button variant="primary" size="lg" icon={Check} onClick={handleUnlock}>
              Enable premium (preview)
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default UpgradeSheet;

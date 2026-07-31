import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, AlertOctagon, CloudUpload } from 'lucide-react';
import { Vessels } from '../ui/Vessels';
import { HHTLogo } from '../ui/HHTLogo';
import { haptics } from '../../hooks/useHaptics';
import { useAppStore } from '../../store/useAppStore';

/**
 * AboutModal — a warm-editorial bottom-sheet explaining HHT.
 *
 * Rendered as a self-contained light sheet (white surface, warm ink, garnet
 * accents) so it reads correctly on the porcelain theme. Props unchanged:
 * isOpen, onClose.
 */

const Pill = ({ children }) => (
  <span className="inline-flex items-center rounded-custom-pill bg-rose text-garnet border border-line px-2.5 py-1 text-[10px] font-sans font-bold uppercase tracking-wider">
    {children}
  </span>
);

// Friendly "Last synced …" label from an ISO timestamp (guarded).
const formatSyncedAt = (iso) => {
  try {
    return new Date(iso).toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  } catch {
    return '';
  }
};

// Compact opt-in toggle for the anonymous progress backup (Firestore).
const CloudBackupToggle = () => {
  const enabled = useAppStore((s) => s.cloudSyncEnabled);
  const status = useAppStore((s) => s.cloudSyncStatus);
  const lastAt = useAppStore((s) => s.cloudSyncLastAt);
  const enableCloudSync = useAppStore((s) => s.enableCloudSync);
  const disableCloudSync = useAppStore((s) => s.disableCloudSync);

  const handleToggle = () => {
    if (enabled) {
      haptics.tap();
      disableCloudSync();
    } else {
      haptics.success();
      enableCloudSync();
    }
  };

  let hint = 'Off — your data stays on this device.';
  if (enabled) {
    if (status === 'syncing') hint = 'Syncing…';
    else if (status === 'error') hint = 'Couldn’t sync — will retry next time you open the app.';
    else if (lastAt) hint = `Last synced ${formatSyncedAt(lastAt)}.`;
    else hint = 'Waiting for first sync…';
  }

  return (
    <section className="bg-app-surface2 p-4 rounded-custom border border-line flex flex-col gap-2">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <CloudUpload size={16} className="text-brand-teal flex-shrink-0" />
          <h3 className="font-serif font-bold text-base text-garnet">Cloud backup</h3>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={enabled}
          aria-label="Toggle cloud backup"
          onClick={handleToggle}
          className={`relative h-6 w-11 flex-shrink-0 rounded-full border transition-colors ${
            enabled ? 'bg-brand-teal border-brand-teal' : 'bg-app-surface border-line'
          }`}
        >
          <span
            className={`absolute top-0.5 h-[18px] w-[18px] rounded-full bg-white shadow-card transition-all ${
              enabled ? 'left-[22px]' : 'left-0.5'
            }`}
          />
        </button>
      </div>
      <p className="text-xs text-app-muted">
        Backs up your progress anonymously — never your emergency card.
      </p>
      <p className="text-[10px] text-app-muted">{hint}</p>
    </section>
  );
};

const criteria = [
  { n: 1, t: 'Nosebleeds', d: 'Spontaneous, recurrent epistaxis (nosebleeds), which worsen with age.' },
  { n: 2, t: 'Telangiectasias', d: 'Multiple dilated capillaries at characteristic sites: lips, oral cavity, fingers, and nose.' },
  { n: 3, t: 'Visceral AVMs', d: 'Internal arteriovenous malformations in organs (lungs, liver, brain, spine, GI tract).' },
  { n: 4, t: 'Family History', d: 'A first-degree relative (parent, sibling, child) diagnosed with HHT.' },
];

export const AboutModal = ({ isOpen, onClose }) => {
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose?.(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  const close = () => { haptics.tap(); onClose?.(); };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="fixed inset-0 bg-deep/40 backdrop-blur-sm"
          />

          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0, transition: { type: 'spring', damping: 26, stiffness: 260 } }}
            exit={{ y: '100%', transition: { ease: 'easeIn', duration: 0.2 } }}
            className="relative w-full max-w-md bg-app-surface text-app-ink rounded-t-custom-lg shadow-raised border-t border-line flex flex-col max-h-[88vh] z-10"
          >
            {/* Header (ember hero) */}
            <div className="relative shrink-0 overflow-hidden rounded-t-custom-lg bg-ember text-white px-6 pt-4 pb-5">
              <Vessels color="#fff" opacity={0.16} />
              <div className="mx-auto w-10 h-1.5 bg-white/40 rounded-full mb-4" />
              <div className="flex items-start justify-between gap-3">
                <div className="relative z-10 flex flex-col gap-1">
                  <HHTLogo size="sm" showText={false} />
                  <div className="font-sans text-[11px] uppercase tracking-wider text-white/80 font-semibold">About the condition</div>
                  <h2 className="font-serif font-extrabold text-2xl leading-tight mt-0.5">
                    HHT — Hereditary Hemorrhagic Telangiectasia
                  </h2>
                </div>
                <button
                  onClick={close}
                  aria-label="Close"
                  className="relative z-10 p-1.5 rounded-full text-white/85 hover:text-white hover:bg-white/15 transition-colors active:scale-90 flex-shrink-0"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 min-h-0 overflow-y-auto px-6 py-5 flex flex-col gap-6 text-sm text-app-soft leading-relaxed font-sans">

              {/* Intro */}
              <section className="flex flex-col gap-2">
                <p>
                  <strong className="text-app-ink">Hereditary Hemorrhagic Telangiectasia (HHT)</strong>, also known as <strong className="text-app-ink">Osler-Weber-Rendu disease</strong>, is a rare autosomal dominant genetic disorder that affects approximately 1 in 5,000 people worldwide (~1 million people).
                </p>
                <p>
                  HHT causes abnormal blood vessel connections (arteriovenous malformations or AVMs) and small red spots (telangiectasias) on the skin and mucosal linings. Underdiagnosed in 90% of cases, patients often face a 20-year diagnosis delay.
                </p>
              </section>

              {/* Genetics */}
              <section className="bg-app-surface2 p-4 rounded-custom border border-line flex flex-col gap-2.5">
                <h3 className="font-serif font-bold text-base text-garnet">🧬 Genetics &amp; Inheritance</h3>
                <div className="flex gap-2 flex-wrap">
                  <Pill>ENG</Pill>
                  <Pill>ACVRL1 (ALK1)</Pill>
                  <Pill>SMAD4</Pill>
                  <Pill>Autosomal Dominant</Pill>
                </div>
                <p className="text-xs text-app-muted">
                  HHT is caused by mutations in genes involved in vascular development. A parent with HHT has a <strong className="text-app-ink">50% chance</strong> of passing the mutation to each child. SMAD4 mutation carriers also have Juvenile Polyposis Syndrome (JP-HHT).
                </p>
              </section>

              {/* Curaçao Criteria */}
              <section className="flex flex-col gap-2.5">
                <h3 className="font-serif font-bold text-base text-garnet">📊 Curaçao Diagnosis Criteria</h3>
                <p className="text-xs text-app-muted">
                  A clinical diagnosis is made using 4 key criteria. Having <strong className="text-app-ink">3 or 4</strong> indicates definite HHT:
                </p>
                <ul className="list-none flex flex-col gap-2 text-xs">
                  {criteria.map((c) => (
                    <li key={c.n} className="flex gap-3 items-start bg-app-surface2 border border-line p-3 rounded-custom">
                      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-garnet text-white grid place-items-center font-bold text-[11px]">{c.n}</span>
                      <div className="text-app-soft">
                        <strong className="text-app-ink">{c.t}:</strong> {c.d}
                      </div>
                    </li>
                  ))}
                </ul>
              </section>

              {/* Clinical Alert */}
              <section className="bg-rose border border-garnet/25 p-4 rounded-custom flex gap-3">
                <AlertOctagon size={22} className="text-garnet flex-shrink-0 mt-0.5" />
                <div className="flex flex-col gap-1.5">
                  <h4 className="font-sans font-bold text-[11px] uppercase text-garnet tracking-wider">⚠️ Critical Emergency Safety</h4>
                  <ul className="list-disc pl-4 text-xs text-app-ink/80 flex flex-col gap-1">
                    <li><strong className="text-app-ink">NO nasal packing:</strong> Can cause permanent mucosal tear and severe re-bleeding.</li>
                    <li><strong className="text-app-ink">AVM Screening:</strong> Screen for lung AVMs before invasive procedures (dental cleanings, surgeries) to prevent brain infection.</li>
                    <li><strong className="text-app-ink">NO NSAIDs:</strong> Avoid aspirin/ibuprofen without specialist guidance, as they increase bleeding risks.</li>
                    <li><strong className="text-app-ink">Brain AVMs:</strong> Must rule out brain AVMs before prescribing anticoagulation.</li>
                  </ul>
                </div>
              </section>

              {/* Resources */}
              <section className="flex flex-col gap-3">
                <h3 className="font-serif font-bold text-base text-garnet">🔗 Helpful Links</h3>
                <div className="flex flex-col gap-2 text-xs">
                  <a
                    href="https://curehht.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between bg-app-surface2 border border-line p-3 rounded-custom text-app-ink hover:border-garnet/30 transition-colors"
                  >
                    <span>Cure HHT — curehht.org</span>
                    <ExternalLink size={14} className="text-brand-teal" />
                  </a>
                  <a
                    href="https://rarediseases.org/rare-diseases/hereditary-hemorrhagic-telangiectasia/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between bg-app-surface2 border border-line p-3 rounded-custom text-app-ink hover:border-garnet/30 transition-colors"
                  >
                    <span>NORD Patient Guide</span>
                    <ExternalLink size={14} className="text-brand-teal" />
                  </a>
                </div>
              </section>

              {/* Settings — cloud backup opt-in */}
              <CloudBackupToggle />

              {/* Footer */}
              <div className="text-center text-[10px] text-app-muted border-t border-line pt-4">
                HHT Awareness App · curehht.org
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AboutModal;

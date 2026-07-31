import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Share2 } from 'lucide-react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { SectionTitle } from '../components/ui/SectionTitle';
import { Chip } from '../components/ui/Chip';
import { Vessels } from '../components/ui/Vessels';
import { Toast } from '../components/ui/Toast';
import { facts } from '../data/facts';
import { useShare } from '../hooks/useShare';
import { useAppStore } from '../store/useAppStore';
import { spring } from '../lib/motion';
import { haptics } from '../hooks/useHaptics';

const CATEGORIES = [
  { key: 'all', label: 'All Facts' },
  { key: 'prevalence', label: 'Prevalence' },
  { key: 'symptoms', label: 'Symptoms' },
  { key: 'genetics', label: 'Genetics' },
  { key: 'diagnosis', label: 'Diagnosis' },
  { key: 'treatment', label: 'Treatment' },
];

// Accent tone per category — garnet for the clinical/urgent, teal for care.
const CAT_TONE = {
  prevalence: 'garnet',
  symptoms: 'garnet',
  genetics: 'garnet',
  diagnosis: 'gold',
  treatment: 'teal',
};

const FactCard = ({ fact, onShare }) => {
  const { stat, body, cat, src } = fact;
  const tone = CAT_TONE[cat] || 'garnet';
  const statColor = tone === 'teal' ? 'text-brand-teal' : tone === 'gold' ? 'text-gold' : 'text-garnet';

  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={spring.soft}
      whileTap={{ scale: 0.98 }}
      onClick={() => onShare(fact)}
      className="group relative overflow-hidden text-left bg-app-surface border border-line rounded-custom-lg p-5 flex flex-col gap-3 shadow-card cursor-pointer"
    >
      {/* Faint capillary motif in the corner */}
      <Vessels
        color={tone === 'teal' ? 'var(--teal)' : tone === 'gold' ? 'var(--gold)' : 'var(--garnet)'}
        opacity={0.10}
      />

      {/* Category kicker + share glyph */}
      <div className="relative z-10 flex items-center justify-between">
        <span className="text-[11px] uppercase tracking-wider font-semibold text-garnet font-sans">
          {cat}
        </span>
        <Share2 size={15} className="text-app-muted group-active:text-garnet transition-colors" />
      </div>

      {/* Stat + body */}
      <div className="relative z-10 flex flex-col gap-1.5">
        <span className={`font-serif text-[2rem] font-extrabold leading-none ${statColor}`}>
          {stat}
        </span>
        <p className="text-sm text-app-soft leading-relaxed font-sans">
          {body}
        </p>
      </div>

      {/* Footer: source + share hint */}
      <div className="relative z-10 flex justify-between items-center text-[10px] text-app-muted border-t border-line pt-2.5 font-sans">
        <span className="italic">Source: {src}</span>
        <span className="text-brand-teal font-bold not-italic">Tap to share →</span>
      </div>
    </motion.button>
  );
};

export const Facts = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const { shareContent } = useShare();
  const [showToast, setShowToast] = useState(false);
  const [toastText, setToastText] = useState('');

  const showCustomToast = (msg) => {
    setToastText(msg);
    setShowToast(true);
  };

  const handleShareFact = async (fact) => {
    const success = await shareContent({
      title: 'HHT Fact Alert',
      text: `HHT Fact: ${fact.stat} — ${fact.body} (Source: ${fact.src})`,
      url: 'https://curehht.org'
    });

    if (success) {
      haptics.success();
      showCustomToast('Fact shared! Thank you for spreading awareness. 🌟');
      // Automatically toggle Challenge 4: Share an HHT fact online
      const toggleChallenge = useAppStore.getState().toggleChallenge;
      const completedChallenges = useAppStore.getState().completedChallenges;
      if (!completedChallenges.includes(4)) {
        toggleChallenge(4);
      }
    }
  };

  const filteredFacts = activeCategory === 'all'
    ? facts
    : facts.filter(f => f.cat === activeCategory);

  return (
    <PageWrapper>
      <div className="flex flex-col gap-5 font-sans">
        {/* Editorial header */}
        <SectionTitle kicker="Facts & Research" title="Know the numbers" />
        <p className="-mt-3 text-xs text-app-muted leading-relaxed px-0.5">
          Accurate medical statistics about Hereditary Hemorrhagic Telangiectasia. Tap any card to share it and spread awareness.
        </p>

        {/* Category chips */}
        <div className="sticky top-14 z-30 -mx-4 px-4 bg-app-bg py-2">
          <div className="w-full overflow-x-auto scrollbar-none flex gap-2 pb-1">
            {CATEGORIES.map((c) => (
              <Chip
                key={c.key}
                label={c.label}
                active={activeCategory === c.key}
                onClick={() => setActiveCategory(c.key)}
                className="whitespace-nowrap flex-shrink-0"
              />
            ))}
          </div>
        </div>

        {/* Fact cards */}
        <section
          key={activeCategory}
          className="flex flex-col gap-4 mb-4"
        >
          {filteredFacts.map((fact) => (
            <FactCard key={fact.id} fact={fact} onShare={handleShareFact} />
          ))}
          {filteredFacts.length === 0 && (
            <div className="text-center py-10 text-xs text-app-muted">
              No facts found in this category.
            </div>
          )}
        </section>
      </div>

      <Toast message={toastText} isOpen={showToast} onClose={() => setShowToast(false)} />
    </PageWrapper>
  );
};

export default Facts;

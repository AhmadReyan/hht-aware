import React, { useState } from 'react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { FactsFilter } from '../components/facts/FactsFilter';
import { FactCard } from '../components/facts/FactCard';
import { facts } from '../data/facts';
import { useShare } from '../hooks/useShare';
import { useAppStore } from '../store/useAppStore';
import { Toast } from '../components/ui/Toast';

export const Facts = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const { shareContent, toastMessage, triggerToast } = useShare();
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
        {/* Header Title */}
        <section className="flex flex-col gap-1 px-1">
          <h1 className="font-serif text-2xl font-bold text-white">HHT Facts & Research</h1>
          <p className="text-xs text-app-muted leading-relaxed">
            Arm yourself with accurate medical statistics about Hereditary Hemorrhagic Telangiectasia. Tap any card to share it with your network.
          </p>
        </section>

        {/* Categories Chips */}
        <section className="sticky top-14 z-30 bg-app-bg py-2">
          <FactsFilter activeCategory={activeCategory} onSelectCategory={setActiveCategory} />
        </section>

        {/* Fact Cards List */}
        <section className="flex flex-col gap-4 mb-6">
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

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { PageWrapper } from '../components/layout/PageWrapper';
import { SectionTitle } from '../components/ui/SectionTitle';
import { MythFactQuiz } from '../components/research/MythFactQuiz';
import { ResearchSpotlight } from '../components/research/ResearchSpotlight';
import { ResearchFilter } from '../components/research/ResearchFilter';
import { ResearchCard } from '../components/research/ResearchCard';
import { ExplainerChips } from '../components/research/ExplainerChips';
import { ResearchSwipeStack } from '../components/research/ResearchSwipeStack';
import { SavedForAppointment } from '../components/research/SavedForAppointment';
import { useResearchFeed } from '../hooks/useResearchFeed';
import { useAppStore } from '../store/useAppStore';
import { researchCategories, researchExplainers } from '../data/research';
import { CheckCheck, ShieldQuestion, Stethoscope } from 'lucide-react';

const feedListVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};
const feedItemVariants = {
  hidden: { opacity: 0, y: 6 },
  show: { opacity: 1, y: 0 },
};

export const Research = () => {
  const {
    updates,
    featured,
    isSeen,
    unseenCount,
    markSeen,
    markAllSeen,
    stackItems,
    resolveStackItem,
  } = useResearchFeed();

  const [activeCategory, setActiveCategory] = useState('all');
  const [savedOpen, setSavedOpen] = useState(false);

  // Subscribe reactively so the badge count updates the moment a card is saved.
  const savedCount = useAppStore((s) => s.savedForAppt.length);
  const toggleSavedForAppt = useAppStore((s) => s.toggleSavedForAppt);

  const filtered = useMemo(() => {
    if (activeCategory === 'all') return updates;
    return updates.filter((u) => u.category === activeCategory);
  }, [updates, activeCategory]);

  // Swipe-stack handlers — resolve removes the item from the stack pool.
  const handleStackSave = (id) => {
    if (!useAppStore.getState().savedForAppt.includes(id)) {
      toggleSavedForAppt(id);
    }
    markSeen(id);
    resolveStackItem(id);
  };
  const handleStackDismiss = (id) => {
    markSeen(id);
    resolveStackItem(id);
  };

  return (
    <PageWrapper>
      <div className="flex flex-col gap-6 font-sans rise">
        {/* Header */}
        <section className="flex items-start justify-between gap-3 px-1">
          <div className="flex flex-col">
            <SectionTitle kicker="Research" title="Made simple, made hopeful" className="mb-1.5" />
            <p className="text-xs text-app-soft leading-relaxed">
              The latest HHT science — rewritten in plain, hopeful language.
              {unseenCount > 0 && (
                <span className="text-garnet font-bold"> {unseenCount} new to explore.</span>
              )}
            </p>
          </div>
          {/* Saved-for-appointment opener */}
          <button
            type="button"
            onClick={() => setSavedOpen(true)}
            aria-label="Open my saved appointment list"
            className="relative flex-shrink-0 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-custom bg-app-surface border border-line text-brand-teal shadow-card active:scale-90 transition-all"
          >
            <Stethoscope size={20} />
            {savedCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full bg-brand-teal text-white text-[10px] font-bold">
                {savedCount}
              </span>
            )}
          </button>
        </section>

        {/* Featured interactive — Myth vs Fact quiz */}
        <section>
          <MythFactQuiz />
        </section>

        {/* This Week in Science — swipe stack */}
        <section>
          <ResearchSwipeStack
            items={stackItems}
            onSave={handleStackSave}
            onDismiss={handleStackDismiss}
          />
        </section>

        {/* Research of the Week spotlight */}
        {featured && (
          <section>
            <ResearchSpotlight update={featured} onClick={() => markSeen(featured.id)} />
          </section>
        )}

        {/* Category filter */}
        <section className="sticky top-14 z-30 bg-app-bg py-2">
          <ResearchFilter
            categories={researchCategories}
            activeCategory={activeCategory}
            onSelectCategory={setActiveCategory}
          />
        </section>

        {/* Feed */}
        <section className="flex flex-col gap-3">
          <div className="flex justify-between items-center px-1">
            <h2 className="font-bold text-[11px] uppercase tracking-wide text-app-muted">
              {activeCategory === 'all' ? 'All Updates' : activeCategory}
            </h2>
            {unseenCount > 0 && (
              <button
                onClick={markAllSeen}
                className="flex items-center gap-1 text-[10px] font-bold text-brand-teal hover:underline"
              >
                <CheckCheck size={12} />
                Mark all read
              </button>
            )}
          </div>

          <motion.div
            key={activeCategory}
            variants={feedListVariants}
            initial="hidden"
            animate="show"
            className="flex flex-col gap-3"
          >
            {filtered.map((update) => (
              <motion.div key={update.id} variants={feedItemVariants}>
                <ResearchCard
                  update={update}
                  isNew={!isSeen(update.id)}
                  onOpen={markSeen}
                />
              </motion.div>
            ))}
          </motion.div>

          {filtered.length === 0 && (
            <div className="text-center py-10 text-xs text-app-muted">
              No updates in this category yet.
            </div>
          )}
        </section>

        {/* Plain-language glossary */}
        {researchExplainers && researchExplainers.length > 0 && (
          <section className="flex flex-col gap-3 mb-2">
            <h2 className="font-bold text-[11px] uppercase tracking-wide text-app-muted px-1 flex items-center gap-1.5">
              <ShieldQuestion size={14} className="text-brand-teal" />
              Confusing word? Tap it.
            </h2>
            <ExplainerChips explainers={researchExplainers} />
          </section>
        )}

        {/* Disclaimer */}
        <section className="mb-6">
          <p className="text-[10px] text-app-muted leading-relaxed italic bg-app-surface2 border border-line rounded-custom p-3">
            This feed is for awareness and hope — not medical advice. Always talk with your HHT
            specialist before changing anything about your care. Bring an update that interests you
            to your next appointment.
          </p>
        </section>
      </div>

      {/* Saved-for-appointment bottom sheet */}
      <SavedForAppointment
        opened={savedOpen}
        onClose={() => setSavedOpen(false)}
        allUpdates={updates}
      />
    </PageWrapper>
  );
};
export default Research;

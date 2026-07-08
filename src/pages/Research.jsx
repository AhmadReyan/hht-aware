import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { PageWrapper } from '../components/layout/PageWrapper';
import { ResearchSpotlight } from '../components/research/ResearchSpotlight';
import { ResearchFilter } from '../components/research/ResearchFilter';
import { ResearchCard } from '../components/research/ResearchCard';
import { ExplainerChips } from '../components/research/ExplainerChips';
import { useResearchFeed } from '../hooks/useResearchFeed';
import { researchCategories, researchExplainers } from '../data/research';
import { Microscope, CheckCheck, ShieldQuestion } from 'lucide-react';

const feedListVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};
const feedItemVariants = {
  hidden: { opacity: 0, y: 6 },
  show: { opacity: 1, y: 0 },
};

export const Research = () => {
  const { updates, featured, isSeen, unseenCount, markSeen, markAllSeen } = useResearchFeed();
  const [activeCategory, setActiveCategory] = useState('all');

  const filtered = useMemo(() => {
    if (activeCategory === 'all') return updates;
    return updates.filter((u) => u.category === activeCategory);
  }, [updates, activeCategory]);

  return (
    <PageWrapper>
      <div className="flex flex-col gap-5 font-sans">
        {/* Header */}
        <section className="flex flex-col gap-1 px-1">
          <h1 className="font-serif text-2xl font-bold text-app-ink flex items-center gap-2">
            <Microscope className="text-brand-red-mid" size={24} />
            <span>Research, Made Simple</span>
          </h1>
          <p className="text-xs text-app-muted leading-relaxed">
            The latest HHT science and news — rewritten in plain, hopeful language. No medical degree needed.
            {unseenCount > 0 && (
              <span className="text-brand-red-mid font-bold"> {unseenCount} new to explore.</span>
            )}
          </p>
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
            <h2 className="font-bold text-xs uppercase tracking-wider text-app-muted">
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
            <h2 className="font-bold text-xs uppercase tracking-wider text-app-muted px-1 flex items-center gap-1.5">
              <ShieldQuestion size={14} className="text-brand-teal" />
              Confusing word? Tap it.
            </h2>
            <ExplainerChips explainers={researchExplainers} />
          </section>
        )}

        {/* Disclaimer */}
        <section className="mb-6">
          <p className="text-[10px] text-app-muted leading-relaxed italic bg-app-dark2/50 border border-app-border/5 rounded-custom p-3">
            This feed is for awareness and hope — not medical advice. Always talk with your HHT
            specialist before changing anything about your care. Bring an update that interests you
            to your next appointment.
          </p>
        </section>
      </div>
    </PageWrapper>
  );
};
export default Research;

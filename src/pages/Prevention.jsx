import React, { useState } from 'react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { InfoBanner } from '../components/ui/InfoBanner';
import { RoutineRing } from '../components/prevention/RoutineRing';
import { AgePersonaSelector } from '../components/prevention/AgePersonaSelector';
import { NoseCareSteps } from '../components/prevention/NoseCareSteps';
import { TopicTileGrid } from '../components/prevention/TopicTileGrid';
import { TriggerHelperSorter } from '../components/prevention/TriggerHelperSorter';
import { PreventionCategory } from '../components/prevention/PreventionCategory';
import {
  preventionDisclaimer,
  preventionCategories,
  preventionByAge,
  everydayRoutine,
  noseCareSteps,
  triggerHelperItems,
} from '../data/prevention';
import {
  HeartPulse,
  CalendarClock,
  Users,
  Sparkles,
  Shuffle,
  Library,
  ChevronDown,
} from 'lucide-react';

export const Prevention = () => {
  const [showLibrary, setShowLibrary] = useState(false);

  return (
    <PageWrapper>
      <div className="flex flex-col gap-6 font-sans">
        {/* Header */}
        <section className="flex flex-col gap-1 px-1">
          <h1 className="font-serif text-2xl font-bold text-app-ink flex items-center gap-2">
            <HeartPulse className="text-brand-red-mid" size={24} />
            <span>Prevention &amp; Self-Care</span>
          </h1>
          <p className="text-xs text-app-muted leading-relaxed">
            Small, everyday habits — backed by HHT guidelines — that can help you have fewer
            nosebleeds, protect your iron, and feel more in control.
          </p>
        </section>

        {/* Disclaimer */}
        {preventionDisclaimer && (
          <section>
            <InfoBanner variant="warning" title="Gentle reminder">
              {preventionDisclaimer}
            </InfoBanner>
          </section>
        )}

        {/* Routine ring — flagship */}
        {everydayRoutine && everydayRoutine.length > 0 && (
          <section className="flex flex-col gap-3">
            <h2 className="font-bold text-xs uppercase tracking-wider text-app-muted px-1 flex items-center gap-1.5">
              <CalendarClock size={14} className="text-brand-red-mid" />
              A Simple Daily Rhythm
            </h2>
            <div className="bg-app-surface border border-app-border/60 rounded-custom-lg p-5 shadow-card">
              <RoutineRing routine={everydayRoutine} />
            </div>
          </section>
        )}

        {/* Age-specific persona selector */}
        {preventionByAge && preventionByAge.length > 0 && (
          <section className="flex flex-col gap-3">
            <h2 className="font-bold text-xs uppercase tracking-wider text-app-muted px-1 flex items-center gap-1.5">
              <Users size={14} className="text-brand-orange" />
              Care by Life Stage
            </h2>
            <p className="text-[11px] text-app-muted px-1 -mt-1 leading-relaxed">
              HHT affects each age differently. Pick your stage for tailored tips.
            </p>
            <AgePersonaSelector groups={preventionByAge} />
          </section>
        )}

        {/* Nose care in 3 steps */}
        {noseCareSteps && noseCareSteps.length > 0 && (
          <section className="flex flex-col gap-3">
            <h2 className="font-bold text-xs uppercase tracking-wider text-app-muted px-1 flex items-center gap-1.5">
              <Sparkles size={14} className="text-brand-teal" />
              Nose Care in 3 Steps
            </h2>
            <NoseCareSteps steps={noseCareSteps} />
          </section>
        )}

        {/* Topic tile grid */}
        <section className="flex flex-col gap-3">
          <h2 className="font-bold text-xs uppercase tracking-wider text-app-muted px-1">
            Explore Every Topic
          </h2>
          <TopicTileGrid categories={preventionCategories || []} />
        </section>

        {/* Trigger / helper sorter */}
        {triggerHelperItems && triggerHelperItems.length > 0 && (
          <section className="flex flex-col gap-3">
            <h2 className="font-bold text-xs uppercase tracking-wider text-app-muted px-1 flex items-center gap-1.5">
              <Shuffle size={14} className="text-brand-red-mid" />
              Trigger or Helper?
            </h2>
            <p className="text-[11px] text-app-muted px-1 -mt-1 leading-relaxed">
              Tap a chip, then tap the column where you think it belongs.
            </p>
            <TriggerHelperSorter items={triggerHelperItems} />
          </section>
        )}

        {/* Full topic library — the old linear accordion, kept for anyone who wants it */}
        <section className="flex flex-col gap-3 mb-6">
          <button
            type="button"
            onClick={() => setShowLibrary((s) => !s)}
            className="flex items-center gap-1.5 text-xs font-bold text-app-soft px-1 select-none"
          >
            <Library size={14} className="text-app-muted" />
            Browse the full topic library
            <ChevronDown size={14} className={`transition-transform ${showLibrary ? 'rotate-180' : ''}`} />
          </button>

          {showLibrary && (
            <div className="flex flex-col gap-2.5">
              {(preventionCategories || []).map((cat) => (
                <PreventionCategory key={cat.id} category={cat} defaultOpen={false} />
              ))}
            </div>
          )}
        </section>
      </div>
    </PageWrapper>
  );
};
export default Prevention;

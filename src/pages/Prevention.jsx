import React, { useState } from 'react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { InfoBanner } from '../components/ui/InfoBanner';
import { SelfCareChecklist } from '../components/prevention/SelfCareChecklist';
import { SelfCareStreakStrip } from '../components/prevention/SelfCareStreakStrip';
import { SelfCareNudge } from '../components/prevention/SelfCareNudge';
import { TriggerLogger } from '../components/prevention/TriggerLogger';
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
  Users,
  Sparkles,
  Library,
  ChevronDown,
  CalendarClock,
  Shuffle,
} from 'lucide-react';

export const Prevention = () => {
  const [showTopics, setShowTopics] = useState(false);
  const [showLibrary, setShowLibrary] = useState(false);

  return (
    <PageWrapper>
      <div className="flex flex-col gap-5 font-sans">
        {/* Header */}
        <section className="flex flex-col gap-1 px-1">
          <h1 className="font-serif text-2xl font-bold text-app-ink flex items-center gap-2">
            <HeartPulse className="text-brand-red-mid" size={24} />
            <span>Prevention &amp; Self-Care</span>
          </h1>
          <p className="text-xs text-app-muted leading-relaxed">
            Log what you actually did today — small, repeated habits are what lower nosebleed
            risk and protect your iron.
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

        {/* 1. Today's Self-Care — hero check-in (the new #1 element) */}
        <section>
          <SelfCareChecklist />
        </section>

        {/* 2. Reactive feedback strip — streak + 7-day adherence */}
        <section>
          <SelfCareStreakStrip />
        </section>

        {/* 3. Gentle nudge — only shows while something's still unlogged */}
        <SelfCareNudge />

        {/* 4. Trigger logger */}
        <section>
          <TriggerLogger />
        </section>

        {/* 5a. Care by life stage */}
        {preventionByAge && preventionByAge.length > 0 && (
          <section className="flex flex-col gap-3">
            <h2 className="font-bold text-xs uppercase tracking-wider text-app-muted px-1 flex items-center gap-1.5">
              <Users size={14} className="text-brand-orange" />
              Care by Life Stage
            </h2>
            <AgePersonaSelector groups={preventionByAge} />
          </section>
        )}

        {/* 5b. Nose care in 3 steps */}
        {noseCareSteps && noseCareSteps.length > 0 && (
          <section className="flex flex-col gap-3">
            <h2 className="font-bold text-xs uppercase tracking-wider text-app-muted px-1 flex items-center gap-1.5">
              <Sparkles size={14} className="text-brand-teal" />
              Nose Care in 3 Steps
            </h2>
            <NoseCareSteps steps={noseCareSteps} />
          </section>
        )}

        {/* 6. Topic depth — collapsed. Reading stays secondary/optional. */}
        <section className="flex flex-col gap-3 mb-6">
          <button
            type="button"
            onClick={() => setShowTopics((s) => !s)}
            className="flex items-center gap-1.5 text-xs font-bold text-app-soft px-1 select-none min-h-[44px]"
          >
            <Library size={14} className="text-app-muted" />
            Explore prevention topics
            <ChevronDown size={14} className={`transition-transform ${showTopics ? 'rotate-180' : ''}`} />
          </button>

          {showTopics && (
            <div className="flex flex-col gap-5">
              {everydayRoutine && everydayRoutine.length > 0 && (
                <div className="flex flex-col gap-3">
                  <h3 className="font-bold text-[11px] uppercase tracking-wider text-app-muted px-1 flex items-center gap-1.5">
                    <CalendarClock size={13} className="text-brand-red-mid" />
                    A Simple Daily Rhythm
                  </h3>
                  <div className="bg-app-surface border border-app-border/60 rounded-custom-lg p-5 shadow-card">
                    <RoutineRing routine={everydayRoutine} />
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-3">
                <h3 className="font-bold text-[11px] uppercase tracking-wider text-app-muted px-1">
                  Every Topic
                </h3>
                <TopicTileGrid categories={preventionCategories || []} />
              </div>

              {triggerHelperItems && triggerHelperItems.length > 0 && (
                <div className="flex flex-col gap-3">
                  <h3 className="font-bold text-[11px] uppercase tracking-wider text-app-muted px-1 flex items-center gap-1.5">
                    <Shuffle size={13} className="text-brand-red-mid" />
                    Trigger or Helper?
                  </h3>
                  <p className="text-[11px] text-app-muted px-1 -mt-1 leading-relaxed">
                    Tap a chip, then tap the column where you think it belongs.
                  </p>
                  <TriggerHelperSorter items={triggerHelperItems} />
                </div>
              )}

              {/* Full topic library — the old linear accordion, nested one level deeper */}
              <div className="flex flex-col gap-3">
                <button
                  type="button"
                  onClick={() => setShowLibrary((s) => !s)}
                  className="flex items-center gap-1.5 text-[11px] font-bold text-app-soft px-1 select-none min-h-[44px]"
                >
                  <Library size={13} className="text-app-muted" />
                  Browse the full topic library
                  <ChevronDown size={13} className={`transition-transform ${showLibrary ? 'rotate-180' : ''}`} />
                </button>

                {showLibrary && (
                  <div className="flex flex-col gap-2.5">
                    {(preventionCategories || []).map((cat) => (
                      <PreventionCategory key={cat.id} category={cat} defaultOpen={false} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </section>
      </div>
    </PageWrapper>
  );
};
export default Prevention;

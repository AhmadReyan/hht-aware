import React, { useState } from 'react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { SectionTitle } from '../components/ui/SectionTitle';
import { SelfCareChecklist } from '../components/prevention/SelfCareChecklist';
import { SelfCareStreakStrip } from '../components/prevention/SelfCareStreakStrip';
import { SelfCareNudge } from '../components/prevention/SelfCareNudge';
import { TriggerLogger } from '../components/prevention/TriggerLogger';
import { TunedTips } from '../components/prevention/TunedTips';
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
  Users,
  Sparkles,
  Library,
  ChevronDown,
  CalendarClock,
  Shuffle,
  ShieldPlus,
} from 'lucide-react';

const SubHeading = ({ icon: Icon, children }) => (
  <h2 className="font-sans font-bold text-[11px] uppercase tracking-wider text-app-muted px-0.5 flex items-center gap-1.5">
    {Icon && <Icon size={13} className="text-garnet" />}
    {children}
  </h2>
);

export const Prevention = () => {
  const [showTopics, setShowTopics] = useState(false);
  const [showLibrary, setShowLibrary] = useState(false);

  return (
    <PageWrapper>
      <div className="flex flex-col gap-6 font-sans rise">
        {/* Lead */}
        <div className="flex flex-col gap-2">
          <SectionTitle kicker="Prevention" title="Tips tuned to you" className="mb-0" />
          <p className="text-[13px] text-app-soft leading-relaxed">
            Log what you actually did today — small, repeated habits are what lower nosebleed risk
            and protect your iron.
          </p>
        </div>

        {/* 1. Today's Self-Care — primary actionable module */}
        <section>
          <SelfCareChecklist />
        </section>

        {/* 2. Reactive feedback strip — streak + 7-day adherence */}
        <section>
          <SelfCareStreakStrip />
        </section>

        {/* 3. Gentle nudge — only while something's still unlogged */}
        <SelfCareNudge />

        {/* 4. Trigger logger */}
        <section>
          <TriggerLogger />
        </section>

        {/* 5. Tuned tips — time-of-day + age swap tips & a rose diet callout */}
        <section>
          <TunedTips />
        </section>

        {/* 6. Care by life stage */}
        {preventionByAge && preventionByAge.length > 0 && (
          <section className="flex flex-col gap-3">
            <SubHeading icon={Users}>Care by Life Stage</SubHeading>
            <AgePersonaSelector groups={preventionByAge} />
          </section>
        )}

        {/* 7. Nose care in 3 steps */}
        {noseCareSteps && noseCareSteps.length > 0 && (
          <section className="flex flex-col gap-3">
            <SubHeading icon={Sparkles}>Nose Care in 3 Steps</SubHeading>
            <NoseCareSteps steps={noseCareSteps} />
          </section>
        )}

        {/* 8. Topic depth — collapsed, secondary. Reading stays optional. */}
        <section className="flex flex-col gap-3">
          <button
            type="button"
            onClick={() => setShowTopics((s) => !s)}
            className="flex items-center gap-1.5 text-xs font-bold text-app-soft px-0.5 select-none min-h-[44px]"
          >
            <Library size={14} className="text-app-muted" />
            Explore prevention topics
            <ChevronDown size={14} className={`transition-transform ${showTopics ? 'rotate-180' : ''}`} />
          </button>

          {showTopics && (
            <div className="flex flex-col gap-6 rise">
              {everydayRoutine && everydayRoutine.length > 0 && (
                <div className="flex flex-col gap-3">
                  <SubHeading icon={CalendarClock}>A Simple Daily Rhythm</SubHeading>
                  <div className="bg-app-surface border border-line rounded-custom-lg p-5 shadow-card">
                    <RoutineRing routine={everydayRoutine} />
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-3">
                <SubHeading>Every Topic</SubHeading>
                <TopicTileGrid categories={preventionCategories || []} />
              </div>

              {triggerHelperItems && triggerHelperItems.length > 0 && (
                <div className="flex flex-col gap-3">
                  <SubHeading icon={Shuffle}>Trigger or Helper?</SubHeading>
                  <p className="text-[11px] text-app-muted px-0.5 -mt-1 leading-relaxed">
                    Tap a chip, then tap the column where you think it belongs.
                  </p>
                  <TriggerHelperSorter items={triggerHelperItems} />
                </div>
              )}

              {/* Full topic library — the linear accordion, nested one level deeper */}
              <div className="flex flex-col gap-3">
                <button
                  type="button"
                  onClick={() => setShowLibrary((s) => !s)}
                  className="flex items-center gap-1.5 text-[11px] font-bold text-app-soft px-0.5 select-none min-h-[44px]"
                >
                  <Library size={13} className="text-app-muted" />
                  Browse the full topic library
                  <ChevronDown size={13} className={`transition-transform ${showLibrary ? 'rotate-180' : ''}`} />
                </button>

                {showLibrary && (
                  <div className="flex flex-col gap-2.5 rise">
                    {(preventionCategories || []).map((cat) => (
                      <PreventionCategory key={cat.id} category={cat} defaultOpen={false} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </section>

        {/* Medical disclaimer — warm, always present */}
        {preventionDisclaimer && (
          <div className="bg-app-surface2 border border-line rounded-custom p-4 flex items-start gap-2.5">
            <ShieldPlus size={16} className="text-garnet flex-shrink-0 mt-0.5" />
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-garnet">
                Gentle reminder
              </span>
              <p className="text-[11.5px] text-app-soft leading-relaxed">{preventionDisclaimer}</p>
            </div>
          </div>
        )}
      </div>
    </PageWrapper>
  );
};
export default Prevention;

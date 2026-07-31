import React, { useState } from 'react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { SectionTitle } from '../components/ui/SectionTitle';
import { SelfCareChecklist } from '../components/prevention/SelfCareChecklist';
import { SelfCareConsistency } from '../components/prevention/SelfCareConsistency';
import { QuickRoutine } from '../components/prevention/QuickRoutine';
import { TriggerLogger } from '../components/prevention/TriggerLogger';
import { NoseCareSteps } from '../components/prevention/NoseCareSteps';
import { TriggerHelperSorter } from '../components/prevention/TriggerHelperSorter';
import { AgePersonaSelector } from '../components/prevention/AgePersonaSelector';
import { PreventionCategory } from '../components/prevention/PreventionCategory';
import { Card } from '../components/ui/Card';
import { Vessels } from '../components/ui/Vessels';
import {
  preventionDisclaimer,
  preventionCategories,
  everydayRoutine,
  noseCareSteps,
  triggerHelperItems,
  preventionByAge,
} from '../data/prevention';
import {
  Library,
  ChevronDown,
  ShieldPlus,
  ArrowRight,
  Sparkles,
  Zap,
  UserCheck,
} from 'lucide-react';

export const Prevention = () => {
  const [showLibrary, setShowLibrary] = useState(false);

  return (
    <PageWrapper>
      <div className="flex flex-col gap-8 font-sans rise pb-8">

        {/* Header */}
        <section className="px-1">
          <SectionTitle kicker="Self-Care & Prevention" title="Protect your nose & iron" />
          <p className="text-[13px] text-app-soft leading-relaxed pr-6">
            Daily moisture and gentle care lower nosebleed frequency by up to 50%. Follow our visual step-by-step guide below.
          </p>
        </section>

        {/* 1. Animated Visual Nose Care Walkthrough */}
        <section className="flex flex-col gap-3">
          <div className="px-1 flex justify-between items-center">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-garnet flex items-center gap-1">
              <Zap size={12} className="text-garnet animate-bounce" />
              Step-by-Step Prevention Protocol
            </span>
            <span className="text-[10px] font-bold text-app-muted">Auto-advancing</span>
          </div>
          <NoseCareSteps steps={noseCareSteps} />
        </section>

        {/* 2. Daily Checklist — Main Action */}
        <section>
          <SelfCareChecklist />
        </section>

        {/* 3. Consistency Heatmap */}
        <section>
          <SelfCareConsistency />
        </section>

        {/* 4. Trigger Logger */}
        <section>
          <div className="px-1 mb-3">
             <span className="text-[10px] font-bold uppercase tracking-widest text-garnet">Pattern Tracker</span>
             <h2 className="font-serif text-xl font-extrabold text-ink leading-tight">Trigger Log</h2>
          </div>
          <TriggerLogger />
        </section>

        {/* 5. Interactive Sorter Mini-Game */}
        <section className="flex flex-col gap-3">
          <div className="px-1 flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-widest text-garnet">Interactive Practice</span>
            <h2 className="font-serif text-xl font-extrabold text-ink leading-tight">Trigger or Helper?</h2>
            <p className="text-[11px] text-app-muted mt-0.5">Tap an item below, then choose Triggers or Helpers to sort it.</p>
          </div>
          <div className="bg-app-surface border border-line rounded-custom-lg p-4 shadow-card">
            <TriggerHelperSorter items={triggerHelperItems} />
          </div>
        </section>

        {/* 6. Prevention by Age & Life Stage */}
        <section className="flex flex-col gap-3">
          <div className="px-1 flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-widest text-garnet flex items-center gap-1">
              <UserCheck size={12} className="text-garnet" />
              Personalized Guidance
            </span>
            <h2 className="font-serif text-xl font-extrabold text-ink leading-tight">Age &amp; Life Stage Focus</h2>
          </div>
          <AgePersonaSelector groups={preventionByAge} />
        </section>

        {/* 7. Simple Daily Routine */}
        <section className="flex flex-col gap-4">
          <div className="px-1 flex justify-between items-end">
            <div className="flex flex-col">
               <span className="text-[10px] font-bold uppercase tracking-widest text-garnet">Guidelines</span>
               <h2 className="font-serif text-xl font-extrabold text-ink leading-tight">Daily Rhythm</h2>
            </div>
            <span className="text-[11px] font-bold text-garnet flex items-center gap-1">
              Scroll down <ArrowRight size={12} />
            </span>
          </div>

          <Card className="p-6 bg-white border-app-border/10 relative overflow-hidden shadow-card rounded-custom-lg">
            <Vessels color="var(--garnet)" opacity={0.04} />
            <QuickRoutine items={everydayRoutine} />
          </Card>
        </section>

        {/* 8. Knowledge Library */}
        <section className="flex flex-col gap-3">
          <button
            type="button"
            onClick={() => setShowLibrary((s) => !s)}
            className="flex items-center justify-between w-full bg-surface-2 border border-line rounded-custom-lg p-5 text-left shadow-sm group hover:border-garnet/30 transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-garnet text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                <Library size={20} />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-ink">Topic Library</span>
                <span className="text-[11px] text-app-muted">Deep dives on diet, meds, and genetics</span>
              </div>
            </div>
            <ChevronDown size={20} className={`text-app-muted transition-transform duration-300 ${showLibrary ? 'rotate-180' : ''}`} />
          </button>

          {showLibrary && (
            <div className="flex flex-col gap-3 rise pt-2">
              {preventionCategories.map((cat) => (
                <PreventionCategory key={cat.id} category={cat} defaultOpen={false} />
              ))}
            </div>
          )}
        </section>

        {/* 9. Pro-Tip Callout */}
        <section className="bg-rose border border-garnet/10 rounded-custom-lg p-5 flex gap-4 items-center">
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm flex-shrink-0">
               <Sparkles className="text-garnet" size={24} />
            </div>
            <div className="flex flex-col gap-0.5">
               <span className="text-[11px] font-extrabold uppercase tracking-widest text-garnet">Pro Tip</span>
               <p className="text-xs text-ink font-medium leading-relaxed">
                 Apply saline gel <span className="text-garnet font-bold underline">before</span> you feel dry to prevent micro-cracks.
               </p>
            </div>
        </section>

        {/* Medical disclaimer */}
        <div className="bg-white/50 border border-line rounded-custom p-4 flex items-start gap-2.5 opacity-80">
          <ShieldPlus size={16} className="text-garnet flex-shrink-0 mt-0.5" />
          <p className="text-[11px] text-app-muted leading-relaxed italic">{preventionDisclaimer}</p>
        </div>
      </div>
    </PageWrapper>
  );
};
export default Prevention;

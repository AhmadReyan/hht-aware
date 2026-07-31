import React, { useState } from 'react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { ProtectionRing } from '../components/prevention/ProtectionRing';
import { ActionTiles } from '../components/prevention/ActionTiles';
import { ActionWhyModal } from '../components/prevention/ActionWhyModal';
import { CompletionCelebration } from '../components/prevention/CompletionCelebration';
import { StreakFlame } from '../components/prevention/StreakFlame';
import { SelfCareConsistency } from '../components/prevention/SelfCareConsistency';
import { TriggerLogger } from '../components/prevention/TriggerLogger';
import { NoseCareSteps } from '../components/prevention/NoseCareSteps';
import { TriggerHelperSorter } from '../components/prevention/TriggerHelperSorter';
import { AgePersonaSelector } from '../components/prevention/AgePersonaSelector';
import { PreventionCategory } from '../components/prevention/PreventionCategory';
import {
  preventionDisclaimer,
  preventionCategories,
  noseCareSteps,
  triggerHelperItems,
  preventionByAge,
} from '../data/prevention';
import {
  Library,
  ChevronDown,
  ShieldPlus,
  Sparkles,
} from 'lucide-react';

export const Prevention = () => {
  const [showLibrary, setShowLibrary] = useState(false);
  const [selectedWhyItem, setSelectedWhyItem] = useState(null);

  return (
    <PageWrapper>
      <div className="flex flex-col gap-6 font-sans rise pb-8">

        {/* 1. PROTECTION RING HERO */}
        <section id="protection-hero">
          <ProtectionRing />
        </section>

        {/* 2. ACTION TILES */}
        <section id="action-tiles" className="flex flex-col gap-3">
          <div className="px-1 flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-garnet">Daily Protection Shield</span>
            <span className="text-[10px] text-app-muted font-medium">Tap tile to log</span>
          </div>
          <ActionTiles onOpenWhy={(item) => setSelectedWhyItem(item)} />
          <CompletionCelebration />
        </section>

        {/* 3. STREAK FLAME */}
        <section id="streak-flame">
          <StreakFlame />
        </section>

        {/* 4. TIP OF THE MOMENT */}
        <section id="tip-of-moment">
          <NoseCareSteps steps={noseCareSteps} />
        </section>

        {/* 5. CONSISTENCY CHAIN */}
        <section id="consistency-chain">
          <SelfCareConsistency />
        </section>

        {/* 6. TRIGGER QUICK-LOG */}
        <section id="trigger-quicklog">
          <div className="px-1 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-garnet">Pattern Tracker</span>
            <h2 className="font-serif text-lg font-extrabold text-ink leading-tight">Trigger Log</h2>
          </div>
          <TriggerLogger />
          <div className="mt-3 bg-app-surface border border-line rounded-custom-lg p-4 shadow-card">
            <TriggerHelperSorter items={triggerHelperItems} />
          </div>
        </section>

        {/* 7. LEARN (MINIMIZED) */}
        <section id="learn-minimized" className="flex flex-col gap-3">
          <button
            type="button"
            onClick={() => setShowLibrary((s) => !s)}
            className="flex items-center justify-between w-full bg-app-surface border border-line rounded-custom-lg p-4 text-left shadow-card group hover:border-garnet/30 transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-garnet text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                <Library size={18} />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-app-ink">HHT Prevention Library</span>
                <span className="text-[10px] text-app-muted">Age guidance, diet, meds &amp; clinical tips</span>
              </div>
            </div>
            <ChevronDown size={18} className={`text-app-muted transition-transform duration-300 ${showLibrary ? 'rotate-180' : ''}`} />
          </button>

          {showLibrary && (
            <div className="flex flex-col gap-4 rise pt-2">
              <AgePersonaSelector groups={preventionByAge} />
              <div className="flex flex-col gap-3">
                {preventionCategories.map((cat) => (
                  <PreventionCategory key={cat.id} category={cat} defaultOpen={false} />
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Pro-Tip Callout & Disclaimer */}
        <section className="bg-rose border border-garnet/10 rounded-custom-lg p-4 flex gap-3.5 items-center">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm flex-shrink-0">
            <Sparkles className="text-garnet" size={20} />
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-garnet">Pro Tip</span>
            <p className="text-xs text-app-ink font-medium leading-relaxed">
              Apply saline gel <span className="text-garnet font-bold underline">before</span> you feel dry to prevent micro-cracks.
            </p>
          </div>
        </section>

        <div className="bg-app-surface/60 border border-line rounded-custom p-3.5 flex items-start gap-2.5 opacity-80">
          <ShieldPlus size={15} className="text-garnet flex-shrink-0 mt-0.5" />
          <p className="text-[10.5px] text-app-muted leading-relaxed italic">{preventionDisclaimer}</p>
        </div>
      </div>

      <ActionWhyModal
        item={selectedWhyItem}
        isOpen={Boolean(selectedWhyItem)}
        onClose={() => setSelectedWhyItem(null)}
      />
    </PageWrapper>
  );
};
export default Prevention;

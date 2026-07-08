import React from 'react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { InfoBanner } from '../components/ui/InfoBanner';
import { PreventionCategory } from '../components/prevention/PreventionCategory';
import { AgeGroupTabs } from '../components/prevention/AgeGroupTabs';
import { RoutineTimeline } from '../components/prevention/RoutineTimeline';
import {
  preventionDisclaimer,
  preventionCategories,
  preventionByAge,
  everydayRoutine,
} from '../data/prevention';
import { HeartPulse, CalendarClock, Users } from 'lucide-react';

export const Prevention = () => {
  return (
    <PageWrapper>
      <div className="flex flex-col gap-6 font-sans">
        {/* Header */}
        <section className="flex flex-col gap-1 px-1">
          <h1 className="font-serif text-2xl font-bold text-white flex items-center gap-2">
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

        {/* Everyday routine — flagship */}
        {everydayRoutine && everydayRoutine.length > 0 && (
          <section className="flex flex-col gap-3">
            <h2 className="font-bold text-xs uppercase tracking-wider text-app-muted px-1 flex items-center gap-1.5">
              <CalendarClock size={14} className="text-brand-red-mid" />
              A Simple Daily Rhythm
            </h2>
            <div className="bg-app-dark border border-app-border/10 rounded-custom p-5 shadow-md">
              <RoutineTimeline routine={everydayRoutine} />
            </div>
          </section>
        )}

        {/* Age-specific */}
        {preventionByAge && preventionByAge.length > 0 && (
          <section className="flex flex-col gap-3">
            <h2 className="font-bold text-xs uppercase tracking-wider text-app-muted px-1 flex items-center gap-1.5">
              <Users size={14} className="text-brand-orange" />
              Care by Life Stage
            </h2>
            <p className="text-[11px] text-app-muted px-1 -mt-1 leading-relaxed">
              HHT affects each age differently. Pick your stage for tailored tips.
            </p>
            <AgeGroupTabs groups={preventionByAge} />
          </section>
        )}

        {/* Full category library */}
        <section className="flex flex-col gap-3 mb-6">
          <h2 className="font-bold text-xs uppercase tracking-wider text-app-muted px-1">
            Explore Every Topic
          </h2>
          <div className="flex flex-col gap-2.5">
            {(preventionCategories || []).map((cat, i) => (
              <PreventionCategory key={cat.id} category={cat} defaultOpen={i === 0} />
            ))}
          </div>
        </section>
      </div>
    </PageWrapper>
  );
};
export default Prevention;

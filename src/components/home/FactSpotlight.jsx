import React from 'react';
import { RefreshCw, Share2 } from 'lucide-react';
import { FlipCard } from '../ui/FlipCard';
import { Vessels } from '../ui/Vessels';
import { haptics } from '../../hooks/useHaptics';

export const FactSpotlight = ({ fact, onRotate, onShare }) => {
  return (
    <section className="flex flex-col gap-3">
      <div className="flex justify-between items-end px-1">
        <div className="flex flex-col">
          <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-garnet">Knowledge base</span>
          <h2 className="font-serif text-xl font-extrabold text-ink leading-tight">Fact Spotlight</h2>
        </div>
        <div className="flex gap-2 pb-0.5">
          <button
            onClick={() => { haptics.tap(); onRotate(); }}
            className="p-2 rounded-full bg-white border border-app-border/10 text-app-muted hover:text-garnet shadow-sm active:rotate-180 transition-transform duration-500"
          >
            <RefreshCw size={14} />
          </button>
        </div>
      </div>

      <FlipCard
        height={180}
        front={
          <div className="w-full h-full bg-white rounded-custom border border-app-border/10 p-5 flex flex-col justify-center items-center text-center shadow-card relative overflow-hidden group">
            <Vessels color="var(--garnet)" opacity={0.06} />
            <div className="flex flex-col gap-2">
              <span className="text-[11px] font-bold uppercase tracking-widest text-garnet opacity-60">Tap to reveal</span>
              <div className="font-serif text-4xl font-extrabold text-garnet italic leading-none px-4">
                {fact.stat}
              </div>
            </div>
            <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <Share2 size={12} className="text-app-muted" />
            </div>
          </div>
        }
        back={
          <div className="w-full h-full bg-surface-2 rounded-custom border border-app-border/10 p-6 flex flex-col justify-between shadow-card relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4">
               <button
                onClick={(e) => { e.stopPropagation(); onShare(); }}
                className="p-2 rounded-full bg-white/50 text-garnet shadow-sm"
               >
                 <Share2 size={14} />
               </button>
            </div>
            <p className="text-sm font-sans font-medium text-ink leading-relaxed pr-8">
              {fact.body}
            </p>
            <div className="flex justify-between items-center text-[9px] font-bold uppercase tracking-wider text-app-muted">
              <span>Source: {fact.src}</span>
              <span className="text-garnet">Tap to flip back</span>
            </div>
          </div>
        }
      />
    </section>
  );
};

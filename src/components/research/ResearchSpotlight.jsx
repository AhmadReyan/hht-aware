import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';

/**
 * "Research of the Week" spotlight — the periodic-delivery surface.
 * Shown on Home (compact) and atop the Research page (full).
 */
export const ResearchSpotlight = ({ update, onClick, compact = false }) => {
  if (!update) return null;
  const { emoji, category, title, plain, whyItMatters } = update;

  return (
    <motion.div
      whileTap={{ scale: 0.99 }}
      onClick={onClick}
      className="relative overflow-hidden rounded-custom p-5 cursor-pointer select-none border border-brand-red-mid/20 bg-gradient-to-br from-brand-red/15 via-app-dark to-app-dark shadow-lg"
    >
      <div className="absolute -right-8 -top-8 w-32 h-32 bg-brand-red/10 rounded-full blur-2xl pointer-events-none" />
      <div className="relative z-10 flex flex-col gap-2.5">
        <div className="flex items-center gap-1.5">
          <Sparkles size={14} className="text-brand-red-mid" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-brand-red-mid">
            Research of the Week
          </span>
        </div>

        <div className="flex items-start gap-3">
          <span className="text-3xl leading-none flex-shrink-0">{emoji || '🔬'}</span>
          <div className="flex flex-col gap-1">
            <span className="text-[9px] font-bold uppercase tracking-wider text-app-muted">{category}</span>
            <h3 className="font-serif text-lg font-bold text-white leading-tight">{title}</h3>
          </div>
        </div>

        <p className="text-xs text-app-border leading-relaxed">
          {compact ? plain : (whyItMatters || plain)}
        </p>

        <div className="flex items-center gap-1 text-[11px] font-bold text-brand-teal mt-0.5">
          <span>{compact ? 'See all research' : 'Read more'}</span>
          <ArrowRight size={12} />
        </div>
      </div>
    </motion.div>
  );
};
export default ResearchSpotlight;

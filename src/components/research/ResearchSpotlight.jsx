import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';
import { Vessels } from '../ui/Vessels';

/**
 * "Research of the Week" spotlight — the periodic-delivery surface.
 * Shown on Home (compact) and atop the Research page (full). Warm-editorial
 * garnet ember hero with the signature capillary motif and white text.
 */
export const ResearchSpotlight = ({ update, onClick, compact = false }) => {
  if (!update) return null;
  const { emoji, category, title, plain, whyItMatters } = update;

  return (
    <motion.div
      whileTap={{ scale: 0.99 }}
      onClick={onClick}
      className="relative overflow-hidden rounded-custom-lg bg-ember p-5 cursor-pointer select-none shadow-raised text-white"
    >
      <Vessels color="#fff" opacity={0.16} />
      <div className="relative z-10 flex flex-col gap-2.5">
        <div className="flex items-center gap-1.5">
          <Sparkles size={14} className="text-white/90" />
          <span className="text-[11px] font-semibold uppercase tracking-wide text-white/90">
            Research of the Week
          </span>
        </div>

        <div className="flex items-start gap-3">
          <span className="text-3xl leading-none flex-shrink-0">{emoji || '🔬'}</span>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold uppercase tracking-wide text-white/70">{category}</span>
            <h3 className="font-serif text-lg font-extrabold text-white leading-tight">{title}</h3>
          </div>
        </div>

        <p className="text-xs text-white/85 leading-relaxed">
          {compact ? plain : (whyItMatters || plain)}
        </p>

        <div className="flex items-center gap-1 text-[11px] font-bold text-white mt-0.5">
          <span>{compact ? 'See all research' : 'Read more'}</span>
          <ArrowRight size={12} />
        </div>
      </div>
    </motion.div>
  );
};
export default ResearchSpotlight;

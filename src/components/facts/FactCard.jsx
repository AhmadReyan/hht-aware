import React from 'react';
import { Badge } from '../ui/Badge';
import { Share2 } from 'lucide-react';
import { motion } from 'framer-motion';

export const FactCard = ({ fact, onShare }) => {
  const { stat, body, cat, src } = fact;

  const categoryColors = {
    prevalence: 'red',
    symptoms: 'orange',
    genetics: 'red',
    diagnosis: 'orange',
    treatment: 'teal'
  };

  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      onClick={() => onShare(fact)}
      className="relative overflow-hidden bg-app-dark2 border border-app-border/10 rounded-custom p-5 flex flex-col gap-3.5 group hover:border-brand-red-mid/20 transition-all cursor-pointer shadow-sm select-none"
    >
      {/* Decorative Red/Orange Accent Circle */}
      <div className="absolute -top-12 -right-12 w-28 h-28 bg-brand-red/5 rounded-full group-hover:bg-brand-red/15 group-hover:scale-110 transition-all duration-300 pointer-events-none" />

      {/* Category Badge */}
      <div className="flex justify-between items-start">
        <Badge variant={categoryColors[cat] || 'default'} size="sm">
          {cat}
        </Badge>
        <Share2 size={14} className="text-app-muted group-hover:text-white transition-colors" />
      </div>

      {/* Stat and Body */}
      <div className="flex flex-col gap-1.5 relative z-10">
        <span className="font-serif text-3xl font-extrabold text-[#F8B0A0] leading-none">
          {stat}
        </span>
        <p className="text-sm text-app-border leading-relaxed font-sans">
          {body}
        </p>
      </div>

      {/* Footer Citation & Hint */}
      <div className="flex justify-between items-center text-[10px] text-app-muted italic border-t border-app-border/5 pt-2.5 mt-1 select-none">
        <span>Source: {src}</span>
        <span className="text-brand-teal group-hover:underline not-italic font-bold font-sans">Tap to share →</span>
      </div>
    </motion.div>
  );
};
export default FactCard;

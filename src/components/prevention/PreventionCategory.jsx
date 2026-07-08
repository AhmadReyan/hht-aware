import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { Badge } from '../ui/Badge';

/**
 * Accordion card for one prevention category (e.g. "Nose & Nosebleed Care").
 * Collapsed by default so the page stays scannable; tap to reveal the tips.
 */
export const PreventionCategory = ({ category, defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen);
  const { icon, title, summary, tips = [] } = category;

  return (
    <div className="bg-app-dark2 border border-app-border/10 rounded-custom overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-start gap-3 p-4 text-left select-none"
      >
        <span className="text-2xl leading-none flex-shrink-0 mt-0.5">{icon}</span>
        <div className="flex-1 flex flex-col gap-1">
          <div className="flex justify-between items-center gap-2">
            <h3 className="font-sans font-bold text-sm text-white leading-snug">{title}</h3>
            <div className="flex items-center gap-2 flex-shrink-0">
              <Badge variant="dark" size="sm">{tips.length}</Badge>
              <ChevronDown
                size={18}
                className={`text-app-muted transition-transform ${open ? 'rotate-180' : ''}`}
              />
            </div>
          </div>
          <p className="text-[11px] text-app-muted leading-relaxed pr-2">{summary}</p>
        </div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="flex flex-col gap-3 px-4 pb-4 pt-1">
              {tips.map((tip, i) => (
                <div
                  key={i}
                  className="bg-app-dark/60 border border-app-border/5 rounded-custom-sm p-3.5 flex flex-col gap-1.5"
                >
                  <div className="flex justify-between items-start gap-2">
                    <h4 className="font-sans font-bold text-xs text-brand-red-light leading-snug">
                      {tip.title}
                    </h4>
                    {tip.tag && (
                      <Badge variant="teal" size="sm" className="flex-shrink-0">{tip.tag}</Badge>
                    )}
                  </div>
                  <p className="text-[11px] text-app-border leading-relaxed">{tip.body}</p>
                  {tip.src && (
                    <span className="text-[9px] text-app-muted italic mt-0.5">Source: {tip.src}</span>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
export default PreventionCategory;

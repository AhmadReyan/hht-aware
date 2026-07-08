import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';

/**
 * Age-aware prevention. HHT shows up differently across life stages, so users
 * pick their group and see guidance tuned to it.
 */
export const AgeGroupTabs = ({ groups = [] }) => {
  const [activeId, setActiveId] = useState(groups[0]?.id);
  const active = groups.find((g) => g.id === activeId) || groups[0];

  if (!groups.length) return null;

  return (
    <div className="flex flex-col gap-3">
      {/* Age chips */}
      <div className="w-full overflow-x-auto scrollbar-none flex gap-2 pb-1">
        {groups.map((g) => {
          const isActive = g.id === active.id;
          return (
            <button
              key={g.id}
              onClick={() => setActiveId(g.id)}
              className={`
                px-3 py-1.5 rounded-custom-pill text-xs font-semibold whitespace-nowrap transition-all border select-none flex items-center gap-1.5
                ${isActive
                  ? 'bg-brand-red text-white border-brand-red font-bold shadow-sm'
                  : 'bg-app-dark2 border-app-border/10 text-app-muted hover:text-white'
                }
              `}
            >
              <span>{g.icon}</span>
              <span>{g.label}</span>
            </button>
          );
        })}
      </div>

      {/* Active group panel */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active.id}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2 }}
          className="bg-app-dark2 border border-app-border/10 rounded-custom p-4 flex flex-col gap-3"
        >
          {active.focus && (
            <div className="flex items-start gap-2 bg-brand-orange/10 border border-brand-orange/20 rounded-custom-sm p-3">
              <span className="text-lg leading-none">{active.icon}</span>
              <div className="flex flex-col gap-0.5">
                <span className="text-[9px] font-bold uppercase tracking-wider text-brand-orange">
                  What matters most
                </span>
                <p className="text-xs text-app-border leading-relaxed">{active.focus}</p>
              </div>
            </div>
          )}
          <ul className="flex flex-col gap-2.5">
            {(active.tips || []).map((tip, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <Check size={15} className="text-brand-teal flex-shrink-0 mt-0.5" />
                <span className="text-xs text-app-border leading-relaxed">{tip}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
export default AgeGroupTabs;

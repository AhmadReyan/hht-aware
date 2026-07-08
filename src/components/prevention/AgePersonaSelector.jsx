import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronDown, Heart, CalendarCheck } from 'lucide-react';
import {
  ChildFigure,
  TeenFigure,
  AdultFigure,
  OlderAdultFigure,
  PregnancyFigure,
} from './icons/PersonaFigures';

const FIGURES = {
  children: ChildFigure,
  teens: TeenFigure,
  adults: AdultFigure,
  'older-adults': OlderAdultFigure,
  pregnancy: PregnancyFigure,
};

const BULLET_ICONS = [Check, Heart, CalendarCheck];

/**
 * Upgrades AgeGroupTabs: a row of tappable flat-SVG figures (instead of
 * emoji chips) with a focus line + 3 icon bullets, and a "see all N tips"
 * disclosure that reveals the rest of the group's tips (exact sourced copy,
 * same shape as `preventionByAge`).
 */
export const AgePersonaSelector = ({ groups = [] }) => {
  const [activeId, setActiveId] = useState(groups[0]?.id);
  const [showAll, setShowAll] = useState(false);
  const active = groups.find((g) => g.id === activeId) || groups[0];

  useEffect(() => {
    setShowAll(false);
  }, [activeId]);

  if (!groups.length) return null;

  const tips = active.tips || [];
  const previewTips = tips.slice(0, 3);
  const restTips = tips.slice(3);

  return (
    <div className="flex flex-col gap-4">
      {/* Persona row */}
      <div className="flex justify-between gap-1 px-1">
        {groups.map((g) => {
          const Figure = FIGURES[g.id] || AdultFigure;
          const isActive = g.id === active.id;
          return (
            <motion.button
              key={g.id}
              type="button"
              onClick={() => setActiveId(g.id)}
              whileTap={{ scale: 0.95 }}
              animate={{ y: isActive ? -2 : 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="flex flex-col items-center gap-1.5 flex-1"
            >
              <span
                className={`relative flex items-center justify-center w-11 h-14 rounded-custom-sm border transition-colors
                  ${isActive
                    ? 'bg-brand-red/10 border-brand-red text-brand-red-light'
                    : 'bg-app-surface border-app-border/40 text-app-muted'}
                `}
              >
                <Figure size={26} />
              </span>
              <span
                className={`text-[9.5px] font-bold text-center leading-tight ${
                  isActive ? 'text-app-ink' : 'text-app-muted'
                }`}
              >
                {g.label.split(' ')[0]}
              </span>
            </motion.button>
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
          className="bg-app-surface border border-app-border/60 rounded-custom-lg p-4 flex flex-col gap-3 shadow-card"
        >
          {active.focus && (
            <div className="flex items-start gap-2 bg-brand-orange/10 border border-brand-orange/20 rounded-custom-sm p-3">
              <span className="text-lg leading-none">{active.icon}</span>
              <div className="flex flex-col gap-0.5">
                <span className="text-[9px] font-bold uppercase tracking-wider text-brand-orange">
                  What matters most
                </span>
                <p className="font-serif text-sm text-app-ink leading-relaxed">{active.focus}</p>
              </div>
            </div>
          )}

          <ul className="flex flex-col gap-2.5">
            {previewTips.map((tip, i) => {
              const BulletIcon = BULLET_ICONS[i % BULLET_ICONS.length];
              return (
                <li key={i} className="flex items-start gap-2.5">
                  <BulletIcon size={15} className="text-brand-teal flex-shrink-0 mt-0.5" />
                  <span className="text-xs text-app-ink leading-relaxed">{tip}</span>
                </li>
              );
            })}
          </ul>

          {restTips.length > 0 && (
            <>
              <button
                type="button"
                onClick={() => setShowAll((s) => !s)}
                className="flex items-center gap-1 text-[11px] font-bold text-brand-red-mid select-none self-start"
              >
                {showAll ? 'Show fewer tips' : `See all ${tips.length} tips for this stage`}
                <ChevronDown size={13} className={`transition-transform ${showAll ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence initial={false}>
                {showAll && (
                  <motion.ul
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden flex flex-col gap-2.5"
                  >
                    {restTips.map((tip, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <Check size={15} className="text-brand-teal flex-shrink-0 mt-0.5" />
                        <span className="text-xs text-app-soft leading-relaxed">{tip}</span>
                      </li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
export default AgePersonaSelector;

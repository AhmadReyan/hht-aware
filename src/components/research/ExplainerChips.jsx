import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Plain-language glossary — tap a term to reveal a jargon-free explanation.
 * Helps non-technical readers decode words they'll meet in the feed.
 */
export const ExplainerChips = ({ explainers = [] }) => {
  const [openId, setOpenId] = useState(null);

  if (!explainers.length) return null;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        {explainers.map((ex) => {
          const isOpen = openId === ex.id;
          return (
            <button
              key={ex.id}
              onClick={() => setOpenId(isOpen ? null : ex.id)}
              className={`
                px-3 py-1.5 rounded-custom-pill text-xs font-semibold border transition-all select-none flex items-center gap-1.5
                ${isOpen
                  ? 'bg-brand-teal text-white border-brand-teal'
                  : 'bg-app-dark2 border-app-border/10 text-app-muted hover:text-white'
                }
              `}
            >
              <span>{ex.emoji}</span>
              <span>{ex.term}</span>
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        {openId !== null && (
          <motion.div
            key={openId}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="bg-app-dark2 border border-brand-teal/20 rounded-custom p-4 text-xs text-app-border leading-relaxed"
          >
            {explainers.find((e) => e.id === openId)?.plain}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
export default ExplainerChips;

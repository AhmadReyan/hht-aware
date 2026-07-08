import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ExternalLink, Sparkles } from 'lucide-react';
import { Badge } from '../ui/Badge';

const stageStyles = {
  Approved: 'teal',
  'In trials': 'orange',
  'Early research': 'default',
  Guideline: 'red',
  News: 'dark',
};

export const ResearchCard = ({ update, isNew = false, onOpen }) => {
  const [expanded, setExpanded] = useState(false);
  const { emoji, category, title, plain, whyItMatters, stage, source, url, date } = update;

  const toggle = () => {
    const next = !expanded;
    setExpanded(next);
    if (next && onOpen) onOpen(update.id);
  };

  const prettyDate = () => {
    if (!date) return '';
    const [y, m] = String(date).split('-');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return m ? `${months[Number(m) - 1] || ''} ${y}` : y;
  };

  return (
    <motion.div
      whileTap={{ scale: 0.99 }}
      onClick={toggle}
      className="relative overflow-hidden bg-app-dark2 border border-app-border/10 rounded-custom p-4 flex flex-col gap-3 cursor-pointer hover:border-brand-red-mid/20 transition-all select-none"
    >
      {isNew && (
        <span className="absolute top-3 right-3 flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-brand-red-mid">
          <span className="w-1.5 h-1.5 bg-brand-red-mid rounded-full animate-ping" />
          New
        </span>
      )}

      <div className="flex items-start gap-3 pr-10">
        <span className="text-2xl leading-none flex-shrink-0">{emoji || '🔬'}</span>
        <div className="flex flex-col gap-1.5 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <Badge variant="red" size="sm">{category}</Badge>
            {stage && <Badge variant={stageStyles[stage] || 'default'} size="sm">{stage}</Badge>}
            {date && <span className="text-[9px] text-app-muted italic">{prettyDate()}</span>}
          </div>
          <h3 className="font-sans font-bold text-sm text-white leading-snug">{title}</h3>
        </div>
      </div>

      <p className="text-xs text-app-soft leading-relaxed">{plain}</p>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden flex flex-col gap-3"
          >
            {whyItMatters && (
              <div className="flex gap-2 bg-brand-teal/10 border border-brand-teal/20 rounded-custom-sm p-3">
                <Sparkles size={15} className="text-brand-teal flex-shrink-0 mt-0.5" />
                <div className="flex flex-col gap-0.5">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-brand-teal">Why it matters for you</span>
                  <p className="text-xs text-app-soft leading-relaxed">{whyItMatters}</p>
                </div>
              </div>
            )}
            {url && (
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1.5 text-[11px] font-bold text-brand-teal hover:underline"
              >
                <ExternalLink size={12} />
                Read the source{source ? ` · ${source}` : ''}
              </a>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex justify-between items-center border-t border-app-border/5 pt-2 mt-0.5">
        <span className="text-[9px] text-app-muted italic truncate pr-2">
          {source ? `Source: ${source}` : 'Verified update'}
        </span>
        <ChevronDown
          size={16}
          className={`text-app-muted transition-transform flex-shrink-0 ${expanded ? 'rotate-180' : ''}`}
        />
      </div>
    </motion.div>
  );
};
export default ResearchCard;

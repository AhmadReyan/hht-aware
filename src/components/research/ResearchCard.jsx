import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ExternalLink, Sparkles, Bookmark, Baby } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { useAppStore } from '../../store/useAppStore';
import { haptics } from '../../hooks/useHaptics';
import { deriveSimpleSummary } from './researchText';
import { ReactionRow } from './ReactionRow';

const stageStyles = {
  Approved: 'teal',
  'In trials': 'orange',
  'Early research': 'default',
  Guideline: 'red',
  News: 'dark',
};

export const ResearchCard = ({ update, isNew = false, onOpen }) => {
  const [expanded, setExpanded] = useState(false);
  const [simple, setSimple] = useState(false);
  const { emoji, category, title, plain, whyItMatters, stage, source, url, date } = update;

  const saved = useAppStore((s) => s.savedForAppt.includes(update.id));
  const toggleSavedForAppt = useAppStore((s) => s.toggleSavedForAppt);

  const toggle = () => {
    const next = !expanded;
    setExpanded(next);
    if (next && onOpen) onOpen(update.id);
  };

  const handleSave = (e) => {
    e.stopPropagation();
    toggleSavedForAppt(update.id);
    if (saved) haptics.warning();
    else haptics.success();
  };

  const handleSimple = (e) => {
    e.stopPropagation();
    setSimple((s) => !s);
    haptics.tap();
  };

  const summary = simple ? deriveSimpleSummary(update) : plain;

  const prettyDate = () => {
    if (!date) return '';
    const [y, m] = String(date).split('-');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return m ? `${months[Number(m) - 1] || ''} ${y}` : y;
  };

  return (
    <motion.div
      whileTap={{ scale: 0.995 }}
      onClick={toggle}
      className={`relative overflow-hidden bg-app-dark2 border rounded-custom p-4 flex flex-col gap-3 cursor-pointer transition-all select-none
        ${saved ? 'border-brand-teal/40' : 'border-app-border/10 hover:border-brand-red-mid/20'}`}
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
          <h3 className="font-sans font-bold text-sm text-app-ink leading-snug">{title}</h3>
        </div>
      </div>

      <p className="text-xs text-app-soft leading-relaxed">{summary}</p>

      {/* Quick actions: explain simply + save */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={handleSimple}
          aria-pressed={simple}
          className={`flex items-center gap-1.5 min-h-[44px] px-3 rounded-custom-pill text-[11px] font-bold border transition-all active:scale-95 select-none
            ${simple
              ? 'bg-brand-orange/20 border-brand-orange/50 text-brand-orange'
              : 'bg-app-dark border-app-border/10 text-app-muted hover:text-white'}`}
        >
          <Baby size={13} />
          {simple ? 'Simplest' : 'Explain simply'}
        </button>
        <button
          type="button"
          onClick={handleSave}
          aria-pressed={saved}
          aria-label={saved ? 'Remove from appointment list' : 'Save for my appointment'}
          className={`flex items-center gap-1.5 min-h-[44px] px-3 rounded-custom-pill text-[11px] font-bold border transition-all active:scale-95 select-none
            ${saved
              ? 'bg-brand-teal/20 border-brand-teal/50 text-brand-teal'
              : 'bg-app-dark border-app-border/10 text-app-muted hover:text-white'}`}
        >
          <Bookmark size={13} className={saved ? 'fill-current' : ''} />
          {saved ? 'Saved' : 'Save'}
        </button>
      </div>

      <ReactionRow updateId={update.id} />

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

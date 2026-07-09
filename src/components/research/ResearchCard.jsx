import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ExternalLink, Sparkles, Bookmark, Baby } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { haptics } from '../../hooks/useHaptics';
import { deriveSimpleSummary } from './researchText';
import { ReactionRow } from './ReactionRow';

/**
 * Stage → soft warm pill styling. Approved/verified reads teal, guidelines &
 * treatments read garnet, everything else a neutral porcelain pill.
 */
const stageTone = {
  Approved: 'bg-teal-soft text-brand-teal',
  'In trials': 'bg-rose text-garnet',
  'Early research': 'bg-app-surface2 text-app-muted border border-line',
  Guideline: 'bg-rose text-garnet',
  News: 'bg-app-surface2 text-app-muted border border-line',
};

const Pill = ({ children, className = '' }) => (
  <span
    className={`inline-flex items-center rounded-custom-pill px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${className}`}
  >
    {children}
  </span>
);

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
      className={`relative overflow-hidden rounded-custom bg-app-surface p-4 flex flex-col gap-3 cursor-pointer transition-all select-none shadow-card border
        ${saved ? 'border-brand-teal/40' : 'border-line'}`}
    >
      {isNew && (
        <span className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-custom-pill bg-gold/20 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-gold">
          <span className="w-1.5 h-1.5 rounded-full bg-gold animate-ping" />
          New
        </span>
      )}

      <div className="flex items-start gap-3 pr-12">
        <span className="text-2xl leading-none flex-shrink-0">{emoji || '🔬'}</span>
        <div className="flex flex-col gap-1.5 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <Pill className="bg-rose text-garnet">{category}</Pill>
            {stage && <Pill className={stageTone[stage] || stageTone.News}>{stage}</Pill>}
            {date && <span className="text-[10px] text-app-muted italic">{prettyDate()}</span>}
          </div>
          <h3 className="font-serif font-extrabold text-[15px] text-app-ink leading-snug">{title}</h3>
        </div>
      </div>

      <p className="text-xs text-app-soft leading-relaxed">{summary}</p>

      {/* Quick actions: explain simply + save */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={handleSimple}
          aria-pressed={simple}
          className={`flex items-center gap-1.5 min-h-[36px] px-3 rounded-custom-pill text-[11px] font-bold border transition-all active:scale-95 select-none
            ${simple
              ? 'bg-gold/15 border-gold/40 text-gold'
              : 'bg-app-surface2 border-line text-app-muted'}`}
        >
          <Baby size={13} />
          {simple ? 'Simplest' : 'Explain simply'}
        </button>
        <button
          type="button"
          onClick={handleSave}
          aria-pressed={saved}
          aria-label={saved ? 'Remove from appointment list' : 'Save for my appointment'}
          className={`flex items-center gap-1.5 min-h-[36px] px-3 rounded-custom-pill text-[11px] font-bold border transition-all active:scale-95 select-none
            ${saved
              ? 'bg-teal-soft border-brand-teal/40 text-brand-teal'
              : 'bg-app-surface2 border-line text-app-muted'}`}
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
              <div className="flex gap-2 bg-teal-soft rounded-custom-sm p-3">
                <Sparkles size={15} className="text-brand-teal flex-shrink-0 mt-0.5" />
                <div className="flex flex-col gap-0.5">
                  <span className="text-[9px] font-bold uppercase tracking-wide text-brand-teal">Why it matters for you</span>
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

      <div className="flex justify-between items-center border-t border-line pt-2 mt-0.5">
        <span className="text-[10px] text-app-muted italic truncate pr-2">
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

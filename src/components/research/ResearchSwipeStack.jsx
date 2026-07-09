import React, { useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { Bookmark, X, Sparkles, Baby } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { haptics } from '../../hooks/useHaptics';
import { spring } from '../../lib/motion';
import { deriveSimpleSummary } from './researchText';
import { ReactionRow } from './ReactionRow';

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

const SWIPE_THRESHOLD = 90;

/**
 * The top card of the "This Week in Science" stack. Draggable left/right:
 *   - drag RIGHT past threshold  → onSave  (save for appointment, success haptic)
 *   - drag LEFT past threshold   → onDismiss (mark seen, tap haptic)
 * On-card buttons trigger the same actions for accessibility (swipe is not
 * the only path). Cards behind peek through with a subtle scale/offset.
 */
const TopCard = ({ update, onSave, onDismiss }) => {
  const [simple, setSimple] = useState(false);
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-220, 0, 220], [-12, 0, 12]);
  const saveOpacity = useTransform(x, [20, 120], [0, 1]);
  const dismissOpacity = useTransform(x, [-120, -20], [1, 0]);

  const summary = simple ? deriveSimpleSummary(update) : update.plain;

  const handleDragEnd = (_e, info) => {
    if (info.offset.x > SWIPE_THRESHOLD) {
      onSave(update.id, 'right');
    } else if (info.offset.x < -SWIPE_THRESHOLD) {
      onDismiss(update.id, 'left');
    }
  };

  return (
    <motion.div
      className="absolute inset-0"
      style={{ x, rotate }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.7}
      onDragEnd={handleDragEnd}
      initial={{ scale: 0.96, y: 8, opacity: 0 }}
      animate={{ scale: 1, y: 0, opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={spring.soft}
      whileTap={{ cursor: 'grabbing' }}
    >
      <div className="relative h-full overflow-hidden rounded-custom-lg bg-app-surface border border-line shadow-raised p-5 flex flex-col gap-3 cursor-grab active:cursor-grabbing">
        {/* Swipe intent overlays */}
        <motion.div
          style={{ opacity: saveOpacity }}
          className="absolute top-4 left-4 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-custom-pill bg-brand-teal text-white text-[11px] font-bold uppercase tracking-wide rotate-[-8deg] pointer-events-none"
        >
          <Bookmark size={13} /> Save
        </motion.div>
        <motion.div
          style={{ opacity: dismissOpacity }}
          className="absolute top-4 right-4 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-custom-pill bg-garnet text-white text-[11px] font-bold uppercase tracking-wide rotate-[8deg] pointer-events-none"
        >
          Skip <X size={13} />
        </motion.div>

        <div className="relative z-10 flex flex-col gap-3 flex-1 overflow-hidden">
          <div className="flex items-start gap-3">
            <span className="text-3xl leading-none flex-shrink-0">{update.emoji || '🔬'}</span>
            <div className="flex flex-col gap-1.5">
              <div className="flex flex-wrap items-center gap-1.5">
                <Pill className="bg-rose text-garnet">{update.category}</Pill>
                {update.stage && (
                  <Pill className={stageTone[update.stage] || stageTone.News}>{update.stage}</Pill>
                )}
              </div>
              <h3 className="font-serif text-lg font-extrabold text-app-ink leading-tight">{update.title}</h3>
            </div>
          </div>

          <p className="text-xs text-app-soft leading-relaxed flex-1 overflow-y-auto pr-1">
            {summary}
          </p>

          {/* Explain simply toggle */}
          <button
            type="button"
            onClick={() => { setSimple((s) => !s); haptics.tap(); }}
            className={`self-start flex items-center gap-1.5 min-h-[36px] px-3 rounded-custom-pill text-[11px] font-bold border transition-all active:scale-95 select-none
              ${simple
                ? 'bg-gold/15 border-gold/40 text-gold'
                : 'bg-app-surface2 border-line text-app-muted'}`}
          >
            <Baby size={13} />
            {simple ? 'Showing simplest' : 'Explain simply'}
          </button>

          <ReactionRow updateId={update.id} />
        </div>

        {/* On-card action buttons (accessibility — not swipe-only) */}
        <div className="relative z-10 flex items-center gap-2 pt-1">
          <button
            type="button"
            onClick={() => onDismiss(update.id, 'left')}
            aria-label="Skip this update"
            className="flex-1 min-h-[44px] flex items-center justify-center gap-1.5 rounded-custom-pill bg-app-surface2 border border-line text-app-soft text-xs font-bold active:scale-95 transition-all"
          >
            <X size={15} /> Skip
          </button>
          <button
            type="button"
            onClick={() => onSave(update.id, 'right')}
            aria-label="Save this update for my appointment"
            className="flex-1 min-h-[44px] flex items-center justify-center gap-1.5 rounded-custom-pill bg-brand-teal text-white text-xs font-bold active:scale-95 transition-all shadow-card"
          >
            <Bookmark size={15} /> Save
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export const ResearchSwipeStack = ({ items = [], onSave, onDismiss }) => {
  // We render the top card + a peek of the next two for depth.
  const visible = items.slice(0, 3);

  const handleSave = (id) => {
    haptics.success();
    onSave?.(id);
  };
  const handleDismiss = (id) => {
    haptics.tap();
    onDismiss?.(id);
  };

  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-center justify-between px-1">
        <h2 className="font-serif text-base font-extrabold text-app-ink flex items-center gap-1.5">
          <Sparkles size={16} className="text-garnet" />
          This Week in Science
        </h2>
        {items.length > 0 && (
          <span className="text-[10px] font-bold text-app-muted">{items.length} to sort</span>
        )}
      </div>

      <AnimatePresence mode="popLayout">
        {visible.length > 0 ? (
          <motion.div
            key="stack"
            layout
            className="relative w-full"
            style={{ height: 320 }}
          >
            {/* Under-cards (peek) — rendered back-to-front */}
            {visible.slice(1).reverse().map((u, idx) => {
              const depth = visible.slice(1).length - idx; // 2 or 1
              return (
                <div
                  key={u.id}
                  className="absolute inset-0 rounded-custom-lg bg-app-surface border border-line shadow-card"
                  style={{
                    transform: `scale(${1 - depth * 0.04}) translateY(${depth * 10}px)`,
                    opacity: 1 - depth * 0.25,
                    zIndex: 0,
                  }}
                />
              );
            })}
            <AnimatePresence initial={false}>
              <TopCard
                key={visible[0].id}
                update={visible[0]}
                onSave={handleSave}
                onDismiss={handleDismiss}
              />
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-custom-lg bg-teal-soft p-6 text-center flex flex-col items-center gap-2"
          >
            <span className="text-3xl">🎉</span>
            <p className="text-sm font-extrabold text-app-ink font-serif">You&rsquo;re all caught up!</p>
            <p className="text-xs text-app-soft leading-relaxed">
              You&rsquo;ve sorted this week&rsquo;s science. Explore the full feed below, or check your
              saved list for your next appointment.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {visible.length > 0 && (
        <p className="text-[10px] text-app-muted text-center px-4 leading-relaxed">
          Swipe right to save for your appointment · left to skip. Or use the buttons.
        </p>
      )}
    </div>
  );
};
export default ResearchSwipeStack;

import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import { haptics } from '../../hooks/useHaptics';
import { REACTIONS } from './researchText';

/**
 * Small emoji-reaction row for a single research update. Reads/writes the
 * shared Zustand store so the chosen reaction stays consistent everywhere
 * the same update shows up (swipe stack, feed list).
 */
export const ReactionRow = ({ updateId, className = '' }) => {
  const reaction = useAppStore((s) => s.researchReactions[updateId] || null);
  const toggleReaction = useAppStore((s) => s.toggleReaction);

  return (
    <div
      className={`flex flex-wrap items-center gap-1.5 ${className}`}
      onClick={(e) => e.stopPropagation()}
    >
      {REACTIONS.map((r) => {
        const active = reaction === r.key;
        return (
          <button
            key={r.key}
            type="button"
            onClick={() => {
              toggleReaction(updateId, r.key);
              haptics.tap();
            }}
            aria-pressed={active}
            aria-label={r.label}
            className={`
              flex items-center gap-1 min-h-[44px] px-2.5 rounded-custom-pill text-[11px] font-semibold border transition-all select-none active:scale-95
              ${active
                ? 'bg-brand-teal/20 border-brand-teal/50 text-brand-teal'
                : 'bg-app-dark2 border-app-border/10 text-app-muted hover:text-white'
              }
            `}
          >
            <span className="text-sm leading-none">{r.emoji}</span>
            <span>{r.label}</span>
          </button>
        );
      })}
    </div>
  );
};
export default ReactionRow;

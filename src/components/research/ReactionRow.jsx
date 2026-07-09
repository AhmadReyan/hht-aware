import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import { haptics } from '../../hooks/useHaptics';
import { REACTIONS } from './researchText';

/**
 * Small emoji-reaction row for a single research update. Reads/writes the
 * shared Zustand store so the chosen reaction stays consistent everywhere
 * the same update shows up (swipe stack, feed list). Warm-editorial styling:
 * a soft teal wash when active, hairline white pill otherwise.
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
              flex items-center gap-1 min-h-[36px] px-2.5 rounded-custom-pill text-[11px] font-semibold border transition-all select-none active:scale-95
              ${active
                ? 'bg-teal-soft border-brand-teal/40 text-brand-teal'
                : 'bg-app-surface2 border-line text-app-muted'
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

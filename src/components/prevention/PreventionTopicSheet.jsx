import React, { useState, useEffect } from 'react';
import { Check, ChevronRight } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Badge } from '../ui/Badge';
import { TOPIC_ICONS, TOPIC_ACCENTS } from './topicVisuals';
import { NoseDropletIcon } from './icons/NoseDropletIcon';

const ACCENT_STYLES = {
  red: 'bg-brand-red/10 border-brand-red/25 text-brand-red-light',
  orange: 'bg-brand-orange/10 border-brand-orange/25 text-brand-orange',
  teal: 'bg-brand-teal/10 border-brand-teal/25 text-brand-teal',
};

/**
 * Bottom sheet opened from a TopicTile. Visual-first layer is the icon +
 * summary + a few icon bullets (tip titles only); the exact sourced
 * tip-by-tip markup (title + body + tag + source) — the same content that
 * used to live in the always-open accordion — sits behind a single
 * "Read the full detail" disclosure so nothing sourced is lost.
 */
export const PreventionTopicSheet = ({ category, isOpen, onClose }) => {
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (!isOpen) setExpanded(false);
  }, [isOpen, category?.id]);

  if (!category) return null;

  const Icon = TOPIC_ICONS[category.id] || NoseDropletIcon;
  const accent = TOPIC_ACCENTS[category.id] || 'red';
  const accentStyle = ACCENT_STYLES[accent] || ACCENT_STYLES.red;
  const tips = category.tips || [];
  const bulletTips = tips.slice(0, 4);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={category.title}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col items-center gap-2 -mt-1">
          <span className={`w-14 h-14 flex items-center justify-center rounded-full border ${accentStyle}`}>
            {Icon && <Icon size={28} />}
          </span>
          <p className="text-xs text-app-soft text-center leading-relaxed px-2">
            {category.summary}
          </p>
        </div>

        <ul className="flex flex-col gap-2.5">
          {bulletTips.map((tip, i) => (
            <li key={i} className="flex items-start gap-2.5">
              <Check size={15} className="text-brand-teal flex-shrink-0 mt-0.5" />
              <span className="text-xs text-app-ink leading-relaxed">{tip.title}</span>
            </li>
          ))}
        </ul>

        {!expanded ? (
          <button
            type="button"
            onClick={() => setExpanded(true)}
            className="flex items-center gap-1 text-xs font-bold text-brand-red-mid select-none"
          >
            Read the full detail
            <ChevronRight size={14} />
          </button>
        ) : (
          <div className="flex flex-col gap-3">
            {tips.map((tip, i) => (
              <div
                key={i}
                className="bg-app-surface2 border border-app-border/40 rounded-custom-sm p-3.5 flex flex-col gap-1.5"
              >
                <div className="flex justify-between items-start gap-2">
                  <h4 className="font-sans font-bold text-xs text-brand-red-light leading-snug">
                    {tip.title}
                  </h4>
                  {tip.tag && (
                    <Badge variant="teal" size="sm" className="flex-shrink-0">{tip.tag}</Badge>
                  )}
                </div>
                <p className="text-[11px] text-app-soft leading-relaxed">{tip.body}</p>
                {tip.src && (
                  <span className="text-[9px] text-app-muted italic mt-0.5">Source: {tip.src}</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
};
export default PreventionTopicSheet;

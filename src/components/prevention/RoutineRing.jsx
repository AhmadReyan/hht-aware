import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Coffee, Moon, Repeat, ChevronDown } from 'lucide-react';

// Matches the existing `everydayRoutine` block order/labels from
// src/data/prevention.js, paired with the ring's 4-color coding.
const SEGMENTS = [
  { time: 'Morning', icon: Sun, color: 'var(--teal)', className: 'text-brand-teal' },
  { time: 'Daytime', icon: Coffee, color: 'var(--orange)', className: 'text-brand-orange' },
  { time: 'Evening', icon: Moon, color: 'var(--red-mid)', className: 'text-brand-red-mid' },
  { time: 'Ongoing', icon: Repeat, color: 'var(--red)', className: 'text-brand-red' },
];

// Trims a long sourced sentence down to its lead clause (first clause before
// a strong delimiter), then to a max word count, for the glanceable views.
// Nothing is lost — the full sentence is always still reachable via the
// "See all details" disclosure.
const shortPhrase = (text = '', maxWords = 6) => {
  if (!text) return '';
  const clause = text.split(/ — |: | \(|, /)[0].trim();
  const words = clause.split(' ');
  if (words.length <= maxWords) return clause.replace(/[.,;:]$/, '');
  return `${words.slice(0, maxWords).join(' ')}…`;
};

/**
 * Segmented daily-rhythm ring — the flagship replacement for the plain
 * RoutineTimeline list. Tapping a segment (icon button or arc) cross-fades
 * the center label, shows one short serif "headline" line for that segment,
 * a few dot-bullet phrases, and a "See all details" disclosure that reveals
 * the exact sourced copy for every item in that time block.
 */
export const RoutineRing = ({ routine = [], className = '' }) => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    setShowAll(false);
  }, [activeIdx]);

  if (!routine.length) return null;

  const size = 200;
  const cx = size / 2;
  const cy = size / 2;
  const r = 78;
  const strokeWidth = 14;
  const circumference = 2 * Math.PI * r;
  const quarter = circumference / 4;
  const gap = 8;
  const segLen = quarter - gap;

  const safeIdx = activeIdx % routine.length;
  const activeBlock = routine[safeIdx];
  const activeMeta = SEGMENTS[safeIdx % SEGMENTS.length];
  const ActiveIcon = activeMeta.icon;

  const items = activeBlock.items || [];
  const headline = shortPhrase(items[0], 9);
  const bulletItems = items.slice(1, 4).map((it) => shortPhrase(it, 6));

  return (
    <div className={`flex flex-col items-center gap-4 ${className}`}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <g transform={`rotate(-90 ${cx} ${cy})`}>
            {/* Track */}
            <circle
              cx={cx}
              cy={cy}
              r={r}
              fill="none"
              stroke="var(--border)"
              strokeWidth={strokeWidth}
              opacity={0.35}
            />
            {routine.map((block, i) => {
              const meta = SEGMENTS[i % SEGMENTS.length];
              const isActive = i === safeIdx;
              return (
                <motion.circle
                  key={block.time}
                  cx={cx}
                  cy={cy}
                  r={r}
                  fill="none"
                  stroke={meta.color}
                  strokeWidth={strokeWidth}
                  strokeLinecap="round"
                  strokeDasharray={`${segLen} ${circumference - segLen}`}
                  strokeDashoffset={-(i * quarter + gap / 2)}
                  initial={false}
                  animate={{
                    opacity: isActive ? 1 : 0.55,
                    strokeWidth: isActive ? strokeWidth + 3 : strokeWidth,
                  }}
                  transition={{ type: 'spring', stiffness: 260, damping: 24 }}
                  style={{ cursor: 'pointer' }}
                  onClick={() => setActiveIdx(i)}
                />
              );
            })}
          </g>
        </svg>

        {/* Segment icon buttons positioned around the ring */}
        {routine.map((block, i) => {
          const meta = SEGMENTS[i % SEGMENTS.length];
          const Icon = meta.icon;
          const angleDeg = i * 90 + 45;
          const rad = (angleDeg * Math.PI) / 180;
          const x = cx + r * Math.sin(rad);
          const y = cy - r * Math.cos(rad);
          const isActive = i === safeIdx;
          return (
            <button
              key={block.time}
              type="button"
              aria-label={`Show ${block.time} routine`}
              onClick={() => setActiveIdx(i)}
              className={`absolute flex items-center justify-center w-7 h-7 rounded-full border transition-colors
                ${isActive ? 'bg-app-surface2 border-app-border scale-110' : 'bg-app-surface border-app-border/40'}
              `}
              style={{ left: x - 14, top: y - 14 }}
            >
              <Icon size={14} className={meta.className} />
            </button>
          );
        })}

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 px-8 text-center pointer-events-none">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeBlock.time}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col items-center gap-1"
            >
              <ActiveIcon size={18} className={activeMeta.className} />
              <span className="font-sans font-bold text-[11px] uppercase tracking-wider text-app-ink">
                {activeBlock.time}
              </span>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* One short headline line */}
      <AnimatePresence mode="wait">
        <motion.p
          key={`${activeBlock.time}-line`}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2 }}
          className="font-serif text-lg text-app-ink text-center leading-snug px-2"
        >
          {headline}
        </motion.p>
      </AnimatePresence>

      {/* Dot bullets */}
      {bulletItems.length > 0 && (
        <ul className="flex flex-col gap-1.5 w-full max-w-xs">
          {bulletItems.map((phrase, i) => (
            <li key={i} className="flex items-start gap-2 text-xs text-app-soft leading-relaxed">
              <span
                className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${activeMeta.className.replace('text-', 'bg-')}`}
              />
              <span>{phrase}</span>
            </li>
          ))}
        </ul>
      )}

      <button
        type="button"
        onClick={() => setShowAll((s) => !s)}
        className="text-[11px] font-bold text-brand-red-mid flex items-center gap-1 select-none"
      >
        See all details
        <ChevronDown size={13} className={`transition-transform ${showAll ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence initial={false}>
        {showAll && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden w-full"
          >
            <ul className="flex flex-col gap-2 bg-app-surface2 border border-app-border/40 rounded-custom-sm p-3.5 mt-1">
              {items.map((item, i) => (
                <li key={i} className="text-[11px] text-app-soft leading-relaxed flex gap-1.5">
                  <span className="text-brand-red-mid">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
export default RoutineRing;

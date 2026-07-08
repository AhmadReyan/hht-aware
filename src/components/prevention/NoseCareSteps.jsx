import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronDown, Hand } from 'lucide-react';

const AUTO_ADVANCE_MS = 4000;

const MoisturizeIllustration = () => (
  <svg width="88" height="88" viewBox="0 0 88 88" fill="none">
    <path
      d="M34 22c-5 9-11 19-11 30a11 11 0 0 0 22 0c0-5-2-9-4-14"
      stroke="var(--teal)"
      strokeWidth="3"
      strokeLinecap="round"
    />
    <motion.path
      d="M44 10c4 6 8 11 8 16a8 8 0 1 1-16 0c0-5 4-10 8-16Z"
      fill="var(--teal)"
      animate={{ y: [0, 26, 0], opacity: [1, 0.6, 1] }}
      transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
    />
  </svg>
);

const HandsOffIllustration = () => (
  <div className="relative w-[88px] h-[88px] flex items-center justify-center">
    <motion.div
      animate={{ rotate: [-6, 6, -6] }}
      transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
    >
      <Hand size={48} className="text-brand-orange" />
    </motion.div>
    <svg width="88" height="88" viewBox="0 0 88 88" className="absolute inset-0" fill="none">
      <circle cx="44" cy="44" r="30" stroke="var(--red-mid)" strokeWidth="3" fill="none" opacity="0.85" />
      <line x1="24" y1="64" x2="64" y2="24" stroke="var(--red-mid)" strokeWidth="3" strokeLinecap="round" opacity="0.85" />
    </svg>
  </div>
);

const BleedIllustration = () => (
  <svg width="88" height="88" viewBox="0 0 88 88" fill="none">
    <line x1="20" y1="74" x2="68" y2="74" stroke="var(--border)" strokeWidth="3" strokeLinecap="round" />
    <motion.g
      initial={{ rotate: 0 }}
      animate={{ rotate: -8 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      style={{ transformOrigin: '44px 60px' }}
    >
      <circle cx="46" cy="30" r="8" fill="var(--red-mid)" />
      <path d="M38 40c-4 8-6 16-6 26" stroke="var(--red-mid)" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M52 40c3 6 4 12 3 20" stroke="var(--red-mid)" strokeWidth="3" strokeLinecap="round" fill="none" />
      <circle cx="40" cy="30" r="3.2" fill="var(--red)" />
    </motion.g>
  </svg>
);

const ILLUSTRATIONS = {
  moisturize: MoisturizeIllustration,
  handsOff: HandsOffIllustration,
  bleed: BleedIllustration,
};

/**
 * "Nose care in 3 steps" — a small animated mini-guide. Advances on tap
 * (progress dots or Next arrow) or auto-advances every 4s, pausing as soon
 * as the user interacts with the card. Each step shows one derived line;
 * the exact sourced tip body sits behind a "Why this helps" disclosure.
 */
export const NoseCareSteps = ({ steps = [] }) => {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [showWhy, setShowWhy] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    setShowWhy(false);
  }, [index]);

  useEffect(() => {
    if (paused || steps.length <= 1) return undefined;
    timerRef.current = setTimeout(() => {
      setIndex((i) => (i + 1) % steps.length);
    }, AUTO_ADVANCE_MS);
    return () => clearTimeout(timerRef.current);
  }, [index, paused, steps.length]);

  if (!steps.length) return null;

  const step = steps[index];
  const Illustration = ILLUSTRATIONS[step.illustration] || MoisturizeIllustration;

  const goTo = (i) => {
    setPaused(true);
    setIndex(((i % steps.length) + steps.length) % steps.length);
  };

  return (
    <div
      className="flex flex-col items-center gap-3 bg-app-surface border border-app-border/60 rounded-custom-lg p-5 shadow-card"
      onPointerDown={() => setPaused(true)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={`illustration-${index}`}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.25 }}
        >
          <Illustration />
        </motion.div>
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <motion.div
          key={`text-${index}`}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2 }}
          className="flex flex-col items-center gap-1 text-center"
        >
          <span className="text-[10px] font-bold uppercase tracking-wider text-app-muted">
            Step {index + 1} of {steps.length} · {step.title}
          </span>
          <p className="font-serif text-base text-app-ink leading-snug px-2">{step.line}</p>
        </motion.div>
      </AnimatePresence>

      <button
        type="button"
        onClick={() => setShowWhy((s) => !s)}
        className="text-[11px] font-bold text-brand-red-mid flex items-center gap-1 select-none"
      >
        Why this helps
        <ChevronDown size={13} className={`transition-transform ${showWhy ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence initial={false}>
        {showWhy && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden w-full"
          >
            <p className="text-[11px] text-app-soft leading-relaxed text-center px-2">{step.detail}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress dots + next */}
      <div className="flex items-center gap-3 pt-1">
        <div className="flex items-center gap-1.5">
          {steps.map((s, i) => (
            <button
              key={s.title}
              type="button"
              aria-label={`Go to step ${i + 1}`}
              onClick={() => goTo(i)}
              className={`h-2 rounded-full transition-all ${
                i === index ? 'bg-brand-red-mid w-4' : 'bg-app-border w-2'
              }`}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={() => goTo(index + 1)}
          aria-label="Next step"
          className="w-7 h-7 flex items-center justify-center rounded-full bg-app-surface2 border border-app-border/40 text-app-ink"
        >
          <ChevronRight size={15} />
        </button>
      </div>
    </div>
  );
};
export default NoseCareSteps;

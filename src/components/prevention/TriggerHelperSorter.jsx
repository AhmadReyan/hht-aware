import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import { Confetti } from '../challenges/Confetti';

/**
 * "Dry list -> mini-game" fix: tap a chip, then tap the Triggers or Helpers
 * column to assign it. Correct placement animates the chip into the column;
 * incorrect placement shakes the chip and shows a one-line correction pulled
 * from `item.hint`. Finishing the deck fires the existing Confetti burst.
 */
export const TriggerHelperSorter = ({ items = [] }) => {
  const [placed, setPlaced] = useState({}); // id -> 'trigger' | 'helper'
  const [selectedId, setSelectedId] = useState(null);
  const [shakeId, setShakeId] = useState(null);
  const [message, setMessage] = useState(null);
  const [celebrate, setCelebrate] = useState(0);

  const remaining = items.filter((it) => !placed[it.id]);
  const triggerItems = items.filter((it) => placed[it.id] === 'trigger');
  const helperItems = items.filter((it) => placed[it.id] === 'helper');
  const done = items.length > 0 && remaining.length === 0;

  useEffect(() => {
    if (done) setCelebrate((c) => c + 1);
  }, [done]);

  useEffect(() => {
    if (!message) return undefined;
    const t = setTimeout(() => setMessage(null), 2200);
    return () => clearTimeout(t);
  }, [message]);

  const handleAssign = (column) => {
    if (!selectedId) return;
    const item = items.find((it) => it.id === selectedId);
    if (!item) return;

    if (item.correctColumn === column) {
      setPlaced((p) => ({ ...p, [item.id]: column }));
      setSelectedId(null);
      setMessage(null);
    } else {
      setShakeId(item.id);
      setMessage(item.hint);
      setTimeout(() => setShakeId(null), 400);
    }
  };

  const reset = () => {
    setPlaced({});
    setSelectedId(null);
    setMessage(null);
  };

  return (
    <div className="relative flex flex-col gap-3">
      <Confetti trigger={celebrate} />

      {/* Shuffle tray */}
      <div className="flex flex-wrap gap-2 min-h-[2.5rem]">
        {items.length === 0 && (
          <span className="text-xs text-app-muted">No items to sort.</span>
        )}
        <AnimatePresence>
          {remaining.map((item) => {
            const isSelected = item.id === selectedId;
            const isShaking = item.id === shakeId;
            return (
              <motion.button
                key={item.id}
                type="button"
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  x: isShaking ? [-4, 4, -4, 4, 0] : 0,
                }}
                exit={{ opacity: 0, scale: 0.6 }}
                transition={{ duration: isShaking ? 0.4 : 0.2 }}
                onClick={() => {
                  setSelectedId(item.id);
                  setMessage(null);
                }}
                className={`px-3 py-1.5 rounded-custom-pill text-xs font-semibold border select-none transition-colors
                  ${isSelected
                    ? 'bg-brand-red text-white border-brand-red shadow-sm'
                    : 'bg-app-surface border-app-border/40 text-app-ink hover:border-app-border'}
                `}
              >
                {item.label}
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Correction message */}
      <AnimatePresence>
        {message && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="text-[11px] text-brand-orange leading-relaxed px-1"
          >
            {message}
          </motion.p>
        )}
      </AnimatePresence>

      {/* Columns */}
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => handleAssign('trigger')}
          disabled={!selectedId}
          className="flex flex-col gap-2 p-3 bg-brand-red/10 border border-brand-red/25 rounded-custom-lg min-h-[7rem] items-stretch text-left disabled:opacity-90"
        >
          <span className="text-[10px] font-bold uppercase tracking-wider text-brand-red-light">
            Triggers
          </span>
          <div className="flex flex-wrap gap-1.5">
            {triggerItems.map((item) => (
              <motion.span
                key={item.id}
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                className="flex items-center gap-1 px-2 py-1 rounded-custom-pill text-[10.5px] font-semibold bg-app-surface text-app-ink border border-brand-red/20"
              >
                <CheckCircle size={11} className="text-brand-red-light" />
                {item.label}
              </motion.span>
            ))}
          </div>
        </button>

        <button
          type="button"
          onClick={() => handleAssign('helper')}
          disabled={!selectedId}
          className="flex flex-col gap-2 p-3 bg-brand-teal/10 border border-brand-teal/25 rounded-custom-lg min-h-[7rem] items-stretch text-left disabled:opacity-90"
        >
          <span className="text-[10px] font-bold uppercase tracking-wider text-brand-teal">
            Helpers
          </span>
          <div className="flex flex-wrap gap-1.5">
            {helperItems.map((item) => (
              <motion.span
                key={item.id}
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                className="flex items-center gap-1 px-2 py-1 rounded-custom-pill text-[10.5px] font-semibold bg-app-surface text-app-ink border border-brand-teal/20"
              >
                <CheckCircle size={11} className="text-brand-teal" />
                {item.label}
              </motion.span>
            ))}
          </div>
        </button>
      </div>

      {selectedId && (
        <p className="text-[10.5px] text-app-muted text-center">
          Tap Triggers or Helpers to place it.
        </p>
      )}

      {done && (
        <div className="flex flex-col items-center gap-2 pt-1">
          <p className="text-xs font-bold text-brand-teal">Nicely sorted — you&apos;ve got this.</p>
          <button
            type="button"
            onClick={reset}
            className="text-[11px] font-semibold text-app-muted underline underline-offset-2"
          >
            Play again
          </button>
        </div>
      )}
    </div>
  );
};
export default TriggerHelperSorter;

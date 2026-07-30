import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import { Droplet, Minus, Plus, Check, HelpCircle } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { triggerOptions } from '../../data/selfCare';
import { haptics } from '../../hooks/useHaptics';
import { spring } from '../../lib/motion';

/**
 * EpisodeLogger — fast, tactile nosebleed log. Capture duration (minutes),
 * severity (segmented control), optional triggers + note, then Save →
 * store.logEpisode(). Everything is device-local (never synced).
 */

const SEVERITIES = [
  { key: 'mild', label: 'Mild', color: 'var(--teal)' },
  { key: 'moderate', label: 'Moderate', color: 'var(--gold)' },
  { key: 'severe', label: 'Severe', color: 'var(--garnet)' },
];

const DURATION_PRESETS = [5, 10, 15, 30];

export const EpisodeLogger = () => {
  const logEpisode = useAppStore((s) => s.logEpisode);
  const weeklyCount = useAppStore((s) => s.getWeeklyEpisodeCount());

  const [durationMin, setDurationMin] = useState(5);
  const [severity, setSeverity] = useState('mild');
  const [triggers, setTriggers] = useState([]);
  const [note, setNote] = useState('');
  const [justSaved, setJustSaved] = useState(false);

  useEffect(() => {
    if (!justSaved) return undefined;
    const t = setTimeout(() => setJustSaved(false), 1800);
    return () => clearTimeout(t);
  }, [justSaved]);

  const bump = (delta) => {
    haptics.selection();
    setDurationMin((v) => Math.max(0, Math.min(600, (Number(v) || 0) + delta)));
  };

  const toggleTrigger = (key) => {
    setTriggers((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));
  };

  const canSave = durationMin > 0;

  const handleSave = () => {
    if (!canSave) {
      haptics.warning();
      return;
    }
    logEpisode({ durationMin, severity, triggers, note: note.trim() });
    haptics.success();
    setJustSaved(true);
    // Reset for the next quick entry.
    setDurationMin(5);
    setSeverity('mild');
    setTriggers([]);
    setNote('');
  };

  return (
    <section className="relative bg-white border border-line rounded-custom-lg p-5 shadow-card overflow-hidden">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-rose flex items-center justify-center text-garnet shrink-0">
          <Droplet size={20} />
        </div>
        <div className="flex flex-col">
          <h3 className="font-serif text-lg text-app-ink leading-tight">Log a nosebleed</h3>
          <p className="text-[11px] text-app-muted leading-tight">
            {weeklyCount > 0
              ? `${weeklyCount} logged in the last 7 days`
              : 'A few taps builds your pattern over time'}
          </p>
        </div>
      </div>

      {/* Duration stepper */}
      <div className="mb-4">
        <div className="text-[10px] font-bold uppercase tracking-widest text-app-muted mb-2">Duration</div>
        <div className="flex items-center gap-3">
          <motion.button
            type="button"
            whileTap={{ scale: 0.9 }}
            transition={spring.snappy}
            onClick={() => bump(-1)}
            aria-label="Decrease duration"
            className="w-11 h-11 rounded-full bg-app-surface2 border border-line flex items-center justify-center text-app-ink active:bg-rose"
          >
            <Minus size={18} />
          </motion.button>
          <div className="flex-1 text-center">
            <span className="font-serif text-3xl font-extrabold text-app-ink tabular-nums">{durationMin}</span>
            <span className="font-sans text-sm text-app-muted ml-1">min</span>
          </div>
          <motion.button
            type="button"
            whileTap={{ scale: 0.9 }}
            transition={spring.snappy}
            onClick={() => bump(1)}
            aria-label="Increase duration"
            className="w-11 h-11 rounded-full bg-app-surface2 border border-line flex items-center justify-center text-app-ink active:bg-rose"
          >
            <Plus size={18} />
          </motion.button>
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          {DURATION_PRESETS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => { haptics.tap(); setDurationMin(p); }}
              aria-pressed={durationMin === p}
              className="font-sans text-xs font-semibold px-3 py-1.5 rounded-custom-pill transition-colors"
              style={{
                border: `1.5px solid ${durationMin === p ? 'transparent' : 'var(--line)'}`,
                background: durationMin === p ? 'var(--garnet)' : 'var(--surface)',
                color: durationMin === p ? '#fff' : 'var(--ink)',
              }}
            >
              {p}m
            </button>
          ))}
        </div>
      </div>

      {/* Severity segmented control */}
      <div className="mb-4">
        <div className="text-[10px] font-bold uppercase tracking-widest text-app-muted mb-2">Severity</div>
        <div className="flex gap-2 p-1 rounded-custom-pill bg-app-surface2 border border-line">
          {SEVERITIES.map((s) => {
            const active = severity === s.key;
            return (
              <button
                key={s.key}
                type="button"
                onClick={() => { haptics.selection(); setSeverity(s.key); }}
                aria-pressed={active}
                className="relative flex-1 py-2 rounded-custom-pill text-xs font-bold font-sans transition-colors"
                style={{ color: active ? '#fff' : 'var(--muted)' }}
              >
                {active && (
                  <motion.span
                    layoutId="episode-severity-pill"
                    className="absolute inset-0 rounded-custom-pill"
                    style={{ background: s.color }}
                    transition={spring.snappy}
                  />
                )}
                <span className="relative z-10">{s.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Triggers (optional, multi-select) */}
      <div className="mb-4">
        <div className="text-[10px] font-bold uppercase tracking-widest text-app-muted mb-2">
          Triggers <span className="normal-case font-normal tracking-normal">(optional)</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {triggerOptions.map((opt) => {
            const Icon = LucideIcons[opt.icon] || HelpCircle;
            const active = triggers.includes(opt.key);
            return (
              <button
                key={opt.key}
                type="button"
                onClick={() => { haptics.tap(); toggleTrigger(opt.key); }}
                aria-pressed={active}
                className="flex items-center gap-1.5 px-3 py-2 rounded-custom-pill text-xs font-semibold font-sans transition-colors select-none"
                style={{
                  border: `1.5px solid ${active ? 'transparent' : 'var(--line)'}`,
                  background: active ? 'var(--garnet)' : 'var(--surface)',
                  color: active ? '#fff' : 'var(--ink)',
                }}
              >
                <Icon size={13} className={active ? '' : 'text-garnet'} />
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Optional note */}
      <input
        type="text"
        value={note}
        maxLength={120}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Add a note (optional)…"
        className="w-full mb-4 px-3 py-2.5 rounded-custom-sm bg-app-surface2 border border-line text-sm text-app-ink placeholder:text-app-muted focus:outline-none focus:border-garnet"
      />

      <motion.button
        type="button"
        whileTap={canSave ? { scale: 0.97 } : undefined}
        transition={spring.snappy}
        onClick={handleSave}
        disabled={!canSave}
        className="w-full font-sans font-bold rounded-custom py-3 text-sm shadow-sm transition-colors"
        style={{
          background: canSave ? 'var(--garnet)' : 'var(--line)',
          color: canSave ? '#fff' : 'var(--muted)',
          cursor: canSave ? 'pointer' : 'default',
        }}
      >
        Save episode
      </motion.button>

      <AnimatePresence>
        {justSaved && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center gap-2 pointer-events-none"
          >
            <motion.div
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={spring.bouncy}
              className="w-16 h-16 rounded-full bg-teal flex items-center justify-center text-white shadow-glow"
            >
              <Check size={32} />
            </motion.div>
            <span className="font-sans font-bold text-sm text-teal">Episode logged</span>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default EpisodeLogger;

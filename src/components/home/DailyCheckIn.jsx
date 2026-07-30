import React from 'react';
import { motion } from 'framer-motion';
import { SectionTitle } from '../ui/SectionTitle';
import { Chip } from '../ui/Chip';
import { spring } from '../../lib/motion';

const BLEED_OPTIONS = [
  { key: 'none', label: 'No bleeds 🎉' },
  { key: 'nose', label: 'Nose' },
  { key: 'gums', label: 'Gums' },
  { key: 'tongue', label: 'Tongue' },
  { key: 'ear', label: 'Ear' },
  { key: 'other', label: 'Other' },
];

export const DailyCheckIn = ({ logged, selected, onToggle, onLog, currentStreak }) => {
  return (
    <section className="bg-white border border-line rounded-custom-lg p-5 shadow-card">
      <SectionTitle
        kicker="Daily check-in"
        title={logged ? 'Logged — see you tomorrow' : "How’s your body today?"}
      />
      {!logged ? (
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-2">
            {BLEED_OPTIONS.map((o) => (
              <Chip
                key={o.key}
                label={o.label}
                active={selected.includes(o.key)}
                onClick={() => onToggle(o.key)}
                tone={o.key === 'none' ? 'teal' : 'garnet'}
              />
            ))}
          </div>
          <motion.button
            whileTap={selected.length ? { scale: 0.97 } : undefined}
            transition={spring.snappy}
            disabled={!selected.length}
            onClick={onLog}
            className="w-full font-sans font-bold rounded-custom py-3 text-sm transition-colors shadow-sm"
            style={{
              background: selected.length ? 'var(--garnet)' : 'var(--line)',
              color: selected.length ? '#fff' : 'var(--muted)',
              cursor: selected.length ? 'pointer' : 'default',
            }}
          >
            Log Today
          </motion.button>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-teal-soft rounded-custom p-4 font-sans font-bold text-teal flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-lg shadow-sm">
            🔥
          </div>
          <div className="flex flex-col">
            <span className="text-sm">{currentStreak}-day streak</span>
            <span className="text-[11px] opacity-70">Your log helps your doctor identify patterns.</span>
          </div>
        </motion.div>
      )}
    </section>
  );
};

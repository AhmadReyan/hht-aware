import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Pill, Plus, Target } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { ProgressRing } from '../ui/ProgressRing';
import { haptics } from '../../hooks/useHaptics';
import { spring } from '../../lib/motion';

/**
 * IronTracker — this-week iron intake vs a weekly target. Iron replaces the
 * blood HHT nosebleeds cost you, so adherence matters. Quick-add presets +
 * an adjustable weekly target. Device-local only.
 */

const pad2 = (n) => String(n).padStart(2, '0');
const localDate = (d = new Date()) => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;

const IRON_PRESETS = [18, 25, 45, 65];
const TARGET_PRESETS = [90, 126, 175, 245];

export const IronTracker = () => {
  const ironIntake = useAppStore((s) => s.ironIntake);
  const ironTarget = useAppStore((s) => s.ironTarget);
  const addIron = useAppStore((s) => s.addIron);
  const setIronTarget = useAppStore((s) => s.setIronTarget);

  const [editingTarget, setEditingTarget] = useState(false);

  // Sum the last 7 local days.
  let weekTotal = 0;
  for (let i = 0; i < 7; i += 1) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    weekTotal += Number(ironIntake[localDate(d)]) || 0;
  }
  const todayTotal = Number(ironIntake[localDate()]) || 0;
  const pct = ironTarget > 0 ? Math.min(100, Math.round((weekTotal / ironTarget) * 100)) : 0;

  const add = (mg) => {
    haptics.success();
    addIron(mg);
  };

  return (
    <section className="bg-white border border-line rounded-custom-lg p-5 shadow-card">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-teal-soft flex items-center justify-center text-teal shrink-0">
          <Pill size={20} />
        </div>
        <div className="flex flex-col flex-1">
          <h3 className="font-serif text-lg text-app-ink leading-tight">Iron this week</h3>
          <p className="text-[11px] text-app-muted leading-tight">Iron replaces what nosebleeds cost you</p>
        </div>
      </div>

      <div className="flex items-center gap-5">
        <ProgressRing progress={pct} size={92} strokeWidth={9} color="var(--teal)">
          <div className="flex flex-col items-center">
            <span className="font-serif text-xl font-extrabold text-app-ink tabular-nums leading-none">{weekTotal}</span>
            <span className="text-[9px] text-app-muted">/ {ironTarget} mg</span>
          </div>
        </ProgressRing>

        <div className="flex-1">
          <div className="text-[10px] font-bold uppercase tracking-widest text-app-muted mb-2">
            Add today <span className="text-teal">(+{todayTotal} mg)</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {IRON_PRESETS.map((mg) => (
              <motion.button
                key={mg}
                type="button"
                whileTap={{ scale: 0.95 }}
                transition={spring.snappy}
                onClick={() => add(mg)}
                className="flex items-center justify-center gap-1 py-2 rounded-custom-sm bg-app-surface2 border border-line text-sm font-bold text-app-ink active:bg-teal-soft"
              >
                <Plus size={13} className="text-teal" /> {mg} mg
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => { haptics.tap(); setEditingTarget((v) => !v); }}
        className="mt-4 flex items-center gap-1.5 text-[11px] font-bold text-app-muted"
      >
        <Target size={12} className="text-teal" /> Weekly target: {ironTarget} mg
      </button>
      {editingTarget && (
        <div className="flex flex-wrap gap-2 mt-2 rise">
          {TARGET_PRESETS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => { haptics.selection(); setIronTarget(t); }}
              className="px-3 py-1.5 rounded-custom-pill text-xs font-semibold"
              style={{
                border: `1.5px solid ${ironTarget === t ? 'transparent' : 'var(--line)'}`,
                background: ironTarget === t ? 'var(--teal)' : 'var(--surface)',
                color: ironTarget === t ? '#fff' : 'var(--ink)',
              }}
            >
              {t} mg/wk
            </button>
          ))}
        </div>
      )}
    </section>
  );
};

export default IronTracker;

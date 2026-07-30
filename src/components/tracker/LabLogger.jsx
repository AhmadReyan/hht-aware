import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, Check } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { haptics } from '../../hooks/useHaptics';
import { spring } from '../../lib/motion';

/**
 * LabLogger — record hemoglobin / ferritin from lab visits and show the most
 * recent hemoglobin. Anemia from blood loss is the central HHT complication,
 * so tracking it over time is what a specialist wants to see. Device-local.
 */
export const LabLogger = () => {
  const labResults = useAppStore((s) => s.labResults);
  const logLab = useAppStore((s) => s.logLab);

  const [hemoglobin, setHemoglobin] = useState('');
  const [ferritin, setFerritin] = useState('');
  const [open, setOpen] = useState(false);

  // Most recent reading that has a hemoglobin value.
  const withHb = labResults.filter((l) => l.hemoglobin !== null && l.hemoglobin !== undefined);
  const latest = withHb.length ? [...withHb].sort((a, b) => (a.date < b.date ? 1 : -1))[0] : null;

  const canSave = hemoglobin !== '' || ferritin !== '';

  const save = () => {
    if (!canSave) { haptics.warning(); return; }
    logLab({ hemoglobin, ferritin });
    haptics.success();
    setHemoglobin('');
    setFerritin('');
    setOpen(false);
  };

  return (
    <section className="bg-white border border-line rounded-custom-lg p-5 shadow-card">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-rose flex items-center justify-center text-garnet shrink-0">
          <Activity size={20} />
        </div>
        <div className="flex flex-col flex-1">
          <h3 className="font-serif text-lg text-app-ink leading-tight">Bloodwork</h3>
          <p className="text-[11px] text-app-muted leading-tight">
            {latest ? `Latest Hb ${latest.hemoglobin} g/dL · ${latest.date}` : 'Log hemoglobin & ferritin from lab visits'}
          </p>
        </div>
      </div>

      {!open ? (
        <button
          type="button"
          onClick={() => { haptics.tap(); setOpen(true); }}
          className="w-full py-2.5 rounded-custom bg-app-surface2 border border-line text-sm font-bold text-app-ink active:bg-rose"
        >
          + Add a reading
        </button>
      ) : (
        <div className="flex flex-col gap-3 rise">
          <div className="flex gap-3">
            <label className="flex-1 flex flex-col gap-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-app-muted">Hemoglobin (g/dL)</span>
              <input
                type="number"
                inputMode="decimal"
                value={hemoglobin}
                onChange={(e) => setHemoglobin(e.target.value)}
                placeholder="e.g. 12.5"
                className="px-3 py-2.5 rounded-custom-sm bg-app-surface2 border border-line text-sm text-app-ink focus:outline-none focus:border-garnet"
              />
            </label>
            <label className="flex-1 flex flex-col gap-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-app-muted">Ferritin (ng/mL)</span>
              <input
                type="number"
                inputMode="decimal"
                value={ferritin}
                onChange={(e) => setFerritin(e.target.value)}
                placeholder="optional"
                className="px-3 py-2.5 rounded-custom-sm bg-app-surface2 border border-line text-sm text-app-ink focus:outline-none focus:border-garnet"
              />
            </label>
          </div>
          <motion.button
            type="button"
            whileTap={{ scale: 0.97 }}
            transition={spring.snappy}
            onClick={save}
            disabled={!canSave}
            className="w-full py-2.5 rounded-custom font-sans font-bold text-sm flex items-center justify-center gap-1.5"
            style={{ background: canSave ? 'var(--garnet)' : 'var(--line)', color: canSave ? '#fff' : 'var(--muted)' }}
          >
            <Check size={16} /> Save reading
          </motion.button>
        </div>
      )}
    </section>
  );
};

export default LabLogger;

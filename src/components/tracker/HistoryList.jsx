import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Droplet, Activity, Trash2 } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { PremiumGate } from '../premium/PremiumGate';
import { haptics } from '../../hooks/useHaptics';

/**
 * HistoryList — a merged, newest-first timeline of nosebleed episodes and lab
 * readings, each deletable. Free tier shows the last 30 days; older entries are
 * gated behind PremiumGate. Device-local only.
 */

const pad2 = (n) => String(n).padStart(2, '0');
const localDate = (d = new Date()) => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;

const SEV = { mild: 'var(--teal)', moderate: 'var(--gold)', severe: 'var(--garnet)' };

const Row = ({ item, onDelete }) => (
  <motion.div
    layout
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, x: -20 }}
    className="flex items-center gap-3 py-2.5 border-b border-line last:border-0"
  >
    <div
      className="w-8 h-8 rounded-full flex items-center justify-center text-white shrink-0"
      style={{ background: item.kind === 'episode' ? (SEV[item.severity] || 'var(--garnet)') : 'var(--teal)' }}
    >
      {item.kind === 'episode' ? <Droplet size={14} /> : <Activity size={14} />}
    </div>
    <div className="flex-1 min-w-0">
      <div className="font-sans text-sm font-semibold text-app-ink truncate">
        {item.kind === 'episode'
          ? `${item.durationMin} min · ${item.severity}`
          : `Hb ${item.hemoglobin ?? '—'} g/dL${item.ferritin != null ? ` · ferritin ${item.ferritin}` : ''}`}
      </div>
      <div className="text-[11px] text-app-muted">{item.date}</div>
    </div>
    <button
      type="button"
      onClick={() => { haptics.tap(); onDelete(item); }}
      aria-label="Delete entry"
      className="w-8 h-8 rounded-full flex items-center justify-center text-app-muted active:text-garnet active:bg-rose"
    >
      <Trash2 size={15} />
    </button>
  </motion.div>
);

export const HistoryList = () => {
  const episodes = useAppStore((s) => s.nosebleedEpisodes);
  const labs = useAppStore((s) => s.labResults);
  const deleteEpisode = useAppStore((s) => s.deleteEpisode);
  const deleteLab = useAppStore((s) => s.deleteLab);

  const items = [
    ...episodes.map((e) => ({ ...e, kind: 'episode' })),
    ...labs.map((l) => ({ ...l, kind: 'lab' })),
  ].sort((a, b) => (a.date < b.date ? 1 : -1));

  const cutoff = (() => {
    const d = new Date();
    d.setDate(d.getDate() - 29);
    return localDate(d);
  })();
  const recent = items.filter((i) => i.date >= cutoff);
  const older = items.filter((i) => i.date < cutoff);

  const onDelete = (item) => (item.kind === 'episode' ? deleteEpisode(item.id) : deleteLab(item.id));

  return (
    <section className="bg-white border border-line rounded-custom-lg p-5 shadow-card">
      <h3 className="font-serif text-lg text-app-ink mb-3">History</h3>
      {items.length === 0 ? (
        <p className="text-[12px] text-app-muted italic py-3">Your logged episodes and lab readings will appear here.</p>
      ) : (
        <>
          <div className="text-[10px] font-bold uppercase tracking-widest text-app-muted mb-1">Last 30 days</div>
          <AnimatePresence initial={false}>
            {recent.length ? (
              recent.map((i) => <Row key={`${i.kind}-${i.id}`} item={i} onDelete={onDelete} />)
            ) : (
              <p className="text-[12px] text-app-muted italic py-2">Nothing in the last 30 days.</p>
            )}
          </AnimatePresence>

          {older.length > 0 && (
            <div className="mt-4">
              <PremiumGate feature={`Full history (${older.length} older ${older.length === 1 ? 'entry' : 'entries'})`}>
                <div className="text-[10px] font-bold uppercase tracking-widest text-app-muted mb-1">Older</div>
                <AnimatePresence initial={false}>
                  {older.map((i) => <Row key={`${i.kind}-${i.id}`} item={i} onDelete={onDelete} />)}
                </AnimatePresence>
              </PremiumGate>
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default HistoryList;

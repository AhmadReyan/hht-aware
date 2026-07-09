import React from 'react';
import { Sheet } from 'konsta/react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Stethoscope, ExternalLink, ClipboardList } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { haptics } from '../../hooks/useHaptics';
import { spring } from '../../lib/motion';

const stageTone = {
  Approved: 'bg-teal-soft text-brand-teal',
  'In trials': 'bg-rose text-garnet',
  'Early research': 'bg-app-surface2 text-app-muted border border-line',
  Guideline: 'bg-rose text-garnet',
  News: 'bg-app-surface2 text-app-muted border border-line',
};

const Pill = ({ children, className = '' }) => (
  <span
    className={`inline-flex items-center rounded-custom-pill px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${className}`}
  >
    {children}
  </span>
);

/**
 * Bottom-sheet list of updates the patient saved to bring to their doctor.
 * `allUpdates` is used to resolve saved ids → full records so the list
 * survives even if ordering changes. Removing an item fires a warning haptic.
 */
export const SavedForAppointment = ({ opened, onClose, allUpdates = [] }) => {
  const savedIds = useAppStore((s) => s.savedForAppt);
  const toggleSavedForAppt = useAppStore((s) => s.toggleSavedForAppt);

  const byId = new Map(allUpdates.map((u) => [u.id, u]));
  const savedItems = savedIds.map((id) => byId.get(id)).filter(Boolean);

  const handleRemove = (id) => {
    toggleSavedForAppt(id);
    haptics.warning();
  };

  return (
    <Sheet
      className="pb-safe w-full !bg-transparent"
      opened={opened}
      onBackdropClick={onClose}
    >
      <div className="w-full max-w-md mx-auto bg-app-surface border-t border-line rounded-t-custom-lg shadow-raised max-h-[85vh] flex flex-col">
        <div className="mx-auto w-12 h-1.5 bg-app-muted/30 rounded-full mt-3 mb-2" />

        <div className="flex items-center justify-between px-5 pb-3">
          <div className="flex items-center gap-2">
            <Stethoscope size={20} className="text-brand-teal" />
            <div className="flex flex-col">
              <h2 className="font-serif text-lg font-extrabold text-app-ink leading-tight">
                For My Appointment
              </h2>
              <span className="text-[10px] text-app-muted">
                {savedItems.length} {savedItems.length === 1 ? 'update' : 'updates'} to discuss
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close saved list"
            className="min-h-[44px] min-w-[44px] flex items-center justify-center text-app-muted hover:text-app-ink rounded-full active:scale-90 transition-all"
          >
            <X size={20} />
          </button>
        </div>

        <div className="overflow-y-auto px-4 pb-6 flex flex-col gap-2.5">
          {savedItems.length === 0 ? (
            <div className="text-center py-10 flex flex-col items-center gap-2.5">
              <span className="text-3xl">🔖</span>
              <p className="text-sm font-bold text-app-ink">Nothing saved yet</p>
              <p className="text-xs text-app-muted leading-relaxed max-w-[15rem]">
                Swipe a card right, or tap the bookmark, to build a personal list of
                questions and updates to bring to your HHT specialist.
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-1.5 text-[10px] text-app-muted italic px-1 pb-1">
                <ClipboardList size={13} className="text-brand-teal flex-shrink-0" />
                <span>Show this list to your doctor — a simple way to start the conversation.</span>
              </div>
              <AnimatePresence initial={false}>
                {savedItems.map((u) => (
                  <motion.div
                    key={u.id}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -40 }}
                    transition={spring.soft}
                    className="bg-app-surface2 border border-line rounded-custom p-3.5 flex flex-col gap-2"
                  >
                    <div className="flex items-start gap-2.5">
                      <span className="text-xl leading-none flex-shrink-0">{u.emoji || '🔬'}</span>
                      <div className="flex flex-col gap-1 flex-1">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <Pill className="bg-rose text-garnet">{u.category}</Pill>
                          {u.stage && (
                            <Pill className={stageTone[u.stage] || stageTone.News}>{u.stage}</Pill>
                          )}
                        </div>
                        <h3 className="font-serif font-extrabold text-[13px] text-app-ink leading-snug">{u.title}</h3>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemove(u.id)}
                        aria-label={`Remove ${u.title} from list`}
                        className="min-h-[44px] min-w-[44px] flex items-center justify-center text-app-muted hover:text-garnet rounded-full active:scale-90 transition-all flex-shrink-0"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    {u.whyItMatters && (
                      <p className="text-[11px] text-app-soft leading-relaxed pl-1">
                        {u.whyItMatters}
                      </p>
                    )}
                    {u.url && (
                      <a
                        href={u.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-[10px] font-bold text-brand-teal hover:underline pl-1"
                      >
                        <ExternalLink size={11} />
                        Source{u.source ? ` · ${u.source}` : ''}
                      </a>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </>
          )}
        </div>
      </div>
    </Sheet>
  );
};
export default SavedForAppointment;

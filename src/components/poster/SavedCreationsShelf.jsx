import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Sparkles, ImageOff } from 'lucide-react';
import { getTheme } from './posterThemes';
import { getTemplate } from './posterTemplates';
import { haptics } from '../../hooks/useHaptics';
import { spring, staggerContainer, staggerItem } from '../../lib/motion';

export const SavedCreationsShelf = ({ posters = [], activeId, onSelect, onDelete }) => {
  if (!posters.length) {
    return (
      <div className="flex flex-col items-center gap-2 text-center py-8 px-4 rounded-custom-xl border border-dashed border-app-border/50 bg-app-surface/60">
        <Sparkles className="text-brand-teal" size={22} />
        <p className="text-sm font-semibold text-app-ink">No creations yet</p>
        <p className="text-xs text-app-muted max-w-[240px] leading-relaxed">
          Design a poster above, then tap <span className="text-app-ink font-bold">Save</span> to keep it here so you
          can find and re-edit it anytime.
        </p>
      </div>
    );
  }

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 snap-x"
    >
      <AnimatePresence initial={false}>
        {posters.map((poster) => {
          const isActive = poster.id === activeId;
          const theme = getTheme(poster.themeId);
          const template = getTemplate(poster.type);
          return (
            <motion.div
              key={poster.id}
              layout
              variants={staggerItem}
              exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.15 } }}
              whileTap={{ scale: 0.96 }}
              transition={spring.snappy}
              onClick={() => onSelect(poster)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') onSelect(poster);
              }}
              className={`
                relative shrink-0 snap-start w-[132px] rounded-custom-lg overflow-hidden border cursor-pointer select-none
                bg-app-surface2 transition-colors
                ${isActive ? 'border-brand-teal shadow-glow' : 'border-app-border/40 hover:border-app-muted/60'}
              `}
            >
              <div
                className="w-full h-[100px] flex items-center justify-center overflow-hidden"
                style={{ background: `linear-gradient(135deg, ${theme.bgFrom}, ${theme.bgTo})` }}
              >
                {poster.thumbnail ? (
                  <img src={poster.thumbnail} alt={poster.title} className="w-full h-full object-cover" />
                ) : (
                  <ImageOff className="text-white/40" size={22} />
                )}
              </div>

              <div className="p-2 flex flex-col gap-0.5">
                <p className="text-[11px] font-bold text-app-ink truncate">{poster.title}</p>
                <p className="text-[9px] text-app-muted truncate uppercase tracking-wide">{template?.label}</p>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  haptics.warning();
                  onDelete(poster.id);
                }}
                aria-label={`Delete ${poster.title}`}
                className="absolute top-1.5 right-1.5 h-8 w-8 flex items-center justify-center rounded-full bg-black/55 text-white/85 hover:text-white hover:bg-brand-red/80 transition-colors active:scale-90"
              >
                <Trash2 size={13} />
              </button>

              {isActive && (
                <span className="absolute top-1.5 left-1.5 bg-brand-teal text-app-bg text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-custom-pill">
                  Editing
                </span>
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </motion.div>
  );
};
export default SavedCreationsShelf;

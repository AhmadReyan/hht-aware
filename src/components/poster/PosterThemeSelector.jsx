import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { THEMES } from './posterThemes';
import { haptics } from '../../hooks/useHaptics';
import { spring } from '../../lib/motion';

export const PosterThemeSelector = ({ activeTheme, onSelectTheme }) => {
  const handleSelect = (id) => {
    if (id !== activeTheme) haptics.selection();
    onSelectTheme(id);
  };

  return (
    <div className="flex flex-col gap-2">
      <h2 className="font-bold text-xs uppercase tracking-wider text-app-muted px-1">Color Theme</h2>
      <div className="flex gap-2.5 overflow-x-auto pb-1 -mx-1 px-1 snap-x">
        {THEMES.map((theme) => {
          const isActive = activeTheme === theme.id;
          return (
            <motion.button
              key={theme.id}
              type="button"
              whileTap={{ scale: 0.94 }}
              transition={spring.snappy}
              onClick={() => handleSelect(theme.id)}
              className={`
                relative shrink-0 snap-start min-h-[44px] flex flex-col items-center justify-center gap-1.5 p-2
                rounded-custom border transition-colors select-none
                ${isActive
                  ? 'border-brand-teal bg-app-surface2 shadow-glow'
                  : 'border-app-border/40 bg-app-surface hover:border-app-muted/50'}
              `}
            >
              <div className="relative flex h-10 w-16 overflow-hidden rounded-custom-sm border border-black/20">
                {theme.swatch.map((c, i) => (
                  <span key={i} className="flex-1" style={{ backgroundColor: c }} />
                ))}
                {isActive && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={spring.bouncy}
                    className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand-teal text-app-bg"
                  >
                    <Check size={11} strokeWidth={3} />
                  </motion.span>
                )}
              </div>
              <span className={`text-[10px] font-bold ${isActive ? 'text-app-ink' : 'text-app-muted'}`}>
                {theme.name}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
export default PosterThemeSelector;

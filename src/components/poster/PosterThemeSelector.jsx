import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { THEMES } from './posterThemes';

export const PosterThemeSelector = ({ activeTheme, onSelectTheme }) => {
  return (
    <div className="flex flex-col gap-2">
      <h2 className="font-bold text-xs uppercase tracking-wider text-app-muted px-1">Color Theme</h2>
      <div className="flex gap-2.5 overflow-x-auto pb-1 -mx-1 px-1 snap-x">
        {THEMES.map((theme) => {
          const isActive = activeTheme === theme.id;
          return (
            <motion.button
              key={theme.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelectTheme(theme.id)}
              className={`
                relative shrink-0 snap-start flex flex-col items-center gap-1.5 p-2 rounded-custom border transition-all select-none
                ${isActive
                  ? 'border-brand-red-mid bg-app-dark2'
                  : 'border-app-border/10 bg-app-dark hover:border-app-muted/40'}
              `}
            >
              <div className="flex h-10 w-16 overflow-hidden rounded-custom-sm border border-black/20">
                {theme.swatch.map((c, i) => (
                  <span key={i} className="flex-1" style={{ backgroundColor: c }} />
                ))}
                {isActive && (
                  <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand-red-mid text-white">
                    <Check size={11} strokeWidth={3} />
                  </span>
                )}
              </div>
              <span className={`text-[10px] font-bold ${isActive ? 'text-white' : 'text-app-muted'}`}>
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

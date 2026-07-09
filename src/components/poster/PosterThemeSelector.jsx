import { motion } from 'framer-motion';
import { SectionTitle } from '../ui/SectionTitle';
import { THEMES } from './posterThemes';
import { haptics } from '../../hooks/useHaptics';
import { spring } from '../../lib/motion';
import { useAppStore } from '../../store/useAppStore';

// A couple of richer palettes are treated as "premium" — they unlock once the
// user has earned their first badge. Everything else is always available.
const PREMIUM_THEMES = { midnight: 1, mono: 1 };

export const PosterThemeSelector = ({ activeTheme, onSelectTheme }) => {
  const getBadges = useAppStore((s) => s.getBadges);
  const earnedCount = getBadges().filter((b) => b.unlocked).length;

  const handleSelect = (id, locked) => {
    if (locked) {
      haptics.warning();
      return;
    }
    if (id !== activeTheme) haptics.selection();
    onSelectTheme(id);
  };

  return (
    <div className="flex flex-col gap-2.5">
      <SectionTitle kicker="Palette" title="Set the mood" className="mb-0" />
      <div className="flex gap-3 overflow-x-auto pb-1 -mx-1 px-1 snap-x">
        {THEMES.map((theme) => {
          const isActive = activeTheme === theme.id;
          const need = PREMIUM_THEMES[theme.id] || 0;
          const locked = earnedCount < need;
          const gradient = `linear-gradient(150deg, ${theme.swatch[0]}, ${theme.swatch[1]} 55%, ${theme.swatch[2]})`;
          return (
            <motion.button
              key={theme.id}
              type="button"
              whileTap={{ scale: locked ? 1 : 0.92 }}
              transition={spring.snappy}
              onClick={() => handleSelect(theme.id, locked)}
              title={locked ? 'Earn a badge to unlock' : theme.name}
              className="shrink-0 snap-start flex flex-col items-center gap-1.5 select-none"
            >
              <span
                className="relative grid place-items-center h-12 w-12 rounded-custom"
                style={{
                  background: gradient,
                  border: isActive ? '3px solid var(--ink)' : '1.5px solid var(--line)',
                  opacity: locked ? 0.5 : 1,
                }}
              >
                {locked && <span className="text-base drop-shadow">🔒</span>}
              </span>
              <span
                className="text-[10px] font-semibold"
                style={{ color: isActive ? 'var(--ink)' : 'var(--muted)' }}
              >
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

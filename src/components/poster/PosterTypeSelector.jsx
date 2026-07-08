import { motion } from 'framer-motion';
import { TEMPLATES } from './posterTemplates';
import { haptics } from '../../hooks/useHaptics';
import { spring } from '../../lib/motion';

export const PosterTypeSelector = ({ activeType = 'awareness', onSelectType }) => {
  const handleSelect = (id) => {
    if (id !== activeType) haptics.selection();
    onSelectType(id);
  };

  return (
    <div className="flex flex-col gap-2">
      <h2 className="font-bold text-xs uppercase tracking-wider text-app-muted px-1">Template</h2>
      <div className="w-full flex gap-2 overflow-x-auto snap-x pb-1 -mx-1 px-1">
        {TEMPLATES.map((type) => {
          const isActive = activeType === type.id;
          return (
            <motion.button
              key={type.id}
              type="button"
              whileTap={{ scale: 0.94 }}
              transition={spring.snappy}
              onClick={() => handleSelect(type.id)}
              className={`
                shrink-0 snap-start min-h-[44px] flex items-center justify-center py-2 px-4 rounded-custom-pill
                text-xs font-bold text-center whitespace-nowrap transition-colors select-none border
                ${isActive
                  ? 'bg-ember text-white border-transparent shadow-glow'
                  : 'bg-app-surface2 text-app-soft border-app-border/40 hover:text-app-ink hover:border-app-muted/40'}
              `}
            >
              {type.label}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
export default PosterTypeSelector;

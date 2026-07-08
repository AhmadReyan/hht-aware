import React from 'react';
import { motion } from 'framer-motion';
import { haptics } from '../../hooks/useHaptics';
import { spring } from '../../lib/motion';

export const ManifestationsSelector = ({ selected = [], onChange }) => {
  const options = [
    { key: 'nosebleeds', label: 'Nosebleeds' },
    { key: 'pulmonary', label: 'Pulmonary AVM' },
    { key: 'brain', label: 'Brain AVM' },
    { key: 'liver', label: 'Liver AVM' },
    { key: 'gi', label: 'GI Bleeding' },
    { key: 'skin', label: 'Skin Telangiectasias' },
    { key: 'anemia', label: 'Anemia' },
    { key: 'spinal', label: 'Spinal AVM' }
  ];

  const handleToggle = (key) => {
    haptics.selection();
    let updated;
    if (selected.includes(key)) {
      updated = selected.filter(item => item !== key);
    } else {
      updated = [...selected, key];
    }
    onChange(updated);
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="font-sans font-bold text-xs uppercase tracking-wider text-app-muted">
        HHT Manifestations (Select all that apply)
      </label>
      <div className="flex flex-wrap gap-1.5 mt-1">
        {options.map((opt) => {
          const isSelected = selected.includes(opt.key);
          return (
            <motion.button
              key={opt.key}
              type="button"
              whileTap={{ scale: 0.94 }}
              transition={spring.snappy}
              onClick={() => handleToggle(opt.key)}
              className={`
                min-h-[38px] px-3 py-1.5 rounded-custom-pill text-[11px] font-semibold border transition-colors select-none
                ${isSelected
                  ? 'bg-brand-red/10 border-brand-red-mid/60 text-brand-red-light font-bold shadow-glow'
                  : 'bg-app-surface2 border-app-border/40 text-app-muted hover:text-app-ink hover:border-app-muted/50'
                }
              `}
            >
              {opt.label}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
export default ManifestationsSelector;

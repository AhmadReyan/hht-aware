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

  const list = Array.isArray(selected) ? selected : [];

  const handleToggle = (key) => {
    haptics.selection();
    const updated = list.includes(key)
      ? list.filter((item) => item !== key)
      : [...list, key];
    onChange(updated);
  };

  return (
    <div className="flex flex-col gap-1.5">
      <label className="font-sans text-[11px] font-semibold uppercase tracking-wider text-garnet">
        HHT manifestations
        <span className="ml-1 font-normal normal-case tracking-normal text-app-muted">select all that apply</span>
      </label>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const isSelected = list.includes(opt.key);
          return (
            <motion.button
              key={opt.key}
              type="button"
              whileTap={{ scale: 0.94 }}
              transition={spring.snappy}
              onClick={() => handleToggle(opt.key)}
              aria-pressed={isSelected}
              className={`min-h-[36px] rounded-custom-pill px-3.5 py-1.5 font-sans text-[12px] font-semibold transition-colors select-none border-[1.5px] ${
                isSelected
                  ? 'border-transparent bg-garnet text-white'
                  : 'border-line bg-app-surface text-app-ink hover:border-app-muted/50'
              }`}
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

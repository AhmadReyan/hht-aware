import React from 'react';

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
            <button
              key={opt.key}
              type="button"
              onClick={() => handleToggle(opt.key)}
              className={`
                px-3 py-1.5 rounded-custom-pill text-[11px] font-semibold border transition-all select-none
                ${isSelected 
                  ? 'bg-brand-red/10 border-brand-red-mid/50 text-brand-red-mid font-bold scale-[1.02]' 
                  : 'bg-app-dark2 border-app-border/10 text-app-muted hover:text-white hover:border-app-muted/30'
                }
              `}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
export default ManifestationsSelector;

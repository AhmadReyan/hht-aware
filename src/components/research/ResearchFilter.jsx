import React from 'react';

export const ResearchFilter = ({ categories = [], activeCategory = 'all', onSelectCategory }) => {
  const chips = [{ key: 'all', label: 'All' }, ...categories.map((c) => ({ key: c, label: c }))];

  return (
    <div className="w-full overflow-x-auto scrollbar-none flex gap-2 pb-2 px-1">
      {chips.map((chip) => {
        const isActive = activeCategory === chip.key;
        return (
          <button
            key={chip.key}
            onClick={() => onSelectCategory(chip.key)}
            className={`
              px-3.5 py-1.5 rounded-custom-pill text-xs font-semibold whitespace-nowrap transition-all border select-none
              ${isActive
                ? 'bg-brand-red text-white border-brand-red font-bold scale-[1.02] shadow-sm'
                : 'bg-app-dark2 border-app-border/10 text-app-muted hover:text-white'
              }
            `}
          >
            {chip.label}
          </button>
        );
      })}
    </div>
  );
};
export default ResearchFilter;

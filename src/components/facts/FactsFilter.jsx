import React from 'react';

export const FactsFilter = ({ activeCategory = 'all', onSelectCategory }) => {
  const categories = [
    { key: 'all', label: 'All Facts' },
    { key: 'prevalence', label: 'Prevalence' },
    { key: 'symptoms', label: 'Symptoms' },
    { key: 'genetics', label: 'Genetics' },
    { key: 'diagnosis', label: 'Diagnosis' },
    { key: 'treatment', label: 'Treatment' }
  ];

  return (
    <div className="w-full overflow-x-auto scrollbar-none flex gap-2 pb-2 px-1">
      {categories.map((cat) => {
        const isActive = activeCategory === cat.key;
        return (
          <button
            key={cat.key}
            onClick={() => onSelectCategory(cat.key)}
            className={`
              px-3.5 py-1.5 rounded-custom-pill text-xs font-semibold whitespace-nowrap transition-all border select-none
              ${isActive 
                ? 'bg-brand-red text-white border-brand-red font-bold scale-[1.02] shadow-sm' 
                : 'bg-app-dark2 border-app-border/10 text-app-muted hover:text-white'
              }
            `}
          >
            {cat.label}
          </button>
        );
      })}
    </div>
  );
};
export default FactsFilter;

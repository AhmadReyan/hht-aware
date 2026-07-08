import React from 'react';

export const PosterTypeSelector = ({ activeType = 'awareness', onSelectType }) => {
  const types = [
    { key: 'awareness', label: '🎗️ Awareness' },
    { key: 'fact', label: '📊 HHT Fact' },
    { key: 'story', label: '📖 My Story' }
  ];

  return (
    <div className="w-full flex bg-app-dark rounded-custom border border-app-border/10 p-1">
      {types.map((type) => {
        const isActive = activeType === type.key;
        return (
          <button
            key={type.key}
            onClick={() => onSelectType(type.key)}
            className={`
              flex-1 py-2 px-3 rounded-custom-sm text-xs font-bold text-center transition-all select-none
              ${isActive 
                ? 'bg-brand-red text-white shadow-sm' 
                : 'text-app-muted hover:text-white'
              }
            `}
          >
            {type.label}
          </button>
        );
      })}
    </div>
  );
};
export default PosterTypeSelector;

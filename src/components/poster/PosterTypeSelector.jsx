import { TEMPLATES } from './posterTemplates';

export const PosterTypeSelector = ({ activeType = 'awareness', onSelectType }) => {
  return (
    <div className="flex flex-col gap-2">
      <h2 className="font-bold text-xs uppercase tracking-wider text-app-muted px-1">Template</h2>
      <div className="w-full flex gap-1.5 overflow-x-auto snap-x bg-app-dark rounded-custom border border-app-border/10 p-1">
        {TEMPLATES.map((type) => {
          const isActive = activeType === type.id;
          return (
            <button
              key={type.id}
              onClick={() => onSelectType(type.id)}
              className={`
                shrink-0 snap-start py-2 px-3.5 rounded-custom-sm text-xs font-bold text-center whitespace-nowrap transition-all select-none
                ${isActive
                  ? 'bg-brand-red text-white shadow-sm'
                  : 'text-app-muted hover:text-white'}
              `}
            >
              {type.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
export default PosterTypeSelector;

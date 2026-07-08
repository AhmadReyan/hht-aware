import { Square, RectangleVertical, Smartphone } from 'lucide-react';
import { FORMATS } from './posterFormats';

const ICONS = {
  square: Square,
  rectangle: RectangleVertical,
  phone: Smartphone,
};

export const PosterFormatSelector = ({ activeFormat, onSelectFormat }) => {
  return (
    <div className="flex flex-col gap-2">
      <h2 className="font-bold text-xs uppercase tracking-wider text-app-muted px-1">Size / Format</h2>
      <div className="w-full flex bg-app-dark rounded-custom border border-app-border/10 p-1 gap-1">
        {FORMATS.map((format) => {
          const isActive = activeFormat === format.id;
          const Icon = ICONS[format.icon] || Square;
          return (
            <button
              key={format.id}
              onClick={() => onSelectFormat(format.id)}
              className={`
                flex-1 flex flex-col items-center gap-1 py-2.5 px-2 rounded-custom-sm transition-all select-none
                ${isActive ? 'bg-brand-red text-white shadow-sm' : 'text-app-muted hover:text-white'}
              `}
            >
              <Icon size={18} />
              <span className="text-[11px] font-bold leading-none">{format.label}</span>
              <span className={`text-[9px] leading-none ${isActive ? 'text-white/70' : 'text-app-muted/70'}`}>
                {format.sub}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
export default PosterFormatSelector;

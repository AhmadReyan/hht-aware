import { Square, RectangleVertical, Smartphone } from 'lucide-react';
import { Segmented, SegmentedButton } from 'konsta/react';
import { FORMATS } from './posterFormats';
import { haptics } from '../../hooks/useHaptics';

const ICONS = {
  square: Square,
  rectangle: RectangleVertical,
  phone: Smartphone,
};

export const PosterFormatSelector = ({ activeFormat, onSelectFormat }) => {
  const handleSelect = (id) => {
    if (id !== activeFormat) haptics.selection();
    onSelectFormat(id);
  };

  return (
    <div className="flex flex-col gap-2">
      <h2 className="font-bold text-xs uppercase tracking-wider text-app-muted px-1">Size / Format</h2>
      <Segmented strong rounded>
        {FORMATS.map((format) => {
          const isActive = activeFormat === format.id;
          const Icon = ICONS[format.icon] || Square;
          return (
            <SegmentedButton
              key={format.id}
              type="button"
              active={isActive}
              rounded
              strong
              onClick={() => handleSelect(format.id)}
              className="flex-col gap-0.5 min-h-[52px] select-none"
            >
              <Icon size={17} />
              <span className="text-[11px] font-bold leading-none">{format.label}</span>
              <span className="text-[9px] leading-none opacity-70">{format.sub}</span>
            </SegmentedButton>
          );
        })}
      </Segmented>
    </div>
  );
};
export default PosterFormatSelector;

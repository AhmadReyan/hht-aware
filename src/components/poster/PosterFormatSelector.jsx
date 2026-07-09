import { FORMATS } from './posterFormats';
import { Chip } from '../ui/Chip';
import { SectionTitle } from '../ui/SectionTitle';

export const PosterFormatSelector = ({ activeFormat, onSelectFormat }) => {
  return (
    <div className="flex flex-col gap-2.5">
      <SectionTitle kicker="Size" title="Choose a format" className="mb-0" />
      <div className="flex flex-wrap gap-2">
        {FORMATS.map((format) => (
          <Chip
            key={format.id}
            label={`${format.label} · ${format.sub}`}
            active={activeFormat === format.id}
            onClick={() => onSelectFormat(format.id)}
          />
        ))}
      </div>
    </div>
  );
};
export default PosterFormatSelector;

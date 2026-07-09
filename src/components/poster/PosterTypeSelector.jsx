import { TEMPLATES } from './posterTemplates';
import { Chip } from '../ui/Chip';
import { SectionTitle } from '../ui/SectionTitle';

export const PosterTypeSelector = ({ activeType = 'awareness', onSelectType }) => {
  return (
    <div className="flex flex-col gap-2.5">
      <SectionTitle kicker="Template" title="Pick a poster style" className="mb-0" />
      <div className="w-full flex gap-2 overflow-x-auto snap-x pb-1 -mx-1 px-1">
        {TEMPLATES.map((type) => (
          <div key={type.id} className="shrink-0 snap-start">
            <Chip
              label={type.label}
              active={activeType === type.id}
              tone="teal"
              onClick={() => onSelectType(type.id)}
              className="whitespace-nowrap"
            />
          </div>
        ))}
      </div>
    </div>
  );
};
export default PosterTypeSelector;

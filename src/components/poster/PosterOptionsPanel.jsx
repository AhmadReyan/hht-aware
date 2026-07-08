import { Sparkles, Ribbon, Circle, Triangle, Diamond } from 'lucide-react';

const SHAPES = [
  { key: 'circle', label: 'Circle', icon: Circle },
  { key: 'ribbon', label: 'Ribbon', icon: Ribbon },
  { key: 'triangle', label: 'Triangle', icon: Triangle },
  { key: 'diamond', label: 'Diamond', icon: Diamond },
];

const Toggle = ({ label, icon: Icon, checked, onToggle }) => (
  <button
    type="button"
    onClick={onToggle}
    className={`
      flex items-center gap-2 px-3 py-2 rounded-custom-sm border text-xs font-bold transition-all select-none
      ${checked
        ? 'bg-brand-red text-white border-brand-red'
        : 'bg-app-dark text-app-muted border-app-border/10 hover:text-white'}
    `}
  >
    <Icon size={15} />
    <span>{label}</span>
    <span className={`ml-auto h-3.5 w-3.5 rounded-full border ${checked ? 'bg-white border-white' : 'border-app-muted'}`} />
  </button>
);

export const PosterOptionsPanel = ({ options, onChange }) => {
  const set = (patch) => onChange({ ...options, ...patch });

  return (
    <div className="flex flex-col gap-3 font-sans">
      <h2 className="font-bold text-xs uppercase tracking-wider text-app-muted px-1">Accents</h2>
      <div className="grid grid-cols-2 gap-2">
        <Toggle
          label="Background Pattern"
          icon={Sparkles}
          checked={!!options.pattern}
          onToggle={() => set({ pattern: !options.pattern })}
        />
        <Toggle
          label="Ribbon Accent"
          icon={Ribbon}
          checked={!!options.ribbon}
          onToggle={() => set({ ribbon: !options.ribbon })}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="font-bold text-[10px] uppercase tracking-wider text-app-muted px-1">Accent Shape</label>
        <div className="flex flex-wrap gap-1.5">
          {SHAPES.map((shape) => {
            const isActive = (options.accentShape || 'circle') === shape.key;
            const Icon = shape.icon;
            return (
              <button
                key={shape.key}
                type="button"
                onClick={() => set({ accentShape: shape.key })}
                className={`
                  flex items-center gap-1.5 px-2.5 py-1.5 rounded-custom-pill text-[10px] font-bold border transition-all select-none
                  ${isActive
                    ? 'bg-app-dark2 text-white border-brand-red-mid'
                    : 'bg-app-dark text-app-muted border-app-border/10 hover:text-white'}
                `}
              >
                <Icon size={12} />
                {shape.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
export default PosterOptionsPanel;

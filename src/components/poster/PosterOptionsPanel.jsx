import { motion } from 'framer-motion';
import { Sparkles, Ribbon, Circle, Triangle, Diamond } from 'lucide-react';
import { haptics } from '../../hooks/useHaptics';
import { spring } from '../../lib/motion';

const SHAPES = [
  { key: 'circle', label: 'Circle', icon: Circle },
  { key: 'ribbon', label: 'Ribbon', icon: Ribbon },
  { key: 'triangle', label: 'Triangle', icon: Triangle },
  { key: 'diamond', label: 'Diamond', icon: Diamond },
];

const Toggle = ({ label, icon: Icon, checked, onToggle }) => (
  <motion.button
    type="button"
    whileTap={{ scale: 0.96 }}
    transition={spring.snappy}
    onClick={onToggle}
    className={`
      min-h-[44px] flex items-center gap-2 px-3 py-2 rounded-custom border text-xs font-bold transition-colors select-none
      ${checked
        ? 'bg-garnet text-white border-transparent shadow-card'
        : 'bg-app-surface2 text-app-soft border-line hover:text-app-ink'}
    `}
  >
    <Icon size={15} />
    <span>{label}</span>
    <span className={`ml-auto h-3.5 w-3.5 rounded-full border ${checked ? 'bg-white border-white' : 'border-app-muted'}`} />
  </motion.button>
);

export const PosterOptionsPanel = ({ options, onChange }) => {
  const set = (patch) => {
    haptics.tap();
    onChange({ ...options, ...patch });
  };

  return (
    <div className="flex flex-col gap-3 font-sans">
      <h2 className="text-[11px] font-semibold uppercase tracking-wide text-garnet px-0.5">Accents</h2>
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
        <label className="text-[10px] font-semibold uppercase tracking-wide text-app-muted px-0.5">Accent Shape</label>
        <div className="flex flex-wrap gap-1.5">
          {SHAPES.map((shape) => {
            const isActive = (options.accentShape || 'circle') === shape.key;
            const Icon = shape.icon;
            return (
              <motion.button
                key={shape.key}
                type="button"
                whileTap={{ scale: 0.94 }}
                transition={spring.snappy}
                onClick={() => set({ accentShape: shape.key })}
                className={`
                  min-h-[40px] flex items-center gap-1.5 px-3 py-1.5 rounded-custom-pill text-[11px] font-semibold border transition-colors select-none
                  ${isActive
                    ? 'bg-teal-soft text-brand-teal border-brand-teal'
                    : 'bg-app-surface text-app-muted border-line hover:text-app-ink'}
                `}
              >
                <Icon size={12} />
                {shape.label}
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
export default PosterOptionsPanel;

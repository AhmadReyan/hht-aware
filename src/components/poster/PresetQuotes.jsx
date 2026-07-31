import React from 'react';
import { Sparkles } from 'lucide-react';
import { haptics } from '../../hooks/useHaptics';

const PRESETS = [
  {
    type: 'awareness',
    label: '✨ Standard Awareness',
    headline: 'HHT is Real. HHT is Rare.',
    body: 'Hereditary Hemorrhagic Telangiectasia affects 1 in 5,000 people worldwide. Over 90% remain undiagnosed.',
  },
  {
    type: 'awareness',
    label: '🩸 Invisible Disease',
    headline: 'Making the Invisible Visible.',
    body: 'Chronic nosebleeds and internal blood vessel malformations impact millions. Together we build HHT awareness.',
  },
  {
    type: 'fact',
    label: '📊 Stat Spotlight',
    stat: '90%',
    body: 'of individuals living with HHT are currently undiagnosed. Early screening saves lives.',
  },
  {
    type: 'story',
    label: '💬 Patient Quote',
    quote: 'My nosebleeds used to control my life. Raising awareness gave me back my voice.',
    name: 'Jordan M.',
    role: 'HHT Advocate',
  },
  {
    type: 'awareness',
    label: '💪 Iron & Hope',
    headline: 'Iron Strong, Community Driven.',
    body: 'Every conversation breaks the silence surrounding rare vascular conditions. Join the HHT awareness movement.',
  },
];

export const PresetQuotes = ({ onApplyPreset }) => {
  const handleSelect = (preset) => {
    haptics.selection();
    onApplyPreset(preset);
  };

  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-garnet flex items-center gap-1.5">
          <Sparkles size={13} className="text-gold animate-spin-slow" />
          Creative Quick Prompts
        </span>
        <span className="text-[10px] text-app-muted font-medium">Tap to load preset</span>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 snap-x">
        {PRESETS.map((preset, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSelect(preset)}
            className="shrink-0 snap-start bg-app-surface border border-line hover:border-garnet/40 px-3 py-2 rounded-custom-pill text-xs font-semibold text-app-ink shadow-sm active:scale-95 transition-all whitespace-nowrap flex items-center gap-1.5"
          >
            {preset.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PresetQuotes;

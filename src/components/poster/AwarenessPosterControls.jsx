import React from 'react';

export const AwarenessPosterControls = ({ data, onChange }) => {
  const handleValChange = (field, val) => {
    onChange({ ...data, [field]: val });
  };

  const inputClass = 'w-full bg-[#1C1C1E] border border-app-border/10 rounded-custom-sm text-sm px-3.5 py-2.5 text-white placeholder-app-muted focus:outline-none focus:border-brand-red-mid focus:ring-1 focus:ring-brand-red-mid transition-colors';

  return (
    <div className="flex flex-col gap-4 font-sans text-white">
      <div className="flex flex-col gap-1.5">
        <label className="font-bold text-xs uppercase tracking-wider text-app-muted">Poster Headline</label>
        <input
          type="text"
          placeholder="e.g. HHT is Real. HHT is Rare."
          value={data.headline || ''}
          onChange={(e) => handleValChange('headline', e.target.value)}
          maxLength={50}
          className={inputClass}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="font-bold text-xs uppercase tracking-wider text-app-muted">Supporting Message</label>
        <textarea
          rows={3}
          placeholder="e.g. Hereditary Hemorrhagic Telangiectasia affects 1 in 5,000 people. Awareness saves lives."
          value={data.body || ''}
          onChange={(e) => handleValChange('body', e.target.value)}
          maxLength={150}
          className={`${inputClass} resize-none`}
        />
      </div>
    </div>
  );
};
export default AwarenessPosterControls;

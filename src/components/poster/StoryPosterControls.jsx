import React from 'react';

export const StoryPosterControls = ({ data, onChange }) => {
  const handleValChange = (field, val) => {
    onChange({ ...data, [field]: val });
  };

  const inputClass = 'w-full bg-app-surface2 border border-line rounded-custom text-sm px-3.5 py-2.5 text-app-ink placeholder:text-app-muted focus:outline-none focus:border-garnet focus:ring-1 focus:ring-garnet transition-colors';

  return (
    <div className="flex flex-col gap-4 font-sans text-app-ink">
      <div className="flex flex-col gap-1.5">
        <label className="font-bold text-xs uppercase tracking-wider text-app-muted">My HHT Journey / Quote</label>
        <textarea
          rows={3}
          placeholder="e.g. Sharing my story makes an invisible genetic vascular disease visible. We deserve clinical awareness."
          value={data.quote || ''}
          onChange={(e) => handleValChange('quote', e.target.value)}
          maxLength={140}
          className={`${inputClass} resize-none`}
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <label className="font-bold text-xs uppercase tracking-wider text-app-muted">Name</label>
          <input
            type="text"
            placeholder="Jane Doe"
            value={data.name || ''}
            onChange={(e) => handleValChange('name', e.target.value)}
            maxLength={25}
            className={inputClass}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="font-bold text-xs uppercase tracking-wider text-app-muted">Role / Connection</label>
          <input
            type="text"
            placeholder="e.g. Patient / Caregiver"
            value={data.role || ''}
            onChange={(e) => handleValChange('role', e.target.value)}
            maxLength={20}
            className={inputClass}
          />
        </div>
      </div>
    </div>
  );
};
export default StoryPosterControls;

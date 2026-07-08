// Renders a template's declarative `fields` schema plus optional auto-fill
// presets. Used by all 10 new poster templates so each one doesn't need its own
// bespoke controls component. Styling mirrors the existing legacy control inputs.

const inputClass = 'w-full bg-app-surface2 border border-app-border/10 rounded-custom-sm text-sm px-3.5 py-2.5 text-white placeholder-app-muted focus:outline-none focus:border-brand-red-mid focus:ring-1 focus:ring-brand-red-mid transition-colors';

export const GenericPosterControls = ({ template, data, onChange }) => {
  const fields = template.fields || [];
  const presets = template.presets || [];

  const handleValChange = (key, val) => {
    onChange({ ...data, [key]: val });
  };

  const handlePreset = (preset) => {
    const { chipLabel, ...rest } = preset;
    void chipLabel;
    onChange({ ...data, ...rest });
  };

  return (
    <div className="flex flex-col gap-4 font-sans text-white">
      {presets.length > 0 && (
        <div className="flex flex-col gap-1.5">
          <label className="font-bold text-xs uppercase tracking-wider text-app-muted">Quick Fill</label>
          <div className="flex flex-wrap gap-1.5 mt-1">
            {presets.map((preset, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handlePreset(preset)}
                className="bg-app-dark2 hover:bg-app-mid/40 border border-app-border/10 hover:border-app-muted text-app-muted hover:text-white px-2.5 py-1.5 rounded-custom-pill text-[10px] font-bold transition-all select-none"
              >
                {preset.chipLabel}
              </button>
            ))}
          </div>
        </div>
      )}

      {fields.map((field) => (
        <div key={field.key} className="flex flex-col gap-1.5">
          <label className="font-bold text-xs uppercase tracking-wider text-app-muted">{field.label}</label>
          {field.type === 'textarea' ? (
            <textarea
              rows={field.rows || 2}
              placeholder={field.placeholder || ''}
              value={data[field.key] || ''}
              onChange={(e) => handleValChange(field.key, e.target.value)}
              maxLength={field.maxLength || 150}
              className={`${inputClass} resize-none`}
            />
          ) : (
            <input
              type="text"
              placeholder={field.placeholder || ''}
              value={data[field.key] || ''}
              onChange={(e) => handleValChange(field.key, e.target.value)}
              maxLength={field.maxLength || 60}
              className={inputClass}
            />
          )}
        </div>
      ))}
    </div>
  );
};
export default GenericPosterControls;

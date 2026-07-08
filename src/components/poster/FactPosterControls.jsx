import React from 'react';

export const FactPosterControls = ({ data, onChange }) => {
  const preloadedFacts = [
    {
      chipLabel: "Prevalence (1 in 5,000)",
      stat: "1 in 5,000",
      body: "people have HHT worldwide, making it a common rare disease. Over 90% remain undiagnosed."
    },
    {
      chipLabel: "Nosebleeds (90%)",
      stat: "90%",
      body: "of HHT patients experience recurrent, spontaneous nosebleeds. This is the most common initial symptom."
    },
    {
      chipLabel: "Inheritance (50%)",
      stat: "50%",
      body: "inheritance chance. HHT is autosomal dominant, meaning each child of a patient has a 1-in-2 chance."
    },
    {
      chipLabel: "Diagnosis Delay (20yr)",
      stat: "20+ Years",
      body: "is the average delay between a patient's first symptom and an accurate diagnosis of HHT."
    },
    {
      chipLabel: "Brain AVMs (30%)",
      stat: "30%",
      body: "of individuals with HHT have brain AVMs, which can lead to headaches, seizures, or sudden hemorrhage."
    },
    {
      chipLabel: "Pulmonary AVMs (50%)",
      stat: "30% - 50%",
      body: "of patients with HHT have pulmonary (lung) AVMs, creating a direct path for blood clots or bacteria to travel to the brain."
    }
  ];

  const handleChipSelect = (fact) => {
    onChange({ stat: fact.stat, body: fact.body });
  };

  const handleValChange = (field, val) => {
    onChange({ ...data, [field]: val });
  };

  const inputClass = 'w-full bg-app-surface2 border border-app-border/10 rounded-custom-sm text-sm px-3.5 py-2.5 text-white placeholder-app-muted focus:outline-none focus:border-brand-red-mid focus:ring-1 focus:ring-brand-red-mid transition-colors';

  return (
    <div className="flex flex-col gap-4 font-sans text-white">
      {/* Preloaded Chips */}
      <div className="flex flex-col gap-1.5">
        <label className="font-bold text-xs uppercase tracking-wider text-app-muted">Auto-fill HHT Fact</label>
        <div className="flex flex-wrap gap-1.5 mt-1">
          {preloadedFacts.map((fact, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleChipSelect(fact)}
              className="bg-app-dark2 hover:bg-app-mid/40 border border-app-border/10 hover:border-app-muted text-app-muted hover:text-white px-2.5 py-1.5 rounded-custom-pill text-[10px] font-bold transition-all select-none"
            >
              {fact.chipLabel}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="col-span-1 flex flex-col gap-1.5">
          <label className="font-bold text-xs uppercase tracking-wider text-app-muted">Stat/Number</label>
          <input
            type="text"
            placeholder="e.g. 90%"
            value={data.stat || ''}
            onChange={(e) => handleValChange('stat', e.target.value)}
            maxLength={12}
            className={inputClass}
          />
        </div>
        <div className="col-span-2 flex flex-col gap-1.5">
          <label className="font-bold text-xs uppercase tracking-wider text-app-muted">Fact Description</label>
          <textarea
            rows={2}
            placeholder="Description of the statistic..."
            value={data.body || ''}
            onChange={(e) => handleValChange('body', e.target.value)}
            maxLength={120}
            className={`${inputClass} resize-none`}
          />
        </div>
      </div>
    </div>
  );
};
export default FactPosterControls;

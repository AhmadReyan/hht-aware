import React from 'react';
import { ManifestationsSelector } from './ManifestationsSelector';

export const EmergencyCardForm = ({ data = {}, onChange }) => {
  const handleChange = (field, val) => {
    onChange({ [field]: val });
  };

  const bloodTypes = ['Unknown', 'A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

  const inputClass =
    'w-full min-h-[44px] rounded-custom border border-line bg-app-surface2 px-3.5 py-2.5 font-sans text-sm text-app-ink placeholder-app-muted transition-colors focus:border-garnet focus:outline-none focus:ring-1 focus:ring-garnet';
  const labelClass = 'font-sans text-[11px] font-semibold uppercase tracking-wider text-garnet';

  return (
    <form className="flex flex-col gap-4 font-sans text-app-ink">
      {/* Full name */}
      <div className="flex flex-col gap-1.5">
        <label className={labelClass}>Full name</label>
        <input
          type="text"
          placeholder="John Doe"
          value={data.name || ''}
          onChange={(e) => handleChange('name', e.target.value)}
          className={inputClass}
        />
      </div>

      {/* DOB + Blood type */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Date of birth</label>
          <input
            type="date"
            value={data.dob || ''}
            onChange={(e) => handleChange('dob', e.target.value)}
            className={inputClass}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Blood type</label>
          <select
            value={data.bloodType || 'Unknown'}
            onChange={(e) => handleChange('bloodType', e.target.value)}
            className={`${inputClass} cursor-pointer appearance-none`}
          >
            {bloodTypes.map((type) => (
              <option key={type} value={type} className="bg-app-surface2 text-app-ink">
                {type}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Drug allergies */}
      <div className="flex flex-col gap-1.5">
        <label className={labelClass}>Drug allergies</label>
        <input
          type="text"
          placeholder="e.g. Penicillin, Aspirin"
          value={data.drugAllergies || ''}
          onChange={(e) => handleChange('drugAllergies', e.target.value)}
          className={inputClass}
        />
      </div>

      {/* Specialist name & phone */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>HHT specialist</label>
          <input
            type="text"
            placeholder="Dr. Smith / Mayo Clinic"
            value={data.specialist || ''}
            onChange={(e) => handleChange('specialist', e.target.value)}
            className={inputClass}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Specialist phone</label>
          <input
            type="tel"
            placeholder="+1 (555) 019-2834"
            value={data.specialistPhone || ''}
            onChange={(e) => handleChange('specialistPhone', e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      {/* Emergency contact name & phone */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Emergency contact</label>
          <input
            type="text"
            placeholder="Jane Doe (Spouse)"
            value={data.contactName || ''}
            onChange={(e) => handleChange('contactName', e.target.value)}
            className={inputClass}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Contact phone</label>
          <input
            type="tel"
            placeholder="+1 (555) 987-6543"
            value={data.contactPhone || ''}
            onChange={(e) => handleChange('contactPhone', e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      {/* Manifestations */}
      <ManifestationsSelector
        selected={data.manifestations || []}
        onChange={(selected) => handleChange('manifestations', selected)}
      />

      {/* Notes */}
      <div className="flex flex-col gap-1.5">
        <label className={labelClass}>Medications &amp; notes for doctors</label>
        <textarea
          rows={3}
          placeholder="e.g. Taking Bevacizumab, history of severe epistaxis, lung AVM coil embolization in 2022."
          value={data.notes || ''}
          onChange={(e) => handleChange('notes', e.target.value)}
          className={`${inputClass} resize-none`}
        />
      </div>
    </form>
  );
};

export default EmergencyCardForm;

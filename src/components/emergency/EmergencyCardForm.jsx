import React from 'react';
import { ManifestationsSelector } from './ManifestationsSelector';

export const EmergencyCardForm = ({ data, onChange }) => {
  const handleChange = (field, val) => {
    onChange({ [field]: val });
  };

  const bloodTypes = ['Unknown', 'A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

  const inputClass = 'w-full bg-app-surface2 border border-app-border/10 rounded-custom-sm text-sm px-3.5 py-2.5 text-white placeholder-app-muted focus:outline-none focus:border-brand-red-mid focus:ring-1 focus:ring-brand-red-mid transition-colors';

  return (
    <form className="flex flex-col gap-4 font-sans text-white">
      {/* Name and DOB */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <label className="font-bold text-xs uppercase tracking-wider text-app-muted">Full Name</label>
          <input
            type="text"
            placeholder="John Doe"
            value={data.name || ''}
            onChange={(e) => handleChange('name', e.target.value)}
            className={inputClass}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="font-bold text-xs uppercase tracking-wider text-app-muted">Date of Birth</label>
          <input
            type="date"
            value={data.dob || ''}
            onChange={(e) => handleChange('dob', e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      {/* Blood Type and Allergies */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <label className="font-bold text-xs uppercase tracking-wider text-app-muted">Blood Type</label>
          <select
            value={data.bloodType || 'Unknown'}
            onChange={(e) => handleChange('bloodType', e.target.value)}
            className={`${inputClass} appearance-none cursor-pointer`}
          >
            {bloodTypes.map((type) => (
              <option key={type} value={type} className="bg-app-dark2">
                {type}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="font-bold text-xs uppercase tracking-wider text-app-muted">Drug Allergies</label>
          <input
            type="text"
            placeholder="e.g. Penicillin, Aspirin"
            value={data.drugAllergies || ''}
            onChange={(e) => handleChange('drugAllergies', e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      {/* Specialist Name & Phone */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <label className="font-bold text-xs uppercase tracking-wider text-app-muted">HHT Specialist/Hospital</label>
          <input
            type="text"
            placeholder="Dr. Smith / Mayo Clinic"
            value={data.specialist || ''}
            onChange={(e) => handleChange('specialist', e.target.value)}
            className={inputClass}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="font-bold text-xs uppercase tracking-wider text-app-muted">Specialist Phone</label>
          <input
            type="tel"
            placeholder="+1 (555) 019-2834"
            value={data.specialistPhone || ''}
            onChange={(e) => handleChange('specialistPhone', e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      {/* Emergency Contact Name & Phone */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <label className="font-bold text-xs uppercase tracking-wider text-app-muted">Emergency Contact Name</label>
          <input
            type="text"
            placeholder="Jane Doe (Spouse)"
            value={data.contactName || ''}
            onChange={(e) => handleChange('contactName', e.target.value)}
            className={inputClass}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="font-bold text-xs uppercase tracking-wider text-app-muted">Emergency Contact Phone</label>
          <input
            type="tel"
            placeholder="+1 (555) 987-6543"
            value={data.contactPhone || ''}
            onChange={(e) => handleChange('contactPhone', e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      {/* Manifestations Selector */}
      <ManifestationsSelector
        selected={data.manifestations || []}
        onChange={(selected) => handleChange('manifestations', selected)}
      />

      {/* Additional Notes */}
      <div className="flex flex-col gap-1.5">
        <label className="font-bold text-xs uppercase tracking-wider text-app-muted">Additional Medical Notes / Medications</label>
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

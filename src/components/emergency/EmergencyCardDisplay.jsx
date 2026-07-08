import React from 'react';
import { Phone, Calendar, Heart, ShieldAlert, AlertTriangle } from 'lucide-react';

export const EmergencyCardDisplay = ({ data, cardRef }) => {
  const {
    name = '',
    dob = '',
    bloodType = 'Unknown',
    drugAllergies = '',
    specialist = '',
    specialistPhone = '',
    contactName = '',
    contactPhone = '',
    notes = '',
    manifestations = []
  } = data;

  const manifestationLabels = {
    nosebleeds: 'Nosebleeds',
    pulmonary: 'Pulmonary AVM',
    brain: 'Brain AVM',
    liver: 'Liver AVM',
    gi: 'GI Bleeding',
    skin: 'Skin Telangiectasias',
    anemia: 'Anemia',
    spinal: 'Spinal AVM'
  };

  return (
    <div
      ref={cardRef}
      className="w-full bg-[#1C1C1E] border border-red-900/40 rounded-custom overflow-hidden shadow-poster text-white font-sans flex flex-col select-none max-w-sm mx-auto"
    >
      {/* Header Alert Bar */}
      <div className="bg-brand-red px-4 py-2.5 flex items-center gap-2 border-b border-red-900/60">
        <ShieldAlert className="text-white flex-shrink-0 animate-pulse" size={18} />
        <div className="flex flex-col">
          <span className="font-sans font-extrabold text-[11px] uppercase tracking-widest text-white">
            MEDICAL ALERT — HHT PATIENT
          </span>
          <span className="text-[9px] text-red-200 uppercase font-bold tracking-wider">
            Hereditary Hemorrhagic Telangiectasia
          </span>
        </div>
      </div>

      <div className="p-4 flex flex-col gap-4">
        {/* Patient Details */}
        <div className="grid grid-cols-3 gap-2 border-b border-app-border/10 pb-3">
          <div className="col-span-2 flex flex-col gap-0.5">
            <span className="text-[9px] font-bold text-app-muted uppercase tracking-wider">Patient Name</span>
            <span className="text-sm font-semibold text-white truncate h-5">
              {name || '—'}
            </span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[9px] font-bold text-app-muted uppercase tracking-wider">DOB</span>
            <span className="text-xs font-semibold text-white flex items-center gap-1">
              <Calendar size={10} className="text-app-muted" />
              <span>{dob ? new Date(dob).toLocaleDateString('en-US', { timeZone: 'UTC' }) : '—'}</span>
            </span>
          </div>
        </div>

        {/* Medical Stats / Specialist */}
        <div className="grid grid-cols-2 gap-3 border-b border-app-border/10 pb-3">
          <div className="flex flex-col gap-0.5">
            <span className="text-[9px] font-bold text-brand-red-mid uppercase tracking-wider">Drug Allergies</span>
            <span className={`text-[11px] font-bold truncate h-5 ${drugAllergies ? 'text-brand-red-mid' : 'text-app-muted'}`}>
              {drugAllergies || 'None Known'}
            </span>
          </div>
          <div className="flex flex-col gap-0.5 border-l border-app-border/10 pl-3">
            <span className="text-[9px] font-bold text-app-muted uppercase tracking-wider">Blood Type</span>
            <span className="text-xs font-bold text-white flex items-center gap-1">
              <Heart size={10} className="text-brand-red-mid fill-brand-red-mid" />
              <span>{bloodType}</span>
            </span>
          </div>
        </div>

        {/* HHT Specialist */}
        <div className="grid grid-cols-2 gap-3 border-b border-app-border/10 pb-3">
          <div className="flex flex-col gap-0.5">
            <span className="text-[9px] font-bold text-app-muted uppercase tracking-wider">HHT Specialist</span>
            <span className="text-[11px] font-semibold text-white truncate h-5">
              {specialist || '—'}
            </span>
          </div>
          <div className="flex flex-col gap-0.5 border-l border-app-border/10 pl-3">
            <span className="text-[9px] font-bold text-app-muted uppercase tracking-wider">Specialist Phone</span>
            {specialistPhone ? (
              <a
                href={`tel:${specialistPhone}`}
                className="text-[11px] text-brand-teal font-bold flex items-center gap-1 hover:underline cursor-pointer"
              >
                <Phone size={10} />
                <span>{specialistPhone}</span>
              </a>
            ) : (
              <span className="text-[11px] text-app-muted">—</span>
            )}
          </div>
        </div>

        {/* Critical Warnings */}
        <div className="bg-red-950/40 border border-brand-red/30 rounded-custom p-3 flex gap-2">
          <AlertTriangle size={18} className="text-brand-red-mid flex-shrink-0 mt-0.5" />
          <div className="flex flex-col gap-1">
            <span className="font-sans font-bold text-[9px] uppercase text-brand-red-mid tracking-wider">
              ⚠️ CLINICAL EMERGENCY SAFETY ALERTS
            </span>
            <ul className="text-[10px] text-red-200 list-disc pl-3.5 leading-relaxed flex flex-col gap-0.5 font-medium">
              <li>Do NOT use nasal packing (tissue damage/severe bleeding).</li>
              <li>Screen for pulmonary AVMs before invasive procedures.</li>
              <li>Avoid NSAIDs/Aspirin without specialist approval.</li>
              <li>Rule out brain AVMs before administering anticoagulants.</li>
              <li>HHT causes fragile visceral AVMs — handle with care.</li>
            </ul>
          </div>
        </div>

        {/* Manifestations */}
        {manifestations.length > 0 && (
          <div className="flex flex-col gap-1">
            <span className="text-[9px] font-bold text-app-muted uppercase tracking-wider">Known Manifestations</span>
            <div className="flex flex-wrap gap-1 mt-0.5">
              {manifestations.map((m) => (
                <span
                  key={m}
                  className="bg-brand-red/10 border border-brand-red/20 text-brand-red-light font-bold text-[9px] px-2 py-0.5 rounded-custom-pill uppercase tracking-wider"
                >
                  {manifestationLabels[m] || m}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Emergency Contact */}
        <div className="bg-[#2C2C2E] p-3 rounded-custom flex justify-between items-center border border-app-border/5">
          <div className="flex flex-col gap-0.5">
            <span className="text-[9px] font-bold text-app-muted uppercase tracking-wider">Emergency Contact</span>
            <span className="text-xs font-semibold text-white truncate max-w-[160px]">
              {contactName || '—'}
            </span>
          </div>
          {contactPhone ? (
            <a
              href={`tel:${contactPhone}`}
              className="bg-brand-teal hover:bg-teal-600 text-white rounded-full p-2 transition-transform active:scale-90 hover:shadow-md cursor-pointer"
              aria-label="Call emergency contact"
            >
              <Phone size={14} />
            </a>
          ) : (
            <span className="text-xs text-app-muted font-semibold">—</span>
          )}
        </div>
      </div>

      {/* Card Footer */}
      <div className="bg-[#141416] py-2 px-4 text-center border-t border-app-border/5">
        <span className="text-[9px] text-app-muted uppercase tracking-wider">
          More Info: <span className="text-brand-red-mid font-bold">curehht.org</span> · HHT Foundation Int'l
        </span>
      </div>
    </div>
  );
};
export default EmergencyCardDisplay;

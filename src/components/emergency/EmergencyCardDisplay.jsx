import React from 'react';
import { motion } from 'framer-motion';
import { Phone, Calendar, Droplet, ShieldAlert, AlertTriangle, User } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { spring } from '../../lib/motion';

const MANIFESTATION_LABELS = {
  nosebleeds: 'Nosebleeds',
  pulmonary: 'Pulmonary AVM',
  brain: 'Brain AVM',
  liver: 'Liver AVM',
  gi: 'GI Bleeding',
  skin: 'Skin Telangiectasias',
  anemia: 'Anemia',
  spinal: 'Spinal AVM'
};

// Tiny helper: replays a spring "pop" every time the underlying value changes,
// so the passport visibly reacts as the user types — no layout jump risk since
// there's no exit animation, just a fresh entrance on each new value.
const LiveText = ({ value, className = '' }) => (
  <motion.span
    key={value}
    initial={{ opacity: 0.35, y: -3 }}
    animate={{ opacity: 1, y: 0 }}
    transition={spring.snappy}
    className={className}
  >
    {value}
  </motion.span>
);

const getInitials = (name) => {
  if (!name) return '';
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase() || '').join('');
};

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

  const initials = getInitials(name);

  return (
    <div className="relative w-full max-w-sm mx-auto">
      {/* Ambient glow behind the passport — decorative only */}
      <div aria-hidden className="absolute -inset-3 bg-aurora opacity-80 blur-2xl rounded-custom-xl pointer-events-none" />

      <motion.div
        animate={{ scale: [1, 1.004, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="relative bg-ember p-[1.5px] rounded-custom-xl shadow-raised shadow-glow"
      >
        <div
          ref={cardRef}
          className="relative w-full bg-app-dark2 rounded-custom-xl overflow-hidden text-app-ink font-sans flex flex-col select-none"
        >
          {/* Watermark seal */}
          <ShieldAlert aria-hidden className="absolute -right-5 -top-5 text-white/[0.05] rotate-12 pointer-events-none" size={150} />

          {/* Header */}
          <div className="relative bg-ember px-4 py-3 flex items-center gap-3 border-b border-black/20">
            <div className="h-11 w-11 shrink-0 rounded-full bg-white/15 border border-white/25 flex items-center justify-center text-white font-serif font-bold text-lg">
              {initials || <User size={18} />}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-serif font-bold text-sm text-white tracking-wide truncate">
                HHT Passport
              </span>
              <span className="text-[9px] text-white/80 uppercase font-bold tracking-widest truncate">
                Medical Alert · Hereditary Hemorrhagic Telangiectasia
              </span>
            </div>
            <ShieldAlert className="ml-auto text-white/90 animate-pulse-glow shrink-0" size={20} />
          </div>

          <div className="relative p-4 flex flex-col gap-4">
            {/* Patient Details */}
            <div className="grid grid-cols-3 gap-2 border-b border-app-border/20 pb-3">
              <div className="col-span-2 flex flex-col gap-0.5 min-w-0">
                <span className="text-[9px] font-bold text-app-muted uppercase tracking-wider">Patient Name</span>
                <LiveText value={name || '—'} className="text-sm font-semibold text-app-ink truncate block h-5" />
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[9px] font-bold text-app-muted uppercase tracking-wider">DOB</span>
                <span className="text-xs font-semibold text-app-ink flex items-center gap-1">
                  <Calendar size={10} className="text-app-muted shrink-0" />
                  <LiveText value={dob ? new Date(dob).toLocaleDateString('en-US', { timeZone: 'UTC' }) : '—'} />
                </span>
              </div>
            </div>

            {/* Blood Type / Allergies */}
            <div className="grid grid-cols-2 gap-3 border-b border-app-border/20 pb-3">
              <div className="flex flex-col gap-0.5">
                <span className="text-[9px] font-bold text-brand-red-light uppercase tracking-wider">Drug Allergies</span>
                <LiveText
                  value={drugAllergies || 'None Known'}
                  className={`text-[11px] font-bold truncate block h-5 ${drugAllergies ? 'text-brand-red-light' : 'text-app-muted'}`}
                />
              </div>
              <div className="flex flex-col gap-0.5 border-l border-app-border/20 pl-3">
                <span className="text-[9px] font-bold text-app-muted uppercase tracking-wider">Blood Type</span>
                <span className="text-xs font-bold text-app-ink flex items-center gap-1">
                  <Droplet size={10} className="text-brand-red-mid fill-brand-red-mid shrink-0" />
                  <LiveText value={bloodType} />
                </span>
              </div>
            </div>

            {/* HHT Specialist */}
            <div className="grid grid-cols-2 gap-3 border-b border-app-border/20 pb-3">
              <div className="flex flex-col gap-0.5 min-w-0">
                <span className="text-[9px] font-bold text-app-muted uppercase tracking-wider">HHT Specialist</span>
                <LiveText value={specialist || '—'} className="text-[11px] font-semibold text-app-ink truncate block h-5" />
              </div>
              <div className="flex flex-col gap-0.5 border-l border-app-border/20 pl-3">
                <span className="text-[9px] font-bold text-app-muted uppercase tracking-wider">Specialist Phone</span>
                {specialistPhone ? (
                  <a
                    href={`tel:${specialistPhone}`}
                    className="text-[11px] text-brand-teal-light font-bold flex items-center gap-1 hover:underline cursor-pointer"
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
            <div className="bg-brand-red/10 border border-brand-red/30 rounded-custom p-3 flex gap-2">
              <AlertTriangle size={18} className="text-brand-red-light shrink-0 mt-0.5" />
              <div className="flex flex-col gap-1">
                <span className="font-sans font-bold text-[9px] uppercase text-brand-red-light tracking-wider">
                  Clinical Emergency Safety Alerts
                </span>
                <ul className="text-[10px] text-app-soft list-disc pl-3.5 leading-relaxed flex flex-col gap-0.5 font-medium">
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
              <div className="flex flex-col gap-1.5">
                <span className="text-[9px] font-bold text-app-muted uppercase tracking-wider">Known Manifestations</span>
                <div className="flex flex-wrap gap-1.5">
                  {manifestations.map((m) => (
                    <Badge key={m} variant="red" size="sm">
                      {MANIFESTATION_LABELS[m] || m}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Additional Notes */}
            {notes && (
              <div className="flex flex-col gap-1">
                <span className="text-[9px] font-bold text-app-muted uppercase tracking-wider">Additional Notes</span>
                <p className="text-[11px] text-app-soft leading-relaxed whitespace-pre-wrap">{notes}</p>
              </div>
            )}

            {/* Emergency Contact */}
            <div className="bg-app-surface2 p-3 rounded-custom flex justify-between items-center border border-app-border/20">
              <div className="flex flex-col gap-0.5 min-w-0">
                <span className="text-[9px] font-bold text-app-muted uppercase tracking-wider">Emergency Contact</span>
                <LiveText value={contactName || '—'} className="text-xs font-semibold text-app-ink truncate block max-w-[160px]" />
              </div>
              {contactPhone ? (
                <a
                  href={`tel:${contactPhone}`}
                  className="bg-brand-teal hover:brightness-95 text-app-bg rounded-full p-2.5 transition-transform active:scale-90 hover:shadow-md cursor-pointer shrink-0"
                  aria-label="Call emergency contact"
                >
                  <Phone size={14} />
                </a>
              ) : (
                <span className="text-xs text-app-muted font-semibold shrink-0">—</span>
              )}
            </div>
          </div>

          {/* Card Footer */}
          <div className="bg-black/25 py-2 px-4 text-center border-t border-app-border/20">
            <span className="text-[9px] text-app-muted uppercase tracking-wider">
              More Info: <span className="text-brand-red-light font-bold">curehht.org</span> · HHT Foundation Int'l
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
export default EmergencyCardDisplay;

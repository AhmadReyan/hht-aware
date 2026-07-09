import React from 'react';
import { FlipCard } from '../ui/FlipCard';
import { Vessels } from '../ui/Vessels';
import { Phone, RotateCw } from 'lucide-react';

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

// The four non-negotiable warnings any ER must see. Kept as a constant so the
// flip card and the printable sheet stay perfectly in sync.
const PHYSICIAN_WARNINGS = [
  'No nasal packing — causes tissue damage & severe bleeding.',
  'Screen for pulmonary AVMs before invasive procedures.',
  'Avoid NSAIDs / Aspirin without specialist approval.',
  'Rule out brain AVMs before administering anticoagulants.'
];

const fmtDate = (dob) => {
  if (!dob) return '—';
  const d = new Date(dob);
  if (Number.isNaN(d.getTime())) return dob;
  return d.toLocaleDateString('en-US', { timeZone: 'UTC' });
};

const labelFor = (m) => MANIFESTATION_LABELS[m] || m;

/**
 * EmergencyCardDisplay — the warm-editorial "Medical Emergency Passport".
 *
 * A tap-to-flip ID card:
 *   FRONT  ember gradient · patient identity + diagnosis  (the hero face)
 *   BACK   white / garnet border · the physician-critical clinical alerts
 *
 * Alongside it we render a hidden, print-clean static sheet (cardRef) so the
 * PDF export captures every detail without wrestling the 3D transform.
 */
export const EmergencyCardDisplay = ({ data = {}, cardRef }) => {
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
  } = data || {};

  const mList = Array.isArray(manifestations) ? manifestations : [];

  /* ---------- FRONT face (ember identity card) ---------- */
  const front = (
    <div className="relative h-full w-full overflow-hidden rounded-custom-lg bg-ember text-white shadow-raised">
      <Vessels color="#fff" opacity={0.16} />
      <div className="relative flex h-full flex-col p-5">
        <div className="font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-white/85">
          Medical Emergency Passport
        </div>

        <div className="mt-2">
          <div className="font-serif text-[26px] font-extrabold leading-tight">
            {name || 'Your Name'}
          </div>
          <div className="mt-1 font-sans text-[13px] text-white/90">
            DOB {fmtDate(dob)} · Blood type {bloodType || 'Unknown'}
          </div>
        </div>

        <div className="mt-auto rounded-custom bg-white/[0.14] px-3.5 py-2.5 backdrop-blur-sm">
          <div className="font-sans text-[10px] uppercase tracking-wider text-white/75">
            Diagnosis
          </div>
          <div className="font-serif text-[14px] font-extrabold leading-snug">
            HHT — Hereditary Hemorrhagic Telangiectasia
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <span className="font-sans text-[10px] uppercase tracking-wider text-white/70">
            curehht.org · HHT Foundation Int'l
          </span>
          <span className="flex items-center gap-1 font-sans text-[11px] text-white/85">
            tap to flip <RotateCw size={12} />
          </span>
        </div>
      </div>
    </div>
  );

  /* ---------- BACK face (physician clinical alerts) ---------- */
  const back = (
    <div className="relative h-full w-full overflow-hidden rounded-custom-lg border-2 border-garnet bg-app-surface text-app-ink">
      <div className="flex h-full flex-col overflow-y-auto p-5">
        <div className="font-sans text-[10px] font-semibold uppercase tracking-[0.16em] text-garnet">
          For medical professionals
        </div>

        <ul className="mt-2 flex flex-col gap-1.5">
          {PHYSICIAN_WARNINGS.map((w) => (
            <li key={w} className="flex gap-2 font-sans text-[11px] leading-snug text-app-ink">
              <span className="mt-[3px] h-1.5 w-1.5 shrink-0 rounded-full bg-garnet" />
              <span>{w}</span>
            </li>
          ))}
        </ul>

        {drugAllergies ? (
          <div className="mt-3 rounded-custom bg-rose px-3 py-2">
            <span className="font-sans text-[10px] font-semibold uppercase tracking-wider text-garnet">
              Drug allergies
            </span>
            <div className="font-sans text-[12px] font-bold text-garnet">{drugAllergies}</div>
          </div>
        ) : null}

        {mList.length > 0 && (
          <div className="mt-3">
            <span className="font-sans text-[10px] font-semibold uppercase tracking-wider text-app-muted">
              Known manifestations
            </span>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {mList.map((m) => (
                <span
                  key={m}
                  className="rounded-custom-pill border border-line bg-app-surface2 px-2.5 py-1 font-sans text-[10px] font-semibold text-app-soft"
                >
                  {labelFor(m)}
                </span>
              ))}
            </div>
          </div>
        )}

        {notes ? (
          <div className="mt-3">
            <span className="font-sans text-[10px] font-semibold uppercase tracking-wider text-app-muted">
              Patient notes
            </span>
            <p className="font-sans text-[11px] leading-snug text-app-soft line-clamp-3">{notes}</p>
          </div>
        ) : null}

        <div className="mt-auto flex items-center justify-between gap-2 border-t border-line pt-2.5">
          <div className="min-w-0">
            <span className="font-sans text-[10px] font-semibold uppercase tracking-wider text-app-muted">
              Emergency contact
            </span>
            <div className="truncate font-sans text-[12px] font-semibold text-app-ink">
              {contactName || '—'}
              {contactPhone ? ` · ${contactPhone}` : ''}
            </div>
          </div>
          {contactPhone ? (
            <a
              href={`tel:${contactPhone}`}
              onClick={(e) => e.stopPropagation()}
              aria-label="Call emergency contact"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-teal text-white active:scale-90"
            >
              <Phone size={14} />
            </a>
          ) : null}
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full">
      <FlipCard front={front} back={back} height={300} />

      {/* Hidden, print-clean sheet captured for the PDF export. */}
      <div
        aria-hidden
        style={{ position: 'absolute', left: -99999, top: 0, width: 360, pointerEvents: 'none' }}
      >
        <div ref={cardRef} style={{ width: 360, background: '#FFFFFF', color: '#2A181D', fontFamily: 'Instrument Sans, sans-serif' }}>
          {/* header */}
          <div style={{ position: 'relative', overflow: 'hidden', background: 'linear-gradient(140deg, #571826, #8E2D3B)', color: '#fff', padding: 20 }}>
            <div style={{ fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', opacity: 0.85 }}>
              Medical Emergency Passport
            </div>
            <div style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontSize: 26, fontWeight: 800, marginTop: 6 }}>
              {name || 'Your Name'}
            </div>
            <div style={{ fontSize: 13, opacity: 0.9, marginTop: 2 }}>
              DOB {fmtDate(dob)} · Blood type {bloodType || 'Unknown'}
            </div>
            <div style={{ marginTop: 12, background: 'rgba(255,255,255,0.14)', borderRadius: 10, padding: '8px 12px' }}>
              <div style={{ fontSize: 10, textTransform: 'uppercase', opacity: 0.8 }}>Diagnosis</div>
              <div style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontSize: 15, fontWeight: 800 }}>
                HHT — Hereditary Hemorrhagic Telangiectasia
              </div>
            </div>
          </div>

          {/* body */}
          <div style={{ padding: 18 }}>
            <div style={{ fontSize: 10, letterSpacing: 1.5, textTransform: 'uppercase', color: '#8E2D3B', fontWeight: 700 }}>
              For medical professionals
            </div>
            <ul style={{ margin: '8px 0 0', paddingLeft: 18, fontSize: 12, lineHeight: 1.5 }}>
              {PHYSICIAN_WARNINGS.map((w) => (
                <li key={w} style={{ marginBottom: 3 }}>{w}</li>
              ))}
            </ul>

            <div style={{ marginTop: 12, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div>
                <div style={{ fontSize: 10, textTransform: 'uppercase', color: '#7A5F63', fontWeight: 700 }}>Drug allergies</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: drugAllergies ? '#8E2D3B' : '#7A5F63' }}>
                  {drugAllergies || 'None known'}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 10, textTransform: 'uppercase', color: '#7A5F63', fontWeight: 700 }}>HHT specialist</div>
                <div style={{ fontSize: 12, fontWeight: 600 }}>
                  {specialist || '—'}{specialistPhone ? ` · ${specialistPhone}` : ''}
                </div>
              </div>
            </div>

            {mList.length > 0 && (
              <div style={{ marginTop: 12 }}>
                <div style={{ fontSize: 10, textTransform: 'uppercase', color: '#7A5F63', fontWeight: 700 }}>Known manifestations</div>
                <div style={{ fontSize: 12, marginTop: 2 }}>{mList.map(labelFor).join(' · ')}</div>
              </div>
            )}

            {notes ? (
              <div style={{ marginTop: 12 }}>
                <div style={{ fontSize: 10, textTransform: 'uppercase', color: '#7A5F63', fontWeight: 700 }}>Patient notes</div>
                <div style={{ fontSize: 12, lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>{notes}</div>
              </div>
            ) : null}

            <div style={{ marginTop: 14, background: '#FFF7F3', border: '1px solid #E9DAD4', borderRadius: 12, padding: 12 }}>
              <div style={{ fontSize: 10, textTransform: 'uppercase', color: '#7A5F63', fontWeight: 700 }}>Emergency contact</div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>
                {contactName || '—'}{contactPhone ? ` · ${contactPhone}` : ''}
              </div>
            </div>

            <div style={{ marginTop: 12, textAlign: 'center', fontSize: 10, color: '#7A5F63', textTransform: 'uppercase', letterSpacing: 1 }}>
              curehht.org · HHT Foundation International
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencyCardDisplay;

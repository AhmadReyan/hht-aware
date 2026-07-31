import React from 'react';
import { Modal } from '../ui/Modal';
import { ShieldAlert, CheckCircle2, BookOpen } from 'lucide-react';

const WHY_DETAILS = {
  nose_moisture: {
    title: 'Why Moisturize Your Nose?',
    kicker: 'Clinical Evidence',
    summary: 'Keeping the nasal mucosa moist prevents micro-cracks that trigger fragile telangiectasias to bleed.',
    bullets: [
      'Reduces nosebleed frequency by up to 50% in published HHT guidelines.',
      'Use water/saline gels or botanical oils (Ponaris) morning & night.',
      'If using petroleum jelly (Aquaphor), apply a thin layer sparingly to avoid deep inhalation.'
    ],
    source: 'International HHT Guidelines (Ann Intern Med, 2020)'
  },
  humidifier: {
    title: 'Why Run a Humidifier?',
    kicker: 'Nightly Protection',
    summary: 'Overnight heating and AC dry out delicate nasal membranes while you sleep.',
    bullets: [
      'Maintaining 40–60% room humidity stops night-time crusting.',
      'Clean the water reservoir regularly to avoid mold or bacteria.',
      'Keep it near your bed for maximum overnight moisture benefit.'
    ],
    source: 'Mayo Clinic & Patient-Reported HHT Habits'
  },
  hydration: {
    title: 'Why Stay Hydrated?',
    kicker: 'Systemic Health',
    summary: 'Internal hydration supports systemic mucous membrane health and blood volume.',
    bullets: [
      'Drinking water regularly throughout the day keeps mucosal linings supple.',
      'Helps maintain plasma volume when managing frequent blood loss.',
      'Limits dryness induced by caffeine or dry climates.'
    ],
    source: 'Cure HHT Patient Care Guide'
  },
  iron: {
    title: 'Why Iron-Friendly Nutrition?',
    kicker: 'Anemia Prevention',
    summary: 'Nosebleeds drain iron reserves; dietary iron and Vitamin C help rebuild hemoglobin.',
    bullets: [
      'Combine iron-rich foods (lean meats, legumes, dark greens) with Vitamin C for absorption.',
      'Avoid drinking tea/coffee directly with meals (tannins reduce iron uptake).',
      'Track ferritin & hemoglobin regularly with your physician.'
    ],
    source: 'St. Michael’s Hospital HHT Clinic Recommendations'
  },
  avoid_triggers: {
    title: 'Why Avoid Triggers?',
    kicker: 'Pattern Control',
    summary: 'Fragile HHT vessels react sharply to pressure spikes, friction, and vasodilation.',
    bullets: [
      'Avoid forceful nose blowing; blow gently one nostril at a time.',
      'Limit spicy or very hot foods and excessive alcohol which dilate blood vessels.',
      'Protect your nose during dry or dusty activities with a mask or extra saline.'
    ],
    source: 'Cure HHT Nosebleed Care Checklist'
  }
};

export const ActionWhyModal = ({ item, isOpen, onClose }) => {
  if (!item) return null;
  const details = WHY_DETAILS[item.key] || {
    title: item.label,
    kicker: 'Self-Care Insight',
    summary: item.hint,
    bullets: ['Consistent daily practice supports long-term HHT symptom reduction.'],
    source: 'Cure HHT Educational Resources'
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={details.title} type="bottom-sheet">
      <div className="flex flex-col gap-4 text-app-ink pt-1">
        {/* Kicker badge */}
        <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-garnet bg-rose/60 border border-garnet/10 rounded-custom-pill px-3 py-1 w-fit">
          <BookOpen size={13} />
          <span>{details.kicker}</span>
        </div>

        {/* Summary */}
        <p className="text-xs font-semibold leading-relaxed text-app-ink bg-app-surface2 border border-line rounded-custom p-3">
          {details.summary}
        </p>

        {/* Key Takeaways */}
        <div className="flex flex-col gap-2">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-app-muted">
            Key Guidance
          </span>
          <ul className="flex flex-col gap-2">
            {details.bullets.map((b, i) => (
              <li key={i} className="flex items-start gap-2 text-xs leading-relaxed text-app-soft">
                <CheckCircle2 size={15} className="text-brand-teal flex-shrink-0 mt-0.5" />
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Clinical Citation Source */}
        <div className="mt-2 pt-3 border-t border-line flex items-center gap-2 text-[10px] text-app-muted italic">
          <ShieldAlert size={13} className="text-garnet flex-shrink-0" />
          <span>Source: {details.source}</span>
        </div>
      </div>
    </Modal>
  );
};

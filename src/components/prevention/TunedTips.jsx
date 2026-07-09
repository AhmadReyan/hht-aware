import React, { useState } from 'react';
import { Sunrise, Sun, Moon, Salad } from 'lucide-react';
import { Chip } from '../ui/Chip';
import { SectionTitle } from '../ui/SectionTitle';

/**
 * TunedTips — the reference "Tips tuned to you" module, ported to the real app.
 *
 * A Time-of-day Chip row (Morning / Day / Night) and an Age Chip row swap a set
 * of prevention tips plus a rose "Diet · <age>" callout panel, with a `.pop`
 * entrance on every change. Content is grounded in the app's own HHT guidance
 * and personalized around the products the user actually uses (Aquaphor,
 * Ponaris) — no new medical claims.
 */

const TIME_META = {
  Morning: { icon: Sunrise },
  Day: { icon: Sun },
  Night: { icon: Moon },
};

const TIPS = {
  Morning: [
    'Moisturize first thing — a thin layer of Aquaphor or a couple of Ponaris drops in each nostril before you head out.',
    'Take iron (if prescribed) with a little vitamin C, spaced away from coffee or tea.',
    'Quick body check: any dizziness, unusual tiredness, or paleness worth noting today?',
  ],
  Day: [
    'Sip water through the day — the nasal lining dries out faster than you would think.',
    'Keep salt and heavy masala light, and notice how your nose responds after a spicy meal.',
    'Reach for acetaminophen over ibuprofen, and keep moisturizer within arm’s reach.',
  ],
  Night: [
    'Reapply nasal moisturizer before bed — the single most protective overnight habit.',
    'Run a clean humidifier; aim for 40–60% room humidity in heated or air-conditioned air.',
    'Keep alcohol light and wind down — stress makes an already fragile nose more reactive.',
  ],
};

const DIET = {
  'Under 30':
    'Build meals around iron-rich foods (spinach, lentils, red meat if you eat it) — frequent small bleeds quietly drain iron stores. A little vitamin C alongside helps it stick.',
  '30–50':
    'Pair iron with vitamin C for absorption, and ask your doctor about yearly ferritin checks. Planning a pregnancy? Loop in your HHT specialist early.',
  '50+':
    'Review supplements and blood thinners with your team — fish oil, ginkgo and high-dose garlic all raise bleed risk. Ask about GI screening if anemia outpaces your nosebleeds.',
};

const initialTimeOfDay = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Morning';
  if (h < 18) return 'Day';
  return 'Night';
};

export const TunedTips = () => {
  const [time, setTime] = useState(initialTimeOfDay);
  const [age, setAge] = useState('30–50');

  return (
    <div className="flex flex-col gap-4">
      <SectionTitle kicker="Personalized" title="Tips for your day & stage" />

      {/* Time of day */}
      <div className="flex flex-col gap-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-app-muted px-0.5">
          Time of day
        </span>
        <div className="flex flex-wrap gap-2">
          {Object.keys(TIPS).map((t) => (
            <Chip key={t} label={t} active={time === t} onClick={() => setTime(t)} />
          ))}
        </div>
      </div>

      {/* Age */}
      <div className="flex flex-col gap-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-app-muted px-0.5">
          Your age
        </span>
        <div className="flex flex-wrap gap-2">
          {Object.keys(DIET).map((a) => (
            <Chip key={a} label={a} active={age === a} onClick={() => setAge(a)} tone="teal" />
          ))}
        </div>
      </div>

      {/* Tuned panel — .pop on every time/age change */}
      <div
        key={time + age}
        className="pop bg-app-surface border border-line rounded-custom-lg p-5 shadow-card flex flex-col gap-1"
      >
        {TIPS[time].map((tip, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-3 py-2.5 text-[13.5px] leading-relaxed text-app-ink ${
              idx < TIPS[time].length - 1 ? 'border-b border-line/70' : ''
            }`}
          >
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-garnet flex-shrink-0" />
            <span>{tip}</span>
          </div>
        ))}

        {/* Rose diet callout */}
        <div className="mt-3 bg-rose rounded-custom p-4 flex flex-col gap-1.5">
          <div className="flex items-center gap-1.5">
            <Salad size={13} className="text-garnet" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-garnet">
              Diet · {age}
            </span>
          </div>
          <p className="text-[13px] leading-relaxed text-app-ink">{DIET[age]}</p>
        </div>
      </div>
    </div>
  );
};
export default TunedTips;

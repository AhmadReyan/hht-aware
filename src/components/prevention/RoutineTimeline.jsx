import React from 'react';
import { Sun, Coffee, Moon, Repeat } from 'lucide-react';

const timeIcons = {
  Morning: Sun,
  Daytime: Coffee,
  Evening: Moon,
  Ongoing: Repeat,
};

/**
 * Turns the evidence into a realistic daily rhythm the user can actually follow.
 */
export const RoutineTimeline = ({ routine = [] }) => {
  if (!routine.length) return null;

  return (
    <div className="flex flex-col gap-0">
      {routine.map((block, idx) => {
        const Icon = timeIcons[block.time] || Repeat;
        const isLast = idx === routine.length - 1;
        return (
          <div key={block.time} className="flex gap-3">
            {/* Rail */}
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-brand-red/15 border border-brand-red-mid/30 flex items-center justify-center flex-shrink-0">
                <Icon size={15} className="text-brand-red-mid" />
              </div>
              {!isLast && <div className="w-0.5 flex-1 bg-app-border/10 my-1" />}
            </div>

            {/* Content */}
            <div className={`flex flex-col gap-1.5 ${isLast ? 'pb-0' : 'pb-4'} flex-1`}>
              <span className="font-sans font-bold text-xs uppercase tracking-wider text-white">
                {block.time}
              </span>
              <ul className="flex flex-col gap-1.5">
                {(block.items || []).map((item, i) => (
                  <li key={i} className="text-[11px] text-app-border leading-relaxed flex gap-1.5">
                    <span className="text-brand-red-mid">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );
      })}
    </div>
  );
};
export default RoutineTimeline;

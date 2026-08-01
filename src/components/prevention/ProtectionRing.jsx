import React, { Suspense, lazy } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Flame } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { selfCareItems } from '../../data/selfCare';
import { spring } from '../../lib/motion';

const Shield3DCanvas = lazy(() => import('./Shield3DCanvas'));

export const ProtectionRing = () => {
  const selfCareToday = useAppStore((s) => s.selfCareToday);
  const streak = useAppStore((s) => (s.getSelfCareStreak ? s.getSelfCareStreak() : 0));

  const doneKeys = selfCareToday?.done || [];
  const count = doneKeys.length;
  const total = selfCareItems.length;
  const percent = total > 0 ? Math.round((count / total) * 100) : 0;
  const isComplete = count >= total && total > 0;

  const hr = new Date().getHours();
  const greeting = hr < 12 ? 'Good morning' : hr < 17 ? 'Good afternoon' : 'Good evening';
  const todayFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  // Slim progress ring that FRAMES the 3D shield (sits at the outer edge, so it
  // never covers the 3D object — the shield stays fully visible).
  const box = 220;
  const strokeWidth = 6;
  const radius = (box - strokeWidth) / 2 - 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;
  const ringColor = isComplete ? '#D9A13B' : percent > 50 ? '#15756C' : '#8E2D3B';

  return (
    <div className="relative overflow-hidden rounded-custom-lg bg-app-surface border border-line p-5 shadow-card flex flex-col items-center text-center">
      {/* Soft glow when the day is fully shielded */}
      {isComplete && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.15, scale: 1.1 }}
          className="absolute inset-0 bg-gold pointer-events-none rounded-custom-lg filter blur-xl"
        />
      )}

      {/* Greeting + streak */}
      <div className="relative z-10 flex items-center justify-between w-full mb-1 px-1">
        <div className="flex flex-col text-left">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-garnet">
            {todayFormatted}
          </span>
          <span className="font-serif text-base font-extrabold text-app-ink">{greeting}</span>
        </div>
        {streak > 0 && (
          <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/20 text-amber-600 rounded-custom-pill px-2.5 py-1 text-[11px] font-bold">
            <Flame size={13} className="fill-amber-500 text-amber-500" />
            <span>{streak}d streak</span>
          </div>
        )}
      </div>

      {/* 3D shield hero, framed by a slim progress ring — nothing on top of it */}
      <div
        className="relative flex items-center justify-center"
        style={{ width: box, height: box, maxWidth: '100%' }}
      >
        <svg
          className="absolute inset-0 h-full w-full pointer-events-none"
          viewBox={`0 0 ${box} ${box}`}
        >
          <circle
            cx={box / 2}
            cy={box / 2}
            r={radius}
            fill="none"
            stroke="var(--line)"
            strokeWidth={strokeWidth}
            opacity={0.35}
          />
          <motion.circle
            cx={box / 2}
            cy={box / 2}
            r={radius}
            fill="none"
            stroke={ringColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={spring.soft}
            style={{ rotate: -90, originX: '50%', originY: '50%' }}
          />
        </svg>

        <Suspense fallback={<div style={{ width: box, height: box }} />}>
          <Shield3DCanvas percent={percent} />
        </Suspense>
      </div>

      {/* Clean numeric readout BELOW the shield — no box, no duplicate icon */}
      <div className="relative z-10 -mt-2 flex flex-col items-center">
        <span className="font-serif text-4xl font-black leading-none" style={{ color: ringColor }}>
          {percent}%
        </span>
        <span className="text-[10px] font-extrabold uppercase tracking-wider text-garnet mt-1">
          {count}/{total} shielded
        </span>
      </div>

      {/* Status subtext */}
      <div className="relative z-10 mt-2 flex items-center gap-1.5 text-[12px] font-medium text-app-soft">
        {isComplete ? (
          <span className="flex items-center gap-1 text-gold font-bold">
            <Sparkles size={14} /> Full daily protection active!
          </span>
        ) : (
          <span>
            {count === 0
              ? 'Tap tiles below to activate your shield'
              : `${total - count} more item${total - count > 1 ? 's' : ''} for full shield`}
          </span>
        )}
      </div>
    </div>
  );
};

export default ProtectionRing;

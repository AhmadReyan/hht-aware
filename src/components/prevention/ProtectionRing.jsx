import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Sparkles, Flame } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { selfCareItems } from '../../data/selfCare';
import { spring } from '../../lib/motion';

export const ProtectionRing = () => {
  const selfCareToday = useAppStore((s) => s.selfCareToday);
  const streak = useAppStore((s) => (s.getSelfCareStreak ? s.getSelfCareStreak() : 0));

  const doneKeys = selfCareToday?.done || [];
  const count = doneKeys.length;
  const total = selfCareItems.length;
  const percent = Math.round((count / total) * 100);
  const isComplete = count >= total && total > 0;

  const hr = new Date().getHours();
  const greeting = hr < 12 ? 'Good morning' : hr < 17 ? 'Good afternoon' : 'Good evening';
  const todayFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  const size = 150;
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  const ringColor = isComplete ? '#D9A13B' : percent > 50 ? '#15756C' : '#8E2D3B';

  return (
    <div className="relative overflow-hidden rounded-custom-lg bg-app-surface border border-line p-5 shadow-card flex flex-col items-center text-center">
      {/* Background glow when complete */}
      {isComplete && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.15, scale: 1.1 }}
          className="absolute inset-0 bg-gold pointer-events-none rounded-custom-lg filter blur-xl"
        />
      )}

      {/* Micro Greeting */}
      <div className="flex items-center justify-between w-full mb-3 px-1">
        <div className="flex flex-col text-left">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-garnet">
            {todayFormatted}
          </span>
          <span className="font-serif text-base font-extrabold text-app-ink">
            {greeting}
          </span>
        </div>
        {streak > 0 && (
          <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/20 text-amber-600 rounded-custom-pill px-2.5 py-1 text-[11px] font-bold">
            <Flame size={13} className="fill-amber-500 text-amber-500" />
            <span>{streak}d streak</span>
          </div>
        )}
      </div>

      {/* Protection Ring */}
      <div className="relative my-2 flex items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="var(--line)"
            strokeWidth={strokeWidth}
            opacity={0.3}
          />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke={ringColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={spring.soft}
            strokeLinecap="round"
            style={{ rotate: -90, originX: '50%', originY: '50%' }}
          />
        </svg>

        {/* Center Shield & Metrics */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-2">
          <motion.div
            animate={{ scale: isComplete ? [1, 1.15, 1] : 1 }}
            transition={spring.bouncy}
            className="flex items-center justify-center mb-0.5"
          >
            <ShieldCheck
              size={32}
              style={{ color: ringColor }}
              className={`transition-colors ${isComplete ? 'drop-shadow-md' : ''}`}
            />
          </motion.div>
          <span className="font-serif text-2xl font-black leading-none text-app-ink">
            {percent}%
          </span>
          <span className="text-[10px] font-bold uppercase tracking-wider text-app-muted mt-0.5">
            {count}/{total} Shielded
          </span>
        </div>
      </div>

      {/* Subtext status */}
      <div className="mt-2 flex items-center gap-1.5 text-[12px] font-medium text-app-soft">
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

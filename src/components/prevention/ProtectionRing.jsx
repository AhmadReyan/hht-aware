import React, { Suspense, lazy } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Sparkles, Flame, Box } from 'lucide-react';
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

      {/* 3D WebGL Interactive Shield Hero */}
      <div className="relative my-1 flex flex-col items-center justify-center">
        {/* 3D Canvas Layer */}
        <Suspense fallback={<div className="w-[220px] h-[220px] mx-auto" />}>
          <Shield3DCanvas percent={percent} />
        </Suspense>

        {/* Floating 3D Badge */}
        <div className="absolute top-1 left-1/2 -translate-x-1/2 bg-app-surface/90 border border-line px-2 py-0.5 rounded-custom-pill flex items-center gap-1 text-[9.5px] font-bold text-app-muted shadow-xs pointer-events-none">
          <Box size={11} className="text-garnet animate-spin-slow" />
          <span>Interactive 3D Shield</span>
        </div>

        {/* Ring Metrics Overlay */}
        <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center p-2">
          <svg className="absolute inset-0 w-full h-full" viewBox={`0 0 ${size} ${size}`}>
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="transparent"
              stroke="var(--line)"
              strokeWidth={4}
              opacity={0.25}
            />
            <motion.circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="transparent"
              stroke={ringColor}
              strokeWidth={5}
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: offset }}
              transition={spring.soft}
              strokeLinecap="round"
              style={{ rotate: -90, originX: '50%', originY: '50%' }}
            />
          </svg>

          <div className="relative z-10 flex flex-col items-center justify-center bg-app-surface/95 backdrop-blur-md px-3.5 py-2.5 rounded-2xl border border-line/80 shadow-card">
            <motion.div
              animate={{ scale: isComplete ? [1, 1.15, 1] : 1 }}
              transition={spring.bouncy}
              className="flex items-center justify-center mb-0.5"
            >
              <ShieldCheck
                size={24}
                style={{ color: ringColor }}
                className={`transition-colors ${isComplete ? 'drop-shadow-md' : ''}`}
              />
            </motion.div>
            <span className="font-serif text-2xl font-black leading-none text-app-ink">
              {percent}%
            </span>
            <span className="text-[9.5px] font-extrabold uppercase tracking-wider text-garnet mt-1">
              {count}/{total} Shielded
            </span>
          </div>
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

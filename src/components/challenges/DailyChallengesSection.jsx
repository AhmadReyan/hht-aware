import React from 'react';
import { motion } from 'framer-motion';
import { CalendarClock } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { DailyChallengeCard } from './DailyChallengeCard';
import { spring } from '../../lib/motion';

// Small activity-ring style progress indicator for "today's" completion.
const DailyRing = ({ completed, total }) => {
  const pct = total > 0 ? completed / total : 0;
  const size = 40;
  const stroke = 4;
  const r = (size - stroke) / 2;
  const circumference = 2 * Math.PI * r;

  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          strokeWidth={stroke}
          fill="none"
          style={{ stroke: 'var(--border)', opacity: 0.35 }}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          strokeWidth={stroke}
          strokeLinecap="round"
          fill="none"
          style={{ stroke: 'var(--teal)' }}
          strokeDasharray={circumference}
          initial={false}
          animate={{ strokeDashoffset: circumference - pct * circumference }}
          transition={spring.gentle}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-[9.5px] font-extrabold text-app-ink">
        {completed}/{total}
      </div>
    </div>
  );
};

export const DailyChallengesSection = ({
  tasks,
  isDone,
  onToggle,
  completedCount,
  lifetimeCompletions = 0,
  perfectDaysCount = 0
}) => {
  const allDone = tasks.length > 0 && completedCount === tasks.length;

  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center justify-between px-1">
        <h2 className="font-bold text-xs uppercase tracking-wider text-app-muted flex items-center gap-1.5">
          <CalendarClock size={13} className="text-brand-teal" />
          Today&apos;s Dailies
        </h2>
        <div className="flex items-center gap-2">
          {allDone && (
            <Badge variant="teal" size="sm" className="font-extrabold">Perfect day! 🎉</Badge>
          )}
          <DailyRing completed={completedCount} total={tasks.length} />
        </div>
      </div>

      <div className="flex flex-col gap-2.5">
        {tasks.map((task) => (
          <DailyChallengeCard
            key={task.id}
            task={task}
            isDone={isDone(task.id)}
            onToggle={onToggle}
          />
        ))}
      </div>

      <p className="text-[10px] text-app-muted px-1 leading-relaxed">
        Dailies refresh every day at midnight — come back tomorrow for a new set!
        {lifetimeCompletions > 0 && (
          <span className="text-app-muted/80">
            {' '}You&apos;ve completed {lifetimeCompletions} dailies all-time
            {perfectDaysCount > 0 ? ` and had ${perfectDaysCount} perfect day${perfectDaysCount === 1 ? '' : 's'}.` : '.'}
          </span>
        )}
      </p>
    </section>
  );
};
export default DailyChallengesSection;

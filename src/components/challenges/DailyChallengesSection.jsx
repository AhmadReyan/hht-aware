import React from 'react';
import { CalendarClock } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { DailyChallengeCard } from './DailyChallengeCard';

export const DailyChallengesSection = ({
  tasks,
  isDone,
  onToggle,
  completedCount,
  lifetimeCompletions = 0,
  perfectDaysCount = 0
}) => {
  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center justify-between px-1">
        <h2 className="font-bold text-xs uppercase tracking-wider text-app-muted flex items-center gap-1.5">
          <CalendarClock size={13} className="text-brand-teal" />
          Today&apos;s Dailies
        </h2>
        <Badge variant="teal" size="sm">{completedCount}/{tasks.length} done</Badge>
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

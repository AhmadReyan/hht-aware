import React from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '../../store/useAppStore';

export const SelfCareConsistency = () => {
  const history = useAppStore(s => s.selfCareHistory);

  // Local "YYYY-MM-DD" — matches how the store writes selfCareHistory dates
  // (never UTC, so cells don't shift a day near midnight / outside UTC).
  const toLocalDateStr = (d) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  // Last 21 days for a compact 3-week view
  const last21Days = Array.from({ length: 21 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (20 - i));
    const dateStr = toLocalDateStr(d);
    const entry = history.find(h => h.date === dateStr);
    return {
      date: dateStr,
      count: entry ? entry.done.length : 0,
      isToday: i === 20
    };
  });

  const getColor = (count) => {
    if (count === 0) return 'bg-line opacity-40';
    if (count <= 2) return 'bg-teal/30';
    if (count <= 4) return 'bg-teal/60';
    return 'bg-teal';
  };

  return (
    <div className="flex flex-col gap-3 bg-white border border-line rounded-custom-lg p-5 shadow-sm">
      <div className="flex justify-between items-center">
        <span className="text-[10px] font-bold uppercase tracking-widest text-app-muted">Consistency (Last 3 weeks)</span>
        <span className="text-[10px] font-bold text-teal">Habit forming</span>
      </div>

      <div className="flex gap-1.5 justify-between h-8 items-end">
        {last21Days.map((day, i) => (
          <div key={day.date} className="flex flex-col gap-1 items-center flex-1">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: i * 0.02 }}
              className={`w-full rounded-sm ${getColor(day.count)} ${day.isToday ? 'ring-2 ring-garnet ring-offset-1' : ''}`}
              style={{ height: day.count === 0 ? 8 : 8 + (day.count * 4) }}
            />
          </div>
        ))}
      </div>
      <p className="text-[10px] text-app-muted text-center mt-1 italic">
        Keep the chain going — daily care lowers clinical risk.
      </p>
    </div>
  );
};

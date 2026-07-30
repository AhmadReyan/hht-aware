import React from 'react';
import { TrendingUp, Sparkles } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { BarChart, LineChart } from '../ui/MiniChart';

/**
 * TrendsPanel — the payoff for logging: a 30-day bar chart of daily nosebleed
 * minutes and a hemoglobin trend line, so patterns (and correlation between
 * bleeding and blood health) become visible. All computed from device-local data.
 */

const pad2 = (n) => String(n).padStart(2, '0');
const localDate = (d) => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;

export const TrendsPanel = () => {
  const episodes = useAppStore((s) => s.nosebleedEpisodes);
  const labs = useAppStore((s) => s.labResults);

  // Daily nosebleed minutes, last 30 days (oldest -> newest).
  const days = [];
  for (let i = 29; i >= 0; i -= 1) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const ds = localDate(d);
    const mins = episodes
      .filter((e) => e.date === ds)
      .reduce((sum, e) => sum + (Number(e.durationMin) || 0), 0);
    days.push({ date: ds, value: mins });
  }
  const hasEpisodes = episodes.length > 0;

  // Hemoglobin over time (oldest -> newest).
  const hbSeries = labs
    .filter((l) => l.hemoglobin !== null && l.hemoglobin !== undefined)
    .slice()
    .sort((a, b) => (a.date < b.date ? -1 : 1))
    .map((l) => ({ value: Number(l.hemoglobin), label: l.date }));

  return (
    <section className="bg-white border border-line rounded-custom-lg p-5 shadow-card flex flex-col gap-5">
      <div className="flex items-center gap-2">
        <TrendingUp size={16} className="text-garnet" />
        <h3 className="font-serif text-lg text-app-ink">Your trends</h3>
      </div>

      <div>
        <div className="text-[10px] font-bold uppercase tracking-widest text-app-muted mb-2">Nosebleed minutes · 30 days</div>
        {hasEpisodes ? (
          <BarChart data={days} color="#8E2D3B" height={110} title="Daily nosebleed minutes, last 30 days" />
        ) : (
          <div className="flex flex-col items-center text-center gap-2 py-6 border border-dashed border-line rounded-custom-sm">
            <Sparkles size={20} className="text-garnet" />
            <p className="text-[12px] text-app-muted max-w-[220px]">Log your first nosebleed above and your trend will grow here.</p>
          </div>
        )}
      </div>

      <div>
        <div className="text-[10px] font-bold uppercase tracking-widest text-app-muted mb-2">Hemoglobin trend</div>
        {hbSeries.length > 0 ? (
          <LineChart data={hbSeries} color="#15756C" height={110} title="Hemoglobin over time" />
        ) : (
          <p className="text-[12px] text-app-muted italic px-1 py-3">Add hemoglobin readings to see how your blood health tracks over time.</p>
        )}
      </div>
    </section>
  );
};

export default TrendsPanel;

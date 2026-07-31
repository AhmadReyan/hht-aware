import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Wind, Sun, Moon, ShieldAlert } from 'lucide-react';
import { getCachedNoseCast } from '../../services/weather';
import { spring } from '../../lib/motion';

export const MomentTip = () => {
  const [tip, setTip] = useState(null);

  useEffect(() => {
    const hr = new Date().getHours();
    const nosecast = getCachedNoseCast();
    const todayRisk = nosecast?.days?.[0]?.risk;

    let icon = Sparkles;
    let badge = 'Tip of the Moment';
    let text = 'Apply saline gel before your nose feels dry to prevent micro-cracks.';

    if (todayRisk === 'high') {
      icon = ShieldAlert;
      badge = 'Dry Air Alert';
      text = 'Low humidity forecast today — carry saline spray to keep nasal lining hydrated.';
    } else if (hr >= 20 || hr < 7) {
      icon = Moon;
      badge = 'Overnight Habit';
      text = 'Run your bedroom humidifier around 40–60% to stop overnight nasal drying.';
    } else if (hr >= 7 && hr < 12) {
      icon = Sun;
      badge = 'Morning Ritual';
      text = 'Apply a thin layer of saline gel or Ponaris before step out into heating or AC.';
    } else {
      icon = Wind;
      badge = 'Afternoon Care';
      text = 'Sip water regularly throughout the day — internal hydration keeps membranes supple.';
    }

    setTip({ icon, badge, text });
  }, []);

  if (!tip) return null;
  const IconComp = tip.icon;

  return (
    <div className="relative overflow-hidden rounded-custom-lg bg-rose/60 border border-garnet/15 p-4 shadow-card">
      <AnimatePresence mode="wait">
        <motion.div
          key={tip.badge}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={spring.soft}
          className="flex items-start gap-3 text-app-ink"
        >
          <div className="w-9 h-9 rounded-full bg-garnet text-white flex items-center justify-center flex-shrink-0 shadow-sm mt-0.5">
            <IconComp size={18} />
          </div>

          <div className="flex flex-col gap-0.5 min-w-0">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-garnet">
              {tip.badge}
            </span>
            <p className="text-xs font-semibold leading-relaxed text-app-ink">
              {tip.text}
            </p>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

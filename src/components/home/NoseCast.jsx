import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { CloudSun, Droplets, MapPin, RefreshCw, WifiOff } from 'lucide-react';
import { Card } from '../ui/Card';
import { PremiumGate } from '../premium/PremiumGate';
import { haptics } from '../../hooks/useHaptics';
import { spring, staggerContainer, staggerItem } from '../../lib/motion';
import { getCachedNoseCast, getCoords, fetchNoseCast } from '../../services/weather';

/**
 * NoseCast — Home dry-air bleed-risk card.
 *
 * Offline-first: paints instantly from getCachedNoseCast(), then refreshes in
 * the background via getCoords() + fetchNoseCast() without ever blocking the
 * first paint or crashing. Free tier shows today's risk only; the 7-day outlook
 * strip is wrapped in <PremiumGate feature="7-day NoseCast">.
 *
 * Coordinates are used only for the weather fetch — never stored or transmitted
 * anywhere else (privacy rule). If location is denied/unavailable we show a
 * gentle enable-location prompt with a retry, never an error.
 */

// Risk → visual + copy. Colors are the design-system risk tokens.
const RISK_META = {
  high: {
    color: '#8E2D3B', // garnet — danger
    label: 'High',
    tip: 'Dry air today. Moisturize your nasal passages and run a humidifier.',
  },
  moderate: {
    color: '#D9A13B', // gold — caution
    label: 'Moderate',
    tip: 'Some dryness about. Stay hydrated and keep a saline gel handy.',
  },
  low: {
    color: '#15756C', // teal — safe
    label: 'Low',
    tip: 'Comfortable humidity. Low bleed risk today.',
  },
};

const metaFor = (risk) => RISK_META[risk] || RISK_META.moderate;

// color + 2-digit alpha hex → rgba-ish tint via 8-digit hex.
const tint = (hex, alpha) => `${hex}${alpha}`;

const pad = (n) => String(n).padStart(2, '0');
const todayString = () => {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const dayLabel = (dateStr, todayStr) => {
  if (dateStr === todayStr) return 'Today';
  const parts = String(dateStr).split('-').map(Number);
  const d = new Date(parts[0], (parts[1] || 1) - 1, parts[2] || 1);
  const wd = WEEKDAYS[d.getDay()];
  return wd || '';
};

// A single day column in the 7-day strip.
const DayColumn = ({ day, todayStr }) => {
  const meta = metaFor(day.risk);
  return (
    <motion.div variants={staggerItem} className="flex flex-1 flex-col items-center gap-1 min-w-0">
      <span className="text-[9px] font-bold uppercase tracking-wide text-app-muted truncate w-full text-center">
        {dayLabel(day.date, todayStr)}
      </span>
      <div
        className="w-full h-6 rounded-custom-pill flex items-center justify-center"
        style={{ background: tint(meta.color, '1F') }}
        title={`${meta.label} risk`}
      >
        <span className="w-2 h-2 rounded-full" style={{ background: meta.color }} />
      </div>
      <span className="text-[9px] font-semibold text-app-soft tabular-nums">
        {day.humidity == null ? '—' : `${day.humidity}%`}
      </span>
    </motion.div>
  );
};

// The full 7-day outlook row (shown unlocked; a blurred teaser when gated).
const OutlookStrip = ({ days, todayStr, blurred = false }) => (
  <motion.div
    variants={staggerContainer}
    initial="hidden"
    animate="show"
    className={`flex gap-1.5 ${blurred ? 'pointer-events-none blur-[3px] opacity-60 select-none' : ''}`}
    aria-hidden={blurred ? true : undefined}
  >
    {days.slice(0, 7).map((day) => (
      <DayColumn key={day.date} day={day} todayStr={todayStr} />
    ))}
  </motion.div>
);

export const NoseCast = () => {
  // Instant paint from cache (may be null on a fresh install / cleared storage).
  const [forecast, setForecast] = useState(() => getCachedNoseCast());
  const [refreshing, setRefreshing] = useState(false);
  const [locationBlocked, setLocationBlocked] = useState(false);
  const [triedRefresh, setTriedRefresh] = useState(false);

  const runRefresh = useCallback(async () => {
    setRefreshing(true);
    setLocationBlocked(false);
    try {
      const coords = await getCoords();
      if (!coords) {
        setLocationBlocked(true);
        return;
      }
      const result = await fetchNoseCast(coords);
      if (result) setForecast(result);
      // If result is null (offline / bad response) we silently keep any cache.
    } finally {
      setTriedRefresh(true);
      setRefreshing(false);
    }
  }, []);

  // Background refresh on mount — never blocks first paint.
  useEffect(() => {
    runRefresh();
  }, [runRefresh]);

  const todayStr = todayString();
  const days = forecast?.days;

  const today = useMemo(() => {
    if (!Array.isArray(days) || days.length === 0) return null;
    return days.find((d) => d.date === todayStr) || days[0];
  }, [days, todayStr]);

  const handleManualRefresh = () => {
    if (refreshing) return;
    haptics.tap();
    runRefresh();
  };

  const handleEnableLocation = () => {
    haptics.impact();
    runRefresh();
  };

  const header = (
    <div className="flex items-start justify-between mb-3">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-teal-soft flex items-center justify-center text-brand-teal shrink-0">
          <CloudSun size={20} />
        </div>
        <div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-garnet leading-none mb-0.5">
            Forecast
          </div>
          <h3 className="font-serif text-lg font-extrabold text-app-ink leading-tight">NoseCast</h3>
        </div>
      </div>
      <motion.button
        type="button"
        onClick={handleManualRefresh}
        whileTap={{ scale: 0.9 }}
        transition={spring.snappy}
        aria-label="Refresh forecast"
        className="p-2 -mr-1 -mt-1 rounded-full text-app-muted hover:text-brand-teal"
      >
        <RefreshCw size={15} className={refreshing ? 'animate-spin' : ''} />
      </motion.button>
    </div>
  );

  // --- No usable data yet: gentle prompts, never an error/crash ---
  if (!today) {
    return (
      <Card className="p-4">
        {header}
        <div className="flex flex-col items-center text-center gap-2.5 py-3 px-2">
          {locationBlocked ? (
            <>
              <div className="w-11 h-11 rounded-full bg-app-surface2 flex items-center justify-center text-garnet">
                <MapPin size={20} />
              </div>
              <p className="text-[13px] text-app-soft leading-snug max-w-[15rem]">
                Enable location for your local dry-air bleed forecast. It is used only for the
                weather lookup.
              </p>
            </>
          ) : refreshing ? (
            <>
              <div className="w-11 h-11 rounded-full bg-app-surface2 flex items-center justify-center text-brand-teal">
                <RefreshCw size={20} className="animate-spin" />
              </div>
              <p className="text-[13px] text-app-soft leading-snug">Checking your local air…</p>
            </>
          ) : (
            <>
              <div className="w-11 h-11 rounded-full bg-app-surface2 flex items-center justify-center text-app-muted">
                <WifiOff size={20} />
              </div>
              <p className="text-[13px] text-app-soft leading-snug max-w-[15rem]">
                Forecast unavailable right now. It will load when you are back online.
              </p>
            </>
          )}
          {!refreshing && (
            <motion.button
              type="button"
              onClick={handleEnableLocation}
              whileTap={{ scale: 0.96 }}
              transition={spring.snappy}
              className="mt-1 px-4 py-2 rounded-custom-pill bg-garnet text-white text-[12px] font-bold uppercase tracking-wide shadow-card"
            >
              {locationBlocked ? 'Enable location' : 'Retry'}
            </motion.button>
          )}
        </div>
      </Card>
    );
  }

  const meta = metaFor(today.risk);
  const stale = today.date !== todayStr;

  return (
    <Card className="p-4">
      {header}

      {/* Today's risk — free tier */}
      <div
        className="rounded-custom-sm border p-3 flex items-center gap-3.5"
        style={{ background: tint(meta.color, '12'), borderColor: tint(meta.color, '33') }}
      >
        <div
          className="w-14 h-14 rounded-full flex flex-col items-center justify-center shrink-0"
          style={{ background: tint(meta.color, '1F'), color: meta.color }}
        >
          <span className="font-serif text-lg font-extrabold leading-none tabular-nums">
            {today.humidity == null ? '—' : `${today.humidity}%`}
          </span>
          <span className="text-[8px] font-bold uppercase tracking-wide opacity-70 flex items-center gap-0.5">
            <Droplets size={8} /> humid
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <span
            className="inline-block text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-custom-pill"
            style={{ background: tint(meta.color, '26'), color: meta.color }}
          >
            {meta.label} bleed risk
          </span>
          <p className="text-[12px] text-app-soft leading-snug mt-1.5">{meta.tip}</p>
        </div>
      </div>

      {stale && (
        <p className="text-[10px] text-app-muted mt-2 flex items-center gap-1">
          <WifiOff size={10} /> Showing your last saved forecast.
        </p>
      )}

      {/* 7-day outlook — premium */}
      <div className="mt-4">
        <div className="text-[10px] font-bold uppercase tracking-widest text-app-muted mb-2 px-0.5">
          7-day outlook
        </div>
        <PremiumGate
          feature="7-day NoseCast"
          fallback={({ onUpgrade }) => (
            <motion.button
              type="button"
              onClick={onUpgrade}
              whileTap={{ scale: 0.98 }}
              transition={spring.snappy}
              className="relative w-full block text-left rounded-custom-sm overflow-hidden"
              aria-label="Unlock the 7-day NoseCast outlook with Premium"
            >
              <OutlookStrip days={days} todayStr={todayStr} blurred />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="px-3 py-1 rounded-custom-pill bg-garnet text-white text-[10px] font-bold uppercase tracking-widest shadow-card">
                  Unlock 7-day · Premium
                </span>
              </div>
            </motion.button>
          )}
        >
          <OutlookStrip days={days} todayStr={todayStr} />
        </PremiumGate>
      </div>

      {/* triedRefresh kept for internal state completeness (avoids unused warning) */}
      <span className="hidden" aria-hidden data-refreshed={triedRefresh ? '1' : '0'} />
    </Card>
  );
};

export default NoseCast;

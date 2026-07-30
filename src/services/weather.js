/**
 * weather.js — NoseCast: a friendly nosebleed-risk forecast for people with HHT.
 *
 * Nosebleed risk rises with DRY air (low relative humidity), plus heating/AC,
 * altitude and travel. We derive a simple risk score from the free, no-API-key,
 * CORS-enabled Open-Meteo forecast and cache the last good result locally so the
 * card still renders fully offline.
 *
 * Contract (offline-first, never-crash): every function is guarded. Network
 * helpers resolve `null` on ANY failure (permission denied, offline, bad JSON)
 * and NEVER throw. Coordinates are used only for this fetch — never stored or
 * transmitted anywhere else (privacy rule).
 */

const CACHE_KEY = 'hht_nosecast_v1';

// --- resilient localStorage (mirrors the store's safeParse/safeSetItem) ---
const safeGet = (key) => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed === null || parsed === undefined ? null : parsed;
  } catch {
    return null;
  }
};

const safeSet = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore write failures (quota, private mode, etc.)
  }
};

const pad = (n) => String(n).padStart(2, '0');
const getDateString = (d = new Date()) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

/**
 * Map a relative-humidity % to a nosebleed-risk bucket.
 * Dry air (low humidity) = higher risk of mucosal cracking / bleeds.
 * @param {number} h relative humidity (0–100)
 * @returns {'low'|'moderate'|'high'}
 */
export const riskFromHumidity = (h) => {
  const humidity = Number(h);
  if (Number.isNaN(humidity)) return 'moderate';
  if (humidity < 30) return 'high';
  if (humidity <= 45) return 'moderate';
  return 'low';
};

const RISK_LABELS = {
  high: 'Dry air — high bleed risk',
  moderate: 'Some dryness — stay hydrated',
  low: 'Comfortable humidity'
};

const labelForRisk = (risk) => RISK_LABELS[risk] || RISK_LABELS.moderate;

/**
 * Get the device's coarse coordinates via the Geolocation API.
 * Works in the PWA and the Capacitor webview. Resolves { lat, lon } or null
 * (permission denied, unsupported, timeout) — never rejects.
 * @returns {Promise<{lat:number, lon:number}|null>}
 */
export const getCoords = () =>
  new Promise((resolve) => {
    try {
      if (typeof navigator === 'undefined' || !navigator.geolocation) {
        resolve(null);
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos?.coords?.latitude;
          const lon = pos?.coords?.longitude;
          if (typeof lat === 'number' && typeof lon === 'number') {
            resolve({ lat, lon });
          } else {
            resolve(null);
          }
        },
        () => resolve(null),
        { enableHighAccuracy: false, timeout: 8000, maximumAge: 30 * 60 * 1000 }
      );
    } catch {
      resolve(null);
    }
  });

/**
 * Synchronously read the last cached NoseCast (for instant, offline render).
 * @returns {{days:Array, updatedAt:string, lat?:number, lon?:number}|null}
 */
export const getCachedNoseCast = () => {
  const cached = safeGet(CACHE_KEY);
  if (!cached || !Array.isArray(cached.days)) return null;
  return cached;
};

/**
 * Fetch a 7-day NoseCast for the given coordinates from Open-Meteo and reduce
 * it to a friendly daily risk forecast. Caches the result on success.
 *
 * @param {{lat:number, lon:number}} coords
 * @returns {Promise<{
 *   days: Array<{date:string, humidity:number, tempC:number, dewPointC:number, risk:'low'|'moderate'|'high', label:string}>,
 *   updatedAt: string,
 *   lat: number,
 *   lon: number
 * }|null>}  null on ANY failure (never throws).
 */
export const fetchNoseCast = async (coords) => {
  try {
    const lat = coords?.lat;
    const lon = coords?.lon;
    if (typeof lat !== 'number' || typeof lon !== 'number') return null;
    if (typeof fetch === 'undefined') return null;

    const url =
      'https://api.open-meteo.com/v1/forecast' +
      `?latitude=${encodeURIComponent(lat)}&longitude=${encodeURIComponent(lon)}` +
      '&hourly=relative_humidity_2m,temperature_2m,dew_point_2m&forecast_days=7&timezone=auto';

    const res = await fetch(url);
    if (!res || !res.ok) return null;
    const json = await res.json();
    const hourly = json?.hourly;
    const times = hourly?.time;
    const humidities = hourly?.relative_humidity_2m;
    const temps = hourly?.temperature_2m;
    const dews = hourly?.dew_point_2m;
    if (!Array.isArray(times) || !Array.isArray(humidities)) return null;

    // Bucket the hourly series into per-day aggregates (daytime-weighted:
    // 08:00–20:00 is when people are up and exposed to dry heating/AC).
    const buckets = new Map(); // date -> { hs:[], ts:[], ds:[] }
    for (let i = 0; i < times.length; i += 1) {
      const t = times[i];
      if (typeof t !== 'string') continue;
      const date = t.slice(0, 10);
      const hour = Number(t.slice(11, 13));
      if (!buckets.has(date)) buckets.set(date, { hs: [], ts: [], ds: [] });
      const b = buckets.get(date);
      const isDay = hour >= 8 && hour <= 20;
      const hv = Number(humidities[i]);
      if (!Number.isNaN(hv) && isDay) b.hs.push(hv);
      const tv = Number(temps?.[i]);
      if (!Number.isNaN(tv) && isDay) b.ts.push(tv);
      const dv = Number(dews?.[i]);
      if (!Number.isNaN(dv) && isDay) b.ds.push(dv);
    }

    const avg = (arr) => (arr.length ? arr.reduce((s, n) => s + n, 0) / arr.length : NaN);
    const days = Array.from(buckets.keys())
      .sort()
      .slice(0, 7)
      .map((date) => {
        const b = buckets.get(date);
        const humidity = Math.round(avg(b.hs));
        const tempC = Math.round(avg(b.ts));
        const dewPointC = Math.round(avg(b.ds));
        const risk = riskFromHumidity(humidity);
        return {
          date,
          humidity: Number.isNaN(humidity) ? null : humidity,
          tempC: Number.isNaN(tempC) ? null : tempC,
          dewPointC: Number.isNaN(dewPointC) ? null : dewPointC,
          risk,
          label: labelForRisk(risk)
        };
      })
      .filter((d) => d.humidity !== null);

    if (!days.length) return null;

    const result = { days, updatedAt: new Date().toISOString(), date: getDateString(), lat, lon };
    safeSet(CACHE_KEY, result);
    return result;
  } catch {
    return null;
  }
};

export default { getCoords, fetchNoseCast, getCachedNoseCast, riskFromHumidity };

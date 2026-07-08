/**
 * Canonical daily self-care regimen for the Prevention tracker.
 *
 * These are the tappable items in the "Today's Self-Care" check-in. Keys are
 * stable (persisted in the store), so add new items at the end rather than
 * renaming existing keys. Personalized around the products the user actually
 * uses (Aquaphor, Ponaris) plus core HHT guideline habits.
 *
 * `icon` is a lucide-react icon name (resolved by the UI layer).
 */
export const selfCareItems = [
  {
    key: 'nose_moisture',
    label: 'Moisturize nose',
    hint: 'Aquaphor / Ponaris to keep the lining soft',
    icon: 'Droplet',
    accent: 'teal',
  },
  {
    key: 'humidifier',
    label: 'Humidifier on',
    hint: 'Especially overnight in dry air',
    icon: 'Wind',
    accent: 'teal',
  },
  {
    key: 'hydration',
    label: 'Stay hydrated',
    hint: 'Water through the day helps the lining',
    icon: 'GlassWater',
    accent: 'orange',
  },
  {
    key: 'iron',
    label: 'Iron-friendly food',
    hint: 'Protect your iron / ferritin',
    icon: 'Beef',
    accent: 'red',
  },
  {
    key: 'avoid_triggers',
    label: 'Avoided triggers',
    hint: 'Low-sodium, less spice, no nose-picking, gentle blowing',
    icon: 'ShieldCheck',
    accent: 'red',
  },
];

export const selfCareItemCount = selfCareItems.length;

// Common nosebleed triggers to log (builds a personal pattern insight).
export const triggerOptions = [
  { key: 'dry_air', label: 'Dry air', icon: 'Wind' },
  { key: 'spicy_food', label: 'Spicy / salty food', icon: 'Flame' },
  { key: 'exertion', label: 'Heavy exertion', icon: 'Activity' },
  { key: 'stress', label: 'Stress', icon: 'Brain' },
  { key: 'alcohol', label: 'Alcohol', icon: 'Wine' },
  { key: 'nose_trauma', label: 'Blowing / picking', icon: 'Hand' },
  { key: 'hot_weather', label: 'Hot weather', icon: 'Sun' },
  { key: 'unknown', label: 'Not sure', icon: 'HelpCircle' },
];

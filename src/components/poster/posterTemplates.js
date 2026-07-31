// Template registry for the Poster Studio.
// The 3 legacy templates (awareness/fact/story) keep bespoke control components
// and their captions come from src/data/captions.js (handled in CaptionBlock).
// The 10 new templates declare a generic `fields` schema rendered by
// GenericPosterControls, optional auto-fill `presets`, and a local getCaption().

const HASH = '#HHT #HHTAwareness #KnowHHT #RareDisease #curehht';

export const TEMPLATES = [
  // ---- Legacy (bespoke controls, captions from data/captions.js) ----
  { id: 'awareness', label: '🎗️ Awareness', legacy: true },
  { id: 'fact', label: '📊 HHT Fact', legacy: true },
  { id: 'story', label: '📖 My Story', legacy: true },

  // ---- Bold Stat ----
  {
    id: 'boldstat',
    label: '🔢 Bold Stat',
    defaultData: {
      stat: '90%',
      label: 'REMAIN UNDIAGNOSED',
      body: 'Most people living with HHT have never been formally diagnosed.',
    },
    fields: [
      { key: 'stat', label: 'Big Number', type: 'text', maxLength: 10, placeholder: '90%' },
      { key: 'label', label: 'Caption Line', type: 'text', maxLength: 32, placeholder: 'REMAIN UNDIAGNOSED' },
      { key: 'body', label: 'Supporting Text', type: 'textarea', maxLength: 120, placeholder: 'Short explanation…' },
    ],
    presets: [
      { chipLabel: '90% undiagnosed', stat: '90%', label: 'REMAIN UNDIAGNOSED', body: 'Most people living with HHT have never been formally diagnosed.' },
      { chipLabel: '1 in 5,000', stat: '1 in 5,000', label: 'PEOPLE HAVE HHT', body: 'HHT is one of the most common rare genetic disorders worldwide.' },
      { chipLabel: '20+ yr delay', stat: '20+', label: 'YEARS TO DIAGNOSIS', body: 'The average delay between first symptom and an accurate HHT diagnosis.' },
    ],
    getCaption: (d) => `${d.stat} — ${d.label}. ${d.body}\n\nLearn more at curehht.org.\n\n${HASH}`,
  },

  // ---- Minimalist ----
  {
    id: 'minimal',
    label: '⚪ Minimalist',
    defaultData: {
      headline: 'Know HHT.',
      body: 'A genetic vascular disorder hiding in plain sight.',
    },
    fields: [
      { key: 'headline', label: 'Headline', type: 'text', maxLength: 40, placeholder: 'Know HHT.' },
      { key: 'body', label: 'Sub-line', type: 'textarea', maxLength: 100, placeholder: 'One clean supporting line…' },
    ],
    getCaption: (d) => `${d.headline} ${d.body}\n\ncurehht.org\n\n${HASH}`,
  },

  // ---- Gradient Wave ----
  {
    id: 'wave',
    label: '🌊 Gradient Wave',
    defaultData: {
      headline: 'Awareness flows further together',
      body: 'Every share helps a family recognize the signs of HHT sooner.',
    },
    fields: [
      { key: 'headline', label: 'Headline', type: 'text', maxLength: 46, placeholder: 'Awareness flows further…' },
      { key: 'body', label: 'Supporting Text', type: 'textarea', maxLength: 120, placeholder: 'Short message…' },
    ],
    getCaption: (d) => `${d.headline}. ${d.body}\n\ncurehht.org\n\n${HASH}`,
  },

  // ---- Ribbon Spotlight ----
  {
    id: 'ribbon',
    label: '🎀 Ribbon Spotlight',
    defaultData: {
      headline: 'Wear it. Share it. Cure HHT.',
      body: 'The red ribbon stands for every person living with Hereditary Hemorrhagic Telangiectasia.',
    },
    fields: [
      { key: 'headline', label: 'Headline', type: 'text', maxLength: 44, placeholder: 'Wear it. Share it.' },
      { key: 'body', label: 'Supporting Text', type: 'textarea', maxLength: 130, placeholder: 'What the ribbon means…' },
    ],
    getCaption: (d) => `${d.headline} ${d.body}\n\ncurehht.org\n\n${HASH} #Ribbon`,
  },

  // ---- Quote Card ----
  {
    id: 'quote',
    label: '❝ Quote Card',
    defaultData: {
      quote: 'Rare is not the same as alone.',
      author: 'The HHT Community',
    },
    fields: [
      { key: 'quote', label: 'Quote', type: 'textarea', maxLength: 120, placeholder: 'A short, powerful quote…' },
      { key: 'author', label: 'Attribution', type: 'text', maxLength: 30, placeholder: 'The HHT Community' },
    ],
    presets: [
      { chipLabel: 'Rare ≠ alone', quote: 'Rare is not the same as alone.', author: 'The HHT Community' },
      { chipLabel: 'Invisible', quote: 'Just because you can’t see it doesn’t mean it isn’t there.', author: 'An HHT Patient' },
      { chipLabel: 'Know signs', quote: 'Knowing the signs of HHT can save a life in your family.', author: 'Cure HHT' },
    ],
    getCaption: (d) => `"${d.quote}" — ${d.author}\n\ncurehht.org\n\n${HASH}`,
  },

  // ---- Did You Know? ----
  {
    id: 'didyouknow',
    label: '💡 Did You Know?',
    defaultData: {
      body: 'Nosebleeds are the most common early sign of HHT — affecting up to 90% of patients.',
    },
    fields: [
      { key: 'body', label: 'The Fact', type: 'textarea', maxLength: 150, placeholder: 'Share a surprising HHT fact…' },
    ],
    presets: [
      { chipLabel: 'Nosebleeds', body: 'Nosebleeds are the most common early sign of HHT — affecting up to 90% of patients.' },
      { chipLabel: 'Lung AVMs', body: 'Up to 50% of people with HHT have lung AVMs, which can be silent yet dangerous.' },
      { chipLabel: 'Screening', body: 'Simple screening can find HHT complications before they ever become emergencies.' },
    ],
    getCaption: (d) => `Did you know? ${d.body}\n\nLearn the signs at curehht.org.\n\n${HASH}`,
  },

  // ---- World HHT Day ----
  {
    id: 'worldday',
    label: '🌍 World HHT Day',
    defaultData: {
      headline: 'World HHT Day',
      body: 'Join thousands turning the world red for HHT awareness.',
    },
    fields: [
      { key: 'headline', label: 'Headline', type: 'text', maxLength: 30, placeholder: 'World HHT Day' },
      { key: 'body', label: 'Supporting Text', type: 'textarea', maxLength: 110, placeholder: 'A rallying message…' },
    ],
    getCaption: (d) => `${d.headline} · May 20. ${d.body}\n\ncurehht.org\n\n${HASH} #May20 #WorldHHTDay`,
  },

  // ---- Support / Donate ----
  {
    id: 'support',
    label: '🤝 Support',
    defaultData: {
      headline: 'Help us cure HHT',
      body: 'Your support funds research, screening, and support for HHT families.',
      cta: 'DONATE AT CUREHHT.ORG',
    },
    fields: [
      { key: 'headline', label: 'Headline', type: 'text', maxLength: 34, placeholder: 'Help us cure HHT' },
      { key: 'body', label: 'Supporting Text', type: 'textarea', maxLength: 120, placeholder: 'Why support matters…' },
      { key: 'cta', label: 'Call To Action', type: 'text', maxLength: 30, placeholder: 'DONATE AT CUREHHT.ORG' },
    ],
    getCaption: (d) => `${d.headline}. ${d.body}\n\n${d.cta}\n\n${HASH} #Donate`,
  },

  // ---- Nosebleed Myth-Buster ----
  {
    id: 'mythbuster',
    label: '🩸 Myth-Buster',
    defaultData: {
      myth: 'Frequent nosebleeds are always harmless.',
      fact: 'Recurrent, spontaneous nosebleeds can be the first sign of HHT — worth getting checked.',
    },
    fields: [
      { key: 'myth', label: 'The Myth', type: 'textarea', maxLength: 90, placeholder: 'A common misconception…' },
      { key: 'fact', label: 'The Fact', type: 'textarea', maxLength: 120, placeholder: 'Set the record straight…' },
    ],
    presets: [
      { chipLabel: 'Harmless?', myth: 'Frequent nosebleeds are always harmless.', fact: 'Recurrent, spontaneous nosebleeds can be the first sign of HHT — worth getting checked.' },
      { chipLabel: 'Too rare', myth: 'HHT is too rare to matter.', fact: 'HHT affects 1 in 5,000 people — that’s more common than many well-known diseases.' },
      { chipLabel: 'Not genetic', myth: 'Nosebleeds don’t run in families.', fact: 'HHT is autosomal dominant — each child of a patient has a 50% chance of inheriting it.' },
    ],
    getCaption: (d) => `MYTH: ${d.myth}\nFACT: ${d.fact}\n\ncurehht.org\n\n${HASH} #MythBuster`,
  },

  // ---- Warning Signs Checklist ----
  {
    id: 'checklist',
    label: '📋 Warning Signs',
    defaultData: {
      headline: 'Know the signs of HHT',
      items: 'Frequent, spontaneous nosebleeds\nRed spots on lips, face or fingertips\nA family history of HHT\nUnexplained iron-deficiency anemia\nShortness of breath or fatigue',
    },
    fields: [
      { key: 'headline', label: 'Headline', type: 'text', maxLength: 40, placeholder: 'Know the signs of HHT' },
      { key: 'items', label: 'Signs (one per line)', type: 'textarea', rows: 6, maxLength: 300, placeholder: 'One sign per line…' },
    ],
    presets: [
      { chipLabel: 'Warning signs', headline: 'Know the signs of HHT', items: 'Frequent, spontaneous nosebleeds\nRed spots on lips, face or fingertips\nA family history of HHT\nUnexplained iron-deficiency anemia\nShortness of breath or fatigue' },
      { chipLabel: 'When to screen', headline: 'When to ask about HHT', items: 'Nosebleeds since childhood\nA parent, sibling or child with HHT\nAnemia with no clear cause\nMigraines with unusual features\nSudden breathlessness' },
    ],
    getCaption: (d) =>
      `${d.headline}:\n${String(d.items || '')
        .split('\n')
        .map((l) => l.trim())
        .filter(Boolean)
        .map((l) => `• ${l}`)
        .join('\n')}\n\nLearn more at curehht.org.\n\n${HASH}`,
  },

  // ---- Event / Fundraiser ----
  {
    id: 'event',
    label: '📣 Event',
    defaultData: {
      title: 'HHT Awareness Walk',
      date: 'Saturday, May 20',
      location: 'Community Park · 10:00 AM',
      cta: 'Register at curehht.org',
    },
    fields: [
      { key: 'title', label: 'Event Name', type: 'text', maxLength: 40, placeholder: 'HHT Awareness Walk' },
      { key: 'date', label: 'Date / Time', type: 'text', maxLength: 40, placeholder: 'Saturday, May 20' },
      { key: 'location', label: 'Location', type: 'text', maxLength: 44, placeholder: 'Community Park · 10 AM' },
      { key: 'cta', label: 'Call To Action', type: 'text', maxLength: 34, placeholder: 'Register at curehht.org' },
    ],
    getCaption: (d) => `${d.title}\n${d.date} · ${d.location}\n${d.cta}\n\n${HASH} #Event`,
  },

  // ---- Stat Trio ----
  {
    id: 'stattrio',
    label: '📈 Stat Trio',
    defaultData: {
      headline: 'HHT by the numbers',
      stat1: '1 in 5,000',
      label1: 'people live with HHT',
      stat2: '90%',
      label2: 'remain undiagnosed',
      stat3: '50%',
      label3: 'chance a child inherits it',
    },
    fields: [
      { key: 'headline', label: 'Headline', type: 'text', maxLength: 34, placeholder: 'HHT by the numbers' },
      { key: 'stat1', label: 'Stat 1', type: 'text', maxLength: 14, placeholder: '1 in 5,000' },
      { key: 'label1', label: 'Label 1', type: 'text', maxLength: 40, placeholder: 'people live with HHT' },
      { key: 'stat2', label: 'Stat 2', type: 'text', maxLength: 14, placeholder: '90%' },
      { key: 'label2', label: 'Label 2', type: 'text', maxLength: 40, placeholder: 'remain undiagnosed' },
      { key: 'stat3', label: 'Stat 3', type: 'text', maxLength: 14, placeholder: '50%' },
      { key: 'label3', label: 'Label 3', type: 'text', maxLength: 40, placeholder: 'inheritance risk' },
    ],
    getCaption: (d) =>
      `${d.headline}:\n${d.stat1} — ${d.label1}\n${d.stat2} — ${d.label2}\n${d.stat3} — ${d.label3}\n\ncurehht.org\n\n${HASH}`,
  },

  // ---- Family & Genetic Testing ----
  {
    id: 'family',
    label: '🧬 Family Testing',
    defaultData: {
      headline: 'HHT runs in families',
      body: 'If a parent has HHT, each child has a 50% chance of inheriting it. Genetic testing can bring answers.',
    },
    fields: [
      { key: 'headline', label: 'Headline', type: 'text', maxLength: 34, placeholder: 'HHT runs in families' },
      { key: 'body', label: 'Supporting Text', type: 'textarea', maxLength: 140, placeholder: 'Message about testing…' },
    ],
    getCaption: (d) => `${d.headline}. ${d.body}\n\nAsk about genetic testing at curehht.org.\n\n${HASH} #GeneticTesting #FamilyHistory`,
  },
];

export const getTemplate = (id) => TEMPLATES.find((t) => t.id === id) || TEMPLATES[0];

// Full default-data map used to seed PosterStudio state for the new templates.
export const buildDefaultData = () => {
  const map = {};
  TEMPLATES.forEach((t) => {
    if (t.defaultData) map[t.id] = { ...t.defaultData };
  });
  return map;
};

export default TEMPLATES;

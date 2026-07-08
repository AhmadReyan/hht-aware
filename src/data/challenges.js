export const challenges = [
  {
    id: 1,
    icon: "📸",
    title: "Post an HHT Awareness Poster",
    desc: "Create and share one of the app's posters using the Poster Studio.",
    pts: 10,
    tag: "Social Media",
    link: "/poster"
  },
  {
    id: 2,
    icon: "💬",
    title: "Tell 3 People About HHT Today",
    desc: "Explain what HHT stands for and how it affects blood vessels to friends or family.",
    pts: 10,
    tag: "Offline",
    link: null
  },
  {
    id: 3,
    icon: "🩺",
    title: "Share Emergency Card With Doctor",
    desc: "Show your primary care physician or specialist your HHT emergency card in the app.",
    pts: 20,
    tag: "Healthcare",
    link: "/emergency"
  },
  {
    id: 4,
    icon: "📖",
    title: "Share an HHT Fact Online",
    desc: "Select any fact from our library and share it to your feed with one tap.",
    pts: 10,
    tag: "Social Media",
    link: "/facts"
  },
  {
    id: 5,
    icon: "🎙️",
    title: "Record a 60-Second Awareness Video",
    desc: "Share your HHT journey or general facts in a short TikTok, Reel, or video message.",
    pts: 30,
    tag: "Video",
    link: null
  },
  {
    id: 6,
    icon: "🏥",
    title: "Find Your Nearest Center of Excellence",
    desc: "Locate the nearest specialist clinic on curehht.org to ensure you have a local HHT contact.",
    pts: 15,
    tag: "Healthcare",
    link: "https://curehht.org/understanding-hht/resources/hht-centers-of-excellence/"
  },
  {
    id: 7,
    icon: "📧",
    title: "Email Your Local Representative",
    desc: "Advocate for rare disease funding by sending a pre-written support request to a local leader.",
    pts: 25,
    tag: "Advocacy",
    link: "https://curehht.org/get-involved/advocate/"
  },
  {
    id: 8,
    icon: "🤝",
    title: "Connect Someone to the Community",
    desc: "Introduce a fellow patient, caregiver, or supporter to Cure HHT online groups.",
    pts: 20,
    tag: "Community",
    link: "https://curehht.org"
  },
  {
    id: 9,
    icon: "🧬",
    title: "Encourage Family Genetic Testing",
    desc: "Talk to family members about screening options since HHT is 50% inheritable.",
    pts: 20,
    tag: "Family",
    link: null
  },
  {
    id: 10,
    icon: "🎗️",
    title: "Complete ALL Challenges",
    desc: "Achieve HHT Ambassador status by toggling all other challenges as done.",
    pts: 50,
    tag: "⭐ Special",
    link: null
  }
];

// Point value for each permanent challenge, keyed by id.
// Used by the store's getPoints() calculation.
export const challengePointMap = {
  1: 10, 2: 10, 3: 20, 4: 10, 5: 30, 6: 15, 7: 25, 8: 20, 9: 20, 10: 50
};

// -----------------------------------------------------------------------
// Daily Challenges — a rotating pool of small habit-forming tasks.
// A deterministic subset is shown each day (same for every user, no
// server required) based on the calendar date string.
// -----------------------------------------------------------------------
export const dailyChallengePool = [
  { id: 'd1', icon: '📢', title: "Share Today's Fact", desc: 'Post or tell someone one HHT fact today.', xp: 15, tag: 'Share' },
  { id: 'd2', icon: '👃', title: 'Do Your Nasal Care Routine', desc: 'Complete your nasal moisturizing or saline care routine.', xp: 10, tag: 'Self-Care' },
  { id: 'd3', icon: '🔬', title: 'Read a Research Update', desc: 'Read one HHT research or treatment update.', xp: 15, tag: 'Learn' },
  { id: 'd4', icon: '💧', title: 'Hydrate & Eat Low-Sodium', desc: 'Drink water and choose a low-sodium meal today.', xp: 10, tag: 'Wellness' },
  { id: 'd5', icon: '✅', title: 'Daily Check-In', desc: 'Take a moment to check in on how you are feeling today.', xp: 10, tag: 'Check-In' },
  { id: 'd6', icon: '🧑‍🤝‍🧑', title: 'Reach Out to Someone', desc: 'Message a fellow patient, friend, or family member about HHT.', xp: 15, tag: 'Community' },
  { id: 'd7', icon: '📝', title: 'Log Your Symptoms', desc: 'Jot down any nosebleeds or symptoms you noticed today.', xp: 10, tag: 'Self-Care' },
  { id: 'd8', icon: '🧘', title: 'Take a Calm Moment', desc: 'Spend 5 minutes on breathing or rest — stress can trigger symptoms.', xp: 10, tag: 'Wellness' },
  { id: 'd9', icon: '📚', title: 'Learn Something New', desc: 'Read one fact from the Facts library you have not seen before.', xp: 15, tag: 'Learn' },
  { id: 'd10', icon: '🎗️', title: 'Wear Your Awareness', desc: 'Wear or display something HHT-related today.', xp: 10, tag: 'Share' },
];

// Number of daily challenges shown to the user per day
export const DAILY_TASKS_PER_DAY = 4;

// --- Deterministic date-seeded pick (no server / no randomness at runtime) ---
const seedFromString = (str) => {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h * 31 + str.charCodeAt(i)) >>> 0;
  }
  return h >>> 0;
};

// mulberry32 seeded PRNG — deterministic for a given seed
const mulberry32 = (seed) => {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

/**
 * Returns today's set of daily challenges. Deterministic per calendar date
 * string (e.g. "2026-07-07") so every user sees the same rotating set
 * without needing a backend.
 */
export const getTodaysDailyChallenges = (dateStr) => {
  const rand = mulberry32(seedFromString(dateStr || ''));
  const pool = [...dailyChallengePool];
  // Seeded Fisher-Yates shuffle
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, DAILY_TASKS_PER_DAY);
};

// -----------------------------------------------------------------------
// Levels & Titles
// -----------------------------------------------------------------------
// XP required to REACH level n (n >= 1). Quadratic curve: fast early
// levels, steady long-term grind. xpForLevel(1) = 0.
export const xpForLevel = (n) => 25 * n * (n - 1);

export const LEVEL_TITLES = [
  { min: 1, max: 2, title: 'Newcomer' },
  { min: 3, max: 4, title: 'Advocate' },
  { min: 5, max: 7, title: 'Champion' },
  { min: 8, max: 10, title: 'Ambassador' },
  { min: 11, max: Infinity, title: 'Legend' },
];

// -----------------------------------------------------------------------
// Badges / Achievements — unlock state is derived from store data, not
// stored directly (see useAppStore.getBadges()).
// -----------------------------------------------------------------------
export const badgeDefs = [
  { id: 'first-poster', icon: '📸', title: 'First Poster', desc: 'Complete "Post an HHT Awareness Poster".' },
  { id: 'fact-sharer', icon: '📖', title: 'Fact Sharer', desc: 'Complete "Share an HHT Fact Online".' },
  { id: 'ambassador', icon: '🎗️', title: 'HHT Ambassador', desc: 'Complete all 10 awareness challenges.' },
  { id: 'streak-7', icon: '🔥', title: '7-Day Streak', desc: 'Reach a 7-day activity streak.' },
  { id: 'streak-30', icon: '🌟', title: '30-Day Streak', desc: 'Reach a 30-day activity streak.' },
  { id: 'prevention-pro', icon: '👃', title: 'Prevention Pro', desc: 'Complete your nasal care routine 5 times.' },
  { id: 'researcher', icon: '🔬', title: 'Researcher', desc: 'Read 5 research updates.' },
  { id: 'perfect-week', icon: '🏅', title: 'Perfect Week', desc: 'Complete every daily challenge in a single day, 7 times total.' },
  { id: 'habit-builder', icon: '⚡', title: 'Habit Builder', desc: 'Complete 20 daily challenges over time.' },
  { id: 'legend', icon: '👑', title: 'Legend', desc: 'Reach Legend status.' },
];

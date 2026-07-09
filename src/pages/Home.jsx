import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PageWrapper } from '../components/layout/PageWrapper';
import { Vessels } from '../components/ui/Vessels';
import { Chip } from '../components/ui/Chip';
import { SectionTitle } from '../components/ui/SectionTitle';
import { FlipCard } from '../components/ui/FlipCard';
import { useAppStore } from '../store/useAppStore';
import { haptics } from '../hooks/useHaptics';
import { staggerContainer, staggerItem, spring } from '../lib/motion';

/* ---- HHT facts for the tap-to-flip fact card (copy from BleedAware ref) ---- */
const FACTS = [
  {
    q: 'Why do I get nosebleeds so often?',
    a: "In HHT, tiny blood vessels form without the normal capillary “cushion” — so they sit close to the surface and break easily. It’s the most common symptom.",
  },
  {
    q: 'Is it rare?',
    a: 'About 1 in 5,000 people worldwide live with HHT — yet up to 90% remain undiagnosed. That’s the awareness gap this app exists to close.',
  },
  {
    q: 'Does it run in families?',
    a: 'Yes — it’s inherited. Each child of a person with HHT has a 50% chance of having it too. Family screening saves lives.',
  },
];

/* Bleed check-in options: label shown to user, key stored in the log. */
const BLEED_OPTIONS = [
  { key: 'none', label: 'No bleeds \u{1F389}' },
  { key: 'nose', label: 'Nose' },
  { key: 'gums', label: 'Gums' },
  { key: 'tongue', label: 'Tongue' },
  { key: 'ear', label: 'Ear' },
  { key: 'other', label: 'Other' },
];

/* Quick-action tiles → Studio & Prevention. */
const QUICK_ACTIONS = [
  { emoji: '\u{1F3A8}', label: 'Create Studio', sub: 'Turn your story into a poster', path: '/poster' },
  { emoji: '\u{1F6E1}️', label: 'Prevention', sub: 'Tips tuned to you', path: '/prevention' },
];

export const Home = () => {
  const navigate = useNavigate();

  const emergencyData = useAppStore((s) => s.emergencyData);
  const currentStreak = useAppStore((s) => s.currentStreak);
  const logBodyCheckIn = useAppStore((s) => s.logBodyCheckIn);
  const isCheckedInToday = useAppStore((s) => s.isCheckedInToday);
  const getTodayBodyCheckIn = useAppStore((s) => s.getTodayBodyCheckIn);

  const firstName = (emergencyData?.name || '').trim().split(/\s+/)[0];
  const greeting = firstName ? `Good morning, ${firstName}` : 'Welcome back';

  // Check-in state — hydrate from store if already logged today.
  const [logged, setLogged] = useState(() => isCheckedInToday());
  const [selected, setSelected] = useState(() => {
    const ci = getTodayBodyCheckIn();
    return ci?.bleeds ?? [];
  });

  const toggleBleed = (key) => {
    if (key === 'none') {
      setSelected(['none']);
      return;
    }
    setSelected((prev) => {
      const cleaned = prev.filter((k) => k !== 'none');
      return cleaned.includes(key) ? cleaned.filter((k) => k !== key) : [...cleaned, key];
    });
  };

  const handleLog = () => {
    if (!selected.length) return;
    haptics.success();
    logBodyCheckIn(selected);
    setLogged(true);
  };

  // Fact card (controlled flip so "Next fact" can flip back then advance).
  const [factIdx, setFactIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const fact = FACTS[factIdx];

  const nextFact = (e) => {
    e.stopPropagation();
    haptics.tap();
    setFlipped(false);
    setTimeout(() => setFactIdx((i) => (i + 1) % FACTS.length), 350);
  };

  return (
    <PageWrapper>
      <div className="rise flex flex-col gap-4 font-sans">

        {/* ---- HERO ------------------------------------------------------- */}
        <section className="relative overflow-hidden bg-ember rounded-custom-lg p-5 text-white shadow-raised">
          <Vessels color="#fff" opacity={0.18} />
          <div className="relative z-10">
            <div className="font-sans text-xs opacity-80">{greeting}</div>
            <h1 className="font-serif font-extrabold leading-tight mt-1 mb-3" style={{ fontSize: 26 }}>
              Living with HHT.<br />Making it visible.
            </h1>
            <motion.button
              whileTap={{ scale: 0.96 }}
              transition={spring.snappy}
              onClick={() => { haptics.impact(); navigate('/emergency'); }}
              className="font-sans font-semibold bg-white text-deep rounded-custom"
              style={{ padding: '10px 16px', fontSize: 13 }}
            >
              {'\u{1F6C2}'} Open Emergency Passport
            </motion.button>
          </div>
        </section>

        {/* ---- DAILY CHECK-IN -------------------------------------------- */}
        <section className="bg-app-surface border border-line rounded-custom-lg p-4 shadow-card">
          <SectionTitle
            kicker="Daily check-in"
            title={logged ? 'Logged — see you tomorrow' : "How’s your body today?"}
          />
          {!logged ? (
            <>
              <div className="flex flex-wrap gap-2 mb-3">
                {BLEED_OPTIONS.map((o) => (
                  <Chip
                    key={o.key}
                    label={o.label}
                    active={selected.includes(o.key)}
                    onClick={() => toggleBleed(o.key)}
                    tone={o.key === 'none' ? 'teal' : 'garnet'}
                  />
                ))}
              </div>
              <motion.button
                whileTap={selected.length ? { scale: 0.97 } : undefined}
                transition={spring.snappy}
                disabled={!selected.length}
                onClick={handleLog}
                className="w-full font-sans font-semibold rounded-custom"
                style={{
                  padding: 12,
                  fontSize: 14,
                  background: selected.length ? 'var(--garnet)' : 'var(--line)',
                  color: selected.length ? '#fff' : 'var(--muted)',
                  cursor: selected.length ? 'pointer' : 'default',
                }}
              >
                Log today
              </motion.button>
            </>
          ) : (
            <div className="pop bg-teal-soft rounded-custom p-3.5 font-sans font-semibold text-brand-teal" style={{ fontSize: 14, lineHeight: 1.45 }}>
              {'\u{1F525}'} {currentStreak}-day streak · your log builds a history for your doctor.
            </div>
          )}
        </section>

        {/* ---- TAP-TO-FLIP FACT CARD ------------------------------------- */}
        <FlipCard
          height={158}
          flipped={flipped}
          onFlip={(v) => { setFlipped(v); }}
          front={
            <div className="bg-rose border border-line rounded-custom-lg h-full" style={{ padding: 18 }}>
              <div className="font-sans" style={{ fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase', color: 'var(--garnet)', fontWeight: 600 }}>
                Tap to reveal · {factIdx + 1}/{FACTS.length}
              </div>
              <div className="font-serif font-extrabold text-app-ink" style={{ fontSize: 20, marginTop: 8, lineHeight: 1.2 }}>
                {fact.q}
              </div>
            </div>
          }
          back={
            <div className="rounded-custom-lg h-full flex flex-col justify-between text-white" style={{ background: 'var(--garnet)', padding: 18 }}>
              <div className="font-sans" style={{ fontSize: 13.5, lineHeight: 1.5 }}>{fact.a}</div>
              <button
                onClick={nextFact}
                className="font-sans font-semibold self-start rounded-custom-sm"
                style={{ marginTop: 8, background: 'rgba(255,255,255,.18)', color: '#fff', padding: '6px 12px', fontSize: 12, borderRadius: 8 }}
              >
                Next fact →
              </button>
            </div>
          }
        />

        {/* ---- QUICK ACTIONS --------------------------------------------- */}
        <motion.section
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 gap-2.5"
        >
          {QUICK_ACTIONS.map((a) => (
            <motion.button
              key={a.path}
              variants={staggerItem}
              whileTap={{ scale: 0.96 }}
              transition={spring.snappy}
              onClick={() => { haptics.tap(); navigate(a.path); }}
              className="text-left bg-app-surface border border-line rounded-custom p-3.5 shadow-card"
            >
              <div style={{ fontSize: 22 }}>{a.emoji}</div>
              <div className="font-sans font-semibold text-app-ink mt-1" style={{ fontSize: 14 }}>{a.label}</div>
              <div className="font-sans text-app-muted" style={{ fontSize: 11, marginTop: 2 }}>{a.sub}</div>
            </motion.button>
          ))}
        </motion.section>

      </div>
    </PageWrapper>
  );
};

export default Home;

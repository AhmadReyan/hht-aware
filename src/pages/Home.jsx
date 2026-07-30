import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageWrapper } from '../components/layout/PageWrapper';
import { HomeHero } from '../components/home/HomeHero';
import { DailyCheckIn } from '../components/home/DailyCheckIn';
import { MomentumStrip } from '../components/home/MomentumStrip';
import { QuickAction } from '../components/home/QuickAction';
import { FactSpotlight } from '../components/home/FactSpotlight';
import { SectionTitle } from '../components/ui/SectionTitle';
import { Card } from '../components/ui/Card';
import { facts } from '../data/facts';
import { resources } from '../data/resources';
import { useShare } from '../hooks/useShare';
import { useAppStore } from '../store/useAppStore';
import { haptics } from '../hooks/useHaptics';
import { Palette, ShieldAlert, BookOpen, Trophy, ChevronRight } from 'lucide-react';

export const Home = () => {
  const navigate = useNavigate();
  const { shareContent } = useShare();

  const emergencyData = useAppStore((s) => s.emergencyData);
  const currentStreak = useAppStore((s) => s.currentStreak);
  const logBodyCheckIn = useAppStore((s) => s.logBodyCheckIn);
  const isCheckedInToday = useAppStore((s) => s.isCheckedInToday);
  const getTodayBodyCheckIn = useAppStore((s) => s.getTodayBodyCheckIn);
  const recordActivity = useAppStore((s) => s.recordActivity);

  const [randomFact, setRandomFact] = useState(facts[0]);

  // Check-in local state
  const [logged, setLogged] = useState(() => isCheckedInToday());
  const [selected, setSelected] = useState(() => {
    const ci = getTodayBodyCheckIn();
    return ci?.bleeds ?? [];
  });

  const firstName = (emergencyData?.name || '').trim().split(/\s+/)[0];
  const greeting = firstName ? `Hello, ${firstName}` : 'Welcome back';

  const rotateFact = () => {
    const currentIndex = facts.findIndex(f => f.id === randomFact.id);
    let nextIndex = currentIndex;
    while (nextIndex === currentIndex) {
      nextIndex = Math.floor(Math.random() * facts.length);
    }
    setRandomFact(facts[nextIndex]);
  };

  useEffect(() => {
    recordActivity();
    const randomIndex = Math.floor(Math.random() * facts.length);
    setRandomFact(facts[randomIndex]);
  }, [recordActivity]);

  const handleShareFact = async () => {
    await shareContent({
      title: 'HHT Fact Alert',
      text: `HHT Fact: ${randomFact.stat} — ${randomFact.body}`,
      url: 'https://curehht.org'
    });
  };

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

  return (
    <PageWrapper>
      <div className="flex flex-col gap-6 pb-8 rise">

        {/* 1. Time-of-day + streak-aware hero */}
        <HomeHero
          greeting={greeting}
          onOpenPassport={() => navigate('/emergency')}
        />

        {/* 2. Momentum strip: compact animated stats */}
        <MomentumStrip />

        {/* 3. Daily ritual front-and-center */}
        <DailyCheckIn
          logged={logged}
          selected={selected}
          onToggle={toggleBleed}
          onLog={handleLog}
          currentStreak={currentStreak}
        />

        {/* 4. Quick Actions Row */}
        <section className="flex justify-between gap-4 px-2">
          <QuickAction
            title="Studio"
            icon={Palette}
            onClick={() => navigate('/poster')}
            color="var(--garnet)"
          />
          <QuickAction
            title="Nose Care"
            icon={ShieldAlert}
            onClick={() => navigate('/prevention')}
            color="#B67A1E"
          />
          <QuickAction
            title="Facts"
            icon={BookOpen}
            onClick={() => navigate('/facts')}
            color="#2A181D"
          />
          <QuickAction
            title="Mission"
            icon={Trophy}
            onClick={() => navigate('/challenges')}
            color="#15756C"
          />
        </section>

        {/* 5. Interactive Fact Spotlight */}
        <FactSpotlight
          fact={randomFact}
          onRotate={rotateFact}
          onShare={handleShareFact}
        />

        {/* 6. Resource Directory */}
        <section className="flex flex-col gap-4">
          <SectionTitle kicker="Community" title="Support & Resources" />

          <div className="flex flex-col gap-3">
            {resources.map((res) => (
              <Card
                key={res.id}
                interactive
                onClick={() => window.open(res.url, '_blank')}
                className="p-4 flex justify-between items-center bg-white border-app-border/10 group shadow-card rounded-custom-lg"
              >
                <div className="flex flex-col gap-0.5">
                  <h3 className="font-sans font-bold text-sm text-ink group-hover:text-garnet transition-colors">
                    {res.title}
                  </h3>
                  <p className="text-[11px] text-app-muted leading-tight">
                    {res.description}
                  </p>
                </div>
                <div className="w-8 h-8 rounded-full bg-app-bg flex items-center justify-center group-hover:bg-garnet group-hover:text-white transition-all">
                  <ChevronRight size={16} />
                </div>
              </Card>
            ))}
          </div>
        </section>

        <div className="text-center py-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-app-muted opacity-40">
            Official awareness partner of <span className="text-garnet font-bold">Cure HHT</span>
          </p>
        </div>
      </div>
    </PageWrapper>
  );
};
export default Home;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PageWrapper } from '../components/layout/PageWrapper';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { facts } from '../data/facts';
import { resources } from '../data/resources';
import { useShare } from '../hooks/useShare';
import { useResearchFeed } from '../hooks/useResearchFeed';
import { ResearchSpotlight } from '../components/research/ResearchSpotlight';
import { Palette, ShieldAlert, BookOpen, Trophy, HeartPulse, Microscope, ExternalLink, Share2, RefreshCw } from 'lucide-react';

export const Home = () => {
  const navigate = useNavigate();
  const { shareContent, toastMessage, triggerToast } = useShare();
  const { featured, markSeen } = useResearchFeed();
  const [randomFact, setRandomFact] = useState(facts[0]);

  // Rotate a random fact
  const rotateFact = () => {
    const currentIndex = facts.findIndex(f => f.id === randomFact.id);
    let nextIndex = currentIndex;
    while (nextIndex === currentIndex) {
      nextIndex = Math.floor(Math.random() * facts.length);
    }
    setRandomFact(facts[nextIndex]);
  };

  useEffect(() => {
    // Initial random fact selection
    const randomIndex = Math.floor(Math.random() * facts.length);
    setRandomFact(facts[randomIndex]);
  }, []);

  const handleShareFact = async (e) => {
    e.stopPropagation();
    await shareContent({
      title: 'HHT Fact Alert',
      text: `HHT Fact: ${randomFact.stat} — ${randomFact.body}`,
      url: 'https://curehht.org'
    });
  };

  const navCards = [
    {
      title: 'Prevention',
      desc: 'Daily self-care tips',
      icon: HeartPulse,
      color: 'teal',
      path: '/prevention',
      emoji: '💧'
    },
    {
      title: 'Research',
      desc: 'Latest, made simple',
      icon: Microscope,
      color: 'red',
      path: '/research',
      emoji: '🔬'
    },
    {
      title: 'Poster Studio',
      desc: 'Create social banners',
      icon: Palette,
      color: 'orange',
      path: '/poster',
      emoji: '🎨'
    },
    {
      title: 'Challenges',
      desc: 'Advocate & earn points',
      icon: Trophy,
      color: 'red',
      path: '/challenges',
      emoji: '🏆'
    },
    {
      title: 'Emergency Card',
      desc: 'ER wallet alert info',
      icon: ShieldAlert,
      color: 'dark',
      path: '/emergency',
      emoji: '🆘'
    },
    {
      title: 'HHT Facts',
      desc: 'Learn & share details',
      icon: BookOpen,
      color: 'orange',
      path: '/facts',
      emoji: '📊'
    }
  ];

  return (
    <PageWrapper>
      <div className="flex flex-col gap-6 font-sans">
        
        {/* Hero Section */}
        <section className="bg-app-dark border border-app-border/10 rounded-custom p-6 relative overflow-hidden shadow-lg">
          {/* Subtle bg pattern */}
          <div className="absolute right-0 top-0 w-32 h-32 bg-brand-red/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex flex-col gap-3 relative z-10">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="red" size="sm">🎗️ HHT Awareness</Badge>
              <div className="flex items-center gap-1.5 bg-brand-red/10 px-2 py-0.5 rounded-custom-pill text-[10px] text-brand-red-mid font-bold uppercase tracking-wider">
                <span className="w-1.5 h-1.5 bg-brand-red-mid rounded-full animate-ping" />
                May 20 · World HHT Day
              </div>
            </div>

            <h1 className="font-serif text-3xl md:text-4xl text-white font-bold leading-tight mt-1">
              1 in 5,000 people have <span className="text-brand-red-mid italic">HHT</span>
            </h1>
            
            <p className="text-xs md:text-sm text-app-muted leading-relaxed max-w-sm">
              Hereditary Hemorrhagic Telangiectasia is a rare genetic vascular disorder. Because symptoms like nosebleeds are common, 90% of people remain undiagnosed. Let's bridge the awareness gap.
            </p>

            <div className="mt-2 flex">
              <Button variant="primary" size="sm" onClick={() => navigate('/poster')} icon={Palette}>
                Create Poster
              </Button>
            </div>
          </div>
        </section>

        {/* Research of the Week — periodic delivery surface */}
        {featured && (
          <section>
            <ResearchSpotlight
              update={featured}
              compact
              onClick={() => {
                markSeen(featured.id);
                navigate('/research');
              }}
            />
          </section>
        )}

        {/* 2x2 Grid of Navigation Cards */}
        <section className="flex flex-col gap-3">
          <h2 className="font-sans font-bold text-xs uppercase tracking-wider text-app-muted px-1">Interactive Features</h2>
          <div className="grid grid-cols-2 gap-3">
            {navCards.map((card) => {
              const Icon = card.icon;
              return (
                <Card
                  key={card.title}
                  interactive
                  variant={card.color === 'dark' ? 'dark' : card.color}
                  onClick={() => navigate(card.path)}
                  className="p-4 flex flex-col gap-3 justify-between h-32"
                >
                  <div className="flex justify-between items-start">
                    <div className={`p-2 rounded-custom-sm ${
                      card.color === 'red' ? 'bg-brand-red/10 text-brand-red-mid' :
                      card.color === 'orange' ? 'bg-brand-orange/10 text-brand-orange' :
                      card.color === 'teal' ? 'bg-brand-teal/10 text-brand-teal' :
                      'bg-app-dark/60 text-brand-red-mid'
                    }`}>
                      <Icon size={20} />
                    </div>
                    <span className="text-lg">{card.emoji}</span>
                  </div>
                  <div>
                    <h3 className="font-sans font-bold text-sm tracking-tight text-white">{card.title}</h3>
                    <p className={`text-[10px] ${
                      card.color === 'dark' ? 'text-app-muted' : 'opacity-80'
                    }`}>{card.desc}</p>
                  </div>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Quick Fact Strip */}
        <section className="bg-app-dark2 border border-app-border/5 rounded-custom p-4 shadow-sm flex flex-col gap-3">
          <div className="flex justify-between items-center border-b border-app-border/5 pb-2">
            <div className="flex items-center gap-1.5">
              <span className="text-xs">💡</span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-brand-orange">Random HHT Fact</span>
            </div>
            <div className="flex gap-1">
              <button
                onClick={rotateFact}
                aria-label="Rotate fact"
                className="p-1 hover:bg-app-mid/20 text-app-muted hover:text-white rounded-full transition-colors active:rotate-90 duration-300"
              >
                <RefreshCw size={12} />
              </button>
              <button
                onClick={handleShareFact}
                aria-label="Share fact"
                className="p-1 hover:bg-app-mid/20 text-app-muted hover:text-white rounded-full transition-colors"
              >
                <Share2 size={12} />
              </button>
            </div>
          </div>
          <div className="flex flex-col gap-1.5 cursor-pointer group" onClick={handleShareFact}>
            <div className="font-serif text-2xl font-bold text-brand-red-light group-hover:text-brand-red-mid transition-colors italic">
              {randomFact.stat}
            </div>
            <p className="text-xs text-app-border leading-relaxed">
              {randomFact.body}
            </p>
            <div className="text-[9px] text-app-muted italic text-right mt-1">
              Source: {randomFact.src}
            </div>
          </div>
        </section>

        {/* Resource Links Section */}
        <section className="flex flex-col gap-3">
          <h2 className="font-sans font-bold text-xs uppercase tracking-wider text-app-muted px-1">Advocacy & Resources</h2>
          <div className="flex flex-col gap-2">
            {resources.map((res) => (
              <a
                key={res.id}
                href={res.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex justify-between items-center bg-app-dark border border-app-border/10 p-4 rounded-custom hover:bg-app-dark2 transition-all hover:-translate-y-0.5 duration-200"
              >
                <div className="flex flex-col gap-0.5 flex-1 pr-4">
                  <h3 className="font-sans font-bold text-xs text-white group-hover:text-brand-teal transition-colors">
                    {res.title}
                  </h3>
                  <p className="text-[10px] text-app-muted leading-relaxed">
                    {res.description}
                  </p>
                </div>
                <ExternalLink size={14} className="text-app-muted group-hover:text-brand-teal group-hover:translate-x-0.5 transition-all flex-shrink-0" />
              </a>
            ))}
          </div>
        </section>
      </div>

      {/* Floating alert/success toast */}
      {toastMessage && (
        <div className="fixed bottom-20 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
          <div className="bg-brand-red text-white text-xs font-sans font-medium px-4 py-2 rounded-custom-pill shadow-lg border border-brand-red-mid/20 flex items-center gap-2 pointer-events-auto animate-bounce">
            <span>🎗️</span>
            <span>{toastMessage}</span>
          </div>
        </div>
      )}
    </PageWrapper>
  );
};
export default Home;

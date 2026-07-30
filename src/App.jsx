import React, { useEffect, useState } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import { App as KonstaApp } from 'konsta/react';
import { Header } from './components/layout/Header';
import { BottomNav } from './components/layout/BottomNav';
import { AboutModal } from './components/layout/AboutModal';
import { Home } from './pages/Home';
import { PosterStudio } from './pages/PosterStudio';
import { EmergencyCard } from './pages/EmergencyCard';
import { Facts } from './pages/Facts';
import { Challenges } from './pages/Challenges';
import { Prevention } from './pages/Prevention';
import { Research } from './pages/Research';
import { useResearchNotifications } from './hooks/useResearchNotifications';
import { useFirebase } from './hooks/useFirebase';
import { usePushNotifications } from './hooks/usePushNotifications';
import { useDeepLinks } from './hooks/useDeepLinks';
import { useAppStore } from './store/useAppStore';

function AppContent() {
  const [aboutOpen, setAboutOpen] = useState(false);
  const startCloudSync = useAppStore((s) => s.startCloudSync);

  // Initialize Native Features.
  // Firebase Analytics + Crashlytics (guarded — no-ops until google-services.json is added).
  useFirebase();
  // FCM push via @capacitor-firebase/messaging — fully guarded, safe with Firebase configured.
  // (The old @capacitor/push-notifications register() crashed natively without Firebase; that's solved.)
  usePushNotifications();
  // Periodic reminders also use local notifications (useResearchNotifications).
  useResearchNotifications();
  useDeepLinks();

  // Resume opt-in cloud backup after first paint (no-op when the toggle is
  // off or Firebase is unconfigured — never blocks rendering).
  useEffect(() => {
    const t = setTimeout(() => startCloudSync(), 0);
    return () => clearTimeout(t);
  }, [startCloudSync]);

  return (
    <div className="flex flex-col min-h-screen bg-app-bg text-app-ink select-none pb-16">
      {/* Top Header Navigation */}
      <Header onOpenAbout={() => setAboutOpen(true)} />

      {/* Dynamic Pages Area */}
      <div className="flex-grow flex flex-col justify-start">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/poster" element={<PosterStudio />} />
          <Route path="/emergency" element={<EmergencyCard />} />
          <Route path="/facts" element={<Facts />} />
          <Route path="/challenges" element={<Challenges />} />
          <Route path="/prevention" element={<Prevention />} />
          <Route path="/research" element={<Research />} />
        </Routes>
      </div>

      {/* Fixed Tab Navigation */}
      <BottomNav />

      {/* Global About HHT Bottom Sheet */}
      <AboutModal isOpen={aboutOpen} onClose={() => setAboutOpen(false)} />
    </div>
  );
}

function App() {
  return (
    <MotionConfig reducedMotion="user">
      {/* Konsta provides iOS-flavored component theming; `dark` class on <html> keeps it dark.
          It renders a plain wrapper div, so our own bg/layout classes still drive the look. */}
      <KonstaApp theme="ios" safeAreas={false} className="bg-transparent">
        <Router>
          <AppContent />
        </Router>
      </KonstaApp>
    </MotionConfig>
  );
}

export default App;

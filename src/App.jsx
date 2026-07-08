import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
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
import { useDeepLinks } from './hooks/useDeepLinks';

function AppContent() {
  const [aboutOpen, setAboutOpen] = useState(false);

  // Initialize Native Features.
  // Firebase Analytics + Crashlytics (guarded — no-ops until google-services.json is added).
  useFirebase();
  // NOTE: remote push (usePushNotifications) is intentionally NOT initialized —
  // the old @capacitor/push-notifications register() crashed natively without Firebase.
  // FCM push will be re-added via @capacitor-firebase/messaging once Firebase is set up.
  // Periodic reminders currently use local notifications (useResearchNotifications).
  useResearchNotifications();
  useDeepLinks();

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
      <Router>
        <AppContent />
      </Router>
    </MotionConfig>
  );
}

export default App;

import React, { useState } from 'react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { ProgressTracker } from '../components/challenges/ProgressTracker';
import { ChallengeCard } from '../components/challenges/ChallengeCard';
import { challenges } from '../data/challenges';
import { useAppStore } from '../store/useAppStore';
import { Toast } from '../components/ui/Toast';
import { Award } from 'lucide-react';

export const Challenges = () => {
  const completedChallenges = useAppStore((state) => state.completedChallenges);
  const toggleChallenge = useAppStore((state) => state.toggleChallenge);
  const points = useAppStore((state) => state.getPoints());
  
  const [showToast, setShowToast] = useState(false);
  const [toastText, setToastText] = useState('');

  const completedCount = completedChallenges.length;
  
  // Challenge 10 is unlocked when challenges 1 to 9 are all completed
  const isSpecialUnlocked = [1, 2, 3, 4, 5, 6, 7, 8, 9].every(id => 
    completedChallenges.includes(id)
  );

  const showCustomToast = (msg) => {
    setToastText(msg);
    setShowToast(true);
  };

  const handleToggle = (id) => {
    if (id === 10 && !isSpecialUnlocked) {
      handleLockedWarning();
      return;
    }
    toggleChallenge(id);
    
    // Toast when complete
    const isNowDone = !completedChallenges.includes(id);
    if (isNowDone) {
      if (id === 10) {
        showCustomToast('🏆 Unlocked: HHT Ambassador Badge! Outstanding job!');
      } else {
        showCustomToast('Challenge completed! Pts added 🌟');
      }
    }
  };

  const handleLockedWarning = () => {
    showCustomToast('⚠️ Locked: Complete challenges 1–9 first to unlock Ambassador status!');
  };

  return (
    <PageWrapper>
      <div className="flex flex-col gap-5 font-sans">
        {/* Header Title */}
        <section className="flex flex-col gap-1 px-1">
          <h1 className="font-serif text-2xl font-bold text-white flex items-center gap-2">
            <Award className="text-brand-red-mid" size={24} />
            <span>Awareness Challenges</span>
          </h1>
          <p className="text-xs text-app-muted leading-relaxed">
            Help spread HHT awareness, support the community, and track your achievements. Complete all basic challenges to earn the Ambassador badge!
          </p>
        </section>

        {/* Progress Tracker Card */}
        <section>
          <ProgressTracker
            completedCount={completedCount}
            totalCount={challenges.length}
            points={points}
          />
        </section>

        {/* Challenge Cards List */}
        <section className="flex flex-col gap-3 mb-6">
          <h2 className="font-bold text-xs uppercase tracking-wider text-app-muted px-1">Current Challenges</h2>
          {challenges.map((c) => (
            <ChallengeCard
              key={c.id}
              challenge={c}
              isDone={completedChallenges.includes(c.id)}
              isUnlocked={c.id !== 10 || isSpecialUnlocked}
              onToggle={handleToggle}
              onShowLockedWarning={handleLockedWarning}
            />
          ))}
        </section>
      </div>

      <Toast message={toastText} isOpen={showToast} onClose={() => setShowToast(false)} />
    </PageWrapper>
  );
};
export default Challenges;

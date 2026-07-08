import React, { useEffect, useState } from 'react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { ProgressTracker } from '../components/challenges/ProgressTracker';
import { ChallengeCard } from '../components/challenges/ChallengeCard';
import { StreakWidget } from '../components/challenges/StreakWidget';
import { LevelBar } from '../components/challenges/LevelBar';
import { DailyChallengesSection } from '../components/challenges/DailyChallengesSection';
import { BadgeGrid } from '../components/challenges/BadgeGrid';
import { BadgeUnlockModal } from '../components/challenges/BadgeUnlockModal';
import { challenges } from '../data/challenges';
import { useAppStore } from '../store/useAppStore';
import { Toast } from '../components/ui/Toast';
import { Award, Medal } from 'lucide-react';

export const Challenges = () => {
  const completedChallenges = useAppStore((state) => state.completedChallenges);
  const toggleChallenge = useAppStore((state) => state.toggleChallenge);
  const points = useAppStore((state) => state.getPoints());

  const currentStreak = useAppStore((state) => state.currentStreak);
  const longestStreak = useAppStore((state) => state.longestStreak);
  const recordActivity = useAppStore((state) => state.recordActivity);

  // Subscribing to dailyStats (updated atomically alongside dailyProgress
  // on every toggle) is what keeps this page reactive to daily-task changes.
  const dailyStats = useAppStore((state) => state.dailyStats);
  const toggleDailyChallenge = useAppStore((state) => state.toggleDailyChallenge);
  const isDailyDone = useAppStore((state) => state.isDailyDone);
  const getTodaysDailyList = useAppStore((state) => state.getTodaysDailyList);
  const getDailyCompletedCount = useAppStore((state) => state.getDailyCompletedCount);

  const getLevelInfo = useAppStore((state) => state.getLevelInfo);
  const getBadges = useAppStore((state) => state.getBadges);
  const getNewlyUnlockedBadges = useAppStore((state) => state.getNewlyUnlockedBadges);
  const markBadgesSeen = useAppStore((state) => state.markBadgesSeen);

  const [showToast, setShowToast] = useState(false);
  const [toastText, setToastText] = useState('');
  const [celebratingBadge, setCelebratingBadge] = useState(null);

  // Record a day of activity as soon as the user opens the Challenges tab
  useEffect(() => {
    recordActivity();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const completedCount = completedChallenges.length;

  // Challenge 10 is unlocked when challenges 1 to 9 are all completed
  const isSpecialUnlocked = [1, 2, 3, 4, 5, 6, 7, 8, 9].every(id =>
    completedChallenges.includes(id)
  );

  const dailyTasks = getTodaysDailyList();
  const dailyCompletedCount = getDailyCompletedCount();
  const levelInfo = getLevelInfo();
  const badges = getBadges();

  const showCustomToast = (msg) => {
    setToastText(msg);
    setShowToast(true);
  };

  // Checks for any badge that just became unlocked and, if so, queues the
  // celebratory modal + confetti for it.
  const checkForNewBadges = () => {
    const newBadgeIds = getNewlyUnlockedBadges();
    if (newBadgeIds.length > 0) {
      const badgeToShow = getBadges().find((b) => b.id === newBadgeIds[0]);
      if (badgeToShow) {
        setCelebratingBadge(badgeToShow);
      }
      markBadgesSeen(newBadgeIds);
    }
  };

  const handleToggle = (id) => {
    if (id === 10 && !isSpecialUnlocked) {
      handleLockedWarning();
      return;
    }

    const isNowDone = !completedChallenges.includes(id);
    toggleChallenge(id);

    // Toast when complete
    if (isNowDone) {
      if (id === 10) {
        showCustomToast('🏆 Unlocked: HHT Ambassador Badge! Outstanding job!');
      } else {
        showCustomToast('Challenge completed! Pts added 🌟');
      }
    }

    // Give React a tick to flush the store update before re-checking badges
    setTimeout(checkForNewBadges, 0);
  };

  const handleLockedWarning = () => {
    showCustomToast('⚠️ Locked: Complete challenges 1–9 first to unlock Ambassador status!');
  };

  const handleToggleDaily = (taskId) => {
    const wasDone = isDailyDone(taskId);
    toggleDailyChallenge(taskId);

    if (!wasDone) {
      showCustomToast('Daily task complete! XP added ⚡');
    }

    setTimeout(checkForNewBadges, 0);
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
            Build a daily habit of spreading HHT awareness and caring for yourself. Level up, keep your streak alive, and unlock badges along the way!
          </p>
        </section>

        {/* Streak + Level Header */}
        <section className="flex gap-2.5">
          <StreakWidget currentStreak={currentStreak} longestStreak={longestStreak} />
          <LevelBar levelInfo={levelInfo} />
        </section>

        {/* Daily Challenges */}
        <DailyChallengesSection
          tasks={dailyTasks}
          isDone={isDailyDone}
          onToggle={handleToggleDaily}
          completedCount={dailyCompletedCount}
          lifetimeCompletions={dailyStats.lifetimeCompletions}
          perfectDaysCount={dailyStats.perfectDaysCount}
        />

        {/* Progress Tracker Card */}
        <section>
          <ProgressTracker
            completedCount={completedCount}
            totalCount={challenges.length}
            points={points}
          />
        </section>

        {/* Challenge Cards List */}
        <section className="flex flex-col gap-3">
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

        {/* Badges / Achievements */}
        <section className="flex flex-col gap-3 mb-6">
          <h2 className="font-bold text-xs uppercase tracking-wider text-app-muted px-1 flex items-center gap-1.5">
            <Medal size={13} className="text-brand-orange" />
            Badges & Achievements
          </h2>
          <BadgeGrid badges={badges} />
        </section>
      </div>

      <Toast message={toastText} isOpen={showToast} onClose={() => setShowToast(false)} />
      <BadgeUnlockModal badge={celebratingBadge} onClose={() => setCelebratingBadge(null)} />
    </PageWrapper>
  );
};
export default Challenges;

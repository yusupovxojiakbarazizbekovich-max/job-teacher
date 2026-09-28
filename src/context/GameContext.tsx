import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserStats, Badge } from '../types';
import { INITIAL_BADGES, INITIAL_TASKS, getLevelInfo } from '../data/tasksData';
import { soundManager } from '../utils/soundEffects';
import { fireCelebration, fireMiniCelebration } from '../utils/confetti';

interface GameContextType {
  stats: UserStats;
  badges: Badge[];
  activeTaskId: string | null;
  selectedCategory: string;
  searchQuery: string;
  setSelectedCategory: (cat: string) => void;
  setSearchQuery: (query: string) => void;
  openTask: (taskId: string) => void;
  closeTask: () => void;
  completeTask: (taskId: string, score: number, maxScore: number, earnedXp: number) => void;
  toggleSound: () => void;
  updateProfile: (name: string, avatar: string) => void;
  resetProgress: () => void;
  levelUpModal: { show: boolean; level: number; title: string } | null;
  closeLevelUpModal: () => void;
  unlockedBadgeToast: Badge | null;
  closeBadgeToast: () => void;
}

const STORAGE_KEY = 'amaliyot_hub_user_stats';
const BADGES_KEY = 'amaliyot_hub_user_badges';

const DEFAULT_STATS: UserStats = {
  name: 'O‘rganuvchi',
  avatar: '🚀',
  level: 1,
  levelTitle: 'Boshlovchi',
  xp: 0,
  totalTasksCompleted: 0,
  completedTaskIds: [],
  taskScores: {},
  streakDays: 1,
  lastActiveDate: new Date().toISOString().split('T')[0],
  soundEnabled: true
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [stats, setStats] = useState<UserStats>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        const levelData = getLevelInfo(parsed.xp || 0);
        return {
          ...DEFAULT_STATS,
          ...parsed,
          level: levelData.level,
          levelTitle: levelData.title
        };
      }
    } catch {
      // LocalStorage error fallback
    }
    return DEFAULT_STATS;
  });

  const [badges, setBadges] = useState<Badge[]>(() => {
    try {
      const saved = localStorage.getItem(BADGES_KEY);
      if (saved) {
        const parsed: Badge[] = JSON.parse(saved);
        // Merge with initial badges if any new badge was added
        return INITIAL_BADGES.map(b => {
          const match = parsed.find(p => p.id === b.id);
          return match ? { ...b, ...match } : b;
        });
      }
    } catch {
      // fallback
    }
    return INITIAL_BADGES;
  });

  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [levelUpModal, setLevelUpModal] = useState<{ show: boolean; level: number; title: string } | null>(null);
  const [unlockedBadgeToast, setUnlockedBadgeToast] = useState<Badge | null>(null);

  // Sync sound manager state
  useEffect(() => {
    soundManager.enabled = stats.soundEnabled;
  }, [stats.soundEnabled]);

  // Persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
    } catch (e) {
      console.error(e);
    }
  }, [stats]);

  useEffect(() => {
    try {
      localStorage.setItem(BADGES_KEY, JSON.stringify(badges));
    } catch (e) {
      console.error(e);
    }
  }, [badges]);

  // Check daily streak
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    if (stats.lastActiveDate !== today) {
      const last = new Date(stats.lastActiveDate);
      const now = new Date(today);
      const diffTime = Math.abs(now.getTime() - last.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        // Consecutive day
        setStats(prev => ({
          ...prev,
          streakDays: prev.streakDays + 1,
          lastActiveDate: today
        }));
      } else if (diffDays > 1) {
        // Streak broken
        setStats(prev => ({
          ...prev,
          streakDays: 1,
          lastActiveDate: today
        }));
      }
    }
  }, [stats.lastActiveDate]);

  const toggleSound = () => {
    setStats(prev => ({ ...prev, soundEnabled: !prev.soundEnabled }));
    soundManager.playClick();
  };

  const updateProfile = (name: string, avatar: string) => {
    setStats(prev => ({ ...prev, name, avatar }));
    soundManager.playClick();
  };

  const openTask = (taskId: string) => {
    soundManager.playClick();
    setActiveTaskId(taskId);
  };

  const closeTask = () => {
    soundManager.playClick();
    setActiveTaskId(null);
  };

  const closeLevelUpModal = () => {
    setLevelUpModal(null);
  };

  const closeBadgeToast = () => {
    setUnlockedBadgeToast(null);
  };

  const completeTask = (taskId: string, score: number, _maxScore: number, earnedXp: number) => {
    const alreadyCompleted = stats.completedTaskIds.includes(taskId);
    const prevBestScore = stats.taskScores[taskId] || 0;
    const newBestScore = Math.max(prevBestScore, score);

    // Calculate XP: full if first time, bonus if improved
    const bonusXp = alreadyCompleted
      ? (score > prevBestScore ? Math.round(earnedXp * 0.4) : 10)
      : earnedXp;

    const newXp = stats.xp + bonusXp;
    const oldLevelInfo = getLevelInfo(stats.xp);
    const newLevelInfo = getLevelInfo(newXp);

    const updatedCompletedIds = alreadyCompleted
      ? stats.completedTaskIds
      : [...stats.completedTaskIds, taskId];

    // Trigger celebration effects
    fireCelebration();
    soundManager.playSuccess();

    // Check if level increased
    if (newLevelInfo.level > oldLevelInfo.level) {
      setTimeout(() => {
        soundManager.playLevelUp();
        setLevelUpModal({
          show: true,
          level: newLevelInfo.level,
          title: newLevelInfo.title
        });
      }, 700);
    }

    // Check badges
    const updatedBadges = [...badges];
    let justUnlockedBadge: Badge | null = null;

    updatedBadges.forEach((badge, idx) => {
      if (!badge.isUnlocked) {
        let shouldUnlock = false;

        // Condition 1: required task count
        if (badge.requiredTasksCount && updatedCompletedIds.length >= badge.requiredTasksCount) {
          shouldUnlock = true;
        }

        // Condition 2: required XP
        if (badge.requiredXp && newXp >= badge.requiredXp) {
          shouldUnlock = true;
        }

        // Condition 3: specific task condition
        if (badge.specialCondition === taskId) {
          shouldUnlock = true;
        }

        if (shouldUnlock) {
          updatedBadges[idx] = {
            ...badge,
            isUnlocked: true,
            unlockedAt: new Date().toLocaleDateString('uz-UZ')
          };
          if (!justUnlockedBadge) {
            justUnlockedBadge = updatedBadges[idx];
          }
        }
      }
    });

    if (justUnlockedBadge) {
      setTimeout(() => {
        soundManager.playBadge();
        setUnlockedBadgeToast(justUnlockedBadge);
        fireMiniCelebration();
      }, 1200);
    }

    setBadges(updatedBadges);

    setStats(prev => ({
      ...prev,
      xp: newXp,
      level: newLevelInfo.level,
      levelTitle: newLevelInfo.title,
      totalTasksCompleted: updatedCompletedIds.length,
      completedTaskIds: updatedCompletedIds,
      taskScores: {
        ...prev.taskScores,
        [taskId]: newBestScore
      }
    }));
  };

  const resetProgress = () => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(BADGES_KEY);
    setStats(DEFAULT_STATS);
    setBadges(INITIAL_BADGES);
    setActiveTaskId(null);
    soundManager.playClick();
  };

  return (
    <GameContext.Provider
      value={{
        stats,
        badges,
        activeTaskId,
        selectedCategory,
        searchQuery,
        setSelectedCategory,
        setSearchQuery,
        openTask,
        closeTask,
        completeTask,
        toggleSound,
        updateProfile,
        resetProgress,
        levelUpModal,
        closeLevelUpModal,
        unlockedBadgeToast,
        closeBadgeToast
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};

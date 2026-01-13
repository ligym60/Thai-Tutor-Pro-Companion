import { useState, useEffect, useCallback } from "react";
import {
  UserProfile,
  Progress,
  LessonProgress,
  Achievements,
  getUserProfile,
  saveUserProfile,
  getProgress,
  saveProgress,
  getLessonProgress,
  saveLessonProgress,
  getAchievements,
  saveAchievements,
  resetAllData,
} from "@/lib/storage";

export function useGameState() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [progress, setProgress] = useState<Progress | null>(null);
  const [lessonProgress, setLessonProgress] = useState<LessonProgress>({});
  const [achievements, setAchievements] = useState<Achievements | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      const [profile, prog, lessonProg, achv] = await Promise.all([
        getUserProfile(),
        getProgress(),
        getLessonProgress(),
        getAchievements(),
      ]);
      setUserProfile(profile);
      setProgress(prog);
      setLessonProgress(lessonProg);
      setAchievements(achv);
    } catch (error) {
      console.error("Failed to load game state:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const updateProfile = useCallback(async (updates: Partial<UserProfile>) => {
    setUserProfile((prev) => (prev ? { ...prev, ...updates } : null));
    await saveUserProfile(updates);
  }, []);

  const addXP = useCallback(
    async (amount: number) => {
      if (!progress) return;

      const today = new Date().toDateString();
      const lastDate = progress.lastLessonDate;
      let newStreak = progress.currentStreak;

      if (lastDate) {
        const lastDateObj = new Date(lastDate);
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        if (lastDate === today) {
        } else if (lastDateObj.toDateString() === yesterday.toDateString()) {
          newStreak += 1;
        } else {
          newStreak = 1;
        }
      } else {
        newStreak = 1;
      }

      const newProgress: Partial<Progress> = {
        totalXP: progress.totalXP + amount,
        dailyXPEarned: progress.dailyXPEarned + amount,
        currentStreak: newStreak,
        lastLessonDate: today,
      };

      setProgress((prev) => (prev ? { ...prev, ...newProgress } : null));
      await saveProgress(newProgress);

      await checkAndUnlockAchievements({
        ...progress,
        ...newProgress,
      } as Progress);
    },
    [progress, achievements],
  );

  const completeLesson = useCallback(
    async (
      lessonId: string,
      correctAnswers: number,
      totalQuestions: number,
      xpEarned: number,
    ) => {
      if (!progress) return;

      const existingProgress = lessonProgress[lessonId];
      const isPerfect = correctAnswers === totalQuestions;
      const score = Math.round((correctAnswers / totalQuestions) * 100);

      const newLessonProgress: LessonProgress = {
        ...lessonProgress,
        [lessonId]: {
          completed: true,
          questionsAnswered: totalQuestions,
          correctAnswers,
          bestScore: existingProgress
            ? Math.max(existingProgress.bestScore, score)
            : score,
        },
      };

      setLessonProgress(newLessonProgress);
      await saveLessonProgress(newLessonProgress);

      const isNewCompletion = !existingProgress?.completed;
      const newProgress: Partial<Progress> = {
        correctAnswers: progress.correctAnswers + correctAnswers,
        totalAnswers: progress.totalAnswers + totalQuestions,
        lessonsCompleted: isNewCompletion
          ? progress.lessonsCompleted + 1
          : progress.lessonsCompleted,
      };

      setProgress((prev) => (prev ? { ...prev, ...newProgress } : null));
      await saveProgress(newProgress);

      await addXP(xpEarned);

      if (isPerfect && achievements && !achievements.perfectScore.unlocked) {
        await unlockAchievement("perfectScore");
      }
    },
    [progress, lessonProgress, achievements, addXP],
  );

  const loseLife = useCallback(async () => {
    if (!progress || progress.lives <= 0) return false;

    const newLives = progress.lives - 1;
    setProgress((prev) => (prev ? { ...prev, lives: newLives } : null));
    await saveProgress({ lives: newLives });

    return newLives > 0;
  }, [progress]);

  const checkAndUnlockAchievements = useCallback(
    async (currentProgress: Progress) => {
      if (!achievements) return;

      const updates: Partial<Achievements> = {};

      if (
        !achievements.firstLesson.unlocked &&
        currentProgress.lessonsCompleted >= 1
      ) {
        updates.firstLesson = {
          unlocked: true,
          unlockedAt: new Date().toISOString(),
        };
      }

      if (
        !achievements.streak7.unlocked &&
        currentProgress.currentStreak >= 7
      ) {
        updates.streak7 = {
          unlocked: true,
          unlockedAt: new Date().toISOString(),
        };
      }

      if (
        !achievements.streak30.unlocked &&
        currentProgress.currentStreak >= 30
      ) {
        updates.streak30 = {
          unlocked: true,
          unlockedAt: new Date().toISOString(),
        };
      }

      if (
        !achievements.lessons50.unlocked &&
        currentProgress.lessonsCompleted >= 50
      ) {
        updates.lessons50 = {
          unlocked: true,
          unlockedAt: new Date().toISOString(),
        };
      }

      if (
        !achievements.thaiMaster.unlocked &&
        currentProgress.totalXP >= 5000
      ) {
        updates.thaiMaster = {
          unlocked: true,
          unlockedAt: new Date().toISOString(),
        };
      }

      if (Object.keys(updates).length > 0) {
        setAchievements((prev) => (prev ? { ...prev, ...updates } : null));
        await saveAchievements(updates);
      }
    },
    [achievements],
  );

  const unlockAchievement = useCallback(
    async (key: keyof Achievements) => {
      if (!achievements || achievements[key].unlocked) return;

      const update = {
        [key]: { unlocked: true, unlockedAt: new Date().toISOString() },
      };
      setAchievements((prev) => (prev ? { ...prev, ...update } : null));
      await saveAchievements(update);
    },
    [achievements],
  );

  const resetProgress = useCallback(async () => {
    await resetAllData();
    await loadData();
  }, [loadData]);

  const getDailyGoalProgress = useCallback(() => {
    if (!progress || !userProfile) return 0;
    const xpPerMinute = 2;
    const requiredXP = userProfile.dailyGoalMinutes * xpPerMinute;
    return Math.min(1, progress.dailyXPEarned / requiredXP);
  }, [progress, userProfile]);

  const getAccuracy = useCallback(() => {
    if (!progress || progress.totalAnswers === 0) return 0;
    return Math.round((progress.correctAnswers / progress.totalAnswers) * 100);
  }, [progress]);

  return {
    userProfile,
    progress,
    lessonProgress,
    achievements,
    loading,
    updateProfile,
    addXP,
    completeLesson,
    loseLife,
    resetProgress,
    getDailyGoalProgress,
    getAccuracy,
    reload: loadData,
  };
}

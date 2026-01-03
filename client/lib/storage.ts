import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEYS = {
  USER_PROFILE: "@sawasdee_user_profile",
  PROGRESS: "@sawasdee_progress",
  LESSON_PROGRESS: "@sawasdee_lesson_progress",
  ACHIEVEMENTS: "@sawasdee_achievements",
};

export interface UserProfile {
  displayName: string;
  avatarPreset: number;
  dailyGoalMinutes: number;
  soundEnabled: boolean;
  theme: "light" | "dark" | "auto";
}

export interface Progress {
  totalXP: number;
  currentStreak: number;
  lastLessonDate: string | null;
  dailyXPEarned: number;
  dailyGoalLastReset: string;
  lessonsCompleted: number;
  correctAnswers: number;
  totalAnswers: number;
  lives: number;
  livesLastReset: string;
}

export interface LessonProgress {
  [lessonId: string]: {
    completed: boolean;
    questionsAnswered: number;
    correctAnswers: number;
    bestScore: number;
  };
}

export interface Achievements {
  firstLesson: { unlocked: boolean; unlockedAt: string | null };
  streak7: { unlocked: boolean; unlockedAt: string | null };
  lessons50: { unlocked: boolean; unlockedAt: string | null };
  perfectScore: { unlocked: boolean; unlockedAt: string | null };
  streak30: { unlocked: boolean; unlockedAt: string | null };
  thaiMaster: { unlocked: boolean; unlockedAt: string | null };
}

const defaultUserProfile: UserProfile = {
  displayName: "Learner",
  avatarPreset: 0,
  dailyGoalMinutes: 10,
  soundEnabled: true,
  theme: "auto",
};

const defaultProgress: Progress = {
  totalXP: 0,
  currentStreak: 0,
  lastLessonDate: null,
  dailyXPEarned: 0,
  dailyGoalLastReset: new Date().toDateString(),
  lessonsCompleted: 0,
  correctAnswers: 0,
  totalAnswers: 0,
  lives: 5,
  livesLastReset: new Date().toDateString(),
};

const defaultLessonProgress: LessonProgress = {};

const defaultAchievements: Achievements = {
  firstLesson: { unlocked: false, unlockedAt: null },
  streak7: { unlocked: false, unlockedAt: null },
  lessons50: { unlocked: false, unlockedAt: null },
  perfectScore: { unlocked: false, unlockedAt: null },
  streak30: { unlocked: false, unlockedAt: null },
  thaiMaster: { unlocked: false, unlockedAt: null },
};

export async function getUserProfile(): Promise<UserProfile> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.USER_PROFILE);
    return data ? { ...defaultUserProfile, ...JSON.parse(data) } : defaultUserProfile;
  } catch {
    return defaultUserProfile;
  }
}

export async function saveUserProfile(profile: Partial<UserProfile>): Promise<void> {
  try {
    const current = await getUserProfile();
    const updated = { ...current, ...profile };
    await AsyncStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(updated));
  } catch (error) {
    console.error("Failed to save user profile:", error);
  }
}

export async function getProgress(): Promise<Progress> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.PROGRESS);
    const progress = data ? { ...defaultProgress, ...JSON.parse(data) } : defaultProgress;
    
    const today = new Date().toDateString();
    if (progress.dailyGoalLastReset !== today) {
      progress.dailyXPEarned = 0;
      progress.dailyGoalLastReset = today;
    }
    if (progress.livesLastReset !== today) {
      progress.lives = 5;
      progress.livesLastReset = today;
    }
    
    return progress;
  } catch {
    return defaultProgress;
  }
}

export async function saveProgress(progress: Partial<Progress>): Promise<void> {
  try {
    const current = await getProgress();
    const updated = { ...current, ...progress };
    await AsyncStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(updated));
  } catch (error) {
    console.error("Failed to save progress:", error);
  }
}

export async function getLessonProgress(): Promise<LessonProgress> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.LESSON_PROGRESS);
    return data ? JSON.parse(data) : defaultLessonProgress;
  } catch {
    return defaultLessonProgress;
  }
}

export async function saveLessonProgress(lessonProgress: LessonProgress): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.LESSON_PROGRESS, JSON.stringify(lessonProgress));
  } catch (error) {
    console.error("Failed to save lesson progress:", error);
  }
}

export async function getAchievements(): Promise<Achievements> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS);
    return data ? { ...defaultAchievements, ...JSON.parse(data) } : defaultAchievements;
  } catch {
    return defaultAchievements;
  }
}

export async function saveAchievements(achievements: Partial<Achievements>): Promise<void> {
  try {
    const current = await getAchievements();
    const updated = { ...current, ...achievements };
    await AsyncStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(updated));
  } catch (error) {
    console.error("Failed to save achievements:", error);
  }
}

export async function resetAllData(): Promise<void> {
  try {
    await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
  } catch (error) {
    console.error("Failed to reset data:", error);
  }
}

import AsyncStorage from "@react-native-async-storage/async-storage";
import { VOCABULARY, VocabularyWord } from "./vocabularyData";

const STORAGE_KEY = "@sawasdee_spaced_repetition";

export interface WordProgress {
  wordId: string;
  easeFactor: number;
  interval: number;
  repetitions: number;
  nextReviewDate: string;
  lastReviewDate: string | null;
  totalReviews: number;
  correctReviews: number;
}

export interface SpacedRepetitionData {
  words: { [wordId: string]: WordProgress };
  lastSessionDate: string | null;
  totalWordsLearned: number;
  currentStreak: number;
}

const defaultData: SpacedRepetitionData = {
  words: {},
  lastSessionDate: null,
  totalWordsLearned: 0,
  currentStreak: 0,
};

const defaultWordProgress = (wordId: string): WordProgress => ({
  wordId,
  easeFactor: 2.5,
  interval: 0,
  repetitions: 0,
  nextReviewDate: new Date().toISOString(),
  lastReviewDate: null,
  totalReviews: 0,
  correctReviews: 0,
});

export async function getSpacedRepetitionData(): Promise<SpacedRepetitionData> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    return data ? { ...defaultData, ...JSON.parse(data) } : defaultData;
  } catch {
    return defaultData;
  }
}

export async function saveSpacedRepetitionData(data: SpacedRepetitionData): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export async function getWordProgress(wordId: string): Promise<WordProgress> {
  const data = await getSpacedRepetitionData();
  return data.words[wordId] || defaultWordProgress(wordId);
}

export async function getWordsForReview(): Promise<VocabularyWord[]> {
  const data = await getSpacedRepetitionData();
  const now = new Date();
  
  const dueWords: VocabularyWord[] = [];
  
  for (const word of VOCABULARY) {
    const progress = data.words[word.id];
    if (!progress) {
      dueWords.push(word);
    } else {
      const nextReview = new Date(progress.nextReviewDate);
      if (nextReview <= now) {
        dueWords.push(word);
      }
    }
  }
  
  dueWords.sort((a, b) => {
    const progressA = data.words[a.id];
    const progressB = data.words[b.id];
    if (!progressA) return -1;
    if (!progressB) return 1;
    return new Date(progressA.nextReviewDate).getTime() - new Date(progressB.nextReviewDate).getTime();
  });
  
  return dueWords;
}

export async function getNewWordsToLearn(count: number = 5): Promise<VocabularyWord[]> {
  const data = await getSpacedRepetitionData();
  
  const newWords = VOCABULARY.filter(word => !data.words[word.id]);
  
  const beginnerFirst = newWords.sort((a, b) => {
    const difficultyOrder = { beginner: 0, intermediate: 1, advanced: 2 };
    return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
  });
  
  return beginnerFirst.slice(0, count);
}

export type ReviewQuality = 0 | 1 | 2 | 3 | 4 | 5;

export async function recordReview(
  wordId: string,
  quality: ReviewQuality
): Promise<void> {
  const data = await getSpacedRepetitionData();
  const progress = data.words[wordId] || defaultWordProgress(wordId);
  
  const now = new Date();
  progress.lastReviewDate = now.toISOString();
  progress.totalReviews += 1;
  
  if (quality >= 3) {
    progress.correctReviews += 1;
  }
  
  if (quality < 3) {
    progress.repetitions = 0;
    progress.interval = 1;
  } else {
    if (progress.repetitions === 0) {
      progress.interval = 1;
    } else if (progress.repetitions === 1) {
      progress.interval = 6;
    } else {
      progress.interval = Math.round(progress.interval * progress.easeFactor);
    }
    progress.repetitions += 1;
  }
  
  progress.easeFactor = Math.max(
    1.3,
    progress.easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
  );
  
  const nextReview = new Date(now);
  nextReview.setDate(nextReview.getDate() + progress.interval);
  progress.nextReviewDate = nextReview.toISOString();
  
  data.words[wordId] = progress;
  
  if (progress.totalReviews === 1) {
    data.totalWordsLearned += 1;
  }
  
  const lastSession = data.lastSessionDate ? new Date(data.lastSessionDate) : null;
  const today = new Date().toDateString();
  if (!lastSession || lastSession.toDateString() !== today) {
    if (lastSession) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      if (lastSession.toDateString() === yesterday.toDateString()) {
        data.currentStreak += 1;
      } else {
        data.currentStreak = 1;
      }
    } else {
      data.currentStreak = 1;
    }
    data.lastSessionDate = now.toISOString();
  }
  
  await saveSpacedRepetitionData(data);
}

export async function getReviewStats(): Promise<{
  totalWordsLearned: number;
  wordsForReview: number;
  masteredWords: number;
  reviewStreak: number;
}> {
  const data = await getSpacedRepetitionData();
  const dueWords = await getWordsForReview();
  
  const masteredWords = Object.values(data.words).filter(
    (w) => w.repetitions >= 5 && w.easeFactor >= 2.0
  ).length;
  
  return {
    totalWordsLearned: data.totalWordsLearned,
    wordsForReview: dueWords.length,
    masteredWords,
    reviewStreak: data.currentStreak,
  };
}

export async function addWordToReview(
  wordId: string,
  thai: string,
  romanization: string,
  english: string
): Promise<void> {
  const data = await getSpacedRepetitionData();
  
  if (data.words[wordId]) {
    return;
  }
  
  const now = new Date();
  const newWord: WordProgress = {
    wordId,
    easeFactor: 2.5,
    interval: 0,
    repetitions: 0,
    nextReviewDate: now.toISOString(),
    lastReviewDate: null,
    totalReviews: 0,
    correctReviews: 0,
  };
  
  data.words[wordId] = newWord;
  await saveSpacedRepetitionData(data);
}

export async function isWordSaved(wordId: string): Promise<boolean> {
  const data = await getSpacedRepetitionData();
  return !!data.words[wordId];
}

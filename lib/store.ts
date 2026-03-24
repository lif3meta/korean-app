import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SRSCard, createSRSCard, calculateNextReview, getDueCards as getSRSDueCards } from './srs';
import { getToday, isToday, isYesterday } from './utils';
import { XP_REWARDS } from './xp';

export interface QuizResult {
  quizId: string;
  score: number;
  total: number;
  xpEarned: number;
  date: string;
  category: string;
}

interface AppState {
  // Onboarding
  hasOnboarded: boolean;
  setHasOnboarded: (v: boolean) => void;

  // User
  userName: string;
  setUserName: (name: string) => void;

  // XP
  totalXP: number;
  addXP: (amount: number) => void;

  // Streaks
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string | null;
  updateStreak: () => void;

  // Lesson Progress
  completedLessons: Record<string, boolean>;
  lessonScores: Record<string, number>;
  markLessonComplete: (lessonId: string, score: number) => void;

  // Hangul Progress
  learnedCharacters: string[];
  markCharacterLearned: (charId: string) => void;

  // Vocabulary Progress
  learnedWords: string[];
  markWordLearned: (wordId: string) => void;

  // SRS
  srsCards: Record<string, SRSCard>;
  initSRSCard: (wordId: string) => void;
  updateSRSCard: (wordId: string, quality: number) => void;
  getDueCards: () => SRSCard[];

  // Quiz
  quizHistory: QuizResult[];
  addQuizResult: (result: QuizResult) => void;

  // Achievements
  unlockedAchievements: string[];
  unlockAchievement: (id: string) => void;

  // Personal Dictionary
  savedWords: string[];
  addSavedWord: (korean: string) => void;
  removeSavedWord: (korean: string) => void;

  // Settings
  showRomanization: boolean;
  dailyGoalMinutes: number;
  soundEnabled: boolean;
  hapticEnabled: boolean;
  toggleRomanization: () => void;
  setDailyGoal: (minutes: number) => void;
  toggleSound: () => void;
  toggleHaptic: () => void;

  // Reset
  resetProgress: () => void;
}

const initialState = {
  hasOnboarded: false,
  userName: '',
  totalXP: 0,
  currentStreak: 0,
  longestStreak: 0,
  lastActivityDate: null as string | null,
  completedLessons: {} as Record<string, boolean>,
  lessonScores: {} as Record<string, number>,
  learnedCharacters: [] as string[],
  learnedWords: [] as string[],
  srsCards: {} as Record<string, SRSCard>,
  quizHistory: [] as QuizResult[],
  unlockedAchievements: [] as string[],
  savedWords: [] as string[],
  showRomanization: true,
  dailyGoalMinutes: 10,
  soundEnabled: true,
  hapticEnabled: true,
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      ...initialState,

      setHasOnboarded: (v) => set({ hasOnboarded: v }),
      setUserName: (name) => set({ userName: name }),

      addXP: (amount) => set((s) => ({ totalXP: s.totalXP + amount })),

      updateStreak: () => {
        const today = getToday();
        const { lastActivityDate, currentStreak, longestStreak } = get();

        if (lastActivityDate && isToday(lastActivityDate)) return;

        let newStreak = 1;
        if (lastActivityDate && isYesterday(lastActivityDate)) {
          newStreak = currentStreak + 1;
        }

        set({
          currentStreak: newStreak,
          longestStreak: Math.max(longestStreak, newStreak),
          lastActivityDate: today,
        });
      },

      markLessonComplete: (lessonId, score) => {
        const { completedLessons } = get();
        if (!completedLessons[lessonId]) {
          get().addXP(XP_REWARDS.completeLesson);
        }
        set((s) => ({
          completedLessons: { ...s.completedLessons, [lessonId]: true },
          lessonScores: { ...s.lessonScores, [lessonId]: Math.max(s.lessonScores[lessonId] || 0, score) },
        }));
        get().updateStreak();
      },

      markCharacterLearned: (charId) => {
        const { learnedCharacters } = get();
        if (learnedCharacters.includes(charId)) return;
        set({ learnedCharacters: [...learnedCharacters, charId] });
        get().addXP(XP_REWARDS.learnCharacter);
        get().updateStreak();
      },

      markWordLearned: (wordId) => {
        const { learnedWords } = get();
        if (learnedWords.includes(wordId)) return;
        set({ learnedWords: [...learnedWords, wordId] });
      },

      initSRSCard: (wordId) => {
        const { srsCards } = get();
        if (srsCards[wordId]) return;
        set({ srsCards: { ...srsCards, [wordId]: createSRSCard(wordId) } });
      },

      updateSRSCard: (wordId, quality) => {
        const { srsCards } = get();
        const card = srsCards[wordId];
        if (!card) return;
        const updated = calculateNextReview(card, quality);
        set({ srsCards: { ...srsCards, [wordId]: updated } });
        get().addXP(quality >= 3 ? XP_REWARDS.reviewCardCorrect : XP_REWARDS.reviewCard);
        get().updateStreak();
      },

      getDueCards: () => getSRSDueCards(get().srsCards),

      addQuizResult: (result) => {
        set((s) => ({
          quizHistory: [result, ...s.quizHistory].slice(0, 50),
        }));
        get().addXP(result.xpEarned);
        get().updateStreak();
      },

      unlockAchievement: (id) => {
        const { unlockedAchievements } = get();
        if (unlockedAchievements.includes(id)) return;
        set({ unlockedAchievements: [...unlockedAchievements, id] });
      },

      addSavedWord: (korean) => {
        const { savedWords } = get();
        if (savedWords.includes(korean)) return;
        set({ savedWords: [...savedWords, korean] });
      },
      removeSavedWord: (korean) => {
        set((s) => ({ savedWords: s.savedWords.filter((w) => w !== korean) }));
      },

      toggleRomanization: () => set((s) => ({ showRomanization: !s.showRomanization })),
      setDailyGoal: (minutes) => set({ dailyGoalMinutes: minutes }),
      toggleSound: () => set((s) => ({ soundEnabled: !s.soundEnabled })),
      toggleHaptic: () => set((s) => ({ hapticEnabled: !s.hapticEnabled })),

      resetProgress: () => set({ ...initialState, hasOnboarded: true }),
    }),
    {
      name: 'korean-app-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

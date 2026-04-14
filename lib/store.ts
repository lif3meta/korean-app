import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SRSCard, SRSCardType, createSRSCard, calculateNextReview, getDueCards as getSRSDueCards } from './srs';
import { getToday, isToday, isYesterday } from './utils';
import { XP_REWARDS } from './xp';
import { CategoryProficiency, updateProficiency } from './adaptiveDifficulty';

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

  // SRS (supports vocab, grammar, sentence, listening card types)
  srsCards: Record<string, SRSCard>;
  initSRSCard: (cardId: string, cardType?: SRSCardType) => void;
  updateSRSCard: (cardId: string, quality: number) => void;
  getDueCards: () => SRSCard[];
  getDueCardsByType: (type: SRSCardType) => SRSCard[];

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

  // Subscription
  isPremium: boolean;
  subscriptionExpirationDate: string | null;
  subscriptionWillRenew: boolean;
  purchasesInitialized: boolean;
  setSubscriptionStatus: (isPremium: boolean, expirationDate: string | null, willRenew: boolean) => void;
  setPurchasesInitialized: (initialized: boolean) => void;

  // Voice Chat Minutes (100 min/month limit)
  voiceChatSecondsUsed: number;
  voiceChatResetMonth: string | null; // 'YYYY-MM' of last reset
  addVoiceChatSeconds: (seconds: number) => void;
  getVoiceChatMinutesUsed: () => number;
  getVoiceChatMinutesRemaining: () => number;
  isVoiceChatLimitReached: () => boolean;

  // Daily Session
  dailySessions: Record<string, { completed: boolean; stepsCompleted: number; xpEarned: number }>;
  lastDailySessionDate: string | null;
  completeDailyStep: (date: string) => void;
  completeDailySession: (date: string, xp: number) => void;

  // Grammar Exercise Progress
  grammarExerciseScores: Record<string, { completed: boolean; correct: boolean }>;
  markGrammarExercise: (exerciseId: string, correct: boolean) => void;

  // Learning Path
  selectedPath: string | null;
  pathProgress: Record<string, { stageIndex: number; lessonsCompleted: string[] }>;
  setSelectedPath: (pathId: string) => void;
  completePathLesson: (pathId: string, lessonId: string) => void;

  // Adaptive Difficulty
  proficiency: Record<string, CategoryProficiency>;
  updateCategoryProficiency: (category: string, correct: number, total: number) => void;

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
  isPremium: false,
  subscriptionExpirationDate: null as string | null,
  subscriptionWillRenew: false,
  purchasesInitialized: false,
  voiceChatSecondsUsed: 0,
  voiceChatResetMonth: null as string | null,
  dailySessions: {} as Record<string, { completed: boolean; stepsCompleted: number; xpEarned: number }>,
  lastDailySessionDate: null as string | null,
  grammarExerciseScores: {} as Record<string, { completed: boolean; correct: boolean }>,
  selectedPath: null as string | null,
  pathProgress: {} as Record<string, { stageIndex: number; lessonsCompleted: string[] }>,
  proficiency: {} as Record<string, CategoryProficiency>,
  showRomanization: false,
  dailyGoalMinutes: 10,
  soundEnabled: true,
  hapticEnabled: true,
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      ...initialState,

      setHasOnboarded: (v: boolean) => set({ hasOnboarded: v }),
      setUserName: (name: string) => set({ userName: name }),

      addXP: (amount: number) => set((s: AppState) => ({ totalXP: s.totalXP + amount })),

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

      markLessonComplete: (lessonId: string, score: number) => {
        const { completedLessons } = get();
        if (!completedLessons[lessonId]) {
          get().addXP(XP_REWARDS.completeLesson);
        }
        set((s: AppState) => ({
          completedLessons: { ...s.completedLessons, [lessonId]: true },
          lessonScores: { ...s.lessonScores, [lessonId]: Math.max(s.lessonScores[lessonId] || 0, score) },
        }));
        get().updateStreak();
      },

      markCharacterLearned: (charId: string) => {
        const { learnedCharacters } = get();
        if (learnedCharacters.includes(charId)) return;
        set({ learnedCharacters: [...learnedCharacters, charId] });
        get().addXP(XP_REWARDS.learnCharacter);
        get().updateStreak();
      },

      markWordLearned: (wordId: string) => {
        const { learnedWords } = get();
        if (learnedWords.includes(wordId)) return;
        set({ learnedWords: [...learnedWords, wordId] });
      },

      initSRSCard: (cardId: string, cardType: SRSCardType = 'vocab') => {
        const { srsCards } = get();
        if (srsCards[cardId]) return;
        set({ srsCards: { ...srsCards, [cardId]: createSRSCard(cardId, cardType) } });
      },

      updateSRSCard: (wordId: string, quality: number) => {
        const { srsCards } = get();
        const card = srsCards[wordId];
        if (!card) return;
        const updated = calculateNextReview(card, quality);
        set({ srsCards: { ...srsCards, [wordId]: updated } });
        get().addXP(quality >= 3 ? XP_REWARDS.reviewCardCorrect : XP_REWARDS.reviewCard);
        get().updateStreak();
      },

      getDueCards: () => getSRSDueCards(get().srsCards),

      getDueCardsByType: (type: SRSCardType) => {
        const all = getSRSDueCards(get().srsCards);
        return all.filter((c) => (c.cardType || 'vocab') === type);
      },

      addQuizResult: (result: QuizResult) => {
        set((s: AppState) => ({
          quizHistory: [result, ...s.quizHistory].slice(0, 50),
        }));
        get().addXP(result.xpEarned);
        get().updateStreak();
      },

      unlockAchievement: (id: string) => {
        const { unlockedAchievements } = get();
        if (unlockedAchievements.includes(id)) return;
        set({ unlockedAchievements: [...unlockedAchievements, id] });
      },

      addSavedWord: (korean: string) => {
        const { savedWords } = get();
        if (savedWords.includes(korean)) return;
        set({ savedWords: [...savedWords, korean] });
      },
      removeSavedWord: (korean: string) => {
        set((s: AppState) => ({ savedWords: s.savedWords.filter((w: string) => w !== korean) }));
      },

      setSubscriptionStatus: (isPremium: boolean, expirationDate: string | null, willRenew: boolean) =>
        set({ isPremium, subscriptionExpirationDate: expirationDate, subscriptionWillRenew: willRenew }),
      setPurchasesInitialized: (initialized: boolean) => set({ purchasesInitialized: initialized }),

      addVoiceChatSeconds: (seconds: number) => {
        const currentMonth = new Date().toISOString().slice(0, 7); // 'YYYY-MM'
        const { voiceChatResetMonth, voiceChatSecondsUsed } = get();
        if (voiceChatResetMonth !== currentMonth) {
          // New month — reset counter
          set({ voiceChatSecondsUsed: seconds, voiceChatResetMonth: currentMonth });
        } else {
          set({ voiceChatSecondsUsed: voiceChatSecondsUsed + seconds });
        }
      },
      getVoiceChatMinutesUsed: () => {
        const currentMonth = new Date().toISOString().slice(0, 7);
        const { voiceChatResetMonth, voiceChatSecondsUsed } = get();
        if (voiceChatResetMonth !== currentMonth) return 0;
        return Math.floor(voiceChatSecondsUsed / 60);
      },
      getVoiceChatMinutesRemaining: () => {
        const limit = get().isPremium ? 100 : 10; // 100 min paid, 10 min trial
        return Math.max(0, limit - get().getVoiceChatMinutesUsed());
      },
      isVoiceChatLimitReached: () => {
        if (__DEV__) return false;
        return get().getVoiceChatMinutesRemaining() <= 0;
      },

      completeDailyStep: (date: string) => {
        const { dailySessions } = get();
        const session = dailySessions[date] || { completed: false, stepsCompleted: 0, xpEarned: 0 };
        set({
          dailySessions: {
            ...dailySessions,
            [date]: { ...session, stepsCompleted: session.stepsCompleted + 1 },
          },
          lastDailySessionDate: date,
        });
      },

      completeDailySession: (date: string, xp: number) => {
        const { dailySessions } = get();
        const session = dailySessions[date] || { completed: false, stepsCompleted: 0, xpEarned: 0 };
        set({
          dailySessions: {
            ...dailySessions,
            [date]: { ...session, completed: true, xpEarned: session.xpEarned + xp },
          },
        });
        get().addXP(xp);
        get().updateStreak();
      },

      markGrammarExercise: (exerciseId: string, correct: boolean) => {
        set((s: AppState) => ({
          grammarExerciseScores: {
            ...s.grammarExerciseScores,
            [exerciseId]: { completed: true, correct },
          },
        }));
      },

      setSelectedPath: (pathId: string) => set({ selectedPath: pathId }),

      completePathLesson: (pathId: string, lessonId: string) => {
        const { pathProgress } = get();
        const progress = pathProgress[pathId] || { stageIndex: 0, lessonsCompleted: [] };
        if (progress.lessonsCompleted.includes(lessonId)) return;
        set({
          pathProgress: {
            ...pathProgress,
            [pathId]: {
              ...progress,
              lessonsCompleted: [...progress.lessonsCompleted, lessonId],
            },
          },
        });
      },

      updateCategoryProficiency: (category: string, correct: number, total: number) => {
        const { proficiency } = get();
        const current = proficiency[category];
        const updated = updateProficiency(current, correct, total);
        set({
          proficiency: {
            ...proficiency,
            [category]: { ...updated, category },
          },
        });
      },

      toggleRomanization: () => set((s: AppState) => ({ showRomanization: !s.showRomanization })),
      setDailyGoal: (minutes: number) => set({ dailyGoalMinutes: minutes }),
      toggleSound: () => set((s: AppState) => ({ soundEnabled: !s.soundEnabled })),
      toggleHaptic: () => set((s: AppState) => ({ hapticEnabled: !s.hapticEnabled })),

      resetProgress: () => set({ ...initialState, hasOnboarded: true }),
    }),
    {
      name: 'korean-app-storage',
      version: 2,
      storage: createJSONStorage(() => AsyncStorage),
      migrate: (persisted: any, version: number) => {
        // Version 0 (or no version) -> 1: ensure all fields have defaults
        // This runs when the stored version doesn't match the current version.
        // It merges persisted data on top of initialState so new fields get defaults
        // and existing user data is preserved.
        if (version === 0 || version === undefined || version === 1) {
          return { ...initialState, ...persisted };
        }
        return persisted;
      },
      merge: (persisted: any, current: any) => {
        // Deep merge: persisted user data takes priority over defaults,
        // but any NEW fields added in updates get their initialState defaults
        if (!persisted) return current;
        return { ...current, ...persisted };
      },
    }
  )
);

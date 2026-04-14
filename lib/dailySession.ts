import { SRSCard, getDueCards } from './srs';
import { vocabulary, VocabWord, VocabCategory } from '@/data/vocabulary';
import { GrammarLesson } from '@/data/grammar';
import { sentences, Sentence } from '@/data/sentences';
import { generateDynamicQuestions } from '@/data/questionGenerators';
import { QuizQuestion } from '@/data/quizzes';
import { getToday, shuffleArray } from './utils';
import { XP_REWARDS } from './xp';

// ─── Types ──────────────────────────────────────────────────────────────────

export type SessionStepType =
  | 'srs_review'
  | 'new_vocab'
  | 'grammar_point'
  | 'listening'
  | 'sentence_build'
  | 'mini_quiz';

export interface SRSReviewStep {
  type: 'srs_review';
  title: string;
  titleKorean: string;
  cards: SRSCard[];
}

export interface NewVocabStep {
  type: 'new_vocab';
  title: string;
  titleKorean: string;
  words: VocabWord[];
  category: string;
}

export interface GrammarPointStep {
  type: 'grammar_point';
  title: string;
  titleKorean: string;
  lessonId: string;
  lesson: GrammarLesson;
}

export interface ListeningStep {
  type: 'listening';
  title: string;
  titleKorean: string;
  items: { korean: string; english: string; romanization: string }[];
}

export interface SentenceBuildStep {
  type: 'sentence_build';
  title: string;
  titleKorean: string;
  sentences: Sentence[];
}

export interface MiniQuizStep {
  type: 'mini_quiz';
  title: string;
  titleKorean: string;
  questions: QuizQuestion[];
}

export type SessionStep =
  | SRSReviewStep
  | NewVocabStep
  | GrammarPointStep
  | ListeningStep
  | SentenceBuildStep
  | MiniQuizStep;

export interface DailySession {
  id: string;
  date: string;
  steps: SessionStep[];
  estimatedMinutes: number;
  totalXPPotential: number;
}

// ─── Session generation ─────────────────────────────────────────────────────

interface UserState {
  srsCards: Record<string, SRSCard>;
  learnedWords: string[];
  learnedCharacters: string[];
  completedLessons: Record<string, boolean>;
  dailyGoalMinutes: number;
}

const VOCAB_CATEGORIES: VocabCategory[] = [
  'greetings', 'numbers', 'family', 'food', 'colors', 'time',
  'places', 'verbs', 'adjectives', 'daily', 'body', 'weather',
  'emotions', 'animals', 'objects',
];

export function generateDailySession(state: UserState): DailySession {
  const today = getToday();
  const steps: SessionStep[] = [];
  let estimatedMinutes = 0;
  let totalXP = 0;

  // 1. SRS Review (max 5 cards) — ~2 min
  const dueCards = getDueCards(state.srsCards);
  if (dueCards.length > 0) {
    const reviewCards = dueCards.slice(0, 5);
    steps.push({
      type: 'srs_review',
      title: 'Review Words',
      titleKorean: '복습',
      cards: reviewCards,
    });
    estimatedMinutes += 2;
    totalXP += reviewCards.length * XP_REWARDS.reviewCardCorrect;
  }

  // 2. New vocabulary (3 words from next uncompleted category) — ~2 min
  const newWords = getNextNewWords(state.learnedWords, 3);
  if (newWords.length > 0) {
    steps.push({
      type: 'new_vocab',
      title: 'New Words',
      titleKorean: '새 단어',
      words: newWords,
      category: newWords[0].category,
    });
    estimatedMinutes += 2;
    totalXP += newWords.length * XP_REWARDS.learnCharacter;
  }

  // 3. Listening exercise — hear Korean, identify meaning (~2 min)
  const listeningItems = getListeningItems(state.learnedWords);
  if (listeningItems.length > 0) {
    steps.push({
      type: 'listening',
      title: 'Listen & Learn',
      titleKorean: '듣기 연습',
      items: listeningItems,
    });
    estimatedMinutes += 2;
    totalXP += listeningItems.length * 5;
  }

  // 4. Sentence building (alternate with listening based on day) — ~2 min
  const dayNum = new Date().getDate();
  if (dayNum % 2 === 0) {
    const buildSentences = getSentencesForPractice(state.completedLessons);
    if (buildSentences.length > 0) {
      steps.push({
        type: 'sentence_build',
        title: 'Build Sentences',
        titleKorean: '문장 만들기',
        sentences: buildSentences,
      });
      estimatedMinutes += 2;
      totalXP += buildSentences.length * 10;
    }
  }

  // 5. Mini quiz (3 questions from session content) — ~1 min
  const quizQuestions = generateDynamicQuestions('mixed', 3);
  if (quizQuestions.length > 0) {
    steps.push({
      type: 'mini_quiz',
      title: 'Quick Quiz',
      titleKorean: '퀴즈',
      questions: quizQuestions,
    });
    estimatedMinutes += 1;
    totalXP += quizQuestions.length * XP_REWARDS.quizCorrect;
  }

  return {
    id: `daily_${today}`,
    date: today,
    steps,
    estimatedMinutes: Math.max(estimatedMinutes, 5),
    totalXPPotential: totalXP,
  };
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function getNextNewWords(learnedWordIds: string[], count: number): VocabWord[] {
  // Find next category with unlearned words
  for (const cat of VOCAB_CATEGORIES) {
    const catWords = vocabulary.filter((w) => w.category === cat);
    const unlearned = catWords.filter((w) => !learnedWordIds.includes(w.id));
    if (unlearned.length > 0) {
      return unlearned.slice(0, count);
    }
  }
  // All learned — pick random for reinforcement
  return shuffleArray(vocabulary).slice(0, count);
}

function getListeningItems(
  learnedWordIds: string[]
): { korean: string; english: string; romanization: string }[] {
  // Mix learned words for review + a couple new ones
  const learned = vocabulary.filter((w) => learnedWordIds.includes(w.id));
  const pool = learned.length >= 3 ? learned : vocabulary.filter((w) => w.level === 'beginner');
  return shuffleArray(pool)
    .slice(0, 4)
    .map((w) => ({ korean: w.korean, english: w.english, romanization: w.romanization }));
}

function getSentencesForPractice(completedLessons: Record<string, boolean>): Sentence[] {
  // Pick sentences from levels the user is working on
  const maxLevel = getMaxSentenceLevel(completedLessons);
  const eligible = sentences.filter((s) => s.level <= maxLevel);
  return shuffleArray(eligible).slice(0, 3);
}

function getMaxSentenceLevel(completedLessons: Record<string, boolean>): number {
  // Grammar lessons completed → unlock higher sentence levels
  const grammarCount = Object.keys(completedLessons).filter((k) => k.startsWith('g_')).length;
  if (grammarCount >= 8) return 6;
  if (grammarCount >= 6) return 5;
  if (grammarCount >= 4) return 4;
  if (grammarCount >= 2) return 3;
  if (grammarCount >= 1) return 2;
  return 1;
}

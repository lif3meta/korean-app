import { getToday } from './utils';

export interface CategoryProficiency {
  category: string;
  score: number; // 0-100
  totalAttempts: number;
  correctAttempts: number;
  lastAttemptDate: string;
  trend: 'improving' | 'stable' | 'declining';
}

// ─── Proficiency calculation ────────────────────────────────────────────────

export function updateProficiency(
  current: CategoryProficiency | undefined,
  correct: number,
  total: number
): CategoryProficiency {
  const today = getToday();
  const prev = current || {
    category: '',
    score: 50,
    totalAttempts: 0,
    correctAttempts: 0,
    lastAttemptDate: today,
    trend: 'stable' as const,
  };

  const newTotal = prev.totalAttempts + total;
  const newCorrect = prev.correctAttempts + correct;
  const newScore = newTotal > 0 ? Math.round((newCorrect / newTotal) * 100) : 50;

  // Determine trend from last 2 data points
  let trend: CategoryProficiency['trend'] = 'stable';
  if (prev.totalAttempts >= 5) {
    const prevRate = prev.totalAttempts > 0 ? prev.correctAttempts / prev.totalAttempts : 0.5;
    const sessionRate = total > 0 ? correct / total : 0.5;
    if (sessionRate > prevRate + 0.1) trend = 'improving';
    else if (sessionRate < prevRate - 0.1) trend = 'declining';
  }

  return {
    ...prev,
    score: newScore,
    totalAttempts: newTotal,
    correctAttempts: newCorrect,
    lastAttemptDate: today,
    trend,
  };
}

// ─── Recommendations ────────────────────────────────────────────────────────

export function getWeakestCategories(
  proficiency: Record<string, CategoryProficiency>,
  n: number = 3
): CategoryProficiency[] {
  return Object.values(proficiency)
    .filter((p) => p.totalAttempts >= 3) // need some data
    .sort((a, b) => a.score - b.score)
    .slice(0, n);
}

export function getStrongestCategories(
  proficiency: Record<string, CategoryProficiency>,
  n: number = 3
): CategoryProficiency[] {
  return Object.values(proficiency)
    .filter((p) => p.totalAttempts >= 3)
    .sort((a, b) => b.score - a.score)
    .slice(0, n);
}

export function getDifficultyForCategory(
  proficiency: Record<string, CategoryProficiency>,
  category: string
): 'easy' | 'medium' | 'hard' {
  const p = proficiency[category];
  if (!p || p.totalAttempts < 5) return 'easy';
  if (p.score >= 80) return 'hard';
  if (p.score >= 50) return 'medium';
  return 'easy';
}

export function getRecommendedFocusArea(
  proficiency: Record<string, CategoryProficiency>
): { category: string; message: string } | null {
  const weak = getWeakestCategories(proficiency, 1);
  if (weak.length === 0) return null;

  const w = weak[0];
  const categoryLabels: Record<string, string> = {
    hangul: 'Hangul characters',
    vocab_greetings: 'greetings vocabulary',
    vocab_numbers: 'numbers',
    vocab_family: 'family vocabulary',
    vocab_food: 'food vocabulary',
    vocab_verbs: 'verbs',
    grammar_particles: 'particles (은/는, 이/가, 을/를)',
    grammar_tense: 'verb conjugation',
    grammar_negative: 'negative sentences',
    grammar_connectors: 'connecting sentences',
    listening: 'listening comprehension',
    sentences: 'sentence building',
  };

  const label = categoryLabels[w.category] || w.category;
  return {
    category: w.category,
    message: `You're strong overall but could improve on ${label} — let's practice!`,
  };
}

// ─── Quiz difficulty scaling ────────────────────────────────────────────────

export function getScaledQuestionCount(
  baseDifficulty: 'easy' | 'medium' | 'hard',
  proficiency: Record<string, CategoryProficiency>,
  category: string
): { easyPct: number; mediumPct: number; hardPct: number } {
  const difficulty = getDifficultyForCategory(proficiency, category);

  switch (difficulty) {
    case 'easy':
      return { easyPct: 0.6, mediumPct: 0.3, hardPct: 0.1 };
    case 'medium':
      return { easyPct: 0.3, mediumPct: 0.5, hardPct: 0.2 };
    case 'hard':
      return { easyPct: 0.1, mediumPct: 0.4, hardPct: 0.5 };
  }
}

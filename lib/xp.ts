export const XP_PER_LEVEL = 500;

export const XP_REWARDS = {
  learnCharacter: 10,
  reviewCard: 5,
  reviewCardCorrect: 10,
  quizCorrect: 15,
  quizIncorrect: 2,
  completeLesson: 50,
  completeDeck: 30,
  dailyStreak: 20,
  perfectQuiz: 100,
  firstLesson: 25,
} as const;

export function getLevelFromXP(xp: number): number {
  return Math.floor(xp / XP_PER_LEVEL) + 1;
}

export function getXPProgressInLevel(xp: number): { current: number; needed: number; percentage: number } {
  const current = xp % XP_PER_LEVEL;
  return {
    current,
    needed: XP_PER_LEVEL,
    percentage: Math.round((current / XP_PER_LEVEL) * 100),
  };
}

export function getLevelTitle(level: number): string {
  if (level <= 2) return 'Beginner';
  if (level <= 5) return 'Elementary';
  if (level <= 8) return 'Intermediate';
  if (level <= 12) return 'Upper Intermediate';
  if (level <= 16) return 'Advanced';
  return 'Master';
}

export function getLevelEmoji(level: number): string {
  if (level <= 2) return '';
  if (level <= 5) return '';
  if (level <= 8) return '';
  if (level <= 12) return '';
  if (level <= 16) return '';
  return '';
}

import { getToday, addDays } from './utils';

export interface SRSCard {
  wordId: string;
  easeFactor: number;
  interval: number;
  repetitions: number;
  nextReviewDate: string;
  lastReviewDate: string | null;
}

export function createSRSCard(wordId: string): SRSCard {
  return {
    wordId,
    easeFactor: 2.5,
    interval: 0,
    repetitions: 0,
    nextReviewDate: getToday(),
    lastReviewDate: null,
  };
}

/**
 * SM-2 Algorithm
 * quality: 0-5 rating
 *   0 = complete blackout
 *   1 = incorrect, remembered after seeing answer
 *   2 = incorrect, easy to recall after seeing answer
 *   3 = correct, with serious difficulty
 *   4 = correct, after hesitation
 *   5 = perfect response
 */
export function calculateNextReview(card: SRSCard, quality: number): SRSCard {
  const q = Math.min(5, Math.max(0, quality));
  let { easeFactor, interval, repetitions } = card;

  if (q < 3) {
    // Failed: reset
    repetitions = 0;
    interval = 1;
  } else {
    // Passed
    if (repetitions === 0) {
      interval = 1;
    } else if (repetitions === 1) {
      interval = 6;
    } else {
      interval = Math.round(interval * easeFactor);
    }
    repetitions += 1;
  }

  // Update ease factor
  easeFactor = easeFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
  easeFactor = Math.max(1.3, easeFactor);

  const today = getToday();
  const nextReviewDate = addDays(today, interval);

  return {
    wordId: card.wordId,
    easeFactor,
    interval,
    repetitions,
    nextReviewDate,
    lastReviewDate: today,
  };
}

export function isDue(card: SRSCard): boolean {
  return card.nextReviewDate <= getToday();
}

export function getDueCards(cards: Record<string, SRSCard>): SRSCard[] {
  const today = getToday();
  return Object.values(cards)
    .filter((c) => c.nextReviewDate <= today)
    .sort((a, b) => a.nextReviewDate.localeCompare(b.nextReviewDate));
}

export function qualityFromCorrect(correct: boolean, hesitated: boolean = false): number {
  if (!correct) return 1;
  if (hesitated) return 3;
  return 5;
}

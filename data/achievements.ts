export interface Achievement {
  id: string;
  title: string;
  titleKorean: string;
  description: string;
  icon: string;
  condition: (state: { learnedCharacters: string[]; learnedWords: string[]; completedLessons: Record<string, boolean>; quizHistory: any[]; currentStreak: number; totalXP: number }) => boolean;
}

export const achievements: Achievement[] = [
  {
    id: 'first_steps',
    title: 'First Steps',
    titleKorean: '첫걸음',
    description: 'Complete your first lesson',
    icon: 'footsteps',
    condition: (s) => Object.keys(s.completedLessons).length >= 1,
  },
  {
    id: 'hangul_hero',
    title: 'Hangul Hero',
    titleKorean: '한글 영웅',
    description: 'Learn all 40 Hangul characters',
    icon: 'trophy',
    condition: (s) => s.learnedCharacters.length >= 40,
  },
  {
    id: 'word_collector_10',
    title: 'Word Collector',
    titleKorean: '단어 수집가',
    description: 'Learn 10 vocabulary words',
    icon: 'book',
    condition: (s) => s.learnedWords.length >= 10,
  },
  {
    id: 'word_collector_50',
    title: 'Vocabulary Builder',
    titleKorean: '어휘력 향상',
    description: 'Learn 50 vocabulary words',
    icon: 'library',
    condition: (s) => s.learnedWords.length >= 50,
  },
  {
    id: 'century_club',
    title: 'Century Club',
    titleKorean: '100단어 클럽',
    description: 'Learn 100 vocabulary words',
    icon: 'medal',
    condition: (s) => s.learnedWords.length >= 100,
  },
  {
    id: 'quiz_taker',
    title: 'Quiz Taker',
    titleKorean: '퀴즈 도전자',
    description: 'Complete 5 quizzes',
    icon: 'checkmark-circle',
    condition: (s) => s.quizHistory.length >= 5,
  },
  {
    id: 'quiz_master',
    title: 'Quiz Master',
    titleKorean: '퀴즈 마스터',
    description: 'Complete 20 quizzes',
    icon: 'ribbon',
    condition: (s) => s.quizHistory.length >= 20,
  },
  {
    id: 'on_fire',
    title: 'On Fire',
    titleKorean: '연속 학습',
    description: 'Maintain a 7-day streak',
    icon: 'flame',
    condition: (s) => s.currentStreak >= 7,
  },
  {
    id: 'dedicated',
    title: 'Dedicated Learner',
    titleKorean: '열정적인 학습자',
    description: 'Maintain a 30-day streak',
    icon: 'diamond',
    condition: (s) => s.currentStreak >= 30,
  },
  {
    id: 'xp_champion',
    title: 'XP Champion',
    titleKorean: 'XP 챔피언',
    description: 'Earn 5,000 XP',
    icon: 'star',
    condition: (s) => s.totalXP >= 5000,
  },
];

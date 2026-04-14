export type QuizQuestion = MultipleChoiceQuestion | FillInBlankQuestion | MatchingQuestion;

export interface MultipleChoiceQuestion {
  type: 'multiple_choice';
  id: string;
  question: string;
  questionKorean?: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
  category: 'hangul' | 'vocab' | 'grammar';
  level: 'beginner' | 'intermediate';
  xpReward: number;
}

export interface FillInBlankQuestion {
  type: 'fill_in_blank';
  id: string;
  sentence: string;
  correctAnswer: string;
  acceptedAnswers: string[];
  hint?: string;
  category: 'vocab' | 'grammar';
  level: 'beginner' | 'intermediate';
  xpReward: number;
}

export interface MatchingQuestion {
  type: 'matching';
  id: string;
  instruction: string;
  pairs: { left: string; right: string }[];
  category: 'hangul' | 'vocab';
  level: 'beginner' | 'intermediate';
  xpReward: number;
}

export const quizQuestions: QuizQuestion[] = [
  // === HANGUL QUIZZES ===
  { type: 'multiple_choice', id: 'hq_1', question: 'What pronunciation cue do we use for ㄱ?', options: ['가', '나', '다', '라'], correctIndex: 0, category: 'hangul', level: 'beginner', xpReward: 10 },
  { type: 'multiple_choice', id: 'hq_2', question: 'What pronunciation cue do we use for ㅂ?', options: ['마', '사', '바', '하'], correctIndex: 2, category: 'hangul', level: 'beginner', xpReward: 10 },
  { type: 'multiple_choice', id: 'hq_3', question: 'Which character is silent at the beginning of a syllable?', options: ['ㅎ', 'ㅇ', 'ㅈ', 'ㅊ'], correctIndex: 1, explanation: 'ㅇ is silent at the beginning but makes "ng" sound at the end of a syllable.', category: 'hangul', level: 'beginner', xpReward: 10 },
  { type: 'multiple_choice', id: 'hq_4', question: 'What pronunciation cue do we use for ㅏ?', options: ['오', '아', '에', '이'], correctIndex: 1, category: 'hangul', level: 'beginner', xpReward: 10 },
  { type: 'multiple_choice', id: 'hq_5', question: 'Which is a double consonant?', options: ['ㅋ', 'ㄲ', 'ㅊ', 'ㅍ'], correctIndex: 1, explanation: 'ㄲ is ssang giyeok (double ㄱ). ㅋ, ㅊ, ㅍ are aspirated consonants.', category: 'hangul', level: 'beginner', xpReward: 10 },
  { type: 'multiple_choice', id: 'hq_6', question: 'What pronunciation cue do we use for ㅓ?', options: ['야', '어', '오', '으'], correctIndex: 1, category: 'hangul', level: 'beginner', xpReward: 10 },
  { type: 'multiple_choice', id: 'hq_7', question: 'Which character matches the sound cue "차"?', options: ['ㅈ', 'ㅊ', 'ㅋ', 'ㅌ'], correctIndex: 1, category: 'hangul', level: 'beginner', xpReward: 10 },
  { type: 'multiple_choice', id: 'hq_8', question: 'ㅡ sounds like:', options: ['oo as in moon', 'ee as in see', 'Say "ee" but with flat, unsmiling lips', 'a as in father'], correctIndex: 2, category: 'hangul', level: 'beginner', xpReward: 10 },
  { type: 'matching', id: 'hq_m1', instruction: 'Match the consonant to its pronunciation cue', pairs: [{ left: 'ㄴ', right: '나' }, { left: 'ㅁ', right: '마' }, { left: 'ㅅ', right: '사' }, { left: 'ㅎ', right: '하' }], category: 'hangul', level: 'beginner', xpReward: 20 },
  { type: 'matching', id: 'hq_m2', instruction: 'Match the vowel to its pronunciation cue', pairs: [{ left: 'ㅏ', right: '아' }, { left: 'ㅗ', right: '오' }, { left: 'ㅜ', right: '우' }, { left: 'ㅣ', right: '이' }], category: 'hangul', level: 'beginner', xpReward: 20 },

  // === VOCABULARY QUIZZES ===
  { type: 'multiple_choice', id: 'vq_1', question: 'What does 안녕하세요 mean?', options: ['Goodbye', 'Thank you', 'Hello', 'Sorry'], correctIndex: 2, category: 'vocab', level: 'beginner', xpReward: 15 },
  { type: 'multiple_choice', id: 'vq_2', question: 'How do you say "Thank you" formally?', questionKorean: '감사합니다', options: ['감사합니다', '미안합니다', '괜찮습니다', '축하합니다'], correctIndex: 0, category: 'vocab', level: 'beginner', xpReward: 15 },
  { type: 'multiple_choice', id: 'vq_3', question: 'What is 김치?', options: ['Rice', 'Kimchi (fermented vegetables)', 'Noodles', 'Meat'], correctIndex: 1, category: 'vocab', level: 'beginner', xpReward: 15 },
  { type: 'multiple_choice', id: 'vq_4', question: 'What does 학교 mean?', options: ['Hospital', 'Bank', 'School', 'Restaurant'], correctIndex: 2, category: 'vocab', level: 'beginner', xpReward: 15 },
  { type: 'multiple_choice', id: 'vq_5', question: '엄마 means:', options: ['Dad', 'Mom', 'Older sister', 'Grandmother'], correctIndex: 1, category: 'vocab', level: 'beginner', xpReward: 15 },
  { type: 'multiple_choice', id: 'vq_6', question: 'What color is 빨간색?', options: ['Blue', 'Yellow', 'Green', 'Red'], correctIndex: 3, category: 'vocab', level: 'beginner', xpReward: 15 },
  { type: 'multiple_choice', id: 'vq_7', question: '오늘 means:', options: ['Yesterday', 'Tomorrow', 'Today', 'Now'], correctIndex: 2, category: 'vocab', level: 'beginner', xpReward: 15 },
  { type: 'multiple_choice', id: 'vq_8', question: 'What does 먹다 mean?', options: ['To drink', 'To eat', 'To go', 'To come'], correctIndex: 1, category: 'vocab', level: 'beginner', xpReward: 15 },
  { type: 'multiple_choice', id: 'vq_9', question: '맛있다 means:', options: ['Pretty', 'Big', 'Delicious', 'Difficult'], correctIndex: 2, category: 'vocab', level: 'beginner', xpReward: 15 },
  { type: 'multiple_choice', id: 'vq_10', question: 'What does 친구 mean?', options: ['Teacher', 'Student', 'Family', 'Friend'], correctIndex: 3, category: 'vocab', level: 'beginner', xpReward: 15 },
  { type: 'multiple_choice', id: 'vq_11', question: 'How do you say "water" in Korean?', options: ['밥', '물', '차', '술'], correctIndex: 1, category: 'vocab', level: 'beginner', xpReward: 15 },
  { type: 'multiple_choice', id: 'vq_12', question: 'What is the native Korean number for 3?', options: ['삼', '셋', '넷', '다섯'], correctIndex: 1, category: 'vocab', level: 'beginner', xpReward: 15 },
  { type: 'multiple_choice', id: 'vq_13', question: '오빠 is used by a female to call her:', options: ['Younger brother', 'Father', 'Older brother', 'Grandfather'], correctIndex: 2, category: 'vocab', level: 'beginner', xpReward: 15 },
  { type: 'multiple_choice', id: 'vq_14', question: 'What does 예쁘다 mean?', options: ['Cool', 'Pretty', 'Busy', 'Tired'], correctIndex: 1, category: 'vocab', level: 'beginner', xpReward: 15 },
  { type: 'multiple_choice', id: 'vq_15', question: '커피 is a loanword meaning:', options: ['Copy', 'Coffee', 'Puppy', 'Cake'], correctIndex: 1, category: 'vocab', level: 'beginner', xpReward: 15 },
  { type: 'matching', id: 'vq_m1', instruction: 'Match Korean to English', pairs: [{ left: '사랑', right: 'Love' }, { left: '물', right: 'Water' }, { left: '집', right: 'Home' }, { left: '밥', right: 'Rice' }], category: 'vocab', level: 'beginner', xpReward: 20 },
  { type: 'matching', id: 'vq_m2', instruction: 'Match the food words', pairs: [{ left: '김치', right: 'Kimchi' }, { left: '불고기', right: 'Bulgogi' }, { left: '떡볶이', right: 'Spicy rice cakes' }, { left: '비빔밥', right: 'Mixed rice' }], category: 'vocab', level: 'beginner', xpReward: 20 },
  { type: 'matching', id: 'vq_m3', instruction: 'Match the family words', pairs: [{ left: '엄마', right: 'Mom' }, { left: '아빠', right: 'Dad' }, { left: '할머니', right: 'Grandmother' }, { left: '동생', right: 'Younger sibling' }], category: 'vocab', level: 'beginner', xpReward: 20 },

  // === GRAMMAR QUIZZES ===
  { type: 'multiple_choice', id: 'gq_1', question: 'Korean sentence order is:', options: ['SVO (Subject-Verb-Object)', 'SOV (Subject-Object-Verb)', 'VSO (Verb-Subject-Object)', 'OVS (Object-Verb-Subject)'], correctIndex: 1, category: 'grammar', level: 'beginner', xpReward: 15 },
  { type: 'multiple_choice', id: 'gq_2', question: 'Which particle marks the topic?', options: ['이/가', '을/를', '은/는', '에/에서'], correctIndex: 2, category: 'grammar', level: 'beginner', xpReward: 15 },
  { type: 'multiple_choice', id: 'gq_3', question: 'Which particle marks the object?', options: ['은/는', '을/를', '이/가', '에'], correctIndex: 1, category: 'grammar', level: 'beginner', xpReward: 15 },
  { type: 'multiple_choice', id: 'gq_4', question: '가다 in present tense polite form is:', options: ['갔어요', '가요', '갈 거예요', '가고'], correctIndex: 1, category: 'grammar', level: 'beginner', xpReward: 15 },
  { type: 'multiple_choice', id: 'gq_5', question: '먹다 in past tense is:', options: ['먹어요', '먹었어요', '먹을 거예요', '먹고 싶어요'], correctIndex: 1, category: 'grammar', level: 'beginner', xpReward: 15 },
  { type: 'multiple_choice', id: 'gq_6', question: 'How do you negate a verb using the short form?', options: ['Verb + 지 않다', '안 + Verb', '못 + Verb', 'Verb + 고 싶다'], correctIndex: 1, category: 'grammar', level: 'beginner', xpReward: 15 },
  { type: 'fill_in_blank', id: 'gq_f1', sentence: '저___ 학생이에요. (I am a student)', correctAnswer: '는', acceptedAnswers: ['는'], hint: 'Topic marker after a vowel', category: 'grammar', level: 'beginner', xpReward: 20 },
  { type: 'fill_in_blank', id: 'gq_f2', sentence: '밥___ 먹어요. (I eat rice)', correctAnswer: '을', acceptedAnswers: ['을'], hint: 'Object marker after a consonant', category: 'grammar', level: 'beginner', xpReward: 20 },
  { type: 'fill_in_blank', id: 'gq_f3', sentence: '학교___ 가요. (I go to school)', correctAnswer: '에', acceptedAnswers: ['에'], hint: 'Direction/destination particle', category: 'grammar', level: 'beginner', xpReward: 20 },
  { type: 'fill_in_blank', id: 'gq_f4', sentence: '한국에 가___ 싶어요. (I want to go to Korea)', correctAnswer: '고', acceptedAnswers: ['고'], hint: 'Want to: verb stem + ? + 싶다', category: 'grammar', level: 'intermediate', xpReward: 20 },
  { type: 'multiple_choice', id: 'gq_7', question: '"I want to eat" in Korean is:', options: ['먹어요', '먹었어요', '먹고 싶어요', '안 먹어요'], correctIndex: 2, category: 'grammar', level: 'intermediate', xpReward: 15 },
  { type: 'multiple_choice', id: 'gq_8', question: 'Which level of speech should beginners use most?', options: ['Formal polite (-ㅂ니다)', 'Informal polite (-아/어요)', 'Casual (-아/어)', 'Literary'], correctIndex: 1, category: 'grammar', level: 'intermediate', xpReward: 15, explanation: 'The informal polite (-아/어요) form works in almost every daily situation.' },
];

export function getQuizzesByCategory(category: QuizQuestion['category']): QuizQuestion[] {
  return quizQuestions.filter((q) => q.category === category);
}

export function getQuizzesByLevel(level: 'beginner' | 'intermediate'): QuizQuestion[] {
  return quizQuestions.filter((q) => q.level === level);
}

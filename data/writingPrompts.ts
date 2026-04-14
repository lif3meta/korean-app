export interface WritingPrompt {
  id: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  type: 'translation' | 'free_write' | 'particle_fill';
  prompt: string;
  promptKorean?: string;
  // For translation type
  targetKorean?: string;
  acceptedAnswers?: string[];
  // For particle fill type
  sentenceWithBlanks?: string;
  correctSentence?: string;
  // For all
  hints: string[];
  sampleAnswer?: string;
  sampleAnswerEnglish?: string;
}

export const writingPrompts: WritingPrompt[] = [
  // ─── Translation — Beginner ───────────────────────────────────────────────
  {
    id: 'wp_t1',
    level: 'beginner',
    type: 'translation',
    prompt: 'Translate: "Hello"',
    targetKorean: '안녕하세요',
    acceptedAnswers: ['안녕하세요', '안녕'],
    hints: ['5 syllables', 'Starts with 안'],
  },
  {
    id: 'wp_t2',
    level: 'beginner',
    type: 'translation',
    prompt: 'Translate: "Thank you"',
    targetKorean: '감사합니다',
    acceptedAnswers: ['감사합니다', '고마워요', '고맙습니다'],
    hints: ['Formal version has 5 syllables'],
  },
  {
    id: 'wp_t3',
    level: 'beginner',
    type: 'translation',
    prompt: 'Translate: "I am a student"',
    targetKorean: '저는 학생이에요',
    acceptedAnswers: ['저는 학생이에요', '나는 학생이야', '저는 학생이에요.'],
    hints: ['저 = I', '학생 = student', 'Use 은/는 topic marker'],
  },
  {
    id: 'wp_t4',
    level: 'beginner',
    type: 'translation',
    prompt: 'Translate: "I eat rice"',
    targetKorean: '저는 밥을 먹어요',
    acceptedAnswers: ['저는 밥을 먹어요', '밥을 먹어요', '밥 먹어요'],
    hints: ['밥 = rice', '먹다 = to eat', 'SOV order: I + rice + eat'],
  },
  {
    id: 'wp_t5',
    level: 'beginner',
    type: 'translation',
    prompt: 'Translate: "I drink coffee"',
    targetKorean: '커피를 마셔요',
    acceptedAnswers: ['커피를 마셔요', '저는 커피를 마셔요'],
    hints: ['커피 = coffee', '마시다 = to drink', 'Use 를 object marker'],
  },
  {
    id: 'wp_t6',
    level: 'intermediate',
    type: 'translation',
    prompt: 'Translate: "I want to go to Korea"',
    targetKorean: '한국에 가고 싶어요',
    acceptedAnswers: ['한국에 가고 싶어요', '저는 한국에 가고 싶어요'],
    hints: ['한국 = Korea', '-고 싶다 = want to', '에 = direction particle'],
  },
  {
    id: 'wp_t7',
    level: 'intermediate',
    type: 'translation',
    prompt: 'Translate: "I studied at the library"',
    targetKorean: '도서관에서 공부했어요',
    acceptedAnswers: ['도서관에서 공부했어요', '저는 도서관에서 공부했어요'],
    hints: ['도서관 = library', '에서 = at (action location)', '했어요 = past tense of 하다'],
  },
  {
    id: 'wp_t8',
    level: 'intermediate',
    type: 'translation',
    prompt: 'Translate: "It\'s expensive but delicious"',
    targetKorean: '비싸지만 맛있어요',
    acceptedAnswers: ['비싸지만 맛있어요'],
    hints: ['비싸다 = expensive', '-지만 = but', '맛있다 = delicious'],
  },

  // ─── Particle Fill — Beginner ─────────────────────────────────────────────
  {
    id: 'wp_p1',
    level: 'beginner',
    type: 'particle_fill',
    prompt: 'Add the correct particles',
    sentenceWithBlanks: '저__ 학생이에요.',
    correctSentence: '저는 학생이에요.',
    hints: ['저 ends in vowel ㅓ', 'Topic marker: 은/는'],
  },
  {
    id: 'wp_p2',
    level: 'beginner',
    type: 'particle_fill',
    prompt: 'Add the correct particles',
    sentenceWithBlanks: '밥__ 먹어요.',
    correctSentence: '밥을 먹어요.',
    hints: ['밥 ends in consonant ㅂ', 'Object marker: 을/를'],
  },
  {
    id: 'wp_p3',
    level: 'beginner',
    type: 'particle_fill',
    prompt: 'Add the correct particles',
    sentenceWithBlanks: '비__ 와요.',
    correctSentence: '비가 와요.',
    hints: ['비 ends in vowel ㅣ', 'Subject marker: 이/가'],
  },
  {
    id: 'wp_p4',
    level: 'intermediate',
    type: 'particle_fill',
    prompt: 'Add the correct particles',
    sentenceWithBlanks: '학교__ 가요.',
    correctSentence: '학교에 가요.',
    hints: ['Direction/destination particle', '에 = to/at'],
  },
  {
    id: 'wp_p5',
    level: 'intermediate',
    type: 'particle_fill',
    prompt: 'Add the correct particles',
    sentenceWithBlanks: '도서관__ 공부해요.',
    correctSentence: '도서관에서 공부해요.',
    hints: ['Action at a location', '에서 = at (where action happens)'],
  },

  // ─── Free Write — Intermediate/Advanced ───────────────────────────────────
  {
    id: 'wp_f1',
    level: 'intermediate',
    type: 'free_write',
    prompt: 'Write about what you had for breakfast',
    promptKorean: '아침에 뭐 먹었어요?',
    hints: ['아침 = morning/breakfast', '먹었어요 = ate (past)', 'Try listing foods with -하고 (and)'],
    sampleAnswer: '아침에 빵하고 커피를 먹었어요. 맛있었어요.',
    sampleAnswerEnglish: 'I had bread and coffee for breakfast. It was delicious.',
  },
  {
    id: 'wp_f2',
    level: 'intermediate',
    type: 'free_write',
    prompt: 'Write about your favorite season',
    promptKorean: '좋아하는 계절이 뭐예요?',
    hints: ['봄/여름/가을/겨울 = spring/summer/fall/winter', '좋아해요 = like', '왜냐하면 = because'],
    sampleAnswer: '저는 가을을 좋아해요. 날씨가 시원하고 나뭇잎이 예뻐요.',
    sampleAnswerEnglish: 'I like fall. The weather is cool and the leaves are pretty.',
  },
  {
    id: 'wp_f3',
    level: 'intermediate',
    type: 'free_write',
    prompt: 'Introduce yourself',
    promptKorean: '자기소개를 해 주세요',
    hints: ['저는 ___이에요/예요', '___살이에요 = I am ___ years old', '-에서 왔어요 = came from'],
    sampleAnswer: '안녕하세요. 저는 [이름]이에요. 미국에서 왔어요. 한국어를 배우고 있어요.',
    sampleAnswerEnglish: 'Hello. I am [name]. I came from America. I am learning Korean.',
  },
  {
    id: 'wp_f4',
    level: 'advanced',
    type: 'free_write',
    prompt: 'Describe your daily routine',
    promptKorean: '하루 일과를 써 주세요',
    hints: ['시 = o\'clock', '-에 일어나요 = wake up at', '그리고/그 다음에 = then/after that'],
    sampleAnswer: '아침 7시에 일어나요. 샤워하고 아침을 먹어요. 9시에 회사에 가요.',
    sampleAnswerEnglish: 'I wake up at 7am. I shower and eat breakfast. I go to the office at 9.',
  },
];

export function getPromptsByLevel(level: WritingPrompt['level']): WritingPrompt[] {
  return writingPrompts.filter((p) => p.level === level);
}

export function getPromptsByType(type: WritingPrompt['type']): WritingPrompt[] {
  return writingPrompts.filter((p) => p.type === type);
}

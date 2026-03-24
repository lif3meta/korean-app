export interface GrammarSection {
  heading: string;
  explanation: string;
  pattern?: string;
  examples: { korean: string; english: string; romanization: string; breakdown?: { part: string; meaning: string }[] }[];
  tip?: string;
}

export interface GrammarLesson {
  id: string;
  title: string;
  titleKorean: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  order: number;
  description: string;
  sections: GrammarSection[];
}

export const grammarLessons: GrammarLesson[] = [
  {
    id: 'g_sov',
    title: 'Basic Sentence Structure',
    titleKorean: '기본 문장 구조',
    level: 'beginner',
    order: 1,
    description: 'Korean follows Subject-Object-Verb (SOV) order, unlike English (SVO).',
    sections: [
      {
        heading: 'Subject-Object-Verb Order',
        explanation: 'In Korean, the verb always comes at the end of the sentence. The basic pattern is: Subject + Object + Verb.',
        pattern: 'Subject + Object + Verb',
        examples: [
          { korean: '저는 밥을 먹어요.', english: 'I eat rice.', romanization: 'Jeoneun babeul meogeoyo.', breakdown: [{ part: '저는', meaning: 'I (topic)' }, { part: '밥을', meaning: 'rice (object)' }, { part: '먹어요', meaning: 'eat' }] },
          { korean: '저는 한국어를 공부해요.', english: 'I study Korean.', romanization: 'Jeoneun hangugeoreul gongbuhaeyo.', breakdown: [{ part: '저는', meaning: 'I (topic)' }, { part: '한국어를', meaning: 'Korean (object)' }, { part: '공부해요', meaning: 'study' }] },
        ],
        tip: 'Think of it as "I rice eat" instead of "I eat rice".',
      },
      {
        heading: 'Dropping the Subject',
        explanation: 'When the subject is obvious from context, Koreans often drop it entirely.',
        examples: [
          { korean: '밥 먹었어요?', english: 'Did (you) eat?', romanization: 'Bap meogeosseoyo?' },
          { korean: '괜찮아요.', english: '(I) am fine.', romanization: 'Gwaenchanayo.' },
        ],
        tip: 'In casual conversation, dropping the subject is very natural and common.',
      },
    ],
  },
  {
    id: 'g_topic',
    title: 'Topic Markers: 은/는',
    titleKorean: '은/는',
    level: 'beginner',
    order: 2,
    description: 'Topic markers indicate what the sentence is about.',
    sections: [
      {
        heading: 'How to Use 은/는',
        explanation: 'Use 은 after a consonant and 는 after a vowel. Topic markers set the topic or contrast things.',
        pattern: 'Noun + 은 (after consonant) / 는 (after vowel)',
        examples: [
          { korean: '저는 학생이에요.', english: 'I am a student.', romanization: 'Jeoneun haksaengieyo.', breakdown: [{ part: '저', meaning: 'I' }, { part: '는', meaning: 'topic marker' }, { part: '학생이에요', meaning: 'am a student' }] },
          { korean: '한국은 아름다워요.', english: 'Korea is beautiful.', romanization: 'Hangugeun areumdawoyo.' },
        ],
        tip: '은/는 is like saying "As for..." in English. "As for me, I am a student."',
      },
    ],
  },
  {
    id: 'g_subject',
    title: 'Subject Markers: 이/가',
    titleKorean: '이/가',
    level: 'beginner',
    order: 3,
    description: 'Subject markers identify who or what performs the action.',
    sections: [
      {
        heading: 'How to Use 이/가',
        explanation: 'Use 이 after a consonant and 가 after a vowel. Subject markers emphasize the subject or introduce new information.',
        pattern: 'Noun + 이 (after consonant) / 가 (after vowel)',
        examples: [
          { korean: '비가 와요.', english: 'It is raining. (Rain comes.)', romanization: 'Biga wayo.', breakdown: [{ part: '비', meaning: 'rain' }, { part: '가', meaning: 'subject marker' }, { part: '와요', meaning: 'comes' }] },
          { korean: '고양이가 귀여워요.', english: 'The cat is cute.', romanization: 'Goyangiga gwiyeowoyo.' },
        ],
        tip: 'Use 이/가 for new information or emphasis. Use 은/는 for known topics or contrast.',
      },
    ],
  },
  {
    id: 'g_object',
    title: 'Object Markers: 을/를',
    titleKorean: '을/를',
    level: 'beginner',
    order: 4,
    description: 'Object markers indicate the object that receives the action.',
    sections: [
      {
        heading: 'How to Use 을/를',
        explanation: 'Use 을 after a consonant and 를 after a vowel. Object markers come after the noun that receives the action.',
        pattern: 'Noun + 을 (after consonant) / 를 (after vowel)',
        examples: [
          { korean: '저는 커피를 마셔요.', english: 'I drink coffee.', romanization: 'Jeoneun keopireul masyeoyo.', breakdown: [{ part: '저는', meaning: 'I (topic)' }, { part: '커피를', meaning: 'coffee (object)' }, { part: '마셔요', meaning: 'drink' }] },
          { korean: '책을 읽어요.', english: '(I) read a book.', romanization: 'Chaegeul ilgeoyo.' },
        ],
      },
    ],
  },
  {
    id: 'g_present',
    title: 'Present Tense: -아/어요',
    titleKorean: '현재 시제',
    level: 'beginner',
    order: 5,
    description: 'The polite present tense ending used in everyday Korean.',
    sections: [
      {
        heading: 'Conjugation Rules',
        explanation: 'Remove 다 from the dictionary form. If the last vowel is ㅏ or ㅗ, add 아요. Otherwise, add 어요. Verbs ending in 하다 become 해요.',
        pattern: 'Verb stem + 아요/어요/해요',
        examples: [
          { korean: '가다 → 가요', english: 'go → goes', romanization: 'gada → gayo', breakdown: [{ part: '가', meaning: 'stem (last vowel ㅏ)' }, { part: '아요', meaning: '→ merged to 가요' }] },
          { korean: '먹다 → 먹어요', english: 'eat → eats', romanization: 'meokda → meogeoyo', breakdown: [{ part: '먹', meaning: 'stem (last vowel ㅓ)' }, { part: '어요', meaning: 'present ending' }] },
          { korean: '공부하다 → 공부해요', english: 'study → studies', romanization: 'gongbuhada → gongbuhaeyo' },
        ],
        tip: 'This is the most important conjugation pattern in Korean!',
      },
    ],
  },
  {
    id: 'g_past',
    title: 'Past Tense: -았/었어요',
    titleKorean: '과거 시제',
    level: 'beginner',
    order: 6,
    description: 'How to talk about things that already happened.',
    sections: [
      {
        heading: 'Past Tense Conjugation',
        explanation: 'Same vowel rules as present tense, but add 았/었 before 어요. For 하다 verbs, use 했어요.',
        pattern: 'Verb stem + 았어요/었어요/했어요',
        examples: [
          { korean: '가다 → 갔어요', english: 'went', romanization: 'gada → gasseoyo' },
          { korean: '먹다 → 먹었어요', english: 'ate', romanization: 'meokda → meogeosseoyo' },
          { korean: '공부하다 → 공부했어요', english: 'studied', romanization: 'gongbuhada → gongbuhaesseoyo' },
        ],
      },
    ],
  },
  {
    id: 'g_future',
    title: 'Future Tense: -(으)ㄹ 거예요',
    titleKorean: '미래 시제',
    level: 'intermediate',
    order: 7,
    description: 'Express plans and intentions for the future.',
    sections: [
      {
        heading: 'Future Tense Pattern',
        explanation: 'Add ㄹ 거예요 after a vowel stem, or 을 거예요 after a consonant stem.',
        pattern: 'Verb stem + (으)ㄹ 거예요',
        examples: [
          { korean: '가다 → 갈 거예요', english: 'will go', romanization: 'gada → gal geoyeyo' },
          { korean: '먹다 → 먹을 거예요', english: 'will eat', romanization: 'meokda → meogeul geoyeyo' },
          { korean: '내일 영화를 볼 거예요.', english: 'I will watch a movie tomorrow.', romanization: 'Naeil yeonghwareul bol geoyeyo.' },
        ],
      },
    ],
  },
  {
    id: 'g_negative',
    title: 'Negative Sentences',
    titleKorean: '부정문',
    level: 'beginner',
    order: 8,
    description: 'Two ways to make negative sentences in Korean.',
    sections: [
      {
        heading: 'Short Negation: 안',
        explanation: 'Place 안 before the verb. Simple and common in conversation.',
        pattern: '안 + Verb',
        examples: [
          { korean: '안 먹어요.', english: '(I) don\'t eat.', romanization: 'An meogeoyo.' },
          { korean: '안 좋아요.', english: '(It\'s) not good.', romanization: 'An joayo.' },
        ],
      },
      {
        heading: 'Long Negation: -지 않다',
        explanation: 'Add -지 않다 to the verb stem. More formal and emphatic.',
        pattern: 'Verb stem + 지 않아요',
        examples: [
          { korean: '먹지 않아요.', english: '(I) don\'t eat.', romanization: 'Meokji anayo.' },
          { korean: '좋지 않아요.', english: '(It\'s) not good.', romanization: 'Jochi anayo.' },
        ],
        tip: 'For 하다 verbs with 안: 공부 안 해요 (split the noun and 하다).',
      },
    ],
  },
  {
    id: 'g_want',
    title: 'Want To: -고 싶다',
    titleKorean: '-고 싶다',
    level: 'intermediate',
    order: 9,
    description: 'Express what you want to do.',
    sections: [
      {
        heading: 'Using -고 싶다',
        explanation: 'Add -고 싶다 to the verb stem to say "want to (do something)".',
        pattern: 'Verb stem + 고 싶어요',
        examples: [
          { korean: '한국에 가고 싶어요.', english: 'I want to go to Korea.', romanization: 'Hanguge gago sipeoyo.' },
          { korean: '김치를 먹고 싶어요.', english: 'I want to eat kimchi.', romanization: 'Gimchireul meokgo sipeoyo.' },
          { korean: '한국어를 배우고 싶어요.', english: 'I want to learn Korean.', romanization: 'Hangugeoreul baeugo sipeoyo.' },
        ],
      },
    ],
  },
  {
    id: 'g_connect',
    title: 'Connecting Sentences: -고, -지만',
    titleKorean: '접속사',
    level: 'intermediate',
    order: 10,
    description: 'Connect two clauses with "and" or "but".',
    sections: [
      {
        heading: 'And: -고',
        explanation: 'Add -고 to the verb stem to connect two actions or descriptions (and).',
        pattern: 'Verb stem + 고',
        examples: [
          { korean: '밥을 먹고 커피를 마셔요.', english: 'I eat rice and drink coffee.', romanization: 'Babeul meokgo keopireul masyeoyo.' },
        ],
      },
      {
        heading: 'But: -지만',
        explanation: 'Add -지만 to the verb stem to contrast two clauses (but).',
        pattern: 'Verb stem + 지만',
        examples: [
          { korean: '비싸지만 맛있어요.', english: 'It\'s expensive but delicious.', romanization: 'Bissajiman masisseoyo.' },
          { korean: '어렵지만 재미있어요.', english: 'It\'s difficult but fun.', romanization: 'Eoryeopjiman jaemiisseoyo.' },
        ],
      },
    ],
  },
  {
    id: 'g_location',
    title: 'Location Particles: 에, 에서',
    titleKorean: '에, 에서',
    level: 'intermediate',
    order: 11,
    description: 'Indicate location and direction.',
    sections: [
      {
        heading: '에 - Direction / Static Location',
        explanation: '에 marks the destination of movement or a static location (existence).',
        pattern: 'Place + 에 + movement verb / 있다',
        examples: [
          { korean: '학교에 가요.', english: 'I go to school.', romanization: 'Hakgyoe gayo.' },
          { korean: '집에 있어요.', english: 'I am at home.', romanization: 'Jibe isseoyo.' },
        ],
      },
      {
        heading: '에서 - Location of Action',
        explanation: '에서 marks where an action takes place.',
        pattern: 'Place + 에서 + action verb',
        examples: [
          { korean: '도서관에서 공부해요.', english: 'I study at the library.', romanization: 'Doseogwaneseo gongbuhaeyo.' },
          { korean: '카페에서 커피를 마셔요.', english: 'I drink coffee at the cafe.', romanization: 'Kapeeseo keopireul masyeoyo.' },
        ],
        tip: 'Use 에 for "to" or "at" (with 있다). Use 에서 for "at" (with action verbs).',
      },
    ],
  },
  {
    id: 'g_speech',
    title: 'Speech Levels',
    titleKorean: '존댓말과 반말',
    level: 'intermediate',
    order: 12,
    description: 'Korean has different speech levels based on formality and politeness.',
    sections: [
      {
        heading: 'The Three Main Levels',
        explanation: 'Korean has several speech levels. The three most important are: formal polite (-ㅂ니다/습니다), informal polite (-아/어요), and casual/intimate (-아/어).',
        examples: [
          { korean: '감사합니다', english: 'Thank you (formal polite)', romanization: 'gamsahamnida' },
          { korean: '고마워요', english: 'Thank you (informal polite)', romanization: 'gomawoyo' },
          { korean: '고마워', english: 'Thanks (casual)', romanization: 'gomawo' },
        ],
        tip: 'As a learner, use -아/어요 (informal polite) as your default. It works in almost all situations!',
      },
      {
        heading: 'When to Use Each Level',
        explanation: 'Formal polite: business, news, presentations, first meetings. Informal polite: everyday conversations, shops, restaurants. Casual: close friends of same age, younger people.',
        examples: [
          { korean: '먹습니다', english: 'eat (formal polite)', romanization: 'meokseumnida' },
          { korean: '먹어요', english: 'eat (informal polite)', romanization: 'meogeoyo' },
          { korean: '먹어', english: 'eat (casual)', romanization: 'meogeo' },
        ],
      },
    ],
  },
];

export function getGrammarById(id: string): GrammarLesson | undefined {
  return grammarLessons.find((g) => g.id === id);
}

export function getGrammarByLevel(level: GrammarLesson['level']): GrammarLesson[] {
  return grammarLessons.filter((g) => g.level === level).sort((a, b) => a.order - b.order);
}

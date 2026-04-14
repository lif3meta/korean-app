export interface PathStage {
  id: string;
  title: string;
  titleKorean: string;
  lessons: string[]; // lesson route IDs
  vocabFocus: string[]; // vocabulary category IDs
  description: string;
  unlockAfter?: string; // previous stage ID
}

export interface LearningPath {
  id: string;
  title: string;
  titleKorean: string;
  description: string;
  icon: string;
  gradient: readonly [string, string];
  stages: PathStage[];
}

export const learningPaths: LearningPath[] = [
  {
    id: 'kdrama',
    title: 'K-Drama Fan',
    titleKorean: '드라마 팬',
    description: 'Learn Korean through drama-style dialogue, informal speech, and emotional expressions',
    icon: 'tv',
    gradient: ['#ec4899', '#be185d'],
    stages: [
      {
        id: 'kdrama_1',
        title: 'The Basics',
        titleKorean: '기초',
        description: 'Learn Hangul and essential greetings',
        lessons: ['hangul', 'g_sov', 'g_topic'],
        vocabFocus: ['greetings', 'verbs'],
      },
      {
        id: 'kdrama_2',
        title: 'Everyday Talk',
        titleKorean: '일상 대화',
        description: 'Informal speech, emotions, and daily life',
        lessons: ['g_subject', 'g_present', 'g_speech'],
        vocabFocus: ['emotions', 'daily'],
        unlockAfter: 'kdrama_1',
      },
      {
        id: 'kdrama_3',
        title: 'Drama Dialogue',
        titleKorean: '드라마 대사',
        description: 'Connectors, slang, and reading manga stories',
        lessons: ['g_connect', 'g_want', 'slang'],
        vocabFocus: ['adjectives', 'emotions'],
        unlockAfter: 'kdrama_2',
      },
      {
        id: 'kdrama_4',
        title: 'Fluent Fan',
        titleKorean: '유창한 팬',
        description: 'Past/future tense, culture, and reading passages',
        lessons: ['g_past', 'g_future', 'cult_honorifics'],
        vocabFocus: ['family', 'time'],
        unlockAfter: 'kdrama_3',
      },
    ],
  },
  {
    id: 'kpop',
    title: 'K-Pop Enthusiast',
    titleKorean: 'K-팝 팬',
    description: 'Learn fan vocabulary, compliments, and social media Korean',
    icon: 'musical-notes',
    gradient: ['#8b5cf6', '#6d28d9'],
    stages: [
      {
        id: 'kpop_1',
        title: 'Fan Basics',
        titleKorean: '팬 기초',
        description: 'Hangul, greetings, and numbers for fan chants',
        lessons: ['hangul', 'g_sov', 'g_topic'],
        vocabFocus: ['greetings', 'numbers'],
      },
      {
        id: 'kpop_2',
        title: 'Express Yourself',
        titleKorean: '자기 표현',
        description: 'Adjectives, colors, and K-pop slang',
        lessons: ['g_subject', 'g_present', 'slang'],
        vocabFocus: ['adjectives', 'colors'],
        unlockAfter: 'kpop_1',
      },
      {
        id: 'kpop_3',
        title: 'Fan Culture',
        titleKorean: '팬 문화',
        description: 'Emotions, manga stories, and present tense',
        lessons: ['g_object', 'g_want', 'cult_age'],
        vocabFocus: ['emotions', 'daily'],
        unlockAfter: 'kpop_2',
      },
      {
        id: 'kpop_4',
        title: 'Idol Korean',
        titleKorean: '아이돌 한국어',
        description: 'Advanced expressions and culture',
        lessons: ['g_connect', 'g_speech', 'g_negative'],
        vocabFocus: ['verbs', 'time'],
        unlockAfter: 'kpop_3',
      },
    ],
  },
  {
    id: 'travel',
    title: 'Travel Ready',
    titleKorean: '여행 준비',
    description: 'Practical Korean for traveling — ordering food, directions, shopping',
    icon: 'airplane',
    gradient: ['#10b981', '#059669'],
    stages: [
      {
        id: 'travel_1',
        title: 'Survival Korean',
        titleKorean: '생존 한국어',
        description: 'Essential greetings, numbers, and food vocabulary',
        lessons: ['hangul', 'g_sov', 'g_topic'],
        vocabFocus: ['greetings', 'numbers', 'food'],
      },
      {
        id: 'travel_2',
        title: 'Getting Around',
        titleKorean: '이동하기',
        description: 'Places, daily life, and location particles',
        lessons: ['g_subject', 'g_object', 'g_location'],
        vocabFocus: ['places', 'daily'],
        unlockAfter: 'travel_1',
      },
      {
        id: 'travel_3',
        title: 'Ordering & Shopping',
        titleKorean: '주문 & 쇼핑',
        description: 'Food ordering, culture, and transport vocab',
        lessons: ['g_present', 'g_want', 'cult_food'],
        vocabFocus: ['food', 'objects'],
        unlockAfter: 'travel_2',
      },
      {
        id: 'travel_4',
        title: 'Confident Traveler',
        titleKorean: '자신감 있는 여행자',
        description: 'Formal speech, weather, and tenses',
        lessons: ['g_speech', 'g_past', 'g_future'],
        vocabFocus: ['weather', 'time'],
        unlockAfter: 'travel_3',
      },
    ],
  },
  {
    id: 'comprehensive',
    title: 'Master Mode',
    titleKorean: '마스터',
    description: 'The complete journey — master everything from Hangul to advanced grammar',
    icon: 'school',
    gradient: ['#f59e0b', '#d97706'],
    stages: [
      {
        id: 'comp_1',
        title: 'Foundation',
        titleKorean: '기초',
        description: 'Hangul, basic grammar, and essential vocab',
        lessons: ['hangul', 'g_sov', 'g_topic', 'g_subject', 'g_object'],
        vocabFocus: ['greetings', 'numbers', 'family'],
      },
      {
        id: 'comp_2',
        title: 'Building Blocks',
        titleKorean: '기본 다지기',
        description: 'Tenses, negation, and expanding vocabulary',
        lessons: ['g_present', 'g_past', 'g_negative'],
        vocabFocus: ['food', 'colors', 'time', 'verbs'],
        unlockAfter: 'comp_1',
      },
      {
        id: 'comp_3',
        title: 'Intermediate',
        titleKorean: '중급',
        description: 'Complex grammar, connectors, and culture',
        lessons: ['g_future', 'g_want', 'g_connect', 'g_location'],
        vocabFocus: ['places', 'adjectives', 'daily', 'emotions'],
        unlockAfter: 'comp_2',
      },
      {
        id: 'comp_4',
        title: 'Advanced',
        titleKorean: '고급',
        description: 'Speech levels, reading, and full immersion',
        lessons: ['g_speech', 'slang', 'cult_honorifics'],
        vocabFocus: ['body', 'weather', 'animals', 'objects'],
        unlockAfter: 'comp_3',
      },
    ],
  },
];

export function getPathById(id: string): LearningPath | undefined {
  return learningPaths.find((p) => p.id === id);
}

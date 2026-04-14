// Interactive grammar exercises mapped to each grammar lesson

export type GrammarExerciseType =
  | 'fill_blank'
  | 'sentence_build'
  | 'error_correction'
  | 'transform'
  | 'multiple_choice';

export interface GrammarExercise {
  id: string;
  lessonId: string;
  type: GrammarExerciseType;
  prompt: string;
  promptKorean?: string;
  // Fill blank
  sentence?: string;
  options?: string[];
  // Sentence build
  words?: string[];
  // All types
  correctAnswer: string;
  acceptedAnswers?: string[];
  // Error correction
  errorSentence?: string;
  correctedSentence?: string;
  // Transform
  transformFrom?: string;
  transformInstruction?: string;
  // Common
  hint?: string;
  explanation: string;
}

export const grammarExercises: GrammarExercise[] = [
  // ─── g_sov: Basic Sentence Structure (SOV) ────────────────────────────────

  {
    id: 'gex_sov_1',
    lessonId: 'g_sov',
    type: 'sentence_build',
    prompt: 'Arrange the words to say "I eat rice"',
    words: ['먹어요', '저는', '밥을'],
    correctAnswer: '저는 밥을 먹어요',
    acceptedAnswers: ['저는 밥을 먹어요'],
    explanation: 'Korean follows Subject-Object-Verb (SOV) order: 저는 (I) + 밥을 (rice) + 먹어요 (eat).',
  },
  {
    id: 'gex_sov_2',
    lessonId: 'g_sov',
    type: 'sentence_build',
    prompt: 'Arrange: "I study Korean"',
    words: ['공부해요', '한국어를', '저는'],
    correctAnswer: '저는 한국어를 공부해요',
    acceptedAnswers: ['저는 한국어를 공부해요'],
    explanation: 'SOV: 저는 (I) + 한국어를 (Korean) + 공부해요 (study).',
  },
  {
    id: 'gex_sov_3',
    lessonId: 'g_sov',
    type: 'multiple_choice',
    prompt: 'In Korean, where does the verb go?',
    options: ['Beginning', 'Middle', 'End', 'Anywhere'],
    correctAnswer: 'End',
    explanation: 'Korean is an SOV language — the verb always comes at the end of the sentence.',
  },
  {
    id: 'gex_sov_4',
    lessonId: 'g_sov',
    type: 'sentence_build',
    prompt: 'Arrange: "I drink coffee"',
    words: ['마셔요', '커피를', '저는'],
    correctAnswer: '저는 커피를 마셔요',
    acceptedAnswers: ['저는 커피를 마셔요'],
    explanation: 'SOV: 저는 (I) + 커피를 (coffee) + 마셔요 (drink).',
  },
  {
    id: 'gex_sov_5',
    lessonId: 'g_sov',
    type: 'sentence_build',
    prompt: 'Arrange: "I read a book"',
    words: ['읽어요', '책을', '저는'],
    correctAnswer: '저는 책을 읽어요',
    acceptedAnswers: ['저는 책을 읽어요'],
    explanation: 'SOV: 저는 (I) + 책을 (book) + 읽어요 (read).',
  },

  // ─── g_topic: Topic Markers 은/는 ─────────────────────────────────────────

  {
    id: 'gex_topic_1',
    lessonId: 'g_topic',
    type: 'fill_blank',
    prompt: 'Choose the correct topic marker',
    sentence: '저___ 학생이에요.',
    options: ['는', '은', '이', '가'],
    correctAnswer: '는',
    explanation: '저 ends in a vowel (ㅓ), so we use 는. 저는 = "As for me".',
  },
  {
    id: 'gex_topic_2',
    lessonId: 'g_topic',
    type: 'fill_blank',
    prompt: 'Choose the correct topic marker',
    sentence: '한국___ 아름다워요.',
    options: ['은', '는', '을', '를'],
    correctAnswer: '은',
    explanation: '한국 ends in a consonant (ㄱ), so we use 은. 한국은 = "As for Korea".',
  },
  {
    id: 'gex_topic_3',
    lessonId: 'g_topic',
    type: 'fill_blank',
    prompt: 'Choose the correct topic marker',
    sentence: '이거___ 뭐예요?',
    options: ['는', '은', '가', '를'],
    correctAnswer: '는',
    explanation: '이거 ends in a vowel (ㅓ), so we use 는. "As for this, what is it?"',
  },
  {
    id: 'gex_topic_4',
    lessonId: 'g_topic',
    type: 'multiple_choice',
    prompt: 'When do you use 은 instead of 는?',
    options: ['After a vowel', 'After a consonant', 'After a verb', 'Always'],
    correctAnswer: 'After a consonant',
    explanation: '은 follows consonants, 는 follows vowels. Both are topic markers.',
  },
  {
    id: 'gex_topic_5',
    lessonId: 'g_topic',
    type: 'fill_blank',
    prompt: 'Choose the correct topic marker',
    sentence: '오늘___ 날씨가 좋아요.',
    options: ['은', '는', '이', '을'],
    correctAnswer: '은',
    explanation: '오늘 ends in a consonant (ㄹ), so we use 은. "As for today, the weather is good."',
  },

  // ─── g_subject: Subject Markers 이/가 ─────────────────────────────────────

  {
    id: 'gex_subj_1',
    lessonId: 'g_subject',
    type: 'fill_blank',
    prompt: 'Choose the correct subject marker',
    sentence: '비___ 와요.',
    options: ['가', '이', '는', '를'],
    correctAnswer: '가',
    explanation: '비 ends in a vowel (ㅣ), so we use 가. "Rain comes" = It\'s raining.',
  },
  {
    id: 'gex_subj_2',
    lessonId: 'g_subject',
    type: 'fill_blank',
    prompt: 'Choose the correct subject marker',
    sentence: '고양이___ 귀여워요.',
    options: ['가', '이', '은', '를'],
    correctAnswer: '가',
    explanation: '고양이 ends in a vowel (ㅣ), so we use 가. "The cat is cute."',
  },
  {
    id: 'gex_subj_3',
    lessonId: 'g_subject',
    type: 'fill_blank',
    prompt: 'Choose the correct subject marker',
    sentence: '물___ 차가워요.',
    options: ['이', '가', '은', '를'],
    correctAnswer: '이',
    explanation: '물 ends in a consonant (ㄹ), so we use 이. "The water is cold."',
  },
  {
    id: 'gex_subj_4',
    lessonId: 'g_subject',
    type: 'multiple_choice',
    prompt: 'What\'s the difference between 은/는 and 이/가?',
    options: [
      '은/는 = topic, 이/가 = subject',
      'They are the same',
      '은/는 = object, 이/가 = topic',
      '은/는 = verb, 이/가 = adjective',
    ],
    correctAnswer: '은/는 = topic, 이/가 = subject',
    explanation: '은/는 marks the topic (known info/contrast). 이/가 marks the subject (new info/emphasis).',
  },
  {
    id: 'gex_subj_5',
    lessonId: 'g_subject',
    type: 'fill_blank',
    prompt: 'Choose the correct subject marker',
    sentence: '친구___ 왔어요.',
    options: ['가', '이', '는', '을'],
    correctAnswer: '가',
    explanation: '친구 ends in a vowel (ㅜ), so we use 가. "A friend came."',
  },

  // ─── g_object: Object Markers 을/를 ───────────────────────────────────────

  {
    id: 'gex_obj_1',
    lessonId: 'g_object',
    type: 'fill_blank',
    prompt: 'Choose the correct object marker',
    sentence: '저는 커피___ 마셔요.',
    options: ['를', '을', '는', '가'],
    correctAnswer: '를',
    explanation: '커피 ends in a vowel (ㅣ), so we use 를. "I drink coffee."',
  },
  {
    id: 'gex_obj_2',
    lessonId: 'g_object',
    type: 'fill_blank',
    prompt: 'Choose the correct object marker',
    sentence: '책___ 읽어요.',
    options: ['을', '를', '은', '이'],
    correctAnswer: '을',
    explanation: '책 ends in a consonant (ㄱ), so we use 을. "(I) read a book."',
  },
  {
    id: 'gex_obj_3',
    lessonId: 'g_object',
    type: 'fill_blank',
    prompt: 'Choose the correct object marker',
    sentence: '밥___ 먹어요.',
    options: ['을', '를', '은', '가'],
    correctAnswer: '을',
    explanation: '밥 ends in a consonant (ㅂ), so we use 을. "(I) eat rice."',
  },
  {
    id: 'gex_obj_4',
    lessonId: 'g_object',
    type: 'fill_blank',
    prompt: 'Choose the correct object marker',
    sentence: '음악___ 들어요.',
    options: ['을', '를', '이', '는'],
    correctAnswer: '을',
    explanation: '음악 ends in a consonant (ㄱ), so we use 을. "(I) listen to music."',
  },
  {
    id: 'gex_obj_5',
    lessonId: 'g_object',
    type: 'fill_blank',
    prompt: 'Choose the correct object marker',
    sentence: '영화___ 봐요.',
    options: ['를', '을', '는', '가'],
    correctAnswer: '를',
    explanation: '영화 ends in a vowel (ㅏ), so we use 를. "(I) watch a movie."',
  },

  // ─── g_present: Present Tense -아/어요 ────────────────────────────────────

  {
    id: 'gex_pres_1',
    lessonId: 'g_present',
    type: 'transform',
    prompt: 'Conjugate to present tense',
    transformFrom: '가다',
    transformInstruction: 'dictionary form → present polite',
    correctAnswer: '가요',
    acceptedAnswers: ['가요'],
    explanation: '가다: stem 가 (last vowel ㅏ) → 가 + 아요 → merges to 가요.',
  },
  {
    id: 'gex_pres_2',
    lessonId: 'g_present',
    type: 'transform',
    prompt: 'Conjugate to present tense',
    transformFrom: '먹다',
    transformInstruction: 'dictionary form → present polite',
    correctAnswer: '먹어요',
    acceptedAnswers: ['먹어요'],
    explanation: '먹다: stem 먹 (last vowel ㅓ) → 먹 + 어요 → 먹어요.',
  },
  {
    id: 'gex_pres_3',
    lessonId: 'g_present',
    type: 'transform',
    prompt: 'Conjugate to present tense',
    transformFrom: '공부하다',
    transformInstruction: 'dictionary form → present polite',
    correctAnswer: '공부해요',
    acceptedAnswers: ['공부해요'],
    explanation: '하다 verbs always become 해요 in present tense.',
  },
  {
    id: 'gex_pres_4',
    lessonId: 'g_present',
    type: 'transform',
    prompt: 'Conjugate to present tense',
    transformFrom: '오다',
    transformInstruction: 'dictionary form → present polite',
    correctAnswer: '와요',
    acceptedAnswers: ['와요'],
    explanation: '오다: stem 오 (last vowel ㅗ) → 오 + 아요 → merges to 와요.',
  },
  {
    id: 'gex_pres_5',
    lessonId: 'g_present',
    type: 'multiple_choice',
    prompt: 'Which rule applies to 하다 verbs?',
    options: ['Add 아요', 'Add 어요', 'Change to 해요', 'Add 습니다'],
    correctAnswer: 'Change to 해요',
    explanation: 'All 하다 verbs → 해요 in present polite tense. 공부하다 → 공부해요.',
  },

  // ─── g_past: Past Tense -았/었어요 ────────────────────────────────────────

  {
    id: 'gex_past_1',
    lessonId: 'g_past',
    type: 'transform',
    prompt: 'Conjugate to past tense',
    transformFrom: '가다',
    transformInstruction: 'dictionary form → past polite',
    correctAnswer: '갔어요',
    acceptedAnswers: ['갔어요'],
    explanation: '가다: stem 가 (ㅏ vowel) → 가 + 았어요 → merges to 갔어요.',
  },
  {
    id: 'gex_past_2',
    lessonId: 'g_past',
    type: 'transform',
    prompt: 'Conjugate to past tense',
    transformFrom: '먹다',
    transformInstruction: 'dictionary form → past polite',
    correctAnswer: '먹었어요',
    acceptedAnswers: ['먹었어요'],
    explanation: '먹다: stem 먹 (ㅓ vowel) → 먹 + 었어요 → 먹었어요.',
  },
  {
    id: 'gex_past_3',
    lessonId: 'g_past',
    type: 'transform',
    prompt: 'Conjugate to past tense',
    transformFrom: '공부하다',
    transformInstruction: 'dictionary form → past polite',
    correctAnswer: '공부했어요',
    acceptedAnswers: ['공부했어요'],
    explanation: '하다 verbs → 했어요 in past tense.',
  },
  {
    id: 'gex_past_4',
    lessonId: 'g_past',
    type: 'transform',
    prompt: 'Conjugate to past tense',
    transformFrom: '오다',
    transformInstruction: 'dictionary form → past polite',
    correctAnswer: '왔어요',
    acceptedAnswers: ['왔어요'],
    explanation: '오다: stem 오 (ㅗ vowel) → 오 + 았어요 → merges to 왔어요.',
  },
  {
    id: 'gex_past_5',
    lessonId: 'g_past',
    type: 'multiple_choice',
    prompt: 'What is the past tense of 마시다 (to drink)?',
    options: ['마셨어요', '마시어요', '마셔요', '마십니다'],
    correctAnswer: '마셨어요',
    explanation: '마시다: stem 마시 (ㅣ vowel) → 마시 + 었어요 → merges to 마셨어요.',
  },

  // ─── g_future: Future Tense -(으)ㄹ 거예요 ────────────────────────────────

  {
    id: 'gex_fut_1',
    lessonId: 'g_future',
    type: 'transform',
    prompt: 'Conjugate to future tense',
    transformFrom: '가다',
    transformInstruction: 'dictionary form → future polite',
    correctAnswer: '갈 거예요',
    acceptedAnswers: ['갈 거예요', '갈거예요'],
    explanation: '가다: stem 가 (vowel) → 가 + ㄹ 거예요 → 갈 거예요.',
  },
  {
    id: 'gex_fut_2',
    lessonId: 'g_future',
    type: 'transform',
    prompt: 'Conjugate to future tense',
    transformFrom: '먹다',
    transformInstruction: 'dictionary form → future polite',
    correctAnswer: '먹을 거예요',
    acceptedAnswers: ['먹을 거예요', '먹을거예요'],
    explanation: '먹다: stem 먹 (consonant) → 먹 + 을 거예요 → 먹을 거예요.',
  },
  {
    id: 'gex_fut_3',
    lessonId: 'g_future',
    type: 'transform',
    prompt: 'Conjugate to future tense',
    transformFrom: '보다',
    transformInstruction: 'dictionary form → future polite',
    correctAnswer: '볼 거예요',
    acceptedAnswers: ['볼 거예요', '볼거예요'],
    explanation: '보다: stem 보 (vowel) → 보 + ㄹ 거예요 → 볼 거예요.',
  },
  {
    id: 'gex_fut_4',
    lessonId: 'g_future',
    type: 'multiple_choice',
    prompt: 'After a consonant stem, which future ending is correct?',
    options: ['ㄹ 거예요', '을 거예요', '아 거예요', '는 거예요'],
    correctAnswer: '을 거예요',
    explanation: 'After consonant: 을 거예요. After vowel: ㄹ 거예요.',
  },
  {
    id: 'gex_fut_5',
    lessonId: 'g_future',
    type: 'sentence_build',
    prompt: 'Arrange: "I will watch a movie tomorrow"',
    words: ['볼 거예요', '내일', '영화를'],
    correctAnswer: '내일 영화를 볼 거예요',
    acceptedAnswers: ['내일 영화를 볼 거예요'],
    explanation: 'Time expressions go at the beginning: 내일 (tomorrow) + 영화를 (movie) + 볼 거예요 (will watch).',
  },

  // ─── g_negative: Negative Sentences ───────────────────────────────────────

  {
    id: 'gex_neg_1',
    lessonId: 'g_negative',
    type: 'error_correction',
    prompt: 'Find and fix the error',
    errorSentence: '먹어요 안.',
    correctedSentence: '안 먹어요.',
    correctAnswer: '안 먹어요.',
    explanation: '안 goes BEFORE the verb: 안 먹어요 (don\'t eat), not after.',
  },
  {
    id: 'gex_neg_2',
    lessonId: 'g_negative',
    type: 'multiple_choice',
    prompt: 'How do you say "I don\'t go" using short negation?',
    options: ['안 가요', '가 안요', '가지 않아요', '않 가요'],
    correctAnswer: '안 가요',
    explanation: 'Short negation: 안 + verb → 안 가요.',
  },
  {
    id: 'gex_neg_3',
    lessonId: 'g_negative',
    type: 'transform',
    prompt: 'Make this negative using -지 않다',
    transformFrom: '좋아요',
    transformInstruction: 'positive → long negation',
    correctAnswer: '좋지 않아요',
    acceptedAnswers: ['좋지 않아요'],
    explanation: 'Long negation: stem + 지 않아요 → 좋지 않아요 (not good).',
  },
  {
    id: 'gex_neg_4',
    lessonId: 'g_negative',
    type: 'fill_blank',
    prompt: 'Complete the negative sentence',
    sentence: '저는 커피를 ___ 마셔요.',
    options: ['안', '않', '지', '못'],
    correctAnswer: '안',
    explanation: 'Short negation: 안 before the verb. 안 마셔요 = "don\'t drink".',
  },
  {
    id: 'gex_neg_5',
    lessonId: 'g_negative',
    type: 'error_correction',
    prompt: 'Find and fix the error',
    errorSentence: '공부 않 해요.',
    correctedSentence: '공부 안 해요.',
    correctAnswer: '공부 안 해요.',
    explanation: 'For 하다 verbs with short negation: noun + 안 + 해요. 않 is for long negation (-지 않다).',
  },

  // ─── g_want: Want To -고 싶다 ─────────────────────────────────────────────

  {
    id: 'gex_want_1',
    lessonId: 'g_want',
    type: 'sentence_build',
    prompt: 'Arrange: "I want to go to Korea"',
    words: ['싶어요', '한국에', '가고'],
    correctAnswer: '한국에 가고 싶어요',
    acceptedAnswers: ['한국에 가고 싶어요'],
    explanation: 'Place + verb stem + 고 싶어요: 한국에 가고 싶어요.',
  },
  {
    id: 'gex_want_2',
    lessonId: 'g_want',
    type: 'transform',
    prompt: 'Express "want to" with this verb',
    transformFrom: '먹다',
    transformInstruction: 'dictionary form → "want to eat"',
    correctAnswer: '먹고 싶어요',
    acceptedAnswers: ['먹고 싶어요'],
    explanation: 'Verb stem + 고 싶어요: 먹 + 고 싶어요 → 먹고 싶어요.',
  },
  {
    id: 'gex_want_3',
    lessonId: 'g_want',
    type: 'sentence_build',
    prompt: 'Arrange: "I want to learn Korean"',
    words: ['싶어요', '배우고', '한국어를'],
    correctAnswer: '한국어를 배우고 싶어요',
    acceptedAnswers: ['한국어를 배우고 싶어요'],
    explanation: 'Object + verb stem + 고 싶어요: 한국어를 배우고 싶어요.',
  },
  {
    id: 'gex_want_4',
    lessonId: 'g_want',
    type: 'transform',
    prompt: 'Express "want to" with this verb',
    transformFrom: '보다',
    transformInstruction: 'dictionary form → "want to see"',
    correctAnswer: '보고 싶어요',
    acceptedAnswers: ['보고 싶어요'],
    explanation: 'Verb stem + 고 싶어요: 보 + 고 싶어요 → 보고 싶어요.',
  },
  {
    id: 'gex_want_5',
    lessonId: 'g_want',
    type: 'multiple_choice',
    prompt: 'Which pattern means "want to do"?',
    options: ['verb + 고 싶어요', 'verb + 지 않아요', 'verb + 을 거예요', 'verb + 아/어요'],
    correctAnswer: 'verb + 고 싶어요',
    explanation: '-고 싶다 attached to the verb stem expresses desire. 먹고 싶어요 = "I want to eat".',
  },

  // ─── g_connect: Connecting Sentences -고, -지만 ───────────────────────────

  {
    id: 'gex_conn_1',
    lessonId: 'g_connect',
    type: 'fill_blank',
    prompt: 'Choose the correct connector: "I eat rice AND drink coffee"',
    sentence: '밥을 먹___ 커피를 마셔요.',
    options: ['고', '지만', '서', '면'],
    correctAnswer: '고',
    explanation: '-고 connects two actions (and): 먹고 = "eat and".',
  },
  {
    id: 'gex_conn_2',
    lessonId: 'g_connect',
    type: 'fill_blank',
    prompt: 'Choose the correct connector: "It\'s expensive BUT delicious"',
    sentence: '비싸___ 맛있어요.',
    options: ['지만', '고', '서', '면'],
    correctAnswer: '지만',
    explanation: '-지만 contrasts two clauses (but): 비싸지만 = "expensive but".',
  },
  {
    id: 'gex_conn_3',
    lessonId: 'g_connect',
    type: 'sentence_build',
    prompt: 'Arrange: "It\'s difficult but fun"',
    words: ['재미있어요', '어렵지만'],
    correctAnswer: '어렵지만 재미있어요',
    acceptedAnswers: ['어렵지만 재미있어요'],
    explanation: 'Clause1 + 지만 + Clause2: 어렵지만 (difficult but) 재미있어요 (fun).',
  },
  {
    id: 'gex_conn_4',
    lessonId: 'g_connect',
    type: 'fill_blank',
    prompt: 'Choose the connector: "I went to school AND studied"',
    sentence: '학교에 가___ 공부했어요.',
    options: ['고', '지만', '서', '는데'],
    correctAnswer: '고',
    explanation: '-고 for sequential actions: 가고 공부했어요 = "went and studied".',
  },
  {
    id: 'gex_conn_5',
    lessonId: 'g_connect',
    type: 'multiple_choice',
    prompt: 'Which connector means "but"?',
    options: ['-지만', '-고', '-서', '-면'],
    correctAnswer: '-지만',
    explanation: '-지만 = but/however. -고 = and. -서 = because/so. -면 = if.',
  },

  // ─── g_location: Location Particles 에, 에서 ──────────────────────────────

  {
    id: 'gex_loc_1',
    lessonId: 'g_location',
    type: 'fill_blank',
    prompt: 'Choose the correct particle: "I go TO school"',
    sentence: '학교___ 가요.',
    options: ['에', '에서', '을', '는'],
    correctAnswer: '에',
    explanation: '에 marks direction/destination: 학교에 가요 = "go to school".',
  },
  {
    id: 'gex_loc_2',
    lessonId: 'g_location',
    type: 'fill_blank',
    prompt: 'Choose the correct particle: "I study AT the library"',
    sentence: '도서관___ 공부해요.',
    options: ['에서', '에', '을', '는'],
    correctAnswer: '에서',
    explanation: '에서 marks where an action takes place: 도서관에서 = "at the library (doing something)".',
  },
  {
    id: 'gex_loc_3',
    lessonId: 'g_location',
    type: 'fill_blank',
    prompt: 'Choose the correct particle: "I am AT home"',
    sentence: '집___ 있어요.',
    options: ['에', '에서', '을', '는'],
    correctAnswer: '에',
    explanation: '에 with 있다 (existence): 집에 있어요 = "I am at home" (static location).',
  },
  {
    id: 'gex_loc_4',
    lessonId: 'g_location',
    type: 'error_correction',
    prompt: 'Find and fix the error',
    errorSentence: '카페에 커피를 마셔요.',
    correctedSentence: '카페에서 커피를 마셔요.',
    correctAnswer: '카페에서 커피를 마셔요.',
    explanation: 'Drinking is an action → use 에서, not 에. 에서 = where action happens.',
  },
  {
    id: 'gex_loc_5',
    lessonId: 'g_location',
    type: 'multiple_choice',
    prompt: 'When do you use 에서 instead of 에?',
    options: [
      'When an action happens at the location',
      'When going to a place',
      'When something exists there',
      'After vowels only',
    ],
    correctAnswer: 'When an action happens at the location',
    explanation: '에서 = action location (study at, eat at). 에 = direction (go to) or existence (be at with 있다).',
  },

  // ─── g_speech: Speech Levels ──────────────────────────────────────────────

  {
    id: 'gex_speech_1',
    lessonId: 'g_speech',
    type: 'transform',
    prompt: 'Convert to casual speech',
    transformFrom: '먹어요',
    transformInstruction: 'informal polite → casual',
    correctAnswer: '먹어',
    acceptedAnswers: ['먹어'],
    explanation: 'Remove 요 from -어요/아요 ending: 먹어요 → 먹어.',
  },
  {
    id: 'gex_speech_2',
    lessonId: 'g_speech',
    type: 'transform',
    prompt: 'Convert to formal polite speech',
    transformFrom: '먹어요',
    transformInstruction: 'informal polite → formal polite',
    correctAnswer: '먹습니다',
    acceptedAnswers: ['먹습니다'],
    explanation: 'Formal polite: consonant stem + 습니다: 먹 + 습니다 → 먹습니다.',
  },
  {
    id: 'gex_speech_3',
    lessonId: 'g_speech',
    type: 'multiple_choice',
    prompt: 'Which speech level should a learner use by default?',
    options: ['Casual (반말)', 'Informal polite (-아/어요)', 'Formal polite (-ㅂ니다)', 'Honorific'],
    correctAnswer: 'Informal polite (-아/어요)',
    explanation: '-아/어요 (informal polite) is safe for almost all situations as a learner.',
  },
  {
    id: 'gex_speech_4',
    lessonId: 'g_speech',
    type: 'transform',
    prompt: 'Convert to casual speech',
    transformFrom: '가요',
    transformInstruction: 'informal polite → casual',
    correctAnswer: '가',
    acceptedAnswers: ['가'],
    explanation: 'Remove 요: 가요 → 가.',
  },
  {
    id: 'gex_speech_5',
    lessonId: 'g_speech',
    type: 'multiple_choice',
    prompt: 'When would you use 감사합니다 instead of 고마워요?',
    options: [
      'Business meetings and formal situations',
      'With close friends',
      'With younger people',
      'Never — they\'re the same',
    ],
    correctAnswer: 'Business meetings and formal situations',
    explanation: '감사합니다 is formal polite, used in business, presentations, and with strangers. 고마워요 is informal polite, used in everyday conversations.',
  },
];

// ─── Utility functions ──────────────────────────────────────────────────────

export function getExercisesForLesson(lessonId: string): GrammarExercise[] {
  return grammarExercises.filter((e) => e.lessonId === lessonId);
}

export function getExerciseById(id: string): GrammarExercise | undefined {
  return grammarExercises.find((e) => e.id === id);
}

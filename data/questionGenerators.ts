import { QuizQuestion, MultipleChoiceQuestion, FillInBlankQuestion, MatchingQuestion } from './quizzes';
import { vocabulary, VocabWord } from './vocabulary';
import { consonants, vowels, doubleConsonants, compoundVowels, HangulCharacter, getHangulAudioText } from './hangul';
import { grammarLessons } from './grammar';
import { sentences } from './sentences';
import { shuffleArray } from '@/lib/utils';

const allHangul = [...consonants, ...vowels, ...doubleConsonants, ...compoundVowels];

function pickRandom<T>(arr: T[], count: number, exclude?: T[]): T[] {
  const filtered = exclude ? arr.filter((x) => !exclude.includes(x)) : arr;
  return shuffleArray(filtered).slice(0, count);
}

// ─── Vocab: "What does X mean?" ──────────────────────────────────────────────

function generateVocabMeaning(words: VocabWord[], count: number): MultipleChoiceQuestion[] {
  const pool = shuffleArray(words).slice(0, count);
  return pool.map((word, i) => {
    const wrongs = pickRandom(words, 3, [word]).map((w) => w.english);
    const options = shuffleArray([word.english, ...wrongs]);
    return {
      type: 'multiple_choice' as const,
      id: `gen_vm_${word.id}_${i}`,
      question: `What does "${word.korean}" mean?`,
      questionKorean: word.korean,
      options,
      correctIndex: options.indexOf(word.english),
      category: 'vocab' as const,
      level: word.level === 'advanced' ? 'intermediate' as const : word.level as 'beginner' | 'intermediate',
      xpReward: 15,
    };
  });
}

// ─── Vocab: "How do you say X in Korean?" ────────────────────────────────────

function generateVocabTranslate(words: VocabWord[], count: number): MultipleChoiceQuestion[] {
  const pool = shuffleArray(words).slice(0, count);
  return pool.map((word, i) => {
    const wrongs = pickRandom(words, 3, [word]).map((w) => w.korean);
    const options = shuffleArray([word.korean, ...wrongs]);
    return {
      type: 'multiple_choice' as const,
      id: `gen_vt_${word.id}_${i}`,
      question: `How do you say "${word.english}" in Korean?`,
      options,
      correctIndex: options.indexOf(word.korean),
      category: 'vocab' as const,
      level: word.level === 'advanced' ? 'intermediate' as const : word.level as 'beginner' | 'intermediate',
      xpReward: 15,
    };
  });
}

// ─── Vocab: Fill in the blank ────────────────────────────────────────────────

function generateVocabFillBlank(words: VocabWord[], count: number): FillInBlankQuestion[] {
  const withExamples = words.filter((w) => w.example);
  const pool = shuffleArray(withExamples).slice(0, count);
  return pool.map((word, i) => ({
    type: 'fill_in_blank' as const,
    id: `gen_vfb_${word.id}_${i}`,
    sentence: `The Korean word for "${word.english}" is ___`,
    correctAnswer: word.korean,
    acceptedAnswers: [word.korean],
    hint: word.romanization,
    category: 'vocab' as const,
    level: word.level === 'advanced' ? 'intermediate' as const : word.level as 'beginner' | 'intermediate',
    xpReward: 20,
  }));
}

// ─── Vocab: Matching pairs ───────────────────────────────────────────────────

function generateVocabMatching(words: VocabWord[], count: number): MatchingQuestion[] {
  const results: MatchingQuestion[] = [];
  const pool = shuffleArray(words);
  for (let i = 0; i < count && i * 4 < pool.length; i++) {
    const batch = pool.slice(i * 4, i * 4 + 4);
    if (batch.length < 4) break;
    results.push({
      type: 'matching' as const,
      id: `gen_vmatch_${i}`,
      instruction: 'Match the Korean word to its English meaning',
      pairs: batch.map((w) => ({ left: w.korean, right: w.english })),
      category: 'vocab' as const,
      level: 'beginner' as const,
      xpReward: 20,
    });
  }
  return results;
}

// ─── Hangul: "What sound does X make?" ───────────────────────────────────────

function generateHangulSound(count: number): MultipleChoiceQuestion[] {
  const pool = shuffleArray(allHangul).slice(0, count);
  return pool.map((char, i) => {
    const wrongs = pickRandom(allHangul, 3, [char]).map((c) => c.romanization);
    const correctSound = char.romanization;
    const options = shuffleArray([correctSound, ...wrongs]);
    return {
      type: 'multiple_choice' as const,
      id: `gen_hs_${char.id}_${i}`,
      question: `What sound does ${char.character} make?`,
      options,
      correctIndex: options.indexOf(correctSound),
      explanation: `${char.character} (${char.sound}) — ${char.pronunciation}`,
      category: 'hangul' as const,
      level: 'beginner' as const,
      xpReward: 10,
    };
  });
}

// ─── Hangul: "Which character makes X sound?" ────────────────────────────────

function generateHangulIdentify(count: number): MultipleChoiceQuestion[] {
  const pool = shuffleArray(allHangul).slice(0, count);
  return pool.map((char, i) => {
    const wrongs = pickRandom(allHangul, 3, [char]).map((c) => c.character);
    const options = shuffleArray([char.character, ...wrongs]);
    return {
      type: 'multiple_choice' as const,
      id: `gen_hi_${char.id}_${i}`,
      question: `Which character makes the "${char.romanization}" sound?`,
      options,
      correctIndex: options.indexOf(char.character),
      explanation: `${char.character} (${char.romanization}) — ${char.pronunciation}`,
      category: 'hangul' as const,
      level: 'beginner' as const,
      xpReward: 10,
    };
  });
}

// ─── Hangul: Matching ────────────────────────────────────────────────────────

function generateHangulMatching(count: number): MatchingQuestion[] {
  const results: MatchingQuestion[] = [];
  const pool = shuffleArray(allHangul);
  for (let i = 0; i < count && i * 4 < pool.length; i++) {
    const batch = pool.slice(i * 4, i * 4 + 4);
    if (batch.length < 4) break;
    results.push({
      type: 'matching' as const,
      id: `gen_hmatch_${i}`,
      instruction: 'Match the character to its sound',
      pairs: batch.map((c) => ({ left: c.character, right: c.romanization })),
      category: 'hangul' as const,
      level: 'beginner' as const,
      xpReward: 20,
    });
  }
  return results;
}

// ─── Vocab: "Which word does NOT belong?" ────────────────────────────────────

function generateOddOneOut(words: VocabWord[], count: number): MultipleChoiceQuestion[] {
  const categories = [...new Set(words.map((w) => w.category))];
  const results: MultipleChoiceQuestion[] = [];

  for (let i = 0; i < count && i < categories.length; i++) {
    const cat = categories[i];
    const catWords = words.filter((w) => w.category === cat);
    if (catWords.length < 3) continue;
    const correct3 = shuffleArray(catWords).slice(0, 3);
    const otherCats = words.filter((w) => w.category !== cat);
    if (otherCats.length === 0) continue;
    const oddWord = shuffleArray(otherCats)[0];
    const options = shuffleArray([...correct3.map((w) => w.korean), oddWord.korean]);
    results.push({
      type: 'multiple_choice' as const,
      id: `gen_odd_${i}`,
      question: `Which word does NOT belong with the others?`,
      options,
      correctIndex: options.indexOf(oddWord.korean),
      explanation: `${oddWord.korean} (${oddWord.english}) is from the "${oddWord.category}" category, while the others are "${cat}".`,
      category: 'vocab' as const,
      level: 'intermediate' as const,
      xpReward: 15,
    });
  }
  return results;
}

// ─── Grammar: Particle choice ───────────────────────────────────────────────

const PARTICLE_QUESTIONS: { sentence: string; answer: string; options: string[]; explanation: string }[] = [
  { sentence: '저___ 학생이에요.', answer: '는', options: ['는', '은', '이', '를'], explanation: '저 ends in a vowel → 는 (topic marker).' },
  { sentence: '한국___ 좋아요.', answer: '은', options: ['은', '는', '가', '을'], explanation: '한국 ends in consonant → 은 (topic marker).' },
  { sentence: '비___ 와요.', answer: '가', options: ['가', '이', '는', '를'], explanation: '비 ends in vowel → 가 (subject marker).' },
  { sentence: '책___ 읽어요.', answer: '을', options: ['을', '를', '은', '이'], explanation: '책 ends in consonant → 을 (object marker).' },
  { sentence: '커피___ 마셔요.', answer: '를', options: ['를', '을', '는', '가'], explanation: '커피 ends in vowel → 를 (object marker).' },
  { sentence: '물___ 차가워요.', answer: '이', options: ['이', '가', '은', '를'], explanation: '물 ends in consonant → 이 (subject marker).' },
  { sentence: '영화___ 봐요.', answer: '를', options: ['를', '을', '는', '가'], explanation: '영화 ends in vowel → 를 (object marker).' },
  { sentence: '오늘___ 좋은 날이에요.', answer: '은', options: ['은', '는', '이', '을'], explanation: '오늘 ends in consonant → 은 (topic marker).' },
  { sentence: '고양이___ 귀여워요.', answer: '가', options: ['가', '이', '은', '를'], explanation: '고양이 ends in vowel → 가 (subject marker).' },
  { sentence: '음악___ 들어요.', answer: '을', options: ['을', '를', '이', '는'], explanation: '음악 ends in consonant → 을 (object marker).' },
];

function generateParticleChoice(count: number): MultipleChoiceQuestion[] {
  const pool = shuffleArray(PARTICLE_QUESTIONS).slice(0, count);
  return pool.map((q, i) => {
    const options = shuffleArray(q.options);
    return {
      type: 'multiple_choice' as const,
      id: `gen_pc_${i}`,
      question: `Fill in: ${q.sentence}`,
      options,
      correctIndex: options.indexOf(q.answer),
      explanation: q.explanation,
      category: 'grammar' as const,
      level: 'beginner' as const,
      xpReward: 15,
    };
  });
}

// ─── Grammar: Conjugation ───────────────────────────────────────────────────

const CONJUGATION_DATA: { verb: string; present: string; past: string; future: string; english: string }[] = [
  { verb: '가다', present: '가요', past: '갔어요', future: '갈 거예요', english: 'to go' },
  { verb: '먹다', present: '먹어요', past: '먹었어요', future: '먹을 거예요', english: 'to eat' },
  { verb: '마시다', present: '마셔요', past: '마셨어요', future: '마실 거예요', english: 'to drink' },
  { verb: '공부하다', present: '공부해요', past: '공부했어요', future: '공부할 거예요', english: 'to study' },
  { verb: '보다', present: '봐요', past: '봤어요', future: '볼 거예요', english: 'to see' },
  { verb: '오다', present: '와요', past: '왔어요', future: '올 거예요', english: 'to come' },
  { verb: '읽다', present: '읽어요', past: '읽었어요', future: '읽을 거예요', english: 'to read' },
  { verb: '쓰다', present: '써요', past: '썼어요', future: '쓸 거예요', english: 'to write' },
];

function generateConjugation(count: number): MultipleChoiceQuestion[] {
  const tenses = ['present', 'past', 'future'] as const;
  const results: MultipleChoiceQuestion[] = [];
  const pool = shuffleArray(CONJUGATION_DATA).slice(0, count);

  pool.forEach((item, i) => {
    const tense = tenses[i % tenses.length];
    const correct = item[tense];
    const wrongForms = CONJUGATION_DATA.filter((d) => d.verb !== item.verb)
      .map((d) => d[tense])
      .slice(0, 3);
    const options = shuffleArray([correct, ...shuffleArray(wrongForms).slice(0, 3)]);

    results.push({
      type: 'multiple_choice' as const,
      id: `gen_conj_${i}`,
      question: `What is the ${tense} tense of ${item.verb} (${item.english})?`,
      options,
      correctIndex: options.indexOf(correct),
      explanation: `${item.verb} → ${correct} (${tense} polite)`,
      category: 'grammar' as const,
      level: tense === 'future' ? 'intermediate' as const : 'beginner' as const,
      xpReward: 15,
    });
  });

  return results;
}

// ─── Grammar: Sentence order ────────────────────────────────────────────────

function generateSentenceOrder(count: number): MultipleChoiceQuestion[] {
  const sentPool = sentences.filter((s) => s.level <= 3 && s.breakdown.length >= 2);
  const pool = shuffleArray(sentPool).slice(0, count);

  return pool.map((sent, i) => {
    const correct = sent.korean;
    const wrongOptions = shuffleArray(sentPool)
      .filter((s) => s.korean !== correct)
      .slice(0, 3)
      .map((s) => s.korean);
    const options = shuffleArray([correct, ...wrongOptions]);

    return {
      type: 'multiple_choice' as const,
      id: `gen_so_${i}`,
      question: `Which is the correct Korean for: "${sent.english}"?`,
      options,
      correctIndex: options.indexOf(correct),
      explanation: `${correct} — ${sent.english}`,
      category: 'grammar' as const,
      level: 'beginner' as const,
      xpReward: 15,
    };
  });
}

// ─── Vocab: Context sentence ────────────────────────────────────────────────

function generateContextSentence(words: VocabWord[], count: number): MultipleChoiceQuestion[] {
  const withExamples = words.filter((w) => w.example);
  const pool = shuffleArray(withExamples).slice(0, count);

  return pool.map((word, i) => {
    const wrongs = pickRandom(words, 3, [word]).map((w) => w.korean);
    const options = shuffleArray([word.korean, ...wrongs]);
    return {
      type: 'multiple_choice' as const,
      id: `gen_ctx_${word.id}_${i}`,
      question: `Complete: "${word.example!.english}" → ${word.example!.korean.replace(word.korean, '___')}`,
      questionKorean: word.example!.korean,
      options,
      correctIndex: options.indexOf(word.korean),
      category: 'vocab' as const,
      level: word.level === 'advanced' ? 'intermediate' as const : word.level as 'beginner' | 'intermediate',
      xpReward: 15,
    };
  });
}

// ─── Vocab: Category sort ───────────────────────────────────────────────────

function generateCategorySort(words: VocabWord[], count: number): MultipleChoiceQuestion[] {
  const results: MultipleChoiceQuestion[] = [];
  const pool = shuffleArray(words).slice(0, count);

  pool.forEach((word, i) => {
    const correctCat = word.category;
    const allCats = [...new Set(words.map((w) => w.category))];
    const wrongCats = shuffleArray(allCats.filter((c) => c !== correctCat)).slice(0, 3);
    const options = shuffleArray([correctCat, ...wrongCats]);

    results.push({
      type: 'multiple_choice' as const,
      id: `gen_csort_${i}`,
      question: `Which category does "${word.korean}" (${word.english}) belong to?`,
      options,
      correctIndex: options.indexOf(correctCat),
      category: 'vocab' as const,
      level: 'beginner' as const,
      xpReward: 10,
    });
  });

  return results;
}

// ─── Main generator ──────────────────────────────────────────────────────────

export function generateDynamicQuestions(
  category: 'hangul' | 'vocab' | 'grammar' | 'mixed',
  count: number
): QuizQuestion[] {
  const vocabPool = vocabulary;
  let questions: QuizQuestion[] = [];

  if (category === 'hangul' || category === 'mixed') {
    questions.push(
      ...generateHangulSound(Math.ceil(count * 0.3)),
      ...generateHangulIdentify(Math.ceil(count * 0.3)),
      ...generateHangulMatching(Math.ceil(count * 0.1)),
    );
  }

  if (category === 'vocab' || category === 'mixed') {
    questions.push(
      ...generateVocabMeaning(vocabPool, Math.ceil(count * 0.2)),
      ...generateVocabTranslate(vocabPool, Math.ceil(count * 0.2)),
      ...generateVocabFillBlank(vocabPool, Math.ceil(count * 0.1)),
      ...generateVocabMatching(vocabPool, Math.ceil(count * 0.1)),
      ...generateOddOneOut(vocabPool, Math.ceil(count * 0.05)),
      ...generateContextSentence(vocabPool, Math.ceil(count * 0.1)),
      ...generateCategorySort(vocabPool, Math.ceil(count * 0.05)),
    );
  }

  if (category === 'grammar' || category === 'mixed') {
    questions.push(
      ...generateParticleChoice(Math.ceil(count * 0.25)),
      ...generateConjugation(Math.ceil(count * 0.25)),
      ...generateSentenceOrder(Math.ceil(count * 0.1)),
    );
  }

  return shuffleArray(questions).slice(0, count);
}

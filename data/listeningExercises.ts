import { vocabulary } from './vocabulary';
import { sentences } from './sentences';
import { shuffleArray } from '@/lib/utils';

export type ListeningExerciseType = 'identify_meaning' | 'dictation' | 'fill_audio_blank';

export interface ListeningExercise {
  id: string;
  type: ListeningExerciseType;
  level: 'beginner' | 'intermediate' | 'advanced';
  korean: string;
  english: string;
  romanization: string;
  options?: string[];
  correctIndex?: number;
  hint?: string;
}

// ─── Static exercises ───────────────────────────────────────────────────────

export const listeningExercises: ListeningExercise[] = [
  // Identify Meaning — Beginner
  { id: 'le_1', type: 'identify_meaning', level: 'beginner', korean: '안녕하세요', english: 'Hello', romanization: 'annyeonghaseyo', options: ['Hello', 'Thank you', 'Goodbye', 'Sorry'], correctIndex: 0 },
  { id: 'le_2', type: 'identify_meaning', level: 'beginner', korean: '감사합니다', english: 'Thank you', romanization: 'gamsahamnida', options: ['Sorry', 'Thank you', 'Hello', 'Please'], correctIndex: 1 },
  { id: 'le_3', type: 'identify_meaning', level: 'beginner', korean: '죄송합니다', english: "I'm sorry", romanization: 'joesonghamnida', options: ['Hello', 'Goodbye', "I'm sorry", 'Thank you'], correctIndex: 2 },
  { id: 'le_4', type: 'identify_meaning', level: 'beginner', korean: '네', english: 'Yes', romanization: 'ne', options: ['No', 'Yes', 'Maybe', 'Hello'], correctIndex: 1 },
  { id: 'le_5', type: 'identify_meaning', level: 'beginner', korean: '아니요', english: 'No', romanization: 'aniyo', options: ['Yes', 'Hello', 'No', 'Thank you'], correctIndex: 2 },
  { id: 'le_6', type: 'identify_meaning', level: 'beginner', korean: '물', english: 'Water', romanization: 'mul', options: ['Rice', 'Water', 'Milk', 'Tea'], correctIndex: 1 },
  { id: 'le_7', type: 'identify_meaning', level: 'beginner', korean: '밥', english: 'Rice/Meal', romanization: 'bap', options: ['Water', 'Bread', 'Rice/Meal', 'Noodles'], correctIndex: 2 },
  { id: 'le_8', type: 'identify_meaning', level: 'beginner', korean: '학교', english: 'School', romanization: 'hakgyo', options: ['Hospital', 'School', 'Home', 'Store'], correctIndex: 1 },
  { id: 'le_9', type: 'identify_meaning', level: 'beginner', korean: '친구', english: 'Friend', romanization: 'chingu', options: ['Teacher', 'Parent', 'Friend', 'Student'], correctIndex: 2 },
  { id: 'le_10', type: 'identify_meaning', level: 'beginner', korean: '사랑해요', english: 'I love you', romanization: 'saranghaeyo', options: ['I miss you', 'I love you', 'I like you', 'I know you'], correctIndex: 1 },

  // Identify Meaning — Intermediate
  { id: 'le_11', type: 'identify_meaning', level: 'intermediate', korean: '오늘 날씨가 좋아요', english: 'The weather is nice today', romanization: 'oneul nalssiga joayo', options: ['The weather is nice today', 'It is raining today', 'Yesterday was cold', 'Tomorrow will be hot'], correctIndex: 0 },
  { id: 'le_12', type: 'identify_meaning', level: 'intermediate', korean: '어디에 가요?', english: 'Where are you going?', romanization: 'eodie gayo?', options: ['What are you doing?', 'Who is that?', 'Where are you going?', 'When will you come?'], correctIndex: 2 },
  { id: 'le_13', type: 'identify_meaning', level: 'intermediate', korean: '한국어를 배우고 싶어요', english: 'I want to learn Korean', romanization: 'hangugeoreul baeugo sipeoyo', options: ['I speak Korean', 'I want to learn Korean', 'I know Korean', 'I like Korean'], correctIndex: 1 },
  { id: 'le_14', type: 'identify_meaning', level: 'intermediate', korean: '이거 얼마예요?', english: 'How much is this?', romanization: 'igeo eolmayeyo?', options: ['What is this?', 'Where is this?', 'How much is this?', 'Whose is this?'], correctIndex: 2 },
  { id: 'le_15', type: 'identify_meaning', level: 'intermediate', korean: '커피 한 잔 주세요', english: 'One cup of coffee, please', romanization: 'keopi han jan juseyo', options: ['I like coffee', 'One cup of coffee, please', 'Do you have coffee?', 'Coffee is delicious'], correctIndex: 1 },

  // Dictation — Intermediate
  { id: 'le_16', type: 'dictation', level: 'intermediate', korean: '안녕하세요', english: 'Hello', romanization: 'annyeonghaseyo', hint: '5 syllables, starts with 안' },
  { id: 'le_17', type: 'dictation', level: 'intermediate', korean: '감사합니다', english: 'Thank you', romanization: 'gamsahamnida', hint: '5 syllables, starts with 감' },
  { id: 'le_18', type: 'dictation', level: 'intermediate', korean: '저는 학생이에요', english: 'I am a student', romanization: 'jeoneun haksaengieyo', hint: 'Starts with 저는' },
  { id: 'le_19', type: 'dictation', level: 'intermediate', korean: '밥 먹었어요?', english: 'Did you eat?', romanization: 'bap meogeosseoyo?', hint: '2 words, starts with 밥' },
  { id: 'le_20', type: 'dictation', level: 'intermediate', korean: '좋아요', english: 'Good / I like it', romanization: 'joayo', hint: '3 syllables' },

  // Fill Audio Blank — Beginner/Intermediate
  { id: 'le_21', type: 'fill_audio_blank', level: 'beginner', korean: '저는 밥을 먹어요', english: 'I eat rice', romanization: 'jeoneun babeul meogeoyo', options: ['밥을', '물을', '빵을', '고기를'], correctIndex: 0, hint: 'What do I eat?' },
  { id: 'le_22', type: 'fill_audio_blank', level: 'beginner', korean: '학교에 가요', english: 'I go to school', romanization: 'hakgyoe gayo', options: ['학교에', '집에', '가게에', '병원에'], correctIndex: 0, hint: 'Where do I go?' },
  { id: 'le_23', type: 'fill_audio_blank', level: 'intermediate', korean: '도서관에서 공부해요', english: 'I study at the library', romanization: 'doseogwaneseo gongbuhaeyo', options: ['공부해요', '일해요', '놀아요', '자요'], correctIndex: 0, hint: 'What do I do at the library?' },
  { id: 'le_24', type: 'fill_audio_blank', level: 'intermediate', korean: '내일 영화를 볼 거예요', english: 'I will watch a movie tomorrow', romanization: 'naeil yeonghwareul bol geoyeyo', options: ['내일', '오늘', '어제', '모레'], correctIndex: 0, hint: 'When will I watch?' },
  { id: 'le_25', type: 'fill_audio_blank', level: 'intermediate', korean: '비싸지만 맛있어요', english: 'Expensive but delicious', romanization: 'bissajiman masisseoyo', options: ['맛있어요', '맛없어요', '좋아요', '나빠요'], correctIndex: 0, hint: 'But it is ___' },
];

// ─── Dynamic generators ─────────────────────────────────────────────────────

export function generateListeningFromVocab(count: number): ListeningExercise[] {
  const pool = shuffleArray(vocabulary.filter((w) => w.level !== 'advanced')).slice(0, count);
  return pool.map((word, i) => {
    const wrongs = shuffleArray(vocabulary.filter((w) => w.id !== word.id))
      .slice(0, 3)
      .map((w) => w.english);
    const options = shuffleArray([word.english, ...wrongs]);
    return {
      id: `le_gen_${word.id}_${i}`,
      type: 'identify_meaning' as const,
      level: word.level === 'advanced' ? 'intermediate' as const : word.level as 'beginner' | 'intermediate',
      korean: word.korean,
      english: word.english,
      romanization: word.romanization,
      options,
      correctIndex: options.indexOf(word.english),
    };
  });
}

export function generateDictationFromSentences(count: number): ListeningExercise[] {
  const pool = shuffleArray(sentences.filter((s) => s.level <= 3)).slice(0, count);
  return pool.map((sent, i) => ({
    id: `le_dict_${sent.id}_${i}`,
    type: 'dictation' as const,
    level: sent.level <= 2 ? 'beginner' as const : 'intermediate' as const,
    korean: sent.korean,
    english: sent.english,
    romanization: sent.romanization,
    hint: `Starts with ${sent.korean.charAt(0)}`,
  }));
}

// ─── Utilities ──────────────────────────────────────────────────────────────

export function getListeningByLevel(level: ListeningExercise['level']): ListeningExercise[] {
  return listeningExercises.filter((e) => e.level === level);
}

export function getListeningByType(type: ListeningExerciseType): ListeningExercise[] {
  return listeningExercises.filter((e) => e.type === type);
}

export function getAllListeningExercises(includeDynamic: boolean = true): ListeningExercise[] {
  if (!includeDynamic) return listeningExercises;
  return [
    ...listeningExercises,
    ...generateListeningFromVocab(10),
    ...generateDictationFromSentences(5),
  ];
}

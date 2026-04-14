// Extended SRS card content for grammar patterns, sentences, and listening

export type SRSCardType = 'vocab' | 'grammar' | 'sentence' | 'listening';

export interface SRSCardContent {
  id: string;
  type: SRSCardType;
  front: {
    text: string;
    subtext?: string;
    audio?: boolean; // play audio on display
  };
  back: {
    text: string;
    detail?: string;
    romanization?: string;
  };
}

export const grammarSRSCards: SRSCardContent[] = [
  // Topic markers
  {
    id: 'srs_g_topic_v',
    type: 'grammar',
    front: { text: 'Topic marker (after vowel)', subtext: 'e.g., 저___' },
    back: { text: '는', detail: '저는 학생이에요 — "As for me, I am a student"', romanization: 'neun' },
  },
  {
    id: 'srs_g_topic_c',
    type: 'grammar',
    front: { text: 'Topic marker (after consonant)', subtext: 'e.g., 한국___' },
    back: { text: '은', detail: '한국은 아름다워요 — "As for Korea, it is beautiful"', romanization: 'eun' },
  },
  // Subject markers
  {
    id: 'srs_g_subj_v',
    type: 'grammar',
    front: { text: 'Subject marker (after vowel)', subtext: 'e.g., 비___' },
    back: { text: '가', detail: '비가 와요 — "Rain comes (it\'s raining)"', romanization: 'ga' },
  },
  {
    id: 'srs_g_subj_c',
    type: 'grammar',
    front: { text: 'Subject marker (after consonant)', subtext: 'e.g., 물___' },
    back: { text: '이', detail: '물이 차가워요 — "The water is cold"', romanization: 'i' },
  },
  // Object markers
  {
    id: 'srs_g_obj_v',
    type: 'grammar',
    front: { text: 'Object marker (after vowel)', subtext: 'e.g., 커피___' },
    back: { text: '를', detail: '커피를 마셔요 — "I drink coffee"', romanization: 'reul' },
  },
  {
    id: 'srs_g_obj_c',
    type: 'grammar',
    front: { text: 'Object marker (after consonant)', subtext: 'e.g., 책___' },
    back: { text: '을', detail: '책을 읽어요 — "I read a book"', romanization: 'eul' },
  },
  // Tense patterns
  {
    id: 'srs_g_present',
    type: 'grammar',
    front: { text: 'Present tense pattern (polite)', subtext: 'How to conjugate?' },
    back: { text: 'Stem + 아요/어요/해요', detail: 'ㅏ/ㅗ → 아요, else → 어요, 하다 → 해요', romanization: 'a-yo / eo-yo / hae-yo' },
  },
  {
    id: 'srs_g_past',
    type: 'grammar',
    front: { text: 'Past tense pattern (polite)', subtext: 'How to conjugate?' },
    back: { text: 'Stem + 았어요/었어요/했어요', detail: 'Same vowel rules as present + 았/었', romanization: 'ass-eo-yo / eoss-eo-yo / haess-eo-yo' },
  },
  {
    id: 'srs_g_future',
    type: 'grammar',
    front: { text: 'Future tense pattern (polite)', subtext: 'How to express "will do"?' },
    back: { text: 'Stem + (으)ㄹ 거예요', detail: 'Vowel stem → ㄹ 거예요, Consonant stem → 을 거예요', romanization: '(eu)l geo-ye-yo' },
  },
  {
    id: 'srs_g_negative_short',
    type: 'grammar',
    front: { text: 'Short negation pattern', subtext: 'How to say "don\'t do"?' },
    back: { text: '안 + verb', detail: '안 먹어요 = "don\'t eat"', romanization: 'an' },
  },
  {
    id: 'srs_g_negative_long',
    type: 'grammar',
    front: { text: 'Long negation pattern', subtext: 'Formal way to negate' },
    back: { text: 'Stem + 지 않아요', detail: '먹지 않아요 = "don\'t eat" (formal)', romanization: '-ji an-a-yo' },
  },
  {
    id: 'srs_g_want',
    type: 'grammar',
    front: { text: '"Want to" pattern', subtext: 'How to express desire?' },
    back: { text: 'Stem + 고 싶어요', detail: '먹고 싶어요 = "want to eat"', romanization: '-go sip-eo-yo' },
  },
  {
    id: 'srs_g_and',
    type: 'grammar',
    front: { text: 'Connector: "and" (actions)', subtext: 'How to join two actions?' },
    back: { text: 'Stem + 고', detail: '먹고 마셔요 = "eat and drink"', romanization: '-go' },
  },
  {
    id: 'srs_g_but',
    type: 'grammar',
    front: { text: 'Connector: "but"', subtext: 'How to contrast?' },
    back: { text: 'Stem + 지만', detail: '비싸지만 맛있어요 = "expensive but delicious"', romanization: '-ji-man' },
  },
  {
    id: 'srs_g_loc_dir',
    type: 'grammar',
    front: { text: 'Location: direction / "to"', subtext: 'Which particle?' },
    back: { text: '에', detail: '학교에 가요 = "go to school"', romanization: 'e' },
  },
  {
    id: 'srs_g_loc_action',
    type: 'grammar',
    front: { text: 'Location: where action happens', subtext: 'Which particle?' },
    back: { text: '에서', detail: '도서관에서 공부해요 = "study at the library"', romanization: 'e-seo' },
  },
];

export const sentenceSRSCards: SRSCardContent[] = [
  {
    id: 'srs_s_1',
    type: 'sentence',
    front: { text: 'I am a student.' },
    back: { text: '저는 학생이에요.', detail: '저는 (I) + 학생이에요 (am a student)', romanization: 'Jeoneun haksaengieyo' },
  },
  {
    id: 'srs_s_2',
    type: 'sentence',
    front: { text: 'I eat rice.' },
    back: { text: '저는 밥을 먹어요.', detail: 'Subject + Object + Verb', romanization: 'Jeoneun babeul meogeoyo' },
  },
  {
    id: 'srs_s_3',
    type: 'sentence',
    front: { text: 'I go to school.' },
    back: { text: '학교에 가요.', detail: 'Place + 에 + movement verb', romanization: 'Hakgyoe gayo' },
  },
  {
    id: 'srs_s_4',
    type: 'sentence',
    front: { text: 'I want to go to Korea.' },
    back: { text: '한국에 가고 싶어요.', detail: 'Place + 에 + verb stem + 고 싶어요', romanization: 'Hanguge gago sipeoyo' },
  },
  {
    id: 'srs_s_5',
    type: 'sentence',
    front: { text: 'I study Korean.' },
    back: { text: '저는 한국어를 공부해요.', detail: 'Subject + Object + 하다 verb', romanization: 'Jeoneun hangugeoreul gongbuhaeyo' },
  },
  {
    id: 'srs_s_6',
    type: 'sentence',
    front: { text: 'It\'s raining.' },
    back: { text: '비가 와요.', detail: '비 + 가 (subject marker) + 와요 (comes)', romanization: 'Biga wayo' },
  },
  {
    id: 'srs_s_7',
    type: 'sentence',
    front: { text: 'I don\'t eat meat.' },
    back: { text: '고기를 안 먹어요.', detail: 'Object + 안 + verb (short negation)', romanization: 'Gogireul an meogeoyo' },
  },
  {
    id: 'srs_s_8',
    type: 'sentence',
    front: { text: 'I want to eat kimchi.' },
    back: { text: '김치를 먹고 싶어요.', detail: 'Object + verb stem + 고 싶어요', romanization: 'Gimchireul meokgo sipeoyo' },
  },
  {
    id: 'srs_s_9',
    type: 'sentence',
    front: { text: 'It\'s expensive but delicious.' },
    back: { text: '비싸지만 맛있어요.', detail: 'Adjective stem + 지만 + adjective', romanization: 'Bissajiman masisseoyo' },
  },
  {
    id: 'srs_s_10',
    type: 'sentence',
    front: { text: 'I study at the library.' },
    back: { text: '도서관에서 공부해요.', detail: 'Place + 에서 + action verb', romanization: 'Doseogwaneseo gongbuhaeyo' },
  },
  {
    id: 'srs_s_11',
    type: 'sentence',
    front: { text: 'Thank you.' },
    back: { text: '감사합니다.', detail: 'Formal polite — used in most situations', romanization: 'Gamsahamnida' },
  },
  {
    id: 'srs_s_12',
    type: 'sentence',
    front: { text: 'I will eat tomorrow.' },
    back: { text: '내일 먹을 거예요.', detail: 'Time + verb stem + 을 거예요 (future)', romanization: 'Naeil meogeul geoyeyo' },
  },
];

export const listeningSRSCards: SRSCardContent[] = [
  {
    id: 'srs_l_1',
    type: 'listening',
    front: { text: '🔊 Listen', audio: true, subtext: '안녕하세요' },
    back: { text: 'Hello', detail: 'Formal greeting used in all situations', romanization: 'annyeonghaseyo' },
  },
  {
    id: 'srs_l_2',
    type: 'listening',
    front: { text: '🔊 Listen', audio: true, subtext: '감사합니다' },
    back: { text: 'Thank you', detail: 'Formal polite', romanization: 'gamsahamnida' },
  },
  {
    id: 'srs_l_3',
    type: 'listening',
    front: { text: '🔊 Listen', audio: true, subtext: '죄송합니다' },
    back: { text: 'I\'m sorry', detail: 'Formal polite apology', romanization: 'joesonghamnida' },
  },
  {
    id: 'srs_l_4',
    type: 'listening',
    front: { text: '🔊 Listen', audio: true, subtext: '저는 학생이에요' },
    back: { text: 'I am a student', detail: 'Topic marker + noun + copula', romanization: 'jeoneun haksaengieyo' },
  },
  {
    id: 'srs_l_5',
    type: 'listening',
    front: { text: '🔊 Listen', audio: true, subtext: '밥 먹었어요?' },
    back: { text: 'Did you eat?', detail: 'Common greeting (literally "Have you eaten rice?")', romanization: 'bap meogeosseoyo?' },
  },
  {
    id: 'srs_l_6',
    type: 'listening',
    front: { text: '🔊 Listen', audio: true, subtext: '어디에 가요?' },
    back: { text: 'Where are you going?', detail: '어디 (where) + 에 (to) + 가요 (go)', romanization: 'eodie gayo?' },
  },
];

// ─── Utility ────────────────────────────────────────────────────────────────

export const allSRSContent: SRSCardContent[] = [
  ...grammarSRSCards,
  ...sentenceSRSCards,
  ...listeningSRSCards,
];

export function getSRSContentById(id: string): SRSCardContent | undefined {
  return allSRSContent.find((c) => c.id === id);
}

export function getSRSContentByType(type: SRSCardType): SRSCardContent[] {
  return allSRSContent.filter((c) => c.type === type);
}

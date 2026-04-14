export interface HangulCharacter {
  id: string;
  character: string;
  romanization: string;
  name: string;
  nameKorean: string;
  sound: string; // syllable to speak for pronunciation (e.g. 가 for ㄱ)
  type: 'consonant' | 'vowel' | 'double_consonant' | 'compound_vowel';
  pronunciation: string;
  examples: { word: string; meaning: string; romanization: string }[];
  order: number;
}

export const consonants: HangulCharacter[] = [
  { id: 'c_g', character: 'ㄱ', romanization: 'g/k', name: 'giyeok', nameKorean: '기역', sound: '가', type: 'consonant', pronunciation: "Like 'g' in 'go' at the beginning, 'k' at the end of a syllable", examples: [{ word: '가방', meaning: 'bag', romanization: 'gabang' }, { word: '고기', meaning: 'meat', romanization: 'gogi' }], order: 1 },
  { id: 'c_n', character: 'ㄴ', romanization: 'n', name: 'nieun', nameKorean: '니은', sound: '나', type: 'consonant', pronunciation: "Like 'n' in 'no'", examples: [{ word: '나라', meaning: 'country', romanization: 'nara' }, { word: '누나', meaning: 'older sister (male speaker)', romanization: 'nuna' }], order: 2 },
  { id: 'c_d', character: 'ㄷ', romanization: 'd/t', name: 'digeut', nameKorean: '디귿', sound: '다', type: 'consonant', pronunciation: "Like 'd' in 'do' at the beginning, 't' at the end", examples: [{ word: '다리', meaning: 'leg/bridge', romanization: 'dari' }, { word: '도시', meaning: 'city', romanization: 'dosi' }], order: 3 },
  { id: 'c_r', character: 'ㄹ', romanization: 'r/l', name: 'rieul', nameKorean: '리을', sound: '라', type: 'consonant', pronunciation: "Flapped 'r' between vowels, 'l' at the end of a syllable", examples: [{ word: '라면', meaning: 'ramen', romanization: 'ramyeon' }, { word: '달', meaning: 'moon', romanization: 'dal' }], order: 4 },
  { id: 'c_m', character: 'ㅁ', romanization: 'm', name: 'mieum', nameKorean: '미음', sound: '마', type: 'consonant', pronunciation: "Like 'm' in 'mom'", examples: [{ word: '엄마', meaning: 'mom', romanization: 'eomma' }, { word: '물', meaning: 'water', romanization: 'mul' }], order: 5 },
  { id: 'c_b', character: 'ㅂ', romanization: 'b/p', name: 'bieup', nameKorean: '비읍', sound: '바', type: 'consonant', pronunciation: "Like 'b' in 'boy' at the beginning, 'p' at the end", examples: [{ word: '바다', meaning: 'sea', romanization: 'bada' }, { word: '밥', meaning: 'rice/meal', romanization: 'bap' }], order: 6 },
  { id: 'c_s', character: 'ㅅ', romanization: 's', name: 'siot', nameKorean: '시옷', sound: '사', type: 'consonant', pronunciation: "Like 's' in 'see'. Before ㅣ, it sounds like 'sh'. As a final consonant (받침), it becomes a 't' sound — e.g. 옷 (clothes) is pronounced 'ot'", examples: [{ word: '사랑', meaning: 'love', romanization: 'sarang' }, { word: '옷', meaning: 'clothes', romanization: 'ot' }], order: 7 },
  { id: 'c_ng', character: 'ㅇ', romanization: 'ng/-', name: 'ieung', nameKorean: '이응', sound: '아', type: 'consonant', pronunciation: "Silent at the beginning of a syllable, 'ng' at the end", examples: [{ word: '아이', meaning: 'child', romanization: 'ai' }, { word: '강', meaning: 'river', romanization: 'gang' }], order: 8 },
  { id: 'c_j', character: 'ㅈ', romanization: 'j', name: 'jieut', nameKorean: '지읒', sound: '자', type: 'consonant', pronunciation: "Like 'j' in 'just'. As a final consonant (받침), it becomes a 't' sound", examples: [{ word: '자동차', meaning: 'car', romanization: 'jadongcha' }, { word: '점심', meaning: 'lunch', romanization: 'jeomsim' }], order: 9 },
  { id: 'c_ch', character: 'ㅊ', romanization: 'ch', name: 'chieut', nameKorean: '치읓', sound: '차', type: 'consonant', pronunciation: "Like 'ch' in 'church', aspirated. As a final consonant (받침), it becomes a 't' sound", examples: [{ word: '차', meaning: 'tea/car', romanization: 'cha' }, { word: '친구', meaning: 'friend', romanization: 'chingu' }], order: 10 },
  { id: 'c_k', character: 'ㅋ', romanization: 'k', name: 'kieuk', nameKorean: '키읔', sound: '카', type: 'consonant', pronunciation: "Like 'k' in 'key', with a strong burst of air", examples: [{ word: '커피', meaning: 'coffee', romanization: 'keopi' }, { word: '크다', meaning: 'big', romanization: 'keuda' }], order: 11 },
  { id: 'c_t', character: 'ㅌ', romanization: 't', name: 'tieut', nameKorean: '티읕', sound: '타', type: 'consonant', pronunciation: "Like 't' in 'top', aspirated", examples: [{ word: '토끼', meaning: 'rabbit', romanization: 'tokki' }, { word: '텔레비전', meaning: 'television', romanization: 'tellebijeon' }], order: 12 },
  { id: 'c_p', character: 'ㅍ', romanization: 'p', name: 'pieup', nameKorean: '피읖', sound: '파', type: 'consonant', pronunciation: "Like 'p' in 'pie', aspirated", examples: [{ word: '피자', meaning: 'pizza', romanization: 'pija' }, { word: '포도', meaning: 'grape', romanization: 'podo' }], order: 13 },
  { id: 'c_h', character: 'ㅎ', romanization: 'h', name: 'hieut', nameKorean: '히읗', sound: '하', type: 'consonant', pronunciation: "Like 'h' in 'hat'. As a final consonant (받침), it becomes silent or a 't' sound. Before ㄱ/ㄷ/ㅂ/ㅈ, it merges to create an aspirated sound", examples: [{ word: '하늘', meaning: 'sky', romanization: 'haneul' }, { word: '학교', meaning: 'school', romanization: 'hakgyo' }], order: 14 },
];

export const doubleConsonants: HangulCharacter[] = [
  { id: 'dc_gg', character: 'ㄲ', romanization: 'kk', name: 'ssang giyeok', nameKorean: '쌍기역', sound: '까', type: 'double_consonant', pronunciation: "Tense 'k' sound, no aspiration, like 'g' in 'ski'", examples: [{ word: '까치', meaning: 'magpie', romanization: 'kkachi' }, { word: '꿈', meaning: 'dream', romanization: 'kkum' }], order: 15 },
  { id: 'dc_dd', character: 'ㄸ', romanization: 'tt', name: 'ssang digeut', nameKorean: '쌍디귿', sound: '따', type: 'double_consonant', pronunciation: "Tense 'd' sound, no aspiration, like 't' in 'star'", examples: [{ word: '딸', meaning: 'daughter', romanization: 'ttal' }, { word: '떡', meaning: 'rice cake', romanization: 'tteok' }], order: 16 },
  { id: 'dc_bb', character: 'ㅃ', romanization: 'pp', name: 'ssang bieup', nameKorean: '쌍비읍', sound: '빠', type: 'double_consonant', pronunciation: "Tense 'b' sound, no aspiration, like 'p' in 'spin'", examples: [{ word: '빵', meaning: 'bread', romanization: 'ppang' }, { word: '빠르다', meaning: 'fast', romanization: 'ppareuda' }], order: 17 },
  { id: 'dc_ss', character: 'ㅆ', romanization: 'ss', name: 'ssang siot', nameKorean: '쌍시옷', sound: '싸', type: 'double_consonant', pronunciation: "Tense 's' sound, stronger than regular ㅅ. As a final consonant (받침), it also becomes a 't' sound — e.g. 있다 (to exist) is pronounced 'itda'", examples: [{ word: '쓰다', meaning: 'to write/to use', romanization: 'sseuda' }, { word: '있다', meaning: 'to exist/have', romanization: 'itda' }], order: 18 },
  { id: 'dc_jj', character: 'ㅉ', romanization: 'jj', name: 'ssang jieut', nameKorean: '쌍지읒', sound: '짜', type: 'double_consonant', pronunciation: "Tense 'j' sound, no aspiration", examples: [{ word: '짜장면', meaning: 'black bean noodles', romanization: 'jjajangmyeon' }, { word: '찌개', meaning: 'stew', romanization: 'jjigae' }], order: 19 },
];

export const vowels: HangulCharacter[] = [
  { id: 'v_a', character: 'ㅏ', romanization: 'a', name: 'a', nameKorean: '아', sound: '아', type: 'vowel', pronunciation: "Like 'a' in 'father'", examples: [{ word: '아빠', meaning: 'dad', romanization: 'appa' }], order: 20 },
  { id: 'v_ya', character: 'ㅑ', romanization: 'ya', name: 'ya', nameKorean: '야', sound: '야', type: 'vowel', pronunciation: "Like 'ya' in 'yard'", examples: [{ word: '야구', meaning: 'baseball', romanization: 'yagu' }], order: 21 },
  { id: 'v_eo', character: 'ㅓ', romanization: 'eo', name: 'eo', nameKorean: '어', sound: '어', type: 'vowel', pronunciation: "Like 'u' in 'fun' or 'o' in 'gone'", examples: [{ word: '어머니', meaning: 'mother', romanization: 'eomeoni' }], order: 22 },
  { id: 'v_yeo', character: 'ㅕ', romanization: 'yeo', name: 'yeo', nameKorean: '여', sound: '여', type: 'vowel', pronunciation: "Like 'yo' in 'young'", examples: [{ word: '여자', meaning: 'woman', romanization: 'yeoja' }], order: 23 },
  { id: 'v_o', character: 'ㅗ', romanization: 'o', name: 'o', nameKorean: '오', sound: '오', type: 'vowel', pronunciation: "Like 'o' in 'go', lips rounded", examples: [{ word: '오빠', meaning: 'older brother (female speaker)', romanization: 'oppa' }], order: 24 },
  { id: 'v_yo', character: 'ㅛ', romanization: 'yo', name: 'yo', nameKorean: '요', sound: '요', type: 'vowel', pronunciation: "Like 'yo' in 'yoga'", examples: [{ word: '요리', meaning: 'cooking', romanization: 'yori' }], order: 25 },
  { id: 'v_u', character: 'ㅜ', romanization: 'u', name: 'u', nameKorean: '우', sound: '우', type: 'vowel', pronunciation: "Like 'oo' in 'moon'", examples: [{ word: '우유', meaning: 'milk', romanization: 'uyu' }], order: 26 },
  { id: 'v_yu', character: 'ㅠ', romanization: 'yu', name: 'yu', nameKorean: '유', sound: '유', type: 'vowel', pronunciation: "Like 'you'", examples: [{ word: '유명', meaning: 'famous', romanization: 'yumyeong' }], order: 27 },
  { id: 'v_eu', character: 'ㅡ', romanization: 'eu', name: 'eu', nameKorean: '으', sound: '으', type: 'vowel', pronunciation: "No English equivalent. Say 'ee' but spread lips flat, unsmiling", examples: [{ word: '어른', meaning: 'adult', romanization: 'eoreun' }], order: 28 },
  { id: 'v_i', character: 'ㅣ', romanization: 'i', name: 'i', nameKorean: '이', sound: '이', type: 'vowel', pronunciation: "Like 'ee' in 'see'", examples: [{ word: '이름', meaning: 'name', romanization: 'ireum' }], order: 29 },
];

export const compoundVowels: HangulCharacter[] = [
  { id: 'cv_ae', character: 'ㅐ', romanization: 'ae', name: 'ae', nameKorean: '애', sound: '애', type: 'compound_vowel', pronunciation: "Like 'a' in 'bat'", examples: [{ word: '개', meaning: 'dog', romanization: 'gae' }], order: 30 },
  { id: 'cv_yae', character: 'ㅒ', romanization: 'yae', name: 'yae', nameKorean: '얘', sound: '얘', type: 'compound_vowel', pronunciation: "Like 'ya' in 'yam'", examples: [{ word: '얘기', meaning: 'story/talk', romanization: 'yaegi' }], order: 31 },
  { id: 'cv_e', character: 'ㅔ', romanization: 'e', name: 'e', nameKorean: '에', sound: '에', type: 'compound_vowel', pronunciation: "Like 'e' in 'bed'", examples: [{ word: '네', meaning: 'yes', romanization: 'ne' }], order: 32 },
  { id: 'cv_ye', character: 'ㅖ', romanization: 'ye', name: 'ye', nameKorean: '예', sound: '예', type: 'compound_vowel', pronunciation: "Like 'ye' in 'yes'", examples: [{ word: '예쁘다', meaning: 'pretty', romanization: 'yeppeuda' }], order: 33 },
  { id: 'cv_wa', character: 'ㅘ', romanization: 'wa', name: 'wa', nameKorean: '와', sound: '와', type: 'compound_vowel', pronunciation: "Like 'wa' in 'wand'", examples: [{ word: '과일', meaning: 'fruit', romanization: 'gwail' }], order: 34 },
  { id: 'cv_wae', character: 'ㅙ', romanization: 'wae', name: 'wae', nameKorean: '왜', sound: '왜', type: 'compound_vowel', pronunciation: "Like 'we' in 'wet'", examples: [{ word: '왜', meaning: 'why', romanization: 'wae' }], order: 35 },
  { id: 'cv_oe', character: 'ㅚ', romanization: 'oe', name: 'oe', nameKorean: '외', sound: '외', type: 'compound_vowel', pronunciation: "Similar to 'we' in 'wet' (in modern Korean, same as ㅙ)", examples: [{ word: '외국', meaning: 'foreign country', romanization: 'oeguk' }], order: 36 },
  { id: 'cv_wo', character: 'ㅝ', romanization: 'wo', name: 'wo', nameKorean: '워', sound: '워', type: 'compound_vowel', pronunciation: "Like 'wo' in 'won'", examples: [{ word: '원', meaning: 'won (currency)', romanization: 'won' }], order: 37 },
  { id: 'cv_we', character: 'ㅞ', romanization: 'we', name: 'we', nameKorean: '웨', sound: '웨', type: 'compound_vowel', pronunciation: "Like 'we' in 'wet'", examples: [{ word: '웨딩', meaning: 'wedding', romanization: 'weding' }], order: 38 },
  { id: 'cv_wi', character: 'ㅟ', romanization: 'wi', name: 'wi', nameKorean: '위', sound: '위', type: 'compound_vowel', pronunciation: "Like 'wee' in 'week'", examples: [{ word: '위', meaning: 'above/stomach', romanization: 'wi' }], order: 39 },
  { id: 'cv_ui', character: 'ㅢ', romanization: 'ui', name: 'ui', nameKorean: '의', sound: '의', type: 'compound_vowel', pronunciation: "Start with 'eu' then glide to 'i'. In possessive particle, pronounced as 'e'", examples: [{ word: '의사', meaning: 'doctor', romanization: 'uisa' }], order: 40 },
];

export const allHangul: HangulCharacter[] = [...consonants, ...doubleConsonants, ...vowels, ...compoundVowels];

export function getHangulById(id: string): HangulCharacter | undefined {
  return allHangul.find((h) => h.id === id);
}

export function getHangulByType(type: HangulCharacter['type']): HangulCharacter[] {
  return allHangul.filter((h) => h.type === type);
}

export function getHangulByCharacter(character: string): HangulCharacter | undefined {
  const normalized = character.trim().normalize('NFC');
  return allHangul.find((h) => h.character.normalize('NFC') === normalized);
}

export function getHangulAudioText(character: HangulCharacter): string {
  const text = character.sound || character.romanization.replace('/', ' or ');
  console.log(`[HangulData] Audio text for "${character.character}": "${text}"`);
  return text;
}

import { expansionWords1 } from './vocab-expansion-1';
import { expansionWords2 } from './vocab-expansion-2';
import { expansionWords3 } from './vocab-expansion-3';

export type VocabCategory = 'greetings' | 'numbers' | 'family' | 'food' | 'colors' | 'time' | 'places' | 'verbs' | 'adjectives' | 'daily' | 'body' | 'weather' | 'emotions' | 'animals' | 'objects' | 'travel' | 'shopping' | 'school' | 'work' | 'health' | 'clothing' | 'transport' | 'nature' | 'house' | 'technology';

export interface VocabWord {
  id: string;
  korean: string;
  romanization: string;
  english: string;
  partOfSpeech: 'noun' | 'verb' | 'adjective' | 'adverb' | 'phrase' | 'counter' | 'number';
  category: VocabCategory;
  level: 'beginner' | 'intermediate' | 'advanced';
  example?: { korean: string; english: string; romanization: string };
  notes?: string;
  imagePrompt: string;
}

export function getVocabImageUrl(word: VocabWord): string {
  // Use DiceBear API for consistent, reliable placeholder avatars based on word ID
  const seed = encodeURIComponent(word.id + '-' + word.korean);
  return `https://api.dicebear.com/9.x/icons/png?seed=${seed}&size=200&backgroundColor=f0f0ff`;
}

export const categoryInfo: Record<VocabCategory, { name: string; nameKorean: string; icon: string; color: string }> = {
  greetings: { name: 'Greetings', nameKorean: '인사', icon: 'hand-right', color: '#FF80AB' },
  numbers: { name: 'Numbers', nameKorean: '숫자', icon: 'calculator', color: '#00E5FF' },
  family: { name: 'Family', nameKorean: '가족', icon: 'people', color: '#FFD740' },
  food: { name: 'Food & Drink', nameKorean: '음식', icon: 'restaurant', color: '#FF6090' },
  colors: { name: 'Colors', nameKorean: '색깔', icon: 'color-palette', color: '#AA00FF' },
  time: { name: 'Time & Days', nameKorean: '시간', icon: 'time', color: '#00E676' },
  places: { name: 'Places', nameKorean: '장소', icon: 'location', color: '#7C4DFF' },
  verbs: { name: 'Basic Verbs', nameKorean: '동사', icon: 'flash', color: '#E040FB' },
  adjectives: { name: 'Adjectives', nameKorean: '형용사', icon: 'star', color: '#FFAB40' },
  daily: { name: 'Daily Life', nameKorean: '일상', icon: 'sunny', color: '#00BCD4' },
  body: { name: 'Body Parts', nameKorean: '신체', icon: 'body', color: '#FF7043' },
  weather: { name: 'Weather', nameKorean: '날씨', icon: 'cloud', color: '#42A5F5' },
  emotions: { name: 'Emotions', nameKorean: '감정', icon: 'heart', color: '#EF5350' },
  animals: { name: 'Animals', nameKorean: '동물', icon: 'paw', color: '#8D6E63' },
  objects: { name: 'Objects', nameKorean: '물건', icon: 'cube', color: '#78909C' },
  travel: { name: 'Travel', nameKorean: '여행', icon: 'airplane', color: '#26C6DA' },
  shopping: { name: 'Shopping', nameKorean: '쇼핑', icon: 'cart', color: '#FF8A65' },
  school: { name: 'School', nameKorean: '학교', icon: 'school', color: '#66BB6A' },
  work: { name: 'Work', nameKorean: '직장', icon: 'briefcase', color: '#5C6BC0' },
  health: { name: 'Health', nameKorean: '건강', icon: 'fitness', color: '#EC407A' },
  clothing: { name: 'Clothing', nameKorean: '옷', icon: 'shirt', color: '#AB47BC' },
  transport: { name: 'Transport', nameKorean: '교통', icon: 'bus', color: '#29B6F6' },
  nature: { name: 'Nature', nameKorean: '자연', icon: 'leaf', color: '#9CCC65' },
  house: { name: 'House', nameKorean: '집', icon: 'home', color: '#FFA726' },
  technology: { name: 'Technology', nameKorean: '기술', icon: 'phone-portrait', color: '#78909C' },
};

export const vocabulary: VocabWord[] = [
  // === GREETINGS (15 words) ===
  { id: 'gr_1', korean: '안녕하세요', romanization: 'annyeonghaseyo', english: 'Hello (formal)', partOfSpeech: 'phrase', category: 'greetings', level: 'beginner', notes: 'Most common greeting, used anytime', imagePrompt: 'cute kawaii person waving hello' },
  { id: 'gr_2', korean: '감사합니다', romanization: 'gamsahamnida', english: 'Thank you (formal)', partOfSpeech: 'phrase', category: 'greetings', level: 'beginner', imagePrompt: 'cute kawaii person bowing gratefully' },
  { id: 'gr_3', korean: '고맙습니다', romanization: 'gomapseumnida', english: 'Thank you (formal, softer)', partOfSpeech: 'phrase', category: 'greetings', level: 'beginner', imagePrompt: 'cute kawaii person holding thank you sign' },
  { id: 'gr_4', korean: '죄송합니다', romanization: 'joesonghamnida', english: 'I\'m sorry (formal)', partOfSpeech: 'phrase', category: 'greetings', level: 'beginner', imagePrompt: 'cute kawaii person apologizing sadly' },
  { id: 'gr_5', korean: '안녕히 가세요', romanization: 'annyeonghi gaseyo', english: 'Goodbye (to person leaving)', partOfSpeech: 'phrase', category: 'greetings', level: 'beginner', notes: 'Said by the person staying', imagePrompt: 'cute kawaii person waving goodbye' },
  { id: 'gr_6', korean: '안녕히 계세요', romanization: 'annyeonghi gyeseyo', english: 'Goodbye (to person staying)', partOfSpeech: 'phrase', category: 'greetings', level: 'beginner', notes: 'Said by the person leaving', imagePrompt: 'cute kawaii person walking away waving' },
  { id: 'gr_7', korean: '네', romanization: 'ne', english: 'Yes', partOfSpeech: 'adverb', category: 'greetings', level: 'beginner', imagePrompt: 'cute kawaii green checkmark thumbs up' },
  { id: 'gr_8', korean: '아니요', romanization: 'aniyo', english: 'No', partOfSpeech: 'adverb', category: 'greetings', level: 'beginner', imagePrompt: 'cute kawaii red X shaking head' },
  { id: 'gr_9', korean: '잘 지내세요?', romanization: 'jal jinaeseyo?', english: 'How are you?', partOfSpeech: 'phrase', category: 'greetings', level: 'beginner', imagePrompt: 'cute kawaii friends greeting each other' },
  { id: 'gr_10', korean: '만나서 반갑습니다', romanization: 'mannaseo bangapseumnida', english: 'Nice to meet you', partOfSpeech: 'phrase', category: 'greetings', level: 'beginner', imagePrompt: 'cute kawaii people shaking hands smiling' },
  { id: 'gr_11', korean: '실례합니다', romanization: 'sillyehamnida', english: 'Excuse me', partOfSpeech: 'phrase', category: 'greetings', level: 'beginner', imagePrompt: 'cute kawaii person raising hand politely' },
  { id: 'gr_12', korean: '잠깐만요', romanization: 'jamkkanmanyo', english: 'Just a moment', partOfSpeech: 'phrase', category: 'greetings', level: 'beginner', imagePrompt: 'cute kawaii person holding up one finger' },
  { id: 'gr_13', korean: '괜찮습니다', romanization: 'gwaenchanseumnida', english: 'It\'s okay / I\'m fine', partOfSpeech: 'phrase', category: 'greetings', level: 'beginner', imagePrompt: 'cute kawaii smiling face okay gesture' },
  { id: 'gr_14', korean: '축하합니다', romanization: 'chukahamnida', english: 'Congratulations', partOfSpeech: 'phrase', category: 'greetings', level: 'intermediate', imagePrompt: 'cute kawaii party confetti celebration' },
  { id: 'gr_15', korean: '잘 먹겠습니다', romanization: 'jal meokgesseumnida', english: 'I will eat well (before a meal)', partOfSpeech: 'phrase', category: 'greetings', level: 'beginner', notes: 'Said before eating, shows gratitude', imagePrompt: 'cute kawaii person praying before meal' },

  // === NUMBERS (20 words) ===
  { id: 'nu_1', korean: '하나', romanization: 'hana', english: 'One (native)', partOfSpeech: 'number', category: 'numbers', level: 'beginner', notes: 'Native Korean number, used for counting items', imagePrompt: 'cute kawaii single star number one' },
  { id: 'nu_2', korean: '둘', romanization: 'dul', english: 'Two (native)', partOfSpeech: 'number', category: 'numbers', level: 'beginner', imagePrompt: 'cute kawaii two cherries pair' },
  { id: 'nu_3', korean: '셋', romanization: 'set', english: 'Three (native)', partOfSpeech: 'number', category: 'numbers', level: 'beginner', imagePrompt: 'cute kawaii three balloons floating' },
  { id: 'nu_4', korean: '넷', romanization: 'net', english: 'Four (native)', partOfSpeech: 'number', category: 'numbers', level: 'beginner', imagePrompt: 'cute kawaii four leaf clover' },
  { id: 'nu_5', korean: '다섯', romanization: 'daseot', english: 'Five (native)', partOfSpeech: 'number', category: 'numbers', level: 'beginner', imagePrompt: 'cute kawaii open hand five fingers' },
  { id: 'nu_6', korean: '여섯', romanization: 'yeoseot', english: 'Six (native)', partOfSpeech: 'number', category: 'numbers', level: 'beginner', imagePrompt: 'cute kawaii six colorful dice' },
  { id: 'nu_7', korean: '일곱', romanization: 'ilgop', english: 'Seven (native)', partOfSpeech: 'number', category: 'numbers', level: 'beginner', imagePrompt: 'cute kawaii rainbow seven colors' },
  { id: 'nu_8', korean: '여덟', romanization: 'yeodeol', english: 'Eight (native)', partOfSpeech: 'number', category: 'numbers', level: 'beginner', imagePrompt: 'cute kawaii octopus eight tentacles' },
  { id: 'nu_9', korean: '아홉', romanization: 'ahop', english: 'Nine (native)', partOfSpeech: 'number', category: 'numbers', level: 'beginner', imagePrompt: 'cute kawaii nine planets solar system' },
  { id: 'nu_10', korean: '열', romanization: 'yeol', english: 'Ten (native)', partOfSpeech: 'number', category: 'numbers', level: 'beginner', imagePrompt: 'cute kawaii ten fingers counting' },
  { id: 'nu_11', korean: '일', romanization: 'il', english: 'One (Sino-Korean)', partOfSpeech: 'number', category: 'numbers', level: 'beginner', notes: 'Sino-Korean, used for dates, phone numbers, money', imagePrompt: 'cute kawaii gold coin number one' },
  { id: 'nu_12', korean: '이', romanization: 'i', english: 'Two (Sino-Korean)', partOfSpeech: 'number', category: 'numbers', level: 'beginner', imagePrompt: 'cute kawaii two matching socks' },
  { id: 'nu_13', korean: '삼', romanization: 'sam', english: 'Three (Sino-Korean)', partOfSpeech: 'number', category: 'numbers', level: 'beginner', imagePrompt: 'cute kawaii three stacked blocks' },
  { id: 'nu_14', korean: '백', romanization: 'baek', english: 'Hundred', partOfSpeech: 'number', category: 'numbers', level: 'beginner', imagePrompt: 'cute kawaii pile of hundred coins' },
  { id: 'nu_15', korean: '천', romanization: 'cheon', english: 'Thousand', partOfSpeech: 'number', category: 'numbers', level: 'beginner', imagePrompt: 'cute kawaii mountain of gold coins' },
  { id: 'nu_16', korean: '만', romanization: 'man', english: 'Ten thousand', partOfSpeech: 'number', category: 'numbers', level: 'intermediate', notes: 'Korean counts in units of 10,000 not 1,000', imagePrompt: 'cute kawaii treasure chest overflowing' },
  { id: 'nu_17', korean: '첫 번째', romanization: 'cheot beonjjae', english: 'First', partOfSpeech: 'number', category: 'numbers', level: 'intermediate', imagePrompt: 'cute kawaii gold trophy first place' },
  { id: 'nu_18', korean: '두 번째', romanization: 'du beonjjae', english: 'Second', partOfSpeech: 'number', category: 'numbers', level: 'intermediate', imagePrompt: 'cute kawaii silver medal second place' },
  { id: 'nu_19', korean: '개', romanization: 'gae', english: 'Counter for things', partOfSpeech: 'counter', category: 'numbers', level: 'beginner', notes: 'General counter: 한 개, 두 개, 세 개', imagePrompt: 'cute kawaii counting apples in basket' },
  { id: 'nu_20', korean: '명', romanization: 'myeong', english: 'Counter for people', partOfSpeech: 'counter', category: 'numbers', level: 'beginner', imagePrompt: 'cute kawaii group of people standing' },

  // === FAMILY (12 words) ===
  { id: 'fa_1', korean: '가족', romanization: 'gajok', english: 'Family', partOfSpeech: 'noun', category: 'family', level: 'beginner', imagePrompt: 'cute kawaii happy family together' },
  { id: 'fa_2', korean: '아버지', romanization: 'abeoji', english: 'Father (formal)', partOfSpeech: 'noun', category: 'family', level: 'beginner', imagePrompt: 'cute kawaii father in suit' },
  { id: 'fa_3', korean: '어머니', romanization: 'eomeoni', english: 'Mother (formal)', partOfSpeech: 'noun', category: 'family', level: 'beginner', imagePrompt: 'cute kawaii elegant mother smiling' },
  { id: 'fa_4', korean: '아빠', romanization: 'appa', english: 'Dad', partOfSpeech: 'noun', category: 'family', level: 'beginner', imagePrompt: 'cute kawaii dad playing with child' },
  { id: 'fa_5', korean: '엄마', romanization: 'eomma', english: 'Mom', partOfSpeech: 'noun', category: 'family', level: 'beginner', imagePrompt: 'cute kawaii mother hugging child' },
  { id: 'fa_6', korean: '형', romanization: 'hyeong', english: 'Older brother (male speaker)', partOfSpeech: 'noun', category: 'family', level: 'beginner', imagePrompt: 'cute kawaii tall older brother' },
  { id: 'fa_7', korean: '오빠', romanization: 'oppa', english: 'Older brother (female speaker)', partOfSpeech: 'noun', category: 'family', level: 'beginner', notes: 'Also used for older male friends/boyfriend', imagePrompt: 'cute kawaii caring older brother' },
  { id: 'fa_8', korean: '누나', romanization: 'nuna', english: 'Older sister (male speaker)', partOfSpeech: 'noun', category: 'family', level: 'beginner', imagePrompt: 'cute kawaii kind older sister' },
  { id: 'fa_9', korean: '언니', romanization: 'eonni', english: 'Older sister (female speaker)', partOfSpeech: 'noun', category: 'family', level: 'beginner', imagePrompt: 'cute kawaii stylish older sister' },
  { id: 'fa_10', korean: '동생', romanization: 'dongsaeng', english: 'Younger sibling', partOfSpeech: 'noun', category: 'family', level: 'beginner', imagePrompt: 'cute kawaii little sibling playing' },
  { id: 'fa_11', korean: '할아버지', romanization: 'harabeoji', english: 'Grandfather', partOfSpeech: 'noun', category: 'family', level: 'beginner', imagePrompt: 'cute kawaii grandfather with cane' },
  { id: 'fa_12', korean: '할머니', romanization: 'halmeoni', english: 'Grandmother', partOfSpeech: 'noun', category: 'family', level: 'beginner', imagePrompt: 'cute kawaii grandmother knitting warmly' },

  // === FOOD (18 words) ===
  { id: 'fo_1', korean: '밥', romanization: 'bap', english: 'Rice / Meal', partOfSpeech: 'noun', category: 'food', level: 'beginner', imagePrompt: 'cute kawaii steaming rice bowl' },
  { id: 'fo_2', korean: '물', romanization: 'mul', english: 'Water', partOfSpeech: 'noun', category: 'food', level: 'beginner', imagePrompt: 'cute kawaii glass of water' },
  { id: 'fo_3', korean: '김치', romanization: 'gimchi', english: 'Kimchi', partOfSpeech: 'noun', category: 'food', level: 'beginner', imagePrompt: 'cute kawaii kimchi dish jar' },
  { id: 'fo_4', korean: '불고기', romanization: 'bulgogi', english: 'Bulgogi (marinated beef)', partOfSpeech: 'noun', category: 'food', level: 'beginner', imagePrompt: 'cute kawaii sizzling bulgogi plate' },
  { id: 'fo_5', korean: '비빔밥', romanization: 'bibimbap', english: 'Bibimbap (mixed rice)', partOfSpeech: 'noun', category: 'food', level: 'beginner', imagePrompt: 'cute kawaii colorful bibimbap bowl' },
  { id: 'fo_6', korean: '라면', romanization: 'ramyeon', english: 'Ramen / Instant noodles', partOfSpeech: 'noun', category: 'food', level: 'beginner', imagePrompt: 'cute kawaii steaming ramen noodles' },
  { id: 'fo_7', korean: '떡볶이', romanization: 'tteokbokki', english: 'Spicy rice cakes', partOfSpeech: 'noun', category: 'food', level: 'beginner', imagePrompt: 'cute kawaii spicy red tteokbokki' },
  { id: 'fo_8', korean: '삼겹살', romanization: 'samgyeopsal', english: 'Pork belly (BBQ)', partOfSpeech: 'noun', category: 'food', level: 'beginner', imagePrompt: 'cute kawaii grilling pork belly' },
  { id: 'fo_9', korean: '커피', romanization: 'keopi', english: 'Coffee', partOfSpeech: 'noun', category: 'food', level: 'beginner', imagePrompt: 'cute kawaii coffee cup steaming' },
  { id: 'fo_10', korean: '차', romanization: 'cha', english: 'Tea', partOfSpeech: 'noun', category: 'food', level: 'beginner', imagePrompt: 'cute kawaii teapot with teacup' },
  { id: 'fo_11', korean: '맥주', romanization: 'maekju', english: 'Beer', partOfSpeech: 'noun', category: 'food', level: 'intermediate', imagePrompt: 'cute kawaii frothy beer mug' },
  { id: 'fo_12', korean: '소주', romanization: 'soju', english: 'Soju (Korean liquor)', partOfSpeech: 'noun', category: 'food', level: 'intermediate', imagePrompt: 'cute kawaii green soju bottle' },
  { id: 'fo_13', korean: '과일', romanization: 'gwail', english: 'Fruit', partOfSpeech: 'noun', category: 'food', level: 'beginner', imagePrompt: 'cute kawaii fruit basket assortment' },
  { id: 'fo_14', korean: '고기', romanization: 'gogi', english: 'Meat', partOfSpeech: 'noun', category: 'food', level: 'beginner', imagePrompt: 'cute kawaii steak on plate' },
  { id: 'fo_15', korean: '빵', romanization: 'ppang', english: 'Bread', partOfSpeech: 'noun', category: 'food', level: 'beginner', imagePrompt: 'cute kawaii fresh baked bread' },
  { id: 'fo_16', korean: '계란', romanization: 'gyeran', english: 'Egg', partOfSpeech: 'noun', category: 'food', level: 'beginner', imagePrompt: 'cute kawaii sunny side up egg' },
  { id: 'fo_17', korean: '치킨', romanization: 'chikin', english: 'Fried chicken', partOfSpeech: 'noun', category: 'food', level: 'beginner', notes: 'Korean fried chicken, hugely popular', imagePrompt: 'cute kawaii crispy fried chicken' },
  { id: 'fo_18', korean: '아이스크림', romanization: 'aiseukeurim', english: 'Ice cream', partOfSpeech: 'noun', category: 'food', level: 'beginner', imagePrompt: 'cute kawaii ice cream cone' },

  // === COLORS (10 words) ===
  { id: 'co_1', korean: '빨간색', romanization: 'ppalgansaek', english: 'Red', partOfSpeech: 'noun', category: 'colors', level: 'beginner', imagePrompt: 'cute kawaii red apple heart' },
  { id: 'co_2', korean: '파란색', romanization: 'paransaek', english: 'Blue', partOfSpeech: 'noun', category: 'colors', level: 'beginner', imagePrompt: 'cute kawaii blue ocean wave' },
  { id: 'co_3', korean: '노란색', romanization: 'noransaek', english: 'Yellow', partOfSpeech: 'noun', category: 'colors', level: 'beginner', imagePrompt: 'cute kawaii yellow sun shining' },
  { id: 'co_4', korean: '초록색', romanization: 'choroksaek', english: 'Green', partOfSpeech: 'noun', category: 'colors', level: 'beginner', imagePrompt: 'cute kawaii green leaf sprouting' },
  { id: 'co_5', korean: '하얀색', romanization: 'hayansaek', english: 'White', partOfSpeech: 'noun', category: 'colors', level: 'beginner', imagePrompt: 'cute kawaii white fluffy cloud' },
  { id: 'co_6', korean: '검은색', romanization: 'geomeunsaek', english: 'Black', partOfSpeech: 'noun', category: 'colors', level: 'beginner', imagePrompt: 'cute kawaii black cat sitting' },
  { id: 'co_7', korean: '분홍색', romanization: 'bunhongsaek', english: 'Pink', partOfSpeech: 'noun', category: 'colors', level: 'beginner', imagePrompt: 'cute kawaii pink cherry blossom' },
  { id: 'co_8', korean: '보라색', romanization: 'borasaek', english: 'Purple', partOfSpeech: 'noun', category: 'colors', level: 'beginner', imagePrompt: 'cute kawaii purple grape bunch' },
  { id: 'co_9', korean: '주황색', romanization: 'juhwangsaek', english: 'Orange', partOfSpeech: 'noun', category: 'colors', level: 'beginner', imagePrompt: 'cute kawaii orange tangerine fruit' },
  { id: 'co_10', korean: '갈색', romanization: 'galsaek', english: 'Brown', partOfSpeech: 'noun', category: 'colors', level: 'beginner', imagePrompt: 'cute kawaii brown teddy bear' },

  // === TIME (12 words) ===
  { id: 'ti_1', korean: '오늘', romanization: 'oneul', english: 'Today', partOfSpeech: 'noun', category: 'time', level: 'beginner', imagePrompt: 'cute kawaii calendar circled today' },
  { id: 'ti_2', korean: '내일', romanization: 'naeil', english: 'Tomorrow', partOfSpeech: 'noun', category: 'time', level: 'beginner', imagePrompt: 'cute kawaii sunrise over horizon' },
  { id: 'ti_3', korean: '어제', romanization: 'eoje', english: 'Yesterday', partOfSpeech: 'noun', category: 'time', level: 'beginner', imagePrompt: 'cute kawaii sunset fading away' },
  { id: 'ti_4', korean: '지금', romanization: 'jigeum', english: 'Now', partOfSpeech: 'adverb', category: 'time', level: 'beginner', imagePrompt: 'cute kawaii clock pointing now' },
  { id: 'ti_5', korean: '아침', romanization: 'achim', english: 'Morning', partOfSpeech: 'noun', category: 'time', level: 'beginner', imagePrompt: 'cute kawaii bright morning sunshine' },
  { id: 'ti_6', korean: '저녁', romanization: 'jeonyeok', english: 'Evening', partOfSpeech: 'noun', category: 'time', level: 'beginner', imagePrompt: 'cute kawaii evening moon stars' },
  { id: 'ti_7', korean: '월요일', romanization: 'woryoil', english: 'Monday', partOfSpeech: 'noun', category: 'time', level: 'beginner', imagePrompt: 'cute kawaii sleepy Monday morning' },
  { id: 'ti_8', korean: '화요일', romanization: 'hwayoil', english: 'Tuesday', partOfSpeech: 'noun', category: 'time', level: 'beginner', imagePrompt: 'cute kawaii energetic Tuesday fire' },
  { id: 'ti_9', korean: '수요일', romanization: 'suyoil', english: 'Wednesday', partOfSpeech: 'noun', category: 'time', level: 'beginner', imagePrompt: 'cute kawaii midweek water droplet' },
  { id: 'ti_10', korean: '주말', romanization: 'jumal', english: 'Weekend', partOfSpeech: 'noun', category: 'time', level: 'beginner', imagePrompt: 'cute kawaii relaxing weekend hammock' },
  { id: 'ti_11', korean: '시', romanization: 'si', english: 'O\'clock (hour)', partOfSpeech: 'counter', category: 'time', level: 'beginner', notes: 'Used with native Korean numbers: 한 시, 두 시', imagePrompt: 'cute kawaii alarm clock ringing' },
  { id: 'ti_12', korean: '분', romanization: 'bun', english: 'Minute', partOfSpeech: 'counter', category: 'time', level: 'beginner', notes: 'Used with Sino-Korean numbers: 십 분, 이십 분', imagePrompt: 'cute kawaii stopwatch ticking minutes' },

  // === PLACES (10 words) ===
  { id: 'pl_1', korean: '학교', romanization: 'hakgyo', english: 'School', partOfSpeech: 'noun', category: 'places', level: 'beginner', imagePrompt: 'cute kawaii school building entrance' },
  { id: 'pl_2', korean: '집', romanization: 'jip', english: 'House / Home', partOfSpeech: 'noun', category: 'places', level: 'beginner', imagePrompt: 'cute kawaii cozy house home' },
  { id: 'pl_3', korean: '병원', romanization: 'byeongwon', english: 'Hospital', partOfSpeech: 'noun', category: 'places', level: 'beginner', imagePrompt: 'cute kawaii hospital building cross' },
  { id: 'pl_4', korean: '은행', romanization: 'eunhaeng', english: 'Bank', partOfSpeech: 'noun', category: 'places', level: 'beginner', imagePrompt: 'cute kawaii bank building vault' },
  { id: 'pl_5', korean: '식당', romanization: 'sikdang', english: 'Restaurant', partOfSpeech: 'noun', category: 'places', level: 'beginner', imagePrompt: 'cute kawaii restaurant with tables' },
  { id: 'pl_6', korean: '카페', romanization: 'kape', english: 'Cafe', partOfSpeech: 'noun', category: 'places', level: 'beginner', imagePrompt: 'cute kawaii cozy cafe storefront' },
  { id: 'pl_7', korean: '편의점', romanization: 'pyeonuijeom', english: 'Convenience store', partOfSpeech: 'noun', category: 'places', level: 'beginner', imagePrompt: 'cute kawaii convenience store bright' },
  { id: 'pl_8', korean: '공항', romanization: 'gonghang', english: 'Airport', partOfSpeech: 'noun', category: 'places', level: 'beginner', imagePrompt: 'cute kawaii airport with airplane' },
  { id: 'pl_9', korean: '지하철역', romanization: 'jihacheollyeok', english: 'Subway station', partOfSpeech: 'noun', category: 'places', level: 'intermediate', imagePrompt: 'cute kawaii subway train station' },
  { id: 'pl_10', korean: '서점', romanization: 'seojeom', english: 'Bookstore', partOfSpeech: 'noun', category: 'places', level: 'intermediate', imagePrompt: 'cute kawaii bookstore with shelves' },

  // === VERBS (15 words) ===
  { id: 've_1', korean: '하다', romanization: 'hada', english: 'To do', partOfSpeech: 'verb', category: 'verbs', level: 'beginner', example: { korean: '공부하다', english: 'To study', romanization: 'gongbuhada' }, imagePrompt: 'cute kawaii person doing task' },
  { id: 've_2', korean: '가다', romanization: 'gada', english: 'To go', partOfSpeech: 'verb', category: 'verbs', level: 'beginner', example: { korean: '학교에 가다', english: 'To go to school', romanization: 'hakgyoe gada' }, imagePrompt: 'cute kawaii person walking forward' },
  { id: 've_3', korean: '오다', romanization: 'oda', english: 'To come', partOfSpeech: 'verb', category: 'verbs', level: 'beginner', imagePrompt: 'cute kawaii person arriving running' },
  { id: 've_4', korean: '먹다', romanization: 'meokda', english: 'To eat', partOfSpeech: 'verb', category: 'verbs', level: 'beginner', imagePrompt: 'cute kawaii person eating happily' },
  { id: 've_5', korean: '마시다', romanization: 'masida', english: 'To drink', partOfSpeech: 'verb', category: 'verbs', level: 'beginner', imagePrompt: 'cute kawaii person drinking juice' },
  { id: 've_6', korean: '보다', romanization: 'boda', english: 'To see / watch', partOfSpeech: 'verb', category: 'verbs', level: 'beginner', imagePrompt: 'cute kawaii person watching screen' },
  { id: 've_7', korean: '읽다', romanization: 'ikda', english: 'To read', partOfSpeech: 'verb', category: 'verbs', level: 'beginner', imagePrompt: 'cute kawaii person reading book' },
  { id: 've_8', korean: '쓰다', romanization: 'sseuda', english: 'To write / use', partOfSpeech: 'verb', category: 'verbs', level: 'beginner', imagePrompt: 'cute kawaii person writing pencil' },
  { id: 've_9', korean: '말하다', romanization: 'malhada', english: 'To speak / say', partOfSpeech: 'verb', category: 'verbs', level: 'beginner', imagePrompt: 'cute kawaii person speaking speech bubble' },
  { id: 've_10', korean: '듣다', romanization: 'deutda', english: 'To listen / hear', partOfSpeech: 'verb', category: 'verbs', level: 'beginner', imagePrompt: 'cute kawaii person listening headphones' },
  { id: 've_11', korean: '사다', romanization: 'sada', english: 'To buy', partOfSpeech: 'verb', category: 'verbs', level: 'beginner', imagePrompt: 'cute kawaii person shopping bags' },
  { id: 've_12', korean: '만나다', romanization: 'mannada', english: 'To meet', partOfSpeech: 'verb', category: 'verbs', level: 'beginner', imagePrompt: 'cute kawaii two friends meeting' },
  { id: 've_13', korean: '좋아하다', romanization: 'joahada', english: 'To like', partOfSpeech: 'verb', category: 'verbs', level: 'beginner', imagePrompt: 'cute kawaii person hugging heart' },
  { id: 've_14', korean: '알다', romanization: 'alda', english: 'To know', partOfSpeech: 'verb', category: 'verbs', level: 'beginner', imagePrompt: 'cute kawaii lightbulb idea brain' },
  { id: 've_15', korean: '있다', romanization: 'itda', english: 'To exist / have', partOfSpeech: 'verb', category: 'verbs', level: 'beginner', imagePrompt: 'cute kawaii hand holding gift box' },

  // === ADJECTIVES (12 words) ===
  { id: 'ad_1', korean: '크다', romanization: 'keuda', english: 'Big', partOfSpeech: 'adjective', category: 'adjectives', level: 'beginner', imagePrompt: 'cute kawaii big elephant standing' },
  { id: 'ad_2', korean: '작다', romanization: 'jakda', english: 'Small', partOfSpeech: 'adjective', category: 'adjectives', level: 'beginner', imagePrompt: 'cute kawaii tiny mouse small' },
  { id: 'ad_3', korean: '좋다', romanization: 'jota', english: 'Good', partOfSpeech: 'adjective', category: 'adjectives', level: 'beginner', imagePrompt: 'cute kawaii sparkling thumbs up' },
  { id: 'ad_4', korean: '나쁘다', romanization: 'nappeuda', english: 'Bad', partOfSpeech: 'adjective', category: 'adjectives', level: 'beginner', imagePrompt: 'cute kawaii thumbs down stormy' },
  { id: 'ad_5', korean: '맛있다', romanization: 'masitda', english: 'Delicious', partOfSpeech: 'adjective', category: 'adjectives', level: 'beginner', imagePrompt: 'cute kawaii delicious food sparkling' },
  { id: 'ad_6', korean: '예쁘다', romanization: 'yeppeuda', english: 'Pretty', partOfSpeech: 'adjective', category: 'adjectives', level: 'beginner', imagePrompt: 'cute kawaii pretty flower blooming' },
  { id: 'ad_7', korean: '멋있다', romanization: 'meositda', english: 'Cool / Stylish', partOfSpeech: 'adjective', category: 'adjectives', level: 'beginner', imagePrompt: 'cute kawaii cool sunglasses star' },
  { id: 'ad_8', korean: '재미있다', romanization: 'jaemiitda', english: 'Fun / Interesting', partOfSpeech: 'adjective', category: 'adjectives', level: 'beginner', imagePrompt: 'cute kawaii laughing face confetti' },
  { id: 'ad_9', korean: '어렵다', romanization: 'eoryeopda', english: 'Difficult', partOfSpeech: 'adjective', category: 'adjectives', level: 'intermediate', imagePrompt: 'cute kawaii puzzled face question mark' },
  { id: 'ad_10', korean: '쉽다', romanization: 'swipda', english: 'Easy', partOfSpeech: 'adjective', category: 'adjectives', level: 'intermediate', imagePrompt: 'cute kawaii easy breezy checkmark' },
  { id: 'ad_11', korean: '바쁘다', romanization: 'bappeuda', english: 'Busy', partOfSpeech: 'adjective', category: 'adjectives', level: 'intermediate', imagePrompt: 'cute kawaii busy person multitasking' },
  { id: 'ad_12', korean: '피곤하다', romanization: 'pigonhada', english: 'Tired', partOfSpeech: 'adjective', category: 'adjectives', level: 'intermediate', imagePrompt: 'cute kawaii sleepy yawning person' },

  // === DAILY LIFE (15 words) ===
  { id: 'da_1', korean: '사람', romanization: 'saram', english: 'Person', partOfSpeech: 'noun', category: 'daily', level: 'beginner', imagePrompt: 'cute kawaii friendly person standing' },
  { id: 'da_2', korean: '친구', romanization: 'chingu', english: 'Friend', partOfSpeech: 'noun', category: 'daily', level: 'beginner', imagePrompt: 'cute kawaii two best friends' },
  { id: 'da_3', korean: '선생님', romanization: 'seonsaengnim', english: 'Teacher', partOfSpeech: 'noun', category: 'daily', level: 'beginner', imagePrompt: 'cute kawaii teacher at chalkboard' },
  { id: 'da_4', korean: '학생', romanization: 'haksaeng', english: 'Student', partOfSpeech: 'noun', category: 'daily', level: 'beginner', imagePrompt: 'cute kawaii student with backpack' },
  { id: 'da_5', korean: '이름', romanization: 'ireum', english: 'Name', partOfSpeech: 'noun', category: 'daily', level: 'beginner', imagePrompt: 'cute kawaii name tag badge' },
  { id: 'da_6', korean: '전화', romanization: 'jeonhwa', english: 'Phone / Phone call', partOfSpeech: 'noun', category: 'daily', level: 'beginner', imagePrompt: 'cute kawaii ringing telephone phone' },
  { id: 'da_7', korean: '돈', romanization: 'don', english: 'Money', partOfSpeech: 'noun', category: 'daily', level: 'beginner', imagePrompt: 'cute kawaii money coins bills' },
  { id: 'da_8', korean: '일', romanization: 'il', english: 'Work / Job', partOfSpeech: 'noun', category: 'daily', level: 'beginner', imagePrompt: 'cute kawaii person working desk' },
  { id: 'da_9', korean: '공부', romanization: 'gongbu', english: 'Study', partOfSpeech: 'noun', category: 'daily', level: 'beginner', imagePrompt: 'cute kawaii studying books pencil' },
  { id: 'da_10', korean: '음악', romanization: 'eumak', english: 'Music', partOfSpeech: 'noun', category: 'daily', level: 'beginner', imagePrompt: 'cute kawaii musical notes floating' },
  { id: 'da_11', korean: '영화', romanization: 'yeonghwa', english: 'Movie', partOfSpeech: 'noun', category: 'daily', level: 'beginner', imagePrompt: 'cute kawaii movie film clapperboard' },
  { id: 'da_12', korean: '한국어', romanization: 'hangugeo', english: 'Korean language', partOfSpeech: 'noun', category: 'daily', level: 'beginner', imagePrompt: 'cute kawaii Korean hangul letters' },
  { id: 'da_13', korean: '여행', romanization: 'yeohaeng', english: 'Travel / Trip', partOfSpeech: 'noun', category: 'daily', level: 'intermediate', imagePrompt: 'cute kawaii suitcase world travel' },
  { id: 'da_14', korean: '운동', romanization: 'undong', english: 'Exercise', partOfSpeech: 'noun', category: 'daily', level: 'beginner', imagePrompt: 'cute kawaii person exercising jumping' },
  { id: 'da_15', korean: '사진', romanization: 'sajin', english: 'Photo', partOfSpeech: 'noun', category: 'daily', level: 'beginner', imagePrompt: 'cute kawaii camera taking photo' },

  // === BODY PARTS (12 words) ===
  { id: 'bo_1', korean: '머리', romanization: 'meori', english: 'Head / Hair', partOfSpeech: 'noun', category: 'body', level: 'beginner', imagePrompt: 'cute kawaii person pointing at head' },
  { id: 'bo_2', korean: '눈', romanization: 'nun', english: 'Eye', partOfSpeech: 'noun', category: 'body', level: 'beginner', imagePrompt: 'cute kawaii big sparkling eye' },
  { id: 'bo_3', korean: '코', romanization: 'ko', english: 'Nose', partOfSpeech: 'noun', category: 'body', level: 'beginner', imagePrompt: 'cute kawaii round nose face' },
  { id: 'bo_4', korean: '입', romanization: 'ip', english: 'Mouth', partOfSpeech: 'noun', category: 'body', level: 'beginner', imagePrompt: 'cute kawaii smiling mouth lips' },
  { id: 'bo_5', korean: '귀', romanization: 'gwi', english: 'Ear', partOfSpeech: 'noun', category: 'body', level: 'beginner', imagePrompt: 'cute kawaii bunny ears listening' },
  { id: 'bo_6', korean: '손', romanization: 'son', english: 'Hand', partOfSpeech: 'noun', category: 'body', level: 'beginner', imagePrompt: 'cute kawaii waving hand' },
  { id: 'bo_7', korean: '발', romanization: 'bal', english: 'Foot', partOfSpeech: 'noun', category: 'body', level: 'beginner', imagePrompt: 'cute kawaii foot with socks' },
  { id: 'bo_8', korean: '다리', romanization: 'dari', english: 'Leg', partOfSpeech: 'noun', category: 'body', level: 'beginner', imagePrompt: 'cute kawaii person walking legs' },
  { id: 'bo_9', korean: '팔', romanization: 'pal', english: 'Arm', partOfSpeech: 'noun', category: 'body', level: 'beginner', imagePrompt: 'cute kawaii strong arm flexing' },
  { id: 'bo_10', korean: '배', romanization: 'bae', english: 'Stomach / Belly', partOfSpeech: 'noun', category: 'body', level: 'beginner', imagePrompt: 'cute kawaii round tummy' },
  { id: 'bo_11', korean: '얼굴', romanization: 'eolgul', english: 'Face', partOfSpeech: 'noun', category: 'body', level: 'beginner', imagePrompt: 'cute kawaii friendly face portrait' },
  { id: 'bo_12', korean: '어깨', romanization: 'eokkae', english: 'Shoulder', partOfSpeech: 'noun', category: 'body', level: 'intermediate', imagePrompt: 'cute kawaii person shrugging shoulders' },

  // === WEATHER & SEASONS (12 words) ===
  { id: 'we_1', korean: '날씨', romanization: 'nalssi', english: 'Weather', partOfSpeech: 'noun', category: 'weather', level: 'beginner', imagePrompt: 'cute kawaii weather forecast icons' },
  { id: 'we_2', korean: '비', romanization: 'bi', english: 'Rain', partOfSpeech: 'noun', category: 'weather', level: 'beginner', example: { korean: '비가 와요', english: 'It is raining', romanization: 'biga wayo' }, imagePrompt: 'cute kawaii rain drops umbrella' },
  { id: 'we_3', korean: '바람', romanization: 'baram', english: 'Wind', partOfSpeech: 'noun', category: 'weather', level: 'beginner', imagePrompt: 'cute kawaii wind blowing leaves' },
  { id: 'we_4', korean: '구름', romanization: 'gureum', english: 'Cloud', partOfSpeech: 'noun', category: 'weather', level: 'beginner', imagePrompt: 'cute kawaii fluffy white clouds' },
  { id: 'we_5', korean: '하늘', romanization: 'haneul', english: 'Sky', partOfSpeech: 'noun', category: 'weather', level: 'beginner', imagePrompt: 'cute kawaii blue sky with birds' },
  { id: 'we_6', korean: '봄', romanization: 'bom', english: 'Spring', partOfSpeech: 'noun', category: 'weather', level: 'beginner', imagePrompt: 'cute kawaii cherry blossom spring' },
  { id: 'we_7', korean: '여름', romanization: 'yeoreum', english: 'Summer', partOfSpeech: 'noun', category: 'weather', level: 'beginner', imagePrompt: 'cute kawaii sunny beach summer' },
  { id: 'we_8', korean: '가을', romanization: 'gaeul', english: 'Autumn / Fall', partOfSpeech: 'noun', category: 'weather', level: 'beginner', imagePrompt: 'cute kawaii falling autumn leaves' },
  { id: 'we_9', korean: '겨울', romanization: 'gyeoul', english: 'Winter', partOfSpeech: 'noun', category: 'weather', level: 'beginner', imagePrompt: 'cute kawaii snowman winter snow' },
  { id: 'we_10', korean: '덥다', romanization: 'deopda', english: 'Hot (weather)', partOfSpeech: 'adjective', category: 'weather', level: 'beginner', imagePrompt: 'cute kawaii sweating in heat' },
  { id: 'we_11', korean: '춥다', romanization: 'chupda', english: 'Cold (weather)', partOfSpeech: 'adjective', category: 'weather', level: 'beginner', imagePrompt: 'cute kawaii shivering cold person' },
  { id: 'we_12', korean: '따뜻하다', romanization: 'ttatteuthada', english: 'Warm', partOfSpeech: 'adjective', category: 'weather', level: 'intermediate', imagePrompt: 'cute kawaii warm cozy blanket' },

  // === EMOTIONS (12 words) ===
  { id: 'em_1', korean: '사랑', romanization: 'sarang', english: 'Love', partOfSpeech: 'noun', category: 'emotions', level: 'beginner', example: { korean: '사랑해요', english: 'I love you', romanization: 'saranghaeyo' }, imagePrompt: 'cute kawaii heart love floating' },
  { id: 'em_2', korean: '기쁘다', romanization: 'gippeuda', english: 'Happy / Glad', partOfSpeech: 'adjective', category: 'emotions', level: 'beginner', imagePrompt: 'cute kawaii joyful face smiling' },
  { id: 'em_3', korean: '슬프다', romanization: 'seulpeuda', english: 'Sad', partOfSpeech: 'adjective', category: 'emotions', level: 'beginner', imagePrompt: 'cute kawaii sad face teardrop' },
  { id: 'em_4', korean: '화나다', romanization: 'hwanada', english: 'Angry', partOfSpeech: 'verb', category: 'emotions', level: 'beginner', imagePrompt: 'cute kawaii angry red face' },
  { id: 'em_5', korean: '무섭다', romanization: 'museopda', english: 'Scary / Afraid', partOfSpeech: 'adjective', category: 'emotions', level: 'beginner', imagePrompt: 'cute kawaii scared hiding face' },
  { id: 'em_6', korean: '행복하다', romanization: 'haengbokhada', english: 'Happy / Blissful', partOfSpeech: 'adjective', category: 'emotions', level: 'beginner', imagePrompt: 'cute kawaii blissful happy sunshine' },
  { id: 'em_7', korean: '외롭다', romanization: 'oeropda', english: 'Lonely', partOfSpeech: 'adjective', category: 'emotions', level: 'intermediate', imagePrompt: 'cute kawaii lonely person rain' },
  { id: 'em_8', korean: '기분', romanization: 'gibun', english: 'Mood / Feeling', partOfSpeech: 'noun', category: 'emotions', level: 'beginner', imagePrompt: 'cute kawaii mood emoji faces' },
  { id: 'em_9', korean: '감동', romanization: 'gamdong', english: 'Touched / Moved', partOfSpeech: 'noun', category: 'emotions', level: 'intermediate', imagePrompt: 'cute kawaii touched crying happy' },
  { id: 'em_10', korean: '걱정', romanization: 'geokjeong', english: 'Worry / Anxiety', partOfSpeech: 'noun', category: 'emotions', level: 'beginner', imagePrompt: 'cute kawaii worried thinking cloud' },
  { id: 'em_11', korean: '부끄럽다', romanization: 'bukkeuleopda', english: 'Embarrassed / Shy', partOfSpeech: 'adjective', category: 'emotions', level: 'intermediate', imagePrompt: 'cute kawaii blushing shy face' },
  { id: 'em_12', korean: '심심하다', romanization: 'simsimhada', english: 'Bored', partOfSpeech: 'adjective', category: 'emotions', level: 'beginner', imagePrompt: 'cute kawaii bored yawning face' },

  // === ANIMALS (12 words) ===
  { id: 'an_1', korean: '개', romanization: 'gae', english: 'Dog', partOfSpeech: 'noun', category: 'animals', level: 'beginner', imagePrompt: 'cute kawaii happy puppy dog' },
  { id: 'an_2', korean: '고양이', romanization: 'goyangi', english: 'Cat', partOfSpeech: 'noun', category: 'animals', level: 'beginner', imagePrompt: 'cute kawaii fluffy kitten cat' },
  { id: 'an_3', korean: '새', romanization: 'sae', english: 'Bird', partOfSpeech: 'noun', category: 'animals', level: 'beginner', imagePrompt: 'cute kawaii bird singing branch' },
  { id: 'an_4', korean: '물고기', romanization: 'mulgogi', english: 'Fish', partOfSpeech: 'noun', category: 'animals', level: 'beginner', imagePrompt: 'cute kawaii colorful fish swimming' },
  { id: 'an_5', korean: '토끼', romanization: 'tokki', english: 'Rabbit', partOfSpeech: 'noun', category: 'animals', level: 'beginner', imagePrompt: 'cute kawaii fluffy bunny rabbit' },
  { id: 'an_6', korean: '소', romanization: 'so', english: 'Cow', partOfSpeech: 'noun', category: 'animals', level: 'beginner', imagePrompt: 'cute kawaii friendly cow farm' },
  { id: 'an_7', korean: '돼지', romanization: 'dwaeji', english: 'Pig', partOfSpeech: 'noun', category: 'animals', level: 'beginner', imagePrompt: 'cute kawaii pink pig oink' },
  { id: 'an_8', korean: '강아지', romanization: 'gangaji', english: 'Puppy', partOfSpeech: 'noun', category: 'animals', level: 'beginner', imagePrompt: 'cute kawaii tiny puppy wagging tail' },
  { id: 'an_9', korean: '거북이', romanization: 'geobuki', english: 'Turtle', partOfSpeech: 'noun', category: 'animals', level: 'beginner', imagePrompt: 'cute kawaii green turtle shell' },
  { id: 'an_10', korean: '개구리', romanization: 'gaeguri', english: 'Frog', partOfSpeech: 'noun', category: 'animals', level: 'beginner', imagePrompt: 'cute kawaii green frog lily pad' },
  { id: 'an_11', korean: '개미', romanization: 'gaemi', english: 'Ant', partOfSpeech: 'noun', category: 'animals', level: 'beginner', imagePrompt: 'cute kawaii ant carrying leaf' },
  { id: 'an_12', korean: '거미', romanization: 'geomi', english: 'Spider', partOfSpeech: 'noun', category: 'animals', level: 'intermediate', imagePrompt: 'cute kawaii friendly spider web' },

  // === COMMON OBJECTS (12 words) ===
  { id: 'ob_1', korean: '가방', romanization: 'gabang', english: 'Bag', partOfSpeech: 'noun', category: 'objects', level: 'beginner', imagePrompt: 'cute kawaii school bag backpack' },
  { id: 'ob_2', korean: '가위', romanization: 'gawi', english: 'Scissors', partOfSpeech: 'noun', category: 'objects', level: 'beginner', imagePrompt: 'cute kawaii colorful scissors cutting' },
  { id: 'ob_3', korean: '거울', romanization: 'geoul', english: 'Mirror', partOfSpeech: 'noun', category: 'objects', level: 'beginner', imagePrompt: 'cute kawaii oval mirror reflection' },
  { id: 'ob_4', korean: '가구', romanization: 'gagu', english: 'Furniture', partOfSpeech: 'noun', category: 'objects', level: 'intermediate', imagePrompt: 'cute kawaii cozy room furniture' },
  { id: 'ob_5', korean: '우산', romanization: 'usan', english: 'Umbrella', partOfSpeech: 'noun', category: 'objects', level: 'beginner', imagePrompt: 'cute kawaii colorful umbrella rain' },
  { id: 'ob_6', korean: '열쇠', romanization: 'yeolsoe', english: 'Key', partOfSpeech: 'noun', category: 'objects', level: 'beginner', imagePrompt: 'cute kawaii golden key sparkle' },
  { id: 'ob_7', korean: '시계', romanization: 'sigye', english: 'Watch / Clock', partOfSpeech: 'noun', category: 'objects', level: 'beginner', imagePrompt: 'cute kawaii ticking clock watch' },
  { id: 'ob_8', korean: '안경', romanization: 'angyeong', english: 'Glasses', partOfSpeech: 'noun', category: 'objects', level: 'beginner', imagePrompt: 'cute kawaii round glasses spectacles' },
  { id: 'ob_9', korean: '컴퓨터', romanization: 'keompyuteo', english: 'Computer', partOfSpeech: 'noun', category: 'objects', level: 'beginner', imagePrompt: 'cute kawaii desktop computer screen' },
  { id: 'ob_10', korean: '핸드폰', romanization: 'haendeupon', english: 'Cell phone', partOfSpeech: 'noun', category: 'objects', level: 'beginner', imagePrompt: 'cute kawaii smartphone ringing' },
  { id: 'ob_11', korean: '냉장고', romanization: 'naengjanggo', english: 'Refrigerator', partOfSpeech: 'noun', category: 'objects', level: 'intermediate', imagePrompt: 'cute kawaii fridge full of food' },
  { id: 'ob_12', korean: '침대', romanization: 'chimdae', english: 'Bed', partOfSpeech: 'noun', category: 'objects', level: 'beginner', imagePrompt: 'cute kawaii cozy bed pillow' },

  // === EXPANDED VERBS (15 more) ===
  { id: 've_16', korean: '가르치다', romanization: 'gareuchida', english: 'To teach', partOfSpeech: 'verb', category: 'verbs', level: 'intermediate', example: { korean: '한국어를 가르치다', english: 'To teach Korean', romanization: 'hangugeo-reul gareuchida' }, imagePrompt: 'cute kawaii teacher explaining at board' },
  { id: 've_17', korean: '배우다', romanization: 'baeuda', english: 'To learn', partOfSpeech: 'verb', category: 'verbs', level: 'beginner', example: { korean: '한국어를 배우다', english: 'To learn Korean', romanization: 'hangugeo-reul baeuda' }, imagePrompt: 'cute kawaii student studying happily' },
  { id: 've_18', korean: '자다', romanization: 'jada', english: 'To sleep', partOfSpeech: 'verb', category: 'verbs', level: 'beginner', example: { korean: '일찍 자다', english: 'To sleep early', romanization: 'iljjik jada' }, imagePrompt: 'cute kawaii person sleeping in bed' },
  { id: 've_19', korean: '일어나다', romanization: 'ireonada', english: 'To wake up / get up', partOfSpeech: 'verb', category: 'verbs', level: 'beginner', example: { korean: '아침에 일어나다', english: 'To wake up in the morning', romanization: 'achime ireonada' }, imagePrompt: 'cute kawaii person stretching morning' },
  { id: 've_20', korean: '앉다', romanization: 'anda', english: 'To sit', partOfSpeech: 'verb', category: 'verbs', level: 'beginner', example: { korean: '의자에 앉다', english: 'To sit on a chair', romanization: 'uijae anda' }, imagePrompt: 'cute kawaii person sitting on chair' },
  { id: 've_21', korean: '서다', romanization: 'seoda', english: 'To stand', partOfSpeech: 'verb', category: 'verbs', level: 'beginner', example: { korean: '줄을 서다', english: 'To stand in line', romanization: 'jureul seoda' }, imagePrompt: 'cute kawaii person standing straight' },
  { id: 've_22', korean: '걷다', romanization: 'geotda', english: 'To walk', partOfSpeech: 'verb', category: 'verbs', level: 'beginner', example: { korean: '공원을 걷다', english: 'To walk in the park', romanization: 'gongwoneul geotda' }, imagePrompt: 'cute kawaii person walking in park' },
  { id: 've_23', korean: '뛰다', romanization: 'ttwida', english: 'To run / jump', partOfSpeech: 'verb', category: 'verbs', level: 'beginner', example: { korean: '빨리 뛰다', english: 'To run fast', romanization: 'ppalli ttwida' }, imagePrompt: 'cute kawaii person running fast' },
  { id: 've_24', korean: '놀다', romanization: 'nolda', english: 'To play / hang out', partOfSpeech: 'verb', category: 'verbs', level: 'beginner', example: { korean: '친구와 놀다', english: 'To hang out with a friend', romanization: 'chinguwa nolda' }, imagePrompt: 'cute kawaii kids playing together' },
  { id: 've_25', korean: '웃다', romanization: 'utda', english: 'To laugh / smile', partOfSpeech: 'verb', category: 'verbs', level: 'beginner', example: { korean: '크게 웃다', english: 'To laugh loudly', romanization: 'keuge utda' }, imagePrompt: 'cute kawaii person laughing happily' },
  { id: 've_26', korean: '울다', romanization: 'ulda', english: 'To cry', partOfSpeech: 'verb', category: 'verbs', level: 'beginner', example: { korean: '슬퍼서 울다', english: 'To cry because of sadness', romanization: 'seulpeoseo ulda' }, imagePrompt: 'cute kawaii person crying tears' },
  { id: 've_27', korean: '열다', romanization: 'yeolda', english: 'To open', partOfSpeech: 'verb', category: 'verbs', level: 'beginner', example: { korean: '문을 열다', english: 'To open a door', romanization: 'muneul yeolda' }, imagePrompt: 'cute kawaii person opening door' },
  { id: 've_28', korean: '닫다', romanization: 'datda', english: 'To close', partOfSpeech: 'verb', category: 'verbs', level: 'beginner', example: { korean: '문을 닫다', english: 'To close a door', romanization: 'muneul datda' }, imagePrompt: 'cute kawaii person closing door' },
  { id: 've_29', korean: '주다', romanization: 'juda', english: 'To give', partOfSpeech: 'verb', category: 'verbs', level: 'beginner', example: { korean: '선물을 주다', english: 'To give a gift', romanization: 'seonmureul juda' }, imagePrompt: 'cute kawaii person giving gift' },
  { id: 've_30', korean: '받다', romanization: 'batda', english: 'To receive', partOfSpeech: 'verb', category: 'verbs', level: 'beginner', example: { korean: '편지를 받다', english: 'To receive a letter', romanization: 'pyeonjireul batda' }, imagePrompt: 'cute kawaii person receiving package' },

  // === EXPANDED ADJECTIVES (15 more) ===
  { id: 'ad_13', korean: '새롭다', romanization: 'saeropda', english: 'New', partOfSpeech: 'adjective', category: 'adjectives', level: 'intermediate', example: { korean: '새로운 친구', english: 'A new friend', romanization: 'saeroun chingu' }, imagePrompt: 'cute kawaii shiny new gift box' },
  { id: 'ad_14', korean: '오래되다', romanization: 'oraedoeda', english: 'Old (things)', partOfSpeech: 'adjective', category: 'adjectives', level: 'intermediate', example: { korean: '오래된 집', english: 'An old house', romanization: 'oraedoen jip' }, imagePrompt: 'cute kawaii antique vintage clock' },
  { id: 'ad_15', korean: '빠르다', romanization: 'ppareuda', english: 'Fast / Quick', partOfSpeech: 'adjective', category: 'adjectives', level: 'beginner', example: { korean: '차가 빠르다', english: 'The car is fast', romanization: 'chaga ppareuda' }, imagePrompt: 'cute kawaii racing car speed lines' },
  { id: 'ad_16', korean: '느리다', romanization: 'neurida', english: 'Slow', partOfSpeech: 'adjective', category: 'adjectives', level: 'beginner', example: { korean: '거북이가 느리다', english: 'The turtle is slow', romanization: 'geobugiga neurida' }, imagePrompt: 'cute kawaii slow snail crawling' },
  { id: 'ad_17', korean: '무겁다', romanization: 'mugeopda', english: 'Heavy', partOfSpeech: 'adjective', category: 'adjectives', level: 'intermediate', example: { korean: '가방이 무겁다', english: 'The bag is heavy', romanization: 'gabangi mugeopda' }, imagePrompt: 'cute kawaii person lifting heavy box' },
  { id: 'ad_18', korean: '가볍다', romanization: 'gabyeopda', english: 'Light (weight)', partOfSpeech: 'adjective', category: 'adjectives', level: 'intermediate', example: { korean: '깃털처럼 가볍다', english: 'Light as a feather', romanization: 'gitteolcheoreom gabyeopda' }, imagePrompt: 'cute kawaii floating feather light' },
  { id: 'ad_19', korean: '깨끗하다', romanization: 'kkaekkeuthada', english: 'Clean', partOfSpeech: 'adjective', category: 'adjectives', level: 'beginner', example: { korean: '방이 깨끗하다', english: 'The room is clean', romanization: 'bangi kkaekkeuthada' }, imagePrompt: 'cute kawaii sparkling clean room' },
  { id: 'ad_20', korean: '더럽다', romanization: 'deoreopda', english: 'Dirty', partOfSpeech: 'adjective', category: 'adjectives', level: 'intermediate', example: { korean: '옷이 더럽다', english: 'The clothes are dirty', romanization: 'osi deoreopda' }, imagePrompt: 'cute kawaii muddy puddle splash' },
  { id: 'ad_21', korean: '건강하다', romanization: 'geonganghada', english: 'Healthy', partOfSpeech: 'adjective', category: 'adjectives', level: 'intermediate', example: { korean: '건강한 음식을 먹다', english: 'To eat healthy food', romanization: 'geonganhan eumsigeul meokda' }, imagePrompt: 'cute kawaii healthy person flexing' },
  { id: 'ad_22', korean: '비싸다', romanization: 'bissada', english: 'Expensive', partOfSpeech: 'adjective', category: 'adjectives', level: 'beginner', example: { korean: '이것은 비싸다', english: 'This is expensive', romanization: 'igeoseun bissada' }, imagePrompt: 'cute kawaii diamond jewelry sparkle' },
  { id: 'ad_23', korean: '싸다', romanization: 'ssada', english: 'Cheap / Inexpensive', partOfSpeech: 'adjective', category: 'adjectives', level: 'beginner', example: { korean: '시장이 싸다', english: 'The market is cheap', romanization: 'sijangi ssada' }, imagePrompt: 'cute kawaii sale discount tag' },
  { id: 'ad_24', korean: '귀엽다', romanization: 'gwiyeopda', english: 'Cute', partOfSpeech: 'adjective', category: 'adjectives', level: 'beginner', example: { korean: '아기가 귀엽다', english: 'The baby is cute', romanization: 'agiga gwiyeopda' }, imagePrompt: 'cute kawaii adorable puppy eyes' },
  { id: 'ad_25', korean: '무섭다', romanization: 'museopda', english: 'Scary / Frightening', partOfSpeech: 'adjective', category: 'adjectives', level: 'beginner', example: { korean: '영화가 무섭다', english: 'The movie is scary', romanization: 'yeonghwaga museopda' }, imagePrompt: 'cute kawaii ghost spooky face' },
  { id: 'ad_26', korean: '길다', romanization: 'gilda', english: 'Long', partOfSpeech: 'adjective', category: 'adjectives', level: 'beginner', example: { korean: '머리가 길다', english: 'Hair is long', romanization: 'meoriga gilda' }, imagePrompt: 'cute kawaii long giraffe neck' },
  { id: 'ad_27', korean: '짧다', romanization: 'jjalda', english: 'Short (length)', partOfSpeech: 'adjective', category: 'adjectives', level: 'beginner', example: { korean: '치마가 짧다', english: 'The skirt is short', romanization: 'chimaga jjalda' }, imagePrompt: 'cute kawaii short pencil stub' },

  // === EXPANDED FOOD (12 more) ===
  { id: 'fo_19', korean: '피자', romanization: 'pija', english: 'Pizza', partOfSpeech: 'noun', category: 'food', level: 'beginner', imagePrompt: 'cute kawaii cheesy pizza slice' },
  { id: 'fo_20', korean: '야채', romanization: 'yachae', english: 'Vegetables', partOfSpeech: 'noun', category: 'food', level: 'beginner', imagePrompt: 'cute kawaii fresh vegetables basket' },
  { id: 'fo_21', korean: '우유', romanization: 'uyu', english: 'Milk', partOfSpeech: 'noun', category: 'food', level: 'beginner', imagePrompt: 'cute kawaii milk carton glass' },
  { id: 'fo_22', korean: '소고기', romanization: 'sogogi', english: 'Beef', partOfSpeech: 'noun', category: 'food', level: 'beginner', imagePrompt: 'cute kawaii beef steak plate' },
  { id: 'fo_23', korean: '돼지고기', romanization: 'dwaejigogi', english: 'Pork', partOfSpeech: 'noun', category: 'food', level: 'beginner', imagePrompt: 'cute kawaii pork cutlet tonkatsu' },
  { id: 'fo_24', korean: '생선', romanization: 'saengseon', english: 'Fish (food)', partOfSpeech: 'noun', category: 'food', level: 'beginner', imagePrompt: 'cute kawaii grilled fish plate' },
  { id: 'fo_25', korean: '주스', romanization: 'juseu', english: 'Juice', partOfSpeech: 'noun', category: 'food', level: 'beginner', imagePrompt: 'cute kawaii orange juice glass' },
  { id: 'fo_26', korean: '국', romanization: 'guk', english: 'Soup', partOfSpeech: 'noun', category: 'food', level: 'beginner', example: { korean: '된장국', english: 'Soybean paste soup', romanization: 'doenjangguk' }, imagePrompt: 'cute kawaii steaming soup bowl' },
  { id: 'fo_27', korean: '케이크', romanization: 'keikeu', english: 'Cake', partOfSpeech: 'noun', category: 'food', level: 'beginner', imagePrompt: 'cute kawaii birthday cake candles' },
  { id: 'fo_28', korean: '초콜릿', romanization: 'chokollit', english: 'Chocolate', partOfSpeech: 'noun', category: 'food', level: 'beginner', imagePrompt: 'cute kawaii chocolate bar sweet' },
  { id: 'fo_29', korean: '사탕', romanization: 'satang', english: 'Candy', partOfSpeech: 'noun', category: 'food', level: 'beginner', imagePrompt: 'cute kawaii colorful candy lollipop' },
  { id: 'fo_30', korean: '떡', romanization: 'tteok', english: 'Rice cake', partOfSpeech: 'noun', category: 'food', level: 'beginner', notes: 'Traditional Korean rice cake', imagePrompt: 'cute kawaii colorful rice cakes' },

  // === EXPANDED PLACES (10 more) ===
  { id: 'pl_11', korean: '공원', romanization: 'gongwon', english: 'Park', partOfSpeech: 'noun', category: 'places', level: 'beginner', imagePrompt: 'cute kawaii park bench trees' },
  { id: 'pl_12', korean: '도서관', romanization: 'doseogwan', english: 'Library', partOfSpeech: 'noun', category: 'places', level: 'beginner', imagePrompt: 'cute kawaii library bookshelves reading' },
  { id: 'pl_13', korean: '시장', romanization: 'sijang', english: 'Market', partOfSpeech: 'noun', category: 'places', level: 'beginner', example: { korean: '시장에 가다', english: 'To go to the market', romanization: 'sijange gada' }, imagePrompt: 'cute kawaii busy market stalls' },
  { id: 'pl_14', korean: '역', romanization: 'yeok', english: 'Station', partOfSpeech: 'noun', category: 'places', level: 'beginner', example: { korean: '서울역', english: 'Seoul Station', romanization: 'seouyeok' }, imagePrompt: 'cute kawaii train station platform' },
  { id: 'pl_15', korean: '호텔', romanization: 'hotel', english: 'Hotel', partOfSpeech: 'noun', category: 'places', level: 'beginner', imagePrompt: 'cute kawaii hotel building entrance' },
  { id: 'pl_16', korean: '교회', romanization: 'gyohoe', english: 'Church', partOfSpeech: 'noun', category: 'places', level: 'intermediate', imagePrompt: 'cute kawaii church building steeple' },
  { id: 'pl_17', korean: '극장', romanization: 'geukjang', english: 'Theater', partOfSpeech: 'noun', category: 'places', level: 'intermediate', imagePrompt: 'cute kawaii movie theater screen' },
  { id: 'pl_18', korean: '약국', romanization: 'yakguk', english: 'Pharmacy', partOfSpeech: 'noun', category: 'places', level: 'beginner', imagePrompt: 'cute kawaii pharmacy cross store' },
  { id: 'pl_19', korean: '우체국', romanization: 'ucheguk', english: 'Post office', partOfSpeech: 'noun', category: 'places', level: 'intermediate', imagePrompt: 'cute kawaii post office mailbox' },
  { id: 'pl_20', korean: '백화점', romanization: 'baekhwajeom', english: 'Department store', partOfSpeech: 'noun', category: 'places', level: 'intermediate', imagePrompt: 'cute kawaii department store shopping' },

  // === EXPANDED DAILY LIFE (10 more) ===
  { id: 'da_16', korean: '컴퓨터', romanization: 'keompyuteo', english: 'Computer', partOfSpeech: 'noun', category: 'daily', level: 'beginner', imagePrompt: 'cute kawaii laptop computer screen' },
  { id: 'da_17', korean: '텔레비전', romanization: 'tellebijeon', english: 'Television / TV', partOfSpeech: 'noun', category: 'daily', level: 'beginner', imagePrompt: 'cute kawaii TV screen remote' },
  { id: 'da_18', korean: '노래', romanization: 'norae', english: 'Song', partOfSpeech: 'noun', category: 'daily', level: 'beginner', example: { korean: '노래를 부르다', english: 'To sing a song', romanization: 'noraereul bureuda' }, imagePrompt: 'cute kawaii musical note microphone' },
  { id: 'da_19', korean: '뉴스', romanization: 'nyuseu', english: 'News', partOfSpeech: 'noun', category: 'daily', level: 'beginner', imagePrompt: 'cute kawaii newspaper headlines' },
  { id: 'da_20', korean: '선물', romanization: 'seonmul', english: 'Gift / Present', partOfSpeech: 'noun', category: 'daily', level: 'beginner', imagePrompt: 'cute kawaii wrapped gift box bow' },
  { id: 'da_21', korean: '편지', romanization: 'pyeonji', english: 'Letter', partOfSpeech: 'noun', category: 'daily', level: 'beginner', imagePrompt: 'cute kawaii letter envelope heart' },
  { id: 'da_22', korean: '인터넷', romanization: 'inteonet', english: 'Internet', partOfSpeech: 'noun', category: 'daily', level: 'beginner', imagePrompt: 'cute kawaii wifi signal globe' },
  { id: 'da_23', korean: '숙제', romanization: 'sukje', english: 'Homework', partOfSpeech: 'noun', category: 'daily', level: 'beginner', example: { korean: '숙제를 하다', english: 'To do homework', romanization: 'sukjereul hada' }, imagePrompt: 'cute kawaii homework books pencil' },
  { id: 'da_24', korean: '시험', romanization: 'siheom', english: 'Exam / Test', partOfSpeech: 'noun', category: 'daily', level: 'intermediate', imagePrompt: 'cute kawaii test paper pencil' },
  { id: 'da_25', korean: '약속', romanization: 'yaksok', english: 'Promise / Appointment', partOfSpeech: 'noun', category: 'daily', level: 'beginner', example: { korean: '약속을 지키다', english: 'To keep a promise', romanization: 'yaksogeul jikida' }, imagePrompt: 'cute kawaii pinky promise hands' },

  // === EXPANDED EMOTIONS (10 more) ===
  { id: 'em_13', korean: '놀라다', romanization: 'nollada', english: 'Surprised / Startled', partOfSpeech: 'verb', category: 'emotions', level: 'beginner', example: { korean: '깜짝 놀라다', english: 'To be startled', romanization: 'kkamjjak nollada' }, imagePrompt: 'cute kawaii surprised shocked face' },
  { id: 'em_14', korean: '자신감', romanization: 'jasingam', english: 'Confidence', partOfSpeech: 'noun', category: 'emotions', level: 'intermediate', imagePrompt: 'cute kawaii confident person superhero' },
  { id: 'em_15', korean: '귀찮다', romanization: 'gwichanta', english: 'Annoying / Bothersome', partOfSpeech: 'adjective', category: 'emotions', level: 'intermediate', example: { korean: '귀찮아요', english: 'It\'s annoying / I can\'t be bothered', romanization: 'gwichanayo' }, imagePrompt: 'cute kawaii annoyed face grumble' },
  { id: 'em_16', korean: '지루하다', romanization: 'jiruhada', english: 'Boring', partOfSpeech: 'adjective', category: 'emotions', level: 'intermediate', imagePrompt: 'cute kawaii bored sleepy eyes' },
  { id: 'em_17', korean: '신나다', romanization: 'sinnada', english: 'Excited / Thrilled', partOfSpeech: 'verb', category: 'emotions', level: 'beginner', example: { korean: '여행이 신나다', english: 'Excited about the trip', romanization: 'yeohaengi sinnada' }, imagePrompt: 'cute kawaii excited jumping person' },
  { id: 'em_18', korean: '감동적이다', romanization: 'gamdongjeoigida', english: 'Touching / Moving', partOfSpeech: 'adjective', category: 'emotions', level: 'advanced', imagePrompt: 'cute kawaii tearful happy face' },
  { id: 'em_19', korean: '실망하다', romanization: 'silmanghada', english: 'Disappointed', partOfSpeech: 'verb', category: 'emotions', level: 'intermediate', example: { korean: '결과에 실망하다', english: 'To be disappointed with the result', romanization: 'gyeolgwae silmanghada' }, imagePrompt: 'cute kawaii disappointed droopy face' },
  { id: 'em_20', korean: '질투하다', romanization: 'jiltuhada', english: 'Jealous', partOfSpeech: 'verb', category: 'emotions', level: 'intermediate', imagePrompt: 'cute kawaii jealous green face' },
  { id: 'em_21', korean: '감사하다', romanization: 'gamsahada', english: 'Grateful / Thankful', partOfSpeech: 'adjective', category: 'emotions', level: 'beginner', imagePrompt: 'cute kawaii grateful praying hands' },
  { id: 'em_22', korean: '후회하다', romanization: 'huhoehada', english: 'To regret', partOfSpeech: 'verb', category: 'emotions', level: 'intermediate', imagePrompt: 'cute kawaii regretful person sighing' },

  // === EXPANDED BODY PARTS (8 more) ===
  { id: 'bo_13', korean: '무릎', romanization: 'mureup', english: 'Knee', partOfSpeech: 'noun', category: 'body', level: 'intermediate', imagePrompt: 'cute kawaii knee joint bending' },
  { id: 'bo_14', korean: '허리', romanization: 'heori', english: 'Waist / Lower back', partOfSpeech: 'noun', category: 'body', level: 'intermediate', example: { korean: '허리가 아프다', english: 'My back hurts', romanization: 'heoriga apeuda' }, imagePrompt: 'cute kawaii person stretching waist' },
  { id: 'bo_15', korean: '목', romanization: 'mok', english: 'Neck / Throat', partOfSpeech: 'noun', category: 'body', level: 'beginner', example: { korean: '목이 아프다', english: 'My throat hurts', romanization: 'mogi apeuda' }, imagePrompt: 'cute kawaii person touching neck' },
  { id: 'bo_16', korean: '가슴', romanization: 'gaseum', english: 'Chest', partOfSpeech: 'noun', category: 'body', level: 'intermediate', imagePrompt: 'cute kawaii chest heart beat' },
  { id: 'bo_17', korean: '등', romanization: 'deung', english: 'Back (body)', partOfSpeech: 'noun', category: 'body', level: 'beginner', imagePrompt: 'cute kawaii person showing back' },
  { id: 'bo_18', korean: '손가락', romanization: 'songarak', english: 'Finger', partOfSpeech: 'noun', category: 'body', level: 'beginner', imagePrompt: 'cute kawaii hand with fingers spread' },
  { id: 'bo_19', korean: '발가락', romanization: 'balgarak', english: 'Toe', partOfSpeech: 'noun', category: 'body', level: 'intermediate', imagePrompt: 'cute kawaii wiggling toes foot' },
  { id: 'bo_20', korean: '이', romanization: 'i', english: 'Tooth', partOfSpeech: 'noun', category: 'body', level: 'beginner', example: { korean: '이를 닦다', english: 'To brush teeth', romanization: 'ireul dakda' }, imagePrompt: 'cute kawaii sparkling white tooth' },

  // === EXPANDED COLORS (5 more) ===
  { id: 'co_11', korean: '금색', romanization: 'geumsaek', english: 'Gold', partOfSpeech: 'noun', category: 'colors', level: 'intermediate', imagePrompt: 'cute kawaii shiny gold treasure' },
  { id: 'co_12', korean: '은색', romanization: 'eunsaek', english: 'Silver', partOfSpeech: 'noun', category: 'colors', level: 'intermediate', imagePrompt: 'cute kawaii shiny silver star' },
  { id: 'co_13', korean: '회색', romanization: 'hoesaek', english: 'Gray', partOfSpeech: 'noun', category: 'colors', level: 'beginner', imagePrompt: 'cute kawaii gray rain cloud' },
  { id: 'co_14', korean: '하늘색', romanization: 'haneulsaek', english: 'Sky blue', partOfSpeech: 'noun', category: 'colors', level: 'intermediate', imagePrompt: 'cute kawaii light blue sky' },
  { id: 'co_15', korean: '남색', romanization: 'namsaek', english: 'Navy / Indigo', partOfSpeech: 'noun', category: 'colors', level: 'intermediate', imagePrompt: 'cute kawaii dark blue night sky' },

  // === EXPANDED OBJECTS (10 more) ===
  { id: 'ob_13', korean: '지갑', romanization: 'jigap', english: 'Wallet', partOfSpeech: 'noun', category: 'objects', level: 'beginner', imagePrompt: 'cute kawaii wallet with money' },
  { id: 'ob_14', korean: '모자', romanization: 'moja', english: 'Hat / Cap', partOfSpeech: 'noun', category: 'objects', level: 'beginner', imagePrompt: 'cute kawaii colorful baseball cap' },
  { id: 'ob_15', korean: '신발', romanization: 'sinbal', english: 'Shoes', partOfSpeech: 'noun', category: 'objects', level: 'beginner', imagePrompt: 'cute kawaii pair of sneakers' },
  { id: 'ob_16', korean: '양말', romanization: 'yangmal', english: 'Socks', partOfSpeech: 'noun', category: 'objects', level: 'beginner', imagePrompt: 'cute kawaii colorful striped socks' },
  { id: 'ob_17', korean: '연필', romanization: 'yeonpil', english: 'Pencil', partOfSpeech: 'noun', category: 'objects', level: 'beginner', imagePrompt: 'cute kawaii yellow pencil writing' },
  { id: 'ob_18', korean: '책', romanization: 'chaek', english: 'Book', partOfSpeech: 'noun', category: 'objects', level: 'beginner', imagePrompt: 'cute kawaii open book reading' },
  { id: 'ob_19', korean: '의자', romanization: 'uija', english: 'Chair', partOfSpeech: 'noun', category: 'objects', level: 'beginner', imagePrompt: 'cute kawaii comfortable chair seat' },
  { id: 'ob_20', korean: '책상', romanization: 'chaeksang', english: 'Desk', partOfSpeech: 'noun', category: 'objects', level: 'beginner', imagePrompt: 'cute kawaii study desk lamp' },
  { id: 'ob_21', korean: '창문', romanization: 'changmun', english: 'Window', partOfSpeech: 'noun', category: 'objects', level: 'beginner', imagePrompt: 'cute kawaii window sunshine view' },
  { id: 'ob_22', korean: '문', romanization: 'mun', english: 'Door', partOfSpeech: 'noun', category: 'objects', level: 'beginner', imagePrompt: 'cute kawaii door with doorknob' },

  // === EXPANDED ANIMALS (8 more) ===
  { id: 'an_13', korean: '곰', romanization: 'gom', english: 'Bear', partOfSpeech: 'noun', category: 'animals', level: 'beginner', imagePrompt: 'cute kawaii teddy bear honey' },
  { id: 'an_14', korean: '사자', romanization: 'saja', english: 'Lion', partOfSpeech: 'noun', category: 'animals', level: 'beginner', imagePrompt: 'cute kawaii lion with mane' },
  { id: 'an_15', korean: '코끼리', romanization: 'kokkiri', english: 'Elephant', partOfSpeech: 'noun', category: 'animals', level: 'beginner', imagePrompt: 'cute kawaii elephant trunk up' },
  { id: 'an_16', korean: '원숭이', romanization: 'wonsungi', english: 'Monkey', partOfSpeech: 'noun', category: 'animals', level: 'beginner', imagePrompt: 'cute kawaii monkey banana tree' },
  { id: 'an_17', korean: '뱀', romanization: 'baem', english: 'Snake', partOfSpeech: 'noun', category: 'animals', level: 'intermediate', imagePrompt: 'cute kawaii friendly snake coiled' },
  { id: 'an_18', korean: '말', romanization: 'mal', english: 'Horse', partOfSpeech: 'noun', category: 'animals', level: 'beginner', imagePrompt: 'cute kawaii running horse meadow' },
  { id: 'an_19', korean: '양', romanization: 'yang', english: 'Sheep', partOfSpeech: 'noun', category: 'animals', level: 'beginner', imagePrompt: 'cute kawaii fluffy white sheep' },
  { id: 'an_20', korean: '호랑이', romanization: 'horangi', english: 'Tiger', partOfSpeech: 'noun', category: 'animals', level: 'beginner', notes: 'Symbol of Korea', imagePrompt: 'cute kawaii tiger stripes powerful' },

  // === EXPANDED WEATHER (5 more) ===
  { id: 'we_13', korean: '안개', romanization: 'angae', english: 'Fog', partOfSpeech: 'noun', category: 'weather', level: 'intermediate', imagePrompt: 'cute kawaii misty foggy morning' },
  { id: 'we_14', korean: '태풍', romanization: 'taepung', english: 'Typhoon', partOfSpeech: 'noun', category: 'weather', level: 'intermediate', imagePrompt: 'cute kawaii swirling typhoon storm' },
  { id: 'we_15', korean: '무지개', romanization: 'mujigae', english: 'Rainbow', partOfSpeech: 'noun', category: 'weather', level: 'beginner', imagePrompt: 'cute kawaii colorful rainbow arc' },
  { id: 'we_16', korean: '천둥', romanization: 'cheondung', english: 'Thunder', partOfSpeech: 'noun', category: 'weather', level: 'intermediate', imagePrompt: 'cute kawaii rumbling thunder clouds' },
  { id: 'we_17', korean: '번개', romanization: 'beongae', english: 'Lightning', partOfSpeech: 'noun', category: 'weather', level: 'intermediate', imagePrompt: 'cute kawaii lightning bolt flash' },

  // === EXPANDED NUMBERS (5 more) ===
  { id: 'nu_21', korean: '사', romanization: 'sa', english: 'Four (Sino-Korean)', partOfSpeech: 'number', category: 'numbers', level: 'beginner', imagePrompt: 'cute kawaii four squares blocks' },
  { id: 'nu_22', korean: '오', romanization: 'o', english: 'Five (Sino-Korean)', partOfSpeech: 'number', category: 'numbers', level: 'beginner', imagePrompt: 'cute kawaii five star rating' },
  { id: 'nu_23', korean: '육', romanization: 'yuk', english: 'Six (Sino-Korean)', partOfSpeech: 'number', category: 'numbers', level: 'beginner', imagePrompt: 'cute kawaii six sided dice' },
  { id: 'nu_24', korean: '칠', romanization: 'chil', english: 'Seven (Sino-Korean)', partOfSpeech: 'number', category: 'numbers', level: 'beginner', imagePrompt: 'cute kawaii lucky number seven' },
  { id: 'nu_25', korean: '팔', romanization: 'pal', english: 'Eight (Sino-Korean)', partOfSpeech: 'number', category: 'numbers', level: 'beginner', imagePrompt: 'cute kawaii figure eight infinity' },

  // === EXPANDED FAMILY (8 more) ===
  { id: 'fa_13', korean: '남편', romanization: 'nampyeon', english: 'Husband', partOfSpeech: 'noun', category: 'family', level: 'beginner', imagePrompt: 'cute kawaii husband in suit' },
  { id: 'fa_14', korean: '아내', romanization: 'anae', english: 'Wife', partOfSpeech: 'noun', category: 'family', level: 'beginner', imagePrompt: 'cute kawaii wife smiling warmly' },
  { id: 'fa_15', korean: '아들', romanization: 'adeul', english: 'Son', partOfSpeech: 'noun', category: 'family', level: 'beginner', imagePrompt: 'cute kawaii young boy son' },
  { id: 'fa_16', korean: '딸', romanization: 'ttal', english: 'Daughter', partOfSpeech: 'noun', category: 'family', level: 'beginner', imagePrompt: 'cute kawaii young girl daughter' },
  { id: 'fa_17', korean: '삼촌', romanization: 'samchon', english: 'Uncle', partOfSpeech: 'noun', category: 'family', level: 'intermediate', imagePrompt: 'cute kawaii uncle waving hello' },
  { id: 'fa_18', korean: '이모', romanization: 'imo', english: 'Aunt (mother\'s sister)', partOfSpeech: 'noun', category: 'family', level: 'intermediate', notes: 'Mother\'s side aunt; father\'s side is 고모 (gomo)', imagePrompt: 'cute kawaii aunt smiling warmly' },
  { id: 'fa_19', korean: '사촌', romanization: 'sachon', english: 'Cousin', partOfSpeech: 'noun', category: 'family', level: 'intermediate', imagePrompt: 'cute kawaii cousins playing together' },
  { id: 'fa_20', korean: '아기', romanization: 'agi', english: 'Baby', partOfSpeech: 'noun', category: 'family', level: 'beginner', imagePrompt: 'cute kawaii baby crawling smiling' },

  // === EXPANDED GREETINGS (5 more) ===
  { id: 'gr_16', korean: '잘 먹었습니다', romanization: 'jal meogeosseumnida', english: 'I ate well (after a meal)', partOfSpeech: 'phrase', category: 'greetings', level: 'beginner', notes: 'Said after eating, shows gratitude', imagePrompt: 'cute kawaii person satisfied after meal' },
  { id: 'gr_17', korean: '다녀오겠습니다', romanization: 'danyeoogesseumnida', english: 'I\'ll be back (leaving home)', partOfSpeech: 'phrase', category: 'greetings', level: 'intermediate', notes: 'Said when leaving home', imagePrompt: 'cute kawaii person leaving house waving' },
  { id: 'gr_18', korean: '다녀왔습니다', romanization: 'danyeowasseumnida', english: 'I\'m back (returning home)', partOfSpeech: 'phrase', category: 'greetings', level: 'intermediate', notes: 'Said when returning home', imagePrompt: 'cute kawaii person arriving home happy' },
  { id: 'gr_19', korean: '수고하셨습니다', romanization: 'sugohasyeosseumnida', english: 'You worked hard (good job)', partOfSpeech: 'phrase', category: 'greetings', level: 'intermediate', notes: 'Said to acknowledge someone\'s effort', imagePrompt: 'cute kawaii person clapping applause' },
  { id: 'gr_20', korean: '어서 오세요', romanization: 'eoseo oseyo', english: 'Welcome! (Come in)', partOfSpeech: 'phrase', category: 'greetings', level: 'beginner', notes: 'Common greeting at shops and restaurants', imagePrompt: 'cute kawaii shop owner welcoming' },

  // === EXPANDED TIME (5 more) ===
  { id: 'ti_13', korean: '목요일', romanization: 'mogyoil', english: 'Thursday', partOfSpeech: 'noun', category: 'time', level: 'beginner', imagePrompt: 'cute kawaii Thursday tree wood' },
  { id: 'ti_14', korean: '금요일', romanization: 'geumyoil', english: 'Friday', partOfSpeech: 'noun', category: 'time', level: 'beginner', imagePrompt: 'cute kawaii happy Friday celebration' },
  { id: 'ti_15', korean: '토요일', romanization: 'toyoil', english: 'Saturday', partOfSpeech: 'noun', category: 'time', level: 'beginner', imagePrompt: 'cute kawaii Saturday fun weekend' },
  { id: 'ti_16', korean: '일요일', romanization: 'iryoil', english: 'Sunday', partOfSpeech: 'noun', category: 'time', level: 'beginner', imagePrompt: 'cute kawaii Sunday relaxing sun' },
  { id: 'ti_17', korean: '낮', romanization: 'nat', english: 'Daytime / Noon', partOfSpeech: 'noun', category: 'time', level: 'beginner', imagePrompt: 'cute kawaii bright midday sun' },

  // === BONUS VERBS ===
  { id: 've_31', korean: '기다리다', romanization: 'gidarida', english: 'To wait', partOfSpeech: 'verb', category: 'verbs', level: 'beginner', example: { korean: '버스를 기다리다', english: 'To wait for the bus', romanization: 'beoseureul gidarida' }, imagePrompt: 'cute kawaii person waiting patiently' },
  { id: 've_32', korean: '타다', romanization: 'tada', english: 'To ride / get on', partOfSpeech: 'verb', category: 'verbs', level: 'beginner', example: { korean: '버스를 타다', english: 'To ride the bus', romanization: 'beoseureul tada' }, imagePrompt: 'cute kawaii person riding bus' },
  { id: 've_33', korean: '내리다', romanization: 'naerida', english: 'To get off / descend', partOfSpeech: 'verb', category: 'verbs', level: 'beginner', example: { korean: '지하철에서 내리다', english: 'To get off the subway', romanization: 'jihacheoreseo naerida' }, imagePrompt: 'cute kawaii person stepping off train' },
  { id: 've_34', korean: '씻다', romanization: 'ssitda', english: 'To wash', partOfSpeech: 'verb', category: 'verbs', level: 'beginner', example: { korean: '손을 씻다', english: 'To wash hands', romanization: 'soneul ssitda' }, imagePrompt: 'cute kawaii person washing hands' },
  { id: 've_35', korean: '입다', romanization: 'ipda', english: 'To wear (clothes)', partOfSpeech: 'verb', category: 'verbs', level: 'beginner', example: { korean: '옷을 입다', english: 'To wear clothes', romanization: 'oseul ipda' }, imagePrompt: 'cute kawaii person getting dressed' },

  // === BONUS DAILY LIFE ===
  { id: 'da_26', korean: '버스', romanization: 'beoseu', english: 'Bus', partOfSpeech: 'noun', category: 'daily', level: 'beginner', imagePrompt: 'cute kawaii city bus driving' },
  { id: 'da_27', korean: '택시', romanization: 'taeksi', english: 'Taxi', partOfSpeech: 'noun', category: 'daily', level: 'beginner', imagePrompt: 'cute kawaii yellow taxi cab' },
  { id: 'da_28', korean: '비행기', romanization: 'bihaenggi', english: 'Airplane', partOfSpeech: 'noun', category: 'daily', level: 'beginner', imagePrompt: 'cute kawaii airplane flying clouds' },
  { id: 'da_29', korean: '자동차', romanization: 'jadongcha', english: 'Car / Automobile', partOfSpeech: 'noun', category: 'daily', level: 'beginner', imagePrompt: 'cute kawaii red car driving' },
  { id: 'da_30', korean: '자전거', romanization: 'jajeongeo', english: 'Bicycle', partOfSpeech: 'noun', category: 'daily', level: 'beginner', imagePrompt: 'cute kawaii bicycle riding park' },

  // === BONUS OBJECTS ===
  { id: 'ob_23', korean: '텔레비전', romanization: 'tellebijeon', english: 'Television', partOfSpeech: 'noun', category: 'objects', level: 'beginner', imagePrompt: 'cute kawaii flat screen TV' },
  { id: 'ob_24', korean: '세탁기', romanization: 'setakgi', english: 'Washing machine', partOfSpeech: 'noun', category: 'objects', level: 'intermediate', imagePrompt: 'cute kawaii washing machine spinning' },
  { id: 'ob_25', korean: '에어컨', romanization: 'eeokeon', english: 'Air conditioner', partOfSpeech: 'noun', category: 'objects', level: 'intermediate', imagePrompt: 'cute kawaii air conditioner cool breeze' },

  // === BONUS PLACES ===
  { id: 'pl_21', korean: '경찰서', romanization: 'gyeongchalseo', english: 'Police station', partOfSpeech: 'noun', category: 'places', level: 'intermediate', imagePrompt: 'cute kawaii police station badge' },
  { id: 'pl_22', korean: '소방서', romanization: 'sobangseo', english: 'Fire station', partOfSpeech: 'noun', category: 'places', level: 'intermediate', imagePrompt: 'cute kawaii fire station truck' },

  // === BONUS FOOD ===
  { id: 'fo_31', korean: '닭갈비', romanization: 'dakgalbi', english: 'Spicy stir-fried chicken', partOfSpeech: 'noun', category: 'food', level: 'intermediate', notes: 'Popular Korean dish from Chuncheon', imagePrompt: 'cute kawaii spicy chicken stir fry' },
  { id: 'fo_32', korean: '김밥', romanization: 'gimbap', english: 'Seaweed rice roll', partOfSpeech: 'noun', category: 'food', level: 'beginner', notes: 'Korean-style sushi roll, popular snack', imagePrompt: 'cute kawaii gimbap seaweed roll sliced' },

  // === BONUS ADJECTIVES ===
  { id: 'ad_28', korean: '넓다', romanization: 'neolda', english: 'Wide / Spacious', partOfSpeech: 'adjective', category: 'adjectives', level: 'intermediate', example: { korean: '방이 넓다', english: 'The room is spacious', romanization: 'bangi neolda' }, imagePrompt: 'cute kawaii wide open field' },
  { id: 'ad_29', korean: '좁다', romanization: 'jopda', english: 'Narrow / Cramped', partOfSpeech: 'adjective', category: 'adjectives', level: 'intermediate', example: { korean: '길이 좁다', english: 'The road is narrow', romanization: 'giri jopda' }, imagePrompt: 'cute kawaii narrow alley path' },

  // === BONUS EMOTIONS ===
  { id: 'em_23', korean: '답답하다', romanization: 'dapdaphada', english: 'Frustrated / Stuffy', partOfSpeech: 'adjective', category: 'emotions', level: 'intermediate', notes: 'Feeling of frustration or suffocation', imagePrompt: 'cute kawaii frustrated person steam' },
  { id: 'em_24', korean: '설레다', romanization: 'seolleda', english: 'Flutter / Excited (romantic)', partOfSpeech: 'verb', category: 'emotions', level: 'intermediate', notes: 'Butterflies in stomach, heart fluttering', imagePrompt: 'cute kawaii heart fluttering butterflies' },

  // === EXPANSION PACKS ===
  ...expansionWords1,
  ...expansionWords2,
  ...expansionWords3,
];

export function getWordsByCategory(category: VocabCategory): VocabWord[] {
  return vocabulary.filter((w) => w.category === category);
}

export function getWordById(id: string): VocabWord | undefined {
  return vocabulary.find((w) => w.id === id);
}

export const allCategories: VocabCategory[] = ['greetings', 'numbers', 'family', 'food', 'colors', 'time', 'places', 'verbs', 'adjectives', 'daily', 'body', 'weather', 'emotions', 'animals', 'objects', 'travel', 'shopping', 'school', 'work', 'health', 'clothing', 'transport', 'nature', 'house', 'technology'];

export type VocabCategory = 'greetings' | 'numbers' | 'family' | 'food' | 'colors' | 'time' | 'places' | 'verbs' | 'adjectives' | 'daily';

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
  const prompt = encodeURIComponent(word.imagePrompt + ', flat illustration, pastel colors, simple, no text');
  const seed = word.id.charCodeAt(0) * 100 + word.id.charCodeAt(3) * 10;
  return `https://gen.pollinations.ai/image/${prompt}?width=200&height=200&seed=${seed}&nologo=true&model=flux`;
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
];

export function getWordsByCategory(category: VocabCategory): VocabWord[] {
  return vocabulary.filter((w) => w.category === category);
}

export function getWordById(id: string): VocabWord | undefined {
  return vocabulary.find((w) => w.id === id);
}

export const allCategories: VocabCategory[] = ['greetings', 'numbers', 'family', 'food', 'colors', 'time', 'places', 'verbs', 'adjectives', 'daily'];

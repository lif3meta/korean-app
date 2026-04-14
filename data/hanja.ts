export interface HanjaWord {
  korean: string;
  english: string;
  romanization: string;
  hanjaComposition: string;
}

export interface HanjaCharacter {
  id: string;
  hanja: string;
  korean: string;
  romanization: string;
  meaning: string;
  words: HanjaWord[];
}

export const hanjaCharacters: HanjaCharacter[] = [
  {
    id: 'hanja-hak',
    hanja: '學',
    korean: '학',
    romanization: 'hak',
    meaning: 'study',
    words: [
      { korean: '학교', english: 'school', romanization: 'hakgyo', hanjaComposition: '學 + 校' },
      { korean: '학생', english: 'student', romanization: 'haksaeng', hanjaComposition: '學 + 生' },
      { korean: '대학', english: 'university', romanization: 'daehak', hanjaComposition: '大 + 學' },
      { korean: '학원', english: 'academy/institute', romanization: 'hagwon', hanjaComposition: '學 + 院' },
      { korean: '과학', english: 'science', romanization: 'gwahak', hanjaComposition: '科 + 學' },
    ],
  },
  {
    id: 'hanja-saeng',
    hanja: '生',
    korean: '생',
    romanization: 'saeng',
    meaning: 'life/birth',
    words: [
      { korean: '학생', english: 'student', romanization: 'haksaeng', hanjaComposition: '學 + 生' },
      { korean: '생일', english: 'birthday', romanization: 'saengil', hanjaComposition: '生 + 日' },
      { korean: '생활', english: 'daily life/livelihood', romanization: 'saenghwal', hanjaComposition: '生 + 活' },
      { korean: '선생님', english: 'teacher', romanization: 'seonsaengnim', hanjaComposition: '先 + 生 + 님' },
    ],
  },
  {
    id: 'hanja-in',
    hanja: '人',
    korean: '인',
    romanization: 'in',
    meaning: 'person',
    words: [
      { korean: '한국인', english: 'Korean person', romanization: 'hangugin', hanjaComposition: '韓 + 國 + 人' },
      { korean: '인기', english: 'popularity', romanization: 'ingi', hanjaComposition: '人 + 氣' },
      { korean: '인사', english: 'greeting', romanization: 'insa', hanjaComposition: '人 + 事' },
      { korean: '외국인', english: 'foreigner', romanization: 'oegugin', hanjaComposition: '外 + 國 + 人' },
    ],
  },
  {
    id: 'hanja-dae',
    hanja: '大',
    korean: '대',
    romanization: 'dae',
    meaning: 'big/great',
    words: [
      { korean: '대학', english: 'university', romanization: 'daehak', hanjaComposition: '大 + 學' },
      { korean: '대한민국', english: 'Republic of Korea', romanization: 'daehanminguk', hanjaComposition: '大 + 韓 + 民 + 國' },
      { korean: '대통령', english: 'president', romanization: 'daetongnyeong', hanjaComposition: '大 + 統 + 領' },
    ],
  },
  {
    id: 'hanja-han',
    hanja: '韓',
    korean: '한',
    romanization: 'han',
    meaning: 'Korea',
    words: [
      { korean: '한국', english: 'South Korea', romanization: 'hanguk', hanjaComposition: '韓 + 國' },
      { korean: '한국어', english: 'Korean language', romanization: 'hangugeo', hanjaComposition: '韓 + 國 + 語' },
      { korean: '한국인', english: 'Korean person', romanization: 'hangugin', hanjaComposition: '韓 + 國 + 人' },
      { korean: '대한민국', english: 'Republic of Korea', romanization: 'daehanminguk', hanjaComposition: '大 + 韓 + 民 + 國' },
    ],
  },
  {
    id: 'hanja-guk',
    hanja: '國',
    korean: '국',
    romanization: 'guk',
    meaning: 'country',
    words: [
      { korean: '한국', english: 'South Korea', romanization: 'hanguk', hanjaComposition: '韓 + 國' },
      { korean: '미국', english: 'United States', romanization: 'miguk', hanjaComposition: '美 + 國' },
      { korean: '외국', english: 'foreign country', romanization: 'oeguk', hanjaComposition: '外 + 國' },
      { korean: '국가', english: 'nation/country', romanization: 'gukga', hanjaComposition: '國 + 家' },
      { korean: '중국', english: 'China', romanization: 'jungguk', hanjaComposition: '中 + 國' },
    ],
  },
  {
    id: 'hanja-eo',
    hanja: '語',
    korean: '어',
    romanization: 'eo',
    meaning: 'language',
    words: [
      { korean: '한국어', english: 'Korean language', romanization: 'hangugeo', hanjaComposition: '韓 + 國 + 語' },
      { korean: '영어', english: 'English language', romanization: 'yeongeo', hanjaComposition: '英 + 語' },
      { korean: '일본어', english: 'Japanese language', romanization: 'ilboneo', hanjaComposition: '日 + 本 + 語' },
      { korean: '외국어', english: 'foreign language', romanization: 'oegugeo', hanjaComposition: '外 + 國 + 語' },
    ],
  },
  {
    id: 'hanja-il',
    hanja: '日',
    korean: '일',
    romanization: 'il',
    meaning: 'day/sun',
    words: [
      { korean: '생일', english: 'birthday', romanization: 'saengil', hanjaComposition: '生 + 日' },
      { korean: '일요일', english: 'Sunday', romanization: 'iryoil', hanjaComposition: '日 + 曜 + 日' },
      { korean: '매일', english: 'every day', romanization: 'maeil', hanjaComposition: '每 + 日' },
      { korean: '일본', english: 'Japan', romanization: 'ilbon', hanjaComposition: '日 + 本' },
    ],
  },
  {
    id: 'hanja-sik',
    hanja: '食',
    korean: '식',
    romanization: 'sik',
    meaning: 'food/eat',
    words: [
      { korean: '식당', english: 'restaurant', romanization: 'sikdang', hanjaComposition: '食 + 堂' },
      { korean: '음식', english: 'food', romanization: 'eumsik', hanjaComposition: '飮 + 食' },
      { korean: '식사', english: 'meal', romanization: 'siksa', hanjaComposition: '食 + 事' },
      { korean: '한식', english: 'Korean food', romanization: 'hansik', hanjaComposition: '韓 + 食' },
    ],
  },
  {
    id: 'hanja-su',
    hanja: '水',
    korean: '수',
    romanization: 'su',
    meaning: 'water',
    words: [
      { korean: '수영', english: 'swimming', romanization: 'suyeong', hanjaComposition: '水 + 泳' },
      { korean: '수요일', english: 'Wednesday', romanization: 'suyoil', hanjaComposition: '水 + 曜 + 日' },
      { korean: '음료수', english: 'beverage/drink', romanization: 'eumnyosu', hanjaComposition: '飮 + 料 + 水' },
    ],
  },
  {
    id: 'hanja-ga',
    hanja: '家',
    korean: '가',
    romanization: 'ga',
    meaning: 'house',
    words: [
      { korean: '가족', english: 'family', romanization: 'gajok', hanjaComposition: '家 + 族' },
      { korean: '가구', english: 'furniture', romanization: 'gagu', hanjaComposition: '家 + 具' },
      { korean: '작가', english: 'author/writer', romanization: 'jakga', hanjaComposition: '作 + 家' },
      { korean: '국가', english: 'nation/country', romanization: 'gukga', hanjaComposition: '國 + 家' },
    ],
  },
  {
    id: 'hanja-mun',
    hanja: '門',
    korean: '문',
    romanization: 'mun',
    meaning: 'door/gate',
    words: [
      { korean: '문화', english: 'culture', romanization: 'munhwa', hanjaComposition: '文 + 化' },
      { korean: '전문', english: 'specialty/expertise', romanization: 'jeonmun', hanjaComposition: '專 + 門' },
      { korean: '질문', english: 'question', romanization: 'jilmun', hanjaComposition: '質 + 問' },
    ],
  },
  {
    id: 'hanja-jung',
    hanja: '中',
    korean: '중',
    romanization: 'jung',
    meaning: 'middle',
    words: [
      { korean: '중국', english: 'China', romanization: 'jungguk', hanjaComposition: '中 + 國' },
      { korean: '중학교', english: 'middle school', romanization: 'junghakgyo', hanjaComposition: '中 + 學 + 校' },
      { korean: '중요', english: 'important', romanization: 'jungyo', hanjaComposition: '中 + 要' },
      { korean: '중심', english: 'center', romanization: 'jungsim', hanjaComposition: '中 + 心' },
    ],
  },
  {
    id: 'hanja-si',
    hanja: '時',
    korean: '시',
    romanization: 'si',
    meaning: 'time/hour',
    words: [
      { korean: '시간', english: 'time/hour', romanization: 'sigan', hanjaComposition: '時 + 間' },
      { korean: '시계', english: 'clock/watch', romanization: 'sigye', hanjaComposition: '時 + 計' },
      { korean: '시작', english: 'start/beginning', romanization: 'sijak', hanjaComposition: '始 + 作' },
    ],
  },
  {
    id: 'hanja-nyeon',
    hanja: '年',
    korean: '년',
    romanization: 'nyeon',
    meaning: 'year',
    words: [
      { korean: '작년', english: 'last year', romanization: 'jaknyeon', hanjaComposition: '昨 + 年' },
      { korean: '내년', english: 'next year', romanization: 'naenyeon', hanjaComposition: '來 + 年' },
      { korean: '올해', english: 'this year', romanization: 'olhae', hanjaComposition: '今 + 年 (native Korean)' },
      { korean: '매년', english: 'every year', romanization: 'maenyeon', hanjaComposition: '每 + 年' },
    ],
  },
  {
    id: 'hanja-gyo',
    hanja: '校',
    korean: '교',
    romanization: 'gyo',
    meaning: 'school',
    words: [
      { korean: '학교', english: 'school', romanization: 'hakgyo', hanjaComposition: '學 + 校' },
      { korean: '중학교', english: 'middle school', romanization: 'junghakgyo', hanjaComposition: '中 + 學 + 校' },
      { korean: '고등학교', english: 'high school', romanization: 'godeunghakgyo', hanjaComposition: '高 + 等 + 學 + 校' },
    ],
  },
  {
    id: 'hanja-seon',
    hanja: '先',
    korean: '선',
    romanization: 'seon',
    meaning: 'first/before',
    words: [
      { korean: '선생님', english: 'teacher', romanization: 'seonsaengnim', hanjaComposition: '先 + 生 + 님' },
      { korean: '선배', english: 'senior/elder', romanization: 'seonbae', hanjaComposition: '先 + 輩' },
      { korean: '우선', english: 'first of all/priority', romanization: 'useon', hanjaComposition: '于 + 先' },
    ],
  },
  {
    id: 'hanja-sim',
    hanja: '心',
    korean: '심',
    romanization: 'sim',
    meaning: 'heart/mind',
    words: [
      { korean: '중심', english: 'center', romanization: 'jungsim', hanjaComposition: '中 + 心' },
      { korean: '관심', english: 'interest/concern', romanization: 'gwansim', hanjaComposition: '關 + 心' },
      { korean: '안심', english: 'relief/peace of mind', romanization: 'ansim', hanjaComposition: '安 + 心' },
      { korean: '걱정', english: 'worry/concern', romanization: 'geokjeong', hanjaComposition: '心 (related)' },
    ],
  },
  {
    id: 'hanja-hoe',
    hanja: '會',
    korean: '회',
    romanization: 'hoe',
    meaning: 'meeting',
    words: [
      { korean: '회사', english: 'company', romanization: 'hoesa', hanjaComposition: '會 + 社' },
      { korean: '회의', english: 'meeting/conference', romanization: 'hoeui', hanjaComposition: '會 + 議' },
      { korean: '사회', english: 'society', romanization: 'sahoe', hanjaComposition: '社 + 會' },
      { korean: '기회', english: 'opportunity', romanization: 'gihoe', hanjaComposition: '機 + 會' },
    ],
  },
  {
    id: 'hanja-jang',
    hanja: '長',
    korean: '장',
    romanization: 'jang',
    meaning: 'long/chief',
    words: [
      { korean: '사장', english: 'company president/boss', romanization: 'sajang', hanjaComposition: '社 + 長' },
      { korean: '시장', english: 'mayor/market', romanization: 'sijang', hanjaComposition: '市 + 長' },
      { korean: '교장', english: 'school principal', romanization: 'gyojang', hanjaComposition: '校 + 長' },
      { korean: '성장', english: 'growth', romanization: 'seongjang', hanjaComposition: '成 + 長' },
    ],
  },
  {
    id: 'hanja-dong',
    hanja: '東',
    korean: '동',
    romanization: 'dong',
    meaning: 'east',
    words: [
      { korean: '동쪽', english: 'east (direction)', romanization: 'dongjjok', hanjaComposition: '東 + 쪽' },
      { korean: '동대문', english: 'Dongdaemun (East Great Gate)', romanization: 'dongdaemun', hanjaComposition: '東 + 大 + 門' },
      { korean: '동양', english: 'the East/Orient', romanization: 'dongyang', hanjaComposition: '東 + 洋' },
    ],
  },
  {
    id: 'hanja-wol',
    hanja: '月',
    korean: '월',
    romanization: 'wol',
    meaning: 'month/moon',
    words: [
      { korean: '월요일', english: 'Monday', romanization: 'woryoil', hanjaComposition: '月 + 曜 + 日' },
      { korean: '1월', english: 'January', romanization: 'irwol', hanjaComposition: '一 + 月' },
      { korean: '매월', english: 'every month', romanization: 'maewol', hanjaComposition: '每 + 月' },
    ],
  },
  {
    id: 'hanja-chul',
    hanja: '出',
    korean: '출',
    romanization: 'chul',
    meaning: 'go out',
    words: [
      { korean: '출발', english: 'departure', romanization: 'chulbal', hanjaComposition: '出 + 發' },
      { korean: '출구', english: 'exit', romanization: 'chulgu', hanjaComposition: '出 + 口' },
      { korean: '출근', english: 'going to work', romanization: 'chulgeun', hanjaComposition: '出 + 勤' },
    ],
  },
  {
    id: 'hanja-ip',
    hanja: '入',
    korean: '입',
    romanization: 'ip',
    meaning: 'enter',
    words: [
      { korean: '입구', english: 'entrance', romanization: 'ipgu', hanjaComposition: '入 + 口' },
      { korean: '입학', english: 'school enrollment', romanization: 'iphak', hanjaComposition: '入 + 學' },
      { korean: '수입', english: 'import/income', romanization: 'suip', hanjaComposition: '收 + 入' },
    ],
  },
  {
    id: 'hanja-su-hand',
    hanja: '手',
    korean: '수',
    romanization: 'su',
    meaning: 'hand',
    words: [
      { korean: '수영', english: 'swimming', romanization: 'suyeong', hanjaComposition: '水 + 泳' },
      { korean: '선수', english: 'athlete/player', romanization: 'seonsu', hanjaComposition: '選 + 手' },
      { korean: '가수', english: 'singer', romanization: 'gasu', hanjaComposition: '歌 + 手' },
    ],
  },
  {
    id: 'hanja-oe',
    hanja: '外',
    korean: '외',
    romanization: 'oe',
    meaning: 'outside',
    words: [
      { korean: '외국', english: 'foreign country', romanization: 'oeguk', hanjaComposition: '外 + 國' },
      { korean: '외국인', english: 'foreigner', romanization: 'oegugin', hanjaComposition: '外 + 國 + 人' },
      { korean: '외출', english: 'going out', romanization: 'oechul', hanjaComposition: '外 + 出' },
    ],
  },
  {
    id: 'hanja-ryeok',
    hanja: '力',
    korean: '력',
    romanization: 'ryeok',
    meaning: 'power',
    words: [
      { korean: '노력', english: 'effort', romanization: 'noryeok', hanjaComposition: '努 + 力' },
      { korean: '능력', english: 'ability/capability', romanization: 'neungnyeok', hanjaComposition: '能 + 力' },
      { korean: '협력', english: 'cooperation', romanization: 'hyeomnyeok', hanjaComposition: '協 + 力' },
    ],
  },
  {
    id: 'hanja-jeon',
    hanja: '電',
    korean: '전',
    romanization: 'jeon',
    meaning: 'electricity',
    words: [
      { korean: '전화', english: 'telephone', romanization: 'jeonhwa', hanjaComposition: '電 + 話' },
      { korean: '전자', english: 'electronics', romanization: 'jeonja', hanjaComposition: '電 + 子' },
      { korean: '전기', english: 'electricity', romanization: 'jeongi', hanjaComposition: '電 + 氣' },
    ],
  },
  {
    id: 'hanja-cha',
    hanja: '車',
    korean: '차',
    romanization: 'cha',
    meaning: 'car/vehicle',
    words: [
      { korean: '자동차', english: 'automobile', romanization: 'jadongcha', hanjaComposition: '自 + 動 + 車' },
      { korean: '기차', english: 'train', romanization: 'gicha', hanjaComposition: '汽 + 車' },
      { korean: '자전거', english: 'bicycle', romanization: 'jajeongeo', hanjaComposition: '自 + 轉 + 車' },
    ],
  },
  {
    id: 'hanja-gong',
    hanja: '工',
    korean: '공',
    romanization: 'gong',
    meaning: 'work/craft',
    words: [
      { korean: '공부', english: 'study', romanization: 'gongbu', hanjaComposition: '工 + 夫' },
      { korean: '공장', english: 'factory', romanization: 'gongjang', hanjaComposition: '工 + 場' },
      { korean: '공사', english: 'construction', romanization: 'gongsa', hanjaComposition: '工 + 事' },
    ],
  },
];

export function getHanjaById(id: string): HanjaCharacter | undefined {
  return hanjaCharacters.find((h) => h.id === id);
}

export function getWordsByHanja(hanjaChar: string): HanjaWord[] {
  const character = hanjaCharacters.find((h) => h.hanja === hanjaChar);
  return character?.words ?? [];
}

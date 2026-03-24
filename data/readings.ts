export interface ReadingWord {
  korean: string;
  english: string;
}

export interface ReadingPassage {
  id: string;
  title: string;
  titleKorean: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  category: 'fairy_tale' | 'daily_life' | 'culture' | 'conversation';
  paragraphs: {
    korean: string;
    english: string;
    words: ReadingWord[];
  }[];
  description: string;
}

export const readingPassages: ReadingPassage[] = [
  {
    id: 'my-day',
    title: 'My Day',
    titleKorean: '나의 하루',
    level: 'beginner',
    category: 'daily_life',
    description: 'A simple story about a daily routine with basic verbs and time expressions.',
    paragraphs: [
      {
        korean: '저는 아침 7시에 일어나요.',
        english: 'I wake up at 7 in the morning.',
        words: [
          { korean: '저는', english: 'I (topic)' },
          { korean: '아침', english: 'morning' },
          { korean: '7시에', english: 'at 7 o\'clock' },
          { korean: '일어나요.', english: 'wake up' },
        ],
      },
      {
        korean: '세수를 하고 아침을 먹어요.',
        english: 'I wash my face and eat breakfast.',
        words: [
          { korean: '세수를', english: 'face washing (object)' },
          { korean: '하고', english: 'do and' },
          { korean: '아침을', english: 'breakfast (object)' },
          { korean: '먹어요.', english: 'eat' },
        ],
      },
      {
        korean: '학교에 가요.',
        english: 'I go to school.',
        words: [
          { korean: '학교에', english: 'to school' },
          { korean: '가요.', english: 'go' },
        ],
      },
      {
        korean: '점심에 친구와 밥을 먹어요.',
        english: 'At lunch, I eat with a friend.',
        words: [
          { korean: '점심에', english: 'at lunch' },
          { korean: '친구와', english: 'with a friend' },
          { korean: '밥을', english: 'rice/meal (object)' },
          { korean: '먹어요.', english: 'eat' },
        ],
      },
      {
        korean: '저녁에 한국어를 공부해요.',
        english: 'In the evening, I study Korean.',
        words: [
          { korean: '저녁에', english: 'in the evening' },
          { korean: '한국어를', english: 'Korean language (object)' },
          { korean: '공부해요.', english: 'study' },
        ],
      },
    ],
  },
  {
    id: 'my-family',
    title: 'My Family',
    titleKorean: '우리 가족',
    level: 'beginner',
    category: 'daily_life',
    description: 'Introduce your family members using basic Korean vocabulary.',
    paragraphs: [
      {
        korean: '우리 가족은 네 명이에요.',
        english: 'My family has four members.',
        words: [
          { korean: '우리', english: 'our/my' },
          { korean: '가족은', english: 'family (topic)' },
          { korean: '네', english: 'four' },
          { korean: '명이에요.', english: 'people (is)' },
        ],
      },
      {
        korean: '아빠, 엄마, 언니, 그리고 저.',
        english: 'Dad, mom, older sister, and me.',
        words: [
          { korean: '아빠,', english: 'dad' },
          { korean: '엄마,', english: 'mom' },
          { korean: '언니,', english: 'older sister (female)' },
          { korean: '그리고', english: 'and' },
          { korean: '저.', english: 'me/I' },
        ],
      },
      {
        korean: '아빠는 회사에서 일해요.',
        english: 'Dad works at a company.',
        words: [
          { korean: '아빠는', english: 'dad (topic)' },
          { korean: '회사에서', english: 'at a company' },
          { korean: '일해요.', english: 'works' },
        ],
      },
      {
        korean: '엄마는 요리를 잘해요.',
        english: 'Mom cooks well.',
        words: [
          { korean: '엄마는', english: 'mom (topic)' },
          { korean: '요리를', english: 'cooking (object)' },
          { korean: '잘해요.', english: 'does well' },
        ],
      },
      {
        korean: '언니는 대학생이에요.',
        english: 'My older sister is a college student.',
        words: [
          { korean: '언니는', english: 'older sister (topic)' },
          { korean: '대학생이에요.', english: 'is a college student' },
        ],
      },
    ],
  },
  {
    id: 'korean-food',
    title: 'Korean Food',
    titleKorean: '한국 음식',
    level: 'beginner',
    category: 'culture',
    description: 'Learn about popular Korean foods and how to describe them.',
    paragraphs: [
      {
        korean: '한국 음식은 맛있어요.',
        english: 'Korean food is delicious.',
        words: [
          { korean: '한국', english: 'Korea' },
          { korean: '음식은', english: 'food (topic)' },
          { korean: '맛있어요.', english: 'is delicious' },
        ],
      },
      {
        korean: '김치는 매워요.',
        english: 'Kimchi is spicy.',
        words: [
          { korean: '김치는', english: 'kimchi (topic)' },
          { korean: '매워요.', english: 'is spicy' },
        ],
      },
      {
        korean: '불고기는 달고 맛있어요.',
        english: 'Bulgogi is sweet and delicious.',
        words: [
          { korean: '불고기는', english: 'bulgogi (topic)' },
          { korean: '달고', english: 'sweet and' },
          { korean: '맛있어요.', english: 'is delicious' },
        ],
      },
      {
        korean: '저는 비빔밥을 좋아해요.',
        english: 'I like bibimbap.',
        words: [
          { korean: '저는', english: 'I (topic)' },
          { korean: '비빔밥을', english: 'bibimbap (object)' },
          { korean: '좋아해요.', english: 'like' },
        ],
      },
      {
        korean: '떡볶이는 학생들이 좋아하는 간식이에요.',
        english: 'Tteokbokki is a snack that students like.',
        words: [
          { korean: '떡볶이는', english: 'tteokbokki (topic)' },
          { korean: '학생들이', english: 'students (subject)' },
          { korean: '좋아하는', english: 'that (they) like' },
          { korean: '간식이에요.', english: 'is a snack' },
        ],
      },
      {
        korean: '한국 사람들은 밥을 많이 먹어요.',
        english: 'Korean people eat a lot of rice.',
        words: [
          { korean: '한국', english: 'Korea' },
          { korean: '사람들은', english: 'people (topic)' },
          { korean: '밥을', english: 'rice/meal (object)' },
          { korean: '많이', english: 'a lot' },
          { korean: '먹어요.', english: 'eat' },
        ],
      },
    ],
  },
  {
    id: 'my-friend',
    title: 'My Friend',
    titleKorean: '내 친구',
    level: 'intermediate',
    category: 'daily_life',
    description: 'A story about friendship using more complex grammar and expressions.',
    paragraphs: [
      {
        korean: '제 친구 이름은 민수예요.',
        english: 'My friend\'s name is Minsu.',
        words: [
          { korean: '제', english: 'my (humble)' },
          { korean: '친구', english: 'friend' },
          { korean: '이름은', english: 'name (topic)' },
          { korean: '민수예요.', english: 'is Minsu' },
        ],
      },
      {
        korean: '민수는 저와 같은 학교에 다녀요.',
        english: 'Minsu goes to the same school as me.',
        words: [
          { korean: '민수는', english: 'Minsu (topic)' },
          { korean: '저와', english: 'with me' },
          { korean: '같은', english: 'same' },
          { korean: '학교에', english: 'to school' },
          { korean: '다녀요.', english: 'attends/goes to' },
        ],
      },
      {
        korean: '우리는 매일 같이 점심을 먹어요.',
        english: 'We eat lunch together every day.',
        words: [
          { korean: '우리는', english: 'we (topic)' },
          { korean: '매일', english: 'every day' },
          { korean: '같이', english: 'together' },
          { korean: '점심을', english: 'lunch (object)' },
          { korean: '먹어요.', english: 'eat' },
        ],
      },
      {
        korean: '민수는 축구를 잘해요.',
        english: 'Minsu plays soccer well.',
        words: [
          { korean: '민수는', english: 'Minsu (topic)' },
          { korean: '축구를', english: 'soccer (object)' },
          { korean: '잘해요.', english: 'does well' },
        ],
      },
      {
        korean: '저는 축구를 못하지만 응원해요.',
        english: 'I\'m not good at soccer, but I cheer for him.',
        words: [
          { korean: '저는', english: 'I (topic)' },
          { korean: '축구를', english: 'soccer (object)' },
          { korean: '못하지만', english: 'can\'t do but' },
          { korean: '응원해요.', english: 'cheer/support' },
        ],
      },
      {
        korean: '주말에 같이 영화를 보러 가요.',
        english: 'On weekends, we go to watch movies together.',
        words: [
          { korean: '주말에', english: 'on weekends' },
          { korean: '같이', english: 'together' },
          { korean: '영화를', english: 'movie (object)' },
          { korean: '보러', english: 'in order to watch' },
          { korean: '가요.', english: 'go' },
        ],
      },
      {
        korean: '민수는 정말 좋은 친구예요.',
        english: 'Minsu is a really good friend.',
        words: [
          { korean: '민수는', english: 'Minsu (topic)' },
          { korean: '정말', english: 'really' },
          { korean: '좋은', english: 'good' },
          { korean: '친구예요.', english: 'is a friend' },
        ],
      },
    ],
  },
  {
    id: 'trip-to-busan',
    title: 'A Trip to Busan',
    titleKorean: '부산 여행',
    level: 'intermediate',
    category: 'culture',
    description: 'A travel story about visiting Busan with descriptive vocabulary.',
    paragraphs: [
      {
        korean: '지난 여름에 가족과 부산에 갔어요.',
        english: 'Last summer, I went to Busan with my family.',
        words: [
          { korean: '지난', english: 'last/past' },
          { korean: '여름에', english: 'in summer' },
          { korean: '가족과', english: 'with family' },
          { korean: '부산에', english: 'to Busan' },
          { korean: '갔어요.', english: 'went' },
        ],
      },
      {
        korean: '서울에서 부산까지 KTX로 두 시간 반 걸렸어요.',
        english: 'It took two and a half hours from Seoul to Busan by KTX.',
        words: [
          { korean: '서울에서', english: 'from Seoul' },
          { korean: '부산까지', english: 'to Busan' },
          { korean: 'KTX로', english: 'by KTX' },
          { korean: '두', english: 'two' },
          { korean: '시간', english: 'hours' },
          { korean: '반', english: 'half' },
          { korean: '걸렸어요.', english: 'took (time)' },
        ],
      },
      {
        korean: '해운대 해변은 정말 아름다웠어요.',
        english: 'Haeundae Beach was really beautiful.',
        words: [
          { korean: '해운대', english: 'Haeundae' },
          { korean: '해변은', english: 'beach (topic)' },
          { korean: '정말', english: 'really' },
          { korean: '아름다웠어요.', english: 'was beautiful' },
        ],
      },
      {
        korean: '바다에서 수영도 하고 모래성도 만들었어요.',
        english: 'We swam in the sea and also built sandcastles.',
        words: [
          { korean: '바다에서', english: 'in the sea' },
          { korean: '수영도', english: 'swimming also' },
          { korean: '하고', english: 'did and' },
          { korean: '모래성도', english: 'sandcastle also' },
          { korean: '만들었어요.', english: 'made/built' },
        ],
      },
      {
        korean: '자갈치 시장에서 신선한 회를 먹었어요.',
        english: 'We ate fresh sashimi at Jagalchi Market.',
        words: [
          { korean: '자갈치', english: 'Jagalchi' },
          { korean: '시장에서', english: 'at the market' },
          { korean: '신선한', english: 'fresh' },
          { korean: '회를', english: 'raw fish (object)' },
          { korean: '먹었어요.', english: 'ate' },
        ],
      },
      {
        korean: '감천문화마을도 구경했어요.',
        english: 'We also visited Gamcheon Culture Village.',
        words: [
          { korean: '감천문화마을도', english: 'Gamcheon Culture Village also' },
          { korean: '구경했어요.', english: 'looked around/visited' },
        ],
      },
      {
        korean: '알록달록한 집들이 너무 예뻤어요.',
        english: 'The colorful houses were so pretty.',
        words: [
          { korean: '알록달록한', english: 'colorful' },
          { korean: '집들이', english: 'houses (subject)' },
          { korean: '너무', english: 'so/very' },
          { korean: '예뻤어요.', english: 'were pretty' },
        ],
      },
      {
        korean: '부산은 다시 가고 싶은 도시예요.',
        english: 'Busan is a city I want to visit again.',
        words: [
          { korean: '부산은', english: 'Busan (topic)' },
          { korean: '다시', english: 'again' },
          { korean: '가고', english: 'go and' },
          { korean: '싶은', english: 'want to' },
          { korean: '도시예요.', english: 'is a city' },
        ],
      },
    ],
  },
  {
    id: 'korean-new-year',
    title: 'Korean New Year',
    titleKorean: '설날',
    level: 'intermediate',
    category: 'culture',
    description: 'Learn about the traditional Korean New Year holiday and customs.',
    paragraphs: [
      {
        korean: '설날은 한국의 가장 큰 명절이에요.',
        english: 'Seollal is Korea\'s biggest holiday.',
        words: [
          { korean: '설날은', english: 'Seollal (topic)' },
          { korean: '한국의', english: 'Korea\'s' },
          { korean: '가장', english: 'most/biggest' },
          { korean: '큰', english: 'big' },
          { korean: '명절이에요.', english: 'is a holiday' },
        ],
      },
      {
        korean: '음력 1월 1일에 가족이 모여요.',
        english: 'Families gather on January 1st of the lunar calendar.',
        words: [
          { korean: '음력', english: 'lunar calendar' },
          { korean: '1월', english: 'January' },
          { korean: '1일에', english: 'on the 1st' },
          { korean: '가족이', english: 'family (subject)' },
          { korean: '모여요.', english: 'gather' },
        ],
      },
      {
        korean: '아침에 한복을 입고 세배를 해요.',
        english: 'In the morning, we wear hanbok and bow to elders.',
        words: [
          { korean: '아침에', english: 'in the morning' },
          { korean: '한복을', english: 'hanbok (object)' },
          { korean: '입고', english: 'wear and' },
          { korean: '세배를', english: 'New Year bow (object)' },
          { korean: '해요.', english: 'do' },
        ],
      },
      {
        korean: '어른들께 세배하면 세뱃돈을 받아요.',
        english: 'When you bow to elders, you receive New Year money.',
        words: [
          { korean: '어른들께', english: 'to elders (honorific)' },
          { korean: '세배하면', english: 'if/when you bow' },
          { korean: '세뱃돈을', english: 'New Year money (object)' },
          { korean: '받아요.', english: 'receive' },
        ],
      },
      {
        korean: '떡국을 먹으면 한 살 더 먹는다고 해요.',
        english: 'They say you get one year older when you eat tteokguk.',
        words: [
          { korean: '떡국을', english: 'tteokguk (object)' },
          { korean: '먹으면', english: 'if/when you eat' },
          { korean: '한', english: 'one' },
          { korean: '살', english: 'year (age)' },
          { korean: '더', english: 'more' },
          { korean: '먹는다고', english: 'they say you get' },
          { korean: '해요.', english: 'say/do' },
        ],
      },
      {
        korean: '가족과 함께 윷놀이도 해요.',
        english: 'We also play yunnori with family.',
        words: [
          { korean: '가족과', english: 'with family' },
          { korean: '함께', english: 'together' },
          { korean: '윷놀이도', english: 'yunnori (game) also' },
          { korean: '해요.', english: 'do/play' },
        ],
      },
      {
        korean: '설날은 가족의 사랑을 느끼는 날이에요.',
        english: 'Seollal is a day to feel the love of family.',
        words: [
          { korean: '설날은', english: 'Seollal (topic)' },
          { korean: '가족의', english: 'family\'s' },
          { korean: '사랑을', english: 'love (object)' },
          { korean: '느끼는', english: 'feeling/to feel' },
          { korean: '날이에요.', english: 'is a day' },
        ],
      },
    ],
  },
];

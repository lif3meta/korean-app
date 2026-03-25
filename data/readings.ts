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
  {
    id: 'korean-business-culture',
    title: 'Korean Business Culture',
    titleKorean: '한국의 비즈니스 문화',
    level: 'advanced',
    category: 'culture',
    description: 'Explore the hierarchical nature of Korean business culture and workplace etiquette.',
    paragraphs: [
      {
        korean: '한국의 비즈니스 문화는 유교적 가치관에 깊이 뿌리를 두고 있습니다.',
        english: 'Korean business culture is deeply rooted in Confucian values.',
        words: [
          { korean: '비즈니스', english: 'business' },
          { korean: '문화는', english: 'culture (topic)' },
          { korean: '유교적', english: 'Confucian' },
          { korean: '가치관에', english: 'in values' },
          { korean: '깊이', english: 'deeply' },
          { korean: '뿌리를 두고', english: 'rooted in' },
          { korean: '있습니다.', english: 'exists (formal)' },
        ],
      },
      {
        korean: '직장에서의 위계질서는 매우 중요하며, 상사에게 존댓말을 사용해야 합니다.',
        english: 'Workplace hierarchy is very important, and you must use formal language with superiors.',
        words: [
          { korean: '직장에서의', english: 'in the workplace' },
          { korean: '위계질서는', english: 'hierarchy (topic)' },
          { korean: '매우', english: 'very' },
          { korean: '중요하며,', english: 'is important and' },
          { korean: '상사에게', english: 'to superiors' },
          { korean: '존댓말을', english: 'formal speech (object)' },
          { korean: '사용해야 합니다.', english: 'must use' },
        ],
      },
      {
        korean: '명함을 교환할 때는 반드시 두 손으로 주고받아야 합니다.',
        english: 'When exchanging business cards, you must give and receive them with both hands.',
        words: [
          { korean: '명함을', english: 'business card (object)' },
          { korean: '교환할 때는', english: 'when exchanging' },
          { korean: '반드시', english: 'must/certainly' },
          { korean: '두 손으로', english: 'with both hands' },
          { korean: '주고받아야', english: 'must give and receive' },
          { korean: '합니다.', english: 'do (formal)' },
        ],
      },
      {
        korean: '회식 문화도 한국 직장 생활의 중요한 부분입니다.',
        english: 'The culture of company dinners is also an important part of Korean work life.',
        words: [
          { korean: '회식', english: 'company dinner/gathering' },
          { korean: '문화도', english: 'culture also' },
          { korean: '직장', english: 'workplace' },
          { korean: '생활의', english: 'life\'s' },
          { korean: '중요한', english: 'important' },
          { korean: '부분입니다.', english: 'is a part (formal)' },
        ],
      },
      {
        korean: '동료들과의 관계를 돈독히 하기 위해 함께 식사하고 술을 마시는 것이 일반적입니다.',
        english: 'It is common to eat and drink together to strengthen relationships with colleagues.',
        words: [
          { korean: '동료들과의', english: 'with colleagues' },
          { korean: '관계를', english: 'relationship (object)' },
          { korean: '돈독히', english: 'closely/strongly' },
          { korean: '하기 위해', english: 'in order to' },
          { korean: '함께', english: 'together' },
          { korean: '식사하고', english: 'eat and' },
          { korean: '술을 마시는 것이', english: 'drinking alcohol' },
          { korean: '일반적입니다.', english: 'is common (formal)' },
        ],
      },
    ],
  },
  {
    id: 'joseon-dynasty',
    title: 'The Joseon Dynasty',
    titleKorean: '조선 왕조',
    level: 'advanced',
    category: 'culture',
    description: 'Learn about the Joseon Dynasty, one of the most influential periods in Korean history.',
    paragraphs: [
      {
        korean: '조선 왕조는 1392년부터 1897년까지 약 500년간 한반도를 통치했습니다.',
        english: 'The Joseon Dynasty ruled the Korean Peninsula for about 500 years, from 1392 to 1897.',
        words: [
          { korean: '조선 왕조는', english: 'Joseon Dynasty (topic)' },
          { korean: '1392년부터', english: 'from 1392' },
          { korean: '1897년까지', english: 'until 1897' },
          { korean: '약', english: 'approximately' },
          { korean: '500년간', english: 'for 500 years' },
          { korean: '한반도를', english: 'Korean Peninsula (object)' },
          { korean: '통치했습니다.', english: 'ruled (formal)' },
        ],
      },
      {
        korean: '세종대왕은 조선의 가장 위대한 왕으로 한글을 창제하셨습니다.',
        english: 'King Sejong the Great, the greatest king of Joseon, created Hangeul.',
        words: [
          { korean: '세종대왕은', english: 'King Sejong (topic)' },
          { korean: '조선의', english: 'Joseon\'s' },
          { korean: '가장', english: 'most' },
          { korean: '위대한', english: 'great' },
          { korean: '왕으로', english: 'as king' },
          { korean: '한글을', english: 'Hangeul (object)' },
          { korean: '창제하셨습니다.', english: 'created (honorific formal)' },
        ],
      },
      {
        korean: '유교를 국가 이념으로 삼아 학문과 예절을 중시했습니다.',
        english: 'They adopted Confucianism as the national ideology and valued scholarship and etiquette.',
        words: [
          { korean: '유교를', english: 'Confucianism (object)' },
          { korean: '국가', english: 'national/state' },
          { korean: '이념으로', english: 'as ideology' },
          { korean: '삼아', english: 'adopting/making as' },
          { korean: '학문과', english: 'scholarship and' },
          { korean: '예절을', english: 'etiquette (object)' },
          { korean: '중시했습니다.', english: 'valued (formal)' },
        ],
      },
      {
        korean: '과거 시험 제도를 통해 인재를 선발하여 관리로 등용했습니다.',
        english: 'They selected talented individuals through the civil service examination system and appointed them as officials.',
        words: [
          { korean: '과거 시험', english: 'civil service exam' },
          { korean: '제도를 통해', english: 'through the system' },
          { korean: '인재를', english: 'talented people (object)' },
          { korean: '선발하여', english: 'selecting' },
          { korean: '관리로', english: 'as officials' },
          { korean: '등용했습니다.', english: 'appointed (formal)' },
        ],
      },
      {
        korean: '조선 시대의 문화유산은 오늘날 한국 문화의 근간을 이루고 있습니다.',
        english: 'The cultural heritage of the Joseon era forms the foundation of Korean culture today.',
        words: [
          { korean: '조선 시대의', english: 'of the Joseon era' },
          { korean: '문화유산은', english: 'cultural heritage (topic)' },
          { korean: '오늘날', english: 'today/nowadays' },
          { korean: '한국 문화의', english: 'of Korean culture' },
          { korean: '근간을', english: 'foundation (object)' },
          { korean: '이루고 있습니다.', english: 'forms/constitutes (formal)' },
        ],
      },
    ],
  },
  {
    id: 'korean-literature',
    title: 'Korean Literature',
    titleKorean: '한국 문학',
    level: 'advanced',
    category: 'culture',
    description: 'An overview of Korean literary tradition from classical poetry to modern novels.',
    paragraphs: [
      {
        korean: '한국 문학은 수천 년의 역사를 가지고 있으며, 독자적인 전통을 발전시켜 왔습니다.',
        english: 'Korean literature has a history of thousands of years and has developed its own unique tradition.',
        words: [
          { korean: '한국 문학은', english: 'Korean literature (topic)' },
          { korean: '수천 년의', english: 'of thousands of years' },
          { korean: '역사를', english: 'history (object)' },
          { korean: '가지고 있으며,', english: 'has and' },
          { korean: '독자적인', english: 'unique/independent' },
          { korean: '전통을', english: 'tradition (object)' },
          { korean: '발전시켜 왔습니다.', english: 'has developed (formal)' },
        ],
      },
      {
        korean: '시조는 조선 시대에 유행한 정형시로, 자연과 인생에 대한 감정을 표현했습니다.',
        english: 'Sijo is a fixed-form poem popular during the Joseon era that expressed feelings about nature and life.',
        words: [
          { korean: '시조는', english: 'sijo (topic)' },
          { korean: '조선 시대에', english: 'in the Joseon era' },
          { korean: '유행한', english: 'popular/prevalent' },
          { korean: '정형시로,', english: 'as a fixed-form poem' },
          { korean: '자연과', english: 'nature and' },
          { korean: '인생에 대한', english: 'about life' },
          { korean: '감정을', english: 'feelings (object)' },
          { korean: '표현했습니다.', english: 'expressed (formal)' },
        ],
      },
      {
        korean: '판소리는 노래와 이야기를 결합한 독특한 구비 문학의 형태입니다.',
        english: 'Pansori is a unique form of oral literature that combines song and storytelling.',
        words: [
          { korean: '판소리는', english: 'pansori (topic)' },
          { korean: '노래와', english: 'song and' },
          { korean: '이야기를', english: 'story (object)' },
          { korean: '결합한', english: 'combined' },
          { korean: '독특한', english: 'unique' },
          { korean: '구비 문학의', english: 'of oral literature' },
          { korean: '형태입니다.', english: 'is a form (formal)' },
        ],
      },
      {
        korean: '현대 한국 문학은 일제 강점기의 고통과 한국 전쟁의 상처를 반영하고 있습니다.',
        english: 'Modern Korean literature reflects the suffering of the Japanese colonial period and the wounds of the Korean War.',
        words: [
          { korean: '현대', english: 'modern' },
          { korean: '한국 문학은', english: 'Korean literature (topic)' },
          { korean: '일제 강점기의', english: 'of the Japanese colonial period' },
          { korean: '고통과', english: 'suffering and' },
          { korean: '한국 전쟁의', english: 'of the Korean War' },
          { korean: '상처를', english: 'wounds (object)' },
          { korean: '반영하고 있습니다.', english: 'reflects (formal)' },
        ],
      },
      {
        korean: '한강 작가는 소설 "채식주의자"로 맨부커 국제상을 수상하며 세계적으로 주목받았습니다.',
        english: 'Author Han Kang gained worldwide attention by winning the International Booker Prize for her novel "The Vegetarian."',
        words: [
          { korean: '한강 작가는', english: 'Author Han Kang (topic)' },
          { korean: '소설', english: 'novel' },
          { korean: '채식주의자', english: 'The Vegetarian' },
          { korean: '맨부커 국제상을', english: 'International Booker Prize (object)' },
          { korean: '수상하며', english: 'winning and' },
          { korean: '세계적으로', english: 'worldwide' },
          { korean: '주목받았습니다.', english: 'gained attention (formal)' },
        ],
      },
    ],
  },
  {
    id: 'hangeul-creation',
    title: 'The Creation of Hangeul',
    titleKorean: '한글의 창제',
    level: 'advanced',
    category: 'culture',
    description: 'The story behind the creation of the Korean writing system by King Sejong.',
    paragraphs: [
      {
        korean: '한글은 1443년에 세종대왕과 집현전 학자들에 의해 창제되었습니다.',
        english: 'Hangeul was created in 1443 by King Sejong the Great and the scholars of the Jiphyeonjeon.',
        words: [
          { korean: '한글은', english: 'Hangeul (topic)' },
          { korean: '1443년에', english: 'in 1443' },
          { korean: '세종대왕과', english: 'King Sejong and' },
          { korean: '집현전', english: 'Jiphyeonjeon (Hall of Worthies)' },
          { korean: '학자들에 의해', english: 'by scholars' },
          { korean: '창제되었습니다.', english: 'was created (formal)' },
        ],
      },
      {
        korean: '당시 백성들은 한자가 어려워 글을 읽고 쓸 수 없었습니다.',
        english: 'At that time, common people could not read or write because Chinese characters were too difficult.',
        words: [
          { korean: '당시', english: 'at that time' },
          { korean: '백성들은', english: 'common people (topic)' },
          { korean: '한자가', english: 'Chinese characters (subject)' },
          { korean: '어려워', english: 'being difficult' },
          { korean: '글을', english: 'writing (object)' },
          { korean: '읽고 쓸 수', english: 'able to read and write' },
          { korean: '없었습니다.', english: 'could not (formal)' },
        ],
      },
      {
        korean: '세종대왕은 백성을 사랑하는 마음으로 누구나 쉽게 배울 수 있는 문자를 만들고자 했습니다.',
        english: 'King Sejong, out of love for his people, wanted to create a writing system that anyone could learn easily.',
        words: [
          { korean: '세종대왕은', english: 'King Sejong (topic)' },
          { korean: '백성을', english: 'people (object)' },
          { korean: '사랑하는', english: 'loving' },
          { korean: '마음으로', english: 'with heart/mind' },
          { korean: '누구나', english: 'anyone' },
          { korean: '쉽게', english: 'easily' },
          { korean: '배울 수 있는', english: 'able to learn' },
          { korean: '문자를', english: 'writing system (object)' },
          { korean: '만들고자 했습니다.', english: 'wanted to create (formal)' },
        ],
      },
      {
        korean: '한글의 자음은 발음할 때의 입 모양을 본떠서 만들었습니다.',
        english: 'The consonants of Hangeul were made by modeling the shape of the mouth when pronouncing them.',
        words: [
          { korean: '한글의', english: 'Hangeul\'s' },
          { korean: '자음은', english: 'consonants (topic)' },
          { korean: '발음할 때의', english: 'when pronouncing' },
          { korean: '입 모양을', english: 'mouth shape (object)' },
          { korean: '본떠서', english: 'by modeling after' },
          { korean: '만들었습니다.', english: 'made (formal)' },
        ],
      },
      {
        korean: '오늘날 한글은 과학적이고 체계적인 문자로 세계적으로 인정받고 있습니다.',
        english: 'Today, Hangeul is recognized worldwide as a scientific and systematic writing system.',
        words: [
          { korean: '오늘날', english: 'today/nowadays' },
          { korean: '한글은', english: 'Hangeul (topic)' },
          { korean: '과학적이고', english: 'scientific and' },
          { korean: '체계적인', english: 'systematic' },
          { korean: '문자로', english: 'as a writing system' },
          { korean: '세계적으로', english: 'worldwide' },
          { korean: '인정받고 있습니다.', english: 'is recognized (formal)' },
        ],
      },
    ],
  },
];

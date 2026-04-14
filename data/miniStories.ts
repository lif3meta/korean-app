export interface ComprehensionQuestion {
  question: string;
  questionKorean: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface MiniStory {
  id: string;
  title: string;
  titleKorean: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  category: 'daily_life' | 'school' | 'food' | 'travel' | 'culture';
  paragraphs: {
    korean: string;
    english: string;
    words: { korean: string; english: string }[];
  }[];
  questions: ComprehensionQuestion[];
}

export const miniStories: MiniStory[] = [
  // ===== BEGINNER STORIES (1-8) =====
  {
    id: 'story-my-morning',
    title: 'My Morning',
    titleKorean: '나의 아침',
    level: 'beginner',
    category: 'daily_life',
    paragraphs: [
      {
        korean: '저는 매일 아침 7시에 일어납니다.',
        english: 'I wake up every morning at 7 o\'clock.',
        words: [
          { korean: '매일', english: 'every day' },
          { korean: '아침', english: 'morning' },
          { korean: '일어나다', english: 'to wake up' },
        ],
      },
      {
        korean: '먼저 세수를 하고 이를 닦습니다. 그리고 옷을 입습니다.',
        english: 'First, I wash my face and brush my teeth. Then I get dressed.',
        words: [
          { korean: '먼저', english: 'first' },
          { korean: '세수', english: 'face washing' },
          { korean: '이를 닦다', english: 'to brush teeth' },
          { korean: '옷을 입다', english: 'to get dressed' },
        ],
      },
      {
        korean: '아침 식사로 밥과 김치를 먹습니다. 그리고 커피를 마십니다.',
        english: 'For breakfast, I eat rice and kimchi. Then I drink coffee.',
        words: [
          { korean: '아침 식사', english: 'breakfast' },
          { korean: '밥', english: 'rice/meal' },
          { korean: '김치', english: 'kimchi' },
          { korean: '마시다', english: 'to drink' },
        ],
      },
      {
        korean: '8시에 집을 나갑니다. 버스를 타고 회사에 갑니다.',
        english: 'At 8 o\'clock I leave the house. I take the bus and go to work.',
        words: [
          { korean: '집', english: 'house/home' },
          { korean: '나가다', english: 'to go out' },
          { korean: '버스를 타다', english: 'to take the bus' },
          { korean: '회사', english: 'company/office' },
        ],
      },
    ],
    questions: [
      {
        question: 'What time does the speaker wake up?',
        questionKorean: '이 사람은 몇 시에 일어납니까?',
        options: ['6 o\'clock', '7 o\'clock', '8 o\'clock', '9 o\'clock'],
        correctIndex: 1,
        explanation: 'The story says "매일 아침 7시에 일어납니다" (wakes up at 7 every morning).',
      },
      {
        question: 'What does the speaker eat for breakfast?',
        questionKorean: '아침에 무엇을 먹습니까?',
        options: ['Bread and milk', 'Rice and kimchi', 'Eggs and toast', 'Cereal'],
        correctIndex: 1,
        explanation: 'The story says "밥과 김치를 먹습니다" (eats rice and kimchi).',
      },
      {
        question: 'How does the speaker go to work?',
        questionKorean: '어떻게 회사에 갑니까?',
        options: ['By subway', 'By car', 'By bus', 'On foot'],
        correctIndex: 2,
        explanation: 'The story says "버스를 타고 회사에 갑니다" (takes the bus to work).',
      },
    ],
  },
  {
    id: 'story-at-the-cafe',
    title: 'At the Caf\u00e9',
    titleKorean: '카페에서',
    level: 'beginner',
    category: 'food',
    paragraphs: [
      {
        korean: '오늘 친구와 카페에 갔습니다.',
        english: 'Today I went to a caf\u00e9 with a friend.',
        words: [
          { korean: '오늘', english: 'today' },
          { korean: '친구', english: 'friend' },
          { korean: '카페', english: 'caf\u00e9' },
        ],
      },
      {
        korean: '저는 아메리카노를 주문했습니다. 친구는 카페라떼를 주문했습니다.',
        english: 'I ordered an Americano. My friend ordered a caf\u00e9 latte.',
        words: [
          { korean: '주문하다', english: 'to order' },
          { korean: '아메리카노', english: 'Americano' },
          { korean: '카페라떼', english: 'caf\u00e9 latte' },
        ],
      },
      {
        korean: '우리는 케이크도 먹었습니다. 딸기 케이크가 아주 맛있었습니다.',
        english: 'We also ate cake. The strawberry cake was very delicious.',
        words: [
          { korean: '케이크', english: 'cake' },
          { korean: '딸기', english: 'strawberry' },
          { korean: '맛있다', english: 'to be delicious' },
        ],
      },
      {
        korean: '카페에서 두 시간 동안 이야기했습니다. 정말 즐거운 시간이었습니다.',
        english: 'We talked for two hours at the caf\u00e9. It was a really fun time.',
        words: [
          { korean: '시간', english: 'time/hour' },
          { korean: '이야기하다', english: 'to talk/chat' },
          { korean: '즐겁다', english: 'to be fun/enjoyable' },
        ],
      },
    ],
    questions: [
      {
        question: 'What did the speaker order?',
        questionKorean: '이 사람은 무엇을 주문했습니까?',
        options: ['Caf\u00e9 latte', 'Green tea', 'Americano', 'Iced tea'],
        correctIndex: 2,
        explanation: 'The story says "저는 아메리카노를 주문했습니다" (I ordered an Americano).',
      },
      {
        question: 'What kind of cake did they eat?',
        questionKorean: '무슨 케이크를 먹었습니까?',
        options: ['Chocolate cake', 'Strawberry cake', 'Cheese cake', 'Carrot cake'],
        correctIndex: 1,
        explanation: 'The story says "딸기 케이크가 아주 맛있었습니다" (the strawberry cake was very delicious).',
      },
    ],
  },
  {
    id: 'story-meeting-friend',
    title: 'Meeting a Friend',
    titleKorean: '친구 만나기',
    level: 'beginner',
    category: 'daily_life',
    paragraphs: [
      {
        korean: '토요일에 오랜만에 친구를 만났습니다. 친구 이름은 민수입니다.',
        english: 'On Saturday, I met a friend after a long time. My friend\'s name is Minsu.',
        words: [
          { korean: '토요일', english: 'Saturday' },
          { korean: '오랜만에', english: 'after a long time' },
          { korean: '만나다', english: 'to meet' },
        ],
      },
      {
        korean: '우리는 명동에서 만났습니다. 같이 쇼핑을 했습니다.',
        english: 'We met in Myeongdong. We went shopping together.',
        words: [
          { korean: '명동', english: 'Myeongdong (shopping district)' },
          { korean: '같이', english: 'together' },
          { korean: '쇼핑', english: 'shopping' },
        ],
      },
      {
        korean: '점심에는 비빔밥을 먹었습니다. 그리고 영화를 봤습니다.',
        english: 'For lunch, we ate bibimbap. Then we watched a movie.',
        words: [
          { korean: '점심', english: 'lunch' },
          { korean: '비빔밥', english: 'bibimbap (mixed rice)' },
          { korean: '영화', english: 'movie' },
          { korean: '보다', english: 'to watch/see' },
        ],
      },
    ],
    questions: [
      {
        question: 'Where did they meet?',
        questionKorean: '어디에서 만났습니까?',
        options: ['Gangnam', 'Myeongdong', 'Hongdae', 'Itaewon'],
        correctIndex: 1,
        explanation: 'The story says "명동에서 만났습니다" (met in Myeongdong).',
      },
      {
        question: 'What did they eat for lunch?',
        questionKorean: '점심에 무엇을 먹었습니까?',
        options: ['Kimchi stew', 'Bibimbap', 'Bulgogi', 'Fried chicken'],
        correctIndex: 1,
        explanation: 'The story says "점심에는 비빔밥을 먹었습니다" (ate bibimbap for lunch).',
      },
      {
        question: 'What day did they meet?',
        questionKorean: '무슨 요일에 만났습니까?',
        options: ['Sunday', 'Friday', 'Saturday', 'Monday'],
        correctIndex: 2,
        explanation: 'The story says "토요일에" (on Saturday).',
      },
    ],
  },
  {
    id: 'story-my-family',
    title: 'My Family',
    titleKorean: '우리 가족',
    level: 'beginner',
    category: 'daily_life',
    paragraphs: [
      {
        korean: '우리 가족은 네 명입니다. 아버지, 어머니, 언니, 그리고 저입니다.',
        english: 'There are four people in my family. My father, mother, older sister, and me.',
        words: [
          { korean: '가족', english: 'family' },
          { korean: '아버지', english: 'father' },
          { korean: '어머니', english: 'mother' },
          { korean: '언니', english: 'older sister (for females)' },
        ],
      },
      {
        korean: '아버지는 회사원입니다. 어머니는 선생님입니다.',
        english: 'My father is an office worker. My mother is a teacher.',
        words: [
          { korean: '회사원', english: 'office worker' },
          { korean: '선생님', english: 'teacher' },
        ],
      },
      {
        korean: '언니는 대학생입니다. 서울에서 한국어를 공부합니다.',
        english: 'My older sister is a university student. She studies Korean in Seoul.',
        words: [
          { korean: '대학생', english: 'university student' },
          { korean: '서울', english: 'Seoul' },
          { korean: '공부하다', english: 'to study' },
        ],
      },
      {
        korean: '우리 가족은 주말에 같이 저녁을 먹습니다. 가족이 모이면 행복합니다.',
        english: 'Our family eats dinner together on weekends. I am happy when the family gathers.',
        words: [
          { korean: '주말', english: 'weekend' },
          { korean: '저녁', english: 'dinner/evening' },
          { korean: '행복하다', english: 'to be happy' },
        ],
      },
    ],
    questions: [
      {
        question: 'How many people are in the family?',
        questionKorean: '가족은 몇 명입니까?',
        options: ['Three', 'Four', 'Five', 'Six'],
        correctIndex: 1,
        explanation: 'The story says "우리 가족은 네 명입니다" (there are four people in my family).',
      },
      {
        question: 'What is the mother\'s job?',
        questionKorean: '어머니의 직업은 무엇입니까?',
        options: ['Office worker', 'Doctor', 'Teacher', 'Nurse'],
        correctIndex: 2,
        explanation: 'The story says "어머니는 선생님입니다" (mother is a teacher).',
      },
    ],
  },
  {
    id: 'story-going-shopping',
    title: 'Going Shopping',
    titleKorean: '쇼핑하기',
    level: 'beginner',
    category: 'daily_life',
    paragraphs: [
      {
        korean: '오늘 백화점에 갔습니다. 새 옷을 사고 싶었습니다.',
        english: 'Today I went to the department store. I wanted to buy new clothes.',
        words: [
          { korean: '백화점', english: 'department store' },
          { korean: '새', english: 'new' },
          { korean: '옷', english: 'clothes' },
          { korean: '사다', english: 'to buy' },
        ],
      },
      {
        korean: '검은색 바지와 흰색 셔츠를 입어 봤습니다. 둘 다 예뻤습니다.',
        english: 'I tried on black pants and a white shirt. Both were pretty.',
        words: [
          { korean: '검은색', english: 'black' },
          { korean: '바지', english: 'pants' },
          { korean: '흰색', english: 'white' },
          { korean: '입어 보다', english: 'to try on' },
        ],
      },
      {
        korean: '바지는 30,000원이었습니다. 셔츠는 25,000원이었습니다.',
        english: 'The pants were 30,000 won. The shirt was 25,000 won.',
        words: [
          { korean: '원', english: 'won (Korean currency)' },
          { korean: '바지', english: 'pants' },
          { korean: '셔츠', english: 'shirt' },
        ],
      },
      {
        korean: '둘 다 샀습니다. 카드로 결제했습니다.',
        english: 'I bought both. I paid by card.',
        words: [
          { korean: '둘 다', english: 'both' },
          { korean: '카드', english: 'card' },
          { korean: '결제하다', english: 'to pay' },
        ],
      },
    ],
    questions: [
      {
        question: 'Where did the speaker go?',
        questionKorean: '어디에 갔습니까?',
        options: ['Supermarket', 'Department store', 'Online shop', 'Market'],
        correctIndex: 1,
        explanation: 'The story says "백화점에 갔습니다" (went to the department store).',
      },
      {
        question: 'How much were the pants?',
        questionKorean: '바지는 얼마였습니까?',
        options: ['20,000 won', '25,000 won', '30,000 won', '35,000 won'],
        correctIndex: 2,
        explanation: 'The story says "바지는 30,000원이었습니다" (the pants were 30,000 won).',
      },
      {
        question: 'How did the speaker pay?',
        questionKorean: '어떻게 결제했습니까?',
        options: ['Cash', 'Card', 'Mobile pay', 'Bank transfer'],
        correctIndex: 1,
        explanation: 'The story says "카드로 결제했습니다" (paid by card).',
      },
    ],
  },
  {
    id: 'story-weather-today',
    title: 'The Weather Today',
    titleKorean: '오늘 날씨',
    level: 'beginner',
    category: 'daily_life',
    paragraphs: [
      {
        korean: '오늘 아침에 날씨가 맑았습니다. 하늘이 파랬습니다.',
        english: 'This morning the weather was clear. The sky was blue.',
        words: [
          { korean: '날씨', english: 'weather' },
          { korean: '맑다', english: 'to be clear/sunny' },
          { korean: '하늘', english: 'sky' },
          { korean: '파랗다', english: 'to be blue' },
        ],
      },
      {
        korean: '그런데 오후에 갑자기 비가 왔습니다. 우산이 없어서 걱정했습니다.',
        english: 'But in the afternoon, it suddenly rained. I was worried because I didn\'t have an umbrella.',
        words: [
          { korean: '오후', english: 'afternoon' },
          { korean: '갑자기', english: 'suddenly' },
          { korean: '비', english: 'rain' },
          { korean: '우산', english: 'umbrella' },
        ],
      },
      {
        korean: '편의점에서 우산을 샀습니다. 5,000원이었습니다.',
        english: 'I bought an umbrella at a convenience store. It was 5,000 won.',
        words: [
          { korean: '편의점', english: 'convenience store' },
          { korean: '우산', english: 'umbrella' },
          { korean: '사다', english: 'to buy' },
        ],
      },
    ],
    questions: [
      {
        question: 'How was the weather in the morning?',
        questionKorean: '아침에 날씨가 어땠습니까?',
        options: ['Rainy', 'Cloudy', 'Clear', 'Snowy'],
        correctIndex: 2,
        explanation: 'The story says "아침에 날씨가 맑았습니다" (the weather was clear in the morning).',
      },
      {
        question: 'Where did the speaker buy an umbrella?',
        questionKorean: '어디에서 우산을 샀습니까?',
        options: ['Department store', 'Convenience store', 'Online', 'Supermarket'],
        correctIndex: 1,
        explanation: 'The story says "편의점에서 우산을 샀습니다" (bought an umbrella at a convenience store).',
      },
    ],
  },
  {
    id: 'story-favorite-food',
    title: 'My Favorite Food',
    titleKorean: '좋아하는 음식',
    level: 'beginner',
    category: 'food',
    paragraphs: [
      {
        korean: '저는 한국 음식을 아주 좋아합니다. 특히 불고기를 좋아합니다.',
        english: 'I really like Korean food. I especially like bulgogi.',
        words: [
          { korean: '음식', english: 'food' },
          { korean: '좋아하다', english: 'to like' },
          { korean: '특히', english: 'especially' },
          { korean: '불고기', english: 'bulgogi (grilled marinated beef)' },
        ],
      },
      {
        korean: '불고기는 달콤하고 맛있습니다. 밥과 같이 먹으면 최고입니다.',
        english: 'Bulgogi is sweet and delicious. It\'s the best when eaten with rice.',
        words: [
          { korean: '달콤하다', english: 'to be sweet' },
          { korean: '맛있다', english: 'to be delicious' },
          { korean: '밥', english: 'rice' },
          { korean: '최고', english: 'the best' },
        ],
      },
      {
        korean: '매운 음식도 좋아합니다. 떡볶이와 김치찌개를 자주 먹습니다.',
        english: 'I also like spicy food. I often eat tteokbokki and kimchi stew.',
        words: [
          { korean: '맵다', english: 'to be spicy' },
          { korean: '떡볶이', english: 'tteokbokki (spicy rice cakes)' },
          { korean: '김치찌개', english: 'kimchi stew' },
          { korean: '자주', english: 'often' },
        ],
      },
      {
        korean: '주말에는 직접 요리합니다. 요리하는 것이 재미있습니다.',
        english: 'On weekends, I cook by myself. Cooking is fun.',
        words: [
          { korean: '직접', english: 'directly/personally' },
          { korean: '요리하다', english: 'to cook' },
          { korean: '재미있다', english: 'to be fun/interesting' },
        ],
      },
    ],
    questions: [
      {
        question: 'What is the speaker\'s favorite food?',
        questionKorean: '이 사람이 가장 좋아하는 음식은 무엇입니까?',
        options: ['Kimchi', 'Bulgogi', 'Bibimbap', 'Tteokbokki'],
        correctIndex: 1,
        explanation: 'The story says "특히 불고기를 좋아합니다" (especially likes bulgogi).',
      },
      {
        question: 'What does the speaker do on weekends?',
        questionKorean: '주말에 무엇을 합니까?',
        options: ['Eats out', 'Orders delivery', 'Cooks', 'Goes to a restaurant'],
        correctIndex: 2,
        explanation: 'The story says "주말에는 직접 요리합니다" (cooks by themselves on weekends).',
      },
    ],
  },
  {
    id: 'story-at-school',
    title: 'At School',
    titleKorean: '학교에서',
    level: 'beginner',
    category: 'school',
    paragraphs: [
      {
        korean: '저는 한국어 학원에 다닙니다. 월요일부터 금요일까지 수업이 있습니다.',
        english: 'I attend a Korean language academy. I have classes from Monday to Friday.',
        words: [
          { korean: '학원', english: 'academy/institute' },
          { korean: '다니다', english: 'to attend/commute' },
          { korean: '수업', english: 'class/lesson' },
        ],
      },
      {
        korean: '수업은 오전 9시에 시작합니다. 선생님은 아주 친절합니다.',
        english: 'Class starts at 9 AM. The teacher is very kind.',
        words: [
          { korean: '오전', english: 'morning/AM' },
          { korean: '시작하다', english: 'to start' },
          { korean: '선생님', english: 'teacher' },
          { korean: '친절하다', english: 'to be kind' },
        ],
      },
      {
        korean: '오늘은 한국어 읽기를 배웠습니다. 조금 어려웠지만 재미있었습니다.',
        english: 'Today I learned Korean reading. It was a little difficult but fun.',
        words: [
          { korean: '읽기', english: 'reading' },
          { korean: '배우다', english: 'to learn' },
          { korean: '어렵다', english: 'to be difficult' },
          { korean: '재미있다', english: 'to be fun' },
        ],
      },
      {
        korean: '반 친구들과 점심을 같이 먹었습니다. 한국어로 이야기했습니다.',
        english: 'I ate lunch with classmates. We talked in Korean.',
        words: [
          { korean: '반', english: 'class/group' },
          { korean: '친구들', english: 'friends' },
          { korean: '한국어로', english: 'in Korean' },
        ],
      },
    ],
    questions: [
      {
        question: 'What time does class start?',
        questionKorean: '수업은 몇 시에 시작합니까?',
        options: ['8 AM', '9 AM', '10 AM', '11 AM'],
        correctIndex: 1,
        explanation: 'The story says "수업은 오전 9시에 시작합니다" (class starts at 9 AM).',
      },
      {
        question: 'What did the speaker learn today?',
        questionKorean: '오늘 무엇을 배웠습니까?',
        options: ['Korean writing', 'Korean reading', 'Korean speaking', 'Korean grammar'],
        correctIndex: 1,
        explanation: 'The story says "한국어 읽기를 배웠습니다" (learned Korean reading).',
      },
      {
        question: 'How was the class?',
        questionKorean: '수업이 어땠습니까?',
        options: ['Easy and boring', 'Difficult but fun', 'Very easy', 'Too difficult'],
        correctIndex: 1,
        explanation: 'The story says "조금 어려웠지만 재미있었습니다" (a little difficult but fun).',
      },
    ],
  },

  // ===== INTERMEDIATE STORIES (9-16) =====
  {
    id: 'story-day-in-seoul',
    title: 'A Day in Seoul',
    titleKorean: '서울에서 하루',
    level: 'intermediate',
    category: 'travel',
    paragraphs: [
      {
        korean: '오늘 서울 관광을 했습니다. 먼저 경복궁에 갔습니다. 한복을 입고 사진을 많이 찍었습니다.',
        english: 'Today I went sightseeing in Seoul. First, I went to Gyeongbokgung Palace. I wore hanbok and took many photos.',
        words: [
          { korean: '관광', english: 'sightseeing/tourism' },
          { korean: '경복궁', english: 'Gyeongbokgung Palace' },
          { korean: '한복', english: 'traditional Korean clothing' },
          { korean: '사진을 찍다', english: 'to take a photo' },
        ],
      },
      {
        korean: '점심에는 인사동에서 전통 한식을 먹었습니다. 된장찌개와 잡채가 정말 맛있었습니다.',
        english: 'For lunch, I ate traditional Korean food in Insadong. The doenjang stew and japchae were really delicious.',
        words: [
          { korean: '인사동', english: 'Insadong (cultural district)' },
          { korean: '전통', english: 'traditional' },
          { korean: '된장찌개', english: 'soybean paste stew' },
          { korean: '잡채', english: 'japchae (glass noodles)' },
        ],
      },
      {
        korean: '오후에는 남산타워에 올라갔습니다. 서울의 전경이 아주 아름다웠습니다.',
        english: 'In the afternoon, I went up Namsan Tower. The panoramic view of Seoul was very beautiful.',
        words: [
          { korean: '남산타워', english: 'Namsan Tower' },
          { korean: '올라가다', english: 'to go up/climb' },
          { korean: '전경', english: 'panoramic view' },
          { korean: '아름답다', english: 'to be beautiful' },
        ],
      },
      {
        korean: '저녁에는 홍대에서 길거리 음식을 먹으면서 구경했습니다. 서울은 정말 멋진 도시입니다.',
        english: 'In the evening, I explored Hongdae while eating street food. Seoul is a really wonderful city.',
        words: [
          { korean: '홍대', english: 'Hongdae (university area)' },
          { korean: '길거리 음식', english: 'street food' },
          { korean: '구경하다', english: 'to look around/explore' },
          { korean: '멋지다', english: 'to be wonderful/cool' },
        ],
      },
    ],
    questions: [
      {
        question: 'What did the speaker wear at Gyeongbokgung?',
        questionKorean: '경복궁에서 무엇을 입었습니까?',
        options: ['Modern clothes', 'Hanbok', 'School uniform', 'A suit'],
        correctIndex: 1,
        explanation: 'The story says "한복을 입고 사진을 많이 찍었습니다" (wore hanbok and took many photos).',
      },
      {
        question: 'Where did the speaker go in the afternoon?',
        questionKorean: '오후에 어디에 갔습니까?',
        options: ['Insadong', 'Hongdae', 'Namsan Tower', 'Myeongdong'],
        correctIndex: 2,
        explanation: 'The story says "오후에는 남산타워에 올라갔습니다" (went up Namsan Tower in the afternoon).',
      },
      {
        question: 'What did the speaker do in Hongdae?',
        questionKorean: '홍대에서 무엇을 했습니까?',
        options: ['Watched a movie', 'Went shopping', 'Ate street food and explored', 'Visited a museum'],
        correctIndex: 2,
        explanation: 'The story says "길거리 음식을 먹으면서 구경했습니다" (ate street food while exploring).',
      },
    ],
  },
  {
    id: 'story-at-hospital',
    title: 'At the Hospital',
    titleKorean: '병원에서',
    level: 'intermediate',
    category: 'daily_life',
    paragraphs: [
      {
        korean: '어제부터 머리가 아프고 열이 났습니다. 그래서 오늘 병원에 갔습니다.',
        english: 'Since yesterday, I\'ve had a headache and a fever. So I went to the hospital today.',
        words: [
          { korean: '머리가 아프다', english: 'to have a headache' },
          { korean: '열이 나다', english: 'to have a fever' },
          { korean: '병원', english: 'hospital' },
        ],
      },
      {
        korean: '의사 선생님이 목과 귀를 검사했습니다. 감기라고 했습니다.',
        english: 'The doctor examined my throat and ears. The doctor said it was a cold.',
        words: [
          { korean: '의사', english: 'doctor' },
          { korean: '목', english: 'throat/neck' },
          { korean: '검사하다', english: 'to examine' },
          { korean: '감기', english: 'cold (illness)' },
        ],
      },
      {
        korean: '약을 처방받았습니다. 하루에 세 번 먹어야 합니다. 그리고 물을 많이 마시라고 했습니다.',
        english: 'I was prescribed medicine. I have to take it three times a day. The doctor also told me to drink a lot of water.',
        words: [
          { korean: '약', english: 'medicine' },
          { korean: '처방', english: 'prescription' },
          { korean: '하루', english: 'one day' },
          { korean: '물', english: 'water' },
        ],
      },
      {
        korean: '집에 와서 약을 먹고 쉬었습니다. 내일은 좋아지겠지요.',
        english: 'I came home, took the medicine, and rested. I will probably feel better tomorrow.',
        words: [
          { korean: '쉬다', english: 'to rest' },
          { korean: '좋아지다', english: 'to get better' },
          { korean: '내일', english: 'tomorrow' },
        ],
      },
    ],
    questions: [
      {
        question: 'What symptoms did the speaker have?',
        questionKorean: '어떤 증상이 있었습니까?',
        options: ['Stomachache', 'Headache and fever', 'Backache', 'Cough'],
        correctIndex: 1,
        explanation: 'The story says "머리가 아프고 열이 났습니다" (had a headache and fever).',
      },
      {
        question: 'How many times a day should the speaker take medicine?',
        questionKorean: '하루에 몇 번 약을 먹어야 합니까?',
        options: ['Once', 'Twice', 'Three times', 'Four times'],
        correctIndex: 2,
        explanation: 'The story says "하루에 세 번 먹어야 합니다" (have to take it three times a day).',
      },
    ],
  },
  {
    id: 'story-job-interview',
    title: 'Job Interview',
    titleKorean: '면접',
    level: 'intermediate',
    category: 'daily_life',
    paragraphs: [
      {
        korean: '오늘 중요한 면접이 있었습니다. 아침 일찍 일어나서 정장을 입었습니다.',
        english: 'Today I had an important job interview. I woke up early in the morning and put on a suit.',
        words: [
          { korean: '면접', english: 'interview' },
          { korean: '중요하다', english: 'to be important' },
          { korean: '일찍', english: 'early' },
          { korean: '정장', english: 'suit (formal clothes)' },
        ],
      },
      {
        korean: '회사는 강남에 있었습니다. 지하철을 타고 30분 걸렸습니다.',
        english: 'The company was in Gangnam. It took 30 minutes by subway.',
        words: [
          { korean: '회사', english: 'company' },
          { korean: '강남', english: 'Gangnam (district)' },
          { korean: '지하철', english: 'subway' },
          { korean: '걸리다', english: 'to take (time)' },
        ],
      },
      {
        korean: '면접관이 자기소개와 지원 동기를 물어봤습니다. 한국어로 대답했습니다.',
        english: 'The interviewer asked for my self-introduction and motivation for applying. I answered in Korean.',
        words: [
          { korean: '면접관', english: 'interviewer' },
          { korean: '자기소개', english: 'self-introduction' },
          { korean: '지원 동기', english: 'motivation for applying' },
          { korean: '대답하다', english: 'to answer' },
        ],
      },
      {
        korean: '면접이 끝난 후 좋은 느낌이 들었습니다. 결과는 다음 주에 알려 준다고 했습니다.',
        english: 'After the interview ended, I had a good feeling. They said they would let me know the result next week.',
        words: [
          { korean: '느낌', english: 'feeling' },
          { korean: '결과', english: 'result' },
          { korean: '다음 주', english: 'next week' },
          { korean: '알려 주다', english: 'to let (someone) know' },
        ],
      },
    ],
    questions: [
      {
        question: 'Where was the company located?',
        questionKorean: '회사는 어디에 있었습니까?',
        options: ['Hongdae', 'Gangnam', 'Myeongdong', 'Jongno'],
        correctIndex: 1,
        explanation: 'The story says "회사는 강남에 있었습니다" (the company was in Gangnam).',
      },
      {
        question: 'When will the result be announced?',
        questionKorean: '결과는 언제 알려 줍니까?',
        options: ['Today', 'Tomorrow', 'Next week', 'Next month'],
        correctIndex: 2,
        explanation: 'The story says "결과는 다음 주에 알려 준다고 했습니다" (result will be announced next week).',
      },
      {
        question: 'How did the speaker get to the interview?',
        questionKorean: '면접에 어떻게 갔습니까?',
        options: ['By bus', 'By taxi', 'By subway', 'On foot'],
        correctIndex: 2,
        explanation: 'The story says "지하철을 타고 30분 걸렸습니다" (took the subway for 30 minutes).',
      },
    ],
  },
  {
    id: 'story-moving-to-korea',
    title: 'Moving to Korea',
    titleKorean: '한국으로 이사',
    level: 'intermediate',
    category: 'travel',
    paragraphs: [
      {
        korean: '작년에 한국으로 이사했습니다. 처음에는 모든 것이 낯설었습니다.',
        english: 'Last year, I moved to Korea. At first, everything was unfamiliar.',
        words: [
          { korean: '이사하다', english: 'to move (house)' },
          { korean: '처음', english: 'the first time' },
          { korean: '낯설다', english: 'to be unfamiliar' },
        ],
      },
      {
        korean: '한국어를 잘 못해서 힘들었습니다. 식당에서 주문하는 것도 어려웠습니다.',
        english: 'It was hard because I couldn\'t speak Korean well. Even ordering at restaurants was difficult.',
        words: [
          { korean: '힘들다', english: 'to be hard/difficult' },
          { korean: '식당', english: 'restaurant' },
          { korean: '주문하다', english: 'to order' },
          { korean: '어렵다', english: 'to be difficult' },
        ],
      },
      {
        korean: '하지만 한국 사람들은 친절했습니다. 이웃이 김치를 만들어 줬습니다.',
        english: 'But Korean people were kind. My neighbor made kimchi for me.',
        words: [
          { korean: '하지만', english: 'but/however' },
          { korean: '친절하다', english: 'to be kind' },
          { korean: '이웃', english: 'neighbor' },
          { korean: '만들어 주다', english: 'to make (for someone)' },
        ],
      },
      {
        korean: '지금은 한국 생활에 익숙해졌습니다. 한국어도 많이 늘었습니다. 한국에 온 것을 후회하지 않습니다.',
        english: 'Now I have gotten used to life in Korea. My Korean has also improved a lot. I don\'t regret coming to Korea.',
        words: [
          { korean: '생활', english: 'life/daily life' },
          { korean: '익숙해지다', english: 'to get used to' },
          { korean: '늘다', english: 'to improve/increase' },
          { korean: '후회하다', english: 'to regret' },
        ],
      },
    ],
    questions: [
      {
        question: 'When did the speaker move to Korea?',
        questionKorean: '언제 한국으로 이사했습니까?',
        options: ['This year', 'Last year', 'Two years ago', 'Three years ago'],
        correctIndex: 1,
        explanation: 'The story says "작년에 한국으로 이사했습니다" (moved to Korea last year).',
      },
      {
        question: 'What did the neighbor do for the speaker?',
        questionKorean: '이웃이 무엇을 해 줬습니까?',
        options: ['Helped with moving', 'Made kimchi', 'Taught Korean', 'Gave a gift'],
        correctIndex: 1,
        explanation: 'The story says "이웃이 김치를 만들어 줬습니다" (the neighbor made kimchi for them).',
      },
    ],
  },
  {
    id: 'story-making-korean-friends',
    title: 'Making Korean Friends',
    titleKorean: '한국 친구 사귀기',
    level: 'intermediate',
    category: 'culture',
    paragraphs: [
      {
        korean: '한국에서 친구를 사귀고 싶었습니다. 그래서 언어 교환 모임에 나갔습니다.',
        english: 'I wanted to make friends in Korea. So I went to a language exchange meetup.',
        words: [
          { korean: '사귀다', english: 'to make friends/date' },
          { korean: '언어 교환', english: 'language exchange' },
          { korean: '모임', english: 'gathering/meetup' },
          { korean: '나가다', english: 'to go out/attend' },
        ],
      },
      {
        korean: '거기에서 지현이라는 한국 사람을 만났습니다. 지현은 영어를 배우고 싶어 했습니다.',
        english: 'There I met a Korean person named Jihyeon. Jihyeon wanted to learn English.',
        words: [
          { korean: '거기', english: 'there' },
          { korean: '영어', english: 'English' },
          { korean: '배우다', english: 'to learn' },
        ],
      },
      {
        korean: '우리는 매주 만나서 한국어와 영어를 서로 가르쳐 줬습니다. 가끔 같이 맛집에 갔습니다.',
        english: 'We met every week and taught each other Korean and English. Sometimes we went to popular restaurants together.',
        words: [
          { korean: '매주', english: 'every week' },
          { korean: '서로', english: 'each other' },
          { korean: '가르치다', english: 'to teach' },
          { korean: '맛집', english: 'popular/famous restaurant' },
        ],
      },
      {
        korean: '지금 지현은 제 가장 친한 친구입니다. 한국에서 좋은 친구를 만나서 행복합니다.',
        english: 'Now Jihyeon is my closest friend. I\'m happy to have met a good friend in Korea.',
        words: [
          { korean: '가장', english: 'most/the most' },
          { korean: '친하다', english: 'to be close (relationship)' },
          { korean: '행복하다', english: 'to be happy' },
        ],
      },
    ],
    questions: [
      {
        question: 'How did the speaker meet Jihyeon?',
        questionKorean: '어떻게 지현을 만났습니까?',
        options: ['At school', 'At a language exchange meetup', 'At work', 'Online'],
        correctIndex: 1,
        explanation: 'The story says "언어 교환 모임에 나갔습니다" (went to a language exchange meetup).',
      },
      {
        question: 'What did Jihyeon want to learn?',
        questionKorean: '지현은 무엇을 배우고 싶어 했습니까?',
        options: ['Japanese', 'Chinese', 'English', 'French'],
        correctIndex: 2,
        explanation: 'The story says "지현은 영어를 배우고 싶어 했습니다" (Jihyeon wanted to learn English).',
      },
      {
        question: 'How often did they meet?',
        questionKorean: '얼마나 자주 만났습니까?',
        options: ['Every day', 'Every week', 'Every month', 'Twice a week'],
        correctIndex: 1,
        explanation: 'The story says "매주 만나서" (met every week).',
      },
    ],
  },
  {
    id: 'story-korean-holiday',
    title: 'Korean Holiday',
    titleKorean: '한국의 명절',
    level: 'intermediate',
    category: 'culture',
    paragraphs: [
      {
        korean: '추석은 한국의 중요한 명절입니다. 한국판 추수감사절이라고 할 수 있습니다.',
        english: 'Chuseok is an important Korean holiday. It can be called the Korean version of Thanksgiving.',
        words: [
          { korean: '추석', english: 'Chuseok (Korean harvest festival)' },
          { korean: '명절', english: 'holiday/festival' },
          { korean: '추수감사절', english: 'Thanksgiving' },
        ],
      },
      {
        korean: '추석에는 가족이 모두 모입니다. 고향에 가는 사람이 많아서 길이 매우 막힙니다.',
        english: 'During Chuseok, all family members gather. Many people go to their hometown, so the roads are very congested.',
        words: [
          { korean: '모이다', english: 'to gather' },
          { korean: '고향', english: 'hometown' },
          { korean: '길이 막히다', english: 'to be congested (traffic)' },
        ],
      },
      {
        korean: '송편을 만들어 먹습니다. 송편은 쌀로 만든 반달 모양의 떡입니다.',
        english: 'People make and eat songpyeon. Songpyeon is a half-moon shaped rice cake.',
        words: [
          { korean: '송편', english: 'songpyeon (rice cake)' },
          { korean: '쌀', english: 'rice (uncooked)' },
          { korean: '반달', english: 'half-moon' },
          { korean: '떡', english: 'rice cake' },
        ],
      },
      {
        korean: '차례를 지내고 성묘를 합니다. 이것은 조상에게 감사하는 전통입니다.',
        english: 'People perform ancestral rites and visit graves. This is a tradition of giving thanks to ancestors.',
        words: [
          { korean: '차례', english: 'ancestral rites' },
          { korean: '성묘', english: 'visiting graves' },
          { korean: '조상', english: 'ancestors' },
          { korean: '감사하다', english: 'to be thankful' },
        ],
      },
    ],
    questions: [
      {
        question: 'What is songpyeon?',
        questionKorean: '송편은 무엇입니까?',
        options: ['A type of soup', 'A half-moon shaped rice cake', 'A type of kimchi', 'A meat dish'],
        correctIndex: 1,
        explanation: 'The story says "송편은 쌀로 만든 반달 모양의 떡입니다" (songpyeon is a half-moon shaped rice cake).',
      },
      {
        question: 'Why are roads congested during Chuseok?',
        questionKorean: '추석에 왜 길이 막힙니까?',
        options: ['Because of construction', 'Many people go to their hometown', 'Because of an accident', 'Because of a parade'],
        correctIndex: 1,
        explanation: 'The story says "고향에 가는 사람이 많아서 길이 매우 막힙니다" (many people go to their hometown so roads are congested).',
      },
    ],
  },
  {
    id: 'story-lost-subway',
    title: 'Lost in the Subway',
    titleKorean: '지하철에서 길을 잃다',
    level: 'intermediate',
    category: 'travel',
    paragraphs: [
      {
        korean: '서울 지하철은 복잡합니다. 노선이 아주 많습니다. 저는 처음으로 혼자 지하철을 탔습니다.',
        english: 'The Seoul subway is complex. There are many lines. I rode the subway alone for the first time.',
        words: [
          { korean: '지하철', english: 'subway' },
          { korean: '복잡하다', english: 'to be complex/complicated' },
          { korean: '노선', english: 'route/line' },
          { korean: '혼자', english: 'alone' },
        ],
      },
      {
        korean: '2호선에서 4호선으로 갈아타야 했습니다. 하지만 반대 방향으로 탔습니다.',
        english: 'I had to transfer from line 2 to line 4. But I got on going in the wrong direction.',
        words: [
          { korean: '갈아타다', english: 'to transfer' },
          { korean: '반대', english: 'opposite' },
          { korean: '방향', english: 'direction' },
        ],
      },
      {
        korean: '모르는 역에 도착했습니다. 당황해서 역무원에게 물어봤습니다.',
        english: 'I arrived at an unknown station. I was flustered and asked a station worker.',
        words: [
          { korean: '역', english: 'station' },
          { korean: '도착하다', english: 'to arrive' },
          { korean: '당황하다', english: 'to be flustered' },
          { korean: '역무원', english: 'station worker' },
        ],
      },
      {
        korean: '역무원이 친절하게 알려 줬습니다. 덕분에 무사히 목적지에 도착했습니다.',
        english: 'The station worker kindly told me the way. Thanks to them, I safely arrived at my destination.',
        words: [
          { korean: '친절하게', english: 'kindly' },
          { korean: '덕분에', english: 'thanks to' },
          { korean: '무사히', english: 'safely' },
          { korean: '목적지', english: 'destination' },
        ],
      },
    ],
    questions: [
      {
        question: 'What line did the speaker need to transfer to?',
        questionKorean: '몇 호선으로 갈아타야 했습니까?',
        options: ['Line 1', 'Line 3', 'Line 4', 'Line 5'],
        correctIndex: 2,
        explanation: 'The story says "2호선에서 4호선으로 갈아타야 했습니다" (had to transfer from line 2 to line 4).',
      },
      {
        question: 'What mistake did the speaker make?',
        questionKorean: '무슨 실수를 했습니까?',
        options: ['Got off at the wrong station', 'Went in the wrong direction', 'Missed the last train', 'Lost the ticket'],
        correctIndex: 1,
        explanation: 'The story says "반대 방향으로 탔습니다" (got on going in the opposite direction).',
      },
      {
        question: 'Who helped the speaker?',
        questionKorean: '누가 도와줬습니까?',
        options: ['A friend', 'A police officer', 'A station worker', 'A stranger'],
        correctIndex: 2,
        explanation: 'The story says "역무원에게 물어봤습니다" (asked a station worker).',
      },
    ],
  },
  {
    id: 'story-ordering-delivery',
    title: 'Ordering Delivery',
    titleKorean: '배달 주문하기',
    level: 'intermediate',
    category: 'food',
    paragraphs: [
      {
        korean: '오늘은 피곤해서 요리하고 싶지 않았습니다. 그래서 배달 앱으로 음식을 주문했습니다.',
        english: 'Today I was tired and didn\'t want to cook. So I ordered food through a delivery app.',
        words: [
          { korean: '피곤하다', english: 'to be tired' },
          { korean: '요리하다', english: 'to cook' },
          { korean: '배달', english: 'delivery' },
          { korean: '앱', english: 'app' },
        ],
      },
      {
        korean: '치킨과 떡볶이를 주문했습니다. 배달비는 3,000원이었습니다.',
        english: 'I ordered chicken and tteokbokki. The delivery fee was 3,000 won.',
        words: [
          { korean: '치킨', english: 'fried chicken' },
          { korean: '떡볶이', english: 'tteokbokki (spicy rice cakes)' },
          { korean: '배달비', english: 'delivery fee' },
        ],
      },
      {
        korean: '30분 후에 배달이 왔습니다. 치킨은 바삭하고 떡볶이는 매콤했습니다.',
        english: 'The delivery arrived 30 minutes later. The chicken was crispy and the tteokbokki was spicy.',
        words: [
          { korean: '후에', english: 'after/later' },
          { korean: '바삭하다', english: 'to be crispy' },
          { korean: '매콤하다', english: 'to be mildly spicy' },
        ],
      },
      {
        korean: '한국의 배달 문화는 정말 편리합니다. 어디서든 빠르게 배달됩니다.',
        english: 'Korea\'s delivery culture is really convenient. Delivery is fast from anywhere.',
        words: [
          { korean: '문화', english: 'culture' },
          { korean: '편리하다', english: 'to be convenient' },
          { korean: '어디서든', english: 'from anywhere' },
          { korean: '빠르다', english: 'to be fast' },
        ],
      },
    ],
    questions: [
      {
        question: 'Why did the speaker order delivery?',
        questionKorean: '왜 배달을 주문했습니까?',
        options: ['Was hungry', 'Was tired', 'Had no food at home', 'Had a guest'],
        correctIndex: 1,
        explanation: 'The story says "피곤해서 요리하고 싶지 않았습니다" (was tired and didn\'t want to cook).',
      },
      {
        question: 'How long did the delivery take?',
        questionKorean: '배달이 얼마나 걸렸습니까?',
        options: ['10 minutes', '20 minutes', '30 minutes', '1 hour'],
        correctIndex: 2,
        explanation: 'The story says "30분 후에 배달이 왔습니다" (delivery arrived 30 minutes later).',
      },
    ],
  },

  // ===== ADVANCED STORIES (17-20) =====
  {
    id: 'story-korean-work-culture',
    title: 'Korean Work Culture',
    titleKorean: '한국의 직장 문화',
    level: 'advanced',
    category: 'culture',
    paragraphs: [
      {
        korean: '한국의 직장 문화는 독특합니다. 상하 관계가 중요하고 선배를 존경해야 합니다.',
        english: 'Korean work culture is unique. Hierarchy is important and you must respect your seniors.',
        words: [
          { korean: '직장', english: 'workplace' },
          { korean: '독특하다', english: 'to be unique' },
          { korean: '상하 관계', english: 'hierarchy' },
          { korean: '존경하다', english: 'to respect' },
        ],
      },
      {
        korean: '회식은 한국 회사의 중요한 문화입니다. 퇴근 후에 동료들과 함께 식사를 하고 술을 마십니다.',
        english: 'Hoesik (company dinner) is an important part of Korean company culture. After work, colleagues eat and drink together.',
        words: [
          { korean: '회식', english: 'company dinner' },
          { korean: '퇴근', english: 'leaving work' },
          { korean: '동료', english: 'colleague' },
          { korean: '함께', english: 'together' },
        ],
      },
      {
        korean: '최근에는 워라밸을 중요하게 생각하는 회사가 늘고 있습니다. 유연근무제를 도입하는 기업도 많습니다.',
        english: 'Recently, more companies value work-life balance. Many companies are also introducing flexible work arrangements.',
        words: [
          { korean: '워라밸', english: 'work-life balance' },
          { korean: '유연근무제', english: 'flexible work system' },
          { korean: '도입하다', english: 'to introduce/adopt' },
          { korean: '기업', english: 'enterprise/company' },
        ],
      },
      {
        korean: '또한 수평적인 조직 문화를 만들려는 노력도 있습니다. 직급 대신 영어 이름을 사용하는 스타트업도 있습니다.',
        english: 'There are also efforts to create a more horizontal organizational culture. Some startups use English names instead of job titles.',
        words: [
          { korean: '수평적', english: 'horizontal/flat' },
          { korean: '조직', english: 'organization' },
          { korean: '직급', english: 'job title/rank' },
          { korean: '스타트업', english: 'startup' },
        ],
      },
      {
        korean: '한국의 직장 문화는 빠르게 변하고 있습니다. 전통과 현대가 공존하는 모습이 흥미롭습니다.',
        english: 'Korean work culture is changing rapidly. It is interesting to see tradition and modernity coexist.',
        words: [
          { korean: '변하다', english: 'to change' },
          { korean: '전통', english: 'tradition' },
          { korean: '현대', english: 'modern times' },
          { korean: '공존하다', english: 'to coexist' },
          { korean: '흥미롭다', english: 'to be interesting' },
        ],
      },
    ],
    questions: [
      {
        question: 'What is "hoesik"?',
        questionKorean: '회식은 무엇입니까?',
        options: ['A type of food', 'A company dinner', 'A meeting', 'A business trip'],
        correctIndex: 1,
        explanation: 'The story explains "회식은 한국 회사의 중요한 문화입니다" and describes eating and drinking with colleagues after work.',
      },
      {
        question: 'What trend is increasing in Korean workplaces?',
        questionKorean: '한국 직장에서 어떤 변화가 있습니까?',
        options: ['Longer working hours', 'More hierarchy', 'Work-life balance focus', 'Fewer holidays'],
        correctIndex: 2,
        explanation: 'The story says "워라밸을 중요하게 생각하는 회사가 늘고 있습니다" (more companies value work-life balance).',
      },
      {
        question: 'What do some startups use instead of job titles?',
        questionKorean: '일부 스타트업에서는 직급 대신 무엇을 사용합니까?',
        options: ['Numbers', 'Nicknames', 'English names', 'Korean names'],
        correctIndex: 2,
        explanation: 'The story says "직급 대신 영어 이름을 사용하는 스타트업도 있습니다" (some startups use English names instead of titles).',
      },
    ],
  },
  {
    id: 'story-generational-differences',
    title: 'Generational Differences',
    titleKorean: '세대 차이',
    level: 'advanced',
    category: 'culture',
    paragraphs: [
      {
        korean: '한국에서는 세대 간의 차이가 뚜렷합니다. 기성세대와 MZ세대의 가치관이 다릅니다.',
        english: 'In Korea, generational differences are distinct. The values of the older generation and the MZ generation are different.',
        words: [
          { korean: '세대', english: 'generation' },
          { korean: '뚜렷하다', english: 'to be distinct/clear' },
          { korean: '기성세대', english: 'established/older generation' },
          { korean: '가치관', english: 'values/worldview' },
        ],
      },
      {
        korean: '기성세대는 안정적인 직장과 결혼을 중요하게 여깁니다. 하지만 젊은 세대는 개인의 행복과 자유를 더 중시합니다.',
        english: 'The older generation values a stable job and marriage. But the younger generation values personal happiness and freedom more.',
        words: [
          { korean: '안정적', english: 'stable' },
          { korean: '결혼', english: 'marriage' },
          { korean: '개인', english: 'individual' },
          { korean: '중시하다', english: 'to value/emphasize' },
        ],
      },
      {
        korean: '소비 습관도 다릅니다. 젊은 세대는 경험을 위해 돈을 쓰는 경향이 있습니다. "욜로"라는 말이 유행하기도 했습니다.',
        english: 'Spending habits are also different. The younger generation tends to spend money on experiences. The word "YOLO" was also trendy.',
        words: [
          { korean: '소비', english: 'consumption/spending' },
          { korean: '습관', english: 'habit' },
          { korean: '경험', english: 'experience' },
          { korean: '경향', english: 'tendency' },
          { korean: '유행하다', english: 'to be trendy' },
        ],
      },
      {
        korean: '하지만 세대 차이에도 불구하고 가족을 소중히 여기는 마음은 같습니다. 서로 이해하려는 노력이 필요합니다.',
        english: 'However, despite generational differences, the heart that cherishes family is the same. Efforts to understand each other are needed.',
        words: [
          { korean: '불구하고', english: 'despite/regardless of' },
          { korean: '소중히', english: 'preciously/dearly' },
          { korean: '이해하다', english: 'to understand' },
          { korean: '노력', english: 'effort' },
        ],
      },
    ],
    questions: [
      {
        question: 'What does the older generation value?',
        questionKorean: '기성세대는 무엇을 중요하게 여깁니까?',
        options: ['Travel and adventure', 'Stable job and marriage', 'Freedom and experiences', 'Social media'],
        correctIndex: 1,
        explanation: 'The story says "기성세대는 안정적인 직장과 결혼을 중요하게 여깁니다" (older generation values stable job and marriage).',
      },
      {
        question: 'What do both generations share?',
        questionKorean: '두 세대의 공통점은 무엇입니까?',
        options: ['Spending habits', 'Career goals', 'Cherishing family', 'Political views'],
        correctIndex: 2,
        explanation: 'The story says "가족을 소중히 여기는 마음은 같습니다" (the heart that cherishes family is the same).',
      },
      {
        question: 'What does the younger generation tend to spend money on?',
        questionKorean: '젊은 세대는 무엇에 돈을 씁니까?',
        options: ['Saving for the future', 'Experiences', 'Real estate', 'Luxury goods'],
        correctIndex: 1,
        explanation: 'The story says "경험을 위해 돈을 쓰는 경향이 있습니다" (tends to spend money on experiences).',
      },
    ],
  },
  {
    id: 'story-kdrama-plot',
    title: 'K-Drama Plot',
    titleKorean: '드라마 줄거리',
    level: 'advanced',
    category: 'culture',
    paragraphs: [
      {
        korean: '수진은 작은 회사에서 일하는 평범한 회사원입니다. 어느 날, 회사의 새로운 대표가 부임합니다.',
        english: 'Sujin is an ordinary office worker at a small company. One day, the company\'s new CEO arrives.',
        words: [
          { korean: '평범하다', english: 'to be ordinary' },
          { korean: '회사원', english: 'office worker' },
          { korean: '대표', english: 'representative/CEO' },
          { korean: '부임하다', english: 'to take up a new post' },
        ],
      },
      {
        korean: '새 대표 준혁은 차갑고 엄격한 사람이었습니다. 직원들은 그를 무서워했습니다. 하지만 수진은 당당하게 자신의 의견을 말했습니다.',
        english: 'The new CEO Junhyeok was cold and strict. The employees were afraid of him. But Sujin confidently expressed her opinions.',
        words: [
          { korean: '차갑다', english: 'to be cold' },
          { korean: '엄격하다', english: 'to be strict' },
          { korean: '무서워하다', english: 'to be afraid of' },
          { korean: '당당하다', english: 'to be confident/dignified' },
          { korean: '의견', english: 'opinion' },
        ],
      },
      {
        korean: '준혁은 수진에게 점점 관심을 갖기 시작합니다. 둘은 프로젝트를 함께 하면서 가까워집니다.',
        english: 'Junhyeok gradually starts to become interested in Sujin. They grow closer while working on a project together.',
        words: [
          { korean: '점점', english: 'gradually' },
          { korean: '관심을 갖다', english: 'to become interested' },
          { korean: '프로젝트', english: 'project' },
          { korean: '가까워지다', english: 'to become closer' },
        ],
      },
      {
        korean: '하지만 준혁에게는 비밀이 있었습니다. 그는 사실 회사의 창립자의 아들이었습니다. 이 비밀이 밝혀지면 둘의 관계는 어떻게 될까요?',
        english: 'But Junhyeok had a secret. He was actually the son of the company\'s founder. What will happen to their relationship when this secret is revealed?',
        words: [
          { korean: '비밀', english: 'secret' },
          { korean: '사실', english: 'actually/truth' },
          { korean: '창립자', english: 'founder' },
          { korean: '밝혀지다', english: 'to be revealed' },
          { korean: '관계', english: 'relationship' },
        ],
      },
    ],
    questions: [
      {
        question: 'What is Sujin\'s personality like?',
        questionKorean: '수진은 어떤 성격입니까?',
        options: ['Shy and quiet', 'Confident and speaks her mind', 'Cold and strict', 'Lazy and careless'],
        correctIndex: 1,
        explanation: 'The story says "수진은 당당하게 자신의 의견을 말했습니다" (Sujin confidently expressed her opinions).',
      },
      {
        question: 'What is Junhyeok\'s secret?',
        questionKorean: '준혁의 비밀은 무엇입니까?',
        options: ['He is from another country', 'He is the founder\'s son', 'He is not the real CEO', 'He is leaving the company'],
        correctIndex: 1,
        explanation: 'The story says "그는 사실 회사의 창립자의 아들이었습니다" (he was actually the founder\'s son).',
      },
      {
        question: 'How did the employees feel about Junhyeok?',
        questionKorean: '직원들은 준혁을 어떻게 생각했습니까?',
        options: ['They liked him', 'They were afraid of him', 'They ignored him', 'They admired him'],
        correctIndex: 1,
        explanation: 'The story says "직원들은 그를 무서워했습니다" (employees were afraid of him).',
      },
    ],
  },
  {
    id: 'story-university-life',
    title: 'University Life',
    titleKorean: '대학 생활',
    level: 'advanced',
    category: 'school',
    paragraphs: [
      {
        korean: '한국의 대학 생활은 활기차고 다양합니다. 학생들은 전공 공부뿐만 아니라 동아리 활동도 열심히 합니다.',
        english: 'University life in Korea is lively and diverse. Students not only study their major but also actively participate in club activities.',
        words: [
          { korean: '활기차다', english: 'to be lively/vibrant' },
          { korean: '전공', english: 'major (field of study)' },
          { korean: '동아리', english: 'club/circle' },
          { korean: '활동', english: 'activity' },
        ],
      },
      {
        korean: '중간고사와 기말고사 기간에는 도서관이 항상 가득 찹니다. 밤새 공부하는 학생도 많습니다.',
        english: 'During midterms and finals, the library is always full. Many students study all night.',
        words: [
          { korean: '중간고사', english: 'midterm exam' },
          { korean: '기말고사', english: 'final exam' },
          { korean: '도서관', english: 'library' },
          { korean: '밤새', english: 'all night' },
        ],
      },
      {
        korean: '대학교 축제는 한국 대학의 꽃입니다. 유명한 가수가 와서 공연을 하고 다양한 부스와 행사가 있습니다.',
        english: 'The university festival is the highlight of Korean university life. Famous singers come to perform, and there are various booths and events.',
        words: [
          { korean: '축제', english: 'festival' },
          { korean: '공연', english: 'performance' },
          { korean: '부스', english: 'booth' },
          { korean: '행사', english: 'event' },
        ],
      },
      {
        korean: '많은 학생들이 학비를 위해 아르바이트를 합니다. 카페나 편의점에서 일하는 경우가 많습니다.',
        english: 'Many students work part-time for tuition. It is common to work at cafes or convenience stores.',
        words: [
          { korean: '학비', english: 'tuition' },
          { korean: '아르바이트', english: 'part-time job' },
          { korean: '경우', english: 'case/situation' },
        ],
      },
      {
        korean: '취업 준비도 대학 생활의 중요한 부분입니다. 많은 학생들이 인턴십과 자격증 시험을 준비합니다.',
        english: 'Job preparation is also an important part of university life. Many students prepare for internships and qualification exams.',
        words: [
          { korean: '취업', english: 'employment/getting a job' },
          { korean: '준비', english: 'preparation' },
          { korean: '인턴십', english: 'internship' },
          { korean: '자격증', english: 'qualification/certificate' },
        ],
      },
    ],
    questions: [
      {
        question: 'What happens during university festivals?',
        questionKorean: '대학교 축제에서 무엇을 합니까?',
        options: ['Only studying', 'Famous singer performances and events', 'Sports competitions only', 'Nothing special'],
        correctIndex: 1,
        explanation: 'The story says "유명한 가수가 와서 공연을 하고 다양한 부스와 행사가 있습니다" (famous singers perform and there are various booths and events).',
      },
      {
        question: 'Where do many students work part-time?',
        questionKorean: '많은 학생들이 어디에서 아르바이트를 합니까?',
        options: ['Office buildings', 'Factories', 'Cafes or convenience stores', 'Hospitals'],
        correctIndex: 2,
        explanation: 'The story says "카페나 편의점에서 일하는 경우가 많습니다" (common to work at cafes or convenience stores).',
      },
      {
        question: 'What do students prepare for besides studying?',
        questionKorean: '공부 외에 학생들은 무엇을 준비합니까?',
        options: ['Travel abroad', 'Military service', 'Internships and qualification exams', 'Moving out'],
        correctIndex: 2,
        explanation: 'The story says "인턴십과 자격증 시험을 준비합니다" (prepare for internships and qualification exams).',
      },
    ],
  },
];

export function getStoryById(id: string): MiniStory | undefined {
  return miniStories.find((s) => s.id === id);
}

export function getStoriesByLevel(level: 'beginner' | 'intermediate' | 'advanced'): MiniStory[] {
  return miniStories.filter((s) => s.level === level);
}

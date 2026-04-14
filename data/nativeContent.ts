export interface NativeContentLine {
  korean: string;
  romanization: string;
  english: string;
  words: { korean: string; english: string }[];
  grammarNotes?: string[];
}

export interface NativeContent {
  id: string;
  type: 'headline' | 'lyrics' | 'dialogue';
  title: string;
  titleKorean: string;
  source: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  lines: NativeContentLine[];
}

export const nativeContent: NativeContent[] = [
  // === HEADLINES (5) ===
  {
    id: 'headline_1',
    type: 'headline',
    title: 'Spring Weather Forecast',
    titleKorean: '봄 날씨 예보',
    source: 'Korean Weather News',
    level: 'beginner',
    lines: [
      {
        korean: '내일 서울은 맑고 따뜻합니다.',
        romanization: 'naeil seoureun malkgo ttatteutamnida.',
        english: 'Tomorrow Seoul will be clear and warm.',
        words: [
          { korean: '내일', english: 'tomorrow' },
          { korean: '서울', english: 'Seoul' },
          { korean: '맑다', english: 'clear' },
          { korean: '따뜻하다', english: 'warm' },
        ],
      },
      {
        korean: '최고 기온은 22도입니다.',
        romanization: 'choego gionneun 22doibnida.',
        english: 'The high temperature is 22 degrees.',
        words: [
          { korean: '최고', english: 'highest' },
          { korean: '기온', english: 'temperature' },
          { korean: '도', english: 'degree' },
        ],
      },
      {
        korean: '봄꽃이 피기 시작했습니다.',
        romanization: 'bomkkochi pigi sijakhaesseumnida.',
        english: 'Spring flowers have started to bloom.',
        words: [
          { korean: '봄꽃', english: 'spring flowers' },
          { korean: '피다', english: 'to bloom' },
          { korean: '시작하다', english: 'to start' },
        ],
        grammarNotes: ['V + 기 시작하다 = to start doing V'],
      },
    ],
  },
  {
    id: 'headline_2',
    type: 'headline',
    title: 'Food Festival in Busan',
    titleKorean: '부산 음식 축제',
    source: 'Korean Food News',
    level: 'beginner',
    lines: [
      {
        korean: '부산에서 해산물 축제가 열립니다.',
        romanization: 'busaneseo haesanmul chukjega yeollimnida.',
        english: 'A seafood festival opens in Busan.',
        words: [
          { korean: '부산', english: 'Busan' },
          { korean: '해산물', english: 'seafood' },
          { korean: '축제', english: 'festival' },
          { korean: '열리다', english: 'to open / be held' },
        ],
      },
      {
        korean: '다양한 한국 음식을 맛볼 수 있습니다.',
        romanization: 'dayanghan hanguk eumsigeul matbol su isseumnida.',
        english: 'You can taste various Korean foods.',
        words: [
          { korean: '다양한', english: 'various' },
          { korean: '음식', english: 'food' },
          { korean: '맛보다', english: 'to taste' },
        ],
        grammarNotes: ['V + (으)ㄹ 수 있다 = can do V'],
      },
      {
        korean: '이번 주말까지 진행됩니다.',
        romanization: 'ibeon jumalkkaji jinhaengdoemnida.',
        english: 'It runs until this weekend.',
        words: [
          { korean: '이번', english: 'this (time)' },
          { korean: '주말', english: 'weekend' },
          { korean: '까지', english: 'until' },
          { korean: '진행되다', english: 'to proceed / run' },
        ],
      },
    ],
  },
  {
    id: 'headline_3',
    type: 'headline',
    title: 'K-Pop Concert Sold Out',
    titleKorean: 'K-Pop 콘서트 매진',
    source: 'Entertainment Daily',
    level: 'intermediate',
    lines: [
      {
        korean: '인기 아이돌 그룹의 콘서트 티켓이 매진되었습니다.',
        romanization: 'ingi aidol geurubeui konseoteu tikesi maejindoeeosseumnida.',
        english: 'Tickets for the popular idol group\'s concert sold out.',
        words: [
          { korean: '인기', english: 'popular / popularity' },
          { korean: '아이돌', english: 'idol' },
          { korean: '그룹', english: 'group' },
          { korean: '티켓', english: 'ticket' },
          { korean: '매진되다', english: 'to be sold out' },
        ],
      },
      {
        korean: '팬들은 온라인으로 3시간 동안 기다렸습니다.',
        romanization: 'paendeureun onlaineuro 3sigan dongan gidaryeosseumnida.',
        english: 'Fans waited online for 3 hours.',
        words: [
          { korean: '팬', english: 'fan' },
          { korean: '온라인', english: 'online' },
          { korean: '시간', english: 'hour' },
          { korean: '동안', english: 'during / for' },
          { korean: '기다리다', english: 'to wait' },
        ],
      },
      {
        korean: '추가 공연이 검토 중입니다.',
        romanization: 'chuga gongyeoni geomto jungbimnida.',
        english: 'Additional performances are under review.',
        words: [
          { korean: '추가', english: 'additional' },
          { korean: '공연', english: 'performance' },
          { korean: '검토', english: 'review' },
          { korean: '중', english: 'in the middle of' },
        ],
      },
    ],
  },
  {
    id: 'headline_4',
    type: 'headline',
    title: 'Jeju Island Travel Guide',
    titleKorean: '제주도 여행 안내',
    source: 'Korea Travel Magazine',
    level: 'beginner',
    lines: [
      {
        korean: '제주도는 한국에서 가장 인기 있는 여행지입니다.',
        romanization: 'jejudoneun hangugeseo gajang ingi inneun yeohaengjiimnida.',
        english: 'Jeju Island is the most popular travel destination in Korea.',
        words: [
          { korean: '제주도', english: 'Jeju Island' },
          { korean: '가장', english: 'most' },
          { korean: '인기 있다', english: 'to be popular' },
          { korean: '여행지', english: 'travel destination' },
        ],
      },
      {
        korean: '아름다운 바다와 맛있는 음식이 유명합니다.',
        romanization: 'areumdaun badawa masinneun eumsigi yumyeonghamnida.',
        english: 'The beautiful ocean and delicious food are famous.',
        words: [
          { korean: '아름다운', english: 'beautiful' },
          { korean: '바다', english: 'ocean / sea' },
          { korean: '맛있는', english: 'delicious' },
          { korean: '유명하다', english: 'to be famous' },
        ],
      },
      {
        korean: '비행기로 한 시간이면 갈 수 있습니다.',
        romanization: 'bihaenggiro han siganmyeon gal su isseumnida.',
        english: 'You can get there in one hour by plane.',
        words: [
          { korean: '비행기', english: 'airplane' },
          { korean: '한 시간', english: 'one hour' },
          { korean: '가다', english: 'to go' },
        ],
        grammarNotes: ['N + (이)면 = if / in (conditional)', 'N + (으)로 = by means of'],
      },
    ],
  },
  {
    id: 'headline_5',
    type: 'headline',
    title: 'New Korean Drama Premieres',
    titleKorean: '새 한국 드라마 첫 방송',
    source: 'Drama News Korea',
    level: 'intermediate',
    lines: [
      {
        korean: '새로운 로맨스 드라마가 오늘 밤 첫 방송됩니다.',
        romanization: 'saeroun romaenseu deuramaga oneul bam cheot bangsongdoemnida.',
        english: 'A new romance drama premieres tonight.',
        words: [
          { korean: '새로운', english: 'new' },
          { korean: '로맨스', english: 'romance' },
          { korean: '드라마', english: 'drama' },
          { korean: '오늘 밤', english: 'tonight' },
          { korean: '첫', english: 'first' },
          { korean: '방송되다', english: 'to be broadcast' },
        ],
      },
      {
        korean: '유명한 배우 두 명이 주연을 맡았습니다.',
        romanization: 'yumyeonghan baeu du myeongi juyeoneul matasseumnida.',
        english: 'Two famous actors took the lead roles.',
        words: [
          { korean: '유명한', english: 'famous' },
          { korean: '배우', english: 'actor' },
          { korean: '두 명', english: 'two people' },
          { korean: '주연', english: 'lead role' },
          { korean: '맡다', english: 'to take on / be in charge of' },
        ],
      },
      {
        korean: '시청자들의 기대가 매우 높습니다.',
        romanization: 'sicheongja deureui gidaega maeu nopsseumnida.',
        english: 'Viewers\' expectations are very high.',
        words: [
          { korean: '시청자', english: 'viewer' },
          { korean: '기대', english: 'expectation' },
          { korean: '매우', english: 'very' },
          { korean: '높다', english: 'high' },
        ],
      },
    ],
  },

  // === LYRICS (5) ===
  {
    id: 'lyrics_1',
    type: 'lyrics',
    title: 'Starlight Love',
    titleKorean: '별빛 사랑',
    source: 'Original K-Pop Style',
    level: 'intermediate',
    lines: [
      {
        korean: '별빛 아래 너를 만났어',
        romanization: 'byeolbit arae neoreul mannasseo',
        english: 'I met you under the starlight',
        words: [
          { korean: '별빛', english: 'starlight' },
          { korean: '아래', english: 'under / below' },
          { korean: '너', english: 'you' },
          { korean: '만나다', english: 'to meet' },
        ],
      },
      {
        korean: '내 심장이 두근거렸어',
        romanization: 'nae simjangi dugeungeoryeosseo',
        english: 'My heart was pounding',
        words: [
          { korean: '심장', english: 'heart' },
          { korean: '두근거리다', english: 'to pound / flutter' },
        ],
      },
      {
        korean: '이 순간을 잊지 못할 거야',
        romanization: 'i sunganeul itji mothal geoya',
        english: 'I won\'t be able to forget this moment',
        words: [
          { korean: '순간', english: 'moment' },
          { korean: '잊다', english: 'to forget' },
          { korean: '못하다', english: 'cannot do' },
        ],
        grammarNotes: ['V + 지 못하다 = cannot do V', 'V + (으)ㄹ 거야 = will (casual future)'],
      },
      {
        korean: '너는 나의 전부야',
        romanization: 'neoneun naui jeonbuya',
        english: 'You are my everything',
        words: [
          { korean: '나의', english: 'my' },
          { korean: '전부', english: 'everything / all' },
        ],
      },
      {
        korean: '영원히 함께하자',
        romanization: 'yeongwonhi hamkkehaja',
        english: 'Let\'s be together forever',
        words: [
          { korean: '영원히', english: 'forever' },
          { korean: '함께하다', english: 'to be together' },
        ],
        grammarNotes: ['V + 자 = let\'s do V (casual suggestion)'],
      },
    ],
  },
  {
    id: 'lyrics_2',
    type: 'lyrics',
    title: 'Dream Highway',
    titleKorean: '꿈의 고속도로',
    source: 'Original K-Pop Style',
    level: 'intermediate',
    lines: [
      {
        korean: '달려가자 멈추지 말고',
        romanization: 'dallyeogaja meomchuji malgo',
        english: 'Let\'s run without stopping',
        words: [
          { korean: '달려가다', english: 'to run (toward)' },
          { korean: '멈추다', english: 'to stop' },
        ],
        grammarNotes: ['V + 지 말고 = without doing V / don\'t do V and...'],
      },
      {
        korean: '우리의 꿈을 향해서',
        romanization: 'uriui kkumeul hyanghaeseo',
        english: 'Toward our dreams',
        words: [
          { korean: '우리', english: 'we / our' },
          { korean: '꿈', english: 'dream' },
          { korean: '향하다', english: 'to head toward' },
        ],
      },
      {
        korean: '두려움은 뒤에 두고',
        romanization: 'duryeorumeun dwie dugo',
        english: 'Leave the fear behind',
        words: [
          { korean: '두려움', english: 'fear' },
          { korean: '뒤', english: 'behind / back' },
          { korean: '두다', english: 'to leave / put' },
        ],
      },
      {
        korean: '새로운 세상이 기다려',
        romanization: 'saeroun sesangi gidaryeo',
        english: 'A new world is waiting',
        words: [
          { korean: '새로운', english: 'new' },
          { korean: '세상', english: 'world' },
          { korean: '기다리다', english: 'to wait' },
        ],
      },
    ],
  },
  {
    id: 'lyrics_3',
    type: 'lyrics',
    title: 'Rainy Memories',
    titleKorean: '비 오는 날의 추억',
    source: 'Original K-Pop Style',
    level: 'intermediate',
    lines: [
      {
        korean: '비가 내리는 거리에서',
        romanization: 'biga naerineun georieseo',
        english: 'On the rainy street',
        words: [
          { korean: '비', english: 'rain' },
          { korean: '내리다', english: 'to fall (rain/snow)' },
          { korean: '거리', english: 'street' },
        ],
      },
      {
        korean: '우산 없이 걸었어',
        romanization: 'usan eopsi georeosseo',
        english: 'I walked without an umbrella',
        words: [
          { korean: '우산', english: 'umbrella' },
          { korean: '없이', english: 'without' },
          { korean: '걷다', english: 'to walk' },
        ],
      },
      {
        korean: '네가 보고 싶어서',
        romanization: 'nega bogo sipeoseo',
        english: 'Because I missed you',
        words: [
          { korean: '보고 싶다', english: 'to miss (someone)' },
        ],
        grammarNotes: ['V + 아/어서 = because (reason)'],
      },
      {
        korean: '눈물과 빗물이 섞여',
        romanization: 'nunmulgwa bitmuri seokyeo',
        english: 'Tears and raindrops are mixed',
        words: [
          { korean: '눈물', english: 'tears' },
          { korean: '빗물', english: 'rainwater / raindrops' },
          { korean: '섞이다', english: 'to be mixed' },
        ],
      },
      {
        korean: '다시 만날 수 있을까',
        romanization: 'dasi mannal su isseulkka',
        english: 'Can we meet again?',
        words: [
          { korean: '다시', english: 'again' },
          { korean: '만나다', english: 'to meet' },
        ],
        grammarNotes: ['V + (으)ㄹ 수 있을까 = I wonder if we can V'],
      },
    ],
  },
  {
    id: 'lyrics_4',
    type: 'lyrics',
    title: 'Sunshine Friend',
    titleKorean: '햇살 친구',
    source: 'Original K-Pop Style',
    level: 'intermediate',
    lines: [
      {
        korean: '힘들 때 네가 옆에 있었어',
        romanization: 'himdeul ttae nega yeope isseosseo',
        english: 'When it was hard, you were by my side',
        words: [
          { korean: '힘들다', english: 'to be hard / difficult' },
          { korean: '때', english: 'when / time' },
          { korean: '옆', english: 'side / next to' },
        ],
      },
      {
        korean: '웃음을 돌려줬어',
        romanization: 'useumeul dollyeojwosseo',
        english: 'You gave back my smile',
        words: [
          { korean: '웃음', english: 'smile / laughter' },
          { korean: '돌려주다', english: 'to give back / return' },
        ],
      },
      {
        korean: '고마운 내 친구야',
        romanization: 'gomaun nae chinguya',
        english: 'My dear friend, thank you',
        words: [
          { korean: '고맙다', english: 'to be thankful' },
          { korean: '친구', english: 'friend' },
        ],
      },
      {
        korean: '너는 나의 햇살이야',
        romanization: 'neoneun naui haessariya',
        english: 'You are my sunshine',
        words: [
          { korean: '햇살', english: 'sunshine / sunlight' },
        ],
      },
    ],
  },
  {
    id: 'lyrics_5',
    type: 'lyrics',
    title: 'First Snow',
    titleKorean: '첫눈',
    source: 'Original K-Pop Style',
    level: 'intermediate',
    lines: [
      {
        korean: '첫눈이 내리던 날',
        romanization: 'cheonnuni naerideon nal',
        english: 'The day the first snow fell',
        words: [
          { korean: '첫눈', english: 'first snow' },
          { korean: '내리다', english: 'to fall' },
          { korean: '날', english: 'day' },
        ],
        grammarNotes: ['V + 던 = past habitual / reminiscing modifier'],
      },
      {
        korean: '너의 손을 잡았어',
        romanization: 'neoui soneul jabasseo',
        english: 'I held your hand',
        words: [
          { korean: '손', english: 'hand' },
          { korean: '잡다', english: 'to hold / grab' },
        ],
      },
      {
        korean: '하얀 세상 속에서',
        romanization: 'hayan sesang sogeseo',
        english: 'In the white world',
        words: [
          { korean: '하얀', english: 'white' },
          { korean: '세상', english: 'world' },
          { korean: '속', english: 'inside' },
        ],
      },
      {
        korean: '우리 둘만의 약속',
        romanization: 'uri dulmanui yaksok',
        english: 'A promise just between us two',
        words: [
          { korean: '둘', english: 'two' },
          { korean: '만', english: 'only / just' },
          { korean: '약속', english: 'promise' },
        ],
      },
      {
        korean: '다음 겨울에도 함께하자',
        romanization: 'daeum gyeoure do hamkkehaja',
        english: 'Let\'s be together next winter too',
        words: [
          { korean: '다음', english: 'next' },
          { korean: '겨울', english: 'winter' },
          { korean: '도', english: 'also / too' },
          { korean: '함께하다', english: 'to be together' },
        ],
      },
    ],
  },

  // === DIALOGUES (5) ===
  {
    id: 'dialogue_1',
    type: 'dialogue',
    title: 'Ordering at a Cafe',
    titleKorean: '카페에서 주문하기',
    source: 'Everyday Conversations',
    level: 'intermediate',
    lines: [
      {
        korean: '직원: 어서오세요! 주문하시겠어요?',
        romanization: 'jigwon: eoseooseyo! jumunhasigesseoyo?',
        english: 'Staff: Welcome! Would you like to order?',
        words: [
          { korean: '어서오세요', english: 'welcome (please come in)' },
          { korean: '주문하다', english: 'to order' },
        ],
        grammarNotes: ['V + 시겠어요? = polite "would you like to" form'],
      },
      {
        korean: '손님: 아메리카노 한 잔 주세요.',
        romanization: 'sonnim: amerikano han jan juseyo.',
        english: 'Customer: One Americano, please.',
        words: [
          { korean: '손님', english: 'customer / guest' },
          { korean: '잔', english: 'cup (counter)' },
          { korean: '주세요', english: 'please give' },
        ],
      },
      {
        korean: '직원: 사이즈는 어떤 걸로 하시겠어요?',
        romanization: 'jigwon: saijeuneun eotteon geollo hasigesseoyo?',
        english: 'Staff: What size would you like?',
        words: [
          { korean: '사이즈', english: 'size' },
          { korean: '어떤', english: 'which / what kind' },
        ],
      },
      {
        korean: '손님: 큰 걸로 주세요. 따뜻한 걸로요.',
        romanization: 'sonnim: keun geollo juseyo. ttatteuthan geolloyo.',
        english: 'Customer: A large one, please. A hot one.',
        words: [
          { korean: '큰', english: 'big / large' },
          { korean: '따뜻한', english: 'warm / hot' },
        ],
        grammarNotes: ['N + (으)로 = choosing / selecting (as for)'],
      },
      {
        korean: '직원: 4500원입니다. 카드로 하시겠어요?',
        romanization: 'jigwon: 4500wonimnida. kadeuro hasigesseoyo?',
        english: 'Staff: That\'s 4,500 won. Will you pay by card?',
        words: [
          { korean: '원', english: 'won (currency)' },
          { korean: '카드', english: 'card' },
        ],
      },
      {
        korean: '손님: 네, 카드로 할게요.',
        romanization: 'sonnim: ne, kadeuro halgeyo.',
        english: 'Customer: Yes, I\'ll pay by card.',
        words: [
          { korean: '네', english: 'yes' },
        ],
        grammarNotes: ['V + (으)ㄹ게요 = I will (with listener consideration)'],
      },
    ],
  },
  {
    id: 'dialogue_2',
    type: 'dialogue',
    title: 'At the Office',
    titleKorean: '사무실에서',
    source: 'Business Korean',
    level: 'advanced',
    lines: [
      {
        korean: '김 과장: 이 보고서 검토해 주실 수 있으세요?',
        romanization: 'gim gwajang: i bogoseo geomtohae jusil su isseuseyo?',
        english: 'Manager Kim: Could you review this report?',
        words: [
          { korean: '과장', english: 'section chief / manager' },
          { korean: '보고서', english: 'report' },
          { korean: '검토하다', english: 'to review' },
        ],
        grammarNotes: ['V + 아/어 주실 수 있으세요? = very polite request'],
      },
      {
        korean: '박 대리: 네, 언제까지 필요하세요?',
        romanization: 'bak daeri: ne, eonjekkaji piryohaseyo?',
        english: 'Assistant Park: Yes, when do you need it by?',
        words: [
          { korean: '대리', english: 'assistant manager' },
          { korean: '언제까지', english: 'by when' },
          { korean: '필요하다', english: 'to need' },
        ],
      },
      {
        korean: '김 과장: 내일 오전까지 부탁드립니다.',
        romanization: 'gim gwajang: naeil ojeonkkaji butakdeurimnida.',
        english: 'Manager Kim: By tomorrow morning, please.',
        words: [
          { korean: '오전', english: 'morning / AM' },
          { korean: '부탁드리다', english: 'to request (humble)' },
        ],
      },
      {
        korean: '박 대리: 알겠습니다. 수정할 부분이 있으면 말씀해 주세요.',
        romanization: 'bak daeri: algesseumnida. sujeonghal bubuni isseumyeon malssumhae juseyo.',
        english: 'Assistant Park: Understood. Please let me know if there are parts to revise.',
        words: [
          { korean: '알겠습니다', english: 'understood (formal)' },
          { korean: '수정하다', english: 'to revise / correct' },
          { korean: '부분', english: 'part / section' },
          { korean: '말씀하다', english: 'to say (honorific)' },
        ],
        grammarNotes: ['V + (으)면 = if / when (conditional)'],
      },
      {
        korean: '김 과장: 고맙습니다. 수고하세요.',
        romanization: 'gim gwajang: gomapsseumnida. sugohaseyo.',
        english: 'Manager Kim: Thank you. Keep up the good work.',
        words: [
          { korean: '고맙습니다', english: 'thank you (formal)' },
          { korean: '수고하세요', english: 'keep up the good work' },
        ],
      },
    ],
  },
  {
    id: 'dialogue_3',
    type: 'dialogue',
    title: 'School Conversation',
    titleKorean: '학교에서 대화',
    source: 'Student Life Korean',
    level: 'intermediate',
    lines: [
      {
        korean: '민수: 오늘 숙제 다 했어?',
        romanization: 'minsu: oneul sukje da haesseo?',
        english: 'Minsu: Did you finish all the homework today?',
        words: [
          { korean: '숙제', english: 'homework' },
          { korean: '다', english: 'all / completely' },
        ],
      },
      {
        korean: '지영: 아니, 수학이 너무 어려웠어.',
        romanization: 'jiyeong: ani, suhagi neomu eoryeowosseo.',
        english: 'Jiyeong: No, math was too difficult.',
        words: [
          { korean: '수학', english: 'math' },
          { korean: '너무', english: 'too / very' },
          { korean: '어렵다', english: 'to be difficult' },
        ],
      },
      {
        korean: '민수: 나도! 같이 도서관에서 공부할까?',
        romanization: 'minsu: nado! gachi doseogwaneseo gongbuhalka?',
        english: 'Minsu: Me too! Shall we study together at the library?',
        words: [
          { korean: '같이', english: 'together' },
          { korean: '도서관', english: 'library' },
          { korean: '공부하다', english: 'to study' },
        ],
        grammarNotes: ['V + (으)ㄹ까? = shall we? / should we?'],
      },
      {
        korean: '지영: 좋아! 몇 시에 만날까?',
        romanization: 'jiyeong: joa! myeot sie mannalkka?',
        english: 'Jiyeong: Sounds good! What time shall we meet?',
        words: [
          { korean: '좋다', english: 'good' },
          { korean: '몇 시', english: 'what time' },
        ],
      },
      {
        korean: '민수: 3시 어때? 수업 끝나고 바로 가자.',
        romanization: 'minsu: 3si eottae? sueop kkeunnago baro gaja.',
        english: 'Minsu: How about 3 o\'clock? Let\'s go right after class ends.',
        words: [
          { korean: '어때', english: 'how about' },
          { korean: '수업', english: 'class' },
          { korean: '끝나다', english: 'to end / finish' },
          { korean: '바로', english: 'right away / immediately' },
        ],
        grammarNotes: ['V + 고 = and then / after doing V'],
      },
      {
        korean: '지영: 알겠어. 그럼 카페에서 간식도 사자!',
        romanization: 'jiyeong: algesseo. geureom kapeseo gansikdo saja!',
        english: 'Jiyeong: Got it. Then let\'s buy snacks at the cafe too!',
        words: [
          { korean: '알겠어', english: 'got it / understood' },
          { korean: '그럼', english: 'then' },
          { korean: '간식', english: 'snack' },
          { korean: '사다', english: 'to buy' },
        ],
      },
    ],
  },
  {
    id: 'dialogue_4',
    type: 'dialogue',
    title: 'At the Hospital',
    titleKorean: '병원에서',
    source: 'Medical Korean',
    level: 'advanced',
    lines: [
      {
        korean: '의사: 어디가 불편하세요?',
        romanization: 'uisa: eodiga bulpyeonhaseyo?',
        english: 'Doctor: Where does it bother you?',
        words: [
          { korean: '의사', english: 'doctor' },
          { korean: '어디', english: 'where' },
          { korean: '불편하다', english: 'to be uncomfortable / to bother' },
        ],
      },
      {
        korean: '환자: 며칠 전부터 머리가 아프고 열이 나요.',
        romanization: 'hwanja: myeochil jeonbuteo meoriga apeugo yeori nayo.',
        english: 'Patient: I\'ve had a headache and fever for a few days.',
        words: [
          { korean: '환자', english: 'patient' },
          { korean: '며칠', english: 'a few days' },
          { korean: '전부터', english: 'since before' },
          { korean: '머리', english: 'head' },
          { korean: '아프다', english: 'to hurt / be sick' },
          { korean: '열', english: 'fever' },
        ],
        grammarNotes: ['N + 부터 = from / since (time)'],
      },
      {
        korean: '의사: 목도 아프세요?',
        romanization: 'uisa: mokdo apeuseyo?',
        english: 'Doctor: Does your throat hurt too?',
        words: [
          { korean: '목', english: 'throat / neck' },
          { korean: '도', english: 'also / too' },
        ],
      },
      {
        korean: '환자: 네, 기침도 좀 해요.',
        romanization: 'hwanja: ne, gichimdo jom haeyo.',
        english: 'Patient: Yes, I also cough a bit.',
        words: [
          { korean: '기침', english: 'cough' },
          { korean: '좀', english: 'a bit / somewhat' },
        ],
      },
      {
        korean: '의사: 감기인 것 같습니다. 약을 처방해 드리겠습니다.',
        romanization: 'uisa: gamgiin geot gatsseumnida. yageul cheobonghae deurigesseumnida.',
        english: 'Doctor: It seems like a cold. I will prescribe medicine for you.',
        words: [
          { korean: '감기', english: 'cold (illness)' },
          { korean: '것 같다', english: 'it seems like' },
          { korean: '약', english: 'medicine' },
          { korean: '처방하다', english: 'to prescribe' },
        ],
        grammarNotes: ['N + 인 것 같다 = it seems like N', 'V + 아/어 드리다 = to do for someone (humble)'],
      },
      {
        korean: '환자: 감사합니다, 선생님. 푹 쉬어야 하나요?',
        romanization: 'hwanja: gamsahamnida, seonsaengnim. puk swieoya hanayo?',
        english: 'Patient: Thank you, doctor. Should I rest well?',
        words: [
          { korean: '감사합니다', english: 'thank you (formal)' },
          { korean: '선생님', english: 'teacher / doctor (honorific)' },
          { korean: '푹', english: 'deeply / fully' },
          { korean: '쉬다', english: 'to rest' },
        ],
        grammarNotes: ['V + 아/어야 하다 = must / should do V'],
      },
      {
        korean: '의사: 네, 이틀 정도 쉬시고 물을 많이 드세요.',
        romanization: 'uisa: ne, iteul jeongdo swisigo mureul mani deuseyo.',
        english: 'Doctor: Yes, rest for about two days and drink lots of water.',
        words: [
          { korean: '이틀', english: 'two days' },
          { korean: '정도', english: 'about / approximately' },
          { korean: '물', english: 'water' },
          { korean: '많이', english: 'a lot' },
          { korean: '드시다', english: 'to eat / drink (honorific)' },
        ],
      },
    ],
  },
  {
    id: 'dialogue_5',
    type: 'dialogue',
    title: 'Shopping at the Market',
    titleKorean: '시장에서 쇼핑',
    source: 'Market Korean',
    level: 'intermediate',
    lines: [
      {
        korean: '상인: 어서오세요! 뭘 찾으세요?',
        romanization: 'sangin: eoseooseyo! mwol chajeuseyo?',
        english: 'Vendor: Welcome! What are you looking for?',
        words: [
          { korean: '상인', english: 'vendor / merchant' },
          { korean: '찾다', english: 'to look for / find' },
        ],
      },
      {
        korean: '손님: 사과 있어요? 얼마예요?',
        romanization: 'sonnim: sagwa isseoyo? eolmayeyo?',
        english: 'Customer: Do you have apples? How much are they?',
        words: [
          { korean: '사과', english: 'apple' },
          { korean: '있다', english: 'to have / exist' },
          { korean: '얼마', english: 'how much' },
        ],
      },
      {
        korean: '상인: 한 봉지에 5000원이에요. 아주 신선해요!',
        romanization: 'sangin: han bongjie 5000wonieyo. aju sinseonhaeyo!',
        english: 'Vendor: 5,000 won per bag. They\'re very fresh!',
        words: [
          { korean: '봉지', english: 'bag' },
          { korean: '아주', english: 'very' },
          { korean: '신선하다', english: 'to be fresh' },
        ],
      },
      {
        korean: '손님: 좀 깎아 주세요. 두 봉지 살게요.',
        romanization: 'sonnim: jom kkakka juseyo. du bongji salgeyo.',
        english: 'Customer: Please give me a discount. I\'ll buy two bags.',
        words: [
          { korean: '깎다', english: 'to cut / discount' },
          { korean: '두', english: 'two' },
          { korean: '사다', english: 'to buy' },
        ],
        grammarNotes: ['V + 아/어 주세요 = please do V for me'],
      },
      {
        korean: '상인: 그러면 9000원에 드릴게요.',
        romanization: 'sangin: geureomyeon 9000wone deurilgeyo.',
        english: 'Vendor: Then I\'ll give them to you for 9,000 won.',
        words: [
          { korean: '그러면', english: 'then / in that case' },
          { korean: '드리다', english: 'to give (humble)' },
        ],
      },
      {
        korean: '손님: 좋아요! 여기 있어요.',
        romanization: 'sonnim: joayo! yeogi isseoyo.',
        english: 'Customer: Great! Here you go.',
        words: [
          { korean: '여기', english: 'here' },
        ],
      },
      {
        korean: '상인: 감사합니다. 또 오세요!',
        romanization: 'sangin: gamsahamnida. tto oseyo!',
        english: 'Vendor: Thank you. Come again!',
        words: [
          { korean: '또', english: 'again' },
          { korean: '오다', english: 'to come' },
        ],
      },
    ],
  },
];

export function getContentByType(type: NativeContent['type']): NativeContent[] {
  return nativeContent.filter((c) => c.type === type);
}

export function getContentByLevel(level: NativeContent['level']): NativeContent[] {
  return nativeContent.filter((c) => c.level === level);
}

export function getContentById(id: string): NativeContent | undefined {
  return nativeContent.find((c) => c.id === id);
}

export interface CultureLesson {
  id: string;
  title: string;
  titleKorean: string;
  order: number;
  description: string;
  sections: {
    heading: string;
    explanation: string;
    examples?: { korean: string; romanization: string; english: string }[];
    tip?: string;
  }[];
}

export const cultureLessons: CultureLesson[] = [
  {
    id: 'cult_honorifics',
    title: 'Korean Honorific System',
    titleKorean: '존댓말',
    order: 1,
    description: 'Korean has 7 speech levels that change based on the listener\'s age, social status, and your relationship. Mastering these is essential for natural Korean.',
    sections: [
      {
        heading: 'The 7 Speech Levels',
        explanation: 'Korean has seven distinct speech levels, from the most formal to the most casual. In daily life, three are used most often: formal polite (하십시오체), informal polite (해요체), and casual (해체). The remaining four are archaic or literary: 하오체 (semi-formal, old-fashioned), 하게체 (familiar, used by elders to younger adults), 해라체 (plain, used in writing/news), and 하소서체 (deferential, royal/religious).',
        examples: [
          { korean: '감사합니다', romanization: 'gamsahamnida', english: 'Thank you (formal polite - 하십시오체)' },
          { korean: '고마워요', romanization: 'gomawoyo', english: 'Thank you (informal polite - 해요체)' },
          { korean: '고마워', romanization: 'gomawo', english: 'Thanks (casual - 해체)' },
          { korean: '먹습니다', romanization: 'meokseumnida', english: 'I eat (formal polite)' },
          { korean: '먹어요', romanization: 'meogeoyo', english: 'I eat (informal polite)' },
        ],
        tip: 'As a foreigner, default to informal polite (해요체). It is safe in nearly every situation. Only use casual speech with close friends who are your age or younger.',
      },
      {
        heading: 'When to Use Formal vs Informal',
        explanation: 'Formal polite (합니다) is for business meetings, presentations, news broadcasts, talking to elders you do not know well, and customer service. Informal polite (해요) is the everyday default for conversations with strangers, acquaintances, coworkers, and shops. Casual (해) is reserved for close friends of the same age, younger siblings, children, and very intimate relationships.',
        examples: [
          { korean: '어디 가십니까?', romanization: 'eodi gasimnikka?', english: 'Where are you going? (formal polite)' },
          { korean: '어디 가요?', romanization: 'eodi gayo?', english: 'Where are you going? (informal polite)' },
          { korean: '어디 가?', romanization: 'eodi ga?', english: 'Where are you going? (casual)' },
        ],
        tip: 'If someone is older than you, never switch to casual speech unless they explicitly tell you to. Being asked to speak casually is a sign of closeness.',
      },
      {
        heading: 'Age Hierarchy and Language',
        explanation: 'Korean society places enormous importance on age. Even a one-year difference can determine who speaks formally and who speaks casually. When Koreans first meet, they often ask age early to establish the proper speech level. The older person may speak casually while the younger person must use polite or formal speech.',
        examples: [
          { korean: '형 / 오빠', romanization: 'hyeong / oppa', english: 'Older brother (male speaker / female speaker)' },
          { korean: '누나 / 언니', romanization: 'nuna / eonni', english: 'Older sister (male speaker / female speaker)' },
          { korean: '동생', romanization: 'dongsaeng', english: 'Younger sibling (either gender)' },
        ],
        tip: 'These terms are used widely beyond family. Close friends, classmates, and even romantic partners use them. You will hear 오빠 and 언니 constantly in everyday life.',
      },
      {
        heading: 'The 선배/후배 System',
        explanation: 'In school and work, seniority creates a strict hierarchy. 선배 (sunbae) refers to someone who entered before you, and 후배 (hubae) refers to someone who entered after you. A 선배 gets respect regardless of actual age. This system shapes everything from who pours drinks to who speaks first.',
        examples: [
          { korean: '선배님, 안녕하세요.', romanization: 'sunbaenim, annyeonghaseyo.', english: 'Hello, senior. (respectful greeting)' },
          { korean: '후배한테 잘해 줘야지.', romanization: 'hubaehante jalhae jweoyaji.', english: 'You should be good to your juniors.' },
          { korean: '선배가 사줄게.', romanization: 'sunbaega sajulge.', english: 'I (the senior) will buy it for you.' },
        ],
        tip: 'In Korean work culture, 선배 often pay for meals for their 후배. This is expected and refusing can be awkward.',
      },
      {
        heading: 'Honorific Verb Endings and Vocabulary',
        explanation: 'Korean has special honorific vocabulary used when talking about or to someone of higher status. The subject honorific suffix -(으)시 is added to verb stems when the subject is someone you respect. Some verbs have entirely separate honorific forms.',
        examples: [
          { korean: '먹다 -> 드시다', romanization: 'meokda -> deusida', english: 'to eat -> to eat (honorific)' },
          { korean: '자다 -> 주무시다', romanization: 'jada -> jumusida', english: 'to sleep -> to sleep (honorific)' },
          { korean: '있다 -> 계시다', romanization: 'itda -> gyesida', english: 'to be/exist -> to be (honorific)' },
          { korean: '말하다 -> 말씀하시다', romanization: 'malhada -> malsseumhasida', english: 'to speak -> to speak (honorific)' },
        ],
        tip: 'Never use honorific verbs about yourself. Saying 제가 드셨어요 (I ate - honorific) about yourself sounds very strange.',
      },
    ],
  },
  {
    id: 'cult_age',
    title: 'Korean Age System',
    titleKorean: '한국 나이',
    order: 2,
    description: 'Korea traditionally uses a unique age-counting system where everyone is 1 at birth and gains a year every January 1st. Understanding this is key to Korean social dynamics.',
    sections: [
      {
        heading: 'Korean Age vs International Age',
        explanation: 'In traditional Korean age, you are 1 year old at birth and gain a year every January 1st, not on your birthday. A baby born on December 31st turns 2 the very next day. In 2023, South Korea officially adopted international age for legal and administrative purposes, but Korean age is still widely used in daily conversation and social settings.',
        examples: [
          { korean: '저는 스물다섯 살이에요.', romanization: 'jeoneun seumuldaseot sarieyo.', english: 'I am 25 years old. (Korean age)' },
          { korean: '만 나이로 스물셋이에요.', romanization: 'man nairo seumulsetieyo.', english: 'I am 23 in international age.' },
          { korean: '한국 나이로 몇 살이에요?', romanization: 'hanguk nairo myeot sarieyo?', english: 'How old are you in Korean age?' },
        ],
        tip: 'To calculate Korean age: if your birthday has passed this year, add 1 to your international age. If it has not, add 2.',
      },
      {
        heading: 'Why Age Matters So Much',
        explanation: 'Age determines almost everything in Korean social interaction: speech level, who pours drinks, seating order, who pays, and relationship titles. Koreans ask age early in a new relationship not out of rudeness but to establish the social framework for communication.',
        examples: [
          { korean: '나이가 어떻게 되세요?', romanization: 'naiga eotteoke doeseyo?', english: 'How old are you? (polite)' },
          { korean: '몇 년생이에요?', romanization: 'myeot nyeonsaengieyo?', english: 'What year were you born? (common way to ask)' },
          { korean: '저보다 나이가 많으세요?', romanization: 'jeoboda naiga maneuseoyo?', english: 'Are you older than me?' },
        ],
        tip: 'Asking "What year were you born?" is more common and less direct than asking age outright. It is considered polite.',
      },
      {
        heading: 'Asking Age Politely',
        explanation: 'There are different ways to ask someone\'s age depending on the level of politeness. For elders, use the most respectful forms. For peers, asking birth year is the standard approach. Never ask an elder their age directly with casual language.',
        examples: [
          { korean: '연세가 어떻게 되십니까?', romanization: 'yeonsega eotteoke doesimnikka?', english: 'How old are you? (very respectful, for elders)' },
          { korean: '실례지만 나이가 어떻게 되세요?', romanization: 'sillyejiman naiga eotteoke doeseyo?', english: 'Excuse me, how old are you? (polite)' },
          { korean: '몇 살이야?', romanization: 'myeot sariya?', english: 'How old are you? (casual, to peers/younger)' },
        ],
        tip: 'Use 연세 instead of 나이 when asking elders. 연세 is the honorific word for age.',
      },
      {
        heading: 'Same Age Culture',
        explanation: 'When two people discover they are the same age (동갑), it is a bonding moment. Being 동갑 means you can speak casually to each other without formality barriers. Koreans often get excited finding a 동갑 friend because it allows a more relaxed relationship.',
        examples: [
          { korean: '우리 동갑이네!', romanization: 'uri donggabine!', english: 'We are the same age!' },
          { korean: '동갑이니까 말 편하게 해.', romanization: 'donggabinikka mal pyeonhage hae.', english: 'Since we are the same age, let\'s speak casually.' },
          { korean: '동갑 친구', romanization: 'donggap chingu', english: 'Same-age friend' },
        ],
        tip: 'Even if you are the same age, wait for the other person to suggest speaking casually. Do not assume.',
      },
    ],
  },
  {
    id: 'cult_food',
    title: 'Ordering Food in Korean',
    titleKorean: '음식 주문',
    order: 3,
    description: 'Korean food culture is a huge part of daily life. Knowing how to order, ask about dishes, and pay is essential for any visitor or learner.',
    sections: [
      {
        heading: 'Getting Attention and Ordering',
        explanation: 'In Korean restaurants, you call the server by saying 여기요 (here!) or 저기요 (excuse me). There is no need to wait to be approached. Pressing a call button on the table is also common. When ready to order, say 주문할게요 (I would like to order).',
        examples: [
          { korean: '여기요! 주문할게요.', romanization: 'yeogiyo! jumunhalgeyo.', english: 'Excuse me! I would like to order.' },
          { korean: '메뉴판 주세요.', romanization: 'menyupan juseyo.', english: 'Please give me the menu.' },
          { korean: '이거 하나 주세요.', romanization: 'igeo hana juseyo.', english: 'One of this, please.' },
          { korean: '이거 두 개 주세요.', romanization: 'igeo du gae juseyo.', english: 'Two of this, please.' },
        ],
        tip: 'Calling out 여기요 loudly in a restaurant is completely normal and polite in Korea. Do not feel shy about it.',
      },
      {
        heading: 'Specific Food Ordering Phrases',
        explanation: 'Korean restaurants often have set meals (정식), sharing dishes, and side dishes (반찬) that come free with your meal. Water and basic sides are usually self-service or refilled for free.',
        examples: [
          { korean: '김치찌개 일인분 주세요.', romanization: 'gimchijjigae irinbun juseyo.', english: 'One serving of kimchi stew, please.' },
          { korean: '소주 한 병 주세요.', romanization: 'soju han byeong juseyo.', english: 'One bottle of soju, please.' },
          { korean: '반찬 더 주세요.', romanization: 'banchan deo juseyo.', english: 'More side dishes, please.' },
          { korean: '물 좀 주세요.', romanization: 'mul jom juseyo.', english: 'Some water, please.' },
        ],
        tip: 'Side dishes (반찬) are always free and you can ask for refills. This includes kimchi, pickled radish, and other small dishes.',
      },
      {
        heading: 'Asking About Ingredients and Allergies',
        explanation: 'If you have dietary restrictions or allergies, these phrases are essential. Korean food frequently uses common allergens like soy, sesame, shellfish, and wheat.',
        examples: [
          { korean: '이거 안에 뭐가 들어가요?', romanization: 'igeo ane mwoga deureogayo?', english: 'What ingredients are in this?' },
          { korean: '땅콩 알레르기가 있어요.', romanization: 'ttangkong allereuriga isseoyo.', english: 'I have a peanut allergy.' },
          { korean: '고기 없이 만들 수 있어요?', romanization: 'gogi eopsi mandeul su isseoyo?', english: 'Can you make it without meat?' },
          { korean: '매운 거 못 먹어요.', romanization: 'maeun geo mot meogeoyo.', english: 'I cannot eat spicy food.' },
          { korean: '덜 맵게 해 주세요.', romanization: 'deol maepge hae juseyo.', english: 'Please make it less spicy.' },
        ],
        tip: 'Saying 안 매운 걸로 주세요 (give me the non-spicy one) is useful since many Korean dishes come in spicy and mild versions.',
      },
      {
        heading: 'Paying the Bill',
        explanation: 'In Korea, you pay at the register near the exit, not at the table. One person usually pays for the whole group. Splitting the bill is becoming more common among younger people but is still less typical than in Western countries.',
        examples: [
          { korean: '계산해 주세요.', romanization: 'gyesanhae juseyo.', english: 'The check, please.' },
          { korean: '카드로 할게요.', romanization: 'kadeuro halgeyo.', english: 'I will pay by card.' },
          { korean: '현금으로 할게요.', romanization: 'hyeongeumeuro halgeyo.', english: 'I will pay with cash.' },
          { korean: '영수증 주세요.', romanization: 'yeongsujeung juseyo.', english: 'Receipt, please.' },
          { korean: '잘 먹었습니다.', romanization: 'jal meogeosseumnida.', english: 'I ate well. (said after a meal as thanks)' },
        ],
        tip: 'Do NOT tip in Korea. Tipping is not part of the culture and can even be seen as confusing or rude. Service is included in the price.',
      },
    ],
  },
  {
    id: 'cult_shopping',
    title: 'Shopping & Money',
    titleKorean: '쇼핑',
    order: 4,
    description: 'From market haggling to modern card payments, learn the essential phrases for shopping in Korea and understanding Korean currency.',
    sections: [
      {
        heading: 'Asking Prices',
        explanation: 'The most essential shopping phrase is 얼마예요? (How much is it?). In traditional markets, prices may not be marked. In stores, prices are always in Korean Won.',
        examples: [
          { korean: '이거 얼마예요?', romanization: 'igeo eolmayeyo?', english: 'How much is this?' },
          { korean: '전부 얼마예요?', romanization: 'jeonbu eolmayeyo?', english: 'How much is it in total?' },
          { korean: '할인 있어요?', romanization: 'harin isseoyo?', english: 'Is there a discount?' },
          { korean: '세일 중이에요?', romanization: 'seil jungieyo?', english: 'Is it on sale?' },
        ],
        tip: 'Korea is largely a cashless society. Credit and debit cards are accepted almost everywhere, even at small street food stalls.',
      },
      {
        heading: 'Bargaining Phrases',
        explanation: 'Bargaining is acceptable in traditional markets and some tourist shopping areas like Namdaemun or Dongdaemun. It is NOT appropriate in regular stores, malls, or convenience stores.',
        examples: [
          { korean: '좀 깎아 주세요.', romanization: 'jom kkakka juseyo.', english: 'Please give me a discount.' },
          { korean: '너무 비싸요.', romanization: 'neomu bissayo.', english: 'It is too expensive.' },
          { korean: '만 원에 해 주세요.', romanization: 'man wone hae juseyo.', english: 'Please make it 10,000 won.' },
          { korean: '두 개 사면 깎아 줘요?', romanization: 'du gae samyeon kkakka jwoyo?', english: 'If I buy two, will you give a discount?' },
        ],
        tip: 'Be friendly when bargaining. Smile, be polite, and do not push too hard. A little humor goes a long way in Korean markets.',
      },
      {
        heading: 'Korean Won Denominations',
        explanation: 'Korean Won comes in coins of 10, 50, 100, and 500 won, and bills of 1,000, 5,000, 10,000, and 50,000 won. Prices are always in whole won with no decimal points. Common reference: 1,000 won is roughly 0.75 USD.',
        examples: [
          { korean: '천 원', romanization: 'cheon won', english: '1,000 won' },
          { korean: '오천 원', romanization: 'ocheon won', english: '5,000 won' },
          { korean: '만 원', romanization: 'man won', english: '10,000 won' },
          { korean: '오만 원', romanization: 'oman won', english: '50,000 won' },
        ],
        tip: 'Koreans often say just the number in 만 (10,000) units. "삼만 원" means 30,000 won. Think of 만 as a base unit like "ten-thousand."',
      },
      {
        heading: 'Payment Phrases',
        explanation: 'Card payment is dominant in Korea. Most people use credit cards, debit cards, or mobile payment apps like Samsung Pay or KakaoPay. Knowing these phrases helps with smooth transactions.',
        examples: [
          { korean: '카드로 할게요.', romanization: 'kadeuro halgeyo.', english: 'I will pay by card.' },
          { korean: '현금으로 계산할게요.', romanization: 'hyeongeumeuro gyesanhalgeyo.', english: 'I will pay with cash.' },
          { korean: '카드 돼요?', romanization: 'kadeu dwaeyo?', english: 'Do you accept cards?' },
          { korean: '포인트 적립할게요.', romanization: 'pointeu jeokriphalgeyo.', english: 'I would like to collect points.' },
          { korean: '봉투 필요 없어요.', romanization: 'bongtu pilyo eopseoyo.', english: 'I do not need a bag.' },
        ],
        tip: 'Plastic bags cost extra in Korea. Bring a reusable bag or say 봉투 필요 없어요 to decline.',
      },
    ],
  },
  {
    id: 'cult_business',
    title: 'Business Korean',
    titleKorean: '비즈니스 한국어',
    order: 5,
    description: 'Korean business culture is highly formal with strict hierarchical etiquette. Proper language and behavior in professional settings are crucial for success.',
    sections: [
      {
        heading: 'Formal Greetings and Introductions',
        explanation: 'Business introductions in Korea always involve exchanging business cards with both hands. Bow slightly when greeting. Use the person\'s title and family name, never their first name. Common titles include 부장님 (department head), 과장님 (section chief), 대리님 (assistant manager), and 사장님 (company president).',
        examples: [
          { korean: '처음 뵙겠습니다.', romanization: 'cheoeum boepgesseumnida.', english: 'Nice to meet you. (formal, business)' },
          { korean: '명함 드리겠습니다.', romanization: 'myeongham deurigesseumnida.', english: 'Let me give you my business card.' },
          { korean: '김 부장님, 안녕하십니까?', romanization: 'gim bujangnim, annyeonghasimnikka?', english: 'Hello, Department Head Kim.' },
          { korean: '잘 부탁드립니다.', romanization: 'jal butakdeurimnida.', english: 'I look forward to working with you.' },
        ],
        tip: 'Always receive a business card with both hands, read it carefully, and place it respectfully on the table. Never write on it or stuff it in your pocket immediately.',
      },
      {
        heading: 'Email Phrases',
        explanation: 'Korean business emails follow a strict format. Start with a greeting, state your purpose clearly, and end with a formal closing. Use formal polite language (합니다 style) throughout.',
        examples: [
          { korean: '안녕하세요, OOO입니다.', romanization: 'annyeonghaseyo, OOOimnida.', english: 'Hello, this is [name].' },
          { korean: '확인 부탁드립니다.', romanization: 'hwagin butakdeurimnida.', english: 'Please confirm. / Please review.' },
          { korean: '감사합니다. 좋은 하루 되세요.', romanization: 'gamsahamnida. joeun haru doeseyo.', english: 'Thank you. Have a good day.' },
          { korean: '빠른 답변 감사드립니다.', romanization: 'ppareun dapbyeon gamsadeurimnida.', english: 'Thank you for your quick reply.' },
        ],
        tip: 'End emails with 감사합니다 rather than a casual goodbye. Always include your name and position.',
      },
      {
        heading: 'Phone Etiquette',
        explanation: 'When answering business calls, state your company and name immediately. Speak slowly and clearly in formal polite language. Saying 여보세요 alone is only for personal calls.',
        examples: [
          { korean: 'OOO회사 OOO입니다.', romanization: 'OOO hoesa OOOimnida.', english: '[Company name], this is [name].' },
          { korean: '실례지만 어디시죠?', romanization: 'sillyejiman eodisijyo?', english: 'Excuse me, who is calling?' },
          { korean: '잠시만 기다려 주세요.', romanization: 'jamsiman gidaryeo juseyo.', english: 'Please wait a moment.' },
          { korean: '다시 한번 말씀해 주시겠어요?', romanization: 'dasi hanbeon malsseumhae jusigesseoyo?', english: 'Could you say that again, please?' },
        ],
      },
      {
        heading: 'Common Business Expressions',
        explanation: 'Korean workplaces have their own set of frequently used expressions for meetings, deadlines, and daily interactions.',
        examples: [
          { korean: '수고하셨습니다.', romanization: 'sugohasyeosseumnida.', english: 'Thank you for your hard work. (said at end of workday)' },
          { korean: '회의 시작하겠습니다.', romanization: 'hoeui sijakagesseumnida.', english: 'Let us begin the meeting.' },
          { korean: '보고서 제출했습니다.', romanization: 'bogoseo jechulhaesseumnida.', english: 'I have submitted the report.' },
          { korean: '마감일이 언제예요?', romanization: 'magamiri eonjeyeyo?', english: 'When is the deadline?' },
        ],
        tip: 'Saying 수고하셨습니다 when leaving the office or ending a project is very common. It acknowledges everyone\'s effort.',
      },
      {
        heading: 'Company Dinner Culture',
        explanation: '회식 is the tradition of company dinners and after-work drinking. It is a key part of Korean work culture used for team bonding. Attendance is strongly expected. The boss typically pays, and there are specific drinking etiquette rules to follow.',
        examples: [
          { korean: '오늘 회식 있어요.', romanization: 'oneul hoesik isseoyo.', english: 'There is a company dinner today.' },
          { korean: '건배!', romanization: 'geonbae!', english: 'Cheers!' },
          { korean: '한 잔 더 하시겠어요?', romanization: 'han jan deo hasigesseoyo?', english: 'Would you like one more drink?' },
          { korean: '2차 가요!', romanization: 'icha gayo!', english: 'Let us go to the second round!' },
        ],
        tip: 'When receiving a drink from an elder, hold your glass with both hands. When drinking, turn your head away from elders as a sign of respect. Pour drinks for others before yourself.',
      },
    ],
  },
  {
    id: 'cult_traditions',
    title: 'Korean Traditions',
    titleKorean: '한국 전통',
    order: 6,
    description: 'Korea has rich traditions tied to holidays, celebrations, and daily customs. Understanding these adds depth to your language learning and cultural awareness.',
    sections: [
      {
        heading: 'Lunar New Year',
        explanation: '설날 is one of Korea\'s two biggest holidays, celebrated on the 1st day of the Lunar calendar (usually January or February). Families gather, perform 세배 (a deep bow to elders), eat 떡국 (rice cake soup), and children receive 세뱃돈 (New Year money). The holiday lasts three days.',
        examples: [
          { korean: '새해 복 많이 받으세요.', romanization: 'saehae bok mani badeuseyo.', english: 'Happy New Year. (Receive many blessings.)' },
          { korean: '세배 드리겠습니다.', romanization: 'sebae deurigesseumnida.', english: 'I will bow to you. (formal New Year bow)' },
          { korean: '떡국 드세요.', romanization: 'tteokguk deuseyo.', english: 'Please have some rice cake soup.' },
          { korean: '세뱃돈 감사합니다.', romanization: 'sebatdon gamsahamnida.', english: 'Thank you for the New Year money.' },
        ],
        tip: 'Eating 떡국 on 설날 symbolizes gaining one more year of age. It is a beloved tradition.',
      },
      {
        heading: 'Chuseok (Harvest Festival)',
        explanation: '추석 falls on the 15th day of the 8th lunar month (usually September or October). It is a harvest festival similar to Thanksgiving. Families visit ancestral graves, perform 차례 (ancestral rites), eat 송편 (half-moon rice cakes), and celebrate the harvest.',
        examples: [
          { korean: '추석 잘 보내세요.', romanization: 'chuseok jal bonaeseyo.', english: 'Have a good Chuseok.' },
          { korean: '성묘 가요.', romanization: 'seongmyo gayo.', english: 'We are going to visit the ancestral graves.' },
          { korean: '송편 만들어요.', romanization: 'songpyeon mandeuleoyo.', english: 'We make songpyeon (rice cakes).' },
          { korean: '풍성한 한가위 되세요.', romanization: 'pungseonghan hangawi doeseyo.', english: 'Have an abundant Chuseok.' },
        ],
        tip: 'During 추석 and 설날, almost everything in Korea shuts down. Traffic is extreme as everyone travels to their hometown.',
      },
      {
        heading: 'Birthday Celebrations',
        explanation: 'Korean birthdays traditionally involve eating 미역국 (seaweed soup), which mothers eat after giving birth for nutrition. Eating it on your birthday honors your mother. Modern celebrations also include cake and candles.',
        examples: [
          { korean: '생일 축하합니다!', romanization: 'saengil chukahamnida!', english: 'Happy birthday!' },
          { korean: '오늘 미역국 먹었어?', romanization: 'oneul miyeokguk meogeosseo?', english: 'Did you eat seaweed soup today? (asking about birthday)' },
          { korean: '몇 살 됐어?', romanization: 'myeot sal dwaesseo?', english: 'How old did you turn? (casual)' },
        ],
        tip: 'If a Korean asks you "Did you eat 미역국 today?", they are asking if it is your birthday.',
      },
      {
        heading: '100 Days and First Birthday',
        explanation: 'The 100th day after birth (백일) and the first birthday (돌) are significant celebrations in Korean culture. Historically, infant mortality was high, so surviving 100 days and one year were major milestones. At 돌, a baby is placed before objects (yarn, money, pencil, rice) to predict their future based on what they grab first.',
        examples: [
          { korean: '백일 축하해요!', romanization: 'baegil chukahaeyo!', english: 'Happy 100th day!' },
          { korean: '돌잔치에 초대합니다.', romanization: 'doljanchie chodaehamnida.', english: 'You are invited to the first birthday party.' },
          { korean: '돌잡이에서 뭐 잡았어요?', romanization: 'doljabie-seo mwo jabasseoyo?', english: 'What did the baby grab at the doljanchi?' },
        ],
        tip: 'At 돌잡이, grabbing money means wealth, yarn means long life, a pencil means academic success, and rice means the baby will never go hungry.',
      },
      {
        heading: 'Respect Customs',
        explanation: 'Korea has specific physical customs that show respect. Bowing is the primary greeting. When giving or receiving objects, especially to elders, use both hands. When pouring or receiving drinks, support your arm with your other hand.',
        examples: [
          { korean: '두 손으로 받으세요.', romanization: 'du soneuro badeuseyo.', english: 'Please receive it with both hands.' },
          { korean: '인사드립니다.', romanization: 'insadeurimnida.', english: 'I bow in greeting. (formal)' },
          { korean: '고개를 숙여서 인사해요.', romanization: 'gogaereul sugiyeoseo insahaeyo.', english: 'Bow your head to greet.' },
        ],
        tip: 'When handing over money, a credit card, or any item to someone older, always use both hands or your right hand supported by the left.',
      },
    ],
  },
  {
    id: 'cult_kdrama',
    title: 'K-Drama & K-Pop Vocabulary',
    titleKorean: '드라마/케이팝 어휘',
    order: 7,
    description: 'Korean entertainment has its own rich vocabulary. Understanding these common drama phrases and K-pop terms will enhance your viewing experience and fan interactions.',
    sections: [
      {
        heading: 'Common Drama Phrases and Exclamations',
        explanation: 'If you watch K-dramas, you will hear these phrases in almost every episode. They are emotional expressions used in dramatic moments, arguments, and everyday conversations.',
        examples: [
          { korean: '진짜?!', romanization: 'jinjja?!', english: 'Really?! / Seriously?!' },
          { korean: '대박!', romanization: 'daebak!', english: 'Amazing! / Wow! (lit. jackpot)' },
          { korean: '아이고...', romanization: 'aigo...', english: 'Oh my... / Oh dear... (exasperation or surprise)' },
          { korean: '미쳤어?!', romanization: 'michyeosseo?!', english: 'Are you crazy?!' },
          { korean: '어떡해...', romanization: 'eotteokae...', english: 'What do I do... / Oh no...' },
        ],
        tip: 'Koreans use 대박 for both genuinely impressive things and sarcastically. Context and tone are everything.',
      },
      {
        heading: 'Relationship Terms from Dramas',
        explanation: 'K-dramas are full of relationship vocabulary. These terms describe the complex web of Korean social and romantic relationships that drive every storyline.',
        examples: [
          { korean: '첫사랑', romanization: 'cheossarang', english: 'First love' },
          { korean: '짝사랑', romanization: 'jjaksarang', english: 'One-sided love / unrequited love' },
          { korean: '삼각관계', romanization: 'samgakgwangye', english: 'Love triangle' },
          { korean: '재벌', romanization: 'jaebeol', english: 'Chaebol (wealthy family/conglomerate heir)' },
          { korean: '밀당', romanization: 'mildang', english: 'Push and pull (in dating/flirting)' },
        ],
        tip: 'The "재벌 heir falls for ordinary person" is the most classic K-drama plot. You will see this storyline constantly.',
      },
      {
        heading: 'K-Pop Fan Vocabulary',
        explanation: 'K-pop fandom has developed its own extensive vocabulary mixing Korean and English. These terms are used by fans worldwide.',
        examples: [
          { korean: '최애', romanization: 'choeae', english: 'Ultimate bias (favorite member)' },
          { korean: '컴백', romanization: 'keombaek', english: 'Comeback (new album/song release)' },
          { korean: '응원봉', romanization: 'eungwonbong', english: 'Lightstick (fan light used at concerts)' },
          { korean: '팬미팅', romanization: 'paenmiting', english: 'Fan meeting' },
          { korean: '총공', romanization: 'chonggong', english: 'Mass streaming (organized by fans)' },
        ],
        tip: 'Each K-pop group has a unique lightstick design and official fan club name. Learning your favorite group\'s terms deepens the fan experience.',
      },
      {
        heading: 'Social Media Korean',
        explanation: 'Korean internet and social media language is heavily abbreviated and uses unique slang. Knowing these helps you understand comments on Korean social media.',
        examples: [
          { korean: 'ㅋㅋㅋ', romanization: 'kkk', english: 'Hahaha (laughing sound)' },
          { korean: 'ㅠㅠ', romanization: 'yuyuu', english: 'Crying face (tears streaming down)' },
          { korean: '인스타', romanization: 'inseuta', english: 'Instagram (shortened)' },
          { korean: '좋아요 눌러주세요', romanization: 'joayo nulleojuseyo', english: 'Please press like' },
          { korean: '구독과 좋아요', romanization: 'gudokgwa joayo', english: 'Subscribe and like (YouTube)' },
        ],
        tip: 'The ㅋ character represents the Korean consonant sound for "k" and mimics laughter. More of them means funnier. Just one can feel cold or sarcastic.',
      },
    ],
  },
  {
    id: 'cult_survival',
    title: 'Survival Korean',
    titleKorean: '생존 한국어',
    order: 8,
    description: 'Essential phrases for navigating real-life situations in Korea, from emergencies to public transportation. These phrases can be lifesavers.',
    sections: [
      {
        heading: 'Emergency Phrases',
        explanation: 'In an emergency in Korea, call 119 for fire/ambulance and 112 for police. Knowing basic emergency phrases can save lives.',
        examples: [
          { korean: '도와주세요!', romanization: 'dowajuseyo!', english: 'Help me!' },
          { korean: '경찰을 불러 주세요.', romanization: 'gyeongchareul bulleo juseyo.', english: 'Please call the police.' },
          { korean: '병원에 가야 해요.', romanization: 'byeongwone gaya haeyo.', english: 'I need to go to the hospital.' },
          { korean: '위험해요!', romanization: 'wiheomhaeyo!', english: 'It is dangerous!' },
          { korean: '불이야!', romanization: 'buriya!', english: 'Fire!' },
        ],
        tip: 'Save 119 (fire/ambulance) and 112 (police) in your phone. Most operators can handle basic English but Korean is faster.',
      },
      {
        heading: 'Asking for Directions',
        explanation: 'Korea has excellent public transit and most people are willing to help with directions. These phrases will help you find your way.',
        examples: [
          { korean: '길을 잃었어요.', romanization: 'gireul ilheosseoyo.', english: 'I am lost.' },
          { korean: 'OOO이/가 어디예요?', romanization: 'OOO-i/ga eodiyeyo?', english: 'Where is OOO?' },
          { korean: '지하철역이 어디예요?', romanization: 'jihacheollyeogi eodiyeyo?', english: 'Where is the subway station?' },
          { korean: '여기에서 얼마나 걸려요?', romanization: 'yeogieseo eolmana geollyeoyo?', english: 'How long does it take from here?' },
          { korean: '직진하세요.', romanization: 'jikjinhaseyo.', english: 'Go straight.' },
        ],
        tip: 'Naver Map and KakaoMap are far more accurate than Google Maps in Korea. Download one before you arrive.',
      },
      {
        heading: 'At the Hospital',
        explanation: 'Korean hospitals and clinics are efficient and affordable. Walk-in clinics are common. Knowing medical vocabulary helps communicate symptoms.',
        examples: [
          { korean: '아파요.', romanization: 'apayo.', english: 'It hurts. / I am sick.' },
          { korean: '머리가 아파요.', romanization: 'meoriga apayo.', english: 'I have a headache.' },
          { korean: '배가 아파요.', romanization: 'baega apayo.', english: 'I have a stomachache.' },
          { korean: '열이 있어요.', romanization: 'yeori isseoyo.', english: 'I have a fever.' },
          { korean: '약 처방해 주세요.', romanization: 'yak cheobonghae juseyo.', english: 'Please prescribe medicine.' },
        ],
        tip: 'In Korea, you get your prescription at the hospital but pick up the actual medicine at a separate pharmacy nearby.',
      },
      {
        heading: 'At Immigration and the Airport',
        explanation: 'Arriving in Korea, you will go through immigration and customs. Most signs are bilingual but knowing Korean phrases speeds up the process.',
        examples: [
          { korean: '관광 목적이에요.', romanization: 'gwangwang mokjeogieyo.', english: 'I am here for tourism.' },
          { korean: '3일 동안 머물 거예요.', romanization: 'samil dongan meomul geoyeyo.', english: 'I will stay for 3 days.' },
          { korean: '신고할 것 없어요.', romanization: 'singohal geot eopseoyo.', english: 'I have nothing to declare.' },
          { korean: '짐을 못 찾겠어요.', romanization: 'jimeul mot chatgesseoyo.', english: 'I cannot find my luggage.' },
        ],
        tip: 'Fill out the arrival card on the plane to save time. Most immigration officers speak some English.',
      },
      {
        heading: 'Using Public Transportation',
        explanation: 'Korea has one of the best public transit systems in the world. The subway, buses, and KTX (high-speed train) are clean, punctual, and affordable. Get a T-money card for all transit.',
        examples: [
          { korean: '티머니 카드 충전해 주세요.', romanization: 'timoni kadeu chungjeonhae juseyo.', english: 'Please charge my T-money card.' },
          { korean: 'OOO역에서 내려요.', romanization: 'OOO-yeogeseo naeryeoyo.', english: 'I get off at OOO station.' },
          { korean: '이 버스 OOO 가요?', romanization: 'i beoseu OOO gayo?', english: 'Does this bus go to OOO?' },
          { korean: '환승이에요.', romanization: 'hwanseungieyo.', english: 'I am transferring.' },
          { korean: 'KTX 표 예매하고 싶어요.', romanization: 'KTX pyo yemaehago sipeoyo.', english: 'I want to book a KTX ticket.' },
        ],
        tip: 'T-money cards work on all subways, buses, and even some taxis and convenience stores. Buy one at any convenience store.',
      },
      {
        heading: 'Wi-Fi and Phone',
        explanation: 'Korea has some of the fastest internet in the world. Free Wi-Fi is available almost everywhere. Renting a pocket Wi-Fi or getting a Korean SIM card is easy at the airport.',
        examples: [
          { korean: '와이파이 비밀번호가 뭐예요?', romanization: 'waipai bimilbeonhoga mwoyeyo?', english: 'What is the Wi-Fi password?' },
          { korean: '충전기 빌릴 수 있어요?', romanization: 'chungjeongi billil su isseoyo?', english: 'Can I borrow a charger?' },
          { korean: '데이터가 안 돼요.', romanization: 'deiteoga an dwaeyo.', english: 'My data is not working.' },
          { korean: '유심 살 수 있어요?', romanization: 'yusim sal su isseoyo?', english: 'Can I buy a SIM card?' },
        ],
        tip: 'Download KakaoTalk before coming to Korea. It is THE messaging app everyone uses, far more than SMS or WhatsApp.',
      },
    ],
  },
];

export function getCultureLessonById(id: string): CultureLesson | undefined {
  return cultureLessons.find((l) => l.id === id);
}

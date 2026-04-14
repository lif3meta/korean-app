export interface MangaPanel {
  id: string;
  imagePrompt: string;
  dialogue: MangaDialogue[];
  narration?: string;
  narrationEnglish?: string;
}

export interface MangaDialogue {
  speaker: string;
  speakerEnglish: string;
  korean: string;
  romanization?: string;
  english: string;
  words: { korean: string; english: string }[];
  position: 'left' | 'right' | 'center';
}

export interface MangaChapter {
  id: string;
  title: string;
  titleKorean: string;
  level: 1 | 2 | 3 | 4 | 5;
  description: string;
  panels: MangaPanel[];
}

export interface MangaSeries {
  id: string;
  title: string;
  titleKorean: string;
  description: string;
  genre: string;
  chapters: MangaChapter[];
}

export const mangaSeries: MangaSeries[] = [
  {
    id: 'seoul-love-story',
    title: 'Seoul Love Story',
    titleKorean: '서울 러브 스토리',
    description: 'A heartwarming high school romance in Seoul. Follow Mina as she navigates a new school, new friends, and unexpected feelings.',
    genre: 'Romance',
    chapters: [
      // ─────────────────────────────────────────────
      // Chapter 1: New Beginnings (Level 1)
      // ─────────────────────────────────────────────
      {
        id: 'ch1-new-beginnings',
        title: 'New Beginnings',
        titleKorean: '새로운 시작',
        level: 1,
        description: 'Mina arrives at her new school in Seoul and meets the charming Junho.',
        panels: [
          {
            id: 'ch1-p1',
            imagePrompt: 'cute manga anime webtoon style, a beautiful Korean high school girl with long black hair standing at the school gate in Seoul, cherry blossoms falling all around, pastel pink morning sky, she wears a school uniform and carries a school bag, looking up at the school building with a mix of hope and nervousness, soft warm lighting, detailed background of a modern Korean school',
            narration: '봄, 서울에 새로운 학생이 옵니다...',
            narrationEnglish: 'Spring, a new student comes to Seoul...',
            dialogue: [
              {
                speaker: '미나',
                speakerEnglish: 'Mina',
                korean: '여기가 새 학교야...',
                romanization: 'yeogiga sae hakgyoya...',
                english: 'This is my new school...',
                words: [
                  { korean: '여기가', english: 'this place (subject)' },
                  { korean: '새', english: 'new' },
                  { korean: '학교야', english: 'is school (casual)' },
                ],
                position: 'right',
              },
            ],
          },
          {
            id: 'ch1-p2',
            imagePrompt: 'cute manga anime webtoon style, a Korean high school girl walking through a crowded school hallway looking lost, students chatting and laughing around her, lockers in background, she looks shy and overwhelmed, pastel colors, detailed busy school interior scene',
            dialogue: [
              {
                speaker: '미나',
                speakerEnglish: 'Mina (thinking)',
                korean: '사람이 많아... 무서워.',
                romanization: 'sarami mana... museowo.',
                english: 'So many people... I\'m scared.',
                words: [
                  { korean: '사람이', english: 'people (subject)' },
                  { korean: '많아', english: 'many / a lot' },
                  { korean: '무서워', english: 'I\'m scared (casual)' },
                ],
                position: 'center',
              },
            ],
          },
          {
            id: 'ch1-p3',
            imagePrompt: 'cute manga anime webtoon style, a Korean classroom scene, a kind female teacher standing at the front introducing a shy new girl student to the class, students at desks looking curious, warm lighting, chalkboard with Korean writing, pastel colors',
            dialogue: [
              {
                speaker: '선생님',
                speakerEnglish: 'Teacher',
                korean: '학생들, 새 친구를 소개합니다.',
                romanization: 'haksaengdeul, sae chingureul sogaehamnida.',
                english: 'Students, let me introduce a new friend.',
                words: [
                  { korean: '학생들', english: 'students' },
                  { korean: '새', english: 'new' },
                  { korean: '친구를', english: 'friend (object)' },
                  { korean: '소개합니다', english: 'let me introduce' },
                ],
                position: 'left',
              },
              {
                speaker: '미나',
                speakerEnglish: 'Mina',
                korean: '안녕하세요! 저는 미나예요.',
                romanization: 'annyeonghaseyo! jeoneun minayeyo.',
                english: 'Hello! I am Mina.',
                words: [
                  { korean: '안녕하세요', english: 'hello (formal)' },
                  { korean: '저는', english: 'I am (formal)' },
                  { korean: '미나예요', english: 'Mina (polite ending)' },
                ],
                position: 'right',
              },
            ],
          },
          {
            id: 'ch1-p4',
            imagePrompt: 'cute manga anime webtoon style, a handsome Korean high school boy with dark hair smiling warmly and waving at a shy girl, bright classroom, friendly atmosphere, sparkle effects around him, he looks kind and welcoming, warm pastel colors',
            dialogue: [
              {
                speaker: '준호',
                speakerEnglish: 'Junho',
                korean: '안녕! 나는 준호야. 여기 앉아!',
                romanization: 'annyeong! naneun junhoya. yeogi anja!',
                english: 'Hi! I\'m Junho. Sit here!',
                words: [
                  { korean: '안녕', english: 'hi (casual)' },
                  { korean: '나는', english: 'I am (casual)' },
                  { korean: '준호야', english: 'Junho (casual)' },
                  { korean: '여기', english: 'here' },
                  { korean: '앉아', english: 'sit (casual)' },
                ],
                position: 'left',
              },
            ],
          },
          {
            id: 'ch1-p5',
            imagePrompt: 'cute manga anime webtoon style, a Korean high school girl blushing and looking down shyly while sitting next to a handsome boy at a desk, pink cheeks, hearts floating in the background, romantic sparkle effects, soft pink and warm tones',
            dialogue: [
              {
                speaker: '미나',
                speakerEnglish: 'Mina',
                korean: '고마워요... 반가워요.',
                romanization: 'gomawoyo... bangawoyo.',
                english: 'Thank you... nice to meet you.',
                words: [
                  { korean: '고마워요', english: 'thank you (polite)' },
                  { korean: '반가워요', english: 'nice to meet you (polite)' },
                ],
                position: 'right',
              },
              {
                speaker: '준호',
                speakerEnglish: 'Junho',
                korean: '반가워! 친구하자!',
                romanization: 'bangawo! chinguhaja!',
                english: 'Nice to meet you! Let\'s be friends!',
                words: [
                  { korean: '반가워', english: 'nice to meet you (casual)' },
                  { korean: '친구하자', english: 'let\'s be friends' },
                ],
                position: 'left',
              },
            ],
          },
          {
            id: 'ch1-p6',
            imagePrompt: 'cute manga anime webtoon style, a confident Korean girl with short hair watching from across the classroom with a jealous expression, arms crossed, dark mood lines around her, dramatic contrast with the bright classroom, intense eyes',
            dialogue: [
              {
                speaker: '수진',
                speakerEnglish: 'Sujin (thinking)',
                korean: '저 여자가 뭐야...?',
                romanization: 'jeo yeojaga mwoya...?',
                english: 'Who is that girl...?',
                words: [
                  { korean: '저', english: 'that (over there)' },
                  { korean: '여자가', english: 'girl (subject)' },
                  { korean: '뭐야', english: 'what is (casual)' },
                ],
                position: 'center',
              },
            ],
          },
          {
            id: 'ch1-p7',
            imagePrompt: 'cute manga anime webtoon style, school lunch break scene, a Korean boy sharing his lunch box with a shy girl, they sit together at a cafeteria table, other students around, the girl looks surprised and grateful, warm golden lighting, delicious Korean food visible',
            dialogue: [
              {
                speaker: '준호',
                speakerEnglish: 'Junho',
                korean: '이거 먹어. 김밥이야.',
                romanization: 'igeo meogeo. gimbabiya.',
                english: 'Eat this. It\'s gimbap.',
                words: [
                  { korean: '이거', english: 'this' },
                  { korean: '먹어', english: 'eat (casual)' },
                  { korean: '김밥이야', english: 'it\'s gimbap' },
                ],
                position: 'left',
              },
              {
                speaker: '미나',
                speakerEnglish: 'Mina',
                korean: '와! 맛있어! 고마워!',
                romanization: 'wa! masisseo! gomawo!',
                english: 'Wow! Delicious! Thank you!',
                words: [
                  { korean: '와', english: 'wow' },
                  { korean: '맛있어', english: 'delicious (casual)' },
                  { korean: '고마워', english: 'thank you (casual)' },
                ],
                position: 'right',
              },
            ],
          },
          {
            id: 'ch1-p8',
            imagePrompt: 'cute manga anime webtoon style, end of school day, a Korean girl walking home smiling happily while looking at the sunset, holding her school bag to her chest, cherry blossoms blowing in the wind, warm orange and pink sky, thought bubble with a boy face, dreamy atmosphere',
            dialogue: [
              {
                speaker: '미나',
                speakerEnglish: 'Mina (thinking)',
                korean: '준호... 좋은 사람이야.',
                romanization: 'junho... joeun saramiya.',
                english: 'Junho... he\'s a good person.',
                words: [
                  { korean: '준호', english: 'Junho' },
                  { korean: '좋은', english: 'good' },
                  { korean: '사람이야', english: 'is a person (casual)' },
                ],
                position: 'center',
              },
            ],
          },
        ],
      },
      // ─────────────────────────────────────────────
      // Chapter 2: The Study Group (Level 1)
      // ─────────────────────────────────────────────
      {
        id: 'ch2-study-group',
        title: 'The Study Group',
        titleKorean: '스터디 그룹',
        level: 1,
        description: 'Mina joins Junho\'s study group and they study together at a cozy cafe.',
        panels: [
          {
            id: 'ch2-p1',
            imagePrompt: 'cute manga anime webtoon style, a Korean classroom after school hours, a handsome boy approaching a girl at her desk to invite her somewhere, golden afternoon light streaming through windows, warm atmosphere, school bags on desks',
            dialogue: [
              {
                speaker: '준호',
                speakerEnglish: 'Junho',
                korean: '미나야, 오늘 같이 공부할래?',
                romanization: 'minaya, oneul gachi gongbuhallae?',
                english: 'Mina, want to study together today?',
                words: [
                  { korean: '미나야', english: 'Mina (casual address)' },
                  { korean: '오늘', english: 'today' },
                  { korean: '같이', english: 'together' },
                  { korean: '공부할래', english: 'want to study? (casual)' },
                ],
                position: 'left',
              },
              {
                speaker: '미나',
                speakerEnglish: 'Mina',
                korean: '네! 어디에서요?',
                romanization: 'ne! eodieseoyo?',
                english: 'Yes! Where?',
                words: [
                  { korean: '네', english: 'yes' },
                  { korean: '어디에서요', english: 'where? (polite)' },
                ],
                position: 'right',
              },
            ],
          },
          {
            id: 'ch2-p2',
            imagePrompt: 'cute manga anime webtoon style, a cute Korean cafe exterior with a warm inviting entrance, hanging plants, wooden sign, two high school students arriving together, afternoon sunlight, cozy neighborhood street in Seoul, pastel warm tones',
            dialogue: [
              {
                speaker: '준호',
                speakerEnglish: 'Junho',
                korean: '이 카페 좋아. 조용해.',
                romanization: 'i kape joa. joyonghae.',
                english: 'I like this cafe. It\'s quiet.',
                words: [
                  { korean: '이', english: 'this' },
                  { korean: '카페', english: 'cafe' },
                  { korean: '좋아', english: 'like / good (casual)' },
                  { korean: '조용해', english: 'it\'s quiet (casual)' },
                ],
                position: 'left',
              },
            ],
          },
          {
            id: 'ch2-p3',
            imagePrompt: 'cute manga anime webtoon style, interior of a cozy Korean cafe, two high school students sitting across from each other at a wooden table with books and notebooks open, warm lighting, coffee cups on table, bookshelves in background, plants hanging from ceiling',
            dialogue: [
              {
                speaker: '미나',
                speakerEnglish: 'Mina',
                korean: '뭐 마실래요?',
                romanization: 'mwo masillaeyo?',
                english: 'What do you want to drink?',
                words: [
                  { korean: '뭐', english: 'what' },
                  { korean: '마실래요', english: 'want to drink? (polite)' },
                ],
                position: 'right',
              },
              {
                speaker: '준호',
                speakerEnglish: 'Junho',
                korean: '아이스 아메리카노! 미나는?',
                romanization: 'aiseu amerikano! minaneun?',
                english: 'Iced americano! And you, Mina?',
                words: [
                  { korean: '아이스', english: 'iced' },
                  { korean: '아메리카노', english: 'americano' },
                  { korean: '미나는', english: 'Mina (topic)' },
                ],
                position: 'left',
              },
            ],
          },
          {
            id: 'ch2-p4',
            imagePrompt: 'cute manga anime webtoon style, two Korean high school students studying together at a cafe, the boy is pointing at something in a textbook and explaining, the girl listens carefully with bright interested eyes, books and notes spread on table, cozy lighting',
            dialogue: [
              {
                speaker: '준호',
                speakerEnglish: 'Junho',
                korean: '이거 어려워? 내가 알려줄게.',
                romanization: 'igeo eoryeowo? naega allyeojulge.',
                english: 'Is this hard? I\'ll teach you.',
                words: [
                  { korean: '이거', english: 'this' },
                  { korean: '어려워', english: 'difficult (casual)' },
                  { korean: '내가', english: 'I (subject, casual)' },
                  { korean: '알려줄게', english: 'I\'ll teach you (casual)' },
                ],
                position: 'left',
              },
              {
                speaker: '미나',
                speakerEnglish: 'Mina',
                korean: '네, 수학이 어려워요.',
                romanization: 'ne, suhagi eoryeowoyo.',
                english: 'Yes, math is hard.',
                words: [
                  { korean: '네', english: 'yes' },
                  { korean: '수학이', english: 'math (subject)' },
                  { korean: '어려워요', english: 'difficult (polite)' },
                ],
                position: 'right',
              },
            ],
          },
          {
            id: 'ch2-p5',
            imagePrompt: 'cute manga anime webtoon style, close-up of two high school students hands almost touching over a textbook on a cafe table, soft focus, warm pink tones, romantic atmosphere, hearts floating subtly in the background, gentle lighting',
            narration: '두 사람의 손이 가까워집니다...',
            narrationEnglish: 'Their hands grow closer...',
            dialogue: [
              {
                speaker: '미나',
                speakerEnglish: 'Mina (thinking)',
                korean: '심장이 빨리 뛰어...',
                romanization: 'simjangi ppalli ttwi-eo...',
                english: 'My heart is beating fast...',
                words: [
                  { korean: '심장이', english: 'heart (subject)' },
                  { korean: '빨리', english: 'fast / quickly' },
                  { korean: '뛰어', english: 'beating / running (casual)' },
                ],
                position: 'center',
              },
            ],
          },
          {
            id: 'ch2-p6',
            imagePrompt: 'cute manga anime webtoon style, a Korean boy quickly pulling his hand back looking embarrassed with a red face, at a cafe table with books, the girl across also blushing and looking away, awkward cute romantic moment, pastel pink tones, sparkle effects',
            dialogue: [
              {
                speaker: '준호',
                speakerEnglish: 'Junho',
                korean: '아... 미안! 미안!',
                romanization: 'a... mian! mian!',
                english: 'Ah... sorry! Sorry!',
                words: [
                  { korean: '아', english: 'ah' },
                  { korean: '미안', english: 'sorry (casual)' },
                ],
                position: 'left',
              },
              {
                speaker: '미나',
                speakerEnglish: 'Mina',
                korean: '아니에요... 괜찮아요.',
                romanization: 'anieyo... gwaenchanayo.',
                english: 'No... it\'s okay.',
                words: [
                  { korean: '아니에요', english: 'no (polite)' },
                  { korean: '괜찮아요', english: 'it\'s okay (polite)' },
                ],
                position: 'right',
              },
            ],
          },
          {
            id: 'ch2-p7',
            imagePrompt: 'cute manga anime webtoon style, two Korean students walking out of a cafe into the evening, golden hour sunset light, the boy carries both their school bags being gentlemanly, the girl walks beside him smiling, warm romantic atmosphere, Seoul street with shops',
            dialogue: [
              {
                speaker: '준호',
                speakerEnglish: 'Junho',
                korean: '내가 가방 들어줄게.',
                romanization: 'naega gabang deureo-julge.',
                english: 'I\'ll carry your bag.',
                words: [
                  { korean: '내가', english: 'I (subject, casual)' },
                  { korean: '가방', english: 'bag' },
                  { korean: '들어줄게', english: 'I\'ll carry for you (casual)' },
                ],
                position: 'left',
              },
              {
                speaker: '미나',
                speakerEnglish: 'Mina',
                korean: '고마워, 준호야.',
                romanization: 'gomawo, junhoya.',
                english: 'Thank you, Junho.',
                words: [
                  { korean: '고마워', english: 'thank you (casual)' },
                  { korean: '준호야', english: 'Junho (casual address)' },
                ],
                position: 'right',
              },
            ],
          },
          {
            id: 'ch2-p8',
            imagePrompt: 'cute manga anime webtoon style, a Korean girl waving goodbye to a boy at a crosswalk at sunset, warm orange sky, city buildings silhouetted in background, both smiling, heartwarming farewell scene, soft glowing light, cherry blossom petals in the wind',
            dialogue: [
              {
                speaker: '준호',
                speakerEnglish: 'Junho',
                korean: '내일 또 만나! 안녕!',
                romanization: 'naeil tto manna! annyeong!',
                english: 'See you again tomorrow! Bye!',
                words: [
                  { korean: '내일', english: 'tomorrow' },
                  { korean: '또', english: 'again' },
                  { korean: '만나', english: 'meet (casual)' },
                  { korean: '안녕', english: 'bye (casual)' },
                ],
                position: 'left',
              },
              {
                speaker: '미나',
                speakerEnglish: 'Mina',
                korean: '응! 안녕!',
                romanization: 'eung! annyeong!',
                english: 'Yeah! Bye!',
                words: [
                  { korean: '응', english: 'yeah (casual)' },
                  { korean: '안녕', english: 'bye (casual)' },
                ],
                position: 'right',
              },
            ],
          },
        ],
      },
      // ─────────────────────────────────────────────
      // Chapter 3: The School Festival (Level 2)
      // ─────────────────────────────────────────────
      {
        id: 'ch3-school-festival',
        title: 'The School Festival',
        titleKorean: '학교 축제',
        level: 2,
        description: 'Mina and Junho work together on the school festival and grow closer.',
        panels: [
          {
            id: 'ch3-p1',
            imagePrompt: 'cute manga anime webtoon style, a Korean high school classroom decorated with colorful banners and streamers for a school festival, students working together on decorations, excited energy, bright vibrant colors, festival preparations',
            narration: '학교 축제가 다가옵니다!',
            narrationEnglish: 'The school festival is approaching!',
            dialogue: [
              {
                speaker: '선생님',
                speakerEnglish: 'Teacher',
                korean: '우리 반은 카페를 할 거예요.',
                romanization: 'uri baneun kapereul hal geoyeyo.',
                english: 'Our class will do a cafe.',
                words: [
                  { korean: '우리', english: 'our' },
                  { korean: '반은', english: 'class (topic)' },
                  { korean: '카페를', english: 'cafe (object)' },
                  { korean: '할', english: 'will do' },
                  { korean: '거예요', english: 'going to (polite)' },
                ],
                position: 'left',
              },
            ],
          },
          {
            id: 'ch3-p2',
            imagePrompt: 'cute manga anime webtoon style, a Korean high school boy and girl standing together in a classroom, the boy looks excited suggesting an idea, the girl nods enthusiastically, other students listen in background, bright afternoon light',
            dialogue: [
              {
                speaker: '준호',
                speakerEnglish: 'Junho',
                korean: '미나야, 같이 메뉴를 만들자!',
                romanization: 'minaya, gachi menyureul mandeul-ja!',
                english: 'Mina, let\'s make the menu together!',
                words: [
                  { korean: '미나야', english: 'Mina (casual address)' },
                  { korean: '같이', english: 'together' },
                  { korean: '메뉴를', english: 'menu (object)' },
                  { korean: '만들자', english: 'let\'s make' },
                ],
                position: 'left',
              },
              {
                speaker: '미나',
                speakerEnglish: 'Mina',
                korean: '좋아! 나는 그림을 잘 그려.',
                romanization: 'joa! naneun geurimeul jal geuryeo.',
                english: 'Great! I\'m good at drawing.',
                words: [
                  { korean: '좋아', english: 'good / great (casual)' },
                  { korean: '나는', english: 'I (topic, casual)' },
                  { korean: '그림을', english: 'drawing (object)' },
                  { korean: '잘', english: 'well' },
                  { korean: '그려', english: 'draw (casual)' },
                ],
                position: 'right',
              },
            ],
          },
          {
            id: 'ch3-p3',
            imagePrompt: 'cute manga anime webtoon style, two Korean high school students sitting on the classroom floor surrounded by art supplies, painting a large colorful banner together, paint on their faces, laughing, warm afternoon light, creative messy fun atmosphere',
            dialogue: [
              {
                speaker: '준호',
                speakerEnglish: 'Junho',
                korean: '와, 미나 그림 진짜 예쁘다!',
                romanization: 'wa, mina geurim jinjja yeppeuda!',
                english: 'Wow, Mina, your drawing is really pretty!',
                words: [
                  { korean: '와', english: 'wow' },
                  { korean: '미나', english: 'Mina' },
                  { korean: '그림', english: 'drawing / picture' },
                  { korean: '진짜', english: 'really' },
                  { korean: '예쁘다', english: 'pretty (exclamation)' },
                ],
                position: 'left',
              },
              {
                speaker: '미나',
                speakerEnglish: 'Mina',
                korean: '정말? 고마워! 준호도 잘해!',
                romanization: 'jeongmal? gomawo! junhodo jalhae!',
                english: 'Really? Thanks! You\'re good too, Junho!',
                words: [
                  { korean: '정말', english: 'really' },
                  { korean: '고마워', english: 'thanks (casual)' },
                  { korean: '준호도', english: 'Junho also' },
                  { korean: '잘해', english: 'is good at (casual)' },
                ],
                position: 'right',
              },
            ],
          },
          {
            id: 'ch3-p4',
            imagePrompt: 'cute manga anime webtoon style, a Korean boy wiping paint off a girls cheek gently with his finger, both blushing, close-up romantic moment, soft focus background, warm pink tones, sparkle effects, paint smudges on their faces, tender moment',
            dialogue: [
              {
                speaker: '준호',
                speakerEnglish: 'Junho',
                korean: '잠깐, 얼굴에 물감이 있어.',
                romanization: 'jamkkan, eolgure mulgami isseo.',
                english: 'Wait, there\'s paint on your face.',
                words: [
                  { korean: '잠깐', english: 'wait a moment' },
                  { korean: '얼굴에', english: 'on face' },
                  { korean: '물감이', english: 'paint (subject)' },
                  { korean: '있어', english: 'there is (casual)' },
                ],
                position: 'left',
              },
              {
                speaker: '미나',
                speakerEnglish: 'Mina',
                korean: '어... 어디에...?',
                romanization: 'eo... eodie...?',
                english: 'Uh... where...?',
                words: [
                  { korean: '어', english: 'uh' },
                  { korean: '어디에', english: 'where' },
                ],
                position: 'right',
              },
            ],
          },
          {
            id: 'ch3-p5',
            imagePrompt: 'cute manga anime webtoon style, the day of a Korean school festival, a classroom transformed into a cute cafe with handmade decorations, two students wearing matching aprons serving customers, colorful banners, balloons, happy lively atmosphere, bright vivid colors',
            narration: '축제 날이 왔습니다!',
            narrationEnglish: 'The festival day has come!',
            dialogue: [
              {
                speaker: '미나',
                speakerEnglish: 'Mina',
                korean: '어서 오세요! 뭐 드릴까요?',
                romanization: 'eoseo oseyo! mwo deurilkkayo?',
                english: 'Welcome! What can I get you?',
                words: [
                  { korean: '어서', english: 'quickly / welcome' },
                  { korean: '오세요', english: 'come (honorific)' },
                  { korean: '뭐', english: 'what' },
                  { korean: '드릴까요', english: 'shall I give you (humble)' },
                ],
                position: 'right',
              },
            ],
          },
          {
            id: 'ch3-p6',
            imagePrompt: 'cute manga anime webtoon style, two Korean high school students in aprons taking a break behind a cafe booth at school festival, sitting on boxes, sharing a drink with two straws, tired but happy, warm golden hour light, romantic cute moment',
            dialogue: [
              {
                speaker: '준호',
                speakerEnglish: 'Junho',
                korean: '힘들지? 이거 마셔.',
                romanization: 'himdeulji? igeo masyeo.',
                english: 'Tired? Drink this.',
                words: [
                  { korean: '힘들지', english: 'tired, right? (casual)' },
                  { korean: '이거', english: 'this' },
                  { korean: '마셔', english: 'drink (casual)' },
                ],
                position: 'left',
              },
              {
                speaker: '미나',
                speakerEnglish: 'Mina',
                korean: '고마워. 오늘 재미있었어!',
                romanization: 'gomawo. oneul jaemiisseosseo!',
                english: 'Thank you. Today was fun!',
                words: [
                  { korean: '고마워', english: 'thank you (casual)' },
                  { korean: '오늘', english: 'today' },
                  { korean: '재미있었어', english: 'was fun (casual)' },
                ],
                position: 'right',
              },
            ],
          },
          {
            id: 'ch3-p7',
            imagePrompt: 'cute manga anime webtoon style, nighttime school festival scene with paper lanterns and fairy lights, two Korean students standing together watching fireworks in the sky, romantic atmosphere, colorful fireworks reflected in their eyes, warm magical scene',
            dialogue: [
              {
                speaker: '준호',
                speakerEnglish: 'Junho',
                korean: '불꽃놀이 예쁘다...',
                romanization: 'bulkkot-nori yeppeuda...',
                english: 'The fireworks are beautiful...',
                words: [
                  { korean: '불꽃놀이', english: 'fireworks' },
                  { korean: '예쁘다', english: 'beautiful (exclamation)' },
                ],
                position: 'left',
              },
              {
                speaker: '미나',
                speakerEnglish: 'Mina',
                korean: '응... 정말 예뻐.',
                romanization: 'eung... jeongmal yeppeo.',
                english: 'Yeah... really pretty.',
                words: [
                  { korean: '응', english: 'yeah (casual)' },
                  { korean: '정말', english: 'really' },
                  { korean: '예뻐', english: 'pretty (casual)' },
                ],
                position: 'right',
              },
            ],
          },
          {
            id: 'ch3-p8',
            imagePrompt: 'cute manga anime webtoon style, close up of a Korean boys hand gently reaching for a girls hand under the glow of festival lanterns, soft focus, warm golden light, romantic tension, both looking at the fireworks but aware of each others closeness, dreamy atmosphere',
            narration: '두 사람의 마음이 가까워집니다...',
            narrationEnglish: 'Their hearts grow closer...',
            dialogue: [
              {
                speaker: '미나',
                speakerEnglish: 'Mina (thinking)',
                korean: '준호가... 좋아.',
                romanization: 'junhoga... joa.',
                english: 'I like... Junho.',
                words: [
                  { korean: '준호가', english: 'Junho (subject)' },
                  { korean: '좋아', english: 'like (casual)' },
                ],
                position: 'center',
              },
            ],
          },
        ],
      },
      // ─────────────────────────────────────────────
      // Chapter 4: The Misunderstanding (Level 3)
      // ─────────────────────────────────────────────
      {
        id: 'ch4-misunderstanding',
        title: 'The Misunderstanding',
        titleKorean: '오해',
        level: 3,
        description: 'Mina sees Junho with another girl and runs away heartbroken.',
        panels: [
          {
            id: 'ch4-p1',
            imagePrompt: 'cute manga anime webtoon style, a happy Korean high school girl walking to school on a bright morning, she has a gift bag in her hand, excited expression, cherry blossoms, she is clearly planning to give the gift to someone special, bright hopeful colors',
            narration: '미나는 준호에게 선물을 준비했습니다.',
            narrationEnglish: 'Mina prepared a gift for Junho.',
            dialogue: [
              {
                speaker: '미나',
                speakerEnglish: 'Mina (thinking)',
                korean: '오늘 준호에게 이걸 줄 거야!',
                romanization: 'oneul junhoege igeol jul geoya!',
                english: 'Today I\'m going to give this to Junho!',
                words: [
                  { korean: '오늘', english: 'today' },
                  { korean: '준호에게', english: 'to Junho' },
                  { korean: '이걸', english: 'this (object)' },
                  { korean: '줄', english: 'will give' },
                  { korean: '거야', english: 'going to (casual)' },
                ],
                position: 'center',
              },
            ],
          },
          {
            id: 'ch4-p2',
            imagePrompt: 'cute manga anime webtoon style, dramatic scene of a Korean girl peaking around a corner and seeing a handsome boy talking closely with a pretty girl she doesnt know, the unknown girl is laughing and touching the boys arm, shocked expression on the watching girl, dramatic shadow and lighting contrast',
            dialogue: [
              {
                speaker: '미나',
                speakerEnglish: 'Mina (thinking)',
                korean: '준호가... 저 여자랑 같이 있어?',
                romanization: 'junhoga... jeo yeojarang gachi isseo?',
                english: 'Junho is... with that girl?',
                words: [
                  { korean: '준호가', english: 'Junho (subject)' },
                  { korean: '저', english: 'that (over there)' },
                  { korean: '여자랑', english: 'with a girl' },
                  { korean: '같이', english: 'together' },
                  { korean: '있어', english: 'is (casual)' },
                ],
                position: 'center',
              },
            ],
          },
          {
            id: 'ch4-p3',
            imagePrompt: 'cute manga anime webtoon style, a Korean boy laughing happily with a pretty girl who is linking arms with him, they look very close and comfortable, school hallway, from the perspective of someone watching from a distance, the watching angle makes it look romantic',
            dialogue: [
              {
                speaker: '수진',
                speakerEnglish: 'Sujin (the unknown girl)',
                korean: '오빠, 오랜만이야! 보고 싶었어!',
                romanization: 'oppa, oraenmaniya! bogo sipeo-sseo!',
                english: 'Oppa, long time no see! I missed you!',
                words: [
                  { korean: '오빠', english: 'older brother / oppa' },
                  { korean: '오랜만이야', english: 'long time no see (casual)' },
                  { korean: '보고', english: 'seeing' },
                  { korean: '싶었어', english: 'wanted to / missed (casual)' },
                ],
                position: 'left',
              },
              {
                speaker: '준호',
                speakerEnglish: 'Junho',
                korean: '수진아! 나도 반가워!',
                romanization: 'sujina! nado bangawo!',
                english: 'Sujin! I\'m glad to see you too!',
                words: [
                  { korean: '수진아', english: 'Sujin (casual address)' },
                  { korean: '나도', english: 'me too' },
                  { korean: '반가워', english: 'glad to see (casual)' },
                ],
                position: 'right',
              },
            ],
          },
          {
            id: 'ch4-p4',
            imagePrompt: 'cute manga anime webtoon style, dramatic close-up of a Korean girls face with tears forming in her eyes, the gift bag dropping from her hand, devastating emotional pain visible, dark shadow falling over her face, manga speed lines showing shock, heartbreak visual effects',
            dialogue: [
              {
                speaker: '미나',
                speakerEnglish: 'Mina (thinking)',
                korean: '준호에게 여자친구가 있었어...?',
                romanization: 'junhoege yeojachinguga isseosseo...?',
                english: 'Junho had a girlfriend...?',
                words: [
                  { korean: '준호에게', english: 'to Junho' },
                  { korean: '여자친구가', english: 'girlfriend (subject)' },
                  { korean: '있었어', english: 'had / existed (casual)' },
                ],
                position: 'center',
              },
            ],
          },
          {
            id: 'ch4-p5',
            imagePrompt: 'cute manga anime webtoon style, a Korean girl running away through a school hallway crying, tears streaming behind her, blurred background showing speed, other students looking surprised, dramatic emotional running scene, manga motion lines',
            dialogue: [
              {
                speaker: '미나',
                speakerEnglish: 'Mina',
                korean: '바보... 나는 바보야...',
                romanization: 'babo... naneun baboya...',
                english: 'Fool... I\'m a fool...',
                words: [
                  { korean: '바보', english: 'fool / idiot' },
                  { korean: '나는', english: 'I (topic, casual)' },
                  { korean: '바보야', english: 'am a fool (casual)' },
                ],
                position: 'center',
              },
            ],
          },
          {
            id: 'ch4-p6',
            imagePrompt: 'cute manga anime webtoon style, a confused Korean boy looking around the school hallway after seeing a girl run away, he noticed her but doesnt understand why she ran, worried expression, other students pointing in the direction she went',
            dialogue: [
              {
                speaker: '준호',
                speakerEnglish: 'Junho',
                korean: '어? 미나? 미나 어디 가?!',
                romanization: 'eo? mina? mina eodi ga?!',
                english: 'Huh? Mina? Where are you going?!',
                words: [
                  { korean: '어', english: 'huh' },
                  { korean: '미나', english: 'Mina' },
                  { korean: '어디', english: 'where' },
                  { korean: '가', english: 'go (casual)' },
                ],
                position: 'left',
              },
              {
                speaker: '수진',
                speakerEnglish: 'Sujin',
                korean: '오빠, 저 사람 누구야?',
                romanization: 'oppa, jeo saram nugura?',
                english: 'Oppa, who is that person?',
                words: [
                  { korean: '오빠', english: 'oppa / older brother' },
                  { korean: '저', english: 'that' },
                  { korean: '사람', english: 'person' },
                  { korean: '누구야', english: 'who is (casual)' },
                ],
                position: 'right',
              },
            ],
          },
          {
            id: 'ch4-p7',
            imagePrompt: 'cute manga anime webtoon style, a Korean girl sitting alone on a park bench crying, holding her knees, abandoned gift bag beside her, autumn leaves falling, grey cloudy sky, lonely sad atmosphere, beautiful but melancholy scene, empty park',
            dialogue: [
              {
                speaker: '미나',
                speakerEnglish: 'Mina',
                korean: '왜 이렇게 아파... 가슴이 너무 아파.',
                romanization: 'wae ireoke apa... gaseumi neomu apa.',
                english: 'Why does it hurt like this... my chest hurts so much.',
                words: [
                  { korean: '왜', english: 'why' },
                  { korean: '이렇게', english: 'like this' },
                  { korean: '아파', english: 'hurts (casual)' },
                  { korean: '가슴이', english: 'chest/heart (subject)' },
                  { korean: '너무', english: 'too much / so' },
                ],
                position: 'center',
              },
            ],
          },
          {
            id: 'ch4-p8',
            imagePrompt: 'cute manga anime webtoon style, a Korean girl looking at her phone with tears on her face, the phone screen shows many missed calls and messages from Junho, she cant bring herself to answer, dark evening sky, streetlight glow, emotional lonely scene',
            dialogue: [
              {
                speaker: '미나',
                speakerEnglish: 'Mina',
                korean: '전화 받고 싶지 않아...',
                romanization: 'jeonhwa batgo sipji ana...',
                english: 'I don\'t want to answer the phone...',
                words: [
                  { korean: '전화', english: 'phone call' },
                  { korean: '받고', english: 'answering' },
                  { korean: '싶지', english: 'want to' },
                  { korean: '않아', english: 'don\'t / not (casual)' },
                ],
                position: 'center',
              },
            ],
          },
        ],
      },
      // ─────────────────────────────────────────────
      // Chapter 5: The Truth (Level 3)
      // ─────────────────────────────────────────────
      {
        id: 'ch5-the-truth',
        title: 'The Truth',
        titleKorean: '진실',
        level: 3,
        description: 'Sujin was Junho\'s cousin all along. Junho searches for Mina in the rain.',
        panels: [
          {
            id: 'ch5-p1',
            imagePrompt: 'cute manga anime webtoon style, a worried Korean boy grabbing his jacket and rushing out of a school building, rainy weather starting, dark grey clouds, determined desperate expression, other students with umbrellas in background, dramatic atmosphere',
            narration: '준호는 미나를 찾으러 갑니다.',
            narrationEnglish: 'Junho goes to find Mina.',
            dialogue: [
              {
                speaker: '준호',
                speakerEnglish: 'Junho',
                korean: '미나가 왜 울면서 갔어? 무슨 일이야?',
                romanization: 'minaga wae ulmyeonseo gasseo? museun iriya?',
                english: 'Why did Mina leave crying? What happened?',
                words: [
                  { korean: '미나가', english: 'Mina (subject)' },
                  { korean: '왜', english: 'why' },
                  { korean: '울면서', english: 'while crying' },
                  { korean: '갔어', english: 'went (casual)' },
                  { korean: '무슨', english: 'what kind of' },
                  { korean: '일이야', english: 'matter / thing is it (casual)' },
                ],
                position: 'left',
              },
            ],
          },
          {
            id: 'ch5-p2',
            imagePrompt: 'cute manga anime webtoon style, a Korean girl (Sujin) explaining something to a worried boy in a school hallway, she looks surprised and concerned, the boy looks confused, rain visible through the windows, dramatic serious conversation scene',
            dialogue: [
              {
                speaker: '수진',
                speakerEnglish: 'Sujin',
                korean: '오빠, 아까 그 여자아이... 오빠를 좋아하는 것 같아.',
                romanization: 'oppa, akka geu yeojaai... oppareul joahaneun geot gata.',
                english: 'Oppa, that girl earlier... I think she likes you.',
                words: [
                  { korean: '오빠', english: 'oppa / older brother' },
                  { korean: '아까', english: 'earlier' },
                  { korean: '그', english: 'that' },
                  { korean: '여자아이', english: 'girl' },
                  { korean: '오빠를', english: 'you (object)' },
                  { korean: '좋아하는', english: 'liking' },
                  { korean: '것', english: 'thing' },
                  { korean: '같아', english: 'seems like (casual)' },
                ],
                position: 'right',
              },
            ],
          },
          {
            id: 'ch5-p3',
            imagePrompt: 'cute manga anime webtoon style, a Korean boy having a sudden realization moment, light bulb effect over his head, his eyes go wide with understanding, dramatic manga style realization effects, speed lines radiating from his face, school hallway background',
            dialogue: [
              {
                speaker: '준호',
                speakerEnglish: 'Junho',
                korean: '미나가... 수진이를 보고 오해한 거야?!',
                romanization: 'minaga... sujinireul bogo ohaegan geoya?!',
                english: 'Mina... misunderstood because she saw Sujin?!',
                words: [
                  { korean: '미나가', english: 'Mina (subject)' },
                  { korean: '수진이를', english: 'Sujin (object)' },
                  { korean: '보고', english: 'saw and' },
                  { korean: '오해한', english: 'misunderstood' },
                  { korean: '거야', english: 'is it (casual)' },
                ],
                position: 'left',
              },
              {
                speaker: '수진',
                speakerEnglish: 'Sujin',
                korean: '우리가 사촌이라고 말해야 해!',
                romanization: 'uriga sachoira-go malhaeya hae!',
                english: 'You have to tell her we\'re cousins!',
                words: [
                  { korean: '우리가', english: 'we (subject)' },
                  { korean: '사촌이라고', english: 'that we\'re cousins' },
                  { korean: '말해야', english: 'must say' },
                  { korean: '해', english: 'do (casual)' },
                ],
                position: 'right',
              },
            ],
          },
          {
            id: 'ch5-p4',
            imagePrompt: 'cute manga anime webtoon style, a Korean boy running through heavy rain on a Seoul street searching desperately for someone, splashing through puddles, no umbrella, soaking wet, streetlights reflecting on wet pavement, dramatic emotional running scene, city buildings in background',
            dialogue: [
              {
                speaker: '준호',
                speakerEnglish: 'Junho',
                korean: '미나! 어디 있어?! 미나!!!',
                romanization: 'mina! eodi isseo?! mina!!!',
                english: 'Mina! Where are you?! Mina!!!',
                words: [
                  { korean: '미나', english: 'Mina' },
                  { korean: '어디', english: 'where' },
                  { korean: '있어', english: 'are you (casual)' },
                ],
                position: 'center',
              },
            ],
          },
          {
            id: 'ch5-p5',
            imagePrompt: 'cute manga anime webtoon style, a Korean boy checking different places in the rain looking for a girl, at a park entrance then a bus stop then a convenience store, split panel manga style showing multiple locations, desperate worried expression, heavy rain, dramatic search montage',
            dialogue: [
              {
                speaker: '준호',
                speakerEnglish: 'Junho (thinking)',
                korean: '공원에도 없고... 버스 정류장에도 없어...',
                romanization: 'gongwonedo eopgo... beoseu jeongryujangedo eopseo...',
                english: 'Not at the park... not at the bus stop...',
                words: [
                  { korean: '공원에도', english: 'at the park too' },
                  { korean: '없고', english: 'not there and' },
                  { korean: '버스', english: 'bus' },
                  { korean: '정류장에도', english: 'at the stop too' },
                  { korean: '없어', english: 'not there (casual)' },
                ],
                position: 'center',
              },
            ],
          },
          {
            id: 'ch5-p6',
            imagePrompt: 'cute manga anime webtoon style, a Korean boy standing in the rain having an idea, he remembers something, flashback effect showing a previous scene of a girl mentioning a place she loves, light bulb moment, rain droplets frozen in time around him, dramatic revelation scene',
            dialogue: [
              {
                speaker: '준호',
                speakerEnglish: 'Junho',
                korean: '한강! 미나가 한강을 좋아한다고 했어!',
                romanization: 'hangang! minaga hangangeul joahandago haesseo!',
                english: 'Han River! Mina said she likes Han River!',
                words: [
                  { korean: '한강', english: 'Han River' },
                  { korean: '미나가', english: 'Mina (subject)' },
                  { korean: '한강을', english: 'Han River (object)' },
                  { korean: '좋아한다고', english: 'that she likes' },
                  { korean: '했어', english: 'said (casual)' },
                ],
                position: 'center',
              },
            ],
          },
          {
            id: 'ch5-p7',
            imagePrompt: 'cute manga anime webtoon style, a Korean boy running full speed along the Han River pathway in heavy rain, city lights reflecting on the river, bridges lit up in the background, dramatic action shot, wind and rain effects, determined expression, night scene',
            dialogue: [
              {
                speaker: '준호',
                speakerEnglish: 'Junho (thinking)',
                korean: '제발... 거기 있어 줘, 미나.',
                romanization: 'jebal... geogi isseo jwo, mina.',
                english: 'Please... be there, Mina.',
                words: [
                  { korean: '제발', english: 'please (begging)' },
                  { korean: '거기', english: 'there' },
                  { korean: '있어', english: 'be / stay (casual)' },
                  { korean: '줘', english: 'for me (casual)' },
                  { korean: '미나', english: 'Mina' },
                ],
                position: 'center',
              },
            ],
          },
          {
            id: 'ch5-p8',
            imagePrompt: 'cute manga anime webtoon style, a Korean boy spots a girl sitting alone on a bench by the Han River in the rain, dramatic long shot, the girl is small and curled up, the boy in the foreground looking relieved and emotional, rain pouring down, city lights reflecting on the river, bittersweet beautiful scene',
            dialogue: [
              {
                speaker: '준호',
                speakerEnglish: 'Junho',
                korean: '미나... 드디어 찾았다...',
                romanization: 'mina... deudieo chajatda...',
                english: 'Mina... I finally found you...',
                words: [
                  { korean: '미나', english: 'Mina' },
                  { korean: '드디어', english: 'finally' },
                  { korean: '찾았다', english: 'found (exclamation)' },
                ],
                position: 'left',
              },
            ],
          },
        ],
      },
      // ─────────────────────────────────────────────
      // Chapter 6: Together (Level 4)
      // ─────────────────────────────────────────────
      {
        id: 'ch6-together',
        title: 'Together',
        titleKorean: '함께',
        level: 4,
        description: 'Junho finds Mina at Han River, explains the truth, and confesses his feelings.',
        panels: [
          {
            id: 'ch6-p1',
            imagePrompt: 'cute manga anime webtoon style, a soaking wet Korean boy approaching a crying girl on a bench by the Han River at night in the rain, dramatic emotional scene, city lights blurred in background, rain creating a curtain around them, tender vulnerable moment',
            dialogue: [
              {
                speaker: '준호',
                speakerEnglish: 'Junho',
                korean: '미나야! 왜 여기서 비를 맞고 있어?',
                romanization: 'minaya! wae yeogiseo bireul matgo isseo?',
                english: 'Mina! Why are you sitting in the rain here?',
                words: [
                  { korean: '미나야', english: 'Mina (casual address)' },
                  { korean: '왜', english: 'why' },
                  { korean: '여기서', english: 'here' },
                  { korean: '비를', english: 'rain (object)' },
                  { korean: '맞고', english: 'getting hit by' },
                  { korean: '있어', english: 'are (casual)' },
                ],
                position: 'left',
              },
              {
                speaker: '미나',
                speakerEnglish: 'Mina',
                korean: '가... 가지 마. 아니, 가 줘.',
                romanization: 'ga... gaji ma. ani, ga jwo.',
                english: 'Go... don\'t go. No, please go.',
                words: [
                  { korean: '가', english: 'go (casual)' },
                  { korean: '가지', english: 'going' },
                  { korean: '마', english: 'don\'t' },
                  { korean: '아니', english: 'no' },
                  { korean: '줘', english: 'please (casual)' },
                ],
                position: 'right',
              },
            ],
          },
          {
            id: 'ch6-p2',
            imagePrompt: 'cute manga anime webtoon style, a Korean boy taking off his jacket and putting it over a crying girls shoulders in the rain, gentle caring gesture, Han River at night, rain drops visible, warm emotional moment despite the cold rain, city skyline in background',
            dialogue: [
              {
                speaker: '준호',
                speakerEnglish: 'Junho',
                korean: '먼저 이거 입어. 감기 걸리겠어.',
                romanization: 'meonjeo igeo ibeo. gamgi geolligesseo.',
                english: 'Put this on first. You\'ll catch a cold.',
                words: [
                  { korean: '먼저', english: 'first' },
                  { korean: '이거', english: 'this' },
                  { korean: '입어', english: 'put on / wear (casual)' },
                  { korean: '감기', english: 'cold (illness)' },
                  { korean: '걸리겠어', english: 'will catch (casual)' },
                ],
                position: 'left',
              },
            ],
          },
          {
            id: 'ch6-p3',
            imagePrompt: 'cute manga anime webtoon style, two Korean students sitting on a bench by the Han River at night, the boy is explaining something earnestly while the girl listens with teary eyes, rain has lightened to a drizzle, city lights reflecting on the river, emotional honest conversation scene',
            dialogue: [
              {
                speaker: '준호',
                speakerEnglish: 'Junho',
                korean: '수진이는 내 사촌이야. 여자친구가 아니야.',
                romanization: 'sujinineun nae sachoniya. yeojachinguga aniya.',
                english: 'Sujin is my cousin. She\'s not my girlfriend.',
                words: [
                  { korean: '수진이는', english: 'Sujin (topic)' },
                  { korean: '내', english: 'my (casual)' },
                  { korean: '사촌이야', english: 'is cousin (casual)' },
                  { korean: '여자친구가', english: 'girlfriend (subject)' },
                  { korean: '아니야', english: 'is not (casual)' },
                ],
                position: 'left',
              },
              {
                speaker: '미나',
                speakerEnglish: 'Mina',
                korean: '사촌...? 정말?',
                romanization: 'sachon...? jeongmal?',
                english: 'Cousin...? Really?',
                words: [
                  { korean: '사촌', english: 'cousin' },
                  { korean: '정말', english: 'really' },
                ],
                position: 'right',
              },
            ],
          },
          {
            id: 'ch6-p4',
            imagePrompt: 'cute manga anime webtoon style, close up of a Korean boys face, he looks deeply into the camera with sincere emotional eyes, rain drops on his face mixing with perhaps tears, beautiful detailed eyes, dramatic manga close-up, warm undertone despite the rain, confession scene',
            dialogue: [
              {
                speaker: '준호',
                speakerEnglish: 'Junho',
                korean: '미나야, 나... 처음부터 너를 좋아했어.',
                romanization: 'minaya, na... cheoeumbuteo neoreul joahaesseo.',
                english: 'Mina, I... I\'ve liked you from the beginning.',
                words: [
                  { korean: '미나야', english: 'Mina (casual address)' },
                  { korean: '나', english: 'I (casual)' },
                  { korean: '처음부터', english: 'from the beginning' },
                  { korean: '너를', english: 'you (object, casual)' },
                  { korean: '좋아했어', english: 'liked (casual past)' },
                ],
                position: 'left',
              },
            ],
          },
          {
            id: 'ch6-p5',
            imagePrompt: 'cute manga anime webtoon style, a Korean girl crying happy tears, her hands covering her mouth in shock and happiness, sparkle effects and flowers blooming around her, rain stopping, a ray of moonlight breaking through clouds, overwhelming emotional relief and joy, beautiful manga emotional scene',
            dialogue: [
              {
                speaker: '미나',
                speakerEnglish: 'Mina',
                korean: '나도... 나도 준호를 좋아해. 많이 좋아해.',
                romanization: 'nado... nado junhoreul joahae. mani joahae.',
                english: 'Me too... I like you too, Junho. I like you a lot.',
                words: [
                  { korean: '나도', english: 'me too' },
                  { korean: '준호를', english: 'Junho (object)' },
                  { korean: '좋아해', english: 'like (casual)' },
                  { korean: '많이', english: 'a lot' },
                ],
                position: 'right',
              },
            ],
          },
          {
            id: 'ch6-p6',
            imagePrompt: 'cute manga anime webtoon style, a Korean boy and girl embracing each other tightly by the Han River as the rain stops, moonlight breaking through clouds, city lights reflecting on the water, cherry blossom petals swirling in the wind, the most romantic beautiful moment, warm golden light, tears of happiness',
            narration: '비가 그치고, 달빛이 비춥니다.',
            narrationEnglish: 'The rain stops, and moonlight shines down.',
            dialogue: [
              {
                speaker: '준호',
                speakerEnglish: 'Junho',
                korean: '다시는 울리지 않을게. 약속해.',
                romanization: 'dasineun ulliji aneulge. yaksokae.',
                english: 'I won\'t make you cry again. I promise.',
                words: [
                  { korean: '다시는', english: 'ever again' },
                  { korean: '울리지', english: 'make cry' },
                  { korean: '않을게', english: 'won\'t (casual promise)' },
                  { korean: '약속해', english: 'I promise (casual)' },
                ],
                position: 'left',
              },
            ],
          },
          {
            id: 'ch6-p7',
            imagePrompt: 'cute manga anime webtoon style, a Korean couple sitting close together on a bench by the Han River after the rain, sharing the boys jacket, city lights twinkling, stars appearing in the clearing sky, their reflections in a puddle, peaceful romantic aftermath, soft warm tones',
            dialogue: [
              {
                speaker: '미나',
                speakerEnglish: 'Mina',
                korean: '준호야... 지금 이 순간이 제일 행복해.',
                romanization: 'junhoya... jigeum i sungani jeil haengbokae.',
                english: 'Junho... this moment right now is the happiest.',
                words: [
                  { korean: '준호야', english: 'Junho (casual address)' },
                  { korean: '지금', english: 'now' },
                  { korean: '이', english: 'this' },
                  { korean: '순간이', english: 'moment (subject)' },
                  { korean: '제일', english: 'the most' },
                  { korean: '행복해', english: 'happy (casual)' },
                ],
                position: 'right',
              },
              {
                speaker: '준호',
                speakerEnglish: 'Junho',
                korean: '나도. 앞으로도 계속 같이 있자.',
                romanization: 'nado. apeurodo gyesok gachi itja.',
                english: 'Me too. Let\'s stay together from now on.',
                words: [
                  { korean: '나도', english: 'me too' },
                  { korean: '앞으로도', english: 'from now on too' },
                  { korean: '계속', english: 'continuously' },
                  { korean: '같이', english: 'together' },
                  { korean: '있자', english: 'let\'s stay (casual)' },
                ],
                position: 'left',
              },
            ],
          },
          {
            id: 'ch6-p8',
            imagePrompt: 'cute manga anime webtoon style, wide panoramic shot of two Korean students walking hand in hand along the Han River at night, the sky is clearing with stars and a beautiful moon, city skyline lit up behind them, cherry blossom petals floating, their silhouettes against the moonlit water, the perfect happy ending, warm dreamy atmosphere',
            narration: '서울 러브 스토리... 완.',
            narrationEnglish: 'Seoul Love Story... The End.',
            dialogue: [
              {
                speaker: '미나',
                speakerEnglish: 'Mina',
                korean: '우리의 이야기는 이제 시작이야.',
                romanization: 'uriui iyagineun ije sijagiya.',
                english: 'Our story is just beginning.',
                words: [
                  { korean: '우리의', english: 'our' },
                  { korean: '이야기는', english: 'story (topic)' },
                  { korean: '이제', english: 'now' },
                  { korean: '시작이야', english: 'is the beginning (casual)' },
                ],
                position: 'center',
              },
            ],
          },
        ],
      },
    ],
  },
  // ═══════════════════════════════════════════════
  // SERIES 2: Cafe Adventure
  // ═══════════════════════════════════════════════
  {
    id: 'cafe-adventure',
    title: 'Cafe Adventure',
    titleKorean: '카페 어드벤처',
    description: 'A hilarious slice-of-life comedy about Alex, a foreigner learning Korean while working at a Seoul cafe. Funny mistakes, heartwarming friendships, and lots of coffee!',
    genre: 'Comedy / Slice of Life',
    chapters: [
      // ─────────────────────────────────────────────
      // Chapter 1: First Day (Level 1)
      // ─────────────────────────────────────────────
      {
        id: 'cafe-ch1-first-day',
        title: 'First Day',
        titleKorean: '첫 날',
        level: 1,
        description: 'Alex arrives in Seoul, finds a job at a cute cafe, and struggles to greet customers.',
        panels: [
          {
            id: 'cafe-ch1-p1',
            imagePrompt: 'cute manga anime webtoon style, a cheerful foreign young man with light brown hair stepping out of Incheon airport in Seoul, looking amazed at the Korean signs and city skyline, carrying a big backpack, bright blue sky, excited adventurous expression, vibrant colors',
            narration: '알렉스가 서울에 도착합니다!',
            narrationEnglish: 'Alex arrives in Seoul!',
            dialogue: [
              {
                speaker: '알렉스',
                speakerEnglish: 'Alex',
                korean: '와! 여기가 서울이야!',
                romanization: 'wa! yeogiga seouriya!',
                english: 'Wow! This is Seoul!',
                words: [
                  { korean: '와', english: 'wow' },
                  { korean: '여기가', english: 'this place (subject)' },
                  { korean: '서울이야', english: 'is Seoul (casual)' },
                ],
                position: 'center',
              },
            ],
          },
          {
            id: 'cafe-ch1-p2',
            imagePrompt: 'cute manga anime webtoon style, a foreign young man looking at a help wanted sign on a cute small Korean cafe window, the sign has Korean characters, he looks confused but interested, cozy Seoul neighborhood street, warm afternoon light, plants in pots outside the cafe',
            dialogue: [
              {
                speaker: '알렉스',
                speakerEnglish: 'Alex (thinking)',
                korean: '알바... 모집? 이게 뭐야?',
                romanization: 'alba... mojip? ige mwoya?',
                english: 'Part-time... recruiting? What\'s this?',
                words: [
                  { korean: '알바', english: 'part-time job' },
                  { korean: '모집', english: 'recruiting' },
                  { korean: '이게', english: 'this (subject)' },
                  { korean: '뭐야', english: 'what is (casual)' },
                ],
                position: 'center',
              },
            ],
          },
          {
            id: 'cafe-ch1-p3',
            imagePrompt: 'cute manga anime webtoon style, inside a cozy Korean cafe, a kind middle-aged Korean woman cafe owner shaking hands with a nervous foreign young man, warm interior with coffee machines and pastries, welcoming warm atmosphere, cute cafe decorations',
            dialogue: [
              {
                speaker: '사장님',
                speakerEnglish: 'Boss',
                korean: '어서 오세요! 일할 수 있어요?',
                romanization: 'eoseo oseyo! ilhal su isseoyo?',
                english: 'Welcome! Can you work here?',
                words: [
                  { korean: '어서', english: 'quickly / welcome' },
                  { korean: '오세요', english: 'come (honorific)' },
                  { korean: '일할', english: 'working' },
                  { korean: '수', english: 'ability / can' },
                  { korean: '있어요', english: 'have / can (polite)' },
                ],
                position: 'left',
              },
              {
                speaker: '알렉스',
                speakerEnglish: 'Alex',
                korean: '네! 일하고 싶어요!',
                romanization: 'ne! ilhago sipeoyo!',
                english: 'Yes! I want to work!',
                words: [
                  { korean: '네', english: 'yes' },
                  { korean: '일하고', english: 'working' },
                  { korean: '싶어요', english: 'want to (polite)' },
                ],
                position: 'right',
              },
            ],
          },
          {
            id: 'cafe-ch1-p4',
            imagePrompt: 'cute manga anime webtoon style, a foreign young man wearing a cafe apron for the first time, looking proud but nervous, the cafe owner gives him a thumbs up, cute cafe counter with coffee menu chalkboard, warm lighting, cheerful scene',
            dialogue: [
              {
                speaker: '사장님',
                speakerEnglish: 'Boss',
                korean: '이 앞치마 입어요. 오늘부터 시작!',
                romanization: 'i apchima ibeoyo. oneulbuteo sijak!',
                english: 'Wear this apron. Starting today!',
                words: [
                  { korean: '이', english: 'this' },
                  { korean: '앞치마', english: 'apron' },
                  { korean: '입어요', english: 'wear (polite)' },
                  { korean: '오늘부터', english: 'from today' },
                  { korean: '시작', english: 'start' },
                ],
                position: 'left',
              },
            ],
          },
          {
            id: 'cafe-ch1-p5',
            imagePrompt: 'cute manga anime webtoon style, a nervous foreign young man behind a cafe counter as the first customer walks in, he is sweating and fumbling with the register, the customer is a friendly Korean grandmother, comical nervous expression, cafe interior',
            dialogue: [
              {
                speaker: '할머니',
                speakerEnglish: 'Grandmother',
                korean: '안녕하세요! 커피 주세요.',
                romanization: 'annyeonghaseyo! keopi juseyo.',
                english: 'Hello! Coffee please.',
                words: [
                  { korean: '안녕하세요', english: 'hello (formal)' },
                  { korean: '커피', english: 'coffee' },
                  { korean: '주세요', english: 'please give me' },
                ],
                position: 'left',
              },
              {
                speaker: '알렉스',
                speakerEnglish: 'Alex',
                korean: '아... 아녕... 아녕하세요?',
                romanization: 'a... anyeong... anyeonghaseyo?',
                english: 'Uh... he-hello... hello?',
                words: [
                  { korean: '아', english: 'uh' },
                  { korean: '아녕하세요', english: 'hello (mispronounced!)' },
                ],
                position: 'right',
              },
            ],
          },
          {
            id: 'cafe-ch1-p6',
            imagePrompt: 'cute manga anime webtoon style, a Korean grandmother laughing kindly at a flustered foreign barista who is bowing too many times, comical scene with motion lines showing repeated bowing, the old woman waves her hand in a its okay gesture, warm humorous atmosphere',
            dialogue: [
              {
                speaker: '할머니',
                speakerEnglish: 'Grandmother',
                korean: '하하! 괜찮아요. 천천히 하세요.',
                romanization: 'haha! gwaenchanayo. cheoncheonhi haseyo.',
                english: 'Haha! It\'s okay. Take your time.',
                words: [
                  { korean: '하하', english: 'haha' },
                  { korean: '괜찮아요', english: 'it\'s okay (polite)' },
                  { korean: '천천히', english: 'slowly' },
                  { korean: '하세요', english: 'please do (honorific)' },
                ],
                position: 'left',
              },
              {
                speaker: '알렉스',
                speakerEnglish: 'Alex',
                korean: '감사합니다! 감사합니다!',
                romanization: 'gamsahamnida! gamsahamnida!',
                english: 'Thank you! Thank you!',
                words: [
                  { korean: '감사합니다', english: 'thank you (formal)' },
                ],
                position: 'right',
              },
            ],
          },
          {
            id: 'cafe-ch1-p7',
            imagePrompt: 'cute manga anime webtoon style, a foreign barista proudly but incorrectly bowing to a customer while accidentally pouring coffee on the counter, comical disaster scene, coffee spilling everywhere, the cafe owner face-palming in the background, funny manga reaction effects',
            dialogue: [
              {
                speaker: '사장님',
                speakerEnglish: 'Boss',
                korean: '알렉스! 커피! 커피가 넘쳐요!',
                romanization: 'allekseu! keopi! keopi-ga neomchyeoyo!',
                english: 'Alex! Coffee! The coffee is overflowing!',
                words: [
                  { korean: '알렉스', english: 'Alex' },
                  { korean: '커피', english: 'coffee' },
                  { korean: '커피가', english: 'coffee (subject)' },
                  { korean: '넘쳐요', english: 'overflowing (polite)' },
                ],
                position: 'left',
              },
              {
                speaker: '알렉스',
                speakerEnglish: 'Alex',
                korean: '아! 미안해요! 미안해요!',
                romanization: 'a! mianhaeyo! mianhaeyo!',
                english: 'Ah! Sorry! Sorry!',
                words: [
                  { korean: '아', english: 'ah' },
                  { korean: '미안해요', english: 'sorry (polite)' },
                ],
                position: 'right',
              },
            ],
          },
          {
            id: 'cafe-ch1-p8',
            imagePrompt: 'cute manga anime webtoon style, end of first day, a tired but happy foreign young man sitting on the cafe floor after closing, the cafe owner brings him a cup of coffee with a kind smile, warm golden evening light, cozy cafe atmosphere, heartwarming scene',
            dialogue: [
              {
                speaker: '사장님',
                speakerEnglish: 'Boss',
                korean: '수고했어요. 내일 또 와요!',
                romanization: 'sugohaesseoyo. naeil tto wayo!',
                english: 'Good work. Come again tomorrow!',
                words: [
                  { korean: '수고했어요', english: 'good work (polite)' },
                  { korean: '내일', english: 'tomorrow' },
                  { korean: '또', english: 'again' },
                  { korean: '와요', english: 'come (polite)' },
                ],
                position: 'left',
              },
              {
                speaker: '알렉스',
                speakerEnglish: 'Alex',
                korean: '네! 내일 봐요!',
                romanization: 'ne! naeil bwayo!',
                english: 'Yes! See you tomorrow!',
                words: [
                  { korean: '네', english: 'yes' },
                  { korean: '내일', english: 'tomorrow' },
                  { korean: '봐요', english: 'see you (polite)' },
                ],
                position: 'right',
              },
            ],
          },
        ],
      },
      // ─────────────────────────────────────────────
      // Chapter 2: Kitchen Chaos (Level 2)
      // ─────────────────────────────────────────────
      {
        id: 'cafe-ch2-kitchen-chaos',
        title: 'Kitchen Chaos',
        titleKorean: '주방 대소동',
        level: 2,
        description: 'Alex mixes up orders because of Korean numbers and makes hilarious mistakes.',
        panels: [
          {
            id: 'cafe-ch2-p1',
            imagePrompt: 'cute manga anime webtoon style, a busy Korean cafe morning scene, several customers waiting in line, a foreign barista looking overwhelmed at the register, order tickets piling up, steam from coffee machines, energetic chaotic morning atmosphere',
            narration: '바쁜 아침이 시작됩니다!',
            narrationEnglish: 'A busy morning begins!',
            dialogue: [
              {
                speaker: '손님 1',
                speakerEnglish: 'Customer 1',
                korean: '아메리카노 두 잔이요.',
                romanization: 'amerikano du janijyo.',
                english: 'Two americanos please.',
                words: [
                  { korean: '아메리카노', english: 'americano' },
                  { korean: '두', english: 'two (native Korean)' },
                  { korean: '잔이요', english: 'cups (polite)' },
                ],
                position: 'left',
              },
            ],
          },
          {
            id: 'cafe-ch2-p2',
            imagePrompt: 'cute manga anime webtoon style, a confused foreign barista scratching his head trying to understand Korean numbers, thought bubbles showing different number systems mixing together, comical confusion, numbers floating around his head, cafe counter background',
            dialogue: [
              {
                speaker: '알렉스',
                speakerEnglish: 'Alex (thinking)',
                korean: '두 잔? 이? 이 잔? 아니... 두 잔...',
                romanization: 'du jan? i? i jan? ani... du jan...',
                english: 'Two cups? Two? Two cups? No... two cups...',
                words: [
                  { korean: '두', english: 'two (native)' },
                  { korean: '잔', english: 'cup / glass' },
                  { korean: '이', english: 'two (sino-Korean)' },
                  { korean: '아니', english: 'no' },
                ],
                position: 'center',
              },
            ],
          },
          {
            id: 'cafe-ch2-p3',
            imagePrompt: 'cute manga anime webtoon style, a shocked Korean customer receiving five cups of coffee instead of two, the foreign barista presents them proudly thinking he did well, mountains of coffee cups on the counter, other customers staring in surprise, comical over-the-top scene',
            dialogue: [
              {
                speaker: '알렉스',
                speakerEnglish: 'Alex',
                korean: '여기요! 다섯 잔이요!',
                romanization: 'yeogiyo! daseot janiyo!',
                english: 'Here you go! Five cups!',
                words: [
                  { korean: '여기요', english: 'here (polite)' },
                  { korean: '다섯', english: 'five (native Korean)' },
                  { korean: '잔이요', english: 'cups (polite)' },
                ],
                position: 'right',
              },
              {
                speaker: '손님 1',
                speakerEnglish: 'Customer 1',
                korean: '저... 두 잔이요. 다섯 잔 아니에요!',
                romanization: 'jeo... du janiyo. daseot jan anieyo!',
                english: 'Um... two cups. Not five cups!',
                words: [
                  { korean: '저', english: 'um / excuse me' },
                  { korean: '두', english: 'two (native Korean)' },
                  { korean: '잔이요', english: 'cups (polite)' },
                  { korean: '다섯', english: 'five' },
                  { korean: '잔', english: 'cup' },
                  { korean: '아니에요', english: 'is not (polite)' },
                ],
                position: 'left',
              },
            ],
          },
          {
            id: 'cafe-ch2-p4',
            imagePrompt: 'cute manga anime webtoon style, a foreign barista bringing out a cake to a table where a customer ordered a cookie, the customer looks bewildered at the huge cake, the barista looks proud, hilarious mix-up scene, other customers laughing, warm cafe interior',
            dialogue: [
              {
                speaker: '손님 2',
                speakerEnglish: 'Customer 2',
                korean: '저는 쿠키를 주문했는데... 이건 케이크예요.',
                romanization: 'jeoneun kukireul jumunhaenneunde... igeon keikeuyyeyo.',
                english: 'I ordered a cookie... this is a cake.',
                words: [
                  { korean: '저는', english: 'I (formal topic)' },
                  { korean: '쿠키를', english: 'cookie (object)' },
                  { korean: '주문했는데', english: 'ordered but' },
                  { korean: '이건', english: 'this (topic)' },
                  { korean: '케이크예요', english: 'is cake (polite)' },
                ],
                position: 'left',
              },
              {
                speaker: '알렉스',
                speakerEnglish: 'Alex',
                korean: '아... 쿠키? 케이크 아니에요?',
                romanization: 'a... kuki? keikeu anieyo?',
                english: 'Ah... cookie? Not cake?',
                words: [
                  { korean: '아', english: 'ah' },
                  { korean: '쿠키', english: 'cookie' },
                  { korean: '케이크', english: 'cake' },
                  { korean: '아니에요', english: 'is not (polite)' },
                ],
                position: 'right',
              },
            ],
          },
          {
            id: 'cafe-ch2-p5',
            imagePrompt: 'cute manga anime webtoon style, the cafe owner teaching the foreign barista Korean numbers by holding up fingers, a small whiteboard with numbers written in Korean and Arabic numerals, patient teaching moment, cute educational scene, warm cafe background',
            dialogue: [
              {
                speaker: '사장님',
                speakerEnglish: 'Boss',
                korean: '하나, 둘, 셋, 넷, 다섯. 알겠어요?',
                romanization: 'hana, dul, set, net, daseot. algesseoyo?',
                english: 'One, two, three, four, five. Got it?',
                words: [
                  { korean: '하나', english: 'one (native)' },
                  { korean: '둘', english: 'two (native)' },
                  { korean: '셋', english: 'three (native)' },
                  { korean: '넷', english: 'four (native)' },
                  { korean: '다섯', english: 'five (native)' },
                  { korean: '알겠어요', english: 'got it (polite)' },
                ],
                position: 'left',
              },
              {
                speaker: '알렉스',
                speakerEnglish: 'Alex',
                korean: '하나... 둘... 셋... 어려워요!',
                romanization: 'hana... dul... set... eoryeowoyo!',
                english: 'One... two... three... it\'s hard!',
                words: [
                  { korean: '하나', english: 'one' },
                  { korean: '둘', english: 'two' },
                  { korean: '셋', english: 'three' },
                  { korean: '어려워요', english: 'it\'s difficult (polite)' },
                ],
                position: 'right',
              },
            ],
          },
          {
            id: 'cafe-ch2-p6',
            imagePrompt: 'cute manga anime webtoon style, a foreign barista accidentally giving a customer a hot drink instead of cold, the customer takes a sip and does a dramatic spit take, steam coming from the cup marked ICE, comical manga reaction effects, exaggerated expressions, cafe scene',
            dialogue: [
              {
                speaker: '손님 3',
                speakerEnglish: 'Customer 3',
                korean: '뜨거워요! 저는 차가운 거 시켰어요!',
                romanization: 'tteugeowoyo! jeoneun chagaun geo sikyeosseoyo!',
                english: 'It\'s hot! I ordered a cold one!',
                words: [
                  { korean: '뜨거워요', english: 'it\'s hot (polite)' },
                  { korean: '저는', english: 'I (formal)' },
                  { korean: '차가운', english: 'cold' },
                  { korean: '거', english: 'thing / one' },
                  { korean: '시켰어요', english: 'ordered (polite)' },
                ],
                position: 'left',
              },
              {
                speaker: '알렉스',
                speakerEnglish: 'Alex',
                korean: '미안해요! 다시 만들게요!',
                romanization: 'mianhaeyo! dasi mandeulgeyo!',
                english: 'Sorry! I\'ll make it again!',
                words: [
                  { korean: '미안해요', english: 'sorry (polite)' },
                  { korean: '다시', english: 'again' },
                  { korean: '만들게요', english: 'I\'ll make (polite)' },
                ],
                position: 'right',
              },
            ],
          },
          {
            id: 'cafe-ch2-p7',
            imagePrompt: 'cute manga anime webtoon style, a foreign barista finally getting an order right and the customer smiling approvingly, small victory moment, sparkle effects and achievement stars around the barista, he pumps his fist in celebration, warm happy cafe atmosphere',
            dialogue: [
              {
                speaker: '손님 4',
                speakerEnglish: 'Customer 4',
                korean: '맛있어요! 잘 만들었어요!',
                romanization: 'masisseoyo! jal mandeuresseoyo!',
                english: 'Delicious! You made it well!',
                words: [
                  { korean: '맛있어요', english: 'delicious (polite)' },
                  { korean: '잘', english: 'well' },
                  { korean: '만들었어요', english: 'made (polite)' },
                ],
                position: 'left',
              },
              {
                speaker: '알렉스',
                speakerEnglish: 'Alex',
                korean: '정말요?! 감사합니다!',
                romanization: 'jeongmalyo?! gamsahamnida!',
                english: 'Really?! Thank you!',
                words: [
                  { korean: '정말요', english: 'really (polite)' },
                  { korean: '감사합니다', english: 'thank you (formal)' },
                ],
                position: 'right',
              },
            ],
          },
          {
            id: 'cafe-ch2-p8',
            imagePrompt: 'cute manga anime webtoon style, a foreign barista writing Korean numbers and cafe vocabulary on sticky notes all over the cafe counter and walls, determined studying expression, the cafe owner watches with an amused smile, colorful sticky notes everywhere, warm evening cafe scene',
            dialogue: [
              {
                speaker: '알렉스',
                speakerEnglish: 'Alex',
                korean: '내일은 실수 안 할 거예요!',
                romanization: 'naeireun silsu an hal geoyeyo!',
                english: 'Tomorrow I won\'t make mistakes!',
                words: [
                  { korean: '내일은', english: 'tomorrow (topic)' },
                  { korean: '실수', english: 'mistake' },
                  { korean: '안', english: 'not' },
                  { korean: '할', english: 'will do' },
                  { korean: '거예요', english: 'going to (polite)' },
                ],
                position: 'right',
              },
              {
                speaker: '사장님',
                speakerEnglish: 'Boss',
                korean: '화이팅! 알렉스!',
                romanization: 'hwaiting! allekseu!',
                english: 'Fighting! Alex!',
                words: [
                  { korean: '화이팅', english: 'fighting! (encouragement)' },
                  { korean: '알렉스', english: 'Alex' },
                ],
                position: 'left',
              },
            ],
          },
        ],
      },
      // ─────────────────────────────────────────────
      // Chapter 3: The Regular (Level 3)
      // ─────────────────────────────────────────────
      {
        id: 'cafe-ch3-the-regular',
        title: 'The Regular',
        titleKorean: '단골손님',
        level: 3,
        description: 'A mysterious regular customer always orders the same thing and becomes Alex\'s Korean tutor.',
        panels: [
          {
            id: 'cafe-ch3-p1',
            imagePrompt: 'cute manga anime webtoon style, a stylish Korean young woman with glasses entering a cafe, she has an intellectual cool aura, carrying a stack of books, the foreign barista notices her with curiosity, warm morning light streaming through cafe windows',
            narration: '매일 같은 시간에 오는 손님이 있습니다.',
            narrationEnglish: 'There is a customer who comes at the same time every day.',
            dialogue: [
              {
                speaker: '지은',
                speakerEnglish: 'Jieun',
                korean: '아메리카노 하나, 따뜻한 거요.',
                romanization: 'amerikano hana, ttatteutan geoyo.',
                english: 'One americano, hot please.',
                words: [
                  { korean: '아메리카노', english: 'americano' },
                  { korean: '하나', english: 'one' },
                  { korean: '따뜻한', english: 'hot / warm' },
                  { korean: '거요', english: 'one (polite)' },
                ],
                position: 'left',
              },
            ],
          },
          {
            id: 'cafe-ch3-p2',
            imagePrompt: 'cute manga anime webtoon style, a foreign barista leaning on the counter watching a stylish Korean woman reading at her usual table, curious expression, she reads a book while sipping coffee peacefully, cozy cafe atmosphere, afternoon sunlight, warm tones',
            dialogue: [
              {
                speaker: '알렉스',
                speakerEnglish: 'Alex (thinking)',
                korean: '저 사람은 매일 같은 걸 시켜. 항상 같은 자리에 앉아.',
                romanization: 'jeo sarameun maeil gateun geol sikyeo. hangsang gateun jarie anja.',
                english: 'That person orders the same thing every day. Always sits in the same spot.',
                words: [
                  { korean: '저', english: 'that' },
                  { korean: '사람은', english: 'person (topic)' },
                  { korean: '매일', english: 'every day' },
                  { korean: '같은', english: 'same' },
                  { korean: '걸', english: 'thing (object)' },
                  { korean: '시켜', english: 'orders (casual)' },
                  { korean: '항상', english: 'always' },
                  { korean: '자리에', english: 'in seat / spot' },
                  { korean: '앉아', english: 'sits (casual)' },
                ],
                position: 'center',
              },
            ],
          },
          {
            id: 'cafe-ch3-p3',
            imagePrompt: 'cute manga anime webtoon style, a foreign barista nervously approaching a Korean womans table to deliver coffee, he tries to make conversation, she looks up from her book with a slightly amused expression, warm cafe scene, books on the table',
            dialogue: [
              {
                speaker: '알렉스',
                speakerEnglish: 'Alex',
                korean: '저... 매일 오시네요. 커피 좋아하세요?',
                romanization: 'jeo... maeil osineyo. keopi joahaseyo?',
                english: 'Um... you come every day. Do you like coffee?',
                words: [
                  { korean: '저', english: 'um / excuse me' },
                  { korean: '매일', english: 'every day' },
                  { korean: '오시네요', english: 'you come (honorific)' },
                  { korean: '커피', english: 'coffee' },
                  { korean: '좋아하세요', english: 'do you like (honorific)' },
                ],
                position: 'right',
              },
              {
                speaker: '지은',
                speakerEnglish: 'Jieun',
                korean: '네, 여기 커피가 제일 맛있어서요.',
                romanization: 'ne, yeogi keopi-ga jeil masisseo-seoyo.',
                english: 'Yes, because the coffee here is the best.',
                words: [
                  { korean: '네', english: 'yes' },
                  { korean: '여기', english: 'here' },
                  { korean: '커피가', english: 'coffee (subject)' },
                  { korean: '제일', english: 'the most' },
                  { korean: '맛있어서요', english: 'because it\'s delicious (polite)' },
                ],
                position: 'left',
              },
            ],
          },
          {
            id: 'cafe-ch3-p4',
            imagePrompt: 'cute manga anime webtoon style, a Korean woman looking surprised and then smiling when she notices the foreign barista has written bad Korean on the coffee cup sleeve, the writing is cute but full of mistakes, she holds up the cup with an amused grin, warm lighting',
            dialogue: [
              {
                speaker: '지은',
                speakerEnglish: 'Jieun',
                korean: '이거 뭐라고 쓴 거예요? 한국어 공부해요?',
                romanization: 'igeo mworago sseun geoyeyo? hangugeo gongbuhaeyo?',
                english: 'What did you write here? Are you studying Korean?',
                words: [
                  { korean: '이거', english: 'this' },
                  { korean: '뭐라고', english: 'what (quote)' },
                  { korean: '쓴', english: 'wrote' },
                  { korean: '거예요', english: 'is it (polite)' },
                  { korean: '한국어', english: 'Korean language' },
                  { korean: '공부해요', english: 'studying (polite)' },
                ],
                position: 'left',
              },
              {
                speaker: '알렉스',
                speakerEnglish: 'Alex',
                korean: '네! 맛있는 하루... 라고 쓰고 싶었어요.',
                romanization: 'ne! masinneun haru... rago sseugo sipeosseoyo.',
                english: 'Yes! I wanted to write "delicious day"...',
                words: [
                  { korean: '네', english: 'yes' },
                  { korean: '맛있는', english: 'delicious' },
                  { korean: '하루', english: 'day' },
                  { korean: '라고', english: 'is what' },
                  { korean: '쓰고', english: 'writing' },
                  { korean: '싶었어요', english: 'wanted to (polite)' },
                ],
                position: 'right',
              },
            ],
          },
          {
            id: 'cafe-ch3-p5',
            imagePrompt: 'cute manga anime webtoon style, a Korean woman sitting with the foreign barista during his break at a cafe table, she is teaching him Korean writing in a notebook, he writes carefully, warm patient teaching scene, coffee cups on the table, afternoon sun, heartwarming mentor scene',
            dialogue: [
              {
                speaker: '지은',
                speakerEnglish: 'Jieun',
                korean: '제가 가르쳐 줄게요. 저는 한국어 선생님이에요.',
                romanization: 'jega gareuchyeo julgeyo. jeoneun hangugeo seonsaengnimieyo.',
                english: 'I\'ll teach you. I\'m a Korean language teacher.',
                words: [
                  { korean: '제가', english: 'I (humble subject)' },
                  { korean: '가르쳐', english: 'teach' },
                  { korean: '줄게요', english: 'will give (polite)' },
                  { korean: '저는', english: 'I (formal topic)' },
                  { korean: '한국어', english: 'Korean language' },
                  { korean: '선생님이에요', english: 'am a teacher (polite)' },
                ],
                position: 'left',
              },
              {
                speaker: '알렉스',
                speakerEnglish: 'Alex',
                korean: '정말요?! 너무 감사합니다!',
                romanization: 'jeongmalyo?! neomu gamsahamnida!',
                english: 'Really?! Thank you so much!',
                words: [
                  { korean: '정말요', english: 'really (polite)' },
                  { korean: '너무', english: 'so much / very' },
                  { korean: '감사합니다', english: 'thank you (formal)' },
                ],
                position: 'right',
              },
            ],
          },
          {
            id: 'cafe-ch3-p6',
            imagePrompt: 'cute manga anime webtoon style, a montage panel showing a foreign barista improving his Korean over several days, small scenes of him successfully taking orders and customers smiling, Korean vocabulary flashcards on the counter, progress and improvement visual, warm bright colors',
            narration: '알렉스의 한국어가 점점 좋아집니다!',
            narrationEnglish: 'Alex\'s Korean is getting better and better!',
            dialogue: [
              {
                speaker: '알렉스',
                speakerEnglish: 'Alex',
                korean: '어서 오세요! 뭐 드릴까요?',
                romanization: 'eoseo oseyo! mwo deurilkkayo?',
                english: 'Welcome! What can I get you?',
                words: [
                  { korean: '어서', english: 'quickly / welcome' },
                  { korean: '오세요', english: 'come (honorific)' },
                  { korean: '뭐', english: 'what' },
                  { korean: '드릴까요', english: 'shall I give you (humble)' },
                ],
                position: 'right',
              },
            ],
          },
          {
            id: 'cafe-ch3-p7',
            imagePrompt: 'cute manga anime webtoon style, a foreign barista writing perfect Korean on a coffee cup and proudly showing it to the Korean woman teacher, she reads it and is genuinely impressed, gives a thumbs up, both smiling warmly, beautiful handwriting on the cup, cafe scene',
            dialogue: [
              {
                speaker: '지은',
                speakerEnglish: 'Jieun',
                korean: '와, 많이 늘었어요! 글씨도 예뻐졌어요.',
                romanization: 'wa, mani neureosseoyo! geulssido yeppeo-jyeosseoyo.',
                english: 'Wow, you\'ve improved a lot! Your handwriting got pretty too.',
                words: [
                  { korean: '와', english: 'wow' },
                  { korean: '많이', english: 'a lot' },
                  { korean: '늘었어요', english: 'improved (polite)' },
                  { korean: '글씨도', english: 'handwriting too' },
                  { korean: '예뻐졌어요', english: 'became pretty (polite)' },
                ],
                position: 'left',
              },
              {
                speaker: '알렉스',
                speakerEnglish: 'Alex',
                korean: '지은 씨 덕분이에요!',
                romanization: 'jieun ssi deokbun-ieyo!',
                english: 'It\'s thanks to you, Jieun!',
                words: [
                  { korean: '지은', english: 'Jieun' },
                  { korean: '씨', english: 'Mr/Ms (polite)' },
                  { korean: '덕분이에요', english: 'it\'s thanks to (polite)' },
                ],
                position: 'right',
              },
            ],
          },
          {
            id: 'cafe-ch3-p8',
            imagePrompt: 'cute manga anime webtoon style, end of chapter scene, a Korean woman leaving the cafe waving goodbye, the foreign barista waves from behind the counter, a sticky note on the table reads see you tomorrow in Korean, warm evening golden light, friendship established, heartwarming farewell',
            dialogue: [
              {
                speaker: '지은',
                speakerEnglish: 'Jieun',
                korean: '내일도 올 거예요. 커피하고 한국어 수업!',
                romanization: 'naeildo ol geoyeyo. keopi-hago hangugeo sueop!',
                english: 'I\'ll come tomorrow too. Coffee and Korean class!',
                words: [
                  { korean: '내일도', english: 'tomorrow too' },
                  { korean: '올', english: 'will come' },
                  { korean: '거예요', english: 'going to (polite)' },
                  { korean: '커피하고', english: 'coffee and' },
                  { korean: '한국어', english: 'Korean language' },
                  { korean: '수업', english: 'class / lesson' },
                ],
                position: 'left',
              },
              {
                speaker: '알렉스',
                speakerEnglish: 'Alex',
                korean: '네! 기다릴게요!',
                romanization: 'ne! gidarilgeyo!',
                english: 'Yes! I\'ll be waiting!',
                words: [
                  { korean: '네', english: 'yes' },
                  { korean: '기다릴게요', english: 'I\'ll wait (polite)' },
                ],
                position: 'right',
              },
            ],
          },
        ],
      },
      // ─────────────────────────────────────────────
      // Chapter 4: The Competition (Level 4)
      // ─────────────────────────────────────────────
      {
        id: 'cafe-ch4-competition',
        title: 'The Competition',
        titleKorean: '대회',
        level: 4,
        description: 'The cafe enters a latte art competition and Alex must learn cafe vocabulary fast.',
        panels: [
          {
            id: 'cafe-ch4-p1',
            imagePrompt: 'cute manga anime webtoon style, the cafe owner excitedly showing a competition flyer to the foreign barista, the flyer shows a latte art contest poster with prizes, both look at it with different reactions - the owner excited and the barista nervous, cafe counter scene',
            narration: '사장님이 대회 소식을 가져왔습니다.',
            narrationEnglish: 'The boss brought news about a competition.',
            dialogue: [
              {
                speaker: '사장님',
                speakerEnglish: 'Boss',
                korean: '알렉스! 라떼 아트 대회가 있어요! 우리 카페가 참가할 거예요!',
                romanization: 'allekseu! latte ateu daehoe-ga isseoyo! uri kape-ga chamgahal geoyeyo!',
                english: 'Alex! There\'s a latte art competition! Our cafe is going to enter!',
                words: [
                  { korean: '라떼', english: 'latte' },
                  { korean: '아트', english: 'art' },
                  { korean: '대회가', english: 'competition (subject)' },
                  { korean: '있어요', english: 'there is (polite)' },
                  { korean: '우리', english: 'our' },
                  { korean: '카페가', english: 'cafe (subject)' },
                  { korean: '참가할', english: 'will participate' },
                  { korean: '거예요', english: 'going to (polite)' },
                ],
                position: 'left',
              },
            ],
          },
          {
            id: 'cafe-ch4-p2',
            imagePrompt: 'cute manga anime webtoon style, a foreign barista looking panicked while holding a milk pitcher, imagining himself failing at a competition stage, comical fear fantasy in a thought bubble, sweat drops flying off his face, cafe kitchen background',
            dialogue: [
              {
                speaker: '알렉스',
                speakerEnglish: 'Alex',
                korean: '저요?! 아직 라떼 아트를 잘 못 해요!',
                romanization: 'jeoyo?! ajik latte ateu-reul jal mot haeyo!',
                english: 'Me?! I still can\'t do latte art well!',
                words: [
                  { korean: '저요', english: 'me? (polite)' },
                  { korean: '아직', english: 'still / yet' },
                  { korean: '라떼', english: 'latte' },
                  { korean: '아트를', english: 'art (object)' },
                  { korean: '잘', english: 'well' },
                  { korean: '못', english: 'cannot' },
                  { korean: '해요', english: 'do (polite)' },
                ],
                position: 'right',
              },
              {
                speaker: '사장님',
                speakerEnglish: 'Boss',
                korean: '걱정하지 마세요. 연습하면 돼요!',
                romanization: 'geokjeonghaji maseyo. yeonseup-hamyeon dwaeyo!',
                english: 'Don\'t worry. Just practice!',
                words: [
                  { korean: '걱정하지', english: 'worrying' },
                  { korean: '마세요', english: 'don\'t (polite)' },
                  { korean: '연습하면', english: 'if you practice' },
                  { korean: '돼요', english: 'it\'s okay / will work (polite)' },
                ],
                position: 'left',
              },
            ],
          },
          {
            id: 'cafe-ch4-p3',
            imagePrompt: 'cute manga anime webtoon style, a Korean woman teacher (Jieun) arriving at the cafe with cafe vocabulary flashcards, she sits down to help the foreign barista practice, flashcards visible with words like milk foam and pour, determined study session, warm cafe afternoon',
            dialogue: [
              {
                speaker: '지은',
                speakerEnglish: 'Jieun',
                korean: '대회에 필요한 단어를 가르쳐 줄게요.',
                romanization: 'daehoe-e pilyohan daneoreul gareuchyeo julgeyo.',
                english: 'I\'ll teach you the words you need for the competition.',
                words: [
                  { korean: '대회에', english: 'for competition' },
                  { korean: '필요한', english: 'needed / necessary' },
                  { korean: '단어를', english: 'words (object)' },
                  { korean: '가르쳐', english: 'teach' },
                  { korean: '줄게요', english: 'will give (polite)' },
                ],
                position: 'left',
              },
              {
                speaker: '알렉스',
                speakerEnglish: 'Alex',
                korean: '지은 씨, 정말 고마워요. 열심히 할게요!',
                romanization: 'jieun ssi, jeongmal gomawoyo. yeolsimhi halgeyo!',
                english: 'Jieun, really thank you. I\'ll work hard!',
                words: [
                  { korean: '지은', english: 'Jieun' },
                  { korean: '씨', english: 'Mr/Ms (polite)' },
                  { korean: '정말', english: 'really' },
                  { korean: '고마워요', english: 'thank you (polite)' },
                  { korean: '열심히', english: 'hard / diligently' },
                  { korean: '할게요', english: 'I\'ll do (polite)' },
                ],
                position: 'right',
              },
            ],
          },
          {
            id: 'cafe-ch4-p4',
            imagePrompt: 'cute manga anime webtoon style, a training montage of a foreign barista practicing latte art late at night, cups of failed attempts lined up on the counter, progressively getting better, the last cup shows a decent heart shape, determination and sweat, dim late night cafe lighting, inspirational mood',
            narration: '알렉스는 밤늦게까지 연습합니다.',
            narrationEnglish: 'Alex practices until late at night.',
            dialogue: [
              {
                speaker: '알렉스',
                speakerEnglish: 'Alex',
                korean: '한 번 더... 포기하지 않을 거야.',
                romanization: 'han beon deo... pogihaji aneul geoya.',
                english: 'One more time... I won\'t give up.',
                words: [
                  { korean: '한', english: 'one' },
                  { korean: '번', english: 'time / turn' },
                  { korean: '더', english: 'more' },
                  { korean: '포기하지', english: 'giving up' },
                  { korean: '않을', english: 'will not' },
                  { korean: '거야', english: 'going to (casual)' },
                ],
                position: 'center',
              },
            ],
          },
          {
            id: 'cafe-ch4-p5',
            imagePrompt: 'cute manga anime webtoon style, the day of the latte art competition, a large venue with many cafe teams, banners and judges table, the foreign barista in his cafe apron standing at his station looking nervous but ready, the boss and Jieun cheering from the audience, bright competition hall',
            narration: '드디어 대회 날입니다!',
            narrationEnglish: 'Finally, it\'s competition day!',
            dialogue: [
              {
                speaker: '사장님',
                speakerEnglish: 'Boss',
                korean: '알렉스! 할 수 있어요! 화이팅!',
                romanization: 'allekseu! hal su isseoyo! hwaiting!',
                english: 'Alex! You can do it! Fighting!',
                words: [
                  { korean: '알렉스', english: 'Alex' },
                  { korean: '할', english: 'to do' },
                  { korean: '수', english: 'ability' },
                  { korean: '있어요', english: 'have / can (polite)' },
                  { korean: '화이팅', english: 'fighting! (encouragement)' },
                ],
                position: 'left',
              },
              {
                speaker: '지은',
                speakerEnglish: 'Jieun',
                korean: '연습 많이 했으니까 잘 될 거예요!',
                romanization: 'yeonseup mani haesseun-ikka jal doel geoyeyo!',
                english: 'You practiced a lot so it will go well!',
                words: [
                  { korean: '연습', english: 'practice' },
                  { korean: '많이', english: 'a lot' },
                  { korean: '했으니까', english: 'because you did' },
                  { korean: '잘', english: 'well' },
                  { korean: '될', english: 'will become' },
                  { korean: '거예요', english: 'going to (polite)' },
                ],
                position: 'right',
              },
            ],
          },
          {
            id: 'cafe-ch4-p6',
            imagePrompt: 'cute manga anime webtoon style, dramatic close-up of a foreign barista pouring milk into a latte cup with intense concentration, beautiful white milk swirl forming a pattern, steam rising, manga focus lines showing concentration, detailed hands and cup, competition station',
            dialogue: [
              {
                speaker: '알렉스',
                speakerEnglish: 'Alex (thinking)',
                korean: '천천히... 우유를 부어... 집중해...',
                romanization: 'cheoncheonhi... uyureul bueo... jipjunghae...',
                english: 'Slowly... pour the milk... focus...',
                words: [
                  { korean: '천천히', english: 'slowly' },
                  { korean: '우유를', english: 'milk (object)' },
                  { korean: '부어', english: 'pour (casual)' },
                  { korean: '집중해', english: 'focus (casual)' },
                ],
                position: 'center',
              },
            ],
          },
          {
            id: 'cafe-ch4-p7',
            imagePrompt: 'cute manga anime webtoon style, judges examining a latte art cup with a beautiful Korean-style flower design, they look impressed and nod approvingly, the foreign barista watches nervously from behind, elegant competition judging scene, dramatic tension',
            dialogue: [
              {
                speaker: '심사위원',
                speakerEnglish: 'Judge',
                korean: '이 디자인은 한국의 무궁화네요. 독특하고 아름다워요.',
                romanization: 'i dijain-eun hangugui mugunghwa-neyo. doktukhago areumdawoyo.',
                english: 'This design is a Korean hibiscus. It\'s unique and beautiful.',
                words: [
                  { korean: '이', english: 'this' },
                  { korean: '디자인은', english: 'design (topic)' },
                  { korean: '한국의', english: 'Korean / of Korea' },
                  { korean: '무궁화네요', english: 'is hibiscus (observation)' },
                  { korean: '독특하고', english: 'unique and' },
                  { korean: '아름다워요', english: 'beautiful (polite)' },
                ],
                position: 'left',
              },
            ],
          },
          {
            id: 'cafe-ch4-p8',
            imagePrompt: 'cute manga anime webtoon style, the competition awards ceremony, the foreign barista holding a third place trophy with tears of joy, the cafe owner hugging him, the Korean woman friend clapping and crying happy tears, confetti falling, other competitors applauding, triumphant emotional celebration scene',
            dialogue: [
              {
                speaker: '알렉스',
                speakerEnglish: 'Alex',
                korean: '우리가 3등이에요! 이건 다 여러분 덕분이에요!',
                romanization: 'uriga samdeungieyo! igeon da yeoreobun deokbun-ieyo!',
                english: 'We got third place! This is all thanks to everyone!',
                words: [
                  { korean: '우리가', english: 'we (subject)' },
                  { korean: '3등이에요', english: 'are third place (polite)' },
                  { korean: '이건', english: 'this (topic)' },
                  { korean: '다', english: 'all' },
                  { korean: '여러분', english: 'everyone' },
                  { korean: '덕분이에요', english: 'thanks to (polite)' },
                ],
                position: 'right',
              },
              {
                speaker: '사장님',
                speakerEnglish: 'Boss',
                korean: '알렉스, 정말 자랑스러워요! 우리 카페의 자랑이에요!',
                romanization: 'allekseu, jeongmal jarangseureowoyo! uri kape-ui jarangieyo!',
                english: 'Alex, I\'m so proud! You\'re our cafe\'s pride!',
                words: [
                  { korean: '알렉스', english: 'Alex' },
                  { korean: '정말', english: 'really' },
                  { korean: '자랑스러워요', english: 'proud (polite)' },
                  { korean: '우리', english: 'our' },
                  { korean: '카페의', english: 'cafe\'s' },
                  { korean: '자랑이에요', english: 'pride (polite)' },
                ],
                position: 'left',
              },
            ],
          },
        ],
      },
    ],
  },
  // ═══════════════════════════════════════════════
  // SERIES 3: The Detective (kept from original)
  // ═══════════════════════════════════════════════
  {
    id: 'the-detective',
    title: 'The Detective',
    titleKorean: '탐정',
    description: 'A student detective solves mysteries at school. Follow Minsu as he uncovers clues and tracks down culprits in dark, moody adventures.',
    genre: 'Mystery',
    chapters: [
      {
        id: 'det-ch1-missing-notebook',
        title: 'The Missing Notebook',
        titleKorean: '사라진 노트',
        level: 2,
        description: 'A notebook vanishes from the classroom. Minsu begins his investigation.',
        panels: [
          {
            id: 'det-ch1-p1',
            imagePrompt: 'dark moody manga style illustration of a serious Korean teenage boy detective sitting at a school desk, looking troubled, dark shadows, noir atmosphere, empty desk with a missing item, school classroom at dusk',
            dialogue: [
              {
                speaker: '민수',
                speakerEnglish: 'Minsu',
                korean: '이상해... 노트가 없어졌어.',
                romanization: 'isanghae... noteuga eopseo-jyeosseo.',
                english: 'Strange... the notebook disappeared.',
                words: [
                  { korean: '이상해', english: 'strange' },
                  { korean: '노트가', english: 'notebook (subject)' },
                  { korean: '없어졌어', english: 'disappeared' },
                ],
                position: 'center',
              },
            ],
          },
          {
            id: 'det-ch1-p2',
            imagePrompt: 'dark moody manga style illustration of a Korean teenage boy detective asking a female classmate a question in a dim school hallway, suspicious atmosphere, dramatic lighting from window, film noir style',
            dialogue: [
              {
                speaker: '민수',
                speakerEnglish: 'Minsu',
                korean: '혹시 내 노트 봤어?',
                romanization: 'hoksi nae noteu bwasseo?',
                english: 'Did you happen to see my notebook?',
                words: [
                  { korean: '혹시', english: 'by any chance' },
                  { korean: '내', english: 'my' },
                  { korean: '노트', english: 'notebook' },
                  { korean: '봤어', english: 'did you see' },
                ],
                position: 'left',
              },
              {
                speaker: '지영',
                speakerEnglish: 'Jiyoung',
                korean: '아니, 못 봤어. 언제 잃어버렸어?',
                romanization: 'ani, mot bwasseo. eonje ireo-beoryeosseo?',
                english: "No, I didn't. When did you lose it?",
                words: [
                  { korean: '아니', english: 'no' },
                  { korean: '못', english: 'could not' },
                  { korean: '봤어', english: 'saw' },
                  { korean: '언제', english: 'when' },
                  { korean: '잃어버렸어', english: 'lost' },
                ],
                position: 'right',
              },
            ],
          },
          {
            id: 'det-ch1-p3',
            imagePrompt: 'dark moody manga style illustration of two Korean students discovering a mysterious piece of paper on the floor of a dark classroom, dramatic close-up of the clue, spotlight effect, detective mystery atmosphere',
            dialogue: [
              {
                speaker: '민수',
                speakerEnglish: 'Minsu',
                korean: '여기 봐. 이 종이가 뭐지?',
                romanization: 'yeogi bwa. i jongiga mwoji?',
                english: "Look here. What's this paper?",
                words: [
                  { korean: '여기', english: 'here' },
                  { korean: '봐', english: 'look' },
                  { korean: '이', english: 'this' },
                  { korean: '종이가', english: 'paper (subject)' },
                  { korean: '뭐지', english: 'what is it' },
                ],
                position: 'left',
              },
              {
                speaker: '지영',
                speakerEnglish: 'Jiyoung',
                korean: '글씨가 있어! 누가 쓴 거야?',
                romanization: 'geulssiga isseo! nuga sseun geoya?',
                english: "There's writing! Who wrote it?",
                words: [
                  { korean: '글씨가', english: 'writing (subject)' },
                  { korean: '있어', english: 'there is' },
                  { korean: '누가', english: 'who (subject)' },
                  { korean: '쓴', english: 'wrote' },
                  { korean: '거야', english: 'is it (casual)' },
                ],
                position: 'right',
              },
            ],
          },
          {
            id: 'det-ch1-p4',
            imagePrompt: 'dark moody manga style illustration of a determined Korean teenage boy detective standing dramatically in a dark school corridor, fist clenched, intense eyes, shadows stretching behind him, cliffhanger scene',
            dialogue: [
              {
                speaker: '민수',
                speakerEnglish: 'Minsu',
                korean: '범인을 찾을 거야.',
                romanization: 'beomineul chajeul geoya.',
                english: 'I will find the culprit.',
                words: [
                  { korean: '범인을', english: 'culprit (object)' },
                  { korean: '찾을', english: 'will find' },
                  { korean: '거야', english: 'going to (casual)' },
                ],
                position: 'center',
              },
            ],
          },
        ],
      },
      // ─────────────────────────────────────────────
      // Chapter 2: The Secret Message (Level 2)
      // ─────────────────────────────────────────────
      {
        id: 'det-ch2-secret-message',
        title: 'The Secret Message',
        titleKorean: '비밀 메시지',
        level: 2,
        description: 'Minsu follows the clue from the mysterious paper and discovers a hidden message.',
        panels: [
          {
            id: 'det-ch2-p1',
            imagePrompt: 'dark moody manga style illustration of a Korean teenage boy detective examining a crumpled piece of paper under a desk lamp in a dim library, dramatic shadows, magnifying glass, stacks of books around him, noir detective atmosphere',
            narration: '민수는 단서를 조사합니다...',
            narrationEnglish: 'Minsu investigates the clue...',
            dialogue: [
              {
                speaker: '민수',
                speakerEnglish: 'Minsu',
                korean: '이 종이에 숫자가 있어.',
                romanization: 'i jongie sutjaga isseo.',
                english: 'There are numbers on this paper.',
                words: [
                  { korean: '이', english: 'this' },
                  { korean: '종이에', english: 'on paper' },
                  { korean: '숫자가', english: 'numbers (subject)' },
                  { korean: '있어', english: 'there are' },
                ],
                position: 'center',
              },
            ],
          },
          {
            id: 'det-ch2-p2',
            imagePrompt: 'dark moody manga style illustration of a Korean boy and girl whispering in a school library, bookshelves towering behind them, dim overhead lighting, mystery atmosphere, one points at a book',
            dialogue: [
              {
                speaker: '지영',
                speakerEnglish: 'Jiyoung',
                korean: '이 숫자는 뭘까? 비밀번호?',
                romanization: 'i sutjaneun mwolkka? bimilbeonho?',
                english: 'What are these numbers? A password?',
                words: [
                  { korean: '이', english: 'this' },
                  { korean: '숫자는', english: 'numbers (topic)' },
                  { korean: '뭘까', english: 'what could it be' },
                  { korean: '비밀번호', english: 'password' },
                ],
                position: 'right',
              },
              {
                speaker: '민수',
                speakerEnglish: 'Minsu',
                korean: '아니, 사물함 번호 같아.',
                romanization: 'ani, samulham beonho gata.',
                english: 'No, it looks like a locker number.',
                words: [
                  { korean: '아니', english: 'no' },
                  { korean: '사물함', english: 'locker' },
                  { korean: '번호', english: 'number' },
                  { korean: '같아', english: 'it seems like' },
                ],
                position: 'left',
              },
            ],
          },
          {
            id: 'det-ch2-p3',
            imagePrompt: 'dark moody manga style illustration of two Korean students walking through a dark empty school hallway toward rows of lockers, long dramatic shadows, overhead fluorescent light flickering, tension and suspense',
            narration: '두 사람은 사물함으로 갑니다.',
            narrationEnglish: 'The two head to the lockers.',
            dialogue: [
              {
                speaker: '지영',
                speakerEnglish: 'Jiyoung',
                korean: '조심해. 누가 올 수도 있어.',
                romanization: 'josimhae. nuga ol sudo isseo.',
                english: 'Be careful. Someone might come.',
                words: [
                  { korean: '조심해', english: 'be careful' },
                  { korean: '누가', english: 'someone' },
                  { korean: '올', english: 'come' },
                  { korean: '수도', english: 'might' },
                  { korean: '있어', english: 'could' },
                ],
                position: 'right',
              },
            ],
          },
          {
            id: 'det-ch2-p4',
            imagePrompt: 'dark moody manga style illustration close-up of a Korean boy opening a school locker with trembling hands, dramatic spotlight on the locker, dark surroundings, suspenseful atmosphere, sweat drops',
            dialogue: [
              {
                speaker: '민수',
                speakerEnglish: 'Minsu',
                korean: '이 사물함이야. 열어볼게.',
                romanization: 'i samulhamiya. yeoreo bolge.',
                english: "This is the locker. I'll open it.",
                words: [
                  { korean: '이', english: 'this' },
                  { korean: '사물함이야', english: 'is the locker' },
                  { korean: '열어볼게', english: "I'll try opening it" },
                ],
                position: 'left',
              },
            ],
          },
          {
            id: 'det-ch2-p5',
            imagePrompt: 'dark moody manga style illustration of the inside of a school locker revealing a folded note with Korean writing, dramatic close-up with spotlight effect, dust particles in the light beam, mysterious atmosphere',
            dialogue: [
              {
                speaker: '민수',
                speakerEnglish: 'Minsu',
                korean: '편지가 있어! 누가 넣었을까?',
                romanization: 'pyeonjiga isseo! nuga neoheosseulkka?',
                english: "There's a letter! Who put it here?",
                words: [
                  { korean: '편지가', english: 'letter (subject)' },
                  { korean: '있어', english: 'there is' },
                  { korean: '누가', english: 'who' },
                  { korean: '넣었을까', english: 'could have put' },
                ],
                position: 'left',
              },
              {
                speaker: '지영',
                speakerEnglish: 'Jiyoung',
                korean: '빨리 읽어봐!',
                romanization: 'ppalli ilgeobwa!',
                english: 'Quickly, read it!',
                words: [
                  { korean: '빨리', english: 'quickly' },
                  { korean: '읽어봐', english: 'try reading it' },
                ],
                position: 'right',
              },
            ],
          },
          {
            id: 'det-ch2-p6',
            imagePrompt: 'dark moody manga style illustration of a Korean teenage boy reading a mysterious handwritten note with wide shocked eyes, dramatic lighting on his face from below, letter visible with Korean text, dark background, emotional shock',
            dialogue: [
              {
                speaker: '민수',
                speakerEnglish: 'Minsu',
                korean: '"도서관 3층에서 기다려." 이게 뭐야?',
                romanization: '"doseogwan 3cheung-eseo gidaryeo." ige mwoya?',
                english: '"Wait on the 3rd floor of the library." What is this?',
                words: [
                  { korean: '도서관', english: 'library' },
                  { korean: '3층에서', english: 'on the 3rd floor' },
                  { korean: '기다려', english: 'wait' },
                  { korean: '이게', english: 'this (subject)' },
                  { korean: '뭐야', english: 'what is it' },
                ],
                position: 'center',
              },
            ],
          },
          {
            id: 'det-ch2-p7',
            imagePrompt: 'dark moody manga style illustration of two Korean students looking at each other with determined expressions in a dark school hallway, dramatic split panel composition, one has clenched fist, the other nods seriously, noir atmosphere',
            dialogue: [
              {
                speaker: '지영',
                speakerEnglish: 'Jiyoung',
                korean: '함정일 수도 있어. 위험해.',
                romanization: 'hamjeongil sudo isseo. wiheomhae.',
                english: 'It could be a trap. It\'s dangerous.',
                words: [
                  { korean: '함정일', english: 'a trap (might be)' },
                  { korean: '수도', english: 'could' },
                  { korean: '있어', english: 'be' },
                  { korean: '위험해', english: "it's dangerous" },
                ],
                position: 'right',
              },
              {
                speaker: '민수',
                speakerEnglish: 'Minsu',
                korean: '괜찮아. 같이 가자.',
                romanization: 'gwaenchana. gachi gaja.',
                english: "It's okay. Let's go together.",
                words: [
                  { korean: '괜찮아', english: "it's okay" },
                  { korean: '같이', english: 'together' },
                  { korean: '가자', english: "let's go" },
                ],
                position: 'left',
              },
            ],
          },
          {
            id: 'det-ch2-p8',
            imagePrompt: 'dark moody manga style illustration of two Korean students climbing dark stairs in a library at night, dramatic upward angle, shadows stretching, moonlight through tall windows, sense of mystery and anticipation, cliffhanger scene',
            narration: '두 사람은 도서관 3층으로 향합니다...',
            narrationEnglish: 'The two head to the 3rd floor of the library...',
            dialogue: [
              {
                speaker: '민수',
                speakerEnglish: 'Minsu (thinking)',
                korean: '진실을 알게 될까?',
                romanization: 'jinsireul alge doelkka?',
                english: 'Will I find out the truth?',
                words: [
                  { korean: '진실을', english: 'truth (object)' },
                  { korean: '알게', english: 'come to know' },
                  { korean: '될까', english: 'will it happen' },
                ],
                position: 'center',
              },
            ],
          },
        ],
      },
      // ─────────────────────────────────────────────
      // Chapter 3: The Library Trap (Level 3)
      // ─────────────────────────────────────────────
      {
        id: 'det-ch3-library-trap',
        title: 'The Library Trap',
        titleKorean: '도서관의 함정',
        level: 3,
        description: 'Minsu and Jiyoung go to the library at night and discover who took the notebook — and why.',
        panels: [
          {
            id: 'det-ch3-p1',
            imagePrompt: 'dark moody manga style illustration of two Korean students sneaking into a dark school library at night, tall bookshelves casting long shadows, moonlight streaming through large windows, suspenseful atmosphere, noir lighting',
            narration: '밤, 민수와 지영은 도서관 3층에 도착합니다.',
            narrationEnglish: 'At night, Minsu and Jiyoung arrive at the 3rd floor of the library.',
            dialogue: [
              {
                speaker: '민수',
                speakerEnglish: 'Minsu',
                korean: '조용해. 아무도 없는 것 같아.',
                romanization: 'joyonghae. amudo eomneun geot gata.',
                english: 'It\'s quiet. Seems like nobody is here.',
                words: [
                  { korean: '조용해', english: 'it\'s quiet' },
                  { korean: '아무도', english: 'nobody' },
                  { korean: '없는', english: 'not existing' },
                  { korean: '것 같아', english: 'it seems like' },
                ],
                position: 'left',
              },
            ],
          },
          {
            id: 'det-ch3-p2',
            imagePrompt: 'dark moody manga style illustration of a Korean girl spotting a notebook on a reading table in a dark library, dramatic spotlight on the notebook, dust particles in light beam, mysterious atmosphere, tension',
            dialogue: [
              {
                speaker: '지영',
                speakerEnglish: 'Jiyoung',
                korean: '민수야, 저기 봐! 노트가 있어!',
                romanization: 'minsuya, jeogi bwa! noteuga isseo!',
                english: 'Minsu, look over there! The notebook is there!',
                words: [
                  { korean: '저기', english: 'over there' },
                  { korean: '봐', english: 'look' },
                  { korean: '노트가', english: 'notebook (subject)' },
                  { korean: '있어', english: 'there is' },
                ],
                position: 'right',
              },
              {
                speaker: '민수',
                speakerEnglish: 'Minsu',
                korean: '너무 쉽잖아. 이건 함정일 수도 있어.',
                romanization: 'neomu swipjanha. igeon hamjeongil sudo isseo.',
                english: 'It\'s too easy. This could be a trap.',
                words: [
                  { korean: '너무', english: 'too' },
                  { korean: '쉽잖아', english: 'it\'s easy, right' },
                  { korean: '이건', english: 'this is' },
                  { korean: '함정', english: 'trap' },
                ],
                position: 'left',
              },
            ],
          },
          {
            id: 'det-ch3-p3',
            imagePrompt: 'dark moody manga style illustration of a shadowy figure stepping out from behind a bookshelf in a dark library, dramatic reveal moment, one hand visible, dim overhead light, two students turning around in surprise, intense suspense',
            dialogue: [
              {
                speaker: '???',
                speakerEnglish: 'Unknown voice',
                korean: '드디어 왔구나.',
                romanization: 'deudieo watguna.',
                english: 'You finally came.',
                words: [
                  { korean: '드디어', english: 'finally' },
                  { korean: '왔구나', english: 'you came (realization)' },
                ],
                position: 'center',
              },
            ],
          },
          {
            id: 'det-ch3-p4',
            imagePrompt: 'dark moody manga style illustration revealing a Korean male student classmate stepping into the light in a library, he has a guilty but relieved expression, school uniform slightly disheveled, dramatic side lighting from window',
            dialogue: [
              {
                speaker: '민수',
                speakerEnglish: 'Minsu',
                korean: '태호?! 네가 노트를 가져간 거야?',
                romanization: 'taeho?! nega notereul gajyeogan geoya?',
                english: 'Taeho?! You took the notebook?',
                words: [
                  { korean: '네가', english: 'you (subject)' },
                  { korean: '노트를', english: 'notebook (object)' },
                  { korean: '가져간', english: 'took' },
                  { korean: '거야', english: 'is it (casual)' },
                ],
                position: 'left',
              },
              {
                speaker: '태호',
                speakerEnglish: 'Taeho',
                korean: '미안해. 설명할게.',
                romanization: 'mianhae. seolmyeonghalge.',
                english: 'I\'m sorry. Let me explain.',
                words: [
                  { korean: '미안해', english: 'I\'m sorry' },
                  { korean: '설명할게', english: 'I\'ll explain' },
                ],
                position: 'right',
              },
            ],
          },
          {
            id: 'det-ch3-p5',
            imagePrompt: 'dark moody manga style illustration of a Korean boy confessing to two classmates in a moonlit library, sitting at a table, head slightly bowed, emotional atmosphere, soft warm lighting contrasting dark surroundings, empathetic scene',
            dialogue: [
              {
                speaker: '태호',
                speakerEnglish: 'Taeho',
                korean: '시험 답이 필요했어. 집에 문제가 있어서...',
                romanization: 'siheom dabi piryohaesseo. jibe munjega isseoseo...',
                english: 'I needed the test answers. I have problems at home...',
                words: [
                  { korean: '시험', english: 'test/exam' },
                  { korean: '답', english: 'answer' },
                  { korean: '필요했어', english: 'needed' },
                  { korean: '집에', english: 'at home' },
                  { korean: '문제가', english: 'problems (subject)' },
                ],
                position: 'right',
              },
            ],
          },
          {
            id: 'det-ch3-p6',
            imagePrompt: 'dark moody manga style illustration of a Korean boy detective listening with a serious but compassionate expression, hand on chin thinking, library background with moonlight, thoughtful empathetic atmosphere',
            dialogue: [
              {
                speaker: '민수',
                speakerEnglish: 'Minsu',
                korean: '그래서 내 노트를... 그런데 왜 편지를 남겼어?',
                romanization: 'geuraeseo nae notereul... geureonde wae pyeonjireul namgyeosseo?',
                english: 'So you took my notebook... But why did you leave the letter?',
                words: [
                  { korean: '그래서', english: 'so / therefore' },
                  { korean: '그런데', english: 'but / however' },
                  { korean: '왜', english: 'why' },
                  { korean: '편지를', english: 'letter (object)' },
                  { korean: '남겼어', english: 'left behind' },
                ],
                position: 'left',
              },
              {
                speaker: '태호',
                speakerEnglish: 'Taeho',
                korean: '양심에 걸렸어. 돌려주고 싶었어.',
                romanization: 'yangsime geollyeosseo. dollyeojugo sipeosseo.',
                english: 'My conscience bothered me. I wanted to return it.',
                words: [
                  { korean: '양심에', english: 'conscience' },
                  { korean: '걸렸어', english: 'was bothered' },
                  { korean: '돌려주고', english: 'return / give back' },
                  { korean: '싶었어', english: 'wanted to' },
                ],
                position: 'right',
              },
            ],
          },
          {
            id: 'det-ch3-p7',
            imagePrompt: 'dark moody manga style illustration of a Korean girl looking sympathetically at a distressed classmate in a library, warm moonlight softening the dark atmosphere, emotional moment, compassion visible in her expression',
            dialogue: [
              {
                speaker: '지영',
                speakerEnglish: 'Jiyoung',
                korean: '태호야, 힘들었구나. 우리가 도와줄 수 있어.',
                romanization: 'taehoya, himdeureotkuna. uriga dowajul su isseo.',
                english: 'Taeho, it must have been hard. We can help you.',
                words: [
                  { korean: '힘들었구나', english: 'it must have been hard' },
                  { korean: '우리가', english: 'we (subject)' },
                  { korean: '도와줄', english: 'help' },
                  { korean: '수 있어', english: 'can / are able to' },
                ],
                position: 'right',
              },
            ],
          },
          {
            id: 'det-ch3-p8',
            imagePrompt: 'dark moody manga style illustration of a Korean boy detective offering a handshake to a guilty classmate in a moonlit library, determined expression, gesture of understanding, tension resolving but mystery still lingers, dramatic composition',
            dialogue: [
              {
                speaker: '민수',
                speakerEnglish: 'Minsu',
                korean: '커닝은 안 돼. 하지만 공부는 같이 하자.',
                romanization: 'keonningeun an dwae. hajiman gongbuneun gachi haja.',
                english: 'Cheating is not okay. But let\'s study together.',
                words: [
                  { korean: '커닝은', english: 'cheating (topic)' },
                  { korean: '안 돼', english: 'is not okay' },
                  { korean: '하지만', english: 'but / however' },
                  { korean: '공부는', english: 'studying (topic)' },
                  { korean: '같이', english: 'together' },
                  { korean: '하자', english: 'let\'s do' },
                ],
                position: 'left',
              },
              {
                speaker: '태호',
                speakerEnglish: 'Taeho',
                korean: '정말? 고마워, 민수야.',
                romanization: 'jeongmal? gomawo, minsuya.',
                english: 'Really? Thank you, Minsu.',
                words: [
                  { korean: '정말', english: 'really' },
                  { korean: '고마워', english: 'thank you (casual)' },
                ],
                position: 'right',
              },
            ],
          },
        ],
      },
      // ─────────────────────────────────────────────
      // Chapter 4: Friends Again (Level 3)
      // ─────────────────────────────────────────────
      {
        id: 'det-ch4-friends-again',
        title: 'Friends Again',
        titleKorean: '다시 친구',
        level: 3,
        description: 'Minsu helps Taeho study for the exam. The mystery is solved, and a friendship is restored.',
        panels: [
          {
            id: 'det-ch4-p1',
            imagePrompt: 'manga style illustration of three Korean students studying together at a bright library table during daytime, books and notebooks spread out, warm natural sunlight, contrast to previous dark scenes, hopeful atmosphere',
            narration: '다음 날, 세 사람은 함께 공부합니다.',
            narrationEnglish: 'The next day, the three study together.',
            dialogue: [
              {
                speaker: '민수',
                speakerEnglish: 'Minsu',
                korean: '이 부분은 이렇게 풀어야 해.',
                romanization: 'i bubuneun ireoke pureoya hae.',
                english: 'You need to solve this part like this.',
                words: [
                  { korean: '이 부분은', english: 'this part (topic)' },
                  { korean: '이렇게', english: 'like this' },
                  { korean: '풀어야 해', english: 'need to solve' },
                ],
                position: 'left',
              },
              {
                speaker: '태호',
                speakerEnglish: 'Taeho',
                korean: '아, 이제 이해됐어!',
                romanization: 'a, ije ihaedwaesseo!',
                english: 'Ah, now I understand!',
                words: [
                  { korean: '이제', english: 'now' },
                  { korean: '이해됐어', english: 'I understood' },
                ],
                position: 'right',
              },
            ],
          },
          {
            id: 'det-ch4-p2',
            imagePrompt: 'manga style illustration of a Korean girl tutoring a boy at a table with flashcards, bright cheerful library setting, encouraging expression, warm lighting, study session atmosphere',
            dialogue: [
              {
                speaker: '지영',
                speakerEnglish: 'Jiyoung',
                korean: '태호야, 이 단어 뜻 알아?',
                romanization: 'taehoya, i daneo tteut ara?',
                english: 'Taeho, do you know the meaning of this word?',
                words: [
                  { korean: '이', english: 'this' },
                  { korean: '단어', english: 'word' },
                  { korean: '뜻', english: 'meaning' },
                  { korean: '알아', english: 'do you know' },
                ],
                position: 'right',
              },
              {
                speaker: '태호',
                speakerEnglish: 'Taeho',
                korean: '음... 잠깐, 알 것 같아!',
                romanization: 'eum... jamkkan, al geot gata!',
                english: 'Hmm... Wait, I think I know it!',
                words: [
                  { korean: '잠깐', english: 'wait / a moment' },
                  { korean: '알', english: 'know' },
                  { korean: '것 같아', english: 'I think' },
                ],
                position: 'left',
              },
            ],
          },
          {
            id: 'det-ch4-p3',
            imagePrompt: 'manga style illustration of a Korean classroom during an exam, students sitting at desks writing, one boy looking confident and focused, bright well-lit classroom, calm determined atmosphere',
            narration: '시험 날이 됐습니다.',
            narrationEnglish: 'Exam day has arrived.',
            dialogue: [
              {
                speaker: '태호',
                speakerEnglish: 'Taeho (thinking)',
                korean: '할 수 있어. 열심히 공부했으니까.',
                romanization: 'hal su isseo. yeolsimhi gongbuhaesseunikka.',
                english: 'I can do this. Because I studied hard.',
                words: [
                  { korean: '할 수 있어', english: 'I can do it' },
                  { korean: '열심히', english: 'hard / diligently' },
                  { korean: '공부했으니까', english: 'because I studied' },
                ],
                position: 'center',
              },
            ],
          },
          {
            id: 'det-ch4-p4',
            imagePrompt: 'manga style illustration of a Korean boy looking at an exam result paper with a surprised happy expression, school hallway, warm lighting, other students in background, relief and joy visible',
            dialogue: [
              {
                speaker: '태호',
                speakerEnglish: 'Taeho',
                korean: '80점! 혼자 힘으로 했어!',
                romanization: '80jeom! honja himeuro haesseo!',
                english: '80 points! I did it on my own!',
                words: [
                  { korean: '80점', english: '80 points' },
                  { korean: '혼자', english: 'alone / on my own' },
                  { korean: '힘으로', english: 'by one\'s own power' },
                  { korean: '했어', english: 'did it' },
                ],
                position: 'center',
              },
            ],
          },
          {
            id: 'det-ch4-p5',
            imagePrompt: 'manga style illustration of three Korean students high-fiving in a school hallway, celebrating, big smiles, warm golden sunlight through windows, happy triumphant atmosphere, cherry blossom petals visible outside',
            dialogue: [
              {
                speaker: '민수',
                speakerEnglish: 'Minsu',
                korean: '잘했어, 태호야! 네 실력이야.',
                romanization: 'jalhaesseo, taehoya! ne sillyeogiya.',
                english: 'Great job, Taeho! That\'s your own ability.',
                words: [
                  { korean: '잘했어', english: 'well done' },
                  { korean: '네', english: 'your' },
                  { korean: '실력이야', english: 'is your ability' },
                ],
                position: 'left',
              },
              {
                speaker: '지영',
                speakerEnglish: 'Jiyoung',
                korean: '우리 축하하러 떡볶이 먹으러 가자!',
                romanization: 'uri chukaharo tteokbokki meogeuro gaja!',
                english: 'Let\'s go eat tteokbokki to celebrate!',
                words: [
                  { korean: '축하하러', english: 'to celebrate' },
                  { korean: '떡볶이', english: 'tteokbokki (rice cakes)' },
                  { korean: '먹으러', english: 'to eat' },
                  { korean: '가자', english: 'let\'s go' },
                ],
                position: 'right',
              },
            ],
          },
          {
            id: 'det-ch4-p6',
            imagePrompt: 'manga style illustration of three Korean students eating tteokbokki at a cozy Korean street food stall, steam rising from the food, warm orange overhead lights, laughing together, heartwarming friendship scene',
            narration: '세 사람은 함께 떡볶이를 먹으며 웃습니다.',
            narrationEnglish: 'The three eat tteokbokki together and laugh.',
            dialogue: [
              {
                speaker: '태호',
                speakerEnglish: 'Taeho',
                korean: '정말 고마워. 너희 덕분이야.',
                romanization: 'jeongmal gomawo. neohui deokbuniya.',
                english: 'Really thank you. It\'s thanks to you guys.',
                words: [
                  { korean: '정말', english: 'really' },
                  { korean: '고마워', english: 'thank you' },
                  { korean: '너희', english: 'you guys' },
                  { korean: '덕분이야', english: 'it\'s thanks to' },
                ],
                position: 'right',
              },
            ],
          },
          {
            id: 'det-ch4-p7',
            imagePrompt: 'manga style illustration of a Korean boy detective smiling confidently in the sunset light at school, warm golden hour lighting, gentle breeze, school building in background, reflective peaceful atmosphere',
            dialogue: [
              {
                speaker: '민수',
                speakerEnglish: 'Minsu',
                korean: '사건은 해결됐어. 그리고 친구도 생겼어.',
                romanization: 'sageuneun haegyeoldwaesseo. geurigo chingudo saenggyeosseo.',
                english: 'The case is solved. And I made a friend too.',
                words: [
                  { korean: '사건은', english: 'the case (topic)' },
                  { korean: '해결됐어', english: 'is solved' },
                  { korean: '그리고', english: 'and' },
                  { korean: '친구도', english: 'friend too' },
                  { korean: '생겼어', english: 'was made / gained' },
                ],
                position: 'center',
              },
            ],
          },
          {
            id: 'det-ch4-p8',
            imagePrompt: 'manga style illustration of three Korean students walking home together along a tree-lined path at sunset, long shadows, warm golden light, school bags on their backs, peaceful ending scene, beautiful sky gradient',
            narration: '사건은 끝났지만, 우정은 시작됐습니다.',
            narrationEnglish: 'The case is over, but the friendship has just begun.',
            dialogue: [
              {
                speaker: '지영',
                speakerEnglish: 'Jiyoung',
                korean: '다음에도 사건이 생기면 같이 풀자!',
                romanization: 'daeumedo sageni saenggimyeon gachi pulja!',
                english: 'Next time there\'s a case, let\'s solve it together!',
                words: [
                  { korean: '다음에도', english: 'next time too' },
                  { korean: '사건이', english: 'case (subject)' },
                  { korean: '생기면', english: 'if it happens' },
                  { korean: '같이', english: 'together' },
                  { korean: '풀자', english: 'let\'s solve' },
                ],
                position: 'right',
              },
              {
                speaker: '민수',
                speakerEnglish: 'Minsu',
                korean: '그래! 탐정단 결성이다!',
                romanization: 'geurae! tamjeongdan gyeolseongida!',
                english: 'Yes! The detective team is formed!',
                words: [
                  { korean: '그래', english: 'yes / okay' },
                  { korean: '탐정단', english: 'detective team' },
                  { korean: '결성이다', english: 'is formed' },
                ],
                position: 'left',
              },
            ],
          },
        ],
      },
    ],
  },
  // ═══════════════════════════════════════════════
  // SERIES 4: K-Pop Star (kept from original)
  // ═══════════════════════════════════════════════
  {
    id: 'kpop-star',
    title: 'K-Pop Star',
    titleKorean: '케이팝 스타',
    description: 'A trainee tries to debut as a K-pop idol. Follow Seoyeon through intense auditions, grueling practice, and the thrill of the stage.',
    genre: 'Music/Drama',
    chapters: [
      {
        id: 'kpop-ch1-audition-day',
        title: 'Audition Day',
        titleKorean: '오디션 날',
        level: 2,
        description: 'Seoyeon arrives at her dream audition. Will she make the cut?',
        panels: [
          {
            id: 'kpop-ch1-p1',
            imagePrompt: 'colorful energetic manga style illustration of a nervous but determined young Korean girl standing outside a large modern entertainment company building, bright neon signs, city backdrop, dynamic pose, sparkle effects, vibrant colors',
            dialogue: [
              {
                speaker: '서연',
                speakerEnglish: 'Seoyeon',
                korean: '오늘이 오디션이야. 긴장돼...',
                romanization: 'oneuri odisyeoniya. ginjangdwae...',
                english: "Today is the audition. I'm nervous...",
                words: [
                  { korean: '오늘이', english: 'today (subject)' },
                  { korean: '오디션이야', english: 'is the audition' },
                  { korean: '긴장돼', english: "I'm nervous" },
                ],
                position: 'center',
              },
            ],
          },
          {
            id: 'kpop-ch1-p2',
            imagePrompt: 'colorful energetic manga style illustration of a Korean girl in a bright dance practice room facing a stern instructor, mirrors on walls, wooden floor, dramatic lighting, pop art style energy lines, vibrant atmosphere',
            dialogue: [
              {
                speaker: '선생님',
                speakerEnglish: 'Instructor',
                korean: '준비됐어요? 노래부터 시작하세요.',
                romanization: 'junbidwaesseoyo? noraebuteo sijakhaseyo.',
                english: 'Ready? Start with singing.',
                words: [
                  { korean: '준비됐어요', english: 'are you ready (polite)' },
                  { korean: '노래부터', english: 'from singing / singing first' },
                  { korean: '시작하세요', english: 'please start (honorific)' },
                ],
                position: 'left',
              },
              {
                speaker: '서연',
                speakerEnglish: 'Seoyeon',
                korean: '네, 시작할게요!',
                romanization: 'ne, sijakhalgeyo!',
                english: "Yes, I'll start!",
                words: [
                  { korean: '네', english: 'yes' },
                  { korean: '시작할게요', english: "I'll start (polite)" },
                ],
                position: 'right',
              },
            ],
          },
          {
            id: 'kpop-ch1-p3',
            imagePrompt: 'colorful energetic manga style illustration of a young Korean girl singing passionately on a stage with spotlights, judges watching from a table, musical notes and sparkle effects, dynamic angle, vibrant neon colors, performance energy',
            dialogue: [
              {
                speaker: '심사위원',
                speakerEnglish: 'Judge',
                korean: '목소리가 좋네요. 춤도 보여주세요.',
                romanization: 'moksoriga jonneyo. chumdo boyeojuseyo.',
                english: 'Nice voice. Show us your dance too.',
                words: [
                  { korean: '목소리가', english: 'voice (subject)' },
                  { korean: '좋네요', english: 'is nice (polite)' },
                  { korean: '춤도', english: 'dance too' },
                  { korean: '보여주세요', english: 'please show (honorific)' },
                ],
                position: 'left',
              },
            ],
          },
          {
            id: 'kpop-ch1-p4',
            imagePrompt: 'colorful energetic manga style illustration of a Korean girl receiving exciting news from judges, confetti and sparkle effects, bright stage lights, tears of joy, dynamic celebratory pose, vibrant pop colors, triumphant moment',
            dialogue: [
              {
                speaker: '심사위원',
                speakerEnglish: 'Judge',
                korean: '축하합니다. 합격이에요!',
                romanization: 'chukahamnida. hapgyeogieyo!',
                english: 'Congratulations. You passed!',
                words: [
                  { korean: '축하합니다', english: 'congratulations (formal)' },
                  { korean: '합격이에요', english: 'you passed (polite)' },
                ],
                position: 'left',
              },
              {
                speaker: '서연',
                speakerEnglish: 'Seoyeon',
                korean: '정말요?! 감사합니다!',
                romanization: 'jeongmalyo?! gamsahamnida!',
                english: 'Really?! Thank you!',
                words: [
                  { korean: '정말요', english: 'really (polite)' },
                  { korean: '감사합니다', english: 'thank you (formal)' },
                ],
                position: 'right',
              },
            ],
          },
        ],
      },
      // ─────────────────────────────────────────────
      // Chapter 2: First Day of Training (Level 2)
      // ─────────────────────────────────────────────
      {
        id: 'kpop-ch2-first-training',
        title: 'First Day of Training',
        titleKorean: '연습 첫날',
        level: 2,
        description: 'Seoyeon begins her trainee life. Tough practices, a strict mentor, and a new rival await.',
        panels: [
          {
            id: 'kpop-ch2-p1',
            imagePrompt: 'colorful energetic manga style illustration of a young Korean girl walking into a large bright dance practice room for the first time, mirrors on all walls, wooden floors, other trainees stretching in background, morning sunlight through windows, excited nervous expression',
            narration: '서연의 연습생 생활이 시작됩니다.',
            narrationEnglish: 'Seoyeon\'s trainee life begins.',
            dialogue: [
              {
                speaker: '서연',
                speakerEnglish: 'Seoyeon',
                korean: '여기가 연습실이야... 진짜 크다!',
                romanization: 'yeogiga yeonseupsiliya... jinjja keuda!',
                english: 'This is the practice room... It\'s really big!',
                words: [
                  { korean: '여기가', english: 'this place (subject)' },
                  { korean: '연습실이야', english: 'is the practice room' },
                  { korean: '진짜', english: 'really' },
                  { korean: '크다', english: "it's big" },
                ],
                position: 'right',
              },
            ],
          },
          {
            id: 'kpop-ch2-p2',
            imagePrompt: 'colorful energetic manga style illustration of a confident Korean girl with a ponytail looking coolly at a new arrival in a dance studio, arms crossed, slightly competitive expression, sparkle effects, vibrant pop colors, other trainees watching',
            dialogue: [
              {
                speaker: '하은',
                speakerEnglish: 'Haeun',
                korean: '너도 신입? 나는 하은이야.',
                romanization: 'neodo sinip? naneun haeuniya.',
                english: 'You\'re also new? I\'m Haeun.',
                words: [
                  { korean: '너도', english: 'you too' },
                  { korean: '신입', english: 'newcomer' },
                  { korean: '나는', english: 'I (topic)' },
                  { korean: '하은이야', english: 'am Haeun' },
                ],
                position: 'left',
              },
              {
                speaker: '서연',
                speakerEnglish: 'Seoyeon',
                korean: '네! 반가워요. 서연이에요.',
                romanization: 'ne! bangawoyo. seoyeonieyo.',
                english: 'Yes! Nice to meet you. I\'m Seoyeon.',
                words: [
                  { korean: '네', english: 'yes' },
                  { korean: '반가워요', english: 'nice to meet you (polite)' },
                  { korean: '서연이에요', english: 'I am Seoyeon (polite)' },
                ],
                position: 'right',
              },
            ],
          },
          {
            id: 'kpop-ch2-p3',
            imagePrompt: 'colorful energetic manga style illustration of a strict Korean dance instructor standing in front of trainees in a dance studio, arms behind back, serious expression, all trainees standing in a line looking nervous, dramatic lighting',
            dialogue: [
              {
                speaker: '코치',
                speakerEnglish: 'Coach',
                korean: '여기서는 노력만이 중요합니다.',
                romanization: 'yeogiseoneun noryeongmani jungyohamnida.',
                english: 'Here, only hard work matters.',
                words: [
                  { korean: '여기서는', english: 'here (topic)' },
                  { korean: '노력만이', english: 'only effort' },
                  { korean: '중요합니다', english: 'is important (formal)' },
                ],
                position: 'left',
              },
            ],
          },
          {
            id: 'kpop-ch2-p4',
            imagePrompt: 'colorful energetic manga style illustration of Korean girls doing intense dance practice, one girl struggling to keep up with the choreography while others move in sync, sweat drops, motion lines, dance studio with mirrors reflecting movements, dynamic angle',
            dialogue: [
              {
                speaker: '서연',
                speakerEnglish: 'Seoyeon (thinking)',
                korean: '너무 빨라... 따라갈 수 있을까?',
                romanization: 'neomu ppalla... ttaragal su isseulkka?',
                english: 'Too fast... Can I keep up?',
                words: [
                  { korean: '너무', english: 'too much' },
                  { korean: '빨라', english: 'fast' },
                  { korean: '따라갈', english: 'follow / keep up' },
                  { korean: '수', english: 'ability' },
                  { korean: '있을까', english: 'will there be' },
                ],
                position: 'right',
              },
            ],
          },
          {
            id: 'kpop-ch2-p5',
            imagePrompt: 'colorful energetic manga style illustration of a Korean girl sitting exhausted on the dance studio floor, water bottle beside her, towel around neck, breathing heavily, other trainees resting in background, warm lighting, sympathetic atmosphere',
            dialogue: [
              {
                speaker: '하은',
                speakerEnglish: 'Haeun',
                korean: '괜찮아? 물 마셔.',
                romanization: 'gwaenchana? mul masyeo.',
                english: 'You okay? Drink some water.',
                words: [
                  { korean: '괜찮아', english: 'are you okay' },
                  { korean: '물', english: 'water' },
                  { korean: '마셔', english: 'drink' },
                ],
                position: 'left',
              },
              {
                speaker: '서연',
                speakerEnglish: 'Seoyeon',
                korean: '고마워. 생각보다 힘들어.',
                romanization: 'gomawo. saenggakboda himdeureo.',
                english: 'Thanks. It\'s harder than I thought.',
                words: [
                  { korean: '고마워', english: 'thanks (casual)' },
                  { korean: '생각보다', english: 'more than expected' },
                  { korean: '힘들어', english: "it's hard / tough" },
                ],
                position: 'right',
              },
            ],
          },
          {
            id: 'kpop-ch2-p6',
            imagePrompt: 'colorful energetic manga style illustration of a Korean girl practicing alone in a dark dance studio at night, moonlight through windows, determination in her eyes, reflection visible in mirror, beautiful solitary atmosphere, motion blur on dance move',
            narration: '밤늦게까지 서연은 혼자 연습합니다.',
            narrationEnglish: 'Late into the night, Seoyeon practices alone.',
            dialogue: [
              {
                speaker: '서연',
                speakerEnglish: 'Seoyeon',
                korean: '포기하지 않을 거야. 한 번 더!',
                romanization: 'pogihaji anheul geoya. han beon deo!',
                english: "I won't give up. One more time!",
                words: [
                  { korean: '포기하지', english: 'give up' },
                  { korean: '않을', english: 'will not' },
                  { korean: '거야', english: 'going to' },
                  { korean: '한 번', english: 'one time' },
                  { korean: '더', english: 'more' },
                ],
                position: 'center',
              },
            ],
          },
          {
            id: 'kpop-ch2-p7',
            imagePrompt: 'colorful energetic manga style illustration of a Korean dance coach watching a girl perform with a slightly impressed expression, clipboard in hand, practice room background, subtle smile forming, warm encouraging lighting',
            dialogue: [
              {
                speaker: '코치',
                speakerEnglish: 'Coach',
                korean: '서연 씨, 많이 좋아졌어요.',
                romanization: 'seoyeon ssi, mani joajyeosseoyo.',
                english: 'Seoyeon, you\'ve improved a lot.',
                words: [
                  { korean: '서연 씨', english: 'Seoyeon (polite address)' },
                  { korean: '많이', english: 'a lot' },
                  { korean: '좋아졌어요', english: 'has gotten better (polite)' },
                ],
                position: 'left',
              },
              {
                speaker: '서연',
                speakerEnglish: 'Seoyeon',
                korean: '정말요? 감사합니다!',
                romanization: 'jeongmalyo? gamsahamnida!',
                english: 'Really? Thank you!',
                words: [
                  { korean: '정말요', english: 'really (polite)' },
                  { korean: '감사합니다', english: 'thank you (formal)' },
                ],
                position: 'right',
              },
            ],
          },
          {
            id: 'kpop-ch2-p8',
            imagePrompt: 'colorful energetic manga style illustration of a Korean coach posting a notice on a bulletin board while trainees gather around nervously, notice reads evaluation in Korean, dramatic suspenseful atmosphere with bright pop colors, cliffhanger moment',
            narration: '다음 주, 중요한 소식이 있습니다...',
            narrationEnglish: 'Next week, there is important news...',
            dialogue: [
              {
                speaker: '코치',
                speakerEnglish: 'Coach',
                korean: '다음 주에 평가가 있습니다. 준비하세요.',
                romanization: 'daeum jue pyeonggaga isseumnida. junbihaseyo.',
                english: 'There is an evaluation next week. Please prepare.',
                words: [
                  { korean: '다음 주에', english: 'next week' },
                  { korean: '평가가', english: 'evaluation (subject)' },
                  { korean: '있습니다', english: 'there is (formal)' },
                  { korean: '준비하세요', english: 'please prepare (honorific)' },
                ],
                position: 'left',
              },
              {
                speaker: '서연',
                speakerEnglish: 'Seoyeon (thinking)',
                korean: '평가... 잘할 수 있을까?',
                romanization: 'pyeongga... jalhal su isseulkka?',
                english: 'Evaluation... Can I do well?',
                words: [
                  { korean: '평가', english: 'evaluation' },
                  { korean: '잘할', english: 'do well' },
                  { korean: '수', english: 'ability' },
                  { korean: '있을까', english: 'will there be' },
                ],
                position: 'right',
              },
            ],
          },
        ],
      },
      // ─────────────────────────────────────────────
      // Chapter 3: The Evaluation (Level 3)
      // ─────────────────────────────────────────────
      {
        id: 'kpop-ch3-evaluation',
        title: 'The Evaluation',
        titleKorean: '평가의 날',
        level: 3,
        description: 'Evaluation day arrives. Seoyeon must prove herself or risk being cut from the program.',
        panels: [
          {
            id: 'kpop-ch3-p1',
            imagePrompt: 'colorful energetic manga style illustration of Korean trainees lined up nervously in a large bright dance practice room, facing strict judges at a table, evaluation day banner visible, tense atmosphere, bright studio lighting',
            narration: '평가의 날이 왔습니다.',
            narrationEnglish: 'Evaluation day has arrived.',
            dialogue: [
              {
                speaker: '서연',
                speakerEnglish: 'Seoyeon (thinking)',
                korean: '심장이 너무 빨리 뛰어.',
                romanization: 'simjangi neomu ppalli ttwiyeo.',
                english: 'My heart is beating so fast.',
                words: [
                  { korean: '심장이', english: 'heart (subject)' },
                  { korean: '너무', english: 'so / too much' },
                  { korean: '빨리', english: 'fast' },
                  { korean: '뛰어', english: 'is beating' },
                ],
                position: 'right',
              },
            ],
          },
          {
            id: 'kpop-ch3-p2',
            imagePrompt: 'colorful energetic manga style illustration of a Korean girl with ponytail giving an encouraging fist bump to another girl with pixie-cut hair in a dance studio hallway, supportive friendship moment, warm but nervous energy, bright lighting',
            dialogue: [
              {
                speaker: '하은',
                speakerEnglish: 'Haeun',
                korean: '서연아, 우리 할 수 있어. 같이 연습했잖아.',
                romanization: 'seoyeona, uri hal su isseo. gachi yeonseuphaetjanha.',
                english: 'Seoyeon, we can do this. We practiced together, remember.',
                words: [
                  { korean: '우리', english: 'we' },
                  { korean: '할 수 있어', english: 'can do it' },
                  { korean: '같이', english: 'together' },
                  { korean: '연습했잖아', english: 'we practiced, right' },
                ],
                position: 'left',
              },
              {
                speaker: '서연',
                speakerEnglish: 'Seoyeon',
                korean: '맞아. 최선을 다하자!',
                romanization: 'maja. choesoneul dahaja!',
                english: 'Right. Let\'s do our best!',
                words: [
                  { korean: '맞아', english: 'right / correct' },
                  { korean: '최선을', english: 'one\'s best (object)' },
                  { korean: '다하자', english: 'let\'s do it all' },
                ],
                position: 'right',
              },
            ],
          },
          {
            id: 'kpop-ch3-p3',
            imagePrompt: 'colorful energetic manga style illustration of a Korean girl performing a powerful dance solo under a spotlight in a practice room, dynamic movement captured mid-spin, motion lines and sparkle effects, judges watching intently, vibrant neon energy',
            narration: '서연의 차례입니다.',
            narrationEnglish: 'It\'s Seoyeon\'s turn.',
            dialogue: [
              {
                speaker: '서연',
                speakerEnglish: 'Seoyeon (thinking)',
                korean: '지금이야. 모든 걸 보여주자.',
                romanization: 'jigeumiya. modeun geol boyeojuja.',
                english: 'This is it. Let me show them everything.',
                words: [
                  { korean: '지금이야', english: 'it\'s now' },
                  { korean: '모든 걸', english: 'everything (object)' },
                  { korean: '보여주자', english: 'let me show' },
                ],
                position: 'center',
              },
            ],
          },
          {
            id: 'kpop-ch3-p4',
            imagePrompt: 'colorful energetic manga style illustration of a Korean girl finishing a dance routine in a powerful ending pose, one arm raised, sweat glistening, breathing hard but proud expression, spotlight from above, audience of trainees clapping',
            dialogue: [
              {
                speaker: '코치',
                speakerEnglish: 'Coach',
                korean: '서연 씨, 한 달 전과 완전히 달라졌어요.',
                romanization: 'seoyeon ssi, han dal jeongwa wanjeonhi dallajyeosseoyo.',
                english: 'Seoyeon, you\'re completely different from a month ago.',
                words: [
                  { korean: '한 달 전과', english: 'from a month ago' },
                  { korean: '완전히', english: 'completely' },
                  { korean: '달라졌어요', english: 'has changed (polite)' },
                ],
                position: 'left',
              },
            ],
          },
          {
            id: 'kpop-ch3-p5',
            imagePrompt: 'colorful energetic manga style illustration of a judge whispering to another judge with subtle smiles, clipboard with notes, evaluation room, other trainees waiting nervously in background, anticipation in the air',
            dialogue: [
              {
                speaker: '심사위원',
                speakerEnglish: 'Judge',
                korean: '결과를 발표하겠습니다.',
                romanization: 'gyeolguareul balpyohagesseumnida.',
                english: 'We will announce the results.',
                words: [
                  { korean: '결과를', english: 'results (object)' },
                  { korean: '발표하겠습니다', english: 'will announce (formal)' },
                ],
                position: 'center',
              },
            ],
          },
          {
            id: 'kpop-ch3-p6',
            imagePrompt: 'colorful energetic manga style illustration of a Korean girl with pixie-cut hair looking devastated, tears forming, sitting on the practice room floor, other trainees around her, emotional gut-punch moment, dramatic lighting',
            dialogue: [
              {
                speaker: '심사위원',
                speakerEnglish: 'Judge',
                korean: '하은 씨는... 이번에 탈락입니다.',
                romanization: 'haeun ssineun... ibeone tallagyimnida.',
                english: 'Haeun... you are eliminated this time.',
                words: [
                  { korean: '이번에', english: 'this time' },
                  { korean: '탈락입니다', english: 'is eliminated (formal)' },
                ],
                position: 'left',
              },
              {
                speaker: '서연',
                speakerEnglish: 'Seoyeon',
                korean: '하은아...!',
                romanization: 'haeuna...!',
                english: 'Haeun...!',
                words: [
                  { korean: '하은아', english: 'Haeun (calling name)' },
                ],
                position: 'right',
              },
            ],
          },
          {
            id: 'kpop-ch3-p7',
            imagePrompt: 'colorful energetic manga style illustration of two Korean girls hugging in a dance studio, one crying on the other shoulder, emotional farewell, warm golden light from window, bittersweet atmosphere, other trainees watching with sad expressions',
            dialogue: [
              {
                speaker: '하은',
                speakerEnglish: 'Haeun',
                korean: '괜찮아. 서연아, 너는 꼭 데뷔해.',
                romanization: 'gwaenchana. seoyeona, neoneun kkok debyuhae.',
                english: 'It\'s okay. Seoyeon, you must debut.',
                words: [
                  { korean: '괜찮아', english: 'it\'s okay' },
                  { korean: '꼭', english: 'definitely / must' },
                  { korean: '데뷔해', english: 'debut' },
                ],
                position: 'left',
              },
              {
                speaker: '서연',
                speakerEnglish: 'Seoyeon',
                korean: '약속할게. 하은이 몫까지.',
                romanization: 'yaksokhalge. haeuni mokkaji.',
                english: 'I promise. For your share too.',
                words: [
                  { korean: '약속할게', english: 'I\'ll promise' },
                  { korean: '몫까지', english: 'even your share / portion' },
                ],
                position: 'right',
              },
            ],
          },
          {
            id: 'kpop-ch3-p8',
            imagePrompt: 'colorful energetic manga style illustration of a Korean girl with ponytail standing alone in a practice room at dusk, looking at her reflection in the mirror with fierce determination, sunset light through window, silhouette composition, powerful emotional moment',
            narration: '서연은 더 강해지기로 결심합니다.',
            narrationEnglish: 'Seoyeon decides to become stronger.',
            dialogue: [
              {
                speaker: '서연',
                speakerEnglish: 'Seoyeon',
                korean: '포기 안 해. 하은이를 위해서도.',
                romanization: 'pogi an hae. haeuneureul wihaesedo.',
                english: 'I won\'t give up. For Haeun\'s sake too.',
                words: [
                  { korean: '포기', english: 'giving up' },
                  { korean: '안 해', english: 'won\'t do' },
                  { korean: '위해서도', english: 'for the sake of, too' },
                ],
                position: 'center',
              },
            ],
          },
        ],
      },
      // ─────────────────────────────────────────────
      // Chapter 4: Debut Stage (Level 4)
      // ─────────────────────────────────────────────
      {
        id: 'kpop-ch4-debut',
        title: 'Debut Stage',
        titleKorean: '데뷔 무대',
        level: 4,
        description: 'After months of training, Seoyeon finally takes the debut stage. Haeun watches from the audience.',
        panels: [
          {
            id: 'kpop-ch4-p1',
            imagePrompt: 'colorful energetic manga style illustration of a Korean entertainment company lobby with a large digital screen showing debut group announcement, a girl trainee staring at the screen in shock and joy, sparkle effects, modern sleek interior',
            narration: '3개월 후, 데뷔 그룹이 발표됩니다.',
            narrationEnglish: 'Three months later, the debut group is announced.',
            dialogue: [
              {
                speaker: '코치',
                speakerEnglish: 'Coach',
                korean: '서연 씨, 축하합니다. 데뷔 멤버로 선발됐어요.',
                romanization: 'seoyeon ssi, chukahamnida. debyu membeoro seonbaldwaesseoyo.',
                english: 'Seoyeon, congratulations. You\'ve been selected as a debut member.',
                words: [
                  { korean: '축하합니다', english: 'congratulations (formal)' },
                  { korean: '데뷔', english: 'debut' },
                  { korean: '멤버로', english: 'as a member' },
                  { korean: '선발됐어요', english: 'was selected (polite)' },
                ],
                position: 'left',
              },
            ],
          },
          {
            id: 'kpop-ch4-p2',
            imagePrompt: 'colorful energetic manga style illustration of a Korean girl video calling her friend on a phone, tears of happiness, friend on screen also emotional, warm bedroom setting with idol posters on wall, heartfelt moment',
            dialogue: [
              {
                speaker: '서연',
                speakerEnglish: 'Seoyeon',
                korean: '하은아, 나 데뷔해! 꼭 보러 와!',
                romanization: 'haeuna, na debyuhae! kkok boreo wa!',
                english: 'Haeun, I\'m debuting! You must come watch!',
                words: [
                  { korean: '나', english: 'I' },
                  { korean: '데뷔해', english: 'am debuting' },
                  { korean: '꼭', english: 'definitely' },
                  { korean: '보러 와', english: 'come to watch' },
                ],
                position: 'right',
              },
              {
                speaker: '하은',
                speakerEnglish: 'Haeun (on phone)',
                korean: '당연하지! 맨 앞에서 볼 거야!',
                romanization: 'dangyeonhaji! maen apeseo bol geoya!',
                english: 'Of course! I\'ll watch from the very front!',
                words: [
                  { korean: '당연하지', english: 'of course' },
                  { korean: '맨 앞에서', english: 'from the very front' },
                  { korean: '볼 거야', english: 'will watch' },
                ],
                position: 'left',
              },
            ],
          },
          {
            id: 'kpop-ch4-p3',
            imagePrompt: 'colorful energetic manga style illustration of a Korean girl getting her stage makeup done backstage, stylists around her, bright vanity mirror lights, glittery outfit on a rack nearby, nervous excitement, pre-show energy',
            narration: '데뷔 무대 당일, 백스테이지.',
            narrationEnglish: 'Debut stage day, backstage.',
            dialogue: [
              {
                speaker: '서연',
                speakerEnglish: 'Seoyeon (thinking)',
                korean: '여기까지 오는 데 정말 오래 걸렸어.',
                romanization: 'yeogikkaji oneun de jeongmal orae geollyeosseo.',
                english: 'It took so long to get here.',
                words: [
                  { korean: '여기까지', english: 'up to here' },
                  { korean: '오는 데', english: 'to come / to get' },
                  { korean: '정말', english: 'really' },
                  { korean: '오래', english: 'long time' },
                  { korean: '걸렸어', english: 'it took' },
                ],
                position: 'center',
              },
            ],
          },
          {
            id: 'kpop-ch4-p4',
            imagePrompt: 'colorful energetic manga style illustration of a Korean girl in sparkling stage outfit peeking through a curtain at a huge concert audience with lightsticks, view from backstage, massive crowd with colorful lights, breathtaking scale, nervous awe',
            dialogue: [
              {
                speaker: '서연',
                speakerEnglish: 'Seoyeon',
                korean: '와... 사람이 이렇게 많아...',
                romanization: 'wa... sarami ireoke mana...',
                english: 'Wow... there are so many people...',
                words: [
                  { korean: '와', english: 'wow' },
                  { korean: '사람이', english: 'people (subject)' },
                  { korean: '이렇게', english: 'this much / like this' },
                  { korean: '많아', english: 'many / a lot' },
                ],
                position: 'right',
              },
            ],
          },
          {
            id: 'kpop-ch4-p5',
            imagePrompt: 'colorful energetic manga style illustration of a Korean girl with pixie-cut hair in the audience holding a lightstick and a handmade banner cheering, bright concert atmosphere, colorful audience, emotional support moment, tears and smile',
            dialogue: [
              {
                speaker: '하은',
                speakerEnglish: 'Haeun (from audience)',
                korean: '서연아 화이팅!!!',
                romanization: 'seoyeona hwaiting!!!',
                english: 'Seoyeon, fighting!!!',
                words: [
                  { korean: '화이팅', english: 'fighting! (cheer of encouragement)' },
                ],
                position: 'center',
              },
            ],
          },
          {
            id: 'kpop-ch4-p6',
            imagePrompt: 'colorful energetic manga style illustration of a Korean girl idol performing center stage under brilliant spotlights, dynamic dance pose, glittering outfit, concert lighting with lasers and effects, crowd of lightsticks in background, peak performance energy, vibrant neon colors',
            narration: '서연은 무대 위에서 빛납니다.',
            narrationEnglish: 'Seoyeon shines on stage.',
            dialogue: [
              {
                speaker: '서연',
                speakerEnglish: 'Seoyeon (thinking)',
                korean: '이 순간을 절대 잊지 않을 거야.',
                romanization: 'i sunganeul jeoldae itji anheul geoya.',
                english: 'I will never forget this moment.',
                words: [
                  { korean: '이 순간을', english: 'this moment (object)' },
                  { korean: '절대', english: 'absolutely / never' },
                  { korean: '잊지 않을', english: 'will not forget' },
                  { korean: '거야', english: 'going to' },
                ],
                position: 'center',
              },
            ],
          },
          {
            id: 'kpop-ch4-p7',
            imagePrompt: 'colorful energetic manga style illustration of a Korean idol girl bowing deeply to a cheering audience after a performance, flowers thrown on stage, lightsticks waving, tears of joy, triumphant emotional moment, beautiful stage lighting',
            dialogue: [
              {
                speaker: '서연',
                speakerEnglish: 'Seoyeon',
                korean: '감사합니다! 사랑해요!',
                romanization: 'gamsahamnida! saranghaeyo!',
                english: 'Thank you! I love you!',
                words: [
                  { korean: '감사합니다', english: 'thank you (formal)' },
                  { korean: '사랑해요', english: 'I love you (polite)' },
                ],
                position: 'center',
              },
            ],
          },
          {
            id: 'kpop-ch4-p8',
            imagePrompt: 'colorful energetic manga style illustration of two Korean girls reuniting backstage after a concert, one in stage outfit and one in casual clothes, tight emotional hug, flowers and congratulation gifts around, warm happy tears, beautiful friendship ending',
            narration: '꿈은 이루어집니다. 함께라면.',
            narrationEnglish: 'Dreams come true. When you\'re together.',
            dialogue: [
              {
                speaker: '하은',
                speakerEnglish: 'Haeun',
                korean: '너 정말 멋있었어. 자랑스러워.',
                romanization: 'neo jeongmal meosisseosseo. jarangseurowo.',
                english: 'You were really amazing. I\'m proud of you.',
                words: [
                  { korean: '정말', english: 'really' },
                  { korean: '멋있었어', english: 'was amazing / cool' },
                  { korean: '자랑스러워', english: 'I\'m proud' },
                ],
                position: 'left',
              },
              {
                speaker: '서연',
                speakerEnglish: 'Seoyeon',
                korean: '하은이가 없었으면 여기까지 못 왔어.',
                romanization: 'haeuneuga eopseosseumyeon yeogikkaji mot wasseo.',
                english: 'I couldn\'t have made it here without you.',
                words: [
                  { korean: '없었으면', english: 'if not for / without' },
                  { korean: '여기까지', english: 'up to here' },
                  { korean: '못 왔어', english: 'couldn\'t have come' },
                ],
                position: 'right',
              },
            ],
          },
        ],
      },
    ],
  },
];

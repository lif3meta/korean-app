export interface HandwritingStep {
  id: string;
  type: 'intro' | 'stroke_order' | 'syllable_block' | 'practice';
  title: string;
  titleKorean?: string;
  // For intro/stroke_order
  character?: string;
  strokes?: string[];
  strokeCount?: number;
  tip?: string;
  // For syllable_block
  components?: { position: string; character: string; name: string }[];
  result?: string;
  explanation?: string;
  // For practice
  practiceCharacters?: string[];
}

export interface HandwritingLesson {
  id: string;
  title: string;
  titleKorean: string;
  description: string;
  order: number;
  steps: HandwritingStep[];
}

export const handwritingLessons: HandwritingLesson[] = [
  // -----------------------------------------------------------------------
  // Lesson 1: How Korean Letters Work
  // -----------------------------------------------------------------------
  {
    id: 'hw_1',
    title: 'How Korean Letters Work',
    titleKorean: '한글의 구조',
    description: 'Understand how consonants and vowels combine into syllable blocks',
    order: 1,
    steps: [
      {
        id: 'hw1_intro1',
        type: 'intro',
        title: 'Syllable Blocks',
        titleKorean: '음절 블록',
        tip: 'Korean is unique: letters are stacked into neat square blocks rather than written in a line like English.',
      },
      {
        id: 'hw1_intro2',
        type: 'intro',
        title: 'Consonants + Vowels',
        titleKorean: '자음 + 모음',
        tip: 'Every Korean syllable is made of at least one consonant and one vowel combined together. The consonant always comes first.',
      },
      {
        id: 'hw1_intro3',
        type: 'intro',
        title: 'Geometric Shapes',
        titleKorean: '기하학적 모양',
        tip: 'Consonants are built from simple geometric shapes: straight lines, circles, and squares. They were designed to represent the shape of your mouth and tongue.',
      },
      {
        id: 'hw1_intro4',
        type: 'intro',
        title: 'Vowel Strokes',
        titleKorean: '모음 획',
        tip: 'Vowels are built from vertical and horizontal lines with short branches. A vertical line (ㅣ) represents a person, a horizontal line (ㅡ) represents the earth, and a dot (now a short stroke) represents the sky.',
      },
      {
        id: 'hw1_intro5',
        type: 'intro',
        title: 'Block Structure',
        titleKorean: '블록 구조',
        tip: 'Every syllable block has at least an initial consonant and a vowel. For example, 가 = ㄱ (consonant) + ㅏ (vowel). The placement depends on the vowel shape.',
      },
      {
        id: 'hw1_intro6',
        type: 'intro',
        title: 'Final Consonant (받침)',
        titleKorean: '받침',
        tip: 'Some blocks add a final consonant at the bottom called 받침 (batchim). For example, 한 = ㅎ + ㅏ + ㄴ. The ㄴ at the bottom is the batchim.',
      },
    ],
  },

  // -----------------------------------------------------------------------
  // Lesson 2: Writing Basic Consonants
  // -----------------------------------------------------------------------
  {
    id: 'hw_2',
    title: 'Writing Basic Consonants',
    titleKorean: '자음 쓰기',
    description: 'Learn stroke order for the 10 basic Korean consonants',
    order: 2,
    steps: [
      {
        id: 'hw2_intro',
        type: 'intro',
        title: 'Basic Consonants',
        titleKorean: '기본 자음',
        tip: 'Korean has 14 basic consonants. We will start with the 10 most important ones. Always write strokes from left to right and top to bottom.',
      },
      {
        id: 'hw2_giyeok',
        type: 'stroke_order',
        title: 'Giyeok',
        titleKorean: '기역',
        character: 'ㄱ',
        strokeCount: 2,
        strokes: [
          'Draw a horizontal line from left to right',
          'From the right end, draw a vertical line straight down',
        ],
        tip: 'Think of it as an upside-down "L". This makes the "g/k" sound.',
      },
      {
        id: 'hw2_nieun',
        type: 'stroke_order',
        title: 'Nieun',
        titleKorean: '니은',
        character: 'ㄴ',
        strokeCount: 2,
        strokes: [
          'Draw a vertical line straight down',
          'From the bottom, draw a horizontal line to the right',
        ],
        tip: 'Looks like the English letter "L". This makes the "n" sound.',
      },
      {
        id: 'hw2_digeut',
        type: 'stroke_order',
        title: 'Digeut',
        titleKorean: '디귿',
        character: 'ㄷ',
        strokeCount: 3,
        strokes: [
          'Draw a horizontal line from left to right at the top',
          'From the left end, draw a vertical line straight down',
          'From the bottom, draw a horizontal line to the right',
        ],
        tip: 'Like ㄴ with a lid on top. This makes the "d/t" sound.',
      },
      {
        id: 'hw2_rieul',
        type: 'stroke_order',
        title: 'Rieul',
        titleKorean: '리을',
        character: 'ㄹ',
        strokeCount: 5,
        strokes: [
          'Draw a short horizontal line from left to right',
          'From the right end, draw a short vertical line down',
          'From the bottom, draw a short horizontal line to the left',
          'From the left end, draw a short vertical line down',
          'From the bottom, draw a horizontal line to the right',
        ],
        tip: 'A zigzag pattern. This makes the "r/l" sound. The most complex basic consonant -- practice slowly.',
      },
      {
        id: 'hw2_mieum',
        type: 'stroke_order',
        title: 'Mieum',
        titleKorean: '미음',
        character: 'ㅁ',
        strokeCount: 4,
        strokes: [
          'Draw a vertical line down on the left side',
          'From the bottom-left, draw a horizontal line to the right',
          'From the bottom-right, draw a vertical line up',
          'From the top-right, draw a horizontal line to the left to close the square',
        ],
        tip: 'A simple square shape. This makes the "m" sound. Think of a closed mouth.',
      },
      {
        id: 'hw2_bieup',
        type: 'stroke_order',
        title: 'Bieup',
        titleKorean: '비읍',
        character: 'ㅂ',
        strokeCount: 4,
        strokes: [
          'Draw a vertical line down on the left side',
          'Draw a vertical line down on the right side',
          'Connect the tops with a horizontal line',
          'Connect the bottoms with a horizontal line',
        ],
        tip: 'Looks like a bucket or the number π. This makes the "b/p" sound.',
      },
      {
        id: 'hw2_siot',
        type: 'stroke_order',
        title: 'Siot',
        titleKorean: '시옷',
        character: 'ㅅ',
        strokeCount: 2,
        strokes: [
          'Draw a diagonal line from center-top going down-left',
          'From center-top, draw a diagonal line going down-right',
        ],
        tip: 'Shaped like a tent or hat. This makes the "s" sound.',
      },
      {
        id: 'hw2_ieung',
        type: 'stroke_order',
        title: 'Ieung',
        titleKorean: '이응',
        character: 'ㅇ',
        strokeCount: 1,
        strokes: [
          'Draw a circle starting from the top, going clockwise',
        ],
        tip: 'A simple circle. As an initial consonant it is silent -- it acts as a placeholder. As a final consonant it makes the "ng" sound.',
      },
      {
        id: 'hw2_jieut',
        type: 'stroke_order',
        title: 'Jieut',
        titleKorean: '지읒',
        character: 'ㅈ',
        strokeCount: 3,
        strokes: [
          'Draw a short horizontal line at the top',
          'From center below, draw a diagonal line going down-left',
          'From the same center point, draw a diagonal line going down-right',
        ],
        tip: 'Like ㅅ with a hat on top. This makes the "j/ch" sound.',
      },
      {
        id: 'hw2_hieut',
        type: 'stroke_order',
        title: 'Hieut',
        titleKorean: '히읗',
        character: 'ㅎ',
        strokeCount: 3,
        strokes: [
          'Draw a horizontal line at the top',
          'Below center, draw a circle',
          'Add a short vertical line connecting the top line to the circle',
        ],
        tip: 'A line with a circle underneath. This makes the "h" sound. Think of it as a person wearing a hat.',
      },
      {
        id: 'hw2_practice',
        type: 'practice',
        title: 'Practice Consonants',
        titleKorean: '자음 연습',
        practiceCharacters: ['ㄱ', 'ㄴ', 'ㄷ', 'ㅁ', 'ㅅ', 'ㅇ'],
      },
    ],
  },

  // -----------------------------------------------------------------------
  // Lesson 3: Writing Vowels
  // -----------------------------------------------------------------------
  {
    id: 'hw_3',
    title: 'Writing Vowels',
    titleKorean: '모음 쓰기',
    description: 'Learn stroke order for the 8 basic Korean vowels',
    order: 3,
    steps: [
      {
        id: 'hw3_intro',
        type: 'intro',
        title: 'Basic Vowels',
        titleKorean: '기본 모음',
        tip: 'Korean vowels are made of vertical lines, horizontal lines, and short branch strokes. Vertical vowels (ㅏ, ㅓ, ㅣ) sit to the right of the consonant. Horizontal vowels (ㅗ, ㅜ, ㅡ) sit below the consonant.',
      },
      {
        id: 'hw3_a',
        type: 'stroke_order',
        title: 'A',
        titleKorean: '아',
        character: 'ㅏ',
        strokeCount: 2,
        strokes: [
          'Draw a vertical line from top to bottom',
          'From the middle-right, draw a short horizontal line to the right',
        ],
        tip: 'The branch points right. Sounds like "ah" as in "father".',
      },
      {
        id: 'hw3_eo',
        type: 'stroke_order',
        title: 'Eo',
        titleKorean: '어',
        character: 'ㅓ',
        strokeCount: 2,
        strokes: [
          'Draw a short horizontal line to the left from the middle',
          'Draw a vertical line from top to bottom',
        ],
        tip: 'The branch points left -- the mirror of ㅏ. Sounds like "uh" as in "bus".',
      },
      {
        id: 'hw3_o',
        type: 'stroke_order',
        title: 'O',
        titleKorean: '오',
        character: 'ㅗ',
        strokeCount: 2,
        strokes: [
          'Draw a short vertical line upward from center',
          'Draw a horizontal line from left to right below it',
        ],
        tip: 'The branch points up. Sounds like "oh" as in "go".',
      },
      {
        id: 'hw3_u',
        type: 'stroke_order',
        title: 'U',
        titleKorean: '우',
        character: 'ㅜ',
        strokeCount: 2,
        strokes: [
          'Draw a horizontal line from left to right',
          'From the center, draw a short vertical line downward',
        ],
        tip: 'The branch points down -- the mirror of ㅗ. Sounds like "oo" as in "moon".',
      },
      {
        id: 'hw3_eu',
        type: 'stroke_order',
        title: 'Eu',
        titleKorean: '으',
        character: 'ㅡ',
        strokeCount: 1,
        strokes: [
          'Draw a single horizontal line from left to right',
        ],
        tip: 'The simplest vowel -- just a flat line. Sounds like the "u" in "put" with lips unrounded.',
      },
      {
        id: 'hw3_i',
        type: 'stroke_order',
        title: 'I',
        titleKorean: '이',
        character: 'ㅣ',
        strokeCount: 1,
        strokes: [
          'Draw a single vertical line from top to bottom',
        ],
        tip: 'Just a straight vertical line. Sounds like "ee" as in "see".',
      },
      {
        id: 'hw3_ae',
        type: 'stroke_order',
        title: 'Ae',
        titleKorean: '애',
        character: 'ㅐ',
        strokeCount: 3,
        strokes: [
          'Draw a vertical line from top to bottom',
          'From the middle, draw a short horizontal line to the right',
          'Draw another vertical line to the right',
        ],
        tip: 'Like ㅏ with an extra vertical stroke. Sounds like "eh" as in "bed".',
      },
      {
        id: 'hw3_e',
        type: 'stroke_order',
        title: 'E',
        titleKorean: '에',
        character: 'ㅔ',
        strokeCount: 3,
        strokes: [
          'Draw a vertical line from top to bottom',
          'From the middle, draw a short horizontal line to the left',
          'Draw another vertical line to the right (or at the original position)',
        ],
        tip: 'Like ㅓ with an extra vertical stroke. Sounds like "eh" -- in modern Korean, ㅐ and ㅔ sound nearly identical.',
      },
      {
        id: 'hw3_practice',
        type: 'practice',
        title: 'Practice Vowels',
        titleKorean: '모음 연습',
        practiceCharacters: ['ㅏ', 'ㅓ', 'ㅗ', 'ㅜ', 'ㅡ', 'ㅣ'],
      },
    ],
  },

  // -----------------------------------------------------------------------
  // Lesson 4: Building Syllable Blocks
  // -----------------------------------------------------------------------
  {
    id: 'hw_4',
    title: 'Building Syllable Blocks',
    titleKorean: '음절 만들기',
    description: 'Learn how to combine letters into syllable blocks',
    order: 4,
    steps: [
      {
        id: 'hw4_intro',
        type: 'intro',
        title: 'Block Patterns',
        titleKorean: '블록 패턴',
        tip: 'There are two main block patterns: left-right (for vertical vowels like ㅏ, ㅓ, ㅣ) and top-bottom (for horizontal vowels like ㅗ, ㅜ, ㅡ). Adding a batchim creates a third layer at the bottom.',
      },
      // Left-right pattern examples
      {
        id: 'hw4_ga',
        type: 'syllable_block',
        title: 'Left-Right: 가',
        titleKorean: '좌우 패턴',
        components: [
          { position: 'Left (Initial)', character: 'ㄱ', name: 'giyeok' },
          { position: 'Right (Vowel)', character: 'ㅏ', name: 'a' },
        ],
        result: '가',
        explanation: 'The consonant ㄱ goes on the left, and the vertical vowel ㅏ goes on the right. Together they make "ga".',
      },
      {
        id: 'hw4_na',
        type: 'syllable_block',
        title: 'Left-Right: 나',
        titleKorean: '좌우 패턴',
        components: [
          { position: 'Left (Initial)', character: 'ㄴ', name: 'nieun' },
          { position: 'Right (Vowel)', character: 'ㅏ', name: 'a' },
        ],
        result: '나',
        explanation: 'ㄴ on the left + ㅏ on the right = 나 ("na"), meaning "I" or "me".',
      },
      {
        id: 'hw4_seo',
        type: 'syllable_block',
        title: 'Left-Right: 서',
        titleKorean: '좌우 패턴',
        components: [
          { position: 'Left (Initial)', character: 'ㅅ', name: 'siot' },
          { position: 'Right (Vowel)', character: 'ㅓ', name: 'eo' },
        ],
        result: '서',
        explanation: 'ㅅ on the left + ㅓ on the right = 서 ("seo"), meaning "west" or "to stand".',
      },
      // Top-bottom pattern examples
      {
        id: 'hw4_gu',
        type: 'syllable_block',
        title: 'Top-Bottom: 구',
        titleKorean: '상하 패턴',
        components: [
          { position: 'Top (Initial)', character: 'ㄱ', name: 'giyeok' },
          { position: 'Bottom (Vowel)', character: 'ㅜ', name: 'u' },
        ],
        result: '구',
        explanation: 'When the vowel is horizontal (ㅜ), the consonant sits on top. ㄱ over ㅜ = 구 ("gu"), meaning "nine".',
      },
      {
        id: 'hw4_no',
        type: 'syllable_block',
        title: 'Top-Bottom: 노',
        titleKorean: '상하 패턴',
        components: [
          { position: 'Top (Initial)', character: 'ㄴ', name: 'nieun' },
          { position: 'Bottom (Vowel)', character: 'ㅗ', name: 'o' },
        ],
        result: '노',
        explanation: 'ㄴ on top + ㅗ on the bottom = 노 ("no"), meaning "labor" or "effort".',
      },
      {
        id: 'hw4_mu',
        type: 'syllable_block',
        title: 'Top-Bottom: 무',
        titleKorean: '상하 패턴',
        components: [
          { position: 'Top (Initial)', character: 'ㅁ', name: 'mieum' },
          { position: 'Bottom (Vowel)', character: 'ㅜ', name: 'u' },
        ],
        result: '무',
        explanation: 'ㅁ on top + ㅜ on the bottom = 무 ("mu"), meaning "radish" or the prefix "non-/un-".',
      },
      // With batchim
      {
        id: 'hw4_han',
        type: 'syllable_block',
        title: 'With Batchim: 한',
        titleKorean: '받침 포함',
        components: [
          { position: 'Top-Left (Initial)', character: 'ㅎ', name: 'hieut' },
          { position: 'Top-Right (Vowel)', character: 'ㅏ', name: 'a' },
          { position: 'Bottom (Final)', character: 'ㄴ', name: 'nieun' },
        ],
        result: '한',
        explanation: 'Initial ㅎ + vowel ㅏ on the right + final ㄴ at the bottom = 한 ("han"). The bottom consonant is the 받침 (batchim).',
      },
      {
        id: 'hw4_geul',
        type: 'syllable_block',
        title: 'With Batchim: 글',
        titleKorean: '받침 포함',
        components: [
          { position: 'Top (Initial)', character: 'ㄱ', name: 'giyeok' },
          { position: 'Middle (Vowel)', character: 'ㅡ', name: 'eu' },
          { position: 'Bottom (Final)', character: 'ㄹ', name: 'rieul' },
        ],
        result: '글',
        explanation: 'ㄱ on top + horizontal vowel ㅡ in the middle + ㄹ at the bottom = 글 ("geul"), meaning "writing".',
      },
      {
        id: 'hw4_bap',
        type: 'syllable_block',
        title: 'With Batchim: 밥',
        titleKorean: '받침 포함',
        components: [
          { position: 'Top-Left (Initial)', character: 'ㅂ', name: 'bieup' },
          { position: 'Top-Right (Vowel)', character: 'ㅏ', name: 'a' },
          { position: 'Bottom (Final)', character: 'ㅂ', name: 'bieup' },
        ],
        result: '밥',
        explanation: 'ㅂ + ㅏ + ㅂ = 밥 ("bap"), meaning "rice/meal". Notice the same consonant can appear as both initial and final.',
      },
      {
        id: 'hw4_practice',
        type: 'practice',
        title: 'Practice Syllable Blocks',
        titleKorean: '음절 연습',
        practiceCharacters: ['가', '나', '구', '한', '글'],
      },
    ],
  },

  // -----------------------------------------------------------------------
  // Lesson 5: Writing Your First Words
  // -----------------------------------------------------------------------
  {
    id: 'hw_5',
    title: 'Writing Your First Words',
    titleKorean: '첫 단어 쓰기',
    description: 'Practice writing complete Korean words block by block',
    order: 5,
    steps: [
      {
        id: 'hw5_intro',
        type: 'intro',
        title: 'Putting It All Together',
        titleKorean: '모두 합치기',
        tip: 'Now let us write real Korean words. Each word is made of syllable blocks written left to right. Focus on writing each block neatly before moving to the next.',
      },
      // 한글 breakdown
      {
        id: 'hw5_hangeul_1',
        type: 'syllable_block',
        title: 'Hangul: Block 1',
        titleKorean: '한글 - 첫 번째',
        components: [
          { position: 'Top-Left (Initial)', character: 'ㅎ', name: 'hieut' },
          { position: 'Top-Right (Vowel)', character: 'ㅏ', name: 'a' },
          { position: 'Bottom (Final)', character: 'ㄴ', name: 'nieun' },
        ],
        result: '한',
        explanation: 'The first block of 한글 (Hangul). ㅎ + ㅏ + ㄴ = 한.',
      },
      {
        id: 'hw5_hangeul_2',
        type: 'syllable_block',
        title: 'Hangul: Block 2',
        titleKorean: '한글 - 두 번째',
        components: [
          { position: 'Top (Initial)', character: 'ㄱ', name: 'giyeok' },
          { position: 'Middle (Vowel)', character: 'ㅡ', name: 'eu' },
          { position: 'Bottom (Final)', character: 'ㄹ', name: 'rieul' },
        ],
        result: '글',
        explanation: 'The second block of 한글. ㄱ + ㅡ + ㄹ = 글. Together: 한글 means "Hangul" -- the Korean writing system!',
      },
      // 가방 breakdown
      {
        id: 'hw5_gabang_1',
        type: 'syllable_block',
        title: 'Bag: Block 1',
        titleKorean: '가방 - 첫 번째',
        components: [
          { position: 'Left (Initial)', character: 'ㄱ', name: 'giyeok' },
          { position: 'Right (Vowel)', character: 'ㅏ', name: 'a' },
        ],
        result: '가',
        explanation: 'The first block of 가방 (bag). Simple left-right pattern: ㄱ + ㅏ = 가.',
      },
      {
        id: 'hw5_gabang_2',
        type: 'syllable_block',
        title: 'Bag: Block 2',
        titleKorean: '가방 - 두 번째',
        components: [
          { position: 'Top-Left (Initial)', character: 'ㅂ', name: 'bieup' },
          { position: 'Top-Right (Vowel)', character: 'ㅏ', name: 'a' },
          { position: 'Bottom (Final)', character: 'ㅇ', name: 'ieung (ng)' },
        ],
        result: '방',
        explanation: 'ㅂ + ㅏ + ㅇ = 방 ("bang"). Here ㅇ as a batchim makes the "ng" sound. Together: 가방 means "bag".',
      },
      // 사랑 breakdown
      {
        id: 'hw5_sarang_1',
        type: 'syllable_block',
        title: 'Love: Block 1',
        titleKorean: '사랑 - 첫 번째',
        components: [
          { position: 'Left (Initial)', character: 'ㅅ', name: 'siot' },
          { position: 'Right (Vowel)', character: 'ㅏ', name: 'a' },
        ],
        result: '사',
        explanation: 'The first block of 사랑 (love). ㅅ + ㅏ = 사 ("sa").',
      },
      {
        id: 'hw5_sarang_2',
        type: 'syllable_block',
        title: 'Love: Block 2',
        titleKorean: '사랑 - 두 번째',
        components: [
          { position: 'Top-Left (Initial)', character: 'ㄹ', name: 'rieul' },
          { position: 'Top-Right (Vowel)', character: 'ㅏ', name: 'a' },
          { position: 'Bottom (Final)', character: 'ㅇ', name: 'ieung (ng)' },
        ],
        result: '랑',
        explanation: 'ㄹ + ㅏ + ㅇ = 랑 ("rang"). Together: 사랑 means "love"!',
      },
      // 한국 breakdown
      {
        id: 'hw5_hanguk_1',
        type: 'syllable_block',
        title: 'Korea: Block 1',
        titleKorean: '한국 - 첫 번째',
        components: [
          { position: 'Top-Left (Initial)', character: 'ㅎ', name: 'hieut' },
          { position: 'Top-Right (Vowel)', character: 'ㅏ', name: 'a' },
          { position: 'Bottom (Final)', character: 'ㄴ', name: 'nieun' },
        ],
        result: '한',
        explanation: 'You already know this block! ㅎ + ㅏ + ㄴ = 한.',
      },
      {
        id: 'hw5_hanguk_2',
        type: 'syllable_block',
        title: 'Korea: Block 2',
        titleKorean: '한국 - 두 번째',
        components: [
          { position: 'Top (Initial)', character: 'ㄱ', name: 'giyeok' },
          { position: 'Middle (Vowel)', character: 'ㅜ', name: 'u' },
          { position: 'Bottom (Final)', character: 'ㄱ', name: 'giyeok' },
        ],
        result: '국',
        explanation: 'ㄱ + ㅜ + ㄱ = 국 ("guk"). Together: 한국 means "Korea"! You can now write the name of the country.',
      },
      {
        id: 'hw5_practice',
        type: 'practice',
        title: 'Write Complete Words',
        titleKorean: '단어 쓰기',
        practiceCharacters: ['한글', '가방', '사랑', '한국'],
      },
    ],
  },
];

export function getHandwritingLessonById(id: string): HandwritingLesson | undefined {
  return handwritingLessons.find((l) => l.id === id);
}

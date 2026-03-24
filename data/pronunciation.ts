export interface PronunciationLesson {
  id: string;
  title: string;
  titleKorean: string;
  order: number;
  description: string;
  sections: {
    heading: string;
    explanation: string;
    examples: { korean: string; romanization: string; english: string; audioTip?: string }[];
    tip?: string;
  }[];
}

export const pronunciationLessons: PronunciationLesson[] = [
  {
    id: 'pron_vowels',
    title: 'Vowel Sounds',
    titleKorean: '모음 발음',
    order: 1,
    description: 'Master all Korean vowel sounds with correct mouth positions and avoid common English-speaker mistakes.',
    sections: [
      {
        heading: 'The 10 Basic Vowels',
        explanation:
          'Korean has 10 basic vowels. Unlike English, each vowel has ONE consistent sound. Your mouth shape is everything -- get it right and you will sound natural from day one.',
        examples: [
          { korean: 'ㅏ', romanization: 'a', english: 'Like "a" in "father" -- open your mouth wide, tongue flat', audioTip: 'Keep jaw dropped low' },
          { korean: 'ㅓ', romanization: 'eo', english: 'Like "u" in "bus" -- open mouth, tongue slightly back', audioTip: 'More open than English "o"' },
          { korean: 'ㅗ', romanization: 'o', english: 'Like "o" in "go" but shorter -- round lips, push forward', audioTip: 'Lips form a small circle' },
          { korean: 'ㅜ', romanization: 'u', english: 'Like "oo" in "moon" -- round lips tightly', audioTip: 'Tighter lips than ㅗ' },
          { korean: 'ㅡ', romanization: 'eu', english: 'No English equivalent -- spread lips wide, say "uh" through a thin smile', audioTip: 'Like saying "uh" while smiling' },
          { korean: 'ㅣ', romanization: 'i', english: 'Like "ee" in "see" -- spread lips, tongue high and forward', audioTip: 'Big smile shape' },
          { korean: 'ㅐ', romanization: 'ae', english: 'Like "e" in "bed" -- mouth open medium width', audioTip: 'Between "a" and "e"' },
          { korean: 'ㅔ', romanization: 'e', english: 'Like "e" in "hey" -- nearly identical to ㅐ in modern Korean', audioTip: 'Slightly narrower than ㅐ' },
          { korean: 'ㅚ', romanization: 'oe', english: 'Sounds like "we" in modern pronunciation -- originally a rounded "e"', audioTip: 'Most Koreans say "we"' },
          { korean: 'ㅟ', romanization: 'wi', english: 'Like "wee" in "week" -- round lips then spread', audioTip: 'Start round, end spread' },
        ],
        tip: 'In modern Seoul Korean, ㅐ and ㅔ sound nearly identical. Even native speakers mix them up in writing. Do not stress over the difference.',
      },
      {
        heading: 'Tricky Pairs: ㅓ vs ㅗ',
        explanation:
          'This is the number one vowel mistake for English speakers. Both sound like "o" to untrained ears, but they are completely different. ㅓ (eo) has an OPEN jaw -- think "uh" with a wider mouth. ㅗ (o) has ROUNDED, pushed-forward lips -- think a short "oh."',
        examples: [
          { korean: '서울', romanization: 'Seoul', english: 'Seoul (the capital) -- both vowels are ㅓ, NOT "o"', audioTip: 'Say "Suh-ool" not "So-ol"' },
          { korean: '소리', romanization: 'sori', english: 'Sound -- this one uses ㅗ with round lips', audioTip: 'Round lips for the first syllable' },
          { korean: '저', romanization: 'jeo', english: 'I/me (formal) -- open jaw, NOT "jo"', audioTip: 'Drop your jaw for ㅓ' },
          { korean: '조', romanization: 'jo', english: 'A family name -- round lips pushed forward', audioTip: 'Lips make a circle for ㅗ' },
        ],
        tip: 'Test yourself: say "uh" (jaw drops) then "oh" (lips round). That is the core difference between ㅓ and ㅗ.',
      },
      {
        heading: 'Tricky Pairs: ㅡ vs ㅜ',
        explanation:
          'Another pair that confuses learners. ㅡ (eu) is a SPREAD, unrounded vowel -- your lips make a flat line. ㅜ (u) is ROUNDED -- your lips push forward into a tight circle.',
        examples: [
          { korean: '그', romanization: 'geu', english: 'He/that -- spread your lips flat', audioTip: 'Thin smile, say "uh"' },
          { korean: '구', romanization: 'gu', english: 'Nine -- round your lips tight', audioTip: 'Purse lips like whistling' },
          { korean: '음식', romanization: 'eumsik', english: 'Food -- starts with spread ㅡ', audioTip: 'Flat lips for first syllable' },
          { korean: '우유', romanization: 'uyu', english: 'Milk -- round ㅜ then spread ㅣ then round ㅜ', audioTip: 'Lips go round-spread-round' },
        ],
      },
      {
        heading: 'Compound Vowels (Y-vowels)',
        explanation:
          'Adding a short "y" glide before basic vowels creates compound vowels. These are fast -- the "y" is just a quick tongue flick, not a full syllable.',
        examples: [
          { korean: 'ㅑ', romanization: 'ya', english: '"ya" as in "yacht"', audioTip: 'Quick y then open wide' },
          { korean: 'ㅕ', romanization: 'yeo', english: '"yuh" -- quick y then open ㅓ', audioTip: 'Fast y-glide into "uh"' },
          { korean: 'ㅛ', romanization: 'yo', english: '"yo" -- quick y then round ㅗ', audioTip: 'Lips round after the y' },
          { korean: 'ㅠ', romanization: 'yu', english: '"yoo" -- quick y then tight ㅜ', audioTip: 'Like English "you"' },
          { korean: 'ㅒ', romanization: 'yae', english: '"ye" as in "yeah" -- y + ㅐ', audioTip: 'Quick y then open "e"' },
        ],
        tip: 'W-based compound vowels (ㅘ, ㅝ, ㅙ, ㅞ) combine a round lip start with a different ending. Practice transitioning lip shapes quickly.',
      },
    ],
  },
  {
    id: 'pron_consonants',
    title: 'Consonant Sounds',
    titleKorean: '자음 발음',
    order: 2,
    description: 'The three-way consonant distinction (plain, aspirated, tense) is THE hardest part for English speakers. Master it here.',
    sections: [
      {
        heading: 'The Three-Way Distinction',
        explanation:
          'English has voiced (b, d, g) vs voiceless (p, t, k). Korean has a COMPLETELY different system: Plain (lax), Aspirated (breathy), and Tense (stiff). None of these map perfectly to English sounds. Plain consonants are soft and can sound voiced between vowels. Aspirated consonants have a strong burst of air. Tense consonants are produced with tight throat muscles and NO air burst.',
        examples: [
          { korean: 'ㄱ / ㅋ / ㄲ', romanization: 'g(k) / k / kk', english: 'Plain / Aspirated / Tense -- the "k" family', audioTip: 'Hold paper near lips -- ㅋ moves it, ㄲ does not' },
          { korean: 'ㄷ / ㅌ / ㄸ', romanization: 'd(t) / t / tt', english: 'Plain / Aspirated / Tense -- the "t" family', audioTip: 'ㅌ has a strong puff of air' },
          { korean: 'ㅂ / ㅍ / ㅃ', romanization: 'b(p) / p / pp', english: 'Plain / Aspirated / Tense -- the "p" family', audioTip: 'ㅃ requires tight throat, no air' },
          { korean: 'ㅈ / ㅊ / ㅉ', romanization: 'j / ch / jj', english: 'Plain / Aspirated / Tense -- the "j/ch" family', audioTip: 'ㅊ is like "ch" with extra breath' },
          { korean: 'ㅅ / ㅆ', romanization: 's / ss', english: 'Plain / Tense -- the "s" family (no aspirated version)', audioTip: 'ㅆ is sharper with tense throat' },
        ],
        tip: 'The easiest trick: hold your hand in front of your mouth. Aspirated sounds (ㅋ, ㅌ, ㅍ, ㅊ) should produce a noticeable puff of air. Tense sounds (ㄲ, ㄸ, ㅃ, ㅉ, ㅆ) should produce almost none.',
      },
      {
        heading: 'Plain Consonants (예사소리)',
        explanation:
          'Plain consonants are the "default" Korean sounds. At the start of a word, they sound closer to unvoiced English consonants (k, t, p). Between vowels, they become softer and can sound voiced (g, d, b). This voicing change is automatic -- do not fight it.',
        examples: [
          { korean: '가다', romanization: 'gada', english: 'To go -- ㄱ sounds like soft "g" between vowels', audioTip: 'First ㄱ is light, second ㄷ is soft "d"' },
          { korean: '바다', romanization: 'bada', english: 'Sea/ocean -- ㅂ sounds like soft "b"', audioTip: 'Gentle, no strong puff' },
          { korean: '도시', romanization: 'dosi', english: 'City -- ㄷ at the start is a light "d/t"', audioTip: 'Softer than English "d"' },
        ],
        tip: 'Plain consonants are the hardest for English speakers because they fall BETWEEN English voiced and voiceless. Do not try to force them into English categories.',
      },
      {
        heading: 'Aspirated Consonants (거센소리)',
        explanation:
          'Aspirated consonants have a strong, breathy release of air. Think of saying English "k" in "kite" or "p" in "pie" with EXTRA force. The burst of air is the defining feature.',
        examples: [
          { korean: '카드', romanization: 'kadeu', english: 'Card -- strong K with air blast', audioTip: 'Big puff of air on ㅋ' },
          { korean: '타다', romanization: 'tada', english: 'To ride -- strong T with breath', audioTip: 'Feel the air hit your palm' },
          { korean: '파란', romanization: 'paran', english: 'Blue -- strong P with air burst', audioTip: 'More breath than English "p"' },
          { korean: '치킨', romanization: 'chikin', english: 'Chicken (fried chicken!) -- strong CH', audioTip: 'Explosive "ch" sound' },
        ],
      },
      {
        heading: 'Tense Consonants (된소리)',
        explanation:
          'Tense consonants are unique to Korean. Tighten your throat muscles, build up pressure, and release the sound with NO air. Your vocal cords should feel stiff. Think of the sound you make when straining to lift something heavy -- that throat tension is what you need.',
        examples: [
          { korean: '빠르다', romanization: 'ppareuda', english: 'To be fast -- tight ㅃ, no air', audioTip: 'Squeeze your throat, block the air' },
          { korean: '뜨겁다', romanization: 'tteugeopda', english: 'To be hot -- tight ㄸ sound', audioTip: 'Throat tense, sharp release' },
          { korean: '까만', romanization: 'kkaman', english: 'Black -- tight ㄲ with no breath', audioTip: 'Glottis closed, then pop' },
          { korean: '쓰다', romanization: 'sseuda', english: 'To write / to be bitter -- sharp ㅆ', audioTip: 'Tense "ss" with stiff tongue' },
          { korean: '짜다', romanization: 'jjada', english: 'To be salty -- tight ㅉ', audioTip: 'Like "j" but with clenched throat' },
        ],
        tip: 'Practice tense sounds by saying English "sky, sty, spy" -- the k, t, p in these words are close to Korean tense consonants because English removes aspiration after "s."',
      },
      {
        heading: 'Special Consonants',
        explanation:
          'Some Korean consonants do not fit the three-way pattern. The nasals (ㄴ, ㅁ, ㅇ) and the liquid (ㄹ) have their own behavior. The silent ㅇ at the start of a syllable simply means "no consonant here" -- it is a placeholder.',
        examples: [
          { korean: 'ㄴ', romanization: 'n', english: 'Like English "n" -- tongue touches ridge behind upper teeth', audioTip: 'Same as English "n"' },
          { korean: 'ㅁ', romanization: 'm', english: 'Like English "m" -- lips press together', audioTip: 'Same as English "m"' },
          { korean: 'ㅇ', romanization: 'ng (final)', english: 'Silent at start of syllable; "ng" as in "sing" at the end', audioTip: 'Back of tongue touches soft palate' },
          { korean: 'ㅎ', romanization: 'h', english: 'Like English "h" but can disappear between vowels', audioTip: 'Breathy, often weakens in speech' },
        ],
      },
    ],
  },
  {
    id: 'pron_sound_changes',
    title: 'Sound Change Rules',
    titleKorean: '음운 변동',
    order: 3,
    description: 'Korean spelling and pronunciation often differ because of automatic sound change rules. Learn the patterns to decode real spoken Korean.',
    sections: [
      {
        heading: 'Linking (연음화)',
        explanation:
          'When a syllable ends with a consonant (batchim) and the next syllable starts with ㅇ (silent placeholder), the final consonant "moves" to become the initial sound of the next syllable. This is the most basic and common sound change. Written syllable boundaries shift in speech.',
        examples: [
          { korean: '한국어', romanization: '[han-gu-geo]', english: 'Korean language -- the ㄱ batchim links to 어', audioTip: 'Say "han-gu-geo" not "han-guk-eo"' },
          { korean: '먹어요', romanization: '[meo-geo-yo]', english: 'I eat -- the ㄱ batchim links to 어', audioTip: 'ㄱ slides into next syllable' },
          { korean: '있어요', romanization: '[i-sseo-yo]', english: 'There is / I have -- ㅆ links to 어', audioTip: 'Double ㅆ carries over fully' },
          { korean: '읽어요', romanization: '[il-geo-yo]', english: 'I read -- ㄹ stays, ㄱ links to 어', audioTip: 'Double batchim splits: ㄹ stays, ㄱ moves' },
        ],
        tip: 'Linking is why Korean sounds so smooth and flowing. Syllables blend together like links in a chain.',
      },
      {
        heading: 'Nasalization (비음화)',
        explanation:
          'When a stop consonant (ㄱ, ㄷ, ㅂ) appears before a nasal (ㄴ, ㅁ), it becomes the corresponding nasal sound: ㄱ becomes ㅇ[ng], ㄷ becomes ㄴ, ㅂ becomes ㅁ. This makes the transition between syllables smoother for your mouth.',
        examples: [
          { korean: '합니다', romanization: '[ham-ni-da]', english: 'I do (formal) -- ㅂ before ㄴ becomes ㅁ', audioTip: 'Say "ham-ni-da" not "hap-ni-da"' },
          { korean: '먹는', romanization: '[meong-neun]', english: 'Eating (modifier) -- ㄱ before ㄴ becomes ㅇ', audioTip: 'ㄱ nasalizes to "ng"' },
          { korean: '십만', romanization: '[sim-man]', english: '100,000 -- ㅂ before ㅁ becomes ㅁ', audioTip: 'Both syllables end with "m" sound' },
          { korean: '읽는', romanization: '[ing-neun]', english: 'Reading (modifier) -- ㄱ before ㄴ nasalizes', audioTip: 'The whole cluster simplifies' },
        ],
        tip: 'Nasalization is automatic. If you try to actually pronounce ㅂ + ㄴ without nasalizing, it will sound unnatural and be difficult. Your mouth WANTS to nasalize here.',
      },
      {
        heading: 'Aspiration (격음화)',
        explanation:
          'When ㅎ meets a plain stop consonant (ㄱ, ㄷ, ㅂ, ㅈ), they combine into the aspirated version (ㅋ, ㅌ, ㅍ, ㅊ). This happens regardless of which comes first -- ㅎ can be in the batchim or at the start of the next syllable.',
        examples: [
          { korean: '축하', romanization: '[chu-ka]', english: 'Congratulations -- ㄱ + ㅎ becomes ㅋ', audioTip: 'ㅎ turns the ㄱ into ㅋ' },
          { korean: '놓다', romanization: '[no-ta]', english: 'To put/place -- ㅎ + ㄷ becomes ㅌ', audioTip: 'ㅎ batchim fuses with ㄷ' },
          { korean: '좋다', romanization: '[jo-ta]', english: 'To be good -- ㅎ + ㄷ becomes ㅌ', audioTip: 'Say "jo-ta" not "joh-da"' },
          { korean: '입학', romanization: '[i-pak]', english: 'Enrollment -- ㅂ + ㅎ becomes ㅍ', audioTip: 'The ㅎ boosts aspiration' },
        ],
        tip: 'This rule explains why 좋다 (to be good) is pronounced [jo-ta] and not [joh-da]. The ㅎ disappears by merging into the next consonant.',
      },
      {
        heading: 'Palatalization (구개음화)',
        explanation:
          'When ㄷ or ㅌ batchim is followed by the vowel ㅣ (via a suffix), they change to ㅈ or ㅊ respectively. The "i" vowel pulls the tongue forward to the palate, changing the consonant.',
        examples: [
          { korean: '같이', romanization: '[ga-chi]', english: 'Together -- ㅌ before ㅣ becomes ㅊ', audioTip: 'Say "ga-chi" not "gat-i"' },
          { korean: '굳이', romanization: '[gu-ji]', english: 'Insistently / deliberately -- ㄷ before ㅣ becomes ㅈ', audioTip: 'Say "gu-ji" not "gud-i"' },
          { korean: '해돋이', romanization: '[hae-do-ji]', english: 'Sunrise -- ㄷ before ㅣ becomes ㅈ', audioTip: 'The ㄷ shifts to ㅈ' },
        ],
        tip: 'Palatalization only happens when ㅣ comes from a suffix (like -이). It does not apply within a single word root.',
      },
      {
        heading: 'ㄹ Nasalization (유음화 / 비음화)',
        explanation:
          'When ㄹ meets ㄴ or ㄴ meets ㄹ, they usually both become ㄹ. This is called lateralization. In some cases, ㄹ can also trigger nasalization. The result depends on the specific combination.',
        examples: [
          { korean: '설날', romanization: '[seol-lal]', english: 'Lunar New Year -- ㄴ after ㄹ becomes ㄹ', audioTip: 'Both become "l" sounds' },
          { korean: '신라', romanization: '[sil-la]', english: 'Silla (ancient kingdom) -- ㄴ before ㄹ becomes ㄹ', audioTip: 'ㄴ assimilates to ㄹ' },
          { korean: '연락', romanization: '[yeol-lak]', english: 'Contact -- ㄴ + ㄹ becomes ㄹ + ㄹ', audioTip: 'Double "l" sound' },
        ],
      },
    ],
  },
  {
    id: 'pron_batchim',
    title: 'Batchim (Final Consonants)',
    titleKorean: '받침',
    order: 4,
    description: 'Korean syllables can end with a consonant called batchim. Only 7 sounds are possible in final position, no matter what is written.',
    sections: [
      {
        heading: 'The 7 Representative Batchim Sounds',
        explanation:
          'Korean has many consonants, but in syllable-final position (batchim), only 7 sounds are actually pronounced. Multiple written consonants collapse into one of these 7. This is a fundamental rule of Korean pronunciation.',
        examples: [
          { korean: 'ㄱ [k]', romanization: 'k (unreleased)', english: 'ㄱ, ㅋ, ㄲ all become [k] -- tongue touches back of mouth, held without release', audioTip: 'Start saying "k" but do not release the air' },
          { korean: 'ㄴ [n]', romanization: 'n', english: 'ㄴ stays [n] -- tongue tip behind upper teeth', audioTip: 'Same as English "n" at end of "sun"' },
          { korean: 'ㄷ [t]', romanization: 't (unreleased)', english: 'ㄷ, ㅌ, ㅅ, ㅆ, ㅈ, ㅊ, ㅎ all become [t]', audioTip: 'Tongue tip stops behind teeth, no pop' },
          { korean: 'ㄹ [l]', romanization: 'l', english: 'ㄹ becomes [l] -- tongue curls up behind teeth', audioTip: 'Like English "l" in "feel"' },
          { korean: 'ㅁ [m]', romanization: 'm', english: 'ㅁ stays [m] -- lips close together', audioTip: 'Same as English "m" at end of "ham"' },
          { korean: 'ㅂ [p]', romanization: 'p (unreleased)', english: 'ㅂ, ㅍ all become [p] -- lips close, held without release', audioTip: 'Close lips but do not pop' },
          { korean: 'ㅇ [ng]', romanization: 'ng', english: 'ㅇ as batchim is [ng] -- back of tongue touches soft palate', audioTip: 'Like "ng" in "sing"' },
        ],
        tip: 'The key concept: batchim consonants are UNRELEASED. When English speakers say "cat," they release the final "t" with a puff. In Korean, your tongue/lips reach the position but STOP there with no release.',
      },
      {
        heading: 'Unreleased Stops in Practice',
        explanation:
          'The most common mistake English speakers make is releasing final consonants. In Korean, ㄱ, ㄷ, ㅂ in final position are held in place silently. Your mouth closes to the position but no air escapes.',
        examples: [
          { korean: '먹', romanization: 'meok', english: 'Eat (stem) -- tongue goes to "k" position and stops', audioTip: 'Hold the back of tongue up, no release' },
          { korean: '옷', romanization: 'ot', english: 'Clothes -- tongue goes to "t" position and stops', audioTip: 'Note: ㅅ batchim sounds like [t]' },
          { korean: '밥', romanization: 'bap', english: 'Rice/meal -- lips close to "p" position and stop', audioTip: 'Lips shut, no puff of air' },
          { korean: '꽃', romanization: 'kkot', english: 'Flower -- ㅊ batchim also sounds like [t]', audioTip: 'Written ㅊ, pronounced [t]' },
        ],
        tip: 'Practice by saying English words but freezing at the final consonant: "ba-" (stop with lips closed), "boo-" (stop with tongue back), "be-" (stop with tongue tip up).',
      },
      {
        heading: 'Double Batchim (겹받침)',
        explanation:
          'Some syllables are written with TWO consonants in batchim position (like ㄳ, ㄵ, ㄶ, ㄺ, ㄻ, ㄼ, ㄽ, ㄾ, ㄿ, ㅀ, ㅄ). When the syllable stands alone or is followed by a consonant, only ONE of the two is pronounced. Which one depends on the specific combination.',
        examples: [
          { korean: '삶', romanization: 'sam', english: 'Life -- ㄻ batchim, pronounce ㅁ', audioTip: 'ㄹ is silent, only ㅁ sounds' },
          { korean: '읽다', romanization: 'ikda', english: 'To read -- ㄺ batchim, pronounce ㄱ', audioTip: 'ㄹ is silent before consonant' },
          { korean: '없다', romanization: 'eopda', english: 'To not exist -- ㅄ batchim, pronounce ㅂ', audioTip: 'ㅅ drops, only ㅂ sounds' },
          { korean: '닭', romanization: 'dak', english: 'Chicken -- ㄺ batchim, pronounce ㄱ', audioTip: 'ㄹ drops when alone' },
        ],
        tip: 'General rule: most double batchim pronounce the LEFT consonant. Exceptions include ㄺ, ㄻ, ㄿ where the RIGHT consonant is usually pronounced.',
      },
      {
        heading: 'Batchim Before Vowels',
        explanation:
          'When a syllable with batchim is followed by a syllable starting with ㅇ (vowel), the batchim consonant links to the next syllable. For double batchim, the first consonant stays and the second one moves forward.',
        examples: [
          { korean: '닭이', romanization: '[dal-gi]', english: 'Chicken (subject) -- ㄹ stays, ㄱ links to 이', audioTip: 'Double batchim splits across syllables' },
          { korean: '없어요', romanization: '[eop-seo-yo]', english: 'There is not -- ㅂ stays, ㅅ links to 어', audioTip: 'Both consonants get pronounced' },
          { korean: '읽어요', romanization: '[il-geo-yo]', english: 'I read -- ㄹ stays, ㄱ links to 어', audioTip: 'ㄹ and ㄱ both sound' },
        ],
      },
    ],
  },
  {
    id: 'pron_intonation',
    title: 'Intonation & Rhythm',
    titleKorean: '억양과 리듬',
    order: 5,
    description: 'Korean rhythm is fundamentally different from English. Learn how to sound natural with correct timing and pitch patterns.',
    sections: [
      {
        heading: 'Syllable-Timed vs Stress-Timed',
        explanation:
          'English is STRESS-timed: some syllables are long and loud, others are swallowed. "CON-ver-SA-tion" has a rhythm of STRONG-weak-STRONG-weak. Korean is SYLLABLE-timed: every syllable gets roughly equal length and emphasis. This flat, even rhythm is the single biggest factor in sounding natural. Do NOT stress random syllables.',
        examples: [
          { korean: '감사합니다', romanization: 'gam-sa-ham-ni-da', english: 'Thank you -- each syllable gets equal time', audioTip: 'Da-da-da-da-da, even rhythm' },
          { korean: '안녕하세요', romanization: 'an-nyeong-ha-se-yo', english: 'Hello -- five syllables, all equal', audioTip: 'Do not stress any single syllable' },
          { korean: '대한민국', romanization: 'dae-han-min-guk', english: 'Republic of Korea -- four even beats', audioTip: 'Like a metronome: tick-tick-tick-tick' },
        ],
        tip: 'Record yourself saying Korean words and check: are all syllables the same length? English speakers unconsciously stress syllables, creating a bumpy rhythm that sounds foreign in Korean.',
      },
      {
        heading: 'Statement Intonation (Falling)',
        explanation:
          'Korean statements generally fall in pitch at the end. The final syllable drops in tone, signaling that you are done speaking. This is similar to English statements but the overall contour is flatter because there is no stress-based melody.',
        examples: [
          { korean: '좋아요.', romanization: 'joayo', english: 'I like it. -- pitch falls on 요', audioTip: 'Voice drops down on final 요' },
          { korean: '알겠습니다.', romanization: 'algesseumnida', english: 'I understand. -- falls at the end', audioTip: 'Final -다 is low and falling' },
          { korean: '집에 가요.', romanization: 'jibe gayo', english: 'I am going home. -- gentle fall', audioTip: 'Steady then drops on last syllable' },
        ],
      },
      {
        heading: 'Question Intonation (Rising)',
        explanation:
          'Yes/no questions in Korean rise sharply at the end. This is crucial because Korean can form questions just by changing intonation, without changing the sentence structure at all. The SAME words with rising tone become a question.',
        examples: [
          { korean: '좋아요?', romanization: 'joayo?', english: 'Do you like it? -- pitch rises on 요', audioTip: 'Voice goes UP on final 요' },
          { korean: '한국 사람이에요?', romanization: 'hanguk sarami-eyo?', english: 'Are you Korean? -- strong rise at end', audioTip: 'Rising pitch signals the question' },
          { korean: '뭐 해요?', romanization: 'mwo haeyo?', english: 'What are you doing? -- rises on 요', audioTip: 'WH-questions also rise in Korean' },
        ],
        tip: 'Unlike English where WH-questions fall ("Where are YOU going?"), Korean WH-questions often RISE. This trips up English speakers who instinctively drop pitch on question words.',
      },
      {
        heading: 'Emotional Intonation',
        explanation:
          'Korean uses pitch and length to express emotions. Surprise stretches the final syllable. Excitement raises overall pitch. Disappointment drops everything low. K-drama actors exaggerate these patterns, which actually makes them great study material.',
        examples: [
          { korean: '진짜?!', romanization: 'jinjja?!', english: 'Really?! -- high pitch, stretched, rising', audioTip: 'Stretch the 짜, go high' },
          { korean: '아 진짜...', romanization: 'a jinjja...', english: 'Ugh, seriously... -- flat, low, dragging', audioTip: 'Low and drawn out = annoyed' },
          { korean: '대박!', romanization: 'daebak!', english: 'Amazing! -- sharp, punchy, high energy', audioTip: 'Quick and emphatic' },
          { korean: '맛있겠다~', romanization: 'masitgetda~', english: 'That looks delicious~ -- rising, drawn out', audioTip: 'Stretch and rise on 다~' },
        ],
      },
      {
        heading: 'Sentence Rhythm and Phrasing',
        explanation:
          'In longer sentences, Korean groups words into breath groups with brief pauses between them. The verb always comes at the end, and the final syllable carries the most important intonation cue. Particles (은/는, 이/가, 을/를) attach tightly to the preceding word with no pause.',
        examples: [
          { korean: '저는 / 한국어를 / 공부해요.', romanization: 'jeoneun / hangugeoreul / gongbuhaeyo.', english: 'I / Korean / study. -- three breath groups', audioTip: 'Brief pauses between groups' },
          { korean: '오늘 / 날씨가 / 정말 좋아요.', romanization: 'oneul / nalssiga / jeongmal joayo.', english: 'Today / weather / really good. -- natural phrasing', audioTip: 'Group subject + particle together' },
        ],
        tip: 'Korean listeners parse meaning from the END of the sentence. The verb/adjective at the end plus its intonation tells them whether you are stating, asking, suggesting, or commanding.',
      },
    ],
  },
  {
    id: 'pron_natural_speech',
    title: 'Natural Speech Patterns',
    titleKorean: '자연스러운 말하기',
    order: 6,
    description: 'Sound like a real Korean speaker by mastering contractions, connected speech, filler words, and casual speed patterns.',
    sections: [
      {
        heading: 'Common Contractions',
        explanation:
          'In everyday spoken Korean, words and endings get shortened significantly. Textbooks teach the full forms, but real conversations use contractions constantly. Learning these will dramatically improve both your listening comprehension and natural-sounding speech.',
        examples: [
          { korean: '것이 -> 게', romanization: 'geosi -> ge', english: '"Thing" + subject marker contracts to 게', audioTip: 'Full form sounds stiff in speech' },
          { korean: '하는 것 -> 하는 거', romanization: 'haneun geot -> haneun geo', english: '"Doing thing" -- 것 shortens to 거 in speech', audioTip: 'Almost always 거 in casual talk' },
          { korean: '나는 -> 난', romanization: 'naneun -> nan', english: 'I (topic) -- drops the middle syllable', audioTip: '"Nan" is standard in speech' },
          { korean: '무엇 -> 뭐', romanization: 'mueot -> mwo', english: 'What -- heavily contracted', audioTip: 'Nobody says 무엇 in conversation' },
          { korean: '어디에 -> 어디', romanization: 'eodie -> eodi', english: 'Where -- the location particle 에 drops', audioTip: 'Particle often implied' },
        ],
        tip: 'Using full, uncontracted forms in casual speech marks you as a textbook learner. Start using contractions early -- Koreans will understand you better.',
      },
      {
        heading: 'Speed Reduction in Casual Speech',
        explanation:
          'Casual Korean is FAST. Syllables merge, vowels shorten, and entire endings get swallowed. The honorific -요 can sound like a quick "-yo" tacked on. In very casual speech between friends, whole grammatical endings disappear.',
        examples: [
          { korean: '뭐 하고 있어?', romanization: 'mwo hago isseo?', english: 'What are you doing? -- casual, fast', audioTip: 'Sounds like "mwo-ha-go-i-sseo" run together' },
          { korean: '그래서 어떻게 됐어?', romanization: 'geuraeseo eotteoke dwaesseo?', english: 'So what happened? -- flows as one phrase', audioTip: 'Words blend with no gaps' },
          { korean: '몰라', romanization: 'molla', english: 'I do not know -- already a contraction of 모르다', audioTip: 'Two quick syllables' },
        ],
      },
      {
        heading: 'Filler Words and Hesitation Sounds',
        explanation:
          'Every language has filler words for when you are thinking. Using Korean fillers instead of English "um" and "uh" makes you sound much more natural, even if your grammar is imperfect.',
        examples: [
          { korean: '음...', romanization: 'eum...', english: 'Hmm... -- thinking sound, like English "hmm"', audioTip: 'Nasal, closed-mouth hum' },
          { korean: '어...', romanization: 'eo...', english: 'Uh... -- most common filler, like "uh"', audioTip: 'Open mouth, ㅓ vowel' },
          { korean: '그...', romanization: 'geu...', english: 'Well... / So... -- used when searching for words', audioTip: 'Drawn out "geu~"' },
          { korean: '뭐...', romanization: 'mwo...', english: 'Like... / You know... -- softens statements', audioTip: 'Quick and casual' },
          { korean: '아니 근데', romanization: 'ani geunde', english: 'No but like... -- conversation pivot filler', audioTip: 'Very common speech starter' },
        ],
        tip: 'Replace your English "um" with Korean "어..." immediately. This single change makes you sound 50% more natural to Korean ears.',
      },
      {
        heading: 'Connected Speech Patterns',
        explanation:
          'In natural Korean speech, words within a breath group flow together seamlessly. Boundaries between words blur, and sound changes apply across word boundaries, not just within words.',
        examples: [
          { korean: '뭐 먹을래?', romanization: '[mwo meo-geul-lae?]', english: 'What do you want to eat? -- flows as one unit', audioTip: 'No pause between words' },
          { korean: '같이 가자', romanization: '[ga-chi ga-ja]', english: 'Let us go together -- 같이 palatalization applies', audioTip: 'Sound changes cross word gaps' },
          { korean: '밥 먹었어?', romanization: '[bam meo-geo-sseo?]', english: 'Did you eat? -- ㅂ nasalizes before ㅁ', audioTip: 'ㅂ + ㅁ becomes ㅁ + ㅁ across words' },
        ],
      },
      {
        heading: 'Sentence Ending Particles',
        explanation:
          'Korean has expressive sentence-ending particles that convey nuance. These tiny additions change the feeling entirely, and mastering them is key to sounding natural versus robotic.',
        examples: [
          { korean: '그렇구나~', romanization: 'geureokuna~', english: 'Oh I see~ -- realization/understanding', audioTip: 'Drawn out with soft tone' },
          { korean: '진짜 맛있다!', romanization: 'jinjja masitda!', english: 'This is really delicious! -- self-exclamation', audioTip: 'Talking to yourself, not someone' },
          { korean: '가자!', romanization: 'gaja!', english: 'Let us go! -- suggestion/urging', audioTip: 'Energetic and forward-leaning' },
          { korean: '알겠어요~', romanization: 'algesseoyo~', english: 'I understand~ -- soft acknowledgment', audioTip: 'Trailing ~ means gentle tone' },
        ],
      },
    ],
  },
  {
    id: 'pron_honorific',
    title: 'Honorific Pronunciation',
    titleKorean: '존댓말 발음',
    order: 7,
    description: 'Formality in Korean is not just about word choice -- it changes how you speak, your speed, your tone, and even individual sounds.',
    sections: [
      {
        heading: 'How Formality Changes Your Voice',
        explanation:
          'In Korean, the level of formality affects your entire delivery. Formal speech is slower, clearer, and more carefully enunciated. Casual speech is faster, more contracted, and relaxed. Switching between these registers is essential for social navigation.',
        examples: [
          { korean: '감사합니다', romanization: 'gamsahamnida', english: 'Thank you (formal) -- slow, clear, each syllable distinct', audioTip: 'Measured pace, clear enunciation' },
          { korean: '고마워', romanization: 'gomawo', english: 'Thanks (casual) -- faster, softer, relaxed mouth', audioTip: 'Quick and light' },
          { korean: '안녕하십니까', romanization: 'annyeonghasimnikka', english: 'Hello (very formal) -- deliberate, precise', audioTip: 'Slower than normal speech' },
          { korean: '안녕', romanization: 'annyeong', english: 'Hi (casual) -- quick, two syllables', audioTip: 'Fast and breezy' },
        ],
        tip: 'When in doubt, speak more slowly and clearly. Faster speech implies casualness and closeness, which can be rude to elders or strangers.',
      },
      {
        heading: 'The -요 Ending Variations',
        explanation:
          'The polite ending -요 (yo) is the most versatile formality marker. Its pronunciation subtly changes based on what comes before it and the emotional context. It can be clipped short, drawn out, or given various pitch contours.',
        examples: [
          { korean: '네, 알겠어요.', romanization: 'ne, algesseoyo.', english: 'Yes, I understand. -- 요 is short, falling', audioTip: 'Quick, businesslike 요' },
          { korean: '정말요?', romanization: 'jeongmallyo?', english: 'Really? -- 요 rises high for surprise', audioTip: 'High rising 요 = disbelief' },
          { korean: '감사해요~', romanization: 'gamsahaeyo~', english: 'Thank you~ -- 요 is soft and drawn out', audioTip: 'Gentle, warm trailing 요' },
          { korean: '싫어요!', romanization: 'sireoyo!', english: 'I do not want to! -- 요 is sharp and emphatic', audioTip: 'Punchy 요 = strong feeling' },
        ],
      },
      {
        heading: 'Formal vs Casual Speech Speed',
        explanation:
          'Formal Korean (합쇼체/하십시오체) is spoken at roughly 3-4 syllables per second. Casual Korean (반말/해체) can hit 6-8 syllables per second. This speed difference is not just laziness -- it signals your relationship with the listener.',
        examples: [
          { korean: '식사하셨습니까?', romanization: 'siksaasyeosseumnikka?', english: 'Have you eaten? (very formal) -- deliberate pace', audioTip: 'Slow, respectful delivery' },
          { korean: '밥 먹었어?', romanization: 'bap meogeosseo?', english: 'You eat? (casual) -- fast, clipped', audioTip: 'Can be said in under 1 second' },
          { korean: '어디 가십니까?', romanization: 'eodi gasimnikka?', english: 'Where are you going? (formal) -- measured', audioTip: 'Clear separation of syllables' },
          { korean: '어디 가?', romanization: 'eodi ga?', english: 'Where you going? (casual) -- two quick words', audioTip: 'Runs together fast' },
        ],
        tip: 'Match your speed to your formality level. Speaking casually at a formal pace sounds sarcastic. Speaking formally at a casual pace sounds disrespectful.',
      },
      {
        heading: 'Tone and Politeness',
        explanation:
          'Korean politeness also involves TONE. A softer, slightly higher-pitched voice is considered more polite. Service workers, receptionists, and people speaking to elders often raise their pitch. Men can soften their voice without going high.',
        examples: [
          { korean: '여기요~', romanization: 'yeogiyo~', english: 'Excuse me~ (to get attention) -- soft, slightly high', audioTip: 'Gentle call, not shouting' },
          { korean: '잠시만요', romanization: 'jamsimanyo', english: 'Just a moment please -- measured, clear', audioTip: 'Calm and polite tone' },
          { korean: '죄송합니다', romanization: 'joesonghamnida', english: 'I am sorry (formal) -- lower pitch shows sincerity', audioTip: 'Lower and slower = more sincere' },
        ],
      },
    ],
  },
  {
    id: 'pron_mistakes',
    title: 'Common Pronunciation Mistakes',
    titleKorean: '흔한 발음 실수',
    order: 8,
    description: 'The specific sounds and habits that give away non-native speakers. Fix these and your Korean pronunciation will improve dramatically.',
    sections: [
      {
        heading: 'The ㄹ Sound (Not L, Not R)',
        explanation:
          'ㄹ is the most misunderstood Korean consonant. It is neither English "L" nor "R" -- it is its own unique sound that changes based on position. At the start of a syllable between vowels, it is a quick tongue flap (similar to the "tt" in American English "butter"). At the end of a syllable (batchim), it sounds like a light "L" with the tongue tip touching the ridge behind the upper teeth.',
        examples: [
          { korean: '라면', romanization: 'ramyeon', english: 'Ramen -- initial ㄹ is a flap, not a rolled R', audioTip: 'Quick tongue flap off the ridge' },
          { korean: '사랑', romanization: 'sarang', english: 'Love -- between vowels, ㄹ is a flap', audioTip: 'Like the "t" in American "water"' },
          { korean: '서울', romanization: 'Seoul', english: 'Seoul -- final ㄹ is like light "L"', audioTip: 'Tongue tip touches roof of mouth' },
          { korean: '빨리', romanization: 'ppalli', english: 'Quickly -- double ㄹ is a longer "L" sound', audioTip: 'Hold the L longer than single ㄹ' },
          { korean: '달라요', romanization: 'dallayo', english: 'It is different -- double then single ㄹ', audioTip: 'Long L then quick flap' },
        ],
        tip: 'The ㄹ flap is identical to the sound in American English "butter," "water," "letter." If you can say those words naturally, you already know the Korean ㄹ flap.',
      },
      {
        heading: 'Tense Consonant Failures',
        explanation:
          'English speakers either skip tense consonants entirely (making them sound plain) or over-pronounce them (making them sound aspirated). The key is throat tension WITHOUT air. Practice by putting your hand on your throat -- you should feel your muscles tighten for tense sounds.',
        examples: [
          { korean: '오빠', romanization: 'oppa', english: 'Older brother (female speaker) -- tight ㅃ', audioTip: 'Glottis closes then lips pop open' },
          { korean: '아빠', romanization: 'appa', english: 'Dad -- tight ㅃ, not the same as 아파 (hurts)', audioTip: 'ㅃ vs ㅍ changes the whole word' },
          { korean: '아파', romanization: 'apa', english: 'It hurts -- aspirated ㅍ with air', audioTip: 'ㅍ has a puff, ㅃ does not' },
          { korean: '싸다', romanization: 'ssada', english: 'To be cheap -- tense ㅆ', audioTip: 'Sharper than regular ㅅ' },
          { korean: '사다', romanization: 'sada', english: 'To buy -- plain ㅅ for contrast', audioTip: 'Softer, less pressure' },
        ],
        tip: 'Minimal pairs are the best practice tool. Record yourself saying 사다 vs 싸다, 달 vs 딸, and listen back. If they sound the same, focus more on throat tension for the tense version.',
      },
      {
        heading: 'Releasing Final Consonants',
        explanation:
          'This is arguably the most common mistake all English speakers make. In English, final consonants are released with a small puff of air: "book" has an audible "k" release. In Korean, batchim consonants are STOPPED -- your mouth moves to position but does not release. Adding that release sounds very foreign.',
        examples: [
          { korean: '학', romanization: 'hak', english: 'Study/learning -- tongue goes to [k] position, STOPS', audioTip: 'No "kuh" at the end' },
          { korean: '맛', romanization: 'mat', english: 'Taste -- tongue goes to [t] position, STOPS', audioTip: 'No "tuh" release' },
          { korean: '집', romanization: 'jip', english: 'House -- lips close to [p] position, STOP', audioTip: 'No "puh" at the end' },
          { korean: '한국', romanization: 'hanguk', english: 'Korea -- ends with unreleased [k]', audioTip: 'Freeze at the k position' },
        ],
        tip: 'Practice by whispering Korean words. When you whisper, it is easier to notice if you are releasing final consonants because the extra air becomes very obvious.',
      },
      {
        heading: 'Word Stress (Korean Does Not Have It)',
        explanation:
          'English is built on stress patterns: we say "PRE-sent" (noun) vs "pre-SENT" (verb). Korean has NO word-level stress. Every syllable gets equal weight. When English speakers unconsciously stress syllables in Korean, it creates a bumpy, foreign-sounding rhythm.',
        examples: [
          { korean: '가방', romanization: 'gabang', english: 'Bag -- NOT "GA-bang" or "ga-BANG," both syllables equal', audioTip: 'Flat, even: ga-bang' },
          { korean: '사람', romanization: 'saram', english: 'Person -- NOT "SA-ram," keep it even', audioTip: 'sa-ram, same volume both' },
          { korean: '컴퓨터', romanization: 'keompyuteo', english: 'Computer -- NOT "com-PYU-ter" like English', audioTip: 'All four syllables equal weight' },
          { korean: '아이스크림', romanization: 'aiseukeurim', english: 'Ice cream -- five even syllables, no stress', audioTip: 'Resist English stress patterns' },
        ],
        tip: 'Use a metronome app. Set it to a steady beat and say each Korean syllable on one beat. This trains your brain to give equal time to every syllable.',
      },
      {
        heading: 'English Vowel Substitution',
        explanation:
          'English speakers tend to substitute Korean vowels with the closest English sound, but Korean vowels are often different in subtle ways. The biggest offenders: turning ㅓ into English "oh," pronouncing ㅡ like "oo," and using English "r" colored vowels.',
        examples: [
          { korean: '어머니', romanization: 'eomeoni', english: 'Mother -- ㅓ is "uh" not "oh"', audioTip: 'Open jaw, tongue back' },
          { korean: '으르다', romanization: 'eureuda', english: 'To growl -- ㅡ is a spread, unrounded "uh"', audioTip: 'Spread lips thin, say "uh"' },
          { korean: '오리', romanization: 'ori', english: 'Duck -- ㅗ is round, short "oh"', audioTip: 'Pure round lips, no diphthong' },
          { korean: '우리', romanization: 'uri', english: 'We/our -- ㅜ is a tight, forward "oo"', audioTip: 'Tighter than English "oo"' },
        ],
        tip: 'Korean vowels are "pure" -- they do not slide or change during pronunciation. English "oh" actually slides to "ow." Keep your Korean vowels steady and unchanging throughout.',
      },
    ],
  },
];

export function getPronunciationLessonById(id: string): PronunciationLesson | undefined {
  return pronunciationLessons.find((l) => l.id === id);
}

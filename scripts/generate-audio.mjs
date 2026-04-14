#!/usr/bin/env node

/**
 * Pre-generate Korean TTS audio files using Edge TTS (Microsoft Neural voices).
 *
 * Usage: node scripts/generate-audio.mjs
 *
 * Generates MP3 files for ALL content in the app:
 * - Hangul character sound cues
 * - ALL vocabulary words + example sentences
 * - ALL sentences from sentences.ts
 * - ALL pronunciation examples
 * - ALL slang words + examples
 * - ALL culture lesson examples + narration
 * - ALL pronunciation lesson narration
 * - Grammar lesson narration
 * - ALL reading passage paragraphs
 * - ALL manga dialogue (first 5 chapters per series)
 *
 * Output: assets/audio/ko/*.mp3
 *
 * These files are bundled with the app for instant, offline, free playback.
 */

import { EdgeTTS } from '@andresaya/edge-tts';
import { writeFileSync, readFileSync, mkdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const VOICE = 'ko-KR-SunHiNeural'; // Female Korean Neural voice
const ENGLISH_VOICE = 'en-US-JennyNeural';
const OUTPUT_DIR = join(import.meta.dirname, '..', 'assets', 'audio', 'ko');
const DATA_DIR = join(import.meta.dirname, '..', 'data');

// ─── TS File Parsing Helpers ─────────────────────────────────────────────────

function readTSFile(filename) {
  return readFileSync(join(DATA_DIR, filename), 'utf-8');
}

/**
 * Parse vocabulary.ts and expansion files to extract all vocab words
 */
function parseVocabulary() {
  const vocabFiles = ['vocabulary.ts', 'vocab-expansion-1.ts', 'vocab-expansion-2.ts', 'vocab-expansion-3.ts'];
  const items = [];

  for (const file of vocabFiles) {
    const filePath = join(DATA_DIR, file);
    if (!existsSync(filePath)) continue;
    const src = readFileSync(filePath, 'utf-8');

    const wordRegex = /\{\s*id:\s*'([^']+)',\s*korean:\s*'([^']+)',\s*romanization:\s*'[^']*',\s*english:\s*'((?:[^'\\]|\\.)*)'/g;
    let match;
    while ((match = wordRegex.exec(src)) !== null) {
      const id = match[1];
      const korean = match[2];
      const english = match[3].replace(/\\'/g, "'");
      // Look for example in the same block
      const restStart = match.index + match[0].length;
      const restBlock = src.substring(restStart, restStart + 500);
      const exMatch = restBlock.match(/example:\s*\{\s*korean:\s*'([^']+)'/);
      items.push({
        id: 'vocab_' + id,
        korean,
        english,
        exampleKorean: exMatch ? exMatch[1] : null,
        exampleId: exMatch ? 'vocab_ex_' + id : null,
      });
    }
  }
  return items;
}

/**
 * Parse sentences.ts to extract all sentences
 */
function parseSentences() {
  const src = readTSFile('sentences.ts');
  const items = [];
  const regex = /id:\s*'([^']+)',\s*\n\s*korean:\s*'([^']+)',\s*\n\s*romanization:\s*'[^']*',\s*\n\s*english:\s*'((?:[^'\\]|\\.)*)'/g;
  let match;
  while ((match = regex.exec(src)) !== null) {
    items.push({ id: 'sent_' + match[1], korean: match[2], english: match[3]?.replace(/\\'/g, "'") || null });
  }
  return items;
}

/**
 * Parse pronunciation.ts to extract all examples
 */
function parsePronunciation() {
  const src = readTSFile('pronunciation.ts');
  const items = [];

  // Extract all Korean examples from pronunciation lessons
  const exampleRegex = /korean:\s*'([^']+)',\s*romanization:\s*'([^']+)',\s*english:\s*'([^']*(?:\\'[^']*)*?)'/g;
  let eMatch;
  let exIndex = 0;
  while ((eMatch = exampleRegex.exec(src)) !== null) {
    const korean = eMatch[1];
    if (korean.length >= 2 || /[\uAC00-\uD7AF]/.test(korean)) {
      items.push({ id: 'pron_ex_' + exIndex, korean });
      exIndex++;
    }
  }

  return items;
}

/**
 * Parse slang.ts to extract all slang words and examples
 */
function parseSlang() {
  const src = readTSFile('slang.ts');
  const items = [];

  const regex = /id:\s*'([^']+)',\s*\n\s*korean:\s*'([^']+)'[^]*?example:\s*\{\s*korean:\s*'([^']+)'/g;
  let match;
  while ((match = regex.exec(src)) !== null) {
    const id = match[1];
    const korean = match[2];
    const exKorean = match[3];
    items.push({
      id: 'slang_' + id,
      korean,
      exampleId: 'slang_ex_' + id,
      exampleKorean: exKorean,
    });
  }
  return items;
}

/**
 * Parse culture.ts to extract lesson data for narration
 */
function parseCulture() {
  const src = readTSFile('culture.ts');
  const lessons = [];

  const lessonBlocks = src.split(/\{\s*\n\s*id:\s*'(cult_[^']+)'/);
  for (let i = 1; i < lessonBlocks.length; i += 2) {
    const id = lessonBlocks[i];
    const block = lessonBlocks[i + 1];
    if (!block) continue;

    const titleMatch = block.match(/title:\s*'([^']+)'/);
    const descMatch = block.match(/description:\s*'([^']*(?:\\'[^']*)*)'/);
    const title = titleMatch ? titleMatch[1] : '';
    const description = descMatch ? descMatch[1].replace(/\\'/g, "'") : '';

    const sections = [];
    const sectionRegex = /heading:\s*'([^']*(?:\\'[^']*)*)'\s*,\s*\n\s*explanation:\s*'([^']*(?:\\'[^']*)*)'/g;
    let sMatch;
    while ((sMatch = sectionRegex.exec(block)) !== null) {
      sections.push({
        heading: sMatch[1].replace(/\\'/g, "'"),
        explanation: sMatch[2].replace(/\\'/g, "'"),
      });
    }

    const examples = [];
    const exRegex = /korean:\s*'([^']+)',\s*romanization:\s*'[^']+',\s*english:\s*'([^']*(?:\\'[^']*)*)'/g;
    let eMatch;
    while ((eMatch = exRegex.exec(block)) !== null) {
      examples.push({ korean: eMatch[1], english: eMatch[2].replace(/\\'/g, "'") });
    }

    lessons.push({ id, title, description, sections, examples });
  }
  return lessons;
}

/**
 * Parse manga.ts to extract dialogue Korean text
 */
function parseManga() {
  const src = readTSFile('manga.ts');
  const items = [];

  const dialogueRegex = /korean:\s*'([^']+)',\s*\n\s*romanization/g;
  let match;
  let count = 0;
  while ((match = dialogueRegex.exec(src)) !== null) {
    if (count > 500) break;
    const korean = match[1];
    if (/[\uAC00-\uD7AF]/.test(korean)) {
      items.push({ id: 'manga_' + count, korean });
      count++;
    }
  }
  return items;
}

/**
 * Parse readings.ts to extract all reading paragraph Korean text
 */
function parseReadings() {
  const src = readTSFile('readings.ts');
  const items = [];

  const koreanRegex = /korean:\s*'([^']+)',\s*\n\s*english:/g;
  let kMatch;
  let idx = 0;
  while ((kMatch = koreanRegex.exec(src)) !== null) {
    const korean = kMatch[1];
    if (/[\uAC00-\uD7AF]/.test(korean) && korean.length > 3) {
      items.push({ id: 'read_' + idx, korean });
      idx++;
    }
  }
  return items;
}

/**
 * Parse miniStories.ts to extract all Korean text
 */
function parseMiniStories() {
  const filePath = join(DATA_DIR, 'miniStories.ts');
  if (!existsSync(filePath)) return [];
  const src = readFileSync(filePath, 'utf-8');
  const items = [];
  let idx = 0;

  const titleRegex = /titleKorean:\s*'([^']+)'/g;
  let m;
  while ((m = titleRegex.exec(src)) !== null) {
    if (hasKorean(m[1])) {
      items.push({ id: 'mstory_title_' + idx, korean: m[1] });
      idx++;
    }
  }

  const koreanRegex = /korean:\s*'([^']+)'/g;
  while ((m = koreanRegex.exec(src)) !== null) {
    const korean = m[1];
    if (hasKorean(korean) && korean.length > 1) {
      items.push({ id: 'mstory_' + idx, korean });
      idx++;
    }
  }

  const qRegex = /questionKorean:\s*'([^']+)'/g;
  while ((m = qRegex.exec(src)) !== null) {
    if (hasKorean(m[1])) {
      items.push({ id: 'mstory_q_' + idx, korean: m[1] });
      idx++;
    }
  }

  return items;
}

/**
 * Parse nativeContent.ts to extract all Korean text
 */
function parseNativeContent() {
  const filePath = join(DATA_DIR, 'nativeContent.ts');
  if (!existsSync(filePath)) return [];
  const src = readFileSync(filePath, 'utf-8');
  const items = [];
  let idx = 0;

  const koreanRegex = /korean:\s*'([^']+)'/g;
  let m;
  while ((m = koreanRegex.exec(src)) !== null) {
    const korean = m[1];
    if (hasKorean(korean)) {
      items.push({ id: 'native_' + idx, korean });
      idx++;
    }
  }

  const titleRegex = /titleKorean:\s*'([^']+)'/g;
  while ((m = titleRegex.exec(src)) !== null) {
    if (hasKorean(m[1])) {
      items.push({ id: 'native_title_' + idx, korean: m[1] });
      idx++;
    }
  }

  return items;
}

/**
 * Parse hanja.ts to extract all Korean text
 */
function parseHanja() {
  const filePath = join(DATA_DIR, 'hanja.ts');
  if (!existsSync(filePath)) return [];
  const src = readFileSync(filePath, 'utf-8');
  const items = [];
  let idx = 0;

  const koreanRegex = /korean:\s*'([^']+)'/g;
  let m;
  while ((m = koreanRegex.exec(src)) !== null) {
    if (hasKorean(m[1])) {
      items.push({ id: 'hanja_' + idx, korean: m[1] });
      idx++;
    }
  }

  return items;
}

/**
 * Parse dictionary.ts to extract all Korean words + examples
 */
function parseDictionary() {
  const filePath = join(DATA_DIR, 'dictionary.ts');
  if (!existsSync(filePath)) return [];
  const src = readFileSync(filePath, 'utf-8');
  const items = [];
  let idx = 0;

  const koreanRegex = /korean:\s*'([^']+)'/g;
  let m;
  while ((m = koreanRegex.exec(src)) !== null) {
    if (hasKorean(m[1])) {
      items.push({ id: 'dict_' + idx, korean: m[1] });
      idx++;
    }
  }

  return items;
}

/**
 * Parse listeningExercises.ts to extract all Korean text
 */
function parseListeningExercises() {
  const filePath = join(DATA_DIR, 'listeningExercises.ts');
  if (!existsSync(filePath)) return [];
  const src = readFileSync(filePath, 'utf-8');
  const items = [];
  let idx = 0;

  const koreanRegex = /korean:\s*'([^']+)'/g;
  let m;
  while ((m = koreanRegex.exec(src)) !== null) {
    if (hasKorean(m[1])) {
      items.push({ id: 'listen_' + idx, korean: m[1] });
      idx++;
    }
  }

  return items;
}

// ─── Hangul Sound Cues ───────────────────────────────────────────────────────

const HANGUL_SOUNDS = [
  { id: 'c_g', text: '가' }, { id: 'c_n', text: '나' }, { id: 'c_d', text: '다' },
  { id: 'c_r', text: '라' }, { id: 'c_m', text: '마' }, { id: 'c_b', text: '바' },
  { id: 'c_s', text: '사' }, { id: 'c_ng', text: '아' }, { id: 'c_j', text: '자' },
  { id: 'c_ch', text: '차' }, { id: 'c_k', text: '카' }, { id: 'c_t', text: '타' },
  { id: 'c_p', text: '파' }, { id: 'c_h', text: '하' },
  { id: 'dc_gg', text: '까' }, { id: 'dc_dd', text: '따' }, { id: 'dc_bb', text: '빠' },
  { id: 'dc_ss', text: '싸' }, { id: 'dc_jj', text: '짜' },
  { id: 'v_a', text: '아' }, { id: 'v_ya', text: '야' }, { id: 'v_eo', text: '어' },
  { id: 'v_yeo', text: '여' }, { id: 'v_o', text: '오' }, { id: 'v_yo', text: '요' },
  { id: 'v_u', text: '우' }, { id: 'v_yu', text: '유' }, { id: 'v_eu', text: '으' },
  { id: 'v_i', text: '이' },
  { id: 'cv_ae', text: '애' }, { id: 'cv_yae', text: '얘' }, { id: 'cv_e', text: '에' },
  { id: 'cv_ye', text: '예' }, { id: 'cv_wa', text: '와' }, { id: 'cv_wae', text: '왜' },
  { id: 'cv_oe', text: '외' }, { id: 'cv_wo', text: '워' }, { id: 'cv_we', text: '웨' },
  { id: 'cv_wi', text: '위' }, { id: 'cv_ui', text: '의' },
];

// ─── Grammar Lessons ─────────────────────────────────────────────────────────

const grammarLessons = [
  { id: 'g_sov', title: 'Basic Sentence Structure', description: 'Korean follows Subject-Object-Verb order.', sections: [
    { heading: 'Subject-Object-Verb Order', explanation: 'In Korean, the verb always comes at the end.', examples: [{ korean: '저는 밥을 먹어요.', english: 'I eat rice.' }, { korean: '저는 한국어를 공부해요.', english: 'I study Korean.' }], tip: 'Think of it as "I rice eat".' },
    { heading: 'Dropping the Subject', explanation: 'When obvious from context, Koreans drop the subject.', examples: [{ korean: '밥 먹었어요?', english: 'Did you eat?' }, { korean: '괜찮아요.', english: 'I am fine.' }], tip: 'In casual conversation, dropping the subject is natural.' },
  ]},
  { id: 'g_topic', title: 'Topic Markers', description: 'Topic markers indicate what the sentence is about.', sections: [
    { heading: 'How to Use 은/는', explanation: 'Use 은 after a consonant and 는 after a vowel.', examples: [{ korean: '저는 학생이에요.', english: 'I am a student.' }, { korean: '한국은 아름다워요.', english: 'Korea is beautiful.' }], tip: '은/는 is like saying "As for..." in English.' },
  ]},
  { id: 'g_subject', title: 'Subject Markers', description: 'Subject markers identify who performs the action.', sections: [
    { heading: 'How to Use 이/가', explanation: 'Use 이 after a consonant and 가 after a vowel.', examples: [{ korean: '비가 와요.', english: 'It is raining.' }, { korean: '고양이가 귀여워요.', english: 'The cat is cute.' }], tip: 'Use 이/가 for new information or emphasis.' },
  ]},
  { id: 'g_object', title: 'Object Markers', description: 'Object markers indicate what receives the action.', sections: [
    { heading: 'How to Use 을/를', explanation: 'Use 을 after a consonant and 를 after a vowel.', examples: [{ korean: '저는 커피를 마셔요.', english: 'I drink coffee.' }, { korean: '책을 읽어요.', english: 'I read a book.' }] },
  ]},
  { id: 'g_present', title: 'Present Tense', description: 'The polite present tense ending.', sections: [
    { heading: 'Conjugation Rules', explanation: 'Remove 다 from dictionary form. If last vowel is ㅏ or ㅗ, add 아요. Otherwise 어요. 하다 becomes 해요.', examples: [{ korean: '가다 → 가요', english: 'go → goes' }, { korean: '먹다 → 먹어요', english: 'eat → eats' }, { korean: '공부하다 → 공부해요', english: 'study → studies' }], tip: 'This is the most important conjugation pattern!' },
  ]},
  { id: 'g_past', title: 'Past Tense', description: 'How to talk about things that already happened.', sections: [
    { heading: 'Past Tense Conjugation', explanation: 'Same vowel rules but add 았 or 었 before 어요. 하다 verbs use 했어요.', examples: [{ korean: '가다 → 갔어요', english: 'went' }, { korean: '먹다 → 먹었어요', english: 'ate' }, { korean: '공부하다 → 공부했어요', english: 'studied' }] },
  ]},
  { id: 'g_future', title: 'Future Tense', description: 'Express plans and intentions.', sections: [
    { heading: 'Future Tense Pattern', explanation: 'Add ㄹ 거예요 after a vowel stem, or 을 거예요 after a consonant.', examples: [{ korean: '가다 → 갈 거예요', english: 'will go' }, { korean: '먹다 → 먹을 거예요', english: 'will eat' }, { korean: '내일 영화를 볼 거예요.', english: 'I will watch a movie tomorrow.' }] },
  ]},
  { id: 'g_negative', title: 'Negative Sentences', description: 'Two ways to make negative sentences.', sections: [
    { heading: 'Short Negation: 안', explanation: 'Place 안 before the verb.', examples: [{ korean: '안 먹어요.', english: "Don't eat." }, { korean: '안 좋아요.', english: "Not good." }] },
    { heading: 'Long Negation: -지 않다', explanation: 'Add 지 않다 to the verb stem.', examples: [{ korean: '먹지 않아요.', english: "Don't eat." }, { korean: '좋지 않아요.', english: "Not good." }], tip: 'For 하다 verbs: split noun and 하다.' },
  ]},
  { id: 'g_want', title: 'Want To', description: 'Express what you want to do.', sections: [
    { heading: 'Using -고 싶다', explanation: 'Add 고 싶다 to the verb stem.', examples: [{ korean: '한국에 가고 싶어요.', english: 'I want to go to Korea.' }, { korean: '김치를 먹고 싶어요.', english: 'I want to eat kimchi.' }, { korean: '한국어를 배우고 싶어요.', english: 'I want to learn Korean.' }] },
  ]},
  { id: 'g_connect', title: 'Connecting Sentences', description: 'Connect two clauses with and or but.', sections: [
    { heading: 'And: -고', explanation: 'Add 고 to join two actions.', examples: [{ korean: '밥을 먹고 커피를 마셔요.', english: 'I eat rice and drink coffee.' }] },
    { heading: 'But: -지만', explanation: 'Add 지만 to contrast two clauses.', examples: [{ korean: '비싸지만 맛있어요.', english: "It's expensive but delicious." }, { korean: '어렵지만 재미있어요.', english: "It's difficult but fun." }] },
  ]},
  { id: 'g_location', title: 'Location Particles', description: 'Indicate location and direction.', sections: [
    { heading: '에 - Direction / Static Location', explanation: '에 marks destination or static location.', examples: [{ korean: '학교에 가요.', english: 'I go to school.' }, { korean: '집에 있어요.', english: 'I am at home.' }] },
    { heading: '에서 - Location of Action', explanation: '에서 marks where an action takes place.', examples: [{ korean: '도서관에서 공부해요.', english: 'I study at the library.' }, { korean: '카페에서 커피를 마셔요.', english: 'I drink coffee at the cafe.' }], tip: 'Use 에 for to or at with 있다. Use 에서 for action verbs.' },
  ]},
  { id: 'g_speech', title: 'Speech Levels', description: 'Korean has different speech levels based on formality.', sections: [
    { heading: 'Three Main Levels', explanation: 'Formal polite, informal polite, and casual.', examples: [{ korean: '감사합니다', english: 'Thank you, formal polite' }, { korean: '고마워요', english: 'Thank you, informal polite' }, { korean: '고마워', english: 'Thanks, casual' }], tip: 'Use informal polite as your default.' },
    { heading: 'When to Use Each Level', explanation: 'Formal polite for business, informal polite for everyday, casual for close friends.', examples: [{ korean: '먹습니다', english: 'eat, formal polite' }, { korean: '먹어요', english: 'eat, informal polite' }, { korean: '먹어', english: 'eat, casual' }] },
  ]},
];

// ─── Lesson Narration Builder ────────────────────────────────────────────────

function buildLessonChunks(lessonId, title, description, sections) {
  const chunks = [];
  chunks.push({ id: lessonId + '_intro', text: title + '. ' + description });
  sections.forEach((s, si) => {
    chunks.push({ id: lessonId + '_s' + si, text: s.heading + '. ' + s.explanation });
    if (s.examples && s.examples.length > 0) {
      const exText = s.examples
        .map((ex) => ex.korean + '. ' + ex.english)
        .join('. ');
      chunks.push({ id: lessonId + '_s' + si + '_ex', text: exText });
    }
    if (s.tip) {
      chunks.push({ id: lessonId + '_s' + si + '_tip', text: 'Tip: ' + s.tip });
    }
  });
  return chunks;
}

// ─── Generator Functions ─────────────────────────────────────────────────────

const KOREAN_VOICE = VOICE;

function hasKorean(text) {
  return /[\uAC00-\uD7AF\u1100-\u11FF\u3130-\u318F]/.test(text);
}

function splitByLanguage(text) {
  const segments = [];
  const parts = text.split(/([\uAC00-\uD7AF\u1100-\u11FF\u3130-\u318F]+)/g).filter(Boolean);
  for (const part of parts) {
    const isKorean = hasKorean(part);
    const last = segments[segments.length - 1];
    if (last && last.isKorean === isKorean) {
      last.text += part;
    } else {
      segments.push({ text: part, isKorean });
    }
  }
  return segments;
}

async function generateMixedAudio(id, text) {
  const outputPath = join(OUTPUT_DIR, id + '.mp3');
  if (existsSync(outputPath)) {
    return 'skip';
  }

  try {
    const segments = splitByLanguage(text);
    const buffers = [];
    for (const seg of segments) {
      const trimmed = seg.text.trim();
      if (!trimmed) continue;
      const tts = new EdgeTTS();
      const voice = seg.isKorean ? KOREAN_VOICE : ENGLISH_VOICE;
      await tts.synthesize(trimmed, voice);
      buffers.push(tts.toBuffer());
    }
    const buffer = Buffer.concat(buffers);
    writeFileSync(outputPath, buffer);
    console.log('  ✓  ' + id + ' — (' + (buffer.length / 1024).toFixed(1) + ' KB)');
    return 'ok';
  } catch (err) {
    console.error('  ✗  ' + id + ': ' + err.message);
    return 'error';
  }
}

async function generateAudio(id, text) {
  const outputPath = join(OUTPUT_DIR, id + '.mp3');

  if (existsSync(outputPath)) {
    return 'skip';
  }

  try {
    const tts = new EdgeTTS();
    await tts.synthesize(text, VOICE);
    const buffer = tts.toBuffer();
    writeFileSync(outputPath, buffer);
    console.log('  ✓  ' + id + ' — ' + text.substring(0, 30) + ' (' + (buffer.length / 1024).toFixed(1) + ' KB)');
    return 'ok';
  } catch (err) {
    console.error('  ✗  ' + id + ' — ' + text + ': ' + err.message);
    return 'error';
  }
}

async function generateEnglishAudio(id, text) {
  const outputPath = join(OUTPUT_DIR, id + '.mp3');

  if (existsSync(outputPath)) {
    return 'skip';
  }

  try {
    const tts = new EdgeTTS();
    await tts.synthesize(text, ENGLISH_VOICE);
    const buffer = tts.toBuffer();
    writeFileSync(outputPath, buffer);
    console.log('  ✓  ' + id + ' — ' + text.substring(0, 30) + ' (' + (buffer.length / 1024).toFixed(1) + ' KB)');
    return 'ok';
  } catch (err) {
    console.error('  ✗  ' + id + ' — ' + text + ': ' + err.message);
    return 'error';
  }
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  console.log('Generating Korean TTS audio files for ALL app content...');
  console.log('   Korean Voice: ' + VOICE);
  console.log('   English Voice: ' + ENGLISH_VOICE);
  console.log('   Output: ' + OUTPUT_DIR + '\n');

  mkdirSync(OUTPUT_DIR, { recursive: true });

  const manifest = {};
  let totalGenerated = 0;
  let totalSkipped = 0;
  let totalErrors = 0;

  function trackResult(id, text, result) {
    manifest[id] = text;
    if (result === 'ok') totalGenerated++;
    else if (result === 'skip') totalSkipped++;
    else totalErrors++;
  }

  // ─── 1. Hangul character sounds ──────────────────────────────────────────
  console.log('[1/10] Hangul character sounds:');
  for (const item of HANGUL_SOUNDS) {
    const result = await generateAudio(item.id, item.text);
    trackResult(item.id, item.text, result);
  }

  // ─── 2. ALL Vocabulary words + examples + English audio ──────────────────
  console.log('\n[2/11] ALL Vocabulary words:');
  const vocab = parseVocabulary();
  console.log('   Found ' + vocab.length + ' vocabulary words');
  for (const item of vocab) {
    const result = await generateAudio(item.id, item.korean);
    trackResult(item.id, item.korean, result);

    if (item.exampleKorean) {
      const exResult = await generateAudio(item.exampleId, item.exampleKorean);
      trackResult(item.exampleId, item.exampleKorean, exResult);
    }

    // English audio for parrot learning
    if (!item.english) continue;
    const enId = 'vocab_en_' + item.id;
    const enResult = await generateEnglishAudio(enId, item.english);
    manifest[enId] = item.english;
    if (enResult === 'ok') totalGenerated++;
    else if (enResult === 'skip') totalSkipped++;
    else totalErrors++;
  }

  // ─── 3. ALL Sentences + English audio ─────────────────────────────────────
  console.log('\n[3/11] ALL Sentences:');
  const sentences = parseSentences();
  console.log('   Found ' + sentences.length + ' sentences');
  for (const item of sentences) {
    const result = await generateAudio(item.id, item.korean);
    trackResult(item.id, item.korean, result);

    // English audio for parrot learning
    if (item.english) {
      const enId = 'sent_en_' + item.id;
      const enResult = await generateEnglishAudio(enId, item.english);
      manifest[enId] = item.english;
      if (enResult === 'ok') totalGenerated++;
      else if (enResult === 'skip') totalSkipped++;
      else totalErrors++;
    }
  }

  // ─── 4. ALL Pronunciation examples ───────────────────────────────────────
  console.log('\n[4/10] ALL Pronunciation examples:');
  const pronExamples = parsePronunciation();
  console.log('   Found ' + pronExamples.length + ' pronunciation examples');
  for (const item of pronExamples) {
    const result = await generateAudio(item.id, item.korean);
    trackResult(item.id, item.korean, result);
  }

  // ─── 5. ALL Slang words + examples ───────────────────────────────────────
  console.log('\n[5/10] ALL Slang words + examples:');
  const slang = parseSlang();
  console.log('   Found ' + slang.length + ' slang words');
  for (const item of slang) {
    if (hasKorean(item.korean)) {
      const result = await generateAudio(item.id, item.korean);
      trackResult(item.id, item.korean, result);
    }

    if (item.exampleKorean && hasKorean(item.exampleKorean)) {
      const exResult = await generateAudio(item.exampleId, item.exampleKorean);
      trackResult(item.exampleId, item.exampleKorean, exResult);
    }
  }

  // ─── 6. Grammar lesson narration ─────────────────────────────────────────
  console.log('\n[6/10] Grammar lesson narration:');
  const grammarChunks = [];
  for (const lesson of grammarLessons) {
    const chunks = buildLessonChunks(lesson.id, lesson.title, lesson.description, lesson.sections);
    grammarChunks.push(...chunks);
  }
  console.log('   Found ' + grammarChunks.length + ' grammar narration chunks');
  for (const chunk of grammarChunks) {
    const result = await generateMixedAudio(chunk.id, chunk.text);
    trackResult(chunk.id, chunk.text, result);
  }

  // ─── 6b. Grammar individual Korean examples (for AudioButton) ───────────
  console.log('\n[6b/10] Grammar individual Korean examples:');
  let grammarExCount = 0;
  for (const lesson of grammarLessons) {
    for (let si = 0; si < lesson.sections.length; si++) {
      const section = lesson.sections[si];
      if (!section.examples) continue;
      for (let ei = 0; ei < section.examples.length; ei++) {
        const ex = section.examples[ei];
        const korean = ex.korean.replace(/[.?!,]+$/, '').trim();
        if (!korean || !hasKorean(korean)) continue;
        const exId = 'gram_' + lesson.id + '_s' + si + '_e' + ei;
        const result = await generateAudio(exId, korean);
        trackResult(exId, korean, result);
        grammarExCount++;
      }
      // Also generate heading Korean text (e.g. "은/는")
      const headingKorean = section.heading.match(/[\uAC00-\uD7AF\u1100-\u11FF\u3130-\u318F/\s]+/g);
      if (headingKorean) {
        const headingText = headingKorean.join(' ').replace(/\//g, ' ').trim();
        if (headingText) {
          const hId = 'gram_' + lesson.id + '_s' + si + '_h';
          const hResult = await generateAudio(hId, headingText);
          trackResult(hId, headingText, hResult);
          grammarExCount++;
        }
      }
    }
  }
  console.log('   Generated ' + grammarExCount + ' individual grammar examples');

  // ─── 7. Pronunciation lesson narration ───────────────────────────────────
  console.log('\n[7/10] Pronunciation lesson narration:');
  const pronSrc = readTSFile('pronunciation.ts');
  const pronNarrationChunks = [];
  const pronLessonRegex = /\{\s*id:\s*'(pron_[^']+)',\s*\n\s*title:\s*'([^']+)',[\s\S]*?description:\s*'([^']*(?:\\'[^']*)*)'/g;
  let plMatch;
  while ((plMatch = pronLessonRegex.exec(pronSrc)) !== null) {
    const id = plMatch[1];
    const title = plMatch[2];
    const desc = plMatch[3].replace(/\\'/g, "'");
    pronNarrationChunks.push({ id: id + '_intro', text: title + '. ' + desc });
  }
  console.log('   Found ' + pronNarrationChunks.length + ' pronunciation narration chunks');
  for (const chunk of pronNarrationChunks) {
    const result = await generateMixedAudio(chunk.id, chunk.text);
    trackResult(chunk.id, chunk.text, result);
  }

  // ─── 8. Culture lesson narration + examples ──────────────────────────────
  console.log('\n[8/10] Culture lesson narration + examples:');
  const cultureLessons = parseCulture();
  console.log('   Found ' + cultureLessons.length + ' culture lessons');
  for (const lesson of cultureLessons) {
    const introId = lesson.id + '_intro';
    const introText = lesson.title + '. ' + lesson.description;
    const introResult = await generateMixedAudio(introId, introText);
    trackResult(introId, introText, introResult);

    for (let si = 0; si < lesson.sections.length; si++) {
      const s = lesson.sections[si];
      const sId = lesson.id + '_s' + si;
      const sText = s.heading + '. ' + s.explanation;
      const sResult = await generateMixedAudio(sId, sText);
      trackResult(sId, sText, sResult);
    }

    for (let ei = 0; ei < lesson.examples.length; ei++) {
      const ex = lesson.examples[ei];
      const exId = 'cult_ex_' + lesson.id + '_' + ei;
      if (hasKorean(ex.korean)) {
        const exResult = await generateAudio(exId, ex.korean);
        trackResult(exId, ex.korean, exResult);
      }
    }
  }

  // ─── 9. Reading passage paragraphs ───────────────────────────────────────
  console.log('\n[9/10] Reading passage paragraphs:');
  const readings = parseReadings();
  console.log('   Found ' + readings.length + ' reading paragraphs');
  for (const item of readings) {
    const result = await generateAudio(item.id, item.korean);
    trackResult(item.id, item.korean, result);
  }

  // ─── 10. Manga dialogue ─────────────────────────────────────────────────
  console.log('\n[10/10] Manga dialogue:');
  const manga = parseManga();
  console.log('   Found ' + manga.length + ' manga dialogue lines');
  for (const item of manga) {
    const result = await generateAudio(item.id, item.korean);
    trackResult(item.id, item.korean, result);
  }

  // ─── 11. Mini Stories ─────────────────────────────────────────────────────
  console.log('\n[11/16] Mini Stories:');
  const miniStories = parseMiniStories();
  console.log('   Found ' + miniStories.length + ' mini story strings');
  for (const item of miniStories) {
    const result = await generateAudio(item.id, item.korean);
    trackResult(item.id, item.korean, result);
  }

  // ─── 12. Native Content ─────────────────────────────────────────────────
  console.log('\n[12/16] Native Content:');
  const nativeContent = parseNativeContent();
  console.log('   Found ' + nativeContent.length + ' native content strings');
  for (const item of nativeContent) {
    const result = await generateAudio(item.id, item.korean);
    trackResult(item.id, item.korean, result);
  }

  // ─── 13. Hanja ──────────────────────────────────────────────────────────
  console.log('\n[13/16] Hanja:');
  const hanja = parseHanja();
  console.log('   Found ' + hanja.length + ' hanja strings');
  for (const item of hanja) {
    const result = await generateAudio(item.id, item.korean);
    trackResult(item.id, item.korean, result);
  }

  // ─── 14. Dictionary ─────────────────────────────────────────────────────
  console.log('\n[14/16] Dictionary:');
  const dictionary = parseDictionary();
  console.log('   Found ' + dictionary.length + ' dictionary strings');
  for (const item of dictionary) {
    const result = await generateAudio(item.id, item.korean);
    trackResult(item.id, item.korean, result);
  }

  // ─── 15. Listening Exercises ────────────────────────────────────────────
  console.log('\n[15/16] Listening Exercises:');
  const listening = parseListeningExercises();
  console.log('   Found ' + listening.length + ' listening exercise strings');
  for (const item of listening) {
    const result = await generateAudio(item.id, item.korean);
    trackResult(item.id, item.korean, result);
  }

  // ─── 16. Parrot Learning sentences (Korean + English) ───────────────────
  console.log('\n[11/11] Parrot Learning sentences:');
  const parrotPairs = [
    { korean: '안녕하세요', english: 'Hello' },
    { korean: '감사합니다', english: 'Thank you' },
    { korean: '저는 학생이에요', english: 'I am a student' },
    { korean: '이거 뭐예요', english: 'What is this' },
    { korean: '얼마예요', english: 'How much is it' },
    { korean: '맛있어요', english: 'It is delicious' },
    { korean: '좋아요', english: 'It is good' },
    { korean: '물 주세요', english: 'Water please' },
    { korean: '화장실 어디예요', english: 'Where is the bathroom' },
    { korean: '한국어를 공부해요', english: 'I study Korean' },
    { korean: '배고파요', english: 'I am hungry' },
    { korean: '피곤해요', english: 'I am tired' },
    { korean: '기분이 좋아요', english: 'I feel good' },
    { korean: '이름이 뭐예요', english: 'What is your name' },
    { korean: '천천히 말해 주세요', english: 'Please speak slowly' },
    { korean: '다시 말해 주세요', english: 'Please say it again' },
    { korean: '한국어를 못해요', english: 'I cannot speak Korean' },
    { korean: '어디에 가요', english: 'Where are you going' },
    { korean: '오늘 날씨가 좋아요', english: 'The weather is nice today' },
    { korean: '사랑해요', english: 'I love you' },
    { korean: '괜찮아요', english: 'It is okay' },
    { korean: '미안해요', english: 'I am sorry' },
    { korean: '잘 자요', english: 'Good night' },
    { korean: '또 만나요', english: 'See you again' },
    { korean: '여기 앉아도 돼요', english: 'May I sit here' },
    { korean: '메뉴 주세요', english: 'Menu please' },
    { korean: '계산해 주세요', english: 'Check please' },
    { korean: '도와주세요', english: 'Please help me' },
    { korean: '잠깐만요', english: 'Just a moment' },
    { korean: '재미있어요', english: 'It is fun' },
  ];
  let parrotNew = 0;
  for (let i = 0; i < parrotPairs.length; i++) {
    const { korean, english } = parrotPairs[i];

    // Korean audio (skip if already in manifest from vocab/sentences)
    const existingKoId = Object.entries(manifest).find(([_, t]) => t === korean)?.[0];
    if (!existingKoId) {
      const koId = 'parrot_' + i;
      const result = await generateAudio(koId, korean);
      trackResult(koId, korean, result);
      if (result === 'ok') parrotNew++;
    } else {
      console.log('   [dup]  ' + korean + ' → ' + existingKoId);
    }

    // English audio
    const enId = 'parrot_en_' + i;
    const enResult = await generateEnglishAudio(enId, english);
    manifest[enId] = english;
    if (enResult === 'ok') { totalGenerated++; parrotNew++; }
    else if (enResult === 'skip') totalSkipped++;
    else totalErrors++;
  }
  console.log('   Generated ' + parrotNew + ' new parrot audio files');

  // ─── Audio Lessons (podcast episodes) ─────────────────────────────────────
  console.log('\n[12/12] Audio Lessons (podcast episodes):');
  const audioLessonsSrc = readTSFile('audioLessons.ts');
  let audioLessonCount = 0;

  const epIds = [];
  let epMatch;
  const epRegex2 = /id:\s*'((?:found|daily|gram|cult|travel|real|deep)_\d+)'/g;
  while ((epMatch = epRegex2.exec(audioLessonsSrc)) !== null) {
    epIds.push(epMatch[1]);
  }

  for (const epId of epIds) {
    const epStart = audioLessonsSrc.indexOf("id: '" + epId + "'");
    if (epStart === -1) continue;
    const segmentsStart = audioLessonsSrc.indexOf('segments: [', epStart);
    if (segmentsStart === -1) continue;
    let bracketDepth = 0;
    let segEnd = segmentsStart;
    for (let i = segmentsStart; i < audioLessonsSrc.length; i++) {
      if (audioLessonsSrc[i] === '[') bracketDepth++;
      if (audioLessonsSrc[i] === ']') { bracketDepth--; if (bracketDepth === 0) { segEnd = i; break; } }
    }
    const segBlock = audioLessonsSrc.substring(segmentsStart, segEnd + 1);

    const segRegex = /\{\s*type:\s*'([^']+)'(?:,\s*english:\s*'((?:[^'\\]|\\.)*?)')?(?:,\s*korean:\s*'((?:[^'\\]|\\.)*?)')?(?:,\s*translation:\s*'((?:[^'\\]|\\.)*?)')?\s*(?:,\s*pauseAfter:\s*\d+)?\s*\}/g;
    let segMatch;
    let segIdx = 0;
    while ((segMatch = segRegex.exec(segBlock)) !== null) {
      const english = segMatch[2] ? segMatch[2].replace(/\\'/g, "'") : null;
      const korean = segMatch[3] ? segMatch[3].replace(/\\'/g, "'") : null;
      const translation = segMatch[4] ? segMatch[4].replace(/\\'/g, "'") : null;

      if (korean) {
        const koId = 'aud_' + epId + '_s' + segIdx + '_ko';
        const result = await generateAudio(koId, korean);
        trackResult(koId, korean, result);
        audioLessonCount++;
      }

      if (english) {
        const enId = 'aud_' + epId + '_s' + segIdx + '_en';
        const enResult = await generateEnglishAudio(enId, english);
        manifest[enId] = english;
        if (enResult === 'ok') totalGenerated++;
        else if (enResult === 'skip') totalSkipped++;
        else totalErrors++;
        audioLessonCount++;
      }

      if (translation) {
        const trId = 'aud_' + epId + '_s' + segIdx + '_tr';
        const trResult = await generateEnglishAudio(trId, translation);
        manifest[trId] = translation;
        if (trResult === 'ok') totalGenerated++;
        else if (trResult === 'skip') totalSkipped++;
        else totalErrors++;
        audioLessonCount++;
      }

      segIdx++;
    }
    console.log('   Episode ' + epId + ': ' + segIdx + ' segments');
  }
  console.log('   Total audio lesson files: ' + audioLessonCount);

  // ─── Summary ─────────────────────────────────────────────────────────────
  const sep = '='.repeat(60);
  console.log('\n' + sep);
  console.log('Done!');
  console.log('   Generated: ' + totalGenerated + ' new files');
  console.log('   Skipped: ' + totalSkipped + ' existing files');
  console.log('   Errors: ' + totalErrors);
  console.log('   Total entries: ' + Object.keys(manifest).length);
  console.log('   Output: ' + OUTPUT_DIR);

  // Write manifest
  const manifestPath = join(OUTPUT_DIR, '_manifest.json');
  writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  console.log('Manifest written to ' + manifestPath);

  // ─── Generate audioAssets.ts ──────────────────────────────────────────────
  console.log('\nGenerating lib/audioAssets.ts...');
  generateAudioAssetsFile(manifest);

  // ─── Update audioCache.ts ────────────────────────────────────────────────
  console.log('Updating lib/audioCache.ts...');
  generateAudioCacheFile(manifest);
}

function generateAudioAssetsFile(manifest) {
  const assetsDir = join(import.meta.dirname, '..', 'lib');
  const ids = Object.keys(manifest);

  const lines = [
    '// AUTO-GENERATED by scripts/generate-audio.mjs -- DO NOT EDIT MANUALLY',
    '// Re-run: node scripts/generate-audio.mjs',
    '',
    'type AudioAssetMap = Record<string, any>;',
    '',
    'let _audioAssets: AudioAssetMap | null = null;',
    '',
    'export function getAudioAsset(fileId: string): any {',
    '  if (!_audioAssets) {',
    '    _audioAssets = buildAudioAssets();',
    '  }',
    '  return _audioAssets[fileId] || null;',
    '}',
    '',
    'export function hasAudioAsset(fileId: string): boolean {',
    '  if (!_audioAssets) {',
    '    _audioAssets = buildAudioAssets();',
    '  }',
    '  return fileId in _audioAssets;',
    '}',
    '',
    'export function getAllAudioIds(): string[] {',
    '  if (!_audioAssets) {',
    '    _audioAssets = buildAudioAssets();',
    '  }',
    '  return Object.keys(_audioAssets);',
    '}',
    '',
    'function buildAudioAssets(): AudioAssetMap {',
    '  return {',
  ];

  let count = 0;
  for (const id of ids) {
    const filePath = join(OUTPUT_DIR, id + '.mp3');
    if (existsSync(filePath)) {
      lines.push("    '" + id + "': require('@/assets/audio/ko/" + id + ".mp3'),");
      count++;
    }
  }

  lines.push('  };');
  lines.push('}');
  lines.push('');

  writeFileSync(join(assetsDir, 'audioAssets.ts'), lines.join('\n'));
  console.log('   Written ' + count + ' asset entries to lib/audioAssets.ts');
}

function generateAudioCacheFile(manifest) {
  const libDir = join(import.meta.dirname, '..', 'lib');

  const textToId = {};
  const englishTextToId = {};
  for (const [id, text] of Object.entries(manifest)) {
    const normalized = text.trim();
    if (normalized.length <= 50 && /[\uAC00-\uD7AF]/.test(normalized)) {
      textToId[normalized] = id;
    }
    // English audio (parrot, vocab, sentences)
    if ((id.startsWith('parrot_en_') || id.startsWith('vocab_en_') || id.startsWith('sent_en_')) && normalized.length <= 80) {
      if (!englishTextToId[normalized]) {
        englishTextToId[normalized] = id;
      }
    }
  }

  const lines = [
    '// AUTO-GENERATED by scripts/generate-audio.mjs -- DO NOT EDIT MANUALLY',
    "import { getAudioAsset, hasAudioAsset } from './audioAssets';",
    '',
    '// Map of Korean text to audio file ID',
    'const AUDIO_MANIFEST: Record<string, string> = ' + JSON.stringify(textToId, null, 2) + ';',
    '',
    '// Map of English text to audio file ID (for parrot learning)',
    'const ENGLISH_AUDIO_MANIFEST: Record<string, string> = ' + JSON.stringify(englishTextToId, null, 2) + ';',
    '',
    '// Map of Hangul character ID to audio file ID',
    'const HANGUL_ID_MAP: Record<string, string> = {',
    "  'c_g': 'c_g', 'c_n': 'c_n', 'c_d': 'c_d', 'c_r': 'c_r', 'c_m': 'c_m',",
    "  'c_b': 'c_b', 'c_s': 'c_s', 'c_ng': 'c_ng', 'c_j': 'c_j', 'c_ch': 'c_ch',",
    "  'c_k': 'c_k', 'c_t': 'c_t', 'c_p': 'c_p', 'c_h': 'c_h',",
    "  'dc_gg': 'dc_gg', 'dc_dd': 'dc_dd', 'dc_bb': 'dc_bb', 'dc_ss': 'dc_ss', 'dc_jj': 'dc_jj',",
    "  'v_a': 'c_ng', 'v_ya': 'v_ya', 'v_eo': 'v_eo', 'v_yeo': 'v_yeo',",
    "  'v_o': 'v_o', 'v_yo': 'v_yo', 'v_u': 'v_u', 'v_yu': 'v_yu',",
    "  'v_eu': 'v_eu', 'v_i': 'v_i',",
    "  'cv_ae': 'cv_ae', 'cv_yae': 'cv_yae', 'cv_e': 'cv_e', 'cv_ye': 'cv_ye',",
    "  'cv_wa': 'cv_wa', 'cv_wae': 'cv_wae', 'cv_oe': 'cv_oe', 'cv_wo': 'cv_wo',",
    "  'cv_we': 'cv_we', 'cv_wi': 'cv_wi', 'cv_ui': 'cv_ui',",
    '};',
    '',
    'export function hasCachedAudio(text: string): boolean {',
    '  const normalized = text.trim();',
    '  return normalized in AUDIO_MANIFEST;',
    '}',
    '',
    'export function hasCachedHangulAudio(characterId: string): boolean {',
    '  return characterId in HANGUL_ID_MAP;',
    '}',
    '',
    'export function hasAudioById(fileId: string): boolean {',
    '  return hasAudioAsset(fileId);',
    '}',
    '',
    'export function getCachedAudioId(text: string): string | null {',
    '  const normalized = text.trim();',
    "  return AUDIO_MANIFEST[normalized] || AUDIO_MANIFEST[normalized.replace(/[.?!]+$/, '')] || null;",
    '}',
    '',
    'export function getCachedEnglishAudioId(text: string): string | null {',
    '  const normalized = text.trim();',
    "  return ENGLISH_AUDIO_MANIFEST[normalized] || ENGLISH_AUDIO_MANIFEST[normalized.replace(/[.?!]+$/, '')] || null;",
    '}',
    '',
    'export function getCachedHangulAudioId(characterId: string): string | null {',
    '  return HANGUL_ID_MAP[characterId] || null;',
    '}',
    '',
    'export async function getCachedAudioUri(fileId: string): Promise<string | null> {',
    '  try {',
    '    const assetModule = getAudioAsset(fileId);',
    '    if (!assetModule) return null;',
    '',
    "    const Asset = require('expo-asset').Asset;",
    '    const asset = Asset.fromModule(assetModule);',
    '    await asset.downloadAsync();',
    '    return asset.localUri || asset.uri;',
    '  } catch (err: any) {',
    '    console.warn("[AudioCache] Failed to load cached audio for " + fileId + ":", err);',
    '    return null;',
    '  }',
    '}',
    '',
  ];

  writeFileSync(join(libDir, 'audioCache.ts'), lines.join('\n'));
  console.log('   Written audioCache.ts with ' + Object.keys(textToId).length + ' text-to-ID mappings');
}

main().catch(console.error);

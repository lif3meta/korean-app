#!/usr/bin/env node
/**
 * Comprehensive audio generation — extracts ALL Korean text from ALL data files
 * and generates MP3 files for any that are missing.
 *
 * Usage: node scripts/generate-all-audio.mjs
 */

import { EdgeTTS } from '@andresaya/edge-tts';
import { writeFileSync, readFileSync, mkdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const VOICE = 'ko-KR-SunHiNeural';
const OUTPUT_DIR = join(import.meta.dirname, '..', 'assets', 'audio', 'ko');
const DATA_DIR = join(import.meta.dirname, '..', 'data');
const MANIFEST_PATH = join(OUTPUT_DIR, '_manifest.json');
const CONCURRENCY = 5;

mkdirSync(OUTPUT_DIR, { recursive: true });

function readTSFile(filename) {
  const p = join(DATA_DIR, filename);
  return existsSync(p) ? readFileSync(p, 'utf-8') : '';
}

function hasKorean(text) {
  return /[\uAC00-\uD7AF\u1100-\u11FF\u3130-\u318F]/.test(text);
}

function cleanForAudio(text) {
  return text.replace(/[.?!,]+$/, '').replace(/[*_#`~]/g, '').trim();
}

// ─── Extract Korean texts from all data files ──────────────────────────────

function extractAll() {
  const entries = new Map();

  function add(id, text) {
    const clean = cleanForAudio(text);
    if (!clean || !hasKorean(clean)) return;
    if (!entries.has(clean)) entries.set(clean, id);
  }

  function extractKoreanFields(src, prefix) {
    const re = /korean:\s*'([^']+)'/g;
    let m, i = 0;
    while ((m = re.exec(src)) !== null) add(prefix + '_' + i++, m[1]);
  }

  function extractFields(src, prefix, fieldNames) {
    for (const field of fieldNames) {
      const re = new RegExp(field + ":\\s*'([^']+)'", 'g');
      let m, i = 0;
      while ((m = re.exec(src)) !== null) {
        if (hasKorean(m[1])) add(prefix + '_' + field + '_' + i++, m[1]);
      }
    }
  }

  // Grammar
  extractKoreanFields(readTSFile('grammar.ts'), 'gram');

  // Vocabulary (base + expansions)
  for (const f of ['vocabulary.ts', 'vocab-expansion-1.ts', 'vocab-expansion-2.ts', 'vocab-expansion-3.ts']) {
    extractKoreanFields(readTSFile(f), f.replace('.ts', '').replace(/-/g, '_'));
  }

  // Sentences
  extractKoreanFields(readTSFile('sentences.ts'), 'sent');

  // Pronunciation
  extractKoreanFields(readTSFile('pronunciation.ts'), 'pron');

  // Slang
  extractKoreanFields(readTSFile('slang.ts'), 'slang');

  // Culture
  extractKoreanFields(readTSFile('culture.ts'), 'cult');

  // Readings
  extractKoreanFields(readTSFile('readings.ts'), 'read');

  // Manga
  extractKoreanFields(readTSFile('manga.ts'), 'manga');

  // Dictionary
  extractKoreanFields(readTSFile('dictionary.ts'), 'dict');

  // Mini Stories
  {
    const src = readTSFile('miniStories.ts');
    extractKoreanFields(src, 'story');
    extractFields(src, 'story', ['titleKorean', 'questionKorean']);
  }

  // Native Content
  {
    const src = readTSFile('nativeContent.ts');
    extractKoreanFields(src, 'native');
    extractFields(src, 'native', ['titleKorean']);
  }

  // Hanja
  extractKoreanFields(readTSFile('hanja.ts'), 'hanja');

  // Hangul
  {
    const src = readTSFile('hangul.ts');
    const re = /(?:korean|syllable|text|example):\s*'([^']+)'/g;
    let m, i = 0;
    while ((m = re.exec(src)) !== null) {
      if (hasKorean(m[1])) add('hangul_' + i++, m[1]);
    }
  }

  // Tongue Positions
  extractKoreanFields(readTSFile('tonguePositions.ts'), 'tongue');

  // SRS Content
  {
    const src = readTSFile('srsContent.ts');
    const re = /(?:text|detail|sentence):\s*'([^']+)'/g;
    let m, i = 0;
    while ((m = re.exec(src)) !== null) {
      if (hasKorean(m[1])) add('srs_' + i++, m[1]);
    }
  }

  // Listening Exercises
  extractKoreanFields(readTSFile('listeningExercises.ts'), 'listen');

  // Writing Prompts
  {
    const src = readTSFile('writingPrompts.ts');
    extractFields(src, 'write', ['targetKorean', 'correctSentence', 'promptKorean']);
  }

  // Handwriting
  {
    const src = readTSFile('handwriting.ts');
    const re = /(?:character|result|titleKorean):\s*'([^']+)'/g;
    let m, i = 0;
    while ((m = re.exec(src)) !== null) {
      if (hasKorean(m[1])) add('hw_' + i++, m[1]);
    }
  }

  // Quizzes
  {
    const src = readTSFile('quizzes.ts');
    const re = /(?:sentence|correctAnswer):\s*'([^']+)'/g;
    let m, i = 0;
    while ((m = re.exec(src)) !== null) {
      if (hasKorean(m[1])) add('quiz_' + i++, m[1]);
    }
  }

  return entries;
}

// ─── Check what's already cached ───────────────────────────────────────────

function loadManifest() {
  return existsSync(MANIFEST_PATH) ? JSON.parse(readFileSync(MANIFEST_PATH, 'utf-8')) : {};
}

function getExistingTexts(manifest) {
  const texts = new Set();
  for (const text of Object.values(manifest)) {
    texts.add(text);
    texts.add(cleanForAudio(String(text)));
  }
  return texts;
}

// ─── TTS Generation ────────────────────────────────────────────────────────

async function generateAudio(id, text) {
  const outputPath = join(OUTPUT_DIR, id + '.mp3');
  if (existsSync(outputPath)) return 'skip';

  try {
    const tts = new EdgeTTS();
    await tts.synthesize(text, VOICE);
    const buffer = tts.toBuffer();
    writeFileSync(outputPath, buffer);
    return 'ok';
  } catch (err) {
    console.error('  x ' + id + ': ' + err.message);
    return 'error';
  }
}

async function runBatch(items, concurrency) {
  let generated = 0, skipped = 0, errors = 0;

  for (let i = 0; i < items.length; i += concurrency) {
    const batch = items.slice(i, i + concurrency);
    const results = await Promise.all(
      batch.map(({ id, text }) => generateAudio(id, text))
    );
    for (const r of results) {
      if (r === 'ok') generated++;
      else if (r === 'skip') skipped++;
      else errors++;
    }
    const done = Math.min(i + concurrency, items.length);
    if (done % 25 < concurrency) {
      process.stdout.write('  [' + done + '/' + items.length + '] gen=' + generated + ' skip=' + skipped + ' err=' + errors + '\r');
    }
  }
  console.log();
  return { generated, skipped, errors };
}

// ─── Main ──────────────────────────────────────────────────────────────────

async function main() {
  console.log('Extracting Korean text from ALL data files...');
  const allEntries = extractAll();
  console.log('  Found ' + allEntries.size + ' unique Korean texts\n');

  const manifest = loadManifest();
  const existingTexts = getExistingTexts(manifest);

  const missing = [];
  for (const [text, id] of allEntries) {
    if (!existingTexts.has(text)) {
      missing.push({ id: 'auto_' + id, text });
    }
  }

  console.log('  Already cached: ' + (allEntries.size - missing.length));
  console.log('  Missing: ' + missing.length + '\n');

  if (missing.length === 0) {
    console.log('All audio is already generated!');
    return;
  }

  console.log('Generating ' + missing.length + ' audio files (' + CONCURRENCY + ' parallel)...');
  const { generated, skipped, errors } = await runBatch(missing, CONCURRENCY);

  // Update manifest
  for (const item of missing) {
    const outputPath = join(OUTPUT_DIR, item.id + '.mp3');
    if (existsSync(outputPath)) {
      manifest[item.id] = item.text;
    }
  }
  writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));

  console.log('\nDone!');
  console.log('  Generated: ' + generated);
  console.log('  Skipped: ' + skipped);
  console.log('  Errors: ' + errors);
  console.log('  Manifest entries: ' + Object.keys(manifest).length);
  console.log('\nRun: node scripts/generate-audio-cache.mjs  to rebuild the cache');
}

main().catch(console.error);

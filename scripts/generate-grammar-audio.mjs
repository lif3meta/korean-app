#!/usr/bin/env node
/**
 * Generate ONLY the missing grammar example audio files.
 * Quick run — just the individual Korean examples for AudioButton playback.
 */

import { EdgeTTS } from '@andresaya/edge-tts';
import { writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const VOICE = 'ko-KR-SunHiNeural';
const OUTPUT_DIR = join(import.meta.dirname, '..', 'assets', 'audio', 'ko');

mkdirSync(OUTPUT_DIR, { recursive: true });

const grammarExamples = [
  // g_sov
  { id: 'gram_g_sov_s0_e0', text: '저는 밥을 먹어요' },
  { id: 'gram_g_sov_s0_e1', text: '저는 한국어를 공부해요' },
  { id: 'gram_g_sov_s1_e0', text: '밥 먹었어요' },
  { id: 'gram_g_sov_s1_e1', text: '괜찮아요' },
  // g_topic
  { id: 'gram_g_topic_s0_e0', text: '저는 학생이에요' },
  { id: 'gram_g_topic_s0_e1', text: '한국은 아름다워요' },
  { id: 'gram_g_topic_s0_h', text: '은 는' },
  // g_subject
  { id: 'gram_g_subject_s0_e0', text: '비가 와요' },
  { id: 'gram_g_subject_s0_e1', text: '고양이가 귀여워요' },
  { id: 'gram_g_subject_s0_h', text: '이 가' },
  // g_object
  { id: 'gram_g_object_s0_e0', text: '저는 커피를 마셔요' },
  { id: 'gram_g_object_s0_e1', text: '책을 읽어요' },
  { id: 'gram_g_object_s0_h', text: '을 를' },
  // g_present
  { id: 'gram_g_present_s0_e0', text: '가다 가요' },
  { id: 'gram_g_present_s0_e1', text: '먹다 먹어요' },
  { id: 'gram_g_present_s0_e2', text: '공부하다 공부해요' },
  // g_past
  { id: 'gram_g_past_s0_e0', text: '가다 갔어요' },
  { id: 'gram_g_past_s0_e1', text: '먹다 먹었어요' },
  { id: 'gram_g_past_s0_e2', text: '공부하다 공부했어요' },
  // g_future
  { id: 'gram_g_future_s0_e0', text: '가다 갈 거예요' },
  { id: 'gram_g_future_s0_e1', text: '먹다 먹을 거예요' },
  { id: 'gram_g_future_s0_e2', text: '내일 영화를 볼 거예요' },
  // g_negative
  { id: 'gram_g_negative_s0_e0', text: '안 먹어요' },
  { id: 'gram_g_negative_s0_e1', text: '안 좋아요' },
  { id: 'gram_g_negative_s1_e0', text: '먹지 않아요' },
  { id: 'gram_g_negative_s1_e1', text: '좋지 않아요' },
  // g_want
  { id: 'gram_g_want_s0_e0', text: '한국에 가고 싶어요' },
  { id: 'gram_g_want_s0_e1', text: '김치를 먹고 싶어요' },
  { id: 'gram_g_want_s0_e2', text: '한국어를 배우고 싶어요' },
  // g_connect
  { id: 'gram_g_connect_s0_e0', text: '밥을 먹고 커피를 마셔요' },
  { id: 'gram_g_connect_s1_e0', text: '비싸지만 맛있어요' },
  { id: 'gram_g_connect_s1_e1', text: '어렵지만 재미있어요' },
  // g_location
  { id: 'gram_g_location_s0_e0', text: '학교에 가요' },
  { id: 'gram_g_location_s0_e1', text: '집에 있어요' },
  { id: 'gram_g_location_s1_e0', text: '도서관에서 공부해요' },
  { id: 'gram_g_location_s1_e1', text: '카페에서 커피를 마셔요' },
  // g_speech
  { id: 'gram_g_speech_s0_e0', text: '감사합니다' },
  { id: 'gram_g_speech_s0_e1', text: '고마워요' },
  { id: 'gram_g_speech_s0_e2', text: '고마워' },
  { id: 'gram_g_speech_s1_e0', text: '먹습니다' },
  { id: 'gram_g_speech_s1_e1', text: '먹어요' },
  { id: 'gram_g_speech_s1_e2', text: '먹어' },
];

async function generateAudio(id, text) {
  const outputPath = join(OUTPUT_DIR, id + '.mp3');
  if (existsSync(outputPath)) {
    console.log('  skip  ' + id + ' (exists)');
    return 'skip';
  }
  try {
    const tts = new EdgeTTS();
    await tts.synthesize(text, VOICE);
    const buffer = tts.toBuffer();
    writeFileSync(outputPath, buffer);
    console.log('  ✓  ' + id + ' — ' + text + ' (' + (buffer.length / 1024).toFixed(1) + ' KB)');
    return 'ok';
  } catch (err) {
    console.error('  ✗  ' + id + ' — ' + text + ': ' + err.message);
    return 'error';
  }
}

async function main() {
  console.log('Generating grammar example audio...');
  console.log('Total: ' + grammarExamples.length + ' files\n');

  let generated = 0, skipped = 0, errors = 0;
  for (const ex of grammarExamples) {
    const result = await generateAudio(ex.id, ex.text);
    if (result === 'ok') generated++;
    else if (result === 'skip') skipped++;
    else errors++;
  }

  console.log('\nDone!');
  console.log('  Generated: ' + generated);
  console.log('  Skipped: ' + skipped);
  console.log('  Errors: ' + errors);
}

main().catch(console.error);

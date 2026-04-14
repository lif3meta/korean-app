import * as FileSystem from 'expo-file-system/legacy';
import type { HangulCharacter } from '@/data/hangul';
import { getHangulAudioText, getHangulByCharacter } from '@/data/hangul';
import { useAppStore } from '@/lib/store';
import type { ChatVoice } from '@/lib/chatVoices';
import { hasCachedAudio, getCachedAudioId, getCachedAudioUri, hasCachedHangulAudio, getCachedHangulAudioId, getCachedEnglishAudioId } from './audioCache';

// ─── Base64 Utils (Avoid atob/btoa dependencies) ──────────────────────────

const b64chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

function decodeB64(s: string): Uint8Array {
  // Pad to a multiple of 4 so every group is complete
  let padded = s.replace(/[^A-Za-z0-9+/]/g, '');
  while (padded.length % 4 !== 0) padded += '=';

  const len = padded.length;
  const bufferLen = (len / 4) * 3
    - (padded[len - 1] === '=' ? 1 : 0)
    - (padded[len - 2] === '=' ? 1 : 0);

  const buffer = new Uint8Array(bufferLen);
  for (let i = 0, j = 0; i < len; i += 4) {
    const c1 = b64chars.indexOf(padded[i]);
    const c2 = b64chars.indexOf(padded[i + 1]);
    const c3 = b64chars.indexOf(padded[i + 2]);
    const c4 = b64chars.indexOf(padded[i + 3]);

    buffer[j++] = (c1 << 2) | (c2 >> 4);
    if (j < bufferLen) buffer[j++] = ((c2 & 0x0f) << 4) | (c3 >> 2);
    if (j < bufferLen) buffer[j++] = ((c3 & 0x03) << 6) | c4;
  }
  return buffer;
}

function encodeB64(bytes: Uint8Array): string {
  let result = '';
  const len = bytes.length;
  for (let i = 0; i < len; i += 3) {
    result += b64chars[bytes[i] >> 2];
    result += b64chars[((bytes[i] & 0x03) << 4) | (bytes[i + 1] >> 4)];
    result += b64chars[((bytes[i + 1] & 0x0f) << 2) | (bytes[i + 2] >> 6)];
    result += b64chars[bytes[i + 2] & 0x3f];
  }
  const padding = len % 3 === 1 ? '==' : len % 3 === 2 ? '=' : '';
  return result.substring(0, result.length - padding.length) + padding;
}

// ─── Audio mode initialization (required for real iOS devices) ─────────────

let _audioModeInitialized = false;

export async function initAudioMode(): Promise<void> {
  if (_audioModeInitialized) return;
  try {
    const expoAudio = require('expo-audio');
    await expoAudio.setAudioModeAsync({
      playsInSilentMode: true,
      interruptionMode: 'duckOthers',
      allowsRecordingIOS: true,
    });
    _audioModeInitialized = true;
    // Pre-warm the audio player so first tap is instant
    await getAudioPlayer();
    console.log('[Audio] Audio mode initialized');
  } catch (err) {
    console.warn('[Audio] Failed to initialize audio mode:', err);
  }
}

// ─── Audio player (expo-audio) ──────────────────────────────────────────────

let _audioPlayer: any = null;

async function getAudioPlayer() {
  if (!_audioPlayer) {
    try {
      const expoAudio = require('expo-audio');
      if (typeof expoAudio.createAudioPlayer === 'function') {
        _audioPlayer = expoAudio.createAudioPlayer(null, { keepAudioSessionActive: true });
      } else if (expoAudio.AudioPlayer) {
        _audioPlayer = new expoAudio.AudioPlayer();
      }
    } catch {}
  }
  return _audioPlayer;
}

/** Pause current audio, load a new source, wait for it to be ready, then play. */
function replaceAndPlay(player: any, uri: string, rate: number = 1.0): Promise<void> {
  return new Promise<void>((resolve) => {
    let resolved = false;
    const done = () => { if (!resolved) { resolved = true; resolve(); } };

    // Timeout: if not loaded in 2s, play anyway (don't block forever)
    const timeout = setTimeout(() => {
      try { player.play(); } catch {}
      done();
    }, 2000);

    const listener = player.addListener('playbackStatusUpdate', (status: any) => {
      if (status.isLoaded && !resolved) {
        clearTimeout(timeout);
        listener.remove();
        try { player.setPlaybackRate(rate, 'medium'); } catch { try { player.playbackRate = rate; } catch {} }
        player.play();
        done();
      }
    });

    try { player.pause(); } catch {}
    player.replace({ uri });
  });
}

async function playCachedMp3(fileId: string, rate: number = 1.0): Promise<boolean> {
  try {
    await initAudioMode();
    const uri = await getCachedAudioUri(fileId);
    if (!uri) return false;

    const player = await getAudioPlayer();
    if (!player) return false;

    await replaceAndPlay(player, uri, rate);
    return true;
  } catch (err) {
    console.warn('[Audio] Cached MP3 playback failed:', err);
    return false;
  }
}

/**
 * Play a pre-generated audio file by its ID and wait for completion.
 * Used by audio lessons (podcast player) for offline playback.
 */
export async function playAudioByIdAsync(fileId: string, rate: number = 1.0): Promise<boolean> {
  const played = await playCachedMp3(fileId, rate);
  if (!played) return false;

  const player = await getAudioPlayer();
  if (!player) return true;

  // Wait for playback to finish using event listener instead of polling
  await new Promise<void>(resolve => {
    const timeout = setTimeout(resolve, 30000);
    const listener = player.addListener('playbackStatusUpdate', (status: any) => {
      if (status.didJustFinish) {
        clearTimeout(timeout);
        listener.remove();
        resolve();
      }
    });
  });
  return true;
}

/** Simple fixed-duration wait. No player polling — just waits the given ms. */
function waitMs(ms: number): Promise<void> {
  return new Promise(r => setTimeout(r, ms));
}

// Legacy WebView ref (kept for compatibility)
export function setAudioWebViewRef(_ref: any): void {}

function cleanSpeechText(text: string): string {
  return text.replace(/[*_#`~]/g, '').trim();
}

export type AudioCue =
  | { kind: 'korean_text'; text: string }
  | { kind: 'hangul_sound'; value: string | HangulCharacter; rate?: number }
  | { kind: 'disabled' };

let _speechSequenceId = 0;
let _pendingSpeechStartTimeout: ReturnType<typeof setTimeout> | null = null;

function normalizeChatSpeechText(text: string): string {
  return cleanSpeechText(text)
    .replace(/\(([A-Za-z][A-Za-z\s'.,-]*)\)/g, '')
    .replace(/!+/g, '.')
    .replace(/\.{2,}/g, '.')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

async function prepareSpeechSequence(delayMs: number = 100): Promise<number> {
  const sequenceId = ++_speechSequenceId;
  clearPendingSpeechStart();
  await stopGeminiPlayback();

  if (delayMs > 0) {
    await new Promise<void>((resolve) => {
      _pendingSpeechStartTimeout = setTimeout(() => {
        _pendingSpeechStartTimeout = null;
        resolve();
      }, delayMs);
    });
  }

  return sequenceId;
}

function isCurrentSpeechSequence(sequenceId: number): boolean {
  return sequenceId === _speechSequenceId;
}

function isAudioEnabled(): boolean {
  try {
    return useAppStore.getState().soundEnabled;
  } catch {
    return true;
  }
}

function isSingleCompatibilityJamo(text: string): boolean {
  return /^[\u3131-\u3163]$/.test(text.trim());
}

function expandHangulContrastNotation(text: string): string | null {
  const cleanText = cleanSpeechText(text);
  if (!cleanText.includes('/')) return null;

  const parts = cleanText
    .split('/')
    .map((part) => part.trim())
    .filter(Boolean);

  if (parts.length < 2 || !parts.every(isSingleCompatibilityJamo)) {
    return null;
  }

  const syllables = parts
    .map((part) => getHangulByCharacter(part))
    .filter((character): character is HangulCharacter => Boolean(character))
    .map((character) => getHangulAudioText(character));

  return syllables.length === parts.length ? syllables.join(' ') : null;
}

function isBatchimNotation(text: string): boolean {
  return /^[\u3131-\u314e]\s*\[[^\]]+\]$/.test(cleanSpeechText(text));
}

function normalizePronunciationExampleText(text: string): string {
  return cleanSpeechText(text)
    .replace(/\s*\/\s*/g, ', ')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

export function resolvePronunciationAudioCue(text: string): AudioCue {
  const cleanText = cleanSpeechText(text);
  if (!cleanText) return { kind: 'disabled' };

  // Batchim notation like "ㄱ [k]" — extract the consonant and play its sound
  if (isBatchimNotation(cleanText)) {
    const consonant = cleanText.match(/^([\u3131-\u314e])/)?.[1];
    if (consonant) {
      return { kind: 'hangul_sound', value: consonant, rate: 0.8 };
    }
    return { kind: 'disabled' };
  }

  // Contrast notation like "ㅈ / ㅊ / ㅉ" — play the first character's sound
  const contrastText = expandHangulContrastNotation(cleanText);
  if (contrastText) {
    // Play the first syllable sound (e.g. "자" from "자 차 짜")
    const firstSound = contrastText.split(' ')[0];
    if (firstSound) {
      return { kind: 'korean_text', text: firstSound };
    }
    return { kind: 'korean_text', text: contrastText };
  }

  if (isSingleCompatibilityJamo(cleanText)) {
    return { kind: 'hangul_sound', value: cleanText };
  }

  return { kind: 'korean_text', text: normalizePronunciationExampleText(cleanText) };
}

// ─── PCM to WAV conversion ──────────────────────────────────────────────────

function createWavHeader(pcmLength: number, sampleRate: number, numChannels: number = 1, bitsPerSample: number = 16): Uint8Array {
  const byteRate = sampleRate * numChannels * (bitsPerSample / 8);
  const blockAlign = numChannels * (bitsPerSample / 8);
  const dataSize = pcmLength;
  const fileSize = 36 + dataSize;

  const header = new ArrayBuffer(44);
  const view = new DataView(header);

  // RIFF header
  view.setUint32(0, 0x52494646, false); // "RIFF"
  view.setUint32(4, fileSize, true);
  view.setUint32(8, 0x57415645, false); // "WAVE"

  // fmt chunk
  view.setUint32(12, 0x666d7420, false); // "fmt "
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // PCM
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitsPerSample, true);

  // data chunk
  view.setUint32(36, 0x64617461, false); // "data"
  view.setUint32(40, dataSize, true);

  return new Uint8Array(header);
}

function base64ToBytes(base64: string): Uint8Array {
  return decodeB64(base64);
}

function bytesToBase64(bytes: Uint8Array): string {
  return encodeB64(bytes);
}

function concatBytes(chunks: Uint8Array[]): Uint8Array {
  const totalLength = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
  const combined = new Uint8Array(totalLength);
  let offset = 0;

  for (const chunk of chunks) {
    combined.set(chunk, offset);
    offset += chunk.length;
  }

  return combined;
}

async function playPcmBytesAsWav(pcmBytes: Uint8Array, sampleRate: number, playbackRate: number = 1.0): Promise<boolean> {
  if (pcmBytes.length === 0) return false;

  const wavHeader = createWavHeader(pcmBytes.length, sampleRate);
  const wavBytes = new Uint8Array(wavHeader.length + pcmBytes.length);
  wavBytes.set(wavHeader, 0);
  wavBytes.set(pcmBytes, wavHeader.length);
  const wavBase64 = bytesToBase64(wavBytes);

  const filePath = `${FileSystem.cacheDirectory}gemini_tts_${Date.now()}.wav`;
  await FileSystem.writeAsStringAsync(filePath, wavBase64, {
    encoding: 'base64',
  });

  const player = await getAudioPlayer();
  if (!player) return false;

  await replaceAndPlay(player, filePath, playbackRate);
  return true;
}

// ─── Chat TTS ───────────────────────────────────────────────────────────────

export async function speakChatMessageAsync(text: string, voice: ChatVoice): Promise<void> {
  if (!isAudioEnabled()) return;

  const input = normalizeChatSpeechText(text);
  if (!input) return;

  void voice;
  await prepareSpeechSequence(0);
  await speakMixedTextAsync(input);
}

export function speakChatMessage(text: string, voice: ChatVoice): void {
  void speakChatMessageAsync(text, voice);
}

async function stopGeminiPlayback(): Promise<void> {
  try {
    const player = await getAudioPlayer();
    if (player) player.pause();
  } catch {}
}

function clearPendingSpeechStart(): void {
  if (_pendingSpeechStartTimeout) {
    clearTimeout(_pendingSpeechStartTimeout);
    _pendingSpeechStartTimeout = null;
  }
}

// ─── Edge TTS Server Proxy (fallback for uncached content) ──────────────────
// Fetches audio from the Edge TTS server, caches it locally, and plays it.
// No Expo Speech used anywhere — all audio is Edge TTS (neural voices).

const _edgeTtsCache: Record<string, string> = {}; // text → local file URI

async function fetchEdgeTtsAudio(text: string, voice: 'coral' | 'ash' = 'coral'): Promise<string | null> {
  const cacheKey = `${voice}:${text}`;
  if (_edgeTtsCache[cacheKey]) return _edgeTtsCache[cacheKey];

  try {
    const Constants = require('expo-constants').default;
    const baseUrl = Constants.expoConfig?.extra?.apiBaseUrl || 'https://hanflow-tts-proxy.vercel.app';
    const url = `${baseUrl}/api/chat-speech?text=${encodeURIComponent(text)}&voice=${voice}`;

    const localPath = `${FileSystem.cacheDirectory}edge_tts_${Date.now()}_${Math.random().toString(36).slice(2)}.mp3`;

    // Race against a timeout so we never hang
    const result = await Promise.race([
      FileSystem.downloadAsync(url, localPath),
      new Promise<null>((resolve) => setTimeout(() => resolve(null), 5000)),
    ]);

    if (result && typeof result === 'object' && 'status' in result && result.status === 200) {
      _edgeTtsCache[cacheKey] = localPath;
      return localPath;
    }
    return null;
  } catch {
    return null;
  }
}

async function speakViaEdgeTts(text: string, voice: 'coral' | 'ash' = 'coral', rate: number = 1.0): Promise<boolean> {
  await initAudioMode();
  const uri = await fetchEdgeTtsAudio(text, voice);
  if (!uri) return false;

  const player = await getAudioPlayer();
  if (!player) return false;

  await replaceAndPlay(player, uri, rate);

  // Wait for estimated playback duration
  const estimatedMs = Math.max(1000, Math.round(text.length * 150 / rate));
  await waitMs(estimatedMs);
  return true;
}


// Play Korean text: cached MP3 → Edge TTS server → silent fail (no Expo Speech)
async function speakKoreanViaCache(text: string): Promise<boolean> {
  const cachedId = getCachedAudioId(text);
  if (cachedId) {
    const played = await playCachedMp3(cachedId);
    if (played) return true;
  }
  // Fallback to Edge TTS server
  return await speakViaEdgeTts(text);
}

// ─── Mixed Text (Korean + English) ──────────────────────────────────────────

type SpeechSegment = {
  text: string;
  language: 'ko-KR' | 'en-US';
  rate: number;
};

function splitIntoSpeechSegments(text: string): SpeechSegment[] {
  const cleanText = cleanSpeechText(text);
  if (!cleanText) return [];

  const chunks = cleanText
    .split(/([\uAC00-\uD7AF\u1100-\u11FF\u3130-\u318F]+)/g)
    .map((chunk) => chunk.trim())
    .filter(Boolean);

  const segments: SpeechSegment[] = [];

  for (const chunk of chunks) {
    const isKorean = /[\uAC00-\uD7AF\u1100-\u11FF\u3130-\u318F]/.test(chunk);
    const language: 'ko-KR' | 'en-US' = isKorean ? 'ko-KR' : 'en-US';
    const rate = isKorean ? 0.9 : 1.0;
    const previous = segments[segments.length - 1];

    if (previous && previous.language === language) {
      previous.text = `${previous.text} ${chunk}`.trim();
      continue;
    }

    segments.push({ text: chunk, language, rate });
  }

  return segments;
}

export async function speakMixedTextAsync(text: string): Promise<void> {
  if (!isAudioEnabled()) return;

  // Use Edge TTS server for mixed text (handles Korean+English natively)
  const cleanText = cleanSpeechText(text);
  if (!cleanText) return;

  const sequenceId = ++_speechSequenceId;
  clearPendingSpeechStart();
  await stopGeminiPlayback();

  await speakViaEdgeTts(cleanText);
}

export function speakMixedText(text: string): void {
  void speakMixedTextAsync(text);
}

// ─── Korean TTS ─────────────────────────────────────────────────────────────

function buildKoreanSpeech(text: string, rate: number) {
  const cleanText = cleanSpeechText(text);
  return {
    spokenText: cleanText,
    effectiveRate: rate,
  };
}

async function speakKoreanWithRateAsync(text: string, rate: number): Promise<void> {
  if (!isAudioEnabled()) return;

  const { spokenText, effectiveRate } = buildKoreanSpeech(text, rate);
  if (!spokenText) return;

  const sequenceId = await prepareSpeechSequence(0);
  if (!isCurrentSpeechSequence(sequenceId)) return;

  // Try pre-generated Edge TTS audio first (high quality, instant, free)
  const cachedId = getCachedAudioId(spokenText);
  if (cachedId) {
    const played = await playCachedMp3(cachedId, effectiveRate);
    if (played) return;
  }
  if (!isCurrentSpeechSequence(sequenceId)) return;

  // Fallback to Edge TTS server proxy (no Expo Speech)
  await speakViaEdgeTts(spokenText, 'coral', effectiveRate);
}

export async function speakKoreanAsync(text: string, _voice?: string): Promise<void> {
  await speakKoreanWithRateAsync(text, 0.85);
}

export function speakKorean(text: string, rate: number = 0.85): void {
  void speakKoreanWithRateAsync(text, rate);
}


// ─── English TTS ────────────────────────────────────────────────────────────

export async function speakEnglishAsync(text: string, _voice?: string): Promise<void> {
  if (!isAudioEnabled()) return;

  await stopGeminiPlayback();
  // Use Edge TTS server for English (no Expo Speech)
  await speakViaEdgeTts(text, 'ash');
}

export function speakEnglish(text: string): void {
  void speakEnglishAsync(text);
}

async function speakHangulCueAsync(text: string, rate: number, _romanization?: string): Promise<void> {
  if (!isAudioEnabled()) return;

  const sequenceId = await prepareSpeechSequence(0);
  if (!isCurrentSpeechSequence(sequenceId)) return;

  // Try pre-generated Edge TTS audio first (high quality, instant, free)
  const cachedId = getCachedAudioId(text);
  if (cachedId) {
    const played = await playCachedMp3(cachedId, rate);
    if (played) return;
  }

  // Fallback to Edge TTS server (no Expo Speech)
  await speakViaEdgeTts(text, 'coral', rate);
}

export async function speakHangulSymbolAsync(value: string | HangulCharacter, rate: number = 0.8): Promise<void> {
  const character = typeof value === 'string' ? getHangulByCharacter(value) : value;
  if (!character) return;
  await speakHangulCharacterAsync(character, rate);
}

export async function speakHangulCharacterAsync(character: HangulCharacter, rate: number = 0.8): Promise<void> {
  if (!isAudioEnabled()) return;

  // Try cached audio by character ID first
  const cachedId = getCachedHangulAudioId(character.id);
  if (cachedId) {
    const sequenceId = await prepareSpeechSequence(0);
    if (!isCurrentSpeechSequence(sequenceId)) return;
    const played = await playCachedMp3(cachedId, rate);
    if (played) return;
  }

  // Fallback to cue-based playback
  const text = getHangulAudioText(character);
  await speakHangulCueAsync(text, rate, character.romanization);
}

export function speakHangulCharacter(character: HangulCharacter, rate: number = 0.8): void {
  void speakHangulCharacterAsync(character, rate);
}

export async function playAudioCueAsync(cue: AudioCue): Promise<boolean> {
  if (!isAudioEnabled()) return false;

  switch (cue.kind) {
    case 'disabled':
      return false;
    case 'hangul_sound':
      await speakHangulSymbolAsync(cue.value, cue.rate ?? 0.8);
      return true;
    case 'korean_text':
      await speakKoreanAsync(cue.text);
      return true;
  }
}

export function playAudioCue(cue: AudioCue): void {
  void playAudioCueAsync(cue);
}

// ─── Lesson Narration (natural Gemini voice) ───────────────────────────────

export async function speakLessonNarrationAsync(text: string): Promise<void> {
  if (!isAudioEnabled()) return;

  const sequenceId = await prepareSpeechSequence(0);
  if (!isCurrentSpeechSequence(sequenceId)) return;

  // Use Edge TTS server for narration (handles Korean+English natively, no Expo Speech)
  await speakViaEdgeTts(text);
}

// ─── Control ────────────────────────────────────────────────────────────────

export async function stopSpeaking(): Promise<void> {
  _speechSequenceId += 1;
  clearPendingSpeechStart();
  await stopGeminiPlayback();
}

export async function playPcm16AudioBase64Chunks(
  base64Chunks: string[],
  sampleRate: number = 24000
): Promise<boolean> {
  if (!isAudioEnabled()) return false;

  await stopGeminiPlayback();

  const pcmChunks = base64Chunks
    .filter(Boolean)
    .map((chunk) => base64ToBytes(chunk));

  return await playPcmBytesAsWav(concatBytes(pcmChunks), sampleRate);
}

export async function waitForSpeechEnd(): Promise<void> {
  await waitMs(1200);
}

/**
 * Direct playback that bypasses the speech sequence cancellation system.
 * Use this for loops (parrot learning, fast hangul) where each call should
 * play to completion without being cancelled by the next call.
 */
export async function speakKoreanDirectAsync(text: string, rate: number = 0.85): Promise<void> {
  if (!isAudioEnabled()) return;

  const cleanText = cleanSpeechText(text);
  if (!cleanText) return;

  const cachedId = getCachedAudioId(cleanText);
  if (!cachedId) return; // No cached audio — skip silently

  const played = await playCachedMp3(cachedId, rate);
  if (played) {
    await waitMs(Math.max(1200, Math.round(cleanText.length * 200 / rate)));
  }
}

export async function speakEnglishDirectAsync(text: string): Promise<void> {
  if (!isAudioEnabled()) return;

  const cleanText = cleanSpeechText(text);
  if (!cleanText) return;

  const cachedId = getCachedEnglishAudioId(cleanText);
  if (!cachedId) return; // No cached audio — skip silently

  const played = await playCachedMp3(cachedId);
  if (played) {
    await waitMs(Math.max(1000, Math.round(cleanText.length * 100)));
  }
}

/**
 * Direct hangul character playback for fast hangul / loops.
 * Fire-and-forget — does NOT wait for completion (fast hangul uses its own timer).
 */
export async function speakHangulDirectAsync(character: HangulCharacter, rate: number = 0.8): Promise<void> {
  if (!isAudioEnabled()) return;

  const cachedId = getCachedHangulAudioId(character.id);
  if (cachedId) {
    await playCachedMp3(cachedId, rate);
    return;
  }

  // Fallback — fire and forget, don't await TTS
  const text = getHangulAudioText(character);
  const uri = await fetchEdgeTtsAudio(text, 'coral');
  if (!uri) return;
  const player = await getAudioPlayer();
  if (!player) return;
  await replaceAndPlay(player, uri, rate);
}

export async function cleanupAudio(): Promise<void> {
  await stopGeminiPlayback();
}

// ─── Asset Preloading ──────────────────────────────────────────────────────

export async function preloadAudioAssets(
  onProgress?: (loaded: number, total: number) => void
): Promise<void> {
  // Initialize audio mode + pre-warm the player (fast, ~100ms)
  await initAudioMode();
  onProgress?.(1, 1);
}

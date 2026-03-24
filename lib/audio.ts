import Constants from 'expo-constants';
import * as Speech from 'expo-speech';

type ExtraConfig = {
  apiBaseUrl?: string | null;
};

const extra = (Constants.expoConfig?.extra ?? {}) as ExtraConfig;
const API_BASE_URL = extra.apiBaseUrl?.replace(/\/$/, '') ?? '';

// ─── Global WebView ref for Pollinations AI audio ──────────────────────────

let _audioWebViewRef: any = null;

export function setAudioWebViewRef(ref: any): void {
  _audioWebViewRef = ref;
}

function cleanSpeechText(text: string): string {
  return text.replace(/[*_#`~]/g, '').trim();
}

type SpeechSegment = {
  text: string;
  language: 'ko-KR' | 'en-US';
  rate: number;
};

type ChatVoice = 'coral' | 'ash';

let _speechSequenceId = 0;

function playViaPollinations(text: string, voice: string = 'nova'): boolean {
  if (!_audioWebViewRef) return false;
  const cleanText = cleanSpeechText(text);
  if (!cleanText) return false;
  const escaped = cleanText.replace(/'/g, "\\'").replace(/\n/g, ' ');
  _audioWebViewRef.injectJavaScript(`
    (function() {
      if (window.currentAudio) { window.currentAudio.pause(); window.currentAudio = null; }
      var url = 'https://gen.pollinations.ai/audio/' + encodeURIComponent('${escaped}') + '?voice=${voice}&model=openai-audio';
      var audio = new Audio(url);
      audio.play().catch(function() {});
      window.currentAudio = audio;
    })();
    true;
  `);
  return true;
}

function stopPollinations(): void {
  if (!_audioWebViewRef) return;
  _audioWebViewRef.injectJavaScript(`
    if (window.currentAudio) { window.currentAudio.pause(); window.currentAudio = null; }
    true;
  `);
}

function normalizeChatSpeechText(text: string): string {
  return cleanSpeechText(text)
    .replace(/\(([A-Za-z][A-Za-z\s'.,-]*)\)/g, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

function playRemoteAudioViaWebView(url: string): boolean {
  if (!_audioWebViewRef) return false;
  const escapedUrl = url.replace(/'/g, "\\'");
  _audioWebViewRef.injectJavaScript(`
    (function() {
      if (window.currentAudio) { window.currentAudio.pause(); window.currentAudio = null; }
      var audio = new Audio('${escapedUrl}');
      audio.play().catch(function() {});
      window.currentAudio = audio;
    })();
    true;
  `);
  return true;
}

async function stopChatPlayback(): Promise<void> {
  stopPollinations();
}

export async function speakChatMessageAsync(text: string, voice: ChatVoice): Promise<void> {
  const input = normalizeChatSpeechText(text);
  if (!input) return;

  if (!API_BASE_URL) {
    await speakMixedTextAsync(text);
    return;
  }

  await stopChatPlayback();
  Speech.stop();

  try {
    const proxyUrl = `${API_BASE_URL}/api/chat-speech?voice=${encodeURIComponent(voice)}&text=${encodeURIComponent(input)}`;
    if (!playRemoteAudioViaWebView(proxyUrl)) {
      throw new Error('Audio WebView is not ready');
    }
  } catch {
    await speakMixedTextAsync(text);
  }
}

export function speakChatMessage(text: string, voice: ChatVoice): void {
  void speakChatMessageAsync(text, voice);
}

function speakWithExpoSpeech(text: string, language: string, rate: number): void {
  const cleanText = cleanSpeechText(text);
  if (!cleanText) return;

  Speech.speak(cleanText, {
    language,
    rate,
    pitch: 1.0,
    onError: () => {
      const fallbackVoice = language.startsWith('ko') ? 'nova' : 'alloy';
      playViaPollinations(cleanText, fallbackVoice);
    },
  });
}

function speakWithExpoSpeechAsync(text: string, language: string, rate: number): Promise<void> {
  const cleanText = cleanSpeechText(text);
  if (!cleanText) return Promise.resolve();

  return new Promise<void>((resolve) => {
    Speech.speak(cleanText, {
      language,
      rate,
      pitch: 1.0,
      onDone: resolve,
      onStopped: resolve,
      onError: () => {
        const fallbackVoice = language.startsWith('ko') ? 'nova' : 'alloy';
        playViaPollinations(cleanText, fallbackVoice);
        resolve();
      },
    });
  });
}

function splitIntoSpeechSegments(text: string): SpeechSegment[] {
  const cleanText = cleanSpeechText(text);
  if (!cleanText) return [];

  const chunks = cleanText
    .split(/(\([^)]+\)|[\uAC00-\uD7AF\u1100-\u11FF\u3130-\u318F]+|[^\uAC00-\uD7AF\u1100-\u11FF\u3130-\u318F]+)/g)
    .map((chunk) => chunk.trim())
    .filter(Boolean);

  const segments: SpeechSegment[] = [];

  for (const chunk of chunks) {
    const hasKorean = /[\uAC00-\uD7AF\u1100-\u11FF\u3130-\u318F]/.test(chunk);
    const language: 'ko-KR' | 'en-US' = hasKorean ? 'ko-KR' : 'en-US';
    const rate = hasKorean ? 0.85 : 0.92;
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
  const segments = splitIntoSpeechSegments(text);
  if (segments.length === 0) return;

  const sequenceId = ++_speechSequenceId;
  Speech.stop();
  stopPollinations();

  for (const segment of segments) {
    if (sequenceId !== _speechSequenceId) return;
    await speakWithExpoSpeechAsync(segment.text, segment.language, segment.rate);
  }
}

export function speakMixedText(text: string): void {
  void speakMixedTextAsync(text);
}

// ─── Korean TTS ──────────────────────────────────────────────────────────────

export async function speakKoreanAsync(text: string, _voice?: string): Promise<void> {
  Speech.stop();
  stopPollinations();
  return speakWithExpoSpeechAsync(text, 'ko-KR', 0.85);
}

export function speakKorean(text: string, rate: number = 0.85): void {
  Speech.stop();
  stopPollinations();
  speakWithExpoSpeech(text, 'ko-KR', rate);
}

export function speakKoreanSlow(text: string): void {
  Speech.stop();
  stopPollinations();
  speakWithExpoSpeech(text, 'ko-KR', 0.5);
}

// ─── English TTS ─────────────────────────────────────────────────────────────

export async function speakEnglishAsync(text: string, _voice?: string): Promise<void> {
  Speech.stop();
  stopPollinations();
  return speakWithExpoSpeechAsync(text, 'en-US', 0.9);
}

export function speakEnglish(text: string): void {
  Speech.stop();
  stopPollinations();
  speakWithExpoSpeech(text, 'en-US', 0.9);
}

// ─── Control ─────────────────────────────────────────────────────────────────

export async function stopSpeaking(): Promise<void> {
  _speechSequenceId += 1;
  await stopChatPlayback();
  Speech.stop();
  stopPollinations();
}

export async function waitForSpeechEnd(): Promise<void> {
  return new Promise<void>((resolve) => {
    const check = () => {
      Speech.isSpeakingAsync().then((speaking) => {
        if (!speaking) resolve();
        else setTimeout(check, 200);
      });
    };
    check();
    setTimeout(resolve, 10000);
  });
}

export async function cleanupAudio(): Promise<void> {
  await stopChatPlayback();
  Speech.stop();
  stopPollinations();
}

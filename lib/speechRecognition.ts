import { requestRecordingPermissionsAsync } from 'expo-audio';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SpeechResult {
  /** What the user said (transcribed Korean text) */
  transcription: string;
  /** The expected Korean text */
  expected: string;
  /** 0–100 similarity score */
  score: number;
  /** Per-syllable match results */
  syllableResults: SyllableResult[];
  /** Human-readable feedback */
  feedback: string;
  /** Verdict */
  verdict: 'perfect' | 'good' | 'close' | 'try_again';
}

export interface SyllableResult {
  expected: string;
  actual: string | null;
  match: boolean;
}

export type RecordingState = 'idle' | 'requesting_permission' | 'recording' | 'processing' | 'done' | 'error';

// ─── Korean text comparison utilities ─────────────────────────────────────────

export function normalizeKorean(text: string): string {
  return text.replace(/[^가-힣ㄱ-ㅎㅏ-ㅣ]/g, '');
}

export function splitSyllables(text: string): string[] {
  return normalizeKorean(text).split('');
}

function levenshteinDistance(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
      }
    }
  }
  return dp[m][n];
}

export function compareKorean(expected: string, transcription: string): {
  score: number;
  syllableResults: SyllableResult[];
} {
  const expectedNorm = normalizeKorean(expected);
  const transcriptionNorm = normalizeKorean(transcription);

  if (expectedNorm.length === 0) {
    return { score: 0, syllableResults: [] };
  }

  if (expectedNorm === transcriptionNorm) {
    return {
      score: 100,
      syllableResults: expectedNorm.split('').map((ch) => ({
        expected: ch,
        actual: ch,
        match: true,
      })),
    };
  }

  const distance = levenshteinDistance(expectedNorm, transcriptionNorm);
  const maxLen = Math.max(expectedNorm.length, transcriptionNorm.length);
  const score = Math.max(0, Math.round(((maxLen - distance) / maxLen) * 100));

  const expectedChars = expectedNorm.split('');
  const transcriptionChars = transcriptionNorm.split('');
  const syllableResults: SyllableResult[] = expectedChars.map((ch, i) => ({
    expected: ch,
    actual: i < transcriptionChars.length ? transcriptionChars[i] : null,
    match: i < transcriptionChars.length && ch === transcriptionChars[i],
  }));

  return { score, syllableResults };
}

export function getVerdict(score: number): SpeechResult['verdict'] {
  if (score >= 95) return 'perfect';
  if (score >= 75) return 'good';
  if (score >= 50) return 'close';
  return 'try_again';
}

function decomposeHangul(char: string): { initial: string; medial: string; final: string | null } | null {
  const code = char.charCodeAt(0);
  if (code < 0xAC00 || code > 0xD7A3) return null;

  const offset = code - 0xAC00;
  const initialIndex = Math.floor(offset / (21 * 28));
  const medialIndex = Math.floor((offset % (21 * 28)) / 28);
  const finalIndex = offset % 28;

  const initials = 'ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ';
  const medials = 'ㅏㅐㅑㅒㅓㅔㅕㅖㅗㅘㅙㅚㅛㅜㅝㅞㅟㅠㅡㅢㅣ';
  const finals = '\0ㄱㄲㄳㄴㄵㄶㄷㄹㄺㄻㄼㄽㄾㄿㅀㅁㅂㅄㅅㅆㅇㅈㅊㅋㅌㅍㅎ';

  return {
    initial: initials[initialIndex],
    medial: medials[medialIndex],
    final: finalIndex === 0 ? null : finals[finalIndex],
  };
}

const consonantNames: Record<string, string> = {
  'ㄱ': 'g/k (기역)', 'ㄲ': 'kk (쌍기역)', 'ㄴ': 'n (니은)',
  'ㄷ': 'd/t (디귿)', 'ㄸ': 'tt (쌍디귿)', 'ㄹ': 'r/l (리을)',
  'ㅁ': 'm (미음)', 'ㅂ': 'b/p (비읍)', 'ㅃ': 'pp (쌍비읍)',
  'ㅅ': 's (시옷)', 'ㅆ': 'ss (쌍시옷)', 'ㅇ': 'ng (이응)',
  'ㅈ': 'j (지읒)', 'ㅉ': 'jj (쌍지읒)', 'ㅊ': 'ch (치읓)',
  'ㅋ': 'k (키읔)', 'ㅌ': 't (티읕)', 'ㅍ': 'p (피읖)',
  'ㅎ': 'h (히읗)',
};

const vowelNames: Record<string, string> = {
  'ㅏ': 'a (아)', 'ㅐ': 'ae (애)', 'ㅑ': 'ya (야)', 'ㅒ': 'yae (얘)',
  'ㅓ': 'eo (어)', 'ㅔ': 'e (에)', 'ㅕ': 'yeo (여)', 'ㅖ': 'ye (예)',
  'ㅗ': 'o (오)', 'ㅘ': 'wa (와)', 'ㅙ': 'wae (왜)', 'ㅚ': 'oe (외)',
  'ㅛ': 'yo (요)', 'ㅜ': 'u (우)', 'ㅝ': 'wo (워)', 'ㅞ': 'we (웨)',
  'ㅟ': 'wi (위)', 'ㅠ': 'yu (유)', 'ㅡ': 'eu (으)', 'ㅢ': 'ui (의)',
  'ㅣ': 'i (이)',
};

export function generateFeedback(
  score: number,
  syllableResults: SyllableResult[],
  verdict: SpeechResult['verdict']
): string {
  if (verdict === 'perfect') {
    const phrases = [
      'Perfect pronunciation! You nailed it!',
      'Excellent! Native-level pronunciation!',
      'Spot on! Great job!',
    ];
    return phrases[Math.floor(Math.random() * phrases.length)];
  }

  if (verdict === 'good') {
    const mismatch = syllableResults.find((r) => !r.match && r.actual !== null);
    if (mismatch) {
      const expectedDecomp = decomposeHangul(mismatch.expected);
      const actualDecomp = mismatch.actual ? decomposeHangul(mismatch.actual) : null;

      if (expectedDecomp && actualDecomp) {
        if (expectedDecomp.initial !== actualDecomp.initial) {
          const name = consonantNames[expectedDecomp.initial];
          if (name) return `Almost! Focus on the ${name} sound in "${mismatch.expected}".`;
        }
        if (expectedDecomp.medial !== actualDecomp.medial) {
          const name = vowelNames[expectedDecomp.medial];
          if (name) return `Close! Pay attention to the ${name} vowel in "${mismatch.expected}".`;
        }
      }
    }
    return 'Very close! Just a small difference. Try again for perfection!';
  }

  if (verdict === 'close') {
    const mismatches = syllableResults.filter((r) => !r.match);
    if (mismatches.length > 0) {
      const wrongSyllables = mismatches
        .slice(0, 3)
        .map((m) => `"${m.expected}"`)
        .join(', ');
      return `Getting there! Focus on these syllables: ${wrongSyllables}. Listen again and try to match the sounds.`;
    }
    return 'Not bad! Listen carefully and try matching each syllable.';
  }

  return "Don't worry! Listen to the sentence again slowly and try to repeat each part. You'll get it!";
}

// ─── Microphone Permission ──────────────────────────────────────────────────

export async function requestMicPermission(): Promise<boolean> {
  try {
    const { granted } = await requestRecordingPermissionsAsync();
    return granted;
  } catch (err) {
    console.warn('[SpeechRecognition] Permission request failed:', err);
    return false;
  }
}

// ─── Speech Evaluation ────────────────────────────────────────────────────────

export function evaluateSpeech(expected: string, transcription: string): SpeechResult {
  const { score, syllableResults } = compareKorean(expected, transcription);
  const verdict = getVerdict(score);
  const feedback = generateFeedback(score, syllableResults, verdict);

  return {
    transcription,
    expected,
    score,
    syllableResults,
    feedback,
    verdict,
  };
}

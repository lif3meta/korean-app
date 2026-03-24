import { DictionaryEntry } from '@/data/dictionary';

// In-memory cache for API results
const apiCache = new Map<string, { entries: DictionaryEntry[]; timestamp: number }>();
const CACHE_TTL = 1000 * 60 * 60; // 1 hour

// Abort controller for cancelling in-flight requests
let currentController: AbortController | null = null;

/**
 * Search the Korean Learners' Dictionary API (krdict) for Korean-English entries.
 * Falls back to Pollinations AI if krdict fails or returns no results.
 */
export async function searchDictionaryApi(query: string): Promise<DictionaryEntry[]> {
  const q = query.trim();
  if (!q || q.length < 1) return [];

  // Check cache first
  const cacheKey = q.toLowerCase();
  const cached = apiCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.entries;
  }

  // Cancel any previous in-flight request
  if (currentController) {
    currentController.abort();
  }
  currentController = new AbortController();
  const { signal } = currentController;

  try {
    const results = await fetchFromPollinations(q, signal);
    if (results.length > 0) {
      apiCache.set(cacheKey, { entries: results, timestamp: Date.now() });
    }
    return results;
  } catch (error: unknown) {
    if (error instanceof Error && error.name === 'AbortError') {
      return []; // Request was cancelled, not an error
    }
    console.warn('Dictionary API error:', error);
    return [];
  }
}

/**
 * Use Pollinations AI to generate dictionary entries.
 * Free, no API key required, supports Korean-English translation.
 */
async function fetchFromPollinations(
  query: string,
  signal: AbortSignal
): Promise<DictionaryEntry[]> {
  const isKorean = /[\uAC00-\uD7AF\u1100-\u11FF\u3130-\u318F]/.test(query);

  const prompt = isKorean
    ? `You are a Korean-English dictionary. Look up the Korean word or phrase "${query}".
Return a JSON array of matching dictionary entries (1 to 5 results, most relevant first).
Each entry must have exactly these fields:
- "korean": the Korean word/phrase in Hangul
- "romanization": the romanized pronunciation
- "english": the English definition(s)
- "partOfSpeech": one of "noun", "verb", "adjective", "adverb", "phrase", "particle", "pronoun", "conjunction", "interjection", "counter", "number"
- "example": an object with "korean" (example sentence in Korean) and "english" (English translation), or null if no good example

If "${query}" has multiple meanings, include separate entries for each meaning.
ONLY return valid JSON array, no markdown, no explanation.`
    : `You are a Korean-English dictionary. The user searched for the English word "${query}".
Return a JSON array of Korean translations (1 to 5 results, most relevant first).
Each entry must have exactly these fields:
- "korean": the Korean word/phrase in Hangul
- "romanization": the romanized pronunciation
- "english": the English definition that matches the search
- "partOfSpeech": one of "noun", "verb", "adjective", "adverb", "phrase", "particle", "pronoun", "conjunction", "interjection", "counter", "number"
- "example": an object with "korean" (example sentence in Korean) and "english" (English translation), or null if no good example

Include the most common/useful Korean words for "${query}".
ONLY return valid JSON array, no markdown, no explanation.`;

  const response = await fetch('https://text.pollinations.ai/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages: [{ role: 'user', content: prompt }],
      model: 'openai',
      jsonMode: true,
    }),
    signal,
  });

  if (!response.ok) {
    throw new Error(`Pollinations API error: ${response.status}`);
  }

  const text = await response.text();

  // Parse the response - extract JSON array from the text
  const entries = parseApiResponse(text);
  return entries;
}

/**
 * Parse and validate the AI response into DictionaryEntry objects.
 */
function parseApiResponse(text: string): DictionaryEntry[] {
  try {
    // Try to extract JSON array from the response
    let jsonStr = text.trim();

    // Remove markdown code fences if present
    const fenceMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (fenceMatch) {
      jsonStr = fenceMatch[1].trim();
    }

    // Find the JSON array in the text
    const arrayStart = jsonStr.indexOf('[');
    const arrayEnd = jsonStr.lastIndexOf(']');
    if (arrayStart !== -1 && arrayEnd !== -1 && arrayEnd > arrayStart) {
      jsonStr = jsonStr.substring(arrayStart, arrayEnd + 1);
    }

    const parsed = JSON.parse(jsonStr);
    if (!Array.isArray(parsed)) return [];

    // Validate and normalize each entry
    return parsed
      .filter(
        (item: Record<string, unknown>) =>
          item &&
          typeof item.korean === 'string' &&
          typeof item.english === 'string' &&
          item.korean.length > 0 &&
          item.english.length > 0
      )
      .map(
        (item: Record<string, unknown>): DictionaryEntry => ({
          korean: String(item.korean),
          romanization: typeof item.romanization === 'string' ? item.romanization : '',
          english: String(item.english),
          partOfSpeech: typeof item.partOfSpeech === 'string' ? item.partOfSpeech : 'unknown',
          example:
            item.example &&
            typeof item.example === 'object' &&
            item.example !== null &&
            'korean' in item.example &&
            'english' in item.example
              ? {
                  korean: String((item.example as Record<string, unknown>).korean),
                  english: String((item.example as Record<string, unknown>).english),
                }
              : undefined,
        })
      )
      .slice(0, 5);
  } catch {
    console.warn('Failed to parse dictionary API response');
    return [];
  }
}

/**
 * Clear the API cache (useful for testing or memory management).
 */
export function clearDictionaryCache(): void {
  apiCache.clear();
}

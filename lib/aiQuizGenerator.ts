import { QuizQuestion, MultipleChoiceQuestion, FillInBlankQuestion } from '@/data/quizzes';
import { generateDynamicQuestions } from '@/data/questionGenerators';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { geminiProxy } from '@/lib/utils';

const CACHE_PREFIX = 'ai_quiz_cache_';
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

interface AIQuizCache {
  questions: QuizQuestion[];
  timestamp: number;
}

/**
 * Generate quiz questions using Gemini AI.
 * Falls back to local generators if API is unavailable.
 * Results are cached for 24 hours.
 */
export async function generateAIQuestions(
  category: 'hangul' | 'vocab' | 'grammar' | 'mixed',
  count: number,
  userLevel: string,
  recentMistakes: string[] = []
): Promise<QuizQuestion[]> {
  // Check cache first
  const cacheKey = `${CACHE_PREFIX}${category}_${count}`;
  try {
    const cached = await AsyncStorage.getItem(cacheKey);
    if (cached) {
      const parsed: AIQuizCache = JSON.parse(cached);
      if (Date.now() - parsed.timestamp < CACHE_TTL_MS) {
        return parsed.questions;
      }
    }
  } catch {}

  // Try Gemini API via proxy
  try {
    const prompt = buildPrompt(category, count, userLevel, recentMistakes);
    const data = await geminiProxy(
      [{ parts: [{ text: prompt }] }],
      { temperature: 0.8, maxOutputTokens: 2048, responseMimeType: 'application/json' },
    ) as Record<string, unknown>;

    const text = (data as any).candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      return generateDynamicQuestions(category, count);
    }

    const parsed = JSON.parse(text);
    const questions = parseAIQuestions(parsed, category);

    if (questions.length === 0) {
      return generateDynamicQuestions(category, count);
    }

    // Cache the results
    try {
      await AsyncStorage.setItem(
        cacheKey,
        JSON.stringify({ questions, timestamp: Date.now() })
      );
    } catch {}

    // Supplement with local questions if AI didn't generate enough
    if (questions.length < count) {
      const local = generateDynamicQuestions(category, count - questions.length);
      return [...questions, ...local];
    }

    return questions.slice(0, count);
  } catch (err) {
    console.warn('[AIQuiz] Generation failed, using local:', err);
    return generateDynamicQuestions(category, count);
  }
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function buildPrompt(
  category: string,
  count: number,
  level: string,
  mistakes: string[]
): string {
  const mistakeContext = mistakes.length > 0
    ? `\nThe student has recently struggled with these words/patterns: ${mistakes.join(', ')}. Include questions that test these areas.`
    : '';

  return `Generate ${count} Korean language quiz questions for a ${level} learner.
Category: ${category}
${mistakeContext}

Return a JSON array of objects. Each question must have:
- "type": "multiple_choice"
- "question": the question in English
- "questionKorean": optional Korean text related to the question
- "options": array of 4 answer choices
- "correctIndex": index (0-3) of the correct answer
- "explanation": brief explanation of the correct answer

For ${category === 'grammar' ? 'grammar' : category === 'hangul' ? 'Hangul characters' : 'vocabulary'} questions.

Example question format:
{"type":"multiple_choice","question":"What does 안녕하세요 mean?","options":["Hello","Thank you","Goodbye","Sorry"],"correctIndex":0,"explanation":"안녕하세요 is the standard Korean greeting meaning Hello."}

Important: All Korean text must be accurate and grammatically correct. Generate diverse question types covering different aspects of the category.`;
}

function parseAIQuestions(data: any, category: string): QuizQuestion[] {
  const questions: QuizQuestion[] = [];
  const items = Array.isArray(data) ? data : data.questions || [];

  for (const item of items) {
    if (
      item.type === 'multiple_choice' &&
      item.question &&
      Array.isArray(item.options) &&
      item.options.length === 4 &&
      typeof item.correctIndex === 'number' &&
      item.correctIndex >= 0 &&
      item.correctIndex <= 3
    ) {
      questions.push({
        type: 'multiple_choice',
        id: `ai_${category}_${questions.length}`,
        question: item.question,
        questionKorean: item.questionKorean,
        options: item.options,
        correctIndex: item.correctIndex,
        explanation: item.explanation || '',
        category: category === 'hangul' ? 'hangul' : category === 'grammar' ? 'grammar' : 'vocab',
        level: 'beginner',
        xpReward: 15,
      } as MultipleChoiceQuestion);
    }
  }

  return questions;
}

/**
 * Clear cached AI questions (call when user wants fresh questions)
 */
export async function clearAIQuizCache(): Promise<void> {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const cacheKeys = keys.filter((k) => k.startsWith(CACHE_PREFIX));
    if (cacheKeys.length > 0) {
      await AsyncStorage.multiRemove(cacheKeys);
    }
  } catch {}
}

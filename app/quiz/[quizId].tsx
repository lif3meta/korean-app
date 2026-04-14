import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, borderRadius, shadows } from '@/lib/theme';
import { quizQuestions, getQuizzesByCategory, QuizQuestion } from '@/data/quizzes';
import { generateDynamicQuestions } from '@/data/questionGenerators';
import { generateAIQuestions } from '@/lib/aiQuizGenerator';
import { MultipleChoice } from '@/components/quiz/MultipleChoice';
import { FillInBlank } from '@/components/quiz/FillInBlank';
import { MatchingPairs } from '@/components/quiz/MatchingPairs';
import { QuizProgress } from '@/components/quiz/QuizProgress';
import { useAppStore } from '@/lib/store';
import { shuffleArray, getToday } from '@/lib/utils';
import { XP_REWARDS } from '@/lib/xp';

const QUESTION_COUNTS = [5, 10, 15, 20];

export default function QuizScreen() {
  const { quizId } = useLocalSearchParams<{ quizId: string }>();
  const { addQuizResult, isPremium, quizHistory } = useAppStore();
  const [questionCount, setQuestionCount] = useState<number | null>(null);
  const [aiQuestions, setAiQuestions] = useState<QuizQuestion[]>([]);

  // Fetch AI questions for premium users when count is set
  React.useEffect(() => {
    if (!questionCount || !isPremium) return;
    const category = (quizId || 'mixed') as 'hangul' | 'vocab' | 'grammar' | 'mixed';
    const recentMistakes = quizHistory
      .slice(0, 5)
      .filter((r) => r.score < r.total * 0.7)
      .map((r) => r.category);
    generateAIQuestions(category, Math.ceil(questionCount * 0.3), 'beginner', recentMistakes)
      .then(setAiQuestions)
      .catch(() => {});
  }, [questionCount, isPremium]);

  const questions = useMemo(() => {
    if (!questionCount) return [];
    const category = (quizId || 'mixed') as 'hangul' | 'vocab' | 'grammar' | 'mixed';

    // Get static questions
    let staticPool: QuizQuestion[];
    if (quizId === 'mixed') {
      staticPool = quizQuestions;
    } else {
      staticPool = getQuizzesByCategory(quizId as any);
    }

    // Generate dynamic questions to supplement
    const dynamicPool = generateDynamicQuestions(category, questionCount * 2);

    // Mix: static (20%) + AI (30% if premium) + dynamic (rest), shuffle
    const staticCount = Math.min(Math.ceil(questionCount * 0.2), staticPool.length);
    const staticPick = shuffleArray(staticPool).slice(0, staticCount);
    const aiPick = aiQuestions.slice(0, Math.ceil(questionCount * 0.3));
    const remaining = questionCount - staticPick.length - aiPick.length;
    const dynamicPick = shuffleArray(dynamicPool).slice(0, remaining);
    return shuffleArray([...staticPick, ...aiPick, ...dynamicPick]).slice(0, questionCount);
  }, [quizId, questionCount, aiQuestions]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [answered, setAnswered] = useState(0);

  const currentQ = questions[currentIndex];

  const handleAnswer = (isCorrect: boolean) => {
    if (isCorrect) setCorrect((c) => c + 1);
    setAnswered((a) => a + 1);

    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex((i) => i + 1);
      } else {
        const totalCorrect = correct + (isCorrect ? 1 : 0);
        const total = questions.length;
        const xpEarned = totalCorrect * XP_REWARDS.quizCorrect + (total - totalCorrect) * XP_REWARDS.quizIncorrect + (totalCorrect === total ? XP_REWARDS.perfectQuiz : 0);
        addQuizResult({
          quizId: quizId || 'mixed',
          score: totalCorrect,
          total,
          xpEarned,
          date: getToday(),
          category: quizId || 'mixed',
        });
        router.replace({ pathname: '/quiz/results', params: { correct: totalCorrect.toString(), total: total.toString(), xp: xpEarned.toString(), category: quizId || 'mixed' } });
      }
    }, 400);
  };

  // ─── Question count selector ─────────────────────────────────────────────
  if (!questionCount) {
    const categoryLabel = quizId === 'hangul' ? 'Hangul' : quizId === 'vocab' ? 'Vocabulary' : quizId === 'grammar' ? 'Grammar' : 'Mixed';
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.configScreen}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>

          <Text style={styles.configEmoji}>{quizId === 'hangul' ? '\u314E' : quizId === 'vocab' ? '\uD83D\uDCDA' : quizId === 'grammar' ? '\u270D\uFE0F' : '\uD83C\uDFAF'}</Text>
          <Text style={styles.configTitle}>{categoryLabel} Quiz</Text>
          <Text style={styles.configSubtitle}>How many questions?</Text>

          <View style={styles.countGrid}>
            {QUESTION_COUNTS.map((count) => (
              <TouchableOpacity key={count} activeOpacity={0.7} onPress={() => setQuestionCount(count)}>
                <LinearGradient
                  colors={count === 10 ? [colors.primary, colors.primaryDark] : [colors.surfaceLow, colors.surfaceLow]}
                  style={styles.countCard}
                >
                  <Text style={[styles.countNumber, count === 10 && styles.countNumberActive]}>{count}</Text>
                  <Text style={[styles.countLabel, count === 10 && styles.countLabelActive]}>questions</Text>
                  {count === 10 && <Text style={styles.countBadge}>Popular</Text>}
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.configNote}>Questions are randomly generated each time for a fresh challenge!</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!currentQ) return null;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.progress}>
        <QuizProgress current={answered} total={questions.length} correct={correct} />
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentInner} showsVerticalScrollIndicator={false}>
        {currentQ.type === 'multiple_choice' && (
          <MultipleChoice
            key={currentQ.id}
            question={currentQ.question}
            questionKorean={currentQ.questionKorean}
            options={currentQ.options}
            correctIndex={currentQ.correctIndex}
            explanation={currentQ.explanation}
            onAnswer={handleAnswer}
          />
        )}

        {currentQ.type === 'fill_in_blank' && (
          <FillInBlank
            key={currentQ.id}
            sentence={currentQ.sentence}
            correctAnswer={currentQ.correctAnswer}
            acceptedAnswers={currentQ.acceptedAnswers}
            hint={currentQ.hint}
            onAnswer={handleAnswer}
          />
        )}

        {currentQ.type === 'matching' && (
          <MatchingPairs
            key={currentQ.id}
            instruction={currentQ.instruction}
            pairs={currentQ.pairs}
            onComplete={(allCorrect) => handleAnswer(allCorrect)}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { flex: 1 },
  contentInner: { paddingVertical: spacing.xxl, paddingHorizontal: spacing.xl },
  progress: { paddingHorizontal: spacing.xl, paddingTop: spacing.xl },

  // Config screen
  configScreen: {
    flex: 1,
    paddingHorizontal: spacing.xxl,
    paddingTop: spacing.xxl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backBtn: {
    position: 'absolute',
    top: spacing.lg,
    left: spacing.xl,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surfaceLow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  configEmoji: {
    fontSize: 48,
    marginBottom: spacing.lg,
  },
  configTitle: {
    ...typography.title2,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  configSubtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.xs,
    marginBottom: spacing.xxl,
  },
  countGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.md,
    width: '100%',
  },
  countCard: {
    width: 140,
    paddingVertical: spacing.xl,
    borderRadius: borderRadius.xxl,
    alignItems: 'center',
    ...shadows.sm,
  },
  countNumber: {
    fontSize: 32,
    fontFamily: 'Jakarta-ExtraBold',
    color: colors.textPrimary,
  },
  countNumberActive: {
    color: '#fff',
  },
  countLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  countLabelActive: {
    color: 'rgba(255,255,255,0.8)',
  },
  countBadge: {
    ...typography.label,
    color: '#fff',
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: borderRadius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    marginTop: spacing.sm,
    overflow: 'hidden',
  },
  configNote: {
    ...typography.footnote,
    color: colors.textTertiary,
    textAlign: 'center',
    marginTop: spacing.xxl,
    paddingHorizontal: spacing.xl,
  },
});

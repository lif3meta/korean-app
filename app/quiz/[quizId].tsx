import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { colors, spacing, typography } from '@/lib/theme';
import { quizQuestions, getQuizzesByCategory, QuizQuestion } from '@/data/quizzes';
import { MultipleChoice } from '@/components/quiz/MultipleChoice';
import { FillInBlank } from '@/components/quiz/FillInBlank';
import { MatchingPairs } from '@/components/quiz/MatchingPairs';
import { QuizProgress } from '@/components/quiz/QuizProgress';
import { useAppStore } from '@/lib/store';
import { shuffleArray, getToday } from '@/lib/utils';
import { XP_REWARDS } from '@/lib/xp';

export default function QuizScreen() {
  const { quizId } = useLocalSearchParams<{ quizId: string }>();
  const { addQuizResult } = useAppStore();

  const questions = useMemo(() => {
    let pool: QuizQuestion[];
    if (quizId === 'mixed') {
      pool = quizQuestions;
    } else {
      pool = getQuizzesByCategory(quizId as any);
    }
    return shuffleArray(pool).slice(0, 10);
  }, [quizId]);

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

  if (!currentQ) return null;

  return (
    <SafeAreaView style={styles.container}>
      <QuizProgress current={answered} total={questions.length} correct={correct} />

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
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.xl },
  content: { flex: 1 },
  contentInner: { paddingVertical: spacing.xxl },
});

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, borderRadius, spacing, typography, shadows } from '@/lib/theme';
import { getStoryById } from '@/data/miniStories';
import { useAppStore } from '@/lib/store';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { AudioButton } from '@/components/common/AudioButton';

const levelColors: Record<string, { bg: string; text: string }> = {
  beginner: { bg: '#d1fae5', text: '#065f46' },
  intermediate: { bg: '#fef3c7', text: '#92400e' },
  advanced: { bg: '#fee2e2', text: '#991b1b' },
};

export default function StoryReaderScreen() {
  const { storyId } = useLocalSearchParams<{ storyId: string }>();
  const story = getStoryById(storyId);
  const { completedLessons, markLessonComplete } = useAppStore();

  const [revealedParagraphs, setRevealedParagraphs] = useState<Record<number, boolean>>({});
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);

  if (!story) {
    return (
      <View style={styles.container}>
        <Text style={styles.notFound}>Story not found</Text>
      </View>
    );
  }

  const isCompleted = completedLessons[story.id];
  const lc = levelColors[story.level] || levelColors.beginner;

  const toggleTranslation = (index: number) => {
    setRevealedParagraphs((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const handleAnswer = (questionIndex: number, optionIndex: number) => {
    if (selectedAnswers[questionIndex] !== undefined) return;
    setSelectedAnswers((prev) => ({ ...prev, [questionIndex]: optionIndex }));
  };

  const handleSubmitQuiz = () => {
    setShowResults(true);
    const correct = story.questions.reduce((acc, q, i) => {
      return acc + (selectedAnswers[i] === q.correctIndex ? 1 : 0);
    }, 0);
    const score = Math.round((correct / story.questions.length) * 100);
    markLessonComplete(story.id, score);
  };

  const allAnswered = story.questions.every((_, i) => selectedAnswers[i] !== undefined);

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 48 }}>
      <View style={styles.header}>
        <Text style={styles.title}>{story.title}</Text>
        <Text style={styles.titleKorean}>{story.titleKorean}</Text>
        <View style={[styles.levelBadge, { backgroundColor: lc.bg }]}>
          <Text style={[styles.levelText, { color: lc.text }]}>{story.level}</Text>
        </View>
      </View>

      {story.paragraphs.map((para, pi) => (
        <Card key={pi} variant="elevated" style={styles.paragraphCard}>
          <View style={styles.paragraphHeader}>
            <Text style={styles.paragraphLabel}>Paragraph {pi + 1}</Text>
            <AudioButton text={para.korean} size="sm" />
          </View>

          <Text style={styles.koreanText}>{para.korean}</Text>

          <TouchableOpacity
            onPress={() => toggleTranslation(pi)}
            style={styles.revealBtn}
          >
            <Ionicons
              name={revealedParagraphs[pi] ? 'eye-off' : 'eye'}
              size={16}
              color={colors.primary}
            />
            <Text style={styles.revealText}>
              {revealedParagraphs[pi] ? 'Hide translation' : 'Show translation'}
            </Text>
          </TouchableOpacity>

          {revealedParagraphs[pi] && (
            <Text style={styles.englishText}>{para.english}</Text>
          )}

          {para.words.length > 0 && (
            <View style={styles.glossaryContainer}>
              <Text style={styles.glossaryTitle}>Key Words</Text>
              <View style={styles.glossaryChips}>
                {para.words.map((word, wi) => (
                  <View key={wi} style={styles.glossaryChip}>
                    <Text style={styles.glossaryKorean}>{word.korean}</Text>
                    <Text style={styles.glossaryEnglish}>{word.english}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </Card>
      ))}

      <View style={styles.quizSection}>
        <View style={styles.quizHeader}>
          <Ionicons name="help-circle" size={24} color={colors.accent} />
          <Text style={styles.quizTitle}>Comprehension Check</Text>
        </View>

        {story.questions.map((q, qi) => {
          const selected = selectedAnswers[qi];
          const isCorrect = selected === q.correctIndex;

          return (
            <Card key={qi} variant="elevated" style={styles.questionCard}>
              <Text style={styles.questionText}>
                {qi + 1}. {q.question}
              </Text>

              {q.options.map((option, oi) => {
                const isSelected = selected === oi;
                const showFeedback = showResults && selected !== undefined;
                const isCorrectOption = oi === q.correctIndex;

                let optionStyle = styles.option;
                let optionTextStyle = styles.optionText;
                if (isSelected && !showFeedback) {
                  optionStyle = { ...styles.option, ...styles.optionSelected };
                  optionTextStyle = { ...styles.optionText, ...styles.optionTextSelected };
                }
                if (showFeedback && isCorrectOption) {
                  optionStyle = { ...styles.option, ...styles.optionCorrect };
                  optionTextStyle = { ...styles.optionText, color: '#065f46' };
                }
                if (showFeedback && isSelected && !isCorrect) {
                  optionStyle = { ...styles.option, ...styles.optionWrong };
                  optionTextStyle = { ...styles.optionText, color: '#991b1b' };
                }

                return (
                  <TouchableOpacity
                    key={oi}
                    onPress={() => handleAnswer(qi, oi)}
                    disabled={selected !== undefined}
                    activeOpacity={0.7}
                    style={optionStyle}
                  >
                    <Text style={optionTextStyle}>{option}</Text>
                    {showFeedback && isCorrectOption && (
                      <Ionicons name="checkmark-circle" size={18} color="#065f46" />
                    )}
                    {showFeedback && isSelected && !isCorrect && (
                      <Ionicons name="close-circle" size={18} color="#991b1b" />
                    )}
                  </TouchableOpacity>
                );
              })}

              {showResults && selected !== undefined && (
                <View style={[styles.explanation, isCorrect ? styles.explanationCorrect : styles.explanationWrong]}>
                  <Ionicons
                    name={isCorrect ? 'checkmark-circle' : 'information-circle'}
                    size={16}
                    color={isCorrect ? '#065f46' : '#92400e'}
                  />
                  <Text style={styles.explanationText}>{q.explanation}</Text>
                </View>
              )}
            </Card>
          );
        })}

        {!showResults && allAnswered && (
          <View style={styles.submitSection}>
            <Button
              title="Check Answers"
              onPress={handleSubmitQuiz}
              size="lg"
            />
          </View>
        )}

        {showResults && (
          <View style={styles.resultsSection}>
            <View style={styles.scoreBadge}>
              <Ionicons name="trophy" size={24} color="#f59e0b" />
              <Text style={styles.scoreText}>
                {story.questions.reduce((acc, q, i) => acc + (selectedAnswers[i] === q.correctIndex ? 1 : 0), 0)}/{story.questions.length} correct
              </Text>
            </View>
            {isCompleted && (
              <View style={styles.completedBadge}>
                <Ionicons name="checkmark-circle" size={20} color={colors.success} />
                <Text style={styles.completedText}>Story completed!</Text>
              </View>
            )}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  notFound: { ...typography.body, color: colors.textSecondary, padding: spacing.xl },
  header: {
    padding: spacing.xl,
    gap: spacing.xs,
    alignItems: 'flex-start',
  },
  title: {
    ...typography.title,
    color: colors.textPrimary,
  },
  titleKorean: {
    ...typography.subhead,
    color: colors.textTertiary,
  },
  levelBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    marginTop: spacing.xs,
  },
  levelText: {
    fontSize: 11,
    fontFamily: 'Jakarta-Bold',
    textTransform: 'capitalize',
  },
  paragraphCard: {
    marginHorizontal: spacing.xl,
    marginBottom: spacing.lg,
    padding: spacing.lg,
    gap: spacing.md,
  },
  paragraphHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  paragraphLabel: {
    fontSize: 11,
    fontFamily: 'Jakarta-Bold',
    color: colors.textTertiary,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  koreanText: {
    fontSize: 20,
    lineHeight: 32,
    color: colors.textPrimary,
  },
  revealBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.xs,
  },
  revealText: {
    fontSize: 13,
    fontFamily: 'Jakarta-SemiBold',
    color: colors.primary,
  },
  englishText: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 24,
    fontStyle: 'italic',
  },
  glossaryContainer: {
    marginTop: spacing.sm,
    gap: spacing.sm,
  },
  glossaryTitle: {
    fontSize: 11,
    fontFamily: 'Jakarta-Bold',
    color: colors.textTertiary,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  glossaryChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  glossaryChip: {
    backgroundColor: colors.surfaceLow,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  glossaryKorean: {
    fontSize: 13,
    fontFamily: 'Jakarta-SemiBold',
    color: colors.textPrimary,
  },
  glossaryEnglish: {
    fontSize: 10,
    fontFamily: 'Jakarta-Regular',
    color: colors.textTertiary,
  },
  quizSection: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    gap: spacing.md,
  },
  quizHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  quizTitle: {
    ...typography.title3,
    color: colors.textPrimary,
  },
  questionCard: {
    padding: spacing.lg,
    gap: spacing.sm,
  },
  questionText: {
    ...typography.bodyBold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surfaceLow,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  optionSelected: {
    backgroundColor: colors.primaryPale,
    borderColor: colors.primary,
  },
  optionCorrect: {
    backgroundColor: '#d1fae5',
    borderColor: '#065f46',
  },
  optionWrong: {
    backgroundColor: '#fee2e2',
    borderColor: '#991b1b',
  },
  optionText: {
    ...typography.body,
    color: colors.textPrimary,
    flex: 1,
  },
  optionTextSelected: {
    color: colors.primaryDark,
    fontFamily: 'Jakarta-SemiBold',
  },
  explanation: {
    flexDirection: 'row',
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'flex-start',
  },
  explanationCorrect: {
    backgroundColor: '#d1fae5',
  },
  explanationWrong: {
    backgroundColor: '#fef3c7',
  },
  explanationText: {
    ...typography.footnote,
    color: colors.textSecondary,
    flex: 1,
    lineHeight: 20,
  },
  submitSection: {
    marginTop: spacing.md,
  },
  resultsSection: {
    alignItems: 'center',
    gap: spacing.md,
    marginTop: spacing.md,
  },
  scoreBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: '#fef3c7',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.xl,
  },
  scoreText: {
    fontSize: 18,
    fontFamily: 'Jakarta-Bold',
    color: '#92400e',
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  completedText: {
    ...typography.bodyBold,
    color: colors.success,
  },
});

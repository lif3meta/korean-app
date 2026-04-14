import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { colors, borderRadius, spacing, shadows } from '@/lib/theme';
import { useAppStore } from '@/lib/store';
import { getExercisesForLesson, GrammarExercise } from '@/data/grammarExercises';
import { getGrammarById } from '@/data/grammar';
import { shuffleArray } from '@/lib/utils';

export default function GrammarPracticeScreen() {
  const { lessonId } = useLocalSearchParams<{ lessonId: string }>();
  const insets = useSafeAreaInsets();
  const { hapticEnabled, markGrammarExercise, grammarExerciseScores } = useAppStore();

  const lesson = getGrammarById(lessonId);
  const exercises = useMemo(() => getExercisesForLesson(lessonId), [lessonId]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [stats, setStats] = useState({ correct: 0, incorrect: 0 });
  const [completed, setCompleted] = useState(false);
  // For sentence builder
  const [builtWords, setBuiltWords] = useState<string[]>([]);
  const [availableWords, setAvailableWords] = useState<string[]>([]);

  const exercise = exercises[currentIndex];
  const progress = exercises.length > 0 ? ((currentIndex) / exercises.length) * 100 : 0;

  const initSentenceBuilder = (ex: GrammarExercise) => {
    setBuiltWords([]);
    setAvailableWords(shuffleArray(ex.words || []));
  };

  const resetForNext = () => {
    setAnswered(false);
    setSelectedAnswer(null);
    setIsCorrect(false);
    setTextInput('');
    setBuiltWords([]);
  };

  const checkAnswer = (answer: string) => {
    const ex = exercises[currentIndex];
    const correct =
      answer === ex.correctAnswer ||
      (ex.acceptedAnswers || []).includes(answer);

    setSelectedAnswer(answer);
    setIsCorrect(correct);
    setAnswered(true);

    if (hapticEnabled) {
      Haptics.notificationAsync(
        correct ? Haptics.NotificationFeedbackType.Success : Haptics.NotificationFeedbackType.Error
      );
    }

    markGrammarExercise(ex.id, correct);
    setStats((s) => ({
      correct: s.correct + (correct ? 1 : 0),
      incorrect: s.incorrect + (correct ? 0 : 1),
    }));
  };

  const nextExercise = () => {
    if (currentIndex < exercises.length - 1) {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      resetForNext();
      if (exercises[nextIdx].type === 'sentence_build') {
        initSentenceBuilder(exercises[nextIdx]);
      }
    } else {
      setCompleted(true);
    }
  };

  // Initialize sentence builder for first exercise if needed
  React.useEffect(() => {
    if (exercises[0]?.type === 'sentence_build') {
      initSentenceBuilder(exercises[0]);
    }
  }, []);

  if (!lesson || exercises.length === 0) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.emptyText}>No exercises available for this lesson.</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (completed) {
    const percentage = Math.round((stats.correct / exercises.length) * 100);
    return (
      <View style={[styles.container, styles.centerContent]}>
        <View style={styles.completionCard}>
          <View style={[styles.completionIcon, { backgroundColor: percentage >= 80 ? '#d1fae5' : '#fef3c7' }]}>
            <Ionicons
              name={percentage >= 80 ? 'trophy' : 'ribbon'}
              size={48}
              color={percentage >= 80 ? colors.success : '#f59e0b'}
            />
          </View>
          <Text style={styles.completionTitle}>Practice Complete!</Text>
          <Text style={styles.completionLesson}>{lesson.title}</Text>

          <View style={styles.statsRow}>
            <View style={[styles.statBox, { backgroundColor: colors.successLight }]}>
              <Text style={[styles.statNumber, { color: colors.success }]}>{stats.correct}</Text>
              <Text style={styles.statLabel}>CORRECT</Text>
            </View>
            <View style={[styles.statBox, { backgroundColor: colors.dangerLight }]}>
              <Text style={[styles.statNumber, { color: colors.danger }]}>{stats.incorrect}</Text>
              <Text style={styles.statLabel}>INCORRECT</Text>
            </View>
            <View style={[styles.statBox, { backgroundColor: colors.warmLavender }]}>
              <Text style={[styles.statNumber, { color: '#8b5cf6' }]}>{percentage}%</Text>
              <Text style={styles.statLabel}>SCORE</Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.doneButton}
            activeOpacity={0.8}
          >
            <Text style={styles.doneButtonText}>Done</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Progress */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBarBg}>
          <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.progressText}>{currentIndex + 1}/{exercises.length}</Text>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Exercise type badge */}
        <View style={styles.typeBadge}>
          <Ionicons name={getTypeIcon(exercise.type) as any} size={14} color={colors.accent} />
          <Text style={styles.typeBadgeText}>{getTypeLabel(exercise.type)}</Text>
        </View>

        {/* Prompt */}
        <Text style={styles.prompt}>{exercise.prompt}</Text>
        {exercise.promptKorean && (
          <Text style={styles.promptKorean}>{exercise.promptKorean}</Text>
        )}

        {/* Exercise-specific content */}
        {exercise.type === 'fill_blank' && renderFillBlank(exercise, answered, selectedAnswer, isCorrect, checkAnswer)}
        {exercise.type === 'multiple_choice' && renderMultipleChoice(exercise, answered, selectedAnswer, isCorrect, checkAnswer)}
        {exercise.type === 'sentence_build' && renderSentenceBuild(exercise, answered, isCorrect, builtWords, availableWords, setBuiltWords, setAvailableWords, checkAnswer)}
        {exercise.type === 'error_correction' && renderErrorCorrection(exercise, answered, selectedAnswer, isCorrect, checkAnswer)}
        {exercise.type === 'transform' && renderTransform(exercise, answered, textInput, setTextInput, isCorrect, checkAnswer)}

        {/* Feedback */}
        {answered && (
          <View style={[styles.feedbackCard, isCorrect ? styles.feedbackCorrect : styles.feedbackWrong]}>
            <View style={styles.feedbackHeader}>
              <Ionicons
                name={isCorrect ? 'checkmark-circle' : 'close-circle'}
                size={22}
                color={isCorrect ? colors.success : colors.danger}
              />
              <Text style={[styles.feedbackTitle, { color: isCorrect ? colors.success : colors.danger }]}>
                {isCorrect ? 'Correct!' : 'Not quite'}
              </Text>
            </View>
            {!isCorrect && (
              <Text style={styles.feedbackAnswer}>
                Correct answer: <Text style={{ fontFamily: 'Jakarta-Bold' }}>{exercise.correctAnswer}</Text>
              </Text>
            )}
            <Text style={styles.feedbackExplanation}>{exercise.explanation}</Text>
          </View>
        )}
      </ScrollView>

      {/* Bottom action */}
      {answered && (
        <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 12 }]}>
          <TouchableOpacity
            onPress={nextExercise}
            style={styles.continueButton}
            activeOpacity={0.8}
          >
            <Text style={styles.continueText}>
              {currentIndex < exercises.length - 1 ? 'Next Exercise' : 'See Results'}
            </Text>
            <Ionicons name="arrow-forward" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

// ─── Exercise Renderers ─────────────────────────────────────────────────────

function renderFillBlank(
  ex: GrammarExercise,
  answered: boolean,
  selected: string | null,
  isCorrect: boolean,
  onSelect: (answer: string) => void
) {
  return (
    <View style={styles.exerciseContent}>
      {ex.sentence && (
        <View style={styles.sentenceBox}>
          <Text style={styles.sentenceText}>
            {ex.sentence.replace('___', answered ? (isCorrect ? selected! : `[${ex.correctAnswer}]`) : '___')}
          </Text>
        </View>
      )}
      <View style={styles.optionsGrid}>
        {(ex.options || []).map((opt, i) => {
          let optStyle = styles.optionButton;
          if (answered && opt === ex.correctAnswer) {
            optStyle = { ...styles.optionButton, ...styles.optionCorrect };
          } else if (answered && opt === selected && !isCorrect) {
            optStyle = { ...styles.optionButton, ...styles.optionWrong };
          }
          return (
            <TouchableOpacity
              key={i}
              disabled={answered}
              onPress={() => onSelect(opt)}
              style={optStyle}
              activeOpacity={0.7}
            >
              <Text style={styles.optionText}>{opt}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

function renderMultipleChoice(
  ex: GrammarExercise,
  answered: boolean,
  selected: string | null,
  isCorrect: boolean,
  onSelect: (answer: string) => void
) {
  return (
    <View style={styles.exerciseContent}>
      <View style={styles.optionsList}>
        {(ex.options || []).map((opt, i) => {
          let optStyle = styles.mcOption;
          if (answered && opt === ex.correctAnswer) {
            optStyle = { ...styles.mcOption, ...styles.optionCorrect };
          } else if (answered && opt === selected && !isCorrect) {
            optStyle = { ...styles.mcOption, ...styles.optionWrong };
          }
          return (
            <TouchableOpacity
              key={i}
              disabled={answered}
              onPress={() => onSelect(opt)}
              style={optStyle}
              activeOpacity={0.7}
            >
              <Text style={styles.mcOptionText}>{opt}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

function renderSentenceBuild(
  ex: GrammarExercise,
  answered: boolean,
  isCorrect: boolean,
  builtWords: string[],
  availableWords: string[],
  setBuiltWords: (w: string[]) => void,
  setAvailableWords: (w: string[]) => void,
  onSubmit: (answer: string) => void
) {
  const builtSentence = builtWords.join(' ');

  return (
    <View style={styles.exerciseContent}>
      {/* Built sentence area */}
      <View style={[styles.buildArea, answered && (isCorrect ? styles.buildAreaCorrect : styles.buildAreaWrong)]}>
        {builtWords.length === 0 ? (
          <Text style={styles.buildPlaceholder}>Tap words below to build the sentence</Text>
        ) : (
          <View style={styles.builtWordsRow}>
            {builtWords.map((w, i) => (
              <TouchableOpacity
                key={i}
                disabled={answered}
                onPress={() => {
                  setBuiltWords(builtWords.filter((_, idx) => idx !== i));
                  setAvailableWords([...availableWords, w]);
                }}
                style={styles.builtChip}
              >
                <Text style={styles.builtChipText}>{w}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {/* Available words */}
      <View style={styles.availableWordsRow}>
        {availableWords.map((w, i) => (
          <TouchableOpacity
            key={i}
            disabled={answered}
            onPress={() => {
              setBuiltWords([...builtWords, w]);
              setAvailableWords(availableWords.filter((_, idx) => idx !== i));
            }}
            style={styles.availableChip}
          >
            <Text style={styles.availableChipText}>{w}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Check button */}
      {!answered && builtWords.length > 0 && availableWords.length === 0 && (
        <TouchableOpacity
          onPress={() => onSubmit(builtSentence)}
          style={styles.checkButton}
          activeOpacity={0.8}
        >
          <Text style={styles.checkButtonText}>Check Answer</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

function renderErrorCorrection(
  ex: GrammarExercise,
  answered: boolean,
  selected: string | null,
  isCorrect: boolean,
  onSelect: (answer: string) => void
) {
  return (
    <View style={styles.exerciseContent}>
      <View style={styles.errorSentenceBox}>
        <Ionicons name="warning" size={16} color={colors.danger} />
        <Text style={styles.errorSentenceText}>{ex.errorSentence}</Text>
      </View>

      <View style={styles.optionsList}>
        <TouchableOpacity
          disabled={answered}
          onPress={() => onSelect(ex.correctedSentence || ex.correctAnswer)}
          style={[
            styles.mcOption,
            answered && styles.optionCorrect,
          ]}
          activeOpacity={0.7}
        >
          <Text style={styles.mcOptionText}>{ex.correctedSentence || ex.correctAnswer}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          disabled={answered}
          onPress={() => onSelect(ex.errorSentence || '')}
          style={[
            styles.mcOption,
            answered && !isCorrect && selected === ex.errorSentence && styles.optionWrong,
          ]}
          activeOpacity={0.7}
        >
          <Text style={styles.mcOptionText}>{ex.errorSentence} (no change needed)</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function renderTransform(
  ex: GrammarExercise,
  answered: boolean,
  textInput: string,
  setTextInput: (t: string) => void,
  isCorrect: boolean,
  onSubmit: (answer: string) => void
) {
  return (
    <View style={styles.exerciseContent}>
      <View style={styles.transformBox}>
        <Text style={styles.transformLabel}>{ex.transformInstruction}</Text>
        <Text style={styles.transformFrom}>{ex.transformFrom}</Text>
        <Ionicons name="arrow-down" size={20} color={colors.textTertiary} />
      </View>

      <TextInput
        value={textInput}
        onChangeText={setTextInput}
        editable={!answered}
        placeholder="Type your answer in Korean"
        style={[
          styles.textInput,
          answered && (isCorrect ? styles.textInputCorrect : styles.textInputWrong),
        ]}
        autoCapitalize="none"
        autoCorrect={false}
      />

      {ex.hint && !answered && (
        <Text style={styles.hintText}>Hint: {ex.hint}</Text>
      )}

      {!answered && textInput.length > 0 && (
        <TouchableOpacity
          onPress={() => onSubmit(textInput.trim())}
          style={styles.checkButton}
          activeOpacity={0.8}
        >
          <Text style={styles.checkButtonText}>Check Answer</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function getTypeIcon(type: string): string {
  switch (type) {
    case 'fill_blank': return 'create';
    case 'multiple_choice': return 'list';
    case 'sentence_build': return 'construct';
    case 'error_correction': return 'alert-circle';
    case 'transform': return 'swap-horizontal';
    default: return 'help';
  }
}

function getTypeLabel(type: string): string {
  switch (type) {
    case 'fill_blank': return 'Fill in the Blank';
    case 'multiple_choice': return 'Multiple Choice';
    case 'sentence_build': return 'Build the Sentence';
    case 'error_correction': return 'Find the Error';
    case 'transform': return 'Transform';
    default: return 'Exercise';
  }
}

// ─── Styles ─────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: 'Jakarta-Regular',
    color: colors.textTertiary,
    textAlign: 'center',
  },
  backBtn: {
    marginTop: spacing.lg,
    backgroundColor: colors.surfaceLow,
    borderRadius: borderRadius.full,
    paddingVertical: 12,
    paddingHorizontal: 32,
  },
  backBtnText: {
    fontSize: 14,
    fontFamily: 'Jakarta-SemiBold',
    color: colors.textPrimary,
  },

  // Progress
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    gap: spacing.md,
  },
  progressBarBg: {
    flex: 1,
    height: 6,
    backgroundColor: colors.surfaceLow,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#8b5cf6',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    fontFamily: 'Jakarta-SemiBold',
    color: colors.textTertiary,
  },

  // Content
  content: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
  },

  // Type badge
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    backgroundColor: colors.accentLight,
    borderRadius: borderRadius.full,
    paddingVertical: 4,
    paddingHorizontal: 12,
    marginBottom: spacing.md,
  },
  typeBadgeText: {
    fontSize: 12,
    fontFamily: 'Jakarta-SemiBold',
    color: colors.accent,
  },

  // Prompt
  prompt: {
    fontSize: 20,
    fontFamily: 'Jakarta-Bold',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  promptKorean: {
    fontSize: 14,
    fontFamily: 'Jakarta-Regular',
    color: colors.textTertiary,
    marginBottom: spacing.lg,
  },

  // Exercise content
  exerciseContent: {
    gap: spacing.md,
    marginTop: spacing.md,
  },

  // Fill blank sentence
  sentenceBox: {
    backgroundColor: colors.surfaceLow,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    alignItems: 'center',
  },
  sentenceText: {
    fontSize: 22,
    fontFamily: 'Jakarta-Bold',
    color: colors.textPrimary,
    textAlign: 'center',
    lineHeight: 34,
  },

  // Options grid (fill blank)
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  optionButton: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.border,
    ...shadows.sm,
  },
  optionCorrect: {
    backgroundColor: colors.successLight,
    borderColor: colors.success,
  },
  optionWrong: {
    backgroundColor: colors.dangerLight,
    borderColor: colors.danger,
  },
  optionText: {
    fontSize: 20,
    fontFamily: 'Jakarta-Bold',
    color: colors.textPrimary,
  },

  // Multiple choice
  optionsList: {
    gap: spacing.sm,
  },
  mcOption: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    borderWidth: 2,
    borderColor: colors.border,
  },
  mcOptionText: {
    fontSize: 15,
    fontFamily: 'Jakarta-Medium',
    color: colors.textPrimary,
  },

  // Sentence builder
  buildArea: {
    backgroundColor: colors.surfaceLow,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    minHeight: 80,
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
  },
  buildAreaCorrect: {
    borderColor: colors.success,
    backgroundColor: colors.successLight,
    borderStyle: 'solid',
  },
  buildAreaWrong: {
    borderColor: colors.danger,
    backgroundColor: colors.dangerLight,
    borderStyle: 'solid',
  },
  buildPlaceholder: {
    fontSize: 14,
    fontFamily: 'Jakarta-Regular',
    color: colors.textTertiary,
    textAlign: 'center',
  },
  builtWordsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    justifyContent: 'center',
  },
  builtChip: {
    backgroundColor: '#8b5cf6',
    borderRadius: borderRadius.lg,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  builtChipText: {
    fontSize: 18,
    fontFamily: 'Jakarta-Bold',
    color: '#fff',
  },
  availableWordsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    justifyContent: 'center',
  },
  availableChip: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 2,
    borderColor: colors.border,
  },
  availableChipText: {
    fontSize: 18,
    fontFamily: 'Jakarta-Bold',
    color: colors.textPrimary,
  },

  // Error correction
  errorSentenceBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.dangerLight,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
  },
  errorSentenceText: {
    flex: 1,
    fontSize: 18,
    fontFamily: 'Jakarta-Bold',
    color: colors.danger,
  },

  // Transform
  transformBox: {
    backgroundColor: colors.surfaceLow,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    alignItems: 'center',
    gap: spacing.sm,
  },
  transformLabel: {
    fontSize: 12,
    fontFamily: 'Jakarta-SemiBold',
    color: colors.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  transformFrom: {
    fontSize: 28,
    fontFamily: 'Jakarta-ExtraBold',
    color: colors.textPrimary,
  },

  // Text input
  textInput: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    fontSize: 20,
    fontFamily: 'Jakarta-Bold',
    color: colors.textPrimary,
    textAlign: 'center',
    borderWidth: 2,
    borderColor: colors.border,
  },
  textInputCorrect: {
    borderColor: colors.success,
    backgroundColor: colors.successLight,
  },
  textInputWrong: {
    borderColor: colors.danger,
    backgroundColor: colors.dangerLight,
  },
  hintText: {
    fontSize: 13,
    fontFamily: 'Jakarta-Regular',
    color: colors.textTertiary,
    fontStyle: 'italic',
    textAlign: 'center',
  },

  // Check button
  checkButton: {
    backgroundColor: '#8b5cf6',
    borderRadius: borderRadius.full,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  checkButtonText: {
    fontSize: 16,
    fontFamily: 'Jakarta-Bold',
    color: '#fff',
  },

  // Feedback
  feedbackCard: {
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  feedbackCorrect: {
    backgroundColor: colors.successLight,
  },
  feedbackWrong: {
    backgroundColor: colors.dangerLight,
  },
  feedbackHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  feedbackTitle: {
    fontSize: 16,
    fontFamily: 'Jakarta-Bold',
  },
  feedbackAnswer: {
    fontSize: 14,
    fontFamily: 'Jakarta-Regular',
    color: colors.textPrimary,
  },
  feedbackExplanation: {
    fontSize: 13,
    fontFamily: 'Jakarta-Regular',
    color: colors.textSecondary,
    lineHeight: 20,
  },

  // Bottom bar
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: '#8b5cf6',
    borderRadius: borderRadius.full,
    paddingVertical: 16,
  },
  continueText: {
    fontSize: 16,
    fontFamily: 'Jakarta-Bold',
    color: '#fff',
  },

  // Completion
  completionCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xxxl,
    padding: spacing.xxxl,
    alignItems: 'center',
    gap: spacing.md,
    width: '100%',
    ...shadows.md,
  },
  completionIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  completionTitle: {
    fontSize: 24,
    fontFamily: 'Jakarta-ExtraBold',
    color: colors.textPrimary,
  },
  completionLesson: {
    fontSize: 15,
    fontFamily: 'Jakarta-Regular',
    color: colors.textTertiary,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  statBox: {
    flex: 1,
    borderRadius: borderRadius.xl,
    padding: spacing.md,
    alignItems: 'center',
    gap: 2,
  },
  statNumber: {
    fontSize: 24,
    fontFamily: 'Jakarta-ExtraBold',
  },
  statLabel: {
    fontSize: 9,
    fontFamily: 'Jakarta-Bold',
    letterSpacing: 1,
    color: colors.textTertiary,
  },
  doneButton: {
    backgroundColor: '#8b5cf6',
    borderRadius: borderRadius.full,
    paddingVertical: 14,
    paddingHorizontal: 48,
    marginTop: spacing.xl,
  },
  doneButtonText: {
    fontSize: 16,
    fontFamily: 'Jakarta-Bold',
    color: '#fff',
  },
});

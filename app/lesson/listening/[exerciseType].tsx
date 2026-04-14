import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { colors, borderRadius, spacing, shadows } from '@/lib/theme';
import { useAppStore } from '@/lib/store';
import { AudioButton } from '@/components/common/AudioButton';
import {
  listeningExercises,
  generateListeningFromVocab,
  generateDictationFromSentences,
  ListeningExercise,
} from '@/data/listeningExercises';
import { normalizeKorean, compareKorean } from '@/lib/speechRecognition';
import { shuffleArray } from '@/lib/utils';

export default function ListeningExerciseScreen() {
  const { exerciseType } = useLocalSearchParams<{ exerciseType: string }>();
  const insets = useSafeAreaInsets();
  const { hapticEnabled, markLessonComplete, completedLessons } = useAppStore();

  const exercises = useMemo(() => {
    let pool: ListeningExercise[] = [];
    if (exerciseType === 'all') {
      pool = [...listeningExercises, ...generateListeningFromVocab(5)];
    } else if (exerciseType === 'identify') {
      pool = [
        ...listeningExercises.filter((e) => e.type === 'identify_meaning'),
        ...generateListeningFromVocab(8),
      ];
    } else if (exerciseType === 'dictation') {
      pool = [
        ...listeningExercises.filter((e) => e.type === 'dictation'),
        ...generateDictationFromSentences(5),
      ];
    } else if (exerciseType === 'fill') {
      pool = listeningExercises.filter((e) => e.type === 'fill_audio_blank');
    }
    return shuffleArray(pool).slice(0, 10);
  }, [exerciseType]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [dictationInput, setDictationInput] = useState('');
  const [stats, setStats] = useState({ correct: 0, incorrect: 0 });
  const [completed, setCompleted] = useState(false);

  const exercise = exercises[currentIndex];
  const progress = exercises.length > 0 ? (currentIndex / exercises.length) * 100 : 0;

  const handleAnswer = (correct: boolean) => {
    setIsCorrect(correct);
    setAnswered(true);
    if (hapticEnabled) {
      Haptics.notificationAsync(
        correct ? Haptics.NotificationFeedbackType.Success : Haptics.NotificationFeedbackType.Error
      );
    }
    setStats((s) => ({
      correct: s.correct + (correct ? 1 : 0),
      incorrect: s.incorrect + (correct ? 0 : 1),
    }));
    if (exercise) {
      markLessonComplete(`listen_${exercise.id}`, correct ? 100 : 0);
    }
  };

  const handleOptionSelect = (idx: number) => {
    setSelectedOption(idx);
    handleAnswer(idx === exercise.correctIndex);
  };

  const handleDictationSubmit = () => {
    const input = dictationInput.trim();
    const result = compareKorean(exercise.korean, input);
    handleAnswer(result.score >= 75);
  };

  const nextExercise = () => {
    if (currentIndex < exercises.length - 1) {
      setCurrentIndex((i) => i + 1);
      setAnswered(false);
      setIsCorrect(false);
      setSelectedOption(null);
      setDictationInput('');
    } else {
      setCompleted(true);
    }
  };

  if (completed || exercises.length === 0) {
    return (
      <View style={[styles.container, styles.center]}>
        <View style={styles.completionCard}>
          <View style={[styles.completionIcon, { backgroundColor: stats.correct > stats.incorrect ? '#d1fae5' : '#fef3c7' }]}>
            <Ionicons
              name={stats.correct > stats.incorrect ? 'headset' : 'ear'}
              size={48}
              color={stats.correct > stats.incorrect ? colors.success : '#f59e0b'}
            />
          </View>
          <Text style={styles.completionTitle}>
            {exercises.length === 0 ? 'No exercises available' : 'Practice Complete!'}
          </Text>
          {exercises.length > 0 && (
            <View style={styles.statsRow}>
              <View style={[styles.statBox, { backgroundColor: colors.successLight }]}>
                <Text style={[styles.statNum, { color: colors.success }]}>{stats.correct}</Text>
                <Text style={styles.statLabel}>CORRECT</Text>
              </View>
              <View style={[styles.statBox, { backgroundColor: colors.dangerLight }]}>
                <Text style={[styles.statNum, { color: colors.danger }]}>{stats.incorrect}</Text>
                <Text style={styles.statLabel}>INCORRECT</Text>
              </View>
            </View>
          )}
          <TouchableOpacity onPress={() => router.back()} style={styles.doneBtn}>
            <Text style={styles.doneBtnText}>Done</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Progress */}
      <View style={styles.progressRow}>
        <View style={styles.progressBg}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.progressText}>{currentIndex + 1}/{exercises.length}</Text>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Audio play button */}
        <View style={styles.audioSection}>
          <AudioButton
            text={exercise.korean}
            size="lg"
            color="#06b6d4"
          />
          <Text style={styles.listenPrompt}>
            {exercise.type === 'identify_meaning' && 'Listen and choose the correct meaning'}
            {exercise.type === 'dictation' && 'Listen and type what you hear in Korean'}
            {exercise.type === 'fill_audio_blank' && 'Listen and fill in the missing word'}
          </Text>
        </View>

        {/* Exercise-specific UI */}
        {(exercise.type === 'identify_meaning' || exercise.type === 'fill_audio_blank') && exercise.options && (
          <View style={styles.optionsList}>
            {exercise.options.map((opt, i) => {
              let optStyle = styles.option;
              if (answered && i === exercise.correctIndex) {
                optStyle = { ...styles.option, ...styles.optionCorrect };
              } else if (answered && i === selectedOption && !isCorrect) {
                optStyle = { ...styles.option, ...styles.optionWrong };
              }
              return (
                <TouchableOpacity
                  key={i}
                  disabled={answered}
                  onPress={() => handleOptionSelect(i)}
                  style={optStyle}
                  activeOpacity={0.7}
                >
                  <Text style={styles.optionText}>{opt}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {exercise.type === 'dictation' && (
          <View style={styles.dictationSection}>
            <TextInput
              value={dictationInput}
              onChangeText={setDictationInput}
              editable={!answered}
              placeholder="Type what you hear..."
              style={[
                styles.dictationInput,
                answered && (isCorrect ? styles.inputCorrect : styles.inputWrong),
              ]}
              autoCapitalize="none"
              autoCorrect={false}
            />
            {exercise.hint && !answered && (
              <Text style={styles.hint}>Hint: {exercise.hint}</Text>
            )}
            {!answered && dictationInput.length > 0 && (
              <TouchableOpacity onPress={handleDictationSubmit} style={styles.checkBtn}>
                <Text style={styles.checkBtnText}>Check</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Feedback */}
        {answered && (
          <View style={[styles.feedback, isCorrect ? styles.feedbackCorrect : styles.feedbackWrong]}>
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
            <Text style={styles.feedbackKorean}>{exercise.korean}</Text>
            <Text style={styles.feedbackEnglish}>{exercise.english}</Text>
            <Text style={styles.feedbackRoman}>{exercise.romanization}</Text>
          </View>
        )}
      </ScrollView>

      {/* Continue */}
      {answered && (
        <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 12 }]}>
          <TouchableOpacity onPress={nextExercise} style={styles.continueBtn}>
            <Text style={styles.continueBtnText}>
              {currentIndex < exercises.length - 1 ? 'Next' : 'See Results'}
            </Text>
            <Ionicons name="arrow-forward" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  center: { justifyContent: 'center', alignItems: 'center', padding: spacing.xl },

  // Progress
  progressRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.xl, paddingTop: spacing.md, gap: spacing.md },
  progressBg: { flex: 1, height: 6, backgroundColor: colors.surfaceLow, borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#06b6d4', borderRadius: 3 },
  progressText: { fontSize: 12, fontFamily: 'Jakarta-SemiBold', color: colors.textTertiary },

  content: { flex: 1, paddingHorizontal: spacing.xl, paddingTop: spacing.lg },

  // Audio section
  audioSection: { alignItems: 'center', gap: spacing.md, marginBottom: spacing.xl },
  listenPrompt: { fontSize: 16, fontFamily: 'Jakarta-SemiBold', color: colors.textPrimary, textAlign: 'center' },

  // Options
  optionsList: { gap: spacing.sm },
  option: { backgroundColor: colors.surface, borderRadius: borderRadius.xl, padding: spacing.lg, borderWidth: 2, borderColor: colors.border },
  optionCorrect: { backgroundColor: colors.successLight, borderColor: colors.success },
  optionWrong: { backgroundColor: colors.dangerLight, borderColor: colors.danger },
  optionText: { fontSize: 15, fontFamily: 'Jakarta-Medium', color: colors.textPrimary },

  // Dictation
  dictationSection: { gap: spacing.md },
  dictationInput: { backgroundColor: colors.surface, borderRadius: borderRadius.xl, padding: spacing.lg, fontSize: 20, fontFamily: 'Jakarta-Bold', color: colors.textPrimary, textAlign: 'center', borderWidth: 2, borderColor: colors.border },
  inputCorrect: { borderColor: colors.success, backgroundColor: colors.successLight },
  inputWrong: { borderColor: colors.danger, backgroundColor: colors.dangerLight },
  hint: { fontSize: 13, fontFamily: 'Jakarta-Regular', color: colors.textTertiary, fontStyle: 'italic', textAlign: 'center' },
  checkBtn: { backgroundColor: '#06b6d4', borderRadius: borderRadius.full, paddingVertical: 14, alignItems: 'center' },
  checkBtnText: { fontSize: 16, fontFamily: 'Jakarta-Bold', color: '#fff' },

  // Feedback
  feedback: { borderRadius: borderRadius.xl, padding: spacing.lg, gap: spacing.xs, marginTop: spacing.lg },
  feedbackCorrect: { backgroundColor: colors.successLight },
  feedbackWrong: { backgroundColor: colors.dangerLight },
  feedbackHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  feedbackTitle: { fontSize: 16, fontFamily: 'Jakarta-Bold' },
  feedbackKorean: { fontSize: 20, fontFamily: 'Jakarta-Bold', color: colors.textPrimary },
  feedbackEnglish: { fontSize: 15, fontFamily: 'Jakarta-SemiBold', color: colors.accent },
  feedbackRoman: { fontSize: 13, fontFamily: 'Jakarta-Regular', color: colors.textTertiary },

  // Bottom
  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.borderLight, paddingHorizontal: spacing.xl, paddingTop: spacing.md },
  continueBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, backgroundColor: '#06b6d4', borderRadius: borderRadius.full, paddingVertical: 16 },
  continueBtnText: { fontSize: 16, fontFamily: 'Jakarta-Bold', color: '#fff' },

  // Completion
  completionCard: { backgroundColor: colors.surface, borderRadius: borderRadius.xxxl, padding: spacing.xxxl, alignItems: 'center', gap: spacing.md, width: '100%', ...shadows.md },
  completionIcon: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.sm },
  completionTitle: { fontSize: 24, fontFamily: 'Jakarta-ExtraBold', color: colors.textPrimary },
  statsRow: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.lg },
  statBox: { flex: 1, borderRadius: borderRadius.xl, padding: spacing.md, alignItems: 'center', gap: 2 },
  statNum: { fontSize: 24, fontFamily: 'Jakarta-ExtraBold' },
  statLabel: { fontSize: 9, fontFamily: 'Jakarta-Bold', letterSpacing: 1, color: colors.textTertiary },
  doneBtn: { backgroundColor: '#06b6d4', borderRadius: borderRadius.full, paddingVertical: 14, paddingHorizontal: 48, marginTop: spacing.xl },
  doneBtnText: { fontSize: 16, fontFamily: 'Jakarta-Bold', color: '#fff' },
});

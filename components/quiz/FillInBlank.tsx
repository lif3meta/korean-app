import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { colors, borderRadius, spacing, typography } from '@/lib/theme';
import { useAppStore } from '@/lib/store';

interface FillInBlankProps {
  sentence: string;
  correctAnswer: string;
  acceptedAnswers: string[];
  hint?: string;
  onAnswer: (correct: boolean) => void;
}

export function FillInBlank({ sentence, correctAnswer, acceptedAnswers, hint, onAnswer }: FillInBlankProps) {
  const [input, setInput] = useState('');
  const [answered, setAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const hapticEnabled = useAppStore((s) => s.hapticEnabled);

  const handleSubmit = () => {
    if (answered || !input.trim()) return;
    const correct = acceptedAnswers.includes(input.trim()) || input.trim() === correctAnswer;
    setIsCorrect(correct);
    setAnswered(true);
    if (hapticEnabled) {
      Haptics.notificationAsync(correct ? Haptics.NotificationFeedbackType.Success : Haptics.NotificationFeedbackType.Error);
    }
    setTimeout(() => onAnswer(correct), 1500);
  };

  const parts = sentence.split('___');

  return (
    <View style={styles.container}>
      <View style={styles.sentenceRow}>
        <Text style={styles.sentenceText}>{parts[0]}</Text>
        <View style={[styles.blankBox, answered && (isCorrect ? styles.correctBox : styles.incorrectBox)]}>
          {answered ? (
            <Text style={[styles.answerText, { color: isCorrect ? colors.success : colors.danger }]}>
              {isCorrect ? input : correctAnswer}
            </Text>
          ) : (
            <TextInput
              style={styles.input}
              value={input}
              onChangeText={setInput}
              placeholder="?"
              placeholderTextColor={colors.textTertiary}
              autoCapitalize="none"
              onSubmitEditing={handleSubmit}
            />
          )}
        </View>
        <Text style={styles.sentenceText}>{parts[1] || ''}</Text>
      </View>

      {!answered && hint && (
        <TouchableOpacity onPress={() => setShowHint(true)} style={styles.hintBtn}>
          <Ionicons name="bulb-outline" size={16} color={colors.warning} />
          <Text style={styles.hintBtnText}>{showHint ? hint : 'Show hint'}</Text>
        </TouchableOpacity>
      )}

      {!answered && (
        <TouchableOpacity onPress={handleSubmit} style={[styles.submitBtn, !input.trim() && styles.submitDisabled]} disabled={!input.trim()}>
          <Text style={styles.submitText}>Check</Text>
        </TouchableOpacity>
      )}

      {answered && !isCorrect && (
        <Text style={styles.correction}>Correct answer: <Text style={{ fontWeight: '700' }}>{correctAnswer}</Text></Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: spacing.lg, alignItems: 'center' },
  sentenceRow: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: spacing.xs },
  sentenceText: { fontSize: 22, color: colors.textPrimary },
  blankBox: {
    borderBottomWidth: 3,
    borderColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    minWidth: 80,
    alignItems: 'center',
  },
  correctBox: { borderColor: colors.success, backgroundColor: colors.successBg, borderRadius: borderRadius.sm },
  incorrectBox: { borderColor: colors.danger, backgroundColor: colors.dangerBg, borderRadius: borderRadius.sm },
  input: { fontSize: 22, color: colors.primaryDark, textAlign: 'center', minWidth: 60, padding: 0 },
  answerText: { fontSize: 22, fontWeight: '600' },
  hintBtn: { flexDirection: 'row', gap: spacing.xs, alignItems: 'center' },
  hintBtnText: { ...typography.footnote, color: colors.warning },
  submitBtn: { backgroundColor: colors.primary, paddingVertical: spacing.md, paddingHorizontal: spacing.xxxl, borderRadius: borderRadius.xl },
  submitDisabled: { opacity: 0.4 },
  submitText: { ...typography.bodyBold, color: '#fff' },
  correction: { ...typography.body, color: colors.danger, textAlign: 'center' },
});

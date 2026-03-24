import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { colors, borderRadius, spacing, typography, shadows } from '@/lib/theme';
import { useAppStore } from '@/lib/store';

interface MultipleChoiceProps {
  question: string;
  questionKorean?: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
  onAnswer: (correct: boolean) => void;
}

export function MultipleChoice({ question, questionKorean, options, correctIndex, explanation, onAnswer }: MultipleChoiceProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const hapticEnabled = useAppStore((s) => s.hapticEnabled);

  const handleSelect = (index: number) => {
    if (answered) return;
    setSelected(index);
    setAnswered(true);
    const correct = index === correctIndex;
    if (hapticEnabled) {
      Haptics.notificationAsync(correct ? Haptics.NotificationFeedbackType.Success : Haptics.NotificationFeedbackType.Error);
    }
    setTimeout(() => onAnswer(correct), 1200);
  };

  const getOptionStyle = (index: number) => {
    if (!answered) return styles.option;
    if (index === correctIndex) return [styles.option, styles.correct];
    if (index === selected) return [styles.option, styles.incorrect];
    return [styles.option, styles.dimmed];
  };

  const getOptionTextStyle = (index: number) => {
    if (!answered) return styles.optionText;
    if (index === correctIndex) return [styles.optionText, { color: colors.success }];
    if (index === selected) return [styles.optionText, { color: colors.danger }];
    return [styles.optionText, { color: colors.textTertiary }];
  };

  return (
    <View style={styles.container}>
      <Text style={styles.question}>{question}</Text>
      {questionKorean && <Text style={styles.questionKorean}>{questionKorean}</Text>}

      <View style={styles.options}>
        {options.map((option, i) => (
          <TouchableOpacity key={i} onPress={() => handleSelect(i)} activeOpacity={0.7} style={getOptionStyle(i)} disabled={answered}>
            <Text style={getOptionTextStyle(i)}>{option}</Text>
            {answered && i === correctIndex && <Ionicons name="checkmark-circle" size={22} color={colors.success} />}
            {answered && i === selected && i !== correctIndex && <Ionicons name="close-circle" size={22} color={colors.danger} />}
          </TouchableOpacity>
        ))}
      </View>

      {answered && explanation && (
        <View style={styles.explanationBox}>
          <Ionicons name="bulb" size={16} color={colors.warning} />
          <Text style={styles.explanationText}>{explanation}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: spacing.lg },
  question: { ...typography.title3, color: colors.textPrimary, textAlign: 'center' },
  questionKorean: { fontSize: 28, color: colors.primaryDark, textAlign: 'center', fontWeight: '300', marginTop: -spacing.sm },
  options: { gap: spacing.md },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    borderColor: colors.border,
    ...shadows.sm,
  },
  correct: { borderColor: colors.success, backgroundColor: colors.successBg },
  incorrect: { borderColor: colors.danger, backgroundColor: colors.dangerBg },
  dimmed: { opacity: 0.5 },
  optionText: { ...typography.body, color: colors.textPrimary, flex: 1 },
  explanationBox: {
    flexDirection: 'row',
    gap: spacing.sm,
    backgroundColor: colors.secondaryLight,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'flex-start',
  },
  explanationText: { ...typography.footnote, color: colors.textSecondary, flex: 1 },
});

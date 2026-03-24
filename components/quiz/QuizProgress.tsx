import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, borderRadius, spacing, typography } from '@/lib/theme';

interface QuizProgressProps {
  current: number;
  total: number;
  correct: number;
}

export function QuizProgress({ current, total, correct }: QuizProgressProps) {
  const pct = total > 0 ? (current / total) * 100 : 0;

  return (
    <View style={styles.container}>
      <View style={styles.bar}>
        <LinearGradient colors={[colors.primary, colors.accent]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={[styles.fill, { width: `${pct}%` as any }]} />
      </View>
      <View style={styles.stats}>
        <Text style={styles.text}>{current}/{total}</Text>
        <Text style={[styles.text, { color: colors.success }]}>{correct} correct</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: spacing.xs },
  bar: { height: 6, borderRadius: borderRadius.full, backgroundColor: colors.primaryPale, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: borderRadius.full },
  stats: { flexDirection: 'row', justifyContent: 'space-between' },
  text: { ...typography.caption, color: colors.textTertiary },
});

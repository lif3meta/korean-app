import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, borderRadius, spacing, typography, shadows } from '@/lib/theme';
import { VocabCategory, categoryInfo, getWordsByCategory } from '@/data/vocabulary';
import { useAppStore } from '@/lib/store';
import { getPercentage } from '@/lib/utils';

interface CategoryCardProps {
  category: VocabCategory;
  onPress: () => void;
}

export function CategoryCard({ category, onPress }: CategoryCardProps) {
  const info = categoryInfo[category];
  const words = getWordsByCategory(category);
  const learnedWords = useAppStore((s) => s.learnedWords);
  const learned = words.filter((w) => learnedWords.includes(w.id)).length;
  const pct = getPercentage(learned, words.length);

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7} style={styles.card}>
      <View style={[styles.iconCircle, { backgroundColor: info.color + '20' }]}>
        <Ionicons name={info.icon as any} size={24} color={info.color} />
      </View>
      <Text style={styles.name}>{info.name}</Text>
      <Text style={styles.nameKorean}>{info.nameKorean}</Text>
      <View style={styles.progressRow}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${pct}%` as any, backgroundColor: info.color }]} />
        </View>
        <Text style={styles.count}>{learned}/{words.length}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
    ...shadows.sm,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: { ...typography.captionBold, color: colors.textPrimary },
  nameKorean: { ...typography.caption, color: colors.textTertiary, marginTop: -4 },
  progressRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, width: '100%' },
  progressBar: { flex: 1, height: 4, borderRadius: 2, backgroundColor: colors.primaryPale },
  progressFill: { height: '100%', borderRadius: 2 },
  count: { ...typography.caption, color: colors.textTertiary, fontSize: 10 },
});

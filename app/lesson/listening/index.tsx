import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, borderRadius, spacing, shadows } from '@/lib/theme';
import { useAppStore } from '@/lib/store';
import { listeningExercises, generateListeningFromVocab, generateDictationFromSentences } from '@/data/listeningExercises';

const CATEGORIES = [
  { id: 'identify', label: 'Identify Meaning', labelKorean: '의미 파악', icon: 'ear', color: '#06b6d4', desc: 'Hear Korean, pick the meaning', type: 'identify_meaning' },
  { id: 'dictation', label: 'Dictation', labelKorean: '받아쓰기', icon: 'create', color: '#8b5cf6', desc: 'Hear Korean, type what you heard', type: 'dictation' },
  { id: 'fill', label: 'Fill the Blank', labelKorean: '빈칸 채우기', icon: 'help-circle', color: '#f59e0b', desc: 'Listen and fill in the missing word', type: 'fill_audio_blank' },
  { id: 'all', label: 'Mixed Practice', labelKorean: '종합 연습', icon: 'shuffle', color: colors.accent, desc: 'All exercise types mixed together', type: 'all' },
];

export default function ListeningIndexScreen() {
  const insets = useSafeAreaInsets();
  const { completedLessons } = useAppStore();

  const completedCount = useMemo(() => {
    return listeningExercises.filter((e) => completedLessons[`listen_${e.id}`]).length;
  }, [completedLessons]);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: insets.bottom + 32 }}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerIcon}>
          <Ionicons name="ear" size={32} color="#06b6d4" />
        </View>
        <Text style={styles.headerTitle}>Listening Practice</Text>
        <Text style={styles.headerKorean}>듣기 연습</Text>
        <Text style={styles.headerDesc}>Train your ear to understand spoken Korean</Text>
        <View style={styles.progressPill}>
          <Ionicons name="checkmark-circle" size={14} color={colors.success} />
          <Text style={styles.progressText}>{completedCount}/{listeningExercises.length} completed</Text>
        </View>
      </View>

      {/* Categories */}
      <View style={styles.grid}>
        {CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat.id}
            onPress={() => router.push(`/lesson/listening/${cat.id}` as any)}
            style={styles.card}
            activeOpacity={0.8}
          >
            <View style={[styles.cardIcon, { backgroundColor: cat.color + '18' }]}>
              <Ionicons name={cat.icon as any} size={24} color={cat.color} />
            </View>
            <Text style={styles.cardTitle}>{cat.label}</Text>
            <Text style={styles.cardKorean}>{cat.labelKorean}</Text>
            <Text style={styles.cardDesc}>{cat.desc}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: spacing.xl,
    alignItems: 'center',
    gap: spacing.xs,
  },
  headerIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#06b6d4' + '18',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Jakarta-ExtraBold',
    color: colors.textPrimary,
  },
  headerKorean: {
    fontSize: 14,
    fontFamily: 'Jakarta-Regular',
    color: colors.textTertiary,
  },
  headerDesc: {
    fontSize: 14,
    fontFamily: 'Jakarta-Regular',
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  progressPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.successLight,
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: borderRadius.full,
    marginTop: spacing.sm,
  },
  progressText: {
    fontSize: 12,
    fontFamily: 'Jakarta-SemiBold',
    color: colors.success,
  },
  grid: {
    paddingHorizontal: spacing.xl,
    gap: spacing.md,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xxl,
    padding: spacing.xl,
    gap: spacing.xs,
    ...shadows.sm,
  },
  cardIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  cardTitle: {
    fontSize: 17,
    fontFamily: 'Jakarta-Bold',
    color: colors.textPrimary,
  },
  cardKorean: {
    fontSize: 13,
    fontFamily: 'Jakarta-Regular',
    color: colors.textTertiary,
  },
  cardDesc: {
    fontSize: 13,
    fontFamily: 'Jakarta-Regular',
    color: colors.textSecondary,
  },
});

import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, borderRadius, spacing, shadows } from '@/lib/theme';
import { useAppStore } from '@/lib/store';
import { writingPrompts } from '@/data/writingPrompts';

const CATEGORIES = [
  {
    id: 'translation',
    label: 'Translation',
    labelKorean: '\uBC88\uC5ED',
    icon: 'swap-horizontal',
    color: '#8b5cf6',
    desc: 'Translate English to Korean',
  },
  {
    id: 'particle_fill',
    label: 'Particle Practice',
    labelKorean: '\uC870\uC0AC \uC5F0\uC2B5',
    icon: 'create',
    color: '#06b6d4',
    desc: 'Fill in the correct particles',
  },
  {
    id: 'free_write',
    label: 'Free Writing',
    labelKorean: '\uC790\uC720 \uC791\uBB38',
    icon: 'document-text',
    color: '#f59e0b',
    desc: 'Write freely in Korean',
  },
];

export default function WritingIndexScreen() {
  const insets = useSafeAreaInsets();
  const { completedLessons } = useAppStore();

  const completedCount = useMemo(() => {
    return Object.keys(completedLessons).filter((k) => k.startsWith('write_')).length;
  }, [completedLessons]);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: insets.bottom + 32 }}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerIcon}>
          <Ionicons name="pencil" size={32} color="#8b5cf6" />
        </View>
        <Text style={styles.headerTitle}>Writing Practice</Text>
        <Text style={styles.headerKorean}>{'\uC4F0\uAE30 \uC5F0\uC2B5'}</Text>
        <Text style={styles.headerDesc}>Practice writing in Korean</Text>
        <View style={styles.progressPill}>
          <Ionicons name="checkmark-circle" size={14} color={colors.success} />
          <Text style={styles.progressText}>
            {completedCount}/{writingPrompts.length} completed
          </Text>
        </View>
      </View>

      {/* Categories */}
      <View style={styles.grid}>
        {CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat.id}
            onPress={() => router.push(`/lesson/writing/${cat.id}` as any)}
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
    backgroundColor: '#8b5cf6' + '18',
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

import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, borderRadius, spacing, typography, shadows } from '@/lib/theme';
import { handwritingLessons } from '@/data/handwriting';
import { useAppStore } from '@/lib/store';

export default function HandwritingListScreen() {
  const { completedLessons } = useAppStore();

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 100 }}>
      <View style={styles.header}>
        <View style={styles.headerIconWrap}>
          <Ionicons name="pencil" size={24} color={colors.primary} />
        </View>
        <View>
          <Text style={styles.title}>Handwriting</Text>
          <Text style={styles.subtitle}>손글씨</Text>
        </View>
      </View>

      <Text style={styles.description}>Learn how Korean letters are written and assembled</Text>

      <View style={styles.listContainer}>
        {handwritingLessons.map((l) => {
          const isCompleted = completedLessons[l.id];
          return (
            <TouchableOpacity
              key={l.id}
              onPress={() => router.push(`/lesson/handwriting/${l.id}`)}
              activeOpacity={0.7}
              style={styles.card}
            >
              <View style={[styles.numberCircle, isCompleted && styles.completedCircle]}>
                {isCompleted ? (
                  <Ionicons name="checkmark" size={18} color="#fff" />
                ) : (
                  <Text style={styles.numberText}>{l.order}</Text>
                )}
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.lessonTitle} numberOfLines={2}>{l.title}</Text>
                <Text style={styles.lessonKorean}>{l.titleKorean}</Text>
                <Text style={styles.lessonDesc} numberOfLines={2}>{l.description}</Text>
              </View>
              <Ionicons name="chevron-forward" size={22} color={colors.textTertiary} />
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.xl,
    paddingBottom: spacing.sm,
  },
  headerIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primaryFaint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { ...typography.title2, color: colors.textPrimary },
  subtitle: { ...typography.footnote, color: colors.textTertiary },
  description: {
    ...typography.body,
    color: colors.textSecondary,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.lg,
  },
  listContainer: { paddingHorizontal: spacing.xl, gap: spacing.xs },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    gap: spacing.md,
    ...shadows.sm,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  numberCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primaryPale,
    alignItems: 'center',
    justifyContent: 'center',
  },
  completedCircle: { backgroundColor: colors.success },
  numberText: { ...typography.bodyBold, color: colors.primaryDark },
  cardContent: { flex: 1, flexShrink: 1, gap: 2 },
  lessonTitle: { ...typography.bodyBold, color: colors.textPrimary },
  lessonKorean: { ...typography.caption, color: colors.textTertiary },
  lessonDesc: { ...typography.footnote, color: colors.textSecondary, marginTop: 2 },
});

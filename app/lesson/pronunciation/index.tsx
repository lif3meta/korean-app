import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, borderRadius, spacing, typography, shadows } from '@/lib/theme';
import { pronunciationLessons } from '@/data/pronunciation';
import { useAppStore } from '@/lib/store';

export default function PronunciationListScreen() {
  const completedLessons = useAppStore((s) => s.completedLessons);

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 100 }}>
      <Text style={styles.title}>Pronunciation</Text>
      <Text style={styles.subtitle}>발음</Text>
      <Text style={styles.introText}>
        Sound like a native speaker. Work through each lesson in order to build a solid pronunciation foundation.
      </Text>

      {pronunciationLessons.map((lesson) => {
        const isCompleted = completedLessons[lesson.id];
        return (
          <TouchableOpacity
            key={lesson.id}
            onPress={() => router.push(`/lesson/pronunciation/${lesson.id}`)}
            activeOpacity={0.7}
            style={styles.card}
          >
            <View style={[styles.numberCircle, isCompleted && styles.completedCircle]}>
              {isCompleted ? (
                <Ionicons name="checkmark" size={18} color="#fff" />
              ) : (
                <Text style={styles.numberText}>{lesson.order}</Text>
              )}
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.lessonTitle} numberOfLines={1}>{lesson.title}</Text>
              <Text style={styles.lessonKorean}>{lesson.titleKorean}</Text>
              <Text style={styles.lessonDesc} numberOfLines={2}>{lesson.description}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.xl },
  title: { ...typography.title2, color: colors.textPrimary },
  subtitle: { ...typography.footnote, color: colors.textTertiary, marginBottom: spacing.sm },
  introText: { ...typography.footnote, color: colors.textSecondary, lineHeight: 20, marginBottom: spacing.lg },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    marginBottom: spacing.md,
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
  cardContent: { flex: 1, gap: 2 },
  lessonTitle: { ...typography.bodyBold, color: colors.textPrimary },
  lessonKorean: { ...typography.caption, color: colors.textTertiary },
  lessonDesc: { ...typography.footnote, color: colors.textSecondary, marginTop: 2 },
});

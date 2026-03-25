import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { colors, borderRadius, spacing, typography, shadows } from '@/lib/theme';
import { pronunciationLessons } from '@/data/pronunciation';
import { useAppStore } from '@/lib/store';
import { speakKorean } from '@/lib/audio';

export default function PronunciationListScreen() {
  const { completedLessons, hapticEnabled, markLessonComplete } = useAppStore();

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 100 }}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Pronunciation</Text>
          <Text style={styles.subtitle}>발음</Text>
        </View>
      </View>

        <View style={styles.listContainer}>
          {pronunciationLessons.map((l) => {
            const isCompleted = completedLessons[l.id];
            const example = l.sections[0]?.examples?.[0];
            return (
              <TouchableOpacity key={l.id} onPress={() => router.push(`/lesson/pronunciation/${l.id}`)} activeOpacity={0.7} style={styles.card}>
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
                <TouchableOpacity
                  onPress={(e) => {
                    e.stopPropagation();
                    if (hapticEnabled) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    if (example) speakKorean(example.korean);
                    markLessonComplete(l.id, 100);
                  }}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  style={styles.playBtn}
                >
                  <Ionicons name={isCompleted ? 'checkmark-circle' : 'play-circle'} size={32} color={isCompleted ? colors.success : colors.accent} />
                </TouchableOpacity>
              </TouchableOpacity>
            );
          })}
        </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: spacing.xl, paddingBottom: spacing.md },
  title: { ...typography.title2, color: colors.textPrimary },
  subtitle: { ...typography.footnote, color: colors.textTertiary },
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
  numberCircle: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.primaryPale, alignItems: 'center', justifyContent: 'center' },
  completedCircle: { backgroundColor: colors.success },
  numberText: { ...typography.bodyBold, color: colors.primaryDark },
  cardContent: { flex: 1, flexShrink: 1, gap: 2 },
  lessonTitle: { ...typography.bodyBold, color: colors.textPrimary },
  lessonKorean: { ...typography.caption, color: colors.textTertiary },
  lessonDesc: { ...typography.footnote, color: colors.textSecondary, marginTop: 2 },
  playBtn: { padding: 4 },
});

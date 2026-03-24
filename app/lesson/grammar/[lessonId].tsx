import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, borderRadius, spacing, typography, shadows } from '@/lib/theme';
import { getGrammarById } from '@/data/grammar';
import { useAppStore } from '@/lib/store';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { AudioButton } from '@/components/common/AudioButton';

export default function GrammarLessonScreen() {
  const { lessonId } = useLocalSearchParams<{ lessonId: string }>();
  const lesson = getGrammarById(lessonId);
  const { completedLessons, markLessonComplete } = useAppStore();

  if (!lesson) return <View style={styles.container}><Text>Lesson not found</Text></View>;

  const isCompleted = completedLessons[lesson.id];

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 100 }}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>{lesson.title}</Text>
        <Text style={styles.titleKorean}>{lesson.titleKorean}</Text>
        <Text style={styles.description}>{lesson.description}</Text>
      </View>

      {/* Sections */}
      {lesson.sections.map((section, si) => (
        <Card key={si} variant="elevated" style={styles.sectionCard}>
          <Text style={styles.sectionHeading}>{section.heading}</Text>
          <Text style={styles.sectionExplanation}>{section.explanation}</Text>

          {section.pattern && (
            <View style={styles.patternBox}>
              <Text style={styles.patternText}>{section.pattern}</Text>
            </View>
          )}

          {section.examples.map((ex, ei) => (
            <View key={ei} style={styles.exampleCard}>
              <View style={styles.exKoreanRow}>
                <Text style={styles.exKorean}>{ex.korean}</Text>
                <AudioButton text={ex.korean} size="sm" />
              </View>
              <Text style={styles.exRoman}>{ex.romanization}</Text>
              <Text style={styles.exEnglish}>{ex.english}</Text>
              {ex.breakdown && (
                <View style={styles.breakdownRow}>
                  {ex.breakdown.map((b, bi) => (
                    <View key={bi} style={styles.breakdownItem}>
                      <Text style={styles.breakdownPart}>{b.part}</Text>
                      <Text style={styles.breakdownMeaning}>{b.meaning}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          ))}

          {section.tip && (
            <View style={styles.tipBox}>
              <Ionicons name="bulb" size={16} color={colors.secondary} />
              <Text style={styles.tipText}>{section.tip}</Text>
            </View>
          )}
        </Card>
      ))}

      {/* Complete Button */}
      <View style={styles.actionSection}>
        {isCompleted ? (
          <View style={styles.completedBadge}>
            <Ionicons name="checkmark-circle" size={24} color={colors.success} />
            <Text style={styles.completedText}>Lesson completed!</Text>
          </View>
        ) : (
          <Button title="Complete Lesson" onPress={() => { markLessonComplete(lesson.id, 100); router.back(); }} size="lg" />
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { padding: spacing.xl, gap: spacing.xs },
  title: { ...typography.title, color: colors.textPrimary },
  titleKorean: { ...typography.subhead, color: colors.textTertiary },
  description: { ...typography.body, color: colors.textSecondary, marginTop: spacing.sm, lineHeight: 24 },
  sectionCard: { marginHorizontal: spacing.xl, marginBottom: spacing.lg, padding: spacing.lg, gap: spacing.md },
  sectionHeading: { ...typography.title3, color: colors.primaryDark },
  sectionExplanation: { ...typography.body, color: colors.textSecondary, lineHeight: 24 },
  patternBox: {
    backgroundColor: colors.primaryFaint,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  patternText: { ...typography.bodyBold, color: colors.primaryDark, fontFamily: undefined },
  exampleCard: {
    backgroundColor: colors.background,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    gap: spacing.xs,
  },
  exKoreanRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  exKorean: { fontSize: 22, color: colors.textPrimary, flex: 1 },
  exRoman: { ...typography.footnote, color: colors.textTertiary, fontStyle: 'italic' },
  exEnglish: { ...typography.body, color: colors.textSecondary },
  breakdownRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.sm },
  breakdownItem: {
    backgroundColor: colors.surfaceElevated,
    padding: spacing.sm,
    borderRadius: borderRadius.sm,
    alignItems: 'center',
  },
  breakdownPart: { ...typography.captionBold, color: colors.primaryDark },
  breakdownMeaning: { ...typography.caption, color: colors.textTertiary, fontSize: 10 },
  tipBox: {
    flexDirection: 'row',
    gap: spacing.sm,
    backgroundColor: colors.secondaryLight,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'flex-start',
  },
  tipText: { ...typography.footnote, color: colors.textSecondary, flex: 1, lineHeight: 20 },
  actionSection: { paddingHorizontal: spacing.xl, marginVertical: spacing.lg },
  completedBadge: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, padding: spacing.lg, backgroundColor: colors.successBg, borderRadius: borderRadius.xl },
  completedText: { ...typography.bodyBold, color: colors.success },
});

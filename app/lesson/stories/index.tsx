import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, borderRadius, spacing, typography, shadows } from '@/lib/theme';
import { miniStories } from '@/data/miniStories';
import { useAppStore } from '@/lib/store';

const LEVELS = ['All', 'Beginner', 'Intermediate', 'Advanced'] as const;
type Level = typeof LEVELS[number];

const levelColors: Record<string, { bg: string; text: string }> = {
  beginner: { bg: '#d1fae5', text: '#065f46' },
  intermediate: { bg: '#fef3c7', text: '#92400e' },
  advanced: { bg: '#fee2e2', text: '#991b1b' },
};

export default function MiniStoriesScreen() {
  const [activeLevel, setActiveLevel] = useState<Level>('All');
  const { completedLessons } = useAppStore();

  const filtered = useMemo(() => {
    if (activeLevel === 'All') return miniStories;
    return miniStories.filter(
      (s) => s.level.toLowerCase() === activeLevel.toLowerCase()
    );
  }, [activeLevel]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 32 }}>
      <View style={styles.header}>
        <View style={styles.headerIcon}>
          <Ionicons name="book" size={28} color="#0d9488" />
        </View>
        <Text style={styles.title}>Mini Stories</Text>
        <Text style={styles.titleKorean}>짧은 이야기</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabBar}
      >
        {LEVELS.map((level) => (
          <TouchableOpacity
            key={level}
            onPress={() => setActiveLevel(level)}
            style={[styles.tab, activeLevel === level && styles.tabActive]}
          >
            <Text style={[styles.tabText, activeLevel === level && styles.tabTextActive]}>
              {level}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.listContainer}>
        {filtered.map((story) => {
          const isCompleted = completedLessons[story.id];
          const lc = levelColors[story.level] || levelColors.beginner;

          return (
            <TouchableOpacity
              key={story.id}
              onPress={() => router.push(`/lesson/stories/${story.id}`)}
              activeOpacity={0.7}
              style={styles.card}
            >
              <View style={styles.cardContent}>
                <View style={styles.cardTitleRow}>
                  <Text style={styles.cardTitle} numberOfLines={1}>{story.title}</Text>
                  {isCompleted && (
                    <Ionicons name="checkmark-circle" size={20} color={colors.success} />
                  )}
                </View>
                <Text style={styles.cardTitleKorean}>{story.titleKorean}</Text>

                <View style={styles.badgeRow}>
                  <View style={[styles.badge, { backgroundColor: lc.bg }]}>
                    <Text style={[styles.badgeText, { color: lc.text }]}>{story.level}</Text>
                  </View>
                  <View style={[styles.badge, { backgroundColor: colors.surfaceLow }]}>
                    <Text style={[styles.badgeText, { color: colors.textSecondary }]}>{story.category}</Text>
                  </View>
                  <View style={[styles.badge, { backgroundColor: colors.surfaceLow }]}>
                    <Ionicons name="document-text-outline" size={10} color={colors.textTertiary} />
                    <Text style={[styles.badgeText, { color: colors.textTertiary }]}>
                      {story.paragraphs.length} para
                    </Text>
                  </View>
                </View>
              </View>

              <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
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
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
    gap: spacing.xs,
  },
  headerIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#f0fdfa',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Jakarta-ExtraBold',
    color: colors.textPrimary,
  },
  titleKorean: {
    fontSize: 13,
    fontFamily: 'Jakarta-Medium',
    color: colors.textTertiary,
  },
  tabBar: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
  },
  tab: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surfaceLow,
  },
  tabActive: {
    backgroundColor: '#0d9488',
  },
  tabText: {
    fontSize: 13,
    fontFamily: 'Jakarta-SemiBold',
    color: colors.textSecondary,
  },
  tabTextActive: {
    color: '#fff',
  },
  listContainer: {
    paddingHorizontal: spacing.xl,
    gap: spacing.sm,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.sm,
  },
  cardContent: {
    flex: 1,
    gap: spacing.xs,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  cardTitle: {
    fontSize: 16,
    fontFamily: 'Jakarta-Bold',
    color: colors.textPrimary,
    flex: 1,
  },
  cardTitleKorean: {
    fontSize: 12,
    fontFamily: 'Jakarta-Medium',
    color: colors.textTertiary,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginTop: spacing.xs,
    flexWrap: 'wrap',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
  },
  badgeText: {
    fontSize: 10,
    fontFamily: 'Jakarta-Bold',
    textTransform: 'capitalize',
  },
});

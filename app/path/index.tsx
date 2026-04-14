import React, { useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, borderRadius, spacing, shadows } from '@/lib/theme';
import { useAppStore } from '@/lib/store';
import { learningPaths } from '@/data/learningPaths';
import { allHangul } from '@/data/hangul';

const TOTAL_HANGUL = allHangul.length;

export default function PathSelectionScreen() {
  const selectedPath = useAppStore((s) => s.selectedPath);
  const setSelectedPath = useAppStore((s) => s.setSelectedPath);
  const storeCompletedLessons = useAppStore((s) => s.completedLessons);
  const learnedCharacters = useAppStore((s) => s.learnedCharacters);

  const isLessonDone = useCallback((lessonId: string): boolean => {
    if (lessonId === 'hangul') {
      return learnedCharacters.length >= TOTAL_HANGUL;
    }
    return !!storeCompletedLessons[lessonId];
  }, [storeCompletedLessons, learnedCharacters]);

  const handleSelectPath = (pathId: string) => {
    setSelectedPath(pathId);
    router.push(`/path/${pathId}`);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Choose Your Path</Text>
        <Text style={styles.headerKorean}>학습 경로</Text>
        <Text style={styles.headerDesc}>
          Pick a learning path that matches your goals. You can switch anytime.
        </Text>
      </View>

      <View style={styles.cardList}>
        {learningPaths.map((path) => {
          const isSelected = selectedPath === path.id;
          const allPathLessons = path.stages.flatMap((s) => s.lessons);
          const lessonsCompleted = allPathLessons.filter((l) => isLessonDone(l)).length;
          const totalLessons = allPathLessons.length;

          return (
            <TouchableOpacity
              key={path.id}
              activeOpacity={0.85}
              onPress={() => handleSelectPath(path.id)}
            >
              <View style={[styles.card, isSelected && styles.cardSelected]}>
                <LinearGradient
                  colors={path.gradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.cardGradient}
                >
                  {isSelected && (
                    <View style={styles.selectedBadge}>
                      <Ionicons name="checkmark-circle" size={14} color="#fff" />
                      <Text style={styles.selectedBadgeText}>Current Path</Text>
                    </View>
                  )}

                  <View style={styles.cardIconRow}>
                    <View style={styles.iconCircle}>
                      <Ionicons name={path.icon as any} size={28} color="#fff" />
                    </View>
                  </View>

                  <Text style={styles.cardTitle}>{path.title}</Text>
                  <Text style={styles.cardKorean}>{path.titleKorean}</Text>
                  <Text style={styles.cardDesc}>{path.description}</Text>

                  <View style={styles.cardFooter}>
                    <View style={styles.stageInfo}>
                      <Ionicons name="layers-outline" size={14} color="rgba(255,255,255,0.8)" />
                      <Text style={styles.stageInfoText}>{path.stages.length} stages</Text>
                    </View>
                    {lessonsCompleted > 0 && (
                      <View style={styles.stageInfo}>
                        <Ionicons name="checkmark-done-outline" size={14} color="rgba(255,255,255,0.8)" />
                        <Text style={styles.stageInfoText}>
                          {lessonsCompleted}/{totalLessons} done
                        </Text>
                      </View>
                    )}
                  </View>
                </LinearGradient>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingBottom: spacing.huge,
  },
  header: {
    paddingHorizontal: spacing.xxl,
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
  },
  headerTitle: {
    fontFamily: 'Jakarta-ExtraBold',
    fontSize: 28,
    color: colors.textPrimary,
  },
  headerKorean: {
    fontFamily: 'Jakarta-Medium',
    fontSize: 13,
    color: colors.textTertiary,
    marginTop: 2,
  },
  headerDesc: {
    fontFamily: 'Jakarta-Regular',
    fontSize: 15,
    color: colors.textSecondary,
    marginTop: spacing.sm,
    lineHeight: 22,
  },
  cardList: {
    paddingHorizontal: spacing.xl,
    gap: spacing.lg,
  },
  card: {
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    ...shadows.md,
  },
  cardSelected: {
    ...shadows.glow,
  },
  cardGradient: {
    padding: spacing.xl,
    paddingTop: spacing.lg,
  },
  selectedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.pill,
    gap: 4,
    marginBottom: spacing.sm,
  },
  selectedBadgeText: {
    fontFamily: 'Jakarta-Bold',
    fontSize: 11,
    color: '#fff',
    letterSpacing: 0.5,
  },
  cardIconRow: {
    marginBottom: spacing.md,
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontFamily: 'Jakarta-ExtraBold',
    fontSize: 22,
    color: '#fff',
  },
  cardKorean: {
    fontFamily: 'Jakarta-Medium',
    fontSize: 13,
    color: 'rgba(255,255,255,0.65)',
    marginTop: 2,
  },
  cardDesc: {
    fontFamily: 'Jakarta-Regular',
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
    marginTop: spacing.sm,
    lineHeight: 20,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    marginTop: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.15)',
  },
  stageInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  stageInfoText: {
    fontFamily: 'Jakarta-SemiBold',
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
  },
});

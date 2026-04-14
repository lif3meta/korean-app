import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, borderRadius, spacing, shadows } from '@/lib/theme';
import { useAppStore } from '@/lib/store';
import { getPathById } from '@/data/learningPaths';
import type { PathStage } from '@/data/learningPaths';
import { allHangul } from '@/data/hangul';

// Total hangul characters — hangul counts as complete when all are learned
const TOTAL_HANGUL = allHangul.length;

export default function PathDetailScreen() {
  const { pathId } = useLocalSearchParams<{ pathId: string }>();
  const selectedPath = useAppStore((s) => s.selectedPath);
  const setSelectedPath = useAppStore((s) => s.setSelectedPath);
  const storeCompletedLessons = useAppStore((s) => s.completedLessons);
  const learnedCharacters = useAppStore((s) => s.learnedCharacters);

  const path = getPathById(pathId);

  if (!path) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Path not found</Text>
      </View>
    );
  }

  const isSelected = selectedPath === path.id;

  // Derive whether a lesson in the path is completed from actual store data
  const isLessonDone = useMemo(() => {
    return (lessonId: string): boolean => {
      if (lessonId === 'hangul') {
        // Hangul is complete when all characters have been learned
        return learnedCharacters.length >= TOTAL_HANGUL;
      }
      // Grammar (g_*), culture (cult_*), slang, and any other lesson
      return !!storeCompletedLessons[lessonId];
    };
  }, [storeCompletedLessons, learnedCharacters]);

  const getStageStatus = (stage: PathStage, stageIndex: number): 'locked' | 'active' | 'completed' => {
    const stageLessons = stage.lessons;
    const stageDone = stageLessons.filter((l) => isLessonDone(l)).length;

    if (stageDone === stageLessons.length && stageLessons.length > 0) {
      return 'completed';
    }

    // First stage is always unlocked
    if (stageIndex === 0) return 'active';

    // A stage is unlocked when the previous stage is completed
    const prevStage = path.stages[stageIndex - 1];
    const prevDone = prevStage.lessons.filter((l) => isLessonDone(l)).length;
    if (prevDone === prevStage.lessons.length && prevStage.lessons.length > 0) {
      return 'active';
    }

    return 'locked';
  };

  const handleStagePress = (stage: PathStage, status: string) => {
    if (status === 'locked') return;
    // Navigate to the first incomplete lesson in this stage
    const firstIncomplete = stage.lessons.find((l) => !isLessonDone(l));
    const lessonId = firstIncomplete || stage.lessons[0];
    // Map lesson IDs to routes
    if (lessonId === 'hangul') {
      router.push('/lesson/hangul/' as any);
    } else if (lessonId === 'slang') {
      router.push('/lesson/slang' as any);
    } else if (lessonId.startsWith('g_')) {
      router.push(`/lesson/grammar/${lessonId}` as any);
    } else if (lessonId.startsWith('cult_')) {
      router.push(`/lesson/culture/${lessonId}` as any);
    } else {
      router.push(`/lesson/grammar/${lessonId}` as any);
    }
  };

  const handleSelectPath = () => {
    setSelectedPath(path.id);
  };

  const allPathLessons = path.stages.flatMap((s) => s.lessons);
  const totalLessons = allPathLessons.length;
  const totalCompleted = allPathLessons.filter((l) => isLessonDone(l)).length;
  const overallProgress = totalLessons > 0 ? totalCompleted / totalLessons : 0;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* Path Header */}
      <LinearGradient
        colors={path.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        <View style={styles.headerIconCircle}>
          <Ionicons name={path.icon as any} size={36} color="#fff" />
        </View>
        <Text style={styles.headerTitle}>{path.title}</Text>
        <Text style={styles.headerKorean}>{path.titleKorean}</Text>
        <Text style={styles.headerDesc}>{path.description}</Text>

        {/* Progress bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${Math.round(overallProgress * 100)}%` }]} />
          </View>
          <Text style={styles.progressText}>
            {totalCompleted}/{totalLessons} lessons completed
          </Text>
        </View>

        {!isSelected && (
          <TouchableOpacity style={styles.selectButton} onPress={handleSelectPath} activeOpacity={0.8}>
            <Ionicons name="bookmark-outline" size={18} color={path.gradient[0]} />
            <Text style={[styles.selectButtonText, { color: path.gradient[0] }]}>Set as My Path</Text>
          </TouchableOpacity>
        )}
        {isSelected && (
          <View style={styles.currentBadge}>
            <Ionicons name="checkmark-circle" size={16} color="#fff" />
            <Text style={styles.currentBadgeText}>Your Current Path</Text>
          </View>
        )}
      </LinearGradient>

      {/* Stages */}
      <View style={styles.stagesContainer}>
        <Text style={styles.stagesHeading}>Stages</Text>

        {path.stages.map((stage, index) => {
          const status = getStageStatus(stage, index);
          const stageLessons = stage.lessons;
          const stageDone = stageLessons.filter((l) => isLessonDone(l)).length;
          const isLocked = status === 'locked';
          const isCompleted = status === 'completed';
          const isActive = status === 'active';

          return (
            <TouchableOpacity
              key={stage.id}
              activeOpacity={isLocked ? 1 : 0.7}
              onPress={() => handleStagePress(stage, status)}
            >
              <View style={[styles.stageCard, isLocked && styles.stageCardLocked, isActive && styles.stageCardActive]}>
                {/* Stage number indicator */}
                <View style={styles.stageRow}>
                  <View
                    style={[
                      styles.stageNumberCircle,
                      isCompleted && styles.stageNumberCompleted,
                      isActive && styles.stageNumberActive,
                      isLocked && styles.stageNumberLocked,
                    ]}
                  >
                    {isCompleted ? (
                      <Ionicons name="checkmark" size={18} color="#fff" />
                    ) : isLocked ? (
                      <Ionicons name="lock-closed" size={14} color={colors.textTertiary} />
                    ) : (
                      <Text style={styles.stageNumberText}>{index + 1}</Text>
                    )}
                  </View>

                  <View style={styles.stageInfo}>
                    <Text style={[styles.stageTitle, isLocked && styles.stageTitleLocked]}>
                      {stage.title}
                    </Text>
                    <Text style={[styles.stageKorean, isLocked && styles.stageKoreanLocked]}>
                      {stage.titleKorean}
                    </Text>
                    <Text style={[styles.stageDesc, isLocked && styles.stageDescLocked]}>
                      {stage.description}
                    </Text>
                  </View>

                  {!isLocked && (
                    <View style={styles.stageRight}>
                      <Text style={[styles.stageLessonCount, isCompleted && styles.stageLessonCountDone]}>
                        {stageDone}/{stageLessons.length}
                      </Text>
                      <Ionicons
                        name={isCompleted ? 'checkmark-circle' : 'chevron-forward'}
                        size={20}
                        color={isCompleted ? colors.success : colors.textTertiary}
                      />
                    </View>
                  )}
                </View>

                {/* Lesson dots */}
                {!isLocked && (
                  <View style={styles.lessonDots}>
                    {stageLessons.map((lessonId) => {
                      const done = isLessonDone(lessonId);
                      return (
                        <View
                          key={lessonId}
                          style={[
                            styles.lessonDot,
                            done && styles.lessonDotDone,
                            !done && isActive && styles.lessonDotActive,
                          ]}
                        />
                      );
                    })}
                  </View>
                )}
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
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  emptyText: {
    fontFamily: 'Jakarta-SemiBold',
    fontSize: 16,
    color: colors.textSecondary,
  },

  // Header
  headerGradient: {
    paddingHorizontal: spacing.xxl,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.xxxl,
    alignItems: 'center',
  },
  headerIconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  headerTitle: {
    fontFamily: 'Jakarta-ExtraBold',
    fontSize: 28,
    color: '#fff',
    textAlign: 'center',
  },
  headerKorean: {
    fontFamily: 'Jakarta-Medium',
    fontSize: 14,
    color: 'rgba(255,255,255,0.65)',
    marginTop: 2,
    textAlign: 'center',
  },
  headerDesc: {
    fontFamily: 'Jakarta-Regular',
    fontSize: 15,
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
    marginTop: spacing.sm,
    lineHeight: 22,
    paddingHorizontal: spacing.lg,
  },

  // Progress bar
  progressContainer: {
    width: '100%',
    marginTop: spacing.xl,
    alignItems: 'center',
  },
  progressBarBg: {
    width: '100%',
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
    backgroundColor: '#fff',
  },
  progressText: {
    fontFamily: 'Jakarta-SemiBold',
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    marginTop: spacing.sm,
  },

  // Select button
  selectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#fff',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.pill,
    marginTop: spacing.lg,
  },
  selectButtonText: {
    fontFamily: 'Jakarta-Bold',
    fontSize: 15,
  },
  currentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.pill,
    marginTop: spacing.lg,
  },
  currentBadgeText: {
    fontFamily: 'Jakarta-Bold',
    fontSize: 13,
    color: '#fff',
  },

  // Stages
  stagesContainer: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xxl,
  },
  stagesHeading: {
    fontFamily: 'Jakarta-ExtraBold',
    fontSize: 20,
    color: colors.textPrimary,
    marginBottom: spacing.lg,
  },

  stageCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  stageCardLocked: {
    backgroundColor: colors.surfaceLow,
    borderColor: colors.borderLight,
    opacity: 0.7,
  },
  stageCardActive: {
    borderColor: colors.primaryLight,
    borderWidth: 2,
    ...shadows.md,
  },
  stageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },

  // Stage number circle
  stageNumberCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surfaceContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stageNumberCompleted: {
    backgroundColor: colors.success,
  },
  stageNumberActive: {
    backgroundColor: colors.primary,
  },
  stageNumberLocked: {
    backgroundColor: colors.surfaceDim,
  },
  stageNumberText: {
    fontFamily: 'Jakarta-Bold',
    fontSize: 16,
    color: '#fff',
  },

  stageInfo: {
    flex: 1,
    gap: 1,
  },
  stageTitle: {
    fontFamily: 'Jakarta-Bold',
    fontSize: 16,
    color: colors.textPrimary,
  },
  stageTitleLocked: {
    color: colors.textTertiary,
  },
  stageKorean: {
    fontFamily: 'Jakarta-Medium',
    fontSize: 12,
    color: colors.textTertiary,
  },
  stageKoreanLocked: {
    color: colors.surfaceDim,
  },
  stageDesc: {
    fontFamily: 'Jakarta-Regular',
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  stageDescLocked: {
    color: colors.textTertiary,
  },

  stageRight: {
    alignItems: 'center',
    gap: 2,
  },
  stageLessonCount: {
    fontFamily: 'Jakarta-Bold',
    fontSize: 13,
    color: colors.textSecondary,
  },
  stageLessonCountDone: {
    color: colors.success,
  },

  // Lesson dots
  lessonDots: {
    flexDirection: 'row',
    gap: 6,
    marginTop: spacing.md,
    paddingLeft: 52, // align with text after the circle
  },
  lessonDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.surfaceContainer,
  },
  lessonDotDone: {
    backgroundColor: colors.success,
  },
  lessonDotActive: {
    backgroundColor: colors.primaryLight,
  },
});

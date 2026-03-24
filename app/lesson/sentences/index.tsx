import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, borderRadius, spacing, typography, shadows } from '@/lib/theme';
import { useAppStore } from '@/lib/store';
import { sentenceLevels, getSentencesByLevel } from '@/data/sentences';

export default function SentenceLevelsScreen() {
  const completedLessons = useAppStore((s) => s.completedLessons);

  const getLevelProgress = (level: number) => {
    const levelSentences = getSentencesByLevel(level);
    const completed = levelSentences.filter(
      (s) => completedLessons[`sent_${s.id}`]
    ).length;
    return { completed, total: levelSentences.length };
  };

  const isLevelUnlocked = (level: number) => {
    if (level === 1) return true;
    const prev = getLevelProgress(level - 1);
    return prev.completed >= prev.total;
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 100 }}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>Sentence Building</Text>
      <Text style={styles.subtitle}>문장 만들기</Text>
      <Text style={styles.description}>
        Learn to build full Korean sentences, starting simple and getting harder.
      </Text>

      <View style={styles.levelList}>
        {sentenceLevels.map((lvl) => {
          const progress = getLevelProgress(lvl.level);
          const unlocked = isLevelUnlocked(lvl.level);
          const pct =
            progress.total > 0
              ? Math.round((progress.completed / progress.total) * 100)
              : 0;

          return (
            <TouchableOpacity
              key={lvl.level}
              activeOpacity={unlocked ? 0.8 : 1}
              onPress={() => {
                if (unlocked) {
                  router.push(`/lesson/sentences/${lvl.level}`);
                }
              }}
            >
              <View style={[styles.levelCard, !unlocked && styles.lockedCard]}>
                <LinearGradient
                  colors={
                    unlocked
                      ? lvl.gradient
                      : (['#B0B0B0', '#9E9E9E'] as readonly [string, string])
                  }
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.levelGradient}
                >
                  <View style={styles.levelHeader}>
                    <View style={styles.levelBadge}>
                      <Text style={styles.levelBadgeText}>{lvl.level}</Text>
                    </View>
                    <View style={styles.levelInfo}>
                      <Text
                        style={styles.levelTitle}
                        numberOfLines={1}
                        adjustsFontSizeToFit
                      >
                        {lvl.title}
                      </Text>
                      <Text style={styles.levelKorean}>{lvl.titleKorean}</Text>
                    </View>
                    {!unlocked && (
                      <View style={styles.lockIcon}>
                        <Ionicons
                          name="lock-closed"
                          size={20}
                          color="rgba(255,255,255,0.7)"
                        />
                      </View>
                    )}
                    {unlocked && pct === 100 && (
                      <View style={styles.checkIcon}>
                        <Ionicons
                          name="checkmark-circle"
                          size={24}
                          color="rgba(255,255,255,0.9)"
                        />
                      </View>
                    )}
                  </View>

                  <Text style={styles.levelDesc}>{lvl.description}</Text>

                  <View style={styles.levelFooter}>
                    <Text style={styles.levelStat}>
                      {progress.completed}/{progress.total} sentences
                    </Text>
                    <View style={styles.progressBarBg}>
                      <View
                        style={[styles.progressBarFill, { width: `${pct}%` }]}
                      />
                    </View>
                    <Text style={styles.levelPct}>{pct}%</Text>
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
    padding: spacing.xl,
  },
  title: {
    ...typography.title2,
    color: colors.textPrimary,
  },
  subtitle: {
    ...typography.footnote,
    color: colors.textTertiary,
    marginBottom: spacing.sm,
  },
  description: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
    lineHeight: 22,
  },
  levelList: {
    gap: spacing.lg,
  },
  levelCard: {
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    ...shadows.md,
  },
  lockedCard: {
    opacity: 0.7,
  },
  levelGradient: {
    padding: spacing.lg,
    gap: spacing.sm,
  },
  levelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  levelBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  levelBadgeText: {
    fontFamily: 'Poppins-ExtraBold',
    fontSize: 18,
    color: '#fff',
  },
  levelInfo: {
    flex: 1,
    flexShrink: 1,
  },
  levelTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 18,
    color: '#fff',
  },
  levelKorean: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
  },
  lockIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkIcon: {
    marginLeft: spacing.sm,
  },
  levelDesc: {
    fontFamily: 'Poppins-Regular',
    fontSize: 13,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 2,
  },
  levelFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  levelStat: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
    minWidth: 90,
  },
  progressBarBg: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.25)',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#fff',
  },
  levelPct: {
    fontFamily: 'Poppins-Bold',
    fontSize: 12,
    color: '#fff',
    minWidth: 32,
    textAlign: 'right',
  },
});

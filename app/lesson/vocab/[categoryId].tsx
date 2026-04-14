import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, borderRadius, spacing, typography, shadows } from '@/lib/theme';
import { getWordsByCategory, categoryInfo, VocabCategory } from '@/data/vocabulary';
import { FlashCard } from '@/components/vocab/FlashCard';
import { useAppStore } from '@/lib/store';
import { qualityFromCorrect } from '@/lib/srs';
import { Button } from '@/components/ui/Button';

type Level = 'all' | 'beginner' | 'intermediate' | 'advanced';

const LEVEL_CONFIG: Record<Level, { label: string; color: string }> = {
  all: { label: 'All', color: colors.primaryDark },
  beginner: { label: 'Beginner', color: '#4CAF50' },
  intermediate: { label: 'Intermediate', color: '#FF9800' },
  advanced: { label: 'Advanced', color: '#F44336' },
};

export default function VocabCategoryScreen() {
  const { categoryId, startIndex, level: initialLevel } = useLocalSearchParams<{ categoryId: string; startIndex?: string; level?: string }>();
  const category = categoryId as VocabCategory;
  const allCategoryWords = getWordsByCategory(category);
  const info = categoryInfo[category];

  const [activeLevel, setActiveLevel] = useState<Level>((initialLevel as Level) || 'all');
  const words = useMemo(() => {
    if (activeLevel === 'all') return allCategoryWords;
    return allCategoryWords.filter((w) => w.level === activeLevel);
  }, [activeLevel, allCategoryWords]);

  const levelCounts = useMemo(() => ({
    all: allCategoryWords.length,
    beginner: allCategoryWords.filter((w) => w.level === 'beginner').length,
    intermediate: allCategoryWords.filter((w) => w.level === 'intermediate').length,
    advanced: allCategoryWords.filter((w) => w.level === 'advanced').length,
  }), [allCategoryWords]);

  const initialIdx = startIndex ? Math.min(parseInt(startIndex, 10) || 0, Math.max(words.length - 1, 0)) : 0;
  const [currentIndex, setCurrentIndex] = useState(initialIdx);
  const [completed, setCompleted] = useState(false);
  const [stats, setStats] = useState({ known: 0, learning: 0 });
  const { initSRSCard, updateSRSCard, markWordLearned } = useAppStore();

  const safeIndex = Math.min(currentIndex, Math.max(words.length - 1, 0));
  const currentWord = words[safeIndex];

  const handleLevelChange = (level: Level) => {
    setActiveLevel(level);
    setCurrentIndex(0);
    setCompleted(false);
    setStats({ known: 0, learning: 0 });
  };

  const handleKnow = useCallback(() => {
    if (!currentWord) return;
    initSRSCard(currentWord.id);
    updateSRSCard(currentWord.id, qualityFromCorrect(true));
    markWordLearned(currentWord.id);
    setStats((s) => ({ ...s, known: s.known + 1 }));
    if (safeIndex < words.length - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      setCompleted(true);
    }
  }, [safeIndex, words.length, currentWord]);

  const handleDontKnow = useCallback(() => {
    if (!currentWord) return;
    initSRSCard(currentWord.id);
    updateSRSCard(currentWord.id, qualityFromCorrect(false));
    setStats((s) => ({ ...s, learning: s.learning + 1 }));
    if (safeIndex < words.length - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      setCompleted(true);
    }
  }, [safeIndex, words.length, currentWord]);

  if (!info) return <View style={styles.container}><Text>Category not found</Text></View>;

  if (completed) {
    return (
      <SafeAreaView style={styles.completedContainer}>
        <Ionicons name="trophy" size={80} color={colors.secondary} />
        <Text style={styles.completedTitle}>Deck Complete!</Text>
        <Text style={styles.completedSub}>{info.name} — {info.nameKorean}</Text>
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={[styles.statNum, { color: colors.success }]}>{stats.known}</Text>
            <Text style={styles.statLabel}>Known</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={[styles.statNum, { color: colors.warning }]}>{stats.learning}</Text>
            <Text style={styles.statLabel}>Learning</Text>
          </View>
        </View>
        <Button title="Back to Vocabulary" onPress={() => router.back()} style={{ marginTop: spacing.xxl }} />
      </SafeAreaView>
    );
  }

  if (words.length === 0) {
    return (
      <SafeAreaView style={styles.completedContainer}>
        <Ionicons name="book-outline" size={64} color={colors.textTertiary} />
        <Text style={styles.completedTitle}>No words</Text>
        <Text style={styles.completedSub}>No {activeLevel} words in {info.name}</Text>
        <View style={styles.levelRow}>
          {(['all', 'beginner', 'intermediate', 'advanced'] as Level[]).map((level) => {
            const cfg = LEVEL_CONFIG[level];
            const count = levelCounts[level];
            if (level !== 'all' && count === 0) return null;
            const isActive = activeLevel === level;
            return (
              <TouchableOpacity
                key={level}
                onPress={() => handleLevelChange(level)}
                style={[styles.levelPill, isActive && { backgroundColor: cfg.color, borderColor: cfg.color }]}
              >
                <Text style={[styles.levelPillText, isActive && { color: '#fff' }]}>{cfg.label} ({count})</Text>
              </TouchableOpacity>
            );
          })}
        </View>
        <Button title="Back" onPress={() => router.back()} style={{ marginTop: spacing.lg }} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Level filter */}
      <View style={styles.levelRow}>
        {(['all', 'beginner', 'intermediate', 'advanced'] as Level[]).map((level) => {
          const cfg = LEVEL_CONFIG[level];
          const count = levelCounts[level];
          if (level !== 'all' && count === 0) return null;
          const isActive = activeLevel === level;
          return (
            <TouchableOpacity
              key={level}
              onPress={() => handleLevelChange(level)}
              style={[styles.levelPill, isActive && { backgroundColor: cfg.color, borderColor: cfg.color }]}
            >
              <Text style={[styles.levelPillText, isActive && { color: '#fff' }]}>{cfg.label} ({count})</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.progress}>
        <Text style={styles.progressText}>{safeIndex + 1} / {words.length}</Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${((safeIndex + 1) / words.length) * 100}%` as any }]} />
        </View>
      </View>

      <View style={styles.cardArea}>
        <FlashCard key={currentWord.id} word={currentWord} onKnow={handleKnow} onDontKnow={handleDontKnow} />
        <View style={styles.navRow}>
          <TouchableOpacity
            onPress={() => { if (safeIndex > 0) setCurrentIndex((i) => i - 1); }}
            disabled={safeIndex === 0}
            style={[styles.navBtn, safeIndex === 0 && styles.navBtnDisabled]}
          >
            <Ionicons name="chevron-back" size={24} color={safeIndex === 0 ? colors.textTertiary : colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => { if (safeIndex < words.length - 1) setCurrentIndex((i) => i + 1); }}
            disabled={safeIndex === words.length - 1}
            style={[styles.navBtn, safeIndex === words.length - 1 && styles.navBtnDisabled]}
          >
            <Ionicons name="chevron-forward" size={24} color={safeIndex === words.length - 1 ? colors.textTertiary : colors.primary} />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  levelRow: { flexDirection: 'row', justifyContent: 'center', gap: spacing.xs, paddingHorizontal: spacing.lg, paddingTop: spacing.md, flexWrap: 'wrap' },
  levelPill: { borderRadius: borderRadius.full, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderWidth: 1.5, borderColor: colors.borderLight, backgroundColor: colors.surface },
  levelPillText: { fontSize: 12, fontFamily: 'Jakarta-SemiBold', color: colors.textSecondary },
  progress: { paddingHorizontal: spacing.xl, paddingTop: spacing.sm, gap: spacing.sm },
  progressText: { ...typography.caption, color: colors.textTertiary, textAlign: 'center' },
  progressBar: { height: 6, borderRadius: 3, backgroundColor: colors.primaryPale },
  progressFill: { height: '100%', borderRadius: 3, backgroundColor: colors.primary },
  cardArea: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  navRow: { flexDirection: 'row', gap: spacing.xxl, marginTop: spacing.lg },
  navBtn: { width: 48, height: 48, borderRadius: 24, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', ...shadows.sm },
  navBtnDisabled: { opacity: 0.4 },
  completedContainer: { flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center', padding: spacing.xxl },
  completedTitle: { ...typography.largeTitle, color: colors.textPrimary, marginTop: spacing.lg },
  completedSub: { ...typography.subhead, color: colors.textTertiary },
  statsRow: { flexDirection: 'row', gap: spacing.xxl, marginTop: spacing.xxl },
  statBox: { alignItems: 'center' },
  statNum: { ...typography.largeTitle },
  statLabel: { ...typography.caption, color: colors.textTertiary },
});

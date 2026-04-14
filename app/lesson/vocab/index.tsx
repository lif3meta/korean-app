import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, FlatList } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { colors, borderRadius, spacing, typography, shadows } from '@/lib/theme';
import { vocabulary, allCategories, categoryInfo, getWordsByCategory, VocabCategory, getVocabImageUrl } from '@/data/vocabulary';
import { getVocabImage } from '@/data/vocabImages';
import { CachedImage } from '@/components/common/CachedImage';
import { useAppStore } from '@/lib/store';
import { speakKorean } from '@/lib/audio';

type Level = 'all' | 'beginner' | 'intermediate' | 'advanced';

const LEVEL_CONFIG: Record<Level, { label: string; color: string }> = {
  all: { label: 'All Levels', color: colors.primaryDark },
  beginner: { label: 'Beginner', color: '#4CAF50' },
  intermediate: { label: 'Intermediate', color: '#FF9800' },
  advanced: { label: 'Advanced', color: '#F44336' },
};

function LevelBadge({ level }: { level: string }) {
  const cfg = LEVEL_CONFIG[level as Level] || LEVEL_CONFIG.beginner;
  return (
    <View style={[styles.levelBadge, { backgroundColor: cfg.color + '20' }]}>
      <Text style={[styles.levelBadgeText, { color: cfg.color }]}>{cfg.label}</Text>
    </View>
  );
}

export default function VocabScreen() {
  const [activeCategory, setActiveCategory] = useState<VocabCategory | 'all'>('all');
  const [activeLevel, setActiveLevel] = useState<Level>('all');
  const { learnedWords, markWordLearned, hapticEnabled, showRomanization } = useAppStore();

  const words = useMemo(() => {
    let filtered = activeCategory === 'all' ? vocabulary : getWordsByCategory(activeCategory);
    if (activeLevel !== 'all') {
      filtered = filtered.filter((w) => w.level === activeLevel);
    }
    return filtered;
  }, [activeCategory, activeLevel]);

  const handleSpeak = useCallback((text: string) => {
    if (hapticEnabled) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    speakKorean(text);
  }, [hapticEnabled]);

  // Count words per level for the current category
  const levelCounts = useMemo(() => {
    const base = activeCategory === 'all' ? vocabulary : getWordsByCategory(activeCategory);
    return {
      all: base.length,
      beginner: base.filter((w) => w.level === 'beginner').length,
      intermediate: base.filter((w) => w.level === 'intermediate').length,
      advanced: base.filter((w) => w.level === 'advanced').length,
    };
  }, [activeCategory]);

  const renderWord = useCallback(({ item: word }: { item: typeof words[0] }) => {
    const isLearned = learnedWords.includes(word.id);
    const localImage = getVocabImage(word.id);
    return (
      <TouchableOpacity
        onPress={() => {
          const categoryWords = getWordsByCategory(word.category).filter(
            (w) => activeLevel === 'all' || w.level === activeLevel
          );
          const wordIndex = categoryWords.findIndex((w) => w.id === word.id);
          router.push(`/lesson/vocab/${word.category}?startIndex=${wordIndex >= 0 ? wordIndex : 0}&level=${activeLevel}`);
        }}
        activeOpacity={0.7}
        style={[styles.listItem, isLearned && styles.listItemLearned]}
      >
        <View style={styles.listLeft}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            {localImage ? (
              <Image source={localImage} style={styles.wordThumb} />
            ) : (
              <CachedImage uri={getVocabImageUrl(word)} style={styles.wordThumb} />
            )}
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Text style={styles.listKorean}>{word.korean}</Text>
                <LevelBadge level={word.level} />
              </View>
              <Text style={styles.listEnglish}>{word.english}</Text>
              {showRomanization && <Text style={styles.listRoman}>{word.romanization}</Text>}
            </View>
          </View>
        </View>
        <TouchableOpacity
          onPress={(e) => { e.stopPropagation(); handleSpeak(word.korean); markWordLearned(word.id); }}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          style={styles.playBtn}
        >
          <Ionicons name={isLearned ? 'checkmark-circle' : 'play-circle'} size={32} color={isLearned ? colors.success : colors.accent} />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  }, [learnedWords, activeLevel, showRomanization, handleSpeak, markWordLearned]);

  const listHeader = useMemo(() => (
    <>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Vocabulary</Text>
          <Text style={styles.subtitle}>단어 · {words.length} words</Text>
        </View>
      </View>

      {/* Level filter */}
      <View style={styles.levelRow}>
        {(['all', 'beginner', 'intermediate', 'advanced'] as Level[]).map((level) => {
          const cfg = LEVEL_CONFIG[level];
          const count = levelCounts[level];
          const isActive = activeLevel === level;
          if (level !== 'all' && count === 0) return null;
          return (
            <TouchableOpacity
              key={level}
              onPress={() => setActiveLevel(level)}
              style={[styles.levelPill, isActive && { backgroundColor: cfg.color, borderColor: cfg.color }]}
            >
              <Text style={[styles.levelPillText, isActive && { color: '#fff' }]}>
                {cfg.label} ({count})
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Category filter pills */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catScroll} contentContainerStyle={styles.catScrollContent}>
        <TouchableOpacity
          onPress={() => setActiveCategory('all')}
          style={[styles.catPill, activeCategory === 'all' && styles.catPillActive]}
        >
          <Text style={[styles.catPillText, activeCategory === 'all' && styles.catPillTextActive]}>All</Text>
        </TouchableOpacity>
        {allCategories.map((cat) => {
          const info = categoryInfo[cat];
          return (
            <TouchableOpacity
              key={cat}
              onPress={() => setActiveCategory(cat)}
              style={[styles.catPill, activeCategory === cat && styles.catPillActive]}
            >
              <Text style={[styles.catPillText, activeCategory === cat && styles.catPillTextActive]}>{info.name}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </>
  ), [words.length, activeLevel, activeCategory, levelCounts]);

  const listEmpty = useMemo(() => (
    <View style={styles.emptyState}>
      <Ionicons name="book-outline" size={48} color={colors.textTertiary} />
      <Text style={styles.emptyText}>No words for this filter</Text>
    </View>
  ), []);

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 100 }}
      data={words}
      keyExtractor={(item) => item.id}
      renderItem={renderWord}
      ListHeaderComponent={listHeader}
      ListEmptyComponent={listEmpty}
      initialNumToRender={15}
      maxToRenderPerBatch={10}
      windowSize={5}
      getItemLayout={(_, index) => ({ length: 72, offset: 72 * index, index })}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { padding: spacing.xl, paddingBottom: 0 },
  title: { ...typography.title2, color: colors.textPrimary },
  subtitle: { ...typography.footnote, color: colors.textTertiary },

  // Level filter
  levelRow: { flexDirection: 'row', paddingHorizontal: spacing.xl, gap: spacing.xs, marginTop: spacing.md, flexWrap: 'wrap' },
  levelPill: { borderRadius: borderRadius.full, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderWidth: 1.5, borderColor: colors.borderLight, backgroundColor: colors.surface },
  levelPillText: { fontSize: 12, fontFamily: 'Jakarta-SemiBold', color: colors.textSecondary },

  // Category pills
  catScroll: { marginTop: spacing.sm },
  catScrollContent: { paddingHorizontal: spacing.xl, gap: spacing.xs },
  catPill: { backgroundColor: colors.surface, borderRadius: borderRadius.full, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderWidth: 1, borderColor: colors.borderLight },
  catPillActive: { backgroundColor: colors.primaryDark, borderColor: colors.primaryDark },
  catPillText: { fontSize: 12, fontFamily: 'Jakarta-SemiBold', color: colors.textSecondary },
  catPillTextActive: { color: '#fff' },

  // List view
  listContainer: { paddingHorizontal: spacing.xl, gap: spacing.xs, marginTop: spacing.md },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.md,
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.sm,
  },
  listItemLearned: { borderColor: colors.success, backgroundColor: colors.successBg },
  listLeft: { flex: 1 },
  wordThumb: { width: 44, height: 44, borderRadius: 10 },
  listKorean: { fontSize: 20, fontFamily: 'Jakarta-SemiBold', color: colors.textPrimary },
  listEnglish: { fontSize: 14, fontFamily: 'Jakarta-Regular', color: colors.textSecondary },
  listRoman: { fontSize: 11, fontFamily: 'Jakarta-Regular', color: colors.textTertiary, fontStyle: 'italic' },
  playBtn: { padding: 4 },

  // Level badge
  levelBadge: { paddingHorizontal: 6, paddingVertical: 1, borderRadius: 6 },
  levelBadgeText: { fontSize: 9, fontFamily: 'Jakarta-SemiBold', textTransform: 'uppercase' },

  // Empty state
  emptyState: { alignItems: 'center', paddingVertical: spacing.xxl, gap: spacing.md },
  emptyText: { ...typography.subhead, color: colors.textTertiary },
});

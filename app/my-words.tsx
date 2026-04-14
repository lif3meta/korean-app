import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { colors, spacing, borderRadius, typography, shadows } from '@/lib/theme';
import { useAppStore } from '@/lib/store';
import { AudioButton } from '@/components/common/AudioButton';
import { dictionaryEntries, DictionaryEntry } from '@/data/dictionary';

type SortMode = 'recent' | 'alphabetical';

export default function MyWordsScreen() {
  const insets = useSafeAreaInsets();
  const [sortMode, setSortMode] = useState<SortMode>('recent');
  const savedWords = useAppStore((s) => s.savedWords);
  const removeSavedWord = useAppStore((s) => s.removeSavedWord);

  const savedEntries = useMemo(() => {
    const entries = savedWords
      .map((korean) => dictionaryEntries.find((e) => e.korean === korean))
      .filter(Boolean) as DictionaryEntry[];

    if (sortMode === 'alphabetical') {
      return [...entries].sort((a, b) => a.romanization.localeCompare(b.romanization));
    }
    // 'recent' - reverse so most recently added is first
    return [...entries].reverse();
  }, [savedWords, sortMode]);

  const renderItem = useCallback(({ item }: { item: DictionaryEntry }) => {
    return (
      <View style={styles.wordCard}>
        <View style={styles.wordLeft}>
          <Text style={styles.wordKorean}>{item.korean}</Text>
          <Text style={styles.wordRomanization}>{item.romanization}</Text>
          <Text style={styles.wordEnglish}>{item.english}</Text>
        </View>
        <View style={styles.wordRight}>
          <AudioButton text={item.korean} size="sm" color={colors.primary} />
          <TouchableOpacity
            onPress={() => removeSavedWord(item.korean)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            style={styles.deleteButton}
          >
            <Ionicons name="trash-outline" size={18} color={colors.danger} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }, [removeSavedWord]);

  if (savedWords.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="bookmark-outline" size={64} color={colors.textTertiary} />
        <Text style={styles.emptyTitle}>No words saved yet</Text>
        <Text style={styles.emptySubtitle}>Search the dictionary to add words!</Text>
        <TouchableOpacity
          style={styles.emptyButton}
          onPress={() => router.push('/dictionary')}
          activeOpacity={0.7}
        >
          <Ionicons name="search" size={18} color={colors.textOnPrimary} />
          <Text style={styles.emptyButtonText}>Open Dictionary</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Sort Bar */}
      <View style={styles.sortBar}>
        <Text style={styles.wordCount}>{savedWords.length} word{savedWords.length !== 1 ? 's' : ''} saved</Text>
        <View style={styles.sortButtons}>
          <TouchableOpacity
            style={[styles.sortButton, sortMode === 'recent' && styles.sortButtonActive]}
            onPress={() => setSortMode('recent')}
          >
            <Text style={[styles.sortButtonText, sortMode === 'recent' && styles.sortButtonTextActive]}>Recent</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.sortButton, sortMode === 'alphabetical' && styles.sortButtonActive]}
            onPress={() => setSortMode('alphabetical')}
          >
            <Text style={[styles.sortButtonText, sortMode === 'alphabetical' && styles.sortButtonTextActive]}>A-Z</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Word List */}
      <FlatList
        data={savedEntries}
        keyExtractor={(item) => item.korean}
        renderItem={renderItem}
        contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom + 80 }]}
        showsVerticalScrollIndicator={false}
      />

      {/* Practice Button */}
      <View style={[styles.practiceContainer, { paddingBottom: insets.bottom + spacing.lg }]}>
        <TouchableOpacity
          style={styles.practiceButton}
          onPress={() => router.push('/practice-words')}
          activeOpacity={0.7}
        >
          <Ionicons name="flash" size={20} color={colors.textOnPrimary} />
          <Text style={styles.practiceButtonText}>Practice These</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  sortBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
  },
  wordCount: {
    ...typography.caption,
    color: colors.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  sortButtons: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  sortButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sortButtonActive: {
    backgroundColor: colors.primaryDark,
    borderColor: colors.primaryDark,
  },
  sortButtonText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  sortButtonTextActive: {
    color: colors.textOnPrimary,
  },
  listContent: {
    paddingHorizontal: spacing.xl,
    gap: spacing.sm,
  },
  wordCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    ...shadows.sm,
  },
  wordLeft: {
    flex: 1,
    marginRight: spacing.md,
  },
  wordKorean: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    color: colors.textPrimary,
    lineHeight: 28,
  },
  wordRomanization: {
    ...typography.footnote,
    color: colors.textTertiary,
    fontStyle: 'italic',
    marginTop: 1,
  },
  wordEnglish: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: 2,
  },
  wordRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  deleteButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.dangerBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  practiceContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  practiceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primaryDark,
    borderRadius: borderRadius.xl,
    paddingVertical: spacing.lg,
    gap: spacing.sm,
    ...shadows.md,
  },
  practiceButtonText: {
    ...typography.bodyBold,
    color: colors.textOnPrimary,
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    gap: spacing.md,
  },
  emptyTitle: {
    ...typography.title3,
    color: colors.textPrimary,
    marginTop: spacing.md,
  },
  emptySubtitle: {
    ...typography.body,
    color: colors.textTertiary,
    textAlign: 'center',
  },
  emptyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryDark,
    borderRadius: borderRadius.xl,
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.md,
    gap: spacing.sm,
    marginTop: spacing.lg,
    ...shadows.md,
  },
  emptyButtonText: {
    ...typography.bodyBold,
    color: colors.textOnPrimary,
  },
});

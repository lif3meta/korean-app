import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, FlatList } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, borderRadius, spacing, typography, shadows } from '@/lib/theme';
import { getWordsByCategory, categoryInfo, VocabCategory, VocabWord } from '@/data/vocabulary';
import { FlashCard } from '@/components/vocab/FlashCard';
import { AudioButton } from '@/components/common/AudioButton';
import { useAppStore } from '@/lib/store';
import { qualityFromCorrect } from '@/lib/srs';
import { Button } from '@/components/ui/Button';

type ViewMode = 'cards' | 'list';

function WordRow({ word }: { word: VocabWord }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => {
        if (word.example) setExpanded((prev) => !prev);
      }}
      style={styles.wordRow}
    >
      <View style={styles.wordRowTop}>
        <AudioButton text={word.korean} size="sm" />
        <View style={styles.wordRowText}>
          <View style={styles.wordRowHeader}>
            <Text style={styles.wordKorean}>{word.korean}</Text>
            <View style={styles.posBadge}>
              <Text style={styles.posBadgeText}>{word.partOfSpeech}</Text>
            </View>
          </View>
          <Text style={styles.wordRomanization}>{word.romanization}</Text>
          <Text style={styles.wordEnglish}>{word.english}</Text>
        </View>
        {word.example && (
          <Ionicons
            name={expanded ? 'chevron-up' : 'chevron-down'}
            size={18}
            color={colors.textTertiary}
            style={styles.expandIcon}
          />
        )}
      </View>

      {expanded && word.example && (
        <View style={styles.exampleBox}>
          <Text style={styles.exampleKorean}>{word.example.korean}</Text>
          <Text style={styles.exampleRomanization}>{word.example.romanization}</Text>
          <Text style={styles.exampleEnglish}>{word.example.english}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

export default function VocabCategoryScreen() {
  const { categoryId } = useLocalSearchParams<{ categoryId: string }>();
  const category = categoryId as VocabCategory;
  const words = getWordsByCategory(category);
  const info = categoryInfo[category];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [stats, setStats] = useState({ known: 0, learning: 0 });
  const [viewMode, setViewMode] = useState<ViewMode>('cards');
  const { initSRSCard, updateSRSCard, markWordLearned } = useAppStore();

  const currentWord = words[currentIndex];

  const handleKnow = useCallback(() => {
    initSRSCard(currentWord.id);
    updateSRSCard(currentWord.id, qualityFromCorrect(true));
    markWordLearned(currentWord.id);
    setStats((s) => ({ ...s, known: s.known + 1 }));
    advance();
  }, [currentIndex]);

  const handleDontKnow = useCallback(() => {
    initSRSCard(currentWord.id);
    updateSRSCard(currentWord.id, qualityFromCorrect(false));
    setStats((s) => ({ ...s, learning: s.learning + 1 }));
    advance();
  }, [currentIndex]);

  const advance = () => {
    if (currentIndex < words.length - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      setCompleted(true);
    }
  };

  const renderWordRow = useCallback(({ item }: { item: VocabWord }) => {
    return <WordRow word={item} />;
  }, []);

  const keyExtractor = useCallback((item: VocabWord) => item.id, []);

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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.progress}>
        <Text style={styles.progressText}>{currentIndex + 1} / {words.length}</Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${((currentIndex + 1) / words.length) * 100}%` as any }]} />
        </View>
      </View>

      <View style={styles.toggleContainer}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setViewMode('cards')}
          style={[styles.toggleButton, viewMode === 'cards' && styles.toggleButtonActive]}
        >
          <Ionicons
            name="albums"
            size={16}
            color={viewMode === 'cards' ? colors.textOnPrimary : colors.textSecondary}
          />
          <Text style={[styles.toggleText, viewMode === 'cards' && styles.toggleTextActive]}>Cards</Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setViewMode('list')}
          style={[styles.toggleButton, viewMode === 'list' && styles.toggleButtonActive]}
        >
          <Ionicons
            name="list"
            size={16}
            color={viewMode === 'list' ? colors.textOnPrimary : colors.textSecondary}
          />
          <Text style={[styles.toggleText, viewMode === 'list' && styles.toggleTextActive]}>List</Text>
        </TouchableOpacity>
      </View>

      {viewMode === 'cards' ? (
        <View style={styles.cardArea}>
          <FlashCard key={currentWord.id} word={currentWord} onKnow={handleKnow} onDontKnow={handleDontKnow} />
        </View>
      ) : (
        <FlatList
          data={words}
          renderItem={renderWordRow}
          keyExtractor={keyExtractor}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  progress: { padding: spacing.xl, gap: spacing.sm },
  progressText: { ...typography.caption, color: colors.textTertiary, textAlign: 'center' },
  progressBar: { height: 6, borderRadius: 3, backgroundColor: colors.primaryPale },
  progressFill: { height: '100%', borderRadius: 3, backgroundColor: colors.primary },
  cardArea: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  completedContainer: { flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center', padding: spacing.xxl },
  completedEmoji: { fontSize: 80 },
  completedTitle: { ...typography.largeTitle, color: colors.textPrimary, marginTop: spacing.lg },
  completedSub: { ...typography.subhead, color: colors.textTertiary },
  statsRow: { flexDirection: 'row', gap: spacing.xxl, marginTop: spacing.xxl },
  statBox: { alignItems: 'center' },
  statNum: { ...typography.largeTitle },
  statLabel: { ...typography.caption, color: colors.textTertiary },

  // Toggle
  toggleContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
    backgroundColor: colors.primaryPale,
    borderRadius: borderRadius.full,
    padding: 3,
    marginBottom: spacing.md,
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.full,
  },
  toggleButtonActive: {
    backgroundColor: colors.primaryDark,
  },
  toggleText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 13,
    color: colors.textSecondary,
  },
  toggleTextActive: {
    color: colors.textOnPrimary,
  },

  // List
  listContent: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxl,
    gap: spacing.md,
  },
  wordRow: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  wordRowTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  wordRowText: {
    flex: 1,
  },
  wordRowHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  wordKorean: {
    fontSize: 22,
    fontFamily: 'Poppins-Bold',
    color: colors.textPrimary,
  },
  wordRomanization: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    fontStyle: 'italic',
    color: colors.textTertiary,
    marginTop: 1,
  },
  wordEnglish: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: colors.textSecondary,
    marginTop: 2,
  },
  posBadge: {
    backgroundColor: colors.primaryPale,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
  },
  posBadgeText: {
    fontSize: 10,
    fontFamily: 'Poppins-Medium',
    color: colors.primaryDark,
    textTransform: 'uppercase',
  },
  expandIcon: {
    marginLeft: spacing.xs,
  },

  // Example box
  exampleBox: {
    marginTop: spacing.md,
    backgroundColor: colors.primaryFaint,
    borderRadius: borderRadius.sm,
    padding: spacing.md,
  },
  exampleKorean: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: colors.textPrimary,
  },
  exampleRomanization: {
    fontSize: 11,
    fontFamily: 'Poppins-Regular',
    fontStyle: 'italic',
    color: colors.textTertiary,
    marginTop: 1,
  },
  exampleEnglish: {
    fontSize: 13,
    fontFamily: 'Poppins-Regular',
    color: colors.textSecondary,
    marginTop: 2,
  },
});

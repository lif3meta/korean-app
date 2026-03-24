import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '@/lib/theme';
import { useAppStore } from '@/lib/store';
import { getWordById } from '@/data/vocabulary';
import { FlashCard } from '@/components/vocab/FlashCard';
import { qualityFromCorrect } from '@/lib/srs';
import { Button } from '@/components/ui/Button';

export default function ReviewScreen() {
  const { getDueCards, updateSRSCard } = useAppStore();
  const dueCards = useMemo(() => getDueCards(), []);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [stats, setStats] = useState({ correct: 0, incorrect: 0 });

  if (dueCards.length === 0) {
    return (
      <SafeAreaView style={styles.emptyContainer}>
        <Ionicons name="checkmark-circle" size={60} color={colors.success} />
        <Text style={styles.emptyTitle}>All caught up!</Text>
        <Text style={styles.emptyText}>No cards due for review. Keep learning new words!</Text>
        <Button title="Go Back" onPress={() => router.back()} style={{ marginTop: spacing.xxl }} />
      </SafeAreaView>
    );
  }

  const currentCard = dueCards[currentIndex];
  const currentWord = getWordById(currentCard?.wordId);

  const advance = () => {
    if (currentIndex < dueCards.length - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      setCompleted(true);
    }
  };

  const handleKnow = () => {
    updateSRSCard(currentCard.wordId, qualityFromCorrect(true));
    setStats((s) => ({ ...s, correct: s.correct + 1 }));
    advance();
  };

  const handleDontKnow = () => {
    updateSRSCard(currentCard.wordId, qualityFromCorrect(false));
    setStats((s) => ({ ...s, incorrect: s.incorrect + 1 }));
    advance();
  };

  if (completed) {
    return (
      <SafeAreaView style={styles.completedContainer}>
        <Ionicons name="ribbon" size={80} color={colors.primary} />
        <Text style={styles.completedTitle}>Review Complete!</Text>
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={[styles.statNum, { color: colors.success }]}>{stats.correct}</Text>
            <Text style={styles.statLabel}>Correct</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={[styles.statNum, { color: colors.danger }]}>{stats.incorrect}</Text>
            <Text style={styles.statLabel}>Review Again</Text>
          </View>
        </View>
        <Text style={styles.completedSub}>
          {stats.incorrect > 0 ? "Cards you missed will appear again sooner." : "Perfect review! Cards will appear later."}
        </Text>
        <Button title="Done" onPress={() => router.back()} style={{ marginTop: spacing.xxl }} />
      </SafeAreaView>
    );
  }

  if (!currentWord) {
    advance();
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.progress}>
        <Text style={styles.progressText}>Review {currentIndex + 1} / {dueCards.length}</Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${((currentIndex + 1) / dueCards.length) * 100}%` as any }]} />
        </View>
      </View>
      <View style={styles.cardArea}>
        <FlashCard key={currentCard.wordId} word={currentWord} onKnow={handleKnow} onDontKnow={handleDontKnow} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  emptyContainer: { flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center', padding: spacing.xxl },
  emptyTitle: { ...typography.title, color: colors.textPrimary, marginTop: spacing.lg },
  emptyText: { ...typography.body, color: colors.textTertiary, textAlign: 'center' },
  progress: { padding: spacing.xl, gap: spacing.sm },
  progressText: { ...typography.caption, color: colors.textTertiary, textAlign: 'center' },
  progressBar: { height: 6, borderRadius: 3, backgroundColor: colors.primaryPale },
  progressFill: { height: '100%', borderRadius: 3, backgroundColor: colors.accent },
  cardArea: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  completedContainer: { flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center', padding: spacing.xxl },
  completedTitle: { ...typography.largeTitle, color: colors.textPrimary, marginTop: spacing.lg },
  completedSub: { ...typography.body, color: colors.textTertiary, textAlign: 'center', marginTop: spacing.md },
  statsRow: { flexDirection: 'row', gap: spacing.xxl, marginTop: spacing.xxl },
  statBox: { alignItems: 'center' },
  statNum: { ...typography.largeTitle },
  statLabel: { ...typography.caption, color: colors.textTertiary },
});

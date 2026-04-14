import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, borderRadius } from '@/lib/theme';
import { useAppStore } from '@/lib/store';
import { getWordById } from '@/data/vocabulary';
import { FlashCard } from '@/components/vocab/FlashCard';
import { qualityFromCorrect, SRSCard } from '@/lib/srs';
import { Button } from '@/components/ui/Button';
import { getSRSContentById } from '@/data/srsContent';
import { AudioButton } from '@/components/common/AudioButton';

export default function ReviewScreen() {
  const { getDueCards, updateSRSCard, learnedWords, initSRSCard, srsCards } = useAppStore();

  // Auto-initialize SRS cards for learned words that don't have cards yet
  useEffect(() => {
    learnedWords.forEach((wordId) => {
      if (!srsCards[wordId]) {
        initSRSCard(wordId);
      }
    });
  }, [learnedWords.length]);

  // Filter to only cards with valid content
  const dueCards = useMemo(() => {
    return getDueCards().filter((card) => {
      const type = card.cardType || 'vocab';
      if (type === 'vocab') return !!getWordById(card.wordId);
      return !!getSRSContentById(card.wordId);
    });
  }, [srsCards]);

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
  const cardType = currentCard?.cardType || 'vocab';
  const currentWord = cardType === 'vocab' ? getWordById(currentCard?.wordId) : null;
  const currentSRSContent = cardType !== 'vocab' ? getSRSContentById(currentCard?.wordId) : null;

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

  // For vocab cards, use existing FlashCard
  if (cardType === 'vocab' && currentWord) {
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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.progress}>
        <Text style={styles.progressText}>Review {currentIndex + 1} / {dueCards.length}</Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${((currentIndex + 1) / dueCards.length) * 100}%` as any }]} />
        </View>
      </View>
      <View style={styles.cardArea}>
        <ExtendedSRSCard
          key={currentCard.wordId}
          content={currentSRSContent}
          onKnow={handleKnow}
          onDontKnow={handleDontKnow}
        />
      </View>
    </SafeAreaView>
  );
}

// Extended card component for grammar/sentence/listening
function ExtendedSRSCard({
  content,
  onKnow,
  onDontKnow,
}: {
  content: { type: string; front: { text: string; subtext?: string; audio?: boolean }; back: { text: string; detail?: string; romanization?: string } };
  onKnow: () => void;
  onDontKnow: () => void;
}) {
  const [flipped, setFlipped] = useState(false);

  const typeLabel = content.type === 'grammar' ? 'Grammar' : content.type === 'sentence' ? 'Sentence' : 'Listening';
  const typeColor = content.type === 'grammar' ? '#8b5cf6' : content.type === 'sentence' ? '#06b6d4' : '#f59e0b';

  return (
    <View style={extStyles.cardWrapper}>
      <View style={[extStyles.typeBadge, { backgroundColor: typeColor + '18' }]}>
        <Text style={[extStyles.typeBadgeText, { color: typeColor }]}>{typeLabel}</Text>
      </View>

      <TouchableOpacity
        onPress={() => setFlipped(!flipped)}
        style={extStyles.card}
        activeOpacity={0.9}
      >
        {!flipped ? (
          <View style={extStyles.cardContent}>
            <Text style={extStyles.frontText}>{content.front.text}</Text>
            {content.front.subtext && (
              content.front.audio ? (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <AudioButton text={content.front.subtext} size="md" color={typeColor} />
                  <Text style={extStyles.subtext}>{content.front.subtext}</Text>
                </View>
              ) : (
                <Text style={extStyles.subtext}>{content.front.subtext}</Text>
              )
            )}
            <Text style={extStyles.tapHint}>Tap to reveal answer</Text>
          </View>
        ) : (
          <View style={extStyles.cardContent}>
            <Text style={extStyles.backText}>{content.back.text}</Text>
            {content.back.romanization && (
              <Text style={extStyles.romanization}>{content.back.romanization}</Text>
            )}
            {content.back.detail && (
              <Text style={extStyles.detail}>{content.back.detail}</Text>
            )}
          </View>
        )}
      </TouchableOpacity>

      {flipped && (
        <View style={extStyles.buttonRow}>
          <TouchableOpacity onPress={onDontKnow} style={[extStyles.actionBtn, { backgroundColor: colors.dangerLight }]}>
            <Text style={[extStyles.actionBtnText, { color: colors.danger }]}>Don't Know</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onKnow} style={[extStyles.actionBtn, { backgroundColor: colors.successLight }]}>
            <Text style={[extStyles.actionBtnText, { color: colors.success }]}>Know</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const extStyles = StyleSheet.create({
  cardWrapper: {
    width: '90%',
    alignItems: 'center',
    gap: spacing.md,
  },
  typeBadge: {
    paddingVertical: 4,
    paddingHorizontal: 14,
    borderRadius: borderRadius.full,
  },
  typeBadgeText: {
    fontSize: 12,
    fontFamily: 'Jakarta-Bold',
  },
  card: {
    width: '100%',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xxl,
    padding: spacing.xxxl,
    minHeight: 220,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardContent: {
    alignItems: 'center',
    gap: spacing.md,
  },
  frontText: {
    fontSize: 20,
    fontFamily: 'Jakarta-Bold',
    color: colors.textPrimary,
    textAlign: 'center',
  },
  subtext: {
    fontSize: 16,
    fontFamily: 'Jakarta-Regular',
    color: colors.textTertiary,
    textAlign: 'center',
  },
  tapHint: {
    fontSize: 12,
    fontFamily: 'Jakarta-Regular',
    color: colors.textTertiary,
    marginTop: spacing.sm,
  },
  backText: {
    fontSize: 28,
    fontFamily: 'Jakarta-ExtraBold',
    color: colors.accent,
    textAlign: 'center',
  },
  romanization: {
    fontSize: 14,
    fontFamily: 'Jakarta-Regular',
    color: colors.textTertiary,
  },
  detail: {
    fontSize: 14,
    fontFamily: 'Jakarta-Regular',
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: spacing.md,
    width: '100%',
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: borderRadius.xl,
    alignItems: 'center',
  },
  actionBtnText: {
    fontSize: 16,
    fontFamily: 'Jakarta-Bold',
  },
});

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

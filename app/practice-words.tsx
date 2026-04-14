import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { colors, spacing, borderRadius, typography, shadows } from '@/lib/theme';
import { useAppStore } from '@/lib/store';
import { dictionaryEntries, DictionaryEntry } from '@/data/dictionary';
import { AudioButton } from '@/components/common/AudioButton';
import { Button } from '@/components/ui/Button';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 48;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function PracticeWordsScreen() {
  const savedWords = useAppStore((s) => s.savedWords);
  const hapticEnabled = useAppStore((s) => s.hapticEnabled);
  const addXP = useAppStore((s) => s.addXP);

  const words = useMemo(() => {
    const entries = savedWords
      .map((korean) => dictionaryEntries.find((e) => e.korean === korean))
      .filter(Boolean) as DictionaryEntry[];
    return shuffle(entries);
  }, [savedWords]);

  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [stats, setStats] = useState({ correct: 0, incorrect: 0 });
  const [done, setDone] = useState(false);

  const current = words[index];

  const handleFlip = useCallback(() => {
    if (hapticEnabled) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setFlipped((f) => !f);
  }, [hapticEnabled]);

  const advance = useCallback((correct: boolean) => {
    if (hapticEnabled) Haptics.impactAsync(correct ? Haptics.ImpactFeedbackStyle.Medium : Haptics.ImpactFeedbackStyle.Light);
    setStats((s) => ({
      correct: s.correct + (correct ? 1 : 0),
      incorrect: s.incorrect + (correct ? 0 : 1),
    }));
    if (index < words.length - 1) {
      setIndex((i) => i + 1);
      setFlipped(false);
    } else {
      if (correct) addXP(5);
      setDone(true);
    }
  }, [hapticEnabled, index, words.length, addXP]);

  if (words.length === 0) {
    return (
      <SafeAreaView style={styles.emptyContainer}>
        <Ionicons name="bookmark-outline" size={60} color={colors.textTertiary} />
        <Text style={styles.emptyTitle}>No words to practice</Text>
        <Text style={styles.emptyText}>Save some words from the dictionary first!</Text>
        <Button title="Go Back" onPress={() => router.back()} style={{ marginTop: spacing.xxl }} />
      </SafeAreaView>
    );
  }

  if (done) {
    const total = stats.correct + stats.incorrect;
    const pct = Math.round((stats.correct / total) * 100);
    addXP(stats.correct * 5);
    return (
      <SafeAreaView style={styles.doneContainer}>
        <Ionicons name="ribbon" size={80} color={colors.primary} />
        <Text style={styles.doneTitle}>Practice Complete!</Text>
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={[styles.statNum, { color: colors.success }]}>{stats.correct}</Text>
            <Text style={styles.statLabel}>Knew it</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={[styles.statNum, { color: colors.danger }]}>{stats.incorrect}</Text>
            <Text style={styles.statLabel}>Still learning</Text>
          </View>
        </View>
        <Text style={styles.doneSub}>{pct}% correct - {pct >= 80 ? 'Great job!' : 'Keep practicing!'}</Text>
        <Button title="Done" onPress={() => router.back()} style={{ marginTop: spacing.xxl }} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Progress */}
      <View style={styles.progress}>
        <Text style={styles.progressText}>{index + 1} / {words.length}</Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${((index + 1) / words.length) * 100}%` as any }]} />
        </View>
      </View>

      {/* Card */}
      <View style={styles.cardArea}>
        <TouchableOpacity onPress={handleFlip} activeOpacity={0.9} style={styles.cardWrapper}>
          {!flipped ? (
            <View style={[styles.card, styles.front]}>
              <Text style={styles.tapHint}>Tap to reveal</Text>
              <Text style={styles.koreanText}>{current.korean}</Text>
              <Text style={styles.romanText}>{current.romanization}</Text>
              <AudioButton text={current.korean} size="lg" style={styles.audioBtn} />
              <View style={styles.posBadge}>
                <Text style={styles.posText}>{current.partOfSpeech}</Text>
              </View>
            </View>
          ) : (
            <View style={[styles.card, styles.back]}>
              <Text style={styles.tapHint}>Tap to flip back</Text>
              <Text style={styles.englishText}>{current.english}</Text>
              <Text style={styles.koreanSmall}>{current.korean}</Text>
              {current.example && (
                <View style={styles.exampleBox}>
                  <Text style={styles.exampleKorean}>{current.example.korean}</Text>
                  <Text style={styles.exampleEnglish}>{current.example.english}</Text>
                </View>
              )}
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Know / Don't Know buttons */}
      {flipped && (
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.actionBtn, styles.dontKnowBtn]}
            onPress={() => advance(false)}
            activeOpacity={0.7}
          >
            <Ionicons name="close" size={24} color={colors.danger} />
            <Text style={[styles.actionText, { color: colors.danger }]}>Still Learning</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionBtn, styles.knowBtn]}
            onPress={() => advance(true)}
            activeOpacity={0.7}
          >
            <Ionicons name="checkmark" size={24} color={colors.success} />
            <Text style={[styles.actionText, { color: colors.success }]}>Got It!</Text>
          </TouchableOpacity>
        </View>
      )}

      {!flipped && (
        <View style={styles.actions}>
          <Text style={styles.flipHint}>Tap the card to see the answer</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  emptyContainer: { flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center', padding: spacing.xxl },
  emptyTitle: { ...typography.title3, color: colors.textPrimary, marginTop: spacing.lg },
  emptyText: { ...typography.body, color: colors.textTertiary, textAlign: 'center' },
  doneContainer: { flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center', padding: spacing.xxl },
  doneTitle: { ...typography.largeTitle, color: colors.textPrimary, marginTop: spacing.lg },
  doneSub: { ...typography.body, color: colors.textTertiary, textAlign: 'center', marginTop: spacing.md },
  statsRow: { flexDirection: 'row', gap: spacing.xxl, marginTop: spacing.xxl },
  statBox: { alignItems: 'center' },
  statNum: { ...typography.largeTitle },
  statLabel: { ...typography.caption, color: colors.textTertiary },
  progress: { padding: spacing.xl, gap: spacing.sm },
  progressText: { ...typography.caption, color: colors.textTertiary, textAlign: 'center' },
  progressBar: { height: 6, borderRadius: 3, backgroundColor: colors.primaryPale },
  progressFill: { height: '100%', borderRadius: 3, backgroundColor: colors.accent },
  cardArea: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: spacing.xl },
  cardWrapper: { width: CARD_WIDTH },
  card: {
    width: '100%',
    minHeight: 320,
    borderRadius: borderRadius.xxl,
    padding: spacing.xxl,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.lg,
  },
  front: { backgroundColor: colors.surface },
  back: { backgroundColor: colors.primaryPale },
  tapHint: { ...typography.caption, color: colors.textTertiary, position: 'absolute', top: spacing.lg },
  koreanText: { fontSize: 48, fontFamily: 'Poppins-Bold', color: colors.textPrimary, marginTop: spacing.lg },
  romanText: { ...typography.headline, color: colors.textTertiary, fontStyle: 'italic', marginTop: spacing.xs },
  audioBtn: { marginTop: spacing.lg },
  posBadge: { backgroundColor: colors.primaryPale, paddingHorizontal: spacing.md, paddingVertical: 4, borderRadius: borderRadius.full, marginTop: spacing.lg },
  posText: { ...typography.caption, color: colors.primaryDark },
  englishText: { fontSize: 32, fontFamily: 'Poppins-Bold', color: colors.primaryDark, textAlign: 'center' },
  koreanSmall: { ...typography.headline, color: colors.textSecondary, marginTop: spacing.sm },
  exampleBox: { marginTop: spacing.lg, backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.lg, width: '100%' },
  exampleKorean: { ...typography.subhead, color: colors.textPrimary },
  exampleEnglish: { ...typography.footnote, color: colors.textSecondary, marginTop: 4 },
  actions: { paddingHorizontal: spacing.xl, paddingBottom: spacing.xxl, flexDirection: 'row', justifyContent: 'center', gap: spacing.lg },
  actionBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: spacing.lg, borderRadius: borderRadius.xl, gap: spacing.sm },
  dontKnowBtn: { backgroundColor: colors.dangerBg, borderWidth: 2, borderColor: colors.danger + '30' },
  knowBtn: { backgroundColor: colors.successBg, borderWidth: 2, borderColor: colors.success + '30' },
  actionText: { fontFamily: 'Poppins-SemiBold', fontSize: 16 },
  flipHint: { ...typography.footnote, color: colors.textTertiary },
});

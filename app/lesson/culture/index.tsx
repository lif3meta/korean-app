import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { colors, borderRadius, spacing, typography, shadows } from '@/lib/theme';
import { cultureLessons } from '@/data/culture';
import { useAppStore } from '@/lib/store';
import { speakKorean } from '@/lib/audio';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH - 48;

type ViewMode = 'list' | 'cards';

export default function CultureListScreen() {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [cardIndex, setCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const { completedLessons, hapticEnabled, markLessonComplete } = useAppStore();

  const lesson = cultureLessons[cardIndex];
  const firstSection = lesson?.sections[0];
  const firstExample = firstSection?.examples?.[0];

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 32 }}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Culture & Honorifics</Text>
          <Text style={styles.subtitle}>문화와 존댓말</Text>
        </View>
        <View style={styles.modeToggle}>
          <TouchableOpacity
            onPress={() => setViewMode('list')}
            style={[styles.modeBtn, viewMode === 'list' && styles.modeBtnActive]}
          >
            <Ionicons name="list" size={16} color={viewMode === 'list' ? '#fff' : colors.textTertiary} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => { setViewMode('cards'); setCardIndex(0); setIsFlipped(false); }}
            style={[styles.modeBtn, viewMode === 'cards' && styles.modeBtnActive]}
          >
            <Ionicons name="albums" size={16} color={viewMode === 'cards' ? '#fff' : colors.textTertiary} />
          </TouchableOpacity>
        </View>
      </View>

      {viewMode === 'list' ? (
        <View style={styles.listContainer}>
          {cultureLessons.map((l, i) => {
            const isCompleted = completedLessons[l.id];
            const example = l.sections[0]?.examples?.[0];
            return (
              <TouchableOpacity key={l.id} onPress={() => router.push(`/lesson/culture/${l.id}`)} activeOpacity={0.7} style={styles.card}>
                <View style={[styles.numberCircle, isCompleted && styles.completedCircle]}>
                  {isCompleted ? (
                    <Ionicons name="checkmark" size={18} color="#fff" />
                  ) : (
                    <Text style={styles.numberText}>{i + 1}</Text>
                  )}
                </View>
                <View style={styles.cardContent}>
                  <Text style={styles.lessonTitle}>{l.title}</Text>
                  <Text style={styles.lessonKorean}>{l.titleKorean}</Text>
                  <Text style={styles.lessonDesc} numberOfLines={2}>{l.description}</Text>
                </View>
                <TouchableOpacity
                  onPress={(e) => {
                    e.stopPropagation();
                    if (hapticEnabled) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    if (example) speakKorean(example.korean);
                    markLessonComplete(l.id, 100);
                  }}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  style={styles.playBtn}
                >
                  <Ionicons name={isCompleted ? 'checkmark-circle' : 'play-circle'} size={32} color={isCompleted ? colors.success : colors.accent} />
                </TouchableOpacity>
              </TouchableOpacity>
            );
          })}
        </View>
      ) : (
        lesson && (
          <View style={styles.cardsContainer}>
            <Text style={styles.cardCounter}>{cardIndex + 1} / {cultureLessons.length}</Text>
            <TouchableOpacity onPress={() => setIsFlipped(!isFlipped)} activeOpacity={0.9} style={styles.cardWrapper}>
              {!isFlipped ? (
                <View style={[styles.flipCard, styles.cardFront]}>
                  <Text style={styles.cardHint}>Tap to flip</Text>
                  <Ionicons name="globe" size={40} color="#f59e0b" />
                  <Text style={styles.cardTitle}>{lesson.title}</Text>
                  <Text style={styles.cardTitleKorean}>{lesson.titleKorean}</Text>
                  <Text style={styles.cardDesc} numberOfLines={2}>{lesson.description}</Text>
                </View>
              ) : (
                <View style={[styles.flipCard, styles.cardBack]}>
                  <Text style={styles.cardHint}>Tap to flip back</Text>
                  <Text style={styles.cardSectionHead}>{firstSection?.heading}</Text>
                  <Text style={styles.cardExplanation} numberOfLines={5}>{firstSection?.explanation}</Text>
                  {firstExample && (
                    <View style={styles.cardExample}>
                      <TouchableOpacity
                        onPress={() => {
                          if (hapticEnabled) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                          speakKorean(firstExample.korean);
                        }}
                        style={styles.speakRow}
                      >
                        <Ionicons name="volume-high" size={16} color="#f59e0b" />
                        <Text style={styles.cardExKorean}>{firstExample.korean}</Text>
                      </TouchableOpacity>
                      <Text style={styles.cardExEnglish}>{firstExample.english}</Text>
                    </View>
                  )}
                </View>
              )}
            </TouchableOpacity>

            {completedLessons[lesson.id] && (
              <View style={styles.completedBadge}>
                <Ionicons name="checkmark-circle" size={16} color={colors.success} />
                <Text style={styles.completedText}>Completed</Text>
              </View>
            )}

            <View style={styles.cardNav}>
              <TouchableOpacity
                onPress={() => { setCardIndex((i) => i - 1); setIsFlipped(false); }}
                disabled={cardIndex === 0}
                style={[styles.cardNavBtn, cardIndex === 0 && styles.cardNavBtnDisabled]}
              >
                <Ionicons name="chevron-back" size={24} color={cardIndex === 0 ? colors.textTertiary : colors.primary} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => { setCardIndex((i) => i + 1); setIsFlipped(false); }}
                disabled={cardIndex === cultureLessons.length - 1}
                style={[styles.cardNavBtn, cardIndex === cultureLessons.length - 1 && styles.cardNavBtnDisabled]}
              >
                <Ionicons name="chevron-forward" size={24} color={cardIndex === cultureLessons.length - 1 ? colors.textTertiary : colors.primary} />
              </TouchableOpacity>
            </View>
          </View>
        )
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: spacing.xl, paddingBottom: spacing.md },
  title: { ...typography.title2, color: colors.textPrimary },
  subtitle: { ...typography.footnote, color: colors.textTertiary },
  modeToggle: { flexDirection: 'row', backgroundColor: colors.surfaceLow, borderRadius: borderRadius.full, padding: 2 },
  modeBtn: { paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: borderRadius.full },
  modeBtnActive: { backgroundColor: colors.primaryDark },

  listContainer: { paddingHorizontal: spacing.xl, gap: spacing.xs },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    gap: spacing.md,
    ...shadows.sm,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  numberCircle: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.primaryPale, alignItems: 'center', justifyContent: 'center' },
  completedCircle: { backgroundColor: colors.success },
  numberText: { ...typography.bodyBold, color: colors.primaryDark },
  cardContent: { flex: 1, gap: 2 },
  lessonTitle: { ...typography.bodyBold, color: colors.textPrimary },
  lessonKorean: { ...typography.caption, color: colors.textTertiary },
  lessonDesc: { ...typography.footnote, color: colors.textSecondary, marginTop: 2 },
  playBtn: { padding: 4 },

  cardsContainer: { alignItems: 'center', paddingHorizontal: spacing.lg, gap: spacing.md },
  cardCounter: { ...typography.caption, color: colors.textTertiary },
  cardWrapper: { width: CARD_WIDTH, height: 360 },
  flipCard: { width: '100%', height: '100%', borderRadius: borderRadius.xxl, padding: spacing.xxl, alignItems: 'center', justifyContent: 'center', ...shadows.lg },
  cardFront: { backgroundColor: colors.surface, borderWidth: 2, borderColor: colors.warningLight },
  cardBack: { backgroundColor: colors.warmCream, borderWidth: 2, borderColor: '#f59e0b' },
  cardHint: { ...typography.caption, color: colors.textTertiary, position: 'absolute', top: spacing.lg, left: spacing.lg },
  cardTitle: { ...typography.title2, color: colors.textPrimary, textAlign: 'center', marginTop: spacing.md },
  cardTitleKorean: { ...typography.subhead, color: colors.textSecondary, marginTop: spacing.xs },
  cardDesc: { ...typography.body, color: colors.textTertiary, textAlign: 'center', marginTop: spacing.sm },
  cardSectionHead: { ...typography.title3, color: colors.textPrimary, textAlign: 'center', marginBottom: spacing.sm },
  cardExplanation: { ...typography.body, color: colors.textSecondary, textAlign: 'center', lineHeight: 22 },
  cardExample: { backgroundColor: 'rgba(255,255,255,0.7)', padding: spacing.md, borderRadius: borderRadius.md, marginTop: spacing.lg, alignItems: 'center', width: '100%' },
  speakRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  cardExKorean: { fontSize: 16, fontFamily: 'Jakarta-SemiBold', color: colors.textPrimary },
  cardExEnglish: { ...typography.footnote, color: colors.textSecondary, marginTop: 4 },
  completedBadge: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.xs },
  completedText: { fontSize: 14, fontFamily: 'Jakarta-SemiBold', color: colors.success },
  cardNav: { flexDirection: 'row', gap: spacing.xxl },
  cardNavBtn: { width: 52, height: 52, borderRadius: 26, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', ...shadows.sm },
  cardNavBtnDisabled: { opacity: 0.4 },
});

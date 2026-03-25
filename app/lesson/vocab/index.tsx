import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { colors, borderRadius, spacing, typography, shadows } from '@/lib/theme';
import { vocabulary, allCategories, categoryInfo, getWordsByCategory, VocabCategory } from '@/data/vocabulary';
import { CategoryCard } from '@/components/vocab/CategoryCard';
import { useAppStore } from '@/lib/store';
import { speakKorean } from '@/lib/audio';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH - 48;

type ViewMode = 'list' | 'cards';

export default function VocabScreen() {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [activeCategory, setActiveCategory] = useState<VocabCategory | 'all'>('all');
  const [cardIndex, setCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const { learnedWords, markWordLearned, hapticEnabled, showRomanization } = useAppStore();

  const words = activeCategory === 'all' ? vocabulary : getWordsByCategory(activeCategory);
  const currentWord = words[cardIndex];

  const handleSpeak = useCallback((text: string) => {
    if (hapticEnabled) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    speakKorean(text);
  }, [hapticEnabled]);

  const handleCategoryChange = (cat: VocabCategory | 'all') => {
    setActiveCategory(cat);
    setCardIndex(0);
    setIsFlipped(false);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 100 }}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Vocabulary</Text>
          <Text style={styles.subtitle}>단어</Text>
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
        /* ===== LIST VIEW - categories then words ===== */
        <>
          {/* Category filter pills */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catScroll} contentContainerStyle={styles.catScrollContent}>
            <TouchableOpacity
              onPress={() => handleCategoryChange('all')}
              style={[styles.catPill, activeCategory === 'all' && styles.catPillActive]}
            >
              <Text style={[styles.catPillText, activeCategory === 'all' && styles.catPillTextActive]}>All ({vocabulary.length})</Text>
            </TouchableOpacity>
            {allCategories.map((cat) => {
              const info = categoryInfo[cat];
              return (
                <TouchableOpacity
                  key={cat}
                  onPress={() => handleCategoryChange(cat)}
                  style={[styles.catPill, activeCategory === cat && styles.catPillActive]}
                >
                  <Text style={[styles.catPillText, activeCategory === cat && styles.catPillTextActive]}>{info.name}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Word list */}
          <View style={styles.listContainer}>
            {words.map((word) => {
              const isLearned = learnedWords.includes(word.id);
              return (
                <TouchableOpacity
                  key={word.id}
                  onPress={() => router.push(`/lesson/vocab/${word.category}`)}
                  activeOpacity={0.7}
                  style={[styles.listItem, isLearned && styles.listItemLearned]}
                >
                  <View style={styles.listLeft}>
                    <Text style={styles.listKorean}>{word.korean}</Text>
                    <Text style={styles.listEnglish}>{word.english}</Text>
                    {showRomanization && <Text style={styles.listRoman}>{word.romanization}</Text>}
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
            })}
          </View>
        </>
      ) : (
        /* ===== CARDS VIEW ===== */
        currentWord && (
          <View style={styles.cardsContainer}>
            {/* Category filter in cards mode too */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catScroll} contentContainerStyle={styles.catScrollContent}>
              <TouchableOpacity
                onPress={() => handleCategoryChange('all')}
                style={[styles.catPill, activeCategory === 'all' && styles.catPillActive]}
              >
                <Text style={[styles.catPillText, activeCategory === 'all' && styles.catPillTextActive]}>All</Text>
              </TouchableOpacity>
              {allCategories.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  onPress={() => handleCategoryChange(cat)}
                  style={[styles.catPill, activeCategory === cat && styles.catPillActive]}
                >
                  <Text style={[styles.catPillText, activeCategory === cat && styles.catPillTextActive]}>{categoryInfo[cat].name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={styles.cardCounter}>{cardIndex + 1} / {words.length}</Text>
            <TouchableOpacity onPress={() => setIsFlipped(!isFlipped)} activeOpacity={0.9} style={styles.cardWrapper}>
              {!isFlipped ? (
                <View style={[styles.card, styles.cardFront]}>
                  <Text style={styles.cardHint}>Tap to flip</Text>
                  <Text style={styles.cardKorean}>{currentWord.korean}</Text>
                  {showRomanization && <Text style={styles.cardRoman}>{currentWord.romanization}</Text>}
                  <View style={styles.cardBadge}>
                    <Text style={styles.cardBadgeText}>{currentWord.partOfSpeech}</Text>
                  </View>
                </View>
              ) : (
                <View style={[styles.card, styles.cardBack]}>
                  <Text style={styles.cardHint}>Tap to flip back</Text>
                  <TouchableOpacity onPress={() => handleSpeak(currentWord.korean)} style={styles.cardSpeakBtn}>
                    <Ionicons name="volume-high" size={20} color={colors.primary} />
                  </TouchableOpacity>
                  <Text style={styles.cardEnglish}>{currentWord.english}</Text>
                  <Text style={styles.cardKoreanSmall}>{currentWord.korean}</Text>
                  {currentWord.example && (
                    <View style={styles.cardExample}>
                      <Text style={styles.cardExKorean}>{currentWord.example.korean}</Text>
                      <Text style={styles.cardExEnglish}>{currentWord.example.english}</Text>
                    </View>
                  )}
                  {currentWord.notes && <Text style={styles.cardNotes}>{currentWord.notes}</Text>}
                </View>
              )}
            </TouchableOpacity>

            {isFlipped && !learnedWords.includes(currentWord.id) && (
              <TouchableOpacity
                onPress={() => {
                  markWordLearned(currentWord.id);
                  if (hapticEnabled) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                }}
                style={styles.markLearnedBtn}
              >
                <Ionicons name="checkmark-circle" size={18} color="#fff" />
                <Text style={styles.markLearnedText}>Mark Learned</Text>
              </TouchableOpacity>
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
                disabled={cardIndex === words.length - 1}
                style={[styles.cardNavBtn, cardIndex === words.length - 1 && styles.cardNavBtnDisabled]}
              >
                <Ionicons name="chevron-forward" size={24} color={cardIndex === words.length - 1 ? colors.textTertiary : colors.primary} />
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
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: spacing.xl, paddingBottom: 0 },
  title: { ...typography.title2, color: colors.textPrimary },
  subtitle: { ...typography.footnote, color: colors.textTertiary },
  modeToggle: { flexDirection: 'row', backgroundColor: colors.surfaceLow, borderRadius: borderRadius.full, padding: 2 },
  modeBtn: { paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: borderRadius.full },
  modeBtnActive: { backgroundColor: colors.primaryDark },

  // Category pills
  catScroll: { marginTop: spacing.md },
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
  listLeft: { flex: 1, gap: 2 },
  listKorean: { fontSize: 20, fontFamily: 'Jakarta-SemiBold', color: colors.textPrimary },
  listEnglish: { fontSize: 14, fontFamily: 'Jakarta-Regular', color: colors.textSecondary },
  listRoman: { fontSize: 11, fontFamily: 'Jakarta-Regular', color: colors.textTertiary, fontStyle: 'italic' },
  playBtn: { padding: 4 },

  // Cards view
  cardsContainer: { alignItems: 'center', gap: spacing.md },
  cardCounter: { ...typography.caption, color: colors.textTertiary },
  cardWrapper: { width: CARD_WIDTH, height: 340 },
  card: {
    width: '100%',
    height: '100%',
    borderRadius: borderRadius.xxl,
    padding: spacing.xxl,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.lg,
  },
  cardFront: { backgroundColor: colors.surface, borderWidth: 2, borderColor: colors.primaryPale },
  cardBack: { backgroundColor: colors.primaryPale, borderWidth: 2, borderColor: colors.primary },
  cardHint: { ...typography.caption, color: colors.textTertiary, position: 'absolute', top: spacing.lg, left: spacing.lg },
  cardSpeakBtn: { position: 'absolute', top: spacing.lg, right: spacing.lg, width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.6)', alignItems: 'center', justifyContent: 'center' },
  cardKorean: { fontSize: 48, color: colors.textPrimary, letterSpacing: 2 },
  cardRoman: { ...typography.subhead, color: colors.textSecondary, fontStyle: 'italic', marginTop: spacing.sm },
  cardEnglish: { ...typography.title2, color: colors.textPrimary, textAlign: 'center' },
  cardKoreanSmall: { fontSize: 24, color: colors.textSecondary, marginTop: spacing.sm },
  cardBadge: { backgroundColor: colors.primaryFaint, paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: borderRadius.full, marginTop: spacing.md },
  cardBadgeText: { ...typography.caption, color: colors.primaryDark },
  cardExample: { backgroundColor: 'rgba(255,255,255,0.6)', padding: spacing.md, borderRadius: borderRadius.md, marginTop: spacing.lg, alignItems: 'center' },
  cardExKorean: { ...typography.body, color: colors.textPrimary },
  cardExEnglish: { ...typography.footnote, color: colors.textSecondary, marginTop: 2 },
  cardNotes: { ...typography.caption, color: colors.textTertiary, marginTop: spacing.md, fontStyle: 'italic', textAlign: 'center' },
  markLearnedBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.xs, backgroundColor: colors.accent, paddingVertical: spacing.md, paddingHorizontal: spacing.xxl, borderRadius: borderRadius.xl },
  markLearnedText: { fontSize: 14, fontFamily: 'Jakarta-Bold', color: '#fff' },
  cardNav: { flexDirection: 'row', gap: spacing.xxl },
  cardNavBtn: { width: 52, height: 52, borderRadius: 26, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', ...shadows.sm },
  cardNavBtnDisabled: { opacity: 0.4 },
});

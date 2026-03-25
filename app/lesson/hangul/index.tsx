import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { colors, borderRadius, spacing, typography, shadows } from '@/lib/theme';
import { consonants, doubleConsonants, vowels, compoundVowels, HangulCharacter } from '@/data/hangul';
import { useAppStore } from '@/lib/store';
import { getPercentage } from '@/lib/utils';
import { speakKorean } from '@/lib/audio';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH - 48;

const tabs = [
  { key: 'consonants', label: 'Consonants', data: consonants },
  { key: 'vowels', label: 'Vowels', data: vowels },
  { key: 'double', label: 'Double', data: doubleConsonants },
  { key: 'compound', label: 'Compound', data: compoundVowels },
] as const;

type ViewMode = 'list' | 'cards';

export default function HangulScreen() {
  const [activeTab, setActiveTab] = useState<string>('consonants');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [cardIndex, setCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const { learnedCharacters, markCharacterLearned, hapticEnabled } = useAppStore();
  const activeData = tabs.find((t) => t.key === activeTab)!;
  const learnedInTab = activeData.data.filter((c) => learnedCharacters.includes(c.id)).length;

  const handleTabChange = (key: string) => {
    setActiveTab(key);
    setCardIndex(0);
    setIsFlipped(false);
  };

  const handleSpeak = useCallback((text: string) => {
    if (hapticEnabled) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    speakKorean(text);
  }, [hapticEnabled]);

  const currentCard = activeData.data[cardIndex] as HangulCharacter | undefined;

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 32 }}>
      {/* Tab Bar */}
      <View style={styles.tabBar}>
        {tabs.map((tab) => (
          <TouchableOpacity key={tab.key} onPress={() => handleTabChange(tab.key)} style={[styles.tab, activeTab === tab.key && styles.tabActive]}>
            <Text style={[styles.tabText, activeTab === tab.key && styles.tabTextActive]}>{tab.label}</Text>
            <Text style={[styles.tabCount, activeTab === tab.key && styles.tabCountActive]}>{tab.data.length}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* View Mode Toggle + Progress */}
      <View style={styles.modeRow}>
        <Text style={styles.progressText}>
          {learnedInTab}/{activeData.data.length} learned ({getPercentage(learnedInTab, activeData.data.length)}%)
        </Text>
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
        /* ===== LIST VIEW ===== */
        <View style={styles.listContainer}>
          {activeData.data.map((char) => {
            const isLearned = learnedCharacters.includes(char.id);
            return (
              <TouchableOpacity
                key={char.id}
                onPress={() => router.push(`/lesson/hangul/${char.id}`)}
                activeOpacity={0.7}
                style={[styles.listItem, isLearned && styles.listItemLearned]}
              >
                <Text style={styles.listChar}>{char.character}</Text>
                <View style={styles.listInfo}>
                  <Text style={styles.listRoman}>{char.romanization}</Text>
                  <Text style={styles.listName}>{char.name}</Text>
                </View>
                <TouchableOpacity
                  onPress={(e) => { e.stopPropagation(); speakKorean(char.sound, 0.4); }}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  style={styles.slowBtn}
                >
                  <Ionicons name="hourglass-outline" size={22} color={colors.tertiary} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={(e) => { e.stopPropagation(); handleSpeak(char.sound); markCharacterLearned(char.id); }}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  style={styles.playBtn}
                >
                  <Ionicons name={isLearned ? 'checkmark-circle' : 'play-circle'} size={32} color={isLearned ? colors.success : colors.accent} />
                </TouchableOpacity>
              </TouchableOpacity>
            );
          })}
        </View>
      ) : (
        /* ===== CARDS VIEW ===== */
        currentCard && (
          <View style={styles.cardsContainer}>
            <Text style={styles.cardCounter}>{cardIndex + 1} / {activeData.data.length}</Text>
            <TouchableOpacity onPress={() => setIsFlipped(!isFlipped)} activeOpacity={0.9} style={styles.cardWrapper}>
              {!isFlipped ? (
                <View style={[styles.card, styles.cardFront]}>
                  <Text style={styles.cardHint}>Tap to flip</Text>
                  <Text style={styles.cardCharacter}>{currentCard.character}</Text>
                  <View style={styles.cardBadge}>
                    <Text style={styles.cardBadgeText}>{currentCard.type.replace('_', ' ')}</Text>
                  </View>
                </View>
              ) : (
                <View style={[styles.card, styles.cardBack]}>
                  <Text style={styles.cardHint}>Tap to flip back</Text>
                  <TouchableOpacity onPress={() => handleSpeak(currentCard.sound)} style={styles.cardSpeakBtn}>
                    <Ionicons name="volume-high" size={20} color={colors.primary} />
                  </TouchableOpacity>
                  <Text style={styles.cardCharSmall}>{currentCard.character}</Text>
                  <Text style={styles.cardRoman}>{currentCard.romanization}</Text>
                  <Text style={styles.cardName}>{currentCard.name} ({currentCard.nameKorean})</Text>
                  <Text style={styles.cardPronunciation}>{currentCard.pronunciation}</Text>
                  {currentCard.examples[0] && (
                    <View style={styles.cardExample}>
                      <Text style={styles.cardExKorean}>{currentCard.examples[0].word}</Text>
                      <Text style={styles.cardExEnglish}>{currentCard.examples[0].meaning}</Text>
                    </View>
                  )}
                </View>
              )}
            </TouchableOpacity>

            {isFlipped && !learnedCharacters.includes(currentCard.id) && (
              <TouchableOpacity
                onPress={() => {
                  markCharacterLearned(currentCard.id);
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
                disabled={cardIndex === activeData.data.length - 1}
                style={[styles.cardNavBtn, cardIndex === activeData.data.length - 1 && styles.cardNavBtnDisabled]}
              >
                <Ionicons name="chevron-forward" size={24} color={cardIndex === activeData.data.length - 1 ? colors.textTertiary : colors.primary} />
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
  tabBar: { flexDirection: 'row', gap: spacing.xs, paddingHorizontal: spacing.md, paddingVertical: spacing.md },
  tab: {
    flex: 1,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  tabActive: { backgroundColor: colors.primaryDark, borderColor: colors.primaryDark },
  tabText: { fontSize: 10, fontFamily: 'Jakarta-Bold', color: colors.textSecondary },
  tabTextActive: { color: '#fff' },
  tabCount: { fontSize: 9, fontFamily: 'Jakarta-Medium', color: colors.textTertiary },
  tabCountActive: { color: 'rgba(255,255,255,0.7)' },

  // Mode toggle row
  modeRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.lg, marginBottom: spacing.md },
  progressText: { ...typography.footnote, color: colors.textTertiary },
  modeToggle: { flexDirection: 'row', backgroundColor: colors.surfaceLow, borderRadius: borderRadius.full, padding: 2 },
  modeBtn: { paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: borderRadius.full },
  modeBtnActive: { backgroundColor: colors.primaryDark },

  // List view
  listContainer: { paddingHorizontal: spacing.lg, gap: spacing.xs },
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
  listChar: { fontSize: 32, color: colors.textPrimary, width: 48, textAlign: 'center' },
  listInfo: { flex: 1, gap: 2 },
  listRoman: { fontSize: 15, fontFamily: 'Jakarta-SemiBold', color: colors.textPrimary },
  listName: { fontSize: 12, fontFamily: 'Jakarta-Regular', color: colors.textTertiary },
  playBtn: { padding: 4 },
  slowBtn: { padding: 4 },

  // Cards view
  cardsContainer: { alignItems: 'center', paddingHorizontal: spacing.lg, gap: spacing.md },
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
  cardCharacter: { fontSize: 100, color: colors.textPrimary },
  cardCharSmall: { fontSize: 48, color: colors.textPrimary },
  cardRoman: { ...typography.title2, color: colors.textSecondary, marginTop: spacing.xs },
  cardName: { ...typography.footnote, color: colors.textTertiary, marginTop: spacing.xs },
  cardPronunciation: { ...typography.body, color: colors.textSecondary, textAlign: 'center', marginTop: spacing.sm, lineHeight: 20 },
  cardBadge: { backgroundColor: colors.primaryFaint, paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: borderRadius.full, marginTop: spacing.lg },
  cardBadgeText: { fontSize: 11, fontFamily: 'Jakarta-Bold', color: colors.primaryDark, textTransform: 'capitalize' },
  cardExample: { backgroundColor: 'rgba(255,255,255,0.6)', padding: spacing.md, borderRadius: borderRadius.md, marginTop: spacing.md, alignItems: 'center' },
  cardExKorean: { ...typography.body, color: colors.textPrimary },
  cardExEnglish: { ...typography.footnote, color: colors.textSecondary, marginTop: 2 },
  markLearnedBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.xs, backgroundColor: colors.accent, paddingVertical: spacing.md, paddingHorizontal: spacing.xxl, borderRadius: borderRadius.xl },
  markLearnedText: { fontSize: 14, fontFamily: 'Jakarta-Bold', color: '#fff' },
  cardNav: { flexDirection: 'row', gap: spacing.xxl },
  cardNavBtn: { width: 52, height: 52, borderRadius: 26, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', ...shadows.sm },
  cardNavBtnDisabled: { opacity: 0.4 },
});

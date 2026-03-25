import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { colors, borderRadius, spacing, typography, shadows } from '@/lib/theme';
import { readingPassages } from '@/data/readings';
import { useAppStore } from '@/lib/store';
import { speakKorean } from '@/lib/audio';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH - 48;

const levelColors: Record<string, { bg: string; text: string }> = {
  beginner: { bg: '#E8F5E9', text: '#2E7D32' },
  intermediate: { bg: '#FFF8E1', text: '#E65100' },
  advanced: { bg: '#FFEBEE', text: '#C62828' },
};

const categoryLabels: Record<string, string> = {
  fairy_tale: 'Fairy Tale',
  daily_life: 'Daily Life',
  culture: 'Culture',
  conversation: 'Conversation',
};

const categoryGradients: Record<string, readonly [string, string]> = {
  fairy_tale: ['#CE93D8', '#AB47BC'],
  daily_life: ['#81D4FA', '#0288D1'],
  culture: ['#A5D6A7', '#388E3C'],
  conversation: ['#FFCC80', '#F57C00'],
};

const levelGradients: Record<string, readonly [string, string]> = {
  beginner: ['#66BB6A', '#2E7D32'],
  intermediate: ['#FFA726', '#E65100'],
  advanced: ['#EF5350', '#B71C1C'],
};

type ViewMode = 'list' | 'cards';

export default function ReadingListScreen() {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [cardIndex, setCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const { hapticEnabled } = useAppStore();

  const passage = readingPassages[cardIndex];
  const firstParagraph = passage?.paragraphs[0];

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Reading Practice</Text>
          <Text style={styles.subtitle}>읽기 연습</Text>
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
        <View style={styles.passageList}>
          {readingPassages.map((p) => {
            const levelStyle = levelColors[p.level];
            const gradient = levelGradients[p.level] || categoryGradients[p.category] || categoryGradients.daily_life;
            return (
              <TouchableOpacity key={p.id} activeOpacity={0.8} onPress={() => router.push(`/lesson/reading/${p.id}` as any)}>
                <View style={styles.passageCard}>
                  <LinearGradient colors={gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.cardGradient}>
                    <View style={styles.cardHeader}>
                      <View style={styles.cardTitleArea}>
                        <Text style={styles.cardTitle} numberOfLines={1}>{p.title}</Text>
                        <Text style={styles.cardTitleKorean}>{p.titleKorean}</Text>
                      </View>
                      <View style={[styles.levelBadge, { backgroundColor: levelStyle.bg }]}>
                        <Text style={[styles.levelBadgeText, { color: levelStyle.text }]}>{p.level}</Text>
                      </View>
                    </View>
                    <View style={styles.cardFooter}>
                      <View style={styles.categoryTag}>
                        <Ionicons name="bookmark-outline" size={12} color="rgba(255,255,255,0.8)" />
                        <Text style={styles.categoryText}>{categoryLabels[p.category]}</Text>
                      </View>
                      <TouchableOpacity
                        onPress={(e) => {
                          e.stopPropagation();
                          if (hapticEnabled) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                          speakKorean(p.paragraphs[0]?.korean || p.titleKorean);
                        }}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                      >
                        <Ionicons name="play-circle" size={28} color="rgba(255,255,255,0.9)" />
                      </TouchableOpacity>
                    </View>
                  </LinearGradient>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      ) : (
        passage && (
          <View style={styles.cardsContainer}>
            <Text style={styles.cardCounter}>{cardIndex + 1} / {readingPassages.length}</Text>
            <TouchableOpacity onPress={() => setIsFlipped(!isFlipped)} activeOpacity={0.9} style={styles.flipCardWrapper}>
              {!isFlipped ? (
                <View style={[styles.flipCard, styles.flipFront, {
                  backgroundColor: levelColors[passage.level]?.bg || colors.surface,
                  borderColor: levelColors[passage.level]?.text || '#bfdbfe',
                }]}>
                  <Text style={styles.flipHint}>Tap to see translation</Text>
                  <TouchableOpacity
                    onPress={(e) => {
                      e.stopPropagation();
                      if (hapticEnabled) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                      speakKorean(firstParagraph?.korean || passage.titleKorean);
                    }}
                    style={styles.flipSpeakBtn}
                  >
                    <Ionicons name="volume-high" size={20} color="#3b82f6" />
                  </TouchableOpacity>
                  <Text style={styles.flipTitle}>{passage.title}</Text>
                  <Text style={styles.flipTitleKorean}>{passage.titleKorean}</Text>
                  <Text style={styles.flipKoreanText} numberOfLines={6}>{firstParagraph?.korean}</Text>
                </View>
              ) : (
                <View style={[styles.flipCard, styles.flipBack]}>
                  <Text style={styles.flipHint}>Tap to flip back</Text>
                  <Text style={styles.flipEnglishTitle}>{passage.title}</Text>
                  <Text style={styles.flipEnglishText} numberOfLines={8}>{firstParagraph?.english}</Text>
                </View>
              )}
            </TouchableOpacity>

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
                disabled={cardIndex === readingPassages.length - 1}
                style={[styles.cardNavBtn, cardIndex === readingPassages.length - 1 && styles.cardNavBtnDisabled]}
              >
                <Ionicons name="chevron-forward" size={24} color={cardIndex === readingPassages.length - 1 ? colors.textTertiary : colors.primary} />
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

  passageList: { paddingHorizontal: spacing.xl, gap: spacing.lg },
  passageCard: { borderRadius: borderRadius.xl, overflow: 'hidden', ...shadows.md },
  cardGradient: { padding: spacing.lg, gap: spacing.sm },
  cardHeader: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: spacing.sm },
  cardTitleArea: { flex: 1 },
  cardTitle: { fontFamily: 'Jakarta-Bold', fontSize: 18, color: '#fff' },
  cardTitleKorean: { fontFamily: 'Jakarta-Medium', fontSize: 13, color: 'rgba(255,255,255,0.75)' },
  levelBadge: { paddingHorizontal: spacing.sm, paddingVertical: 2, borderRadius: borderRadius.sm },
  levelBadgeText: { fontFamily: 'Jakarta-SemiBold', fontSize: 11, textTransform: 'capitalize' },
  cardFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: spacing.xs },
  categoryTag: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  categoryText: { fontFamily: 'Jakarta-Medium', fontSize: 11, color: 'rgba(255,255,255,0.8)' },

  cardsContainer: { alignItems: 'center', paddingHorizontal: spacing.lg, gap: spacing.md },
  cardCounter: { ...typography.caption, color: colors.textTertiary },
  flipCardWrapper: { width: CARD_WIDTH, height: 400 },
  flipCard: { width: '100%', height: '100%', borderRadius: borderRadius.xxl, padding: spacing.xxl, alignItems: 'center', justifyContent: 'center', ...shadows.lg },
  flipFront: { backgroundColor: colors.surface, borderWidth: 2, borderColor: '#bfdbfe' },
  flipBack: { backgroundColor: '#f0f4ff', borderWidth: 2, borderColor: '#3b82f6' },
  flipHint: { ...typography.caption, color: colors.textTertiary, position: 'absolute', top: spacing.lg, left: spacing.lg },
  flipSpeakBtn: { position: 'absolute', top: spacing.lg, right: spacing.lg, width: 40, height: 40, borderRadius: 20, backgroundColor: '#eff6ff', alignItems: 'center', justifyContent: 'center' },
  flipTitle: { ...typography.title3, color: colors.textPrimary, textAlign: 'center' },
  flipTitleKorean: { ...typography.subhead, color: colors.textSecondary, marginTop: spacing.xs },
  flipKoreanText: { fontSize: 16, fontFamily: 'Jakarta-Regular', color: colors.textPrimary, lineHeight: 26, textAlign: 'center', marginTop: spacing.lg },
  flipEnglishTitle: { ...typography.title3, color: colors.textPrimary, textAlign: 'center', marginBottom: spacing.md },
  flipEnglishText: { ...typography.body, color: colors.textSecondary, lineHeight: 24, textAlign: 'center' },

  cardNav: { flexDirection: 'row', gap: spacing.xxl },
  cardNavBtn: { width: 52, height: 52, borderRadius: 26, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', ...shadows.sm },
  cardNavBtnDisabled: { opacity: 0.4 },
});

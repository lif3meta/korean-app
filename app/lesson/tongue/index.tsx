import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, borderRadius, spacing, typography, shadows } from '@/lib/theme';
import { AudioButton } from '@/components/common/AudioButton';
import {
  tonguePositions,
  categoryLabels,
  categoryOrder,
  TonguePosition,
} from '@/data/tonguePositions';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type FilterCategory = 'all' | TonguePosition['category'];

// ─── Mouth Diagram Component ────────────────────────────────────────────────

function MouthDiagram({
  tongueHeight,
  tonguePlace,
  lipShape,
  type,
  size = 'small',
}: {
  tongueHeight: TonguePosition['tongueHeight'];
  tonguePlace: TonguePosition['tonguePlace'];
  type: TonguePosition['type'];
  lipShape: TonguePosition['lipShape'];
  size?: 'small' | 'large';
}) {
  const isLarge = size === 'large';
  const w = isLarge ? 120 : 72;
  const h = isLarge ? 90 : 54;

  // Palate (top arc)
  const palateH = isLarge ? 18 : 10;

  // Tongue positioning
  const tongueW = isLarge ? 70 : 42;
  const tongueH = isLarge ? 20 : 12;

  let tongueTop: number;
  switch (tongueHeight) {
    case 'high':
      tongueTop = isLarge ? 28 : 16;
      break;
    case 'mid':
      tongueTop = isLarge ? 45 : 27;
      break;
    case 'low':
    default:
      tongueTop = isLarge ? 58 : 35;
      break;
  }

  let tongueLeft: number;
  switch (tonguePlace) {
    case 'front':
      tongueLeft = isLarge ? 38 : 22;
      break;
    case 'center':
      tongueLeft = isLarge ? 25 : 15;
      break;
    case 'back':
    default:
      tongueLeft = isLarge ? 12 : 7;
      break;
  }

  // Lip indicator
  const isRounded = lipShape === 'rounded';
  const isOpen = lipShape === 'open';
  const isSpread = lipShape === 'spread';

  const lipW = isRounded ? (isLarge ? 10 : 6) : isSpread ? (isLarge ? 6 : 4) : (isLarge ? 8 : 5);
  const lipH = isRounded ? (isLarge ? 30 : 18) : isOpen ? (isLarge ? 40 : 24) : (isLarge ? 20 : 12);

  const isVowel = type === 'vowel';

  return (
    <View style={[styles.mouthContainer, { width: w, height: h }]}>
      {/* Mouth cavity background */}
      <View
        style={[
          styles.mouthCavity,
          {
            width: w - (isLarge ? 16 : 10),
            height: h - (isLarge ? 8 : 5),
            borderRadius: isLarge ? 16 : 10,
            left: isLarge ? 14 : 8,
            top: isLarge ? 4 : 3,
          },
        ]}
      />

      {/* Palate (top arc) */}
      <View
        style={[
          styles.palate,
          {
            width: w - (isLarge ? 20 : 12),
            height: palateH,
            borderTopLeftRadius: isLarge ? 40 : 24,
            borderTopRightRadius: isLarge ? 40 : 24,
            left: isLarge ? 18 : 10,
            top: isLarge ? 4 : 3,
          },
        ]}
      />

      {/* Teeth ridge (alveolar) */}
      <View
        style={[
          styles.teethRidge,
          {
            width: isLarge ? 16 : 10,
            height: isLarge ? 6 : 4,
            right: isLarge ? 18 : 10,
            top: palateH + (isLarge ? 2 : 1),
          },
        ]}
      />

      {/* Tongue */}
      <View
        style={[
          styles.tongue,
          {
            width: tongueW,
            height: tongueH,
            borderRadius: tongueH / 2,
            left: tongueLeft,
            top: tongueTop,
          },
          isVowel && styles.tongueVowel,
        ]}
      />

      {/* Lip indicator (left side) */}
      <View
        style={[
          styles.lip,
          {
            width: lipW,
            height: lipH,
            borderTopLeftRadius: isLarge ? 6 : 4,
            borderBottomLeftRadius: isLarge ? 6 : 4,
            left: 0,
            top: (h - lipH) / 2,
          },
          isRounded && styles.lipRounded,
          isSpread && styles.lipSpread,
        ]}
      />
    </View>
  );
}

// ─── Mouth Image ────────────────────────────────────────────────────────────

function MouthImage({ sound, korean }: { sound: string; korean: string }) {
  const seed = encodeURIComponent(`mouth-${korean}-${sound}`);
  const uri = `https://api.dicebear.com/9.x/icons/png?seed=${seed}&size=200&backgroundColor=f0f0ff`;

  return (
    <Image
      source={{ uri }}
      style={styles.mouthImage}
      resizeMode="cover"
    />
  );
}

// ─── Sound Card ─────────────────────────────────────────────────────────────

function SoundCard({ item }: { item: TonguePosition }) {
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = useCallback(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded((prev) => !prev);
  }, []);

  const typeColor =
    item.type === 'consonant'
      ? colors.primary
      : item.type === 'double'
        ? colors.koreanRed
        : colors.secondary;

  const typeBg =
    item.type === 'consonant'
      ? colors.primaryFaint
      : item.type === 'double'
        ? colors.dangerLight
        : colors.warmMint;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={toggleExpand}
      style={[styles.card, expanded && styles.cardExpanded]}
    >
      {/* Compact view */}
      <View style={styles.cardRow}>
        <View style={styles.cardLeft}>
          <Text style={[styles.koreanChar, { color: typeColor }]}>{item.korean}</Text>
          <View style={styles.cardMeta}>
            <Text style={styles.romanization}>{item.romanization}</Text>
            <View style={[styles.typeBadge, { backgroundColor: typeBg }]}>
              <Text style={[styles.typeText, { color: typeColor }]}>
                {item.category === 'basic_consonant'
                  ? 'Basic'
                  : item.category === 'aspirated'
                    ? 'Aspirated'
                    : item.category === 'tense'
                      ? 'Tense'
                      : item.category === 'compound_vowel'
                        ? 'Compound'
                        : 'Vowel'}
              </Text>
            </View>
          </View>
        </View>

        <MouthDiagram
          tongueHeight={item.tongueHeight}
          tonguePlace={item.tonguePlace}
          lipShape={item.lipShape}
          type={item.type}
        />

        <View style={styles.cardRight}>
          <AudioButton text={item.korean} size="sm" color={typeColor} audioType="hangul_sound" />
          <Ionicons
            name={expanded ? 'chevron-up' : 'chevron-down'}
            size={16}
            color={colors.textTertiary}
          />
        </View>
      </View>

      {/* Expanded details */}
      {expanded && (
        <View style={styles.expandedContent}>
          <MouthImage sound={item.sound} korean={item.korean} />

          <Text style={styles.descriptionText}>{item.description}</Text>

          <View style={styles.detailRow}>
            <Ionicons name="fitness" size={14} color={colors.primary} />
            <Text style={styles.detailLabel}>Tongue:</Text>
            <Text style={styles.detailValue}>{item.tonguePosition}</Text>
          </View>

          <View style={styles.detailRow}>
            <Ionicons name="ellipse-outline" size={14} color={colors.accent} />
            <Text style={styles.detailLabel}>Lips:</Text>
            <Text style={styles.detailValue}>{item.lipPosition}</Text>
          </View>

          <View style={styles.detailRow}>
            <Ionicons name="language" size={14} color={colors.secondary} />
            <Text style={styles.detailLabel}>English:</Text>
            <Text style={styles.detailValue}>{item.similarEnglish}</Text>
          </View>

          {item.tips.length > 0 && (
            <View style={styles.tipsContainer}>
              <Text style={styles.tipsTitle}>Tips</Text>
              {item.tips.map((tip, idx) => (
                <View key={idx} style={styles.tipRow}>
                  <Text style={styles.tipBullet}>-</Text>
                  <Text style={styles.tipText}>{tip}</Text>
                </View>
              ))}
            </View>
          )}

          <View style={styles.examplesContainer}>
            <Text style={styles.examplesTitle}>Example Words</Text>
            {item.examples.map((ex, idx) => (
              <View key={idx} style={styles.exampleRow}>
                <AudioButton text={ex.korean} size="sm" color={typeColor} />
                <Text style={styles.exampleKorean}>{ex.korean}</Text>
                <Text style={styles.exampleRoman}>{ex.romanization}</Text>
                <Text style={styles.exampleEnglish} numberOfLines={1}>
                  {ex.english}
                </Text>
              </View>
            ))}
          </View>

          <TouchableOpacity
            style={[styles.detailButton, { backgroundColor: typeColor }]}
            onPress={() => router.push(`/lesson/tongue/${item.id}`)}
            activeOpacity={0.7}
          >
            <Text style={styles.detailButtonText}>Full Guide</Text>
            <Ionicons name="arrow-forward" size={16} color="#fff" />
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );
}

// ─── Main Screen ────────────────────────────────────────────────────────────

export default function TongueGuideScreen() {
  const [activeCategory, setActiveCategory] = useState<FilterCategory>('all');

  const allCategories: { key: FilterCategory; label: string }[] = [
    { key: 'all', label: 'All' },
    ...categoryOrder.map((cat) => ({ key: cat as FilterCategory, label: categoryLabels[cat] })),
  ];

  const filtered =
    activeCategory === 'all'
      ? tonguePositions
      : tonguePositions.filter((tp) => tp.category === activeCategory);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={{ paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Tongue Guide</Text>
          <Text style={styles.subtitle}>Learn how to position your mouth for every Korean sound</Text>
        </View>

        {/* Category tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsContainer}
          style={styles.tabsScroll}
        >
          {allCategories.map((cat) => {
            const isActive = activeCategory === cat.key;
            return (
              <TouchableOpacity
                key={cat.key}
                onPress={() => {
                  LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                  setActiveCategory(cat.key);
                }}
                style={[styles.tab, isActive && styles.tabActive]}
                activeOpacity={0.7}
              >
                <Text style={[styles.tabText, isActive && styles.tabTextActive]}>{cat.label}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Count */}
        <Text style={styles.countText}>{filtered.length} sounds</Text>

        {/* Cards */}
        {filtered.map((item) => (
          <SoundCard key={item.id} item={item} />
        ))}
      </ScrollView>
    </View>
  );
}

// ─── Styles ─────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  title: {
    ...typography.title2,
    color: colors.textPrimary,
  },
  subtitle: {
    ...typography.footnote,
    color: colors.textSecondary,
    lineHeight: 20,
    marginTop: spacing.xs,
  },
  tabsScroll: {
    marginTop: spacing.md,
  },
  tabsContainer: {
    paddingHorizontal: spacing.xl,
    gap: spacing.sm,
  },
  tab: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.pill,
    backgroundColor: colors.surfaceLow,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  tabActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  tabText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  tabTextActive: {
    color: '#fff',
    fontFamily: 'Jakarta-Bold',
  },
  countText: {
    ...typography.caption,
    color: colors.textTertiary,
    paddingHorizontal: spacing.xl,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },

  // Card
  card: {
    marginHorizontal: spacing.xl,
    marginBottom: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    ...shadows.sm,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  cardExpanded: {
    ...shadows.md,
    borderColor: colors.primaryLight,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  cardLeft: {
    flex: 1,
    gap: spacing.xs,
  },
  koreanChar: {
    fontSize: 40,
    fontFamily: 'Jakarta-ExtraBold',
  },
  cardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  romanization: {
    ...typography.bodyBold,
    color: colors.textPrimary,
  },
  typeBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  typeText: {
    fontSize: 10,
    fontFamily: 'Jakarta-Bold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  cardRight: {
    alignItems: 'center',
    gap: spacing.sm,
  },

  // Mouth diagram
  mouthContainer: {
    position: 'relative',
    overflow: 'hidden',
  },
  mouthCavity: {
    position: 'absolute',
    backgroundColor: '#fce4ec',
  },
  palate: {
    position: 'absolute',
    backgroundColor: '#c9b0b0',
  },
  teethRidge: {
    position: 'absolute',
    backgroundColor: '#e8d8d8',
    borderRadius: 3,
  },
  tongue: {
    position: 'absolute',
    backgroundColor: '#e57373',
  },
  tongueVowel: {
    backgroundColor: '#4db6ac',
  },
  lip: {
    position: 'absolute',
    backgroundColor: '#d4726a',
  },
  lipRounded: {
    backgroundColor: '#c62828',
    borderRadius: 999,
  },
  lipSpread: {
    backgroundColor: '#ef9a9a',
  },

  // Expanded content
  expandedContent: {
    marginTop: spacing.lg,
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    gap: spacing.md,
  },
  mouthImage: {
    width: '100%',
    height: 160,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.surfaceLow,
  },
  descriptionText: {
    ...typography.footnote,
    color: colors.textPrimary,
    lineHeight: 20,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  detailLabel: {
    ...typography.caption,
    color: colors.textTertiary,
    fontFamily: 'Jakarta-Bold',
    minWidth: 50,
  },
  detailValue: {
    ...typography.footnote,
    color: colors.textSecondary,
    flex: 1,
    lineHeight: 18,
  },
  tipsContainer: {
    backgroundColor: colors.warmCream,
    borderRadius: borderRadius.md,
    padding: spacing.md,
  },
  tipsTitle: {
    ...typography.caption,
    color: colors.warning,
    fontFamily: 'Jakarta-Bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing.xs,
  },
  tipRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: 4,
  },
  tipBullet: {
    ...typography.footnote,
    color: colors.textTertiary,
  },
  tipText: {
    ...typography.footnote,
    color: colors.textSecondary,
    flex: 1,
    lineHeight: 18,
  },
  examplesContainer: {
    gap: spacing.sm,
  },
  examplesTitle: {
    ...typography.caption,
    color: colors.textTertiary,
    fontFamily: 'Jakarta-Bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  exampleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surfaceLow,
    padding: spacing.sm,
    borderRadius: borderRadius.md,
  },
  exampleKorean: {
    ...typography.bodyBold,
    color: colors.textPrimary,
    minWidth: 50,
  },
  exampleRoman: {
    ...typography.caption,
    color: colors.textTertiary,
    minWidth: 60,
  },
  exampleEnglish: {
    ...typography.footnote,
    color: colors.textSecondary,
    flex: 1,
  },
  detailButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    marginTop: spacing.xs,
  },
  detailButtonText: {
    ...typography.bodyBold,
    color: '#fff',
  },
});

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, LayoutAnimation, Platform, UIManager } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, borderRadius, spacing, typography, shadows } from '@/lib/theme';
import { slangWords, slangCategories } from '@/data/slang';
import type { SlangWord } from '@/data/slang';
import { AudioButton } from '@/components/common/AudioButton';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const categoryLabels: Record<string, string> = {
  internet: 'Internet',
  casual: 'Casual',
  kpop: 'K-pop',
  kdrama: 'K-drama',
  texting: 'Texting',
};

const categoryColors: Record<string, string> = {
  internet: '#7C4DFF',
  casual: '#E040FB',
  kpop: '#FF6090',
  kdrama: '#FFD740',
  texting: '#00E5FF',
};

export default function SlangListScreen() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = activeCategory === 'all'
    ? slangWords
    : slangWords.filter((w) => w.category === activeCategory);

  const handleToggle = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 100 }}>
      <Text style={styles.title}>Korean Slang</Text>
      <Text style={styles.subtitle}>한국어 슬랭</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabsContainer}
        style={styles.tabsScroll}
      >
        <TouchableOpacity
          onPress={() => setActiveCategory('all')}
          style={[styles.tab, activeCategory === 'all' && styles.tabActive]}
        >
          <Text style={[styles.tabText, activeCategory === 'all' && styles.tabTextActive]}>All</Text>
        </TouchableOpacity>
        {slangCategories.map((cat) => (
          <TouchableOpacity
            key={cat}
            onPress={() => setActiveCategory(cat)}
            style={[
              styles.tab,
              activeCategory === cat && { backgroundColor: categoryColors[cat] },
            ]}
          >
            <Text style={[styles.tabText, activeCategory === cat && styles.tabTextActive]}>
              {categoryLabels[cat]}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Text style={styles.countText}>{filtered.length} expressions</Text>

      {filtered.map((word) => (
        <SlangCard
          key={word.id}
          word={word}
          expanded={expandedId === word.id}
          onToggle={() => handleToggle(word.id)}
        />
      ))}
    </ScrollView>
  );
}

function SlangCard({ word, expanded, onToggle }: { word: SlangWord; expanded: boolean; onToggle: () => void }) {
  const catColor = categoryColors[word.category];

  return (
    <TouchableOpacity activeOpacity={0.7} onPress={onToggle} style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.cardLeft}>
          <View style={styles.koreanRow}>
            <Text style={styles.koreanText}>{word.korean}</Text>
            <AudioButton text={word.korean} size="sm" color={colors.primaryDark} />
          </View>
          <Text style={styles.romanText}>{word.romanization}</Text>
          <Text style={styles.englishText}>{word.english}</Text>
        </View>
        <View style={styles.cardRight}>
          <View style={[styles.categoryBadge, { backgroundColor: catColor + '20' }]}>
            <Text style={[styles.categoryBadgeText, { color: catColor }]}>
              {categoryLabels[word.category]}
            </Text>
          </View>
          <Ionicons
            name={expanded ? 'chevron-up' : 'chevron-down'}
            size={18}
            color={colors.textTertiary}
            style={styles.chevron}
          />
        </View>
      </View>

      {expanded && (
        <View style={styles.expandedContent}>
          {word.literal && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Literal</Text>
              <Text style={styles.detailValue}>{word.literal}</Text>
            </View>
          )}
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Usage</Text>
            <Text style={styles.detailValue}>{word.usage}</Text>
          </View>
          <View style={styles.exampleBox}>
            <Text style={styles.exampleLabel}>Example</Text>
            <View style={styles.exampleRow}>
              <Text style={styles.exampleKorean}>{word.example.korean}</Text>
              <AudioButton text={word.example.korean} size="sm" color={colors.primary} />
            </View>
            <Text style={styles.exampleRoman}>{word.example.romanization}</Text>
            <Text style={styles.exampleEnglish}>{word.example.english}</Text>
          </View>
          <View style={[styles.levelBadge, { backgroundColor: word.level === 'beginner' ? colors.successBg : colors.warningLight }]}>
            <Text style={[styles.levelText, { color: word.level === 'beginner' ? colors.success : colors.warning }]}>
              {word.level}
            </Text>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.xl,
  },
  title: {
    ...typography.title2,
    color: colors.textPrimary,
  },
  subtitle: {
    ...typography.footnote,
    color: colors.textTertiary,
    marginBottom: spacing.md,
  },
  tabsScroll: {
    marginBottom: spacing.md,
  },
  tabsContainer: {
    gap: spacing.sm,
    paddingRight: spacing.xl,
  },
  tab: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  tabActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  tabText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 13,
    color: colors.textSecondary,
  },
  tabTextActive: {
    color: '#fff',
  },
  countText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 13,
    color: colors.textTertiary,
    marginBottom: spacing.md,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...shadows.sm,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cardLeft: {
    flex: 1,
    gap: 2,
  },
  koreanRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  koreanText: {
    fontSize: 22,
    fontFamily: 'Poppins-Bold',
    color: colors.textPrimary,
  },
  romanText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 13,
    color: colors.primaryDark,
  },
  englishText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
  cardRight: {
    alignItems: 'flex-end',
    gap: spacing.sm,
  },
  categoryBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  categoryBadgeText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 10,
  },
  chevron: {
    marginTop: spacing.xs,
  },
  expandedContent: {
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    gap: spacing.sm,
  },
  detailRow: {
    gap: 2,
  },
  detailLabel: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 11,
    color: colors.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  detailValue: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: colors.textPrimary,
    lineHeight: 20,
  },
  exampleBox: {
    backgroundColor: colors.primaryFaint,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    gap: 4,
    marginTop: spacing.xs,
  },
  exampleLabel: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 11,
    color: colors.primaryDark,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  exampleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  exampleKorean: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: colors.textPrimary,
  },
  exampleRoman: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: colors.textTertiary,
  },
  exampleEnglish: {
    fontFamily: 'Poppins-Medium',
    fontSize: 13,
    color: colors.textSecondary,
  },
  levelBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    marginTop: spacing.xs,
  },
  levelText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 10,
    textTransform: 'capitalize',
  },
});

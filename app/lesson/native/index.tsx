import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, borderRadius, spacing, shadows } from '@/lib/theme';
import { Card } from '@/components/ui/Card';
import { nativeContent, getContentByType } from '@/data/nativeContent';
import type { NativeContent } from '@/data/nativeContent';

type FilterTab = 'all' | 'headline' | 'lyrics' | 'dialogue';

const TABS: { key: FilterTab; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'headline', label: 'Headlines' },
  { key: 'lyrics', label: 'Lyrics' },
  { key: 'dialogue', label: 'Dialogues' },
];

const TYPE_COLORS: Record<string, string> = {
  headline: '#0ea5e9',
  lyrics: '#a855f7',
  dialogue: '#f97316',
};

const TYPE_GRADIENTS: Record<string, readonly [string, string]> = {
  headline: ['#0ea5e9', '#0284c7'],
  lyrics: ['#a855f7', '#9333ea'],
  dialogue: ['#f97316', '#ea580c'],
};

const TYPE_ICONS: Record<string, string> = {
  headline: 'newspaper',
  lyrics: 'musical-notes',
  dialogue: 'chatbubbles',
};

const LEVEL_COLORS: Record<string, string> = {
  beginner: '#10b981',
  intermediate: '#f59e0b',
  advanced: '#ef4444',
};

export default function NativeContentScreen() {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<FilterTab>('all');

  const filteredContent = activeTab === 'all' ? nativeContent : getContentByType(activeTab);

  const renderContentCard = (item: NativeContent) => {
    const typeColor = TYPE_COLORS[item.type] || '#64748b';
    const gradient = TYPE_GRADIENTS[item.type] || ['#64748b', '#475569'];
    const icon = TYPE_ICONS[item.type] || 'document-text';
    const levelColor = LEVEL_COLORS[item.level] || '#64748b';

    return (
      <TouchableOpacity
        key={item.id}
        onPress={() => router.push(`/lesson/native/${item.id}`)}
        activeOpacity={0.8}
      >
        <Card variant="elevated" style={styles.contentCard}>
          <LinearGradient
            colors={gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.contentGradient}
          >
            <View style={styles.cardTop}>
              <View style={styles.typeBadge}>
                <Ionicons name={icon as any} size={12} color="#fff" />
                <Text style={styles.typeBadgeText}>
                  {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                </Text>
              </View>
              <View style={[styles.levelBadge, { backgroundColor: levelColor + '30' }]}>
                <Text style={[styles.levelBadgeText, { color: '#fff' }]}>
                  {item.level.charAt(0).toUpperCase() + item.level.slice(1)}
                </Text>
              </View>
            </View>

            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardTitleKorean}>{item.titleKorean}</Text>

            <View style={styles.cardBottom}>
              <Text style={styles.cardSource}>{item.source}</Text>
              <Text style={styles.cardLineCount}>{item.lines.length} lines</Text>
            </View>
          </LinearGradient>
        </Card>
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: spacing.xxxl }} showsVerticalScrollIndicator={false}>
      <View style={styles.headerArea}>
        <View style={styles.headerIconRow}>
          <Ionicons name="earth" size={24} color={colors.primaryDark} />
          <View>
            <Text style={styles.headerTitle}>Real Korean</Text>
            <Text style={styles.headerSub}>진짜 한국어</Text>
          </View>
        </View>
        <Text style={styles.headerDesc}>Practice with authentic Korean content</Text>
      </View>

      {/* Filter Tabs */}
      <View style={styles.tabContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabScroll}>
          {TABS.map((tab) => (
            <TouchableOpacity
              key={tab.key}
              onPress={() => setActiveTab(tab.key)}
              style={[
                styles.tab,
                activeTab === tab.key && styles.tabActive,
              ]}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab.key && styles.tabTextActive,
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Content Cards */}
      <View style={styles.contentList}>
        {filteredContent.map(renderContentCard)}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  headerArea: {
    paddingHorizontal: 24,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
  },
  headerIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  headerTitle: {
    fontFamily: 'Jakarta-ExtraBold',
    fontSize: 24,
    color: colors.textPrimary,
  },
  headerSub: {
    fontFamily: 'Jakarta-Medium',
    fontSize: 12,
    color: colors.textTertiary,
    marginTop: 1,
  },
  headerDesc: {
    fontFamily: 'Jakarta-Regular',
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },

  // Tabs
  tabContainer: {
    paddingBottom: spacing.md,
  },
  tabScroll: {
    paddingHorizontal: 20,
    gap: spacing.sm,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: borderRadius.pill,
    backgroundColor: colors.surfaceLow,
  },
  tabActive: {
    backgroundColor: colors.primaryDark,
  },
  tabText: {
    fontFamily: 'Jakarta-SemiBold',
    fontSize: 13,
    color: colors.textTertiary,
  },
  tabTextActive: {
    color: '#fff',
  },

  // Content List
  contentList: {
    paddingHorizontal: 20,
    gap: spacing.md,
  },
  contentCard: { padding: 0, overflow: 'hidden' },
  contentGradient: { padding: spacing.lg },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: borderRadius.pill,
  },
  typeBadgeText: {
    fontFamily: 'Jakarta-Bold',
    fontSize: 11,
    color: '#fff',
    letterSpacing: 0.5,
  },
  levelBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: borderRadius.pill,
  },
  levelBadgeText: {
    fontFamily: 'Jakarta-Bold',
    fontSize: 11,
    letterSpacing: 0.5,
  },
  cardTitle: {
    fontFamily: 'Jakarta-ExtraBold',
    fontSize: 20,
    color: '#fff',
  },
  cardTitleKorean: {
    fontFamily: 'Jakarta-Medium',
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 2,
  },
  cardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.md,
  },
  cardSource: {
    fontFamily: 'Jakarta-Regular',
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
  },
  cardLineCount: {
    fontFamily: 'Jakarta-Bold',
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
  },
});

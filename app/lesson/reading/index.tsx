import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, borderRadius, spacing, typography, shadows } from '@/lib/theme';
import { readingPassages } from '@/data/readings';

const levelColors: Record<string, { bg: string; text: string }> = {
  beginner: { bg: '#E8F5E9', text: '#2E7D32' },
  intermediate: { bg: '#FFF3E0', text: '#E65100' },
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

export default function ReadingListScreen() {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 100 }}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>Reading Practice</Text>
      <Text style={styles.subtitle}>읽기 연습</Text>
      <Text style={styles.description}>
        Tap any Korean word while reading to see its English translation.
      </Text>

      <View style={styles.passageList}>
        {readingPassages.map((passage) => {
          const levelStyle = levelColors[passage.level];
          const gradient = categoryGradients[passage.category] || categoryGradients.daily_life;

          return (
            <TouchableOpacity
              key={passage.id}
              activeOpacity={0.8}
              onPress={() => router.push(`/lesson/reading/${passage.id}` as any)}
            >
              <View style={styles.passageCard}>
                <LinearGradient
                  colors={gradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.cardGradient}
                >
                  <View style={styles.cardHeader}>
                    <View style={styles.cardTitleArea}>
                      <Text style={styles.cardTitle} numberOfLines={1}>
                        {passage.title}
                      </Text>
                      <Text style={styles.cardTitleKorean}>
                        {passage.titleKorean}
                      </Text>
                    </View>
                    <View style={styles.cardBadges}>
                      <View
                        style={[
                          styles.levelBadge,
                          { backgroundColor: levelStyle.bg },
                        ]}
                      >
                        <Text
                          style={[
                            styles.levelBadgeText,
                            { color: levelStyle.text },
                          ]}
                        >
                          {passage.level}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <Text style={styles.cardDescription} numberOfLines={2}>
                    {passage.description}
                  </Text>

                  <View style={styles.cardFooter}>
                    <View style={styles.categoryTag}>
                      <Ionicons
                        name="bookmark-outline"
                        size={12}
                        color="rgba(255,255,255,0.8)"
                      />
                      <Text style={styles.categoryText}>
                        {categoryLabels[passage.category]}
                      </Text>
                    </View>
                    <View style={styles.statTag}>
                      <Ionicons
                        name="document-text-outline"
                        size={12}
                        color="rgba(255,255,255,0.8)"
                      />
                      <Text style={styles.statText}>
                        {passage.paragraphs.length} sentences
                      </Text>
                    </View>
                    <Ionicons
                      name="chevron-forward"
                      size={18}
                      color="rgba(255,255,255,0.7)"
                    />
                  </View>
                </LinearGradient>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
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
    marginBottom: spacing.sm,
  },
  description: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
    lineHeight: 22,
  },
  passageList: {
    gap: spacing.lg,
  },
  passageCard: {
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    ...shadows.md,
  },
  cardGradient: {
    padding: spacing.lg,
    gap: spacing.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  cardTitleArea: {
    flex: 1,
    flexShrink: 1,
  },
  cardTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 18,
    color: '#fff',
  },
  cardTitleKorean: {
    fontFamily: 'Poppins-Medium',
    fontSize: 13,
    color: 'rgba(255,255,255,0.75)',
  },
  cardBadges: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  levelBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  levelBadgeText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 11,
    textTransform: 'capitalize',
  },
  cardDescription: {
    fontFamily: 'Poppins-Regular',
    fontSize: 13,
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 18,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginTop: spacing.xs,
  },
  categoryTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  categoryText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 11,
    color: 'rgba(255,255,255,0.8)',
  },
  statTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1,
  },
  statText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 11,
    color: 'rgba(255,255,255,0.8)',
  },
});

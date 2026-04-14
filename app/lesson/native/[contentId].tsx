import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, borderRadius, spacing, shadows } from '@/lib/theme';
import { useAppStore } from '@/lib/store';
import { Card } from '@/components/ui/Card';
import { AudioButton } from '@/components/common/AudioButton';
import { getContentById } from '@/data/nativeContent';

const TYPE_COLORS: Record<string, string> = {
  headline: '#0ea5e9',
  lyrics: '#a855f7',
  dialogue: '#f97316',
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

export default function NativeContentDetailScreen() {
  const { contentId } = useLocalSearchParams<{ contentId: string }>();
  const insets = useSafeAreaInsets();
  const { markLessonComplete, completedLessons } = useAppStore();
  const [revealedLines, setRevealedLines] = useState<Set<number>>(new Set());

  const content = getContentById(contentId);
  if (!content) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.errorText}>Content not found</Text>
      </View>
    );
  }

  const lessonKey = 'native_' + content.id;
  const isCompleted = !!completedLessons[lessonKey];
  const typeColor = TYPE_COLORS[content.type] || '#64748b';
  const typeIcon = TYPE_ICONS[content.type] || 'document-text';
  const levelColor = LEVEL_COLORS[content.level] || '#64748b';

  const toggleTranslation = (index: number) => {
    setRevealedLines((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  const handleMarkRead = () => {
    markLessonComplete(lessonKey, 100);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: insets.bottom + spacing.xxxl }} showsVerticalScrollIndicator={false}>
      {/* Content Header */}
      <View style={styles.headerSection}>
        <View style={styles.headerBadges}>
          <View style={[styles.typeBadge, { backgroundColor: typeColor + '15' }]}>
            <Ionicons name={typeIcon as any} size={14} color={typeColor} />
            <Text style={[styles.typeBadgeText, { color: typeColor }]}>
              {content.type.charAt(0).toUpperCase() + content.type.slice(1)}
            </Text>
          </View>
          <View style={[styles.levelBadge, { backgroundColor: levelColor + '15' }]}>
            <Text style={[styles.levelBadgeText, { color: levelColor }]}>
              {content.level.charAt(0).toUpperCase() + content.level.slice(1)}
            </Text>
          </View>
        </View>

        <Text style={styles.contentTitle}>{content.title}</Text>
        <Text style={styles.contentTitleKorean}>{content.titleKorean}</Text>
        <Text style={styles.contentSource}>{content.source}</Text>
      </View>

      {/* Lines */}
      <View style={styles.linesContainer}>
        {content.lines.map((line, index) => (
          <Card key={index} variant="elevated" style={styles.lineCard}>
            <View style={styles.lineNumber}>
              <Text style={styles.lineNumberText}>{index + 1}</Text>
            </View>

            {/* Korean Text */}
            <View style={styles.koreanRow}>
              <Text style={styles.koreanText}>{line.korean}</Text>
              <AudioButton text={line.korean} size="sm" color={typeColor} />
            </View>

            {/* Romanization */}
            <Text style={styles.romanization}>{line.romanization}</Text>

            {/* Translation Toggle */}
            <TouchableOpacity
              onPress={() => toggleTranslation(index)}
              style={styles.translationToggle}
              activeOpacity={0.7}
            >
              {revealedLines.has(index) ? (
                <Text style={styles.englishText}>{line.english}</Text>
              ) : (
                <View style={styles.showTranslationRow}>
                  <Ionicons name="eye-outline" size={14} color={colors.accent} />
                  <Text style={styles.showTranslationText}>Show translation</Text>
                </View>
              )}
            </TouchableOpacity>

            {/* Word Chips */}
            {line.words.length > 0 && (
              <View style={styles.wordChips}>
                {line.words.map((word, wIndex) => (
                  <View key={wIndex} style={styles.wordChip}>
                    <Text style={styles.wordKorean}>{word.korean}</Text>
                    <Text style={styles.wordEnglish}>{word.english}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Grammar Notes */}
            {line.grammarNotes && line.grammarNotes.length > 0 && (
              <View style={styles.grammarBox}>
                <View style={styles.grammarHeader}>
                  <Ionicons name="bulb" size={14} color="#f59e0b" />
                  <Text style={styles.grammarTitle}>Grammar</Text>
                </View>
                {line.grammarNotes.map((note, nIndex) => (
                  <Text key={nIndex} style={styles.grammarNote}>{note}</Text>
                ))}
              </View>
            )}
          </Card>
        ))}
      </View>

      {/* Mark as Read Button */}
      <View style={styles.bottomAction}>
        <TouchableOpacity
          onPress={handleMarkRead}
          style={[
            styles.markReadButton,
            isCompleted && styles.markReadButtonCompleted,
          ]}
          activeOpacity={0.7}
          disabled={isCompleted}
        >
          <Ionicons
            name={isCompleted ? 'checkmark-circle' : 'checkmark-circle-outline'}
            size={20}
            color="#fff"
          />
          <Text style={styles.markReadText}>
            {isCompleted ? 'Completed' : 'Mark as Read'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  centered: { alignItems: 'center', justifyContent: 'center' },
  errorText: {
    fontFamily: 'Jakarta-SemiBold',
    fontSize: 16,
    color: colors.textTertiary,
  },

  // Header
  headerSection: {
    paddingHorizontal: 24,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  headerBadges: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: borderRadius.pill,
  },
  typeBadgeText: {
    fontFamily: 'Jakarta-Bold',
    fontSize: 12,
    letterSpacing: 0.5,
  },
  levelBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: borderRadius.pill,
  },
  levelBadgeText: {
    fontFamily: 'Jakarta-Bold',
    fontSize: 12,
    letterSpacing: 0.5,
  },
  contentTitle: {
    fontFamily: 'Jakarta-ExtraBold',
    fontSize: 26,
    color: colors.textPrimary,
  },
  contentTitleKorean: {
    fontFamily: 'Jakarta-Medium',
    fontSize: 14,
    color: colors.textTertiary,
    marginTop: 4,
  },
  contentSource: {
    fontFamily: 'Jakarta-Regular',
    fontSize: 13,
    color: colors.textTertiary,
    marginTop: spacing.xs,
  },

  // Lines
  linesContainer: {
    paddingHorizontal: 20,
    paddingTop: spacing.lg,
    gap: spacing.md,
  },
  lineCard: {
    padding: spacing.lg,
  },
  lineNumber: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.surfaceLow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lineNumberText: {
    fontFamily: 'Jakarta-Bold',
    fontSize: 10,
    color: colors.textTertiary,
  },

  // Korean text row
  koreanRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xs,
    paddingRight: spacing.xxl,
  },
  koreanText: {
    fontFamily: 'Jakarta-Bold',
    fontSize: 20,
    color: colors.textPrimary,
    flex: 1,
    lineHeight: 30,
  },
  romanization: {
    fontFamily: 'Jakarta-Regular',
    fontSize: 13,
    color: colors.textTertiary,
    marginBottom: spacing.sm,
  },

  // Translation
  translationToggle: {
    marginBottom: spacing.md,
  },
  showTranslationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  showTranslationText: {
    fontFamily: 'Jakarta-SemiBold',
    fontSize: 13,
    color: colors.accent,
  },
  englishText: {
    fontFamily: 'Jakarta-Medium',
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },

  // Word Chips
  wordChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  wordChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.surfaceLow,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: borderRadius.pill,
  },
  wordKorean: {
    fontFamily: 'Jakarta-Bold',
    fontSize: 12,
    color: colors.textPrimary,
  },
  wordEnglish: {
    fontFamily: 'Jakarta-Regular',
    fontSize: 11,
    color: colors.textTertiary,
  },

  // Grammar Notes
  grammarBox: {
    backgroundColor: '#fef3c720',
    borderWidth: 1,
    borderColor: '#f59e0b20',
    borderRadius: borderRadius.md,
    padding: spacing.md,
    gap: spacing.xs,
  },
  grammarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: 2,
  },
  grammarTitle: {
    fontFamily: 'Jakarta-Bold',
    fontSize: 12,
    color: '#f59e0b',
  },
  grammarNote: {
    fontFamily: 'Jakarta-Medium',
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 18,
  },

  // Bottom Action
  bottomAction: {
    paddingHorizontal: 20,
    paddingTop: spacing.xl,
  },
  markReadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.primaryDark,
    paddingVertical: 16,
    borderRadius: borderRadius.lg,
    ...shadows.md,
  },
  markReadButtonCompleted: {
    backgroundColor: '#10b981',
  },
  markReadText: {
    fontFamily: 'Jakarta-Bold',
    fontSize: 16,
    color: '#fff',
  },
});

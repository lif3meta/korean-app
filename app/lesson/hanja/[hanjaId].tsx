import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, borderRadius, spacing, typography, shadows } from '@/lib/theme';
import { getHanjaById } from '@/data/hanja';
import { useAppStore } from '@/lib/store';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { AudioButton } from '@/components/common/AudioButton';

export default function HanjaDetailScreen() {
  const { hanjaId } = useLocalSearchParams<{ hanjaId: string }>();
  const hanja = getHanjaById(hanjaId);
  const { initSRSCard, srsCards } = useAppStore();

  if (!hanja) {
    return (
      <View style={styles.container}>
        <Text style={styles.notFound}>Hanja character not found</Text>
      </View>
    );
  }

  const allAdded = hanja.words.every((w) => srsCards[`hanja_${w.korean}`]);

  const handleLearnAll = () => {
    let added = 0;
    hanja.words.forEach((w) => {
      const cardId = `hanja_${w.korean}`;
      if (!srsCards[cardId]) {
        initSRSCard(cardId, 'vocab');
        added++;
      }
    });
    if (added > 0) {
      Alert.alert('Words Added', `${added} word${added > 1 ? 's' : ''} added to your review queue.`);
    } else {
      Alert.alert('Already Added', 'All words from this family are already in your review queue.');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 32 }}>
      <View style={styles.characterSection}>
        <View style={styles.characterCircle}>
          <Text style={styles.characterText}>{hanja.hanja}</Text>
        </View>
        <Text style={styles.koreanPronunciation}>{hanja.korean}</Text>
        <Text style={styles.meaning}>{hanja.meaning}</Text>
      </View>

      <Card variant="elevated" style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <Ionicons name="git-branch" size={20} color="#dc2626" />
          <Text style={styles.sectionTitle}>Word Family</Text>
          <View style={styles.countBadge}>
            <Text style={styles.countText}>{hanja.words.length}</Text>
          </View>
        </View>

        {hanja.words.map((word, i) => (
          <View
            key={i}
            style={[
              styles.wordRow,
              i < hanja.words.length - 1 && styles.wordRowBorder,
            ]}
          >
            <View style={styles.wordInfo}>
              <View style={styles.wordKoreanRow}>
                <Text style={styles.wordKorean}>{word.korean}</Text>
                <AudioButton text={word.korean} size="sm" />
              </View>
              <Text style={styles.wordEnglish}>{word.english}</Text>
              <Text style={styles.wordRomanization}>{word.romanization}</Text>
              <View style={styles.hanjaComposition}>
                <Text style={styles.hanjaCompText}>{word.hanjaComposition}</Text>
              </View>
            </View>
          </View>
        ))}
      </Card>

      <View style={styles.actionSection}>
        {allAdded ? (
          <View style={styles.addedBadge}>
            <Ionicons name="checkmark-circle" size={24} color={colors.success} />
            <Text style={styles.addedText}>All words in review queue</Text>
          </View>
        ) : (
          <Button
            title="Learn All Words"
            onPress={handleLearnAll}
            size="lg"
            icon={<Ionicons name="add-circle" size={20} color="#fff" />}
          />
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  notFound: { ...typography.body, color: colors.textSecondary, padding: spacing.xl },
  characterSection: {
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xl,
    gap: spacing.sm,
  },
  characterCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#fef2f2',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#fecaca',
    ...shadows.lg,
  },
  characterText: {
    fontSize: 56,
    color: '#dc2626',
  },
  koreanPronunciation: {
    fontSize: 28,
    fontFamily: 'Jakarta-ExtraBold',
    color: colors.textPrimary,
  },
  meaning: {
    fontSize: 16,
    fontFamily: 'Jakarta-Medium',
    color: colors.textSecondary,
  },
  sectionCard: {
    marginHorizontal: spacing.xl,
    marginBottom: spacing.lg,
    padding: spacing.lg,
    gap: spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Jakarta-Bold',
    color: colors.textPrimary,
    flex: 1,
  },
  countBadge: {
    backgroundColor: '#fef2f2',
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countText: {
    fontSize: 12,
    fontFamily: 'Jakarta-Bold',
    color: '#dc2626',
  },
  wordRow: {
    paddingVertical: spacing.md,
  },
  wordRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  wordInfo: {
    gap: spacing.xs,
  },
  wordKoreanRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  wordKorean: {
    fontSize: 22,
    color: colors.textPrimary,
    flex: 1,
  },
  wordEnglish: {
    fontSize: 14,
    fontFamily: 'Jakarta-SemiBold',
    color: colors.textSecondary,
  },
  wordRomanization: {
    fontSize: 12,
    fontFamily: 'Jakarta-Regular',
    color: colors.textTertiary,
    fontStyle: 'italic',
  },
  hanjaComposition: {
    backgroundColor: '#fef2f2',
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
    marginTop: spacing.xs,
  },
  hanjaCompText: {
    fontSize: 14,
    color: '#991b1b',
    fontFamily: 'Jakarta-Medium',
  },
  actionSection: {
    paddingHorizontal: spacing.xl,
    marginVertical: spacing.lg,
  },
  addedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    padding: spacing.lg,
    backgroundColor: colors.successBg,
    borderRadius: borderRadius.xl,
  },
  addedText: {
    ...typography.bodyBold,
    color: colors.success,
  },
});

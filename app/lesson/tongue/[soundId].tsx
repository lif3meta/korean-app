import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { colors, borderRadius, spacing, typography, shadows } from '@/lib/theme';
import { AudioButton } from '@/components/common/AudioButton';
import {
  getTonguePositionById,
  getSimilarSounds,
  TonguePosition,
} from '@/data/tonguePositions';

function getCategoryLabel(cat: TonguePosition['category']): string {
  switch (cat) {
    case 'basic_consonant': return 'Basic Consonant';
    case 'aspirated': return 'Aspirated';
    case 'tense': return 'Tense (Double)';
    case 'compound_vowel': return 'Compound Vowel';
    default: return 'Basic Vowel';
  }
}

function getTypeColor(item: TonguePosition): string {
  return item.type === 'consonant'
    ? colors.primary
    : item.type === 'double'
      ? colors.koreanRed
      : colors.secondary;
}

export default function SoundDetailScreen() {
  const { soundId } = useLocalSearchParams<{ soundId: string }>();
  const item = getTonguePositionById(soundId ?? '');

  if (!item) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Sound not found</Text>
      </View>
    );
  }

  const similarSounds = getSimilarSounds(item.id);
  const typeColor = getTypeColor(item);

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
      {/* Hero */}
      <View style={[styles.hero, { backgroundColor: typeColor + '10' }]}>
        <Text style={[styles.heroKorean, { color: typeColor }]}>{item.korean}</Text>
        <Text style={styles.heroRoman}>{item.romanization}</Text>
        <View style={[styles.heroBadge, { backgroundColor: typeColor + '20' }]}>
          <Text style={[styles.heroBadgeText, { color: typeColor }]}>{getCategoryLabel(item.category)}</Text>
        </View>
        <AudioButton text={item.korean} size="lg" color={typeColor} style={{ marginTop: spacing.md }} audioType="hangul_sound" />
      </View>

      <View style={styles.content}>
        {/* Quick guide — 3 key facts */}
        <View style={styles.quickGuide}>
          <View style={styles.guideItem}>
            <Ionicons name="ellipse-outline" size={18} color={colors.accent} />
            <View style={{ flex: 1 }}>
              <Text style={styles.guideLabel}>Lips</Text>
              <Text style={styles.guideValue}>{item.lipPosition}</Text>
            </View>
          </View>
          <View style={styles.guideDivider} />
          <View style={styles.guideItem}>
            <Ionicons name="fitness" size={18} color={colors.primary} />
            <View style={{ flex: 1 }}>
              <Text style={styles.guideLabel}>Tongue</Text>
              <Text style={styles.guideValue}>{item.tonguePosition}</Text>
            </View>
          </View>
          <View style={styles.guideDivider} />
          <View style={styles.guideItem}>
            <Ionicons name="language" size={18} color={colors.secondary} />
            <View style={{ flex: 1 }}>
              <Text style={styles.guideLabel}>Sounds like</Text>
              <Text style={styles.guideValue}>{item.similarEnglish}</Text>
            </View>
          </View>
        </View>

        {/* Tips */}
        {item.tips.length > 0 && (
          <View style={styles.tipsCard}>
            <Ionicons name="bulb" size={16} color={colors.warning} />
            <View style={{ flex: 1, gap: 4 }}>
              {item.tips.map((tip, idx) => (
                <Text key={idx} style={styles.tipText}>{tip}</Text>
              ))}
            </View>
          </View>
        )}

        {/* Practice */}
        <View style={styles.practiceCard}>
          <Text style={styles.practiceTitle}>Try it!</Text>
          <View style={styles.practiceButtons}>
            <View style={styles.practiceCol}>
              <AudioButton text={item.korean} size="lg" color={typeColor} audioType="hangul_sound" />
              <Text style={styles.practiceLabel}>Listen</Text>
            </View>
          </View>
        </View>

        {/* Example words */}
        <Text style={styles.sectionTitle}>Examples</Text>
        {item.examples.map((ex, idx) => (
          <View key={idx} style={styles.exampleRow}>
            <AudioButton text={ex.korean} size="sm" color={typeColor} />
            <View style={{ flex: 1 }}>
              <Text style={styles.exKorean}>{ex.korean}</Text>
              <Text style={styles.exRoman}>{ex.romanization}</Text>
            </View>
            <Text style={styles.exEnglish}>{ex.english}</Text>
          </View>
        ))}

        {/* Similar sounds */}
        {similarSounds.length > 0 && (
          <>
            <Text style={[styles.sectionTitle, { marginTop: spacing.xl }]}>Compare</Text>
            <View style={styles.similarGrid}>
              {[item, ...similarSounds].map((s) => {
                const sColor = getTypeColor(s);
                const isCurrent = s.id === item.id;
                return (
                  <TouchableOpacity
                    key={s.id}
                    style={[styles.similarCard, isCurrent && { borderColor: sColor, borderWidth: 2 }]}
                    onPress={() => { if (!isCurrent) router.push(`/lesson/tongue/${s.id}`); }}
                    activeOpacity={isCurrent ? 1 : 0.7}
                  >
                    <Text style={[styles.similarKorean, { color: sColor }]}>{s.korean}</Text>
                    <Text style={styles.similarRoman}>{s.romanization}</Text>
                    <AudioButton text={s.korean} size="sm" color={sColor} audioType="hangul_sound" />
                  </TouchableOpacity>
                );
              })}
            </View>
          </>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  errorText: { ...typography.body, color: colors.textSecondary, textAlign: 'center', marginTop: 60 },

  // Hero
  hero: { alignItems: 'center', paddingVertical: spacing.xxl, paddingHorizontal: spacing.xl },
  heroKorean: { fontSize: 72, fontFamily: 'Jakarta-ExtraBold' },
  heroRoman: { ...typography.title3, color: colors.textSecondary, marginTop: spacing.xs },
  heroBadge: { paddingHorizontal: spacing.lg, paddingVertical: spacing.xs, borderRadius: borderRadius.pill, marginTop: spacing.sm },
  heroBadgeText: { ...typography.caption, fontFamily: 'Jakarta-Bold' },

  content: { paddingHorizontal: spacing.xl },

  // Quick guide
  quickGuide: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    ...shadows.sm,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  guideItem: { flexDirection: 'row', gap: spacing.md, paddingVertical: spacing.sm, alignItems: 'flex-start' },
  guideLabel: { ...typography.caption, color: colors.textTertiary, fontFamily: 'Jakarta-Bold', textTransform: 'uppercase', letterSpacing: 0.5 },
  guideValue: { ...typography.footnote, color: colors.textPrimary, lineHeight: 20, marginTop: 2 },
  guideDivider: { height: 1, backgroundColor: colors.borderLight },

  // Tips
  tipsCard: {
    flexDirection: 'row',
    gap: spacing.sm,
    backgroundColor: colors.warmCream,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    alignItems: 'flex-start',
  },
  tipText: { ...typography.footnote, color: colors.textSecondary, lineHeight: 20 },

  // Practice
  practiceCard: {
    backgroundColor: colors.warmLavender,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  practiceTitle: { ...typography.title3, color: colors.textPrimary },
  practiceButtons: { flexDirection: 'row', gap: spacing.xxxl },
  practiceCol: { alignItems: 'center', gap: spacing.xs },
  practiceLabel: { ...typography.caption, color: colors.textTertiary },

  // Section
  sectionTitle: { ...typography.headline, color: colors.textPrimary, marginBottom: spacing.md },

  // Examples
  exampleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  exKorean: { ...typography.bodyBold, color: colors.textPrimary },
  exRoman: { ...typography.caption, color: colors.textTertiary },
  exEnglish: { ...typography.footnote, color: colors.textSecondary, textAlign: 'right', maxWidth: '35%' },

  // Similar sounds
  similarGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  similarCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    alignItems: 'center',
    gap: spacing.sm,
    minWidth: 90,
    flex: 1,
    ...shadows.sm,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  similarKorean: { fontSize: 32, fontFamily: 'Jakarta-ExtraBold' },
  similarRoman: { ...typography.caption, color: colors.textSecondary },
});

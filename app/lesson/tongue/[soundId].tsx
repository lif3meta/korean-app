import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
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

// ─── Large Mouth Diagram ────────────────────────────────────────────────────

function LargeMouthDiagram({
  item,
}: {
  item: TonguePosition;
}) {
  const w = 260;
  const h = 200;

  // Tongue positioning
  let tongueTop: number;
  switch (item.tongueHeight) {
    case 'high':
      tongueTop = 55;
      break;
    case 'mid':
      tongueTop = 95;
      break;
    case 'low':
    default:
      tongueTop = 130;
      break;
  }

  let tongueLeft: number;
  switch (item.tonguePlace) {
    case 'front':
      tongueLeft = 90;
      break;
    case 'center':
      tongueLeft = 58;
      break;
    case 'back':
    default:
      tongueLeft = 28;
      break;
  }

  const isRounded = item.lipShape === 'rounded';
  const isOpen = item.lipShape === 'open';
  const isSpread = item.lipShape === 'spread';

  const lipW = isRounded ? 18 : isSpread ? 10 : 14;
  const lipH = isRounded ? 55 : isOpen ? 75 : 35;

  const isVowel = item.type === 'vowel';

  // Airflow arrow properties
  let airflowLabel = '';
  switch (item.airflow) {
    case 'nasal':
      airflowLabel = 'Air through nose';
      break;
    case 'aspirated':
      airflowLabel = 'Strong air burst';
      break;
    case 'glottal':
      airflowLabel = 'Air from throat';
      break;
    case 'oral':
      airflowLabel = 'Air through mouth';
      break;
  }

  return (
    <View style={styles.diagramWrapper}>
      <View style={[styles.diagramContainer, { width: w, height: h }]}>
        {/* Mouth cavity */}
        <View style={styles.lgMouthCavity} />

        {/* Palate */}
        <View style={styles.lgPalate} />
        <Text style={styles.lgPalateLabel}>Palate</Text>

        {/* Teeth ridge */}
        <View style={styles.lgTeethRidge} />
        <Text style={styles.lgTeethLabel}>Alveolar{'\n'}Ridge</Text>

        {/* Velum / soft palate */}
        <View style={styles.lgVelum} />
        <Text style={styles.lgVelumLabel}>Velum</Text>

        {/* Tongue */}
        <View
          style={[
            styles.lgTongue,
            {
              left: tongueLeft,
              top: tongueTop,
            },
            isVowel && styles.lgTongueVowel,
          ]}
        />
        <View style={[styles.lgTongueLabel, { left: tongueLeft + 30, top: tongueTop - 18 }]}>
          <Text style={styles.lgLabelTextSmall}>Tongue</Text>
          <Ionicons name="arrow-down" size={10} color={colors.textTertiary} />
        </View>

        {/* Lip indicator */}
        <View
          style={[
            styles.lgLip,
            {
              width: lipW,
              height: lipH,
              top: (h - lipH) / 2,
            },
            isRounded && styles.lgLipRounded,
            isSpread && styles.lgLipSpread,
          ]}
        />
        <Text style={[styles.lgLipLabel, { top: (h - lipH) / 2 - 16 }]}>
          Lips: {isRounded ? 'Rounded' : isOpen ? 'Open' : isSpread ? 'Spread' : 'Neutral'}
        </Text>
      </View>

      {/* Airflow indicator */}
      {airflowLabel ? (
        <View style={styles.airflowBadge}>
          <Ionicons
            name={item.airflow === 'nasal' ? 'swap-vertical' : 'arrow-forward'}
            size={14}
            color={colors.secondary}
          />
          <Text style={styles.airflowText}>{airflowLabel}</Text>
        </View>
      ) : null}
    </View>
  );
}

// ─── Detail Screen ──────────────────────────────────────────────────────────

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

  const typeColor =
    item.type === 'consonant'
      ? colors.primary
      : item.type === 'double'
        ? colors.koreanRed
        : colors.secondary;

  const prompt = `simple medical diagram cross section of human mouth showing tongue position for Korean ${item.korean} ${item.sound} sound, clean minimal illustration, white background, labeled anatomy`;
  const pollinationsUri = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=200&height=200&nologo=true&model=flux`;

  // Build step-by-step instructions
  const steps: string[] = [];
  if (item.lipPosition) steps.push(`Lips: ${item.lipPosition}`);
  if (item.tonguePosition) steps.push(`Tongue: ${item.tonguePosition}`);
  if (item.airflow === 'nasal') steps.push('Let air flow out through your nose.');
  if (item.airflow === 'aspirated') steps.push('Release with a strong puff of air.');
  if (item.airflow === 'glottal') steps.push('The sound originates from the throat/glottis.');
  if (item.airflow === 'oral') steps.push('Release air through the mouth.');
  if (item.similarEnglish) steps.push(`Target sound: ${item.similarEnglish}`);

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
      {/* Hero */}
      <View style={[styles.hero, { backgroundColor: typeColor + '10' }]}>
        <Text style={[styles.heroKorean, { color: typeColor }]}>{item.korean}</Text>
        <Text style={styles.heroRomanization}>{item.romanization}</Text>
        <View style={[styles.heroBadge, { backgroundColor: typeColor + '20' }]}>
          <Text style={[styles.heroBadgeText, { color: typeColor }]}>
            {item.category === 'basic_consonant'
              ? 'Basic Consonant'
              : item.category === 'aspirated'
                ? 'Aspirated Consonant'
                : item.category === 'tense'
                  ? 'Tense (Double) Consonant'
                  : item.category === 'compound_vowel'
                    ? 'Compound Vowel'
                    : 'Basic Vowel'}
          </Text>
        </View>
        <AudioButton text={item.korean} size="lg" color={typeColor} style={{ marginTop: spacing.md }} />
      </View>

      <View style={styles.content}>
        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How to Say It</Text>
          <Text style={styles.descText}>{item.description}</Text>
        </View>

        {/* Mouth Diagram */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mouth Position</Text>
          <LargeMouthDiagram item={item} />
        </View>

        {/* Pollinations illustration */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Illustration</Text>
          <Image
            source={{ uri: pollinationsUri }}
            style={styles.illustrationImage}
            resizeMode="cover"
          />
        </View>

        {/* Step-by-step */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Step-by-Step</Text>
          {steps.map((step, idx) => (
            <View key={idx} style={styles.stepRow}>
              <View style={[styles.stepCircle, { backgroundColor: typeColor }]}>
                <Text style={styles.stepNumber}>{idx + 1}</Text>
              </View>
              <Text style={styles.stepText}>{step}</Text>
            </View>
          ))}
        </View>

        {/* Tongue & Lip Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Details</Text>
          <View style={styles.detailCard}>
            <View style={styles.detailItem}>
              <Ionicons name="fitness" size={18} color={colors.primary} />
              <View style={styles.detailItemContent}>
                <Text style={styles.detailItemLabel}>Tongue Position</Text>
                <Text style={styles.detailItemValue}>{item.tonguePosition}</Text>
              </View>
            </View>
            <View style={styles.detailDivider} />
            <View style={styles.detailItem}>
              <Ionicons name="ellipse-outline" size={18} color={colors.accent} />
              <View style={styles.detailItemContent}>
                <Text style={styles.detailItemLabel}>Lip Position</Text>
                <Text style={styles.detailItemValue}>{item.lipPosition}</Text>
              </View>
            </View>
            <View style={styles.detailDivider} />
            <View style={styles.detailItem}>
              <Ionicons name="language" size={18} color={colors.secondary} />
              <View style={styles.detailItemContent}>
                <Text style={styles.detailItemLabel}>Similar English Sound</Text>
                <Text style={styles.detailItemValue}>{item.similarEnglish}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Tips */}
        {item.tips.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tips & Common Mistakes</Text>
            <View style={styles.tipsCard}>
              {item.tips.map((tip, idx) => (
                <View key={idx} style={styles.tipItem}>
                  <Ionicons name="bulb" size={14} color={colors.warning} />
                  <Text style={styles.tipItemText}>{tip}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Practice */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Practice</Text>
          <View style={styles.practiceCard}>
            <Text style={styles.practiceEmoji}>🎤</Text>
            <Text style={styles.practiceTitle}>Try it!</Text>
            <Text style={styles.practiceSubtitle}>
              Listen to the sound, then try saying it yourself. Pay attention to your tongue and lip position.
            </Text>
            <View style={styles.practiceButtons}>
              <AudioButton text={item.korean} size="lg" color={typeColor} />
              <AudioButton text={item.korean} size="lg" color={colors.secondary} slow />
            </View>
            <View style={styles.practiceLabels}>
              <Text style={styles.practiceLabel}>Normal</Text>
              <Text style={styles.practiceLabel}>Slow</Text>
            </View>
          </View>
        </View>

        {/* Example words */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Example Words</Text>
          {item.examples.map((ex, idx) => (
            <View key={idx} style={styles.exampleCard}>
              <View style={styles.exampleLeft}>
                <AudioButton text={ex.korean} size="sm" color={typeColor} />
                <View style={styles.exampleInfo}>
                  <Text style={styles.exampleKorean}>{ex.korean}</Text>
                  <Text style={styles.exampleRoman}>{ex.romanization}</Text>
                </View>
              </View>
              <Text style={styles.exampleEnglish}>{ex.english}</Text>
            </View>
          ))}
        </View>

        {/* Similar sounds comparison */}
        {similarSounds.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Similar Sounds</Text>
            <Text style={styles.similarSubtitle}>
              Compare {item.korean} with related sounds to hear the difference
            </Text>
            <View style={styles.similarGrid}>
              {[item, ...similarSounds].map((s) => {
                const sColor =
                  s.type === 'consonant'
                    ? colors.primary
                    : s.type === 'double'
                      ? colors.koreanRed
                      : colors.secondary;
                const isCurrentItem = s.id === item.id;
                return (
                  <TouchableOpacity
                    key={s.id}
                    style={[
                      styles.similarCard,
                      isCurrentItem && { borderColor: sColor, borderWidth: 2 },
                    ]}
                    onPress={() => {
                      if (!isCurrentItem) {
                        router.push(`/lesson/tongue/${s.id}`);
                      }
                    }}
                    activeOpacity={isCurrentItem ? 1 : 0.7}
                  >
                    <Text style={[styles.similarKorean, { color: sColor }]}>{s.korean}</Text>
                    <Text style={styles.similarRoman}>{s.romanization}</Text>
                    <AudioButton text={s.korean} size="sm" color={sColor} />
                    <Text style={styles.similarCategory} numberOfLines={1}>
                      {s.category === 'basic_consonant'
                        ? 'Lax'
                        : s.category === 'aspirated'
                          ? 'Aspirated'
                          : s.category === 'tense'
                            ? 'Tense'
                            : s.category === 'compound_vowel'
                              ? 'Compound'
                              : 'Basic'}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

// ─── Styles ─────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  errorText: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 60,
  },

  // Hero
  hero: {
    alignItems: 'center',
    paddingVertical: spacing.xxxl,
    paddingHorizontal: spacing.xl,
  },
  heroKorean: {
    fontSize: 80,
    fontFamily: 'Jakarta-ExtraBold',
  },
  heroRomanization: {
    ...typography.title3,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  heroBadge: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.pill,
    marginTop: spacing.sm,
  },
  heroBadgeText: {
    ...typography.caption,
    fontFamily: 'Jakarta-Bold',
  },

  content: {
    paddingHorizontal: spacing.xl,
  },
  section: {
    marginBottom: spacing.xxl,
  },
  sectionTitle: {
    ...typography.headline,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  descText: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 24,
  },

  // Diagram
  diagramWrapper: {
    alignItems: 'center',
    gap: spacing.md,
  },
  diagramContainer: {
    position: 'relative',
    backgroundColor: colors.surfaceLow,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
  },
  lgMouthCavity: {
    position: 'absolute',
    width: 220,
    height: 170,
    backgroundColor: '#fce4ec',
    borderRadius: 28,
    left: 30,
    top: 15,
  },
  lgPalate: {
    position: 'absolute',
    width: 200,
    height: 35,
    backgroundColor: '#c9b0b0',
    borderTopLeftRadius: 60,
    borderTopRightRadius: 60,
    left: 40,
    top: 15,
  },
  lgPalateLabel: {
    position: 'absolute',
    ...typography.caption,
    color: colors.textTertiary,
    left: 110,
    top: 22,
  },
  lgTeethRidge: {
    position: 'absolute',
    width: 28,
    height: 12,
    backgroundColor: '#e8d8d8',
    borderRadius: 6,
    right: 40,
    top: 45,
  },
  lgTeethLabel: {
    position: 'absolute',
    fontSize: 8,
    fontFamily: 'Jakarta-Medium',
    color: colors.textTertiary,
    right: 28,
    top: 58,
    textAlign: 'center',
  },
  lgVelum: {
    position: 'absolute',
    width: 28,
    height: 20,
    backgroundColor: '#d4b5b5',
    borderRadius: 10,
    left: 40,
    top: 30,
  },
  lgVelumLabel: {
    position: 'absolute',
    fontSize: 8,
    fontFamily: 'Jakarta-Medium',
    color: colors.textTertiary,
    left: 30,
    top: 52,
  },
  lgTongue: {
    position: 'absolute',
    width: 140,
    height: 36,
    backgroundColor: '#e57373',
    borderRadius: 18,
  },
  lgTongueVowel: {
    backgroundColor: '#4db6ac',
  },
  lgTongueLabel: {
    position: 'absolute',
    alignItems: 'center',
  },
  lgLabelTextSmall: {
    fontSize: 8,
    fontFamily: 'Jakarta-Bold',
    color: colors.textTertiary,
  },
  lgLip: {
    position: 'absolute',
    left: 0,
    backgroundColor: '#d4726a',
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
  lgLipRounded: {
    backgroundColor: '#c62828',
    borderRadius: 999,
  },
  lgLipSpread: {
    backgroundColor: '#ef9a9a',
  },
  lgLipLabel: {
    position: 'absolute',
    left: 4,
    fontSize: 8,
    fontFamily: 'Jakarta-Bold',
    color: colors.textTertiary,
  },
  airflowBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.warmMint,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.pill,
  },
  airflowText: {
    ...typography.caption,
    color: colors.secondary,
    fontFamily: 'Jakarta-SemiBold',
  },

  // Illustration
  illustrationImage: {
    width: '100%',
    height: 200,
    borderRadius: borderRadius.xl,
    backgroundColor: colors.surfaceLow,
  },

  // Steps
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  stepCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  stepNumber: {
    fontSize: 12,
    fontFamily: 'Jakarta-Bold',
    color: '#fff',
  },
  stepText: {
    ...typography.body,
    color: colors.textSecondary,
    flex: 1,
    lineHeight: 22,
  },

  // Detail card
  detailCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    ...shadows.sm,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  detailItem: {
    flexDirection: 'row',
    gap: spacing.md,
    paddingVertical: spacing.sm,
  },
  detailItemContent: {
    flex: 1,
  },
  detailItemLabel: {
    ...typography.caption,
    color: colors.textTertiary,
    fontFamily: 'Jakarta-Bold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  detailItemValue: {
    ...typography.footnote,
    color: colors.textPrimary,
    lineHeight: 20,
    marginTop: 2,
  },
  detailDivider: {
    height: 1,
    backgroundColor: colors.borderLight,
  },

  // Tips
  tipsCard: {
    backgroundColor: colors.warmCream,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    gap: spacing.md,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  tipItemText: {
    ...typography.footnote,
    color: colors.textSecondary,
    flex: 1,
    lineHeight: 20,
  },

  // Practice
  practiceCard: {
    backgroundColor: colors.warmLavender,
    borderRadius: borderRadius.xl,
    padding: spacing.xxl,
    alignItems: 'center',
    gap: spacing.sm,
  },
  practiceEmoji: {
    fontSize: 36,
  },
  practiceTitle: {
    ...typography.title3,
    color: colors.textPrimary,
  },
  practiceSubtitle: {
    ...typography.footnote,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  practiceButtons: {
    flexDirection: 'row',
    gap: spacing.xxl,
    marginTop: spacing.md,
  },
  practiceLabels: {
    flexDirection: 'row',
    gap: spacing.huge,
  },
  practiceLabel: {
    ...typography.caption,
    color: colors.textTertiary,
  },

  // Examples
  exampleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.sm,
    ...shadows.sm,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  exampleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    flex: 1,
  },
  exampleInfo: {
    gap: 2,
  },
  exampleKorean: {
    ...typography.bodyBold,
    color: colors.textPrimary,
  },
  exampleRoman: {
    ...typography.caption,
    color: colors.textTertiary,
  },
  exampleEnglish: {
    ...typography.footnote,
    color: colors.textSecondary,
    textAlign: 'right',
    maxWidth: '40%',
  },

  // Similar sounds
  similarSubtitle: {
    ...typography.footnote,
    color: colors.textSecondary,
    marginTop: -spacing.sm,
    marginBottom: spacing.md,
  },
  similarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
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
  similarKorean: {
    fontSize: 36,
    fontFamily: 'Jakarta-ExtraBold',
  },
  similarRoman: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  similarCategory: {
    fontSize: 9,
    fontFamily: 'Jakarta-Bold',
    color: colors.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});

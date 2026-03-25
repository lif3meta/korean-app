import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, borderRadius, spacing, typography, shadows } from '@/lib/theme';
import { useAppStore } from '@/lib/store';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { getGreeting } from '@/lib/utils';
import { getLevelFromXP, getLevelTitle } from '@/lib/xp';
import { allHangul } from '@/data/hangul';
import { vocabulary } from '@/data/vocabulary';
import { grammarLessons } from '@/data/grammar';

const MASCOT_IMAGE = require('@/assets/images/sloth-mascot.png');

const CULTURE_TIPS = [
  "In Korea, age matters in language! You use different words depending on your gender and your relationship to the person.",
  "Koreans bow when greeting. A slight bow (15°) is casual; a deep bow (45°) shows great respect.",
  "In Korean, '밥' (rice) also means 'meal'. Asking '밥 먹었어?' (Did you eat?) is like saying 'How are you?'",
  "Koreans count age differently! You're 1 year old at birth, and everyone ages up on New Year's Day (Korean age).",
  "In Korea, you never pour your own drink. You pour for others and they pour for you — it's about respect.",
  "Korean has speech levels. 존댓말 (formal) is for elders and strangers; 반말 (casual) is for close friends.",
  "Shoes off! Koreans always remove shoes before entering a home. It's considered very rude to keep them on.",
  "The number 4 (사/sa) sounds like 'death' in Korean. Many buildings skip the 4th floor!",
  "In Korea, writing someone's name in red ink is taboo — it's associated with death and funerals.",
  "Koreans celebrate 100 days (백일/baegil) of a relationship. Couples exchange gifts and go on special dates!",
  "In Korea, blood type is believed to determine personality. Type A = organized, Type B = creative, Type O = confident.",
  "Korean BBQ etiquette: the youngest grills the meat, and the eldest takes the first bite.",
  "'눈치' (nunchi) is a core Korean concept — the ability to read the room and understand unspoken feelings.",
  "In Korea, you receive and give things with both hands, especially to elders. It shows respect.",
  "The Korean alphabet (한글/Hangul) was invented by King Sejong in 1443 to promote literacy among common people.",
  "In Korea, '선배' (seonbae) means senior and '후배' (hubae) means junior — these relationships are very important.",
  "Koreans often say '파이팅!' (fighting!) to cheer someone on. It means 'You can do it!'",
  "In Korean culture, the eldest person at the table eats first. Younger people wait before starting their meal.",
];

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Explore track data
const TRACKS = [
  { id: 'hangul', label: 'Hangul', icon: 'text' as const, bg: colors.warmPink, color: '#ec4899', route: '/lesson/hangul/' },
  { id: 'vocab', label: 'Vocabulary', icon: 'book' as const, bg: colors.warmMint, color: '#10b981', route: '/lesson/vocab/' },
  { id: 'grammar', label: 'Grammar', icon: 'pencil' as const, bg: colors.warmLavender, color: '#8b5cf6', route: '/lesson/grammar/' },
  { id: 'culture', label: 'Culture', icon: 'globe' as const, bg: colors.warmCream, color: '#f59e0b', route: '/lesson/culture/' },
  { id: 'reading', label: 'Reading', icon: 'reader' as const, bg: '#f0f4ff', color: '#3b82f6', route: '/lesson/reading/' },
  { id: 'pronunciation', label: 'Speaking', icon: 'mic' as const, bg: '#fff0f0', color: '#ef4444', route: '/lesson/pronunciation/' },
];

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { userName, totalXP, currentStreak, learnedCharacters, learnedWords, getDueCards, completedLessons } = useAppStore();
  const dueCards = getDueCards();
  const level = getLevelFromXP(totalXP);
  const levelTitle = getLevelTitle(level);
  const cultureTip = useMemo(() => CULTURE_TIPS[Math.floor(Math.random() * CULTURE_TIPS.length)], []);
  // Overall progress: characters + words + lessons
  const totalItems = allHangul.length + vocabulary.length + grammarLessons.length;
  const completedItems = learnedCharacters.length + learnedWords.length + Object.keys(completedLessons).length;
  const overallProgress = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

  // Determine next lesson to resume
  const nextGrammarLesson = grammarLessons.find((l) => !completedLessons[l.id]);

  return (
    <ScrollView
  style={styles.container}
  contentContainerStyle={{ paddingBottom: spacing.xxl }}
  showsVerticalScrollIndicator={false}
>
      {/* ===== HEADER ===== */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <View style={styles.headerRow}>
          <View style={styles.headerLeft}>
            <Image source={MASCOT_IMAGE} style={styles.headerAvatar} />
            <Text style={styles.headerBrand}>
  <Text style={styles.headerBrandItalic}>Lzy</Text>
  {' '}Learn Korean
</Text>
          </View>
          <TouchableOpacity
            onPress={() => router.push('/settings' as any)}
            style={styles.headerIconBtn}
            activeOpacity={0.7}
          >
            <Ionicons name="settings-outline" size={22} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.body}>
        {/* ===== WELCOME SECTION ===== */}
        <View style={styles.welcomeCard}>
          <View style={styles.welcomeTextArea}>
            <Text style={styles.welcomeGreeting}>
              Annyeong,{' '}
              <Text style={styles.welcomeNameAccent}>{userName || 'Learner'}!</Text>
            </Text>
            <View style={styles.levelPill}>
              <Ionicons name="shield-checkmark" size={12} color={colors.primary} />
              <Text style={styles.levelPillText}>Lv.{level} {levelTitle}</Text>
            </View>
            <Text style={styles.welcomeSub}>{getGreeting()} Ready to learn?</Text>
          </View>
          <Image source={MASCOT_IMAGE} style={styles.welcomeMascot} />
        </View>

        {/* ===== STATS ROW ===== */}
        <View style={styles.statsRow}>
          {/* Streak Card */}
          <View style={[styles.statsCard, styles.streakCard]}>
            <Text style={styles.statsLabel}>DAILY STREAK</Text>
            <View style={styles.streakContent}>
              <Ionicons name="flame" size={28} color={colors.warning} />
              <Text style={styles.streakNumber}>{currentStreak}</Text>
            </View>
            <Text style={styles.streakSuffix}>Day Streak</Text>
          </View>

          {/* Progress Ring Card */}
          <View style={[styles.statsCard, styles.progressCard]}>
            <Text style={styles.statsLabel}>OVERALL</Text>
            <ProgressRing
              progress={overallProgress}
              size={72}
              strokeWidth={7}
              color={colors.accent}
              bgColor={colors.primaryPale}
              showPercentage
            />
            <Text style={styles.progressSuffix}>Complete</Text>
          </View>
        </View>

        {/* ===== DUE REVIEWS PILL ===== */}
        {dueCards.length > 0 && (
          <TouchableOpacity
            onPress={() => router.push('/lesson/vocab/review')}
            activeOpacity={0.7}
            style={styles.reviewPill}
          >
            <View style={styles.reviewPillIcon}>
              <Ionicons name="refresh" size={18} color={colors.accent} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.reviewPillTitle}>{dueCards.length} cards due for review</Text>
              <Text style={styles.reviewPillSub}>Keep your memory fresh!</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
          </TouchableOpacity>
        )}

        {/* ===== RESUME LEARNING CARD ===== */}
        {nextGrammarLesson && (
          <>
            <Text style={styles.sectionTitle}>Resume Learning</Text>
            <TouchableOpacity
              onPress={() => router.push(`/lesson/grammar/${nextGrammarLesson.id}` as any)}
              activeOpacity={0.8}
              style={styles.resumeCard}
            >
              <View style={styles.resumeContent}>
                <Text style={styles.resumeLabel}>NEXT LESSON</Text>
                <Text style={styles.resumeTitle} numberOfLines={2}>{nextGrammarLesson.title}</Text>
                <Text style={styles.resumeDesc} numberOfLines={1}>{nextGrammarLesson.description}</Text>
                <View style={styles.resumeBtn}>
                  <Text style={styles.resumeBtnText}>Resume</Text>
                  <Ionicons name="play" size={14} color="#fff" />
                </View>
              </View>
              <Image
                source={MASCOT_IMAGE}
                style={styles.resumeImage}
              />
            </TouchableOpacity>
          </>
        )}

        {/* ===== EXPLORE TRACKS ===== */}
        <Text style={styles.sectionTitle}>Explore Tracks</Text>
        <View style={styles.tracksGrid}>
          {TRACKS.map((track) => (
            <TouchableOpacity
              key={track.id}
              onPress={() => router.push(track.route as any)}
              activeOpacity={0.7}
              style={[styles.trackCard, { backgroundColor: track.bg }]}
            >
              <View style={[styles.trackIconCircle, { backgroundColor: track.color + '18' }]}>
                <Ionicons name={track.icon} size={22} color={track.color} />
              </View>
              <Text style={[styles.trackName, { color: track.color }]}>{track.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ===== QUICK STATS DETAIL ===== */}
        <Text style={styles.sectionTitle}>Your Progress</Text>
        <View style={styles.progressDetailRow}>
          <View style={styles.progressDetailCard}>
            <Text style={styles.progressDetailNumber}>{learnedCharacters.length}</Text>
            <Text style={styles.progressDetailLabel}>CHARACTERS</Text>
            <Text style={styles.progressDetailSub}>of {allHangul.length}</Text>
          </View>
          <View style={styles.progressDetailCard}>
            <Text style={styles.progressDetailNumber}>{learnedWords.length}</Text>
            <Text style={styles.progressDetailLabel}>WORDS</Text>
            <Text style={styles.progressDetailSub}>of {vocabulary.length}</Text>
          </View>
          <View style={styles.progressDetailCard}>
            <Text style={styles.progressDetailNumber}>{Object.keys(completedLessons).length}</Text>
            <Text style={styles.progressDetailLabel}>LESSONS</Text>
            <Text style={styles.progressDetailSub}>of {grammarLessons.length}</Text>
          </View>
        </View>

        {/* ===== PARROT LEARNING CARD ===== */}
        <TouchableOpacity
          onPress={() => router.push('/sleep')}
          activeOpacity={0.8}
          style={styles.sleepCard}
        >
          <View style={styles.sleepIconWrap}>
            <Ionicons name="sync" size={22} color="#8b5cf6" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.sleepTitle}>Parrot Learning</Text>
            <Text style={styles.sleepSub}>Repeats phrases</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="rgba(255,255,255,0.5)" />
        </TouchableOpacity>

        {/* ===== QUICK ACTIONS: Dictionary & My Words ===== */}
        <View style={styles.quickRow}>
          <TouchableOpacity
            onPress={() => router.push('/dictionary')}
            activeOpacity={0.7}
            style={styles.quickCard}
          >
            <View style={[styles.quickIcon, { backgroundColor: '#f3f0ff' }]}>
              <Ionicons name="search" size={20} color="#7C4DFF" />
            </View>
            <Text style={styles.quickTitle}>Dictionary</Text>
            <Text style={styles.quickSub}>Search words</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push('/my-words')}
            activeOpacity={0.7}
            style={styles.quickCard}
          >
            <View style={[styles.quickIcon, { backgroundColor: colors.warmCream }]}>
              <Ionicons name="bookmark" size={20} color="#f59e0b" />
            </View>
            <Text style={styles.quickTitle}>My Words</Text>
            <Text style={styles.quickSub}>Saved vocabulary</Text>
          </TouchableOpacity>
        </View>

        {/* ===== CULTURE TIP ===== */}
        <View style={styles.tipCard}>
          <View style={styles.tipHeader}>
            <Ionicons name="bulb" size={18} color={colors.warning} />
            <Text style={styles.tipTitle}>Korean Culture Tip</Text>
          </View>
          <Text style={styles.tipText}>
            {cultureTip}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const CARD_GAP = spacing.md;

const styles = StyleSheet.create({
  // ── Container ──
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  // ── Header ──
  header: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  headerAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primaryPale,
  },
  headerBrand: {
    fontSize: 18,
    fontFamily: 'Jakarta-Bold',
    color: colors.textPrimary,
  },
  headerBrandItalic: {
    fontFamily: 'Jakarta-ExtraBold',
    fontStyle: 'italic',
    color: colors.accent,
  },
  headerIconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surfaceLow,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── Body ──
  body: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    gap: spacing.lg,
  },

  // ── Welcome ──
  welcomeCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xxxl,
    padding: spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    ...shadows.sm,
  },
  welcomeTextArea: {
    flex: 1,
    gap: spacing.xs,
  },
  welcomeGreeting: {
    fontSize: 26,
    fontFamily: 'Jakarta-ExtraBold',
    color: colors.textPrimary,
    letterSpacing: -0.3,
  },
  welcomeNameAccent: {
    color: colors.accent,
  },
  levelPill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 4,
    backgroundColor: colors.primaryPale,
    paddingVertical: 3,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.full,
    marginTop: 2,
  },
  levelPillText: {
    fontSize: 11,
    fontFamily: 'Jakarta-SemiBold',
    color: colors.primary,
  },
  welcomeSub: {
    fontSize: 14,
    fontFamily: 'Jakarta-Regular',
    color: colors.textTertiary,
    marginTop: 2,
  },
  welcomeMascot: {
    width: 90,
    height: 90,
    borderRadius: 20,
    backgroundColor: colors.primaryFaint,
    marginLeft: spacing.md,
  },

  // ── Stats Row ──
  statsRow: {
    flexDirection: 'row',
    gap: CARD_GAP,
  },
  statsCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xxl,
    padding: spacing.lg,
    alignItems: 'center',
    gap: spacing.xs,
    ...shadows.sm,
  },
  streakCard: {},
  progressCard: {},
  statsLabel: {
    fontSize: 10,
    fontFamily: 'Jakarta-Bold',
    letterSpacing: 1.5,
    color: colors.textTertiary,
    textTransform: 'uppercase',
  },
  streakContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  streakNumber: {
    fontSize: 36,
    fontFamily: 'Jakarta-ExtraBold',
    color: colors.textPrimary,
    letterSpacing: -1,
  },
  streakSuffix: {
    fontSize: 12,
    fontFamily: 'Jakarta-Medium',
    color: colors.textTertiary,
  },
  progressSuffix: {
    fontSize: 12,
    fontFamily: 'Jakarta-Medium',
    color: colors.textTertiary,
    marginTop: -2,
  },

  // ── Review Pill ──
  reviewPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xxl,
    padding: spacing.lg,
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colors.accentLight,
    ...shadows.sm,
  },
  reviewPillIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.accentLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reviewPillTitle: {
    fontSize: 14,
    fontFamily: 'Jakarta-SemiBold',
    color: colors.textPrimary,
  },
  reviewPillSub: {
    fontSize: 12,
    fontFamily: 'Jakarta-Regular',
    color: colors.textTertiary,
    marginTop: 1,
  },

  // ── Section Title ──
  sectionTitle: {
    ...typography.title3,
    color: colors.textPrimary,
    marginTop: spacing.sm,
  },

  // ── Resume Card ──
  resumeCard: {
    backgroundColor: '#0f172a',
    borderRadius: 40,
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.xl,
    overflow: 'hidden',
    ...shadows.md,
  },
  resumeContent: {
    flex: 1,
    gap: spacing.xs,
  },
  resumeLabel: {
    fontSize: 10,
    fontFamily: 'Jakarta-Bold',
    letterSpacing: 1.5,
    color: 'rgba(255,255,255,0.5)',
    textTransform: 'uppercase',
  },
  resumeTitle: {
    fontSize: 18,
    fontFamily: 'Jakarta-Bold',
    color: '#fff',
  },
  resumeDesc: {
    fontSize: 13,
    fontFamily: 'Jakarta-Regular',
    color: 'rgba(255,255,255,0.5)',
  },
  resumeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    backgroundColor: colors.accent,
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: borderRadius.full,
    marginTop: spacing.sm,
  },
  resumeBtnText: {
    fontSize: 14,
    fontFamily: 'Jakarta-Bold',
    color: '#fff',
  },
  resumeImage: {
    width: 90,
    height: 90,
    borderRadius: 18,
    marginLeft: spacing.md,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },

  // ── Explore Tracks ──
  tracksGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: CARD_GAP,
  },
  trackCard: {
    width: (SCREEN_WIDTH - spacing.xl * 2 - CARD_GAP) / 2,
    borderRadius: borderRadius.xxl,
    padding: spacing.lg,
    alignItems: 'center',
    gap: spacing.sm,
    ...shadows.sm,
  },
  trackIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trackName: {
    fontSize: 13,
    fontFamily: 'Jakarta-Bold',
  },

  // ── Progress Detail ──
  progressDetailRow: {
    flexDirection: 'row',
    gap: CARD_GAP,
  },
  progressDetailCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xxl,
    padding: spacing.md,
    alignItems: 'center',
    gap: 2,
    ...shadows.sm,
  },
  progressDetailNumber: {
    fontSize: 24,
    fontFamily: 'Jakarta-ExtraBold',
    color: colors.accent,
    letterSpacing: -0.5,
  },
  progressDetailLabel: {
    fontSize: 10,
    fontFamily: 'Jakarta-Bold',
    letterSpacing: 1.2,
    color: colors.textTertiary,
    textTransform: 'uppercase',
  },
  progressDetailSub: {
    fontSize: 11,
    fontFamily: 'Jakarta-Regular',
    color: colors.textTertiary,
  },

  // ── Sleep Card ──
  sleepCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0f172a',
    borderRadius: borderRadius.xxxl,
    padding: spacing.lg,
    gap: spacing.md,
  },
  sleepIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(139,92,246,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sleepTitle: {
    fontSize: 15,
    fontFamily: 'Jakarta-Bold',
    color: '#fff',
  },
  sleepSub: {
    fontSize: 12,
    fontFamily: 'Jakarta-Regular',
    color: 'rgba(255,255,255,0.5)',
  },

  // ── Quick Actions ──
  quickRow: {
    flexDirection: 'row',
    gap: CARD_GAP,
  },
  quickCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xxl,
    padding: spacing.lg,
    alignItems: 'center',
    gap: spacing.xs,
    ...shadows.sm,
  },
  quickIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickTitle: {
    fontSize: 14,
    fontFamily: 'Jakarta-Bold',
    color: colors.textPrimary,
  },
  quickSub: {
    fontSize: 11,
    fontFamily: 'Jakarta-Regular',
    color: colors.textTertiary,
  },

  // ── Tip Card ──
  tipCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xxl,
    padding: spacing.lg,
    gap: spacing.sm,
    ...shadows.sm,
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  tipTitle: {
    fontSize: 13,
    fontFamily: 'Jakarta-Bold',
    color: colors.warning,
  },
  tipText: {
    fontSize: 13,
    fontFamily: 'Jakarta-Regular',
    color: colors.textSecondary,
    lineHeight: 20,
  },
});

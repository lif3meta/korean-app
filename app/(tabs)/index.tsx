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
import { getToday } from '@/lib/utils';
import { learningPaths, getPathById } from '@/data/learningPaths';

const APP_ICON = require('@/assets/icon.png');
const GREETING_IMAGE = require('@/assets/images/sloth-speaking.png');
const RESUME_IMAGE = require('@/assets/images/sloth-grammar.png');

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
  { id: 'hangul', label: 'Hangul', icon: 'text' as const, bg: colors.warmPink, color: '#ec4899', route: '/lesson/hangul' },
  { id: 'vocab', label: 'Vocabulary', icon: 'book' as const, bg: colors.warmMint, color: '#10b981', route: '/lesson/vocab' },
  { id: 'grammar', label: 'Grammar', icon: 'pencil' as const, bg: colors.warmLavender, color: '#8b5cf6', route: '/lesson/grammar' },
  { id: 'culture', label: 'Culture', icon: 'globe' as const, bg: colors.warmCream, color: '#f59e0b', route: '/lesson/culture' },
  { id: 'reading', label: 'Reading', icon: 'reader' as const, bg: '#f0f4ff', color: '#3b82f6', route: '/lesson/reading' },
  { id: 'pronunciation', label: 'Speaking', icon: 'mic' as const, bg: '#fff0f0', color: '#ef4444', route: '/lesson/pronunciation' },
];

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { userName, totalXP, currentStreak, learnedCharacters, learnedWords, getDueCards, completedLessons, dailySessions, dailyGoalMinutes, selectedPath } = useAppStore();
  const dueCards = getDueCards();
  const today = getToday();
  const todaySession = dailySessions[today];
  const dailyCompleted = todaySession?.completed || false;
  const level = getLevelFromXP(totalXP);
  const levelTitle = getLevelTitle(level);
  const cultureTip = useMemo(() => CULTURE_TIPS[Math.floor(Math.random() * CULTURE_TIPS.length)], []);
  // Overall progress: characters + words + lessons
  const totalItems = allHangul.length + vocabulary.length + grammarLessons.length;
  const completedItems = learnedCharacters.length + learnedWords.length + Object.keys(completedLessons).length;
  const overallProgress = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

  // Determine next lesson to resume
  const nextGrammarLesson = grammarLessons.find((l) => !completedLessons[l.id]);

  // Learning path progress
  const currentPath = selectedPath ? getPathById(selectedPath) : null;
  const pathProgress = useMemo(() => {
    if (!currentPath) return null;
    const isLessonDone = (id: string) => {
      if (id === 'hangul') return learnedCharacters.length >= allHangul.length;
      return !!completedLessons[id];
    };
    let totalLessons = 0;
    let doneLessons = 0;
    let currentStageIdx = 0;
    for (let i = 0; i < currentPath.stages.length; i++) {
      const stage = currentPath.stages[i];
      const stageDone = stage.lessons.every(isLessonDone);
      const stageCount = stage.lessons.filter(isLessonDone).length;
      totalLessons += stage.lessons.length;
      doneLessons += stageCount;
      if (stageDone && i < currentPath.stages.length - 1) currentStageIdx = i + 1;
    }
    const currentStage = currentPath.stages[currentStageIdx];
    const stageProgress = currentStage.lessons.filter(isLessonDone).length;
    return {
      percent: totalLessons > 0 ? Math.round((doneLessons / totalLessons) * 100) : 0,
      currentStageIdx,
      currentStage,
      stageProgress,
      stageTotal: currentStage.lessons.length,
      totalLessons,
      doneLessons,
    };
  }, [currentPath, completedLessons, learnedCharacters.length]);

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
            <Image source={APP_ICON} style={styles.headerAvatar} />
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
          <Image source={GREETING_IMAGE} style={styles.welcomeMascot} />
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

        {/* ===== DAILY REVIEW CTA ===== */}
        <TouchableOpacity
          onPress={() => router.push('/daily' as any)}
          activeOpacity={0.8}
          style={styles.dailyCard}
        >
          <View style={styles.dailyContent}>
            <Text style={styles.dailyLabel}>{dailyCompleted ? 'COMPLETED' : 'DAILY REVIEW'}</Text>
            <Text style={styles.dailyTitle}>
              {dailyCompleted ? 'Great job today!' : 'Review & practice'}
            </Text>
            <Text style={styles.dailyDesc}>
              {dailyCompleted
                ? 'Come back tomorrow for more'
                : `~${dailyGoalMinutes} min — vocab, listening & quizzes`}
            </Text>
            {!dailyCompleted && (
              <View style={styles.dailyBtn}>
                <Text style={styles.dailyBtnText}>Start</Text>
                <Ionicons name="play" size={14} color="#fff" />
              </View>
            )}
            {dailyCompleted && (
              <View style={[styles.dailyBtn, { backgroundColor: colors.success }]}>
                <Ionicons name="checkmark" size={16} color="#fff" />
                <Text style={styles.dailyBtnText}>Done</Text>
              </View>
            )}
          </View>
          <Image source={RESUME_IMAGE} style={styles.resumeImage} />
        </TouchableOpacity>

        {/* ===== CONTINUE LESSONS CARD ===== */}
        {nextGrammarLesson && (
          <>
            <Text style={styles.sectionTitle}>Continue Lessons</Text>
            <TouchableOpacity
              onPress={() => router.push(`/lesson/grammar/${nextGrammarLesson.id}` as any)}
              activeOpacity={0.8}
              style={styles.resumeCard}
            >
              <View style={styles.resumeContent}>
                <Text style={styles.resumeLabel}>UP NEXT IN GRAMMAR</Text>
                <Text style={styles.resumeTitle} numberOfLines={2}>{nextGrammarLesson.title}</Text>
                <Text style={styles.resumeDesc} numberOfLines={1}>{nextGrammarLesson.description}</Text>
                <View style={styles.resumeBtn}>
                  <Text style={styles.resumeBtnText}>Continue</Text>
                  <Ionicons name="play" size={14} color="#fff" />
                </View>
              </View>
              <Image
                source={RESUME_IMAGE}
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

        {/* ===== AUDIO LESSONS QUICK ACCESS ===== */}
        <TouchableOpacity
          onPress={() => router.push('/lesson/audio' as any)}
          activeOpacity={0.8}
          style={styles.audioPill}
        >
          <View style={styles.audioPillIcon}>
            <Ionicons name="headset" size={20} color="#6366f1" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.audioPillTitle}>Audio Lessons</Text>
            <Text style={styles.audioPillSub}>Podcast-style Korean — listen anywhere</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
        </TouchableOpacity>

        {/* ===== LEARNING PATH ===== */}
        <Text style={styles.sectionTitle}>{currentPath ? `Learning Path: ${currentPath.title}` : 'Learning Path'}</Text>
        {currentPath && pathProgress ? (
          <TouchableOpacity
            onPress={() => router.push(`/path/${currentPath.id}` as any)}
            activeOpacity={0.8}
            style={styles.pathCard}
          >
            <View style={styles.pathHeader}>
              <View style={[styles.pathIconWrap, { backgroundColor: currentPath.gradient[0] + '18' }]}>
                <Ionicons name={currentPath.icon as any} size={22} color={currentPath.gradient[0]} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.pathName}>{currentPath.title}</Text>
                <Text style={styles.pathNameKr}>{currentPath.titleKorean}</Text>
              </View>
              <Text style={styles.pathPercent}>{pathProgress.percent}%</Text>
            </View>

            {/* Progress bar */}
            <View style={styles.pathBarBg}>
              <View style={[styles.pathBarFill, { width: `${pathProgress.percent}%` as any, backgroundColor: currentPath.gradient[0] }]} />
            </View>

            {/* Current stage info */}
            <View style={styles.pathStageRow}>
              <View style={[styles.pathStageBadge, { backgroundColor: currentPath.gradient[0] + '15' }]}>
                <Text style={[styles.pathStageBadgeText, { color: currentPath.gradient[0] }]}>
                  Stage {pathProgress.currentStageIdx + 1}
                </Text>
              </View>
              <Text style={styles.pathStageName} numberOfLines={1}>{pathProgress.currentStage.title}</Text>
              <Text style={styles.pathStageCount}>
                {pathProgress.stageProgress}/{pathProgress.stageTotal}
              </Text>
            </View>

            {/* Stage lesson dots */}
            <View style={styles.pathDots}>
              {pathProgress.currentStage.lessons.map((lessonId, i) => {
                const done = lessonId === 'hangul'
                  ? learnedCharacters.length >= allHangul.length
                  : !!completedLessons[lessonId];
                return (
                  <View
                    key={lessonId}
                    style={[
                      styles.pathDot,
                      done
                        ? { backgroundColor: currentPath.gradient[0] }
                        : { backgroundColor: colors.borderLight },
                    ]}
                  />
                );
              })}
            </View>

            {/* Switch path link */}
            <TouchableOpacity
              onPress={(e) => {
                e.stopPropagation();
                router.push('/path' as any);
              }}
              activeOpacity={0.7}
              style={styles.pathSwitch}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="swap-horizontal" size={14} color={colors.textTertiary} />
              <Text style={styles.pathSwitchText}>Switch Path</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => router.push('/path' as any)}
            activeOpacity={0.8}
            style={styles.pathEmptyCard}
          >
            <View style={[styles.pathIconWrap, { backgroundColor: '#d1fae5' }]}>
              <Ionicons name="map" size={24} color="#10b981" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.pathEmptyTitle}>Choose a Learning Path</Text>
              <Text style={styles.pathEmptySub}>Get a structured curriculum tailored to your goals</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
          </TouchableOpacity>
        )}

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
    backgroundColor: '#ffffff',
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
  audioPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eef2ff',
    borderRadius: borderRadius.xxl,
    padding: spacing.lg,
    gap: spacing.md,
    borderWidth: 1,
    borderColor: '#c7d2fe',
    ...shadows.sm,
  },
  audioPillIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#c7d2fe',
    alignItems: 'center',
    justifyContent: 'center',
  },
  audioPillTitle: {
    ...typography.bodyBold,
    color: colors.textPrimary,
    fontSize: 14,
  },
  audioPillSub: {
    ...typography.caption,
    color: colors.textTertiary,
    fontSize: 12,
  },
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

  // ── Daily Card ──
  dailyCard: {
    backgroundColor: '#0f172a',
    borderRadius: 40,
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.accent + '30',
    ...shadows.md,
  },
  dailyContent: {
    flex: 1,
    gap: spacing.xs,
  },
  dailyLabel: {
    fontSize: 10,
    fontFamily: 'Jakarta-Bold',
    letterSpacing: 1.5,
    color: colors.accent,
    textTransform: 'uppercase',
  },
  dailyTitle: {
    fontSize: 18,
    fontFamily: 'Jakarta-Bold',
    color: '#fff',
  },
  dailyDesc: {
    fontSize: 13,
    fontFamily: 'Jakarta-Regular',
    color: 'rgba(255,255,255,0.5)',
  },
  dailyBtn: {
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
  dailyBtnText: {
    fontSize: 14,
    fontFamily: 'Jakarta-Bold',
    color: '#fff',
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

  // ── Learning Path Card ──
  pathCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xxl,
    padding: spacing.lg,
    gap: spacing.md,
    ...shadows.sm,
  },
  pathHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  pathIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pathName: {
    fontSize: 16,
    fontFamily: 'Jakarta-Bold',
    color: colors.textPrimary,
  },
  pathNameKr: {
    fontSize: 12,
    fontFamily: 'Jakarta-Regular',
    color: colors.textTertiary,
  },
  pathPercent: {
    fontSize: 20,
    fontFamily: 'Jakarta-ExtraBold',
    color: colors.textPrimary,
    letterSpacing: -0.5,
  },
  pathBarBg: {
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.borderLight,
    overflow: 'hidden',
  },
  pathBarFill: {
    height: 6,
    borderRadius: 3,
  },
  pathStageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  pathStageBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: borderRadius.lg,
  },
  pathStageBadgeText: {
    fontSize: 11,
    fontFamily: 'Jakarta-Bold',
  },
  pathStageName: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Jakarta-SemiBold',
    color: colors.textSecondary,
  },
  pathStageCount: {
    fontSize: 13,
    fontFamily: 'Jakarta-Bold',
    color: colors.textTertiary,
  },
  pathDots: {
    flexDirection: 'row',
    gap: 6,
  },
  pathDot: {
    flex: 1,
    height: 4,
    borderRadius: 2,
  },
  pathSwitch: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    gap: 4,
    paddingVertical: 4,
  },
  pathSwitchText: {
    fontSize: 12,
    fontFamily: 'Jakarta-Medium',
    color: colors.textTertiary,
  },
  pathEmptyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xxl,
    padding: spacing.lg,
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderStyle: 'dashed',
  },
  pathEmptyTitle: {
    fontSize: 15,
    fontFamily: 'Jakarta-Bold',
    color: colors.textPrimary,
  },
  pathEmptySub: {
    fontSize: 12,
    fontFamily: 'Jakarta-Regular',
    color: colors.textTertiary,
    marginTop: 2,
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

  // ── Fast Hangul Card ──
  fastHangulCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.warmPink,
    borderRadius: borderRadius.xxxl,
    padding: spacing.lg,
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colors.accent + '20',
  },
  fastHangulIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.accent + '18',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fastHangulTitle: {
    fontSize: 15,
    fontFamily: 'Jakarta-Bold',
    color: colors.textPrimary,
  },
  fastHangulSub: {
    fontSize: 12,
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

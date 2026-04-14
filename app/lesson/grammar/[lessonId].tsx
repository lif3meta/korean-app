import React, { useState, useCallback, useMemo, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated as RNAnimated,
  ScrollView,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { colors, borderRadius, spacing, typography, shadows } from '@/lib/theme';
import { getGrammarById } from '@/data/grammar';
import type { GrammarLesson, GrammarSection } from '@/data/grammar';
import { getExercisesForLesson } from '@/data/grammarExercises';
import { useAppStore } from '@/lib/store';
import { AudioButton } from '@/components/common/AudioButton';
import { Button } from '@/components/ui/Button';


const { width: SCREEN_W } = Dimensions.get('window');

// ---------------------------------------------------------------------------
// Card types for bite-sized flow
// ---------------------------------------------------------------------------

type CardType =
  | { kind: 'intro'; heading: string; explanation: string; pattern?: string; audioText?: string }
  | { kind: 'example'; korean: string; english: string; romanization: string; breakdown?: { part: string; meaning: string }[] }
  | { kind: 'tip'; text: string }
  | { kind: 'quiz'; question: string; options: string[]; correctIndex: number }
  | { kind: 'complete' };

// ---------------------------------------------------------------------------
// Build cards from grammar lesson sections
// ---------------------------------------------------------------------------

function buildCards(lesson: GrammarLesson): CardType[] {
  const cards: CardType[] = [];

  for (const section of lesson.sections) {
    // Short intro — max 2 sentences
    const sentences = section.explanation.match(/[^.!]+[.!]+/g) || [section.explanation];
    const shortExplanation = sentences.slice(0, 2).join('').trim();
    // Extract Korean characters from heading for audio playback
    const koreanMatch = section.heading.match(/[\uAC00-\uD7AF\u1100-\u11FF\u3130-\u318F/\s]+/g);
    const audioText = koreanMatch ? koreanMatch.join(' ').replace(/\//g, ' ').trim() : undefined;
    cards.push({ kind: 'intro', heading: section.heading, explanation: shortExplanation, pattern: section.pattern, audioText });

    // One card per example
    for (const ex of section.examples) {
      cards.push({ kind: 'example', ...ex });
    }

    // Tip card
    if (section.tip) {
      cards.push({ kind: 'tip', text: section.tip });
    }

    // Mini quiz after section if enough examples
    if (section.examples.length >= 2) {
      const correct = section.examples[Math.floor(Math.random() * section.examples.length)];
      const others = section.examples.filter((e) => e !== correct);
      const shuffledOthers = others.sort(() => Math.random() - 0.5).slice(0, 2);
      const options = [correct, ...shuffledOthers].sort(() => Math.random() - 0.5);
      cards.push({
        kind: 'quiz',
        question: `What does "${correct.korean}" mean?`,
        options: options.map((o) => o.english),
        correctIndex: options.indexOf(correct),
      });
    }
  }

  cards.push({ kind: 'complete' });
  return cards;
}

// ---------------------------------------------------------------------------
// Progress bar
// ---------------------------------------------------------------------------

function ProgressBar({ total, current }: { total: number; current: number }) {
  return (
    <View style={progressStyles.container}>
      <View style={progressStyles.barContainer}>
        <View style={[progressStyles.barFill, { width: `${((current + 1) / total) * 100}%` as any }]} />
      </View>
      <Text style={progressStyles.counter}>{current + 1} / {total}</Text>
    </View>
  );
}

const progressStyles = StyleSheet.create({
  container: { alignItems: 'center', gap: spacing.xs, paddingVertical: spacing.sm },
  barContainer: { width: SCREEN_W - 80, height: 4, borderRadius: 2, backgroundColor: colors.borderLight },
  barFill: { height: 4, borderRadius: 2, backgroundColor: colors.secondary },
  counter: { ...typography.caption, color: colors.textTertiary },
});

// ---------------------------------------------------------------------------
// Intro Card
// ---------------------------------------------------------------------------

function IntroCard({ heading, explanation, pattern, audioText }: { heading: string; explanation: string; pattern?: string; audioText?: string }) {
  return (
    <View style={cardStyles.outerCard}>
      <LinearGradient
        colors={[colors.warmCream, colors.surface]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={cardStyles.gradientCard}
      >
        <View style={cardStyles.introIconWrap}>
          <Ionicons name="book-outline" size={28} color={colors.secondary} />
        </View>
        <Text style={cardStyles.introHeading}>{heading}</Text>
        {audioText && (
          <View style={cardStyles.audioRow}>
            <View style={cardStyles.audioCol}>
              <AudioButton text={audioText} size="lg" color={colors.primary} />
              <Text style={cardStyles.audioLabel}>Listen</Text>
            </View>
          </View>
        )}
        <Text style={cardStyles.introExplanation}>{explanation}</Text>
        {pattern && (
          <View style={cardStyles.patternBox}>
            <Text style={cardStyles.patternText}>{pattern}</Text>
          </View>
        )}
      </LinearGradient>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Example Card — big Korean text + audio + breakdown
// ---------------------------------------------------------------------------

function ExampleCard({ korean, english, romanization, breakdown }: {
  korean: string;
  english: string;
  romanization: string;
  breakdown?: { part: string; meaning: string }[];
}) {
  return (
    <View style={cardStyles.outerCard}>
      <View style={[cardStyles.exampleCard, shadows.md]}>
        <Text style={cardStyles.koreanLarge}>{korean}</Text>

        <View style={cardStyles.audioRow}>
          <View style={cardStyles.audioCol}>
            <AudioButton text={korean} size="lg" color={colors.primary} />
            <Text style={cardStyles.audioLabel}>Listen</Text>
          </View>
        </View>

        <Text style={cardStyles.romanization}>{romanization}</Text>
        <Text style={cardStyles.englishMeaning}>{english}</Text>

        {breakdown && breakdown.length > 0 && (
          <View style={cardStyles.breakdownRow}>
            {breakdown.map((b, i) => (
              <View key={i} style={cardStyles.breakdownChip}>
                <Text style={cardStyles.breakdownPart}>{b.part}</Text>
                <Text style={cardStyles.breakdownMeaning}>{b.meaning}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Tip Card
// ---------------------------------------------------------------------------

function TipCard({ text }: { text: string }) {
  return (
    <View style={cardStyles.outerCard}>
      <LinearGradient
        colors={[colors.warmCream, colors.surface]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={cardStyles.tipCard}
      >
        <View style={cardStyles.tipIconWrap}>
          <Ionicons name="bulb" size={24} color={colors.warning} />
        </View>
        <Text style={cardStyles.tipTitle}>Pro Tip</Text>
        <Text style={cardStyles.tipText}>{text}</Text>
      </LinearGradient>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Quiz Card
// ---------------------------------------------------------------------------

function QuizCard({
  question,
  options,
  correctIndex,
  onCorrect,
}: {
  question: string;
  options: string[];
  correctIndex: number;
  onCorrect: () => void;
}) {
  const [selected, setSelected] = useState<number | null>(null);
  const { hapticEnabled } = useAppStore();
  const isCorrect = selected === correctIndex;
  const isWrong = selected !== null && !isCorrect;

  const handleSelect = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    if (hapticEnabled) {
      Haptics.notificationAsync(
        idx === correctIndex
          ? Haptics.NotificationFeedbackType.Success
          : Haptics.NotificationFeedbackType.Error
      );
    }
    if (idx === correctIndex) {
      setTimeout(onCorrect, 800);
    }
  };

  return (
    <View style={cardStyles.outerCard}>
      <View style={[cardStyles.quizCard, shadows.md]}>
        <View style={cardStyles.quizIconWrap}>
          <Ionicons name="help-circle" size={28} color={colors.accent} />
        </View>
        <Text style={cardStyles.quizTitle}>Quick Check</Text>
        <Text style={cardStyles.quizQuestion}>{question}</Text>

        <View style={cardStyles.quizOptions}>
          {options.map((opt, idx) => {
            const isThisCorrect = idx === correctIndex;
            const isThisSelected = idx === selected;
            let optStyle: any = cardStyles.quizOption;
            let optTextColor = colors.textPrimary;

            if (selected !== null) {
              if (isThisCorrect) {
                optStyle = [cardStyles.quizOption, cardStyles.quizOptionCorrect];
                optTextColor = colors.success;
              } else if (isThisSelected) {
                optStyle = [cardStyles.quizOption, cardStyles.quizOptionWrong];
                optTextColor = colors.danger;
              }
            }

            return (
              <TouchableOpacity
                key={idx}
                style={optStyle}
                onPress={() => handleSelect(idx)}
                disabled={selected !== null}
                activeOpacity={0.7}
              >
                <Text style={[cardStyles.quizOptionText, { color: optTextColor }]}>{opt}</Text>
                {selected !== null && isThisCorrect && (
                  <Ionicons name="checkmark-circle" size={20} color={colors.success} />
                )}
                {isThisSelected && !isThisCorrect && (
                  <Ionicons name="close-circle" size={20} color={colors.danger} />
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {isCorrect && (
          <View style={cardStyles.quizFeedback}>
            <Ionicons name="sparkles" size={16} color={colors.success} />
            <Text style={[cardStyles.quizFeedbackText, { color: colors.success }]}>Correct!</Text>
          </View>
        )}
        {isWrong && (
          <View style={cardStyles.quizFeedback}>
            <Ionicons name="refresh" size={16} color={colors.danger} />
            <Text style={[cardStyles.quizFeedbackText, { color: colors.danger }]}>
              The answer is "{options[correctIndex]}"
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Complete Card
// ---------------------------------------------------------------------------

function CompleteCard({
  lessonTitle,
  onComplete,
  isCompleted,
  exerciseCount,
  onPractice,
}: {
  lessonTitle: string;
  onComplete: () => void;
  isCompleted: boolean;
  exerciseCount: number;
  onPractice: () => void;
}) {
  return (
    <View style={cardStyles.outerCard}>
      <LinearGradient
        colors={[colors.secondaryLight, colors.surface]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={cardStyles.completeCard}
      >
        <View style={cardStyles.completeIconWrap}>
          <Ionicons name="trophy" size={40} color={colors.warning} />
        </View>
        <Text style={cardStyles.completeTitle}>
          {isCompleted ? 'Lesson Complete!' : 'You made it!'}
        </Text>
        <Text style={cardStyles.completeSubtitle}>{lessonTitle}</Text>
        <Text style={cardStyles.completeDesc}>
          {isCompleted
            ? 'You\'ve already completed this lesson. Review anytime!'
            : 'Mark it complete to track your progress.'}
        </Text>

        {isCompleted ? (
          <View style={cardStyles.completedBadge}>
            <Ionicons name="checkmark-circle" size={22} color={colors.success} />
            <Text style={cardStyles.completedBadgeText}>Completed</Text>
          </View>
        ) : (
          <Button title="Complete Lesson" onPress={onComplete} size="lg" variant="success" />
        )}

        {isCompleted && exerciseCount > 0 && (
          <TouchableOpacity onPress={onPractice} activeOpacity={0.8} style={cardStyles.practiceBtn}>
            <Ionicons name="barbell" size={18} color={colors.tertiary} />
            <Text style={cardStyles.practiceBtnText}>Practice Exercises</Text>
            <Ionicons name="chevron-forward" size={16} color={colors.textTertiary} />
          </TouchableOpacity>
        )}
      </LinearGradient>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Main Screen
// ---------------------------------------------------------------------------

export default function GrammarLessonScreen() {
  const { lessonId } = useLocalSearchParams<{ lessonId: string }>();
  const lesson = getGrammarById(lessonId);
  const { completedLessons, markLessonComplete, hapticEnabled } = useAppStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const fadeAnim = useRef(new RNAnimated.Value(1)).current;

  const cards = useMemo(() => (lesson ? buildCards(lesson) : []), [lesson]);
  const exercises = lesson ? getExercisesForLesson(lessonId) : [];

  const animateTransition = useCallback(
    (nextIndex: number) => {
      if (hapticEnabled) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      RNAnimated.sequence([
        RNAnimated.timing(fadeAnim, { toValue: 0, duration: 120, useNativeDriver: true }),
        RNAnimated.timing(fadeAnim, { toValue: 1, duration: 180, useNativeDriver: true }),
      ]).start();
      setTimeout(() => setCurrentIndex(nextIndex), 120);
    },
    [fadeAnim, hapticEnabled]
  );

  const goNext = useCallback(() => {
    if (currentIndex < cards.length - 1) {
      animateTransition(currentIndex + 1);
    }
  }, [currentIndex, cards.length, animateTransition]);

  const goPrev = useCallback(() => {
    if (currentIndex > 0) {
      animateTransition(currentIndex - 1);
    }
  }, [currentIndex, animateTransition]);

  if (!lesson) {
    return (
      <View style={styles.container}>
        <Text style={styles.notFound}>Lesson not found</Text>
      </View>
    );
  }

  const isCompleted = completedLessons[lesson.id];
  const card = cards[currentIndex];
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === cards.length - 1;

  const renderCard = () => {
    switch (card.kind) {
      case 'intro':
        return <IntroCard heading={card.heading} explanation={card.explanation} pattern={card.pattern} audioText={card.audioText} />;
      case 'example':
        return <ExampleCard korean={card.korean} english={card.english} romanization={card.romanization} breakdown={card.breakdown} />;
      case 'tip':
        return <TipCard text={card.text} />;
      case 'quiz':
        return <QuizCard question={card.question} options={card.options} correctIndex={card.correctIndex} onCorrect={goNext} />;
      case 'complete':
        return (
          <CompleteCard
            lessonTitle={lesson.title}
            isCompleted={!!isCompleted}
            exerciseCount={exercises.length}
            onComplete={() => {
              markLessonComplete(lesson.id, 100);
              router.back();
            }}
            onPractice={() => router.push(`/lesson/grammar/practice/${lesson.id}` as any)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle} numberOfLines={1}>{lesson.title}</Text>
          <Text style={styles.headerKorean}>{lesson.titleKorean}</Text>
        </View>
        <View style={{ width: 24 }} />
      </View>

      {/* Progress */}
      <ProgressBar total={cards.length} current={currentIndex} />

      {/* Card area */}
      <ScrollView
        style={styles.cardScrollArea}
        contentContainerStyle={styles.cardScrollContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <RNAnimated.View style={{ opacity: fadeAnim }}>{renderCard()}</RNAnimated.View>
      </ScrollView>

      {/* Navigation buttons */}
      <View style={styles.navBar}>
        <TouchableOpacity
          onPress={goPrev}
          disabled={isFirst}
          style={[styles.navBtn, isFirst && styles.navBtnDisabled]}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={22} color={isFirst ? colors.textTertiary : colors.textPrimary} />
          <Text style={[styles.navBtnText, isFirst && styles.navBtnTextDisabled]}>Back</Text>
        </TouchableOpacity>

        {card.kind !== 'quiz' && !isLast && (
          <TouchableOpacity onPress={goNext} style={styles.navBtnNext} activeOpacity={0.7}>
            <View style={styles.navBtnNextInner}>
              <Text style={styles.navBtnNextText}>Next</Text>
              <Ionicons name="chevron-forward" size={20} color="#fff" />
            </View>
          </TouchableOpacity>
        )}

        {card.kind === 'quiz' && (
          <TouchableOpacity onPress={goNext} style={styles.navBtnSkip} activeOpacity={0.7}>
            <Text style={styles.navBtnSkipText}>Skip</Text>
            <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
          </TouchableOpacity>
        )}

        {isLast && card.kind !== 'quiz' && <View style={{ width: 100 }} />}
      </View>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  notFound: { ...typography.body, color: colors.textSecondary, padding: spacing.xl },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.sm,
    gap: spacing.md,
  },
  headerCenter: { flex: 1, alignItems: 'center' },
  headerTitle: { ...typography.bodyBold, color: colors.textPrimary },
  headerKorean: { ...typography.caption, color: colors.textTertiary },

  cardScrollArea: { flex: 1 },
  cardScrollContent: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
  },

  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    paddingBottom: spacing.xxxl,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    backgroundColor: colors.surface,
  },
  navBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    minWidth: 80,
  },
  navBtnDisabled: { opacity: 0.4 },
  navBtnText: { ...typography.bodyBold, color: colors.textPrimary },
  navBtnTextDisabled: { color: colors.textTertiary },

  navBtnNext: { borderRadius: borderRadius.xl, overflow: 'hidden' },
  navBtnNextInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.xl,
    backgroundColor: colors.primary,
  },
  navBtnNextText: { ...typography.bodyBold, color: '#fff' },

  navBtnSkip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  navBtnSkipText: { ...typography.footnote, color: colors.textTertiary },
});

const cardStyles = StyleSheet.create({
  outerCard: {
    minHeight: 320,
    justifyContent: 'center',
  },

  // Intro
  gradientCard: {
    borderRadius: borderRadius.xxl,
    padding: spacing.xxl,
    gap: spacing.md,
    alignItems: 'center',
    ...shadows.md,
  },
  introIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.secondaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  introHeading: { ...typography.title2, color: colors.primaryDark, textAlign: 'center' },
  introExplanation: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  patternBox: {
    backgroundColor: colors.primaryFaint,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.lg,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
    alignSelf: 'stretch',
  },
  patternText: { ...typography.bodyBold, color: colors.primaryDark, textAlign: 'center' },

  // Example
  exampleCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xxl,
    padding: spacing.xxl,
    alignItems: 'center',
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  koreanLarge: {
    fontSize: 32,
    fontFamily: 'Jakarta-Bold',
    color: colors.textPrimary,
    textAlign: 'center',
    lineHeight: 44,
  },
  audioRow: { flexDirection: 'row', gap: spacing.xxxl },
  audioCol: { alignItems: 'center', gap: spacing.xs },
  audioLabel: { ...typography.caption, color: colors.textTertiary },
  romanization: {
    ...typography.subhead,
    color: colors.primary,
    fontStyle: 'italic',
    marginTop: spacing.xs,
  },
  englishMeaning: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  breakdownRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.sm,
    justifyContent: 'center',
  },
  breakdownChip: {
    backgroundColor: colors.primaryFaint,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
  },
  breakdownPart: { ...typography.captionBold, color: colors.primaryDark },
  breakdownMeaning: { ...typography.caption, color: colors.textTertiary, fontSize: 10 },

  // Tip
  tipCard: {
    borderRadius: borderRadius.xxl,
    padding: spacing.xxl,
    gap: spacing.md,
    alignItems: 'center',
    ...shadows.sm,
  },
  tipIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.warningLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tipTitle: { ...typography.title3, color: colors.textPrimary },
  tipText: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },

  // Quiz
  quizCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xxl,
    padding: spacing.xxl,
    gap: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  quizIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.accentLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quizTitle: { ...typography.bodyBold, color: colors.accent },
  quizQuestion: { ...typography.title3, color: colors.textPrimary, textAlign: 'center' },
  quizOptions: { alignSelf: 'stretch', gap: spacing.sm, marginTop: spacing.sm },
  quizOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.xl,
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  quizOptionCorrect: { borderColor: colors.success, backgroundColor: colors.successBg },
  quizOptionWrong: { borderColor: colors.danger, backgroundColor: colors.dangerLight },
  quizOptionText: { ...typography.body, color: colors.textPrimary, flex: 1 },
  quizFeedback: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
  quizFeedbackText: { ...typography.bodyBold },

  // Complete
  completeCard: {
    borderRadius: borderRadius.xxl,
    padding: spacing.xxl,
    gap: spacing.md,
    alignItems: 'center',
    ...shadows.md,
  },
  completeIconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.warningLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  completeTitle: { ...typography.title2, color: colors.textPrimary },
  completeSubtitle: { ...typography.subhead, color: colors.textTertiary },
  completeDesc: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.successBg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.xl,
  },
  completedBadgeText: { ...typography.bodyBold, color: colors.success },
  practiceBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.warmLavender,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.xl,
    marginTop: spacing.sm,
  },
  practiceBtnText: { ...typography.bodyBold, color: colors.tertiary, flex: 1 },
});

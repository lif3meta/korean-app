import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
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
import { getPronunciationLessonById } from '@/data/pronunciation';
import type { PronunciationLesson } from '@/data/pronunciation';
import { useAppStore } from '@/lib/store';
import { AudioButton } from '@/components/common/AudioButton';
import { Button } from '@/components/ui/Button';
import { playAudioCueAsync } from '@/lib/audio';

const { width: SCREEN_W } = Dimensions.get('window');

// ---------------------------------------------------------------------------
// Types for the card-based flow
// ---------------------------------------------------------------------------

type CardType =
  | { kind: 'intro'; heading: string; explanation: string }
  | { kind: 'sound'; korean: string; romanization: string; english: string; audioTip?: string }
  | { kind: 'compare'; a: SoundExample; b: SoundExample; heading: string }
  | { kind: 'tip'; text: string }
  | { kind: 'quiz'; question: string; options: string[]; correctIndex: number; korean: string }
  | { kind: 'complete' };

interface SoundExample {
  korean: string;
  romanization: string;
  english: string;
  audioTip?: string;
}

// ---------------------------------------------------------------------------
// Parse mouth-position badges from audioTip
// ---------------------------------------------------------------------------

interface MouthBadge {
  label: string;
  color: string;
  bgColor: string;
  icon: keyof typeof Ionicons.glyphMap;
}

function parseMouthBadges(audioTip?: string): MouthBadge[] {
  if (!audioTip) return [];
  const badges: MouthBadge[] = [];
  const lower = audioTip.toLowerCase();

  if (lower.includes('round') || lower.includes('circle') || lower.includes('purse')) {
    badges.push({ label: 'Lips: Rounded', color: colors.primary, bgColor: colors.primaryFaint, icon: 'ellipse-outline' });
  }
  if (lower.includes('spread') || lower.includes('smile') || lower.includes('thin') || lower.includes('flat')) {
    badges.push({ label: 'Lips: Spread', color: colors.secondary, bgColor: '#f0f9f6', icon: 'remove-outline' });
  }
  if (lower.includes('open') || lower.includes('wide') || lower.includes('jaw') || lower.includes('drop')) {
    badges.push({ label: 'Jaw: Open', color: '#e67e22', bgColor: '#fff8f0', icon: 'chevron-down-outline' });
  }
  if (lower.includes('tongue') && (lower.includes('front') || lower.includes('tip') || lower.includes('ridge'))) {
    badges.push({ label: 'Tongue: Front', color: colors.tertiary, bgColor: colors.warmLavender, icon: 'arrow-up-outline' });
  }
  if (lower.includes('tongue') && lower.includes('back')) {
    badges.push({ label: 'Tongue: Back', color: '#8b5cf6', bgColor: '#f5f3ff', icon: 'arrow-down-outline' });
  }
  if (lower.includes('tight') || lower.includes('tense') || lower.includes('squeeze') || lower.includes('stiff') || lower.includes('clench') || lower.includes('glottis')) {
    badges.push({ label: 'Throat: Tense', color: colors.danger, bgColor: colors.dangerLight, icon: 'lock-closed-outline' });
  }
  if (lower.includes('puff') || lower.includes('air') || lower.includes('breath') || lower.includes('explosive')) {
    badges.push({ label: 'Air: Strong', color: '#0ea5e9', bgColor: '#f0f9ff', icon: 'cloud-outline' });
  }
  if (lower.includes('no air') || lower.includes('block the air') || lower.includes('no puff') || lower.includes('no release') || lower.includes('without release')) {
    // Override "Air: Strong" if also present
    const airIdx = badges.findIndex((b) => b.label === 'Air: Strong');
    if (airIdx >= 0) badges.splice(airIdx, 1);
    badges.push({ label: 'Air: None', color: '#64748b', bgColor: '#f8fafc', icon: 'close-circle-outline' });
  }
  if (lower.includes('nasal') || lower.includes('hum')) {
    badges.push({ label: 'Nasal', color: '#6366f1', bgColor: '#eef2ff', icon: 'musical-notes-outline' });
  }

  return badges.slice(0, 3); // max 3 badges
}

// ---------------------------------------------------------------------------
// Build cards from lesson sections
// ---------------------------------------------------------------------------

function buildCards(lesson: PronunciationLesson): CardType[] {
  const cards: CardType[] = [];

  for (const section of lesson.sections) {
    // Intro card for the section -- trim explanation to max 2 sentences
    const sentences = section.explanation.match(/[^.!]+[.!]+/g) || [section.explanation];
    const shortExplanation = sentences.slice(0, 2).join('').trim();
    cards.push({ kind: 'intro', heading: section.heading, explanation: shortExplanation });

    // Detect comparison sections by heading keywords
    const isComparison =
      section.heading.toLowerCase().includes('tricky pair') ||
      section.heading.toLowerCase().includes('vs') ||
      section.heading.toLowerCase().includes('contrast');

    if (isComparison && section.examples.length >= 2) {
      // Pair examples side by side
      for (let i = 0; i < section.examples.length - 1; i += 2) {
        cards.push({
          kind: 'compare',
          a: section.examples[i],
          b: section.examples[i + 1],
          heading: section.heading,
        });
      }
      // Handle odd leftover
      if (section.examples.length % 2 !== 0) {
        const last = section.examples[section.examples.length - 1];
        cards.push({ kind: 'sound', ...last });
      }
    } else {
      // Individual sound cards
      for (const ex of section.examples) {
        cards.push({ kind: 'sound', ...ex });
      }
    }

    // Tip card
    if (section.tip) {
      cards.push({ kind: 'tip', text: section.tip });
    }

    // Insert quiz after each section if enough examples
    if (section.examples.length >= 3) {
      const quizExamples = section.examples.filter((e) => e.romanization && e.korean);
      if (quizExamples.length >= 3) {
        const correct = quizExamples[Math.floor(Math.random() * quizExamples.length)];
        const others = quizExamples.filter((e) => e !== correct);
        const shuffledOthers = others.sort(() => Math.random() - 0.5).slice(0, 2);
        const options = [correct, ...shuffledOthers].sort(() => Math.random() - 0.5);
        cards.push({
          kind: 'quiz',
          question: `Which sound is "${correct.romanization}"?`,
          options: options.map((o) => o.korean),
          correctIndex: options.indexOf(correct),
          korean: correct.korean,
        });
      }
    }
  }

  cards.push({ kind: 'complete' });
  return cards;
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function ProgressDots({ total, current }: { total: number; current: number }) {
  const showDots = total <= 20;

  return (
    <View style={dotStyles.container}>
      {showDots ? (
        <View style={dotStyles.dotsRow}>
          {Array.from({ length: total }).map((_, i) => (
            <View
              key={i}
              style={[
                dotStyles.dot,
                i === current && dotStyles.dotActive,
                i < current && dotStyles.dotCompleted,
              ]}
            />
          ))}
        </View>
      ) : (
        <View style={dotStyles.barContainer}>
          <View style={[dotStyles.barFill, { width: `${((current + 1) / total) * 100}%` as any }]} />
        </View>
      )}
      <Text style={dotStyles.counter}>
        {current + 1} / {total}
      </Text>
    </View>
  );
}

const dotStyles = StyleSheet.create({
  container: { alignItems: 'center', gap: spacing.xs, paddingVertical: spacing.sm },
  dotsRow: { flexDirection: 'row', gap: 4, flexWrap: 'wrap', justifyContent: 'center', maxWidth: SCREEN_W - 80 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.borderLight },
  dotActive: { width: 18, backgroundColor: colors.primary, borderRadius: 9 },
  dotCompleted: { backgroundColor: colors.primaryLight },
  barContainer: { width: SCREEN_W - 80, height: 4, borderRadius: 2, backgroundColor: colors.borderLight },
  barFill: { height: 4, borderRadius: 2, backgroundColor: colors.primary },
  counter: { ...typography.caption, color: colors.textTertiary },
});

// -- Intro Card --
function IntroCard({ heading, explanation }: { heading: string; explanation: string }) {
  return (
    <View style={cardStyles.outerCard}>
      <LinearGradient
        colors={[colors.primaryFaint, colors.surface]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={cardStyles.gradientCard}
      >
        <View style={cardStyles.introIconWrap}>
          <Ionicons name="book-outline" size={28} color={colors.primary} />
        </View>
        <Text style={cardStyles.introHeading}>{heading}</Text>
        <Text style={cardStyles.introExplanation}>{explanation}</Text>
      </LinearGradient>
    </View>
  );
}

// -- Sound Card --
function SoundCard({ korean, romanization, english, audioTip }: SoundExample) {
  const badges = useMemo(() => parseMouthBadges(audioTip), [audioTip]);
  const shortEnglish = useMemo(() => {
    const s = english.match(/[^.!]+[.!]+/g) || [english];
    return s.slice(0, 2).join('').trim();
  }, [english]);

  return (
    <View style={cardStyles.outerCard}>
      <View style={[cardStyles.soundCard, shadows.md]}>
        {/* Large Korean display */}
        <Text style={cardStyles.koreanLarge}>{korean}</Text>

        {/* Prominent audio button */}
        <AudioButton text={korean} size="lg" audioType="pronunciation" color={colors.primary} />

        {/* Romanization */}
        <Text style={cardStyles.romanization}>{romanization}</Text>

        {/* Short meaning */}
        <Text style={cardStyles.englishMeaning}>{shortEnglish}</Text>

        {/* Mouth position badges */}
        {badges.length > 0 && (
          <View style={cardStyles.badgesRow}>
            {badges.map((b, i) => (
              <View key={i} style={[cardStyles.badge, { backgroundColor: b.bgColor }]}>
                <Ionicons name={b.icon} size={12} color={b.color} />
                <Text style={[cardStyles.badgeText, { color: b.color }]}>{b.label}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Audio tip as short hint */}
        {audioTip && (
          <View style={cardStyles.hintRow}>
            <Ionicons name="mic-outline" size={14} color={colors.textTertiary} />
            <Text style={cardStyles.hintText}>{audioTip}</Text>
          </View>
        )}
      </View>
    </View>
  );
}

// -- Compare Card --
function CompareCard({ a, b, heading }: { a: SoundExample; b: SoundExample; heading: string }) {
  return (
    <View style={cardStyles.outerCard}>
      <View style={[cardStyles.compareCard, shadows.md]}>
        <Text style={cardStyles.compareHeading}>{heading}</Text>
        <View style={cardStyles.comparePair}>
          {/* Side A */}
          <View style={cardStyles.compareSide}>
            <LinearGradient
              colors={[colors.warmPink, colors.surface]}
              style={cardStyles.compareSideInner}
            >
              <Text style={cardStyles.compareKorean}>{a.korean}</Text>
              <AudioButton text={a.korean} size="md" audioType="pronunciation" color={colors.primary} />
              <Text style={cardStyles.compareRoman}>{a.romanization}</Text>
              <Text style={cardStyles.compareEnglish} numberOfLines={2}>{a.english.split('--')[0].trim()}</Text>
            </LinearGradient>
          </View>

          {/* VS divider */}
          <View style={cardStyles.vsDivider}>
            <Text style={cardStyles.vsText}>VS</Text>
          </View>

          {/* Side B */}
          <View style={cardStyles.compareSide}>
            <LinearGradient
              colors={[colors.warmMint, colors.surface]}
              style={cardStyles.compareSideInner}
            >
              <Text style={cardStyles.compareKorean}>{b.korean}</Text>
              <AudioButton text={b.korean} size="md" audioType="pronunciation" color={colors.secondary} />
              <Text style={cardStyles.compareRoman}>{b.romanization}</Text>
              <Text style={cardStyles.compareEnglish} numberOfLines={2}>{b.english.split('--')[0].trim()}</Text>
            </LinearGradient>
          </View>
        </View>

        {/* Audio tips for both sides */}
        <View style={cardStyles.compareBadgesWrap}>
          {a.audioTip && (
            <View style={[cardStyles.badge, { backgroundColor: colors.warmPink }]}>
              <Ionicons name="mic-outline" size={12} color={colors.primary} />
              <Text style={[cardStyles.badgeText, { color: colors.primary }]}>{a.audioTip}</Text>
            </View>
          )}
          {b.audioTip && (
            <View style={[cardStyles.badge, { backgroundColor: colors.warmMint }]}>
              <Ionicons name="mic-outline" size={12} color={colors.secondary} />
              <Text style={[cardStyles.badgeText, { color: colors.secondary }]}>{b.audioTip}</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

// -- Tip Card --
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

// -- Quiz Card --
function QuizCard({
  question,
  options,
  correctIndex,
  onCorrect,
}: {
  question: string;
  options: string[];
  correctIndex: number;
  korean: string;
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
                <Text style={[cardStyles.quizOptionKorean, { color: optTextColor }]}>{opt}</Text>
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
              The answer is {options[correctIndex]}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

// -- Complete Card --
function CompleteCard({
  lessonTitle,
  onComplete,
  isCompleted,
}: {
  lessonTitle: string;
  onComplete: () => void;
  isCompleted: boolean;
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
            ? 'You have already completed this lesson. Feel free to review anytime.'
            : 'You reviewed all the sounds in this lesson. Mark it complete to track your progress.'}
        </Text>

        {isCompleted ? (
          <View style={cardStyles.completedBadge}>
            <Ionicons name="checkmark-circle" size={22} color={colors.success} />
            <Text style={cardStyles.completedBadgeText}>Completed</Text>
          </View>
        ) : (
          <Button title="Complete Lesson" onPress={onComplete} size="lg" variant="success" />
        )}
      </LinearGradient>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Main Screen
// ---------------------------------------------------------------------------

export default function PronunciationLessonScreen() {
  const { lessonId } = useLocalSearchParams<{ lessonId: string }>();
  const lesson = getPronunciationLessonById(lessonId);
  const { completedLessons, markLessonComplete, hapticEnabled } = useAppStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const fadeAnim = useRef(new RNAnimated.Value(1)).current;

  const cards = useMemo(() => (lesson ? buildCards(lesson) : []), [lesson]);

  const animateTransition = useCallback(
    (nextIndex: number) => {
      if (hapticEnabled) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      RNAnimated.sequence([
        RNAnimated.timing(fadeAnim, { toValue: 0, duration: 120, useNativeDriver: true }),
        RNAnimated.timing(fadeAnim, { toValue: 1, duration: 180, useNativeDriver: true }),
      ]).start();
      // Set new index after fade-out
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

  // Auto-play audio when landing on a sound or compare card
  useEffect(() => {
    if (!cards[currentIndex]) return;
    const card = cards[currentIndex];
    const timer = setTimeout(() => {
      if (card.kind === 'sound') {
        playAudioCueAsync({ kind: 'korean_text', text: card.korean });
      } else if (card.kind === 'compare') {
        playAudioCueAsync({ kind: 'korean_text', text: card.a.korean });
      }
    }, 350); // small delay after card transition animation
    return () => clearTimeout(timer);
  }, [currentIndex, cards]);

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
        return <IntroCard heading={card.heading} explanation={card.explanation} />;
      case 'sound':
        return (
          <SoundCard
            korean={card.korean}
            romanization={card.romanization}
            english={card.english}
            audioTip={card.audioTip}
          />
        );
      case 'compare':
        return <CompareCard a={card.a} b={card.b} heading={card.heading} />;
      case 'tip':
        return <TipCard text={card.text} />;
      case 'quiz':
        return (
          <QuizCard
            question={card.question}
            options={card.options}
            correctIndex={card.correctIndex}
            korean={card.korean}
            onCorrect={goNext}
          />
        );
      case 'complete':
        return (
          <CompleteCard
            lessonTitle={lesson.title}
            isCompleted={!!isCompleted}
            onComplete={() => {
              markLessonComplete(lesson.id, 100);
              router.back();
            }}
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
        <TouchableOpacity
          onPress={() => router.back()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {lesson.title}
          </Text>
          <Text style={styles.headerKorean}>{lesson.titleKorean}</Text>
        </View>
        <View style={{ width: 24 }} />
      </View>

      {/* Progress */}
      <ProgressDots total={cards.length} current={currentIndex} />

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
          <Ionicons
            name="chevron-back"
            size={22}
            color={isFirst ? colors.textTertiary : colors.textPrimary}
          />
          <Text style={[styles.navBtnText, isFirst && styles.navBtnTextDisabled]}>Back</Text>
        </TouchableOpacity>

        {card.kind !== 'quiz' && !isLast && (
          <TouchableOpacity onPress={goNext} style={styles.navBtnNext} activeOpacity={0.7}>
            <LinearGradient
              colors={[colors.primary, colors.primaryDark]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.navBtnNextInner}
            >
              <Text style={styles.navBtnNextText}>Next</Text>
              <Ionicons name="chevron-forward" size={20} color="#fff" />
            </LinearGradient>
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

  // -- Intro --
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
    backgroundColor: colors.primaryPale + '60',
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

  // -- Sound --
  soundCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xxl,
    padding: spacing.xxl,
    alignItems: 'center',
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  koreanLarge: {
    fontSize: 56,
    fontFamily: 'Jakarta-Bold',
    color: colors.textPrimary,
    letterSpacing: -0.5,
    marginBottom: spacing.xs,
  },
  romanization: {
    ...typography.title3,
    color: colors.primary,
    fontStyle: 'italic',
    marginTop: spacing.xs,
  },
  englishMeaning: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: spacing.sm,
  },
  badgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.sm,
    justifyContent: 'center',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: borderRadius.pill,
  },
  badgeText: { ...typography.caption, fontFamily: 'Jakarta-SemiBold' },
  hintRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    alignSelf: 'stretch',
    justifyContent: 'center',
  },
  hintText: { ...typography.footnote, color: colors.textTertiary, fontStyle: 'italic' },

  // -- Compare --
  compareCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xxl,
    padding: spacing.lg,
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  compareHeading: {
    ...typography.bodyBold,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  comparePair: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'stretch',
  },
  compareSide: {
    flex: 1,
  },
  compareSideInner: {
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
  },
  compareKorean: {
    fontSize: 36,
    fontFamily: 'Jakarta-Bold',
    color: colors.textPrimary,
  },
  compareRoman: {
    ...typography.bodyBold,
    color: colors.primary,
    fontStyle: 'italic',
  },
  compareEnglish: {
    ...typography.footnote,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  vsDivider: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 30,
  },
  vsText: {
    ...typography.captionBold,
    color: colors.textTertiary,
    letterSpacing: 1,
  },
  compareBadgesWrap: {
    gap: spacing.xs,
    alignItems: 'center',
  },

  // -- Tip --
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

  // -- Quiz --
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
    padding: spacing.lg,
    borderRadius: borderRadius.xl,
    backgroundColor: colors.surfaceLow,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  quizOptionCorrect: {
    backgroundColor: colors.successLight,
    borderColor: colors.success,
  },
  quizOptionWrong: {
    backgroundColor: colors.dangerLight,
    borderColor: colors.danger,
  },
  quizOptionKorean: {
    fontSize: 24,
    fontFamily: 'Jakarta-SemiBold',
    color: colors.textPrimary,
  },
  quizFeedback: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  quizFeedbackText: { ...typography.bodyBold },

  // -- Complete --
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
    marginBottom: spacing.sm,
  },
  completeTitle: { ...typography.title2, color: colors.textPrimary },
  completeSubtitle: { ...typography.bodyBold, color: colors.textTertiary },
  completeDesc: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: spacing.sm,
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.lg,
    backgroundColor: colors.successBg,
    borderRadius: borderRadius.xl,
  },
  completedBadgeText: { ...typography.bodyBold, color: colors.success },
});

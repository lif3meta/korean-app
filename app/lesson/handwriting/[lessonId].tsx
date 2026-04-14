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
import { getHandwritingLessonById } from '@/data/handwriting';
import type { HandwritingStep } from '@/data/handwriting';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/Button';
import { WebView } from 'react-native-webview';

const { width: SCREEN_W } = Dimensions.get('window');

// ---------------------------------------------------------------------------
// Card types for the flow
// ---------------------------------------------------------------------------

type CardType =
  | { kind: 'intro'; title: string; titleKorean?: string; tip: string }
  | { kind: 'stroke_order'; step: HandwritingStep }
  | { kind: 'syllable_block'; step: HandwritingStep }
  | { kind: 'practice'; characters: string[]; stepTitle: string }
  | { kind: 'complete' };

function buildCards(steps: HandwritingStep[]): CardType[] {
  const cards: CardType[] = [];

  for (const step of steps) {
    switch (step.type) {
      case 'intro':
        cards.push({ kind: 'intro', title: step.title, titleKorean: step.titleKorean, tip: step.tip || '' });
        break;
      case 'stroke_order':
        cards.push({ kind: 'stroke_order', step });
        break;
      case 'syllable_block':
        cards.push({ kind: 'syllable_block', step });
        break;
      case 'practice':
        cards.push({ kind: 'practice', characters: step.practiceCharacters || [], stepTitle: step.title });
        break;
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
function IntroCard({ title, titleKorean, tip }: { title: string; titleKorean?: string; tip: string }) {
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
        <Text style={cardStyles.introHeading}>{title}</Text>
        {titleKorean && <Text style={cardStyles.introKorean}>{titleKorean}</Text>}
        <Text style={cardStyles.introExplanation}>{tip}</Text>
      </LinearGradient>
    </View>
  );
}

// -- Stroke Order Card --
function StrokeOrderCard({ step }: { step: HandwritingStep }) {
  return (
    <View style={cardStyles.outerCard}>
      <View style={[cardStyles.strokeCard, shadows.md]}>
        {/* Grid background with large character */}
        <View style={cardStyles.gridContainer}>
          <View style={cardStyles.gridBackground}>
            <View style={cardStyles.gridLineH} />
            <View style={cardStyles.gridLineV} />
          </View>
          <Text style={cardStyles.strokeCharacter}>{step.character}</Text>
        </View>

        {/* Title and stroke count */}
        <View style={cardStyles.strokeHeader}>
          <View>
            <Text style={cardStyles.strokeTitle}>{step.title}</Text>
            {step.titleKorean && <Text style={cardStyles.strokeTitleKorean}>{step.titleKorean}</Text>}
          </View>
          <View style={cardStyles.strokeCountBadge}>
            <Ionicons name="brush-outline" size={14} color={colors.primary} />
            <Text style={cardStyles.strokeCountText}>{step.strokeCount} stroke{step.strokeCount !== 1 ? 's' : ''}</Text>
          </View>
        </View>

        {/* Numbered stroke list */}
        <View style={cardStyles.strokesList}>
          {step.strokes?.map((stroke, idx) => (
            <View key={idx} style={cardStyles.strokeRow}>
              <View style={cardStyles.strokeNumberCircle}>
                <Text style={cardStyles.strokeNumber}>{idx + 1}</Text>
              </View>
              <Text style={cardStyles.strokeDesc}>{stroke}</Text>
            </View>
          ))}
        </View>

        {/* Tip */}
        {step.tip && (
          <View style={cardStyles.strokeTipRow}>
            <Ionicons name="bulb-outline" size={16} color={colors.warning} />
            <Text style={cardStyles.strokeTipText}>{step.tip}</Text>
          </View>
        )}
      </View>
    </View>
  );
}

// -- Syllable Block Card --
function SyllableBlockCard({ step }: { step: HandwritingStep }) {
  return (
    <View style={cardStyles.outerCard}>
      <View style={[cardStyles.syllableCard, shadows.md]}>
        <Text style={cardStyles.syllableTitle}>{step.title}</Text>
        {step.titleKorean && <Text style={cardStyles.syllableTitleKorean}>{step.titleKorean}</Text>}

        {/* Assembly visualization */}
        <View style={cardStyles.assemblyRow}>
          {step.components?.map((comp, idx) => (
            <React.Fragment key={idx}>
              {idx > 0 && <Text style={cardStyles.assemblyPlus}>+</Text>}
              <View style={cardStyles.componentBox}>
                <Text style={cardStyles.componentChar}>{comp.character}</Text>
                <Text style={cardStyles.componentPosition}>{comp.position}</Text>
                <Text style={cardStyles.componentName}>{comp.name}</Text>
              </View>
            </React.Fragment>
          ))}
          <Text style={cardStyles.assemblyArrow}>=</Text>
          <View style={[cardStyles.componentBox, cardStyles.resultBox]}>
            <Text style={cardStyles.resultChar}>{step.result}</Text>
          </View>
        </View>

        {/* Explanation */}
        {step.explanation && (
          <Text style={cardStyles.syllableExplanation}>{step.explanation}</Text>
        )}
      </View>
    </View>
  );
}

// -- Drawing pad HTML for inline canvas --
const DRAW_PAD_HTML = `<!DOCTYPE html><html><head>
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no"/>
<style>*{margin:0;padding:0;box-sizing:border-box}body{background:#fff;overflow:hidden;touch-action:none}
canvas{display:block;width:100%;height:100%}
.guide{position:absolute;top:0;left:0;right:0;bottom:0;pointer-events:none}
.guide .h{position:absolute;top:50%;left:8%;right:8%;height:1px;background:#e5e7eb}
.guide .v{position:absolute;left:50%;top:8%;bottom:8%;width:1px;background:#e5e7eb}
</style></head><body>
<div class="guide"><div class="h"></div><div class="v"></div></div>
<canvas id="pad"></canvas>
<script>(function(){var c=document.getElementById('pad'),ctx=c.getContext('2d'),d=false;
function resize(){var r=c.getBoundingClientRect();c.width=r.width*2;c.height=r.height*2;ctx.scale(2,2);ctx.lineCap='round';ctx.lineJoin='round';ctx.lineWidth=5;ctx.strokeStyle='#303335'}
resize();
function pos(e){var r=c.getBoundingClientRect(),t=e.touches?e.touches[0]:e;return{x:t.clientX-r.left,y:t.clientY-r.top}}
c.addEventListener('touchstart',function(e){e.preventDefault();d=true;var p=pos(e);ctx.beginPath();ctx.moveTo(p.x,p.y)},{passive:false});
c.addEventListener('touchmove',function(e){e.preventDefault();if(!d)return;var p=pos(e);ctx.lineTo(p.x,p.y);ctx.stroke()},{passive:false});
c.addEventListener('touchend',function(e){e.preventDefault();d=false},{passive:false});
c.addEventListener('mousedown',function(e){d=true;var p=pos(e);ctx.beginPath();ctx.moveTo(p.x,p.y)});
c.addEventListener('mousemove',function(e){if(!d)return;var p=pos(e);ctx.lineTo(p.x,p.y);ctx.stroke()});
c.addEventListener('mouseup',function(){d=false});
function handle(e){try{var m=JSON.parse(e.data);if(m.type==='clear'){ctx.clearRect(0,0,c.width,c.height)}}catch(x){}}
document.addEventListener('message',handle);window.addEventListener('message',handle)})();</script></body></html>`;

// -- Practice Card --
function PracticeCard({
  characters,
  stepTitle,
  onAllDone,
}: {
  characters: string[];
  stepTitle: string;
  onAllDone: () => void;
}) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [doneSet, setDoneSet] = useState<Set<number>>(new Set());
  const { hapticEnabled } = useAppStore();
  const webViewRef = useRef<WebView>(null);
  const allDone = doneSet.size === characters.length;

  const clearPad = () => {
    webViewRef.current?.postMessage(JSON.stringify({ type: 'clear' }));
  };

  const handleWroteIt = () => {
    if (hapticEnabled) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    const next = new Set(doneSet);
    next.add(currentIdx);
    setDoneSet(next);
    clearPad();
    if (next.size < characters.length && currentIdx < characters.length - 1) {
      setCurrentIdx(currentIdx + 1);
    }
  };

  const handleTryAgain = () => {
    if (hapticEnabled) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    clearPad();
  };

  return (
    <View style={cardStyles.outerCard}>
      <View style={[cardStyles.practiceCard, shadows.md]}>
        <View style={cardStyles.practiceIconWrap}>
          <Ionicons name="pencil" size={28} color="#6366f1" />
        </View>
        <Text style={cardStyles.practiceTitle}>{stepTitle}</Text>
        <Text style={cardStyles.practiceProgress}>
          {doneSet.size} / {characters.length} completed
        </Text>

        {!allDone ? (
          <>
            {/* Target character to copy */}
            <View style={cardStyles.practiceGridContainer}>
              <View style={cardStyles.gridBackground}>
                <View style={cardStyles.gridLineH} />
                <View style={cardStyles.gridLineV} />
              </View>
              <Text style={cardStyles.practiceCharacter}>{characters[currentIdx]}</Text>
            </View>

            <Text style={cardStyles.practiceInstruction}>
              Draw the character below
            </Text>

            {/* Drawing canvas */}
            <View style={cardStyles.drawingPadWrap}>
              <View style={cardStyles.drawingPadGuideLabel}>
                <Ionicons name="brush" size={12} color={colors.textTertiary} />
                <Text style={cardStyles.drawingPadGuideLabelText}>Draw here</Text>
              </View>
              <WebView
                ref={webViewRef}
                originWhitelist={['*']}
                source={{ html: DRAW_PAD_HTML, baseUrl: 'https://app.local/' }}
                javaScriptEnabled
                injectedJavaScriptBeforeContentLoaded={'true;'}
                injectedJavaScript={'true;'}
                scrollEnabled={false}
                bounces={false}
                style={cardStyles.drawingPadCanvas}
              />
            </View>

            {/* Action buttons */}
            <View style={cardStyles.practiceButtons}>
              <TouchableOpacity
                style={cardStyles.tryAgainBtn}
                onPress={handleTryAgain}
                activeOpacity={0.7}
              >
                <Ionicons name="refresh" size={18} color={colors.textSecondary} />
                <Text style={cardStyles.tryAgainText}>Clear</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={cardStyles.wroteItBtn}
                onPress={handleWroteIt}
                activeOpacity={0.7}
              >
                <Ionicons name="checkmark-circle" size={18} color="#fff" />
                <Text style={cardStyles.wroteItText}>I wrote it!</Text>
              </TouchableOpacity>
            </View>

            {/* Character dots */}
            <View style={cardStyles.charDotsRow}>
              {characters.map((ch, idx) => (
                <TouchableOpacity
                  key={idx}
                  onPress={() => { setCurrentIdx(idx); clearPad(); }}
                  style={[
                    cardStyles.charDot,
                    idx === currentIdx && cardStyles.charDotActive,
                    doneSet.has(idx) && cardStyles.charDotDone,
                  ]}
                >
                  <Text
                    style={[
                      cardStyles.charDotText,
                      idx === currentIdx && cardStyles.charDotTextActive,
                      doneSet.has(idx) && cardStyles.charDotTextDone,
                    ]}
                  >
                    {ch}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        ) : (
          <View style={cardStyles.allDoneWrap}>
            <Ionicons name="checkmark-done-circle" size={48} color={colors.success} />
            <Text style={cardStyles.allDoneText}>All characters practiced!</Text>
            <Text style={cardStyles.allDoneHint}>Tap Next to finish the lesson.</Text>
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
            : 'Great work practicing your handwriting! Mark it complete to track your progress.'}
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

export default function HandwritingLessonScreen() {
  const { lessonId } = useLocalSearchParams<{ lessonId: string }>();
  const lesson = getHandwritingLessonById(lessonId);
  const { completedLessons, markLessonComplete, hapticEnabled } = useAppStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const fadeAnim = useRef(new RNAnimated.Value(1)).current;

  const cards = useMemo(() => (lesson ? buildCards(lesson.steps) : []), [lesson]);

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
        return <IntroCard title={card.title} titleKorean={card.titleKorean} tip={card.tip} />;
      case 'stroke_order':
        return <StrokeOrderCard step={card.step} />;
      case 'syllable_block':
        return <SyllableBlockCard step={card.step} />;
      case 'practice':
        return <PracticeCard characters={card.characters} stepTitle={card.stepTitle} onAllDone={goNext} />;
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

        {!isLast && (
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

        {isLast && <View style={{ width: 100 }} />}
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
  introKorean: { ...typography.caption, color: colors.textTertiary, marginTop: -4 },
  introExplanation: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },

  // -- Stroke Order --
  strokeCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xxl,
    padding: spacing.xxl,
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  gridContainer: {
    width: 140,
    height: 140,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  gridBackground: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 2,
    borderColor: colors.borderLight,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.surfaceLow,
  },
  gridLineH: {
    position: 'absolute',
    top: '50%',
    left: 8,
    right: 8,
    height: 1,
    backgroundColor: colors.border,
    opacity: 0.4,
  },
  gridLineV: {
    position: 'absolute',
    left: '50%',
    top: 8,
    bottom: 8,
    width: 1,
    backgroundColor: colors.border,
    opacity: 0.4,
  },
  strokeCharacter: {
    fontSize: 72,
    fontFamily: 'Jakarta-Bold',
    color: colors.textPrimary,
    letterSpacing: -0.5,
  },
  strokeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  strokeTitle: { ...typography.title3, color: colors.textPrimary },
  strokeTitleKorean: { ...typography.caption, color: colors.textTertiary },
  strokeCountBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.primaryFaint,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: borderRadius.pill,
  },
  strokeCountText: { ...typography.caption, color: colors.primary, fontFamily: 'Jakarta-SemiBold' },
  strokesList: { gap: spacing.sm },
  strokeRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  strokeNumberCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primaryPale,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  strokeNumber: {
    fontSize: 12,
    fontFamily: 'Jakarta-Bold',
    color: colors.primaryDark,
  },
  strokeDesc: {
    ...typography.body,
    color: colors.textSecondary,
    flex: 1,
    lineHeight: 22,
  },
  strokeTipRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  strokeTipText: {
    ...typography.footnote,
    color: colors.textSecondary,
    flex: 1,
    lineHeight: 20,
    fontStyle: 'italic',
  },

  // -- Syllable Block --
  syllableCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xxl,
    padding: spacing.xxl,
    gap: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  syllableTitle: { ...typography.title3, color: colors.textPrimary, textAlign: 'center' },
  syllableTitleKorean: { ...typography.caption, color: colors.textTertiary, marginTop: -4 },
  assemblyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginVertical: spacing.md,
  },
  componentBox: {
    alignItems: 'center',
    backgroundColor: colors.surfaceLow,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    minWidth: 56,
    gap: 2,
  },
  componentChar: {
    fontSize: 28,
    fontFamily: 'Jakarta-Bold',
    color: colors.textPrimary,
  },
  componentPosition: {
    fontSize: 9,
    fontFamily: 'Jakarta-Bold',
    color: colors.primary,
    letterSpacing: 0.5,
  },
  componentName: {
    fontSize: 10,
    fontFamily: 'Jakarta-Regular',
    color: colors.textTertiary,
  },
  assemblyPlus: {
    fontSize: 20,
    fontFamily: 'Jakarta-Bold',
    color: colors.textTertiary,
  },
  assemblyArrow: {
    fontSize: 24,
    fontFamily: 'Jakarta-Bold',
    color: colors.primary,
  },
  resultBox: {
    backgroundColor: colors.primaryFaint,
    borderWidth: 2,
    borderColor: colors.primaryLight,
  },
  resultChar: {
    fontSize: 36,
    fontFamily: 'Jakarta-Bold',
    color: colors.primaryDark,
  },
  syllableExplanation: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },

  // -- Practice --
  practiceCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xxl,
    padding: spacing.xxl,
    gap: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  practiceIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#eef2ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  practiceTitle: { ...typography.title3, color: colors.textPrimary },
  practiceProgress: { ...typography.caption, color: colors.textTertiary },
  practiceGridContainer: {
    width: 120,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: spacing.sm,
  },
  practiceCharacter: {
    fontSize: 64,
    fontFamily: 'Jakarta-Bold',
    color: colors.textPrimary,
  },
  practiceInstruction: {
    ...typography.footnote,
    color: colors.textTertiary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  drawingPadWrap: {
    width: '100%',
    height: 180,
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    borderColor: '#6366f1' + '30',
    borderStyle: 'dashed',
    overflow: 'hidden',
    backgroundColor: '#fafafa',
    marginTop: spacing.sm,
  },
  drawingPadGuideLabel: {
    position: 'absolute',
    top: 6,
    left: 10,
    zIndex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    opacity: 0.4,
  },
  drawingPadGuideLabelText: {
    fontSize: 10,
    fontFamily: 'Jakarta-Medium',
    color: colors.textTertiary,
  },
  drawingPadCanvas: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  practiceButtons: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  tryAgainBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.xl,
    backgroundColor: colors.surfaceLow,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tryAgainText: {
    ...typography.bodyBold,
    color: colors.textSecondary,
  },
  wroteItBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.xl,
    backgroundColor: colors.success,
  },
  wroteItText: {
    ...typography.bodyBold,
    color: '#fff',
  },
  charDotsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.sm,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  charDot: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surfaceLow,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  charDotActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryFaint,
  },
  charDotDone: {
    backgroundColor: colors.successLight,
    borderColor: colors.success,
  },
  charDotText: {
    fontSize: 16,
    fontFamily: 'Jakarta-SemiBold',
    color: colors.textSecondary,
  },
  charDotTextActive: {
    color: colors.primaryDark,
  },
  charDotTextDone: {
    color: colors.success,
  },
  allDoneWrap: {
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.xl,
  },
  allDoneText: {
    ...typography.title3,
    color: colors.success,
  },
  allDoneHint: {
    ...typography.footnote,
    color: colors.textTertiary,
  },

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

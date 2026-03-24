import React, { useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Animated,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, borderRadius, spacing, typography, shadows } from '@/lib/theme';
import { useAppStore } from '@/lib/store';
import { getSentencesByLevel, sentenceLevels } from '@/data/sentences';
import type { Sentence } from '@/data/sentences';
import { speakKorean } from '@/lib/audio';
import { SpeechPractice } from '@/components/common/SpeechPractice';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type Step = 'listen' | 'understand' | 'speak' | 'done';

const BREAKDOWN_COLORS = [
  '#E040FB',
  '#00E5FF',
  '#FFD740',
  '#FF6090',
  '#69F0AE',
  '#7C4DFF',
  '#FF80AB',
  '#00BCD4',
];

export default function SentencePracticeScreen() {
  const { levelId } = useLocalSearchParams<{ levelId: string }>();
  const level = parseInt(levelId || '1', 10);
  const levelSentences = getSentencesByLevel(level);
  const levelInfo = sentenceLevels.find((l) => l.level === level);
  const { completedLessons, markLessonComplete } = useAppStore();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [step, setStep] = useState<Step>('listen');
  const [isPlaying, setIsPlaying] = useState(false);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const sentence = levelSentences[currentIndex];
  const totalSentences = levelSentences.length;
  const progressPct = ((currentIndex) / totalSentences) * 100;

  const completedCount = levelSentences.filter(
    (s) => completedLessons[`sent_${s.id}`]
  ).length;

  const handlePlay = useCallback(() => {
    if (!sentence) return;
    setIsPlaying(true);
    speakKorean(sentence.korean);

    Animated.sequence([
      Animated.timing(pulseAnim, {
        toValue: 1.1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(pulseAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    setTimeout(() => {
      setIsPlaying(false);
    }, 2000);
  }, [sentence, pulseAnim]);

  const handleNext = useCallback(() => {
    if (currentIndex < totalSentences - 1) {
      setCurrentIndex((i) => i + 1);
      setStep('listen');
    } else {
      router.back();
    }
  }, [currentIndex, totalSentences]);

  const handleSpeechComplete = useCallback((score: number) => {
    if (sentence) {
      markLessonComplete(`sent_${sentence.id}`, score);
    }
    setStep('done');
  }, [sentence, markLessonComplete]);

  const handleTryAgain = useCallback(() => {
    setStep('listen');
  }, []);

  if (!sentence || !levelInfo) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No sentences found for this level.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBarBg}>
          <LinearGradient
            colors={levelInfo.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.progressBarFill, { width: `${progressPct}%` }]}
          />
        </View>
        <Text style={styles.progressText}>
          {currentIndex + 1} / {totalSentences}
        </Text>
      </View>

      <ScrollView
        style={styles.scrollContent}
        contentContainerStyle={styles.scrollInner}
        showsVerticalScrollIndicator={false}
      >
        {/* Step Indicators */}
        <View style={styles.stepIndicators}>
          {(['listen', 'understand', 'speak'] as const).map((s, i) => {
            const stepIndex = ['listen', 'understand', 'speak'].indexOf(step);
            const thisIndex = i;
            const isActive = s === step || (step === 'done' && i === 2);
            const isPast = thisIndex < stepIndex || step === 'done';
            return (
              <View key={s} style={styles.stepRow}>
                <View
                  style={[
                    styles.stepDot,
                    isActive && styles.stepDotActive,
                    isPast && styles.stepDotDone,
                  ]}
                >
                  {isPast ? (
                    <Ionicons name="checkmark" size={12} color="#fff" />
                  ) : (
                    <Text
                      style={[
                        styles.stepDotText,
                        (isActive || isPast) && styles.stepDotTextActive,
                      ]}
                    >
                      {i + 1}
                    </Text>
                  )}
                </View>
                <Text
                  style={[
                    styles.stepLabel,
                    isActive && styles.stepLabelActive,
                    isPast && styles.stepLabelDone,
                  ]}
                >
                  {s === 'listen'
                    ? 'Listen'
                    : s === 'understand'
                    ? 'Understand'
                    : 'Speak'}
                </Text>
                {i < 2 && <View style={styles.stepLine} />}
              </View>
            );
          })}
        </View>

        {/* Korean Sentence Card */}
        <View style={styles.sentenceCard}>
          <Text style={styles.sentenceKorean}>{sentence.korean}</Text>
          {step !== 'listen' && (
            <Text style={styles.sentenceRoman}>{sentence.romanization}</Text>
          )}
          {(step === 'understand' || step === 'speak' || step === 'done') && (
            <Text style={styles.sentenceEnglish}>{sentence.english}</Text>
          )}

          {/* Play Button */}
          <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
            <TouchableOpacity
              onPress={handlePlay}
              style={[
                styles.playButton,
                isPlaying && styles.playButtonActive,
              ]}
              activeOpacity={0.7}
            >
              <Ionicons
                name={isPlaying ? 'volume-high' : 'play'}
                size={32}
                color="#fff"
              />
            </TouchableOpacity>
          </Animated.View>
          <Text style={styles.playHint}>
            {step === 'listen'
              ? 'Tap to listen'
              : 'Tap to hear again'}
          </Text>
        </View>

        {/* Step: Understand - Breakdown */}
        {(step === 'understand' || step === 'speak' || step === 'done') && (
          <View style={styles.breakdownContainer}>
            <Text style={styles.breakdownTitle}>Word by Word</Text>
            <View style={styles.breakdownRow}>
              {sentence.breakdown.map((part, i) => (
                <View
                  key={i}
                  style={[
                    styles.breakdownBox,
                    {
                      backgroundColor:
                        BREAKDOWN_COLORS[i % BREAKDOWN_COLORS.length] + '15',
                      borderColor:
                        BREAKDOWN_COLORS[i % BREAKDOWN_COLORS.length] + '40',
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.breakdownKorean,
                      {
                        color:
                          BREAKDOWN_COLORS[i % BREAKDOWN_COLORS.length],
                      },
                    ]}
                  >
                    {part.korean}
                  </Text>
                  <Text style={styles.breakdownEnglish}>{part.english}</Text>
                </View>
              ))}
            </View>
            {sentence.pattern && (
              <View style={styles.patternBox}>
                <Ionicons
                  name="information-circle-outline"
                  size={16}
                  color={colors.primaryDark}
                />
                <Text style={styles.patternText}>
                  Pattern: {sentence.pattern}
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Step: Speak - Speech Practice */}
        {step === 'speak' && (
          <SpeechPractice
            expectedKorean={sentence.korean}
            romanization={sentence.romanization}
            onComplete={handleSpeechComplete}
            onTryAgain={handleTryAgain}
            accentColor={colors.primary}
          />
        )}

        {/* Step: Done */}
        {step === 'done' && (
          <View style={styles.doneContainer}>
            <View style={styles.doneIconCircle}>
              <Ionicons name="checkmark" size={32} color="#fff" />
            </View>
            <Text style={styles.doneText}>Great job!</Text>
            <TouchableOpacity
              style={styles.nextButton}
              onPress={handleNext}
              activeOpacity={0.7}
            >
              <LinearGradient
                colors={levelInfo.gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.nextButtonGradient}
              >
                <Text style={styles.nextButtonText}>
                  {currentIndex < totalSentences - 1
                    ? 'Next Sentence'
                    : 'Finish Level'}
                </Text>
                <Ionicons name="arrow-forward" size={20} color="#fff" />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Bottom Action Button (for Listen and Understand steps) */}
      {step === 'listen' && (
        <View style={styles.bottomAction}>
          <TouchableOpacity
            style={styles.continueButton}
            onPress={() => setStep('understand')}
            activeOpacity={0.7}
          >
            <LinearGradient
              colors={levelInfo.gradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.continueGradient}
            >
              <Text style={styles.continueText}>I heard it</Text>
              <Ionicons name="arrow-forward" size={20} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )}

      {step === 'understand' && (
        <View style={styles.bottomAction}>
          <TouchableOpacity
            style={styles.continueButton}
            onPress={() => setStep('speak')}
            activeOpacity={0.7}
          >
            <LinearGradient
              colors={levelInfo.gradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.continueGradient}
            >
              <Text style={styles.continueText}>I understand</Text>
              <Ionicons name="arrow-forward" size={20} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  emptyText: {
    ...typography.body,
    color: colors.textSecondary,
  },

  // Progress
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    gap: spacing.md,
  },
  progressBarBg: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.borderLight,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: 8,
    borderRadius: 4,
  },
  progressText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 13,
    color: colors.textSecondary,
    minWidth: 40,
    textAlign: 'right',
  },

  scrollContent: {
    flex: 1,
  },
  scrollInner: {
    padding: spacing.xl,
    paddingBottom: 120,
  },

  // Step Indicators
  stepIndicators: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
    gap: spacing.xs,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  stepDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepDotActive: {
    backgroundColor: colors.primary,
  },
  stepDotDone: {
    backgroundColor: colors.success,
  },
  stepDotText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 11,
    color: colors.textTertiary,
  },
  stepDotTextActive: {
    color: '#fff',
  },
  stepLabel: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    color: colors.textTertiary,
  },
  stepLabelActive: {
    color: colors.primary,
    fontFamily: 'Poppins-SemiBold',
  },
  stepLabelDone: {
    color: colors.success,
  },
  stepLine: {
    width: 16,
    height: 2,
    backgroundColor: colors.borderLight,
    marginHorizontal: spacing.xs,
  },

  // Sentence Card
  sentenceCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xxl,
    padding: spacing.xxl,
    alignItems: 'center',
    ...shadows.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  sentenceKorean: {
    fontFamily: 'Poppins-Bold',
    fontSize: 28,
    color: colors.textPrimary,
    textAlign: 'center',
    lineHeight: 40,
  },
  sentenceRoman: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: colors.primaryDark,
    textAlign: 'center',
  },
  sentenceEnglish: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  playButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.md,
    ...shadows.glow,
  },
  playButtonActive: {
    backgroundColor: colors.primaryDark,
  },
  playHint: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: colors.textTertiary,
    marginTop: spacing.xs,
  },

  // Breakdown
  breakdownContainer: {
    marginBottom: spacing.xl,
  },
  breakdownTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  breakdownRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  breakdownBox: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    alignItems: 'center',
    minWidth: 70,
  },
  breakdownKorean: {
    fontFamily: 'Poppins-Bold',
    fontSize: 18,
    marginBottom: 2,
  },
  breakdownEnglish: {
    fontFamily: 'Poppins-Regular',
    fontSize: 11,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  patternBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.primaryFaint,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    marginTop: spacing.md,
  },
  patternText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 13,
    color: colors.primaryDark,
    flex: 1,
  },

  // Done
  doneContainer: {
    alignItems: 'center',
    gap: spacing.md,
    marginTop: spacing.md,
  },
  doneIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.success,
    alignItems: 'center',
    justifyContent: 'center',
  },
  doneText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 22,
    color: colors.textPrimary,
  },
  nextButton: {
    borderRadius: borderRadius.full,
    overflow: 'hidden',
    marginTop: spacing.sm,
    ...shadows.md,
  },
  nextButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.lg,
  },
  nextButtonText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
    color: '#fff',
  },

  // Bottom Action
  bottomAction: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxxl,
    paddingTop: spacing.lg,
    backgroundColor: colors.background,
  },
  continueButton: {
    borderRadius: borderRadius.full,
    overflow: 'hidden',
    ...shadows.md,
  },
  continueGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.lg,
  },
  continueText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
    color: '#fff',
  },
});

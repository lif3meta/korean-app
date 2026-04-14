import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { colors, borderRadius, spacing, shadows } from '@/lib/theme';
import { useAppStore } from '@/lib/store';
import { generateDailySession, SessionStep, DailySession } from '@/lib/dailySession';
import { getToday } from '@/lib/utils';
import { XP_REWARDS } from '@/lib/xp';
import { AudioButton } from '@/components/common/AudioButton';
import { vocabulary } from '@/data/vocabulary';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const STEP_ICONS: Record<string, string> = {
  srs_review: 'refresh',
  new_vocab: 'book',
  grammar_point: 'pencil',
  listening: 'ear',
  sentence_build: 'construct',
  mini_quiz: 'help-circle',
};

const STEP_COLORS: Record<string, string> = {
  srs_review: colors.accent,
  new_vocab: '#10b981',
  grammar_point: '#8b5cf6',
  listening: '#06b6d4',
  sentence_build: '#f59e0b',
  mini_quiz: '#ef4444',
};

export default function DailySessionScreen() {
  const insets = useSafeAreaInsets();
  const store = useAppStore();
  const today = getToday();

  const session = useMemo(() => {
    return generateDailySession({
      srsCards: store.srsCards,
      learnedWords: store.learnedWords,
      learnedCharacters: store.learnedCharacters,
      completedLessons: store.completedLessons,
      dailyGoalMinutes: store.dailyGoalMinutes,
    });
  }, []);

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [stepResults, setStepResults] = useState<Record<number, boolean>>({});
  const [xpEarned, setXpEarned] = useState(0);
  const [completed, setCompleted] = useState(false);

  // Inline step state
  const [vocabIndex, setVocabIndex] = useState(0);
  const [vocabFlipped, setVocabFlipped] = useState(false);
  const [quizAnswered, setQuizAnswered] = useState<Record<number, number | null>>({});
  const [listeningAnswered, setListeningAnswered] = useState<Record<number, boolean>>({});
  const [srsAnswered, setSrsAnswered] = useState<Record<number, number>>({});
  const [srsFlipped, setSrsFlipped] = useState(false);

  const currentStep = session.steps[currentStepIndex];
  const progress = session.steps.length > 0 ? ((currentStepIndex) / session.steps.length) * 100 : 0;

  const advanceStep = useCallback(() => {
    if (store.hapticEnabled) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    store.completeDailyStep(today);

    if (currentStepIndex < session.steps.length - 1) {
      setCurrentStepIndex((i) => i + 1);
      // Reset inline state
      setVocabIndex(0);
      setVocabFlipped(false);
      setQuizAnswered({});
      setListeningAnswered({});
      setSrsAnswered({});
      setSrsFlipped(false);
    } else {
      // Session complete
      store.completeDailySession(today, xpEarned);
      setCompleted(true);
    }
  }, [currentStepIndex, session.steps.length, xpEarned, today]);

  if (completed) {
    return (
      <View style={[styles.container, styles.completionContainer]}>
        <View style={styles.completionCard}>
          <View style={styles.completionIcon}>
            <Ionicons name="trophy" size={48} color="#f59e0b" />
          </View>
          <Text style={styles.completionTitle}>Session Complete!</Text>
          <Text style={styles.completionSubtitle}>Great work today</Text>

          <View style={styles.completionStats}>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>{xpEarned}</Text>
              <Text style={styles.statLabel}>XP EARNED</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>{session.steps.length}</Text>
              <Text style={styles.statLabel}>STEPS DONE</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>{session.estimatedMinutes}</Text>
              <Text style={styles.statLabel}>MINUTES</Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.doneButton}
            activeOpacity={0.8}
          >
            <Text style={styles.doneButtonText}>Done</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (!currentStep) {
    return (
      <View style={[styles.container, styles.completionContainer]}>
        <Text style={styles.emptyText}>No daily lesson available. Check back tomorrow!</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Progress bar */}
      <View style={styles.progressBarContainer}>
        <View style={styles.progressBarBg}>
          <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.progressText}>
          {currentStepIndex + 1} / {session.steps.length}
        </Text>
      </View>

      {/* Step header */}
      <View style={styles.stepHeader}>
        <View style={[styles.stepIconCircle, { backgroundColor: (STEP_COLORS[currentStep.type] || colors.accent) + '18' }]}>
          <Ionicons
            name={(STEP_ICONS[currentStep.type] || 'star') as any}
            size={24}
            color={STEP_COLORS[currentStep.type] || colors.accent}
          />
        </View>
        <View>
          <Text style={styles.stepTitle}>{currentStep.title}</Text>
          <Text style={styles.stepTitleKorean}>{currentStep.titleKorean}</Text>
        </View>
      </View>

      {/* Step content */}
      <ScrollView
        style={styles.stepContent}
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {renderStep(currentStep, {
          vocabIndex, setVocabIndex, vocabFlipped, setVocabFlipped,
          quizAnswered, setQuizAnswered,
          listeningAnswered, setListeningAnswered,
          srsAnswered, setSrsAnswered, srsFlipped, setSrsFlipped,
          xpEarned, setXpEarned, store,
        })}
      </ScrollView>

      {/* Continue button */}
      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 12 }]}>
        <TouchableOpacity
          onPress={advanceStep}
          style={styles.continueButton}
          activeOpacity={0.8}
        >
          <Text style={styles.continueText}>
            {currentStepIndex < session.steps.length - 1 ? 'Continue' : 'Finish'}
          </Text>
          <Ionicons name="arrow-forward" size={18} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─── Step Renderers ─────────────────────────────────────────────────────────

interface StepState {
  vocabIndex: number;
  setVocabIndex: (i: number) => void;
  vocabFlipped: boolean;
  setVocabFlipped: (f: boolean) => void;
  quizAnswered: Record<number, number | null>;
  setQuizAnswered: (q: Record<number, number | null>) => void;
  listeningAnswered: Record<number, boolean>;
  setListeningAnswered: (l: Record<number, boolean>) => void;
  srsAnswered: Record<number, number>;
  setSrsAnswered: (s: Record<number, number>) => void;
  srsFlipped: boolean;
  setSrsFlipped: (f: boolean) => void;
  xpEarned: number;
  setXpEarned: (x: number) => void;
  store: any;
}

function renderStep(step: SessionStep, state: StepState) {
  switch (step.type) {
    case 'srs_review':
      return renderSRSReview(step, state);
    case 'new_vocab':
      return renderNewVocab(step, state);
    case 'grammar_point':
      return renderGrammarPoint(step, state);
    case 'listening':
      return renderListening(step, state);
    case 'sentence_build':
      return renderSentenceBuild(step, state);
    case 'mini_quiz':
      return renderMiniQuiz(step, state);
    default:
      return <Text style={styles.emptyText}>Unknown step type</Text>;
  }
}

function renderSRSReview(step: SessionStep & { type: 'srs_review' }, state: StepState) {
  const currentCard = step.cards[Object.keys(state.srsAnswered).length];
  if (!currentCard) {
    return (
      <View style={styles.stepCard}>
        <Ionicons name="checkmark-circle" size={48} color={colors.success} />
        <Text style={styles.cardTitle}>All cards reviewed!</Text>
      </View>
    );
  }

  const word = vocabulary.find((w) => w.id === currentCard.wordId);
  if (!word) return null;

  return (
    <View style={styles.stepCard}>
      <Text style={styles.cardLabel}>Card {Object.keys(state.srsAnswered).length + 1} of {step.cards.length}</Text>

      <TouchableOpacity
        onPress={() => state.setSrsFlipped(!state.srsFlipped)}
        style={styles.flashCard}
        activeOpacity={0.9}
      >
        {!state.srsFlipped ? (
          <>
            <Text style={styles.flashCardKorean}>{word.korean}</Text>
            <Text style={styles.flashCardHint}>Tap to reveal</Text>
          </>
        ) : (
          <>
            <Text style={styles.flashCardKorean}>{word.korean}</Text>
            <Text style={styles.flashCardEnglish}>{word.english}</Text>
            <Text style={styles.flashCardRoman}>{word.romanization}</Text>
          </>
        )}
      </TouchableOpacity>

      {state.srsFlipped && (
        <View style={styles.reviewButtons}>
          <TouchableOpacity
            onPress={() => {
              state.store.updateSRSCard(currentCard.wordId, 1);
              state.setSrsAnswered({ ...state.srsAnswered, [Object.keys(state.srsAnswered).length]: 1 });
              state.setSrsFlipped(false);
              state.setXpEarned(state.xpEarned + XP_REWARDS.reviewCard);
            }}
            style={[styles.reviewBtn, { backgroundColor: colors.dangerLight }]}
          >
            <Text style={[styles.reviewBtnText, { color: colors.danger }]}>Don't Know</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              state.store.updateSRSCard(currentCard.wordId, 5);
              state.setSrsAnswered({ ...state.srsAnswered, [Object.keys(state.srsAnswered).length]: 5 });
              state.setSrsFlipped(false);
              state.setXpEarned(state.xpEarned + XP_REWARDS.reviewCardCorrect);
            }}
            style={[styles.reviewBtn, { backgroundColor: colors.successLight }]}
          >
            <Text style={[styles.reviewBtnText, { color: colors.success }]}>Know</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

function renderNewVocab(step: SessionStep & { type: 'new_vocab' }, state: StepState) {
  const word = step.words[state.vocabIndex];
  if (!word) return null;

  return (
    <View style={styles.stepCard}>
      <Text style={styles.cardLabel}>Word {state.vocabIndex + 1} of {step.words.length}</Text>

      <TouchableOpacity
        onPress={() => state.setVocabFlipped(!state.vocabFlipped)}
        style={styles.flashCard}
        activeOpacity={0.9}
      >
        {!state.vocabFlipped ? (
          <>
            <Text style={styles.flashCardKorean}>{word.korean}</Text>
            <AudioButton text={word.korean} size="md" color={colors.accent} />
            <Text style={styles.flashCardHint}>Tap to see meaning</Text>
          </>
        ) : (
          <>
            <Text style={styles.flashCardKorean}>{word.korean}</Text>
            <Text style={styles.flashCardEnglish}>{word.english}</Text>
            <Text style={styles.flashCardRoman}>{word.romanization}</Text>
            {word.example && (
              <View style={styles.exampleBox}>
                <Text style={styles.exampleKorean}>{word.example.korean}</Text>
                <Text style={styles.exampleEnglish}>{word.example.english}</Text>
              </View>
            )}
          </>
        )}
      </TouchableOpacity>

      <View style={styles.vocabNav}>
        {state.vocabIndex > 0 && (
          <TouchableOpacity
            onPress={() => { state.setVocabIndex(state.vocabIndex - 1); state.setVocabFlipped(false); }}
            style={styles.navBtn}
          >
            <Ionicons name="arrow-back" size={18} color={colors.textSecondary} />
          </TouchableOpacity>
        )}
        <View style={{ flex: 1 }} />
        {state.vocabIndex < step.words.length - 1 ? (
          <TouchableOpacity
            onPress={() => {
              state.store.markWordLearned(word.id);
              state.setVocabIndex(state.vocabIndex + 1);
              state.setVocabFlipped(false);
              state.setXpEarned(state.xpEarned + XP_REWARDS.learnCharacter);
            }}
            style={[styles.navBtn, { backgroundColor: colors.accent }]}
          >
            <Text style={{ color: '#fff', fontFamily: 'Jakarta-SemiBold', fontSize: 14 }}>Next Word</Text>
            <Ionicons name="arrow-forward" size={16} color="#fff" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => {
              state.store.markWordLearned(word.id);
              state.setXpEarned(state.xpEarned + XP_REWARDS.learnCharacter);
            }}
            style={[styles.navBtn, { backgroundColor: colors.success }]}
          >
            <Ionicons name="checkmark" size={18} color="#fff" />
            <Text style={{ color: '#fff', fontFamily: 'Jakarta-SemiBold', fontSize: 14 }}>Learned!</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

function renderGrammarPoint(step: SessionStep & { type: 'grammar_point' }, state: StepState) {
  const lesson = step.lesson;
  return (
    <View style={styles.stepCard}>
      <Text style={styles.cardTitle}>{lesson.title}</Text>
      <Text style={styles.cardSubtitle}>{lesson.description}</Text>

      {lesson.sections.map((section, si) => (
        <View key={si} style={styles.grammarSection}>
          <Text style={styles.grammarHeading}>{section.heading}</Text>
          <Text style={styles.grammarExplanation}>{section.explanation}</Text>
          {section.pattern && (
            <View style={styles.patternBox}>
              <Text style={styles.patternText}>{section.pattern}</Text>
            </View>
          )}
          {section.examples.map((ex, ei) => (
            <View key={ei} style={styles.exampleCard}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Text style={styles.exampleKorean}>{ex.korean}</Text>
                <AudioButton text={ex.korean} size="sm" color={colors.accent} />
              </View>
              <Text style={styles.exampleEnglish}>{ex.english}</Text>
            </View>
          ))}
          {section.tip && (
            <View style={styles.tipBox}>
              <Ionicons name="bulb" size={14} color={colors.warning} />
              <Text style={styles.tipText}>{section.tip}</Text>
            </View>
          )}
        </View>
      ))}

      <TouchableOpacity
        onPress={() => {
          state.store.markLessonComplete(lesson.id, 100);
          state.setXpEarned(state.xpEarned + XP_REWARDS.completeLesson);
        }}
        style={[styles.navBtn, { backgroundColor: colors.accent, alignSelf: 'center', marginTop: spacing.lg }]}
      >
        <Ionicons name="checkmark" size={18} color="#fff" />
        <Text style={{ color: '#fff', fontFamily: 'Jakarta-SemiBold', fontSize: 14 }}>Mark Complete</Text>
      </TouchableOpacity>
    </View>
  );
}

function renderListening(step: SessionStep & { type: 'listening' }, state: StepState) {
  return (
    <View style={styles.stepCard}>
      <Text style={styles.cardSubtitle}>Listen to each word and try to understand before revealing</Text>
      {step.items.map((item, i) => (
        <View key={i} style={styles.listeningItem}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <AudioButton text={item.korean} size="md" color="#06b6d4" />
            <Text style={styles.listeningKorean}>{item.korean}</Text>
          </View>
          {state.listeningAnswered[i] ? (
            <View style={styles.listeningReveal}>
              <Text style={styles.listeningEnglish}>{item.english}</Text>
              <Text style={styles.listeningRoman}>{item.romanization}</Text>
            </View>
          ) : (
            <TouchableOpacity
              onPress={() => {
                state.setListeningAnswered({ ...state.listeningAnswered, [i]: true });
                state.setXpEarned(state.xpEarned + 5);
              }}
              style={styles.revealBtn}
            >
              <Text style={styles.revealBtnText}>Reveal meaning</Text>
            </TouchableOpacity>
          )}
        </View>
      ))}
    </View>
  );
}

function renderSentenceBuild(step: SessionStep & { type: 'sentence_build' }, state: StepState) {
  return (
    <View style={styles.stepCard}>
      <Text style={styles.cardSubtitle}>Study these sentences and their breakdowns</Text>
      {step.sentences.map((sent, i) => (
        <View key={i} style={styles.sentenceCard}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Text style={styles.sentenceKorean}>{sent.korean}</Text>
            <AudioButton text={sent.korean} size="sm" color="#f59e0b" />
          </View>
          <Text style={styles.sentenceEnglish}>{sent.english}</Text>
          <Text style={styles.sentenceRoman}>{sent.romanization}</Text>
          {sent.breakdown.length > 0 && (
            <View style={styles.breakdownRow}>
              {sent.breakdown.map((b, bi) => (
                <View key={bi} style={styles.breakdownChip}>
                  <Text style={styles.breakdownKorean}>{b.korean}</Text>
                  <Text style={styles.breakdownEnglish}>{b.english}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      ))}
    </View>
  );
}

function renderMiniQuiz(step: SessionStep & { type: 'mini_quiz' }, state: StepState) {
  return (
    <View style={styles.stepCard}>
      <Text style={styles.cardSubtitle}>Quick test of what you know</Text>
      {step.questions.map((q, qi) => {
        if (q.type !== 'multiple_choice') return null;
        const answered = state.quizAnswered[qi] !== undefined;
        const selectedIdx = state.quizAnswered[qi];
        const isCorrect = selectedIdx === q.correctIndex;

        return (
          <View key={qi} style={styles.quizQuestion}>
            <Text style={styles.quizQuestionText}>{q.question}</Text>
            {q.options.map((opt, oi) => {
              let optStyle = styles.quizOption;
              if (answered && oi === q.correctIndex) {
                optStyle = { ...styles.quizOption, ...styles.quizOptionCorrect };
              } else if (answered && oi === selectedIdx && !isCorrect) {
                optStyle = { ...styles.quizOption, ...styles.quizOptionWrong };
              }

              return (
                <TouchableOpacity
                  key={oi}
                  disabled={answered}
                  onPress={() => {
                    state.setQuizAnswered({ ...state.quizAnswered, [qi]: oi });
                    const correct = oi === q.correctIndex;
                    state.setXpEarned(state.xpEarned + (correct ? XP_REWARDS.quizCorrect : XP_REWARDS.quizIncorrect));
                  }}
                  style={optStyle}
                >
                  <Text style={styles.quizOptionText}>{opt}</Text>
                </TouchableOpacity>
              );
            })}
            {answered && q.explanation && (
              <Text style={styles.quizExplanation}>{q.explanation}</Text>
            )}
          </View>
        );
      })}
    </View>
  );
}

// ─── Styles ─────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  completionContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  completionCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xxxl,
    padding: spacing.xxxl,
    alignItems: 'center',
    gap: spacing.md,
    width: '100%',
    ...shadows.md,
  },
  completionIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#fef3c7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  completionTitle: {
    fontSize: 24,
    fontFamily: 'Jakarta-ExtraBold',
    color: colors.textPrimary,
  },
  completionSubtitle: {
    fontSize: 15,
    fontFamily: 'Jakarta-Regular',
    color: colors.textTertiary,
  },
  completionStats: {
    flexDirection: 'row',
    gap: spacing.lg,
    marginTop: spacing.lg,
  },
  statBox: {
    alignItems: 'center',
    gap: 2,
  },
  statNumber: {
    fontSize: 28,
    fontFamily: 'Jakarta-ExtraBold',
    color: colors.accent,
  },
  statLabel: {
    fontSize: 10,
    fontFamily: 'Jakarta-Bold',
    letterSpacing: 1,
    color: colors.textTertiary,
  },
  doneButton: {
    backgroundColor: colors.accent,
    borderRadius: borderRadius.full,
    paddingVertical: 14,
    paddingHorizontal: 48,
    marginTop: spacing.xl,
  },
  doneButtonText: {
    fontSize: 16,
    fontFamily: 'Jakarta-Bold',
    color: '#fff',
  },
  emptyText: {
    fontSize: 16,
    fontFamily: 'Jakarta-Regular',
    color: colors.textTertiary,
    textAlign: 'center',
  },
  backBtn: {
    marginTop: spacing.lg,
    backgroundColor: colors.surfaceLow,
    borderRadius: borderRadius.full,
    paddingVertical: 12,
    paddingHorizontal: 32,
  },
  backBtnText: {
    fontSize: 14,
    fontFamily: 'Jakarta-SemiBold',
    color: colors.textPrimary,
  },

  // Progress
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    gap: spacing.md,
  },
  progressBarBg: {
    flex: 1,
    height: 6,
    backgroundColor: colors.surfaceLow,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.accent,
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    fontFamily: 'Jakarta-SemiBold',
    color: colors.textTertiary,
    minWidth: 36,
    textAlign: 'right',
  },

  // Step header
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
  },
  stepIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepTitle: {
    fontSize: 18,
    fontFamily: 'Jakarta-Bold',
    color: colors.textPrimary,
  },
  stepTitleKorean: {
    fontSize: 13,
    fontFamily: 'Jakarta-Regular',
    color: colors.textTertiary,
  },

  // Step content
  stepContent: {
    flex: 1,
    paddingHorizontal: spacing.xl,
  },
  stepCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xxl,
    padding: spacing.xl,
    gap: spacing.md,
    marginTop: spacing.md,
    ...shadows.sm,
  },
  cardLabel: {
    fontSize: 11,
    fontFamily: 'Jakarta-Bold',
    letterSpacing: 1,
    color: colors.textTertiary,
    textTransform: 'uppercase',
  },
  cardTitle: {
    fontSize: 20,
    fontFamily: 'Jakarta-Bold',
    color: colors.textPrimary,
  },
  cardSubtitle: {
    fontSize: 14,
    fontFamily: 'Jakarta-Regular',
    color: colors.textSecondary,
  },

  // Flash card
  flashCard: {
    backgroundColor: colors.surfaceLow,
    borderRadius: borderRadius.xxl,
    padding: spacing.xxxl,
    alignItems: 'center',
    gap: spacing.md,
    minHeight: 180,
    justifyContent: 'center',
  },
  flashCardKorean: {
    fontSize: 36,
    fontFamily: 'Jakarta-ExtraBold',
    color: colors.textPrimary,
  },
  flashCardEnglish: {
    fontSize: 18,
    fontFamily: 'Jakarta-SemiBold',
    color: colors.accent,
  },
  flashCardRoman: {
    fontSize: 14,
    fontFamily: 'Jakarta-Regular',
    color: colors.textTertiary,
  },
  flashCardHint: {
    fontSize: 12,
    fontFamily: 'Jakarta-Regular',
    color: colors.textTertiary,
    marginTop: spacing.sm,
  },

  // Review buttons
  reviewButtons: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  reviewBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: borderRadius.xl,
    alignItems: 'center',
  },
  reviewBtnText: {
    fontSize: 15,
    fontFamily: 'Jakarta-Bold',
  },

  // Vocab nav
  vocabNav: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  navBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surfaceLow,
  },

  // Example
  exampleBox: {
    backgroundColor: colors.warmLavender,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    gap: 4,
    marginTop: spacing.sm,
  },
  exampleKorean: {
    fontSize: 16,
    fontFamily: 'Jakarta-SemiBold',
    color: colors.textPrimary,
  },
  exampleEnglish: {
    fontSize: 14,
    fontFamily: 'Jakarta-Regular',
    color: colors.textSecondary,
  },

  // Grammar
  grammarSection: {
    gap: spacing.sm,
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  grammarHeading: {
    fontSize: 16,
    fontFamily: 'Jakarta-Bold',
    color: colors.textPrimary,
  },
  grammarExplanation: {
    fontSize: 14,
    fontFamily: 'Jakarta-Regular',
    color: colors.textSecondary,
    lineHeight: 22,
  },
  patternBox: {
    backgroundColor: colors.warmCream,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    alignSelf: 'flex-start',
  },
  patternText: {
    fontSize: 14,
    fontFamily: 'Jakarta-SemiBold',
    color: '#92400e',
  },
  exampleCard: {
    backgroundColor: colors.surfaceLow,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    gap: 4,
  },
  exampleRoman: {
    fontSize: 12,
    fontFamily: 'Jakarta-Regular',
    color: colors.textTertiary,
  },
  tipBox: {
    flexDirection: 'row',
    gap: spacing.sm,
    backgroundColor: '#fef3c7',
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'flex-start',
  },
  tipText: {
    flex: 1,
    fontSize: 13,
    fontFamily: 'Jakarta-Regular',
    color: '#92400e',
    lineHeight: 20,
  },

  // Listening
  listeningItem: {
    backgroundColor: colors.surfaceLow,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  listeningKorean: {
    fontSize: 20,
    fontFamily: 'Jakarta-Bold',
    color: colors.textPrimary,
  },
  listeningReveal: {
    paddingLeft: 48,
    gap: 2,
  },
  listeningEnglish: {
    fontSize: 15,
    fontFamily: 'Jakarta-SemiBold',
    color: colors.accent,
  },
  listeningRoman: {
    fontSize: 12,
    fontFamily: 'Jakarta-Regular',
    color: colors.textTertiary,
  },
  revealBtn: {
    alignSelf: 'flex-start',
    marginLeft: 48,
    backgroundColor: '#06b6d4' + '18',
    borderRadius: borderRadius.full,
    paddingVertical: 6,
    paddingHorizontal: 14,
  },
  revealBtnText: {
    fontSize: 13,
    fontFamily: 'Jakarta-SemiBold',
    color: '#06b6d4',
  },

  // Sentences
  sentenceCard: {
    backgroundColor: colors.surfaceLow,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    gap: spacing.xs,
  },
  sentenceKorean: {
    fontSize: 18,
    fontFamily: 'Jakarta-Bold',
    color: colors.textPrimary,
  },
  sentenceEnglish: {
    fontSize: 14,
    fontFamily: 'Jakarta-Regular',
    color: colors.textSecondary,
  },
  sentenceRoman: {
    fontSize: 12,
    fontFamily: 'Jakarta-Regular',
    color: colors.textTertiary,
  },
  breakdownRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  breakdownChip: {
    backgroundColor: colors.warmPink,
    borderRadius: borderRadius.md,
    paddingVertical: 4,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  breakdownKorean: {
    fontSize: 13,
    fontFamily: 'Jakarta-SemiBold',
    color: colors.textPrimary,
  },
  breakdownEnglish: {
    fontSize: 10,
    fontFamily: 'Jakarta-Regular',
    color: colors.textTertiary,
  },

  // Quiz
  quizQuestion: {
    gap: spacing.sm,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  quizQuestionText: {
    fontSize: 15,
    fontFamily: 'Jakarta-SemiBold',
    color: colors.textPrimary,
  },
  quizOption: {
    backgroundColor: colors.surfaceLow,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
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
  quizOptionText: {
    fontSize: 14,
    fontFamily: 'Jakarta-Medium',
    color: colors.textPrimary,
  },
  quizExplanation: {
    fontSize: 12,
    fontFamily: 'Jakarta-Regular',
    color: colors.textSecondary,
    fontStyle: 'italic',
  },

  // Bottom bar
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.accent,
    borderRadius: borderRadius.full,
    paddingVertical: 16,
  },
  continueText: {
    fontSize: 16,
    fontFamily: 'Jakarta-Bold',
    color: '#fff',
  },
});

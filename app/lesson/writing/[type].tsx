import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Platform, Linking, Alert } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { colors, borderRadius, spacing, shadows } from '@/lib/theme';
import { useAppStore } from '@/lib/store';
import { writingPrompts, WritingPrompt } from '@/data/writingPrompts';
import { compareKorean, normalizeKorean } from '@/lib/speechRecognition';
import { shuffleArray } from '@/lib/utils';

const TYPE_META: Record<string, { title: string; titleKorean: string; color: string; icon: string }> = {
  translation: { title: 'Translation', titleKorean: '\uBC88\uC5ED', color: '#8b5cf6', icon: 'swap-horizontal' },
  particle_fill: { title: 'Particle Practice', titleKorean: '\uC870\uC0AC \uC5F0\uC2B5', color: '#06b6d4', icon: 'create' },
  free_write: { title: 'Free Writing', titleKorean: '\uC790\uC720 \uC791\uBB38', color: '#f59e0b', icon: 'document-text' },
};

export default function WritingExerciseScreen() {
  const { type } = useLocalSearchParams<{ type: string }>();
  const insets = useSafeAreaInsets();
  const { hapticEnabled, markLessonComplete } = useAppStore();

  const meta = TYPE_META[type] || TYPE_META.translation;

  const prompts = useMemo(() => {
    const filtered = writingPrompts.filter((p) => p.type === type);
    return shuffleArray(filtered).slice(0, 5);
  }, [type]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [input, setInput] = useState('');
  const [answered, setAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [showSample, setShowSample] = useState(false);
  const [stats, setStats] = useState({ correct: 0, incorrect: 0, completed: 0 });
  const [completed, setCompleted] = useState(false);

  const prompt = prompts[currentIndex];
  const progress = prompts.length > 0 ? (currentIndex / prompts.length) * 100 : 0;

  const handleCheckTranslation = () => {
    if (!prompt || !prompt.targetKorean) return;
    const inputNorm = normalizeKorean(input.trim());
    // Check accepted answers first (exact match)
    const accepted = prompt.acceptedAnswers || [prompt.targetKorean];
    const exactMatch = accepted.some((ans) => normalizeKorean(ans) === inputNorm);
    let correct = exactMatch;
    if (!exactMatch) {
      const result = compareKorean(prompt.targetKorean, input.trim());
      correct = result.score >= 70;
    }
    setIsCorrect(correct);
    setAnswered(true);
    setStats((s) => ({
      ...s,
      correct: s.correct + (correct ? 1 : 0),
      incorrect: s.incorrect + (correct ? 0 : 1),
    }));
    markLessonComplete(`write_${prompt.id}`, correct ? 100 : 0);
    if (hapticEnabled) {
      Haptics.notificationAsync(
        correct ? Haptics.NotificationFeedbackType.Success : Haptics.NotificationFeedbackType.Error
      );
    }
  };

  const handleCheckParticle = () => {
    if (!prompt || !prompt.correctSentence) return;
    const inputNorm = normalizeKorean(input.trim());
    const correctNorm = normalizeKorean(prompt.correctSentence);
    const correct = inputNorm === correctNorm;
    setIsCorrect(correct);
    setAnswered(true);
    setStats((s) => ({
      ...s,
      correct: s.correct + (correct ? 1 : 0),
      incorrect: s.incorrect + (correct ? 0 : 1),
    }));
    markLessonComplete(`write_${prompt.id}`, correct ? 100 : 0);
    if (hapticEnabled) {
      Haptics.notificationAsync(
        correct ? Haptics.NotificationFeedbackType.Success : Haptics.NotificationFeedbackType.Error
      );
    }
  };

  const handleFreeWriteSelfAssess = (didWell: boolean) => {
    setAnswered(true);
    setIsCorrect(didWell);
    setStats((s) => ({
      ...s,
      completed: s.completed + 1,
    }));
    markLessonComplete(`write_${prompt.id}`, didWell ? 100 : 50);
    if (hapticEnabled) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  const nextPrompt = () => {
    if (currentIndex < prompts.length - 1) {
      setCurrentIndex((i) => i + 1);
      setInput('');
      setAnswered(false);
      setIsCorrect(false);
      setShowHints(false);
      setShowSample(false);
    } else {
      setCompleted(true);
    }
  };

  // Completion screen
  if (completed || prompts.length === 0) {
    const isFreeWrite = type === 'free_write';
    return (
      <View style={[styles.container, styles.center]}>
        <View style={styles.completionCard}>
          <View style={[styles.completionIcon, { backgroundColor: meta.color + '18' }]}>
            <Ionicons name={meta.icon as any} size={48} color={meta.color} />
          </View>
          <Text style={styles.completionTitle}>
            {prompts.length === 0 ? 'No exercises available' : 'Practice Complete!'}
          </Text>
          {prompts.length > 0 && (
            <>
              {isFreeWrite ? (
                <View style={styles.statsRow}>
                  <View style={[styles.statBox, { backgroundColor: meta.color + '18' }]}>
                    <Text style={[styles.statNum, { color: meta.color }]}>{stats.completed}</Text>
                    <Text style={styles.statLabel}>COMPLETED</Text>
                  </View>
                </View>
              ) : (
                <View style={styles.statsRow}>
                  <View style={[styles.statBox, { backgroundColor: colors.successLight }]}>
                    <Text style={[styles.statNum, { color: colors.success }]}>{stats.correct}</Text>
                    <Text style={styles.statLabel}>CORRECT</Text>
                  </View>
                  <View style={[styles.statBox, { backgroundColor: colors.dangerLight }]}>
                    <Text style={[styles.statNum, { color: colors.danger }]}>{stats.incorrect}</Text>
                    <Text style={styles.statLabel}>INCORRECT</Text>
                  </View>
                </View>
              )}
            </>
          )}
          <TouchableOpacity onPress={() => router.back()} style={[styles.doneBtn, { backgroundColor: meta.color }]}>
            <Text style={styles.doneBtnText}>Done</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Progress bar */}
      <View style={styles.progressRow}>
        <View style={styles.progressBg}>
          <View style={[styles.progressFill, { width: `${progress}%`, backgroundColor: meta.color }]} />
        </View>
        <Text style={styles.progressCounter}>{currentIndex + 1}/{prompts.length}</Text>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 140 }}>
        {/* Prompt */}
        <View style={styles.promptSection}>
          <View style={[styles.typeBadge, { backgroundColor: meta.color + '18' }]}>
            <Ionicons name={meta.icon as any} size={14} color={meta.color} />
            <Text style={[styles.typeBadgeText, { color: meta.color }]}>{meta.title}</Text>
          </View>
          <Text style={styles.promptText}>{prompt.prompt}</Text>
          {prompt.promptKorean && (
            <Text style={styles.promptKorean}>{prompt.promptKorean}</Text>
          )}
          {prompt.level && (
            <Text style={styles.levelBadge}>
              {prompt.level.charAt(0).toUpperCase() + prompt.level.slice(1)}
            </Text>
          )}
        </View>

        {/* Particle fill: show sentence with blanks */}
        {type === 'particle_fill' && prompt.sentenceWithBlanks && (
          <View style={styles.blanksCard}>
            <Text style={styles.blanksText}>{prompt.sentenceWithBlanks}</Text>
          </View>
        )}

        {/* Hints toggle */}
        {prompt.hints && prompt.hints.length > 0 && !answered && (
          <TouchableOpacity
            onPress={() => setShowHints(!showHints)}
            style={styles.hintsToggle}
            activeOpacity={0.7}
          >
            <Ionicons name={showHints ? 'eye-off' : 'bulb'} size={16} color={meta.color} />
            <Text style={[styles.hintsToggleText, { color: meta.color }]}>
              {showHints ? 'Hide hints' : 'Show hints'}
            </Text>
          </TouchableOpacity>
        )}
        {showHints && prompt.hints && (
          <View style={[styles.hintsBox, { borderColor: meta.color + '40' }]}>
            {prompt.hints.map((hint, i) => (
              <View key={i} style={styles.hintRow}>
                <Ionicons name="bulb-outline" size={14} color={meta.color} />
                <Text style={styles.hintText}>{hint}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Korean keyboard tip */}
        {!answered && (
          <TouchableOpacity
            onPress={() => {
              const url = Platform.OS === 'ios'
                ? 'App-Prefs:General&path=Keyboard/KEYBOARDS'
                : 'content://settings/secure/default_input_method';
              Linking.openURL(url).catch(() => {
                Alert.alert(
                  'Add Korean Keyboard',
                  Platform.OS === 'ios'
                    ? 'Go to Settings → General → Keyboard → Keyboards → Add New Keyboard → Korean'
                    : 'Go to Settings → System → Languages & Input → Virtual Keyboard → Add Korean',
                );
              });
            }}
            style={styles.keyboardTip}
            activeOpacity={0.7}
          >
            <Ionicons name="language" size={16} color="#06b6d4" />
            <Text style={styles.keyboardTipText}>
              Need a Korean keyboard? Tap here to add one in Settings
            </Text>
            <Ionicons name="chevron-forward" size={14} color={colors.textTertiary} />
          </TouchableOpacity>
        )}

        {/* Input area for translation & particle */}
        {(type === 'translation' || type === 'particle_fill') && (
          <View style={styles.inputSection}>
            <TextInput
              value={input}
              onChangeText={setInput}
              editable={!answered}
              placeholder={type === 'translation' ? 'Type your Korean answer...' : 'Type the complete sentence...'}
              placeholderTextColor={colors.textTertiary}
              style={[
                styles.textInput,
                answered && (isCorrect ? styles.inputCorrect : styles.inputWrong),
              ]}
              autoCapitalize="none"
              autoCorrect={false}
            />
            {!answered && input.length > 0 && (
              <TouchableOpacity
                onPress={type === 'translation' ? handleCheckTranslation : handleCheckParticle}
                style={[styles.checkBtn, { backgroundColor: meta.color }]}
              >
                <Text style={styles.checkBtnText}>Check</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Free write input */}
        {type === 'free_write' && (
          <View style={styles.inputSection}>
            <TextInput
              value={input}
              onChangeText={setInput}
              editable={!answered}
              placeholder="Write in Korean..."
              placeholderTextColor={colors.textTertiary}
              style={styles.freeWriteInput}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              autoCapitalize="none"
              autoCorrect={false}
            />

            {/* See Sample button */}
            {!answered && prompt.sampleAnswer && (
              <TouchableOpacity
                onPress={() => setShowSample(!showSample)}
                style={[styles.sampleToggle, { borderColor: meta.color + '40' }]}
                activeOpacity={0.7}
              >
                <Ionicons name={showSample ? 'eye-off' : 'eye'} size={16} color={meta.color} />
                <Text style={[styles.sampleToggleText, { color: meta.color }]}>
                  {showSample ? 'Hide Sample' : 'See Sample'}
                </Text>
              </TouchableOpacity>
            )}
            {showSample && prompt.sampleAnswer && (
              <View style={[styles.sampleBox, { backgroundColor: meta.color + '10' }]}>
                <Text style={styles.sampleLabel}>Sample Answer</Text>
                <Text style={styles.sampleKorean}>{prompt.sampleAnswer}</Text>
                {prompt.sampleAnswerEnglish && (
                  <Text style={styles.sampleEnglish}>{prompt.sampleAnswerEnglish}</Text>
                )}
              </View>
            )}

            {/* Self-assessment buttons */}
            {!answered && input.length > 0 && (
              <View style={styles.selfAssessRow}>
                <TouchableOpacity
                  onPress={() => handleFreeWriteSelfAssess(true)}
                  style={[styles.assessBtn, { backgroundColor: colors.successLight }]}
                >
                  <Ionicons name="checkmark-circle" size={18} color={colors.success} />
                  <Text style={[styles.assessBtnText, { color: colors.success }]}>I wrote well</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleFreeWriteSelfAssess(false)}
                  style={[styles.assessBtn, { backgroundColor: colors.warningLight }]}
                >
                  <Ionicons name="refresh-circle" size={18} color="#f59e0b" />
                  <Text style={[styles.assessBtnText, { color: '#f59e0b' }]}>I need practice</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}

        {/* Feedback */}
        {answered && type !== 'free_write' && (
          <View style={[styles.feedback, isCorrect ? styles.feedbackCorrect : styles.feedbackWrong]}>
            <View style={styles.feedbackHeader}>
              <Ionicons
                name={isCorrect ? 'checkmark-circle' : 'close-circle'}
                size={22}
                color={isCorrect ? colors.success : colors.danger}
              />
              <Text style={[styles.feedbackTitle, { color: isCorrect ? colors.success : colors.danger }]}>
                {isCorrect ? 'Correct!' : 'Not quite'}
              </Text>
            </View>
            {type === 'translation' && (
              <>
                <Text style={styles.feedbackLabel}>Correct answer:</Text>
                <Text style={styles.feedbackKorean}>{prompt.targetKorean}</Text>
                {prompt.acceptedAnswers && prompt.acceptedAnswers.length > 1 && (
                  <>
                    <Text style={styles.feedbackLabel}>Also accepted:</Text>
                    <Text style={styles.feedbackAlts}>
                      {prompt.acceptedAnswers.filter((a) => a !== prompt.targetKorean).join(', ')}
                    </Text>
                  </>
                )}
              </>
            )}
            {type === 'particle_fill' && (
              <>
                <Text style={styles.feedbackLabel}>Correct sentence:</Text>
                <Text style={styles.feedbackKorean}>{prompt.correctSentence}</Text>
              </>
            )}
          </View>
        )}

        {answered && type === 'free_write' && (
          <View style={[styles.feedback, isCorrect ? styles.feedbackCorrect : styles.feedbackWarn]}>
            <View style={styles.feedbackHeader}>
              <Ionicons
                name={isCorrect ? 'checkmark-circle' : 'refresh-circle'}
                size={22}
                color={isCorrect ? colors.success : '#f59e0b'}
              />
              <Text style={[styles.feedbackTitle, { color: isCorrect ? colors.success : '#f59e0b' }]}>
                {isCorrect ? 'Great job!' : 'Keep practicing!'}
              </Text>
            </View>
            {prompt.sampleAnswer && (
              <>
                <Text style={styles.feedbackLabel}>Sample answer:</Text>
                <Text style={styles.feedbackKorean}>{prompt.sampleAnswer}</Text>
                {prompt.sampleAnswerEnglish && (
                  <Text style={styles.feedbackEnglish}>{prompt.sampleAnswerEnglish}</Text>
                )}
              </>
            )}
          </View>
        )}
      </ScrollView>

      {/* Continue */}
      {answered && (
        <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 12 }]}>
          <TouchableOpacity onPress={nextPrompt} style={[styles.continueBtn, { backgroundColor: meta.color }]}>
            <Text style={styles.continueBtnText}>
              {currentIndex < prompts.length - 1 ? 'Next' : 'See Results'}
            </Text>
            <Ionicons name="arrow-forward" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  center: { justifyContent: 'center', alignItems: 'center', padding: spacing.xl },

  // Keyboard tip
  keyboardTip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: '#06b6d4' + '10',
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: '#06b6d4' + '25',
  },
  keyboardTipText: {
    flex: 1,
    fontSize: 12,
    fontFamily: 'Jakarta-Medium',
    color: '#06b6d4',
    lineHeight: 18,
  },

  // Progress
  progressRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.xl, paddingTop: spacing.md, gap: spacing.md },
  progressBg: { flex: 1, height: 6, backgroundColor: colors.surfaceLow, borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 3 },
  progressCounter: { fontSize: 12, fontFamily: 'Jakarta-SemiBold', color: colors.textTertiary },

  content: { flex: 1, paddingHorizontal: spacing.xl, paddingTop: spacing.lg },

  // Prompt
  promptSection: { alignItems: 'center', gap: spacing.sm, marginBottom: spacing.xl },
  typeBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 4, paddingHorizontal: 12, borderRadius: borderRadius.full },
  typeBadgeText: { fontSize: 12, fontFamily: 'Jakarta-SemiBold' },
  promptText: { fontSize: 18, fontFamily: 'Jakarta-Bold', color: colors.textPrimary, textAlign: 'center' },
  promptKorean: { fontSize: 20, fontFamily: 'Jakarta-Bold', color: colors.accent, textAlign: 'center' },
  levelBadge: { fontSize: 11, fontFamily: 'Jakarta-SemiBold', color: colors.textTertiary, backgroundColor: colors.surfaceLow, paddingVertical: 2, paddingHorizontal: 10, borderRadius: borderRadius.full },

  // Blanks card
  blanksCard: { backgroundColor: colors.surfaceLow, borderRadius: borderRadius.xl, padding: spacing.xl, marginBottom: spacing.lg, alignItems: 'center' },
  blanksText: { fontSize: 22, fontFamily: 'Jakarta-Bold', color: colors.textPrimary, textAlign: 'center' },

  // Hints
  hintsToggle: { flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'center', marginBottom: spacing.sm },
  hintsToggleText: { fontSize: 13, fontFamily: 'Jakarta-SemiBold' },
  hintsBox: { borderWidth: 1, borderRadius: borderRadius.xl, padding: spacing.lg, gap: spacing.sm, marginBottom: spacing.lg },
  hintRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  hintText: { fontSize: 13, fontFamily: 'Jakarta-Regular', color: colors.textSecondary, flex: 1 },

  // Input
  inputSection: { gap: spacing.md },
  textInput: { backgroundColor: colors.surface, borderRadius: borderRadius.xl, padding: spacing.lg, fontSize: 20, fontFamily: 'Jakarta-Bold', color: colors.textPrimary, textAlign: 'center', borderWidth: 2, borderColor: colors.border },
  inputCorrect: { borderColor: colors.success, backgroundColor: colors.successLight },
  inputWrong: { borderColor: colors.danger, backgroundColor: colors.dangerLight },
  freeWriteInput: { backgroundColor: colors.surface, borderRadius: borderRadius.xl, padding: spacing.lg, fontSize: 16, fontFamily: 'Jakarta-Regular', color: colors.textPrimary, borderWidth: 2, borderColor: colors.border, minHeight: 120 },
  checkBtn: { borderRadius: borderRadius.full, paddingVertical: 14, alignItems: 'center' },
  checkBtnText: { fontSize: 16, fontFamily: 'Jakarta-Bold', color: '#fff' },

  // Sample
  sampleToggle: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, borderWidth: 1, borderRadius: borderRadius.full, paddingVertical: 10, paddingHorizontal: 20, alignSelf: 'center' },
  sampleToggleText: { fontSize: 14, fontFamily: 'Jakarta-SemiBold' },
  sampleBox: { borderRadius: borderRadius.xl, padding: spacing.lg, gap: spacing.xs },
  sampleLabel: { fontSize: 11, fontFamily: 'Jakarta-Bold', letterSpacing: 1, color: colors.textTertiary },
  sampleKorean: { fontSize: 18, fontFamily: 'Jakarta-Bold', color: colors.textPrimary },
  sampleEnglish: { fontSize: 14, fontFamily: 'Jakarta-Regular', color: colors.textSecondary },

  // Self-assessment
  selfAssessRow: { flexDirection: 'row', gap: spacing.md },
  assessBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, borderRadius: borderRadius.xl, paddingVertical: 14 },
  assessBtnText: { fontSize: 14, fontFamily: 'Jakarta-Bold' },

  // Feedback
  feedback: { borderRadius: borderRadius.xl, padding: spacing.lg, gap: spacing.xs, marginTop: spacing.lg },
  feedbackCorrect: { backgroundColor: colors.successLight },
  feedbackWrong: { backgroundColor: colors.dangerLight },
  feedbackWarn: { backgroundColor: colors.warningLight },
  feedbackHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  feedbackTitle: { fontSize: 16, fontFamily: 'Jakarta-Bold' },
  feedbackLabel: { fontSize: 11, fontFamily: 'Jakarta-Bold', letterSpacing: 1, color: colors.textTertiary, marginTop: spacing.xs },
  feedbackKorean: { fontSize: 20, fontFamily: 'Jakarta-Bold', color: colors.textPrimary },
  feedbackAlts: { fontSize: 14, fontFamily: 'Jakarta-Regular', color: colors.textSecondary },
  feedbackEnglish: { fontSize: 14, fontFamily: 'Jakarta-Regular', color: colors.textSecondary },

  // Bottom
  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.borderLight, paddingHorizontal: spacing.xl, paddingTop: spacing.md },
  continueBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, borderRadius: borderRadius.full, paddingVertical: 16 },
  continueBtnText: { fontSize: 16, fontFamily: 'Jakarta-Bold', color: '#fff' },

  // Completion
  completionCard: { backgroundColor: colors.surface, borderRadius: borderRadius.xxxl, padding: spacing.xxxl, alignItems: 'center', gap: spacing.md, width: '100%', ...shadows.md },
  completionIcon: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.sm },
  completionTitle: { fontSize: 24, fontFamily: 'Jakarta-ExtraBold', color: colors.textPrimary },
  statsRow: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.lg },
  statBox: { flex: 1, borderRadius: borderRadius.xl, padding: spacing.md, alignItems: 'center', gap: 2 },
  statNum: { fontSize: 24, fontFamily: 'Jakarta-ExtraBold' },
  statLabel: { fontSize: 9, fontFamily: 'Jakarta-Bold', letterSpacing: 1, color: colors.textTertiary },
  doneBtn: { borderRadius: borderRadius.full, paddingVertical: 14, paddingHorizontal: 48, marginTop: spacing.xl },
  doneBtnText: { fontSize: 16, fontFamily: 'Jakarta-Bold', color: '#fff' },
});

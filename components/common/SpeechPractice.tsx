import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import {
  useAudioRecorder,
  useAudioPlayer,
  RecordingPresets,
  setAudioModeAsync,
  setIsAudioActiveAsync,
} from 'expo-audio';
import { colors, borderRadius, spacing, shadows } from '@/lib/theme';
import { useAppStore } from '@/lib/store';
import {
  type RecordingState,
  type SpeechResult,
  requestMicPermission,
  evaluateSpeech,
} from '@/lib/speechRecognition';

interface SpeechPracticeProps {
  /** The expected Korean text the user should say */
  expectedKorean: string;
  /** Optional romanization to show as hint */
  romanization?: string;
  /** Called when user completes practice with a score */
  onComplete: (score: number) => void;
  /** Called when user wants to try again */
  onTryAgain: () => void;
  /** Accent color for buttons */
  accentColor?: string;
}

export function SpeechPractice({
  expectedKorean,
  romanization,
  onComplete,
  onTryAgain,
  accentColor = colors.primary,
}: SpeechPracticeProps) {
  const hapticEnabled = useAppStore((s) => s.hapticEnabled);

  const [recordingState, setRecordingState] = useState<RecordingState>('idle');
  const [result, setResult] = useState<SpeechResult | null>(null);
  const [recordingUri, setRecordingUri] = useState<string | null>(null);
  const [isPlayingBack, setIsPlayingBack] = useState(false);
  const [showTextInput, setShowTextInput] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [recordingDuration, setRecordingDuration] = useState(0);

  // expo-audio hooks
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const player = useAudioPlayer(recordingUri);

  // Pulse animation for recording indicator
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const durationInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  // Pulse animation when recording
  useEffect(() => {
    if (recordingState === 'recording') {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 800,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: false,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: false,
          }),
        ])
      );
      pulse.start();

      const glow = Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: false,
          }),
          Animated.timing(glowAnim, {
            toValue: 0,
            duration: 800,
            useNativeDriver: false,
          }),
        ])
      );
      glow.start();

      return () => {
        pulse.stop();
        glow.stop();
        pulseAnim.setValue(1);
        glowAnim.setValue(0);
      };
    }
  }, [recordingState, pulseAnim, glowAnim]);

  // Duration counter during recording
  useEffect(() => {
    if (recordingState === 'recording') {
      setRecordingDuration(0);
      durationInterval.current = setInterval(() => {
        setRecordingDuration((d) => d + 1);
      }, 1000);
      return () => {
        if (durationInterval.current) clearInterval(durationInterval.current);
      };
    } else {
      if (durationInterval.current) clearInterval(durationInterval.current);
    }
  }, [recordingState]);

  const handleStartRecording = useCallback(async () => {
    if (hapticEnabled) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setErrorMessage(null);

    setRecordingState('requesting_permission');
    const hasPermission = await requestMicPermission();
    if (!hasPermission) {
      setErrorMessage('Microphone permission is required to practice speaking.');
      setRecordingState('error');
      return;
    }

    try {
      await setIsAudioActiveAsync(true);
      await setAudioModeAsync({
        allowsRecording: true,
        playsInSilentMode: true,
        interruptionMode: 'doNotMix',
      });
      await recorder.prepareToRecordAsync();
      recorder.record();
      setRecordingState('recording');
    } catch (err: any) {
      console.warn('Failed to start recording:', err);
      setErrorMessage(err?.message || 'Could not start recording. Please try again.');
      setRecordingState('error');
    }
  }, [hapticEnabled, recorder]);

  const handleStopRecording = useCallback(async () => {
    if (hapticEnabled) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    setRecordingState('processing');
    try {
      await recorder.stop();
      const status = recorder.getStatus();
      const uri = status.url;
      if (uri) {
        setRecordingUri(uri);
        await setAudioModeAsync({
          allowsRecording: false,
          playsInSilentMode: true,
          interruptionMode: 'duckOthers',
        });
        setRecordingState('done');
      } else {
        setErrorMessage('Recording failed. Please try again.');
        setRecordingState('error');
      }
    } catch (err) {
      console.warn('Failed to stop recording:', err);
      setErrorMessage('Something went wrong. Please try again.');
      setRecordingState('error');
    }
  }, [hapticEnabled, recorder]);

  const handlePlayback = useCallback(async () => {
    if (!recordingUri || !player) return;
    if (hapticEnabled) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    try {
      if (isPlayingBack) {
        player.pause();
        setIsPlayingBack(false);
      } else {
        player.seekTo(0);
        player.play();
        setIsPlayingBack(true);
      }
    } catch (err) {
      console.warn('Playback error:', err);
      setIsPlayingBack(false);
    }
  }, [recordingUri, player, isPlayingBack, hapticEnabled]);

  const handleSelfAssessment = useCallback(
    (assessment: 'perfect' | 'good' | 'close' | 'try_again') => {
      if (hapticEnabled) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      // Map self-assessment to a score and generate feedback
      const scoreMap = { perfect: 100, good: 85, close: 60, try_again: 30 };
      const score = scoreMap[assessment];

      // Use evaluateSpeech with estimated transcription based on self-assessment
      const selfResult: SpeechResult = {
        transcription: assessment === 'perfect' ? expectedKorean : '',
        expected: expectedKorean,
        score,
        syllableResults: [],
        feedback:
          assessment === 'perfect'
            ? 'Perfect pronunciation! You nailed it!'
            : assessment === 'good'
            ? 'Very close! Just a small difference. Keep practicing!'
            : assessment === 'close'
            ? 'Getting there! Listen again and focus on matching each syllable.'
            : "Don't worry! Listen to the sentence slowly and try to repeat each part.",
        verdict: assessment,
      };
      setResult(selfResult);
    },
    [hapticEnabled, expectedKorean]
  );

  const handleTextCompare = useCallback(() => {
    if (!textInput.trim()) return;
    if (hapticEnabled) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    const speechResult = evaluateSpeech(expectedKorean, textInput.trim());
    setResult(speechResult);
    setShowTextInput(false);
  }, [textInput, expectedKorean, hapticEnabled]);

  const handleRetry = useCallback(() => {
    if (hapticEnabled) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    setRecordingState('idle');
    setResult(null);
    setRecordingUri(null);
    setIsPlayingBack(false);
    setShowTextInput(false);
    setTextInput('');
    setErrorMessage(null);
    setRecordingDuration(0);
    onTryAgain();
  }, [hapticEnabled, onTryAgain]);

  const handleDone = useCallback(() => {
    if (hapticEnabled) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (result) {
      onComplete(result.score);
    }
  }, [hapticEnabled, result, onComplete]);

  const formatDuration = (seconds: number): string => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  // ─── Render: Result View ───────────────────────────────────────────────────

  if (result) {
    const verdictConfig = {
      perfect: { icon: 'trophy' as const, color: '#FFD700', label: 'Perfect!', bg: '#FFF8E1' },
      good: { icon: 'thumbs-up' as const, color: colors.success, label: 'Good Job!', bg: colors.successLight },
      close: { icon: 'trending-up' as const, color: colors.warning, label: 'Almost!', bg: colors.warningLight },
      try_again: { icon: 'refresh' as const, color: colors.danger, label: 'Keep Trying', bg: colors.dangerLight },
    };
    const vc = verdictConfig[result.verdict];

    return (
      <View style={styles.container}>
        {/* Score Circle */}
        <View style={[styles.scoreCircle, { borderColor: vc.color }]}>
          <Ionicons name={vc.icon} size={28} color={vc.color} />
          <Text style={[styles.scoreText, { color: vc.color }]}>{result.score}%</Text>
        </View>
        <Text style={[styles.verdictLabel, { color: vc.color }]}>{vc.label}</Text>

        {/* Comparison */}
        {result.syllableResults.length > 0 && (
          <View style={styles.comparisonContainer}>
            <Text style={styles.comparisonLabel}>Your pronunciation</Text>
            <View style={styles.syllableRow}>
              {result.syllableResults.map((sr, i) => (
                <View
                  key={i}
                  style={[
                    styles.syllableBox,
                    {
                      backgroundColor: sr.match ? colors.successBg : colors.dangerBg,
                      borderColor: sr.match ? colors.success + '40' : colors.danger + '40',
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.syllableExpected,
                      { color: sr.match ? colors.success : colors.danger },
                    ]}
                  >
                    {sr.expected}
                  </Text>
                  {sr.actual && sr.actual !== sr.expected && (
                    <Text style={styles.syllableActual}>{sr.actual}</Text>
                  )}
                  <Ionicons
                    name={sr.match ? 'checkmark-circle' : 'close-circle'}
                    size={14}
                    color={sr.match ? colors.success : colors.danger}
                  />
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Feedback */}
        <View style={[styles.feedbackBox, { backgroundColor: vc.bg }]}>
          <Ionicons name="bulb-outline" size={18} color={vc.color} />
          <Text style={styles.feedbackText}>{result.feedback}</Text>
        </View>

        {/* Playback button if recording exists */}
        {recordingUri && (
          <TouchableOpacity
            style={styles.playbackButton}
            onPress={handlePlayback}
            activeOpacity={0.7}
          >
            <Ionicons
              name={isPlayingBack ? 'pause-circle' : 'play-circle'}
              size={22}
              color={accentColor}
            />
            <Text style={[styles.playbackText, { color: accentColor }]}>
              {isPlayingBack ? 'Playing...' : 'Hear yourself'}
            </Text>
          </TouchableOpacity>
        )}

        {/* Action Buttons */}
        <View style={styles.resultActions}>
          {result.verdict !== 'perfect' && (
            <TouchableOpacity
              style={styles.retryButton}
              onPress={handleRetry}
              activeOpacity={0.7}
            >
              <Ionicons name="refresh" size={20} color={accentColor} />
              <Text style={[styles.retryText, { color: accentColor }]}>Try Again</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[styles.doneButton, { backgroundColor: vc.color }]}
            onPress={handleDone}
            activeOpacity={0.7}
          >
            <Ionicons name="checkmark" size={20} color="#fff" />
            <Text style={styles.doneText}>
              {result.verdict === 'perfect' || result.verdict === 'good' ? 'Continue' : 'Move On'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // ─── Render: Text Input Mode ─────────────────────────────────────────────

  if (showTextInput) {
    return (
      <View style={styles.container}>
        <Text style={styles.promptText}>Type what you said in Korean</Text>
        <Text style={styles.promptSubtext}>
          This compares your input to the expected text
        </Text>
        <TextInput
          style={styles.textInput}
          value={textInput}
          onChangeText={setTextInput}
          placeholder="Type Korean here..."
          placeholderTextColor={colors.textTertiary}
          autoCorrect={false}
          autoCapitalize="none"
        />
        <View style={styles.textActions}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => setShowTextInput(false)}
            activeOpacity={0.7}
          >
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.compareButton, { backgroundColor: accentColor }]}
            onPress={handleTextCompare}
            activeOpacity={0.7}
          >
            <Ionicons name="checkmark" size={20} color="#fff" />
            <Text style={styles.compareText}>Compare</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // ─── Render: Recording / Assessment States ─────────────────────────────────

  return (
    <View style={styles.container}>
      {/* Prompt */}
      <Text style={styles.promptText}>
        {recordingState === 'idle'
          ? 'Now say it!'
          : recordingState === 'recording'
          ? 'Listening...'
          : recordingState === 'processing'
          ? 'Processing...'
          : recordingState === 'done'
          ? 'How did you do?'
          : 'Ready to try?'}
      </Text>

      {romanization && recordingState === 'idle' && (
        <Text style={styles.romanizationHint}>{romanization}</Text>
      )}

      {/* Error Message */}
      {errorMessage && (
        <View style={styles.errorBox}>
          <Ionicons name="warning-outline" size={16} color={colors.danger} />
          <Text style={styles.errorText}>{errorMessage}</Text>
        </View>
      )}

      {/* Mic Button */}
      {(recordingState === 'idle' || recordingState === 'recording' || recordingState === 'error') && (
        <Animated.View
          style={[
            styles.micButtonOuter,
            recordingState === 'recording' && {
              transform: [{ scale: pulseAnim }],
              shadowColor: colors.danger,
              shadowOpacity: glowAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.2, 0.6],
              }) as unknown as number,
              shadowRadius: glowAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [8, 24],
              }) as unknown as number,
            },
          ]}
        >
          <TouchableOpacity
            style={[
              styles.micButton,
              recordingState === 'recording' && styles.micButtonRecording,
            ]}
            onPress={recordingState === 'recording' ? handleStopRecording : handleStartRecording}
            activeOpacity={0.7}
          >
            <Ionicons
              name={recordingState === 'recording' ? 'stop' : 'mic'}
              size={36}
              color={recordingState === 'recording' ? '#fff' : accentColor}
            />
          </TouchableOpacity>
        </Animated.View>
      )}

      {/* Recording Duration */}
      {recordingState === 'recording' && (
        <Text style={styles.durationText}>{formatDuration(recordingDuration)}</Text>
      )}

      {/* Processing Spinner */}
      {recordingState === 'processing' && (
        <ActivityIndicator size="large" color={accentColor} style={styles.spinner} />
      )}

      {/* Hint Text */}
      {recordingState === 'idle' && (
        <Text style={styles.hintText}>Tap the mic and speak clearly</Text>
      )}
      {recordingState === 'recording' && (
        <Text style={styles.hintText}>Tap to stop when done</Text>
      )}

      {/* Self-Assessment (shown after recording) */}
      {recordingState === 'done' && (
        <View style={styles.assessmentContainer}>
          {/* Playback */}
          {recordingUri && (
            <TouchableOpacity
              style={styles.playbackButtonLarge}
              onPress={handlePlayback}
              activeOpacity={0.7}
            >
              <Ionicons
                name={isPlayingBack ? 'pause-circle' : 'play-circle'}
                size={28}
                color={accentColor}
              />
              <Text style={[styles.playbackTextLarge, { color: accentColor }]}>
                {isPlayingBack ? 'Playing your recording...' : 'Listen to your recording'}
              </Text>
            </TouchableOpacity>
          )}

          <Text style={styles.assessLabel}>How well did you match it?</Text>

          <View style={styles.assessGrid}>
            <TouchableOpacity
              style={[styles.assessOption, { backgroundColor: '#FFF8E1', borderColor: '#FFD740' }]}
              onPress={() => handleSelfAssessment('perfect')}
              activeOpacity={0.7}
            >
              <Ionicons name="trophy" size={24} color="#FFD700" />
              <Text style={[styles.assessOptionLabel, { color: '#B8860B' }]}>Perfect</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.assessOption, { backgroundColor: colors.successLight, borderColor: colors.success + '40' }]}
              onPress={() => handleSelfAssessment('good')}
              activeOpacity={0.7}
            >
              <Ionicons name="thumbs-up" size={24} color={colors.success} />
              <Text style={[styles.assessOptionLabel, { color: colors.success }]}>Good</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.assessOption, { backgroundColor: colors.warningLight, borderColor: colors.warning + '40' }]}
              onPress={() => handleSelfAssessment('close')}
              activeOpacity={0.7}
            >
              <Ionicons name="trending-up" size={24} color={colors.warning} />
              <Text style={[styles.assessOptionLabel, { color: colors.warning }]}>Close</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.assessOption, { backgroundColor: colors.dangerLight, borderColor: colors.danger + '40' }]}
              onPress={() => handleSelfAssessment('try_again')}
              activeOpacity={0.7}
            >
              <Ionicons name="refresh" size={24} color={colors.danger} />
              <Text style={[styles.assessOptionLabel, { color: colors.danger }]}>Not yet</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Text input fallback link */}
      {(recordingState === 'idle' || recordingState === 'error') && (
        <TouchableOpacity
          style={styles.textFallback}
          onPress={() => setShowTextInput(true)}
          activeOpacity={0.7}
        >
          <Ionicons name="text" size={14} color={colors.textTertiary} />
          <Text style={styles.textFallbackText}>Type instead</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
  },

  // Prompt
  promptText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 20,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  promptSubtext: {
    fontFamily: 'Poppins-Regular',
    fontSize: 13,
    color: colors.textTertiary,
    textAlign: 'center',
  },
  romanizationHint: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: colors.primaryDark,
    textAlign: 'center',
    marginTop: -4,
  },

  // Error
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.dangerLight,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    width: '100%',
  },
  errorText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 13,
    color: colors.danger,
    flex: 1,
  },

  // Mic Button
  micButtonOuter: {
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  micButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primaryPale,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: colors.primary,
  },
  micButtonRecording: {
    backgroundColor: colors.danger,
    borderColor: colors.danger,
  },

  // Duration
  durationText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: colors.danger,
  },

  // Spinner
  spinner: {
    marginVertical: spacing.md,
  },

  // Hint
  hintText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 13,
    color: colors.textTertiary,
    textAlign: 'center',
  },

  // Assessment
  assessmentContainer: {
    width: '100%',
    alignItems: 'center',
    gap: spacing.md,
  },
  assessLabel: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 15,
    color: colors.textSecondary,
    marginTop: spacing.sm,
  },
  assessGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    justifyContent: 'center',
  },
  assessOption: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1.5,
    minWidth: 85,
    gap: 4,
  },
  assessOptionLabel: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 12,
  },

  // Playback
  playbackButtonLarge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.sm,
  },
  playbackTextLarge: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
  },
  playbackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  playbackText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 13,
  },

  // Text fallback
  textFallback: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.sm,
    paddingVertical: spacing.xs,
  },
  textFallbackText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: colors.textTertiary,
    textDecorationLine: 'underline',
  },

  // Text Input
  textInput: {
    width: '100%',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    fontFamily: 'Poppins-Regular',
    fontSize: 18,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  textActions: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  cancelButton: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.full,
    backgroundColor: colors.borderLight,
  },
  cancelText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: colors.textSecondary,
  },
  compareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.full,
  },
  compareText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    color: '#fff',
  },

  // Result View
  scoreCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 4,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    ...shadows.md,
  },
  scoreText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 22,
    marginTop: 2,
  },
  verdictLabel: {
    fontFamily: 'Poppins-Bold',
    fontSize: 20,
  },

  // Comparison
  comparisonContainer: {
    width: '100%',
    gap: spacing.sm,
  },
  comparisonLabel: {
    fontFamily: 'Poppins-Medium',
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  syllableRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  syllableBox: {
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    minWidth: 36,
    gap: 2,
  },
  syllableExpected: {
    fontFamily: 'Poppins-Bold',
    fontSize: 18,
  },
  syllableActual: {
    fontFamily: 'Poppins-Regular',
    fontSize: 11,
    color: colors.textTertiary,
  },

  // Feedback
  feedbackBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    width: '100%',
  },
  feedbackText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 13,
    color: colors.textPrimary,
    flex: 1,
    lineHeight: 20,
  },

  // Result Actions
  resultActions: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.primaryPale,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.full,
  },
  retryText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 15,
  },
  doneButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.full,
    ...shadows.sm,
  },
  doneText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 15,
    color: '#fff',
  },
});

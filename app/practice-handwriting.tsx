import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { WebView, WebViewMessageEvent } from 'react-native-webview';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { colors, borderRadius, spacing, shadows } from '@/lib/theme';
import { useAppStore } from '@/lib/store';
import { geminiProxy } from '@/lib/utils';

// Words to practice — progresses from characters to syllables to words
const PRACTICE_ITEMS = [
  // Basic consonants
  { korean: 'ㄱ', english: 'giyeok (g/k)', category: 'Consonant' },
  { korean: 'ㄴ', english: 'nieun (n)', category: 'Consonant' },
  { korean: 'ㅁ', english: 'mieum (m)', category: 'Consonant' },
  { korean: 'ㅅ', english: 'siot (s)', category: 'Consonant' },
  { korean: 'ㅇ', english: 'ieung (ng)', category: 'Consonant' },
  // Basic vowels
  { korean: 'ㅏ', english: 'a', category: 'Vowel' },
  { korean: 'ㅗ', english: 'o', category: 'Vowel' },
  { korean: 'ㅜ', english: 'u', category: 'Vowel' },
  { korean: 'ㅡ', english: 'eu', category: 'Vowel' },
  { korean: 'ㅣ', english: 'i', category: 'Vowel' },
  // Syllables
  { korean: '가', english: 'ga', category: 'Syllable' },
  { korean: '나', english: 'na', category: 'Syllable' },
  { korean: '다', english: 'da', category: 'Syllable' },
  { korean: '마', english: 'ma', category: 'Syllable' },
  { korean: '한', english: 'han', category: 'Syllable' },
  // Words
  { korean: '한글', english: 'Hangul', category: 'Word' },
  { korean: '사랑', english: 'Love', category: 'Word' },
  { korean: '가방', english: 'Bag', category: 'Word' },
  { korean: '한국', english: 'Korea', category: 'Word' },
  { korean: '감사', english: 'Thanks', category: 'Word' },
];

type FeedbackState = null | {
  correct: boolean;
  message: string;
};

const CANVAS_HTML = `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background: #fff; overflow: hidden; touch-action: none; }
    canvas { display: block; width: 100%; height: 100%; }
  </style>
</head>
<body>
  <canvas id="pad"></canvas>
  <script>
    (function () {
      var canvas = document.getElementById('pad');
      var ctx = canvas.getContext('2d');
      var drawing = false;
      var hasStrokes = false;
      function resize() {
        var rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * 2;
        canvas.height = rect.height * 2;
        ctx.scale(2, 2);
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.lineWidth = 5;
        ctx.strokeStyle = '#303335';
        // Draw center guides
        ctx.save();
        ctx.strokeStyle = '#e5e7eb';
        ctx.lineWidth = 0.5;
        ctx.setLineDash([6, 4]);
        ctx.beginPath();
        ctx.moveTo(rect.width / 2, 0);
        ctx.lineTo(rect.width / 2, rect.height);
        ctx.moveTo(0, rect.height / 2);
        ctx.lineTo(rect.width, rect.height / 2);
        ctx.stroke();
        ctx.restore();
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.lineWidth = 5;
        ctx.strokeStyle = '#303335';
      }
      resize();
      function getPos(e) {
        var rect = canvas.getBoundingClientRect();
        var t = e.touches ? e.touches[0] : e;
        return { x: t.clientX - rect.left, y: t.clientY - rect.top };
      }
      function startDraw(e) { e.preventDefault(); drawing = true; hasStrokes = true; var p = getPos(e); ctx.beginPath(); ctx.moveTo(p.x, p.y); }
      function draw(e) { e.preventDefault(); if (!drawing) return; var p = getPos(e); ctx.lineTo(p.x, p.y); ctx.stroke(); }
      function endDraw(e) { e.preventDefault(); drawing = false; }
      canvas.addEventListener('mousedown', startDraw);
      canvas.addEventListener('mousemove', draw);
      canvas.addEventListener('mouseup', endDraw);
      canvas.addEventListener('touchstart', startDraw, { passive: false });
      canvas.addEventListener('touchmove', draw, { passive: false });
      canvas.addEventListener('touchend', endDraw, { passive: false });
      function post(msg) { window.ReactNativeWebView.postMessage(JSON.stringify(msg)); }
      function handleCommand(event) {
        try {
          var payload = JSON.parse(event.data);
          if (payload.type === 'clear') { ctx.clearRect(0, 0, canvas.width, canvas.height); hasStrokes = false; resize(); }
          else if (payload.type === 'capture') {
            if (!hasStrokes) { post({ type: 'empty' }); return; }
            var dataUrl = canvas.toDataURL('image/png');
            post({ type: 'image', data: dataUrl.split(',')[1] });
          }
        } catch (e) {}
      }
      document.addEventListener('message', handleCommand);
      window.addEventListener('message', handleCommand);
    })();
  </script>
</body>
</html>
`;

async function checkHandwriting(imageBase64: string, targetKorean: string): Promise<{ correct: boolean; message: string }> {
  const prompt = `You are a Korean handwriting checker for a language learning app. The user was asked to write "${targetKorean}" in Korean.

Look at the handwritten image and determine:
1. Does it match "${targetKorean}"?
2. Is the writing legible?

Respond in JSON with exactly:
- "correct": true if the writing reasonably matches "${targetKorean}" (be lenient with handwriting quality but the characters must be correct)
- "message": a short encouraging feedback (1 sentence). If correct, praise them. If wrong, tell them what you see and encourage them to try again.

ONLY return JSON, no markdown.`;

  const data = await geminiProxy(
    [{
      parts: [
        { text: prompt },
        { inlineData: { mimeType: 'image/png', data: imageBase64 } },
      ],
    }],
    { responseMimeType: 'application/json', maxOutputTokens: 256 },
  ) as any;
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
  try {
    const parsed = JSON.parse(text);
    return { correct: !!parsed.correct, message: parsed.message || '' };
  } catch {
    return { correct: false, message: 'Could not check your writing. Try again!' };
  }
}

export default function HandwritingPracticeScreen() {
  const insets = useSafeAreaInsets();
  const { hapticEnabled } = useAppStore();
  const webViewRef = useRef<WebView>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [checking, setChecking] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackState>(null);
  const [stats, setStats] = useState({ correct: 0, total: 0 });
  const [completed, setCompleted] = useState(false);

  // Shuffle and pick 10 items for a session
  const [items] = useState(() => {
    const shuffled = [...PRACTICE_ITEMS].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 10);
  });

  const current = items[currentIndex];

  const clearPad = useCallback(() => {
    webViewRef.current?.postMessage(JSON.stringify({ type: 'clear' }));
    setFeedback(null);
  }, []);

  const handleSubmit = useCallback(async (imageBase64: string) => {
    if (checking) return;
    setChecking(true);
    setFeedback(null);
    try {
      const result = await checkHandwriting(imageBase64, current.korean);
      if (hapticEnabled) {
        Haptics.notificationAsync(
          result.correct
            ? Haptics.NotificationFeedbackType.Success
            : Haptics.NotificationFeedbackType.Error
        );
      }
      setFeedback(result);
      setStats((s) => ({
        correct: s.correct + (result.correct ? 1 : 0),
        total: s.total + 1,
      }));
    } catch {
      setFeedback({ correct: false, message: 'Could not check. Please try again.' });
    } finally {
      setChecking(false);
    }
  }, [checking, current, hapticEnabled]);

  const handleMessage = useCallback((event: WebViewMessageEvent) => {
    try {
      const msg = JSON.parse(event.nativeEvent.data);
      if (msg.type === 'image') {
        handleSubmit(msg.data);
      } else if (msg.type === 'empty') {
        if (hapticEnabled) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      }
    } catch {}
  }, [handleSubmit, hapticEnabled]);

  const goNext = useCallback(() => {
    if (currentIndex < items.length - 1) {
      setCurrentIndex((i) => i + 1);
      setFeedback(null);
      webViewRef.current?.postMessage(JSON.stringify({ type: 'clear' }));
    } else {
      setCompleted(true);
    }
  }, [currentIndex, items.length]);

  if (completed) {
    const pct = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.completedWrap}>
          <Ionicons name="trophy" size={64} color={colors.warning} />
          <Text style={styles.completedTitle}>Practice Complete!</Text>
          <View style={styles.completedStats}>
            <View style={styles.completedStatBox}>
              <Text style={[styles.completedStatNum, { color: colors.success }]}>{stats.correct}</Text>
              <Text style={styles.completedStatLabel}>Correct</Text>
            </View>
            <View style={styles.completedStatBox}>
              <Text style={[styles.completedStatNum, { color: colors.textTertiary }]}>{stats.total}</Text>
              <Text style={styles.completedStatLabel}>Attempts</Text>
            </View>
            <View style={styles.completedStatBox}>
              <Text style={[styles.completedStatNum, { color: colors.accent }]}>{pct}%</Text>
              <Text style={styles.completedStatLabel}>Accuracy</Text>
            </View>
          </View>
          <TouchableOpacity onPress={() => router.back()} style={styles.doneBtn} activeOpacity={0.8}>
            <Text style={styles.doneBtnText}>Done</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Handwriting Practice</Text>
          <Text style={styles.headerSub}>손글씨 연습</Text>
        </View>
        <Text style={styles.counter}>{currentIndex + 1}/{items.length}</Text>
      </View>

      {/* Progress bar */}
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${((currentIndex + 1) / items.length) * 100}%` as any }]} />
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.scrollContent} bounces={false}>
        {/* Target character */}
        <View style={styles.targetCard}>
          <Text style={styles.categoryBadge}>{current.category}</Text>
          <Text style={styles.targetKorean}>{current.korean}</Text>
          <Text style={styles.targetEnglish}>{current.english}</Text>
          <Text style={styles.instruction}>Write this character below</Text>
        </View>

        {/* Drawing pad */}
        <View style={styles.padWrap}>
          <View style={styles.canvasWrap}>
            <WebView
              ref={webViewRef}
              originWhitelist={['*']}
              source={{ html: CANVAS_HTML, baseUrl: 'https://app.local/' }}
              onMessage={handleMessage}
              javaScriptEnabled
              injectedJavaScriptBeforeContentLoaded={'true;'}
              injectedJavaScript={'true;'}
              scrollEnabled={false}
              bounces={false}
              style={styles.canvas}
            />
          </View>

          {/* Action buttons */}
          <View style={styles.padActions}>
            <TouchableOpacity onPress={clearPad} style={styles.padBtn} activeOpacity={0.7}>
              <Ionicons name="trash-outline" size={20} color={colors.textTertiary} />
              <Text style={styles.padBtnText}>Clear</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => webViewRef.current?.postMessage(JSON.stringify({ type: 'capture' }))}
              style={[styles.checkBtn, checking && { opacity: 0.6 }]}
              activeOpacity={0.8}
              disabled={checking}
            >
              {checking ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <>
                  <Ionicons name="checkmark-circle" size={20} color="#fff" />
                  <Text style={styles.checkBtnText}>Check</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Feedback */}
        {feedback && (
          <View style={[styles.feedbackCard, feedback.correct ? styles.feedbackCorrect : styles.feedbackIncorrect]}>
            <View style={styles.feedbackIconRow}>
              <Ionicons
                name={feedback.correct ? 'checkmark-circle' : 'refresh-circle'}
                size={24}
                color={feedback.correct ? colors.success : colors.warning}
              />
              <Text style={[styles.feedbackTitle, { color: feedback.correct ? colors.success : colors.warning }]}>
                {feedback.correct ? 'Correct!' : 'Try Again'}
              </Text>
            </View>
            <Text style={styles.feedbackMessage}>{feedback.message}</Text>
            {feedback.correct && (
              <TouchableOpacity onPress={goNext} style={styles.nextBtn} activeOpacity={0.8}>
                <Text style={styles.nextBtnText}>
                  {currentIndex < items.length - 1 ? 'Next' : 'Finish'}
                </Text>
                <Ionicons name="chevron-forward" size={18} color="#fff" />
              </TouchableOpacity>
            )}
            {!feedback.correct && (
              <TouchableOpacity onPress={clearPad} style={styles.retryBtn} activeOpacity={0.8}>
                <Ionicons name="refresh" size={16} color={colors.warning} />
                <Text style={styles.retryBtnText}>Clear & Try Again</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Skip */}
        {!feedback?.correct && (
          <TouchableOpacity onPress={goNext} style={styles.skipBtn} activeOpacity={0.7}>
            <Text style={styles.skipBtnText}>Skip</Text>
            <Ionicons name="chevron-forward" size={16} color={colors.textTertiary} />
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  headerCenter: { flex: 1, alignItems: 'center' },
  headerTitle: { fontSize: 16, fontFamily: 'Jakarta-Bold', color: colors.textPrimary },
  headerSub: { fontSize: 11, fontFamily: 'Jakarta-Medium', color: colors.textTertiary },
  counter: { fontSize: 13, fontFamily: 'Jakarta-Bold', color: colors.textTertiary, minWidth: 24, textAlign: 'right' },
  progressBar: { height: 4, backgroundColor: colors.borderLight, marginHorizontal: spacing.lg },
  progressFill: { height: 4, backgroundColor: colors.accent, borderRadius: 2 },
  scrollContent: { padding: spacing.xl, gap: spacing.lg, paddingBottom: spacing.xxxl },

  // Target
  targetCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xxl,
    padding: spacing.xxl,
    alignItems: 'center',
    gap: spacing.sm,
    ...shadows.sm,
  },
  categoryBadge: {
    fontSize: 11,
    fontFamily: 'Jakarta-Bold',
    color: colors.primary,
    backgroundColor: colors.primaryFaint,
    paddingHorizontal: spacing.md,
    paddingVertical: 3,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  targetKorean: {
    fontSize: 64,
    fontFamily: 'Jakarta-ExtraBold',
    color: colors.textPrimary,
    lineHeight: 80,
  },
  targetEnglish: {
    fontSize: 16,
    fontFamily: 'Jakarta-Medium',
    color: colors.textSecondary,
  },
  instruction: {
    fontSize: 12,
    fontFamily: 'Jakarta-Regular',
    color: colors.textTertiary,
    marginTop: spacing.xs,
  },

  // Drawing pad
  padWrap: {
    gap: spacing.md,
  },
  canvasWrap: {
    height: 220,
    borderRadius: borderRadius.xl,
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  canvas: { flex: 1, backgroundColor: 'transparent' },
  padActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.md,
  },
  padBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.xl,
    backgroundColor: colors.surfaceLow,
  },
  padBtnText: { fontSize: 14, fontFamily: 'Jakarta-Medium', color: colors.textTertiary },
  checkBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.xl,
    backgroundColor: colors.primary,
    minWidth: 120,
    justifyContent: 'center',
  },
  checkBtnText: { fontSize: 14, fontFamily: 'Jakarta-Bold', color: '#fff' },

  // Feedback
  feedbackCard: {
    borderRadius: borderRadius.xxl,
    padding: spacing.xl,
    gap: spacing.md,
    ...shadows.sm,
  },
  feedbackCorrect: {
    backgroundColor: colors.successBg || '#f0fdf4',
    borderWidth: 1,
    borderColor: colors.success + '30',
  },
  feedbackIncorrect: {
    backgroundColor: '#fffbeb',
    borderWidth: 1,
    borderColor: colors.warning + '30',
  },
  feedbackIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  feedbackTitle: {
    fontSize: 18,
    fontFamily: 'Jakarta-ExtraBold',
  },
  feedbackMessage: {
    fontSize: 14,
    fontFamily: 'Jakarta-Regular',
    color: colors.textSecondary,
    lineHeight: 22,
  },
  nextBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.xl,
    alignSelf: 'center',
  },
  nextBtnText: { fontSize: 15, fontFamily: 'Jakarta-Bold', color: '#fff' },
  retryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.warning + '40',
    alignSelf: 'center',
  },
  retryBtnText: { fontSize: 14, fontFamily: 'Jakarta-Bold', color: colors.warning },

  // Skip
  skipBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    alignSelf: 'center',
    paddingVertical: spacing.sm,
  },
  skipBtnText: { fontSize: 13, fontFamily: 'Jakarta-Medium', color: colors.textTertiary },

  // Completed
  completedWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xxl,
    gap: spacing.lg,
  },
  completedTitle: {
    fontSize: 26,
    fontFamily: 'Jakarta-ExtraBold',
    color: colors.textPrimary,
  },
  completedStats: {
    flexDirection: 'row',
    gap: spacing.xxl,
    marginTop: spacing.md,
  },
  completedStatBox: { alignItems: 'center', gap: 4 },
  completedStatNum: {
    fontSize: 32,
    fontFamily: 'Jakarta-ExtraBold',
  },
  completedStatLabel: {
    fontSize: 12,
    fontFamily: 'Jakarta-Medium',
    color: colors.textTertiary,
  },
  doneBtn: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xxxl,
    borderRadius: borderRadius.xl,
    marginTop: spacing.xl,
  },
  doneBtnText: { fontSize: 16, fontFamily: 'Jakarta-Bold', color: '#fff' },
});

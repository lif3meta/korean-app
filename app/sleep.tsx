import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  Easing,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';
import { vocabulary, VocabWord } from '@/data/vocabulary';
import { sentences, Sentence } from '@/data/sentences';
import { colors, spacing, borderRadius } from '@/lib/theme';
import { speakKoreanAsync, speakEnglishAsync, stopSpeaking, waitForSpeechEnd } from '@/lib/audio';

// ── Sleep-specific sentence pairs ──────────────────────────────────
const sleepSentences: { korean: string; english: string; romanization: string }[] = [
  { korean: '안녕하세요', english: 'Hello', romanization: 'annyeonghaseyo' },
  { korean: '감사합니다', english: 'Thank you', romanization: 'gamsahamnida' },
  { korean: '저는 학생이에요', english: 'I am a student', romanization: 'jeoneun haksaengieyo' },
  { korean: '이거 뭐예요', english: 'What is this', romanization: 'igeo mwoyeyo' },
  { korean: '얼마예요', english: 'How much is it', romanization: 'eolmayeyo' },
  { korean: '맛있어요', english: 'It is delicious', romanization: 'masisseoyo' },
  { korean: '좋아요', english: 'It is good', romanization: 'joayo' },
  { korean: '물 주세요', english: 'Water please', romanization: 'mul juseyo' },
  { korean: '화장실 어디예요', english: 'Where is the bathroom', romanization: 'hwajangsil eodiyeyo' },
  { korean: '한국어를 공부해요', english: 'I study Korean', romanization: 'hangugeoreul gongbuhaeyo' },
  { korean: '배고파요', english: 'I am hungry', romanization: 'baegopayo' },
  { korean: '피곤해요', english: 'I am tired', romanization: 'pigonhaeyo' },
  { korean: '기분이 좋아요', english: 'I feel good', romanization: 'gibuni joayo' },
  { korean: '이름이 뭐예요', english: 'What is your name', romanization: 'ireumi mwoyeyo' },
  { korean: '천천히 말해 주세요', english: 'Please speak slowly', romanization: 'cheoncheonhi malhae juseyo' },
  { korean: '다시 말해 주세요', english: 'Please say it again', romanization: 'dasi malhae juseyo' },
  { korean: '한국어를 못해요', english: 'I cannot speak Korean', romanization: 'hangugeoreul mothaeyo' },
  { korean: '어디에 가요', english: 'Where are you going', romanization: 'eodie gayo' },
  { korean: '오늘 날씨가 좋아요', english: 'The weather is nice today', romanization: 'oneul nalssiga joayo' },
  { korean: '사랑해요', english: 'I love you', romanization: 'saranghaeyo' },
  { korean: '괜찮아요', english: 'It is okay', romanization: 'gwaenchanayo' },
  { korean: '미안해요', english: 'I am sorry', romanization: 'mianhaeyo' },
  { korean: '잘 자요', english: 'Good night', romanization: 'jal jayo' },
  { korean: '또 만나요', english: 'See you again', romanization: 'tto mannayo' },
  { korean: '여기 앉아도 돼요', english: 'May I sit here', romanization: 'yeogi anjado dwaeyo' },
  { korean: '메뉴 주세요', english: 'Menu please', romanization: 'menyu juseyo' },
  { korean: '계산해 주세요', english: 'Check please', romanization: 'gyesanhae juseyo' },
  { korean: '도와주세요', english: 'Please help me', romanization: 'dowajuseyo' },
  { korean: '잠깐만요', english: 'Just a moment', romanization: 'jamkkanmanyo' },
  { korean: '재미있어요', english: 'It is fun', romanization: 'jaemiisseoyo' },
];

// ── Types ──────────────────────────────────────────────────────────
type ContentType = 'words' | 'sentences' | 'both';
type SpeedType = 'slow' | 'normal' | 'fast';

interface SleepItem {
  korean: string;
  english: string;
  romanization: string;
}

// ── Timer options ──────────────────────────────────────────────────
const TIMER_OPTIONS = [
  { label: '5 min', minutes: 5 },
  { label: '10 min', minutes: 10 },
  { label: '15 min', minutes: 15 },
  { label: '30 min', minutes: 30 },
  { label: '60 min', minutes: 60 },
];

const SPEED_MAP: Record<SpeedType, number> = {
  slow: 0.65,
  normal: 0.8,
  fast: 1.0,
};

// ── Shuffle helper ─────────────────────────────────────────────────
function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// ── Build item pool ────────────────────────────────────────────────
function buildItemPool(contentType: ContentType): SleepItem[] {
  let pool: SleepItem[] = [];

  if (contentType === 'words' || contentType === 'both') {
    const vocabItems: SleepItem[] = vocabulary.map((w: VocabWord) => ({
      korean: w.korean,
      english: w.english,
      romanization: w.romanization,
    }));
    pool = pool.concat(vocabItems);
  }

  if (contentType === 'sentences' || contentType === 'both') {
    const sentenceItems: SleepItem[] = sentences.map((s: Sentence) => ({
      korean: s.korean,
      english: s.english,
      romanization: s.romanization,
    }));
    pool = pool.concat(sentenceItems);
    pool = pool.concat(sleepSentences);
  }

  // Deduplicate by korean text
  const seen = new Set<string>();
  pool = pool.filter((item) => {
    if (seen.has(item.korean)) return false;
    seen.add(item.korean);
    return true;
  });

  return shuffleArray(pool);
}

// ── Format time ────────────────────────────────────────────────────
function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

// ════════════════════════════════════════════════════════════════════
// Component
// ════════════════════════════════════════════════════════════════════
export default function SleepScreen() {
  const insets = useSafeAreaInsets();

  // ── Setup state ────────────────────────────────────────────────
  const [selectedMinutes, setSelectedMinutes] = useState(15);
  const [contentType, setContentType] = useState<ContentType>('both');
  const [speedType, setSpeedType] = useState<SpeedType>('normal');

  // ── Playback state ─────────────────────────────────────────────
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentItem, setCurrentItem] = useState<SleepItem | null>(null);
  const [currentRepeat, setCurrentRepeat] = useState(1);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [secondsRemaining, setSecondsRemaining] = useState(0);

  // ── Refs ───────────────────────────────────────────────────────
  const itemPoolRef = useRef<SleepItem[]>([]);
  const indexRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isCancelledRef = useRef(false);
  const isPausedRef = useRef(false);
  const pauseResolveRef = useRef<(() => void) | null>(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  // ── Cleanup on unmount ─────────────────────────────────────────
  useEffect(() => {
    return () => {
      stopSpeaking();
      isCancelledRef.current = true;
      if (timerRef.current) clearInterval(timerRef.current);
      deactivateKeepAwake();
    };
  }, []);

  // ── Pulse animation ────────────────────────────────────────────
  useEffect(() => {
    if (!isPlaying || isPaused) return;
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.15,
          duration: 3000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 3000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, [isPlaying, isPaused]);

  // ── Glow animation ─────────────────────────────────────────────
  useEffect(() => {
    if (!isPlaying || isPaused) return;
    const glow = Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
      ])
    );
    glow.start();
    return () => glow.stop();
  }, [isPlaying, isPaused]);

  // ── Helpers ────────────────────────────────────────────────────
  const wait = useCallback(
    (ms: number) =>
      new Promise<void>((resolve) => {
        const check = () => {
          if (isCancelledRef.current) {
            resolve();
            return;
          }
          if (isPausedRef.current) {
            pauseResolveRef.current = () => {
              pauseResolveRef.current = null;
              setTimeout(check, 0);
            };
            return;
          }
          resolve();
        };
        setTimeout(check, ms);
      }),
    []
  );

  const speakAsync = useCallback(
    async (text: string, language: string, _rate: number) => {
      if (isCancelledRef.current) return;
      try {
        if (language === 'ko-KR') {
          await speakKoreanAsync(text);
        } else {
          await speakEnglishAsync(text);
        }
        await waitForSpeechEnd();
      } catch {
        // ignore errors, continue loop
      }
    },
    []
  );

  // ── Core playback loop ─────────────────────────────────────────
  const runPlaybackLoop = useCallback(async (pool: SleepItem[], durationSec: number, speed: number) => {
    isCancelledRef.current = false;
    isPausedRef.current = false;
    let idx = 0;

    while (!isCancelledRef.current) {
      const item = pool[idx % pool.length];
      indexRef.current = idx;
      setCurrentItem(item);
      setCurrentIndex(idx + 1);

      for (let rep = 1; rep <= 3; rep++) {
        if (isCancelledRef.current) return;
        setCurrentRepeat(rep);

        // Wait if paused
        if (isPausedRef.current) {
          await new Promise<void>((resolve) => {
            pauseResolveRef.current = resolve;
          });
        }
        if (isCancelledRef.current) return;

        // Speak Korean
        await speakAsync(item.korean, 'ko-KR', speed);
        if (isCancelledRef.current) return;

        // Wait 1.5s
        await wait(1500);
        if (isCancelledRef.current) return;

        // Speak English
        await speakAsync('is ' + item.english, 'en-US', speed + 0.05);
        if (isCancelledRef.current) return;

        // Wait 1s between repetitions
        await wait(1000);
        if (isCancelledRef.current) return;
      }

      // Wait 2s between words
      await wait(2000);
      idx++;
    }
  }, [speakAsync, wait]);

  // ── Start ──────────────────────────────────────────────────────
  const handleStart = useCallback(async () => {
    const pool = buildItemPool(contentType);
    if (pool.length === 0) return;

    itemPoolRef.current = pool;
    const durationSec = selectedMinutes * 60;
    const speed = SPEED_MAP[speedType];

    setIsPlaying(true);
    setIsPaused(false);
    setCurrentIndex(1);
    setCurrentRepeat(1);
    setSecondsRemaining(durationSec);
    setTotalItems(pool.length);
    setCurrentItem(pool[0]);

    try {
      await activateKeepAwakeAsync();
    } catch {}

    // Countdown timer
    timerRef.current = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          handleStop();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Start speech loop
    runPlaybackLoop(pool, durationSec, speed);
  }, [contentType, selectedMinutes, speedType, runPlaybackLoop]);

  // ── Stop ───────────────────────────────────────────────────────
  const handleStop = useCallback(() => {
    isCancelledRef.current = true;
    stopSpeaking();
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (pauseResolveRef.current) {
      pauseResolveRef.current();
    }
    setIsPlaying(false);
    setIsPaused(false);
    deactivateKeepAwake();
  }, []);

  // ── Pause / Resume ─────────────────────────────────────────────
  const handlePauseResume = useCallback(() => {
    if (isPaused) {
      isPausedRef.current = false;
      setIsPaused(false);
      if (pauseResolveRef.current) {
        pauseResolveRef.current();
      }
    } else {
      isPausedRef.current = true;
      setIsPaused(true);
      stopSpeaking();
    }
  }, [isPaused]);

  // ── Pause the countdown when paused ────────────────────────────
  useEffect(() => {
    if (!isPlaying) return;
    if (isPaused) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    } else {
      if (!timerRef.current) {
        timerRef.current = setInterval(() => {
          setSecondsRemaining((prev) => {
            if (prev <= 1) {
              handleStop();
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }
    }
  }, [isPaused, isPlaying, handleStop]);

  const glowColor = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(124, 77, 255, 0.0)', 'rgba(124, 77, 255, 0.25)'],
  });

  // ════════════════════════════════════════════════════════════════
  // SETUP PHASE
  // ════════════════════════════════════════════════════════════════
  if (!isPlaying) {
    return (
      <View style={[styles.setupContainer, { paddingTop: insets.top }]}>
        <StatusBar style="dark" />

        {/* Header */}
        <View style={styles.setupHeader}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.setupTitle}>Parrot Learning</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView contentContainerStyle={styles.setupScroll} showsVerticalScrollIndicator={false}>
          {/* Moon icon */}
          <View style={styles.moonContainer}>
            <View style={styles.moonCircle}>
              <Ionicons name="moon" size={40} color="#7C4DFF" />
            </View>
            <Text style={styles.setupSubtitle}>
              Learn Korean on repeat. Words are spoken in Korean then English, repeated 3 times each.
            </Text>
          </View>

          {/* Timer Selection */}
          <Text style={styles.sectionLabel}>Duration</Text>
          <View style={styles.pillRow}>
            {TIMER_OPTIONS.map((opt) => (
              <TouchableOpacity
                key={opt.minutes}
                style={[
                  styles.pill,
                  selectedMinutes === opt.minutes && styles.pillActive,
                ]}
                onPress={() => setSelectedMinutes(opt.minutes)}
              >
                <Text
                  style={[
                    styles.pillText,
                    selectedMinutes === opt.minutes && styles.pillTextActive,
                  ]}
                >
                  {opt.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Content Selection */}
          <Text style={styles.sectionLabel}>Content</Text>
          <View style={styles.pillRow}>
            {(
              [
                { key: 'words' as ContentType, label: 'Words Only' },
                { key: 'sentences' as ContentType, label: 'Sentences Only' },
                { key: 'both' as ContentType, label: 'Both' },
              ] as const
            ).map((opt) => (
              <TouchableOpacity
                key={opt.key}
                style={[
                  styles.pill,
                  contentType === opt.key && styles.pillActive,
                ]}
                onPress={() => setContentType(opt.key)}
              >
                <Text
                  style={[
                    styles.pillText,
                    contentType === opt.key && styles.pillTextActive,
                  ]}
                >
                  {opt.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Speed Selection */}
          <Text style={styles.sectionLabel}>Speed</Text>
          <View style={styles.pillRow}>
            {(
              [
                { key: 'slow' as SpeedType, label: 'Slow' },
                { key: 'normal' as SpeedType, label: 'Normal' },
                { key: 'fast' as SpeedType, label: 'Fast' },
              ] as const
            ).map((opt) => (
              <TouchableOpacity
                key={opt.key}
                style={[
                  styles.pill,
                  speedType === opt.key && styles.pillActive,
                ]}
                onPress={() => setSpeedType(opt.key)}
              >
                <Text
                  style={[
                    styles.pillText,
                    speedType === opt.key && styles.pillTextActive,
                  ]}
                >
                  {opt.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Start Button */}
          <TouchableOpacity onPress={handleStart} activeOpacity={0.8} style={styles.startWrapper}>
            <LinearGradient
              colors={['#7C4DFF', '#AA00FF']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.startButton}
            >
              <Ionicons name="play" size={28} color="#fff" />
              <Text style={styles.startText}>Start Parrot Learning</Text>
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }

  // ════════════════════════════════════════════════════════════════
  // PLAYING PHASE
  // ════════════════════════════════════════════════════════════════
  return (
    <View style={[styles.playContainer, { paddingTop: insets.top }]}>
      <StatusBar style="light" />

      {/* Stop button - top right */}
      <TouchableOpacity
        onPress={handleStop}
        style={[styles.stopButton, { top: insets.top + spacing.md }]}
      >
        <Ionicons name="close" size={22} color="rgba(255,255,255,0.6)" />
        <Text style={styles.stopText}>Stop</Text>
      </TouchableOpacity>

      {/* Timer display */}
      <View style={styles.timerContainer}>
        <Text style={styles.timerText}>{formatTime(secondsRemaining)}</Text>
        <Text style={styles.timerLabel}>remaining</Text>
      </View>

      {/* Center content with pulsing circle */}
      <View style={styles.centerContent}>
        {/* Pulsing circle */}
        <Animated.View
          style={[
            styles.pulseCircle,
            {
              transform: [{ scale: pulseAnim }],
              backgroundColor: glowColor as any,
            },
          ]}
        />

        {/* Korean text */}
        <Text style={styles.koreanText}>{currentItem?.korean || ''}</Text>

        {/* English translation */}
        <Text style={styles.englishText}>{currentItem?.english || ''}</Text>

        {/* Romanization */}
        <Text style={styles.romanizationText}>
          {currentItem?.romanization || ''}
        </Text>
      </View>

      {/* Progress info */}
      <View style={styles.progressContainer}>
        <Text style={styles.progressText}>
          Word {currentIndex} of {totalItems}
        </Text>
        <View style={styles.repeatIndicator}>
          {[1, 2, 3].map((r) => (
            <View
              key={r}
              style={[
                styles.repeatDot,
                r <= currentRepeat && styles.repeatDotActive,
              ]}
            />
          ))}
          <Text style={styles.repeatText}>Repeat {currentRepeat} of 3</Text>
        </View>
      </View>

      {/* Pause / Resume button */}
      <TouchableOpacity
        onPress={handlePauseResume}
        activeOpacity={0.8}
        style={styles.pauseWrapper}
      >
        <LinearGradient
          colors={
            isPaused
              ? ['#7C4DFF', '#AA00FF']
              : ['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']
          }
          style={styles.pauseButton}
        >
          <Ionicons
            name={isPaused ? 'play' : 'pause'}
            size={32}
            color="#fff"
          />
          <Text style={styles.pauseText}>
            {isPaused ? 'Resume' : 'Pause'}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

// ════════════════════════════════════════════════════════════════════
// Styles
// ════════════════════════════════════════════════════════════════════
const styles = StyleSheet.create({
  // ── Setup Phase ──────────────────────────────────────────────
  setupContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  setupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#AA00FF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  setupTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    color: colors.textPrimary,
  },
  setupScroll: {
    paddingHorizontal: spacing.xl,
    paddingBottom: 60,
  },
  moonContainer: {
    alignItems: 'center',
    marginTop: spacing.lg,
    marginBottom: spacing.xxl,
  },
  moonCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(124, 77, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  setupSubtitle: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: spacing.lg,
  },
  sectionLabel: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    marginTop: spacing.lg,
  },
  pillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  pill: {
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  pillActive: {
    backgroundColor: '#7C4DFF',
    borderColor: '#7C4DFF',
  },
  pillText: {
    fontSize: 13,
    fontFamily: 'Poppins-Medium',
    color: colors.textSecondary,
  },
  pillTextActive: {
    color: '#fff',
  },
  startWrapper: {
    marginTop: spacing.xxxl,
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.lg + 2,
    borderRadius: borderRadius.xl,
    gap: spacing.md,
  },
  startText: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: '#fff',
  },

  // ── Playing Phase ────────────────────────────────────────────
  playContainer: {
    flex: 1,
    backgroundColor: '#0D0520',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 50,
  },
  stopButton: {
    position: 'absolute',
    right: spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.full,
    backgroundColor: 'rgba(255,255,255,0.08)',
    zIndex: 10,
  },
  stopText: {
    fontSize: 13,
    fontFamily: 'Poppins-Medium',
    color: 'rgba(255,255,255,0.6)',
  },
  timerContainer: {
    alignItems: 'center',
    marginTop: spacing.huge,
  },
  timerText: {
    fontSize: 42,
    fontFamily: 'Poppins-Bold',
    color: 'rgba(255,255,255,0.9)',
    letterSpacing: 2,
  },
  timerLabel: {
    fontSize: 13,
    fontFamily: 'Poppins-Regular',
    color: 'rgba(255,255,255,0.35)',
    marginTop: -4,
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  pulseCircle: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 130,
    borderWidth: 1,
    borderColor: 'rgba(124, 77, 255, 0.15)',
  },
  koreanText: {
    fontSize: 46,
    fontFamily: 'Poppins-Bold',
    color: '#fff',
    textAlign: 'center',
    textShadowColor: 'rgba(124, 77, 255, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
    paddingHorizontal: spacing.xl,
  },
  englishText: {
    fontSize: 22,
    fontFamily: 'Poppins-Medium',
    color: 'rgba(255,255,255,0.5)',
    textAlign: 'center',
    marginTop: spacing.md,
    paddingHorizontal: spacing.xl,
  },
  romanizationText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: 'rgba(255,255,255,0.2)',
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  progressContainer: {
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xxl,
  },
  progressText: {
    fontSize: 13,
    fontFamily: 'Poppins-Regular',
    color: 'rgba(255,255,255,0.35)',
  },
  repeatIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  repeatDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  repeatDotActive: {
    backgroundColor: '#7C4DFF',
  },
  repeatText: {
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
    color: 'rgba(255,255,255,0.3)',
    marginLeft: spacing.xs,
  },
  pauseWrapper: {
    width: '80%',
  },
  pauseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.xl,
    gap: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  pauseText: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#fff',
  },
});

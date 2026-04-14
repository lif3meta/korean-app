import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { colors, spacing, borderRadius, typography, shadows } from '@/lib/theme';
import { useAppStore } from '@/lib/store';
import { speakHangulDirectAsync, stopSpeaking } from '@/lib/audio';
import {
  consonants,
  doubleConsonants,
  vowels,
  compoundVowels,
  HangulCharacter,
} from '@/data/hangul';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type Mode = 'consonants' | 'vowels' | 'all';

const SPEED_OPTIONS = [
  { label: 'Slow', ms: 3000 },
  { label: 'Normal', ms: 2000 },
  { label: 'Fast', ms: 1200 },
  { label: 'Blitz', ms: 800 },
];

function getCharacters(mode: Mode): HangulCharacter[] {
  switch (mode) {
    case 'consonants':
      return [...consonants, ...doubleConsonants];
    case 'vowels':
      return [...vowels, ...compoundVowels];
    case 'all':
      return [...consonants, ...doubleConsonants, ...vowels, ...compoundVowels];
  }
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function FastHangulScreen() {
  const insets = useSafeAreaInsets();
  const hapticEnabled = useAppStore((s) => s.hapticEnabled);
  const soundEnabled = useAppStore((s) => s.soundEnabled);

  const [mode, setMode] = useState<Mode>('consonants');
  const [speedIndex, setSpeedIndex] = useState(1); // Normal
  const [isPlaying, setIsPlaying] = useState(false);
  const [shuffled, setShuffled] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [round, setRound] = useState(1);

  const chars = React.useMemo(
    () => (shuffled ? shuffle(getCharacters(mode)) : getCharacters(mode)),
    [mode, shuffled, round]
  );
  const current = chars[currentIndex] || chars[0] || {
    id: '',
    character: '?',
    romanization: '',
    sound: '',
    type: 'consonant',
    pronunciation: '',
    examples: [],
    order: 0,
  };

  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isPlayingRef = useRef(false);

  // Keep ref in sync
  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  const animateIn = useCallback(() => {
    fadeAnim.setValue(0);
    scaleAnim.setValue(0.7);
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        damping: 12,
        stiffness: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, scaleAnim]);

  const playCurrentSound = useCallback(
    (char: HangulCharacter) => {
      if (soundEnabled) {
        void speakHangulDirectAsync(char, 0.7);
      }
    },
    [soundEnabled]
  );

  const advanceToNext = useCallback(() => {
    if (!isPlayingRef.current) return;

    setCurrentIndex((prev) => {
      const next = prev + 1;
      if (next >= chars.length) {
        // Loop back - reshuffle if shuffle is on
        setRound((r) => r + 1);
        return 0;
      }
      return next;
    });
  }, [chars.length]);

  // When currentIndex changes while playing, animate + play sound + schedule next
  useEffect(() => {
    if (!isPlaying) return;

    animateIn();
    playCurrentSound(chars[currentIndex] || chars[0]);
    if (hapticEnabled) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    timerRef.current = setTimeout(advanceToNext, SPEED_OPTIONS[speedIndex].ms);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [currentIndex, isPlaying, speedIndex, round]);

  const handlePlay = useCallback(() => {
    setIsPlaying(true);
    // Trigger the effect by resetting index or bumping round
    setCurrentIndex(0);
    setRound((r) => r + 1);
  }, []);

  const handlePause = useCallback(() => {
    setIsPlaying(false);
    if (timerRef.current) clearTimeout(timerRef.current);
    stopSpeaking();
  }, []);

  const handleToggle = useCallback(() => {
    if (isPlaying) handlePause();
    else handlePlay();
  }, [isPlaying, handlePause, handlePlay]);

  const handleModeChange = useCallback(
    (newMode: Mode) => {
      if (isPlaying) handlePause();
      setMode(newMode);
      setCurrentIndex(0);
    },
    [isPlaying, handlePause]
  );

  const handleSpeedChange = useCallback(() => {
    const next = (speedIndex + 1) % SPEED_OPTIONS.length;
    setSpeedIndex(next);
    if (hapticEnabled) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, [speedIndex, hapticEnabled]);

  const handleShuffleToggle = useCallback(() => {
    setShuffled((s) => !s);
    setCurrentIndex(0);
    setRound((r) => r + 1);
    if (hapticEnabled) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, [hapticEnabled]);

  const handleTapCard = useCallback(() => {
    // Manual tap plays the current sound
    playCurrentSound(current);
    if (hapticEnabled) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    animateIn();
  }, [current, playCurrentSound, hapticEnabled, animateIn]);

  const handlePrev = useCallback(() => {
    if (isPlaying) handlePause();
    setCurrentIndex((prev) => (prev <= 0 ? chars.length - 1 : prev - 1));
    if (hapticEnabled) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, [isPlaying, handlePause, chars.length, hapticEnabled]);

  const handleNext = useCallback(() => {
    if (isPlaying) handlePause();
    setCurrentIndex((prev) => (prev >= chars.length - 1 ? 0 : prev + 1));
    if (hapticEnabled) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, [isPlaying, handlePause, chars.length, hapticEnabled]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      stopSpeaking();
    };
  }, []);

  // When not playing, still animate on index change (manual nav)
  useEffect(() => {
    if (!isPlaying) {
      animateIn();
      playCurrentSound(chars[currentIndex] || chars[0]);
    }
  }, [currentIndex, isPlaying]);

  const progress = ((currentIndex + 1) / chars.length) * 100;

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom + 16 }]}>
      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Mode Tabs */}
        <View style={styles.modeTabs}>
          {(['consonants', 'vowels', 'all'] as Mode[]).map((m) => (
            <TouchableOpacity
              key={m}
              onPress={() => handleModeChange(m)}
              activeOpacity={0.7}
              style={[styles.modeTab, mode === m && styles.modeTabActive]}
            >
              <Text style={[styles.modeTabText, mode === m && styles.modeTabTextActive]}>
                {m === 'consonants' ? 'Consonants' : m === 'vowels' ? 'Vowels' : 'All'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Progress */}
        <View style={styles.progressRow}>
          <Text style={styles.progressText}>
            {currentIndex + 1} / {chars.length}
          </Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress}%` as any }]} />
          </View>
        </View>

        {/* Main Card */}
        <TouchableOpacity onPress={handleTapCard} activeOpacity={0.9}>
          <Animated.View
            style={[
              styles.card,
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            <View style={styles.typeBadge}>
              <Text style={styles.typeBadgeText}>
                {current.type === 'consonant'
                  ? 'Consonant'
                  : current.type === 'double_consonant'
                  ? 'Double'
                  : current.type === 'vowel'
                  ? 'Vowel'
                  : 'Compound'}
              </Text>
            </View>

            <Text style={styles.koreanChar}>{current.character}</Text>

            <Text style={styles.romanization}>{current.romanization}</Text>

            <Text style={styles.soundHint}>{current.sound}</Text>

            <Text style={styles.pronunciation} numberOfLines={2}>
              {current.pronunciation}
            </Text>

            {isPlaying && (
              <View style={styles.playingIndicator}>
                <View style={[styles.soundBar, styles.soundBar1]} />
                <View style={[styles.soundBar, styles.soundBar2]} />
                <View style={[styles.soundBar, styles.soundBar3]} />
                <View style={[styles.soundBar, styles.soundBar4]} />
              </View>
            )}

            <Text style={styles.tapHint}>
              {isPlaying ? 'Auto-playing...' : 'Tap to hear sound'}
            </Text>
          </Animated.View>
        </TouchableOpacity>

        {/* Manual Navigation */}
        <View style={styles.navRow}>
          <TouchableOpacity onPress={handlePrev} style={styles.navBtn} activeOpacity={0.7}>
            <Ionicons name="chevron-back" size={24} color={colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity onPress={handleToggle} style={styles.playBtn} activeOpacity={0.7}>
            <Ionicons
              name={isPlaying ? 'pause' : 'play'}
              size={32}
              color="#fff"
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={handleNext} style={styles.navBtn} activeOpacity={0.7}>
            <Ionicons name="chevron-forward" size={24} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Controls Row */}
        <View style={styles.controlsRow}>
          <TouchableOpacity onPress={handleSpeedChange} style={styles.controlBtn} activeOpacity={0.7}>
            <Ionicons name="speedometer-outline" size={20} color={colors.primary} />
            <Text style={styles.controlLabel}>{SPEED_OPTIONS[speedIndex].label}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleShuffleToggle}
            style={[styles.controlBtn, shuffled && styles.controlBtnActive]}
            activeOpacity={0.7}
          >
            <Ionicons
              name="shuffle"
              size={20}
              color={shuffled ? '#fff' : colors.primary}
            />
            <Text style={[styles.controlLabel, shuffled && styles.controlLabelActive]}>
              Shuffle
            </Text>
          </TouchableOpacity>
        </View>

        {/* Character Grid Preview */}
        <Text style={styles.sectionTitle}>
          {mode === 'consonants'
            ? 'All Consonants'
            : mode === 'vowels'
            ? 'All Vowels'
            : 'All Characters'}
        </Text>
        <View style={styles.charGrid}>
          {chars.map((ch, i) => (
            <TouchableOpacity
              key={ch.id + i}
              onPress={() => {
                if (isPlaying) handlePause();
                setCurrentIndex(i);
              }}
              activeOpacity={0.7}
              style={[
                styles.charCell,
                i === currentIndex && styles.charCellActive,
              ]}
            >
              <Text
                style={[
                  styles.charCellText,
                  i === currentIndex && styles.charCellTextActive,
                ]}
              >
                {ch.character}
              </Text>
              <Text
                style={[
                  styles.charCellRoman,
                  i === currentIndex && styles.charCellRomanActive,
                ]}
              >
                {ch.romanization}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxl,
    gap: spacing.lg,
  },

  // Mode Tabs
  modeTabs: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceLow,
    borderRadius: borderRadius.xl,
    padding: 4,
  },
  modeTab: {
    flex: 1,
    paddingVertical: spacing.sm + 2,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
  },
  modeTabActive: {
    backgroundColor: colors.surface,
    ...shadows.sm,
  },
  modeTabText: {
    fontSize: 14,
    fontFamily: 'Jakarta-SemiBold',
    color: colors.textTertiary,
  },
  modeTabTextActive: {
    color: colors.accent,
  },

  // Progress
  progressRow: {
    gap: spacing.xs,
  },
  progressText: {
    ...typography.caption,
    color: colors.textTertiary,
    textAlign: 'center',
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.primaryPale,
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
    backgroundColor: colors.accent,
  },

  // Card
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xxxl,
    padding: spacing.xxl,
    alignItems: 'center',
    minHeight: 300,
    justifyContent: 'center',
    ...shadows.lg,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  typeBadge: {
    position: 'absolute',
    top: spacing.lg,
    right: spacing.lg,
    backgroundColor: colors.primaryPale,
    paddingHorizontal: spacing.md,
    paddingVertical: 3,
    borderRadius: borderRadius.full,
  },
  typeBadgeText: {
    ...typography.caption,
    color: colors.primaryDark,
  },
  koreanChar: {
    fontSize: 96,
    fontWeight: '700',
    color: colors.textPrimary,
    lineHeight: 110,
  },
  romanization: {
    fontSize: 28,
    fontFamily: 'Jakarta-Bold',
    color: colors.accent,
    marginTop: spacing.sm,
    letterSpacing: 1,
  },
  soundHint: {
    fontSize: 22,
    color: colors.textTertiary,
    marginTop: spacing.xs,
  },
  pronunciation: {
    ...typography.footnote,
    color: colors.textTertiary,
    textAlign: 'center',
    marginTop: spacing.md,
    paddingHorizontal: spacing.md,
    lineHeight: 18,
  },
  playingIndicator: {
    flexDirection: 'row',
    gap: 3,
    marginTop: spacing.md,
    alignItems: 'flex-end',
    height: 20,
  },
  soundBar: {
    width: 4,
    borderRadius: 2,
    backgroundColor: colors.accent,
  },
  soundBar1: { height: 8 },
  soundBar2: { height: 16 },
  soundBar3: { height: 12 },
  soundBar4: { height: 20 },
  tapHint: {
    ...typography.caption,
    color: colors.textTertiary,
    marginTop: spacing.sm,
  },

  // Navigation
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xxl,
  },
  navBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.surfaceLow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playBtn: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.pinkGlow,
  },

  // Controls
  controlsRow: {
    flexDirection: 'row',
    gap: spacing.md,
    justifyContent: 'center',
  },
  controlBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primaryPale,
  },
  controlBtnActive: {
    backgroundColor: colors.primary,
  },
  controlLabel: {
    fontSize: 13,
    fontFamily: 'Jakarta-SemiBold',
    color: colors.primary,
  },
  controlLabelActive: {
    color: '#fff',
  },

  // Grid
  sectionTitle: {
    ...typography.title3,
    color: colors.textPrimary,
    marginTop: spacing.sm,
  },
  charGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  charCell: {
    width: (SCREEN_WIDTH - spacing.xl * 2 - spacing.sm * 5) / 6,
    aspectRatio: 1,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.surfaceLow,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 1,
  },
  charCellActive: {
    backgroundColor: colors.accent,
    ...shadows.pinkGlow,
  },
  charCellText: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  charCellTextActive: {
    color: '#fff',
  },
  charCellRoman: {
    fontSize: 8,
    fontFamily: 'Jakarta-Medium',
    color: colors.textTertiary,
  },
  charCellRomanActive: {
    color: 'rgba(255,255,255,0.8)',
  },
});

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, PanResponder, LayoutChangeEvent } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, borderRadius } from '@/lib/theme';
import { useAppStore } from '@/lib/store';
import { audioLessonSeries, AudioSegment } from '@/data/audioLessons';
import { speakKoreanAsync, speakEnglishAsync, stopSpeaking, playAudioByIdAsync } from '@/lib/audio';
import * as Haptics from 'expo-haptics';

type PlayerState = 'idle' | 'playing' | 'paused' | 'finished';

export default function AudioPlayerScreen() {
  const { seriesId, episodeId, autoplay } = useLocalSearchParams<{ seriesId: string; episodeId: string; autoplay?: string }>();
  const insets = useSafeAreaInsets();
  const { markLessonComplete, hapticEnabled } = useAppStore();

  const series = audioLessonSeries.find(s => s.id === seriesId);
  const episode = series?.episodes.find(ep => ep.id === episodeId);

  const [playerState, setPlayerState] = useState<PlayerState>('idle');
  const [currentSegmentIndex, setCurrentSegmentIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [displaySubtext, setDisplaySubtext] = useState('');
  const [segmentType, setSegmentType] = useState<string>('');
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const playSequenceRef = useRef(0);
  const progressBarWidth = useRef(0);

  const haptic = useCallback(() => {
    if (hapticEnabled) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, [hapticEnabled]);

  // Pulse animation for playing state
  useEffect(() => {
    if (playerState === 'playing') {
      const loop = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.08, duration: 1200, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 1200, useNativeDriver: true }),
        ])
      );
      loop.start();
      return () => loop.stop();
    } else {
      pulseAnim.setValue(1);
    }
  }, [playerState]);

  // Fade in text when it changes
  useEffect(() => {
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }).start();
  }, [displayText, displaySubtext]);

  const wait = useCallback((ms: number, seq: number): Promise<boolean> =>
    new Promise(resolve => setTimeout(() => {
      resolve(playSequenceRef.current === seq);
    }, ms)), []);

  // Try pre-generated audio by ID first (offline), fall back to TTS
  const playKorean = useCallback(async (text: string, segIdx: number): Promise<void> => {
    if (!episode) return;
    const fileId = `aud_${episode.id}_s${segIdx}_ko`;
    const played = await playAudioByIdAsync(fileId, 0.85);
    if (!played) await speakKoreanAsync(text);
  }, [episode]);

  const playEnglish = useCallback(async (text: string, segIdx: number): Promise<void> => {
    if (!episode) return;
    const fileId = `aud_${episode.id}_s${segIdx}_en`;
    const played = await playAudioByIdAsync(fileId);
    if (!played) await speakEnglishAsync(text);
  }, [episode]);

  const playTranslation = useCallback(async (text: string, segIdx: number): Promise<void> => {
    if (!episode) return;
    const fileId = `aud_${episode.id}_s${segIdx}_tr`;
    const played = await playAudioByIdAsync(fileId);
    if (!played) await speakEnglishAsync(text);
  }, [episode]);

  const playSegment = useCallback(async (segment: AudioSegment, seq: number, segIdx: number): Promise<boolean> => {
    if (playSequenceRef.current !== seq) return false;

    setSegmentType(segment.type);

    if (segment.type === 'narration' || segment.type === 'recap' || segment.type === 'practice') {
      setDisplayText(segment.english || '');
      setDisplaySubtext('');
      if (segment.english) {
        await playEnglish(segment.english, segIdx);
        if (!(await wait(800, seq))) return false;
      }
    } else if (segment.type === 'korean') {
      setDisplayText(segment.korean || '');
      setDisplaySubtext(segment.translation || '');
      if (segment.korean) {
        await playKorean(segment.korean, segIdx);
        if (!(await wait(400, seq))) return false;
        // Speak the English translation so listeners learn the meaning
        if (segment.translation) {
          await playTranslation(segment.translation, segIdx);
          if (!(await wait(300, seq))) return false;
          // Repeat the Korean once more for reinforcement
          await playKorean(segment.korean, segIdx);
          if (!(await wait(400, seq))) return false;
        }
      }
    } else if (segment.type === 'dialogue') {
      if (segment.english) {
        setDisplayText(segment.english);
        setDisplaySubtext('');
        await playEnglish(segment.english, segIdx);
        if (!(await wait(600, seq))) return false;
      }
      if (playSequenceRef.current !== seq) return false;
      if (segment.korean) {
        setDisplayText(segment.korean);
        setDisplaySubtext(segment.translation || '');
        await playKorean(segment.korean, segIdx);
        if (!(await wait(400, seq))) return false;
        // Speak the English translation for podcast listeners
        if (segment.translation) {
          await playTranslation(segment.translation, segIdx);
          if (!(await wait(300, seq))) return false;
        }
      }
    }

    if (playSequenceRef.current !== seq) return false;
    if (segment.pauseAfter) {
      if (!(await wait(segment.pauseAfter, seq))) return false;
    }
    return true;
  }, [wait, playEnglish, playKorean, playTranslation]);

  const playEpisode = useCallback(async (startIndex: number) => {
    if (!episode) return;
    const seq = ++playSequenceRef.current;
    await stopSpeaking();
    setPlayerState('playing');

    for (let i = startIndex; i < episode.segments.length; i++) {
      if (playSequenceRef.current !== seq) return;
      setCurrentSegmentIndex(i);
      const ok = await playSegment(episode.segments[i], seq, i);
      if (!ok) return;
    }

    if (playSequenceRef.current === seq) {
      markLessonComplete(`audio_${episode.id}`, 100);
      haptic();

      // Autoplay next episode in the series
      if (series) {
        const currentIdx = series.episodes.findIndex(ep => ep.id === episode.id);
        if (currentIdx >= 0 && currentIdx < series.episodes.length - 1) {
          const nextEp = series.episodes[currentIdx + 1];
          setPlayerState('idle');
          setDisplayText('Up next...');
          setDisplaySubtext(nextEp.title);
          setSegmentType('');
          // Brief pause before auto-navigating
          await new Promise(r => setTimeout(r, 2000));
          if (playSequenceRef.current === seq) {
            router.replace({
              pathname: '/lesson/audio/player' as any,
              params: { seriesId: series.id, episodeId: nextEp.id, autoplay: '1' },
            });
          }
          return;
        }
      }

      // Last episode in series — show finished state
      setPlayerState('finished');
      setDisplayText('Series complete!');
      setDisplaySubtext('Great job listening and learning.');
      setSegmentType('recap');
    }
  }, [episode, series, playSegment, markLessonComplete, haptic]);

  const handlePlayPause = useCallback(async () => {
    haptic();
    if (playerState === 'idle' || playerState === 'finished') {
      const startIdx = playerState === 'finished' ? 0 : currentSegmentIndex;
      playEpisode(startIdx);
    } else if (playerState === 'playing') {
      ++playSequenceRef.current;
      await stopSpeaking();
      setPlayerState('paused');
    } else if (playerState === 'paused') {
      playEpisode(currentSegmentIndex);
    }
  }, [playerState, currentSegmentIndex, playEpisode, haptic]);

  // Skip forward = next episode (track)
  const handleSkipForward = useCallback(async () => {
    if (!episode || !series) return;
    haptic();
    const currentIdx = series.episodes.findIndex(ep => ep.id === episode.id);
    if (currentIdx >= 0 && currentIdx < series.episodes.length - 1) {
      ++playSequenceRef.current;
      await stopSpeaking();
      const nextEp = series.episodes[currentIdx + 1];
      router.replace({
        pathname: '/lesson/audio/player' as any,
        params: { seriesId: series.id, episodeId: nextEp.id, autoplay: '1' },
      });
    }
  }, [episode, series, haptic]);

  // Skip back = previous episode (track), or restart current if past first few segments
  const handleSkipBack = useCallback(async () => {
    if (!episode || !series) return;
    haptic();

    // If past the 3rd segment, restart current episode
    if (currentSegmentIndex > 2) {
      ++playSequenceRef.current;
      await stopSpeaking();
      setCurrentSegmentIndex(0);
      setDisplayText('');
      setDisplaySubtext('');
      setSegmentType('');
      playEpisode(0);
      return;
    }

    // Otherwise go to previous episode
    const currentIdx = series.episodes.findIndex(ep => ep.id === episode.id);
    if (currentIdx > 0) {
      ++playSequenceRef.current;
      await stopSpeaking();
      const prevEp = series.episodes[currentIdx - 1];
      router.replace({
        pathname: '/lesson/audio/player' as any,
        params: { seriesId: series.id, episodeId: prevEp.id, autoplay: '1' },
      });
    } else {
      // First episode — restart from beginning
      ++playSequenceRef.current;
      await stopSpeaking();
      setCurrentSegmentIndex(0);
      setDisplayText('');
      setDisplaySubtext('');
      setSegmentType('');
      playEpisode(0);
    }
  }, [episode, series, currentSegmentIndex, playEpisode, haptic]);

  // Use a ref so the PanResponder always sees the latest values
  const seekRef = useRef({ episode, currentSegmentIndex, playEpisode, haptic });
  seekRef.current = { episode, currentSegmentIndex, playEpisode, haptic };
  const seekingRef = useRef(false);

  const seekToPosition = useCallback(async (x: number) => {
    if (seekingRef.current) return; // prevent rapid re-entry
    const { episode: ep, currentSegmentIndex: curIdx, playEpisode: play, haptic: hap } = seekRef.current;
    if (!ep || progressBarWidth.current === 0) return;
    const ratio = Math.max(0, Math.min(1, x / progressBarWidth.current));
    const targetIdx = Math.round(ratio * (ep.segments.length - 1));
    if (targetIdx === curIdx) return;
    seekingRef.current = true;
    hap();
    ++playSequenceRef.current;
    await stopSpeaking();
    setCurrentSegmentIndex(targetIdx);
    const seg = ep.segments[targetIdx];
    if (seg) {
      setSegmentType(seg.type);
      if (seg.type === 'korean' || (seg.type === 'dialogue' && seg.korean)) {
        setDisplayText(seg.korean || '');
        setDisplaySubtext(seg.translation || '');
      } else {
        setDisplayText(seg.english || '');
        setDisplaySubtext('');
      }
    }
    play(targetIdx);
    seekingRef.current = false;
  }, []);

  const progressPanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        seekToPosition(evt.nativeEvent.locationX);
      },
      onPanResponderRelease: (evt) => {
        seekToPosition(evt.nativeEvent.locationX);
      },
    })
  ).current;

  // Autoplay when navigated from previous episode
  const autoplayedRef = useRef(false);
  useEffect(() => {
    if (autoplay === '1' && episode && !autoplayedRef.current) {
      autoplayedRef.current = true;
      playEpisode(0);
    }
  }, [autoplay, episode, playEpisode]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      ++playSequenceRef.current;
      stopSpeaking();
    };
  }, []);

  if (!series || !episode) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ fontFamily: 'Jakarta-Medium', color: colors.textSecondary }}>Episode not found</Text>
      </View>
    );
  }

  const progress = episode.segments.length > 0
    ? ((currentSegmentIndex + (playerState === 'finished' ? 1 : 0)) / episode.segments.length)
    : 0;

  const getSegmentIcon = (): string => {
    switch (segmentType) {
      case 'narration': return 'chatbubble-outline';
      case 'korean': return 'language-outline';
      case 'dialogue': return 'chatbubbles-outline';
      case 'practice': return 'school-outline';
      case 'recap': return 'ribbon-outline';
      default: return 'headset-outline';
    }
  };

  const getSegmentLabel = (): string => {
    switch (segmentType) {
      case 'narration': return 'Listening';
      case 'korean': return 'Korean';
      case 'dialogue': return 'Dialogue';
      case 'practice': return 'Practice';
      case 'recap': return 'Summary';
      default: return 'Ready';
    }
  };

  const episodeIndex = series.episodes.findIndex(ep => ep.id === episodeId);

  return (
    <LinearGradient
      colors={['#0f172a', '#1e293b', '#334155']}
      style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}
    >
      {/* Top bar */}
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={async () => {
            ++playSequenceRef.current;
            await stopSpeaking();
            router.back();
          }}
          style={styles.closeBtn}
        >
          <Ionicons name="chevron-down" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.topBarCenter}>
          <Text style={styles.topBarLabel}>AUDIO LESSON</Text>
          <Text style={styles.topBarSeries} numberOfLines={1}>{series.title}</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      {/* Main content area */}
      <View style={styles.mainContent}>
        {/* Visualizer / Icon */}
        <Animated.View style={[styles.visualizer, { transform: [{ scale: pulseAnim }] }]}>
          <LinearGradient
            colors={series.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.visualizerGradient}
          >
            <Ionicons name={getSegmentIcon() as any} size={48} color="#fff" />
          </LinearGradient>
        </Animated.View>

        {/* Segment type label */}
        <View style={[styles.segmentBadge, { backgroundColor: series.color + '30' }]}>
          <Text style={[styles.segmentBadgeText, { color: series.color }]}>{getSegmentLabel()}</Text>
        </View>

        {/* Episode title */}
        <Text style={styles.episodeTitle}>
          {episodeIndex >= 0 ? `${episodeIndex + 1}. ` : ''}{episode.title}
        </Text>
        <Text style={styles.episodeTitleKorean}>{episode.titleKorean}</Text>

        {/* Display text */}
        <Animated.View style={[styles.textDisplay, { opacity: fadeAnim }]}>
          <Text style={[
            styles.mainText,
            segmentType === 'korean' || segmentType === 'dialogue' ? styles.koreanMainText : null,
          ]}>
            {displayText || (playerState === 'idle' ? 'Press play to begin' : '')}
          </Text>
          {displaySubtext ? (
            <Text style={styles.subText}>{displaySubtext}</Text>
          ) : null}
        </Animated.View>
      </View>

      {/* Progress bar (draggable) */}
      <View style={styles.progressSection}>
        <View
          style={styles.progressBarHitArea}
          onLayout={(e: LayoutChangeEvent) => { progressBarWidth.current = e.nativeEvent.layout.width; }}
          {...progressPanResponder.panHandlers}
        >
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress * 100}%`, backgroundColor: series.color }]} />
            <View style={[styles.progressThumb, { left: `${progress * 100}%`, backgroundColor: series.color }]} />
          </View>
        </View>
        <View style={styles.progressLabels}>
          <Text style={styles.progressText}>
            {currentSegmentIndex + 1}/{episode.segments.length}
          </Text>
          <Text style={styles.progressText}>~{episode.durationMinutes} min</Text>
        </View>
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        <TouchableOpacity onPress={handleSkipBack} style={styles.skipBtn}>
          <Ionicons name="play-skip-back" size={28} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity onPress={handlePlayPause} style={styles.playPauseBtn}>
          <LinearGradient
            colors={series.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.playPauseGradient}
          >
            <Ionicons
              name={
                playerState === 'playing'
                  ? 'pause'
                  : playerState === 'finished'
                  ? 'refresh'
                  : 'play'
              }
              size={36}
              color="#fff"
              style={playerState === 'playing' ? undefined : { marginLeft: 3 }}
            />
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleSkipForward} style={styles.skipBtn}>
          <Ionicons name="play-skip-forward" size={28} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Finished overlay */}
      {playerState === 'finished' && (
        <View style={styles.finishedBanner}>
          <Ionicons name="checkmark-circle" size={20} color={colors.success} />
          <Text style={styles.finishedText}>+100 XP earned</Text>
        </View>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  closeBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  topBarCenter: {
    flex: 1,
    alignItems: 'center',
  },
  topBarLabel: {
    fontSize: 10,
    fontFamily: 'Jakarta-Bold',
    color: 'rgba(255,255,255,0.4)',
    letterSpacing: 2,
  },
  topBarSeries: {
    fontSize: 13,
    fontFamily: 'Jakarta-SemiBold',
    color: 'rgba(255,255,255,0.8)',
  },
  mainContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 8,
  },
  visualizer: {
    marginBottom: 12,
  },
  visualizerGradient: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  segmentBadge: {
    paddingVertical: 4,
    paddingHorizontal: 14,
    borderRadius: borderRadius.full,
    marginBottom: 4,
  },
  segmentBadgeText: {
    fontSize: 11,
    fontFamily: 'Jakarta-Bold',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  episodeTitle: {
    fontSize: 20,
    fontFamily: 'Jakarta-Bold',
    color: '#fff',
    textAlign: 'center',
  },
  episodeTitleKorean: {
    fontSize: 13,
    fontFamily: 'Jakarta-Regular',
    color: 'rgba(255,255,255,0.5)',
    marginBottom: 8,
  },
  textDisplay: {
    minHeight: 120,
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  mainText: {
    fontSize: 17,
    fontFamily: 'Jakarta-Regular',
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    lineHeight: 26,
  },
  koreanMainText: {
    fontSize: 28,
    fontFamily: 'Jakarta-Bold',
    color: '#fff',
    lineHeight: 40,
  },
  subText: {
    fontSize: 14,
    fontFamily: 'Jakarta-Regular',
    color: 'rgba(255,255,255,0.5)',
    textAlign: 'center',
    marginTop: 8,
  },
  progressSection: {
    paddingHorizontal: 32,
    marginBottom: 8,
  },
  progressBarHitArea: {
    paddingVertical: 12,
    marginVertical: -12,
  },
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 2,
    position: 'relative',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  progressThumb: {
    position: 'absolute',
    top: -5,
    width: 14,
    height: 14,
    borderRadius: 7,
    marginLeft: -7,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  progressText: {
    fontSize: 11,
    fontFamily: 'Jakarta-Medium',
    color: 'rgba(255,255,255,0.4)',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 32,
    paddingVertical: 24,
    paddingBottom: 32,
  },
  skipBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playPauseBtn: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  playPauseGradient: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  finishedBanner: {
    position: 'absolute',
    bottom: 100,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  finishedText: {
    fontSize: 14,
    fontFamily: 'Jakarta-Bold',
    color: colors.success,
  },
});

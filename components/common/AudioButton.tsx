import React, { useState } from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { colors } from '@/lib/theme';
import type { HangulCharacter } from '@/data/hangul';
import { playAudioCueAsync, resolvePronunciationAudioCue } from '@/lib/audio';
import { useAppStore } from '@/lib/store';

interface AudioButtonProps {
  text: string;
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  style?: ViewStyle;
  audioType?: 'korean_text' | 'hangul_sound' | 'pronunciation';
  hangulCharacter?: string | HangulCharacter;
  accessibilityLabel?: string;
}

export function AudioButton({
  text,
  size = 'md',
  color = colors.primary,
  style,
  audioType = 'korean_text',
  hangulCharacter,
  accessibilityLabel,
}: AudioButtonProps) {
  const [state, setState] = useState<'idle' | 'loading' | 'playing'>('idle');
  const hapticEnabled = useAppStore((s) => s.hapticEnabled);
  const resolvedCue =
    audioType === 'hangul_sound'
      ? { kind: 'hangul_sound' as const, value: hangulCharacter ?? text, rate: 0.8 }
      : audioType === 'pronunciation'
        ? resolvePronunciationAudioCue(text)
        : { kind: 'korean_text' as const, text };

  const isPlayable = resolvedCue.kind !== 'disabled';

  const handlePress = async () => {
    if (state === 'loading') return;
    if (!isPlayable) return;
    if (hapticEnabled) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    setState('loading');
    try {
      const played = await playAudioCueAsync(resolvedCue);
      if (!played) {
        setState('idle');
        return;
      }

      setState('playing');
      setTimeout(() => setState('idle'), 2000);
    } catch {
      setState('idle');
    }
  };

  const iconSize = size === 'sm' ? 16 : size === 'lg' ? 28 : 22;
  const btnSize = size === 'sm' ? 32 : size === 'lg' ? 52 : 40;

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.6}
      disabled={state === 'loading' || !isPlayable}
      accessibilityRole="button"
      accessibilityLabel={
        accessibilityLabel ??
        `Play ${audioType === 'hangul_sound' ? 'Hangul cue' : 'audio'} for ${text}`
      }
      style={[
        styles.button,
        {
          width: btnSize,
          height: btnSize,
          borderRadius: btnSize / 2,
          backgroundColor: color + '15',
          opacity: isPlayable ? 1 : 0.35,
        },
        state !== 'idle' && { backgroundColor: color + '30' },
        style,
      ]}
    >
      {state === 'loading' ? (
        <ActivityIndicator size="small" color={color} />
      ) : (
        <Ionicons name={state === 'playing' ? 'pause' : 'play'} size={iconSize} color={color} />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

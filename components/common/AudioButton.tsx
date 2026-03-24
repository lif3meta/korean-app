import React, { useState } from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { colors } from '@/lib/theme';
import { speakKoreanAsync, speakKoreanSlow } from '@/lib/audio';
import { useAppStore } from '@/lib/store';

interface AudioButtonProps {
  text: string;
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  style?: ViewStyle;
  slow?: boolean;
}

export function AudioButton({ text, size = 'md', color = colors.primary, style, slow }: AudioButtonProps) {
  const [state, setState] = useState<'idle' | 'loading' | 'playing'>('idle');
  const hapticEnabled = useAppStore((s) => s.hapticEnabled);

  const handlePress = async () => {
    if (state === 'loading') return;
    if (hapticEnabled) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    if (slow) {
      speakKoreanSlow(text);
      setState('playing');
      setTimeout(() => setState('idle'), 2000);
      return;
    }

    setState('loading');
    try {
      await speakKoreanAsync(text);
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
      disabled={state === 'loading'}
      style={[
        styles.button,
        {
          width: btnSize,
          height: btnSize,
          borderRadius: btnSize / 2,
          backgroundColor: color + '15',
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

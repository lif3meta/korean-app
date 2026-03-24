import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { colors, shadows } from '@/lib/theme';

export function ChatBubble() {
  return (
    <TouchableOpacity
      onPress={() => router.push('/chat')}
      activeOpacity={0.8}
      style={styles.container}
    >
      <LinearGradient colors={colors.gradientPrimary} style={styles.bubble}>
        <Ionicons name="chatbubble-ellipses" size={26} color="#fff" />
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    zIndex: 999,
  },
  bubble: {
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.glow,
  },
});

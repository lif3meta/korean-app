import React from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, shadows } from '@/lib/theme';

export function ChatBubble() {
  const insets = useSafeAreaInsets();

  return (
    <TouchableOpacity
      onPress={() => router.push('/chat')}
      activeOpacity={0.8}
      style={[styles.container, { bottom: 85 + insets.bottom }]}
    >
      <View style={styles.bubble}>
        <Ionicons name="chatbubble-ellipses" size={26} color="#fff" />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: 20,
    zIndex: 999,
  },
  bubble: {
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#22C55E',
    ...shadows.md,
  },
});

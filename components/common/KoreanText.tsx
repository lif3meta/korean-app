import React from 'react';
import { View, Text, StyleSheet, TextStyle } from 'react-native';
import { colors, typography, spacing } from '@/lib/theme';
import { useAppStore } from '@/lib/store';

interface KoreanTextProps {
  korean: string;
  romanization?: string;
  english?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showRomanization?: boolean;
  align?: 'left' | 'center' | 'right';
  koreanStyle?: TextStyle;
}

export function KoreanText({ korean, romanization, english, size = 'md', showRomanization: showRomanProp, align = 'center', koreanStyle }: KoreanTextProps) {
  const storeShowRoman = useAppStore((s) => s.showRomanization);
  const showRoman = showRomanProp ?? storeShowRoman;

  const koreanSize = sizeMap[size];

  return (
    <View style={[styles.container, { alignItems: alignMap[align] }]}>
      <Text style={[koreanSize, styles.korean, koreanStyle]}>{korean}</Text>
      {showRoman && romanization && <Text style={styles.romanization}>{romanization}</Text>}
      {english && <Text style={styles.english}>{english}</Text>}
    </View>
  );
}

const alignMap = { left: 'flex-start' as const, center: 'center' as const, right: 'flex-end' as const };

const sizeMap: Record<string, TextStyle> = {
  sm: { fontSize: 24 },
  md: { fontSize: 36 },
  lg: { fontSize: 48 },
  xl: { fontSize: 72 },
};

const styles = StyleSheet.create({
  container: { gap: spacing.xs },
  korean: { color: colors.textPrimary, fontWeight: '300', letterSpacing: 2 },
  romanization: { ...typography.subhead, color: colors.textSecondary, fontStyle: 'italic' },
  english: { ...typography.body, color: colors.textPrimary },
});

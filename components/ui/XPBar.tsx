import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, borderRadius, spacing } from '@/lib/theme';
import { getLevelFromXP, getXPProgressInLevel, getLevelTitle } from '@/lib/xp';

interface XPBarProps {
  totalXP: number;
  compact?: boolean;
}

export function XPBar({ totalXP, compact }: XPBarProps) {
  const level = getLevelFromXP(totalXP);
  const { current, needed, percentage } = getXPProgressInLevel(totalXP);

  if (compact) {
    return (
      <View style={styles.compactContainer}>
        <Text style={styles.compactLevel}>Lv.{level}</Text>
        <View style={styles.compactBar}>
          <LinearGradient colors={[colors.primary, colors.accent]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={[styles.compactFill, { width: `${percentage}%` as any }]} />
        </View>
        <Text style={styles.compactXP}>{current}/{needed}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.level} numberOfLines={1} adjustsFontSizeToFit>Level {level} — {getLevelTitle(level)}</Text>
        <Text style={styles.xpText}>{current} / {needed} XP</Text>
      </View>
      <View style={styles.bar}>
        <LinearGradient colors={[colors.primary, colors.accent]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={[styles.fill, { width: `${percentage}%` as any }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: spacing.sm },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: spacing.sm },
  level: { fontSize: 13, fontFamily: 'Poppins-Bold', color: colors.primaryDark, flexShrink: 1 },
  xpText: { fontSize: 12, fontFamily: 'Poppins-Medium', color: colors.textTertiary },
  bar: { height: 10, borderRadius: borderRadius.full, backgroundColor: colors.primaryPale, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: borderRadius.full },
  compactContainer: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  compactLevel: { fontSize: 12, fontFamily: 'Poppins-Bold', color: colors.primaryDark },
  compactBar: { flex: 1, height: 6, borderRadius: borderRadius.full, backgroundColor: colors.primaryPale, overflow: 'hidden' },
  compactFill: { height: '100%', borderRadius: borderRadius.full },
  compactXP: { fontSize: 11, fontFamily: 'Poppins-Medium', color: colors.textTertiary },
});

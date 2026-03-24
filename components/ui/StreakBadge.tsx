import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, borderRadius, spacing, typography, shadows } from '@/lib/theme';

interface StreakBadgeProps {
  streak: number;
  compact?: boolean;
}

export function StreakBadge({ streak, compact }: StreakBadgeProps) {
  const isActive = streak > 0;

  if (compact) {
    return (
      <View style={[styles.compactContainer, isActive && styles.activeCompact]}>
        <Ionicons name="flame" size={16} color={isActive ? colors.warning : colors.textTertiary} />
        <Text style={[styles.compactText, isActive && styles.activeText]}>{streak}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, isActive && styles.activeContainer]}>
      <Ionicons name="flame" size={28} color={isActive ? colors.warning : colors.textTertiary} />
      <View>
        <Text style={[styles.count, isActive && styles.activeText]}>{streak}</Text>
        <Text style={styles.label}>day streak</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: borderRadius.xl,
    ...shadows.sm,
  },
  activeContainer: {
    backgroundColor: colors.secondaryLight,
  },
  count: { ...typography.title2, color: colors.textTertiary },
  label: { ...typography.caption, color: colors.textTertiary },
  activeText: { color: colors.textPrimary },
  compactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.surface,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.full,
  },
  activeCompact: {
    backgroundColor: colors.secondaryLight,
  },
  compactText: { ...typography.captionBold, color: colors.textTertiary },
});

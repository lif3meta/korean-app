import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, borderRadius, spacing, typography, shadows } from '@/lib/theme';
import { HangulCharacter } from '@/data/hangul';
import { useAppStore } from '@/lib/store';
import { speakKorean } from '@/lib/audio';

interface CharacterCardProps {
  character: HangulCharacter;
  onPress: () => void;
  compact?: boolean;
}

export function CharacterCard({ character, onPress, compact }: CharacterCardProps) {
  const learned = useAppStore((s) => s.learnedCharacters.includes(character.id));

  if (compact) {
    return (
      <TouchableOpacity onPress={onPress} onLongPress={() => speakKorean(character.sound)} activeOpacity={0.7} style={[styles.compactCard, learned && styles.learnedCard]}>
        <Text style={styles.compactChar}>{character.character}</Text>
        <Text style={styles.compactRoman}>{character.romanization}</Text>
        {learned && <Ionicons name="checkmark-circle" size={14} color={colors.success} style={styles.checkmark} />}
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7} style={[styles.card, learned && styles.learnedCard]}>
      <Text style={styles.character}>{character.character}</Text>
      <Text style={styles.romanization}>{character.romanization}</Text>
      <Text style={styles.name}>{character.name}</Text>
      {learned && <Ionicons name="checkmark-circle" size={18} color={colors.success} style={styles.checkmark} />}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    gap: spacing.xs,
    ...shadows.sm,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  compactCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
    gap: 2,
    ...shadows.sm,
    borderWidth: 1,
    borderColor: colors.borderLight,
    width: 64,
    height: 72,
  },
  learnedCard: {
    borderColor: colors.success,
    backgroundColor: colors.successBg,
  },
  character: { fontSize: 36, fontWeight: '300', color: colors.textPrimary },
  compactChar: { fontSize: 24, fontWeight: '300', color: colors.textPrimary },
  romanization: { ...typography.caption, color: colors.textSecondary },
  compactRoman: { fontSize: 10, color: colors.textTertiary },
  name: { ...typography.caption, color: colors.textTertiary },
  checkmark: { position: 'absolute', top: 6, right: 6 },
});

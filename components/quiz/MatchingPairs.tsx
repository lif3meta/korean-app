import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import * as Haptics from 'expo-haptics';
import { colors, borderRadius, spacing, typography, shadows } from '@/lib/theme';
import { shuffleArray } from '@/lib/utils';
import { useAppStore } from '@/lib/store';

interface MatchingPairsProps {
  instruction: string;
  pairs: { left: string; right: string }[];
  onComplete: (allCorrect: boolean) => void;
}

export function MatchingPairs({ instruction, pairs, onComplete }: MatchingPairsProps) {
  const shuffledRight = useMemo(() => shuffleArray(pairs.map((p) => p.right)), []);
  const [selectedLeft, setSelectedLeft] = useState<number | null>(null);
  const [selectedRight, setSelectedRight] = useState<number | null>(null);
  const [matched, setMatched] = useState<Record<number, number>>({});
  const [wrong, setWrong] = useState<{ left: number; right: number } | null>(null);
  const hapticEnabled = useAppStore((s) => s.hapticEnabled);

  const handleLeftPress = (i: number) => {
    if (matched[i] !== undefined) return;
    setSelectedLeft(i);
    setWrong(null);
    if (selectedRight !== null) checkMatch(i, selectedRight);
  };

  const handleRightPress = (i: number) => {
    if (Object.values(matched).includes(i)) return;
    setSelectedRight(i);
    setWrong(null);
    if (selectedLeft !== null) checkMatch(selectedLeft, i);
  };

  const checkMatch = (left: number, right: number) => {
    const correctRight = shuffledRight[right];
    const isMatch = pairs[left].right === correctRight;

    if (isMatch) {
      if (hapticEnabled) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      const newMatched = { ...matched, [left]: right };
      setMatched(newMatched);
      setSelectedLeft(null);
      setSelectedRight(null);
      if (Object.keys(newMatched).length === pairs.length) {
        setTimeout(() => onComplete(true), 600);
      }
    } else {
      if (hapticEnabled) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setWrong({ left, right });
      setTimeout(() => {
        setSelectedLeft(null);
        setSelectedRight(null);
        setWrong(null);
      }, 800);
    }
  };

  const getLeftStyle = (i: number) => {
    if (matched[i] !== undefined) return [styles.item, styles.matchedItem];
    if (wrong?.left === i) return [styles.item, styles.wrongItem];
    if (selectedLeft === i) return [styles.item, styles.selectedItem];
    return [styles.item];
  };

  const getRightStyle = (i: number) => {
    if (Object.values(matched).includes(i)) return [styles.item, styles.matchedItem];
    if (wrong?.right === i) return [styles.item, styles.wrongItem];
    if (selectedRight === i) return [styles.item, styles.selectedItem];
    return [styles.item];
  };

  return (
    <View style={styles.container}>
      <Text style={styles.instruction}>{instruction}</Text>
      <View style={styles.columns}>
        <View style={styles.column}>
          {pairs.map((p, i) => (
            <TouchableOpacity key={i} onPress={() => handleLeftPress(i)} style={getLeftStyle(i)} disabled={matched[i] !== undefined}>
              <Text style={styles.itemText}>{p.left}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.column}>
          {shuffledRight.map((item, i) => (
            <TouchableOpacity key={i} onPress={() => handleRightPress(i)} style={getRightStyle(i)} disabled={Object.values(matched).includes(i)}>
              <Text style={styles.itemText}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <Text style={styles.progress}>{Object.keys(matched).length} / {pairs.length} matched</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: spacing.lg },
  instruction: { ...typography.title3, color: colors.textPrimary, textAlign: 'center' },
  columns: { flexDirection: 'row', gap: spacing.md },
  column: { flex: 1, gap: spacing.sm },
  item: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    ...shadows.sm,
  },
  selectedItem: { borderColor: colors.primary, backgroundColor: colors.primaryFaint },
  matchedItem: { borderColor: colors.success, backgroundColor: colors.successBg, opacity: 0.7 },
  wrongItem: { borderColor: colors.danger, backgroundColor: colors.dangerBg },
  itemText: { ...typography.body, color: colors.textPrimary },
  progress: { ...typography.caption, color: colors.textTertiary, textAlign: 'center' },
});

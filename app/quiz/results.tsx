import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors, borderRadius, spacing, typography } from '@/lib/theme';
import { Button } from '@/components/ui/Button';

export default function QuizResultsScreen() {
  const { correct, total, xp, category } = useLocalSearchParams<{ correct: string; total: string; xp: string; category: string }>();

  const score = parseInt(correct || '0');
  const totalQ = parseInt(total || '1');
  const xpEarned = parseInt(xp || '0');
  const percentage = Math.round((score / totalQ) * 100);

  const isPerfect = percentage === 100;
  const isGood = percentage >= 70;

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={isPerfect ? ['#FFD740', '#FFC107'] : isGood ? [colors.primary, colors.primaryDark] : [colors.koreanRed, '#FF5252']}
        style={styles.gradient}
      >
        <Ionicons name={isPerfect ? 'trophy' : isGood ? 'thumbs-up' : 'fitness'} size={80} color="rgba(255,255,255,0.9)" />
        <Text style={styles.title}>
          {isPerfect ? 'Perfect!' : isGood ? 'Great Job!' : 'Keep Practicing!'}
        </Text>
        <Text style={styles.titleKorean}>
          {isPerfect ? '완벽해요!' : isGood ? '잘했어요!' : '화이팅!'}
        </Text>

        <View style={styles.scoreCircle}>
          <Text style={styles.scoreText}>{percentage}%</Text>
          <Text style={styles.scoreLabel}>{score}/{totalQ}</Text>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Ionicons name="checkmark-circle" size={24} color="rgba(255,255,255,0.9)" />
            <Text style={styles.statValue}>{score}</Text>
            <Text style={styles.statLabel}>Correct</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="close-circle" size={24} color="rgba(255,255,255,0.9)" />
            <Text style={styles.statValue}>{totalQ - score}</Text>
            <Text style={styles.statLabel}>Incorrect</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="star" size={24} color="rgba(255,255,255,0.9)" />
            <Text style={styles.statValue}>+{xpEarned}</Text>
            <Text style={styles.statLabel}>XP Earned</Text>
          </View>
        </View>

        <View style={styles.buttons}>
          <Button
            title="Try Again"
            variant="outline"
            onPress={() => router.replace(`/quiz/${category}` as any)}
            style={styles.outlineBtn}
            textStyle={{ color: '#fff' }}
          />
          <Button
            title="Done"
            variant="outline"
            onPress={() => router.replace('/(tabs)')}
            style={styles.outlineBtn}
            textStyle={{ color: '#fff' }}
          />
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  gradient: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xxl, gap: spacing.lg },
  emoji: { fontSize: 80 },
  title: { ...typography.largeTitle, color: '#fff' },
  titleKorean: { fontSize: 24, color: 'rgba(255,255,255,0.7)', fontWeight: '300' },
  scoreCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.4)',
    marginVertical: spacing.lg,
  },
  scoreText: { fontSize: 42, fontWeight: '800', color: '#fff' },
  scoreLabel: { ...typography.caption, color: 'rgba(255,255,255,0.7)' },
  statsRow: { flexDirection: 'row', gap: spacing.xxl },
  statItem: { alignItems: 'center', gap: spacing.xs },
  statValue: { ...typography.title3, color: '#fff' },
  statLabel: { ...typography.caption, color: 'rgba(255,255,255,0.7)' },
  buttons: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.xxl },
  outlineBtn: { borderColor: 'rgba(255,255,255,0.5)', borderWidth: 2, paddingHorizontal: spacing.xxl },
});

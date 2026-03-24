import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { colors, borderRadius, spacing, typography, shadows } from '@/lib/theme';
import { allHangul, getHangulById } from '@/data/hangul';
import { useAppStore } from '@/lib/store';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { speakKorean } from '@/lib/audio';
import { AudioButton } from '@/components/common/AudioButton';

export default function CharacterDetailScreen() {
  const { characterId } = useLocalSearchParams<{ characterId: string }>();
  const char = getHangulById(characterId);
  const { learnedCharacters, markCharacterLearned, hapticEnabled } = useAppStore();
  const [isPlaying, setIsPlaying] = useState(false);

  if (!char) return <View style={styles.container}><Text>Character not found</Text></View>;

  const isLearned = learnedCharacters.includes(char.id);
  const charIndex = allHangul.findIndex((c) => c.id === char.id);
  const prevChar = charIndex > 0 ? allHangul[charIndex - 1] : null;
  const nextChar = charIndex < allHangul.length - 1 ? allHangul[charIndex + 1] : null;

  const handlePlay = useCallback(() => {
    if (hapticEnabled) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsPlaying(true);
    speakKorean(char.sound);
    setTimeout(() => setIsPlaying(false), 1200);
  }, [char.sound]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 100 }}>
      {/* Main Character Display */}
      <View style={styles.characterSection}>
        <TouchableOpacity onPress={handlePlay} activeOpacity={0.8}>
          <View style={[styles.characterCircle, isPlaying && styles.characterCirclePlaying]}>
            <Text style={[styles.characterText, isPlaying && styles.characterTextPlaying]}>{char.character}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={handlePlay} style={styles.playBtn}>
          <Ionicons name={isPlaying ? 'pause' : 'play'} size={20} color={colors.primary} />
          <Text style={styles.playLabel}>{isPlaying ? 'Playing...' : 'Tap to hear'}</Text>
        </TouchableOpacity>
        <Text style={styles.romanization}>{char.romanization}</Text>
        <Text style={styles.name}>{char.name} ({char.nameKorean})</Text>
        <View style={styles.typeBadge}>
          <Text style={styles.typeText}>{char.type.replace('_', ' ')}</Text>
        </View>
      </View>

      {/* Pronunciation */}
      <Card variant="elevated" style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="volume-high" size={20} color={colors.primary} />
          <Text style={styles.cardTitle}>Pronunciation</Text>
        </View>
        <Text style={styles.pronunciationText}>{char.pronunciation}</Text>
      </Card>

      {/* Examples */}
      <Card variant="elevated" style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="book" size={20} color={colors.accent} />
          <Text style={styles.cardTitle}>Example Words</Text>
        </View>
        {char.examples.map((ex, i) => (
          <View key={i} style={styles.exampleRow}>
            <AudioButton text={ex.word} size="sm" />
            <Text style={styles.exampleKorean}>{ex.word}</Text>
            <Text style={styles.exampleRoman}>{ex.romanization}</Text>
            <Text style={styles.exampleMeaning}>{ex.meaning}</Text>
          </View>
        ))}
      </Card>

      {/* Mark as Learned */}
      <View style={styles.actionSection}>
        {isLearned ? (
          <View style={styles.learnedBadge}>
            <Ionicons name="checkmark-circle" size={24} color={colors.success} />
            <Text style={styles.learnedText}>You've learned this character!</Text>
          </View>
        ) : (
          <Button title="Mark as Learned" onPress={() => markCharacterLearned(char.id)} size="lg" />
        )}
      </View>

      {/* Navigation */}
      <View style={styles.navRow}>
        {prevChar ? (
          <TouchableOpacity onPress={() => router.replace(`/lesson/hangul/${prevChar.id}`)} style={styles.navBtn}>
            <Ionicons name="chevron-back" size={20} color={colors.primary} />
            <Text style={styles.navChar}>{prevChar.character}</Text>
          </TouchableOpacity>
        ) : <View />}
        {nextChar ? (
          <TouchableOpacity onPress={() => router.replace(`/lesson/hangul/${nextChar.id}`)} style={styles.navBtn}>
            <Text style={styles.navChar}>{nextChar.character}</Text>
            <Ionicons name="chevron-forward" size={20} color={colors.primary} />
          </TouchableOpacity>
        ) : <View />}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  characterSection: { alignItems: 'center', paddingHorizontal: spacing.xl, paddingVertical: spacing.lg, gap: spacing.sm },
  characterCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.primaryFaint,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: colors.primaryPale,
    ...shadows.glow,
  },
  characterCirclePlaying: {
    backgroundColor: colors.primaryPale,
    borderColor: colors.primary,
    borderWidth: 4,
    ...shadows.glow,
  },
  characterTextPlaying: { color: colors.primary },
  playBtn: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, paddingVertical: spacing.xs },
  playLabel: { fontSize: 12, fontFamily: 'Poppins-Medium', color: colors.primary },
  characterText: { fontSize: 60, fontWeight: '300', color: colors.primaryDark },
  romanization: { ...typography.title2, color: colors.textSecondary },
  name: { ...typography.subhead, color: colors.textTertiary },
  typeBadge: { backgroundColor: colors.primaryPale, paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: borderRadius.full },
  typeText: { fontSize: 11, fontFamily: 'Poppins-Bold', color: colors.primaryDark, textTransform: 'capitalize' },
  card: { marginHorizontal: spacing.xl, marginBottom: spacing.lg, padding: spacing.lg, gap: spacing.md },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, flexWrap: 'wrap' },
  cardTitle: { fontSize: 15, fontFamily: 'Poppins-Bold', color: colors.textPrimary, flexShrink: 1 },
  pronunciationText: { ...typography.body, color: colors.textSecondary, lineHeight: 24 },
  exampleRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.borderLight, flexWrap: 'wrap' },
  exampleKorean: { fontSize: 20, color: colors.textPrimary },
  exampleRoman: { ...typography.footnote, color: colors.textTertiary },
  exampleMeaning: { ...typography.footnote, color: colors.textSecondary, flex: 1, textAlign: 'right' },
  actionSection: { paddingHorizontal: spacing.xl, marginVertical: spacing.lg },
  learnedBadge: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, padding: spacing.lg, backgroundColor: colors.successBg, borderRadius: borderRadius.xl },
  learnedText: { ...typography.bodyBold, color: colors.success },
  navRow: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: spacing.xl, paddingBottom: spacing.xxl },
  navBtn: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, padding: spacing.md },
  navChar: { fontSize: 24, color: colors.primary },
});

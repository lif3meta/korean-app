import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Image } from 'react-native';
import { colors, borderRadius, spacing, typography, shadows } from '@/lib/theme';
import { VocabWord, getVocabImageUrl } from '@/data/vocabulary';
import { getVocabImage } from '@/data/vocabImages';
import { useAppStore } from '@/lib/store';
import { AudioButton } from '@/components/common/AudioButton';
import { CachedImage } from '@/components/common/CachedImage';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 48;

interface FlashCardProps {
  word: VocabWord;
  onKnow: () => void;
  onDontKnow: () => void;
}

export function FlashCard({ word, onKnow, onDontKnow }: FlashCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const showRomanization = useAppStore((s) => s.showRomanization);
  const localImage = getVocabImage(word.id);

  const flip = () => setIsFlipped(!isFlipped);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={flip} activeOpacity={0.9} style={styles.cardWrapper}>
        {!isFlipped ? (
          <View style={[styles.card, styles.front]}>
            <Text style={styles.tapHint}>Tap to flip</Text>
            <AudioButton text={word.korean} size="md" style={styles.audioBtn} />
            {localImage ? (
              <Image source={localImage} style={styles.wordImage} />
            ) : (
              <CachedImage uri={getVocabImageUrl(word)} style={styles.wordImage} />
            )}
            <Text style={styles.korean}>{word.korean}</Text>
            {showRomanization && <Text style={styles.romanization}>{word.romanization}</Text>}
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{word.partOfSpeech}</Text>
            </View>
          </View>
        ) : (
          <View style={[styles.card, styles.back]}>
            <Text style={styles.tapHint}>Tap to flip back</Text>
            <AudioButton text={word.korean} size="md" style={styles.audioBtn} />
            <Text style={styles.english}>{word.english}</Text>
            <Text style={styles.koreanSmall}>{word.korean}</Text>
            {word.example && (
              <View style={styles.exampleBox}>
                <Text style={styles.exampleKorean}>{word.example.korean}</Text>
                <Text style={styles.exampleEnglish}>{word.example.english}</Text>
              </View>
            )}
            {word.notes && <Text style={styles.notes}>{word.notes}</Text>}
          </View>
        )}
      </TouchableOpacity>

      {isFlipped && (
        <View style={styles.buttons}>
          <TouchableOpacity onPress={onDontKnow} style={[styles.btn, styles.btnDontKnow]}>
            <Text style={styles.btnTextDontKnow}>Still Learning</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onKnow} style={[styles.btn, styles.btnKnow]}>
            <Text style={styles.btnTextKnow}>Know It!</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', gap: spacing.lg },
  cardWrapper: { width: CARD_WIDTH, height: 320 },
  card: {
    width: '100%',
    height: '100%',
    borderRadius: borderRadius.xxl,
    padding: spacing.xxl,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.lg,
  },
  front: {
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.primaryPale,
  },
  back: {
    backgroundColor: colors.primaryPale,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  wordImage: { width: 120, height: 120, borderRadius: 16, marginBottom: spacing.sm },
  audioBtn: { position: 'absolute', top: spacing.lg, right: spacing.lg },
  tapHint: { ...typography.caption, color: colors.textTertiary, position: 'absolute', top: spacing.lg, left: spacing.lg },
  korean: { fontSize: 48, fontWeight: '300', color: colors.textPrimary, letterSpacing: 2 },
  romanization: { ...typography.subhead, color: colors.textSecondary, fontStyle: 'italic', marginTop: spacing.sm },
  english: { ...typography.title2, color: colors.textPrimary, textAlign: 'center' },
  koreanSmall: { fontSize: 24, color: colors.textSecondary, marginTop: spacing.sm },
  badge: { backgroundColor: colors.primaryFaint, paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: borderRadius.full, marginTop: spacing.md },
  badgeText: { ...typography.caption, color: colors.primaryDark },
  exampleBox: { backgroundColor: 'rgba(255,255,255,0.6)', padding: spacing.md, borderRadius: borderRadius.md, marginTop: spacing.lg, alignItems: 'center' },
  exampleKorean: { ...typography.body, color: colors.textPrimary },
  exampleEnglish: { ...typography.footnote, color: colors.textSecondary, marginTop: 2 },
  notes: { ...typography.caption, color: colors.textTertiary, marginTop: spacing.md, fontStyle: 'italic', textAlign: 'center' },
  buttons: { flexDirection: 'row', gap: spacing.md },
  btn: { paddingVertical: spacing.md, paddingHorizontal: spacing.xxl, borderRadius: borderRadius.xl },
  btnDontKnow: { backgroundColor: colors.dangerLight },
  btnKnow: { backgroundColor: colors.successLight },
  btnTextDontKnow: { ...typography.bodyBold, color: colors.danger },
  btnTextKnow: { ...typography.bodyBold, color: colors.success },
});

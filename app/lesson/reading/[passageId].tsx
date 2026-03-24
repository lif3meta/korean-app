import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, borderRadius, spacing, shadows } from '@/lib/theme';
import { readingPassages } from '@/data/readings';
import { speakKorean } from '@/lib/audio';

export default function ReadingPassageScreen() {
  const { passageId } = useLocalSearchParams<{ passageId: string }>();
  const passage = readingPassages.find((p) => p.id === passageId);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [revealedParagraphs, setRevealedParagraphs] = useState<Set<number>>(new Set());

  const wordMaps = useMemo(() => {
    if (!passage) return [];
    return passage.paragraphs.map((para) => {
      const map = new Map<string, string>();
      para.words.forEach((w) => map.set(w.korean, w.english));
      return map;
    });
  }, [passage]);

  if (!passage) {
    return <View style={styles.center}><Text>Passage not found</Text></View>;
  }

  const toggleTranslation = (i: number) => {
    setRevealedParagraphs((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  };

  const handleWordTap = (key: string) => {
    setSelectedKey(selectedKey === key ? null : key);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: spacing.xl, paddingBottom: 120 }}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>{passage.title}</Text>
        <Text style={styles.titleKr}>{passage.titleKorean}</Text>
        <Text style={styles.desc}>{passage.description}</Text>
        <View style={styles.tip}>
          <Ionicons name="finger-print" size={14} color={colors.primary} />
          <Text style={styles.tipText}>Tap any word to see its meaning</Text>
        </View>
      </View>

      {/* Paragraphs */}
      {passage.paragraphs.map((para, pi) => {
        const words = para.korean.split(' ');
        const isRevealed = revealedParagraphs.has(pi);

        return (
          <View key={pi} style={styles.card}>
            {/* Sentence number + audio */}
            <View style={styles.cardHeader}>
              <View style={styles.numCircle}>
                <Text style={styles.numText}>{pi + 1}</Text>
              </View>
              <TouchableOpacity onPress={() => speakKorean(para.korean)} style={styles.audioBtn}>
                <Ionicons name="play" size={16} color={colors.primary} />
              </TouchableOpacity>
            </View>

            {/* Korean words - each tappable with inline translation */}
            <View style={styles.wordsWrap}>
              {words.map((word, wi) => {
                const key = `${pi}-${wi}`;
                const isSelected = selectedKey === key;
                const english = wordMaps[pi]?.get(word);

                return (
                  <View key={key} style={styles.wordColumn}>
                    <TouchableOpacity onPress={() => handleWordTap(key)} activeOpacity={0.6}>
                      <Text style={[styles.koreanWord, isSelected && styles.koreanWordActive]}>
                        {word}
                      </Text>
                    </TouchableOpacity>
                    {/* Show English BELOW the word when tapped */}
                    {isSelected && english && (
                      <View style={styles.inlineTranslation}>
                        <Text style={styles.inlineEnglish}>{english}</Text>
                      </View>
                    )}
                  </View>
                );
              })}
            </View>

            {/* Romanization */}
            {para.words && (
              <Text style={styles.romanization}>
                {words.map((w) => {
                  // Simple romanization from word map or just show the word
                  return w;
                }).join(' ')}
              </Text>
            )}

            {/* Show/Hide full translation */}
            <TouchableOpacity onPress={() => toggleTranslation(pi)} style={styles.translateBtn}>
              <Ionicons name={isRevealed ? 'eye-off' : 'eye'} size={14} color={colors.primary} />
              <Text style={styles.translateText}>{isRevealed ? 'Hide' : 'Show'} Translation</Text>
            </TouchableOpacity>

            {isRevealed && (
              <View style={styles.translationBox}>
                <Text style={styles.translationText}>{para.english}</Text>
              </View>
            )}
          </View>
        );
      })}

      {/* Play All */}
      <TouchableOpacity onPress={() => speakKorean(passage.paragraphs.map((p) => p.korean).join('. '))} style={styles.playAll}>
        <Ionicons name="play-circle" size={20} color="#fff" />
        <Text style={styles.playAllText}>Play Full Passage</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  header: { marginBottom: spacing.xl, gap: spacing.xs },
  title: { fontSize: 22, fontFamily: 'Poppins-ExtraBold', color: colors.textPrimary },
  titleKr: { fontSize: 14, fontFamily: 'Poppins-Medium', color: colors.textTertiary },
  desc: { fontSize: 14, fontFamily: 'Poppins-Regular', color: colors.textSecondary, lineHeight: 20, marginTop: spacing.xs },
  tip: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, backgroundColor: colors.primaryFaint, padding: spacing.sm, borderRadius: borderRadius.md, marginTop: spacing.sm },
  tipText: { fontSize: 11, fontFamily: 'Poppins-Medium', color: colors.primary },

  card: { backgroundColor: colors.surface, borderRadius: borderRadius.xl, padding: spacing.lg, marginBottom: spacing.md, gap: spacing.md, ...shadows.sm },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  numCircle: { width: 26, height: 26, borderRadius: 13, backgroundColor: colors.primaryPale, alignItems: 'center', justifyContent: 'center' },
  numText: { fontSize: 12, fontFamily: 'Poppins-Bold', color: colors.primaryDark },
  audioBtn: { width: 34, height: 34, borderRadius: 17, backgroundColor: colors.primaryFaint, alignItems: 'center', justifyContent: 'center' },

  wordsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, alignItems: 'flex-start' },
  wordColumn: { alignItems: 'center' },
  koreanWord: { fontSize: 22, color: colors.textPrimary, borderBottomWidth: 1, borderBottomColor: colors.border, paddingHorizontal: 2, paddingVertical: 1 },
  koreanWordActive: { color: colors.primary, borderBottomColor: colors.primary, borderBottomWidth: 2 },
  inlineTranslation: { backgroundColor: colors.primaryFaint, paddingHorizontal: spacing.sm, paddingVertical: 2, borderRadius: borderRadius.sm, marginTop: 2 },
  inlineEnglish: { fontSize: 10, fontFamily: 'Poppins-SemiBold', color: colors.primaryDark },

  romanization: { fontSize: 12, fontFamily: 'Poppins-Regular', color: colors.textTertiary, fontStyle: 'italic', lineHeight: 18 },

  translateBtn: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, alignSelf: 'flex-start' },
  translateText: { fontSize: 12, fontFamily: 'Poppins-Medium', color: colors.primary },
  translationBox: { backgroundColor: colors.primaryFaint, padding: spacing.md, borderRadius: borderRadius.md },
  translationText: { fontSize: 13, fontFamily: 'Poppins-Regular', color: colors.textSecondary, lineHeight: 20 },

  playAll: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, backgroundColor: colors.primary, paddingVertical: spacing.md, borderRadius: borderRadius.xl, marginTop: spacing.lg, ...shadows.md },
  playAllText: { fontSize: 14, fontFamily: 'Poppins-SemiBold', color: '#fff' },
});

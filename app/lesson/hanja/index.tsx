import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, borderRadius, spacing, typography, shadows } from '@/lib/theme';
import { hanjaCharacters } from '@/data/hanja';

export default function HanjaExplorerScreen() {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search.trim()) return hanjaCharacters;
    const q = search.trim().toLowerCase();
    return hanjaCharacters.filter(
      (h) =>
        h.meaning.toLowerCase().includes(q) ||
        h.korean.includes(q) ||
        h.hanja.includes(q)
    );
  }, [search]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 32 }}>
      <View style={styles.header}>
        <View style={styles.headerIcon}>
          <Ionicons name="language" size={28} color="#dc2626" />
        </View>
        <Text style={styles.title}>Hanja Explorer</Text>
        <Text style={styles.titleKorean}>한자 탐험</Text>
        <Text style={styles.description}>
          Learn Chinese character roots to unlock vocabulary families
        </Text>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={18} color={colors.textTertiary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by meaning or pronunciation..."
          placeholderTextColor={colors.textTertiary}
          value={search}
          onChangeText={setSearch}
          autoCorrect={false}
          autoCapitalize="none"
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Ionicons name="close-circle" size={18} color={colors.textTertiary} />
          </TouchableOpacity>
        )}
      </View>

      <Text style={styles.resultCount}>
        {filtered.length} character{filtered.length !== 1 ? 's' : ''}
      </Text>

      <View style={styles.grid}>
        {filtered.map((h) => (
          <TouchableOpacity
            key={h.id}
            onPress={() => router.push(`/lesson/hanja/${h.id}`)}
            activeOpacity={0.7}
            style={styles.card}
          >
            <Text style={styles.cardHanja}>{h.hanja}</Text>
            <Text style={styles.cardKorean}>{h.korean}</Text>
            <Text style={styles.cardMeaning} numberOfLines={1}>{h.meaning}</Text>
            <View style={styles.wordCountBadge}>
              <Text style={styles.wordCountText}>{h.words.length} words</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
    gap: spacing.xs,
  },
  headerIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#fef2f2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Jakarta-ExtraBold',
    color: colors.textPrimary,
  },
  titleKorean: {
    fontSize: 13,
    fontFamily: 'Jakarta-Medium',
    color: colors.textTertiary,
  },
  description: {
    fontSize: 14,
    fontFamily: 'Jakarta-Regular',
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.xs,
    lineHeight: 20,
    paddingHorizontal: spacing.lg,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceLow,
    marginHorizontal: spacing.xl,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.xl,
    gap: spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Jakarta-Regular',
    color: colors.textPrimary,
    paddingVertical: 4,
  },
  resultCount: {
    fontSize: 12,
    fontFamily: 'Jakarta-Medium',
    color: colors.textTertiary,
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.md,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  card: {
    width: '47%',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    alignItems: 'center',
    gap: spacing.xs,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.sm,
  },
  cardHanja: {
    fontSize: 40,
    color: '#dc2626',
  },
  cardKorean: {
    fontSize: 18,
    fontFamily: 'Jakarta-SemiBold',
    color: colors.textPrimary,
  },
  cardMeaning: {
    fontSize: 12,
    fontFamily: 'Jakarta-Regular',
    color: colors.textSecondary,
    textAlign: 'center',
  },
  wordCountBadge: {
    backgroundColor: '#fef2f2',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
    marginTop: spacing.xs,
  },
  wordCountText: {
    fontSize: 10,
    fontFamily: 'Jakarta-Bold',
    color: '#dc2626',
  },
});

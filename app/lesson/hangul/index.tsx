import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { colors, borderRadius, spacing, typography } from '@/lib/theme';
import { consonants, doubleConsonants, vowels, compoundVowels } from '@/data/hangul';
import { CharacterCard } from '@/components/hangul/CharacterCard';
import { useAppStore } from '@/lib/store';
import { getPercentage } from '@/lib/utils';

const tabs = [
  { key: 'consonants', label: 'Consonants', data: consonants },
  { key: 'vowels', label: 'Vowels', data: vowels },
  { key: 'double', label: 'Double', data: doubleConsonants },
  { key: 'compound', label: 'Compound', data: compoundVowels },
] as const;

export default function HangulScreen() {
  const [activeTab, setActiveTab] = useState<string>('consonants');
  const learnedCharacters = useAppStore((s) => s.learnedCharacters);
  const activeData = tabs.find((t) => t.key === activeTab)!;
  const learnedInTab = activeData.data.filter((c) => learnedCharacters.includes(c.id)).length;

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 100 }}>
      {/* Tab Bar */}
      <View style={styles.tabBar}>
        {tabs.map((tab) => (
          <TouchableOpacity key={tab.key} onPress={() => setActiveTab(tab.key)} style={[styles.tab, activeTab === tab.key && styles.tabActive]}>
            <Text style={[styles.tabText, activeTab === tab.key && styles.tabTextActive]}>{tab.label}</Text>
            <Text style={[styles.tabCount, activeTab === tab.key && styles.tabCountActive]}>{tab.data.length}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Progress */}
      <View style={styles.progressRow}>
        <Text style={styles.progressText}>
          {learnedInTab}/{activeData.data.length} learned ({getPercentage(learnedInTab, activeData.data.length)}%)
        </Text>
      </View>

      {/* Character Grid */}
      <View style={styles.grid}>
        {activeData.data.map((char) => (
          <View key={char.id} style={styles.gridItem}>
            <CharacterCard character={char} onPress={() => router.push(`/lesson/hangul/${char.id}`)} compact />
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  tabBar: { flexDirection: 'row', gap: spacing.xs, paddingHorizontal: spacing.md, paddingVertical: spacing.md },
  tab: {
    flex: 1,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  tabActive: { backgroundColor: colors.primaryDark, borderColor: colors.primaryDark },
  tabText: { fontSize: 10, fontFamily: 'Poppins-Bold', color: colors.textSecondary },
  tabTextActive: { color: '#fff' },
  tabCount: { fontSize: 9, fontFamily: 'Poppins-Medium', color: colors.textTertiary },
  tabCountActive: { color: 'rgba(255,255,255,0.7)' },
  progressRow: { paddingHorizontal: spacing.lg, marginBottom: spacing.md },
  progressText: { ...typography.footnote, color: colors.textTertiary },
  grid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: spacing.lg, gap: spacing.sm, justifyContent: 'flex-start' },
  gridItem: { marginBottom: spacing.xs },
});

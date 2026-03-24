import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { colors, spacing, typography } from '@/lib/theme';
import { allCategories } from '@/data/vocabulary';
import { CategoryCard } from '@/components/vocab/CategoryCard';

export default function VocabScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 100 }}>
      <Text style={styles.title}>Choose a Category</Text>
      <Text style={styles.subtitle}>카테고리를 선택하세요</Text>

      <View style={styles.grid}>
        {allCategories.map((cat) => (
          <View key={cat} style={styles.gridItem}>
            <CategoryCard category={cat} onPress={() => router.push(`/lesson/vocab/${cat}`)} />
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.xl },
  title: { ...typography.title2, color: colors.textPrimary },
  subtitle: { ...typography.footnote, color: colors.textTertiary, marginBottom: spacing.lg },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  gridItem: { width: '47%' as any },
});

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, borderRadius, spacing, typography, shadows } from '@/lib/theme';
import { useAppStore } from '@/lib/store';

export default function SettingsScreen() {
  const store = useAppStore();

  const handleReset = () => {
    Alert.alert(
      'Reset Progress',
      'Are you sure you want to reset all your progress? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Reset', style: 'destructive', onPress: () => store.resetProgress() },
      ]
    );
  };

  const dailyGoalOptions = [5, 10, 15, 30];

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 100 }}>
      {/* Learning Preferences */}
      <Text style={styles.sectionTitle}>Learning</Text>
      <View style={styles.section}>
        <View style={styles.row}>
          <View style={styles.rowLeft}>
            <Ionicons name="text" size={20} color={colors.primary} />
            <View>
              <Text style={styles.rowTitle}>Show Romanization</Text>
              <Text style={styles.rowSub}>Display pronunciation guide for Korean text</Text>
            </View>
          </View>
          <Switch
            value={store.showRomanization}
            onValueChange={store.toggleRomanization}
            trackColor={{ false: colors.border, true: colors.primaryLight }}
            thumbColor={store.showRomanization ? colors.primary : colors.textTertiary}
          />
        </View>

        <View style={styles.divider} />

        <View style={styles.row}>
          <View style={styles.rowLeft}>
            <Ionicons name="time" size={20} color={colors.primary} />
            <View>
              <Text style={styles.rowTitle}>Daily Goal</Text>
              <Text style={styles.rowSub}>{store.dailyGoalMinutes} minutes per day</Text>
            </View>
          </View>
        </View>
        <View style={styles.goalRow}>
          {dailyGoalOptions.map((mins) => (
            <TouchableOpacity
              key={mins}
              onPress={() => store.setDailyGoal(mins)}
              style={[styles.goalBtn, store.dailyGoalMinutes === mins && styles.goalBtnActive]}
            >
              <Text style={[styles.goalText, store.dailyGoalMinutes === mins && styles.goalTextActive]}>{mins}m</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* App Preferences */}
      <Text style={styles.sectionTitle}>App</Text>
      <View style={styles.section}>
        <View style={styles.row}>
          <View style={styles.rowLeft}>
            <Ionicons name="volume-high" size={20} color={colors.accent} />
            <Text style={styles.rowTitle}>Sound Effects</Text>
          </View>
          <Switch
            value={store.soundEnabled}
            onValueChange={store.toggleSound}
            trackColor={{ false: colors.border, true: colors.accentLight }}
            thumbColor={store.soundEnabled ? colors.accent : colors.textTertiary}
          />
        </View>

        <View style={styles.divider} />

        <View style={styles.row}>
          <View style={styles.rowLeft}>
            <Ionicons name="phone-portrait" size={20} color={colors.accent} />
            <Text style={styles.rowTitle}>Haptic Feedback</Text>
          </View>
          <Switch
            value={store.hapticEnabled}
            onValueChange={store.toggleHaptic}
            trackColor={{ false: colors.border, true: colors.accentLight }}
            thumbColor={store.hapticEnabled ? colors.accent : colors.textTertiary}
          />
        </View>
      </View>

      {/* Danger Zone */}
      <Text style={styles.sectionTitle}>Data</Text>
      <View style={styles.section}>
        <TouchableOpacity onPress={handleReset} style={styles.row}>
          <View style={styles.rowLeft}>
            <Ionicons name="trash" size={20} color={colors.danger} />
            <Text style={[styles.rowTitle, { color: colors.danger }]}>Reset All Progress</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.danger} />
        </TouchableOpacity>
      </View>

      {/* About */}
      <View style={styles.aboutSection}>
        <Text style={styles.aboutTitle}>Lzy Learn Korean</Text>
       
        <Text style={styles.aboutVersion}>Version 1.0.0</Text>
        <Text style={styles.aboutText}>Learn Korean the lazy but fun way</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  sectionTitle: { ...typography.captionBold, color: colors.textTertiary, textTransform: 'uppercase', paddingHorizontal: spacing.xl, paddingTop: spacing.xl, paddingBottom: spacing.sm },
  section: {
    backgroundColor: colors.surface,
    marginHorizontal: spacing.xl,
    borderRadius: borderRadius.xl,
    ...shadows.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.lg,
  },
  rowLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, flex: 1 },
  rowTitle: { ...typography.body, color: colors.textPrimary },
  rowSub: { ...typography.caption, color: colors.textTertiary },
  divider: { height: 1, backgroundColor: colors.borderLight, marginHorizontal: spacing.lg },
  goalRow: { flexDirection: 'row', gap: spacing.sm, paddingHorizontal: spacing.lg, paddingBottom: spacing.lg },
  goalBtn: {
    flex: 1,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primaryPale,
    alignItems: 'center',
  },
  goalBtnActive: { backgroundColor: colors.primaryDark },
  goalText: { ...typography.captionBold, color: colors.primaryDark },
  goalTextActive: { color: '#fff' },
  aboutSection: { alignItems: 'center', padding: spacing.xxl, marginTop: spacing.lg },
  aboutTitle: { ...typography.title2, color: colors.textPrimary },
  aboutSub: { ...typography.subhead, color: colors.textTertiary },
  aboutVersion: { ...typography.caption, color: colors.textTertiary, marginTop: spacing.sm },
  aboutText: { ...typography.footnote, color: colors.textTertiary, marginTop: spacing.xs },
});

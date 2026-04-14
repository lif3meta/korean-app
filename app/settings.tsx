import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity, Alert, Linking, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { colors, borderRadius, spacing, typography, shadows } from '@/lib/theme';
import { useAppStore } from '@/lib/store';
import { restorePurchases, checkSubscriptionStatus } from '@/lib/purchases';

export default function SettingsScreen() {
  const store = useAppStore();
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(store.userName || '');

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

  const [restoringPurchases, setRestoringPurchases] = useState(false);

  const refreshSubscriptionState = async () => {
    const status = await checkSubscriptionStatus();
    store.setSubscriptionStatus(status.isPremium, status.expirationDate, status.willRenew);
    return status;
  };

  const handleRestore = async () => {
    setRestoringPurchases(true);
    try {
      const restored = await restorePurchases();
      const status = await refreshSubscriptionState();
      if (restored && status.isPremium) {
        Alert.alert('Restored', 'Your subscription has been restored.');
      } else {
        Alert.alert('No Subscription Found', 'We could not find an active subscription for your account.');
      }
    } catch (e: any) {
      Alert.alert('Restore Failed', e.message || 'Something went wrong.');
    } finally {
      setRestoringPurchases(false);
    }
  };

  const handleManageSubscription = () => {
    Linking.openURL('https://apps.apple.com/account/subscriptions');
  };

  const getSubscriptionLabel = () => {
    if (!store.isPremium) return 'Inactive';
    if (store.subscriptionExpirationDate) {
      const expDate = new Date(store.subscriptionExpirationDate);
      return `Active until ${expDate.toLocaleDateString()}`;
    }
    return 'Active';
  };

  const dailyGoalOptions = [5, 10, 15, 30];

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 100 }}>
      {/* Profile */}
      <Text style={styles.sectionTitle}>Profile</Text>
      <View style={styles.section}>
        <View style={styles.row}>
          <View style={styles.rowLeft}>
            <Ionicons name="person" size={20} color={colors.primary} />
            <View style={{ flex: 1 }}>
              <Text style={styles.rowTitle}>Name</Text>
              {editingName ? (
                <TextInput
                  style={styles.nameInput}
                  value={nameInput}
                  onChangeText={setNameInput}
                  placeholder="Enter your name"
                  placeholderTextColor={colors.textTertiary}
                  autoFocus
                  autoCapitalize="words"
                  onBlur={() => {
                    const trimmed = nameInput.trim();
                    if (trimmed) store.setUserName(trimmed);
                    setEditingName(false);
                  }}
                  onSubmitEditing={() => {
                    const trimmed = nameInput.trim();
                    if (trimmed) store.setUserName(trimmed);
                    setEditingName(false);
                  }}
                />
              ) : (
                <Text style={styles.rowSub}>{store.userName || 'Learner'}</Text>
              )}
            </View>
          </View>
          <TouchableOpacity onPress={() => { setNameInput(store.userName || ''); setEditingName(true); }}>
            <Ionicons name={editingName ? 'checkmark' : 'pencil'} size={18} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Learning Preferences */}
      <Text style={styles.sectionTitle}>Learning</Text>
      <View style={styles.section}>
        <View style={styles.row}>
          <View style={styles.rowLeft}>
            <Ionicons name="text" size={20} color={colors.primary} />
            <View>
              <Text style={styles.rowTitle}>Show Romanization</Text>
              <Text style={styles.rowSub}>Display romanization hints under Korean text</Text>
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
            <Text style={styles.rowTitle}>Lesson Audio</Text>
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

      {/* Subscription */}
      <Text style={styles.sectionTitle}>Subscription</Text>
      <View style={styles.section}>
        <View style={styles.row}>
          <View style={styles.rowLeft}>
            <Ionicons name={store.isPremium ? 'checkmark-circle' : 'card'} size={20} color={store.isPremium ? colors.success : colors.primary} />
            <View>
              <Text style={styles.rowTitle}>Premium</Text>
              <Text style={styles.rowSub}>{getSubscriptionLabel()}</Text>
            </View>
          </View>
        </View>

        <View style={styles.divider} />

        <TouchableOpacity onPress={handleManageSubscription} style={styles.row}>
          <View style={styles.rowLeft}>
            <Ionicons name="settings" size={20} color={colors.primary} />
            <Text style={styles.rowTitle}>Manage Subscription</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
        </TouchableOpacity>

        <View style={styles.divider} />

        <TouchableOpacity onPress={handleRestore} disabled={restoringPurchases} style={styles.row}>
          <View style={styles.rowLeft}>
            <Ionicons name="refresh" size={20} color={colors.primary} />
            <Text style={styles.rowTitle}>{restoringPurchases ? 'Restoring...' : 'Restore Purchases'}</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
        </TouchableOpacity>
      </View>

      {/* AI Data Sharing */}
      <Text style={styles.sectionTitle}>AI Features</Text>
      <View style={styles.section}>
        <View style={styles.row}>
          <View style={styles.rowLeft}>
            <Ionicons name="sparkles" size={20} color={colors.accent} />
            <View style={{ flex: 1 }}>
              <Text style={styles.rowTitle}>AI Chat Data Sharing</Text>
              <Text style={styles.rowSub}>Send voice and text to Google Gemini for AI teacher chat</Text>
            </View>
          </View>
          <Switch
            value={store.hasAiConsent}
            onValueChange={(v) => store.setAiConsent(v)}
            trackColor={{ false: colors.border, true: colors.accentLight }}
            thumbColor={store.hasAiConsent ? colors.accent : colors.textTertiary}
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

      {/* Legal */}
      <Text style={styles.sectionTitle}>Legal</Text>
      <View style={styles.section}>
        <TouchableOpacity onPress={() => Linking.openURL('https://ulbmedia.com/terms/lzy-learn-korean')} style={styles.row}>
          <View style={styles.rowLeft}>
            <Ionicons name="document-text" size={20} color={colors.primary} />
            <Text style={styles.rowTitle}>Terms of Use</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
        </TouchableOpacity>

        <View style={styles.divider} />

        <TouchableOpacity onPress={() => Linking.openURL('https://ulbmedia.com/privacy/lzy-learn-korean')} style={styles.row}>
          <View style={styles.rowLeft}>
            <Ionicons name="shield-checkmark" size={20} color={colors.primary} />
            <Text style={styles.rowTitle}>Privacy Policy</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
        </TouchableOpacity>

        <View style={styles.divider} />

        <TouchableOpacity onPress={() => Linking.openURL('https://www.apple.com/legal/internet-services/itunes/dev/stdeula/')} style={styles.row}>
          <View style={styles.rowLeft}>
            <Ionicons name="reader" size={20} color={colors.primary} />
            <Text style={styles.rowTitle}>Apple EULA</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
        </TouchableOpacity>
      </View>

      {/* About */}
      <View style={styles.aboutSection}>
        <Text style={styles.aboutTitle}>Lzy Learn Korean</Text>

        <Text style={styles.aboutVersion}>Version {Constants.expoConfig?.version ?? '1.0.0'}</Text>
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
  nameInput: { ...typography.body, color: colors.textPrimary, borderBottomWidth: 1, borderBottomColor: colors.primary, paddingVertical: 4, marginTop: 2 },
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

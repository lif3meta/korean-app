import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, borderRadius, spacing, typography, shadows } from '@/lib/theme';
import { useAppStore } from '@/lib/store';
import { Card } from '@/components/ui/Card';
import { XPBar } from '@/components/ui/XPBar';
import { getLevelFromXP, getLevelTitle } from '@/lib/xp';
import { achievements } from '@/data/achievements';
import { allHangul } from '@/data/hangul';
import { vocabulary } from '@/data/vocabulary';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const store = useAppStore();
  const level = getLevelFromXP(store.totalXP);

  const storeData = {
    learnedCharacters: store.learnedCharacters,
    learnedWords: store.learnedWords,
    completedLessons: store.completedLessons,
    quizHistory: store.quizHistory,
    currentStreak: store.currentStreak,
    totalXP: store.totalXP,
  };

  const newlyUnlocked = achievements
    .filter(ach => !store.unlockedAchievements.includes(ach.id) && ach.condition(storeData))
    .map(ach => ach.id);

  useEffect(() => {
    newlyUnlocked.forEach(id => store.unlockAchievement(id));
  }, [newlyUnlocked.join(',')]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: spacing.xxxl }} showsVerticalScrollIndicator={false}>
      <LinearGradient colors={['#AA00FF', '#E040FB', '#FF80AB']} style={[styles.header, { paddingTop: insets.top + spacing.xl }]}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{(store.userName || 'L')[0].toUpperCase()}</Text>
        </View>
        <Text style={styles.name}>{store.userName || 'Learner'}</Text>
        <Text style={styles.levelText}>Level {level} — {getLevelTitle(level)}</Text>
        <TouchableOpacity onPress={() => router.push('/settings')} style={styles.settingsBtn}>
          <Ionicons name="settings-outline" size={24} color="rgba(255,255,255,0.8)" />
        </TouchableOpacity>
      </LinearGradient>

      <View style={styles.content}>
        <Card variant="elevated" style={styles.xpCard}>
          <XPBar totalXP={store.totalXP} />
        </Card>

        {/* Stats Grid */}
        <Text style={styles.sectionTitle}>Statistics</Text>
        <View style={styles.statsGrid}>
          {[
            { value: store.totalXP.toLocaleString(), label: 'Total XP', icon: 'star', color: colors.secondary },
            { value: store.currentStreak.toString(), label: 'Day Streak', icon: 'flame', color: colors.warning },
            { value: store.learnedCharacters.length.toString(), label: 'Characters', icon: 'text', color: colors.primaryLight },
            { value: store.learnedWords.length.toString(), label: 'Words', icon: 'book', color: colors.accent },
            { value: store.quizHistory.length.toString(), label: 'Quizzes', icon: 'game-controller', color: colors.primaryDark },
            { value: store.longestStreak.toString(), label: 'Best Streak', icon: 'trophy', color: colors.koreanRed },
          ].map((stat) => (
            <Card key={stat.label} style={styles.statCard}>
              <Ionicons name={stat.icon as any} size={20} color={stat.color} />
              <Text style={[styles.statValue, { color: stat.color }]}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </Card>
          ))}
        </View>

        {/* Achievements */}
        <Text style={styles.sectionTitle}>Achievements</Text>
        <View style={styles.achievementsGrid}>
          {achievements.map((ach) => {
            const unlocked = store.unlockedAchievements.includes(ach.id) || newlyUnlocked.includes(ach.id);

            return (
              <Card key={ach.id} style={[styles.achCard, !unlocked ? styles.achLocked : undefined]}>
                <Ionicons name={ach.icon as any} size={24} color={unlocked ? colors.secondary : colors.textTertiary} />
                <Text style={[styles.achTitle, !unlocked && styles.achLockedText]}>{ach.title}</Text>
                <Text style={styles.achDesc}>{ach.description}</Text>
              </Card>
            );
          })}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    paddingBottom: spacing.xxxl + spacing.lg,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
    borderBottomLeftRadius: borderRadius.xxl,
    borderBottomRightRadius: borderRadius.xxl,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  avatarText: { fontSize: 36, fontWeight: '700', color: '#fff' },
  name: { ...typography.title, color: '#fff', marginTop: spacing.md },
  levelText: { ...typography.subhead, color: 'rgba(255,255,255,0.7)' },
  settingsBtn: { position: 'absolute', top: 60, right: spacing.xl },
  content: { paddingHorizontal: spacing.xl, marginTop: -spacing.xl, gap: spacing.lg },
  xpCard: { padding: spacing.lg },
  sectionTitle: { ...typography.title3, color: colors.textPrimary, marginTop: spacing.sm },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  statCard: { width: '30%' as any, alignItems: 'center', padding: spacing.md, gap: spacing.xs },
  statValue: { ...typography.title3 },
  statLabel: { ...typography.caption, color: colors.textTertiary, fontSize: 10 },
  achievementsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  achCard: { width: '47%' as any, alignItems: 'center', padding: spacing.md, gap: spacing.xs },
  achLocked: { opacity: 0.4 },
  achTitle: { ...typography.captionBold, color: colors.textPrimary, textAlign: 'center' },
  achLockedText: { color: colors.textTertiary },
  achDesc: { ...typography.caption, color: colors.textTertiary, textAlign: 'center', fontSize: 10 },
});

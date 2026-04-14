import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, borderRadius, spacing, shadows } from '@/lib/theme';
import { useAppStore } from '@/lib/store';
import { audioLessonSeries, getTotalAudioEpisodes } from '@/data/audioLessons';

export default function AudioLessonsIndexScreen() {
  const insets = useSafeAreaInsets();
  const { completedLessons } = useAppStore();

  const totalEpisodes = getTotalAudioEpisodes();
  const completedCount = audioLessonSeries.reduce(
    (sum, series) => sum + series.episodes.filter(ep => completedLessons[`audio_${ep.id}`]).length,
    0
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: insets.bottom + 32 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <LinearGradient
        colors={['#6366f1', '#8b5cf6', '#a78bfa']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.header, { paddingTop: insets.top + 16 }]}
      >
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerIconWrap}>
          <Ionicons name="headset" size={40} color="#fff" />
        </View>
        <Text style={styles.headerTitle}>Audio Lessons</Text>
        <Text style={styles.headerKorean}>오디오 수업</Text>
        <Text style={styles.headerDesc}>
          Listen and learn like a podcast. Perfect for commutes, walks, or relaxing.
        </Text>
        <View style={styles.statRow}>
          <View style={styles.statPill}>
            <Ionicons name="headset-outline" size={14} color="#fff" />
            <Text style={styles.statText}>{totalEpisodes} episodes</Text>
          </View>
          <View style={styles.statPill}>
            <Ionicons name="checkmark-circle-outline" size={14} color="#fff" />
            <Text style={styles.statText}>{completedCount} completed</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Series List */}
      <View style={styles.content}>
        {audioLessonSeries.map((series) => {
          const seriesCompleted = series.episodes.filter(ep => completedLessons[`audio_${ep.id}`]).length;
          return (
            <TouchableOpacity
              key={series.id}
              onPress={() => router.push(`/lesson/audio/${series.id}` as any)}
              activeOpacity={0.8}
            >
              <View style={styles.seriesCard}>
                <LinearGradient
                  colors={series.gradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.seriesGradient}
                >
                  <View style={styles.seriesIconWrap}>
                    <Ionicons name={series.icon as any} size={28} color="#fff" />
                  </View>
                  <View style={styles.seriesInfo}>
                    <Text style={styles.seriesTitle}>{series.title}</Text>
                    <Text style={styles.seriesTitleKorean}>{series.titleKorean}</Text>
                    <Text style={styles.seriesDesc} numberOfLines={2}>{series.description}</Text>
                    <View style={styles.seriesMeta}>
                      <Ionicons name="musical-notes-outline" size={12} color="rgba(255,255,255,0.8)" />
                      <Text style={styles.seriesMetaText}>
                        {series.episodes.length} episodes
                      </Text>
                      {seriesCompleted > 0 && (
                        <>
                          <Ionicons name="checkmark-circle" size={12} color="rgba(255,255,255,0.8)" />
                          <Text style={styles.seriesMetaText}>
                            {seriesCompleted}/{series.episodes.length}
                          </Text>
                        </>
                      )}
                    </View>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.6)" />
                </LinearGradient>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Tips */}
      <View style={styles.tipCard}>
        <Ionicons name="bulb-outline" size={20} color="#f59e0b" />
        <View style={{ flex: 1 }}>
          <Text style={styles.tipTitle}>Tips for Audio Lessons</Text>
          <Text style={styles.tipText}>
            Listen actively and repeat phrases out loud. You can pause anytime to practice pronunciation. These lessons work great during commutes or walks.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    padding: 24,
    paddingBottom: 32,
    gap: 4,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  headerIconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: 'Jakarta-ExtraBold',
    color: '#fff',
  },
  headerKorean: {
    fontSize: 14,
    fontFamily: 'Jakarta-Medium',
    color: 'rgba(255,255,255,0.7)',
  },
  headerDesc: {
    fontSize: 14,
    fontFamily: 'Jakarta-Regular',
    color: 'rgba(255,255,255,0.85)',
    marginTop: 4,
    lineHeight: 20,
  },
  statRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  statPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: borderRadius.full,
  },
  statText: {
    fontSize: 12,
    fontFamily: 'Jakarta-SemiBold',
    color: '#fff',
  },
  content: {
    padding: 20,
    gap: 14,
  },
  seriesCard: {
    borderRadius: borderRadius.xxl,
    overflow: 'hidden',
    ...shadows.md,
  },
  seriesGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    gap: 14,
  },
  seriesIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  seriesInfo: {
    flex: 1,
    gap: 2,
  },
  seriesTitle: {
    fontSize: 17,
    fontFamily: 'Jakarta-Bold',
    color: '#fff',
  },
  seriesTitleKorean: {
    fontSize: 11,
    fontFamily: 'Jakarta-Medium',
    color: 'rgba(255,255,255,0.6)',
  },
  seriesDesc: {
    fontSize: 12,
    fontFamily: 'Jakarta-Regular',
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  seriesMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
  },
  seriesMetaText: {
    fontSize: 11,
    fontFamily: 'Jakarta-SemiBold',
    color: 'rgba(255,255,255,0.8)',
  },
  tipCard: {
    marginHorizontal: 20,
    marginTop: 4,
    marginBottom: 20,
    flexDirection: 'row',
    gap: 12,
    padding: 16,
    backgroundColor: '#fffbeb',
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: '#fef3c7',
  },
  tipTitle: {
    fontSize: 14,
    fontFamily: 'Jakarta-Bold',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  tipText: {
    fontSize: 12,
    fontFamily: 'Jakarta-Regular',
    color: colors.textSecondary,
    lineHeight: 18,
  },
});

import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, borderRadius, spacing, shadows } from '@/lib/theme';
import { useAppStore } from '@/lib/store';
import { audioLessonSeries } from '@/data/audioLessons';

export default function AudioSeriesScreen() {
  const { seriesId } = useLocalSearchParams<{ seriesId: string }>();
  const insets = useSafeAreaInsets();
  const { completedLessons } = useAppStore();

  const series = audioLessonSeries.find(s => s.id === seriesId);
  if (!series) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={styles.errorText}>Series not found</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backLink}>Go back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const completedCount = series.episodes.filter(ep => completedLessons[`audio_${ep.id}`]).length;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: insets.bottom + 32 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <LinearGradient
        colors={series.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.header, { paddingTop: insets.top + 16 }]}
      >
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerIconWrap}>
          <Ionicons name={series.icon as any} size={36} color="#fff" />
        </View>
        <Text style={styles.headerTitle}>{series.title}</Text>
        <Text style={styles.headerKorean}>{series.titleKorean}</Text>
        <Text style={styles.headerDesc}>{series.description}</Text>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${series.episodes.length > 0 ? (completedCount / series.episodes.length) * 100 : 0}%` },
            ]}
          />
        </View>
        <Text style={styles.progressLabel}>
          {completedCount}/{series.episodes.length} episodes completed
        </Text>
      </LinearGradient>

      {/* Episode List */}
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Episodes</Text>
        {series.episodes.map((episode, index) => {
          const isCompleted = completedLessons[`audio_${episode.id}`];
          return (
            <TouchableOpacity
              key={episode.id}
              onPress={() =>
                router.push({
                  pathname: '/lesson/audio/player' as any,
                  params: { seriesId: series.id, episodeId: episode.id },
                })
              }
              activeOpacity={0.7}
            >
              <View style={[styles.episodeCard, isCompleted && styles.episodeCardCompleted]}>
                <View style={[styles.episodeNumber, { backgroundColor: series.color + '18' }]}>
                  {isCompleted ? (
                    <Ionicons name="checkmark-circle" size={24} color={series.color} />
                  ) : (
                    <Text style={[styles.episodeNumberText, { color: series.color }]}>
                      {index + 1}
                    </Text>
                  )}
                </View>
                <View style={styles.episodeInfo}>
                  <Text style={styles.episodeTitle}>{episode.title}</Text>
                  <Text style={styles.episodeTitleKorean}>{episode.titleKorean}</Text>
                  <Text style={styles.episodeDesc} numberOfLines={1}>{episode.description}</Text>
                  <View style={styles.episodeMeta}>
                    <Ionicons name="time-outline" size={12} color={colors.textTertiary} />
                    <Text style={styles.episodeMetaText}>~{episode.durationMinutes} min</Text>
                    <Ionicons name="list-outline" size={12} color={colors.textTertiary} />
                    <Text style={styles.episodeMetaText}>{episode.segments.length} segments</Text>
                  </View>
                </View>
                <View style={[styles.playBtn, { backgroundColor: series.color }]}>
                  <Ionicons name="play" size={16} color="#fff" />
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    padding: 24,
    paddingBottom: 28,
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
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 26,
    fontFamily: 'Jakarta-ExtraBold',
    color: '#fff',
  },
  headerKorean: {
    fontSize: 14,
    fontFamily: 'Jakarta-Medium',
    color: 'rgba(255,255,255,0.65)',
  },
  headerDesc: {
    fontSize: 14,
    fontFamily: 'Jakarta-Regular',
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 20,
    marginTop: 4,
  },
  progressBar: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 3,
    marginTop: 16,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 3,
  },
  progressLabel: {
    fontSize: 12,
    fontFamily: 'Jakarta-SemiBold',
    color: 'rgba(255,255,255,0.8)',
    marginTop: 6,
  },
  content: {
    padding: 20,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Jakarta-Bold',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  episodeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: 16,
    gap: 14,
    ...shadows.sm,
  },
  episodeCardCompleted: {
    backgroundColor: colors.successLight,
  },
  episodeNumber: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  episodeNumberText: {
    fontSize: 18,
    fontFamily: 'Jakarta-ExtraBold',
  },
  episodeInfo: {
    flex: 1,
    gap: 1,
  },
  episodeTitle: {
    fontSize: 15,
    fontFamily: 'Jakarta-Bold',
    color: colors.textPrimary,
  },
  episodeTitleKorean: {
    fontSize: 12,
    fontFamily: 'Jakarta-Regular',
    color: colors.textTertiary,
  },
  episodeDesc: {
    fontSize: 12,
    fontFamily: 'Jakarta-Regular',
    color: colors.textSecondary,
    marginTop: 2,
  },
  episodeMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  episodeMetaText: {
    fontSize: 11,
    fontFamily: 'Jakarta-Medium',
    color: colors.textTertiary,
    marginRight: 8,
  },
  playBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontSize: 16,
    fontFamily: 'Jakarta-Medium',
    color: colors.textSecondary,
  },
  backLink: {
    fontSize: 14,
    fontFamily: 'Jakarta-Bold',
    color: colors.accent,
    marginTop: 8,
  },
});

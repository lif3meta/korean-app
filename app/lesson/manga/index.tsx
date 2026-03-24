import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, borderRadius, spacing, typography, shadows } from '@/lib/theme';
import { mangaSeries } from '@/data/manga';
import type { MangaSeries } from '@/data/manga';

const levelLabels: Record<number, string> = {
  1: 'Beginner',
  2: 'Elementary',
  3: 'Intermediate',
  4: 'Upper-Int',
  5: 'Advanced',
};

const levelColors: Record<number, string> = {
  1: '#00E676',
  2: '#00E5FF',
  3: '#FFD740',
  4: '#FF9100',
  5: '#FF5252',
};

const chapterGradients: Record<number, readonly [string, string]> = {
  1: ['#7C4DFF', '#AA00FF'],
  2: ['#E040FB', '#AA00FF'],
  3: ['#FF6090', '#E040FB'],
  4: ['#FF9100', '#FF5252'],
  5: ['#FF5252', '#D32F2F'],
};

const seriesGradients: readonly (readonly [string, string])[] = [
  ['#E040FB', '#AA00FF'],
  ['#3D5AFE', '#1A237E'],
  ['#FF8A65', '#D84315'],
  ['#00E5FF', '#0091EA'],
];

const genreIcons: Record<string, string> = {
  Romance: 'heart',
  Mystery: 'search',
  'Slice of Life': 'cafe',
  'Music/Drama': 'musical-notes',
};

function getCoverUrl(series: MangaSeries): string {
  const styleMap: Record<string, string> = {
    'seoul-love-story':
      'manga anime style cover art, Seoul Love Story, Korean high school romance, cherry blossoms, two students, pastel colors, webtoon style cover',
    'the-detective':
      'dark moody manga style cover art, student detective in dark school hallway, magnifying glass, mysterious shadows, noir atmosphere, thriller cover',
    'cafe-dreams':
      'warm cozy manga style cover art, cute Korean cafe interior, coffee cups, warm lighting, plants, pastries, inviting slice of life cover',
    'kpop-star':
      'colorful energetic manga style cover art, K-pop audition stage, spotlights, microphone, dance pose, neon colors, vibrant idol cover',
  };
  const prompt = styleMap[series.id] || series.chapters[0]?.panels[0]?.imagePrompt || '';
  return `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=800&height=400&model=flux&seed=42&nologo=true`;
}

export default function MangaSeriesScreen() {
  const [selectedSeriesId, setSelectedSeriesId] = useState<string | null>(null);

  const selectedSeries = selectedSeriesId
    ? mangaSeries.find((s) => s.id === selectedSeriesId) || null
    : null;

  const isChapterUnlocked = (index: number) => {
    return index === 0;
  };

  if (selectedSeries) {
    return (
      <SeriesDetailView
        series={selectedSeries}
        isChapterUnlocked={isChapterUnlocked}
        onBack={() => setSelectedSeriesId(null)}
      />
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 100 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.headerSection}>
        <Text style={styles.pageTitle}>Manga Stories</Text>
        <Text style={styles.pageSubtitle}>
          {mangaSeries.length} series available -- Learn Korean through comics
        </Text>
      </View>

      <View style={styles.seriesGrid}>
        {mangaSeries.map((series, index) => {
          const gradient = seriesGradients[index % seriesGradients.length];
          const iconName = genreIcons[series.genre] || 'book';
          const coverUrl = getCoverUrl(series);

          return (
            <TouchableOpacity
              key={series.id}
              activeOpacity={0.85}
              onPress={() => setSelectedSeriesId(series.id)}
            >
              <View style={styles.seriesCard}>
                <Image
                  source={{ uri: coverUrl }}
                  style={styles.seriesCardImage}
                  resizeMode="cover"
                />
                <LinearGradient
                  colors={['transparent', 'rgba(0, 0, 0, 0.85)']}
                  style={styles.seriesCardOverlay}
                >
                  <View style={styles.seriesCardBadgeRow}>
                    <View
                      style={[
                        styles.seriesGenreBadge,
                        { backgroundColor: gradient[0] + '40' },
                      ]}
                    >
                      <Ionicons
                        name={iconName as any}
                        size={12}
                        color={gradient[0]}
                      />
                      <Text style={[styles.seriesGenreText, { color: gradient[0] }]}>
                        {series.genre}
                      </Text>
                    </View>
                    <View style={styles.chapterCountBadge}>
                      <Ionicons
                        name="layers-outline"
                        size={11}
                        color="rgba(255,255,255,0.7)"
                      />
                      <Text style={styles.chapterCountText}>
                        {series.chapters.length} ch
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.seriesCardTitle}>{series.title}</Text>
                  <Text style={styles.seriesCardKorean}>{series.titleKorean}</Text>
                  <Text style={styles.seriesCardDesc} numberOfLines={2}>
                    {series.description}
                  </Text>
                </LinearGradient>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.tipBox}>
        <Ionicons name="bulb-outline" size={20} color={colors.secondary} />
        <Text style={styles.tipText}>
          Tap any Korean word while reading to see its English translation
        </Text>
      </View>
    </ScrollView>
  );
}

function SeriesDetailView({
  series,
  isChapterUnlocked,
  onBack,
}: {
  series: MangaSeries;
  isChapterUnlocked: (index: number) => boolean;
  onBack: () => void;
}) {
  const coverUrl = getCoverUrl(series);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 100 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.coverContainer}>
        <Image
          source={{ uri: coverUrl }}
          style={styles.coverImage}
          resizeMode="cover"
        />
        <LinearGradient
          colors={['transparent', 'rgba(26, 10, 46, 0.95)']}
          style={styles.coverOverlay}
        >
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={22} color="#fff" />
            <Text style={styles.backButtonText}>All Series</Text>
          </TouchableOpacity>
          <View style={styles.genreBadge}>
            <Text style={styles.genreText}>{series.genre}</Text>
          </View>
          <Text style={styles.seriesTitle}>{series.title}</Text>
          <Text style={styles.seriesTitleKorean}>{series.titleKorean}</Text>
          <Text style={styles.seriesDesc}>{series.description}</Text>
        </LinearGradient>
      </View>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Chapters</Text>
        <Text style={styles.sectionSub}>
          {series.chapters.length} chapters available
        </Text>

        <View style={styles.chapterList}>
          {series.chapters.map((chapter, index) => {
            const unlocked = isChapterUnlocked(index);
            const gradient =
              chapterGradients[chapter.level] || chapterGradients[1];

            return (
              <TouchableOpacity
                key={chapter.id}
                activeOpacity={unlocked ? 0.8 : 1}
                onPress={() => {
                  if (unlocked) {
                    router.push(`/lesson/manga/${chapter.id}` as any);
                  }
                }}
              >
                <View
                  style={[styles.chapterCard, !unlocked && styles.lockedCard]}
                >
                  <LinearGradient
                    colors={
                      unlocked
                        ? gradient
                        : (['#6B5B7B', '#4A3A5C'] as const)
                    }
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.chapterGradient}
                  >
                    <View style={styles.chapterHeader}>
                      <View style={styles.chapterNumber}>
                        <Text style={styles.chapterNumberText}>
                          {index + 1}
                        </Text>
                      </View>
                      <View style={styles.chapterInfo}>
                        <Text style={styles.chapterTitle}>
                          {chapter.title}
                        </Text>
                        <Text style={styles.chapterKorean}>
                          {chapter.titleKorean}
                        </Text>
                      </View>
                      <View style={styles.chapterRight}>
                        <View
                          style={[
                            styles.levelBadge,
                            {
                              backgroundColor: unlocked
                                ? levelColors[chapter.level] + '30'
                                : 'rgba(255,255,255,0.15)',
                            },
                          ]}
                        >
                          <Text
                            style={[
                              styles.levelText,
                              {
                                color: unlocked
                                  ? levelColors[chapter.level]
                                  : 'rgba(255,255,255,0.5)',
                              },
                            ]}
                          >
                            Lv.{chapter.level}
                          </Text>
                        </View>
                        {!unlocked && (
                          <Ionicons
                            name="lock-closed"
                            size={18}
                            color="rgba(255,255,255,0.5)"
                          />
                        )}
                      </View>
                    </View>
                    <Text style={styles.chapterDesc}>
                      {chapter.description}
                    </Text>
                    <View style={styles.chapterFooter}>
                      <View style={styles.panelCount}>
                        <Ionicons
                          name="images-outline"
                          size={14}
                          color="rgba(255,255,255,0.7)"
                        />
                        <Text style={styles.panelCountText}>
                          {chapter.panels.length} panels
                        </Text>
                      </View>
                      <Text style={styles.levelLabel}>
                        {levelLabels[chapter.level]}
                      </Text>
                    </View>
                  </LinearGradient>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.tipBox}>
          <Ionicons name="bulb-outline" size={20} color={colors.secondary} />
          <Text style={styles.tipText}>
            Tap any Korean word while reading to see its English translation
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.darkBg,
  },
  headerSection: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xxl + spacing.lg,
    paddingBottom: spacing.lg,
  },
  pageTitle: {
    fontFamily: 'Poppins-ExtraBold',
    fontSize: 28,
    color: '#fff',
  },
  pageSubtitle: {
    fontFamily: 'Poppins-Regular',
    fontSize: 13,
    color: 'rgba(255,255,255,0.5)',
    marginTop: spacing.xs,
  },
  seriesGrid: {
    paddingHorizontal: spacing.xl,
    gap: spacing.lg,
  },
  seriesCard: {
    height: 200,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    ...shadows.md,
  },
  seriesCardImage: {
    width: '100%',
    height: '100%',
  },
  seriesCardOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    paddingTop: 60,
  },
  seriesCardBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  seriesGenreBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: borderRadius.full,
  },
  seriesGenreText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  chapterCountBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: borderRadius.full,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  chapterCountText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 10,
    color: 'rgba(255,255,255,0.7)',
  },
  seriesCardTitle: {
    fontFamily: 'Poppins-ExtraBold',
    fontSize: 20,
    color: '#fff',
    lineHeight: 26,
  },
  seriesCardKorean: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
    marginBottom: spacing.xs,
  },
  seriesCardDesc: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: 'rgba(255,255,255,0.65)',
    lineHeight: 17,
  },
  coverContainer: {
    height: 280,
    position: 'relative',
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  coverOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
    paddingTop: 80,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.md,
  },
  backButtonText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    color: '#fff',
  },
  genreBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primary + '30',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    marginBottom: spacing.sm,
  },
  genreText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 11,
    color: colors.primaryLight,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  seriesTitle: {
    fontFamily: 'Poppins-ExtraBold',
    fontSize: 28,
    color: '#fff',
    lineHeight: 34,
  },
  seriesTitleKorean: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: 'rgba(255,255,255,0.5)',
    marginBottom: spacing.sm,
  },
  seriesDesc: {
    fontFamily: 'Poppins-Regular',
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
    lineHeight: 19,
  },
  content: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
  },
  sectionTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 20,
    color: '#fff',
  },
  sectionSub: {
    fontFamily: 'Poppins-Regular',
    fontSize: 13,
    color: 'rgba(255,255,255,0.5)',
    marginBottom: spacing.lg,
  },
  chapterList: {
    gap: spacing.lg,
  },
  chapterCard: {
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    ...shadows.md,
  },
  lockedCard: {
    opacity: 0.6,
  },
  chapterGradient: {
    padding: spacing.lg,
    gap: spacing.sm,
  },
  chapterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  chapterNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chapterNumberText: {
    fontFamily: 'Poppins-ExtraBold',
    fontSize: 18,
    color: '#fff',
  },
  chapterInfo: {
    flex: 1,
  },
  chapterTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 17,
    color: '#fff',
  },
  chapterKorean: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
  },
  chapterRight: {
    alignItems: 'flex-end',
    gap: spacing.xs,
  },
  levelBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  levelText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 11,
  },
  chapterDesc: {
    fontFamily: 'Poppins-Regular',
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    lineHeight: 19,
  },
  chapterFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
  },
  panelCount: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  panelCountText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
  },
  levelLabel: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 11,
    color: 'rgba(255,255,255,0.6)',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  tipBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: 'rgba(255, 215, 64, 0.1)',
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginTop: spacing.xxl,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 64, 0.2)',
  },
  tipText: {
    flex: 1,
    fontFamily: 'Poppins-Medium',
    fontSize: 13,
    color: colors.secondary,
    lineHeight: 19,
  },
});

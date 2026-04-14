import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Linking, Modal, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { WebView } from 'react-native-webview';
import { colors, borderRadius, spacing, shadows } from '@/lib/theme';
import { videos, videoCategories, categoryLabels } from '@/data/videos';
import type { VideoResource } from '@/data/videos';

const levelColors: Record<string, { bg: string; text: string }> = {
  beginner: { bg: colors.successBg, text: colors.success },
  intermediate: { bg: colors.warningLight, text: colors.warning },
  advanced: { bg: colors.dangerBg, text: colors.danger },
};

export default function VideosScreen() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [playingVideo, setPlayingVideo] = useState<VideoResource | null>(null);

  const filtered =
    activeCategory === 'all'
      ? videos
      : videos.filter((v) => v.category === activeCategory);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 100 }}>
        <Text style={styles.title}>Watch & Learn</Text>
        <Text style={styles.subtitle}>보고 배우기</Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsScroll} contentContainerStyle={styles.tabsWrap}>
          <TouchableOpacity
            onPress={() => setActiveCategory('all')}
            style={[styles.tab, activeCategory === 'all' && styles.tabActive]}
          >
            <Text style={[styles.tabText, activeCategory === 'all' && styles.tabTextActive]}>All</Text>
          </TouchableOpacity>
          {videoCategories.map((cat) => (
            <TouchableOpacity
              key={cat}
              onPress={() => setActiveCategory(cat)}
              style={[styles.tab, activeCategory === cat && styles.tabActive]}
            >
              <Text style={[styles.tabText, activeCategory === cat && styles.tabTextActive]}>
                {categoryLabels[cat]}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={styles.countText}>{filtered.length} videos</Text>

        {filtered.map((video) => (
          <VideoCard key={video.id} video={video} onPress={() => setPlayingVideo(video)} />
        ))}
      </ScrollView>

      {/* Inline Video Player Modal */}
      {playingVideo && (
        <Modal animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setPlayingVideo(null)}>
          <SafeAreaView style={styles.playerContainer}>
            <View style={styles.playerHeader}>
              <TouchableOpacity onPress={() => setPlayingVideo(null)} style={styles.closeBtn}>
                <Ionicons name="chevron-down" size={24} color={colors.textPrimary} />
              </TouchableOpacity>
              <Text style={styles.playerTitle} numberOfLines={1}>{playingVideo.title}</Text>
              <TouchableOpacity
                onPress={() => {
                  Linking.openURL(`https://youtube.com/watch?v=${playingVideo.youtubeId}`);
                }}
                style={styles.ytBtn}
              >
                <Ionicons name="logo-youtube" size={20} color="#FF0000" />
              </TouchableOpacity>
            </View>

            <View style={styles.webviewWrap}>
              <WebView
                source={{ uri: `https://www.youtube.com/embed/${playingVideo.youtubeId}?autoplay=1&rel=0&modestbranding=1&playsinline=1` }}
                allowsFullscreenVideo
                allowsInlineMediaPlayback
                mediaPlaybackRequiresUserAction={false}
                style={styles.webview}
              />
            </View>

            <ScrollView style={styles.playerInfo} contentContainerStyle={{ paddingBottom: 40 }}>
              <Text style={styles.playerVideoTitle}>{playingVideo.title}</Text>
              {playingVideo.titleKorean && (
                <Text style={styles.playerTitleKorean}>{playingVideo.titleKorean}</Text>
              )}
              <View style={styles.playerMeta}>
                <Ionicons name="logo-youtube" size={14} color="#FF0000" />
                <Text style={styles.playerChannel}>{playingVideo.channel}</Text>
                <Text style={styles.playerDuration}>{playingVideo.duration}</Text>
              </View>
              <Text style={styles.playerDesc}>{playingVideo.description}</Text>

              <TouchableOpacity
                onPress={() => Linking.openURL(`https://youtube.com/watch?v=${playingVideo.youtubeId}`)}
                style={styles.openYtBtn}
              >
                <Ionicons name="open-outline" size={16} color={colors.primary} />
                <Text style={styles.openYtText}>Open in YouTube (background play)</Text>
              </TouchableOpacity>
            </ScrollView>
          </SafeAreaView>
        </Modal>
      )}
    </View>
  );
}

function VideoCard({ video, onPress }: { video: VideoResource; onPress: () => void }) {
  const level = levelColors[video.level];
  const [thumbError, setThumbError] = React.useState(false);

  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onPress} style={styles.card}>
      <View style={styles.thumbnailContainer}>
        {thumbError ? (
          <View style={styles.thumbnailFallback}>
            <Ionicons name="logo-youtube" size={48} color="rgba(255,255,255,0.6)" />
            <Text style={styles.thumbnailFallbackText}>{video.channel}</Text>
          </View>
        ) : (
          <Image
            source={{ uri: `https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg` }}
            style={styles.thumbnail}
            resizeMode="cover"
            onError={() => setThumbError(true)}
          />
        )}
        <View style={styles.durationBadge}>
          <Text style={styles.durationText}>{video.duration}</Text>
        </View>
        <View style={styles.playOverlay}>
          <Ionicons name="play-circle" size={48} color="rgba(255,255,255,0.9)" />
        </View>
      </View>
      <View style={styles.cardBody}>
        <Text style={styles.videoTitle} numberOfLines={2}>{video.title}</Text>
        {video.titleKorean && (
          <Text style={styles.videoTitleKorean} numberOfLines={1}>{video.titleKorean}</Text>
        )}
        <View style={styles.metaRow}>
          <Ionicons name="logo-youtube" size={14} color={colors.danger} />
          <Text style={styles.channelText} numberOfLines={1}>{video.channel}</Text>
        </View>
        <View style={styles.badgeRow}>
          <View style={[styles.levelBadge, { backgroundColor: level.bg }]}>
            <Text style={[styles.levelText, { color: level.text }]}>{video.level}</Text>
          </View>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryBadgeText}>{categoryLabels[video.category]}</Text>
          </View>
        </View>
        <Text style={styles.descriptionText} numberOfLines={2}>{video.description}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.xl },
  title: { fontSize: 24, fontFamily: 'Poppins-Bold', color: colors.textPrimary },
  subtitle: { fontSize: 13, fontFamily: 'Poppins-Regular', color: colors.textTertiary, marginBottom: spacing.md },
  tabsScroll: { marginBottom: spacing.md },
  tabsWrap: { gap: spacing.sm, paddingRight: spacing.lg },
  tab: {
    paddingHorizontal: spacing.md, paddingVertical: 6, borderRadius: borderRadius.full,
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.borderLight,
  },
  tabActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  tabText: { fontFamily: 'Poppins-SemiBold', fontSize: 12, color: colors.textSecondary, textAlign: 'center' },
  tabTextActive: { color: '#fff' },
  countText: { fontFamily: 'Poppins-Medium', fontSize: 13, color: colors.textTertiary, marginBottom: spacing.md },
  card: {
    backgroundColor: colors.surface, borderRadius: borderRadius.xl, marginBottom: spacing.lg,
    ...shadows.sm, borderWidth: 1, borderColor: colors.borderLight, overflow: 'hidden',
  },
  thumbnailContainer: { width: '100%', aspectRatio: 16 / 9, overflow: 'hidden', position: 'relative' },
  thumbnail: { width: '100%', height: '100%' },
  thumbnailFallback: { width: '100%', height: '100%', backgroundColor: '#CC0000', alignItems: 'center', justifyContent: 'center', gap: spacing.xs },
  thumbnailFallbackText: { fontFamily: 'Poppins-SemiBold', fontSize: 12, color: 'rgba(255,255,255,0.8)' },
  durationBadge: {
    position: 'absolute', bottom: spacing.sm, right: spacing.sm,
    backgroundColor: 'rgba(0,0,0,0.75)', paddingHorizontal: spacing.sm, paddingVertical: 3, borderRadius: borderRadius.sm,
  },
  durationText: { fontFamily: 'Poppins-SemiBold', fontSize: 11, color: '#fff' },
  playOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' },
  cardBody: { padding: spacing.lg, gap: 4 },
  videoTitle: { fontSize: 15, fontFamily: 'Poppins-SemiBold', color: colors.textPrimary, lineHeight: 21 },
  videoTitleKorean: { fontSize: 12, fontFamily: 'Poppins-Medium', color: colors.textTertiary },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginTop: 2 },
  channelText: { fontFamily: 'Poppins-Medium', fontSize: 12, color: colors.textSecondary, flexShrink: 1 },
  badgeRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: spacing.xs },
  levelBadge: { paddingHorizontal: spacing.sm, paddingVertical: 3, borderRadius: borderRadius.full },
  levelText: { fontFamily: 'Poppins-Bold', fontSize: 10, textTransform: 'capitalize' },
  categoryBadge: { paddingHorizontal: spacing.sm, paddingVertical: 3, borderRadius: borderRadius.full, backgroundColor: colors.primaryFaint },
  categoryBadgeText: { fontFamily: 'Poppins-SemiBold', fontSize: 10, color: colors.primaryDark },
  descriptionText: { fontFamily: 'Poppins-Regular', fontSize: 12, color: colors.textSecondary, lineHeight: 18, marginTop: 2 },

  // Player modal
  playerContainer: { flex: 1, backgroundColor: colors.background },
  playerHeader: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm, gap: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.borderLight,
  },
  closeBtn: { padding: spacing.xs },
  playerTitle: { flex: 1, fontFamily: 'Poppins-SemiBold', fontSize: 14, color: colors.textPrimary },
  ytBtn: { padding: spacing.xs },
  webviewWrap: { width: '100%', aspectRatio: 16 / 9, backgroundColor: '#000' },
  webview: { flex: 1 },
  playerInfo: { flex: 1, padding: spacing.lg },
  playerVideoTitle: { fontSize: 17, fontFamily: 'Poppins-Bold', color: colors.textPrimary, lineHeight: 24 },
  playerTitleKorean: { fontSize: 13, fontFamily: 'Poppins-Medium', color: colors.textTertiary, marginTop: 2 },
  playerMeta: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: spacing.sm },
  playerChannel: { fontFamily: 'Poppins-Medium', fontSize: 13, color: colors.textSecondary },
  playerDuration: { fontFamily: 'Poppins-Regular', fontSize: 12, color: colors.textTertiary },
  playerDesc: { fontFamily: 'Poppins-Regular', fontSize: 13, color: colors.textSecondary, lineHeight: 20, marginTop: spacing.md },
  openYtBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.xs,
    marginTop: spacing.xl, paddingVertical: 12, borderRadius: borderRadius.full,
    backgroundColor: colors.primaryFaint,
  },
  openYtText: { fontFamily: 'Poppins-SemiBold', fontSize: 13, color: colors.primary },
});

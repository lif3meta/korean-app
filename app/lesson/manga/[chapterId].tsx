import React, { useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Pressable,
  Dimensions,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, borderRadius, spacing, shadows } from '@/lib/theme';
import { mangaSeries } from '@/data/manga';
import type { MangaPanel, MangaDialogue } from '@/data/manga';
import { speakKorean } from '@/lib/audio';
import { CachedImage } from '@/components/common/CachedImage';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const PANEL_WIDTH = SCREEN_WIDTH - spacing.xl * 2;

export default function MangaReaderScreen() {
  const { chapterId } = useLocalSearchParams<{ chapterId: string }>();
  const [tooltipData, setTooltipData] = useState<{
    korean: string;
    english: string;
    x: number;
    y: number;
  } | null>(null);
  const scrollRef = useRef<ScrollView>(null);

  let chapter = null;
  for (const series of mangaSeries) {
    const found = series.chapters.find((c) => c.id === chapterId);
    if (found) {
      chapter = found;
      break;
    }
  }

  const handleWordTap = useCallback(
    (korean: string, english: string, event: any) => {
      const { pageX, pageY } = event.nativeEvent;
      setTooltipData({ korean, english, x: pageX, y: pageY });
      speakKorean(korean);
    },
    []
  );

  const dismissTooltip = useCallback(() => {
    setTooltipData(null);
  }, []);

  const handleSpeakLine = useCallback((korean: string) => {
    speakKorean(korean);
  }, []);

  if (!chapter) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Chapter not found</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollRef}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Chapter Header */}
        <View style={styles.chapterHeader}>
          <Text style={styles.chapterTitle}>{chapter.title}</Text>
          <Text style={styles.chapterKorean}>{chapter.titleKorean}</Text>
          <View style={styles.levelRow}>
            <View style={styles.levelPill}>
              <Text style={styles.levelPillText}>Level {chapter.level}</Text>
            </View>
            <Text style={styles.panelInfo}>
              {chapter.panels.length} panels
            </Text>
          </View>
        </View>

        {/* Panels */}
        {chapter.panels.map((panel, panelIndex) => (
          <PanelView
            key={panel.id}
            panel={panel}
            panelIndex={panelIndex}
            seed={panelIndex * 100 + 42}
            onWordTap={handleWordTap}
            onSpeakLine={handleSpeakLine}
          />
        ))}

        {/* End of Chapter */}
        <View style={styles.endCard}>
          <Ionicons
            name="bookmark"
            size={32}
            color={colors.primary}
          />
          <Text style={styles.endTitle}>End of Chapter</Text>
          <Text style={styles.endSub}>
            {chapter.title} - {chapter.titleKorean}
          </Text>
          <TouchableOpacity
            style={styles.endButton}
            onPress={() => router.back()}
          >
            <Text style={styles.endButtonText}>Back to Stories</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Word Tooltip Modal */}
      <Modal
        visible={tooltipData !== null}
        transparent
        animationType="fade"
        onRequestClose={dismissTooltip}
      >
        <Pressable style={styles.tooltipOverlay} onPress={dismissTooltip}>
          {tooltipData && (
            <View
              style={[
                styles.tooltipBox,
                {
                  top: Math.min(tooltipData.y - 80, Dimensions.get('window').height - 140),
                  left: Math.max(
                    16,
                    Math.min(tooltipData.x - 80, SCREEN_WIDTH - 176)
                  ),
                },
              ]}
            >
              <Text style={styles.tooltipKorean}>{tooltipData.korean}</Text>
              <View style={styles.tooltipDivider} />
              <Text style={styles.tooltipEnglish}>{tooltipData.english}</Text>
              <TouchableOpacity
                style={styles.tooltipAudio}
                onPress={() => speakKorean(tooltipData.korean)}
              >
                <Ionicons
                  name="volume-medium"
                  size={16}
                  color={colors.primary}
                />
                <Text style={styles.tooltipAudioText}>Listen</Text>
              </TouchableOpacity>
            </View>
          )}
        </Pressable>
      </Modal>
    </View>
  );
}

function PanelView({
  panel,
  panelIndex,
  seed,
  onWordTap,
  onSpeakLine,
}: {
  panel: MangaPanel;
  panelIndex: number;
  seed: number;
  onWordTap: (korean: string, english: string, event: any) => void;
  onSpeakLine: (korean: string) => void;
}) {
  const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(
    panel.imagePrompt
  )}?width=800&height=600&model=flux&seed=${seed}&nologo=true`;

  return (
    <View style={styles.panelContainer}>
      {/* Panel Number */}
      <View style={styles.panelBadge}>
        <Text style={styles.panelBadgeText}>{panelIndex + 1}</Text>
      </View>

      {/* Panel Image */}
      <View style={styles.imageContainer}>
        <CachedImage uri={imageUrl} style={styles.panelImage} />
      </View>

      {/* Narration Box */}
      {panel.narration && (
        <View style={styles.narrationBox}>
          <Text style={styles.narrationKorean}>{panel.narration}</Text>
          <Text style={styles.narrationEnglish}>{panel.narrationEnglish}</Text>
        </View>
      )}

      {/* Dialogue Bubbles */}
      {panel.dialogue.map((line, lineIndex) => (
        <DialogueBubble
          key={`${panel.id}-d${lineIndex}`}
          dialogue={line}
          onWordTap={onWordTap}
          onSpeakLine={onSpeakLine}
        />
      ))}
    </View>
  );
}

function DialogueBubble({
  dialogue,
  onWordTap,
  onSpeakLine,
}: {
  dialogue: MangaDialogue;
  onWordTap: (korean: string, english: string, event: any) => void;
  onSpeakLine: (korean: string) => void;
}) {
  const isThinking = dialogue.speakerEnglish.includes('thinking');
  const alignment =
    dialogue.position === 'left'
      ? 'flex-start'
      : dialogue.position === 'right'
      ? 'flex-end'
      : 'center';

  return (
    <View style={[styles.bubbleWrapper, { alignItems: alignment }]}>
      {/* Speaker Label */}
      <View style={[styles.speakerRow, { justifyContent: alignment }]}>
        <Text style={styles.speakerName}>{dialogue.speaker}</Text>
        <Text style={styles.speakerEnglish}>
          ({dialogue.speakerEnglish})
        </Text>
      </View>

      {/* Speech Bubble */}
      <View
        style={[
          styles.bubble,
          isThinking && styles.bubbleThinking,
          dialogue.position === 'left' && styles.bubbleLeft,
          dialogue.position === 'right' && styles.bubbleRight,
          dialogue.position === 'center' && styles.bubbleCenter,
        ]}
      >
        {/* Korean words with English directly below each word */}
        <View style={styles.wordsRow}>
          {dialogue.words.map((word, wordIndex) => (
            <TouchableOpacity
              key={`${word.korean}-${wordIndex}`}
              onPress={() => onSpeakLine(word.korean)}
              activeOpacity={0.6}
              style={styles.wordColumn}
            >
              <Text style={[styles.wordKorean, isThinking && styles.wordKoreanThinking]}>
                {word.korean}
              </Text>
              <Text style={styles.wordEnglish}>{word.english}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Audio Button */}
        <TouchableOpacity
          style={styles.audioBtn}
          onPress={() => onSpeakLine(dialogue.korean)}
        >
          <Ionicons
            name="volume-medium-outline"
            size={16}
            color={isThinking ? 'rgba(124, 77, 255, 0.6)' : 'rgba(26, 10, 46, 0.35)'}
          />
        </TouchableOpacity>
      </View>

      {/* Bubble Pointer */}
      {dialogue.position === 'left' && (
        <View style={[styles.pointer, styles.pointerLeft]} />
      )}
      {dialogue.position === 'right' && (
        <View style={[styles.pointer, styles.pointerRight]} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.darkBg,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  errorContainer: {
    flex: 1,
    backgroundColor: colors.darkBg,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.lg,
  },
  errorText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: '#fff',
  },
  backBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.full,
  },
  backBtnText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 14,
    color: '#fff',
  },

  // Chapter Header
  chapterHeader: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
    gap: spacing.xs,
  },
  chapterTitle: {
    fontFamily: 'Poppins-ExtraBold',
    fontSize: 26,
    color: '#fff',
  },
  chapterKorean: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: 'rgba(255,255,255,0.5)',
  },
  levelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginTop: spacing.xs,
  },
  levelPill: {
    backgroundColor: colors.primary + '30',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  levelPillText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 11,
    color: colors.primaryLight,
  },
  panelInfo: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    color: 'rgba(255,255,255,0.4)',
  },

  // Panel
  panelContainer: {
    marginHorizontal: spacing.xl,
    marginBottom: spacing.xxl,
    gap: spacing.md,
  },
  panelBadge: {
    alignSelf: 'center',
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  panelBadgeText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
  },
  imageContainer: {
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.05)',
    minHeight: 200,
  },
  imagePlaceholder: {
    height: 220,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
  },
  loadingText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    color: 'rgba(255,255,255,0.3)',
  },
  panelImage: {
    width: '100%',
    height: 240,
  },

  // Narration
  narrationBox: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.xs,
  },
  narrationKorean: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 15,
    color: '#fff',
    fontStyle: 'italic',
  },
  narrationEnglish: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
    fontStyle: 'italic',
  },

  // Dialogue Bubble
  bubbleWrapper: {
    width: '100%',
    paddingHorizontal: spacing.xs,
  },
  speakerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.xs,
    paddingHorizontal: spacing.xs,
  },
  speakerName: {
    fontFamily: 'Poppins-Bold',
    fontSize: 13,
    color: colors.primaryLight,
  },
  speakerEnglish: {
    fontFamily: 'Poppins-Regular',
    fontSize: 11,
    color: 'rgba(255,255,255,0.4)',
  },
  bubble: {
    backgroundColor: '#fff',
    borderRadius: borderRadius.xl,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    maxWidth: '85%',
    position: 'relative',
    ...shadows.sm,
  },
  bubbleThinking: {
    backgroundColor: 'rgba(124, 77, 255, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(124, 77, 255, 0.25)',
    borderStyle: 'dashed',
  },
  bubbleLeft: {
    borderTopLeftRadius: spacing.xs,
  },
  bubbleRight: {
    borderTopRightRadius: spacing.xs,
  },
  bubbleCenter: {
    alignSelf: 'center',
  },

  // Pointer
  pointer: {
    width: 0,
    height: 0,
    borderStyle: 'solid',
    position: 'relative',
    marginTop: -1,
  },
  pointerLeft: {
    borderTopWidth: 8,
    borderTopColor: '#fff',
    borderRightWidth: 8,
    borderRightColor: 'transparent',
    borderLeftWidth: 0,
    borderLeftColor: 'transparent',
    marginLeft: 12,
  },
  pointerRight: {
    borderTopWidth: 8,
    borderTopColor: '#fff',
    borderLeftWidth: 8,
    borderLeftColor: 'transparent',
    borderRightWidth: 0,
    borderRightColor: 'transparent',
    alignSelf: 'flex-end',
    marginRight: 12,
  },

  // Words
  wordsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginBottom: spacing.xs,
  },
  wordColumn: {
    alignItems: 'center',
    paddingBottom: 2,
  },
  wordEnglish: {
    fontSize: 8,
    fontFamily: 'Poppins-Medium',
    color: colors.textTertiary,
    marginTop: 1,
  },
  wordKorean: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 17,
    color: colors.textPrimary,
  },
  wordKoreanThinking: {
    color: '#7C4DFF',
    fontStyle: 'italic',
  },
  lineEnglish: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: colors.textTertiary,
    marginTop: 2,
  },
  audioBtn: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    padding: spacing.xs,
  },

  // Tooltip
  tooltipOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  tooltipBox: {
    position: 'absolute',
    backgroundColor: '#fff',
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    width: 160,
    ...shadows.lg,
    borderWidth: 1,
    borderColor: colors.primary + '20',
  },
  tooltipKorean: {
    fontFamily: 'Poppins-Bold',
    fontSize: 20,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  tooltipDivider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginVertical: spacing.sm,
  },
  tooltipEnglish: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: colors.primaryDark,
    textAlign: 'center',
  },
  tooltipAudio: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  tooltipAudioText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    color: colors.primary,
  },

  // End Card
  endCard: {
    alignItems: 'center',
    paddingVertical: spacing.huge,
    paddingHorizontal: spacing.xl,
    gap: spacing.md,
  },
  endTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 20,
    color: '#fff',
  },
  endSub: {
    fontFamily: 'Poppins-Regular',
    fontSize: 13,
    color: 'rgba(255,255,255,0.5)',
  },
  endButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.full,
    marginTop: spacing.md,
    ...shadows.glow,
  },
  endButtonText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 14,
    color: '#fff',
  },
});

import React, { useState, useRef, useCallback } from 'react';
import { Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, borderRadius, spacing } from '@/lib/theme';
import { speakLessonNarrationAsync, stopSpeaking, playAudioByIdAsync } from '@/lib/audio';
import { getCachedAudioUri } from '@/lib/audioCache';

interface LessonSection {
  heading: string;
  explanation: string;
  examples?: { korean: string; english: string }[];
  tip?: string;
}

interface Props {
  lessonId: string;
  title: string;
  description: string;
  sections: LessonSection[];
}


export function LessonAutoplay({ lessonId, title, description, sections }: Props) {
  const [playing, setPlaying] = useState(false);
  const cancelRef = useRef(false);

  // Build narration chunks with IDs matching pre-generated file pattern
  const buildChunks = useCallback((): { id: string; text: string }[] => {
    const chunks: { id: string; text: string }[] = [];
    chunks.push({ id: `${lessonId}_intro`, text: `${title}. ${description}` });
    sections.forEach((s, si) => {
      chunks.push({ id: `${lessonId}_s${si}`, text: `${s.heading}. ${s.explanation}` });
      if (s.examples && s.examples.length > 0) {
        const exText = s.examples.map((ex) => `${ex.korean}. ${ex.english}`).join('. ');
        if (exText) chunks.push({ id: `${lessonId}_s${si}_ex`, text: exText });
      }
      if (s.tip) chunks.push({ id: `${lessonId}_s${si}_tip`, text: `Tip: ${s.tip}` });
    });
    return chunks;
  }, [lessonId, title, description, sections]);

  const handlePlay = useCallback(async () => {
    if (playing) {
      cancelRef.current = true;
      await stopSpeaking();
      setPlaying(false);
      return;
    }

    cancelRef.current = false;
    setPlaying(true);
    const chunks = buildChunks();

    for (const chunk of chunks) {
      if (cancelRef.current) break;

      // Try cached audio via singleton player first
      const uri = await getCachedAudioUri(chunk.id);
      if (uri) {
        await playAudioByIdAsync(chunk.id);
        continue;
      }

      // Fallback to Edge TTS
      await speakLessonNarrationAsync(chunk.text);
    }

    setPlaying(false);
  }, [playing, buildChunks]);

  return (
    <TouchableOpacity onPress={handlePlay} style={[styles.btn, playing && styles.btnActive]} activeOpacity={0.8}>
      <Ionicons name={playing ? 'stop' : 'play'} size={16} color={playing ? '#fff' : colors.primary} />
      <Text style={[styles.label, playing && styles.labelActive]}>
        {playing ? 'Stop Reading' : 'Read Lesson Aloud'}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingVertical: 10,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primaryFaint,
    alignSelf: 'center',
    marginBottom: spacing.md,
  },
  btnActive: {
    backgroundColor: colors.primary,
  },
  label: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 13,
    color: colors.primary,
  },
  labelActive: {
    color: '#fff',
  },
});

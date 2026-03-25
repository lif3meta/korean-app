import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, borderRadius, spacing, shadows } from '@/lib/theme';
import { useAppStore } from '@/lib/store';
import { Card } from '@/components/ui/Card';
import { allHangul } from '@/data/hangul';
import { vocabulary } from '@/data/vocabulary';
import { grammarLessons } from '@/data/grammar';
import { slangWords } from '@/data/slang';
import { sentences } from '@/data/sentences';
import { pronunciationLessons } from '@/data/pronunciation';
import { cultureLessons } from '@/data/culture';
import { getPercentage } from '@/lib/utils';

export default function LearnScreen() {
  const insets = useSafeAreaInsets();
  const { learnedCharacters, learnedWords, completedLessons } = useAppStore();

  const hangulPct = getPercentage(learnedCharacters.length, allHangul.length);
  const vocabPct = getPercentage(learnedWords.length, vocabulary.length);
  const grammarPct = getPercentage(Object.keys(completedLessons).filter(k => k.startsWith('g_')).length, grammarLessons.length);
  const sentencesDone = Object.keys(completedLessons).filter(k => k.startsWith('sent_')).length;
  const sentencesPct = getPercentage(sentencesDone, sentences.length);
  const pronDone = Object.keys(completedLessons).filter(k => k.startsWith('pron_')).length;
  const pronPct = getPercentage(pronDone, pronunciationLessons.length);
  const cultureDone = Object.keys(completedLessons).filter(k => k.startsWith('cult_')).length;
  const culturePct = getPercentage(cultureDone, cultureLessons.length);

  const categories = [
    {
      title: 'Hangul',
      titleKorean: '한글',
      description: 'Master the Korean alphabet',
      icon: 'text',
      image: require('@/assets/images/sloth-hangul.png'),
      progress: hangulPct,
      stat: `${learnedCharacters.length}/${allHangul.length} characters`,
      color: colors.primaryLight,
      gradient: ['#FF80AB', '#E040FB'] as readonly [string, string],
      route: '/lesson/hangul/' as const,
    },
    {
      title: 'Pronunciation',
      titleKorean: '발음',
      description: 'Sound like a native',
      icon: 'mic',
      image: require('@/assets/images/sloth-pronunciation.png'),
      progress: pronPct,
      stat: `${pronDone}/${pronunciationLessons.length} lessons`,
      color: '#E91E63',
      gradient: ['#E91E63', '#AD1457'] as readonly [string, string],
      route: '/lesson/pronunciation' as const,
    },
    {
      title: 'Tongue Guide',
      titleKorean: '혀 위치',
      description: 'Mouth & tongue positions',
      icon: 'body',
      image: require('@/assets/images/sloth-tongue.png'),
      progress: 0,
      stat: '40 sounds',
      color: '#E91E63',
      gradient: ['#F48FB1', '#E91E63'] as readonly [string, string],
      route: '/lesson/tongue' as const,
    },
    {
      title: 'Vocabulary',
      titleKorean: '어휘',
      description: 'Build your word bank',
      icon: 'book',
      image: require('@/assets/images/sloth-vocab.png'),
      progress: vocabPct,
      stat: `${learnedWords.length}/${vocabulary.length} words`,
      color: colors.accent,
      gradient: ['#00E5FF', '#7C4DFF'] as readonly [string, string],
      route: '/lesson/vocab/' as const,
    },
    {
      title: 'Grammar',
      titleKorean: '문법',
      description: 'Understand sentence patterns',
      icon: 'pencil',
      image: require('@/assets/images/sloth-grammar.png'),
      progress: grammarPct,
      stat: `${Object.keys(completedLessons).filter(k => k.startsWith('g_')).length}/${grammarLessons.length} lessons`,
      color: colors.secondary,
      gradient: ['#FFD740', '#FFC107'] as readonly [string, string],
      route: '/lesson/grammar/' as const,
    },
    {
      title: 'Sentences',
      titleKorean: '문장',
      description: 'Build full sentences',
      icon: 'chatbubble-ellipses',
      image: require('@/assets/images/sloth-sentences.png'),
      progress: sentencesPct,
      stat: `${sentencesDone}/${sentences.length} sentences`,
      color: '#00BCD4',
      gradient: ['#00E5FF', '#00BCD4'] as readonly [string, string],
      route: '/lesson/sentences' as const,
    },
    {
      title: 'Stories',
      titleKorean: '\uC774\uC57C\uAE30',
      description: 'Learn through manga',
      icon: 'book-outline',
      image: require('@/assets/images/sloth-stories.png'),
      progress: 0,
      stat: '3 chapters',
      color: '#7C4DFF',
      gradient: ['#1A0A2E', '#7C4DFF'] as readonly [string, string],
      route: '/lesson/manga' as const,
    },
    {
      title: 'Slang',
      titleKorean: '슬랭',
      description: 'K-pop & internet lingo',
      icon: 'sparkles',
      image: require('@/assets/images/sloth-slang.png'),
      progress: 0,
      stat: `${slangWords.length} expressions`,
      color: '#FF6090',
      gradient: ['#FF6090', '#E040FB'] as readonly [string, string],
      route: '/lesson/slang' as const,
    },
    {
      title: 'Reading',
      titleKorean: '읽기',
      description: 'Read Korean stories',
      icon: 'reader',
      image: require('@/assets/images/sloth-reading.png'),
      progress: 0,
      stat: '6 passages',
      color: '#4CAF50',
      gradient: ['#4CAF50', '#2E7D32'] as readonly [string, string],
      route: '/lesson/reading' as const,
    },
    {
      title: 'Watch',
      titleKorean: '영상',
      description: 'K-drama & YouTube',
      icon: 'play-circle',
      image: require('@/assets/images/sloth-watch.png'),
      progress: 0,
      stat: '22 videos',
      color: '#FF5252',
      gradient: ['#FF5252', '#D32F2F'] as readonly [string, string],
      route: '/lesson/videos' as const,
    },
    {
      title: 'Culture',
      titleKorean: '문화',
      description: 'Honorifics & customs',
      icon: 'globe',
      image: require('@/assets/images/sloth-culture.png'),
      progress: culturePct,
      stat: `${cultureDone}/${cultureLessons.length} lessons`,
      color: '#FF9800',
      gradient: ['#FF9800', '#E65100'] as readonly [string, string],
      route: '/lesson/culture' as const,
    },
  ];

  // Group categories into sections
  const sections = [
    { title: 'Foundations', titleKorean: '기초', items: categories.filter(c => ['Hangul', 'Pronunciation', 'Tongue Guide', 'Vocabulary', 'Grammar'].includes(c.title)) },
    { title: 'Practice', titleKorean: '연습', items: categories.filter(c => ['Sentences', 'Reading', 'Stories'].includes(c.title)) },
    { title: 'Explore', titleKorean: '탐구', items: categories.filter(c => ['Slang', 'Culture', 'Watch'].includes(c.title)) },
  ];

  const renderCard = (cat: typeof categories[0]) => (
    <TouchableOpacity key={cat.title} onPress={() => router.push(cat.route)} activeOpacity={0.8}>
      <Card variant="elevated" style={styles.categoryCard}>
        <LinearGradient colors={cat.gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.categoryGradient}>
          <View style={styles.categoryContent}>
            <View style={styles.categoryInfo}>
              <View style={styles.categoryHeader}>
                <Ionicons name={cat.icon as any} size={20} color="#fff" />
                <Text style={styles.categoryTitle}>{cat.title}</Text>
              </View>
              <Text style={styles.categoryKorean}>{cat.titleKorean}</Text>
              <Text style={styles.categoryDesc}>{cat.description}</Text>
              <Text style={styles.categoryStat}>{cat.stat}</Text>
            </View>
            <Image source={cat.image} style={styles.categoryImage} />
          </View>
        </LinearGradient>
      </Card>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: spacing.xxxl }} showsVerticalScrollIndicator={false}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Text style={styles.headerTitle}>Lessons</Text>
        <Text style={styles.headerSub}>배우기</Text>
      </View>

      <View style={styles.content}>
        {sections.map((section) => (
          <View key={section.title} style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionLabel}>{section.titleKorean}</Text>
              <Text style={styles.sectionTitle}>{section.title}</Text>
            </View>
            {section.items.map(renderCard)}
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    paddingBottom: 16,
    paddingHorizontal: 24,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  headerTitle: {
    fontFamily: 'Jakarta-ExtraBold',
    fontSize: 28,
    color: colors.textPrimary,
  },
  headerSub: {
    fontFamily: 'Jakarta-Medium',
    fontSize: 13,
    color: colors.textTertiary,
    marginTop: 2,
  },
  content: { paddingHorizontal: 20, paddingTop: 20, gap: 8 },
  section: { gap: spacing.sm, marginBottom: spacing.md },
  sectionHeader: { gap: 2, marginTop: spacing.sm },
  sectionLabel: {
    fontFamily: 'Jakarta-Bold',
    fontSize: 10,
    color: '#ec4899',
    letterSpacing: 1.5,
  },
  sectionTitle: {
    fontFamily: 'Jakarta-ExtraBold',
    fontSize: 20,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  categoryCard: { padding: 0, overflow: 'hidden' },
  categoryGradient: { padding: spacing.lg },
  categoryContent: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  categoryInfo: { flex: 1, gap: 2, flexShrink: 1 },
  categoryHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  categoryTitle: { fontSize: 20, fontFamily: 'Jakarta-ExtraBold', color: '#fff' },
  categoryKorean: { fontSize: 11, fontFamily: 'Jakarta-Medium', color: 'rgba(255,255,255,0.6)' },
  categoryDesc: { fontSize: 12, fontFamily: 'Jakarta-Regular', color: 'rgba(255,255,255,0.8)' },
  categoryStat: { fontSize: 12, fontFamily: 'Jakarta-Bold', color: 'rgba(255,255,255,0.9)', marginTop: 2 },
  categoryImage: { width: 70, height: 70, borderRadius: 14 },
});

import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, borderRadius, spacing, shadows } from '@/lib/theme';
import { useAppStore } from '@/lib/store';
import { Card } from '@/components/ui/Card';

interface PracticeCategory {
  title: string;
  titleKorean: string;
  description: string;
  icon: string;
  image: any;
  stat: string;
  gradient: readonly [string, string];
  route: string;
}

export default function PracticeScreen() {
  const insets = useSafeAreaInsets();
  const srsCards = useAppStore((s) => s.srsCards);
  const quizHistory = useAppStore((s) => s.quizHistory);
  const dueCards = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return Object.values(srsCards).filter((c) => c.nextReviewDate <= today);
  }, [srsCards]);

  const quizzes: PracticeCategory[] = [
    { title: 'Hangul Quiz', titleKorean: '한글 퀴즈', description: 'Test character knowledge', icon: 'text', image: require('@/assets/images/sloth-hangul.png'), stat: 'Dynamic questions', gradient: ['#E91E63', '#AD1457'], route: '/quiz/hangul' },
    { title: 'Vocab Quiz', titleKorean: '어휘 퀴즈', description: 'Test word knowledge', icon: 'book', image: require('@/assets/images/sloth-vocab.png'), stat: 'Dynamic questions', gradient: ['#00BCD4', '#00838F'], route: '/quiz/vocab' },
    { title: 'Grammar Quiz', titleKorean: '문법 퀴즈', description: 'Test grammar skills', icon: 'pencil', image: require('@/assets/images/sloth-grammar.png'), stat: 'Particles & conjugation', gradient: ['#FF9800', '#E65100'], route: '/quiz/grammar' },
    { title: 'Mixed Quiz', titleKorean: '종합 도전', description: 'All topics combined', icon: 'game-controller', image: require('@/assets/images/sloth-quiz.png'), stat: 'Everything mixed', gradient: ['#9C27B0', '#6A1B9A'], route: '/quiz/mixed' },
  ];

  const activities: PracticeCategory[] = [
    { title: 'Flashcard Review', titleKorean: '플래시카드', description: 'Spaced repetition review', icon: 'albums', image: require('@/assets/images/sloth-flashcards.png'), stat: `${dueCards.length} cards due`, gradient: ['#3F51B5', '#1A237E'], route: '/lesson/vocab/review' },
    { title: 'Build Sentences', titleKorean: '문장 만들기', description: 'Progressive sentence building', icon: 'chatbubble-ellipses', image: require('@/assets/images/sloth-sentences.png'), stat: '6 difficulty levels', gradient: ['#00E5FF', '#00BCD4'], route: '/lesson/sentences' },
    { title: 'Listening Practice', titleKorean: '듣기 연습', description: 'Train your listening skills', icon: 'ear', image: require('@/assets/images/sloth-speaking.png'), stat: 'Dictation & identify', gradient: ['#06b6d4', '#0891b2'], route: '/lesson/listening' },
    { title: 'Writing Practice', titleKorean: '쓰기 연습', description: 'Translate and write Korean', icon: 'pencil', image: require('@/assets/images/sloth-grammar.png'), stat: 'Translation & particles', gradient: ['#8b5cf6', '#7c3aed'], route: '/lesson/writing' },
    { title: 'Handwriting', titleKorean: '손글씨 연습', description: 'Draw characters & get checked', icon: 'brush', image: require('@/assets/images/sloth-hangul.png'), stat: 'AI-checked writing', gradient: ['#f97316', '#ea580c'], route: '/practice-handwriting' },
    { title: 'Pronunciation', titleKorean: '발음 연습', description: 'Sound rules and practice', icon: 'mic', image: require('@/assets/images/sloth-pronunciation.png'), stat: 'Vowels & consonants', gradient: ['#F44336', '#C62828'], route: '/lesson/pronunciation' },
    { title: 'Reading Practice', titleKorean: '읽기 연습', description: 'Tap-to-translate passages', icon: 'reader', image: require('@/assets/images/sloth-reading.png'), stat: 'Graded passages', gradient: ['#4CAF50', '#2E7D32'], route: '/lesson/reading' },
    { title: 'Hanja Explorer', titleKorean: '한자 탐험', description: 'Chinese character families', icon: 'language', image: require('@/assets/images/sloth-grammar.png'), stat: '30 character roots', gradient: ['#dc2626', '#991b1b'], route: '/lesson/hanja' },
  ];

  const drills: PracticeCategory[] = [
    { title: 'Fast Hangul', titleKorean: '빠른 한글', description: 'Speed drill letters & sounds', icon: 'flash', image: require('@/assets/images/sloth-hangul.png'), stat: 'Configurable speed', gradient: ['#ec4899', '#be185d'], route: '/fast-hangul' },
    { title: 'Parrot Learning', titleKorean: '반복 학습', description: 'Repeat phrases on loop', icon: 'sync', image: require('@/assets/images/sloth-sleep.png'), stat: 'Passive learning', gradient: ['#5C6BC0', '#283593'], route: '/sleep' },
  ];

  const tools: PracticeCategory[] = [
    { title: 'Dictionary', titleKorean: '사전', description: '384+ Korean words', icon: 'search', image: require('@/assets/images/sloth-dictionary.png'), stat: 'Search & save', gradient: ['#FF5722', '#BF360C'], route: '/dictionary' },
    { title: 'My Words', titleKorean: '내 단어', description: 'Your saved vocabulary', icon: 'bookmark', image: require('@/assets/images/sloth-mywords.png'), stat: 'Personal wordbank', gradient: ['#FF9800', '#E65100'], route: '/my-words' },
  ];

  const sections = [
    { title: 'Quizzes', titleKorean: '퀴즈', items: quizzes },
    { title: 'Activities', titleKorean: '활동', items: activities },
    { title: 'Drills', titleKorean: '드릴', items: drills },
    { title: 'Tools', titleKorean: '도구', items: tools },
  ];

  const recentResults = quizHistory.slice(0, 3);

  const renderCard = (cat: PracticeCategory) => (
    <TouchableOpacity key={cat.title} onPress={() => router.push(cat.route as any)} activeOpacity={0.8}>
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
        <Text style={styles.headerTitle}>Practice</Text>
        <Text style={styles.headerSub}>연습하기</Text>
      </View>

      <View style={styles.content}>
        {/* SRS Review Banner */}
        {dueCards.length > 0 && (
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => router.push('/lesson/vocab/review')}
            style={styles.reviewBanner}
          >
            <View style={styles.reviewDot}>
              <Ionicons name="refresh" size={20} color="#fff" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.reviewTitle}>{dueCards.length} cards due for review</Text>
              <Text style={styles.reviewSub}>Review now to strengthen memory</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={colors.textTertiary} />
          </TouchableOpacity>
        )}

        {/* Sections */}
        {sections.map((section) => (
          <View key={section.title} style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionLabel}>{section.titleKorean}</Text>
              <Text style={styles.sectionTitle}>{section.title}</Text>
            </View>
            {section.items.map(renderCard)}
          </View>
        ))}

        {/* Recent Quiz Results */}
        {recentResults.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionLabel}>기록</Text>
              <Text style={styles.sectionTitle}>Recent Results</Text>
            </View>
            {recentResults.map((result, i) => (
              <View key={i} style={styles.resultRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.resultCategory}>{result.category} Quiz</Text>
                  <Text style={styles.resultDate}>{result.date}</Text>
                </View>
                <Text style={[styles.resultPct, {
                  color: result.score / result.total >= 0.7 ? colors.success : '#f59e0b',
                }]}>
                  {Math.round((result.score / result.total) * 100)}%
                </Text>
                <Text style={styles.resultXP}>+{result.xpEarned} XP</Text>
              </View>
            ))}
          </View>
        )}
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

  // Review Banner
  reviewBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xxl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.accentLight,
    ...shadows.sm,
    marginBottom: spacing.sm,
  },
  reviewDot: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reviewTitle: {
    fontFamily: 'Jakarta-Bold',
    fontSize: 14,
    color: colors.textPrimary,
  },
  reviewSub: {
    fontFamily: 'Jakarta-Regular',
    fontSize: 12,
    color: colors.textTertiary,
    marginTop: 2,
  },

  // Category cards (matches learn tab style)
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

  // Results
  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: 14,
    marginBottom: 6,
    ...shadows.sm,
  },
  resultCategory: {
    fontFamily: 'Jakarta-Bold',
    fontSize: 14,
    color: colors.textPrimary,
    textTransform: 'capitalize',
  },
  resultDate: {
    fontFamily: 'Jakarta-Regular',
    fontSize: 11,
    color: colors.textTertiary,
  },
  resultPct: {
    fontFamily: 'Jakarta-ExtraBold',
    fontSize: 20,
  },
  resultXP: {
    fontFamily: 'Jakarta-Bold',
    fontSize: 11,
    color: colors.accent,
  },
});

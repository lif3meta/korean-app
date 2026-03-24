import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ImageSourcePropType } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { shadows } from '@/lib/theme';
import { useAppStore } from '@/lib/store';

interface PracticeItem {
  id: string;
  title: string;
  titleKorean: string;
  icon: string;
  iconColor: string;
  bgColor: string;
  desc: string;
  route: string;
  image?: ImageSourcePropType;
}

export default function PracticeScreen() {
  const insets = useSafeAreaInsets();
  const { getDueCards, quizHistory } = useAppStore();
  const dueCards = getDueCards();

  const quizTypes: PracticeItem[] = [
    { id: 'hangul', title: 'Hangul Quiz', titleKorean: '한글 퀴즈', icon: 'text', iconColor: '#E91E63', bgColor: '#FCE4EC', desc: 'Test your character knowledge', route: '/quiz/hangul', image: require('@/assets/images/sloth-hangul.png') },
    { id: 'vocab', title: 'Vocab Quiz', titleKorean: '어휘 퀴즈', icon: 'book', iconColor: '#00BCD4', bgColor: '#E0F7FA', desc: 'Test your word knowledge', route: '/quiz/vocab', image: require('@/assets/images/sloth-vocab.png') },
    { id: 'grammar', title: 'Grammar Quiz', titleKorean: '문법 퀴즈', icon: 'pencil', iconColor: '#FF9800', bgColor: '#FFF3E0', desc: 'Test your grammar skills', route: '/quiz/grammar', image: require('@/assets/images/sloth-grammar.png') },
    { id: 'mixed', title: 'Mixed Quiz', titleKorean: '종합 도전', icon: 'game-controller', iconColor: '#9C27B0', bgColor: '#F3E5F5', desc: 'All topics combined', route: '/quiz/mixed', image: require('@/assets/images/sloth-quiz.png') },
  ];

  const practiceActivities: PracticeItem[] = [
    { id: 'flashcards', title: 'Flashcard Review', titleKorean: '플래시카드', icon: 'albums', iconColor: '#3F51B5', bgColor: '#E8EAF6', desc: 'Spaced repetition review', route: '/lesson/vocab/review', image: require('@/assets/images/sloth-flashcards.png') },
    { id: 'sentences', title: 'Build Sentences', titleKorean: '문장 만들기', icon: 'chatbubble-ellipses', iconColor: '#00BCD4', bgColor: '#E0F7FA', desc: 'Progressive sentence building', route: '/lesson/sentences', image: require('@/assets/images/sloth-sentences.png') },
    { id: 'tongue', title: 'Tongue Guide', titleKorean: '혀 위치', icon: 'body', iconColor: '#E91E63', bgColor: '#FCE4EC', desc: 'Mouth and tongue positions', route: '/lesson/tongue', image: require('@/assets/images/sloth-tongue.png') },
    { id: 'pronunciation', title: 'Pronunciation', titleKorean: '발음 연습', icon: 'mic', iconColor: '#F44336', bgColor: '#FFEBEE', desc: 'Sound rules and practice', route: '/lesson/pronunciation', image: require('@/assets/images/sloth-pronunciation.png') },
    { id: 'reading', title: 'Reading Practice', titleKorean: '읽기 연습', icon: 'reader', iconColor: '#4CAF50', bgColor: '#E8F5E9', desc: 'Tap-to-translate passages', route: '/lesson/reading', image: require('@/assets/images/sloth-reading.png') },
    { id: 'slang', title: 'K-Pop Slang', titleKorean: '슬랭 연습', icon: 'sparkles', iconColor: '#FF4081', bgColor: '#FCE4EC', desc: 'Internet and K-pop lingo', route: '/lesson/slang', image: require('@/assets/images/sloth-slang.png') },
    { id: 'manga', title: 'Story Reading', titleKorean: '이야기 읽기', icon: 'book', iconColor: '#7C4DFF', bgColor: '#EDE7F6', desc: 'Learn through manga stories', route: '/lesson/manga', image: require('@/assets/images/sloth-stories.png') },
    { id: 'culture', title: 'Culture Lessons', titleKorean: '문화 수업', icon: 'globe', iconColor: '#FF9800', bgColor: '#FFF3E0', desc: 'Honorifics, customs, survival', route: '/lesson/culture', image: require('@/assets/images/sloth-culture.png') },
  ];

  const toolsSection: PracticeItem[] = [
    { id: 'sleep', title: 'Sleep Learning', titleKorean: '수면 학습', icon: 'moon', iconColor: '#5C6BC0', bgColor: '#E8EAF6', desc: 'Repeat words while resting', route: '/sleep', image: require('@/assets/images/sloth-sleep.png') },
    { id: 'dictionary', title: 'Dictionary', titleKorean: '사전', icon: 'search', iconColor: '#FF5722', bgColor: '#FBE9E7', desc: '384+ Korean words', route: '/dictionary', image: require('@/assets/images/sloth-dictionary.png') },
    { id: 'mywords', title: 'My Words', titleKorean: '내 단어', icon: 'bookmark', iconColor: '#FF9800', bgColor: '#FFF3E0', desc: 'Your saved vocabulary', route: '/my-words', image: require('@/assets/images/sloth-mywords.png') },
    { id: 'videos', title: 'Watch & Learn', titleKorean: '영상 보기', icon: 'play-circle', iconColor: '#F44336', bgColor: '#FFEBEE', desc: 'K-drama YouTube lessons', route: '/lesson/videos', image: require('@/assets/images/sloth-watch.png') },
  ];

  const recentResults = quizHistory.slice(0, 3);

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <View>
          <Text style={styles.headerTitle}>Practice</Text>
          <Text style={styles.headerSub}>연습하기</Text>
        </View>
      </View>

      <View style={styles.content}>
        {/* SRS Review Banner */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={dueCards.length > 0 ? () => router.push('/lesson/vocab/review') : undefined}
          style={styles.reviewBanner}
        >
          <View style={[styles.reviewDot, { backgroundColor: dueCards.length > 0 ? '#ec4899' : '#10b981' }]}>
            <Ionicons name={dueCards.length > 0 ? 'refresh' : 'checkmark'} size={20} color="#fff" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.reviewTitle}>
              {dueCards.length > 0 ? `${dueCards.length} cards due for review` : 'All caught up!'}
            </Text>
            <Text style={styles.reviewSub}>
              {dueCards.length > 0 ? 'Review now to strengthen memory' : 'No cards due. Keep learning!'}
            </Text>
          </View>
          {dueCards.length > 0 && <Ionicons name="chevron-forward" size={16} color="#ccc" />}
        </TouchableOpacity>

        {/* Quizzes Section */}
        <Text style={styles.sectionLabel}>QUIZZES</Text>
        <Text style={styles.sectionTitle}>Test Your Knowledge</Text>
        <View style={styles.quizGrid}>
          {quizTypes.map((item) => (
            <TouchableOpacity key={item.id} activeOpacity={0.8} onPress={() => router.push(item.route as any)} style={styles.quizCard}>
              {item.image ? (
                <Image source={item.image} style={styles.quizImage} />
              ) : (
                <View style={[styles.quizIcon, { backgroundColor: item.bgColor }]}>
                  <Ionicons name={item.icon as any} size={22} color={item.iconColor} />
                </View>
              )}
              <View style={{ flex: 1 }}>
                <Text style={styles.quizTitle}>{item.title}</Text>
                <Text style={styles.quizDesc}>{item.desc}</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#ddd" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Practice Activities */}
        <Text style={styles.sectionLabel}>ACTIVITIES</Text>
        <Text style={styles.sectionTitle}>Strengthen Your Skills</Text>
        <View style={styles.activityList}>
          {practiceActivities.map((item) => (
            <TouchableOpacity key={item.id} activeOpacity={0.8} onPress={() => router.push(item.route as any)} style={styles.activityRow}>
              {item.image ? (
                <Image source={item.image} style={styles.activityImage} />
              ) : (
                <View style={[styles.activityIcon, { backgroundColor: item.bgColor }]}>
                  <Ionicons name={item.icon as any} size={18} color={item.iconColor} />
                </View>
              )}
              <View style={{ flex: 1 }}>
                <Text style={styles.activityTitle}>{item.title}</Text>
                <Text style={styles.activityDesc}>{item.desc}</Text>
              </View>
              <Text style={styles.activityKorean}>{item.titleKorean}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tools & Extras */}
        <Text style={styles.sectionLabel}>TOOLS</Text>
        <Text style={styles.sectionTitle}>Learning Resources</Text>
        <View style={styles.toolsGrid}>
          {toolsSection.map((item) => (
            <TouchableOpacity key={item.id} activeOpacity={0.8} onPress={() => router.push(item.route as any)} style={styles.toolCard}>
              {item.image ? (
                <Image source={item.image} style={styles.toolImage} />
              ) : (
                <View style={[styles.toolIcon, { backgroundColor: item.bgColor }]}>
                  <Ionicons name={item.icon as any} size={20} color={item.iconColor} />
                </View>
              )}
              <Text style={styles.toolTitle}>{item.title}</Text>
              <Text style={styles.toolKorean}>{item.titleKorean}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Recent Quiz Results */}
        {recentResults.length > 0 && (
          <>
            <Text style={styles.sectionLabel}>HISTORY</Text>
            <Text style={styles.sectionTitle}>Recent Results</Text>
            {recentResults.map((result, i) => (
              <View key={i} style={styles.resultRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.resultCategory}>{result.category} Quiz</Text>
                  <Text style={styles.resultDate}>{result.date}</Text>
                </View>
                <Text style={[styles.resultPct, {
                  color: result.score / result.total >= 0.7 ? '#10b981' : '#f59e0b',
                }]}>
                  {Math.round((result.score / result.total) * 100)}%
                </Text>
                <Text style={styles.resultXP}>+{result.xpEarned} XP</Text>
              </View>
            ))}
          </>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  header: {
    paddingBottom: 16,
    paddingHorizontal: 24,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontFamily: 'Jakarta-ExtraBold',
    fontSize: 28,
    color: '#303335',
  },
  headerSub: {
    fontFamily: 'Jakarta-Medium',
    fontSize: 13,
    color: '#bbb',
    marginTop: 2,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
    gap: 8,
  },
  // Review Banner
  reviewBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    ...shadows.sm,
  },
  reviewDot: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reviewTitle: {
    fontFamily: 'Jakarta-Bold',
    fontSize: 14,
    color: '#303335',
  },
  reviewSub: {
    fontFamily: 'Jakarta-Regular',
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  // Section headers
  sectionLabel: {
    fontFamily: 'Jakarta-Bold',
    fontSize: 10,
    color: '#ec4899',
    letterSpacing: 1.5,
    marginTop: 20,
  },
  sectionTitle: {
    fontFamily: 'Jakarta-ExtraBold',
    fontSize: 20,
    color: '#303335',
    marginBottom: 8,
  },
  // Quiz grid - horizontal rows
  quizGrid: {
    gap: 8,
  },
  quizCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,
    ...shadows.sm,
  },
  quizIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quizImage: {
    width: 44,
    height: 44,
    borderRadius: 14,
  },
  quizTitle: {
    fontFamily: 'Jakarta-Bold',
    fontSize: 15,
    color: '#303335',
  },
  quizDesc: {
    fontFamily: 'Jakarta-Regular',
    fontSize: 12,
    color: '#999',
    marginTop: 1,
  },
  // Activity list
  activityList: {
    backgroundColor: '#fff',
    borderRadius: 20,
    overflow: 'hidden',
    ...shadows.sm,
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 13,
    paddingHorizontal: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: '#f5f5f5',
  },
  activityIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityImage: {
    width: 36,
    height: 36,
    borderRadius: 10,
  },
  activityTitle: {
    fontFamily: 'Jakarta-Bold',
    fontSize: 14,
    color: '#303335',
  },
  activityDesc: {
    fontFamily: 'Jakarta-Regular',
    fontSize: 11,
    color: '#aaa',
    marginTop: 1,
  },
  activityKorean: {
    fontFamily: 'Jakarta-Medium',
    fontSize: 10,
    color: '#ccc',
  },
  // Tools grid
  toolsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  toolCard: {
    width: '47.5%' as any,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    gap: 6,
    ...shadows.sm,
  },
  toolIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toolImage: {
    width: 44,
    height: 44,
    borderRadius: 14,
  },
  toolTitle: {
    fontFamily: 'Jakarta-Bold',
    fontSize: 13,
    color: '#303335',
    textAlign: 'center',
  },
  toolKorean: {
    fontFamily: 'Jakarta-Medium',
    fontSize: 11,
    color: '#bbb',
    textAlign: 'center',
  },
  // Results
  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,
    marginBottom: 6,
    ...shadows.sm,
  },
  resultCategory: {
    fontFamily: 'Jakarta-Bold',
    fontSize: 14,
    color: '#303335',
    textTransform: 'capitalize',
  },
  resultDate: {
    fontFamily: 'Jakarta-Regular',
    fontSize: 11,
    color: '#999',
  },
  resultPct: {
    fontFamily: 'Jakarta-ExtraBold',
    fontSize: 20,
  },
  resultXP: {
    fontFamily: 'Jakarta-Bold',
    fontSize: 11,
    color: '#ec4899',
  },
});

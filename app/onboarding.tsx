import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions, TextInput, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, borderRadius, spacing, typography } from '@/lib/theme';
import { Button } from '@/components/ui/Button';
import { useAppStore } from '@/lib/store';

const { width } = Dimensions.get('window');

const slides = [
  {
    title: 'Welcome to Lzy Learn Korean',
    subtitle: '한국어를 배워요!',
    description: 'Your personal Korean language learning journey starts here',
    image: require('@/assets/images/onboarding1.png'),
    bgColors: ['#AA00FF', '#E040FB'] as const,
  },
  {
    title: 'Learn Your Way',
    subtitle: '재미있게 배워요',
    description: 'Master Hangul, build vocabulary, understand grammar, and test yourself with quizzes',
    image: require('@/assets/images/onboarding2.png'),
    bgColors: ['#7C4DFF', '#AA00FF'] as const,
  },
  {
    title: "Let's Get Started",
    subtitle: '시작합시다!',
    description: 'Set up your profile and begin learning',
    image: require('@/assets/images/onboarding3.png'),
    bgColors: ['#E040FB', '#FF80AB'] as const,
  },
];

export default function Onboarding() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [name, setName] = useState('');
  const flatListRef = useRef<FlatList>(null);
  const { setHasOnboarded, setUserName } = useAppStore();

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    }
  };

  const handleStart = () => {
    setUserName(name.trim() || 'Learner');
    setHasOnboarded(true);
    router.replace('/');
  };

  const renderSlide = ({ item, index }: { item: typeof slides[0]; index: number }) => (
    <LinearGradient colors={item.bgColors} style={styles.slide}>
      <View style={styles.slideContent}>
        <Image source={item.image} style={styles.slideImage} />
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.subtitle}>{item.subtitle}</Text>
        <Text style={styles.description}>{item.description}</Text>

        {index === 2 && (
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.inputSection}>
            <Text style={styles.inputLabel}>What's your name?</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Enter your name"
              placeholderTextColor="rgba(255,255,255,0.5)"
              autoCapitalize="words"
            />
          </KeyboardAvoidingView>
        )}
      </View>

      <View style={styles.bottomSection}>
        <View style={styles.dots}>
          {slides.map((_, i) => (
            <View key={i} style={[styles.dot, i === index && styles.dotActive]} />
          ))}
        </View>

        {index < slides.length - 1 ? (
          <Button title="Next" onPress={handleNext} variant="outline" style={styles.button} textStyle={{ color: '#fff' }} />
        ) : (
          <Button title="Start Learning!" onPress={handleStart} variant="outline" style={styles.button} textStyle={{ color: '#fff' }} />
        )}
      </View>
    </LinearGradient>
  );

  return (
    <FlatList
      ref={flatListRef}
      data={slides}
      renderItem={renderSlide}
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      onMomentumScrollEnd={(e) => {
        const idx = Math.round(e.nativeEvent.contentOffset.x / width);
        setCurrentIndex(idx);
      }}
      keyExtractor={(_, i) => i.toString()}
    />
  );
}

const styles = StyleSheet.create({
  slide: { width, flex: 1, justifyContent: 'space-between' },
  slideContent: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: spacing.xl, gap: spacing.md },
  slideImage: { width: 180, height: 180, borderRadius: 90, marginBottom: spacing.lg },
  title: { fontSize: 32, fontFamily: 'Poppins-Black', color: '#fff', textAlign: 'center' },
  subtitle: { fontSize: 22, fontFamily: 'Poppins-Medium', color: 'rgba(255,255,255,0.8)', textAlign: 'center' },
  description: { ...typography.body, color: 'rgba(255,255,255,0.7)', textAlign: 'center', lineHeight: 24 },
  inputSection: { width: '100%', marginTop: spacing.xxl, gap: spacing.md },
  inputLabel: { ...typography.headline, color: '#fff', textAlign: 'center' },
  input: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  bottomSection: { paddingBottom: 60, alignItems: 'center', gap: spacing.xl },
  dots: { flexDirection: 'row', gap: spacing.sm },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.3)' },
  dotActive: { width: 24, backgroundColor: '#fff' },
  button: { borderColor: 'rgba(255,255,255,0.5)', paddingHorizontal: spacing.huge, borderWidth: 2, borderRadius: borderRadius.xl },
});

import { Stack, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import * as StoreReview from 'expo-store-review';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useRef, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { colors } from '@/lib/theme';
import { useAppFonts } from '@/lib/fonts';
import { ChatBubble } from '@/components/common/ChatBubble';
import { AnimatedSplash } from '@/components/common/AnimatedSplash';
import { useAppStore } from '@/lib/store';
import { initializePurchases, checkSubscriptionStatus, addSubscriptionListener, cleanupPurchases } from '@/lib/purchases';
import { initAudioMode, preloadAudioAssets } from '@/lib/audio';

SplashScreen.preventAutoHideAsync();

const REVIEW_KEY = 'app_open_count';
const REVIEW_REQUESTED_KEY = 'review_requested';
const REVIEW_THRESHOLD = 10;

async function maybeRequestReview() {
  try {
    const raw = await AsyncStorage.getItem(REVIEW_KEY);
    const count = (parseInt(raw || '0', 10) || 0) + 1;
    await AsyncStorage.setItem(REVIEW_KEY, String(count));

    if (count < REVIEW_THRESHOLD) return;

    const alreadyRequested = await AsyncStorage.getItem(REVIEW_REQUESTED_KEY);
    if (alreadyRequested === 'true') return;

    if (await StoreReview.isAvailableAsync()) {
      await AsyncStorage.setItem(REVIEW_REQUESTED_KEY, 'true');
      setTimeout(() => StoreReview.requestReview(), 2000);
    }
  } catch {}
}

export default function RootLayout() {
  const { loaded, error } = useAppFonts();
  const segments = useSegments();
  const showChatBubble = segments[0] === '(tabs)';
  const [showAnimatedSplash, setShowAnimatedSplash] = useState(true);
  const [audioLoadProgress, setAudioLoadProgress] = useState(0);

  const setSubscriptionStatus = useAppStore((s) => s.setSubscriptionStatus);
  const setPurchasesInitialized = useAppStore((s) => s.setPurchasesInitialized);
  const purchasesInitialized = useAppStore((s) => s.purchasesInitialized);

  const reviewCalledRef = useRef(false);

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
      if (!reviewCalledRef.current) {
        reviewCalledRef.current = true;
        maybeRequestReview();
      }
    }
  }, [loaded, error]);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    async function setupPurchases() {
      try {
        await initializePurchases();
        const status = await checkSubscriptionStatus();
        setSubscriptionStatus(status.isPremium, status.expirationDate, status.willRenew);
      } catch (e) {
        console.warn('[Purchases] Init failed, using cached status:', e);
      } finally {
        setPurchasesInitialized(true);
      }

      unsubscribe = addSubscriptionListener((isPremium, expirationDate, willRenew) => {
        setSubscriptionStatus(isPremium, expirationDate, willRenew);
      });
    }

    setupPurchases();
    return () => {
      unsubscribe?.();
      cleanupPurchases();
    };
  }, []);

  useEffect(() => {
    preloadAudioAssets((loaded, total) => {
      setAudioLoadProgress(loaded / total);
    });
  }, []);

  if (!loaded && !error) {
    return (
      <View style={{ flex: 1, backgroundColor: '#fdf2f7' }}>
        <AnimatedSplash onFinish={() => {}} />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
        <View style={{ flex: 1 }}>
          <StatusBar style="dark" />
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { flex: 1, backgroundColor: colors.background },
              animation: 'slide_from_right',
              headerBackTitle: '',
            }}
          >
            <Stack.Screen name="index" />
            <Stack.Screen name="onboarding" options={{ animation: 'fade' }} />
            <Stack.Screen name="paywall" options={{ headerShown: false, animation: 'fade', gestureEnabled: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false, headerBackTitle: ' ', title: '' }} />
            <Stack.Screen name="lesson/hangul/index" options={{ headerShown: true, title: 'Hangul', headerBackTitle: ' ', headerTintColor: colors.primaryDark, headerStyle: { backgroundColor: colors.background } }} />
            <Stack.Screen name="lesson/hangul/[characterId]" options={{ headerShown: true, title: '', headerBackTitle: ' ', headerTintColor: colors.primaryDark, headerStyle: { backgroundColor: colors.background } }} />
            <Stack.Screen name="lesson/vocab/index" options={{ headerShown: true, title: 'Vocabulary', headerBackTitle: ' ', headerTintColor: colors.primaryDark, headerStyle: { backgroundColor: colors.background } }} />
            <Stack.Screen name="lesson/vocab/[categoryId]" options={{ headerShown: true, title: '', headerBackTitle: ' ', headerTintColor: colors.primaryDark, headerStyle: { backgroundColor: colors.background } }} />
            <Stack.Screen name="lesson/vocab/review" options={{ headerShown: true, title: 'Review', headerBackTitle: ' ', headerTintColor: colors.primaryDark, headerStyle: { backgroundColor: colors.background } }} />
            <Stack.Screen name="lesson/grammar/index" options={{ headerShown: true, title: 'Grammar', headerBackTitle: ' ', headerTintColor: colors.primaryDark, headerStyle: { backgroundColor: colors.background } }} />
            <Stack.Screen name="lesson/grammar/[lessonId]" options={{ headerShown: true, title: '', headerBackTitle: ' ', headerTintColor: colors.primaryDark, headerStyle: { backgroundColor: colors.background } }} />
            <Stack.Screen name="lesson/sentences/index" options={{ headerShown: true, title: 'Sentences', headerBackTitle: '', headerTintColor: colors.primaryDark, headerStyle: { backgroundColor: colors.background } }} />
            <Stack.Screen name="lesson/sentences/[levelId]" options={{ headerShown: true, title: '', headerBackTitle: '', headerTintColor: colors.primaryDark, headerStyle: { backgroundColor: colors.background } }} />
            <Stack.Screen name="lesson/reading/index" options={{ headerShown: true, title: 'Reading', headerBackTitle: '', headerTintColor: colors.primaryDark, headerStyle: { backgroundColor: colors.background } }} />
            <Stack.Screen name="lesson/reading/[passageId]" options={{ headerShown: true, title: '', headerBackTitle: '', headerTintColor: colors.primaryDark, headerStyle: { backgroundColor: colors.background } }} />
            <Stack.Screen name="lesson/manga/index" options={{ headerShown: true, title: 'Stories', headerBackTitle: '', headerTintColor: '#fff', headerStyle: { backgroundColor: colors.darkBg } }} />
            <Stack.Screen name="lesson/manga/[chapterId]" options={{ headerShown: true, title: '', headerBackTitle: '', headerTintColor: '#fff', headerStyle: { backgroundColor: colors.darkBg } }} />
            <Stack.Screen name="lesson/tongue/index" options={{ headerShown: true, title: 'Tongue Guide', headerBackTitle: '', headerTintColor: colors.primaryDark, headerStyle: { backgroundColor: colors.background } }} />
            <Stack.Screen name="lesson/tongue/[soundId]" options={{ headerShown: true, title: '', headerBackTitle: '', headerTintColor: colors.primaryDark, headerStyle: { backgroundColor: colors.background } }} />
            <Stack.Screen name="lesson/pronunciation/index" options={{ headerShown: true, title: 'Pronunciation', headerBackTitle: '', headerTintColor: colors.primaryDark, headerStyle: { backgroundColor: colors.background } }} />
            <Stack.Screen name="lesson/pronunciation/[lessonId]" options={{ headerShown: true, title: '', headerBackTitle: '', headerTintColor: colors.primaryDark, headerStyle: { backgroundColor: colors.background } }} />
            <Stack.Screen name="lesson/handwriting/index" options={{ headerShown: true, title: 'Handwriting', headerBackTitle: '', headerTintColor: colors.primaryDark, headerStyle: { backgroundColor: colors.background } }} />
            <Stack.Screen name="lesson/handwriting/[lessonId]" options={{ headerShown: true, title: '', headerBackTitle: '', headerTintColor: colors.primaryDark, headerStyle: { backgroundColor: colors.background } }} />
            <Stack.Screen name="lesson/listening/index" options={{ headerShown: true, title: 'Listening', headerBackTitle: '', headerTintColor: colors.primaryDark, headerStyle: { backgroundColor: colors.background } }} />
            <Stack.Screen name="lesson/listening/[exerciseType]" options={{ headerShown: true, title: 'Listening Practice', headerBackTitle: '', headerTintColor: colors.primaryDark, headerStyle: { backgroundColor: colors.background } }} />
            <Stack.Screen name="lesson/culture/index" options={{ headerShown: true, title: 'Culture', headerBackTitle: '', headerTintColor: colors.primaryDark, headerStyle: { backgroundColor: colors.background } }} />
            <Stack.Screen name="lesson/culture/[lessonId]" options={{ headerShown: true, title: '', headerBackTitle: '', headerTintColor: colors.primaryDark, headerStyle: { backgroundColor: colors.background } }} />
            <Stack.Screen name="lesson/hanja/index" options={{ headerShown: true, title: 'Hanja', headerBackTitle: '', headerTintColor: colors.primaryDark, headerStyle: { backgroundColor: colors.background } }} />
            <Stack.Screen name="lesson/hanja/[hanjaId]" options={{ headerShown: true, title: '', headerBackTitle: '', headerTintColor: colors.primaryDark, headerStyle: { backgroundColor: colors.background } }} />
            <Stack.Screen name="lesson/stories/index" options={{ headerShown: true, title: 'Stories', headerBackTitle: '', headerTintColor: colors.primaryDark, headerStyle: { backgroundColor: colors.background } }} />
            <Stack.Screen name="lesson/stories/[storyId]" options={{ headerShown: true, title: '', headerBackTitle: '', headerTintColor: colors.primaryDark, headerStyle: { backgroundColor: colors.background } }} />
            <Stack.Screen name="lesson/slang/index" options={{ headerShown: true, title: 'Slang', headerBackTitle: ' ', headerTintColor: colors.primaryDark, headerStyle: { backgroundColor: colors.background } }} />
            <Stack.Screen name="lesson/videos/index" options={{ headerShown: true, title: 'Watch', headerBackTitle: '', headerTintColor: colors.primaryDark, headerStyle: { backgroundColor: colors.background } }} />
            <Stack.Screen name="quiz/[quizId]" options={{ headerShown: true, title: 'Quiz', headerBackTitle: ' ', headerTintColor: colors.primaryDark, headerStyle: { backgroundColor: colors.background } }} />
            <Stack.Screen name="chat" options={{ headerShown: false, presentation: 'modal', animation: 'slide_from_bottom' }} />
            <Stack.Screen name="quiz/results" options={{ headerShown: false, animation: 'fade' }} />
            <Stack.Screen name="dictionary" options={{ headerShown: true, title: 'Dictionary', headerBackTitle: '', headerTintColor: colors.primaryDark, headerStyle: { backgroundColor: colors.background } }} />
            <Stack.Screen name="my-words" options={{ headerShown: true, title: 'My Words', headerBackTitle: '', headerTintColor: colors.primaryDark, headerStyle: { backgroundColor: colors.background } }} />
            <Stack.Screen name="practice-words" options={{ headerShown: true, title: 'Practice Words', headerBackTitle: '', headerTintColor: colors.primaryDark, headerStyle: { backgroundColor: colors.background } }} />
            <Stack.Screen name="fast-hangul" options={{ headerShown: true, title: 'Fast Hangul', headerBackTitle: '', headerTintColor: colors.primaryDark, headerStyle: { backgroundColor: colors.background } }} />
            <Stack.Screen name="daily" options={{ headerShown: true, title: "Today's Lesson", headerBackTitle: ' ', headerTintColor: colors.primaryDark, headerStyle: { backgroundColor: colors.background } }} />
            <Stack.Screen name="lesson/grammar/practice/[lessonId]" options={{ headerShown: true, title: 'Practice', headerBackTitle: ' ', headerTintColor: colors.primaryDark, headerStyle: { backgroundColor: colors.background } }} />
            <Stack.Screen name="path/index" options={{ headerShown: true, title: 'Learning Paths', headerBackTitle: ' ', headerTintColor: colors.primaryDark, headerStyle: { backgroundColor: colors.background } }} />
            <Stack.Screen name="path/[pathId]" options={{ headerShown: true, title: '', headerBackTitle: ' ', headerTintColor: colors.primaryDark, headerStyle: { backgroundColor: colors.background } }} />
            <Stack.Screen name="lesson/writing/index" options={{ headerShown: true, title: 'Writing', headerBackTitle: '', headerTintColor: colors.primaryDark, headerStyle: { backgroundColor: colors.background } }} />
            <Stack.Screen name="lesson/writing/[type]" options={{ headerShown: true, title: 'Writing Practice', headerBackTitle: '', headerTintColor: colors.primaryDark, headerStyle: { backgroundColor: colors.background } }} />
            <Stack.Screen name="lesson/native/index" options={{ headerShown: true, title: 'Real Korean', headerBackTitle: '', headerTintColor: colors.primaryDark, headerStyle: { backgroundColor: colors.background } }} />
            <Stack.Screen name="lesson/native/[contentId]" options={{ headerShown: true, title: '', headerBackTitle: '', headerTintColor: colors.primaryDark, headerStyle: { backgroundColor: colors.background } }} />
            <Stack.Screen name="settings" options={{ headerShown: true, title: 'Settings', headerBackTitle: ' ', headerTintColor: colors.primaryDark, headerStyle: { backgroundColor: colors.background } }} />
            <Stack.Screen name="sleep" options={{ headerShown: false, animation: 'slide_from_bottom' }} />
          </Stack>
          {showChatBubble ? <ChatBubble /> : null}
          {showAnimatedSplash && <AnimatedSplash onFinish={() => setShowAnimatedSplash(false)} loadingProgress={audioLoadProgress} />}
        </View>
    </SafeAreaProvider>
  );
}

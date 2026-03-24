import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { colors } from '@/lib/theme';
import { useAppFonts } from '@/lib/fonts';
import { AudioProvider } from '@/components/AudioProvider';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { loaded, error } = useAppFonts();

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <AudioProvider>
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
        <Stack.Screen name="lesson/culture/index" options={{ headerShown: true, title: 'Culture', headerBackTitle: '', headerTintColor: colors.primaryDark, headerStyle: { backgroundColor: colors.background } }} />
        <Stack.Screen name="lesson/culture/[lessonId]" options={{ headerShown: true, title: '', headerBackTitle: '', headerTintColor: colors.primaryDark, headerStyle: { backgroundColor: colors.background } }} />
        <Stack.Screen name="lesson/slang/index" options={{ headerShown: true, title: 'Slang', headerBackTitle: ' ', headerTintColor: colors.primaryDark, headerStyle: { backgroundColor: colors.background } }} />
        <Stack.Screen name="lesson/videos/index" options={{ headerShown: true, title: 'Watch', headerBackTitle: '', headerTintColor: colors.primaryDark, headerStyle: { backgroundColor: colors.background } }} />
        <Stack.Screen name="quiz/[quizId]" options={{ headerShown: true, title: 'Quiz', headerBackTitle: ' ', headerTintColor: colors.primaryDark, headerStyle: { backgroundColor: colors.background } }} />
        <Stack.Screen name="chat" options={{ headerShown: false, presentation: 'modal', animation: 'slide_from_bottom' }} />
        <Stack.Screen name="quiz/results" options={{ headerShown: false, animation: 'fade' }} />
        <Stack.Screen name="dictionary" options={{ headerShown: true, title: 'Dictionary', headerBackTitle: '', headerTintColor: colors.primaryDark, headerStyle: { backgroundColor: colors.background } }} />
        <Stack.Screen name="my-words" options={{ headerShown: true, title: 'My Words', headerBackTitle: '', headerTintColor: colors.primaryDark, headerStyle: { backgroundColor: colors.background } }} />
        <Stack.Screen name="settings" options={{ headerShown: true, title: 'Settings', headerBackTitle: ' ', headerTintColor: colors.primaryDark, headerStyle: { backgroundColor: colors.background } }} />
        <Stack.Screen name="sleep" options={{ headerShown: false, animation: 'slide_from_bottom' }} />
      </Stack>
    </AudioProvider>
  );
}

import { Redirect } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { useAppStore } from '@/lib/store';
import { colors } from '@/lib/theme';

export default function Index() {
  const hasOnboarded = useAppStore((s) => s.hasOnboarded);
  const isPremium = useAppStore((s) => s.isPremium);
  const purchasesInitialized = useAppStore((s) => s.purchasesInitialized);

  if (!purchasesInitialized) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!hasOnboarded) {
    return <Redirect href="/onboarding" />;
  }

  if (!isPremium) {
    return <Redirect href={'/paywall' as any} />;
  }

  return <Redirect href="/(tabs)" />;
}

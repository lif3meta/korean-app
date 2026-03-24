import { Redirect } from 'expo-router';
import { useAppStore } from '@/lib/store';

export default function Index() {
  const hasOnboarded = useAppStore((s) => s.hasOnboarded);

  if (!hasOnboarded) {
    return <Redirect href="/onboarding" />;
  }
  return <Redirect href="/(tabs)" />;
}

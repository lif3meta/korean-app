import { useFonts } from 'expo-font';

export function useAppFonts() {
  const [loaded, error] = useFonts({
    // Keep Poppins for backward compat (Korean text rendering)
    'Poppins-Regular': require('@/assets/fonts/Poppins-Regular.ttf'),
    'Poppins-Medium': require('@/assets/fonts/Poppins-Medium.ttf'),
    'Poppins-SemiBold': require('@/assets/fonts/Poppins-SemiBold.ttf'),
    'Poppins-Bold': require('@/assets/fonts/Poppins-Bold.ttf'),
    'Poppins-ExtraBold': require('@/assets/fonts/Poppins-ExtraBold.ttf'),
    'Poppins-Black': require('@/assets/fonts/Poppins-Black.ttf'),
    // New design system fonts
    'Jakarta-Regular': require('@/assets/fonts/PlusJakartaSans-Regular.ttf'),
    'Jakarta-Medium': require('@/assets/fonts/PlusJakartaSans-Medium.ttf'),
    'Jakarta-SemiBold': require('@/assets/fonts/PlusJakartaSans-SemiBold.ttf'),
    'Jakarta-Bold': require('@/assets/fonts/PlusJakartaSans-Bold.ttf'),
    'Jakarta-ExtraBold': require('@/assets/fonts/PlusJakartaSans-ExtraBold.ttf'),
  });
  return { loaded, error };
}

export const fonts = {
  // Legacy (still used in some components)
  regular: 'Poppins-Regular',
  medium: 'Poppins-Medium',
  semiBold: 'Poppins-SemiBold',
  bold: 'Poppins-Bold',
  extraBold: 'Poppins-ExtraBold',
  black: 'Poppins-Black',
  // New design system
  headline: 'Jakarta-ExtraBold',
  headlineBold: 'Jakarta-Bold',
  headlineSemiBold: 'Jakarta-SemiBold',
  body: 'Jakarta-Regular',
  bodyMedium: 'Jakarta-Medium',
  bodySemiBold: 'Jakarta-SemiBold',
  label: 'Jakarta-Bold',
} as const;

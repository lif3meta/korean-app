import { Dimensions } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// "Lzy Learn Korean" Design System
// Material Design 3 palette: warm rose primary, sage secondary, lavender tertiary
export const colors = {
  // Primary: Dusty rose / mauve
  primary: '#7b5466',
  primaryLight: '#F4C2D7',
  primaryDark: '#654051',
  primaryPale: '#fcc9df',
  primaryFaint: '#fdf2f7',
  primaryContainer: '#fcc9df',

  // Secondary: Sage / mint
  secondary: '#3a675a',
  secondaryLight: '#bceddc',
  secondaryContainer: '#bceddc',

  // Tertiary: Lavender
  tertiary: '#695f7f',
  tertiaryLight: '#e4d7fd',
  tertiaryContainer: '#e4d7fd',

  // Accent (maps to pink-500 for interactive)
  accent: '#ec4899',
  accentLight: '#fce7f3',
  accentGlow: 'rgba(236, 72, 153, 0.2)',

  // Backgrounds & surfaces
  background: '#ffffff',
  surface: '#ffffff',
  surfaceElevated: 'rgba(255, 255, 255, 0.9)',
  surfaceLow: '#f3f3f5',
  surfaceContainer: '#edeef0',
  surfaceHigh: '#e7e8ea',
  surfaceDim: '#d8dadd',
  darkOverlay: 'rgba(13, 14, 15, 0.85)',
  darkBg: '#0f172a',

  // Warm pastel tints (for category cards & backgrounds)
  warmPink: '#fdf2f7',
  warmMint: '#f0f9f6',
  warmLavender: '#f3f0ff',
  warmCream: '#fff9e6',

  // Text
  textPrimary: '#303335',
  textSecondary: '#5c5f62',
  textTertiary: '#94a3b8',
  textOnPrimary: '#ffffff',
  textOnDark: '#ffffff',

  // Semantic
  success: '#10b981',
  successLight: '#d1fae5',
  successBg: 'rgba(16, 185, 129, 0.08)',
  warning: '#f59e0b',
  warningLight: '#fef3c7',
  danger: '#ef4444',
  dangerLight: '#fee2e2',
  dangerBg: 'rgba(239, 68, 68, 0.08)',

  // Borders
  border: '#e2e8f0',
  borderLight: '#f1f5f9',

  // Korean flag
  koreanRed: '#CD2E3A',
  koreanBlue: '#0047A0',

  // Gradients
  gradientPrimary: ['#7b5466', '#fcc9df'] as const,
  gradientHeader: ['#7b5466', '#a07080', '#fcc9df'] as const,
  gradientAccent: ['#3a675a', '#bceddc'] as const,
  gradientWarm: ['#F4C2D7', '#fcc9df'] as const,
  gradientGold: ['#FFD740', '#FFC107'] as const,
  gradientDark: ['#0f172a', '#1e293b'] as const,
  gradientPink: ['#ec4899', '#f472b6'] as const,
  gradientSlate: ['#1e293b', '#334155'] as const,
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 48,
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  pill: 40,
  full: 999,
};

export const typography = {
  largeTitle: {
    fontSize: 36,
    fontFamily: 'Jakarta-ExtraBold',
    letterSpacing: -0.5,
  },
  title: {
    fontSize: 30,
    fontFamily: 'Jakarta-ExtraBold',
    letterSpacing: -0.3,
  },
  title2: {
    fontSize: 24,
    fontFamily: 'Jakarta-Bold',
    letterSpacing: -0.2,
  },
  title3: {
    fontSize: 20,
    fontFamily: 'Jakarta-Bold',
  },
  headline: {
    fontSize: 18,
    fontFamily: 'Jakarta-SemiBold',
  },
  body: {
    fontSize: 16,
    fontFamily: 'Jakarta-Regular',
  },
  bodyBold: {
    fontSize: 16,
    fontFamily: 'Jakarta-SemiBold',
  },
  callout: {
    fontSize: 16,
    fontFamily: 'Jakarta-Regular',
  },
  subhead: {
    fontSize: 15,
    fontFamily: 'Jakarta-Medium',
  },
  footnote: {
    fontSize: 13,
    fontFamily: 'Jakarta-Regular',
  },
  caption: {
    fontSize: 12,
    fontFamily: 'Jakarta-Medium',
  },
  captionBold: {
    fontSize: 12,
    fontFamily: 'Jakarta-Bold',
  },
  label: {
    fontSize: 10,
    fontFamily: 'Jakarta-Bold',
    letterSpacing: 1.5,
  },
  korean: {
    fontSize: 48,
    letterSpacing: -0.5,
  },
  koreanLarge: {
    fontSize: 72,
    letterSpacing: -1,
  },
  koreanMedium: {
    fontSize: 32,
    letterSpacing: -0.3,
  },
};

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 5,
  },
  bubbly: {
    shadowColor: '#3c3914',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.04,
    shadowRadius: 20,
    elevation: 3,
  },
  glow: {
    shadowColor: '#7b5466',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 6,
  },
  accentGlow: {
    shadowColor: '#3a675a',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 4,
  },
  pinkGlow: {
    shadowColor: '#fcc9df',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },
};

export const layout = {
  screenWidth: SCREEN_WIDTH,
  screenHeight: SCREEN_HEIGHT,
  screenPadding: spacing.xxl,
  cardPadding: spacing.xxl,
  headerHeight: 100,
  tabBarHeight: 85,
};

export const animations = {
  spring: {
    damping: 15,
    stiffness: 150,
    mass: 1,
  },
  springBouncy: {
    damping: 10,
    stiffness: 200,
    mass: 0.8,
  },
  timing: {
    fast: 200,
    normal: 300,
    slow: 500,
  },
};

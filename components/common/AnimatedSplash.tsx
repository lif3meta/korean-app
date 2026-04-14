import React, { useEffect, useRef, useMemo } from 'react';
import { View, Text, StyleSheet, Image, Animated, Dimensions, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing } from '@/lib/theme';

const { width: W, height: H } = Dimensions.get('window');

const HANGUL_CHARS = [
  'ㄱ', 'ㄴ', 'ㄷ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅅ', 'ㅇ', 'ㅈ',
  'ㅎ', 'ㅏ', 'ㅓ', 'ㅗ', 'ㅜ', 'ㅡ', 'ㅣ', '한', '글',
  '가', '나', '다', '라', '마', '바', '사', '아', '자', '하',
];

const PARTICLE_COUNT = 18;

interface Props {
  onFinish: () => void;
  loadingProgress?: number; // 0..1
}

function FloatingChar({ char, delay, x, size, duration }: {
  char: string; delay: number; x: number; size: number; duration: number;
}) {
  const translateY = useRef(new Animated.Value(H + 40)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const rotate = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const startDelay = delay;
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: -60,
          duration,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.timing(opacity, { toValue: 0.15, duration: 600, useNativeDriver: true }),
          Animated.delay(duration - 1200),
          Animated.timing(opacity, { toValue: 0, duration: 600, useNativeDriver: true }),
        ]),
        Animated.timing(rotate, {
          toValue: 1,
          duration,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ]).start();
    }, startDelay);
  }, []);

  const spin = rotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['-15deg', '15deg'],
  });

  return (
    <Animated.Text
      style={[
        styles.floatingChar,
        {
          left: x,
          fontSize: size,
          opacity,
          transform: [{ translateY }, { rotate: spin }],
        },
      ]}
    >
      {char}
    </Animated.Text>
  );
}

export function AnimatedSplash({ onFinish, loadingProgress = 0 }: Props) {
  // Main animations
  const containerOpacity = useRef(new Animated.Value(1)).current;
  const iconScale = useRef(new Animated.Value(0)).current;
  const iconOpacity = useRef(new Animated.Value(0)).current;
  const brandOpacity = useRef(new Animated.Value(0)).current;
  const brandTranslateY = useRef(new Animated.Value(24)).current;
  const koreanOpacity = useRef(new Animated.Value(0)).current;
  const koreanTranslateY = useRef(new Animated.Value(16)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;
  const barWidth = useRef(new Animated.Value(0)).current;
  const glowOpacity = useRef(new Animated.Value(0.3)).current;
  const animationDone = useRef(false);
  const loadingDone = useRef(false);

  // Drive bar from real loading progress
  useEffect(() => {
    Animated.timing(barWidth, {
      toValue: loadingProgress,
      duration: 200,
      useNativeDriver: false,
    }).start();
    if (loadingProgress >= 1) {
      loadingDone.current = true;
      if (animationDone.current) {
        Animated.timing(containerOpacity, {
          toValue: 0,
          duration: 350,
          useNativeDriver: true,
        }).start(() => onFinish());
      }
    }
  }, [loadingProgress]);

  // Generate particles
  const particles = useMemo(() => {
    return Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
      id: i,
      char: HANGUL_CHARS[Math.floor(Math.random() * HANGUL_CHARS.length)],
      x: Math.random() * (W - 30),
      size: 16 + Math.random() * 22,
      delay: Math.random() * 800,
      duration: 3000 + Math.random() * 2000,
    }));
  }, []);

  useEffect(() => {
    // Pulsing glow behind icon
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowOpacity, { toValue: 0.6, duration: 800, useNativeDriver: true }),
        Animated.timing(glowOpacity, { toValue: 0.2, duration: 800, useNativeDriver: true }),
      ])
    ).start();

    // Icon bounces in
    Animated.parallel([
      Animated.spring(iconScale, {
        toValue: 1,
        damping: 10,
        stiffness: 120,
        mass: 0.8,
        useNativeDriver: true,
      }),
      Animated.timing(iconOpacity, {
        toValue: 1,
        duration: 350,
        useNativeDriver: true,
      }),
    ]).start();

    // Brand name slides up
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(brandOpacity, { toValue: 1, duration: 450, useNativeDriver: true }),
        Animated.spring(brandTranslateY, { toValue: 0, damping: 14, stiffness: 100, useNativeDriver: true }),
      ]).start();
    }, 350);

    // Korean subtitle
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(koreanOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.spring(koreanTranslateY, { toValue: 0, damping: 14, stiffness: 100, useNativeDriver: true }),
      ]).start();
    }, 550);

    // Tagline
    setTimeout(() => {
      Animated.timing(taglineOpacity, { toValue: 1, duration: 350, useNativeDriver: true }).start();
    }, 750);

    // Animation minimum time — wait for loading to finish
    setTimeout(() => {
      animationDone.current = true;
      if (loadingDone.current) {
        Animated.timing(containerOpacity, {
          toValue: 0,
          duration: 350,
          useNativeDriver: true,
        }).start(() => onFinish());
      }
    }, 2000);
  }, []);

  const barWidthInterp = barWidth.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <Animated.View style={[styles.container, { opacity: containerOpacity }]}>
      <LinearGradient
        colors={['#0f172a', '#1a1a2e', '#16213e']}
        style={styles.gradient}
      >
        {/* Floating Hangul particles */}
        {particles.map((p) => (
          <FloatingChar key={p.id} {...p} />
        ))}

        {/* Glow circle */}
        <Animated.View style={[styles.glow, { opacity: glowOpacity }]} />

        {/* Icon */}
        <Animated.View
          style={[
            styles.iconWrap,
            { opacity: iconOpacity, transform: [{ scale: iconScale }] },
          ]}
        >
          <Image source={require('@/assets/icon.png')} style={styles.icon} />
        </Animated.View>

        {/* Brand name */}
        <Animated.View
          style={{
            opacity: brandOpacity,
            transform: [{ translateY: brandTranslateY }],
          }}
        >
          <Text style={styles.brand}>
            <Text style={styles.brandAccent}>Lzy</Text>
            {'  '}Learn Korean
          </Text>
        </Animated.View>

        {/* Korean text */}
        <Animated.View
          style={{
            opacity: koreanOpacity,
            transform: [{ translateY: koreanTranslateY }],
          }}
        >
          <Text style={styles.korean}>한국어를 배워요</Text>
        </Animated.View>

        {/* Tagline */}
        <Animated.View style={{ opacity: taglineOpacity }}>
          <Text style={styles.tagline}>Learn Korean the lazy way</Text>
        </Animated.View>

        {/* Loading bar */}
        <View style={styles.barTrack}>
          <Animated.View style={[styles.barFill, { width: barWidthInterp as any }]}>
            <LinearGradient
              colors={[colors.accent, colors.primaryLight]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={StyleSheet.absoluteFill}
            />
          </Animated.View>
        </View>
        <Text style={styles.loadingText}>
          {loadingProgress < 1 ? 'Loading audio...' : 'Ready!'}
        </Text>
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 99999,
  },
  gradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },

  // Floating chars
  floatingChar: {
    position: 'absolute',
    color: 'rgba(255, 255, 255, 0.12)',
    fontWeight: '700',
  },

  // Glow
  glow: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: colors.accent,
    top: H * 0.5 - 160,
    opacity: 0.3,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 80,
  },

  // Icon
  iconWrap: {
    width: 120,
    height: 120,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  icon: {
    width: 96,
    height: 96,
    borderRadius: 24,
  },

  // Text
  brand: {
    fontSize: W < 350 ? 20 : 24,
    fontFamily: 'Jakarta-ExtraBold',
    color: '#ffffff',
    textAlign: 'center',
    letterSpacing: -0.3,
    paddingHorizontal: spacing.xl,
    flexShrink: 1,
    flexWrap: 'wrap',
  },
  brandAccent: {
    color: colors.accent,
    fontStyle: 'italic',
  },
  korean: {
    fontSize: 15,
    fontFamily: 'Jakarta-SemiBold',
    color: 'rgba(255, 255, 255, 0.5)',
    textAlign: 'center',
    marginTop: 8,
    letterSpacing: 1,
    paddingHorizontal: spacing.xl,
  },
  tagline: {
    fontSize: 13,
    fontFamily: 'Jakarta-Regular',
    color: 'rgba(255, 255, 255, 0.3)',
    textAlign: 'center',
    marginTop: 20,
    paddingHorizontal: spacing.xl,
  },

  // Loading bar
  barTrack: {
    position: 'absolute',
    bottom: 80,
    width: 140,
    height: 3,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 2,
    overflow: 'hidden',
  },
  loadingText: {
    position: 'absolute',
    bottom: 56,
    fontSize: 11,
    fontFamily: 'Jakarta-Regular',
    color: 'rgba(255, 255, 255, 0.25)',
    textAlign: 'center',
  },
});

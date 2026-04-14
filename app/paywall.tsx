import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, Image, Dimensions, Linking, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { colors, borderRadius, spacing, typography, shadows } from '@/lib/theme';
import { Button } from '@/components/ui/Button';
import { useAppStore } from '@/lib/store';
import {
  getSubscriptionProducts,
  purchaseSubscription,
  restorePurchases,
  checkSubscriptionStatus,
  MONTHLY_SUBSCRIPTION_PRODUCT_ID,
  type StoreProduct,
} from '@/lib/purchases';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const isSmallScreen = SCREEN_HEIGHT < 700;

const features: { icon: keyof typeof Ionicons.glyphMap; label: string; color: string }[] = [
  { icon: 'text', label: 'Hangul Mastery', color: colors.primary },
  { icon: 'chatbubbles', label: 'AI Chat Teachers', color: colors.accent },
  { icon: 'mic', label: '100 min Voice Chat/mo', color: colors.secondary },
  { icon: 'book', label: 'Manga Stories', color: colors.tertiary },
  { icon: 'checkmark-circle', label: 'Quizzes & SRS', color: '#FF9800' },
  { icon: 'volume-high', label: 'Pronunciation', color: '#0ea5e9' },
  { icon: 'leaf', label: 'Culture & Slang', color: '#4CAF50' },
];

function pluralize(value: number, unit: string) {
  return value === 1 ? `${value} ${unit}` : `${value} ${unit}s`;
}

function getIosProduct(product: StoreProduct | null) {
  return product?.platform === 'ios' ? product : null;
}

function getBillingLabel(product: StoreProduct | null): string | null {
  const iosProduct = getIosProduct(product);
  if (!iosProduct) return product?.displayPrice ?? null;

  const periodUnit = iosProduct.subscriptionPeriodUnitIOS;
  const periodCount = Number(iosProduct.subscriptionPeriodNumberIOS ?? '1');

  if (!periodUnit || periodUnit === 'empty') {
    return iosProduct.displayPrice;
  }

  return `${iosProduct.displayPrice}/${pluralize(periodCount, periodUnit)}`;
}

function getTrialLabel(product: StoreProduct | null): string | null {
  const iosProduct = getIosProduct(product);
  if (!iosProduct) return null;

  const introUnit = iosProduct.introductoryPriceSubscriptionPeriodIOS;
  const introPeriods = Number(iosProduct.introductoryPriceNumberOfPeriodsIOS ?? '0');
  const introPrice = iosProduct.introductoryPriceIOS?.toLowerCase() ?? '';
  const introAmount = Number(iosProduct.introductoryPriceAsAmountIOS ?? 'NaN');
  const isFreeTrial =
    (Number.isFinite(introAmount) && introAmount === 0) || introPrice.includes('free');

  if (!isFreeTrial || !introUnit || introUnit === 'empty' || introPeriods <= 0) {
    return null;
  }

  return pluralize(introPeriods, introUnit);
}

export default function PaywallScreen() {
  const [product, setProduct] = useState<StoreProduct | null>(null);
  const [purchasing, setPurchasing] = useState(false);
  const [restoring, setRestoring] = useState(false);
  const [loadingSubscription, setLoadingSubscription] = useState(true);
  const [subscriptionLoadFailed, setSubscriptionLoadFailed] = useState(false);
  const isPremium = useAppStore((s) => s.isPremium);

  async function refreshSubscriptionState() {
    const status = await checkSubscriptionStatus();
    useAppStore.getState().setSubscriptionStatus(
      status.isPremium,
      status.expirationDate,
      status.willRenew,
    );
    return status;
  }

  useEffect(() => {
    if (isPremium) {
      router.replace('/(tabs)');
    }
  }, [isPremium]);

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts(retries = 2) {
    setLoadingSubscription(true);
    setSubscriptionLoadFailed(false);

    try {
      const products = await getSubscriptionProducts();
      if (products.length > 0) {
        console.log('[Paywall] Loaded products:', products.map((p) => p.id));
        setProduct(products[0]);
        setLoadingSubscription(false);
        return;
      }

      throw new Error('No subscription products were returned by the App Store.');
    } catch (e) {
      console.warn('[Paywall] Failed to load subscription products:', e);
      if (retries > 0) {
        console.log('[Paywall] Retrying subscription load...');
        setTimeout(() => loadProducts(retries - 1), 1500);
        return;
      }

      setProduct(null);
      setSubscriptionLoadFailed(true);
      setLoadingSubscription(false);
    }
  }

  const billingLabel = getBillingLabel(product);
  const trialLabel = getTrialLabel(product);
  const canSubscribe = !!product;
  const ctaTitle = purchasing
    ? 'Processing...'
    : loadingSubscription
      ? 'Loading subscription...'
      : subscriptionLoadFailed
        ? 'Retry Loading'
        : trialLabel
          ? 'Start Free Trial'
          : 'Subscribe';

  async function handleSubscribe() {
    if (!canSubscribe) {
      Alert.alert(
        'Subscription Unavailable',
        'We could not load the App Store subscription yet. Please wait a moment and try again.'
      );
      void loadProducts(2);
      return;
    }

    setPurchasing(true);
    try {
      const success = await purchaseSubscription(MONTHLY_SUBSCRIPTION_PRODUCT_ID);

      if (success) {
        useAppStore.getState().setSubscriptionStatus(true, null, true);
        void refreshSubscriptionState();
        router.replace('/(tabs)');
      } else {
        Alert.alert('Purchase Pending', 'Your purchase did not finish. Please try again or restore purchases.');
      }
    } catch (e: any) {
      Alert.alert('Oops!', e.message || 'Something went wrong. Please try again.');
    } finally {
      setPurchasing(false);
    }
  }

  async function handleRestore() {
    setRestoring(true);
    try {
      const restored = await restorePurchases();
      const status = await refreshSubscriptionState();
      if (restored && status.isPremium) {
        router.replace('/(tabs)');
      } else {
        Alert.alert('No Subscription Found', 'We couldn\'t find an active subscription for your account.');
      }
    } catch (e: any) {
      Alert.alert('Restore Failed', e.message || 'Something went wrong. Please try again.');
    } finally {
      setRestoring(false);
    }
  }

  return (
    <View style={styles.container}>
      <ScrollView
        bounces={false}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <LinearGradient
          colors={['#fdf2f7', '#fcc9df', '#F4C2D7']}
          style={styles.hero}
        >
          <Image
            source={require('@/assets/images/sloth-mascot.png')}
            style={styles.mascot}
          />
          <View style={styles.speechBubble}>
            <Text style={styles.speechText}>Let's learn Korean together!</Text>
            <View style={styles.speechArrow} />
          </View>
        </LinearGradient>

        {/* Main Content */}
        <View style={styles.body}>
          <Text style={styles.title}>Unlock Everything</Text>
          <Text style={styles.subtitle}>
            {trialLabel && billingLabel
              ? `Try free for ${trialLabel}, then ${billingLabel}`
              : billingLabel
                ? `${billingLabel} billed through Apple`
                : 'Monthly subscription billed through Apple'}
          </Text>

          <Text style={styles.tierCompare}>
            Free: 10 min AI chat  {'\u2022'}  Premium: 100 min/month + all features
          </Text>

          {/* Feature Pills */}
          <View style={styles.pillGrid}>
            {features.map((f) => (
              <View key={f.label} style={styles.pill}>
                <Ionicons name={f.icon} size={14} color={f.color} />
                <Text style={styles.pillLabel}>{f.label}</Text>
              </View>
            ))}
          </View>

          {/* Pricing Card */}
          <LinearGradient
            colors={[colors.primary, colors.primaryDark]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.priceCard}
          >
            <View style={styles.priceCardBadge}>
              <Text style={styles.badgeText}>{trialLabel ? `${trialLabel.toUpperCase()} FREE` : 'MONTHLY PLAN'}</Text>
            </View>
            <Text style={styles.priceMain}>
              {product?.displayPrice ?? 'App Store price'}
              <Text style={styles.pricePer}>/month</Text>
            </Text>
            <Text style={styles.priceNote}>
              {trialLabel
                ? `Eligible new subscribers receive ${trialLabel} free. Cancel anytime.`
                : 'Cancel anytime. Billing is managed by Apple.'}
            </Text>
          </LinearGradient>

          {/* CTA */}
          <Button
            title={ctaTitle}
            onPress={handleSubscribe}
            variant="success"
            size="lg"
            loading={purchasing}
            disabled={purchasing || restoring || loadingSubscription}
            style={styles.ctaButton}
          />

          {loadingSubscription ? (
            <Text style={styles.statusText}>Connecting to the App Store...</Text>
          ) : null}

          {subscriptionLoadFailed ? (
            <Text style={styles.statusText}>
              Could not load subscription. Please try again.
            </Text>
          ) : null}

          <Button
            title={restoring ? 'Restoring...' : 'Restore Purchases'}
            onPress={handleRestore}
            variant="ghost"
            loading={restoring}
            disabled={purchasing || restoring}
            style={styles.restoreButton}
          />

          <Text style={styles.legal}>
            {billingLabel
              ? `Lzy Korean Premium — ${billingLabel}. ${trialLabel ? `${trialLabel} free trial for eligible subscribers. ` : ''}Auto-renews at ${product?.displayPrice ?? 'the displayed price'}/mo. Cancel anytime in Settings > Apple Account > Subscriptions.`
              : 'Auto-renewable subscription via Apple. Cancel anytime in Settings > Apple Account > Subscriptions.'}
          </Text>
          <Text style={styles.legalLinks}>
            <Text style={styles.legalLink} onPress={() => Linking.openURL('https://ulbmedia.com/terms/lzy-learn-korean')}>Terms</Text>
            {'  |  '}
            <Text style={styles.legalLink} onPress={() => Linking.openURL('https://ulbmedia.com/privacy/lzy-learn-korean')}>Privacy</Text>
            {'  |  '}
            <Text style={styles.legalLink} onPress={() => Linking.openURL('https://www.apple.com/legal/internet-services/itunes/dev/stdeula/')}>Apple EULA</Text>
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
  },

  // Hero
  hero: {
    alignItems: 'center',
    paddingTop: isSmallScreen ? 44 : 52,
    paddingBottom: isSmallScreen ? 8 : 12,
  },
  mascot: {
    width: isSmallScreen ? 80 : 100,
    height: isSmallScreen ? 80 : 100,
    resizeMode: 'contain',
  },
  speechBubble: {
    backgroundColor: '#fff',
    borderRadius: borderRadius.xl,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    marginTop: -2,
    ...shadows.md,
  },
  speechText: {
    ...typography.bodyBold,
    color: colors.primaryDark,
    textAlign: 'center',
    fontSize: 13,
  },
  speechArrow: {
    position: 'absolute',
    top: -8,
    alignSelf: 'center',
    left: '50%',
    marginLeft: -8,
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderBottomWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#fff',
  },

  // Body
  body: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.sm,
  },
  title: {
    ...typography.title2,
    color: colors.textPrimary,
    textAlign: 'center',
    fontSize: isSmallScreen ? 20 : 22,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 2,
    fontSize: 13,
  },

  tierCompare: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.xs,
    fontSize: 11,
  },

  // Feature Pills
  pillGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.warmPink,
    borderRadius: borderRadius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    gap: 3,
  },
  pillLabel: {
    ...typography.caption,
    color: colors.primaryDark,
    fontSize: 10,
  },

  // Price Card
  priceCard: {
    borderRadius: borderRadius.xl,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    marginTop: spacing.sm,
    ...shadows.glow,
    overflow: 'hidden',
  },
  priceCardBadge: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: borderRadius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: 2,
    marginBottom: spacing.xs,
  },
  badgeText: {
    ...typography.captionBold,
    color: '#fff',
    letterSpacing: 1.5,
    fontSize: 10,
  },
  priceMain: {
    fontSize: isSmallScreen ? 26 : 30,
    fontFamily: 'Jakarta-ExtraBold',
    color: '#fff',
    marginBottom: 2,
  },
  pricePer: {
    fontSize: 14,
    fontFamily: 'Jakarta-Regular',
    color: 'rgba(255,255,255,0.8)',
  },
  priceNote: {
    ...typography.footnote,
    color: 'rgba(255,255,255,0.7)',
    fontSize: 11,
  },

  // Bottom
  ctaButton: {
    width: '100%',
    marginTop: spacing.md,
    ...shadows.accentGlow,
  },
  restoreButton: {
    marginTop: spacing.xs,
    alignSelf: 'center',
  },
  statusText: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.sm,
    fontSize: 12,
  },
  legal: {
    ...typography.caption,
    color: colors.textTertiary,
    textAlign: 'center',
    marginTop: spacing.sm,
    lineHeight: 14,
    fontSize: 9,
  },
  legalLinks: {
    ...typography.caption,
    color: colors.textTertiary,
    textAlign: 'center',
    marginTop: spacing.xs,
    paddingBottom: spacing.lg,
    fontSize: 10,
  },
  legalLink: {
    color: colors.primary,
    textDecorationLine: 'underline',
  },
});

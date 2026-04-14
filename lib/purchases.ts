import { Platform, AppState } from 'react-native';
import {
  initConnection,
  endConnection,
  fetchProducts,
  getAvailablePurchases,
  getActiveSubscriptions,
  requestPurchase,
  finishTransaction,
  purchaseUpdatedListener,
  purchaseErrorListener,
  ErrorCode,
  type Purchase,
  type PurchaseIOS,
  type PurchaseError,
  type ProductSubscription,
} from 'react-native-iap';

export const MONTHLY_SUBSCRIPTION_PRODUCT_ID = 'com.hanflow.korean.premium.monthly';

export type StoreProduct = ProductSubscription;

let purchaseUpdateSub: { remove: () => void } | null = null;
let purchaseErrorSub: { remove: () => void } | null = null;
let pendingResolve: ((value: boolean) => void) | null = null;
let pendingReject: ((error: Error) => void) | null = null;

function toIsoDate(timestamp?: number | null): string | null {
  return typeof timestamp === 'number' ? new Date(timestamp).toISOString() : null;
}

function hasActiveSubscriptionAccess(
  expirationDateIOS?: number | null,
  willAutoRenew?: boolean | null,
): boolean {
  if (typeof expirationDateIOS === 'number') {
    return expirationDateIOS > Date.now();
  }

  return Boolean(willAutoRenew);
}

export async function initializePurchases(): Promise<void> {
  await initConnection();

  purchaseUpdateSub = purchaseUpdatedListener(async (purchase: Purchase) => {
    console.log('[IAP] Purchase updated:', purchase.productId, purchase.purchaseState);

    await finishTransaction({ purchase });

    if (purchase.productId === MONTHLY_SUBSCRIPTION_PRODUCT_ID) {
      pendingResolve?.(true);
      pendingResolve = null;
      pendingReject = null;
    }
  });

  purchaseErrorSub = purchaseErrorListener((error: PurchaseError) => {
    console.warn('[IAP] Purchase error:', error.code, error.message);

    if (error.code === ErrorCode.UserCancelled) {
      pendingResolve?.(false);
    } else {
      pendingReject?.(new Error(error.message || 'Purchase failed'));
    }
    pendingResolve = null;
    pendingReject = null;
  });
}

export async function cleanupPurchases(): Promise<void> {
  purchaseUpdateSub?.remove();
  purchaseErrorSub?.remove();
  purchaseUpdateSub = null;
  purchaseErrorSub = null;
  await endConnection();
}

export async function checkSubscriptionStatus(): Promise<{
  isPremium: boolean;
  expirationDate: string | null;
  willRenew: boolean;
}> {
  try {
    const activeSubs = await getActiveSubscriptions([MONTHLY_SUBSCRIPTION_PRODUCT_ID]);
    const sub = activeSubs.find((s) => s.productId === MONTHLY_SUBSCRIPTION_PRODUCT_ID);

    if (sub?.isActive || hasActiveSubscriptionAccess(sub?.expirationDateIOS, sub?.renewalInfoIOS?.willAutoRenew)) {
      const expirationDate = toIsoDate(sub?.expirationDateIOS);
      const willRenew = sub?.renewalInfoIOS?.willAutoRenew ?? true;
      return { isPremium: true, expirationDate, willRenew };
    }
  } catch (e) {
    console.warn('[IAP] getActiveSubscriptions failed, falling back:', e);
  }

  // Fallback: check all available purchases
  try {
    const purchases = await getAvailablePurchases({ onlyIncludeActiveItemsIOS: true });
    const purchase = purchases.find((p) => p.productId === MONTHLY_SUBSCRIPTION_PRODUCT_ID);

    if (purchase) {
      const ios = purchase as PurchaseIOS;
      const expirationDate = toIsoDate(ios.expirationDateIOS);
      const willRenew = ios.renewalInfoIOS?.willAutoRenew ?? purchase.isAutoRenewing ?? false;

      if (hasActiveSubscriptionAccess(ios.expirationDateIOS, willRenew)) {
        return { isPremium: true, expirationDate, willRenew };
      }
    }
  } catch (e) {
    console.warn('[IAP] getAvailablePurchases failed:', e);
  }

  return { isPremium: false, expirationDate: null, willRenew: false };
}

export async function getSubscriptionProducts(): Promise<StoreProduct[]> {
  const products = await fetchProducts({
    skus: [MONTHLY_SUBSCRIPTION_PRODUCT_ID],
    type: 'subs',
  });
  return (products as StoreProduct[]) ?? [];
}

export async function purchaseSubscription(sku: string): Promise<boolean> {
  return new Promise<boolean>((resolve, reject) => {
    pendingResolve = resolve;
    pendingReject = reject;

    const request =
      Platform.OS === 'ios'
        ? { apple: { sku } }
        : { google: { skus: [sku] } };

    requestPurchase({ request, type: 'subs' }).catch((e: any) => {
      pendingResolve = null;
      pendingReject = null;

      if (e.code === ErrorCode.UserCancelled) {
        resolve(false);
      } else {
        reject(e);
      }
    });
  });
}

export async function restorePurchases(): Promise<boolean> {
  const status = await checkSubscriptionStatus();
  return status.isPremium;
}

export function addSubscriptionListener(
  callback: (isPremium: boolean, expirationDate: string | null, willRenew: boolean) => void,
): () => void {
  const handleAppState = (state: string) => {
    if (state === 'active') {
      checkSubscriptionStatus()
        .then((status) => callback(status.isPremium, status.expirationDate, status.willRenew))
        .catch((e) => console.warn('[IAP] Foreground status check failed:', e));
    }
  };

  const subscription = AppState.addEventListener('change', handleAppState);
  return () => subscription.remove();
}

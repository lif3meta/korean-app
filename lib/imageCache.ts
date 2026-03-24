// Image caching - React Native's Image component already caches remote URLs
// This module provides a simple wrapper for consistency
// In production, consider using expo-image for better caching

const imageCache = new Map<string, boolean>();

export async function getCachedImage(remoteUrl: string): Promise<string> {
  // Mark URL as seen (React Native Image handles actual caching)
  imageCache.set(remoteUrl, true);
  return remoteUrl;
}

export function isImageCached(url: string): boolean {
  return imageCache.has(url);
}

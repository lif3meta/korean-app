import React, { useState, useEffect } from 'react';
import { Image, ImageStyle, ActivityIndicator, View, StyleProp } from 'react-native';
import { getCachedImage } from '@/lib/imageCache';
import { colors } from '@/lib/theme';

interface CachedImageProps {
  uri: string;
  style?: StyleProp<ImageStyle>;
  placeholder?: boolean;
}

export function CachedImage({ uri, style, placeholder = true }: CachedImageProps) {
  const [localUri, setLocalUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getCachedImage(uri).then((cached) => {
      if (!cancelled) {
        setLocalUri(cached);
        setLoading(false);
      }
    }).catch(() => {
      if (!cancelled) {
        setError(true);
        setLoading(false);
      }
    });
    return () => { cancelled = true; };
  }, [uri]);

  if (loading && placeholder) {
    return (
      <View style={[style, { alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primaryPale }]}>
        <ActivityIndicator size="small" color={colors.primary} />
      </View>
    );
  }

  if (error || !localUri) {
    return <View style={[style, { backgroundColor: colors.primaryPale }]} />;
  }

  return <Image source={{ uri: localUri }} style={style} />;
}

import React, { createContext, useContext, useRef, useEffect, useCallback, useState } from 'react';
import { View } from 'react-native';
import { WebView } from 'react-native-webview';
import { setAudioWebViewRef } from '@/lib/audio';

interface AudioContextType {
  playAudio: (text: string, language?: 'ko' | 'en', voice?: string) => void;
  stopAudio: () => void;
}

const AudioContext = createContext<AudioContextType>({
  playAudio: () => {},
  stopAudio: () => {},
});

export function useAudio() {
  return useContext(AudioContext);
}

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const webViewRef = useRef<WebView>(null);
  const [webViewReady, setWebViewReady] = useState(false);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      setAudioWebViewRef(null);
    };
  }, []);

  const handleWebViewRef = useCallback((ref: WebView | null) => {
    (webViewRef as React.MutableRefObject<WebView | null>).current = ref;
    // Only register if we have a valid ref; onLoad will re-register when ready
    if (ref) {
      console.log('[AudioProvider] WebView ref attached');
    }
  }, []);

  const handleWebViewLoad = useCallback(() => {
    console.log('[AudioProvider] WebView loaded and ready');
    setWebViewReady(true);
    // Register the ref now that the WebView is fully loaded
    setAudioWebViewRef(webViewRef.current);
  }, []);

  const playAudio = useCallback((text: string, language?: 'ko' | 'en', voice?: string) => {
    const wv = webViewRef.current;
    if (!wv) return;

    const defaultVoice = voice || 'nova';
    const cleanText = text.replace(/[*_#`~]/g, '').trim();
    if (!cleanText) return;

    const escaped = cleanText.replace(/'/g, "\\'").replace(/\n/g, ' ');
    wv.injectJavaScript(`
      (function() {
        if (window.currentAudio) { window.currentAudio.pause(); window.currentAudio = null; }
        var url = 'https://gen.pollinations.ai/audio/' + encodeURIComponent('${escaped}') + '?voice=${defaultVoice}&model=openai-audio';
        var audio = new Audio(url);
        audio.play().catch(function() {});
        window.currentAudio = audio;
      })();
      true;
    `);
  }, []);

  const stopAudio = useCallback(() => {
    const wv = webViewRef.current;
    if (!wv) return;
    wv.injectJavaScript(`
      if (window.currentAudio) { window.currentAudio.pause(); window.currentAudio = null; }
      true;
    `);
  }, []);

  return (
    <AudioContext.Provider value={{ playAudio, stopAudio }}>
      {children}
      <View style={{ height: 0, width: 0, opacity: 0, overflow: 'hidden', position: 'absolute' }}>
        <WebView
          ref={handleWebViewRef}
          source={{ html: '<html><body><script>window.onerror=function(m){window.ReactNativeWebView.postMessage("error:"+m)}</script></body></html>' }}
          style={{ width: 1, height: 1 }}
          javaScriptEnabled
          mediaPlaybackRequiresUserAction={false}
          allowsInlineMediaPlayback={true}
          onLoad={handleWebViewLoad}
          onError={(e) => console.warn('[AudioProvider] WebView error:', e.nativeEvent)}
        />
      </View>
    </AudioContext.Provider>
  );
}

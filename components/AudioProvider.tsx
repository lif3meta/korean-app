import React, { createContext, useContext, useRef, useEffect, useCallback } from 'react';
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

  useEffect(() => {
    // Register the webview ref globally in audio.ts so all existing
    // speakKorean/speakEnglish calls automatically use Pollinations
    setAudioWebViewRef(webViewRef.current);
    return () => {
      setAudioWebViewRef(null);
    };
  }, []);

  const handleWebViewRef = useCallback((ref: WebView | null) => {
    (webViewRef as React.MutableRefObject<WebView | null>).current = ref;
    setAudioWebViewRef(ref);
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
        <View style={{ flex: 1 }}>
          {children}
          <WebView
            ref={handleWebViewRef}
            source={{ html: '<html><body></body></html>' }}
            style={{ width: 0, height: 0, position: 'absolute', top: 0, left: 0, opacity: 0 }}
            javaScriptEnabled
            mediaPlaybackRequiresUserAction={false}
          />
        </View>
    </AudioContext.Provider>
  );
}

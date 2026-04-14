import React, { forwardRef, useImperativeHandle, useMemo, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView, WebViewMessageEvent } from 'react-native-webview';

type MicMessage =
  | { type: 'ready' }
  | { type: 'started'; sampleRate?: number }
  | { type: 'stopped' }
  | { type: 'audio_chunk'; data: string; mimeType: string }
  | { type: 'error'; message: string };

export type LiveMicWebViewHandle = {
  start: () => void;
  stop: () => void;
};

type Props = {
  onChunk: (base64Pcm: string, mimeType: string) => void;
  onStart?: () => void;
  onStop?: () => void;
  onError?: (message: string) => void;
};

const MIC_HTML = `
<!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
  </head>
  <body>
    <script>
      (function () {
        var targetSampleRate = 16000;
        var stream = null;
        var audioContext = null;
        var sourceNode = null;
        var processorNode = null;
        var gainNode = null;
        var isStreaming = false;

        function post(message) {
          window.ReactNativeWebView.postMessage(JSON.stringify(message));
        }

        function downsampleBuffer(buffer, inputRate, outputRate) {
          if (outputRate >= inputRate) {
            return buffer;
          }

          var sampleRateRatio = inputRate / outputRate;
          var newLength = Math.round(buffer.length / sampleRateRatio);
          var result = new Float32Array(newLength);
          var offsetResult = 0;
          var offsetBuffer = 0;

          while (offsetResult < result.length) {
            var nextOffsetBuffer = Math.round((offsetResult + 1) * sampleRateRatio);
            var accum = 0;
            var count = 0;

            for (var i = offsetBuffer; i < nextOffsetBuffer && i < buffer.length; i++) {
              accum += buffer[i];
              count++;
            }

            result[offsetResult] = count > 0 ? accum / count : 0;
            offsetResult++;
            offsetBuffer = nextOffsetBuffer;
          }

          return result;
        }

        function floatTo16BitPCM(float32Array) {
          var pcm = new Int16Array(float32Array.length);
          for (var i = 0; i < float32Array.length; i++) {
            var sample = Math.max(-1, Math.min(1, float32Array[i]));
            pcm[i] = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
          }
          return pcm;
        }

        function pcmToBase64(pcm16) {
          var bytes = new Uint8Array(pcm16.buffer);
          var chunkSize = 0x8000;
          var binary = '';

          for (var i = 0; i < bytes.length; i += chunkSize) {
            var subarray = bytes.subarray(i, i + chunkSize);
            var chunk = '';
            for (var j = 0; j < subarray.length; j++) {
              chunk += String.fromCharCode(subarray[j]);
            }
            binary += chunk;
          }

          return btoa(binary);
        }

        async function stopStreaming() {
          isStreaming = false;

          if (processorNode) {
            processorNode.disconnect();
            processorNode.onaudioprocess = null;
            processorNode = null;
          }

          if (sourceNode) {
            sourceNode.disconnect();
            sourceNode = null;
          }

          if (gainNode) {
            gainNode.disconnect();
            gainNode = null;
          }

          if (stream) {
            stream.getTracks().forEach(function (track) { track.stop(); });
            stream = null;
          }

          if (audioContext) {
            try {
              await audioContext.close();
            } catch (e) {}
            audioContext = null;
          }

          post({ type: 'stopped' });
        }

        async function startStreaming() {
          if (isStreaming) {
            return;
          }

          try {
            stream = await navigator.mediaDevices.getUserMedia({
              audio: {
                channelCount: 1,
                echoCancellation: true,
                noiseSuppression: true,
                autoGainControl: true
              }
            });

            var AudioContextConstructor = window.AudioContext || window.webkitAudioContext;
            audioContext = new AudioContextConstructor();
            await audioContext.resume();

            sourceNode = audioContext.createMediaStreamSource(stream);
            processorNode = audioContext.createScriptProcessor(2048, 1, 1);
            gainNode = audioContext.createGain();
            gainNode.gain.value = 0;

            processorNode.onaudioprocess = function (event) {
              if (!isStreaming || !audioContext) {
                return;
              }

              var inputData = event.inputBuffer.getChannelData(0);
              var downsampled = downsampleBuffer(inputData, audioContext.sampleRate, targetSampleRate);
              var pcm16 = floatTo16BitPCM(downsampled);

              post({
                type: 'audio_chunk',
                data: pcmToBase64(pcm16),
                mimeType: 'audio/pcm;rate=' + targetSampleRate
              });
            };

            sourceNode.connect(processorNode);
            processorNode.connect(gainNode);
            gainNode.connect(audioContext.destination);

            isStreaming = true;
            post({ type: 'started', sampleRate: audioContext.sampleRate });
          } catch (error) {
            var message = error && error.message ? error.message : 'Microphone access failed';
            post({ type: 'error', message: message });
          }
        }

        function handleCommand(event) {
          try {
            var payload = JSON.parse(event.data);
            if (payload.type === 'start') {
              startStreaming();
            } else if (payload.type === 'stop') {
              stopStreaming();
            }
          } catch (error) {
            post({ type: 'error', message: 'Invalid microphone command' });
          }
        }

        document.addEventListener('message', handleCommand);
        window.addEventListener('message', handleCommand);
        post({ type: 'ready' });
      })();
    </script>
  </body>
</html>
`;

export const LiveMicWebView = forwardRef<LiveMicWebViewHandle, Props>(function LiveMicWebView(
  { onChunk, onStart, onStop, onError },
  ref
) {
  const webViewRef = useRef<WebView>(null);
  const isReadyRef = useRef(false);
  const queuedCommandRef = useRef<'start' | 'stop' | null>(null);

  const htmlSource = useMemo(() => ({
    html: MIC_HTML,
    baseUrl: 'https://app.local/',
  }), []);

  const postCommand = (type: 'start' | 'stop') => {
    if (!isReadyRef.current) {
      queuedCommandRef.current = type;
      return;
    }
    webViewRef.current?.postMessage(JSON.stringify({ type }));
  };

  useImperativeHandle(ref, () => ({
    start() {
      postCommand('start');
    },
    stop() {
      postCommand('stop');
    },
  }), []);

  const handleMessage = (event: WebViewMessageEvent) => {
    try {
      const message = JSON.parse(event.nativeEvent.data) as MicMessage;
      switch (message.type) {
        case 'ready':
          isReadyRef.current = true;
          if (queuedCommandRef.current) {
            postCommand(queuedCommandRef.current);
            queuedCommandRef.current = null;
          }
          break;
        case 'audio_chunk':
          onChunk(message.data, message.mimeType);
          break;
        case 'started':
          onStart?.();
          break;
        case 'stopped':
          onStop?.();
          break;
        case 'error':
          onError?.(message.message);
          break;
        default:
          break;
      }
    } catch {
      onError?.('Failed to parse microphone stream message');
    }
  };

  return (
    <View pointerEvents="none" style={styles.container}>
      <WebView
        ref={webViewRef}
        originWhitelist={['*']}
        source={htmlSource}
        onMessage={handleMessage}
        javaScriptEnabled
        injectedJavaScriptBeforeContentLoaded={'true;'}
        injectedJavaScript={'true;'}
        mediaPlaybackRequiresUserAction={false}
        allowsInlineMediaPlayback
        mediaCapturePermissionGrantType="grant"
        allowsAirPlayForMediaPlayback
        style={styles.webview}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: 1,
    height: 1,
    opacity: 0,
    overflow: 'hidden',
  },
  webview: {
    width: 1,
    height: 1,
    backgroundColor: 'transparent',
  },
});

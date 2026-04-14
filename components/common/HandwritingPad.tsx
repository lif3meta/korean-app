import React, { forwardRef, useImperativeHandle, useRef, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { WebView, WebViewMessageEvent } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';
import { colors, borderRadius, spacing } from '@/lib/theme';

export type HandwritingPadHandle = {
  clear: () => void;
};

type Props = {
  onSubmit: (imageBase64: string) => void;
  onClose: () => void;
};

const PAD_HTML = `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background: #fff; overflow: hidden; touch-action: none; }
    canvas { display: block; width: 100%; height: 100%; }
  </style>
</head>
<body>
  <canvas id="pad"></canvas>
  <script>
    (function () {
      var canvas = document.getElementById('pad');
      var ctx = canvas.getContext('2d');
      var drawing = false;
      var hasStrokes = false;

      function resize() {
        var rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * 2;
        canvas.height = rect.height * 2;
        ctx.scale(2, 2);
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.lineWidth = 4;
        ctx.strokeStyle = '#303335';
      }
      resize();

      function getPos(e) {
        var rect = canvas.getBoundingClientRect();
        var t = e.touches ? e.touches[0] : e;
        return { x: t.clientX - rect.left, y: t.clientY - rect.top };
      }

      function startDraw(e) {
        e.preventDefault();
        drawing = true;
        hasStrokes = true;
        var p = getPos(e);
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
      }

      function draw(e) {
        e.preventDefault();
        if (!drawing) return;
        var p = getPos(e);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
      }

      function endDraw(e) {
        e.preventDefault();
        drawing = false;
      }

      canvas.addEventListener('mousedown', startDraw);
      canvas.addEventListener('mousemove', draw);
      canvas.addEventListener('mouseup', endDraw);
      canvas.addEventListener('touchstart', startDraw, { passive: false });
      canvas.addEventListener('touchmove', draw, { passive: false });
      canvas.addEventListener('touchend', endDraw, { passive: false });

      function post(msg) {
        window.ReactNativeWebView.postMessage(JSON.stringify(msg));
      }

      function handleCommand(event) {
        try {
          var payload = JSON.parse(event.data);
          if (payload.type === 'clear') {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            hasStrokes = false;
          } else if (payload.type === 'capture') {
            if (!hasStrokes) {
              post({ type: 'empty' });
              return;
            }
            var dataUrl = canvas.toDataURL('image/png');
            var base64 = dataUrl.split(',')[1];
            post({ type: 'image', data: base64 });
          }
        } catch (e) {}
      }

      document.addEventListener('message', handleCommand);
      window.addEventListener('message', handleCommand);
    })();
  </script>
</body>
</html>
`;

export const HandwritingPad = forwardRef<HandwritingPadHandle, Props>(function HandwritingPad(
  { onSubmit, onClose },
  ref,
) {
  const webViewRef = useRef<WebView>(null);

  const postCommand = useCallback((type: string) => {
    webViewRef.current?.postMessage(JSON.stringify({ type }));
  }, []);

  useImperativeHandle(ref, () => ({
    clear() {
      postCommand('clear');
    },
  }), [postCommand]);

  const handleMessage = (event: WebViewMessageEvent) => {
    try {
      const msg = JSON.parse(event.nativeEvent.data);
      if (msg.type === 'image') {
        onSubmit(msg.data);
      }
    } catch {}
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Draw Korean</Text>
        <Text style={styles.subtitle}>한국어를 써보세요</Text>
      </View>
      <View style={styles.canvasWrap}>
        <WebView
          ref={webViewRef}
          originWhitelist={['*']}
          source={{ html: PAD_HTML, baseUrl: 'https://app.local/' }}
          onMessage={handleMessage}
          javaScriptEnabled
          injectedJavaScriptBeforeContentLoaded={'true;'}
          injectedJavaScript={'true;'}
          scrollEnabled={false}
          bounces={false}
          style={styles.canvas}
        />
      </View>
      <View style={styles.actions}>
        <TouchableOpacity onPress={onClose} style={styles.actionBtn} activeOpacity={0.7}>
          <Ionicons name="close" size={20} color={colors.textTertiary} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => postCommand('clear')} style={styles.actionBtn} activeOpacity={0.7}>
          <Ionicons name="trash-outline" size={20} color={colors.textTertiary} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => postCommand('capture')} style={styles.sendBtn} activeOpacity={0.8}>
          <Ionicons name="send" size={18} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  title: {
    fontSize: 14,
    fontFamily: 'Jakarta-Bold',
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: 11,
    fontFamily: 'Jakarta-Medium',
    color: colors.textTertiary,
  },
  canvasWrap: {
    height: 160,
    borderRadius: borderRadius.lg,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderStyle: 'dashed',
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  canvas: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  actionBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surfaceLow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

import Constants from 'expo-constants';

const GEMINI_LIVE_MODEL = 'models/gemini-2.5-flash-native-audio-preview-12-2025';
const GEMINI_LIVE_WS_CONSTRAINED = 'wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContentConstrained';
const GEMINI_LIVE_WS_OPEN = 'wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent';

export type LiveVoiceName = 'Puck' | 'Charon' | 'Kore' | 'Fenrir' | 'Aoede' | 'Leda' | 'Orus' | 'Zephyr';

type LiveTranscription = {
  text?: string;
};

type LiveInlineData = {
  data?: string;
  mimeType?: string;
};

type LivePart = {
  text?: string;
  inlineData?: LiveInlineData;
};

type LiveServerContent = {
  generationComplete?: boolean;
  turnComplete?: boolean;
  interrupted?: boolean;
  inputTranscription?: LiveTranscription;
  outputTranscription?: LiveTranscription;
  modelTurn?: {
    parts?: LivePart[];
  };
};

type LiveServerMessage = {
  setupComplete?: Record<string, never>;
  serverContent?: LiveServerContent;
};

export type LiveEventHandlers = {
  onOpen?: () => void;
  onClose?: (reason: string) => void;
  onError?: (message: string) => void;
  onInputTranscript?: (text: string) => void;
  onOutputTranscript?: (text: string, isFinal: boolean) => void;
  onAudioChunk?: (base64Pcm: string, mimeType: string) => void;
  onInterrupted?: () => void;
  onTurnComplete?: () => void;
};

async function parseLiveMessage(data: unknown): Promise<LiveServerMessage> {
  if (typeof data === 'string') {
    return JSON.parse(data) as LiveServerMessage;
  }

  if (data && typeof data === 'object') {
    if ('text' in (data as Record<string, unknown>) && typeof (data as { text?: unknown }).text === 'function') {
      const text = await (data as { text: () => Promise<string> }).text();
      return JSON.parse(text) as LiveServerMessage;
    }

    if (data instanceof ArrayBuffer) {
      const text = new TextDecoder().decode(new Uint8Array(data));
      return JSON.parse(text) as LiveServerMessage;
    }

    if (ArrayBuffer.isView(data)) {
      const view = data as ArrayBufferView;
      const text = new TextDecoder().decode(new Uint8Array(view.buffer, view.byteOffset, view.byteLength));
      return JSON.parse(text) as LiveServerMessage;
    }

    return data as LiveServerMessage;
  }

  throw new Error(`Unsupported Gemini Live message type: ${typeof data}`);
}

function getApiBaseUrl(): string {
  const configured = Constants.expoConfig?.extra?.apiBaseUrl;
  if (typeof configured === 'string' && configured.length > 0) {
    return configured;
  }
  throw new Error('Missing EXPO_PUBLIC_API_BASE_URL. Point the app at a public backend that serves /api/gemini-live-token.');
}

async function fetchLiveToken(): Promise<{ token: string; type: 'ephemeral' | 'api_key' }> {
  const response = await fetch(`${getApiBaseUrl()}/api/gemini-live-token`);
  if (!response.ok) {
    const body = await response.text().catch(() => '');
    throw new Error(`Token request failed: ${response.status} ${body.slice(0, 200)}`);
  }

  const data = await response.json();
  if (!data?.token) {
    throw new Error('Token endpoint returned no token');
  }

  return { token: data.token as string, type: data.type || 'ephemeral' };
}

function createSystemInstruction(text: string) {
  return {
    parts: [{ text }],
  };
}

export class GeminiLiveSession {
  private ws: WebSocket | null = null;
  private setupComplete = false;
  private closed = false;
  private reconnectAttempts = 0;
  private readonly maxReconnectAttempts = 3;
  private readonly handlers: LiveEventHandlers;
  private readonly systemInstruction: string;
  private readonly voiceName: LiveVoiceName;
  private readonly model: string;

  constructor(args: {
    systemInstruction: string;
    voiceName: LiveVoiceName;
    handlers?: LiveEventHandlers;
    model?: string;
  }) {
    this.handlers = args.handlers ?? {};
    this.systemInstruction = args.systemInstruction;
    this.voiceName = args.voiceName;
    this.model = args.model ?? GEMINI_LIVE_MODEL;
  }

  async connect(): Promise<void> {
    this.closed = false;
    this.reconnectAttempts = 0;
    await this.connectInternal();
  }

  private async connectInternal(): Promise<void> {
    const { token, type } = await fetchLiveToken();
    const authParam = type === 'api_key' ? 'key' : 'access_token';
    const wsBase = type === 'api_key' ? GEMINI_LIVE_WS_OPEN : GEMINI_LIVE_WS_CONSTRAINED;
    const url = `${wsBase}?${authParam}=${encodeURIComponent(token)}`;

    await new Promise<void>((resolve, reject) => {
      let settled = false;
      const ws = new WebSocket(url);
      this.ws = ws;

      const fail = (message: string) => {
        if (settled) return;
        settled = true;
        reject(new Error(message));
      };

      const succeed = () => {
        if (settled) return;
        settled = true;
        this.reconnectAttempts = 0;
        resolve();
      };

      ws.onopen = () => {
        ws.send(JSON.stringify({
          setup: {
            model: this.model,
            generationConfig: {
              responseModalities: ['AUDIO'],
              speechConfig: {
                voiceConfig: {
                  prebuiltVoiceConfig: {
                    voiceName: this.voiceName,
                  },
                },
              },
            },
            outputAudioTranscription: {},
            inputAudioTranscription: { languageCode: 'ko' },
            systemInstruction: createSystemInstruction(this.systemInstruction),
          },
        }));
      };

      ws.onmessage = async (event) => {
        try {
          const parsed = await parseLiveMessage(event.data);
          if (parsed.setupComplete) {
            this.setupComplete = true;
            this.handlers.onOpen?.();
            succeed();
            return;
          }

          this.handleServerMessage(parsed);
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Invalid Live API message';
          this.handlers.onError?.(message);
          fail(message);
        }
      };

      ws.onerror = () => {
        const message = 'Gemini Live websocket error';
        this.handlers.onError?.(message);
        fail(message);
      };

      ws.onclose = (event) => {
        this.setupComplete = false;
        this.ws = null;
        const reason = event.reason || `code ${event.code}`;

        if (!settled) {
          fail(`Gemini Live closed before setup completed: ${reason}`);
          return;
        }

        // Auto-reconnect if not intentionally closed
        if (!this.closed && this.reconnectAttempts < this.maxReconnectAttempts) {
          this.reconnectAttempts++;
          const delay = Math.min(1000 * this.reconnectAttempts, 3000);
          this.handlers.onError?.(`Connection lost, reconnecting (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
          setTimeout(() => {
            if (this.closed) return;
            this.connectInternal().catch(() => {
              this.handlers.onClose?.(`Failed to reconnect after ${this.maxReconnectAttempts} attempts`);
            });
          }, delay);
        } else if (!this.closed) {
          this.handlers.onClose?.(reason);
        }
      };
    });
  }

  sendText(text: string): void {
    if (!this.ws || !this.setupComplete) {
      throw new Error('Gemini Live session is not connected');
    }

    this.ws.send(JSON.stringify({
      realtimeInput: { text },
    }));
  }

  sendAudioChunk(base64Pcm: string, mimeType: string): void {
    if (!this.ws || !this.setupComplete) {
      throw new Error('Gemini Live session is not connected');
    }

    this.ws.send(JSON.stringify({
      realtimeInput: {
        audio: {
          data: base64Pcm,
          mimeType,
        },
      },
    }));
  }

  endAudioStream(): void {
    if (!this.ws || !this.setupComplete) {
      throw new Error('Gemini Live session is not connected');
    }

    this.ws.send(JSON.stringify({
      realtimeInput: {
        audioStreamEnd: true,
      },
    }));
  }

  close(): void {
    this.closed = true;
    this.setupComplete = false;
    this.ws?.close();
    this.ws = null;
  }

  private handleServerMessage(message: LiveServerMessage) {
    const content = message.serverContent;
    if (!content) return;

    if (content.interrupted) {
      this.handlers.onInterrupted?.();
    }

    if (content.inputTranscription?.text) {
      this.handlers.onInputTranscript?.(content.inputTranscription.text);
    }

    if (content.outputTranscription?.text) {
      this.handlers.onOutputTranscript?.(
        content.outputTranscription.text,
        Boolean(content.turnComplete || content.generationComplete)
      );
    }

    for (const part of content.modelTurn?.parts ?? []) {
      if (part.inlineData?.data && part.inlineData.mimeType) {
        this.handlers.onAudioChunk?.(part.inlineData.data, part.inlineData.mimeType);
      }
      // Ignore part.text — it contains the model's internal thinking/planning,
      // not the actual spoken words. Only outputTranscription has the real transcript.
    }

    if ((content.turnComplete || content.generationComplete) && !content.outputTranscription?.text) {
      this.handlers.onOutputTranscript?.('', true);
    }

    if (content.turnComplete || content.generationComplete) {
      this.handlers.onTurnComplete?.();
    }
  }
}

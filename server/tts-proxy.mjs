import { createServer } from 'node:http';
import { EdgeTTS } from '@andresaya/edge-tts';
import { GoogleGenAI } from '@google/genai';

const PORT = Number(process.env.PORT || 8787);
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.EXPO_PUBLIC_GEMINI_API_KEY || '';
const GEMINI_LIVE_MODEL = 'gemini-2.5-flash-native-audio-preview-12-2025';

const KOREAN_VOICE_MAP = {
  coral: 'ko-KR-SunHiNeural',
  ash: 'ko-KR-InJoonNeural',
};

const SPANISH_VOICE_MAP = {
  coral: 'es-MX-DaliaNeural',
  ash: 'es-MX-JorgeNeural',
};

const ENGLISH_VOICE_MAP = {
  coral: 'en-US-JennyNeural',
  ash: 'en-US-GuyNeural',
};

function hasKorean(text) {
  return /[\uAC00-\uD7AF\u1100-\u11FF\u3130-\u318F]/.test(text);
}

function writeJson(res, status, body) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  });
  res.end(JSON.stringify(body));
}

function writeCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
}

async function createGeminiLiveToken() {
  if (!GEMINI_API_KEY) {
    throw new Error('Missing GEMINI_API_KEY');
  }

  const now = Date.now();
  const client = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
  try {
    const token = await client.authTokens.create({
      config: {
        uses: 1,
        expireTime: new Date(now + 30 * 60 * 1000).toISOString(),
        newSessionExpireTime: new Date(now + 60 * 1000).toISOString(),
        liveConnectConstraints: {
          model: `models/${GEMINI_LIVE_MODEL.replace('models/', '')}`,
          config: {
            responseModalities: ['AUDIO'],
          },
        },
        httpOptions: {
          apiVersion: 'v1alpha',
        },
      },
    });
    return { token: token.name, type: 'ephemeral' };
  } catch (err) {
    // If token creation fails (e.g. 404, or unsupported region), fall back to API key
    return { token: GEMINI_API_KEY, type: 'api_key' };
  }
}

function normalizeSpeechInput(text) {
  return String(text || '')
    .replace(/[*_#`~]/g, '')
    .replace(/\(([A-Za-z][A-Za-z\s'.,-]*)\)/g, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

async function readJsonBody(req) {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(chunk);
  }

  if (chunks.length === 0) return {};

  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8'));
  } catch {
    throw new Error('Invalid JSON body');
  }
}

function splitByLanguage(text) {
  const segments = [];
  const parts = text.split(/([\uAC00-\uD7AF\u1100-\u11FF\u3130-\u318F]+)/g).filter(Boolean);
  for (const part of parts) {
    const isKorean = hasKorean(part);
    const last = segments[segments.length - 1];
    if (last && last.isKorean === isKorean) {
      last.text += part;
    } else {
      segments.push({ text: part, isKorean });
    }
  }
  return segments;
}

async function synthesize(text, voiceKey, lang) {
  if (lang === 'es') {
    const tts = new EdgeTTS();
    await tts.synthesize(text, SPANISH_VOICE_MAP[voiceKey]);
    return tts.toBuffer();
  }
  const segments = splitByLanguage(text);
  const buffers = [];
  for (const seg of segments) {
    const trimmed = seg.text.trim();
    if (!trimmed) continue;
    const tts = new EdgeTTS();
    const voiceMap = seg.isKorean ? KOREAN_VOICE_MAP : ENGLISH_VOICE_MAP;
    await tts.synthesize(trimmed, voiceMap[voiceKey]);
    buffers.push(tts.toBuffer());
  }
  return Buffer.concat(buffers);
}

const server = createServer(async (req, res) => {
  writeCorsHeaders(res);

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.method === 'GET' && req.url === '/health') {
    writeJson(res, 200, { ok: true });
    return;
  }

  if (req.method === 'GET' && req.url === '/api/gemini-live-token') {
    try {
      const result = await createGeminiLiveToken();
      writeJson(res, 200, {
        token: result.token,
        type: result.type,
      });
    } catch (error) {
      writeJson(res, 500, {
        error: error instanceof Error ? error.message : 'Unknown server error',
      });
    }
    return;
  }

  if (req.method === 'GET' && req.url?.startsWith('/api/chat-speech')) {
    try {
      const requestUrl = new URL(req.url, `http://${req.headers.host || '127.0.0.1'}`);
      const voiceKey = requestUrl.searchParams.get('voice') === 'ash' ? 'ash' : 'coral';
      const lang = requestUrl.searchParams.get('lang') || 'ko';
      const input = normalizeSpeechInput(requestUrl.searchParams.get('text') || '');

      if (!input) {
        writeJson(res, 400, { error: 'Text is required' });
        return;
      }

      const audioBuffer = await synthesize(input, voiceKey, lang);
      res.writeHead(200, {
        'Content-Type': 'audio/mpeg',
        'Content-Length': String(audioBuffer.length),
        'Cache-Control': 'public, max-age=86400',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      });
      res.end(audioBuffer);
    } catch (error) {
      writeJson(res, 500, {
        error: error instanceof Error ? error.message : 'Unknown server error',
      });
    }

    return;
  }

  if (req.method !== 'POST' || req.url !== '/api/chat-speech') {
    writeJson(res, 404, { error: 'Not found' });
    return;
  }

  try {
    const body = await readJsonBody(req);
    const voiceKey = body.voice === 'ash' ? 'ash' : 'coral';
    const lang = body.lang || 'ko';
    const input = normalizeSpeechInput(body.text);

    if (!input) {
      writeJson(res, 400, { error: 'Text is required' });
      return;
    }

    const audioBuffer = await synthesize(input, voiceKey, lang);
    res.writeHead(200, {
      'Content-Type': 'audio/mpeg',
      'Content-Length': String(audioBuffer.length),
      'Cache-Control': 'public, max-age=86400',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    });
    res.end(audioBuffer);
  } catch (error) {
    writeJson(res, 500, {
      error: error instanceof Error ? error.message : 'Unknown server error',
    });
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`TTS proxy listening on http://0.0.0.0:${PORT}`);
});

import { createServer } from 'node:http';
import { EdgeTTS } from '@andresaya/edge-tts';

const PORT = Number(process.env.PORT || 8787);

const VOICE_MAP = {
  coral: 'ko-KR-SunHiNeural',
  ash: 'ko-KR-InJoonNeural',
};

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

async function synthesize(text, voiceKey) {
  const tts = new EdgeTTS();
  await tts.synthesize(text, VOICE_MAP[voiceKey]);
  return tts.toBuffer();
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

  if (req.method === 'GET' && req.url?.startsWith('/api/chat-speech')) {
    try {
      const requestUrl = new URL(req.url, `http://${req.headers.host || '127.0.0.1'}`);
      const voiceKey = requestUrl.searchParams.get('voice') === 'ash' ? 'ash' : 'coral';
      const input = normalizeSpeechInput(requestUrl.searchParams.get('text') || '');

      if (!input) {
        writeJson(res, 400, { error: 'Text is required' });
        return;
      }

      const audioBuffer = await synthesize(input, voiceKey);
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
    const input = normalizeSpeechInput(body.text);

    if (!input) {
      writeJson(res, 400, { error: 'Text is required' });
      return;
    }

    const audioBuffer = await synthesize(input, voiceKey);
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

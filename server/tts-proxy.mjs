import { createServer } from 'node:http';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

function loadEnvFile(filename) {
  const filePath = resolve(process.cwd(), filename);
  if (!existsSync(filePath)) return;

  const lines = readFileSync(filePath, 'utf8').split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const separatorIndex = trimmed.indexOf('=');
    if (separatorIndex === -1) continue;

    const key = trimmed.slice(0, separatorIndex).trim();
    if (!key || process.env[key] !== undefined) continue;

    const rawValue = trimmed.slice(separatorIndex + 1).trim();
    const value = rawValue.replace(/^(['"])(.*)\1$/, '$2');
    process.env[key] = value;
  }
}

loadEnvFile('.env.local');

const PORT = Number(process.env.PORT || 8787);
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_TTS_MODEL = process.env.OPENAI_TTS_MODEL || 'gpt-4o-mini-tts';

const CHAT_VOICE_INSTRUCTIONS = {
  coral: 'Speak like a warm, bubbly Korean teacher. Keep the tone clear, upbeat, feminine, and natural. Pronounce Korean natively and English naturally. Do not sound robotic or overdramatic.',
  ash: 'Speak like a calm, confident Korean teacher. Keep the tone warm, relaxed, masculine, and natural. Pronounce Korean natively and English naturally. Do not sound robotic or overdramatic.',
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
    if (!OPENAI_API_KEY) {
      writeJson(res, 500, { error: 'OPENAI_API_KEY is not configured on the server' });
      return;
    }

    try {
      const requestUrl = new URL(req.url, `http://${req.headers.host || '127.0.0.1'}`);
      const requestedVoice = requestUrl.searchParams.get('voice') === 'ash' ? 'ash' : 'coral';
      const input = normalizeSpeechInput(requestUrl.searchParams.get('text') || '');

      if (!input) {
        writeJson(res, 400, { error: 'Text is required' });
        return;
      }

      const upstream = await fetch('https://api.openai.com/v1/audio/speech', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: OPENAI_TTS_MODEL,
          voice: requestedVoice,
          input,
          response_format: 'wav',
          instructions: CHAT_VOICE_INSTRUCTIONS[requestedVoice],
        }),
      });

      if (!upstream.ok) {
        const errorText = await upstream.text();
        writeJson(res, upstream.status, {
          error: 'OpenAI speech request failed',
          details: errorText.slice(0, 1000),
        });
        return;
      }

      const audioBuffer = Buffer.from(await upstream.arrayBuffer());
      res.writeHead(200, {
        'Content-Type': upstream.headers.get('content-type') || 'audio/wav',
        'Content-Length': String(audioBuffer.length),
        'Cache-Control': 'no-store',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
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

  if (!OPENAI_API_KEY) {
    writeJson(res, 500, { error: 'OPENAI_API_KEY is not configured on the server' });
    return;
  }

  try {
    const body = await readJsonBody(req);
    const requestedVoice = body.voice === 'ash' ? 'ash' : 'coral';
    const input = normalizeSpeechInput(body.text);

    if (!input) {
      writeJson(res, 400, { error: 'Text is required' });
      return;
    }

    const upstream = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: OPENAI_TTS_MODEL,
        voice: requestedVoice,
        input,
        response_format: 'wav',
        instructions: CHAT_VOICE_INSTRUCTIONS[requestedVoice],
      }),
    });

    if (!upstream.ok) {
      const errorText = await upstream.text();
      writeJson(res, upstream.status, {
        error: 'OpenAI speech request failed',
        details: errorText.slice(0, 1000),
      });
      return;
    }

    const audioBuffer = Buffer.from(await upstream.arrayBuffer());
    res.writeHead(200, {
      'Content-Type': upstream.headers.get('content-type') || 'audio/wav',
      'Content-Length': String(audioBuffer.length),
      'Cache-Control': 'no-store',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
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

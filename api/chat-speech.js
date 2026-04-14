const { EdgeTTS } = require('@andresaya/edge-tts');

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

function applyCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
}

function normalizeSpeechInput(text) {
  return String(text || '')
    .replace(/[*_#`~]/g, '')
    .replace(/\(([A-Za-z][A-Za-z\s'.,-]*)\)/g, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

function hasKorean(text) {
  return /[\uAC00-\uD7AF\u1100-\u11FF\u3130-\u318F]/.test(text);
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
    // Spanish: no Korean text splitting needed, use Spanish voices for all text
    const tts = new EdgeTTS();
    await tts.synthesize(text, SPANISH_VOICE_MAP[voiceKey]);
    return tts.toBuffer();
  }
  // Korean: split by language to handle mixed Korean/English text
  const segments = splitByLanguage(text);
  const buffers = [];
  for (const seg of segments) {
    const tts = new EdgeTTS();
    const voiceMap = seg.isKorean ? KOREAN_VOICE_MAP : ENGLISH_VOICE_MAP;
    await tts.synthesize(seg.text.trim(), voiceMap[voiceKey]);
    buffers.push(tts.toBuffer());
  }
  return Buffer.concat(buffers);
}

module.exports = async function handler(req, res) {
  applyCors(res);

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  try {
    const voiceKey =
      (req.method === 'GET' ? req.query.voice : req.body?.voice) === 'ash' ? 'ash' : 'coral';
    const lang = (req.method === 'GET' ? req.query.lang : req.body?.lang) || 'ko';
    const sourceText = req.method === 'GET' ? req.query.text : req.body?.text;
    const input = normalizeSpeechInput(sourceText);

    if (!input) {
      res.status(400).json({ error: 'Text is required' });
      return;
    }

    const audioBuffer = await synthesize(input, voiceKey, lang);
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    res.status(200).send(audioBuffer);
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Unknown server error',
    });
  }
};

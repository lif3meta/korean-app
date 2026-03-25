const { EdgeTTS } = require('@andresaya/edge-tts');

const VOICE_MAP = {
  coral: 'ko-KR-SunHiNeural',
  ash: 'ko-KR-InJoonNeural',
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

async function synthesize(text, voiceKey) {
  const tts = new EdgeTTS();
  await tts.synthesize(text, VOICE_MAP[voiceKey]);
  return tts.toBuffer();
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
    const sourceText = req.method === 'GET' ? req.query.text : req.body?.text;
    const input = normalizeSpeechInput(sourceText);

    if (!input) {
      res.status(400).json({ error: 'Text is required' });
      return;
    }

    const audioBuffer = await synthesize(input, voiceKey);
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    res.status(200).send(audioBuffer);
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Unknown server error',
    });
  }
};

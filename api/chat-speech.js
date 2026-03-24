const CHAT_VOICE_INSTRUCTIONS = {
  coral: 'Speak like a warm, bubbly Korean teacher. Keep the tone clear, upbeat, feminine, and natural. Pronounce Korean natively and English naturally. Do not sound robotic or overdramatic.',
  ash: 'Speak like a calm, confident Korean teacher. Keep the tone warm, relaxed, masculine, and natural. Pronounce Korean natively and English naturally. Do not sound robotic or overdramatic.',
};

function applyCors(res) {
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

module.exports = async function handler(req, res) {
  applyCors(res);

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  const openAiApiKey = process.env.OPENAI_API_KEY;
  const openAiTtsModel = process.env.OPENAI_TTS_MODEL || 'gpt-4o-mini-tts';

  if (!openAiApiKey) {
    res.status(500).json({ error: 'OPENAI_API_KEY is not configured on the server' });
    return;
  }

  try {
    const requestedVoice =
      (req.method === 'GET' ? req.query.voice : req.body?.voice) === 'ash' ? 'ash' : 'coral';
    const sourceText = req.method === 'GET' ? req.query.text : req.body?.text;
    const input = normalizeSpeechInput(sourceText);

    if (!input) {
      res.status(400).json({ error: 'Text is required' });
      return;
    }

    const upstream = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${openAiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: openAiTtsModel,
        voice: requestedVoice,
        input,
        response_format: 'wav',
        instructions: CHAT_VOICE_INSTRUCTIONS[requestedVoice],
      }),
    });

    if (!upstream.ok) {
      const errorText = await upstream.text();
      res.status(upstream.status).json({
        error: 'OpenAI speech request failed',
        details: errorText.slice(0, 1000),
      });
      return;
    }

    const audioBuffer = Buffer.from(await upstream.arrayBuffer());
    res.setHeader('Content-Type', upstream.headers.get('content-type') || 'audio/wav');
    res.setHeader('Cache-Control', 'no-store');
    res.status(200).send(audioBuffer);
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Unknown server error',
    });
  }
};

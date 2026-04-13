const { GoogleGenAI } = require('@google/genai');

const GEMINI_LIVE_MODEL = 'gemini-2.5-flash-native-audio-preview-12-2025';

function applyCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
}

async function createGeminiLiveToken() {
  const apiKey = process.env.GEMINI_API_KEY || process.env.EXPO_PUBLIC_GEMINI_API_KEY || '';
  if (!apiKey) {
    throw new Error('Missing GEMINI_API_KEY');
  }

  const now = Date.now();
  const client = new GoogleGenAI({ apiKey });

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
      },
      httpOptions: {
        apiVersion: 'v1alpha',
      },
    });
    return { token: token.name, type: 'ephemeral' };
  } catch (err) {
    // If token creation fails (e.g. 404, or unsupported region), fall back to API key
    return { token: apiKey, type: 'api_key' };
  }
}

module.exports = async function handler(req, res) {
  applyCors(res);

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const result = await createGeminiLiveToken();
    res.status(200).json({
      token: result.token,
      type: result.type,
    });
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Unknown server error',
    });
  }
};

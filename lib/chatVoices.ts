export type ChatVoice = 'coral' | 'ash';

export type GeminiVoiceName = 'Kore' | 'Charon' | 'Orus' | 'Aoede';

// This map is used for non-Live Gemini TTS paths only.
export const GEMINI_CHAT_VOICE_MAP: Record<ChatVoice, GeminiVoiceName> = {
  coral: 'Aoede',
  ash: 'Kore',
};

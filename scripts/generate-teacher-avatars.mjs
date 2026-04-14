import { GoogleGenAI } from '@google/genai';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

// Read API key from .env.local
const envFile = fs.readFileSync(path.join(ROOT, '.env.local'), 'utf8');
const API_KEY = envFile.match(/GEMINI_API_KEY=(.+)/)?.[1]?.trim();
if (!API_KEY) {
  console.error('GEMINI_API_KEY not found in .env.local');
  process.exit(1);
}

const client = new GoogleGenAI({ apiKey: API_KEY });

async function generateAvatar(prompt, outputPath) {
  console.log(`Generating: ${path.basename(outputPath)}...`);

  const response = await client.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    config: {
      responseModalities: ['TEXT', 'IMAGE'],
    },
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      const buffer = Buffer.from(part.inlineData.data, 'base64');
      fs.writeFileSync(outputPath, buffer);
      console.log(`Saved: ${outputPath} (${Math.round(buffer.length / 1024)}KB)`);
      return;
    }
  }

  console.error(`No image generated for ${outputPath}`);
}

const STYLE_BLOCK = `Style: Ultra-premium semi-realistic anime portrait — inspired by Korean idol photoshoots crossed with high-end webtoon art like "True Beauty." Detailed cel-shading with realistic lighting, skin texture, and hair rendering. Gorgeous, polished, and aspirational — like a K-pop idol drawn as an anime character. NOT cartoonish or flat.

Composition: Head and upper shoulders portrait, slight 3/4 angle. Cinematic soft studio lighting with bokeh-like depth.
Aspect: Square 1:1.
NO text, NO watermarks, NO UI elements, NO borders.`;

const MINJI_PROMPT = `${STYLE_BLOCK}

Subject: Stunning young Korean woman, 28, radiating warmth like a top K-pop idol.
- Large luminous brown eyes with detailed light reflections, double eyelids, soft aegyo-sal
- Long flowing dark brown hair with honey highlights, silky waves, salon-perfect
- Gorgeous radiant smile — the kind that makes you feel instantly comfortable
- Flawless dewy glass-skin with natural rosy blush, soft pink lip tint
- Wearing a cream cashmere off-shoulder knit, delicate gold necklace
- Vibes: Suzy meets IU — beautiful, approachable, effortlessly warm

Background: Soft warm gradient from white to pale rose (#fff5f7).`;

const NARI_PROMPT = `${STYLE_BLOCK}

Subject: Jaw-droppingly gorgeous Korean woman, 27, fierce and glamorous like a K-pop main visual.
- Sharp cat-eyes with smoky liner, intense but playful gaze, glossy dark brown irises
- Sleek jet-black hair in a precision bob with glass-like shine, face-framing layers
- Confident half-smile — charismatic, slightly mischievous, magnetic
- Sculpted features, luminous skin, editorial-grade makeup with subtle contour
- Wearing a fitted black turtleneck under a structured lavender blazer, statement silver earrings
- Vibes: Jennie meets Jisoo — high-fashion, bold, unforgettable

Background: Luxe gradient from white to icy lavender (#f5f3ff to #e8e0ff).`;

const JUNWOO_PROMPT = `${STYLE_BLOCK}

Subject: Extremely handsome Korean man, 30, warm and quietly magnetic like a K-drama lead.
- Kind dark brown eyes with natural reflections, steady reassuring gaze, thick brows
- Neatly styled dark hair with soft texture, slightly tousled, effortlessly cool
- Warm genuine smile — the dependable older brother type
- Clear healthy skin, defined jawline, refined masculine features
- Wearing a sage green knit cardigan over a white tee, relaxed but put-together
- Vibes: Park Seo-joon meets Gong Yoo — handsome, warm, trustworthy

Background: Clean gradient from white to pale mint (#f3fffb to #d7f7ee).`;

const HYUNWOO_PROMPT = `${STYLE_BLOCK}

Subject: Strikingly handsome Korean man, 29, sharp and charismatic like a K-pop center.
- Intense dark brown eyes with crisp reflections, direct confident gaze
- Clean black hair styled up with texture, premium salon finish, slightly edgy
- Sharp confident smirk — cool, modern, knows he's good
- Sculpted face, clear skin, strong jawline, subtle stubble
- Wearing a sleek navy bomber jacket over a dark crew neck
- Vibes: Cha Eunwoo meets V — stunning, sharp, effortlessly cool

Background: Clean gradient from white to pale sky blue (#f5fbff to #dcecff).`;

const ASSETS = path.join(ROOT, 'assets', 'images');

await generateAvatar(MINJI_PROMPT, path.join(ASSETS, 'teacher-minji.png'));
await generateAvatar(NARI_PROMPT, path.join(ASSETS, 'teacher-nari.png'));
await generateAvatar(JUNWOO_PROMPT, path.join(ASSETS, 'teacher-junwoo-male.png'));
await generateAvatar(HYUNWOO_PROMPT, path.join(ASSETS, 'teacher-hyunwoo-male.png'));

console.log('\nDone! All 4 teacher avatars generated.');

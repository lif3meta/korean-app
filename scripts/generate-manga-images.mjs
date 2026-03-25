#!/usr/bin/env node
/**
 * Generate manga panel images using Google Gemini API.
 * Uses consistent style prefix and seed for character consistency.
 *
 * Usage:
 *   node scripts/generate-manga-images.mjs
 *
 * Requires GEMINI_API_KEY in .env.local
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUTPUT_DIR = path.join(ROOT, 'assets', 'images', 'manga');
const MANGA_FILE = path.join(ROOT, 'data', 'manga.ts');

// Load API key from .env.local
const envFile = fs.readFileSync(path.join(ROOT, '.env.local'), 'utf-8');
const API_KEY = envFile.match(/GEMINI_API_KEY=(.+)/)?.[1]?.trim();
if (!API_KEY) {
  console.error('GEMINI_API_KEY not found in .env.local');
  process.exit(1);
}

// Consistent style prefix for all images
const STYLE_PREFIX =
  'Korean webtoon manga style, soft pastel colors, clean linework, cute anime art, consistent character designs, detailed background. ';

// Character descriptions for consistency
const CHARACTERS = {
  'Mina': 'Mina: beautiful Korean high school girl, long straight black hair, gentle brown eyes, soft features',
  'Junho': 'Junho: handsome Korean high school boy, short dark brown hair, warm smile, kind eyes',
  'Sujin': 'Sujin: confident Korean girl, short black bob haircut, sharp eyes, intense expression',
  'Teacher': 'Teacher: kind middle-aged Korean woman, glasses, warm smile, professional appearance',
};

// Extract panel IDs and image prompts from manga.ts
function extractPanels() {
  const content = fs.readFileSync(MANGA_FILE, 'utf-8');
  const panels = [];
  const panelRegex = /{\s*id:\s*'([^']+)',\s*imagePrompt:\s*'((?:[^'\\]|\\.)*)'/g;
  let match;
  while ((match = panelRegex.exec(content)) !== null) {
    panels.push({
      id: match[1],
      prompt: match[2].replace(/\\'/g, "'"),
    });
  }
  return panels;
}

function extractCovers() {
  return [
    {
      id: 'cover-seoul-love-story',
      prompt: 'manga anime style cover art, Seoul Love Story, Korean high school romance, cherry blossoms, two students, pastel colors, webtoon style cover',
    },
    {
      id: 'cover-the-detective',
      prompt: 'dark moody manga style cover art, student detective in dark school hallway, magnifying glass, mysterious shadows, noir atmosphere, thriller cover',
    },
    {
      id: 'cover-cafe-dreams',
      prompt: 'warm cozy manga style cover art, cute Korean cafe interior, coffee cups, warm lighting, plants, pastries, inviting slice of life cover',
    },
    {
      id: 'cover-kpop-star',
      prompt: 'colorful energetic manga style cover art, K-pop audition stage, spotlights, microphone, dance pose, neon colors, vibrant idol cover',
    },
  ];
}

async function generateImage(prompt, panelId, seed) {
  const outputPath = path.join(OUTPUT_DIR, `${panelId}.png`);

  if (fs.existsSync(outputPath)) {
    console.log(`  [skip] ${panelId} — already exists`);
    return true;
  }

  let enhancedPrompt = STYLE_PREFIX + prompt;

  for (const [name, desc] of Object.entries(CHARACTERS)) {
    if (prompt.toLowerCase().includes(name.toLowerCase())) {
      enhancedPrompt += ` (${desc})`;
    }
  }

  try {
    // Try Imagen 4.0 first (supports seed for consistency)
    const imagenResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-001:predict?key=${API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          instances: [{ prompt: enhancedPrompt }],
          parameters: { sampleCount: 1, aspectRatio: '4:3', seed },
        }),
      }
    );

    if (imagenResponse.ok) {
      const data = await imagenResponse.json();
      if (data.predictions?.[0]?.bytesBase64Encoded) {
        const buffer = Buffer.from(data.predictions[0].bytesBase64Encoded, 'base64');
        fs.writeFileSync(outputPath, buffer);
        console.log(`  [ok]   ${panelId} (imagen-4)`);
        return true;
      }
    }

    // Fallback: Gemini 2.5 Flash Image
    console.log(`  [info] Imagen failed for ${panelId}, trying Gemini Flash Image...`);
    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=${API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `Generate this image: ${enhancedPrompt}` }] }],
          generationConfig: { responseModalities: ['IMAGE', 'TEXT'] },
        }),
      }
    );

    if (geminiResponse.ok) {
      const geminiData = await geminiResponse.json();
      const parts = geminiData.candidates?.[0]?.content?.parts || [];
      const imagePart = parts.find((p) => p.inlineData?.mimeType?.startsWith('image/'));
      if (imagePart) {
        const buffer = Buffer.from(imagePart.inlineData.data, 'base64');
        fs.writeFileSync(outputPath, buffer);
        console.log(`  [ok]   ${panelId} (gemini-flash-image)`);
        return true;
      }
    }

    const errText = await geminiResponse.text().catch(() => 'unknown error');
    console.error(`  [fail] ${panelId}: ${errText.slice(0, 200)}`);
    return false;
  } catch (err) {
    console.error(`  [fail] ${panelId}: ${err.message}`);
    return false;
  }
}

async function main() {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const panels = extractPanels();
  const covers = extractCovers();
  const allItems = [...covers, ...panels];

  console.log(`Found ${panels.length} panels + ${covers.length} covers = ${allItems.length} images to generate\n`);

  let success = 0;
  let fail = 0;
  let skipped = 0;

  for (let i = 0; i < allItems.length; i++) {
    const item = allItems[i];
    const seed = 42;
    console.log(`[${i + 1}/${allItems.length}] ${item.id}`);

    const existed = fs.existsSync(path.join(OUTPUT_DIR, `${item.id}.png`));
    const ok = await generateImage(item.prompt, item.id, seed);

    if (existed) skipped++;
    else if (ok) success++;
    else fail++;

    // Rate limit delay between API calls
    if (!existed && i < allItems.length - 1) {
      console.log('  waiting 3s (rate limit)...');
      await new Promise((r) => setTimeout(r, 3000));
    }
  }

  console.log(`\nDone! Generated: ${success}, Skipped: ${skipped}, Failed: ${fail}`);
  generateIndexFile(allItems);
}

function generateIndexFile(allItems) {
  const existing = allItems.filter((item) =>
    fs.existsSync(path.join(OUTPUT_DIR, `${item.id}.png`))
  );

  if (existing.length === 0) {
    console.log('No images generated yet — skipping index file.');
    return;
  }

  const lines = existing.map(
    (item) => `  '${item.id}': require('@/assets/images/manga/${item.id}.png'),`
  );

  const indexContent = `// Auto-generated by scripts/generate-manga-images.mjs\n// Maps manga panel/cover IDs to local image assets\nexport const mangaImages: Record<string, any> = {\n${lines.join('\n')}\n};\n`;

  const indexPath = path.join(ROOT, 'data', 'mangaImages.ts');
  fs.writeFileSync(indexPath, indexContent);
  console.log(`\nWrote image index: data/mangaImages.ts (${existing.length} entries)`);
}

main().catch(console.error);

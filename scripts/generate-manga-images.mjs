#!/usr/bin/env node
/**
 * Generate manga panel images using Google Gemini API with character reference images.
 *
 * Two-phase approach for character consistency:
 *   Phase 1: Generate a reference portrait for each character
 *   Phase 2: Generate scene panels, passing character reference images as input
 *
 * Outputs optimized WebP images. Prompts explicitly exclude text/speech bubbles.
 *
 * Usage:
 *   node scripts/generate-manga-images.mjs                  # Generate all (refs + panels)
 *   node scripts/generate-manga-images.mjs --refs-only      # Only generate character refs
 *   node scripts/generate-manga-images.mjs --panels-only    # Only generate scene panels
 *   node scripts/generate-manga-images.mjs --regenerate     # Delete existing and regenerate all
 *
 * Requires GEMINI_API_KEY in .env.local
 */

import { GoogleGenAI } from '@google/genai';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUTPUT_DIR = path.join(ROOT, 'assets', 'images', 'manga');
const REF_DIR = path.join(OUTPUT_DIR, 'refs');
const MANGA_FILE = path.join(ROOT, 'data', 'manga.ts');

// Load API key from .env.local
const envFile = fs.readFileSync(path.join(ROOT, '.env.local'), 'utf-8');
const API_KEY = envFile.match(/GEMINI_API_KEY=(.+)/)?.[1]?.trim();
if (!API_KEY) {
  console.error('GEMINI_API_KEY not found in .env.local');
  process.exit(1);
}

const client = new GoogleGenAI({ apiKey: API_KEY });

// WebP output settings
const WEBP_QUALITY = 80;
const TARGET_WIDTH = 600; // 4:3 aspect → 600x450
const REF_WIDTH = 512;    // Reference images — square portrait

// NO TEXT instruction appended to every prompt
const NO_TEXT_SUFFIX =
  ' CRITICAL: The image must contain absolutely NO TEXT, NO SPEECH BUBBLES, NO WRITTEN WORDS, NO LETTERS, NO NUMBERS, NO CAPTIONS, NO SIGNS WITH TEXT, NO DIALOGUE. Pure illustration only.';

// Consistent style prefix for all images
const STYLE_PREFIX =
  'Korean webtoon manga style, soft pastel colors, clean linework, cute anime art, consistent character designs, detailed background. No text or speech bubbles. ';

// Character definitions with reference prompt and story assignments
const CHARACTERS = {
  'Mina': {
    description: 'Mina: 17-year-old Korean girl, EXACTLY waist-length straight jet-black hair with blunt-cut bangs across forehead, large round dark brown eyes, small nose, fair skin, slender build, height 163cm, always wears white school blouse with navy collar and red ribbon tie',
    refPrompt: 'Korean webtoon manga style character reference sheet. A 17-year-old Korean high school girl named Mina. She has EXACTLY waist-length straight jet-black hair with blunt-cut bangs across her forehead, large round dark brown eyes, small nose, fair skin, slender build. She wears a white school blouse with navy collar and red ribbon tie. Show her face from the front with a gentle smile. Clean linework, soft pastel colors, cute anime art style. Plain white background. No text.',
    stories: ['seoul-love-story'],
  },
  'Junho': {
    description: 'Junho: 18-year-old Korean boy, EXACTLY short neat dark brown hair parted to the right above eyebrows, sharp jawline, warm brown eyes, athletic build, height 178cm, always wears white school shirt with navy blazer and loosened navy tie',
    refPrompt: 'Korean webtoon manga style character reference sheet. An 18-year-old Korean high school boy named Junho. He has EXACTLY short neat dark brown hair parted to the right above eyebrows, sharp jawline, warm brown eyes, athletic build. He wears a white school shirt with navy blazer and loosened navy tie. Show his face from the front with a confident warm smile. Clean linework, soft pastel colors, cute anime art style. Plain white background. No text.',
    stories: ['seoul-love-story'],
  },
  'Sujin': {
    description: 'Sujin: 17-year-old Korean girl, EXACTLY chin-length black bob haircut with straight bangs, sharp narrow eyes, strong eyebrows, fair skin, confident posture, height 165cm, always wears same school uniform as Mina but with black cardigan over it',
    refPrompt: 'Korean webtoon manga style character reference sheet. A 17-year-old Korean high school girl named Sujin. She has EXACTLY chin-length black bob haircut with straight bangs, sharp narrow eyes, strong eyebrows, fair skin, confident posture. She wears a school uniform with black cardigan over it. Show her face from the front with a cool confident expression. Clean linework, soft pastel colors, cute anime art style. Plain white background. No text.',
    stories: ['seoul-love-story'],
  },
  'Teacher': {
    description: 'Teacher: 45-year-old Korean woman, EXACTLY shoulder-length black hair in a neat low ponytail, rectangular glasses with thin gold frames, warm gentle smile, wearing cream blouse and brown cardigan, height 160cm',
    refPrompt: 'Korean webtoon manga style character reference sheet. A 45-year-old Korean female teacher. She has EXACTLY shoulder-length black hair in a neat low ponytail, rectangular glasses with thin gold frames, warm gentle smile. She wears a cream blouse and brown cardigan. Show her face from the front with a warm welcoming expression. Clean linework, soft pastel colors, cute anime art style. Plain white background. No text.',
    stories: ['seoul-love-story'],
  },
  'Minsu': {
    description: 'Minsu: 16-year-old Korean boy detective, EXACTLY messy dark brown hair slightly covering forehead, sharp intelligent dark eyes, lean build, height 170cm, always wears dark navy school uniform with collar popped up, carries a small brown notebook',
    refPrompt: 'Korean webtoon manga style character reference sheet. A 16-year-old Korean boy detective named Minsu. He has EXACTLY messy dark brown hair slightly covering his forehead, sharp intelligent dark eyes, lean build. He wears a dark navy school uniform with collar popped up. Show his face from the front with a sharp analytical expression. Clean linework, soft pastel colors, cute anime art style. Plain white background. No text.',
    stories: ['the-detective'],
  },
  'Jiyoung': {
    description: 'Jiyoung: 16-year-old Korean girl, EXACTLY shoulder-length wavy black hair with a red hairclip on left side, bright curious eyes, fair skin, height 162cm, wears standard navy school uniform with a yellow backpack',
    refPrompt: 'Korean webtoon manga style character reference sheet. A 16-year-old Korean girl named Jiyoung. She has EXACTLY shoulder-length wavy black hair with a red hairclip on the left side, bright curious eyes, fair skin. She wears a standard navy school uniform. Show her face from the front with a bright curious expression. Clean linework, soft pastel colors, cute anime art style. Plain white background. No text.',
    stories: ['the-detective'],
  },
  'Taeho': {
    description: 'Taeho: 16-year-old Korean boy, EXACTLY short spiky black hair, round gentle face, slightly chubby build, height 168cm, wears same navy school uniform but slightly wrinkled, nervous expression',
    refPrompt: 'Korean webtoon manga style character reference sheet. A 16-year-old Korean boy named Taeho. He has EXACTLY short spiky black hair, round gentle face, slightly chubby build. He wears a navy school uniform that is slightly wrinkled. Show his face from the front with a slightly nervous but friendly expression. Clean linework, soft pastel colors, cute anime art style. Plain white background. No text.',
    stories: ['the-detective'],
  },
  'Seoyeon': {
    description: 'Seoyeon: 17-year-old Korean girl trainee, EXACTLY long straight dark brown hair in a high ponytail, bright determined eyes, slim athletic build, height 165cm, wears black dance practice outfit (crop top and joggers) with white sneakers',
    refPrompt: 'Korean webtoon manga style character reference sheet. A 17-year-old Korean girl K-pop trainee named Seoyeon. She has EXACTLY long straight dark brown hair in a high ponytail, bright determined eyes, slim athletic build. She wears a black dance practice outfit (crop top and joggers) with white sneakers. Show her face from the front with a bright determined expression. Clean linework, soft pastel colors, cute anime art style. Plain white background. No text.',
    stories: ['kpop-star'],
  },
  'Haeun': {
    description: 'Haeun: 17-year-old Korean girl trainee, EXACTLY short pixie-cut black hair, cool confident expression, sharp features, taller build height 168cm, wears matching black dance practice outfit with red sneakers',
    refPrompt: 'Korean webtoon manga style character reference sheet. A 17-year-old Korean girl K-pop trainee named Haeun. She has EXACTLY short pixie-cut black hair, cool confident expression, sharp features, taller build. She wears a matching black dance practice outfit with red sneakers. Show her face from the front with a cool confident expression. Clean linework, soft pastel colors, cute anime art style. Plain white background. No text.',
    stories: ['kpop-star'],
  },
  'Alex': {
    description: 'Alex: 22-year-old foreign man, EXACTLY short curly light brown hair, green eyes, fair skin, slightly tall at 180cm, friendly smile, wears cafe apron over casual clothes',
    refPrompt: 'Korean webtoon manga style character reference sheet. A 22-year-old foreign man named Alex who works at a Korean cafe. He has EXACTLY short curly light brown hair, green eyes, fair skin, slightly tall. He wears a cafe apron over casual clothes. Show his face from the front with a friendly warm smile. Clean linework, soft pastel colors, cute anime art style. Plain white background. No text.',
    stories: ['cafe-dreams'],
  },
};

// Map story prefixes to series IDs for panel ID matching
const PANEL_PREFIX_TO_STORY = {
  'ch': 'seoul-love-story',       // ch1-p1, ch2-p3, etc.
  'det': 'the-detective',         // det-ch1-p1, etc.
  'cafe': 'cafe-dreams',          // cafe-ch1-p1, etc.
  'kpop': 'kpop-star',            // kpop-ch1-p1, etc.
};

function getStoryIdFromPanelId(panelId) {
  for (const [prefix, storyId] of Object.entries(PANEL_PREFIX_TO_STORY)) {
    if (panelId.startsWith(prefix)) return storyId;
  }
  return null;
}

// Get characters relevant to a panel based on story + prompt mention
function getCharactersForPanel(panelId, prompt) {
  const storyId = getStoryIdFromPanelId(panelId);
  const matched = [];
  for (const [name, char] of Object.entries(CHARACTERS)) {
    // Include if character belongs to this story OR is explicitly mentioned in the prompt
    const belongsToStory = storyId && char.stories.includes(storyId);
    const mentionedInPrompt = prompt.toLowerCase().includes(name.toLowerCase());
    if (belongsToStory || mentionedInPrompt) {
      matched.push(name);
    }
  }
  return matched;
}

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
      prompt: 'manga anime style cover art, Seoul Love Story, Korean high school romance, cherry blossoms, two students walking together under falling petals, pastel colors, webtoon style cover, beautiful scenery',
      storyId: 'seoul-love-story',
    },
    {
      id: 'cover-the-detective',
      prompt: 'dark moody manga style cover art, student detective standing in a dark school hallway, magnifying glass held up, mysterious shadows on walls, noir atmosphere, thriller cover',
      storyId: 'the-detective',
    },
    {
      id: 'cover-cafe-dreams',
      prompt: 'warm cozy manga style cover art, cute Korean cafe interior, a barista behind the counter, coffee cups, warm lighting, plants, pastries, inviting slice of life cover',
      storyId: 'cafe-dreams',
    },
    {
      id: 'cover-kpop-star',
      prompt: 'colorful energetic manga style cover art, K-pop dance studio with spotlights, a girl in a dynamic dance pose, neon colors, vibrant idol cover',
      storyId: 'kpop-star',
    },
  ];
}

// ─── Phase 1: Generate character reference images ─────────────────────────────

async function generateCharacterRef(name, char) {
  const outputPath = path.join(REF_DIR, `ref-${name.toLowerCase()}.webp`);

  if (fs.existsSync(outputPath)) {
    console.log(`  [skip] ref-${name} — already exists`);
    return 'skipped';
  }

  try {
    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: [{ role: 'user', parts: [{ text: char.refPrompt }] }],
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });

    const parts = response.candidates?.[0]?.content?.parts || [];
    const imagePart = parts.find((p) => p.inlineData?.mimeType?.startsWith('image/'));

    if (imagePart) {
      const buffer = Buffer.from(imagePart.inlineData.data, 'base64');

      await sharp(buffer)
        .resize(REF_WIDTH, REF_WIDTH, { fit: 'cover' })
        .webp({ quality: 90 }) // Higher quality for reference images
        .toFile(outputPath);

      const size = fs.statSync(outputPath).size;
      console.log(`  [ok]   ref-${name} (${(size / 1024).toFixed(0)} KB)`);
      return 'success';
    }

    console.error(`  [fail] ref-${name}: no image in response`);
    return 'fail';
  } catch (err) {
    console.error(`  [fail] ref-${name}: ${err.message?.slice(0, 200)}`);
    return 'fail';
  }
}

async function generateAllRefs() {
  fs.mkdirSync(REF_DIR, { recursive: true });
  console.log('\n=== Phase 1: Generating character reference images ===\n');

  let success = 0, fail = 0, skipped = 0;
  const BATCH_SIZE = 3;
  const entries = Object.entries(CHARACTERS);

  for (let i = 0; i < entries.length; i += BATCH_SIZE) {
    const batch = entries.slice(i, i + BATCH_SIZE);
    console.log(`\n--- Ref batch ${Math.floor(i / BATCH_SIZE) + 1} ---`);

    const results = await Promise.all(
      batch.map(([name, char]) => generateCharacterRef(name, char))
    );

    for (const r of results) {
      if (r === 'skipped') skipped++;
      else if (r === 'success') success++;
      else fail++;
    }

    if (i + BATCH_SIZE < entries.length) {
      await new Promise((r) => setTimeout(r, 2000));
    }
  }

  console.log(`\nRefs done: Generated=${success}, Skipped=${skipped}, Failed=${fail}`);
  return fail === 0;
}

// ─── Phase 2: Generate scene panels with reference images ─────────────────────

function loadRefImage(name) {
  const refPath = path.join(REF_DIR, `ref-${name.toLowerCase()}.webp`);
  if (!fs.existsSync(refPath)) return null;
  return fs.readFileSync(refPath);
}

async function generateImage(prompt, panelId, storyId) {
  const outputPath = path.join(OUTPUT_DIR, `${panelId}.webp`);

  if (fs.existsSync(outputPath)) {
    console.log(`  [skip] ${panelId} — already exists`);
    return 'skipped';
  }

  // Build enhanced text prompt
  let enhancedPrompt = STYLE_PREFIX + prompt + NO_TEXT_SUFFIX;
  const charNames = getCharactersForPanel(panelId, prompt);

  // Add character descriptions to text prompt
  for (const name of charNames) {
    enhancedPrompt += ` (${CHARACTERS[name].description})`;
  }

  // Build multimodal content parts: reference images + text prompt
  const contentParts = [];

  // Add reference images for characters in this scene
  const refsUsed = [];
  for (const name of charNames) {
    const refData = loadRefImage(name);
    if (refData) {
      contentParts.push({
        inlineData: {
          mimeType: 'image/webp',
          data: refData.toString('base64'),
        },
      });
      refsUsed.push(name);
    }
  }

  // Build the text instruction
  let textInstruction = `Generate this manga panel illustration (NO TEXT IN IMAGE): ${enhancedPrompt}`;
  if (refsUsed.length > 0) {
    textInstruction = `I'm providing reference images of the characters: ${refsUsed.join(', ')}. ` +
      `You MUST make the characters in the scene look EXACTLY like these reference images — same face, same hair, same features, same proportions. ` +
      `Maintain perfect visual consistency with the reference images while placing the characters in the described scene.\n\n` +
      `Scene to illustrate (NO TEXT IN IMAGE): ${enhancedPrompt}`;
  }

  contentParts.push({ text: textInstruction });

  try {
    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: [{ role: 'user', parts: contentParts }],
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });

    const parts = response.candidates?.[0]?.content?.parts || [];
    const imagePart = parts.find((p) => p.inlineData?.mimeType?.startsWith('image/'));

    if (imagePart) {
      const buffer = Buffer.from(imagePart.inlineData.data, 'base64');

      await sharp(buffer)
        .resize(TARGET_WIDTH, Math.round(TARGET_WIDTH * 3 / 4), { fit: 'cover' })
        .webp({ quality: WEBP_QUALITY })
        .toFile(outputPath);

      const size = fs.statSync(outputPath).size;
      const refTag = refsUsed.length > 0 ? ` [refs: ${refsUsed.join(',')}]` : '';
      console.log(`  [ok]   ${panelId} (${(size / 1024).toFixed(0)} KB)${refTag}`);
      return 'success';
    }

    console.error(`  [fail] ${panelId}: no image in response`);
    return 'fail';
  } catch (err) {
    console.error(`  [fail] ${panelId}: ${err.message?.slice(0, 200)}`);
    return 'fail';
  }
}

async function generateAllPanels() {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  console.log('\n=== Phase 2: Generating scene panels with character references ===\n');

  const panels = extractPanels();
  const covers = extractCovers();
  const allItems = [...covers, ...panels];

  console.log(`Found ${panels.length} panels + ${covers.length} covers = ${allItems.length} images to generate\n`);

  let success = 0, fail = 0, skipped = 0;
  const BATCH_SIZE = 3; // Smaller batches since we're sending more data per request

  for (let i = 0; i < allItems.length; i += BATCH_SIZE) {
    const batch = allItems.slice(i, i + BATCH_SIZE);
    console.log(`\n--- Panel batch ${Math.floor(i / BATCH_SIZE) + 1} (${i + 1}-${Math.min(i + BATCH_SIZE, allItems.length)} of ${allItems.length}) ---`);

    const results = await Promise.all(
      batch.map((item) => generateImage(item.prompt, item.id, item.storyId))
    );

    for (const r of results) {
      if (r === 'skipped') skipped++;
      else if (r === 'success') success++;
      else fail++;
    }

    // Longer pause between batches since we're sending larger payloads
    if (i + BATCH_SIZE < allItems.length) {
      await new Promise((r) => setTimeout(r, 3000));
    }
  }

  console.log(`\nPanels done: Generated=${success}, Skipped=${skipped}, Failed=${fail}`);
  return { success, fail, skipped };
}

function generateIndexFile() {
  const panels = extractPanels();
  const covers = extractCovers();
  const allItems = [...covers, ...panels];

  const existing = allItems.filter((item) =>
    fs.existsSync(path.join(OUTPUT_DIR, `${item.id}.webp`))
  );

  if (existing.length === 0) {
    console.log('No images generated yet — skipping index file.');
    return;
  }

  const lines = existing.map(
    (item) => `  '${item.id}': require('@/assets/images/manga/${item.id}.webp'),`
  );

  const indexContent = `// Auto-generated by scripts/generate-manga-images.mjs\n// Maps manga panel/cover IDs to optimized WebP image assets\nexport const mangaImages: Record<string, any> = {\n${lines.join('\n')}\n};\n`;

  const indexPath = path.join(ROOT, 'data', 'mangaImages.ts');
  fs.writeFileSync(indexPath, indexContent);
  console.log(`\nWrote image index: data/mangaImages.ts (${existing.length} entries)`);
}

async function main() {
  const args = process.argv.slice(2);
  const refsOnly = args.includes('--refs-only');
  const panelsOnly = args.includes('--panels-only');
  const regenerate = args.includes('--regenerate');

  // If --regenerate, delete all existing panel images (not refs unless --refs-only)
  if (regenerate) {
    if (!panelsOnly) {
      console.log('Deleting existing reference images...');
      if (fs.existsSync(REF_DIR)) {
        const refFiles = fs.readdirSync(REF_DIR).filter(f => f.endsWith('.webp'));
        refFiles.forEach(f => fs.unlinkSync(path.join(REF_DIR, f)));
        console.log(`Deleted ${refFiles.length} reference images`);
      }
    }
    if (!refsOnly) {
      console.log('Deleting existing panel images...');
      if (fs.existsSync(OUTPUT_DIR)) {
        const panelFiles = fs.readdirSync(OUTPUT_DIR).filter(f => f.endsWith('.webp') && !f.startsWith('ref-'));
        panelFiles.forEach(f => fs.unlinkSync(path.join(OUTPUT_DIR, f)));
        console.log(`Deleted ${panelFiles.length} panel images`);
      }
    }
  }

  // Phase 1: Generate character references
  if (!panelsOnly) {
    await generateAllRefs();
  }

  // Phase 2: Generate scene panels
  if (!refsOnly) {
    await generateAllPanels();
    generateIndexFile();
  }

  console.log('\nAll done!');
}

main().catch(console.error);

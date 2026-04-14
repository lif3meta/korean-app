# Audio QA Checklist — Lzy Learn Korean

## Simulator / Runtime Reset

1. Stop Metro.
2. Rebuild the dev client if native config or Expo plugins changed.
3. Restart Metro with cache cleared:

```bash
npx expo start --clear
```

4. Reinstall or relaunch the simulator app if audio behavior looks stale.

## Acceptance Criteria

- Hangul screens play pronunciation cues, never letter names.
- Fast Hangul never overlaps two different cues.
- Pronunciation lessons never read raw notation like `ㄱ / ㅋ / ㄲ` or `ㄱ [k]` literally.
- Pronunciation rows with unsupported notation show no active playback.
- Vocab, sentences, reading, slang, culture, dictionary, saved words, and practice words play natural Korean text.
- Listening exercises play TTS audio correctly for dictation, fill-blank, and meaning identification.
- AI tutor voice chat (Gemini Live) streams audio bidirectionally without dropouts.
- Parrot learning mode loops audio at configured intervals.
- Manga audio plays dialogue pronunciation correctly.
- The lesson-audio setting disables app playback everywhere.
- Romanization is a hint, not the canonical Hangul answer.

## Manual Test Matrix

### Hangul

- [ ] [app/lesson/hangul/index.tsx](/Users/waidz/projects/shorts/korean-app/app/lesson/hangul/index.tsx)
- [ ] [app/lesson/hangul/[characterId].tsx](/Users/waidz/projects/shorts/korean-app/app/lesson/hangul/[characterId].tsx)
- [ ] [app/fast-hangul.tsx](/Users/waidz/projects/shorts/korean-app/app/fast-hangul.tsx)

Checks:
- [ ] `ㄱ` plays a cue like `가`, not `기역`
- [ ] `ㅇ` onset cue behaves as `아`, not the letter name
- [ ] speed changes (slow/normal) work correctly
- [ ] speed changes do not replay stale audio

### Pronunciation

- [ ] [app/lesson/pronunciation/index.tsx](/Users/waidz/projects/shorts/korean-app/app/lesson/pronunciation/index.tsx)
- [ ] [app/lesson/pronunciation/[lessonId].tsx](/Users/waidz/projects/shorts/korean-app/app/lesson/pronunciation/[lessonId].tsx)

Checks:
- [ ] standalone jamo rows play sound cues
- [ ] contrast rows play representative syllables
- [ ] batchim notation rows do not expose fake audio
- [ ] mouth position tips display correctly

### Tongue Guide

- [ ] [app/lesson/tongue/index.tsx](/Users/waidz/projects/shorts/korean-app/app/lesson/tongue/index.tsx)
- [ ] [app/lesson/tongue/[soundId].tsx](/Users/waidz/projects/shorts/korean-app/app/lesson/tongue/[soundId].tsx)

Checks:
- [ ] hero sound buttons play Hangul cues
- [ ] example-word buttons play full Korean words
- [ ] similar-sound cards play their own cue

### Listening Exercises

- [ ] Dictation exercises play audio and accept typed answers
- [ ] Fill-audio-blank exercises play partial audio correctly
- [ ] Meaning identification exercises play audio and show options
- [ ] TTS audio quality is clear and at correct speed

### Writing Practice

- [ ] Translation exercises accept Korean input
- [ ] Particle fill exercises validate correct particles
- [ ] Free writing mode sends text for AI feedback (premium)

### General Lesson Audio

- [ ] [app/lesson/vocab/[categoryId].tsx](/Users/waidz/projects/shorts/korean-app/app/lesson/vocab/[categoryId].tsx)
- [ ] [app/lesson/sentences/[levelId].tsx](/Users/waidz/projects/shorts/korean-app/app/lesson/sentences/[levelId].tsx)
- [ ] [app/lesson/reading/[passageId].tsx](/Users/waidz/projects/shorts/korean-app/app/lesson/reading/[passageId].tsx)
- [ ] [app/lesson/slang/index.tsx](/Users/waidz/projects/shorts/korean-app/app/lesson/slang/index.tsx)
- [ ] [app/lesson/culture/[lessonId].tsx](/Users/waidz/projects/shorts/korean-app/app/lesson/culture/[lessonId].tsx)
- [ ] [app/dictionary.tsx](/Users/waidz/projects/shorts/korean-app/app/dictionary.tsx)
- [ ] [app/my-words.tsx](/Users/waidz/projects/shorts/korean-app/app/my-words.tsx)
- [ ] [app/practice-words.tsx](/Users/waidz/projects/shorts/korean-app/app/practice-words.tsx)

### Manga Audio

- [ ] Manga dialogue audio plays correctly per panel
- [ ] Word breakdown audio works on tapped words
- [ ] Audio stops when navigating between panels

### AI Tutors

- [ ] Minji voice chat connects and streams audio
- [ ] Junwoo voice chat connects and streams audio
- [ ] Microphone capture works for speech input
- [ ] Audio playback does not overlap with microphone capture

### Settings

- [ ] [app/settings.tsx](/Users/waidz/projects/shorts/korean-app/app/settings.tsx)

Checks:
- [ ] turn off `Lesson Audio`
- [ ] verify no lesson or Hangul playback starts
- [ ] turn it back on and verify playback resumes
- [ ] audio speed setting (slow/normal) affects all relevant screens

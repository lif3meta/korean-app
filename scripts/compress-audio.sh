#!/bin/bash
# Compress all MP3 files to 24kbps mono 22050Hz for minimal size
# This is speech-only audio so lower bitrate is fine

AUDIO_DIR="$(dirname "$0")/../assets/audio/ko"
TEMP_DIR="$(mktemp -d)"
COUNT=0
TOTAL=$(ls "$AUDIO_DIR"/*.mp3 2>/dev/null | wc -l | tr -d ' ')
SAVED=0

echo "Compressing $TOTAL audio files to 24kbps..."

for f in "$AUDIO_DIR"/*.mp3; do
  [ -f "$f" ] || continue
  base=$(basename "$f")
  temp="$TEMP_DIR/$base"

  orig_size=$(stat -f%z "$f" 2>/dev/null || stat -c%s "$f" 2>/dev/null)

  ffmpeg -y -i "$f" -b:a 24k -ar 22050 -ac 1 "$temp" 2>/dev/null

  if [ -f "$temp" ]; then
    new_size=$(stat -f%z "$temp" 2>/dev/null || stat -c%s "$temp" 2>/dev/null)
    if [ "$new_size" -lt "$orig_size" ]; then
      mv "$temp" "$f"
      SAVED=$((SAVED + orig_size - new_size))
    else
      rm "$temp"
    fi
  fi

  COUNT=$((COUNT + 1))
  if [ $((COUNT % 100)) -eq 0 ]; then
    echo "  [$COUNT/$TOTAL] saved $(echo "scale=1; $SAVED/1048576" | bc)MB so far"
  fi
done

rm -rf "$TEMP_DIR"

echo ""
echo "Done! Compressed $COUNT files"
echo "Total saved: $(echo "scale=1; $SAVED/1048576" | bc)MB"

# BPM promo video

A 62-second, 1920x1080, 30fps, silent promo built with [Remotion](https://www.remotion.dev/). The site embeds the output as `public/media/promo.mp4`.

- `src/Promo.tsx` holds the scenes and their durations (`SCENES`).
- `src/ui.tsx` holds the shared pieces: the scene wrapper with the field glow, text styles, phone frame and arc mark.
- Assets come from the site's `../public` folder (screens, hero loop, brand) and fonts from `../app/fonts`.
- Copy must stay within what the site claims (`content/en.ts`). See `docs/app-overview.md` §6 for the voice rules.

This package is separate from the site. The root `tsconfig.json` and ESLint config ignore it, and Remotion isn't a dependency of the site.

## Render

```bash
cd video
npm ci
npm run render            # writes out/promo-raw.mp4 (about 6 minutes on a small machine)

# Web encode: H.264 with faststart and no audio, plus the poster frame
ffmpeg -y -i out/promo-raw.mp4 -c:v libx264 -profile:v high -pix_fmt yuv420p -crf 22 -preset slow \
  -tune animation -movflags +faststart -an ../public/media/promo.mp4
ffmpeg -y -ss 3.8 -i ../public/media/promo.mp4 -frames:v 1 -c:v libwebp -quality 82 ../public/media/promo-poster.webp
```

`npm run render` uses the Chromium headless shell preinstalled in the Claude Code cloud environment (`/opt/pw-browsers/...`). Elsewhere, drop the `--browser-executable` flag and Remotion will download its own browser.

For a single frame while editing:

```bash
npx remotion still src/index.ts Promo out/frame.png --frame=300
```

Use `npm run studio` to preview the whole video in a browser.

The Chinese text in the details scene falls back to a system CJK font (WenQuanYi Zen Hei in the cloud environment). If a machine has no CJK font, those characters render as boxes.

# BPM brand: sources and usage

Tokens: `design/tokens.css`. Everything below comes from `grantxyzou/badminton-app` @ `3cbb6f9`.

## Name

- The product is **BPM**, short for *Badminton Per Management* (`lib/brand.ts`). Grant's own club is **BPM Core**. Don't say "BPM Badminton" for the product: that was the name before 2026-10-22.
- The wordmark is lowercase **`bpm`** followed by four tempo dots. In running text, write "BPM".

## Wordmark: `components/BpmWordmark.tsx`

- "bpm" in Space Grotesk 700 with letter-spacing −0.04em, then **four accent-colored dots that crescendo into the period**:
  - sizes 0.18 / 0.22 / 0.26 / 0.32em
  - opacity 0.32 / 0.55 / 0.78 / 1
  - gap 0.11em, margin-left 0.06em, padding-bottom 0.05em
- Everything is sized in em, so it scales from 20 to 96px. Dots use `var(--accent)`: #4ade80 dark, #16a34a light.
- **Use it only as a standalone mark, never inline with other words** (the dots would read as an ellipsis). Headers elsewhere use plain text in Space Grotesk.
- **Decision (2026-10-28): the marketing site uses the arc-and-shuttle mark** (the app icon: `public/brand/bpm-trajectory.png`, `native/assets/icon.png`), redrawn as a flat SVG in `components/Logo.tsx`, beside a plain `bpm.` wordmark.
- Rebuild it as an inline SVG or React component for the site. `public/brand/bpm-logo.svg` is an *older* lockup (a shuttlecock plus text in system fonts), so don't use it as the wordmark.

## Shuttlecock: `components/ShuttleIcon.tsx`, `public/brand/shuttlecock.svg`, `bpm-shuttlecock.png`

- This is the brand icon for anything about the sport (empty states, loaders). Use it instead of a tennis-racket icon.
- Also available: `public/brand/baddicon-{green,pink,yello}.svg`, `bpm-trajectory.png`, `public/brand/launch/` (launch-screen art), `app/icon.png` (app icon).
- Native icon and splash background: `#100F0F`.

## Type

| Role | Family | App files |
|---|---|---|
| Display (h1–h3, wordmark) | Space Grotesk, 600–700 | `app/fonts/SpaceGrotesk-Subset.woff2`; full variable TTF in `docs/design-system/fonts/` |
| Body / UI | IBM Plex Sans | `app/fonts/IBMPlexSans-Subset.woff2`; full TTFs (regular + italic) in `docs/design-system/fonts/` |
| Data (costs, times, counts) | JetBrains Mono | `app/fonts/JetBrainsMono-Subset.woff2` only, with no full file in the repo |

The app's woff2 files are **subsets** made for the app's own glyphs. For the site, self-host the full families with `next/font/local` or Fontsource; the app never uses `next/font/google`. Icons are Material Symbols Rounded.

Use uppercase micro-labels for sections (0.1em tracking, bold, accent color) instead of divider rules.

## Color

- Court green on near-black is the core: `#4ade80` on `#100F0F` for dark, `#16a34a` on cream `#FAF8F5` for light.
- Each app tab has its own colored "field" (radial glow at the top right): Home green, Stringing amber, Stats blue, Profile violet, Admin orange. That's a natural way to color-code site sections by feature area.
- Status colors (green success, amber waitlist, red error) must always come with an icon or label, because deuteranopia collapses that triad.

## Surfaces

- Cards are glass: backdrop blur, a translucent gradient, a 1px rim, and a 16px radius at most. 30px is allowed only for a card sitting on a field.
- Nest at most one level (Tier 2: flat tint, 12px radius). Lists use inline rows, not cards inside cards.
- The `03 Court` motif uses real doubles proportions (13.40m × 6.10m, so a 100:220 viewBox, aspect-locked). The old site's court was criticized as "wrong", so use these proportions.

## Motion

- Motion confirms a change and never performs. Default easing is `--ease-glass`. Overshoot (`--ease-spring`) is only for rare, celebratory moments.
- No hover lift on cards (app changelog, 2026-10-15).
- Under `prefers-reduced-motion`, stop transform and position animation, but keep opacity and color transitions so state changes still read.

## Don't

Avoid the gamified-sports look (confetti, neon, badges), Strava/Nike-style athletic bravado, and generic shadcn uniformity. Don't use emoji in copy. Keep text contrast at WCAG AA, and make sure it stays legible in a bright gym.

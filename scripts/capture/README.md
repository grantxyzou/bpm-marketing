# App media capture

These scripts produce the phone screenshots in `public/media/screens/` and the hero loop in `public/media/` (`hero-loop.mp4`, `hero-loop.webm`, `hero-poster.webp`). They drive a local copy of `grantxyzou/badminton-app` in mock mode, which uses an in-memory store and needs no secrets.

## Requirements

- Node 22, Playwright with Chromium (resolved from the global install), and `ffmpeg` on `PATH`.
- A checkout of `grantxyzou/badminton-app`. The examples assume `../badminton-app`.

## Steps

The app keeps its state in memory and each script seeds its own demo data. **Restart the dev server before each script.**

```bash
# 1. Install the app. Add --engine-strict=false if your Node is older than 22.22.2.
cd ../badminton-app && npm ci

# 2. Start mock mode on port 3100 (fresh-thursday scenario, admin Grant / PIN 1130, player Lin / 2468)
PORT=3100 npm run dev:next:mock
# wait until http://localhost:3100/bpm answers 200

# 3. Record the hero loop (~10s)
cd ../bpm-marketing/scripts/capture && node record-hero.mjs

# 4. Stop the dev server, start it again (step 2), then capture the screens
node capture-screens.mjs              # all screens
node capture-screens.mjs balance      # only re-save the named screens (the flow still runs)
```

Set `ORIGIN` if the server isn't on `http://localhost:3100`.

## What the scripts do to the demo data

- **Real club details are swapped out.** The mock seed uses Grant's real club and venue. `lib.mjs` rewrites API responses and on-screen text: "BPM Core" becomes "Thursday Shuttlers", the venue becomes "Northside Community Centre, Courts 3 & 4", and `localhost` invite links become the production app URL. The session is moved to next Thursday at 7:30 PM, Vancouver time.
- **Demo names.** Seed players are famous badminton players (Lin, Viktor and others). Added players use generic first names (`DEMO_PLAYERS`).
- **AI states are left out.** There's no `ANTHROPIC_API_KEY`, so the AI cards can't load. The Stats "You" tab error card is hidden, and the AI greeting, announcement polish and fit verdict aren't captured.
- **No e-transfer screens.** The "send the bill" shot is the session card after the bill is sent ("Sent · $15"), not the share sheet, which would show e-transfer payment details.
- **No dev chrome.** The Next.js dev indicator and the install banner are hidden.

## Output

- **Screens:** 390×844 viewport at 3× scale, so 1170×2532 PNG, plus a WebP copy at quality 82.
- **Hero video:** recorded through a CDP screencast at 2× (780×1688), then encoded as H.264 MP4 (CRF 24, faststart, no audio), VP9 WebM, and a WebP poster from the first frame.

## Week-story clips (`public/media/week/`)

`record-week.mjs` records the four clips the home page's "A week in BPM" story scrubs through as you scroll. It needs two fresh dev servers, because step 3 cancels Lin's spot and step 4 needs Lin on the bill.

```bash
# Fresh server (step 2 above), then:
node record-week.mjs a    # step-1 sign-up card, step-2 tap Join -> roster + waitlist, step-3 cancel your spot
# Stop the server, start it fresh again, then:
node record-week.mjs b    # step-4 the bill arrives, tap "I've sent it"
```

- Each clip is capped at 4 s (longer takes are sped up), 24 fps, 584×1264, H.264 **all-intra** (every frame a keyframe) so scrubbing can seek to any frame instantly. CRF starts at 26 and rises until the file is ≤ 1.2 MB.
- `step-N-first.webp` and `step-N-last.webp` are the first and last frames, for posters and reduced motion.
- Run `a` seeds 12 players plus two on the waitlist, then removes one placeholder player so Lin's sign-up takes the last spot with the waitlist already showing. The API ignores `waitlist: true` while there's room, which is why it fills first.
- The waitlist doesn't move up after Lin cancels: in the app, the organiser promotes from the waitlist.

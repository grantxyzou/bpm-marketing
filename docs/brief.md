# Task: Build the new bpm. marketing site

## Context
bpm. is a badminton group management app: weekly session sign-ups with caps and waitlists, announcements, per-person cost, attendance stats and streaks. The current marketing site (lively-sand-0633fbd0f.7.azurestaticapps.net) is outdated and uses hand-drawn mockups. Replace it with a complete, production-grade marketing site.

## Repos
- App (read-only reference): `grantxyzou/badminton-app`. Never push to it.
- Marketing site: the existing `grantxyzou/bpm-marketing`. Rebuild it in place on a branch, and move the old Claude Design bundle (`chats/`, `project/`, the old `index.html`/`css`/`js`) into `archive/`.

## Decisions (2026-10-28)
- Hosting: move to Vercel, and remove the Azure Static Web Apps workflow once Vercel is live.
- Domain: `www.motioncraft-bpm.com` (apex redirects to www). Already registered; point its DNS at Vercel at launch. Use the Vercel URL until then.
- Language: English only for v1. Structure the copy so zh-CN can be added later.
- Video: both the hero loop and the promo.
- Main call to action: "Get the app". The apps are in testing, not public, so the buttons link to the TestFlight and Play testing links (owner to supply) and are labelled as a beta. The store badges come later.
- Logo: the arc-and-shuttle mark (app icon; `badminton-app/public/brand/bpm-trajectory.png`, `native/assets/icon.png`). Get it as SVG or high-resolution for the site.
- Public content: no e-transfer matching, no real club facts, no member quotes. Use generic demo data in every screenshot and video.

## Phase 1: Understand the app (before writing any site code)
1. Read the app repo: README, routes/screens, data models, API, auth, payments, notifications.
2. Write `docs/app-overview.md` in the marketing repo covering: what the app does, who it's for, every user-facing feature (with the file that implements it), the main user flows, and the tech architecture.
3. Extract the brand: colors, fonts, logo, spacing and radius tokens. Save them as design tokens in the marketing repo.
4. Stop and send me a short summary with feature list, proposed sitemap and open questions before Phase 2.

## Phase 2: Build the site
- Stack: Next.js (App Router, TypeScript), Tailwind CSS, statically generated wherever possible.
- Pages:
  - `/`: hero with video, problem → solution, features, how it works, social proof slot, pricing, FAQ, final CTA
  - `/features`: a section for each feature, with real screenshots
  - `/how-it-works`: organizer flow and player flow
  - `/pricing`: <PRICING TIERS or "pull from app if defined, otherwise placeholder">
  - `/about`, `/privacy`, `/terms` (terms and privacy are placeholders marked for legal review)
  - `/architecture`: how bpm. works under the hood, with a diagram built from Phase 1
- Every feature claim must trace back to real app code. Don't invent features.
- Responsive down to 360px wide, dark theme first (matching the app) with light-mode support, accessible (WCAG AA, keyboard nav, alt text, reduced-motion support).
- CTAs link to: <APP URL / SIGN-UP URL / APP STORE LINKS>

## SEO
- Per-page title, description, canonical URL, Open Graph and Twitter tags (Next.js Metadata API)
- Generated OG images for each page
- `sitemap.xml`, `robots.txt`, JSON-LD (Organization, SoftwareApplication, FAQPage)
- Semantic HTML, a single h1 per page, descriptive headings, internal links
- Target keywords: badminton group sign-up, badminton club management, badminton session organizer, sports group waitlist app (refine based on the app)
- Lighthouse score ≥ 95 on Performance, Accessibility, Best Practices and SEO. Report the actual scores.

## Screenshots and video
- Run the app locally with seed/demo data (realistic names, not real users). If it can't run, mock the screens from the app's real components and tell me.
- Capture screenshots of each main screen with Playwright at phone size (2x and 3x), framed in device mockups.
- Video 1, the hero loop: 10–15s, muted, autoplay, no audio needed. Flow: open session → sign up → waitlist → stats streak. Record it with Playwright, export MP4 and WebM plus a poster image, under 3MB.
- Video 2, the promo/demo: 45–90s built with Remotion from real screenshots and recordings, with captions and text callouts for each feature. Embed it on `/` and `/features`.
- Commit the source files for both videos so they can be re-rendered.

## Deployment
- Deploy to Vercel (connected to this session): create the project, link the repo, deploy preview, then production.
- Custom domain: <DOMAIN or "none yet">
- Turn on Vercel Web Analytics.

## Delivery
- Work on a branch, open a draft PR into `main`, and make small commits.
- Final report: live URL, Lighthouse scores, page list, any placeholders I still need to fill in, and anything in the app that was unclear.

## Inputs I'm providing
- App repo: <OWNER/APP_REPO>
- Test login / seed data: <...>
- Pricing: <...>
- Domain: <...>
- App/sign-up links: <...>
- Testimonials or real group names I'm allowed to use: <...>

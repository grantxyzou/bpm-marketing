# BPM: app overview, for the marketing site

Source of truth: `grantxyzou/badminton-app` at `3cbb6f9` (2026-10-28). Every claim below was checked against code, `CHANGELOG.md`, `lib/flags.ts` and the production build env in `.github/workflows/deploy-next.yml`. Paths are relative to that repo. Marketing copy may only claim what is in **Live** below.

## 1. What it is

**BPM** (short for *Badminton Per Management*, `lib/brand.ts`) runs a casual weekly badminton session, so the group chat stops doing the work. It handles sign-ups, the waitlist, each person's cost share and who has paid, and nobody has to rebuild all of that from the chat every week.

- From `PRODUCT.md`: *"Success is that the weekly ritual takes less effort than texting the group chat, and that settling up never feels like being invoiced by a company."*
- A club is a roster, a weekly session and a cost split. **It is not a league, a venue-booking platform or a multi-sport app.** All three are explicit non-goals in `ROADMAP.md`.
- **Naming:** the app is **BPM**. Grant's own club (group #1, Thursday nights in Vancouver) is **BPM Core**. Don't mix them up in copy (changelog 2026-10-22). The wordmark is lowercase `bpm.`.
- **Where it runs:** https://bpm.grantzou.com/bpm (web, installable PWA), plus the **App Store and Google Play** (bundle id `com.motioncraft.bpm`), live since 2026-10-07.
- **Price:** free. From the terms (`messages/en.json`, `legal.terms`): *"It's free today; if a paid plan is ever introduced it will be announced in the app first, and nothing you've already done becomes payable after the fact."* It's run by one volunteer operator in BC, Canada. `docs/plans/pricing.md` records that no pricing model is chosen (affiliate links, the stringing shop and a per-club tier are only options), with a review date of 2026-12-02.
- **Scale today:** one live club of about 72 members (`docs/plans/pricing.md`). Multi-group went live 2026-10-22, so any organiser can now start their own club from the store app.

## 2. Who it's for

**Two clocks** (`PRODUCT.md`). Every screen serves one of them:

- **The 30-second visit (players).** Players open the app about once a week, on a phone, in the group chat or at the gym, to answer: am I in, what do I owe, when and where. They'll never explore it.
- **The 20-minute session (organisers).** Organisers open sign-ups and manage the invite list, waitlist, shuttle usage, cost settling, covering people, advancing the week and announcements. It's consequential work: a wrong number means someone is billed wrong.
- **A third person:** the organiser of *another* casual club who arrives from the store listing with no invite (`lib/pageGate.ts`, `components/onboarding/CreateGroupPage.tsx`).

**Language is a first-class fact.** About half the players read Chinese first. The app is fully bilingual in English and Simplified Chinese (`messages/en.json`, `messages/zh-CN.json`, `next-intl`).

**Personas** (`docs/user-research-simulation.md` §3, AI-simulated research):

| Persona | Role |
|---|---|
| Kevin, the Organizer | Runs the session; chases 2–3 late payments over WhatsApp/WeChat every week |
| Priya, the Core Regular | Plays every week |
| Marcus, the Flaky One | Signs up, then cancels |
| Emily, the Beginner | Wants to improve |
| Jason, the Competitive One | Cares about level and record |
| Linda, the Social Glue | Brings people in |
| Uncle Chen, the Chinese-Primary Elder | Needs Chinese and larger text |
| Amy, the Occasional Spouse | Drops in |

**Don't market to** rec-league coordinators or corporate wellness organisers. `PRODUCT.md` says they are not users. The current marketing site lists both under "Who it's for".

## 3. Features: live in production

All feature flags in `lib/flags.ts` are on in production. Stringing, gear recommender, payments auto-match, store credit, ledger mirror, native migrate and multi-group are each `'true'` in `deploy-next.yml`.

### Players

| Feature | What it does | Code |
|---|---|---|
| Home sign-up card | Date/time and venue tiles, the announcement with a cost-per-person line, one-tap Join. It opens a numbered roster plus waitlist. | `components/HomeTab.tsx`, `components/home/WhoElseIsIn.tsx` |
| Waitlist | Over capacity, you land on the waitlist, and the admin promotes from it | `lib/capacity.ts`, `app/api/players` |
| Self-cancel | Cancel your own spot. If the club has the policy on, a late cancel shows a warning you confirm. | `lib/cancelPolicy.ts`, `docs/plans/late-cancel-fee.md` |
| Shuttle burst | A small shuttle animation plays when you sign up | `components/home/ShuttleBurst.tsx` |
| Balance and "what I owe" | Your balance on Home, an "I've sent it" button, past receipts | `components/UnpaidSessionsCard.tsx`, `lib/owedBalance.ts`, `components/admin/CommandCenter/ReceiptSheet.tsx` |
| Store credit and gift cards | Redeem a gift code, pay with credit | `components/RedeemGiftSheet.tsx`, `lib/storeCredit.ts`, `app/api/credit` |
| Stringing | Request a restring, choose strings (string map: control/feel versus durability) and tension, follow the job | `components/StringingTab.tsx`, `components/stringing/*`, `lib/stringing*.ts` |
| Stats: You | AI-written greeting, skill trend, "where you sit" in the club, kudos received | `components/stats/SummaryGreeting.tsx`, `SkillTrendCard.tsx`, `WhereYouSitCard.tsx`, `KudosReceivedCard.tsx`, `app/api/stats/insight` |
| Stats: Play | Log games (teams and score), your record, who you play with, give kudos | `components/stats/SteppedGameLoggerSheet.tsx`, `YourRecordCard.tsx`, `WhoYouPlayWithCard.tsx`, `GiveKudosCard.tsx`, `app/api/games`, `app/api/kudos` |
| Stats: Learn | A weekly focus plus drills (ACE skills matrix) | `components/stats/LearnRegister.tsx`, `lib/drills.ts`, `lib/skills-data.ts` |
| Stats: Gear | Your racket and string set-up, fit profile, a fit verdict on your racket, next-racket and string-pairing recommendations, the racket in 3D, a share card, the tension ruler | `components/stats/GearRegister.tsx`, `FitProfilePage.tsx`, `NextRacketCard.tsx`, `Racket3D.tsx`, `lib/racketFit.ts`, `lib/racketRecommend.ts`, `lib/stringPair.ts`, `app/api/recommend`, `app/api/equipment/fit-verdict` |
| Stats privacy | Opt-in consent before club comparison is shown; locked cards otherwise | `components/StatsPrivacyScreen.tsx`, `components/stats/ClubConsentSheet.tsx`, `lib/statsPrivacy.ts` |
| Sign-in | 4-digit PIN, Google, Apple, email; a recovery PIN | `components/SignInForm.tsx`, `lib/oauthProviders.ts`, `components/RecoveryPinSheet.tsx` |
| Push notifications | For example, when sign-ups open. Web Push plus FCM in the native app. | `lib/push.ts`, `lib/fcm.ts`, `components/PushSheet.tsx` |
| Native extras | Home- and lock-screen widgets (Join/Undo from the widget), an icon badge showing what you owe, long-press shortcuts | `lib/widget.ts`, `app/api/widget`, `lib/appBadge.ts`, `lib/appShortcuts.ts`, `docs/plans/native-widgets.md` |
| Language and theme | English / 简体中文, light / dark following the system | `components/LanguageToggle.tsx`, `components/ThemeToggle.tsx` |
| Your clubs | One account across several clubs | `lib/groups.ts`, `components/ProfileTab.tsx` |
| Join flow | Join a club from a one-time invite link or code, or ask for access | `components/onboarding/JoinGroupPage.tsx`, `lib/invites.ts`, `components/AskAccessSheet.tsx` |
| Report a problem, delete account | In-app report that includes the screen you were on; self-serve deletion | `components/ReportProblemSheet.tsx`, `app/api/members/me`, `app/legal/delete-account` |

### Organisers (admin "Command Center", Profile → Admin tools)

| Feature | What it does | Code |
|---|---|---|
| Start a club | Name a club from the no-club screen and become its organiser | `components/onboarding/CreateGroupPage.tsx`, `app/api/groups` |
| Next session | Venue, capacity, deadline, open/close sign-ups, skip dates, advance the week | `components/admin/CommandCenter/NextSessionCard.tsx`, `SkipDatesEditor.tsx`, `components/admin/AdvanceSessionForm.tsx` |
| Invites and access | One-time invite links, the invite list, sign-in requests | `InviteCard.tsx`, `AccessRequestsCard.tsx`, `lib/invites.ts` |
| Roster | Members, roles, profile sheet, reset access | `RosterPage.tsx`, `PlayerProfileSheet.tsx`, `components/admin/ResetAccessSheet.tsx` |
| AI announcements | Draft, then "Polish with AI" (Claude). A human edits before players see it. | `AnnouncementsCard.tsx`, `app/api/claude`, `lib/aiModels.ts` (`PROSE_MODEL`) |
| Cost split and "Send the bill" | Court plus shuttle cost split per player, settle the week, cover someone | `lib/sessionCost.ts`, `lib/resettleSession.ts`, `components/admin/CoverSheet.tsx` |
| E-transfer auto-matching | The admin's Gmail Apps Script forwards Interac emails, and the app marks matched players paid. The rest go to a "Needs a look" inbox. Name aliases cover mismatches. | `lib/etransferParse.ts`, `lib/etransferMatch.ts`, `PaymentsInboxCard.tsx`, `app/api/payments`, `docs/plans/payments.md` |
| Payments and ledger | Who owes what, receipts, an append-only ledger, a money view | `PaymentsCard.tsx`, `components/admin/LedgerPage.tsx`, `lib/ledger*.ts` |
| Unpaid hold (optional) | With 2+ unpaid settled sessions, a new sign-up lands on the waitlist. Admin switch, off by default. | `app/api/players` (POST), `lib/paymentReminders.ts` |
| Late-cancel policy | Per-club window; late cancels are tagged for the admin. Nothing is charged automatically. | `LateCancelEditor.tsx`, `lib/cancelPolicy.ts` |
| Store credit and gift cards | Give credit, mint single-use `BPM-` gift codes | `components/admin/CreditSection.tsx`, `GiftCardsCard.tsx`, `components/GiveGiftSheet.tsx` |
| Shuttle (bird) inventory | Purchases, tubes used per session, stock runway | `BirdsPage.tsx`, `BirdPurchaseSheet.tsx`, `lib/birdRunway.ts` |
| Stringing bench | Job queue, intake, pricing, string shelf/stock, shop open/closed | `StringingPage.tsx`, `StringingIntake.tsx`, `StringShelfCard.tsx`, `lib/stringStock.ts` |
| Metrics and anomalies | Attendance, sign-up timing, payments over time; an anomaly feed | `components/admin/MetricsPage.tsx`, `AnomalyFeed.tsx`, `lib/anomalies.ts` |
| Release notes | In-app "what's new", AI-drafted | `components/ReleaseNotesSheet.tsx`, `components/admin/ReleaseForm.tsx` |

### Removed, or don't claim

- **Attendance streaks and the attendance heatmap were REMOVED** in Stats Stage 8 (2026-08-20). The current site's "9-week streak" phone and "attendance heatmap" pricing bullet are both wrong.
- **A Sign-Ups tab no longer exists.** It folded into the Home card on 2026-09-16. Today's tabs are Home, Stringing, Stats and Profile; Admin opens from Profile.
- **Paid tiers ("Club $15/mo"), CSV export, "Unlimited sessions", "12-player cap":** none exist. The app is free, and capacity is a per-session setting (default 12).
- **Card payments:** a non-goal. The app *records* money (e-transfer matching, ledger, credit) but never *processes* it.
- **"Players sign up and pay themselves" / "no chasing":** be careful. Payment is by Interac e-transfer to the organiser. Auto-matching needs the admin to install a Gmail script, and it is Canada-specific.
- **Skill radar:** Stats now uses trend bars and "where you sit", drawn in inline SVG. Recharts was removed in the Stage 8 rewrite. Check with the owner before showing a radar.
- **AI features depend on `ANTHROPIC_API_KEY`.** They are live in production but not in local mock mode.

## 4. Main user flows (good candidates for the video)

1. **Player's week:** a push says "sign-ups open" → open the app → Join (shuttle burst) → see yourself numbered in the roster, or on the waitlist → after the session, the bill appears in your balance → "I've sent it" → marked paid when the e-transfer is matched.
2. **Organiser's week:** set the next session → write the announcement and polish it with AI → open sign-ups → watch the roster and waitlist, promote from the waitlist → log shuttle tubes → Send the bill (settle) → e-transfers auto-match, check "Needs a look" → advance to next week.
3. **New club:** install from the store → create an account → name your club → share a one-time invite link → the first session.
4. **Between sessions:** Stats → log a game → give kudos → the week's focus drill → Gear: your racket fit verdict and string pairing → request a restring.

## 5. Architecture (for a diagram)

```
 iOS app (Capacitor 8)     Android app (Capacitor 8)     Browser / installed PWA
   WebView loads LIVE URL ──┐   │ widgets, badge,              │
   (no native web build)    │   │ shortcuts, FCM push          │ Web Push (VAPID)
                            ▼   ▼                              ▼
              ┌───────────────────────────────────────────────────────┐
              │  Next.js 16 (App Router, React 19, TS, Tailwind)       │
              │  one deployment: https://bpm.grantzou.com/bpm          │
              │  Azure App Service (Canada Central, B1, standalone)    │
              │  ├─ server components: page gate (signed-in/out/no-club)│
              │  ├─ ~100 API routes /api/* (members-only, rate-limited)│
              │  ├─ groupScope: every read filtered by club            │
              │  └─ next-intl: en + zh-CN, America/Vancouver time      │
              └──────┬──────────────┬──────────────┬──────────────┬────┘
                     ▼              ▼              ▼              ▼
             Azure Cosmos DB   Anthropic       Firebase (FCM) / Email (SMTP,
             (NoSQL, ~27       Claude API      Web Push         nodemailer)
             containers)       announcements,
                               Stats insight,
                               fit verdict
   Admin's Gmail ─(Apps Script forwards Interac e-transfer emails)─▶ POST /api/payments/etransfer
   Auth: PIN (scrypt) + Google + Apple + email → HMAC-signed HTTP-only cookies
   CI/CD: GitHub Actions — PR verify (lint, ~4.8k Vitest tests, build) → merge to main = deploy
```

Key facts:
- **One deployment.** Every merge to `main` goes straight to production, and feature flags gate unfinished work. Since the native shells load the live URL, a web deploy is also a native update (`capacitor.config.ts`).
- **Multi-club in one database.** `lib/groupScope.ts` is the only path to club data.
- **Self-hosted fonts and a subset icon font.** First paint never waits on Google.

## 6. Voice and guardrails for marketing copy

From `docs/voice-and-tone.md`: **"A reliable, insightful friend… never a scold, a salesman, or a scoreboard."** A warm, plain-spoken 25–45-year-old peer who plays.

- Informational, never controlling. Calm, never urgent: no countdowns, "last chance" or manufactured scarcity.
- Self-referenced, never comparative. No "beat your friends".
- Honest, not flattering. **Never invent numbers.** The current site's "0h admin overhead", "$0 awkward payment conversations" and "12+ players growing" stats break this.
- Plain and warm, with contractions. **No emoji**, no hashtags, no exclamation pile-ups, no Gen-Z slang, no corporate speak.
- Use "Send the bill", not "Settle".

Anti-references (`PRODUCT.md`), which the site's look must avoid too:
- A gamified sports or betting app: streak confetti, neon gradients, dopamine badges.
- Strava/Nike performance-brand bravado: hero athletes, motivational voice, data as spectacle. *"Every club here is friends booking a court."*
- The generic shadcn/Material default: uniform cards, no point of view.

Brand personality: **calm, precise, quietly premium.** *"The details are the product… Craft is the differentiator."*

Bilingual matters to the users. The site's v1 is English-only (owner's decision, 2026-10-28), but keep the copy in a messages file so zh-CN can be added later. Saying "works in English and 简体中文" is a fair feature claim.

## 7. Facts the site needs

| Item | Value |
|---|---|
| App URL | https://bpm.grantzou.com/bpm |
| Legal pages | `/bpm/legal/privacy`, `/bpm/legal/terms`, `/bpm/legal/support`, `/bpm/legal/delete-account` (server-rendered in the app; link to them rather than duplicating) |
| Store listings | Live on both stores since 2026-10-07. **The URLs aren't in the repo; the owner needs to provide them.** Bundle/package id `com.motioncraft.bpm`. |
| OG image | The app's `app/opengraph-image.tsx` is a dynamic card for **the club** (BPM Core), not the product. The marketing site needs its own. |
| Pricing | Free. No tiers exist. |
| Screenshot data | Mock mode, below |

### Running the app for screenshots (no secrets needed)

`COSMOS_CONNECTION_STRING` left empty gives an in-memory store. In development, `SESSION_SECRET` falls back to a dev value (`lib/auth.ts`). Seeded scenarios are in `lib/cosmos.ts`:

```bash
cd badminton-app && npm ci
npm run dev:next:mock          # all prod flags on, SEED_DEV_SCENARIO=fresh-thursday, admin Grant / PIN 1130
# → http://localhost:3000/bpm
# Alternatives: SEED_DEV_SCENARIO=played-thursday (post-session: kudos, game log; sign in as Lin / 2468)
#               SEED_DEV_SCENARIO=metrics-history (12 past weeks for Admin → Metrics)
# See scripts/dev-demo.sh
```

Seeded names are famous players: Lin, Viktor, Carolina, Akane, Kento, Sindhu. Without `ANTHROPIC_API_KEY`, the AI greeting, announcement polish and fit verdict won't generate. Screenshot those with a key, or show the non-AI state.

## 8. Strategy flag for the owner

`ROADMAP.md`'s locked non-goals and `docs/plans/pricing.md` both list **"a marketing site"** (as part of multi-tenant SaaS) as out of scope. Separately, `PRODUCT.md` says the marketing surface lives in this repo. Rebuilding the site is presumably Grant's deliberate call. Still, the site shouldn't promise SaaS things the lock rules out: billing, tiers, a sales motion.

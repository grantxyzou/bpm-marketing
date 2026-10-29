import type { Metadata } from 'next';
import Image from 'next/image';
import { pageMeta } from '@/lib/meta';
import { PageHero } from '@/components/PageHero';
import { NextSteps } from '@/components/NextSteps';
import { Section } from '@/components/Section';
import { Phone } from '@/components/Phone';
import { CallToAction } from '@/components/CallToAction';
import { GetTheApp } from '@/components/GetTheApp';

export const metadata: Metadata = pageMeta(
  '/stringers',
  'For stringers',
  'Run restringing for your badminton club in BPM: a job bench with due dates, walk-up intake, a string shelf with stock and prices, price changes the player confirms, and the bill on their balance.',
);

// The job statuses exactly as the app names them (lib/stringing.ts).
const STATUSES = ['Requested', 'Received', 'Strung', 'Ready', 'Picked up'];

type Media = { kind: 'img'; src: string; alt: string } | { kind: 'due' } | { kind: 'notify' };

const BENCH: { t: string; b: string; media: Media }[] = [
  {
    t: 'Every racket on one bench',
    b: 'Jobs move from Requested to Picked up, one tap at a time, with Undo if you tap the wrong one. Switch between your jobs and everyone’s.',
    media: { kind: 'img', src: '/media/crops/bench-list.webp', alt: 'Two jobs on the BPM stringing bench with their status and due date, under a Mine / All switch' },
  },
  {
    t: 'Due dates you can see',
    b: 'Each job has a “Ready by” date, and the bench flags what’s due today, tomorrow or running late.',
    media: { kind: 'due' },
  },
  {
    t: 'Walk-ups welcome',
    b: 'Start a new job for any member. BPM suggests the racket and string from their last job and what’s in their bag.',
    media: { kind: 'img', src: '/media/crops/intake-suggest.webp', alt: 'BPM suggesting a player’s strings: the last job here and the string in their bag' },
  },
  {
    t: 'Tension, done properly',
    b: 'Mains and crosses set separately, from 18 to 32 lb, with the stringing method and the racket’s hole count.',
    media: { kind: 'img', src: '/media/crops/intake-tension.webp', alt: 'BPM tension control set to 26 lb for the mains' },
  },
  {
    t: 'Share the work',
    b: 'Assign a job to a stringer, or let a stringer claim it with “Take this one”. Pin what’s urgent; archive what’s done.',
    media: { kind: 'img', src: '/media/crops/assigned-job.webp', alt: 'A job assigned to a stringer in BPM, with a Mark received button' },
  },
  {
    t: 'Players hear when it’s ready',
    b: 'A push notification and an email when their racket is being strung and when it’s ready to pick up.',
    media: { kind: 'notify' },
  },
];

const SHELF = [
  { t: 'Stock you can trust', b: 'Log the reels and sets you buy. BPM counts down as you string and shows each string as In stock, Low or Out.' },
  { t: 'Your prices, per string', b: 'Set a restring price for each string, a price for bring-your-own, and a note players see when they ask.' },
  { t: 'Cost per set', b: 'See what each set actually costs you from what you paid, and the colours you have on the reel.' },
];

const PLAYER = [
  { t: 'Ask for a restring', b: 'Pick the racket, then a string from what you stock, or bring their own.' },
  { t: 'Choose with a map', b: 'Strings laid out by control and feel against durability, with ratings, gauge and a short guide to choosing.' },
  { t: 'Pick the tension', b: 'Mains and crosses, with a heads-up if the pair is unusual.' },
  { t: 'Follow the job', b: 'Waiting for your racket, with the stringer, being strung, ready for you, picked up.' },
  { t: 'A nudge to restring', b: 'Eight weeks after a restring, a gentle reminder that it might be time again.' },
];

// Due labels and notification text are the app's own wording (admin.stringing.due.*, lib/pushMessages.ts).
function TileMedia({ media }: { media: Media }) {
  if (media.kind === 'img') {
    return (
      <Image
        src={media.src}
        alt={media.alt}
        width={780}
        height={400}
        sizes="(min-width: 1024px) 340px, 90vw"
        className="h-auto max-h-full w-auto max-w-full rounded-xl object-contain"
      />
    );
  }
  if (media.kind === 'due') {
    return (
      <ul className="flex w-full max-w-[260px] flex-col gap-2" aria-label="Due labels on the bench">
        {[
          ['Carolina', '1 day late', '#fca5a5'],
          ['Viktor', 'Today', '#fbbf24'],
          ['Lin', 'Tomorrow', '#fbbf24'],
        ].map(([n, d, c]) => (
          <li key={n} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2.5 text-[14px] text-[#e8ecf1]">
            <span>{n}</span>
            <span className="font-semibold" style={{ color: c }}>
              {d}
            </span>
          </li>
        ))}
      </ul>
    );
  }
  return (
    <ul className="flex w-full max-w-[280px] flex-col gap-2" aria-label="Notifications a player gets">
      {[
        ['On the machine', 'Astrox 88D Pro is being strung. Ready by Thu.'],
        ['Your racket is ready', 'Astrox 88D Pro — ready to pick up.'],
      ].map(([t, b]) => (
        <li key={t} className="flex gap-3 rounded-2xl bg-white/[0.08] p-3 text-[#e8ecf1]">
          <Image src="/icon.png" alt="" width={36} height={36} className="h-9 w-9 shrink-0 rounded-lg" />
          <div className="min-w-0">
            <p className="text-[13px] font-semibold leading-tight">{t}</p>
            <p className="mt-0.5 text-[12.5px] leading-snug text-white/70">{b}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default function StringersPage() {
  return (
    <>
      <PageHero
        path="/stringers"
        hue="amber"
        label="For stringers"
        title="Run your club’s restringing like a small shop."
        lede="If you string rackets for the people you play with, BPM gives you a bench for the jobs, a shelf for your strings, and a bill that lands on the player’s balance with everything else they owe."
      >
        <div className="mt-2">
          <GetTheApp />
        </div>
      </PageHero>

      <Section label="The bench" hue="amber" title="Every racket, from drop-off to pick-up.">
        <ol className="mb-12 flex flex-wrap items-center gap-2" aria-label="Job statuses">
          {STATUSES.map((s, i) => (
            <li key={s} className="flex items-center gap-2">
              <span className="mono rounded-full border border-[color-mix(in_srgb,var(--amber)_45%,transparent)] px-3 py-1.5 text-sm text-[var(--amber)]">
                {s}
              </span>
              {i < STATUSES.length - 1 && (
                <svg width="34" height="14" viewBox="0 0 34 14" aria-hidden="true" className="string-arrow text-[var(--amber)]">
                  <path d="M1 7q2.5-5 5 0t5 0 5 0 5 0 5 0" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M27 3l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </li>
          ))}
        </ol>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {BENCH.map((x) => (
            <li key={x.t} className="glass flex flex-col overflow-hidden">
              <div className="flex h-[200px] items-center justify-center bg-[#141210] p-4">
                <TileMedia media={x.media} />
              </div>
              <div className="p-5">
                <h3 className="text-lg font-semibold">{x.t}</h3>
                <p className="mt-1.5 text-[15px] text-text-2">{x.b}</p>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      <Section label="Your shelf" hue="amber" title="Know what’s on the reel before someone asks.">
        <div className="grid items-center gap-12 md:grid-cols-[1.2fr_1fr]">
          <ul className="flex flex-col gap-6">
            {SHELF.map((x) => (
              <li key={x.t} className="string-rule pl-6">
                <h3 className="text-xl font-semibold">{x.t}</h3>
                <p className="mt-1 text-text-2">{x.b}</p>
              </li>
            ))}
          </ul>
          <div className="flex justify-center">
            <Phone src="/media/screens/stringer-shelf.webp" alt="BPM string shelf with prices and stock levels" className="max-w-[260px]" />
          </div>
        </div>
      </Section>

      <Section
        label="Money"
        hue="amber"
        title="Prices players agree to, on a bill they already check."
        lede="Restringing goes through the same balance as court and shuttle costs, so nobody has to remember a separate payment."
      >
        <div className="grid gap-6 md:grid-cols-3">
          {[
            ['A range up front', 'Players see the likely price when they ask, and the exact amount on their balance once the job is done.'],
            ['Changes need a yes', 'If you change the string or the price, the player is asked to confirm. The bill stays as it was until they do.'],
            ['Billed when it’s ready', 'A job lands on the balance once it’s priced and ready. An organiser marks it paid, and a paid job can’t be re-priced.'],
          ].map(([t, b]) => (
            <div key={t} className="field glass p-6" data-hue="amber">
              <h3 className="text-lg font-semibold">{t}</h3>
              <p className="mt-1.5 text-[15px] text-text-2">{b}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section label="Who does what" hue="amber" title="Stringers string. Organisers handle the money.">
        <div className="grid items-center gap-12 md:grid-cols-[1.2fr_1fr]">
          <div className="flex flex-col gap-8">
            <div className="string-rule pl-6">
              <h3 className="text-xl font-semibold">Stringers</h3>
              <p className="mt-1.5 text-text-2">
                An organiser ticks “Can string” on a member. They see the rackets assigned to them and move jobs along. No prices, no
                payments, and no other admin tools.
              </p>
            </div>
            <div className="string-rule string-rule-muted pl-6">
              <h3 className="text-xl font-semibold">Organisers</h3>
              <p className="mt-1.5 text-text-2">
                Open or close the shop, run the full bench, set prices and the shelf, and mark jobs paid. Until the shop is open, players
                see “Coming soon”.
              </p>
            </div>
          </div>
          <figure className="flex flex-col items-center gap-3">
            <Phone src="/media/screens/stringer-assigned.webp" alt="A stringer’s view in BPM: rackets assigned to them, with Mark received and Mark ready, and no prices" className="max-w-[280px]" />
            <figcaption className="text-sm text-text-3">What a stringer sees</figcaption>
          </figure>
        </div>
      </Section>

      <Section label="For the player" hue="amber" title="Asking for a restring takes a minute.">
        <div className="grid items-center gap-12 md:grid-cols-[1fr_1.2fr]">
          <div className="flex justify-center gap-4">
            <Phone src="/media/screens/stringing.webp" alt="BPM restring request with strings, prices and tension" className="max-w-[240px]" />
            <Phone src="/media/screens/stringing-tracking.webp" alt="BPM stringing card showing a job in progress" className="mt-12 hidden max-w-[240px] sm:block" />
          </div>
          <ol className="flex flex-col gap-5">
            {PLAYER.map((x, i) => (
              <li key={x.t} className="flex gap-5">
                <span className="mono mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-divider text-sm text-[var(--amber)]">
                  {i + 1}
                </span>
                <div>
                  <h3 className="text-lg font-semibold">{x.t}</h3>
                  <p className="mt-1 text-[15px] text-text-2">{x.b}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Section>

      <NextSteps links={['/organisers', '/features']} />
      <CallToAction />
    </>
  );
}

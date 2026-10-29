import type { Metadata } from 'next';
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

const BENCH = [
  {
    t: 'Every racket on one bench',
    b: 'Jobs move from Requested to Picked up, one tap at a time, with Undo if you tap the wrong one. Switch between your jobs and everyone’s.',
  },
  { t: 'Due dates you can see', b: 'Each job has a “Ready by” date, and the bench flags what’s due today, tomorrow or running late.' },
  { t: 'Walk-ups welcome', b: 'Start a new job for any member. BPM suggests the racket and string from their last job and what’s in their bag.' },
  { t: 'Tension, done properly', b: 'Mains and crosses set separately, from 18 to 32 lb, with the stringing method and the racket’s hole count.' },
  { t: 'Share the work', b: 'Assign a job to a stringer, or let a stringer claim it with “Take this one”. Pin what’s urgent; archive what’s done.' },
  { t: 'Players hear when it’s ready', b: 'A push notification and an email when their racket is being strung and when it’s ready to pick up.' },
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
                <svg width="18" height="10" viewBox="0 0 18 10" aria-hidden="true" className="text-text-3">
                  <path d="M0 5h15M11 1l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              )}
            </li>
          ))}
        </ol>
        <div className="grid items-start gap-12 lg:grid-cols-[1fr_1.5fr]">
          <div className="flex justify-center gap-4 lg:sticky lg:top-24">
            <Phone src="/media/screens/stringer-bench.webp" alt="BPM stringing bench with jobs at different stages and due dates" className="max-w-[240px]" />
            <Phone src="/media/screens/stringer-intake.webp" alt="BPM new stringing job with racket, string and mains and crosses tension" className="mt-12 hidden max-w-[240px] sm:block" />
          </div>
          <ul className="grid gap-4 sm:grid-cols-2">
            {BENCH.map((x) => (
              <li key={x.t} className="glass p-5">
                <h3 className="text-lg font-semibold">{x.t}</h3>
                <p className="mt-1.5 text-[15px] text-text-2">{x.b}</p>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <Section label="Your shelf" hue="amber" title="Know what’s on the reel before someone asks.">
        <div className="grid items-center gap-12 md:grid-cols-[1.2fr_1fr]">
          <ul className="flex flex-col gap-6">
            {SHELF.map((x) => (
              <li key={x.t} className="border-l-2 border-[var(--amber)] pl-5">
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
        <div className="grid gap-6 md:grid-cols-2">
          <div className="border-t border-divider pt-5">
            <h3 className="text-lg font-semibold">Stringers</h3>
            <p className="mt-1.5 text-[15px] text-text-2">
              An organiser ticks “Can string” on a member. They see the rackets assigned to them and move jobs along. No prices, no
              payments, and no other admin tools.
            </p>
          </div>
          <div className="border-t border-divider pt-5">
            <h3 className="text-lg font-semibold">Organisers</h3>
            <p className="mt-1.5 text-[15px] text-text-2">
              Open or close the shop, run the full bench, set prices and the shelf, and mark jobs paid. Until the shop is open, players
              see “Coming soon”.
            </p>
          </div>
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

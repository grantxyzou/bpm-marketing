import type { Metadata } from 'next';
import { pageMeta } from '@/lib/meta';
import { PageHero } from '@/components/PageHero';
import { NextSteps } from '@/components/NextSteps';
import { Section } from '@/components/Section';
import { Phone } from '@/components/Phone';
import { CallToAction } from '@/components/CallToAction';
import { GetTheApp } from '@/components/GetTheApp';

export const metadata: Metadata = pageMeta('/organisers', 'For organisers', 'Run your casual badminton club in BPM: invite links, sign-ups and waitlist, shuttle stock, splitting the court cost and sending the bill. Free to start.');

const STEPS = [
  { t: 'Install and create an account', b: 'iPhone, Android or the browser. A PIN is enough to start.' },
  { t: 'Name your club', b: 'You become its organiser. Your club’s roster and money are kept separate from every other club.' },
  { t: 'Share an invite link', b: 'One-time links or codes, so only the people you invite can sign up.' },
  { t: 'Set the first session', b: 'Venue, time, how many spots and when sign-ups close. Then open it.' },
];

const TOOLS = [
  {
    t: 'The next session',
    b: 'Venue, capacity and deadline. Open and close sign-ups, skip a holiday week, and move to next week when you’re done.',
  },
  { t: 'Invites and access', b: 'One-time invite links, an invite list, and requests from people asking to join.' },
  { t: 'Roster and waitlist', b: 'Everyone in order. Promote from the waitlist, or cover someone who couldn’t make it.' },
  {
    t: 'Costs and Send the bill',
    b: 'Court and shuttle costs split across whoever played. Send the bill and everyone sees their share. Settling is blocked while sign-ups are still open, so the numbers can’t shift under you.',
  },
  { t: 'Payments and ledger', b: 'Who owes what, who has paid, past receipts and an append-only ledger. Give credit or make gift codes.' },
  { t: 'Shuttle stock', b: 'Log what you buy and what each session uses, and see how long the stock will last.' },
  { t: 'Late-cancel policy', b: 'Optional. Set a window, and late cancels are flagged for you. Nothing is charged automatically.' },
  { t: 'Announcements', b: 'Write the week’s note, and tidy it up with AI if you like. You always see it before players do.' },
  { t: 'Stringing bench', b: 'If someone in your club strings, run a queue with intake, prices and a string shelf. More on the stringers page.' },
];

export default function OrganisersPage() {
  return (
    <>
      <PageHero
        path="/organisers"
        hue="orange"
        label="For organisers"
        title="You book the courts. BPM does the rest of the admin."
        lede="If you’re the person who counts names, keeps the waitlist and chases payments every week, this is for you. Start a club in a few minutes, free."
      >
        <div className="mt-2">
          <GetTheApp />
        </div>
      </PageHero>

      <Section label="Getting started" hue="orange" title="From nothing to your first session.">
        <div className="grid items-center gap-12 md:grid-cols-[1.2fr_1fr]">
          <ol className="flex flex-col gap-6">
            {STEPS.map((s, i) => (
              <li key={s.t} className="flex gap-5">
                <span className="mono mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-divider text-sm text-[var(--orange)]">
                  {i + 1}
                </span>
                <div>
                  <h3 className="text-xl font-semibold">{s.t}</h3>
                  <p className="mt-1 text-text-2">{s.b}</p>
                </div>
              </li>
            ))}
          </ol>
          <div className="flex justify-center">
            <Phone src="/media/screens/create-club.webp" alt="BPM screen for naming a new club" className="max-w-[260px]" />
          </div>
        </div>
      </Section>

      <Section
        label="Your console"
        hue="orange"
        title="Everything you do on a Thursday night, in one place."
        lede="Organiser tools open from your profile. They’re built for the twenty minutes you actually spend, not squeezed into the player’s thirty seconds."
      >
        <div className="grid items-start gap-12 lg:grid-cols-[1fr_1.5fr]">
          <div className="flex justify-center gap-4 lg:sticky lg:top-24">
            <Phone src="/media/screens/admin-command-center.webp" alt="BPM organiser console" className="max-w-[240px]" />
            <Phone src="/media/screens/admin-send-the-bill.webp" alt="BPM Send the bill screen with the cost split per player" className="mt-12 hidden max-w-[240px] sm:block" />
          </div>
          <ul className="grid gap-4 sm:grid-cols-2">
            {TOOLS.map((t) => (
              <li key={t.t} className="glass p-5">
                <h3 className="text-lg font-semibold">{t.t}</h3>
                <p className="mt-1.5 text-[15px] text-text-2">{t.b}</p>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <Section label="What it isn’t" hue="orange" title="Deliberately small.">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            ['Not a league manager', 'No fixtures, divisions or standings. It’s for friends who book a court every week.'],
            ['Not a booking platform', 'You still book the courts with your venue. BPM handles everything after that.'],
            ['Not a payment processor', 'Money moves between your players and you, the way it does now. BPM keeps the record.'],
          ].map(([t, b]) => (
            <div key={t} className="border-t border-divider pt-5">
              <h3 className="text-lg font-semibold">{t}</h3>
              <p className="mt-1.5 text-[15px] text-text-2">{b}</p>
            </div>
          ))}
        </div>
      </Section>

      <NextSteps links={['/how-it-works', '/faq']} />
      <CallToAction />
    </>
  );
}

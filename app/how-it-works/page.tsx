import type { Metadata } from 'next';
import Link from '@/components/SiteLink';
import { pageMeta } from '@/lib/meta';
import { PageHero } from '@/components/PageHero';
import { NextSteps } from '@/components/NextSteps';
import { Section } from '@/components/Section';
import { Phone } from '@/components/Phone';
import { CallToAction } from '@/components/CallToAction';

export const metadata: Metadata = pageMeta('/how-it-works', 'How it works', 'A week in BPM, step by step: how players join, wait-list and pay their share, and how organisers open sign-ups, split costs and send the bill.');

const PLAYER = [
  { t: 'Get the nudge', b: 'Sign-ups are open. The Home screen shows when, where and the cost per person.' },
  { t: 'Tap Join', b: 'You get a numbered spot, or a place on the waitlist if it’s full. Both are visible to everyone.' },
  { t: 'Plans change?', b: 'Cancel your own spot. If your club has a late-cancel window, you’ll see a heads-up first.' },
  { t: 'After the game', b: 'Your share shows up on Home. Pay the organiser the usual way and tap “I’ve sent it”.' },
  { t: 'Between sessions', b: 'Log a game, give someone kudos, try the week’s drill, or ask for a restring.' },
];

const ORGANISER = [
  { t: 'Set the session', b: 'Venue, time, capacity and the sign-up deadline. Write the week’s announcement.' },
  { t: 'Open sign-ups', b: 'Players who turned on notifications get a nudge. Watch the roster fill and the waitlist form.' },
  { t: 'Manage the night', b: 'Promote from the waitlist, cover someone, log how many tubes of shuttles you used.' },
  { t: 'Send the bill', b: 'The court and shuttle cost is split across whoever played. Everyone sees their share.' },
  { t: 'Close the week', b: 'Mark who’s paid, check the ledger, and move on to next week.' },
];

function Flow({ steps, hue }: { steps: { t: string; b: string }[]; hue: string }) {
  return (
    <ol className="relative flex flex-col gap-7 border-l border-divider pl-7">
      {steps.map((s, i) => (
        <li key={s.t} className="relative">
          <span
            className="mono absolute -left-[42px] top-0 flex h-7 w-7 items-center justify-center rounded-full border border-divider bg-[var(--bg)] text-xs"
            style={{ color: hue }}
          >
            {i + 1}
          </span>
          <h3 className="text-lg font-semibold">{s.t}</h3>
          <p className="mt-1 text-[15px] text-text-2">{s.b}</p>
        </li>
      ))}
    </ol>
  );
}

export default function HowItWorksPage() {
  return (
    <>
      <PageHero
        path="/how-it-works"
        label="How it works"
        title="One week, two points of view."
        lede="Players and organisers see the same session from different sides. Here’s what each of them does."
      />
      <Section label="If you play" title="About thirty seconds a week.">
        <div className="grid items-start gap-12 md:grid-cols-[1.2fr_1fr]">
          <Flow steps={PLAYER} hue="var(--accent)" />
          <div className="flex justify-center gap-4">
            <Phone src="/media/screens/home-signup.webp" alt="BPM Home screen with the Join button" className="max-w-[230px]" />
            <Phone src="/media/screens/roster-waitlist.webp" alt="BPM roster with numbered players and a waitlist" className="mt-10 hidden max-w-[230px] sm:block" />
          </div>
        </div>
      </Section>
      <Section label="If you organise" hue="orange" title="The weekly job, step by step.">
        <div className="grid items-start gap-12 md:grid-cols-[1.2fr_1fr]">
          <div className="flex flex-col gap-8">
            <Flow steps={ORGANISER} hue="var(--orange)" />
            <Link href="/organisers" className="text-accent underline-offset-4 hover:underline">
              Everything organisers get, and how to start a club →
            </Link>
          </div>
          <div className="flex justify-center gap-4">
            <Phone src="/media/screens/admin-command-center.webp" alt="BPM organiser console" className="max-w-[230px]" />
            <Phone src="/media/screens/admin-send-the-bill.webp" alt="BPM Send the bill screen" className="mt-10 hidden max-w-[230px] sm:block" />
          </div>
        </div>
      </Section>
      <NextSteps links={['/features', '/organisers']} />
      <CallToAction />
    </>
  );
}

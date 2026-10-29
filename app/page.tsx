import Link from '@/components/SiteLink';
import { HeroVideo } from '@/components/HeroVideo';
import { GetTheApp } from '@/components/GetTheApp';
import { Section } from '@/components/Section';
import { FeatureRow } from '@/components/FeatureRow';
import { JsonLd } from '@/components/JsonLd';
import { CallToAction } from '@/components/CallToAction';
import { PromoVideo } from '@/components/PromoVideo';
import { WeekStory } from '@/components/WeekStory';
import { DETAILS, FAQ, FEATURE_AREAS } from '@/content/en';
import { SITE } from '@/lib/site';

const CHAT = [
  { who: 'Organiser', text: 'Courts 2 and 3 booked for Thursday, 8pm. Who’s in?' },
  { who: 'A', text: 'me' },
  { who: 'B', text: '+1, maybe +2' },
  { who: 'C', text: 'wait is this week or next week' },
  { who: 'D', text: 'am I in? I said yes on Monday' },
  { who: 'Organiser', text: 'Reminder: still waiting on 4 people for last week’s shuttles…' },
];

const appLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'BPM',
  applicationCategory: 'SportsApplication',
  operatingSystem: 'iOS, Android, Web',
  description: SITE.description,
  url: SITE.url,
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'CAD' },
  inLanguage: ['en', 'zh-CN'],
};

export default function HomePage() {
  return (
    <>
      <JsonLd data={appLd} />

      {/* Hero */}
      <section className="field overflow-hidden">
        <div className="container-site grid items-center gap-14 pb-16 pt-14 md:grid-cols-[1.15fr_1fr] md:pb-24 md:pt-24">
          <div className="flex flex-col gap-6">
            <p className="label">For casual badminton clubs</p>
            <h1 className="text-[2.5rem] font-bold sm:text-[3.4rem] lg:text-[4.1rem]">
              Your weekly session, without the group‑chat admin.
            </h1>
            <p className="lede">
              BPM handles sign-ups, the waitlist, each person’s share of the court and shuttles, and who’s paid. Players
              spend thirty seconds in it. Organisers get their evenings back.
            </p>
            <div className="mt-2">
              <GetTheApp />
            </div>
          </div>
          <div className="relative flex justify-center">
            <div className="court-lines hero-depth pointer-events-none absolute left-1/2 top-1/2 h-[118%] -translate-x-1/2 -translate-y-1/2" aria-hidden="true" />
            <HeroVideo />
          </div>
        </div>
      </section>

      {/* Problem */}
      <Section
        label="Sound familiar?"
        title="The group chat was never meant to be a sign-up sheet."
        lede="Someone books the courts. Then they count names in a thread, keep a waitlist in their head, work out what everyone owes, and chase it all week. BPM takes that job off their hands."
      >
        <div className="grid gap-6 md:grid-cols-[1fr_1fr] md:gap-10">
          <div className="glass flex flex-col gap-2.5 p-5" aria-label="An example of a busy group chat">
            {CHAT.map((m, i) => (
              <div key={i} className={`flex ${m.who === 'Organiser' ? 'justify-end' : 'justify-start'}`}>
                <p
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-[15px] ${
                    m.who === 'Organiser' ? 'bg-[color-mix(in_srgb,var(--accent)_22%,transparent)]' : 'bg-[rgba(var(--glass-tint),0.07)]'
                  }`}
                >
                  {m.text}
                </p>
              </div>
            ))}
          </div>
          <ul className="flex flex-col justify-center gap-6">
            {[
              ['Who’s actually in?', 'A numbered roster everyone can see. No scrolling back to count.'],
              ['Thirteen people, twelve spots.', 'The thirteenth lands on a waitlist, in order, and knows it.'],
              ['Who still owes for last week?', 'Everyone sees their own share. The organiser sees who’s paid.'],
            ].map(([q, a]) => (
              <li key={q} className="border-l-2 border-[var(--accent)] pl-5">
                <h3 className="text-xl font-semibold">{q}</h3>
                <p className="mt-1 text-text-2">{a}</p>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* A week */}
      <Section
        id="week"
        label="A week in BPM"
        title="Four steps, the same every week."
        lede="Nothing to learn. If you’ve ever replied “in” to a group chat, you already know how it works."
      >
        <WeekStory />
        <p className="mt-8">
          <Link href="/how-it-works" className="text-accent underline-offset-4 hover:underline">
            See how it works for players and organisers →
          </Link>
        </p>
      </Section>

      <Section id="video" label="See it in a minute" title="One week of BPM, start to finish." center>
        <PromoVideo />
      </Section>

      {/* Features */}
      <Section
        id="features"
        label="What’s inside"
        title="Small app. Done properly."
        lede="It’s a sign-up form and a cost split at heart. The reason to use it over a group chat is that every detail has been thought about."
      >
        <div className="flex flex-col gap-8">
          {FEATURE_AREAS.slice(0, 3).map((a, i) => (
            <FeatureRow key={a.id} area={a} flip={i % 2 === 1} />
          ))}
        </div>
        <p className="mt-10">
          <Link href="/features" className="btn btn-ghost">
            All features: stats, gear, organiser tools →
          </Link>
        </p>
      </Section>

      {/* Two clocks */}
      <Section label="Built for two kinds of visit" title="Thirty seconds for players. Twenty minutes for organisers.">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="field glass flex flex-col gap-4 p-8" data-hue="green">
            <p className="label">Players</p>
            <h3 className="text-2xl font-semibold">Open, check, close.</h3>
            <p className="text-text-2">
              Most people open BPM once a week, standing in a gym or replying in a chat. Am I in, what do I owe, when and
              where. It answers that on the first screen and stays out of the way.
            </p>
          </div>
          <div className="field glass flex flex-col gap-4 p-8" data-hue="orange">
            <p className="label" data-hue="orange">
              Organisers
            </p>
            <h3 className="text-2xl font-semibold">The real work, in one place.</h3>
            <p className="text-text-2">
              Running a session is genuinely fiddly: invites, the waitlist, shuttles, costs, covering someone, moving to next
              week. BPM gives that job proper tools, and puts extra care into anything that touches money.
            </p>
            <Link href="/organisers" className="text-accent underline-offset-4 hover:underline">
              Running a club? Start here →
            </Link>
          </div>
        </div>
      </Section>

      {/* Details */}
      <Section label="The details" title="The little things, handled.">
        <ul className="grid gap-px overflow-hidden rounded-[var(--radius-card)] border border-divider bg-[var(--divider)] sm:grid-cols-2 lg:grid-cols-3">
          {DETAILS.map((d) => (
            <li key={d.title} className="bg-[var(--bg)] p-6">
              <h3 className="text-lg font-semibold">{d.title}</h3>
              <p className="mt-1.5 text-[15px] text-text-2">{d.body}</p>
            </li>
          ))}
        </ul>
      </Section>

      {/* FAQ teaser */}
      <Section label="Questions" title="The short answers.">
        <dl className="grid gap-8 md:grid-cols-3">
          {FAQ.slice(0, 3).map((f) => (
            <div key={f.id}>
              <dt className="text-lg font-semibold">{f.q}</dt>
              <dd className="mt-2 text-[15px] text-text-2">{f.a}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-8">
          <Link href="/faq" className="text-accent underline-offset-4 hover:underline">
            More questions →
          </Link>
        </p>
      </Section>

      <CallToAction />
    </>
  );
}

import type { Metadata } from 'next';
import { pageMeta } from '@/lib/meta';
import { PageHero } from '@/components/PageHero';
import { NextSteps } from '@/components/NextSteps';
import { Section } from '@/components/Section';

export const metadata: Metadata = pageMeta('/architecture', 'How it’s built', 'BPM’s architecture: one Next.js deployment serving iPhone, Android and the web, a per-club data model, and the services behind it.');

const CLIENTS = [
  { t: 'iPhone', d: 'Capacitor shell · widgets · push' },
  { t: 'Android', d: 'Capacitor shell · widgets · push' },
  { t: 'Browser', d: 'Installable web app · Web Push' },
];

const APP_PARTS = [
  'Server-rendered pages, gated by sign-in and club',
  'API routes, members-only and rate-limited',
  'Every read scoped to one club',
  'English and 简体中文 throughout',
];

const SERVICES = [
  { t: 'Database', d: 'Azure Cosmos DB' },
  { t: 'AI', d: 'Anthropic Claude' },
  { t: 'Push', d: 'Firebase · Web Push' },
  { t: 'Email', d: 'SMTP' },
];

function Box({ title, detail, accent }: { title: string; detail?: string; accent?: boolean }) {
  return (
    <div
      className="glass flex flex-col gap-1 px-4 py-3.5 text-center"
      style={accent ? { borderColor: 'color-mix(in srgb, var(--accent) 45%, transparent)' } : undefined}
    >
      <span className="font-display text-[17px] font-semibold">{title}</span>
      {detail && <span className="mono text-[12px] text-text-3">{detail}</span>}
    </div>
  );
}

function Connector() {
  return (
    <div className="flex justify-center py-2" aria-hidden="true">
      <svg width="16" height="34" viewBox="0 0 16 34">
        <path d="M8 0v28" stroke="var(--accent)" strokeOpacity="0.55" strokeWidth="1.5" strokeDasharray="3 3" />
        <path d="M3 25l5 6 5-6" fill="none" stroke="var(--accent)" strokeOpacity="0.8" strokeWidth="1.5" />
      </svg>
    </div>
  );
}

export default function ArchitecturePage() {
  return (
    <>
      <PageHero
        path="/architecture"
        label="How it’s built"
        title="One app, three front doors."
        lede="For the curious. BPM is a single Next.js deployment. The iPhone and Android apps are native shells around it, so every release reaches every device at once."
      />
      <Section label="The shape of it" title="From your phone to the database.">
        <figure className="mx-auto max-w-4xl">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {CLIENTS.map((c) => (
              <Box key={c.t} title={c.t} detail={c.d} />
            ))}
          </div>
          <Connector />
          <div className="field glass overflow-hidden p-6" style={{ borderColor: 'color-mix(in srgb, var(--accent) 45%, transparent)' }}>
            <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
              <span className="font-display text-xl font-semibold">BPM web app</span>
              <span className="mono text-[12px] text-text-3">Next.js · React · TypeScript · Azure App Service</span>
            </div>
            <ul className="grid gap-2 sm:grid-cols-2">
              {APP_PARTS.map((p) => (
                <li key={p} className="rounded-xl border border-divider px-3.5 py-2.5 text-[15px] text-text-2">
                  {p}
                </li>
              ))}
            </ul>
          </div>
          <Connector />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {SERVICES.map((s) => (
              <Box key={s.t} title={s.t} detail={s.d} />
            ))}
          </div>
          <figcaption className="mt-5 text-center text-sm text-text-3">
            Three clients, one deployment, four supporting services.
          </figcaption>
        </figure>
      </Section>
      <Section label="Decisions worth knowing" title="Why it’s built this way.">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[
            ['One deployment', 'Every change ships to everyone at once. Unfinished work stays behind feature flags, so there’s no separate “stable” version to drift.'],
            ['Native shells, live web', 'The phone apps load the live app, so web, iPhone and Android never fall out of step. The shells add widgets, the app badge, shortcuts and push.'],
            ['Clubs kept apart', 'Many clubs share one deployment, but every read goes through a single club-scoped path, so one club never sees another’s roster or money.'],
            ['Honest failures', 'If something can’t load, the app says so. It never shows a confident zero in place of data it couldn’t fetch, because people rely on the numbers.'],
            ['AI with a human in the loop', 'Claude helps draft announcements and summarise your stats. An organiser always sees an announcement before players do.'],
            ['Fast first paint', 'Fonts and icons are self-hosted and trimmed, so the first screen doesn’t wait on anyone else’s servers.'],
          ].map(([t, b]) => (
            <div key={t} className="border-t border-divider pt-5">
              <h3 className="text-lg font-semibold">{t}</h3>
              <p className="mt-1.5 text-[15px] text-text-2">{b}</p>
            </div>
          ))}
        </div>
      </Section>
      <NextSteps links={['/features', '/faq']} />
    </>
  );
}

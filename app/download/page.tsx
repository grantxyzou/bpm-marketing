import type { Metadata } from 'next';
import { pageMeta } from '@/lib/meta';
import { PageHero } from '@/components/PageHero';
import { NextSteps } from '@/components/NextSteps';
import { Section } from '@/components/Section';
import { SITE } from '@/lib/site';

export const metadata: Metadata = pageMeta('/download', 'Get the app', 'Get BPM on iPhone (TestFlight beta), Android (invite-only beta) or use it in any browser. Free.');

const OPTIONS = [
  {
    t: 'iPhone',
    status: 'Public beta',
    b: 'Install Apple’s TestFlight app, then open the invite link. BPM installs like any other app and updates itself.',
    href: SITE.testflight,
    cta: 'Join the iPhone beta',
    primary: true,
  },
  {
    t: 'Android',
    status: 'Invite-only beta',
    b: 'The Android beta is limited to invited testers for now. If you’ve been added, the link takes you to Google Play. If not, ask your organiser, or use the browser for now.',
    href: SITE.playTest,
    cta: 'Open the Android beta',
    primary: false,
  },
  {
    t: 'Browser',
    status: 'Available now',
    b: 'Works on any phone or computer. On a phone, add it to your home screen and it behaves like an app.',
    href: SITE.appUrl,
    cta: 'Open BPM',
    primary: false,
  },
];

export default function DownloadPage() {
  return (
    <>
      <PageHero
        path="/download"
        label="Get the app"
        title="Free, on whatever you’ve got."
        lede="BPM is in beta on iPhone and Android, and works in any browser. It’s the same account everywhere."
      />
      <div className="container-site grid gap-5 pt-4 md:grid-cols-3">
        {OPTIONS.map((o) => (
          <div key={o.t} className="glass flex flex-col gap-4 p-7">
            <div className="flex items-baseline justify-between gap-3">
              <h2 className="text-2xl font-bold">{o.t}</h2>
              <span className="mono text-xs uppercase tracking-wider text-text-3">{o.status}</span>
            </div>
            <p className="flex-1 text-[15px] text-text-2">{o.b}</p>
            <a href={o.href} rel="noopener" className={`btn ${o.primary ? 'btn-primary' : 'btn-ghost'}`}>
              {o.cta}
            </a>
          </div>
        ))}
      </div>
      <Section label="Joining a club" title="Got the app? Here’s what’s next.">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="border-t border-divider pt-5">
            <h3 className="text-lg font-semibold">If someone invited you</h3>
            <p className="mt-1.5 text-[15px] text-text-2">
              Open their invite link or enter the code, pick a PIN, and you’re on the roster for the next session.
            </p>
          </div>
          <div className="border-t border-divider pt-5">
            <h3 className="text-lg font-semibold">If you run the session</h3>
            <p className="mt-1.5 text-[15px] text-text-2">
              Create an account, name your club and share an invite link. You’re the organiser from there.
            </p>
          </div>
        </div>
      </Section>
      <NextSteps links={['/how-it-works', '/faq']} />
    </>
  );
}

import type { Metadata } from 'next';
import { pageMeta } from '@/lib/meta';
import { PageHero } from '@/components/PageHero';
import { NextSteps } from '@/components/NextSteps';
import { FeatureRow } from '@/components/FeatureRow';
import { Section } from '@/components/Section';
import { CallToAction } from '@/components/CallToAction';
import { PromoVideo } from '@/components/PromoVideo';
import { DETAILS, FEATURE_AREAS } from '@/content/en';

export const metadata: Metadata = pageMeta('/features', 'Features', 'Sign-ups and waitlist, cost splitting and balances, restring requests, game stats and drills, racket fit, and organiser tools. Everything BPM does for a casual badminton club.');

export default function FeaturesPage() {
  return (
    <>
      <PageHero
        path="/features"
        label="Features"
        title="Everything a weekly session needs, and nothing it doesn’t."
        lede="Sign-ups, money, stringing, stats and gear for players, with proper tools for the person running it all."
      >
        <nav aria-label="Feature areas" className="mt-2 flex flex-wrap gap-2">
          {FEATURE_AREAS.map((a) => (
            <a key={a.id} href={`#${a.id}`} className="btn btn-ghost min-h-9 px-3.5 text-sm">
              {a.label}
            </a>
          ))}
        </nav>
      </PageHero>
      <div className="container-site pb-6 pt-10">
        <PromoVideo />
      </div>
      <div className="container-site flex flex-col gap-8 pt-6">
        {FEATURE_AREAS.map((a, i) => (
          <FeatureRow key={a.id} area={a} flip={i % 2 === 1} headingLevel="h2" />
        ))}
      </div>
      <Section label="And also" title="The small things.">
        <ul className="grid gap-px overflow-hidden rounded-[var(--radius-card)] border border-divider bg-[var(--divider)] sm:grid-cols-2 lg:grid-cols-3">
          {DETAILS.map((d) => (
            <li key={d.title} className="bg-[var(--bg)] p-6">
              <h3 className="text-lg font-semibold">{d.title}</h3>
              <p className="mt-1.5 text-[15px] text-text-2">{d.body}</p>
            </li>
          ))}
        </ul>
      </Section>
      <NextSteps links={['/how-it-works', '/organisers']} />
      <CallToAction />
    </>
  );
}

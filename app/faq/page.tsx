import type { Metadata } from 'next';
import { pageMeta } from '@/lib/meta';
import { PageHero } from '@/components/PageHero';
import { NextSteps } from '@/components/NextSteps';
import { JsonLd } from '@/components/JsonLd';
import { OpenHashedDetails } from '@/components/OpenHashedDetails';
import { CallToAction } from '@/components/CallToAction';
import { FAQ } from '@/content/en';

export const metadata: Metadata = pageMeta('/faq', 'FAQ', 'Answers about BPM: price, payments, who it’s for, starting a club, joining, devices, language and your data.');

const faqLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
};

export default function FaqPage() {
  return (
    <>
      <JsonLd data={faqLd} />
      <OpenHashedDetails />
      <PageHero path="/faq" label="FAQ" title="Questions people actually ask." lede="If yours isn’t here, the support page has a way to get in touch." />
      <div className="container-site pb-16">
        <div className="mx-auto max-w-3xl divide-y divide-[var(--divider)] border-y border-divider">
          {FAQ.map((f) => (
            <details key={f.id} id={f.id} className="group scroll-mt-24 py-5">
              <summary className="flex items-center justify-between gap-6 text-lg font-semibold">
                {f.q}
                <svg className="faq-chevron shrink-0 text-text-3" width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
                  <path d="M9 3v12M3 9h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </summary>
              <p className="mt-3 text-text-2">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
      <NextSteps links={['/features', '/download']} />
      <CallToAction />
    </>
  );
}

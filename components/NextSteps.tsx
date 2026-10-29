import Link from '@/components/SiteLink';

const PAGES = {
  '/': { title: 'Home', blurb: 'The short version of what BPM does.' },
  '/features': { title: 'Features', blurb: 'Sign-ups, money, stringing, stats, gear and organiser tools.' },
  '/organisers': { title: 'For organisers', blurb: 'Start a club and run the weekly session.' },
  '/stringers': { title: 'For stringers', blurb: 'A bench, a string shelf and bills players already check.' },
  '/how-it-works': { title: 'How it works', blurb: 'A week in BPM, for players and organisers.' },
  '/download': { title: 'Get the app', blurb: 'iPhone and Android betas, or the browser.' },
  '/faq': { title: 'FAQ', blurb: 'Price, payments, languages and your data.' },
  '/architecture': { title: 'How it’s built', blurb: 'One app, three front doors.' },
} as const;

export type SitePath = keyof typeof PAGES;

export function NextSteps({ links }: { links: SitePath[] }) {
  return (
    <nav aria-label="Keep going" className="container-site pb-16">
      <h2 className="label mb-4 !text-text-3">Keep going</h2>
      <ul className="grid gap-3 sm:grid-cols-2">
        {links.map((href) => (
          <li key={href}>
            <Link
              href={href}
              className="glass group flex items-center justify-between gap-4 p-5 transition-colors hover:border-[color-mix(in_srgb,var(--accent)_45%,transparent)]"
            >
              <span>
                <span className="block text-lg font-semibold">{PAGES[href].title}</span>
                <span className="mt-0.5 block text-[15px] text-text-2">{PAGES[href].blurb}</span>
              </span>
              <span aria-hidden="true" className="text-accent">
                →
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

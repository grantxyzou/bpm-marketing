import Link from '@/components/SiteLink';
import { Logo } from './Logo';
import { SITE } from '@/lib/site';

const COLUMNS = [
  {
    title: 'Product',
    links: [
      { href: '/features', label: 'Features' },
      { href: '/organisers', label: 'For organisers' },
      { href: '/how-it-works', label: 'How it works' },
      { href: '/architecture', label: 'How it’s built' },
    ],
  },
  {
    title: 'Get started',
    links: [
      { href: '/download', label: 'Get the app' },
      { href: SITE.appUrl, label: 'Open in browser' },
      { href: '/faq', label: 'FAQ' },
      { href: SITE.legal.support, label: 'Support' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { href: SITE.legal.privacy, label: 'Privacy' },
      { href: SITE.legal.terms, label: 'Terms' },
      { href: SITE.legal.deleteAccount, label: 'Delete your account' },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-24 border-t border-divider">
      <div className="container-site grid gap-10 py-14 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div className="flex flex-col gap-4">
          <Link href="/" aria-label="BPM home" className="self-start">
            <Logo />
          </Link>
          <p className="max-w-xs text-sm text-text-3">
            A small app for casual badminton clubs. Made by a player, for the people who run the session every week.
          </p>
        </div>
        {COLUMNS.map((col) => (
          <div key={col.title}>
            <h2 className="label mb-4 !text-text-3">{col.title}</h2>
            <ul className="flex flex-col gap-2.5">
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-[15px] text-text-2 hover:text-text">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="container-site flex flex-col gap-2 border-t border-divider py-6 text-sm text-text-3 sm:flex-row sm:justify-between">
        <p>© {new Date().getFullYear()} BPM. Free to use.</p>
        <p>English · 简体中文 in the app</p>
      </div>
    </footer>
  );
}

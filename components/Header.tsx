import Link from 'next/link';
import { Logo } from './Logo';
import { NAV } from '@/lib/site';

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-divider bg-[color-mix(in_srgb,var(--bg)_82%,transparent)] backdrop-blur-md">
      <div className="container-site flex h-16 items-center justify-between gap-4">
        <Link href="/" aria-label="BPM home" className="shrink-0">
          <Logo />
        </Link>
        <nav aria-label="Main" className="hidden items-center gap-7 md:flex">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className="text-[15px] text-text-2 transition-colors hover:text-text">
              {item.label}
            </Link>
          ))}
          <Link href="/download" className="btn btn-primary min-h-10 px-4 text-[15px]">
            Get the app
          </Link>
        </nav>
        <details className="relative md:hidden">
          <summary className="btn btn-ghost min-h-10 px-3 text-[15px]" aria-label="Open menu">
            Menu
          </summary>
          <nav
            aria-label="Main"
            className="glass absolute right-0 mt-2 flex w-60 flex-col gap-1 p-2 shadow-2xl"
            style={{ background: 'var(--bg-raised)' }}
          >
            {NAV.map((item) => (
              <Link key={item.href} href={item.href} className="rounded-lg px-3 py-2.5 text-text-2 hover:text-text">
                {item.label}
              </Link>
            ))}
            <Link href="/download" className="btn btn-primary mt-1">
              Get the app
            </Link>
          </nav>
        </details>
      </div>
    </header>
  );
}

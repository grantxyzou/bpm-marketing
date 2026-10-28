import Link from '@/components/SiteLink';
import { Logo } from './Logo';
import { HeaderNav } from './HeaderNav';

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-divider bg-[color-mix(in_srgb,var(--bg)_82%,transparent)] backdrop-blur-md">
      <div className="container-site flex h-16 items-center justify-between gap-4">
        <Link href="/" aria-label="BPM home" className="shrink-0">
          <Logo />
        </Link>
        <HeaderNav />
      </div>
    </header>
  );
}

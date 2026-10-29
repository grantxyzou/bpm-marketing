'use client';

import Link from '@/components/SiteLink';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { NAV } from '@/lib/site';

function isCurrent(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function HeaderNav() {
  const pathname = usePathname();
  const menu = useRef<HTMLDetailsElement>(null);

  // The header persists across client navigations, so the mobile menu must close itself.
  useEffect(() => {
    if (menu.current) menu.current.open = false;
  }, [pathname]);

  const downloadCurrent = isCurrent(pathname, '/download');

  return (
    <>
      <nav aria-label="Main" className="hidden items-center gap-7 lg:flex">
        {NAV.map((item) => {
          const current = isCurrent(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={current ? 'page' : undefined}
              className={`relative whitespace-nowrap text-[15px] transition-colors hover:text-text ${
                current ? 'text-text after:absolute after:inset-x-0 after:-bottom-[21px] after:h-0.5 after:bg-[var(--accent)]' : 'text-text-2'
              }`}
            >
              {item.label}
            </Link>
          );
        })}
        <Link href="/download" aria-current={downloadCurrent ? 'page' : undefined} className="btn btn-primary min-h-10 px-4 text-[15px]">
          Get the app
        </Link>
      </nav>
      <details ref={menu} className="relative lg:hidden">
        <summary className="btn btn-ghost min-h-10 px-3 text-[15px]" aria-label="Open menu">
          Menu
        </summary>
        <nav
          aria-label="Main"
          className="glass absolute right-0 mt-2 flex w-60 flex-col gap-1 p-2 shadow-2xl"
          style={{ background: 'var(--bg-raised)' }}
        >
          <Link href="/" aria-current={pathname === '/' ? 'page' : undefined} className={`rounded-lg px-3 py-2.5 hover:text-text ${pathname === '/' ? 'bg-[rgba(var(--glass-tint),0.08)] text-text' : 'text-text-2'}`}>
            Home
          </Link>
          {NAV.map((item) => {
            const current = isCurrent(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={current ? 'page' : undefined}
                className={`rounded-lg px-3 py-2.5 hover:text-text ${current ? 'bg-[rgba(var(--glass-tint),0.08)] text-text' : 'text-text-2'}`}
              >
                {item.label}
              </Link>
            );
          })}
          <Link href="/download" aria-current={downloadCurrent ? 'page' : undefined} className="btn btn-primary mt-1">
            Get the app
          </Link>
        </nav>
      </details>
    </>
  );
}

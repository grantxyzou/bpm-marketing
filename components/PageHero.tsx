import Link from 'next/link';
import type { Hue } from '@/content/en';
import { JsonLd } from './JsonLd';
import { SITE } from '@/lib/site';

type Props = { path: string; label: string; title: string; lede: string; hue?: Hue; children?: React.ReactNode };

export function PageHero({ path, label, title, lede, hue = 'green', children }: Props) {
  const crumbsLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE.url },
      { '@type': 'ListItem', position: 2, name: label, item: `${SITE.url}${path}` },
    ],
  };
  return (
    <section className="field overflow-hidden" data-hue={hue}>
      <JsonLd data={crumbsLd} />
      <div className="container-site flex flex-col gap-5 pb-10 pt-8 md:pb-14 md:pt-12">
        <nav aria-label="Breadcrumb">
          <ol className="flex items-center gap-2 text-sm text-text-3">
            <li>
              <Link href="/" className="hover:text-text">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-text-2">
              {label}
            </li>
          </ol>
        </nav>
        <p className="label mt-4 md:mt-6" data-hue={hue}>
          {label}
        </p>
        <h1 className="max-w-4xl text-[2.4rem] font-bold md:text-[3.5rem]">{title}</h1>
        <p className="lede">{lede}</p>
        {children}
      </div>
    </section>
  );
}

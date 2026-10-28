import type { Metadata } from 'next';

export function pageMeta(path: string, title: string, description: string): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { type: 'website', siteName: 'BPM', url: path, title: `${title} · BPM`, description, locale: 'en_CA' },
    twitter: { card: 'summary_large_image', title: `${title} · BPM`, description },
  };
}

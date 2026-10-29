import type { MetadataRoute } from 'next';
import { SITE } from '@/lib/site';

// Bump a page's date only when its content changes; Google ignores lastmod that moves on every deploy.
const PAGES: { path: string; lastModified: string; priority: number }[] = [
  { path: '', lastModified: '2026-10-28', priority: 1 },
  { path: '/features', lastModified: '2026-10-28', priority: 0.8 },
  { path: '/organisers', lastModified: '2026-10-28', priority: 0.8 },

  { path: '/stringers', lastModified: '2026-10-28', priority: 0.8 },
  { path: '/how-it-works', lastModified: '2026-10-28', priority: 0.8 },
  { path: '/download', lastModified: '2026-10-28', priority: 0.8 },
  { path: '/faq', lastModified: '2026-10-28', priority: 0.8 },
  { path: '/architecture', lastModified: '2026-10-28', priority: 0.4 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return PAGES.map((p) => ({
    url: `${SITE.url}${p.path}`,
    lastModified: p.lastModified,
    changeFrequency: 'monthly',
    priority: p.priority,
  }));
}

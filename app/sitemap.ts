import type { MetadataRoute } from 'next';
import { SITE } from '@/lib/site';

const ROUTES = ['', '/features', '/organisers', '/how-it-works', '/download', '/faq', '/architecture'];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return ROUTES.map((r) => ({
    url: `${SITE.url}${r}`,
    lastModified,
    changeFrequency: 'monthly',
    priority: r === '' ? 1 : r === '/architecture' ? 0.4 : 0.8,
  }));
}

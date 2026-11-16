import { SITE } from '@/lib/site';

/**
 * The legal pages' copy, read from the app (`GET /api/legal/<doc>`), which
 * keeps the one copy of it. Refreshed hourly; a failed read answers `null`
 * and the page links to the app's own copy rather than showing nothing.
 */
export type LegalDocName = 'privacy' | 'terms' | 'support';

export interface LegalDoc {
  title: string;
  updated: string;
  updatedLabel: string;
  sections: { h: string; p: string[] }[];
  supportEmail: string | null;
  emailLabel: string | null;
}

export async function fetchLegal(doc: LegalDocName): Promise<LegalDoc | null> {
  try {
    const base = process.env.LEGAL_API_BASE ?? SITE.appUrl;
    const res = await fetch(`${base}/api/legal/${doc}`, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    const body = (await res.json()) as LegalDoc;
    return Array.isArray(body.sections) ? body : null;
  } catch {
    return null;
  }
}

/** The app's own page for a doc, linked when the copy could not be read. */
export function appLegalUrl(doc: LegalDocName): string {
  return `${SITE.appUrl}/legal/${doc}`;
}

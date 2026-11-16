import type { Metadata } from 'next';
import { pageMeta } from '@/lib/meta';
import { LegalPage } from '@/components/LegalPage';

export const revalidate = 3600;
export const metadata: Metadata = pageMeta('/terms', 'Terms of use', 'The terms for using BPM: signing up, running a club, payments and conduct.');

export default function TermsPage() {
  return <LegalPage doc="terms" path="/terms" label="Terms" fallbackTitle="Terms of use" />;
}

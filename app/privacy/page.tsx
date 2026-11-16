import type { Metadata } from 'next';
import { pageMeta } from '@/lib/meta';
import { LegalPage } from '@/components/LegalPage';

export const revalidate = 3600;
export const metadata: Metadata = pageMeta('/privacy', 'Privacy policy', 'What BPM collects, why, who can see it, and how to delete it.');

export default function PrivacyPage() {
  return <LegalPage doc="privacy" path="/privacy" label="Privacy" fallbackTitle="Privacy policy" />;
}

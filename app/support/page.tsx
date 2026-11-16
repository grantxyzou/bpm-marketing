import type { Metadata } from 'next';
import { pageMeta } from '@/lib/meta';
import { LegalPage } from '@/components/LegalPage';

export const revalidate = 3600;
export const metadata: Metadata = pageMeta('/support', 'Support', 'Help with BPM: something not working, a lost PIN, questions about money and refunds.');

export default function SupportPage() {
  return <LegalPage doc="support" path="/support" label="Support" fallbackTitle="Support" />;
}

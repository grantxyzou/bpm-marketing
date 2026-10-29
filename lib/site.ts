export const SITE = {
  name: 'BPM',
  title: 'BPM — the weekly badminton session, without the group-chat admin',
  description:
    'BPM runs a casual weekly badminton session: sign-ups and waitlist, each person’s share of the court and shuttles, and who has paid. Free, on iPhone, Android and the web.',
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.motioncraft-bpm.com').replace(/\/$/, ''),
  appUrl: 'https://bpm.grantzou.com/bpm',
  testflight: 'https://testflight.apple.com/join/y5nPzPEU',
  playTest: 'https://play.google.com/apps/internaltest/4701333322627550006',
  legal: {
    privacy: 'https://bpm.grantzou.com/bpm/legal/privacy',
    terms: 'https://bpm.grantzou.com/bpm/legal/terms',
    support: 'https://bpm.grantzou.com/bpm/legal/support',
    deleteAccount: 'https://bpm.grantzou.com/bpm/legal/delete-account',
  },
} as const;

export const NAV = [
  { href: '/features', label: 'Features' },
  { href: '/organisers', label: 'For organisers' },
  { href: '/stringers', label: 'For stringers' },
  { href: '/how-it-works', label: 'How it works' },
  { href: '/faq', label: 'FAQ' },
] as const;

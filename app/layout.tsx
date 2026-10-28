import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { JsonLd } from '@/components/JsonLd';
import { SITE } from '@/lib/site';

const display = localFont({ src: './fonts/SpaceGrotesk.woff2', variable: '--font-sg', weight: '300 700', display: 'swap' });
const sans = localFont({ src: './fonts/IBMPlexSans.woff2', variable: '--font-plex', weight: '100 700', display: 'swap' });
const mono = localFont({ src: './fonts/JetBrainsMono.woff2', variable: '--font-jb', weight: '100 800', display: 'swap', preload: false });

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: SITE.title, template: '%s · BPM' },
  description: SITE.description,
  applicationName: SITE.name,
  keywords: [
    'badminton sign-up app',
    'badminton club app',
    'badminton session organiser',
    'badminton waitlist',
    'split court cost',
    'badminton restringing',
  ],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName: SITE.name,
    title: SITE.title,
    description: SITE.description,
    url: '/',
    locale: 'en_CA',
  },
  twitter: { card: 'summary_large_image', title: SITE.title, description: SITE.description },
  robots: { index: true, follow: true },
  icons: { icon: '/icon.png', apple: '/apple-icon.png' },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#100f0f' },
    { media: '(prefers-color-scheme: light)', color: '#faf8f5' },
  ],
};

const orgLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${SITE.url}/#org`,
      name: SITE.name,
      url: SITE.url,
      logo: `${SITE.url}/icon.png`,
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE.url}/#site`,
      name: SITE.name,
      url: SITE.url,
      publisher: { '@id': `${SITE.url}/#org` },
      inLanguage: 'en',
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable} ${mono.variable}`}>
      <body className="min-h-dvh">
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 btn btn-primary">
          Skip to content
        </a>
        <JsonLd data={orgLd} />
        <Header />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

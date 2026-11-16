import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  async redirects() {
    // Short links for the legal pages, so Stripe receipts, the stores and
    // anyone else can name this domain. The pages themselves live in the app
    // (one copy, served with its translations); these only point there.
    // Temporary (307), so moving a page later is a one-line change here.
    const app = 'https://bpm.grantzou.com/bpm/legal';
    return [
      { source: '/pricing', destination: '/faq#price', permanent: true },
      { source: '/privacy', destination: `${app}/privacy`, permanent: false },
      { source: '/terms', destination: `${app}/terms`, permanent: false },
      { source: '/support', destination: `${app}/support`, permanent: false },
      { source: '/delete-account', destination: `${app}/delete-account`, permanent: false },
    ];
  },
};

export default nextConfig;

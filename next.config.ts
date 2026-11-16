import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  async redirects() {
    // /privacy, /terms and /support are pages here (app/<doc>, copy read from
    // the app). Deleting an account needs the app itself, so that one points
    // there. Temporary (307), so it can become a page later.
    const app = 'https://bpm.grantzou.com/bpm/legal';
    return [
      { source: '/pricing', destination: '/faq#price', permanent: true },
      { source: '/delete-account', destination: `${app}/delete-account`, permanent: false },
    ];
  },
};

export default nextConfig;

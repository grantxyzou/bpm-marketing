import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  async redirects() {
    return [{ source: '/pricing', destination: '/faq#price', permanent: true }];
  },
};

export default nextConfig;

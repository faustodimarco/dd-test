import type { NextConfig } from 'next';

const config: NextConfig = {
  serverExternalPackages: ['better-sqlite3'],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'imagedelivery.net' },
      { protocol: 'https', hostname: 'dondi.ai' },
    ],
  },
};

export default config;

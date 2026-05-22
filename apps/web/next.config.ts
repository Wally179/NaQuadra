import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'a.espncdn.com' },
      { protocol: 'https', hostname: 'site.api.espn.com' },
      { protocol: 'https', hostname: 'site.web.api.espn.com' },
      { protocol: 'https', hostname: 'media.espn.com' },
      { protocol: 'https', hostname: 's.espncdn.com' },
      { protocol: 'https', hostname: 'ui-avatars.com' },
    ],
  },
};

export default nextConfig;

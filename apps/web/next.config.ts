import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // ESPN CDN
      { protocol: 'https', hostname: 'a.espncdn.com' },
      { protocol: 'https', hostname: 'site.api.espn.com' },
      { protocol: 'https', hostname: 'site.web.api.espn.com' },
      { protocol: 'https', hostname: 'media.espn.com' },
      { protocol: 'https', hostname: 's.espncdn.com' },
      // Auth / avatars
      { protocol: 'https', hostname: 'ui-avatars.com' },
      // NewsAPI article images (various sources)
      { protocol: 'https', hostname: '**.cnn.com' },
      { protocol: 'https', hostname: '**.bbc.co.uk' },
      { protocol: 'https', hostname: '**.reuters.com' },
      { protocol: 'https', hostname: '**.nytimes.com' },
      { protocol: 'https', hostname: '**.cloudfront.net' },
      { protocol: 'https', hostname: '**.wordpress.com' },
      { protocol: 'https', hostname: '**.wp.com' },
      // GNews article images
      { protocol: 'https', hostname: '**.gnews.io' },
      { protocol: 'https', hostname: '**.globo.com' },
      { protocol: 'https', hostname: '**.ig.com.br' },
      { protocol: 'https', hostname: '**.uol.com.br' },
      // Generic fallback: allow any https image
      // (required because NewsAPI/GNews return images from arbitrary domains)
      { protocol: 'https', hostname: '*' },
    ],
  },
};

export default nextConfig;

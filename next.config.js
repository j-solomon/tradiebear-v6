/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'hrymdzhmcizajjruofoy.supabase.co',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/r/:slug',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
          },
          {
            key: 'CDN-Cache-Control',
            value: 'no-store',
          },
          {
            key: 'Vercel-CDN-Cache-Control',
            value: 'no-store',
          },
        ],
      },
    ];
  },
}

module.exports = nextConfig


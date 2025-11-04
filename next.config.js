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
}

module.exports = nextConfig


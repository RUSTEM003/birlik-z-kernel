/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  i18n: {
    locales: ['en', 'ru', 'kk', 'uz', 'tr', 'ar', 'zh', 'es', 'fr', 'de'],
    defaultLocale: 'en',
  },
  images: {
    domains: ['example.com', 'birlik.io', 'storage.googleapis.com'],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/:path*',
      },
    ];
  },
}

module.exports = nextConfig

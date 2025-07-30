/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.vercel-storage.com', // برای تمام subdomain های blob
      },
    ],
  },
};

module.exports = nextConfig;

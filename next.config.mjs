/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "kmnepjyvjrtb9g9o.public.blob.vercel-storage.com",
      },
    ],
  },
};

export default nextConfig;
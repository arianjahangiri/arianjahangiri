/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "bgkfz-1753888411819-576990676056.public.blob.vercel-storage.com",
      },
    ],
  },
};

export default nextConfig;

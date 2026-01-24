/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'vivah-backend-production.up.railway.app',
        pathname: '/uploads/**',
      },
    ],
  },

  env: {
    NEXT_PUBLIC_API_URL: 'https://vivah-backend-production.up.railway.app/api/v1',
    NEXT_PUBLIC_RAZORPAY_KEY_ID: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
  },
};

module.exports = nextConfig;

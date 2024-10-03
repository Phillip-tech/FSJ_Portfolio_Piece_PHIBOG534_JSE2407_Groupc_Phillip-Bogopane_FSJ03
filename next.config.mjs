/** @type {import('next').NextConfig} */
const nextConfig = {
  outputDir: 'dist',
  images: {
    domains: ['next-ecommerce-api.vercel.app', 'cdn.dummyjson.com'],
  },
};

export default nextConfig;
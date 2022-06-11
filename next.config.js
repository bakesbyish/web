/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['media.graphassets.com', 'loremflickr.com', 'ik.imagekit.io'],
  },
};

module.exports = nextConfig;

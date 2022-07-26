/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: [
      "media.graphassets.com",
      "loremflickr.com",
      "ik.imagekit.io",
      "lh3.googleusercontent.com",
      "avatars.dicebear.com",
      "firebasestorage.googleapis.com",
      "cdn.sanity.io",
    ],
  },
  experimental: {
    nextScriptWorkers: true,
  },
};

module.exports = nextConfig;

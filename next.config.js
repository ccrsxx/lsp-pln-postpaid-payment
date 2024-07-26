/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'vercel.com'
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com'
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com'
      },
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com'
      }
    ]
  }
};

module.exports = nextConfig;

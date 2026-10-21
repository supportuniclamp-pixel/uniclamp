/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/__l5e/:path*',
        destination: 'https://lovable.dev/__l5e/:path*',
      },
    ];
  },
};

export default nextConfig;

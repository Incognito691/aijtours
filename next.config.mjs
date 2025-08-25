/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "afitravelandtourism.com", // non-www
          },
        ],
        destination: "https://www.afitravelandtourism.com/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

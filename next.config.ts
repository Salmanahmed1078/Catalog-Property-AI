import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['localhost'],
  },
  headers: async () => ([
    {
      source: '/:path*',
      headers: [
        {
          key: 'Content-Security-Policy',
          value: "script-src 'self' 'unsafe-inline' 'unsafe-eval';"
        }
      ],
    },
  ]),
};

export default nextConfig;
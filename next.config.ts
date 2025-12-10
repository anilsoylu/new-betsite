import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  compress: true, // Gzip compression
  poweredByHeader: false, // Hide Next.js signature (security)
  // IMPORTANT: Fixes Next.js 15+ bug where metadata renders inside <body> instead of <head>
  // Without this, Google sees title/description in wrong location which hurts SEO
  htmlLimitedBots: /.*/,
  experimental: {
    browserDebugInfoInTerminal: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.ctfassets.net",
      },
      {
        protocol: "https",
        hostname: "*.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "cdn.sportmonks.com",
      },
      {
        protocol: "https",
        hostname: "media.api-sports.io",
      },
    ],
  },
};

export default nextConfig;

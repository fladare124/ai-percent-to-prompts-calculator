import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/ai-percent-to-prompts-calculator",
        destination: "/",
        permanent: true,
      },
      {
        source: "/ai-usage-calculator",
        destination: "/",
        permanent: true,
      },
      {
        source: "/percent-to-prompts-calculator",
        destination: "/",
        permanent: true,
      },
    ];
  },
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;

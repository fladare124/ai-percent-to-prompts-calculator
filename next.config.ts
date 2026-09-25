import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/ai-percent-to-prompts-calculator",
        destination: "/ai-usage-calculator",
        permanent: true,
      },
      {
        source: "/percent-to-prompts-calculator",
        destination: "/ai-usage-calculator",
        permanent: true,
      },
    ];
  },
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;

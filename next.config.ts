import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // allow any external image by disabling Next.js optimization
    unoptimized: true,
  },
};

export default nextConfig;

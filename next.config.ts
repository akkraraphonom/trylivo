import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep local dev output separate from production builds during deployment.
  distDir: process.env.NODE_ENV === "development" ? ".next-dev" : ".next",
  images: {
    // Cloudflare serves these originals from its static asset cache.
    unoptimized: process.env.SERVE_STATIC_IMAGES === "true",
    qualities: [75, 85, 95],
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;

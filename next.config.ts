import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the workspace root so Next doesn't infer a parent dir with another lockfile.
  turbopack: {
    root: process.cwd(),
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        // Original Park Selections website imagery (Wix media CDN)
        protocol: "https",
        hostname: "static.wixstatic.com",
        pathname: "/media/**",
      },
      {
        // Official booking-platform imagery (STAAH image library)
        protocol: "https",
        hostname: "homesweb.staah.net",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
   images: {
    // domains: ["images.unsplash.com"], // 🔥 ADD THIS
    remotePatterns: [
    {
      protocol: "https",
      hostname: "images.unsplash.com",
    },
  ],
  },
};

export default nextConfig;


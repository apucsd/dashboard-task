import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images:{
    remotePatterns: [
      // ======HERE I AM ALLOWED ALL DOMAINS ======
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      }
    ],
  }
};

export default nextConfig;

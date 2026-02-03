import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    turbopackUseSystemTlsCerts: true, // NOTE: Add this because we were facing font issue
  },
};

export default nextConfig;

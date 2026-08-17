import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    // Pin the workspace root to this project so Next doesn't pick up
    // a stray lockfile from a parent directory.
    root: __dirname,
  },
};

export default nextConfig;

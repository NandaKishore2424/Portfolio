import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // A stray lockfile in the home directory confuses root detection; pin it.
  turbopack: {
    root: path.resolve(process.cwd()),
  },
};

export default nextConfig;

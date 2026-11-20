import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Produces .next/standalone with only the traced runtime files needed by
  // the production Docker image.
  output: "standalone",
};

export default nextConfig;

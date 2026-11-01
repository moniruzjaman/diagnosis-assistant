import type { NextConfig } from "next";

// The repo is deployed as a GitHub Pages project site, so the site is served
// from https://<user>.github.io/diagnosis-assistant/. The basePath makes every
// generated asset URL resolve under that prefix, and NEXT_PUBLIC_BASE_PATH
// mirrors it to the client so fetch() calls to static assets resolve correctly.
const basePath = "/diagnosis-assistant";

const nextConfig: NextConfig = {
  // Static HTML export — produces a self-contained ./out directory that
  // GitHub Pages can serve directly with no Node.js runtime.
  output: "export",
  basePath,
  // Trailing slashes keep asset resolution stable under the Pages basePath.
  trailingSlash: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  allowedDevOrigins: [
    "*.run.app",
    "ais-dev-hiccwcnxwnkiyskjsofxi6-359142143739.asia-southeast1.run.app",
    "localhost:3000",
  ],
  images: {
    // GitHub Pages has no image optimization server; ship raw <img> URLs.
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "raw.githubusercontent.com",
        pathname: "/**",
      },
    ],
  },
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

export default nextConfig;

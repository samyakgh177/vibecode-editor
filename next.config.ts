import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*",
        port: "",
        pathname: "/**",
      },
    ],
  },
  outputFileTracingIncludes: {
    "/api/template/**": ["./vibecode-starters/**/*"],
  },
  async headers() {
    return [
      {
        // Apply to all routes for WebContainer SharedArrayBuffer support
        source: "/:path*",
        headers: [
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin",
          },
          {
            key: "Cross-Origin-Embedder-Policy",
            value: "credentialless",
          },
        ],
      },
    ];
  },
  reactStrictMode: false,
};

export default nextConfig;

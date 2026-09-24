import type { NextConfig } from "next";

// makezeronoise.com is an existing Kit (ConvertKit) site. Once its DNS points at Vercel, this
// site serves /calculator itself and forwards every other address (the Kit home page,
// /subjectlines, …) to Kit through /kit-proxy — see src/app/kit-proxy/[[...path]]/route.ts.
const ZERO_NOISE_HOST = [{ type: "host" as const, value: "(www\\.)?makezeronoise\\.com" }];

const nextConfig: NextConfig = {
  async rewrites() {
    return {
      // "/" is our calculator page everywhere else, but on makezeronoise.com it's Kit's home page.
      beforeFiles: [{ source: "/", has: ZERO_NOISE_HOST, destination: "/kit-proxy" }],
      // Anything we don't have (checked after every page, route and public file) goes to Kit.
      fallback: [{ source: "/:path*", has: ZERO_NOISE_HOST, destination: "/kit-proxy/:path*" }],
    };
  },
};

export default nextConfig;

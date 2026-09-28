import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  trailingSlash: false,
  async redirects() {
    return [
      { source: "/:path*", has: [{ type: "host", value: "se-ousing-ai.vercel.app" }], destination: "https://seousingai.com/:path*", permanent: true },
      // The affiliate disclosure was retired: there are no affiliate links on the site.
      { source: "/affiliate-disclosure", destination: "/about", permanent: true },
    ];
  },
  async headers() {
    return [{ source: "/(.*)", headers: [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "X-Frame-Options", value: "SAMEORIGIN" },
    ] }];
  },
};

export default nextConfig;

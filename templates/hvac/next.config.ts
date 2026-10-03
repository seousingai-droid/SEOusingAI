import type { NextConfig } from "next";

// Static export, served by a Cloudflare Worker with static assets (wrangler.jsonc).
const nextConfig: NextConfig = { output: "export", poweredByHeader: false, trailingSlash: false, images: { unoptimized: true } };
export default nextConfig;

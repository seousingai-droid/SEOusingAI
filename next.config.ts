import type { NextConfig } from "next";

// The site is exported as static files (out/) and served by a Cloudflare Worker with static
// assets (wrangler.jsonc). Redirects and headers live in public/_redirects and public/_headers;
// the contact form runs in the Worker (worker/contact.ts).
const nextConfig: NextConfig = {
  output: "export",
  poweredByHeader: false,
  trailingSlash: false,
  // Images are already sized and compressed at build time; there is no image server.
  images: { unoptimized: true },
};

export default nextConfig;

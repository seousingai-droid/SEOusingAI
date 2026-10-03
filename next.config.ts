import type { NextConfig } from "next";

// The site is exported as static files and served by Cloudflare Pages.
// Redirects and headers live in public/_redirects and public/_headers (Cloudflare reads
// those); the contact form runs as a Cloudflare Pages Function in functions/api/contact.ts.
const nextConfig: NextConfig = {
  output: "export",
  poweredByHeader: false,
  trailingSlash: false,
  // Images are already sized and compressed at build time; there is no image server.
  images: { unoptimized: true },
};

export default nextConfig;

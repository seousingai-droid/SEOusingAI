import type { MetadataRoute } from "next";
import { business } from "@/data/business";

export const dynamic = "force-static";

// Crawlers may read the pages (so they see the noindex), but the demo is never indexed.
export default function robots(): MetadataRoute.Robots {
  return { rules: [{ userAgent: "*", allow: "/" }], sitemap: `${business.url}/sitemap.xml` };
}

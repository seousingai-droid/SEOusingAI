import type { MetadataRoute } from "next";
import { getGuides } from "@/lib/content";
import { abs, tools } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const guides = getGuides();
  const latest = guides.map((g) => g.updated).sort().at(-1)!;
  const stat = ["/about", "/editorial-standards", "/affiliate-disclosure", "/contact", "/privacy", "/terms"];
  return [
    { url: abs("/"), lastModified: latest, priority: 1 },
    { url: abs("/guides"), lastModified: latest, priority: 0.9 },
    ...guides.map((g) => ({ url: abs(`/guides/${g.slug}`), lastModified: g.updated, priority: 0.9 })),
    { url: abs("/tools"), lastModified: latest, priority: 0.8 },
    ...tools.map((t) => ({ url: abs(`/tools/${t.slug}`), lastModified: latest, priority: 0.8 })),
    ...stat.map((p) => ({ url: abs(p), lastModified: latest, priority: 0.3 })),
  ];
}

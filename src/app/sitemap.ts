import type { MetadataRoute } from "next";
import { getGuides } from "@/lib/content";
import { abs, tools } from "@/lib/site";
import { servicePages } from "@/lib/servicePages";
import { landingPages } from "@/lib/landingPages";
import { getCaseStudies } from "@/lib/caseStudies";
import { seoTips } from "@/lib/seoTips";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const guides = getGuides(); const studies = getCaseStudies();
  const latest = guides.map((g) => g.updated).sort().at(-1)!;
  const stat = ["/about", "/editorial-standards", "/contact", "/privacy", "/terms"];
  return [
    { url: abs("/"), lastModified: latest, priority: 1 },
    { url: abs("/services"), lastModified: latest, priority: 0.9 },
    ...servicePages.map((sp) => ({ url: abs(`/services/${sp.slug}`), lastModified: latest, priority: 0.9 })),
    ...landingPages.map((l) => ({ url: abs(`/${l.slug}`), lastModified: latest, priority: 0.9 })),
    { url: abs("/glossary"), lastModified: latest, priority: 0.6 },
    { url: abs("/pricing"), lastModified: latest, priority: 0.8 },
    ...(studies.length ? [{ url: abs("/case-studies"), lastModified: studies[0].published, priority: 0.8 }, ...studies.map((c) => ({ url: abs(`/case-studies/${c.slug}`), lastModified: c.published, priority: 0.8 }))] : []),
    { url: abs("/book-a-call"), lastModified: latest, priority: 0.7 },
    { url: abs("/guides"), lastModified: latest, priority: 0.9 },
    ...guides.map((g) => ({ url: abs(`/guides/${g.slug}`), lastModified: g.updated, priority: 0.9 })),
    { url: abs("/seo-tips"), lastModified: seoTips.map((t) => t.uploaded).sort().at(-1)!, priority: 0.9 },
    ...seoTips.map((t) => ({ url: abs(`/seo-tips/${t.slug}`), lastModified: t.uploaded, priority: 0.8 })),
    { url: abs("/tools"), lastModified: latest, priority: 0.8 },
    ...tools.map((t) => ({ url: abs(`/tools/${t.slug}`), lastModified: latest, priority: 0.8 })),
    ...stat.map((p) => ({ url: abs(p), lastModified: latest, priority: 0.3 })),
  ];
}

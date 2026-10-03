import type { MetadataRoute } from "next";
import { business } from "@/data/business";
import { services } from "@/data/hvac";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["/", "/services", ...services.map((s) => `/services/${s.slug}`), "/maintenance-plan", "/pricing", "/repair-or-replace", "/service-areas", "/service-areas/scottsdale", "/reviews", "/about", "/faq", "/contact"];
  return paths.map((p) => ({ url: `${business.url}${p === "/" ? "" : p}` }));
}

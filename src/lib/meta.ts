import type { Metadata } from "next";
import { site } from "./site";
import { ogImagePath } from "./og";

// One place that builds complete metadata, so no page can ship without a
// canonical URL, Open Graph tags, and a Twitter card.
export function pageMeta({ title, description, path, absolute = false, type = "website", image, published, modified }: {
  title: string; description: string; path: string; absolute?: boolean; type?: "website" | "article"; image?: string; published?: string; modified?: string;
}): Metadata {
  const full = absolute ? title : `${title} | ${site.name}`;
  // Every page gets a share card with its own title (src/lib/og.tsx). A case study can pass a
  // real screenshot instead, because proof beats a title card.
  const img = image
    ? { url: image, width: 1600, height: 900, alt: full }
    : { url: ogImagePath(path), width: 1200, height: 630, alt: full, type: "image/png" };
  return {
    title: absolute ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type, siteName: site.name, locale: site.locale, url: path, title: full, description,
      images: [img],
      ...(type === "article" ? { publishedTime: published, modifiedTime: modified } : {}),
    },
    twitter: { card: "summary_large_image", title: full, description, images: [{ url: img.url, alt: full }] },
  };
}

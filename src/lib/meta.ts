import type { Metadata } from "next";
import { site } from "./site";

// One place that builds complete metadata, so no page can ship without a
// canonical URL, Open Graph tags, and a Twitter card.
export function pageMeta({ title, description, path, absolute = false, type = "website", image, published, modified }: {
  title: string; description: string; path: string; absolute?: boolean; type?: "website" | "article"; image?: string; published?: string; modified?: string;
}): Metadata {
  const full = absolute ? title : `${title} | ${site.name}`;
  // Every page gets a share image: its own diagram if it has one, otherwise the brand card.
  const img = image ? { url: image, width: 1600, height: 900 } : { url: "/opengraph-image", width: 1200, height: 630 };
  return {
    title: absolute ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type, siteName: site.name, locale: site.locale, url: path, title: full, description,
      images: [img],
      ...(type === "article" ? { publishedTime: published, modifiedTime: modified } : {}),
    },
    twitter: { card: "summary_large_image", title: full, description, images: [img.url] },
  };
}

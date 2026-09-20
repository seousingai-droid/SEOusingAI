import { getGuides } from "@/lib/content";
import { site, abs } from "@/lib/site";

export const dynamic = "force-static";
const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export function GET() {
  const guides = [...getGuides()].sort((a, b) => b.updated.localeCompare(a.updated));
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel>
<title>${esc(site.name)}</title><link>${site.url}</link><description>${esc(site.description)}</description><language>en-us</language>
<atom:link href="${abs("/feed.xml")}" rel="self" type="application/rss+xml"/>
${guides.map((g) => `<item><title>${esc(g.title)}</title><link>${abs(`/guides/${g.slug}`)}</link><guid>${abs(`/guides/${g.slug}`)}</guid><pubDate>${new Date(g.published + "T00:00:00Z").toUTCString()}</pubDate><description>${esc(g.description)}</description></item>`).join("\n")}
</channel></rss>`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}

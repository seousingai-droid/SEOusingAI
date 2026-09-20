import { getGuides } from "@/lib/content";
import { site, tools, abs } from "@/lib/site";

export const dynamic = "force-static";

export function GET() {
  const body = [
    `# ${site.name}`,
    ``,
    `> ${site.description}`,
    ``,
    `## Guides`,
    ...getGuides().map((g) => `- [${g.title}](${abs(`/guides/${g.slug}`)}): ${g.description}`),
    ``,
    `## Free tools`,
    ...tools.map((t) => `- [${t.name}](${abs(`/tools/${t.slug}`)}): ${t.blurb}`),
    ``,
    `## About`,
    `- [About](${abs("/about")}): who runs the site, founded ${site.founded}, and how it is funded`,
    `- [Editorial standards](${abs("/editorial-standards")}): how guides are researched, fact-checked, and updated`,
    ``,
  ].join("\n");
  return new Response(body, { headers: { "Content-Type": "text/markdown; charset=utf-8" } });
}

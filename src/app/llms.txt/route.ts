import { getGuides } from "@/lib/content";
import { site, tools, abs } from "@/lib/site";

export const dynamic = "force-static";

export function GET() {
  const body = [
    `# ${site.name}`,
    ``,
    `> ${site.description}`,
    ``,
    `## Services`,
    `- [AI SEO services](${abs("/services")}): done-for-you audits, fixes, strategy, content, link outreach, local SEO, and reporting, with human review`,
    `- [Book a call](${abs("/book-a-call")}): free ${site.callMinutes}-minute strategy call on Google Meet`,
    ``,
    `## Guides`,
    ...getGuides().map((g) => `- [${g.title}](${abs(`/guides/${g.slug}`)}): ${g.description}`),
    ``,
    `## Free tools`,
    ...tools.map((t) => `- [${t.name}](${abs(`/tools/${t.slug}`)}): ${t.blurb}`),
    ``,
    `## About`,
    `- [About](${abs("/about")}): what the studio is, founded ${site.founded}, and how it is funded`,
    `- [Editorial standards](${abs("/editorial-standards")}): how guides are researched, fact-checked, and updated`,
    ``,
  ].join("\n");
  return new Response(body, { headers: { "Content-Type": "text/markdown; charset=utf-8" } });
}

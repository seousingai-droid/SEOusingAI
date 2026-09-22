import { getGuides } from "@/lib/content";
import { site, tools, abs } from "@/lib/site";
import { servicePages } from "@/lib/servicePages";
import { landingPages } from "@/lib/landingPages";
import { getCaseStudies } from "@/lib/caseStudies";

export const dynamic = "force-static";

export function GET() {
  const body = [
    `# ${site.name}`,
    ``,
    `> ${site.description}`,
    ``,
    `## Services`,
    `- [AI SEO services](${abs("/services")}): done-for-you audits, fixes, strategy, content, link outreach, local SEO, and reporting, with human review`,
    ...servicePages.map((sp) => `- [${sp.name}](${abs(`/services/${sp.slug}`)}): ${sp.description}`),
    ...landingPages.map((l) => `- [${l.nav}](${abs(`/${l.slug}`)}): ${l.description}`),
    `- [Pricing](${abs("/pricing")}): the SEO Checklist Checker is free for the first 5 results, $67 once for all 94`,
    `- [Book a call](${abs("/book-a-call")}): free ${site.callMinutes}-minute strategy call on Google Meet`,
    ``,
    `## Guides`,
    ...getGuides().map((g) => `- [${g.title}](${abs(`/guides/${g.slug}`)}): ${g.description}`),
    ``,
    `## Free tools`,
    ...tools.map((t) => `- [${t.name}](${abs(`/tools/${t.slug}`)}): ${t.blurb}`),
    ``,
    ...(getCaseStudies().length ? [`## Case studies`, ...getCaseStudies().map((c) => `- [${c.headline}](${abs(`/case-studies/${c.slug}`)}): ${c.summary}`), ``] : []),
    `## Reference`,
    `- [AI SEO glossary](${abs("/glossary")}): plain-English definitions of SEO and AI search terms`,
    ``,
    `## About`,
    `- [About](${abs("/about")}): what the studio is, founded ${site.founded}, and how it is funded`,
    `- [Editorial standards](${abs("/editorial-standards")}): how guides are researched, fact-checked, and updated`,
    ``,
  ].join("\n");
  return new Response(body, { headers: { "Content-Type": "text/markdown; charset=utf-8" } });
}

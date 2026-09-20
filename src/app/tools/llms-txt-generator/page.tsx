import { pageMeta } from "@/lib/meta";
import ToolShell from "@/components/ToolShell";
import Tool from "./Tool";

export const metadata = pageMeta({
  title: "llms.txt Generator (Free)",
  description: "Generate an llms.txt file that tells AI systems what your site is and which pages matter. Free llms.txt generator. No signup.",
  path: "/tools/llms-txt-generator",
});

export default function Page() {
  return (
    <ToolShell
      slug="llms-txt-generator" name="llms.txt Generator"
      title={<>llms.txt generator for <span className="hl">AI crawlers</span></>}
      lede="Describe your site, list your key pages, and copy a ready-to-upload llms.txt file."
      how={[
        { h: "What is llms.txt?", p: "llms.txt is a proposed standard: a markdown file at the root of a website that describes the site and lists its most important pages for AI systems. It plays a role similar to a sitemap, but it is written for language models and the people who build them." },
        { h: "Does llms.txt improve AI visibility?", p: "llms.txt may help some AI systems understand your site, but adoption is uneven and no major engine has confirmed it as a ranking or citation factor. Google states that you do not need AI text files to appear in AI Overviews or AI Mode. Because it takes minutes to create, most sites add one as a low-cost signal and do not rely on it." },
        { h: "Where do you put llms.txt?", p: "Put llms.txt in the root of your domain so it loads at yoursite.com/llms.txt. Keep the descriptions short and factual, and update the file when your key pages change." },
      ]}
      faqs={[
        { q: "Is llms.txt the same as robots.txt?", a: "No. robots.txt tells crawlers what they may access. llms.txt describes what your site is and which pages matter. They serve different purposes, and a site can have both." },
        { q: "How many pages should llms.txt list?", a: "List the pages that best explain what you do and answer common questions, usually 5 to 20. It is a guide to your best content, not a full sitemap." },
      ]}
    >
      <Tool />
    </ToolShell>
  );
}

import ToolShell from "@/components/ToolShell";
import { pageMeta } from "@/lib/meta";
import Tool from "./Tool";

export const metadata = pageMeta({
  title: "Free SEO Checklist Tool: Check Your Website in Seconds",
  description: "Enter your website and get an SEO checklist report: 94 checks for Google and AI search, each explained in plain English with a fix. First 5 free, no signup.",
  path: "/tools/seo-checklist",
  absolute: true,
});

export default function Page() {
  return (
    <ToolShell
      slug="seo-checklist" name="SEO Checklist Checker"
      title={<>The SEO checklist that <span className="hl">checks itself</span></>}
      lede="Most SEO checklists hand you a hundred boxes to tick by hand. Enter your website and this one ticks them for you, then tells you what to fix in plain English."
      how={[
        { h: "What does the SEO checklist tool check?", p: "The SEO checklist tool runs 94 checks in six groups: whether Google can find and read the page, whether the page clearly says what it is about, whether the content is helpful and readable, whether it is ready for AI answers from tools like ChatGPT, whether it looks right when shared, and speed, safety, and trust basics. Each result shows what was found on your page, why it matters, and how to fix it." },
        { h: "How is this different from a normal SEO checklist?", p: "A normal SEO checklist is a list you work through by hand, and you have to know how to check each item. This tool opens your page the way a search engine does, checks each item automatically, and marks it passed, could be better, or needs fixing." },
        { h: "What does the score mean?", p: "The score is the share of checks your page passed, with partial credit for items that could be better. It measures how well the basics are in place on one page. It is not a prediction of rankings, which also depend on your content, your competitors, and links from other websites." },
        { h: "What is free and what is paid?", p: `The first ${5} results are free on every report, with no signup, along with your score and the names of the three things to fix first. One payment of $67 unlocks all 94 results, with a fix for each, forever. There is no subscription.` },
        { h: "What does it not check?", p: "This tool checks one page at a time. It does not crawl your whole website, measure real visitor speed, check your backlinks, or judge the quality of your writing. A full Website Checkup covers those, with a person reviewing the results." },
      ]}
      faqs={[
        { q: "Is the SEO checklist tool free?", a: "The first 5 results of every report are free, with no signup, and you can check as many pages as you like. Seeing all 94 results costs $67 once, with no subscription." },
        { q: "Do you store my website address or results?", a: "No. Your website address is sent to our server so it can open the page, and the report is sent back to your browser. We do not save the address or the results. If you buy a key, it is stored only in your own browser." },
        { q: "Why does my score differ from other SEO tools?", a: "Every tool checks a different list of items and weighs them differently. This one focuses on the basics that matter for Google and AI search and explains each in plain English. Use the fix list, not the number, as your guide." },
        { q: "Can I check a competitor's website?", a: "Yes. The tool only reads what is publicly visible on a page, the same way a search engine does, so you can check any public website." },
        { q: "How long does a check take?", a: "Usually 10 to 20 seconds. As well as reading the page, the tool tests a sample of your links, your redirects, your robots.txt and sitemap, and whether your share image loads." },
      ]}
    >
      <Tool />
    </ToolShell>
  );
}

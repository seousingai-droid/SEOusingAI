import ToolShell from "@/components/ToolShell";
import { pageMeta } from "@/lib/meta";
import Tool from "./Tool";

export const metadata = pageMeta({
  title: "Free SEO Checklist Tool: Check Your Website in Seconds",
  description: "Enter your website and get a free SEO checklist report: 30 checks for Google and AI search, each explained in plain English with how to fix it. No signup.",
  path: "/tools/seo-checklist",
  absolute: true,
});

export default function Page() {
  return (
    <ToolShell
      slug="seo-checklist" name="SEO Checklist Checker"
      title={<>The SEO checklist that <span className="hl">checks itself</span></>}
      lede="Most SEO checklists hand you 150 boxes to tick by hand. Enter your website and this one ticks them for you, then tells you what to fix in plain English."
      how={[
        { h: "What does the SEO checklist tool check?", p: "The SEO checklist tool runs 30 checks in five groups: whether Google can find and read the page, whether the page clearly says what it is about, whether it is ready for AI answers from tools like ChatGPT, whether it looks right when shared, and speed and safety basics. Each result shows what was found on your page and how to fix it." },
        { h: "How is this different from a normal SEO checklist?", p: "A normal SEO checklist is a list you work through by hand, and you have to know how to check each item. This tool opens your page the way a search engine does, checks each item automatically, and marks it passed, could be better, or needs fixing." },
        { h: "What does the score mean?", p: "The score is the share of checks your page passed, with partial credit for items that could be better. It measures how well the basics are in place on one page. It is not a prediction of rankings, which also depend on your content, your competitors, and links from other websites." },
        { h: "What does it not check?", p: "This free tool checks one page at a time. It does not crawl your whole website, measure real visitor speed, check your backlinks, or judge the quality of your writing. A full Website Checkup covers those, with a person reviewing the results." },
      ]}
      faqs={[
        { q: "Is the SEO checklist tool really free?", a: "Yes. The SEO Checklist Checker is free, needs no signup, and you can check as many pages as you like, within a fair-use limit per minute." },
        { q: "Do you store my website address or results?", a: "No. Your website address is sent to our server so it can open the page, and the report is sent back to your browser. We do not save the address or the results." },
        { q: "Why does my score differ from other SEO tools?", a: "Every tool checks a different list of items and weighs them differently. This one focuses on the basics that matter for Google and AI search and explains each in plain English. Use the fix list, not the number, as your guide." },
        { q: "Can I check a competitor's website?", a: "Yes. The tool only reads what is publicly visible on a page, the same way a search engine does, so you can check any public website." },
      ]}
    >
      <Tool />
    </ToolShell>
  );
}

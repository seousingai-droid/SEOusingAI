import { pageMeta } from "@/lib/meta";
import Simple from "@/components/Simple";
import { site } from "@/lib/site";
export const metadata = pageMeta({
  title: "Editorial Standards",
  description: "How SEO Using AI researches, writes, fact-checks, and updates its guides, including how AI is used in the process.",
  path: "/editorial-standards",
});
export default function Page() {
  return (
    <Simple name="Editorial standards" href="/editorial-standards" eyebrow="Editorial standards" title="How we write and check guides">
      <h2 className="!mt-0">How is AI used on this site?</h2>
      <p>AI models are used for research, outlining, drafting, and editing. A person reviews every page before it is published. We say this openly because a site about SEO using AI should practice what it describes.</p>
      <h2>How are facts checked?</h2>
      <ul>
        <li>Every statistic links to its original source, and the number is checked on that source page before publishing.</li>
        <li>Claims that cannot be verified are removed, not softened.</li>
        <li>We do not publish software prices in guides, because they change often. We link to the vendor instead.</li>
      </ul>
      <h2>How are tools recommended?</h2>
      <p>Tools are described by what they are for and where they fall short. We do not accept payment for placement. When a link is an affiliate link, it is labeled.</p>
      <h2>How often are guides updated?</h2>
      <p>Each guide shows a last updated date. Guides are reviewed when the underlying facts change, such as new research, a major Google update, or a change in how AI engines cite sources.</p>
      <h2>How do you report an error?</h2>
      <p>Email <a href={`mailto:${site.email}`}>{site.email}</a>. Confirmed errors are corrected and the page date is updated.</p>
    </Simple>
  );
}

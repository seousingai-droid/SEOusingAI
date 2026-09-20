import { pageMeta } from "@/lib/meta";
import Simple from "@/components/Simple";
export const metadata = pageMeta({
  title: "Terms of Use",
  description: "The terms that apply when you use the SEO Using AI website, guides, and free tools, including content use, trademarks, and the absence of ranking guarantees.",
  path: "/terms",
});
export default function Page() {
  return (
    <Simple name="Terms of use" href="/terms" eyebrow="Legal" title="Terms of use">
      <p>Last updated September 20, 2026.</p>
      <h2>Using this site</h2>
      <p>The guides and tools on SEO Using AI are provided free for general information. You may use the tools and the prompts for personal and commercial work.</p>
      <h2>No guarantees</h2>
      <p>Search engines and AI systems change often. Nothing on this site is a promise of rankings, traffic, citations, or revenue. Test changes on your own site and make your own decisions. The site is provided as is, without warranties of any kind.</p>
      <h2>Content and trademarks</h2>
      <p>The written content on this site belongs to SEO Using AI. You may quote short passages with a link back. Product names mentioned here are trademarks of their owners and are used only to identify those products. No endorsement is implied.</p>
      <h2>External links</h2>
      <p>We link to other websites and are not responsible for their content or practices.</p>
    </Simple>
  );
}

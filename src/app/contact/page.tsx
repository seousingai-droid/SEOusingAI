import { pageMeta } from "@/lib/meta";
import Simple from "@/components/Simple";
import { site } from "@/lib/site";
export const metadata = pageMeta({
  title: "Contact the Team",
  description: "Contact SEO Using AI with corrections, questions, or tool suggestions.",
  path: "/contact",
});
export default function Page() {
  return (
    <Simple name="Contact" href="/contact" eyebrow="Contact" title="Get in touch" lede="Corrections, questions, and tool ideas are all welcome.">
      <p>Email <a href={`mailto:${site.email}`}>{site.email}</a>. We read everything and reply to most messages within a few business days.</p>
      <h2>What should you include?</h2>
      <ul>
        <li><strong>Corrections:</strong> the page URL, the claim, and a source if you have one.</li>
        <li><strong>Tool suggestions:</strong> what the tool does and who it is for. We do not accept paid placements.</li>
        <li><strong>Questions:</strong> your site type and what you have already tried.</li>
      </ul>
    </Simple>
  );
}

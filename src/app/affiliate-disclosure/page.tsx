import { pageMeta } from "@/lib/meta";
import Simple from "@/components/Simple";
export const metadata = pageMeta({
  title: "Affiliate Disclosure",
  description: "How SEO Using AI earns money from affiliate links, and how that does and does not affect recommendations.",
  path: "/affiliate-disclosure",
});
export default function Page() {
  return (
    <Simple name="Affiliate disclosure" href="/affiliate-disclosure" eyebrow="Disclosure" title="Affiliate disclosure">
      <p>SEO Using AI is free to read and use. To fund it, some links to software and services may be affiliate links. If you click one and make a purchase, the site may earn a commission at no extra cost to you.</p>
      <h2>What does that change?</h2>
      <p>It does not change what we recommend. Tools are described by what they do well and where they fall short, whether or not an affiliate program exists. We do not sell placements or accept payment for reviews.</p>
      <h2>How are affiliate links marked?</h2>
      <p>Affiliate links are labeled where they appear. This disclosure follows the US Federal Trade Commission guidance that material connections between a publisher and a seller should be clearly disclosed.</p>
    </Simple>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import Simple from "@/components/Simple";
import JsonLd from "@/components/JsonLd";
import { site, abs } from "@/lib/site";

export const metadata: Metadata = {
  title: "About SEO Using AI",
  description: "SEO Using AI is an independent studio and free resource, founded in 2026, that helps businesses rank on Google and get cited by AI answers.",
  alternates: { canonical: "/about" },
};

export default function About() {
  return (
    <Simple name="About" href="/about" eyebrow="About" title={<>A small studio built around <span className="hl">SEO using AI</span></>} lede="What this site is, how the work gets done, and how it makes money.">
      <h2 className="!mt-0">What is SEO Using AI?</h2>
      <p>SEO Using AI is an independent studio and free online resource, founded in {site.founded}. It does two things. It teaches site owners, freelancers, and marketing teams how to do search engine optimization with AI. It also delivers that same work as a <Link href="/services">done-for-you service</Link> for businesses that would rather hand it over.</p>
      <h2>How does the work get done?</h2>
      <p>The work is done by specialist AI workflows with a person reviewing the output. There is one workflow for each job: site audits, keyword strategy, competitor analysis, writing, images, publishing, link outreach, local SEO, conversion review, and reporting. AI handles the volume. A person sets the strategy, checks every fact, and approves what ships.</p>
      <p>The site exists because most advice on AI and SEO falls into two camps: hype that promises rankings at the press of a button, and dismissal that says AI content never works. Neither matches what happens on real websites.</p>
      <h2>How does the site make money?</h2>
      <p>The guides and tools are free. Income comes from client services and, in some cases, affiliate links to software. Affiliate links are labeled, and a commission never decides what gets recommended. Details are in the <Link href="/affiliate-disclosure">affiliate disclosure</Link>.</p>
      <h2>How is the content produced?</h2>
      <p>AI models help with research, outlines, drafts, and diagrams. Every statistic is checked against its original source and linked. Anything that cannot be verified is removed. The full process is in our <Link href="/editorial-standards">editorial standards</Link>.</p>
      <h2>How do you get in touch?</h2>
      <p><Link href="/book-a-call">Book a free Google Meet call</Link>, or email <a href={`mailto:${site.email}`}>{site.email}</a> with corrections, questions, or tool suggestions.</p>
      <JsonLd data={{ "@context": "https://schema.org", "@type": "AboutPage", url: abs("/about"), mainEntity: { "@id": abs("/#org") } }} />
    </Simple>
  );
}

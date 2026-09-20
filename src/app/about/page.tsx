import type { Metadata } from "next";
import Link from "next/link";
import Simple from "@/components/Simple";
import JsonLd from "@/components/JsonLd";
import { site, abs } from "@/lib/site";

export const metadata: Metadata = {
  title: "About SEO Using AI",
  description: "SEO Using AI is a free resource on doing SEO with AI, founded in 2026 by John Abala, a long-time WordPress developer and SEO practitioner.",
  alternates: { canonical: "/about" },
};

export default function About() {
  return (
    <Simple name="About" href="/about" eyebrow="About" title={<>A working notebook on <span className="hl">SEO using AI</span></>} lede="What this site is, who writes it, and how it makes money.">
      <h2 className="!mt-0">What is SEO Using AI?</h2>
      <p>SEO Using AI is a free online resource that teaches site owners, freelancers, and marketing teams how to do search engine optimization with AI. It was founded in {site.founded} and covers two things: using AI models to do SEO work faster, and optimizing content so AI answer engines such as ChatGPT, Perplexity, and Google AI Overviews cite it.</p>
      <h2 id="author">Who writes it?</h2>
      <p><strong>{site.author.name}</strong> is the founder and editor. {site.author.bio}</p>
      <p>The site exists because most advice on AI and SEO falls into two camps: hype that promises rankings at the press of a button, and dismissal that says AI content never works. Neither matches what happens on real websites. The guides here describe a middle path that holds up: AI does the volume, a person does the truth.</p>
      <h2>How does the site make money?</h2>
      <p>The guides and tools are free. Some links to software may be affiliate links, which means the site can earn a commission if you buy, at no extra cost to you. Affiliate links are labeled, and a commission never decides what gets recommended. Details are in the <Link href="/affiliate-disclosure">affiliate disclosure</Link>.</p>
      <h2>How is the content produced?</h2>
      <p>AI models help with research, outlines, and drafts. Every statistic is checked against its original source and linked. Anything that cannot be verified is removed. The full process is in our <Link href="/editorial-standards">editorial standards</Link>.</p>
      <h2>How do you get in touch?</h2>
      <p>Email <a href={`mailto:${site.email}`}>{site.email}</a> with corrections, questions, or tool suggestions. Corrections are welcome and get fixed quickly.</p>
      <JsonLd data={{ "@context": "https://schema.org", "@type": "AboutPage", url: abs("/about"), mainEntity: { "@type": "Person", "@id": abs("/about#author"), name: site.author.name, jobTitle: site.author.role, description: site.author.bio, url: site.author.url, sameAs: site.author.sameAs, worksFor: { "@id": abs("/#org") } } }} />
    </Simple>
  );
}

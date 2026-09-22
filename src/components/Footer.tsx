import Link from "next/link";
import Logo from "./Logo";
import { site, tools } from "@/lib/site";
import { getGuides } from "@/lib/content";
import { servicePages } from "@/lib/servicePages";
import { landingPages } from "@/lib/landingPages";
import { getCaseStudies } from "@/lib/caseStudies";

export default function Footer() {
  const guides = getGuides(); const hasStudies = getCaseStudies().length > 0;
  return (
    <footer className="border-t border-line bg-panel/40">
      <div className="wrap grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-5 max-w-sm text-[15px] text-muted">
            Free guides and tools for doing SEO with AI, plus done-for-you AI SEO services with a person reviewing every deliverable.
          </p>
          <p className="mt-5 text-[15px]"><a className="text-link hover:text-mark" href={`mailto:${site.email}`}>{site.email}</a></p>
        </div>
        <div>
          <p className="eyebrow mb-5">Services</p>
          <ul className="space-y-3 text-[15px] text-muted">
            {servicePages.map((sp) => (<li key={sp.slug}><Link className="hover:text-text" href={`/services/${sp.slug}`}>{sp.name}</Link></li>))}
            <li><Link className="hover:text-text" href="/services">All services</Link></li>
          </ul>
          <p className="eyebrow mb-5 mt-9">Who we help</p>
          <ul className="space-y-3 text-[15px] text-muted">
            {landingPages.map((l) => (<li key={l.slug}><Link className="hover:text-text" href={`/${l.slug}`}>{l.nav}</Link></li>))}
          </ul>
        </div>
        <div>
          <p className="eyebrow mb-5">Guides</p>
          <ul className="space-y-3 text-[15px] text-muted">
            {guides.slice(0, 7).map((g) => (
              <li key={g.slug}><Link className="hover:text-text" href={`/guides/${g.slug}`}>{g.title}</Link></li>
            ))}
            <li><Link className="hover:text-text" href="/guides">All guides</Link></li>
          </ul>
        </div>
        <div>
          <p className="eyebrow mb-5">Free tools</p>
          <ul className="space-y-3 text-[15px] text-muted">
            {tools.map((t) => (
              <li key={t.slug}><Link className="hover:text-text" href={`/tools/${t.slug}`}>{t.name}</Link></li>
            ))}
            <li><Link className="hover:text-text" href="/tools">All tools</Link></li>
            <li><Link className="hover:text-text" href="/pricing">Pricing</Link></li>
            <li><Link className="hover:text-text" href="/dashboard">My dashboard</Link></li>
          </ul>
        </div>
        <div>
          <p className="eyebrow mb-5">Site</p>
          <ul className="space-y-3 text-[15px] text-muted">
            <li><Link className="hover:text-text" href="/book-a-call">Book a call</Link></li>
            {hasStudies && <li><Link className="hover:text-text" href="/case-studies">Case studies</Link></li>}
            <li><Link className="hover:text-text" href="/about">About</Link></li>
            <li><Link className="hover:text-text" href="/glossary">Glossary</Link></li>
            <li><Link className="hover:text-text" href="/editorial-standards">Editorial standards</Link></li>
            <li><Link className="hover:text-text" href="/affiliate-disclosure">Affiliate disclosure</Link></li>
            <li><Link className="hover:text-text" href="/contact">Contact</Link></li>
            <li><Link className="hover:text-text" href="/privacy">Privacy policy</Link></li>
            <li><Link className="hover:text-text" href="/terms">Terms of use</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-line">
        <div className="wrap flex flex-col gap-2 py-6 text-[14px] text-muted sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} {site.name}. All rights reserved.</p>
          <p>Some links may be affiliate links. They are always labeled.</p>
        </div>
      </div>
    </footer>
  );
}

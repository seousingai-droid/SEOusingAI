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
    <footer className="band-night">
      <div className="wrap grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-5 max-w-sm text-[15px] text-muted">
            SEO using AI for small businesses. We optimize your business to show up on Google, Google Maps and AI search.
          </p>
          <p className="mt-5 text-[15px]"><a className="text-mark underline underline-offset-4 hover:text-white" href={`mailto:${site.email}`}>{site.email}</a></p>
        </div>
        <div>
          <p className="eyebrow mb-5">Services</p>
          <ul className="space-y-3 text-[15px] text-muted">
            {servicePages.map((sp) => (<li key={sp.slug}><Link className="hover:text-white" href={`/services/${sp.slug}`}>{sp.name}</Link></li>))}
            <li><Link className="hover:text-white" href="/services">All services</Link></li>
          </ul>
          <p className="eyebrow mb-5 mt-9">Who we help</p>
          <ul className="space-y-3 text-[15px] text-muted">
            {landingPages.map((l) => (<li key={l.slug}><Link className="hover:text-white" href={`/${l.slug}`}>{l.nav}</Link></li>))}
          </ul>
        </div>
        <div>
          <p className="eyebrow mb-5">Guides</p>
          <ul className="space-y-3 text-[15px] text-muted">
            {guides.slice(0, 7).map((g) => (
              <li key={g.slug}><Link className="hover:text-white" href={`/guides/${g.slug}`}>{g.title}</Link></li>
            ))}
            <li><Link className="hover:text-white" href="/guides">All guides</Link></li>
          </ul>
        </div>
        <div>
          <p className="eyebrow mb-5">Free tools</p>
          <ul className="space-y-3 text-[15px] text-muted">
            {tools.map((t) => (
              <li key={t.slug}><Link className="hover:text-white" href={`/tools/${t.slug}`}>{t.name}</Link></li>
            ))}
            <li><Link className="hover:text-white" href="/tools">All tools</Link></li>
            <li><Link className="hover:text-white" href="/pricing">Pricing</Link></li>
          </ul>
        </div>
        <div>
          <p className="eyebrow mb-5">Site</p>
          <ul className="space-y-3 text-[15px] text-muted">
            <li><Link className="hover:text-white" href="/book-a-call">Book a call</Link></li>
            {hasStudies && <li><Link className="hover:text-white" href="/case-studies">Case studies</Link></li>}
            <li><Link className="hover:text-white" href="/about">About</Link></li>
            <li><Link className="hover:text-white" href="/seo-tips">SEO tips videos</Link></li>
            <li><Link className="hover:text-white" href="/glossary">Glossary</Link></li>
            <li><Link className="hover:text-white" href="/editorial-standards">Editorial standards</Link></li>
            <li><Link className="hover:text-white" href="/contact">Contact</Link></li>
            <li><Link className="hover:text-white" href="/privacy">Privacy policy</Link></li>
            <li><Link className="hover:text-white" href="/terms">Terms of use</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-[#2d3662]">
        <div className="wrap flex flex-col gap-2 py-6 text-[14px] text-muted sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} {site.name}. All rights reserved.</p>
          <p>We optimize businesses to show up on Google, Maps and AI search.</p>
        </div>
      </div>
    </footer>
  );
}

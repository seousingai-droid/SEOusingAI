import Link from "next/link";
import Logo from "./Logo";
import { site, tools } from "@/lib/site";
import { getGuides } from "@/lib/content";

export default function Footer() {
  const guides = getGuides();
  return (
    <footer className="border-t border-line bg-panel/40">
      <div className="wrap grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-5 max-w-sm text-[15px] text-muted">
            A free, plain-English resource for doing SEO with AI. Guides, prompts, tool comparisons, and free tools for ranking on Google and getting cited by AI answers.
          </p>
          <p className="mt-5 text-[15px]"><a className="text-link hover:text-mark" href={`mailto:${site.email}`}>{site.email}</a></p>
        </div>
        <div>
          <p className="eyebrow mb-5">Guides</p>
          <ul className="space-y-3 text-[15px] text-muted">
            {guides.map((g) => (
              <li key={g.slug}><Link className="hover:text-text" href={`/guides/${g.slug}`}>{g.title}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <p className="eyebrow mb-5">Free tools</p>
          <ul className="space-y-3 text-[15px] text-muted">
            {tools.map((t) => (
              <li key={t.slug}><Link className="hover:text-text" href={`/tools/${t.slug}`}>{t.name}</Link></li>
            ))}
            <li><Link className="hover:text-text" href="/tools">All tools</Link></li>
          </ul>
        </div>
        <div>
          <p className="eyebrow mb-5">Site</p>
          <ul className="space-y-3 text-[15px] text-muted">
            <li><Link className="hover:text-text" href="/about">About</Link></li>
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

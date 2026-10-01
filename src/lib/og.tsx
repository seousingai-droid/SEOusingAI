// Share cards: the picture Facebook, LinkedIn, X, WhatsApp and iMessage show when someone
// posts a link. Every page gets its own card with its own title, built from the same data as
// the page, and rendered once at build time (src/app/og/[...key]/route.tsx).
import fs from "node:fs";
import path from "node:path";
import { ImageResponse } from "next/og";
import { seoTips } from "./seoTips";
import { getGuides } from "./content";
import { servicePages, shortPrice } from "./servicePages";
import { landingPages } from "./landingPages";
import { tools } from "./site";

export type OgCard = { key: string; eyebrow: string; title: string; sub: string };
export const OG_SIZE = { width: 1200, height: 630 };

const HOME: OgCard = {
  key: "home",
  eyebrow: "SEO for small businesses",
  title: "We get your business found on Google, Maps and AI search",
  sub: "Done-for-you SEO, websites and AI reels, with a person checking every page. Month to month.",
};

// Pages without their own data file.
const STATIC: OgCard[] = [
  { key: "pricing", eyebrow: "Pricing", title: "SEO prices, up front", sub: "Monthly plans and single services, with a fixed quote in writing before any work starts." },
  { key: "services", eyebrow: "Services", title: "SEO, websites and social media, done for you", sub: "Google search, Google Maps and AI search, with a person reviewing every deliverable." },
  { key: "seo-tips", eyebrow: "Free SEO tips", title: "Short SEO tips with the full method written out", sub: "One idea per video, with the exact steps, the mistakes to avoid, and why it works." },
  { key: "guides", eyebrow: "Free guides", title: "Guides to SEO using AI", sub: "How to use AI for keyword research, content, audits and AI search, step by step." },
  { key: "tools", eyebrow: "Free tools", title: "Free SEO tools, no sign-up", sub: "A Google snippet preview, an AI SEO prompt builder and an llms.txt generator." },
  { key: "glossary", eyebrow: "Glossary", title: "SEO and AI search terms, in plain English", sub: "Short definitions of the words you will meet in SEO and AI search." },
  { key: "about", eyebrow: "About", title: "A small studio built around SEO using AI", sub: "AI for speed, a person for judgment, and every price published." },
  { key: "contact", eyebrow: "Contact", title: "Send us a message", sub: "Tell us about your business. A person replies within one business day." },
  { key: "book-a-call", eyebrow: "Free call", title: "Book a free 30-minute SEO call", sub: "On Google Meet. You leave with one thing worth fixing this week." },
  { key: "editorial-standards", eyebrow: "Editorial standards", title: "How we write and check every page", sub: "Sources, fact-checking and corrections, written down." },
  { key: "case-studies", eyebrow: "Case studies", title: "Real results, with the numbers to prove it", sub: "Published only with the client's permission and named sources." },
  { key: "privacy", eyebrow: "Privacy", title: "Privacy policy", sub: "What we collect, why, and how to reach us." },
  { key: "terms", eyebrow: "Terms", title: "Terms of service", sub: "The terms for using this website and our services." },
];

let cache: OgCard[] | undefined;
export function ogCards(): OgCard[] {
  return (cache ??= [
    HOME,
    ...STATIC,
    ...seoTips.map((t) => ({ key: `seo-tips/${t.slug}`, eyebrow: `SEO tip · ${t.seconds}-second video`, title: t.title, sub: t.description })),
    ...getGuides().map((g) => ({ key: `guides/${g.slug}`, eyebrow: `Guide · ${g.eyebrow}`, title: g.title, sub: g.description })),
    ...servicePages.map((s) => ({ key: `services/${s.slug}`, eyebrow: `Service · ${shortPrice(s)}`, title: s.name, sub: s.description })),
    ...landingPages.map((l) => ({ key: l.slug, eyebrow: l.eyebrow, title: `${l.h1} ${l.h1Mark}`, sub: l.description })),
    ...tools.map((t) => ({ key: `tools/${t.slug}`, eyebrow: "Free tool · no sign-up", title: t.name, sub: t.blurb })),
  ]);
}

/** The card URL for a page path, or the home card when a page has none of its own. */
export function ogImagePath(pagePath: string) {
  const key = pagePath.replace(/^\/|\/$/g, "") || "home";
  return `/og/${ogCards().some((c) => c.key === key) ? key : "home"}`;
}

const font = (file: string) => fs.readFileSync(path.join(process.cwd(), "src/lib/og-fonts", file));
const ink = "#141a33", muted = "#5b627c", paper = "#fbf7ee", mark = "#ffd84d", line = "#e6dcc6";

export function ogImage(card: OgCard) {
  const titleSize = card.title.length <= 42 ? 76 : card.title.length <= 70 ? 62 : 52;
  const sub = card.sub.length > 150 ? `${card.sub.slice(0, 147).replace(/\s+\S*$/, "")}…` : card.sub;
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: paper, fontFamily: "Instrument Sans", color: ink }}>
        <div style={{ display: "flex", flexDirection: "column", flexGrow: 1, padding: "56px 72px 40px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <svg width="60" height="60" viewBox="0 0 64 64"><rect width="64" height="64" rx="15" fill={mark} /><circle cx="26" cy="34" r="13.5" fill="none" stroke={ink} strokeWidth="6" /><path d="M36.5 44.5 47 55" stroke={ink} strokeWidth="7" strokeLinecap="round" /><circle cx="45" cy="18" r="13.5" fill={mark} /><path d="M45 6.5C45 14 49 18 56.5 18C49 18 45 22 45 29.5C45 22 41 18 33.5 18C41 18 45 14 45 6.5Z" fill={ink} /></svg>
              <div style={{ display: "flex", fontFamily: "Bricolage Grotesque", fontSize: 36, letterSpacing: -1 }}>
                <span>SEO</span><span style={{ color: "#9097ad" }}>using</span><span>AI</span>
              </div>
            </div>
            <div style={{ display: "flex", fontSize: 22, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: ink, border: `2px solid ${ink}`, borderRadius: 999, padding: "8px 20px", background: "#ffffff" }}>
              {card.eyebrow}
            </div>
          </div>
          <div style={{ display: "flex", flexGrow: 1, alignItems: "center" }}>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", width: 120, height: 14, background: mark, borderRadius: 7, marginBottom: 28 }} />
              <div style={{ display: "flex", fontFamily: "Bricolage Grotesque", fontSize: titleSize, lineHeight: 1.04, letterSpacing: -2, maxWidth: 1056 }}>{card.title}</div>
              <div style={{ display: "flex", marginTop: 24, fontSize: 28, lineHeight: 1.35, color: muted, maxWidth: 1000 }}>{sub}</div>
            </div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 76, padding: "0 72px", background: ink, borderTop: `1px solid ${line}` }}>
          <div style={{ display: "flex", fontSize: 26, color: "#c9cee0" }}>Google search · Google Maps · AI answers</div>
          <div style={{ display: "flex", fontFamily: "Bricolage Grotesque", fontSize: 30, color: mark }}>seousingai.com</div>
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [
        { name: "Bricolage Grotesque", data: font("BricolageGrotesque-800.ttf"), weight: 800, style: "normal" },
        { name: "Instrument Sans", data: font("InstrumentSans-500.ttf"), weight: 500, style: "normal" },
        { name: "Instrument Sans", data: font("InstrumentSans-700.ttf"), weight: 700, style: "normal" },
      ],
    },
  );
}

export const homeCard = HOME;

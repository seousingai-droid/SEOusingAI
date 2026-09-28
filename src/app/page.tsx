import Link from "next/link";
import Image from "next/image";
import Mascot from "@/components/Mascot";
import Reveal from "@/components/Reveal";
import AnswerCard from "@/components/AnswerCard";
import Bundles, { ServiceList } from "@/components/Bundles";
import { SearchClimb, MapPin, ChatRecommend, SplitWork, StepIcon } from "@/components/Illustrations";
import Faq, { faqLd } from "@/components/Faq";
import JsonLd from "@/components/JsonLd";
import { getGuides } from "@/lib/content";
import { getCaseStudies } from "@/lib/caseStudies";
import CaseStudyCard from "@/components/CaseStudyCard";
import GuideCard from "@/components/GuideCard";
import { bundles, site, abs, tools } from "@/lib/site";
import { seoTips, posterSrc } from "@/lib/seoTips";
import { servicePages } from "@/lib/servicePages";
import { pageMeta } from "@/lib/meta";

export const metadata = pageMeta({
  title: "SEO Using AI: Get Found on Google, Maps and AI Search",
  description: "SEO using AI for small businesses. We optimize your website, Google Maps profile and content to show up on Google and AI search. Bundles from $790 a month.",
  path: "/",
  absolute: true,
});

const places = [
  { art: <SearchClimb />, title: "Google search", tint: "bg-[#eaf0ff]", dot: "bg-sky", body: "People search for what you sell. We optimize your pages so you show up for those searches." },
  { art: <MapPin />, title: "Google Maps", tint: "bg-[#e3f5ec]", dot: "bg-leaf", body: "\"Near me\" searches show three businesses on a map. We optimize your profile to compete for those spots." },
  { art: <ChatRecommend />, title: "AI search", tint: "bg-[#efe9ff]", dot: "bg-grape", body: "People ask ChatGPT and Google's AI who to hire. We set up your site so AI can find you and name you." },
];

// Promises we keep on every job. Proof we can stand behind today, not borrowed logos.
const promises = [
  { t: "Prices you can see", b: "Every service and bundle has its price on this site, before you ever call.", c: "bg-sky" },
  { t: "Month to month", b: "No contracts. Stop whenever you like and keep what we built.", c: "bg-leaf" },
  { t: "A person checks everything", b: "AI does the heavy lifting. A person approves every change.", c: "bg-coral" },
  { t: "Plain-English reports", b: "Each month: what we did, what moved, and what comes next.", c: "bg-grape" },
];

const platforms = ["Google Search Console", "Google Business Profile", "Google Analytics", "ChatGPT", "Perplexity", "Gemini", "WordPress", "Next.js"];

const stepColors = ["bg-sky", "bg-leaf", "bg-coral"];

const steps = [
  ["Book a free call", `${site.callMinutes} minutes on Google Meet. We look at your website and your Google profile together.`],
  ["Pick a bundle or one service", "You get a written price before anything starts. Month to month, no contract."],
  ["We do the work", "AI does the heavy lifting. A person checks every change, and you approve it before it goes live."],
] as const;

const faqs = [
  { q: "What is in the Website + SEO bundle?", a: "We manage your website and your SEO for one monthly price: website updates and layout changes, speed and security updates, new pages and articles, your Google Business Profile, AI search setup, and a plain monthly report. A full redesign is quoted separately." },
  { q: "What are AI reels?", a: "Short animated videos, 15 to 20 seconds each, that explain one thing about your business: a service, a price, or a question customers ask. AI helps us make them quickly. A person writes every script and checks every reel, and you approve each one before it is posted." },
  { q: "Do you guarantee first place on Google?", a: "No, and be careful with anyone who does. Google and AI tools decide their own results. We promise the work: done properly, checked by a person, and reported to you every month." },
  { q: "Is there a contract?", a: "No. Bundles are month to month and you can stop whenever you like. One-off work is quoted in writing and paid once." },
  { q: "Is SEO using AI allowed by Google?", a: "Yes. Google rewards helpful content however it is made. What it punishes is mass-produced pages made only to game rankings. That is why a person reviews everything we publish." },
  { q: "Can I just learn it myself?", a: "Yes. Our guides and tools are free. They show you how to do SEO using AI step by step." },
];

export default function Home() {
  const guides = getGuides();
  const studies = getCaseStudies().slice(0, 3);
  return (
    <>
      {/* Hero */}
      <section className="paper-dots relative overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute -left-40 top-10 h-[420px] w-[420px] rounded-full bg-[radial-gradient(closest-side,rgb(255_216_77/0.45),transparent)]" />
        <div aria-hidden className="pointer-events-none absolute -right-32 -top-20 h-[460px] w-[460px] rounded-full bg-[radial-gradient(closest-side,rgb(47_107_255/0.16),transparent)]" />
        <div aria-hidden className="pointer-events-none absolute bottom-0 right-1/3 h-[300px] w-[300px] rounded-full bg-[radial-gradient(closest-side,rgb(239_91_69/0.12),transparent)]" />
        <div className="wrap relative grid items-center gap-14 pb-16 pt-14 lg:grid-cols-[1.05fr_0.95fr] lg:pb-24 lg:pt-20">
          <div>
            <p className="pill rise !border-night/15 !bg-white" style={{ animationDelay: ".05s" }}><i className="!bg-leaf" />SEO using AI for small businesses</p>
            <h1 className="h-xl rise mt-7" style={{ animationDelay: ".15s" }}>
              We optimize your business to show up on <span className="hl">Google and AI search</span>
            </h1>
            <p className="lede rise mt-7 max-w-xl" style={{ animationDelay: ".3s" }}>
              Your website, your Google Maps profile and your content, optimized so customers find you on Google and AI tools like ChatGPT can recommend you. Pick a bundle and we handle all of it.
            </p>
            <div className="rise mt-9 flex flex-wrap gap-3" style={{ animationDelay: ".45s" }}>
              <Link href="#bundles" className="btn btn-primary">See bundles and prices <span aria-hidden>→</span></Link>
              <Link href="/book-a-call" className="btn btn-dark">Book a free call</Link>
            </div>
            <p className="rise mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 text-[15px] text-muted" style={{ animationDelay: ".6s" }}>
              {["Month to month", "Prices on every service", "Checked by a person"].map((x) => (
                <span key={x} className="inline-flex items-center gap-2"><span aria-hidden className="grid h-5 w-5 place-items-center rounded-full bg-leaf text-white"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="m5 12 5 5 9-10" /></svg></span>{x}</span>
              ))}
            </p>
          </div>
          <div className="relative">
            <AnswerCard />
            <span aria-hidden className="sticker absolute hidden lg:inline-flex -top-6 right-6 rotate-[-6deg] bg-[#eaf0ff]"><span className="h-2.5 w-2.5 rounded-full bg-sky" />Google</span>
            <span aria-hidden className="sticker absolute hidden lg:inline-flex -right-2 top-1/3 rotate-[5deg] bg-[#e3f5ec]"><span className="h-2.5 w-2.5 rounded-full bg-leaf" />Maps</span>
            <span aria-hidden className="sticker absolute hidden lg:inline-flex -bottom-5 left-8 rotate-[-4deg] bg-[#efe9ff]"><span className="h-2.5 w-2.5 rounded-full bg-grape" />AI answers</span>
            <Mascot pose="point" facing={-1} className="pointer-events-none absolute -bottom-20 -right-24 hidden h-[190px] w-auto xl:block" />
          </div>
        </div>
        <div className="relative border-y border-line bg-white/70">
          <div className="wrap flex flex-wrap items-center gap-x-7 gap-y-2 py-4 text-[14px] text-muted">
            <span className="font-mono text-[11.5px] uppercase tracking-[0.14em]">We work inside</span>
            {platforms.map((p) => <span key={p} className="font-[family-name:var(--font-display)] font-semibold text-[#3b425f]">{p}</span>)}
          </div>
        </div>
      </section>

      {/* Promises */}
      <section className="band !pb-0">
        <div className="wrap grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {promises.map((p, i) => (
            <Reveal key={p.t} delay={i * 80}>
              <div className="card h-full p-6">
                <span aria-hidden className={`grid h-10 w-10 place-items-center rounded-xl ${p.c} text-white`}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 5 5 9-10" /></svg>
                </span>
                <h2 className="mt-4 text-[19px] font-bold leading-snug">{p.t}</h2>
                <p className="mt-2 text-[15px] text-muted">{p.b}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Where you show up */}
      <section className="band">
        <div className="wrap">
          <Reveal>
            <p className="eyebrow">Where you show up</p>
            <h2 className="h-lg mt-5 max-w-3xl">Customers search in three places. We optimize for <span className="hl">all three</span>.</h2>
          </Reveal>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {places.map((p, i) => (
              <Reveal key={p.title} delay={i * 120}>
                <div className={`card h-full p-5 ${p.tint}`}>
                  {p.art}
                  <h3 className="mt-6 flex items-center gap-2.5 px-2 text-[23px] font-bold"><span aria-hidden className={`h-3 w-3 rounded-full ${p.dot}`} />{p.title}</h3>
                  <p className="mt-2 px-2 pb-2 text-[16px] text-muted">{p.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Bundles */}
      <section id="bundles" className="band band-sun scroll-mt-20 border-y border-[#f1dd8c]">
        <div className="wrap">
          <Reveal>
            <p className="eyebrow">Bundles</p>
            <h2 className="h-lg mt-5 max-w-3xl">Two bundles. <span className="hl">We handle everything.</span></h2>
            <p className="lede mt-5 max-w-2xl">One monthly price. We do the work, you approve it, and every month you see what changed.</p>
          </Reveal>
          <div className="mt-12"><Bundles /></div>
        </div>
      </section>

      {/* Results: renders only once a real, permitted case study exists */}
      {studies.length > 0 && (
        <section className="band band-line">
          <div className="wrap">
            <Reveal>
              <div className="flex flex-wrap items-end justify-between gap-6">
                <div><p className="eyebrow">Results</p><h2 className="h-lg mt-5">Real numbers from real clients</h2><p className="lede mt-4 max-w-2xl">Every figure comes from Google Search Console or another named source, over a stated period, published with permission.</p></div>
                <Link href="/case-studies" className="btn btn-ghost">All case studies</Link>
              </div>
            </Reveal>
            <div className="mt-12 grid gap-5 md:grid-cols-3">{studies.map((c, i) => <Reveal key={c.slug} delay={i * 120}><CaseStudyCard c={c} /></Reveal>)}</div>
          </div>
        </section>
      )}

      {/* Our own videos: the brand in 20 seconds */}
      <section className="band band-night relative overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 h-[380px] w-[380px] rounded-full bg-[radial-gradient(closest-side,rgb(255_216_77/0.18),transparent)]" />
        <div className="wrap relative">
          <div className="flex flex-wrap items-end justify-between gap-8">
            <Reveal className="max-w-2xl">
              <p className="eyebrow">SEO in 20 seconds</p>
              <h2 className="h-lg mt-5">Tips we give away, <span className="hl">every week</span></h2>
              <p className="lede mt-5">Short animated videos with the full method written out. The same reels we make for our clients&apos; businesses.</p>
            </Reveal>
            <Mascot pose="wave" tone="light" className="hidden h-[170px] w-auto shrink-0 md:block" />
          </div>
          <div className="mt-12 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
            {seoTips.slice(0, 4).map((t, i) => (
              <Reveal key={t.slug} delay={i * 90}>
                <Link href={`/seo-tips/${t.slug}`} className="group block">
                  <div className="relative overflow-hidden rounded-[22px] border-[6px] border-[#2d3662] bg-[#1d2447] shadow-[0_24px_50px_-24px_rgb(0_0_0/0.6)] transition-transform duration-300 group-hover:-translate-y-1">
                    <Image src={posterSrc(t.slug)} alt="" width={540} height={960} sizes="(min-width: 1024px) 270px, 45vw" className="aspect-[9/14] w-full object-cover object-top" />
                    <span className="absolute bottom-3 left-3 rounded-full bg-mark px-3 py-1 text-[12.5px] font-semibold text-night">▶ {t.seconds}s</span>
                  </div>
                  <p className="mt-4 text-[15.5px] font-semibold leading-snug text-[#f7f3e8] group-hover:text-mark">{t.title}</p>
                </Link>
              </Reveal>
            ))}
          </div>
          <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-4">
            <Link href="/seo-tips" className="btn btn-primary">All SEO tips <span aria-hidden>→</span></Link>
            <p className="flex flex-wrap gap-x-6 gap-y-1 font-[family-name:var(--font-display)] text-[17px]">
              <span><strong className="text-mark">{seoTips.length}</strong> video tips</span>
              <span><strong className="text-mark">{guides.length}</strong> free guides</span>
              <span><strong className="text-mark">{tools.length}</strong> free tools</span>
              <span><strong className="text-mark">{servicePages.length}</strong> services and bundles</span>
            </p>
          </div>
        </div>
      </section>

      {/* Single services */}
      <section className="band band-line">
        <div className="wrap grid gap-12 lg:grid-cols-[0.7fr_1.3fr]">
          <Reveal>
            <p className="eyebrow">Single services</p>
            <h2 className="h-lg mt-5">Need one thing? Pick one service.</h2>
            <p className="lede mt-5">Same team, same checks, one job. Every price is a starting point, and you get a fixed quote before we begin.</p>
            <Link href="/services" className="btn btn-ghost mt-8">All services <span aria-hidden>→</span></Link>
          </Reveal>
          <Reveal delay={100}><ServiceList /></Reveal>
        </div>
      </section>

      {/* How it works */}
      <section className="band band-line">
        <div className="wrap">
          <Reveal>
            <p className="eyebrow">How it works</p>
            <h2 className="h-lg mt-5">Three steps.</h2>
          </Reveal>
          <Reveal className="relative mt-14">
            <div aria-hidden className="steps-line absolute left-0 right-0 top-[38px] hidden h-[2px] bg-gradient-to-r from-mark via-mark/60 to-line md:block" />
            <ol className="grid gap-10 md:grid-cols-3">
              {steps.map(([t, b], i) => (
                <li key={t} className="relative">
                  <div className={`grid h-[76px] w-[76px] place-items-center rounded-2xl ${stepColors[i]} text-white shadow-[4px_5px_0_#141a33]`}><StepIcon n={i as 0 | 1 | 2} /></div>
                  <p className="mt-6 font-mono text-[13px] font-bold text-muted">Step {i + 1}</p>
                  <h3 className="mt-2 text-[24px] font-bold">{t}</h3>
                  <p className="mt-3 max-w-sm text-muted">{b}</p>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </section>

      {/* What SEO using AI means */}
      <section className="band band-line">
        <div className="wrap grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal>
            <p className="eyebrow">SEO using AI</p>
            <h2 className="h-lg mt-5">What is SEO using AI?</h2>
            <p className="lede mt-6">SEO using AI means using AI tools like ChatGPT, Claude and Gemini to do search engine optimization faster. AI does the research, the first drafts and the page-by-page checks. A person makes the decisions and checks every fact.</p>
            <p className="mt-4 text-muted">You get more work done each month for the same price, without the robotic content Google ignores.</p>
          </Reveal>
          <Reveal delay={120}><SplitWork /></Reveal>
        </div>
      </section>

      {/* Learn free */}
      <section className="band band-line">
        <div className="wrap">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <p className="eyebrow">Free guides</p>
                <h2 className="h-lg mt-5">Learn SEO using AI, free.</h2>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link href="/seo-tips" className="btn btn-primary">SEO tips videos <span aria-hidden>→</span></Link>
                <Link href="/guides" className="btn btn-ghost">All {guides.length} guides</Link>
                <Link href="/tools" className="btn btn-ghost">Free tools</Link>
              </div>
            </div>
          </Reveal>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {guides.slice(0, 3).map((g, i) => (
              <Reveal key={g.slug} delay={i * 100}><GuideCard g={g} /></Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="band band-line">
        <div className="wrap grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <Reveal><p className="eyebrow">FAQ</p><h2 className="h-lg mt-5">Straight answers</h2></Reveal>
          <Reveal delay={100}><Faq items={faqs} /></Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="band">
        <Reveal className="wrap">
          <div className="band-night relative grid items-center gap-8 overflow-hidden rounded-[28px] p-8 sm:p-14 lg:grid-cols-[1.3fr_0.7fr]">
            <div aria-hidden className="pointer-events-none absolute -bottom-24 -left-10 h-[300px] w-[300px] rounded-full bg-[radial-gradient(closest-side,rgb(255_216_77/0.2),transparent)]" />
            <div className="relative">
              <p className="eyebrow">Start here</p>
              <h2 className="h-lg mt-4">Let&apos;s look at your business together.</h2>
              <p className="lede mt-5 max-w-xl">A free {site.callMinutes}-minute call on Google Meet. We tell you which bundle fits, or if you need less than you think.</p>
              <Link href="/book-a-call" className="btn btn-primary mt-8">Book a free call <span aria-hidden>→</span></Link>
            </div>
            <Mascot pose="cheer" tone="light" className="relative mx-auto hidden h-[220px] w-auto lg:block" />
          </div>
        </Reveal>
      </section>

      <JsonLd data={faqLd(faqs)} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "OfferCatalog",
          name: "SEO Using AI bundles",
          url: abs("/#bundles"),
          provider: { "@id": abs("/#org") },
          itemListElement: bundles.map((b) => ({
            "@type": "Offer",
            name: b.name,
            description: b.plain,
            url: abs(b.href),
            priceSpecification: { "@type": "PriceSpecification", priceCurrency: "USD", description: `${b.price} ${b.unit}` },
          })),
        }}
      />
    </>
  );
}

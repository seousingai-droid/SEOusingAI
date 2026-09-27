import Link from "next/link";
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
import { bundles, site, abs } from "@/lib/site";
import { pageMeta } from "@/lib/meta";

export const metadata = pageMeta({
  title: "SEO Using AI: Get Found on Google, Maps and AI Search",
  description: "SEO using AI for small businesses. We optimize your website, Google Maps profile and content to show up on Google and AI search. Bundles from $790 a month.",
  path: "/",
  absolute: true,
});

const places = [
  { art: <SearchClimb />, title: "Google search", body: "People search for what you sell. We optimize your pages so you show up for those searches." },
  { art: <MapPin />, title: "Google Maps", body: "\"Near me\" searches show three businesses on a map. We optimize your profile to compete for those spots." },
  { art: <ChatRecommend />, title: "AI search", body: "People ask ChatGPT and Google's AI who to hire. We set up your site so AI can find you and name you." },
];

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
      <section className="relative overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(138_180_255/0.13),transparent)]" />
        <div className="wrap relative grid items-center gap-14 pb-20 pt-16 lg:grid-cols-[1.05fr_0.95fr] lg:pb-28 lg:pt-24">
          <div>
            <p className="pill rise" style={{ animationDelay: ".05s" }}><i />SEO using AI for small businesses</p>
            <h1 className="h-xl rise mt-7" style={{ animationDelay: ".15s" }}>
              We optimize your business to show up on <span className="hl">Google and AI search</span>
            </h1>
            <p className="lede rise mt-7 max-w-xl" style={{ animationDelay: ".3s" }}>
              Your website, your Google Maps profile and your content, optimized so customers find you on Google and AI tools like ChatGPT can recommend you. Pick a bundle and we handle all of it.
            </p>
            <div className="rise mt-9 flex flex-wrap gap-3" style={{ animationDelay: ".45s" }}>
              <Link href="#bundles" className="btn btn-primary">See bundles and prices <span aria-hidden>→</span></Link>
              <Link href="/book-a-call" className="btn btn-ghost">Book a free call</Link>
            </div>
            <p className="rise mt-7 text-[15px] text-muted" style={{ animationDelay: ".6s" }}>
              Month to month. No contracts. A person checks every change.
            </p>
          </div>
          <AnswerCard />
        </div>
      </section>

      {/* Where you show up */}
      <section className="band band-line">
        <div className="wrap">
          <Reveal>
            <p className="eyebrow">Where you show up</p>
            <h2 className="h-lg mt-5 max-w-3xl">Customers search in three places. We optimize for <span className="hl">all three</span>.</h2>
          </Reveal>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {places.map((p, i) => (
              <Reveal key={p.title} delay={i * 120}>
                <div className="card h-full p-5">
                  {p.art}
                  <h3 className="mt-6 px-2 text-[23px] font-bold">{p.title}</h3>
                  <p className="mt-2 px-2 pb-2 text-[16px] text-muted">{p.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Bundles */}
      <section id="bundles" className="band band-line scroll-mt-20">
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
                  <div className="grid h-[76px] w-[76px] place-items-center rounded-2xl border border-mark/70 bg-ink text-mark"><StepIcon n={i as 0 | 1 | 2} /></div>
                  <p className="mt-6 font-mono text-[13px] font-bold text-mark">Step {i + 1}</p>
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
      <section className="band band-line">
        <Reveal className="wrap">
          <div className="card grid items-center gap-8 p-8 sm:p-14 lg:grid-cols-[1.3fr_0.7fr]">
            <div>
              <p className="eyebrow">Start here</p>
              <h2 className="h-lg mt-4">Let&apos;s look at your business together.</h2>
              <p className="lede mt-5 max-w-xl">A free {site.callMinutes}-minute call on Google Meet. We tell you which bundle fits, or if you need less than you think.</p>
            </div>
            <div className="flex flex-wrap gap-3 lg:justify-end"><Link href="/book-a-call" className="btn btn-primary">Book a free call <span aria-hidden>→</span></Link></div>
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
            url: abs(`/pricing#bundle-${b.id}`),
            priceSpecification: { "@type": "PriceSpecification", priceCurrency: "USD", description: `${b.price} ${b.unit}` },
          })),
        }}
      />
    </>
  );
}

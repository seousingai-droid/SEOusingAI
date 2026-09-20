import Link from "next/link";
import Image from "next/image";
import AnswerCard from "@/components/AnswerCard";
import Tabs from "@/components/Tabs";
import Reveal from "@/components/Reveal";
import OfferPicker from "@/components/OfferPicker";
import ServicesHub from "@/components/ServicesHub";
import { SearchClimb, MapPin, ChatRecommend, SplitWork, StepIcon } from "@/components/Illustrations";
import Faq, { faqLd } from "@/components/Faq";
import JsonLd from "@/components/JsonLd";
import { getGuides } from "@/lib/content";
import { tools, services, site } from "@/lib/site";

const places = [
  { art: <SearchClimb />, title: "Google search", body: "When someone types what you sell, the businesses at the top get most of the calls. We work to move you up." },
  { art: <MapPin />, title: "Google Maps", body: "For \"near me\" searches, Google shows a map with three businesses. We help you become one of them." },
  { art: <ChatRecommend />, title: "AI assistants", body: "More people now ask ChatGPT or Google's AI who to hire. We help those tools find you and mention you by name." },
];

const steps = [
  ["Book a free call", `A ${site.callMinutes}-minute video call on Google Meet. Tell us about your business. We look at your website together.`],
  ["Get a simple plan", "You get a short written plan with a fixed price. No contracts, no packages of hours, no surprises."],
  ["We do the work", "AI does the heavy lifting and a real person checks it. You approve everything before it goes live."],
] as const;

const problems = [
  {
    label: "Nobody finds my website",
    title: "Google does not know what you do.",
    body: "Your website may look fine to you and still be confusing to Google. Pages are missing, hard to read for search engines, or say the same thing as a hundred other sites.",
    fixes: ["We check every page and fix what is broken", "We make each page clearly about one thing", "We add the real details only your business has"],
    rows: [["A competitor", "competitor.com", false], ["An online directory", "directory.com", false], ["Your website", "your-business.com", true]],
    note: "Too far down to get the call.",
  },
  {
    label: "People see it but do not click",
    title: "Google's AI answered before they reached you.",
    body: "Pew Research Center found people click a website about half as often when Google shows an AI summary first. So we get you named inside that summary, and give people a real reason to visit.",
    fixes: ["Headlines that make people want to click", "Helpful extras worth visiting for", "Pages written so AI summaries quote you"],
    rows: [["Google's AI summary", "answers right on the page", false], ["Your website, in first place", "your-business.com", true], ["Everyone else", "further down", false]],
    note: "First place is no longer enough.",
  },
  {
    label: "AI never mentions me",
    title: "AI tools cannot find a clear answer on your site.",
    body: "ChatGPT and similar tools copy short, clear passages from websites they trust. If your pages ramble or never state the facts plainly, they quote someone else.",
    fixes: ["Clear questions and direct answers on every page", "Facts backed by named sources", "More mentions of you on sites AI already trusts"],
    rows: [["[1] A site with a clear answer", "quoted by AI", false], ["[2] A site with a comparison table", "quoted by AI", false], ["Your website", "your-business.com", true]],
    note: "Seen by AI, then skipped.",
  },
] as const;

const stats = [
  { n: "8% vs 15%", t: "People click a website in 8% of Google visits when an AI summary shows up. Without one, it is 15%.", s: "Pew Research Center, 2025", u: "https://www.pewresearch.org/short-reads/2025/07/22/google-users-are-less-likely-to-click-on-links-when-an-ai-summary-appears-in-the-results/" },
  { n: "24.61%", t: "At the peak in July 2025, about 1 in 4 Google searches showed an AI answer at the top.", s: "Semrush AI Overviews study", u: "https://www.semrush.com/blog/semrush-ai-overviews-study/" },
  { n: "Under 1 in 3", t: "Fewer than a third of Google searches now end with a click to any website.", s: "SparkToro, 2026", u: "https://sparktoro.com/blog/in-2026-less-than-one-third-of-google-searches-still-send-a-click/" },
];

const toolNames = ["ChatGPT", "Claude", "Gemini", "Perplexity", "Google Search Console", "Google Business Profile", "WordPress", "Next.js", "Semrush", "Ahrefs"];

const faqs = [
  { q: "What is SEO using AI?", a: "SEO using AI means using AI tools such as ChatGPT, Claude, and Gemini to do search engine optimization faster. SEO is the work of getting your website to show up when people search. AI handles the time-consuming parts, like research, first drafts, and checking every page. A person still makes the decisions, checks the facts, and adds real experience." },
  { q: "I run a small business. Is this for me?", a: "Yes. SEO Using AI is built for small businesses that want more customers from Google, Google Maps, and AI assistants without hiring a big agency. You can follow the free guides yourself, or book a free call and have the work done for you." },
  { q: "How much does it cost?", a: "You get a fixed price in writing after a free call, before any work starts. The price depends on the size of your website and what it needs. There are no long contracts and no packages of hours." },
  { q: "Do you guarantee first place on Google?", a: "No, and you should be careful with anyone who does. Google and AI tools decide their own results. We promise clear work, honest reports, and a person checking everything." },
  { q: "Is SEO using AI allowed by Google?", a: "Yes. Google says it rewards helpful content however it is made. What Google punishes is mass-produced, low-quality pages made only to trick rankings. That is why a person reviews everything we publish." },
  { q: "Are the guides and tools really free?", a: "Yes. Every guide and tool on SEO Using AI is free and needs no signup. The site earns money from done-for-you services and, in some cases, labeled affiliate links. Neither changes what we recommend." },
];

export default function Home() {
  const guides = getGuides();
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(138_180_255/0.13),transparent)]" />
        <div className="wrap relative grid items-center gap-14 pb-20 pt-16 lg:grid-cols-[1.1fr_0.9fr] lg:pb-28 lg:pt-24">
          <div>
            <p className="pill rise" style={{ animationDelay: ".05s" }}><i />For small businesses that want more customers</p>
            <h1 className="h-xl rise mt-7" style={{ animationDelay: ".15s" }}>
              SEO using AI: get found on Google and <span className="hl">recommended by AI</span>
            </h1>
            <p className="lede rise mt-7 max-w-xl" style={{ animationDelay: ".3s" }}>
              Your customers ask Google, Google Maps, and ChatGPT who to call. We help your business show up in all three. AI does the heavy lifting. A real person checks every detail.
            </p>
            <div className="rise mt-9 flex flex-wrap gap-3" style={{ animationDelay: ".45s" }}>
              <Link href="/book-a-call" className="btn btn-primary">Book a free call <span aria-hidden>→</span></Link>
              <a href="#offers" className="btn btn-ghost">See what we offer</a>
            </div>
            <p className="rise mt-6 text-[15px] text-muted" style={{ animationDelay: ".6s" }}>Prefer to do it yourself? <Link className="text-link underline underline-offset-4 hover:text-mark" href="/guides/how-to-use-ai-for-seo">Every guide and tool here is free</Link>.</p>
          </div>
          <AnswerCard />
        </div>
      </section>

      {/* Three places customers look */}
      <section className="band band-line">
        <div className="wrap">
          <Reveal>
            <p className="eyebrow">Where customers look</p>
            <h2 className="h-lg mt-5 max-w-3xl">Your customers search in three places. We get you into <span className="hl">all three</span>.</h2>
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

      {/* Offers */}
      <section id="offers" className="band band-line scroll-mt-20">
        <div className="wrap">
          <Reveal>
            <p className="eyebrow">What we offer</p>
            <h2 className="h-lg mt-5 max-w-3xl">Tell us what you need. We will show you what fits.</h2>
            <p className="lede mt-5 max-w-2xl">Pick the sentence that sounds most like you.</p>
          </Reveal>
          <Reveal className="mt-10" delay={100}><OfferPicker /></Reveal>
        </div>
      </section>

      {/* How it works */}
      <section className="band band-line">
        <div className="wrap">
          <Reveal>
            <p className="eyebrow">How it works</p>
            <h2 className="h-lg mt-5">Three steps. No jargon.</h2>
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
          <Reveal className="mt-12"><Link href="/book-a-call" className="btn btn-primary">Start with a free call <span aria-hidden>→</span></Link></Reveal>
        </div>
      </section>

      {/* AI + person */}
      <section className="band band-line">
        <div className="wrap grid items-center gap-12 lg:grid-cols-[0.85fr_1.15fr]">
          <Reveal>
            <p className="eyebrow">Why it works</p>
            <h2 className="h-lg mt-5">AI makes it fast. A person makes it <span className="hl">right</span>.</h2>
            <p className="lede mt-6">AI can read your whole website in minutes and write a first draft in seconds. It can also get facts wrong. So every piece of work passes through a real person before you see it.</p>
            <p className="mt-4 text-muted">That is how you get big-agency coverage at a small-business pace, without the robotic content Google ignores. New to all this? Start with <Link className="text-link underline underline-offset-4 hover:text-mark" href="/ai-seo-for-small-business">AI SEO for small business</Link> or the <Link className="text-link underline underline-offset-4 hover:text-mark" href="/glossary">plain-English glossary</Link>.</p>
          </Reveal>
          <Reveal delay={120}><SplitWork /></Reveal>
        </div>
      </section>

      {/* Everything covered */}
      <section className="band band-line">
        <div className="wrap grid items-center gap-12 lg:grid-cols-2">
          <Reveal><ServicesHub className="hidden w-full md:block" /></Reveal>
          <Reveal delay={120}>
            <p className="eyebrow">Everything in one place</p>
            <h2 className="h-lg mt-5">Fifteen kinds of work, one team to call.</h2>
            <p className="lede mt-6">You do not need a writer, a developer, a designer, and a marketing agency. It is all here, and one person reviews all of it.</p>
            <ul className="mt-8 divide-y divide-line border-y border-line">
              {services.map((sv) => (
                <li key={sv.key}>
                  <Link href={`/services#${sv.key.toLowerCase().replace(/[^a-z]+/g, "-")}`} className="group flex items-baseline justify-between gap-6 py-4">
                    <span className="font-[family-name:var(--font-display)] text-[20px] font-semibold group-hover:text-mark">{sv.key}</span>
                    <span className="hidden text-right text-[15px] text-muted sm:block">{sv.summary}</span>
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-3"><Link href="/services" className="btn btn-ghost">See all services <span aria-hidden>→</span></Link><Link href="/ai-seo-agency" className="btn btn-ghost">How our agency works</Link></div>
          </Reveal>
        </div>
      </section>

      {/* Problems */}
      <section className="band band-line">
        <div className="wrap">
          <Reveal>
            <p className="eyebrow">Sound familiar?</p>
            <h2 className="h-lg mt-5 max-w-3xl">Why is my website not bringing in customers?</h2>
            <p className="lede mt-5 max-w-2xl">It is usually one of three things. Tap the one that sounds like you.</p>
          </Reveal>
          <Reveal className="card mt-10 p-6 sm:p-10" delay={100}>
            <Tabs variant="underline" labels={problems.map((b) => b.label)}>
              {problems.map((b) => (
                <div key={b.label} className="grid gap-10 lg:grid-cols-2">
                  <div className="space-y-3">
                    {b.rows.map(([t, u, you]) => (
                      <div key={t as string} className={`rounded-xl border px-5 py-4 ${you ? "border-mark/70 bg-mark/[0.06]" : "border-line bg-ink"}`}>
                        <p className="text-[16px] font-medium">{t}</p>
                        <p className="font-mono text-[12.5px] text-muted">{u}</p>
                        {you && <p className="mt-2 text-[14px] text-mark">{b.note}</p>}
                      </div>
                    ))}
                  </div>
                  <div>
                    <h3 className="text-[26px] font-bold">{b.title}</h3>
                    <p className="mt-4 text-muted">{b.body}</p>
                    <p className="mt-6 font-mono text-[12px] uppercase tracking-widest text-muted">What we do about it</p>
                    <ul className="mt-4 space-y-2.5">
                      {b.fixes.map((f) => (<li key={f} className="flex gap-3 text-[16px]"><span aria-hidden className="mt-[11px] h-1.5 w-1.5 shrink-0 rounded-full bg-mark" />{f}</li>))}
                    </ul>
                  </div>
                </div>
              ))}
            </Tabs>
          </Reveal>
        </div>
      </section>

      {/* Numbers + explainer image */}
      <section className="band band-line">
        <div className="wrap">
          <Reveal>
            <p className="eyebrow">Why this matters now</p>
            <h2 className="h-lg mt-5 max-w-3xl">The way people search has changed.</h2>
            <p className="lede mt-5 max-w-2xl">Three findings from well-known researchers. Each links to its source so you can check it yourself.</p>
          </Reveal>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {stats.map((s, i) => (
              <Reveal key={s.n} delay={i * 120}>
                <figure className="card h-full p-8">
                  <p className="font-[family-name:var(--font-display)] text-[44px] font-bold leading-none text-mark">{s.n}</p>
                  <p className="mt-5 text-[16.5px]">{s.t}</p>
                  <figcaption className="mt-5 text-[14.5px] text-muted">Source: <a className="text-link underline underline-offset-4 hover:text-mark" href={s.u} target="_blank" rel="noopener">{s.s}</a></figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-16">
            <figure className="grid items-center gap-10 lg:grid-cols-[1.2fr_0.8fr]">
              <Image src="/images/how-ai-engines-cite-sources.webp" alt="Diagram of how AI answer engines cite sources in three stages: search the web, chunk pages into passages, and rank passages for the answer" width={1600} height={900} sizes="(min-width: 1024px) 680px, 100vw" className="figure-img" />
              <figcaption>
                <h3 className="h-md">How AI decides who to mention</h3>
                <p className="mt-4 text-muted">AI tools search the web, cut each page into short pieces, and quote the pieces that answer the question best. So every section of your website needs to make sense on its own. That is how we write them.</p>
                <Link href="/guides/generative-engine-optimization" className="mt-5 inline-block text-link underline underline-offset-4 hover:text-mark">Read the full guide</Link>
              </figcaption>
            </figure>
          </Reveal>
        </div>
      </section>

      {/* Tools marquee */}
      <section className="border-t border-line py-14">
        <p className="eyebrow text-center">Tools and platforms we work with</p>
        <div className="marquee-mask mt-8">
          <ul className="marquee gap-14 pr-14 font-[family-name:var(--font-display)] text-[24px] font-semibold text-muted">
            {toolNames.map((t) => <li key={t} className="whitespace-nowrap">{t}</li>)}
            {toolNames.map((t) => <li key={`${t}-2`} aria-hidden className="whitespace-nowrap">{t}</li>)}
          </ul>
        </div>
      </section>

      {/* Learn free */}
      <section className="band band-line">
        <div className="wrap">
          <Reveal className="grid items-center gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="eyebrow">Prefer to do it yourself?</p>
              <h2 className="h-lg mt-5">Learn SEO using AI, free.</h2>
              <p className="lede mt-5">Step-by-step guides and small tools that run in your browser. No signup. Start with the six-step workflow on the right.</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/guides/how-to-use-ai-for-seo" className="btn btn-primary">Read the first guide <span aria-hidden>→</span></Link>
                <Link href="/tools" className="btn btn-ghost">Free tools</Link>
              </div>
            </div>
            <Image src="/images/ai-seo-workflow.webp" alt="Diagram of the six-step AI SEO workflow: research, brief, draft, verify, optimize, measure, with verify done by a person" width={1600} height={900} sizes="(min-width: 1024px) 680px, 100vw" className="figure-img" />
          </Reveal>
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {guides.map((g, i) => (
              <Reveal key={g.slug} delay={(i % 3) * 100}>
                <Link href={`/guides/${g.slug}`} className="card card-hover flex h-full flex-col overflow-hidden">
                  {g.image && <Image src={g.image} alt="" width={800} height={450} sizes="(min-width: 1024px) 380px, (min-width: 768px) 50vw, 100vw" className="aspect-video w-full border-b border-line object-cover" />}
                  <div className="flex flex-1 flex-col p-7">
                    <p className="eyebrow">{g.eyebrow}</p>
                    <h3 className="mt-3 text-[21px] font-bold leading-tight">{g.title}</h3>
                    <p className="mt-4 font-mono text-[13px] text-muted">{g.readMinutes} min read <span className="text-mark">→</span></p>
                  </div>
                </Link>
              </Reveal>
            ))}
            <Reveal delay={200}>
              <div className="card flex h-full flex-col justify-between p-7">
                <div>
                  <p className="eyebrow">Free tools</p>
                  <ul className="mt-5 space-y-3">
                    {tools.map((t) => (<li key={t.slug}><Link className="text-[18px] font-semibold hover:text-mark" href={`/tools/${t.slug}`}>{t.name} <span className="text-mark">→</span></Link></li>))}
                  </ul>
                </div>
                <p className="mt-6 text-[15px] text-muted">They run in your browser. Nothing you type is sent anywhere.</p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="band band-line">
        <div className="wrap grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <Reveal><p className="eyebrow">FAQ</p><h2 className="h-lg mt-5">Questions small business owners ask</h2></Reveal>
          <Reveal delay={100}><Faq items={faqs} /></Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="band band-line">
        <Reveal className="wrap">
          <div className="card grid items-center gap-8 p-8 sm:p-14 lg:grid-cols-[1.3fr_0.7fr]">
            <div>
              <p className="eyebrow">Not sure where to begin?</p>
              <h2 className="h-lg mt-4">Let&apos;s look at your website together.</h2>
              <p className="lede mt-5 max-w-xl">A free {site.callMinutes}-minute video call on Google Meet. You leave with one thing worth fixing this week, whether or not we work together.</p>
            </div>
            <div className="flex flex-wrap gap-3 lg:justify-end"><Link href="/book-a-call" className="btn btn-primary">Book a free call <span aria-hidden>→</span></Link></div>
          </div>
        </Reveal>
      </section>

      <JsonLd data={faqLd(faqs)} />
    </>
  );
}

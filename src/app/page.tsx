import Link from "next/link";
import AnswerCard from "@/components/AnswerCard";
import Tabs from "@/components/Tabs";
import Faq, { faqLd } from "@/components/Faq";
import JsonLd from "@/components/JsonLd";
import { getGuides } from "@/lib/content";
import { tools } from "@/lib/site";

const audiences = [
  {
    label: "Site owners",
    intro: "You run the business and the website. You need more customers from search without hiring an agency.",
    steps: [
      ["Find the pages that almost rank.", "Export Search Console queries and let AI list the ones sitting in positions 5 to 20."],
      ["Fix those pages first.", "Sharper titles, a direct answer up top, missing questions added. Faster than any new article."],
      ["Publish one useful page a week.", "AI builds the brief and first draft. You add prices, photos, and what you have seen firsthand."],
      ["Check Google and AI answers monthly.", "Track clicks in Search Console and test whether AI engines mention you."],
    ],
  },
  {
    label: "Freelancers and agencies",
    intro: "You deliver SEO for clients and need to do more work per hour without lowering quality.",
    steps: [
      ["Turn audits into a repeatable prompt.", "Paste crawl exports and get a prioritized fix list in your report format."],
      ["Standardize briefs.", "One brief structure, built from competitor headings, for every writer and every client."],
      ["Keep a human review gate.", "Every fact checked, every client claim confirmed. Speed never ships unreviewed."],
      ["Report on AI visibility too.", "Add prompt tracking so clients see mentions in ChatGPT and Perplexity, not only rankings."],
    ],
  },
  {
    label: "Content teams",
    intro: "You publish often and need each piece to rank, earn the click, and be quotable.",
    steps: [
      ["Cluster before you write.", "Group keywords by intent so two articles never compete for the same query."],
      ["Write answer-first sections.", "Every heading is a question. Every first sentence is the answer."],
      ["Source every number.", "A statistic with a named source is what AI engines quote. Unsourced claims get skipped."],
      ["Refresh on a schedule.", "Update dates, data, and examples. Stale pages lose citations first."],
    ],
  },
  {
    label: "Ecommerce",
    intro: "You have hundreds of product and category pages and no time to hand-write each one.",
    steps: [
      ["Start with category pages.", "They carry the buying intent. Use AI to draft intros and FAQs from real customer questions."],
      ["Generate product copy from specs.", "Feed real attributes only. Tell the model not to invent features."],
      ["Add Product and FAQ schema.", "AI writes valid JSON-LD in seconds. Only mark up what the page actually shows."],
      ["Build buying guides.", "Comparison content is what AI engines pull for \"best\" and \"versus\" prompts."],
    ],
  },
] as const;

const breaks = [
  {
    label: "AI content does not rank",
    tag: "Visibility",
    title: "The page says what every other AI page says.",
    body: "If ten sites ask the same model the same question, Google sees ten copies. Pages rank when they add something the others lack: real data, real experience, or a clearer answer.",
    fixes: ["Brief from the SERP, not from a blank prompt", "Add first-hand detail only you have", "One page per intent, no near-duplicates", "Verify every fact before publishing"],
    serp: [["A site with original data", "example.com", false], ["A forum thread with real experience", "community.example", false], ["Your unedited AI article", "yoursite.com/blog", true]],
    note: "Indexed, then ignored.",
  },
  {
    label: "Ranks, but no clicks",
    tag: "Click-through",
    title: "An AI Overview answered before anyone reached you.",
    body: "Pew Research Center found users click a result in 8% of visits when an AI summary appears, versus 15% without. The fix is to be the source inside the summary and to give searchers a reason to click through.",
    fixes: ["Titles that promise something the summary cannot give", "Tools, templates, and data worth visiting for", "Target queries where people still need depth", "Preview every snippet before publishing"],
    serp: [["AI Overview", "answers the question on the page", false], ["Your page, position 1", "yoursite.com/guide", true], ["Everything else", "below the fold", false]],
    note: "Ranking first is no longer the finish line.",
  },
  {
    label: "Never cited by AI",
    tag: "Citations",
    title: "Your passages cannot stand on their own.",
    body: "AI engines quote passages, not pages. A section that opens with a story, leans on \"as mentioned above\", or states numbers without sources gives the engine nothing safe to lift.",
    fixes: ["Question headings that match real prompts", "First sentence answers the heading", "Sections that make sense when extracted alone", "Sourced statistics and visible update dates"],
    serp: [["[1] A page with a direct, sourced answer", "cited.example", false], ["[2] A comparison table", "tables.example", false], ["Your page, ranking but unquoted", "yoursite.com/guide", true]],
    note: "Retrieved, then passed over.",
  },
] as const;

const stats = [
  { n: "8% vs 15%", t: "Share of Google visits with a click on a traditional result, with an AI summary versus without.", s: "Pew Research Center, 2025", u: "https://www.pewresearch.org/short-reads/2025/07/22/google-users-are-less-likely-to-click-on-links-when-an-ai-summary-appears-in-the-results/" },
  { n: "24.61%", t: "Peak share of tracked queries that triggered a Google AI Overview, reached in July 2025.", s: "Semrush AI Overviews study", u: "https://www.semrush.com/blog/semrush-ai-overviews-study/" },
  { n: "Under 1 in 3", t: "Google searches that still send a click to the open web.", s: "SparkToro, 2026", u: "https://sparktoro.com/blog/in-2026-less-than-one-third-of-google-searches-still-send-a-click/" },
];

const process = [
  ["Research with AI, validate with data", "Expand and cluster keywords with a model. Confirm demand in Search Console or a keyword platform before writing a word."],
  ["Brief from what already ranks", "Feed the model competitor headings. Ask what they cover, what they miss, and what a better page would add."],
  ["Draft fast, then verify everything", "AI writes the first draft. You check every fact and add the experience no model has."],
  ["Measure in Google and in AI answers", "Track clicks and positions, then test your target prompts in ChatGPT, Perplexity, Gemini, and Claude."],
];

const strengths = [
  ["AI is fast at the volume work", "Clustering 500 keywords, drafting 20 meta descriptions, or reading a crawl export takes minutes instead of days."],
  ["AI does not know your search data", "A general model has no live keyword volumes. Any number it offers is a guess until a real tool confirms it."],
  ["AI writes well-structured drafts", "Outlines, answer-first sections, tables, and schema are where models are most dependable."],
  ["AI has no first-hand experience", "Prices you paid, results you got, mistakes you made. That is the part readers and search engines reward."],
];

const paths = [
  { k: "Learn", title: "How to use AI for SEO", body: "The full six-step workflow, from research to measurement. Read this first.", best: "Anyone new to doing SEO with AI.", href: "/guides/how-to-use-ai-for-seo", cta: "Read the guide" },
  { k: "Compare", title: "Best AI SEO tools", body: "Four types of tools, what each is for, and how to build a stack without overpaying.", best: "People about to pay for a tool.", href: "/guides/best-ai-seo-tools", cta: "Compare tools" },
  { k: "Do", title: "Free AI SEO tools", body: "Snippet preview, prompt builder, and llms.txt generator. No signup, nothing to install.", best: "People who want to act today.", href: "/tools", cta: "Open the tools" },
  { k: "Get cited", title: "Generative engine optimization", body: "How AI engines pick sources, and how to write passages they quote.", best: "Sites that rank but never get mentioned.", href: "/guides/generative-engine-optimization", cta: "Learn GEO" },
];

const faqs = [
  { q: "What is SEO using AI?", a: "SEO using AI is the practice of using AI models such as ChatGPT, Claude, and Gemini to speed up search engine optimization work, including keyword research, content briefs, drafting, on-page optimization, technical audits, and reporting. A human still sets the strategy, verifies facts, and adds first-hand experience." },
  { q: "Is SEO using AI allowed by Google?", a: "Yes. Google states that it rewards helpful, original content however it is produced. What violates Google's spam policies is scaled content abuse, meaning many low-value pages published mainly to manipulate rankings, whether written by AI or people." },
  { q: "Is this site free?", a: "Yes. Every guide and tool on SEO Using AI is free and needs no signup. The site may earn a commission from some tool links. Those links are labeled, and they never change what we recommend." },
  { q: "Do I need paid tools to do SEO with AI?", a: "No. You can start with a free tier of a general AI model and Google Search Console. Paid SEO platforms become useful when you need reliable search volumes, competitor data, or rank tracking at scale." },
  { q: "What is the difference between AI SEO and GEO?", a: "AI SEO usually means using AI to do SEO work. Generative engine optimization (GEO) means optimizing content so AI answer engines cite it. This site covers both, because in 2026 you need both." },
];

export default function Home() {
  const guides = getGuides();
  return (
    <>
      {/* 1. Hero */}
      <section className="relative overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(138_180_255/0.13),transparent)]" />
        <div className="wrap relative grid items-center gap-14 pb-20 pt-16 lg:grid-cols-[1.1fr_0.9fr] lg:pb-28 lg:pt-24">
          <div>
            <p className="pill"><i />A free, plain-English guide to AI SEO</p>
            <h1 className="h-xl mt-7">
              SEO using AI: rank on Google and get <span className="hl">cited by AI answers</span>
            </h1>
            <p className="lede mt-7 max-w-xl">
              SEO using AI means letting AI do the research, briefs, drafts, and audits, while you verify the facts and add what only you know. This site shows the whole workflow, step by step.
            </p>
            <p className="mt-4 max-w-xl text-[16px] text-muted">
              Guides, tested prompt structures, honest tool comparisons, and free tools. No signup. No hype about one-click rankings.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/guides/how-to-use-ai-for-seo" className="btn btn-primary">Read the guide <span aria-hidden>→</span></Link>
              <Link href="/tools" className="btn btn-ghost">Try the free tools</Link>
            </div>
          </div>
          <AnswerCard />
        </div>
      </section>

      {/* 2. Positioning split */}
      <section className="band band-line">
        <div className="wrap grid gap-12 lg:grid-cols-[1.25fr_0.75fr]">
          <div>
            <p className="eyebrow">AI SEO that holds up</p>
            <h2 className="h-lg mt-5">AI SEO for people who need <span className="hl">traffic that pays</span>, not a pile of generated posts.</h2>
            <p className="lede mt-7 max-w-2xl">AI made content cheap, so search engines stopped rewarding content that is merely there. What still works is a page that answers better than the rest and proves someone real stands behind it.</p>
            <p className="mt-4 max-w-2xl text-muted">Everything here follows one rule: AI does the volume, a person does the truth. Start with <Link className="text-link underline underline-offset-4 hover:text-mark" href="/guides/ai-keyword-research">AI keyword research</Link>, use our <Link className="text-link underline underline-offset-4 hover:text-mark" href="/guides/chatgpt-prompts-for-seo">prompts for SEO</Link>, then learn <Link className="text-link underline underline-offset-4 hover:text-mark" href="/guides/generative-engine-optimization">how to get cited by AI</Link>.</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/guides" className="btn btn-primary">Browse all guides</Link>
              <Link href="/guides/best-ai-seo-tools" className="btn btn-ghost">Compare AI SEO tools</Link>
            </div>
          </div>
          <dl className="card divide-y divide-line self-start border-l-2 !border-l-mark">
            {[
              ["Search surfaces covered", "Google, AI Overviews, ChatGPT, Perplexity, Gemini, Claude"],
              ["What you get", "Guides, prompt structures, tool comparisons, free tools"],
              ["Cost", "Free to read and use. No signup."],
              ["Approach", "SEO first, then optimize for AI answers"],
            ].map(([k, v]) => (
              <div key={k} className="px-7 py-6">
                <dt className="eyebrow">{k}</dt>
                <dd className="mt-2 font-[family-name:var(--font-display)] text-[20px] font-semibold leading-snug">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* 3. Who this is for + where it breaks */}
      <section className="band band-line">
        <div className="wrap">
          <p className="eyebrow">Who this is for</p>
          <h2 className="h-lg mt-5 max-w-3xl">Pick your situation. Then pick where your SEO breaks.</h2>
          <p className="lede mt-6 max-w-2xl">Different sites need different first moves. Nothing here is a ranking promise. It is the order of work that tends to pay back fastest.</p>
          <div className="mt-10">
            <Tabs labels={audiences.map((a) => a.label)}>
              {audiences.map((a) => (
                <div key={a.label}>
                  <p className="max-w-2xl text-muted">{a.intro}</p>
                  <ol className="mt-8 grid gap-x-10 md:grid-cols-2">
                    {a.steps.map(([t, b], i) => (
                      <li key={t} className="flex gap-5 border-t border-line py-6">
                        <span className="font-mono text-[14px] font-bold text-mark">{String(i + 1).padStart(2, "0")}</span>
                        <div><h3 className="text-[19px] font-semibold">{t}</h3><p className="mt-1.5 text-[16px] text-muted">{b}</p></div>
                      </li>
                    ))}
                  </ol>
                </div>
              ))}
            </Tabs>
          </div>

          <div className="card mt-16 p-6 sm:p-10">
            <p className="eyebrow">From search to citation</p>
            <h2 className="h-md mt-3 !text-[clamp(26px,3vw,36px)] !font-bold">Where AI SEO actually breaks</h2>
            <div className="mt-7">
              <Tabs variant="underline" labels={breaks.map((b) => b.label)}>
                {breaks.map((b) => (
                  <div key={b.label} className="grid gap-10 lg:grid-cols-2">
                    <div className="space-y-3">
                      {b.serp.map(([t, u, you]) => (
                        <div key={t as string} className={`rounded-xl border px-5 py-4 ${you ? "border-mark/70 bg-mark/[0.06]" : "border-line bg-ink"}`}>
                          <p className="text-[16px] font-medium">{t}</p>
                          <p className="font-mono text-[12.5px] text-muted">{u}</p>
                          {you && <p className="mt-2 text-[14px] text-mark">{b.note}</p>}
                        </div>
                      ))}
                    </div>
                    <div>
                      <p className="eyebrow">{b.tag}</p>
                      <h3 className="mt-3 text-[24px] font-bold">{b.title}</h3>
                      <p className="mt-4 text-muted">{b.body}</p>
                      <ul className="mt-6 space-y-2.5">
                        {b.fixes.map((f) => (
                          <li key={f} className="flex gap-3 text-[16px]"><span aria-hidden className="mt-[11px] h-1.5 w-1.5 shrink-0 rounded-full bg-mark" />{f}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </Tabs>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Tools we cover (replaces client logo wall) */}
      <section className="band band-line text-center">
        <div className="wrap">
          <p className="eyebrow">What we write about</p>
          <h2 className="h-lg mt-5">The tools we <span className="hl">cover</span></h2>
          <p className="lede mx-auto mt-5 max-w-xl">Named plainly. No sponsored placements, and no logo wall pretending to be a client list.</p>
          <ul className="mx-auto mt-12 flex max-w-4xl flex-wrap justify-center gap-x-10 gap-y-5 font-[family-name:var(--font-display)] text-[22px] font-semibold text-muted">
            {["ChatGPT", "Claude", "Gemini", "Perplexity", "Google Search Console", "Semrush", "Ahrefs", "Surfer", "Clearscope"].map((t) => <li key={t}>{t}</li>)}
          </ul>
        </div>
      </section>

      {/* 5. The numbers (replaces awards) */}
      <section className="band band-line">
        <div className="wrap">
          <p className="eyebrow">Why this matters now</p>
          <h2 className="h-lg mt-5 max-w-3xl">Search changed. The numbers are public.</h2>
          <p className="lede mt-5 max-w-2xl">Three findings from named research. Each one links to its source so you can check it yourself.</p>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {stats.map((s) => (
              <figure key={s.n} className="card p-8">
                <p className="font-[family-name:var(--font-display)] text-[44px] font-bold leading-none text-mark">{s.n}</p>
                <p className="mt-5 text-[16.5px]">{s.t}</p>
                <figcaption className="mt-5 text-[14.5px] text-muted">Source: <a className="text-link underline underline-offset-4 hover:text-mark" href={s.u} target="_blank" rel="noopener">{s.s}</a></figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Featured guides (replaces case studies) */}
      <section className="band band-line">
        <div className="wrap">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="eyebrow">The guides</p>
              <h2 className="h-lg mt-5">Learn SEO using AI, one job at a time</h2>
            </div>
            <Link href="/guides" className="btn btn-ghost">View all guides</Link>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {guides.map((g) => (
              <Link key={g.slug} href={`/guides/${g.slug}`} className="card card-hover flex flex-col p-8">
                <p className="eyebrow">{g.eyebrow}</p>
                <h3 className="mt-4 text-[23px] font-bold leading-tight">{g.title}</h3>
                <p className="mt-3 flex-1 text-[16px] text-muted">{g.description}</p>
                <p className="mt-6 font-mono text-[13px] text-muted">{g.readMinutes} min read <span className="text-mark">→</span></p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Process */}
      <section className="band band-line">
        <div className="wrap">
          <p className="eyebrow">The method</p>
          <h2 className="h-lg mt-5">SEO using AI, step by step</h2>
          <ol className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {process.map(([t, b], i) => (
              <li key={t} className="card p-7">
                <span className="font-mono text-[14px] font-bold text-mark">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-5 text-[20px] font-semibold leading-snug">{t}</h3>
                <p className="mt-3 text-[16px] text-muted">{b}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 8. Strengths and limits */}
      <section className="band band-line">
        <div className="wrap grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="eyebrow">An honest split</p>
            <h2 className="h-lg mt-5">What AI is good at in SEO, and where it is not</h2>
            <p className="lede mt-6">Most bad AI SEO comes from asking the model for things it cannot know. Use it where it is strong and keep a person where it is weak.</p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            {strengths.map(([t, b]) => (
              <div key={t} className="card p-7">
                <h3 className="text-[20px] font-semibold leading-snug">{t}</h3>
                <p className="mt-3 text-[16px] text-muted">{b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. Free tools (replaces testimonials) */}
      <section className="band band-line">
        <div className="wrap">
          <p className="eyebrow">Free tools</p>
          <h2 className="h-lg mt-5">Small tools that save real time</h2>
          <p className="lede mt-5 max-w-2xl">They run in your browser. Nothing you type is sent to a server.</p>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {tools.map((t) => (
              <Link key={t.slug} href={`/tools/${t.slug}`} className="card card-hover p-8">
                <h3 className="text-[22px] font-bold">{t.name}</h3>
                <p className="mt-3 text-[16px] text-muted">{t.blurb}</p>
                <p className="mt-6 font-mono text-[13px] text-mark">Open tool →</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 10. Choose the right start */}
      <section className="band band-line">
        <div className="wrap">
          <p className="eyebrow">Choose the right start</p>
          <h2 className="h-lg mt-5 max-w-3xl">Start with your problem, not with a tool.</h2>
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {paths.map((p) => (
              <div key={p.k} className="card flex flex-col p-8">
                <p className="eyebrow">{p.k}</p>
                <h3 className="mt-4 text-[26px] font-bold">{p.title}</h3>
                <p className="mt-3 text-muted">{p.body}</p>
                <p className="mt-5 text-[15px]"><span className="font-mono text-[12px] uppercase tracking-widest text-muted">Best for </span><br />{p.best}</p>
                <Link href={p.href} className="btn btn-ghost mt-7 self-start">{p.cta} <span aria-hidden>→</span></Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 11. FAQ */}
      <section className="band band-line">
        <div className="wrap grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="eyebrow">FAQ</p>
            <h2 className="h-lg mt-5">Questions about SEO using AI</h2>
          </div>
          <Faq items={faqs} />
        </div>
      </section>

      {/* 12. CTA */}
      <section className="band band-line">
        <div className="wrap">
          <div className="card grid items-center gap-8 p-8 sm:p-14 lg:grid-cols-[1.3fr_0.7fr]">
            <div>
              <p className="eyebrow">Not sure where to begin?</p>
              <h2 className="h-lg mt-4">Read one guide. Fix one page this week.</h2>
              <p className="lede mt-5 max-w-xl">The start-here guide takes about ten minutes and gives you a six-step loop you can run on your own site today.</p>
            </div>
            <div className="flex lg:justify-end"><Link href="/guides/how-to-use-ai-for-seo" className="btn btn-primary">Start here <span aria-hidden>→</span></Link></div>
          </div>
        </div>
      </section>

      <JsonLd data={faqLd(faqs)} />
    </>
  );
}

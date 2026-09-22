import Link from "next/link";
import PageHero, { crumbLd } from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import Faq, { faqLd } from "@/components/Faq";
import JsonLd from "@/components/JsonLd";
import { pageMeta } from "@/lib/meta";
import { site, abs } from "@/lib/site";

export const metadata = pageMeta({
  title: "Pricing: Free SEO Checklist, $67 for Lifetime Access",
  description: "The SEO Checklist Checker is free for the first 5 results. One payment of $67 unlocks all 94 checks with a plain-English fix for each, forever. No subscription.",
  path: "/pricing",
  absolute: true,
});

const { price, freeChecks, checkoutUrl } = site.checklist;
const faqs = [
  { q: "Is the $67 a subscription?", a: "No. It is one payment for lifetime access to the SEO Checklist Checker, including every check we add in future." },
  { q: "What do I get after paying?", a: "You get a license key by email. Paste it into the tool once, and every report on that browser shows all 94 results with what we found and how to fix it. It also unlocks your dashboard, where every audit is saved and turned into one to-do list. The key works on any device." },
  { q: "Where is my audit history stored?", a: "In your own browser, not on our servers. That keeps it private, and it means the history does not follow you to another device and is erased if you clear your browser data. You can export a copy from the dashboard at any time." },
  { q: "How many pages can I check?", a: "As many as you like, within a fair-use limit of about 30 checks a minute. Check your own pages, your competitors' pages, and your clients' pages." },
  { q: "Can I use it for client work?", a: "Yes. One key covers one person's use, on any number of websites. Agencies with several team members should buy a key per person." },
  { q: "What if it does not help me?", a: "Email us within 14 days and we will refund the payment. We only ask that you tell us what was missing, so we can improve the tool." },
  { q: "Is this the same as your Website Checkup service?", a: "No. The tool checks one page at a time and you read the results yourself. The Website Checkup is a service where we crawl every page of your site, a person reviews the findings, and we walk you through them on a call." },
];
const rows: [string, string, string][] = [
  ["Checks per page", `First ${freeChecks} results`, "All 94 results"],
  ["What we found on your page", `${freeChecks} checks`, "Every check"],
  ["How to fix each problem", `${freeChecks} checks`, "Every check"],
  ["Why each check matters", `${freeChecks} checks`, "Every check"],
  ["Fix-these-first priorities", "Names only", "Full details"],
  ["Pages you can check", "Unlimited", "Unlimited"],
  ["Checks per minute", "6", "30"],
  ["Saved audit history", "No", "Yes"],
  ["Score tracked over time", "No", "Yes"],
  ["One to-do list across your sites", "No", "Yes"],
  ["Printable report", "No", "Yes"],
  ["Future checks", "", "Included"],
];

export default function Pricing() {
  const crumbs = [{ name: "Pricing", href: "/pricing" }];
  const buy = checkoutUrl || `mailto:${site.email}?subject=${encodeURIComponent("Lifetime access to the SEO Checklist Checker")}&body=${encodeURIComponent("Hi, I would like to buy lifetime access ($67). Please send me payment details.\n\nName:\nWebsite:\n")}`;
  return (
    <>
      <PageHero eyebrow="Pricing" crumbs={crumbs} title={<>Free to start. <span className="hl">${price} once</span> for everything.</>} lede="No subscription, no seats to count, no upsell inside the tool. Check a page free, and pay once if you want the full picture." />
      <section className="band">
        <div className="wrap grid gap-6 lg:grid-cols-2">
          <Reveal>
            <div className="card flex h-full flex-col p-8">
              <p className="eyebrow">Free</p>
              <p className="mt-3 font-[family-name:var(--font-display)] text-[48px] font-bold leading-none">$0</p>
              <p className="mt-2 text-muted">No signup. No card.</p>
              <ul className="mt-6 flex-1 space-y-3 text-[16px]">
                {[`The first ${freeChecks} results in full`, "Your score out of 100", "How many problems were found in each group", "The names of the three things to fix first", "Unlimited pages"].map((t) => (<li key={t} className="flex gap-3"><span aria-hidden className="mt-[10px] h-1.5 w-1.5 shrink-0 rounded-full bg-link" />{t}</li>))}
              </ul>
              <Link href="/tools/seo-checklist" className="btn btn-ghost mt-8">Check a page free <span aria-hidden>→</span></Link>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div className="card flex h-full flex-col border-mark p-8">
              <p className="eyebrow">Lifetime access</p>
              <p className="mt-3 font-[family-name:var(--font-display)] text-[48px] font-bold leading-none">${price}</p>
              <p className="mt-2 text-muted">One payment. Yours forever.</p>
              <ul className="mt-6 flex-1 space-y-3 text-[16px]">
                {["All 94 results, with what we found on your page", "A plain-English fix for every problem", "Why each check matters, so you can decide what to skip", "Full details on what to fix first", "A dashboard that saves every audit and tracks your score",
                "One ordered to-do list across all your websites",
                "Printable report to hand to a developer", "30 checks a minute", "Every new check we add, at no extra cost"].map((t) => (<li key={t} className="flex gap-3"><span aria-hidden className="mt-[10px] h-1.5 w-1.5 shrink-0 rounded-full bg-mark" />{t}</li>))}
              </ul>
              <a href={buy} className="btn btn-primary mt-8">{checkoutUrl ? "Get lifetime access" : "Email to buy"} <span aria-hidden>→</span></a>
              <p className="mt-3 text-center text-[13.5px] text-muted">14-day refund if it does not help you.</p>
            </div>
          </Reveal>
        </div>
        <Reveal className="wrap mt-14">
          <div className="table-wrap prose !max-w-none">
            <table><caption className="sr-only">Free compared with lifetime access</caption><thead><tr><th scope="col">What you get</th><th scope="col">Free</th><th scope="col">Lifetime</th></tr></thead>
              <tbody>{rows.map(([k, a, b]) => (<tr key={k}><th scope="row" className="!bg-transparent !font-sans !text-[15px] !normal-case !tracking-normal !text-text">{k}</th><td>{a || "—"}</td><td className="text-text">{b}</td></tr>))}</tbody></table>
          </div>
        </Reveal>
      </section>
      <section className="band band-line">
        <div className="wrap grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <Reveal><p className="eyebrow">FAQ</p><h2 className="h-lg mt-5">Questions about pricing</h2><p className="mt-6 text-muted">Want the whole site checked and explained by a person instead? See the <Link className="text-link underline underline-offset-4 hover:text-mark" href="/services/ai-seo-audit">Website Checkup</Link>.</p></Reveal>
          <Reveal delay={100}><Faq items={faqs} /></Reveal>
        </div>
      </section>
      {checkoutUrl && <JsonLd data={{ "@context": "https://schema.org", "@type": "Product", name: "SEO Checklist Checker, lifetime access", description: metadata.description, brand: { "@id": abs("/#org") }, offers: { "@type": "Offer", price: String(price), priceCurrency: site.checklist.currency, url: abs("/pricing"), availability: "https://schema.org/InStock" } }} />}
      <JsonLd data={crumbLd(crumbs)} />
      <JsonLd data={faqLd(faqs)} />
    </>
  );
}

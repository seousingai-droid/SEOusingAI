import Link from "next/link";
import PageHero, { crumbLd } from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import Faq, { faqLd } from "@/components/Faq";
import JsonLd from "@/components/JsonLd";
import { pageMeta } from "@/lib/meta";
import { site, abs } from "@/lib/site";
import { PLANS, PAID } from "@/lib/plans";

export const metadata = pageMeta({
  title: "Pricing: Free Check, or a Full Site Audit From $39",
  description: "Check one page free. From $39, audit every page of your website against 94 checks, with a plain-English fix for every problem. One payment, no subscription.",
  path: "/pricing",
  absolute: true,
});

const faqs = [
  { q: "Is this a subscription?", a: "No. Every plan is a single payment for lifetime access, including every check we add in future." },
  { q: "Why is the number of websites limited?", a: "A full audit reads every page of a site, which costs us real money each time. Charging by website is what keeps this a one-off payment instead of a monthly fee. Every plan audits its websites in full, as often as you like." },
  { q: "What counts as one website?", a: "One domain. Every page on it is audited, and you can re-audit as often as you like at no extra cost. A subdomain such as shop.yoursite.com counts as a separate website." },
  { q: "Can I change which website I audit?", a: "Your plan registers a website the first time you audit it. If you need to swap one, email us and we will reset it." },
  { q: "What do I get after paying?", a: "A licence key by email. Paste it into the tool once and your account is upgraded. The key works on any device." },
  { q: "What if it does not help me?", a: "Email us within 14 days and we will refund you. We only ask what was missing, so we can improve the tool." },
  { q: "Is this the same as your Website Checkup service?", a: "No. These plans give you the tool and you read the results yourself. The Website Checkup is a service where a person reviews the findings and walks you through them on a call." },
];

const rows: [string, string, string, string, string][] = [
  ["Websites", "1", "1", "3", "10"],
  ["Pages audited each time", "1", "Every page", "Every page", "Every page"],
  ["Checks on every page", "94", "94", "94", "94"],
  ["Results you can see", "5", "All", "All", "All"],
  ["Plain-English fix for each", "First 5", "Yes", "Yes", "Yes"],
  ["Which pages are affected", "—", "Yes", "Yes", "Yes"],
  ["Saved history and to-do list", "—", "Yes", "Yes", "Yes"],
  ["Printable report", "—", "Yes", "Yes", "Yes"],
  ["Future checks included", "Yes", "Yes", "Yes", "Yes"],
];

export default function Pricing() {
  const crumbs = [{ name: "Pricing", href: "/pricing" }];
  // Each plan gets its own checkout link. Until one is set, the button opens an
  // email so nobody who wants to buy is left with nowhere to go.
  const buy = (name: string, price: number, url?: string) =>
    url || `mailto:${site.email}?subject=${encodeURIComponent(`${name} plan ($${price})`)}&body=${encodeURIComponent(`Hi, I would like the ${name} plan ($${price}). Please send me payment details.\n\nName:\nWebsite:\n`)}`;

  return (
    <>
      <PageHero eyebrow="Pricing" crumbs={crumbs}
        title={<>Check one page free. <span className="hl">Audit the whole site</span> from $39.</>}
        lede="One payment, not a subscription. Every paid plan audits every page it can reach. The only difference is how many websites you can audit." />

      <section className="band">
        <div className="wrap grid gap-5 lg:grid-cols-4">
          {(["free", ...PAID] as const).map((id, i) => {
            const p = PLANS[id];
            const best = id === "standard";
            return (
              <Reveal key={id} delay={i * 90}>
                <div className={`card flex h-full flex-col p-7 ${best ? "border-mark" : ""}`}>
                  {best && <p className="mb-3 w-fit rounded-full bg-mark px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-wider text-ink">Most useful</p>}
                  <p className="eyebrow">{p.name}</p>
                  <p className="mt-3 font-[family-name:var(--font-display)] text-[40px] font-bold leading-none">{p.price ? `$${p.price}` : "Free"}</p>
                  <p className="mt-2 text-[14.5px] text-muted">{p.price ? "once, forever" : "no card needed"}</p>
                  <p className="mt-5 text-[15.5px]">{p.blurb}</p>
                  <ul className="mt-5 flex-1 space-y-2.5 border-t border-line pt-5 text-[15px]">
                    {p.includes.map((t) => (
                      <li key={t} className="flex gap-2.5"><span aria-hidden className={`mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full ${p.price ? "bg-mark" : "bg-link"}`} />{t}</li>
                    ))}
                  </ul>
                  <p className="mt-5 font-mono text-[12px] uppercase tracking-widest text-muted">Best for</p>
                  <p className="mt-1 text-[14.5px] text-muted">{p.best}</p>
                  {p.price
                    ? <a href={buy(p.name, p.price, p.checkoutUrl)} className={`btn mt-6 ${best ? "btn-primary" : "btn-ghost"}`}>Get {p.name}</a>
                    : <Link href="/tools/seo-checklist" className="btn btn-ghost mt-6">Check a page free</Link>}
                </div>
              </Reveal>
            );
          })}
        </div>

        <Reveal className="wrap mt-14">
          <div className="table-wrap prose !max-w-none">
            <table>
              <caption className="sr-only">What each plan includes</caption>
              <thead><tr><th scope="col">What you get</th><th scope="col">Free</th><th scope="col">Basic</th><th scope="col">Standard</th><th scope="col">Premium</th></tr></thead>
              <tbody>{rows.map(([k, ...cells]) => (
                <tr key={k}>
                  <th scope="row" className="!bg-transparent !font-sans !text-[15px] !normal-case !tracking-normal !text-text">{k}</th>
                  {cells.map((c, i) => <td key={i} className={c === "—" ? "text-muted" : ""}>{c}</td>)}
                </tr>))}</tbody>
            </table>
          </div>
          <p className="mt-5 max-w-2xl text-[15px] text-muted">A full audit reads every page it can find, from your sitemap or by following your own links, then groups the problems so you see &ldquo;12 pages have no description&rdquo; rather than the same problem twelve times. Very large sites are read in batches: the report always says how many pages it reached.</p>
        </Reveal>
      </section>

      <section className="band band-line">
        <div className="wrap grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <Reveal>
            <p className="eyebrow">FAQ</p>
            <h2 className="h-lg mt-5">Questions about pricing</h2>
            <p className="mt-6 text-muted">Want the whole thing done for you instead? See the <Link className="text-link underline underline-offset-4 hover:text-mark" href="/services/ai-seo-audit">Website Checkup</Link>.</p>
          </Reveal>
          <Reveal delay={100}><Faq items={faqs} /></Reveal>
        </div>
      </section>

      {PAID.filter((id) => PLANS[id].checkoutUrl).map((id) => (
        <JsonLd key={id} data={{ "@context": "https://schema.org", "@type": "Product", name: `SEO Checklist Checker, ${PLANS[id].name} plan`, description: PLANS[id].blurb, brand: { "@id": abs("/#org") }, offers: { "@type": "Offer", price: String(PLANS[id].price), priceCurrency: site.checklist.currency, url: abs("/pricing"), availability: "https://schema.org/InStock" } }} />
      ))}
      <JsonLd data={crumbLd(crumbs)} />
      <JsonLd data={faqLd(faqs)} />
    </>
  );
}

import { pageMeta } from "@/lib/meta";
import Link from "next/link";
import PageHero, { crumbLd } from "@/components/PageHero";
import JsonLd from "@/components/JsonLd";
import { abs } from "@/lib/site";

export const metadata = pageMeta({
  title: "AI SEO Glossary: Plain-English Definitions",
  description: "An AI SEO glossary in plain English. Short definitions of SEO, GEO, AI Overviews, schema, backlinks, NLP, E-E-A-T, llms.txt, and more.",
  path: "/glossary",
});

const terms: [string, string, string?][] = [
  ["AI Overview", "An AI Overview is the AI-written summary Google shows at the top of some search results. It answers the question directly and links to a few source websites.", "/guides/generative-engine-optimization"],
  ["AI SEO", "AI SEO means two things: using AI tools to do search engine optimization work faster, and optimizing a website so AI tools such as ChatGPT mention it. Most businesses now need both.", "/guides/how-to-use-ai-for-seo"],
  ["AI SEO agent", "An AI SEO agent is an AI system that completes a whole SEO task from one instruction, such as checking a website and writing a fix list, instead of answering one question at a time.", "/guides/can-ai-do-seo"],
  ["Backlink", "A backlink is a link from another website to yours. Search engines treat links from trusted, relevant websites as votes of confidence.", "/services/link-building"],
  ["Content brief", "A content brief is a one-page plan for an article: the search it targets, what the searcher wants, the headings, the facts to include, and what makes the page different.", "/guides/how-to-write-seo-content-with-ai"],
  ["Core Web Vitals", "Core Web Vitals are three measurements Google uses for page experience: how fast the main content loads, how quickly the page reacts to a tap, and whether the layout jumps around while loading.", "/services/technical-seo"],
  ["Crawling", "Crawling is how search engines and AI tools discover pages. A program called a crawler follows links from page to page and reads what it finds."],
  ["E-E-A-T", "E-E-A-T stands for experience, expertise, authoritativeness, and trust. It is the framework in Google's quality guidelines for judging whether content comes from a credible source."],
  ["Generative engine optimization (GEO)", "Generative engine optimization is the practice of making content easy for AI answer engines to find, quote, and cite. It is also called AI search optimization or answer engine optimization.", "/guides/generative-engine-optimization"],
  ["Google Business Profile", "A Google Business Profile is the free listing that shows your business on Google Maps and in local results, with your hours, phone number, photos, and reviews.", "/services/local-seo"],
  ["Indexing", "Indexing is when a search engine stores a page in its database so it can appear in results. A page that is not indexed cannot rank."],
  ["Keyword", "A keyword is the word or phrase someone types or says into a search engine. Good SEO targets the phrases real customers use, not industry jargon.", "/guides/ai-keyword-research"],
  ["llms.txt", "llms.txt is a simple text file placed on a website to describe the site and list its key pages for AI systems. Support for it is still uneven.", "/tools/llms-txt-generator"],
  ["Local SEO", "Local SEO is the work of helping a business appear when people nearby search for what it offers, especially on Google Maps.", "/services/local-seo"],
  ["Map pack", "The map pack is the box with a map and three local businesses that Google shows at the top of local searches."],
  ["Meta description", "A meta description is the short summary shown under a page's title in search results. It does not directly affect ranking, but a clear one earns more clicks.", "/tools/serp-preview"],
  ["NLP (natural language processing)", "Natural language processing is the branch of AI that lets computers understand human language. Search engines use it to work out what a page is about and what a searcher means, which is why clear writing beats keyword stuffing."],
  ["Organic traffic", "Organic traffic is the visitors who reach your website from unpaid search results, as opposed to ads."],
  ["Schema markup", "Schema markup is a small piece of code that labels the facts on a page, such as your business name, address, prices, or FAQs, in a format search engines and AI tools can read reliably.", "/services/technical-seo"],
  ["Search intent", "Search intent is what the searcher actually wants: to learn something, compare options, buy, or find a specific website. Pages rank when they match it."],
  ["SEO (search engine optimization)", "Search engine optimization is the work of improving a website so it appears higher in unpaid search results and brings in more of the right visitors."],
  ["SERP", "SERP stands for search engine results page. It is the page you see after searching, including ads, AI summaries, maps, and the list of websites."],
  ["Technical SEO", "Technical SEO is the work of making a website easy for search engines to find, read, and trust, covering speed, errors, links, mobile layout, and the code behind each page.", "/services/technical-seo"],
  ["Title tag", "A title tag is the headline of a page shown in search results and browser tabs. It is one of the strongest on-page signals for what the page is about.", "/tools/serp-preview"],
  ["Zero-click search", "A zero-click search is a search that ends without the person visiting any website, usually because the answer appeared on the results page itself."],
];

const slug = (t: string) => t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export default function Glossary() {
  const crumbs = [{ name: "Glossary", href: "/glossary" }];
  return (
    <>
      <PageHero eyebrow="Glossary" crumbs={crumbs} title={<>AI SEO words, explained in <span className="hl">plain English</span></>} lede="Marketing is full of jargon. Here is what the terms on this site mean, in a sentence or two each." />
      <section className="band">
        <div className="wrap">
          <nav aria-label="Terms" className="mb-12 flex flex-wrap gap-2">{terms.map(([t]) => <a key={t} href={`#${slug(t)}`} className="rounded-full border border-line bg-panel px-3.5 py-1.5 text-[14px] text-muted hover:border-mark hover:text-text">{t}</a>)}</nav>
          <dl className="grid gap-5 md:grid-cols-2">
            {terms.map(([t, d, href]) => (
              <div key={t} id={slug(t)} className="card scroll-mt-28 p-7">
                <dt className="font-[family-name:var(--font-display)] text-[22px] font-bold">{t}</dt>
                <dd className="mt-3 text-[16.5px] text-[#cfd6ec]">{d}{href && <> <Link className="whitespace-nowrap text-link underline underline-offset-4 hover:text-mark" href={href}>Learn more</Link></>}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
      <JsonLd data={{ "@context": "https://schema.org", "@type": "DefinedTermSet", "@id": abs("/glossary#terms"), name: "AI SEO Glossary", url: abs("/glossary"), hasDefinedTerm: terms.map(([t, d]) => ({ "@type": "DefinedTerm", name: t, description: d, url: abs(`/glossary#${slug(t)}`), inDefinedTermSet: abs("/glossary#terms") })) }} />
      <JsonLd data={crumbLd(crumbs)} />
    </>
  );
}

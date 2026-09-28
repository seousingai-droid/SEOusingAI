import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { crumbLd } from "@/components/PageHero";
import Faq, { faqLd } from "@/components/Faq";
import JsonLd from "@/components/JsonLd";
import ReelPlayer from "@/components/ReelPlayer";
import { seoTips, getSeoTip, videoSrc, posterSrc } from "@/lib/seoTips";
import { site, abs } from "@/lib/site";
import { pageMeta } from "@/lib/meta";

export const dynamicParams = false;
export const generateStaticParams = () => seoTips.map((t) => ({ slug: t.slug }));

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const t = getSeoTip((await params).slug);
  if (!t) return {};
  return pageMeta({ title: t.metaTitle, description: t.description, path: `/seo-tips/${t.slug}`, type: "article", published: t.uploaded, modified: t.uploaded });
}

const longDate = (iso: string) => new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

export default async function SeoTip({ params }: { params: Promise<{ slug: string }> }) {
  const t = getSeoTip((await params).slug);
  if (!t) notFound();
  const crumbs = [{ name: "SEO tips", href: "/seo-tips" }, { name: t.title, href: `/seo-tips/${t.slug}` }];
  const more = seoTips.filter((x) => x.slug !== t.slug).slice(0, 3);
  const url = abs(`/seo-tips/${t.slug}`);
  return (
    <>
      <article>
        <header className="border-b border-line">
          <div className="wrap pb-12 pt-12 lg:pt-16">
            <nav aria-label="Breadcrumb" className="mb-8 font-mono text-[12.5px] text-muted">
              <ol className="flex flex-wrap gap-2">
                <li><Link className="hover:text-text" href="/">Home</Link></li>
                <li className="flex gap-2"><span aria-hidden>/</span><Link className="hover:text-text" href="/seo-tips">SEO tips</Link></li>
              </ol>
            </nav>
            <p className="eyebrow">SEO tip · {t.level}</p>
            <h1 className="h-lg mt-5 max-w-4xl !text-[clamp(32px,4.4vw,54px)]">{t.title}</h1>
            <p className="mt-5 text-[14.5px] text-muted">
              By the <Link className="underline underline-offset-4 hover:text-text" href="/editorial-standards">{site.editorial.name}</Link> · <time dateTime={t.uploaded}>{longDate(t.uploaded)}</time> · {t.seconds}-second video
            </p>
          </div>
        </header>

        <div className="wrap grid gap-12 py-14 lg:grid-cols-[1fr_340px] lg:py-20">
          <div className="min-w-0 max-w-[760px]">
            <section aria-labelledby="quick-answer" className="card border-mark/50 p-7">
              <p id="quick-answer" className="eyebrow">Quick answer</p>
              <p className="mt-4 text-[19px] leading-relaxed text-text">{t.answer}</p>
            </section>

            {t.steps.map((s, i) => (
              <section key={s.h} className="mt-12">
                <h2 className="text-[clamp(24px,2.6vw,32px)] font-bold leading-tight">
                  <span className="text-gold">Step {i + 1}.</span> {s.h}
                </h2>
                <p className="mt-4 text-[17.5px] leading-relaxed">{s.p}</p>
              </section>
            ))}

            <section className="mt-12">
              <h2 className="text-[clamp(24px,2.6vw,32px)] font-bold leading-tight">Why it works</h2>
              <p className="mt-4 text-[17.5px] leading-relaxed">{t.why}</p>
            </section>

            <section className="mt-12">
              <h2 className="text-[clamp(24px,2.6vw,32px)] font-bold leading-tight">Common mistakes</h2>
              <ul className="mt-5 space-y-3">
                {t.mistakes.map((m) => (
                  <li key={m} className="flex gap-3 text-[17px]"><span aria-hidden className="mt-[10px] h-2 w-2 shrink-0 rounded-full bg-red-400" />{m}</li>
                ))}
              </ul>
            </section>

            <section className="mt-12">
              <h2 className="text-[clamp(24px,2.6vw,32px)] font-bold leading-tight">Questions</h2>
              <div className="mt-6"><Faq items={t.faqs} /></div>
            </section>

            <section className="mt-12">
              <h2 className="text-[clamp(22px,2.2vw,28px)] font-bold leading-tight">Video transcript</h2>
              <div className="mt-4 space-y-2 border-l-2 border-line pl-5 text-[16px] text-muted">
                {t.transcript.map((line) => <p key={line}>{line}</p>)}
              </div>
            </section>
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="card p-5">
              <p className="eyebrow">Watch the tip</p>
              <ReelPlayer src={videoSrc(t.slug)} poster={posterSrc(t.slug)} label={`${t.title}, animated video`} />
            </div>
            <div className="card mt-5 p-6">
              <p className="eyebrow">Want it done for you?</p>
              <p className="mt-3 text-[16px]">We do this every month as part of <Link className="font-semibold text-link underline underline-offset-4 hover:text-gold" href={t.service.href}>{t.service.label}</Link>.</p>
              <Link href="/book-a-call" className="btn btn-primary mt-5 w-full">Book a free call</Link>
            </div>
          </aside>
        </div>
      </article>

      <section className="band band-line">
        <div className="wrap">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <h2 className="h-lg !text-[clamp(26px,3vw,38px)]">More SEO tips</h2>
            <Link href="/seo-tips" className="btn btn-ghost">All tips</Link>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {more.map((m) => (
              <Link key={m.slug} href={`/seo-tips/${m.slug}`} className="card card-hover group flex gap-5 overflow-hidden p-4">
                <Image src={posterSrc(m.slug)} alt="" width={540} height={960} sizes="96px" className="h-[150px] w-[96px] shrink-0 rounded-lg object-cover object-top" />
                <div className="py-1">
                  <p className="eyebrow">{m.level}</p>
                  <h3 className="mt-2 text-[17px] font-bold leading-snug group-hover:text-gold">{m.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "VideoObject",
          name: t.title,
          description: t.description,
          thumbnailUrl: abs(posterSrc(t.slug)),
          uploadDate: `${t.uploaded}T08:00:00+08:00`,
          duration: `PT${t.seconds}S`,
          contentUrl: abs(videoSrc(t.slug)),
          transcript: t.transcript.join(" "),
          inLanguage: "en-US",
          publisher: { "@id": abs("/#org") },
          mainEntityOfPage: url,
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: t.title,
          description: t.description,
          url,
          datePublished: t.uploaded,
          dateModified: t.uploaded,
          image: abs(posterSrc(t.slug)),
          author: { "@type": "Organization", name: site.editorial.name, url: site.editorial.url },
          publisher: { "@id": abs("/#org") },
        }}
      />
      <JsonLd data={faqLd(t.faqs)} />
      <JsonLd data={crumbLd(crumbs)} />
    </>
  );
}

import Link from "next/link";
import Image from "next/image";
import PageHero, { crumbLd } from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import JsonLd from "@/components/JsonLd";
import { seoTips, posterSrc } from "@/lib/seoTips";
import { abs } from "@/lib/site";
import { pageMeta } from "@/lib/meta";

export const metadata = pageMeta({
  title: "SEO Tips: Short Videos, Full Guides",
  description: "Short animated SEO tips from SEO Using AI, each with the full method written out: Search Console wins, AI traffic in GA4, titles, Maps and AI search.",
  path: "/seo-tips",
});

const levels = ["Advanced", "Intermediate", "Beginner"] as const;

export default function SeoTips() {
  const crumbs = [{ name: "SEO tips", href: "/seo-tips" }];
  return (
    <>
      <PageHero
        eyebrow="SEO tips"
        crumbs={crumbs}
        title={<>SEO tips you can <span className="hl">use this week</span></>}
        lede="Each tip is a 20-second video plus the full method written out: where to click, what to change, and the mistakes to avoid."
      />
      <section className="band">
        <div className="wrap">
          {levels.map((level) => {
            const tips = seoTips.filter((t) => t.level === level);
            if (!tips.length) return null;
            return (
              <div key={level} className="mb-14 last:mb-0">
                <p className="eyebrow">{level}</p>
                <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                  {tips.map((t, i) => (
                    <Reveal key={t.slug} delay={(i % 4) * 80}>
                      <Link href={`/seo-tips/${t.slug}`} className="card card-hover group flex h-full flex-col overflow-hidden">
                        <div className="relative overflow-hidden border-b border-line">
                          <Image src={posterSrc(t.slug)} alt="" width={540} height={960} sizes="(min-width: 1024px) 280px, (min-width: 640px) 50vw, 100vw" className="aspect-[4/5] w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]" />
                          <span className="absolute bottom-3 left-3 rounded-full bg-canvas/85 px-3 py-1 font-mono text-[12px] text-text">▶ {t.seconds}s</span>
                        </div>
                        <div className="flex flex-1 flex-col p-6">
                          <h2 className="text-[19px] font-bold leading-snug group-hover:text-gold">{t.title}</h2>
                          <p className="mt-2 text-[14.5px] text-muted">{t.description}</p>
                        </div>
                      </Link>
                    </Reveal>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "SEO tips",
          itemListElement: seoTips.map((t, i) => ({ "@type": "ListItem", position: i + 1, url: abs(`/seo-tips/${t.slug}`), name: t.title })),
        }}
      />
      <JsonLd data={crumbLd(crumbs)} />
    </>
  );
}

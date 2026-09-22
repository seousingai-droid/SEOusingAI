import { pageMeta } from "@/lib/meta";
import Link from "next/link";
import PageHero, { crumbLd } from "@/components/PageHero";
import JsonLd from "@/components/JsonLd";
import { tools } from "@/lib/site";

export const metadata = pageMeta({
  title: "Free AI SEO Tools, No Signup",
  description: "Free AI SEO tools: a checklist that audits your website, a Google snippet preview, an AI SEO prompt builder, and an llms.txt generator.",
  path: "/tools",
});

export default function Tools() {
  const crumbs = [{ name: "Free tools", href: "/tools" }];
  return (
    <>
      <PageHero eyebrow="Free tools" crumbs={crumbs} title={<>Free AI SEO tools that <span className="hl">do the work</span></>} lede="Small, fast tools for the jobs you do every week. Three run entirely in your browser. The website checker asks for a free account so it can save your audits." />
      <section className="band">
        <div className="wrap grid gap-5 md:grid-cols-2">
          {tools.map((t) => (
            <Link key={t.slug} href={`/tools/${t.slug}`} className="card card-hover p-8">
              <h2 className="text-[24px] font-bold">{t.name}</h2>
              <p className="mt-3 text-muted">{t.blurb}</p>
              <p className="mt-6 font-mono text-[13px] text-mark">Open tool →</p>
            </Link>
          ))}
        </div>
      </section>
      <JsonLd data={crumbLd(crumbs)} />
    </>
  );
}

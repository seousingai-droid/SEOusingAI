import type { Metadata } from "next";
import Link from "next/link";
import PageHero, { crumbLd } from "@/components/PageHero";
import JsonLd from "@/components/JsonLd";
import { tools } from "@/lib/site";

export const metadata: Metadata = {
  title: "Free AI SEO Tools, No Signup",
  description: "Free AI SEO tools: SERP snippet preview, AI SEO prompt builder, and llms.txt generator. No signup. Everything runs in your browser.",
  alternates: { canonical: "/tools" },
};

export default function Tools() {
  const crumbs = [{ name: "Free tools", href: "/tools" }];
  return (
    <>
      <PageHero eyebrow="Free tools" crumbs={crumbs} title={<>Free AI SEO tools. <span className="hl">No signup.</span></>} lede="Small, fast tools for the jobs you do every week. They run in your browser, so nothing you type leaves your device." />
      <section className="band">
        <div className="wrap grid gap-5 md:grid-cols-3">
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

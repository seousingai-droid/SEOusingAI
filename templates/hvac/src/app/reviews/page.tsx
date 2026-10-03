import type { Metadata } from "next";
import PageIntro from "@/components/PageIntro";
import { CtaBand } from "@/components/site";
import { reviews } from "@/data/hvac";
import { business } from "@/data/business";

export const metadata: Metadata = {
  title: `Reviews of ${business.name}`,
  description: `What homeowners across the ${business.metro} say about AC repair, installation and maintenance from ${business.short}.`,
  alternates: { canonical: "/reviews" },
};

export default function Reviews() {
  return (
    <>
      <PageIntro crumbs={[{ name: "Reviews", href: "/reviews" }]} eyebrow="Reviews" title="What homeowners say"
        answer="Homeowners across the Phoenix metro mention the same three things: we arrive fast, the price matches the written quote, and the work area is left clean. Reviews are grouped by service below; on a live site they come from the company's Google Business Profile." />
      <section className="wrap columns-1 gap-5 py-16 md:columns-2 lg:columns-3">
        {reviews.map((r) => (
          <figure key={r.name} className="mb-5 break-inside-avoid rounded-lg border border-line bg-white p-6">
            <p className="label text-[0.62rem] text-copper">{r.service}</p>
            <blockquote className="mt-3 text-[1.05rem]">“{r.text}”</blockquote>
            <figcaption className="mt-5 text-[0.9rem]"><span className="font-bold">{r.name}</span><span className="text-muted"> · {r.area}</span></figcaption>
          </figure>
        ))}
      </section>
      <p className="wrap label -mt-8 pb-12 text-[0.62rem] text-muted">Sample reviews for the demo.</p>
      <CtaBand />
    </>
  );
}

import Link from "next/link";
import Image from "next/image";
import type { CaseStudy } from "@/lib/caseStudies";

export default function CaseStudyCard({ c }: { c: CaseStudy }) {
  const m = c.metrics[0];
  return (
    <Link href={`/case-studies/${c.slug}`} className="card card-hover flex h-full flex-col overflow-hidden">
      {c.screenshots[0] && <Image src={c.screenshots[0].file} alt={c.screenshots[0].alt} width={1600} height={900} sizes="(min-width: 1024px) 380px, 100vw" className="aspect-video w-full border-b border-line object-cover object-top" />}
      <div className="flex flex-1 flex-col p-7">
        <p className="eyebrow">{c.industry}{c.location ? ` · ${c.location}` : ""}</p>
        <h3 className="mt-3 text-[21px] font-bold leading-tight">{c.headline}</h3>
        {m && <p className="mt-4 text-[15px] text-muted"><span className="font-[family-name:var(--font-display)] text-[26px] font-bold text-mark">{m.after}</span><br />{m.label}, from {m.before}</p>}
        <p className="mt-auto pt-5 font-mono text-[13px] text-muted">{c.period} <span className="text-mark">→</span></p>
      </div>
    </Link>
  );
}

import Link from "next/link";
import Reveal from "./Reveal";
import ReelPlayer from "./ReelPlayer";
import { bundles, bothBundles, offers } from "@/lib/site";

const Tick = () => <span aria-hidden className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-mark" />;

/** A reel from our own channel, so visitors see exactly what the social bundle makes. */
export function SampleReel() {
  return (
    <figure className="card flex h-full flex-col p-5">
      <p className="eyebrow">Sample AI reel</p>
      <ReelPlayer
        src="/videos/tips/more-calls.mp4"
        poster="/videos/tips/more-calls.webp"
        label="Sample AI reel: a stick-man animation explaining how to turn website visits into calls"
      />
      <figcaption className="mt-4 text-[14.5px] text-muted">From our own channel. Yours explains your business, in your colors. <Link className="text-link underline underline-offset-4 hover:text-gold" href="/seo-tips">See more</Link></figcaption>
    </figure>
  );
}

/** The two bundles, the sample reel, and the price for taking both. */
export default function Bundles() {
  return (
    <>
      <div className="grid gap-5 lg:grid-cols-[1fr_1fr_300px]">
        {bundles.map((b, i) => (
          <Reveal key={b.id} delay={i * 100}>
            <article id={`bundle-${b.id}`} className="card flex h-full scroll-mt-24 flex-col p-7 sm:p-8">
              <p className="eyebrow">Bundle</p>
              <h3 className="mt-3 text-[26px] font-bold leading-tight">{b.name}</h3>
              <p className="mt-2 text-[17px] font-medium">{b.short}</p>
              <p className="mt-5 flex items-baseline gap-2">
                <span className="font-[family-name:var(--font-display)] text-[38px] font-bold leading-none">{b.price}</span>
                <span className="font-mono text-[12px] uppercase tracking-widest text-muted">{b.unit}</span>
              </p>
              <p className="mt-4 text-[15.5px] text-muted">{b.plain}</p>
              <ul className="mt-6 flex-1 space-y-2.5 border-t border-line pt-6 text-[15.5px]">
                {b.get.map((g) => <li key={g} className="flex gap-2.5"><Tick />{g}</li>)}
              </ul>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link href="/book-a-call" className="btn btn-primary">Book a free call <span aria-hidden>→</span></Link>
                <Link href={b.href} className="btn btn-ghost">Full details</Link>
              </div>
            </article>
          </Reveal>
        ))}
        <Reveal delay={200}><SampleReel /></Reveal>
      </div>
      <Reveal className="mt-5">
        <div className="card flex flex-wrap items-center justify-between gap-5 border-mark/50 px-7 py-6">
          <p className="text-[17px]">
            <strong>Want both?</strong> Website + SEO and Social + AI Reels together:{" "}
            <strong className="text-gold">{bothBundles.price} {bothBundles.unit}</strong>. You save {bothBundles.saves} a month.
          </p>
          <p className="text-[15px] text-muted">Month to month. Stop whenever you like.</p>
        </div>
      </Reveal>
    </>
  );
}

/** Single services as a compact price list, for when you only need one thing. */
export function ServiceList() {
  return (
    <ul className="divide-y divide-line border-y border-line">
      {offers.map((o) => (
        <li key={o.id}>
          <Link href={o.href} className="group grid gap-1 py-5 sm:grid-cols-[1fr_auto] sm:items-baseline sm:gap-8">
            <span>
              <span className="font-[family-name:var(--font-display)] text-[20px] font-semibold group-hover:text-gold">{o.name}</span>
              <span className="block text-[15px] text-muted">{o.plain}</span>
            </span>
            <span className="whitespace-nowrap font-[family-name:var(--font-display)] text-[18px] font-semibold">
              {o.price} <span className="font-mono text-[11.5px] font-normal uppercase tracking-widest text-muted">{o.unit}</span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

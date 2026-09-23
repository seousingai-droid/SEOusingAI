"use client";
import Link from "next/link";
import { useState } from "react";
import { offers } from "@/lib/site";

// All offers are rendered in the HTML. Picking a need only changes which one is shown.
export default function OfferPicker() {
  const [active, setActive] = useState(0);
  return (
    <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
      <div role="tablist" aria-label="What do you need?" aria-orientation="vertical" className="flex flex-col gap-2.5">
        {offers.map((o, i) => {
          const on = i === active;
          return (
            <button key={o.id} role="tab" id={`offer-t-${o.id}`} aria-selected={on} aria-controls={`offer-p-${o.id}`} onClick={() => {
                setActive(i);
                // On phones the answer sits below the list, so bring it into view.
                if (window.matchMedia("(max-width: 1023px)").matches) requestAnimationFrame(() => document.getElementById(`offer-p-${o.id}`)?.scrollIntoView({ behavior: "smooth", block: "nearest" }));
              }}
              className={`flex items-center justify-between gap-4 rounded-2xl border px-5 py-4 text-left text-[17px] font-medium transition-all ${on ? "border-mark bg-mark text-ink" : "border-line bg-panel text-text hover:border-muted"}`}>
              <span>&ldquo;{o.need}&rdquo;</span>
              <span aria-hidden className={`transition-transform ${on ? "translate-x-1" : "opacity-40"}`}>→</span>
            </button>
          );
        })}
      </div>
      <div>
        {offers.map((o, i) => (
          <div key={o.id} role="tabpanel" id={`offer-p-${o.id}`} aria-labelledby={`offer-t-${o.id}`} hidden={i !== active} className="card offer-panel h-full p-7 sm:p-9">
            <p className="eyebrow">We suggest</p>
            <div className="mt-3 flex flex-wrap items-baseline gap-x-4 gap-y-1">
              <h3 className="text-[clamp(28px,3vw,38px)] font-bold">{o.name}</h3>
              <p className="font-[family-name:var(--font-display)] text-[22px] font-bold text-mark">{o.price} <span className="font-mono text-[11px] font-normal uppercase tracking-widest text-muted">{o.unit}</span></p>
            </div>
            <p className="mt-4 text-[18px] text-muted">{o.plain}</p>
            <p className="mt-7 font-mono text-[12px] uppercase tracking-widest text-muted">What you get</p>
            <ul className="mt-4 space-y-3">
              {o.get.map((g) => (
                <li key={g} className="flex gap-3 text-[16.5px]">
                  <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-mark text-ink"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" aria-hidden><path d="m5 12 5 5 9-10" /></svg></span>
                  {g}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4 border-t border-line pt-7">
              <Link href="/book-a-call" className="btn btn-primary">Book a free call <span aria-hidden>→</span></Link>
              <Link href={o.href} className="btn btn-ghost">How it works</Link>
              <p className="w-full text-[15px] text-muted">A fixed quote in writing after the call. No contracts.</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

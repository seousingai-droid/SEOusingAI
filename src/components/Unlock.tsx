"use client";
import Link from "next/link";
import { useState } from "react";
import { site } from "@/lib/site";
import { PLANS } from "@/lib/plans";

export default function Unlock({ onUnlocked, compact = false }: { onUnlocked: (s: import("./SignIn").Session) => void; compact?: boolean }) {
  const [key, setKey] = useState(""); const [busy, setBusy] = useState(false); const [error, setError] = useState(""); const [open, setOpen] = useState(false);
  const price = PLANS.basic.price;
  const checkoutUrl = PLANS.basic.checkoutUrl;
  const verify = async (e: React.FormEvent) => {
    e.preventDefault(); setBusy(true); setError("");
    try {
      const res = await fetch("/api/auth/key", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ key }) });
      const d = await res.json();
      if (d.ok) onUnlocked(d.session); else setError(d.error ?? "That key is not valid.");
    } catch { setError("Could not check the key. Try again."); } finally { setBusy(false); }
  };
  return (
    <div className={`card border-mark/60 ${compact ? "p-6" : "p-7 sm:p-9"}`}>
      <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr] lg:items-center">
        <div>
          <p className="eyebrow">Full site audit</p>
          <h3 className={`mt-2 font-bold ${compact ? "text-[22px]" : "text-[clamp(24px,2.6vw,32px)]"}`}>Audit the whole site, not just this page</h3>
          <ul className="mt-4 grid gap-2 text-[15.5px] text-muted sm:grid-cols-2">
            {["Every page of your website audited", "All 94 results, with a fix for each", "See exactly which pages are affected", "Saved history and your to-do list", "Printable report for your developer", "One payment. No subscription."].map((t) => (
              <li key={t} className="flex gap-2.5"><span aria-hidden className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-mark" />{t}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-line bg-ink p-6 text-center">
          <p className="font-[family-name:var(--font-display)] text-[48px] font-bold leading-none">${price}</p>
          <p className="mt-1 font-mono text-[12px] uppercase tracking-widest text-muted">once · Basic plan</p>
          {checkoutUrl ? <a href={checkoutUrl} className="btn btn-primary mt-5 w-full">Get the full audit <span aria-hidden>→</span></a> : <Link href="/pricing" className="btn btn-primary mt-5 w-full">See the plans <span aria-hidden>→</span></Link>}
          <button type="button" onClick={() => setOpen((o) => !o)} className="mt-4 text-[14px] text-link underline underline-offset-4 hover:text-mark">Already have a key?</button>
        </div>
      </div>
      {open && (
        <form onSubmit={verify} className="mt-6 flex flex-col gap-3 border-t border-line pt-6 sm:flex-row">
          <label htmlFor="license" className="sr-only">Your license key</label>
          <input id="license" className="field font-mono sm:flex-1" placeholder="SUAI-XXXX-XXXX-XXXX-XXXX-XXXX" value={key} onChange={(e) => setKey(e.target.value)} autoCapitalize="characters" autoCorrect="off" spellCheck={false} />
          <button className="btn btn-ghost shrink-0" disabled={busy || key.length < 20}>{busy ? "Checking…" : "Unlock"}</button>
          {error && <p role="alert" className="text-[14.5px] text-[#ff8589] sm:basis-full">{error}</p>}
        </form>
      )}
    </div>
  );
}

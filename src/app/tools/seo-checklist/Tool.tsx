"use client";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import type { SiteAudit } from "@/lib/crawl";
import AuditReport from "@/components/AuditReport";
import Unlock from "@/components/Unlock";
import SignIn, { type Session } from "@/components/SignIn";
import { saveAudit } from "@/lib/history";
import { site } from "@/lib/site";

const STEPS = [
  "Opening your website",
  "Reading robots.txt and your sitemap",
  "Finding the pages worth checking",
  "Checking every page",
  "Grouping what we found",
  "Writing your report",
];

export default function Tool() {
  const [url, setUrl] = useState(""); const [busy, setBusy] = useState(false); const [step, setStep] = useState(0);
  const [error, setError] = useState(""); const [limit, setLimit] = useState<{ sites: string[]; allowed: number } | null>(null);
  const [audit, setAudit] = useState<SiteAudit | null>(null);
  const [session, setSession] = useState<Session | null>(null); const [ready, setReady] = useState(false);
  const [saved, setSaved] = useState(false); const [pending, setPending] = useState("");
  const top = useRef<HTMLDivElement>(null);

  const run = useCallback(async (target: string) => {
    if (!target.trim()) return;
    setBusy(true); setError(""); setLimit(null); setAudit(null); setStep(0); setSaved(false);
    const tick = setInterval(() => setStep((s) => Math.min(s + 1, STEPS.length - 1)), 2600);
    try {
      const res = await fetch("/api/check", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ url: target }) });
      const data = await res.json();
      if (res.status === 401) { setSession(null); setPending(target); return; }
      if (res.status === 403 && data.limit) { setLimit({ sites: data.sites ?? [], allowed: data.allowed ?? 1 }); setError(data.error); return; }
      if (!res.ok) { setError(data.error ?? "Something went wrong. Please try again."); return; }
      setAudit(data); setSaved(!!saveAudit(data));
      requestAnimationFrame(() => top.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
    } catch { setError("We could not reach the checker. Check your connection and try again."); }
    finally { clearInterval(tick); setBusy(false); }
  }, []);

  useEffect(() => {
    let live = true;
    const id = setTimeout(async () => {
      const q = new URLSearchParams(window.location.search).get("url") ?? "";
      if (!live) return;
      if (q) setUrl(q);
      let found: Session | null = null;
      try { found = (await (await fetch("/api/auth/me")).json()).session ?? null; } catch { /* offline */ }
      if (!live) return;
      setSession(found); setReady(true);
      if (q) { if (found) run(q); else setPending(q); }
    }, 0);
    return () => { live = false; clearTimeout(id); };
  }, [run]);

  const afterSignIn = (s: Session) => { setSession(s); const next = pending || audit?.startUrl || url; setPending(""); if (next) run(next); };
  const onUpgraded = (s: Session) => { setSession(s); if (audit) run(audit.startUrl); };
  const signOut = async () => { await fetch("/api/auth/signout", { method: "POST" }); setSession(null); setAudit(null); };

  const paid = session && session.plan !== "free";

  return (
    <div>
      {!ready ? (
        <div className="card p-7 text-muted">Loading…</div>
      ) : !session ? (
        <SignIn onSignedIn={afterSignIn} website={pending || url} />
      ) : (
        <>
          <form onSubmit={(e) => { e.preventDefault(); run(url); }} className="card flex flex-col gap-3 p-4 sm:flex-row sm:p-3">
            <label htmlFor="site" className="sr-only">Your website address</label>
            <input id="site" className="field !border-0 !bg-transparent text-[18px] sm:flex-1" placeholder="yourwebsite.com" value={url} onChange={(e) => setUrl(e.target.value)} inputMode="url" autoCapitalize="none" autoCorrect="off" spellCheck={false} />
            <button className="btn btn-primary shrink-0 disabled:opacity-60" disabled={busy || !url.trim()}>
              {busy ? "Auditing…" : paid ? "Audit my website" : "Check my website"} {!busy && <span aria-hidden>→</span>}
            </button>
          </form>
          <p className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[14.5px] text-muted">
            <span>
              Signed in as <span className="text-text">{session.email}</span>
              {paid
                ? `, on the ${session.planName} plan: full audits of ${session.siteLimit} ${session.siteLimit === 1 ? "website" : "websites"}.`
                : `. Your free account checks one page and shows ${site.checklist.freeChecks} results.`}
            </span>
            <button type="button" onClick={signOut} className="text-link underline underline-offset-4 hover:text-mark">Sign out</button>
          </p>
          {session.sites && session.sites.length > 0 && (
            <p className="mt-1.5 font-mono text-[12.5px] text-muted">
              Your {session.sites.length === 1 ? "website" : "websites"}: {session.sites.join(", ")}
              {session.siteLimit ? ` (${session.sites.length} of ${session.siteLimit} used)` : ""}
            </p>
          )}
        </>
      )}

      <div aria-live="polite">
        {busy && (
          <div className="card mt-8 p-7">
            <ul className="space-y-3">{STEPS.map((s, i) => (
              <li key={s} className={`flex items-center gap-3 text-[16px] transition-opacity ${i > step ? "opacity-30" : ""}`}>
                <span className={`grid h-6 w-6 place-items-center rounded-full text-[12px] font-bold ${i < step ? "bg-mark text-ink" : i === step ? "spin border-2 border-mark border-t-transparent" : "border border-line"}`}>{i < step ? "✓" : ""}</span>{s}
              </li>))}</ul>
            <p className="mt-5 text-[14px] text-muted">
              {paid ? "A full audit reads every page it can find, and usually takes 20 to 45 seconds. Leave this tab open." : "This usually takes 10 to 20 seconds."}
            </p>
          </div>
        )}
        {error && (
          <div role="alert" className="mt-6 rounded-xl border border-[#e5484d]/50 bg-[#e5484d]/10 px-5 py-4">
            <p className="text-[16px]">{error}</p>
            {limit && <Link href="/pricing" className="btn btn-primary mt-4">See the plans <span aria-hidden>→</span></Link>}
          </div>
        )}
      </div>

      {audit && (
        <div ref={top} className="mt-10 scroll-mt-24">
          <AuditReport
            audit={audit}
            onUpgrade={audit.locked ? <div className="mt-8"><Unlock onUnlocked={onUpgraded} /></div> : undefined}
          />
          {saved && (
            <p className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-1 rounded-xl border border-line bg-panel px-5 py-3.5 text-[15.5px]">
              <span aria-hidden className="text-mark">✓</span> Saved to your dashboard.
              <Link className="text-link underline underline-offset-4 hover:text-mark" href="/dashboard">See your history and to-do list</Link>
            </p>
          )}
          <div className="card mt-8 grid items-center gap-6 border-l-2 !border-l-mark p-7 sm:p-9 lg:grid-cols-[1.4fr_0.6fr]">
            <div>
              <h3 className="text-[23px] font-bold">Want someone to fix these for you?</h3>
              <p className="mt-2.5 text-muted">Bring this report to a free {site.callMinutes}-minute call. We will tell you which fixes actually matter for your business, and what it would cost to have them done.</p>
            </div>
            <div className="flex flex-wrap gap-3 lg:justify-end">
              <Link href="/book-a-call" className="btn btn-primary">Book a free call <span aria-hidden>→</span></Link>
              {!audit.locked && <button type="button" onClick={() => window.print()} className="btn btn-ghost">Print</button>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

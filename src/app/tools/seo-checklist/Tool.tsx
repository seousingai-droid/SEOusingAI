"use client";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Report, Status } from "@/lib/checker";

const STEPS = ["Opening your website", "Reading the page", "Checking robots.txt and sitemap", "Running 30 checks", "Writing your report"];
const tone: Record<Status, { ring: string; text: string; label: string }> = {
  pass: { ring: "bg-[#2fd08a]/15 text-[#5fe3a8]", text: "text-[#5fe3a8]", label: "Passed" },
  warn: { ring: "bg-mark/15 text-mark", text: "text-mark", label: "Could be better" },
  fail: { ring: "bg-[#e5484d]/15 text-[#ff8589]", text: "text-[#ff8589]", label: "Needs fixing" },
  info: { ring: "bg-panel2 text-muted", text: "text-muted", label: "Good to know" },
};
const Icon = ({ s }: { s: Status }) => (
  <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-[14px] font-bold ${tone[s].ring}`} aria-hidden>
    {s === "pass" ? "✓" : s === "fail" ? "✕" : s === "warn" ? "!" : "i"}
  </span>
);

function ScoreRing({ score }: { score: number }) {
  const r = 52, c = 2 * Math.PI * r; const color = score >= 85 ? "#5fe3a8" : score >= 60 ? "#ffd84d" : "#ff8589";
  return (
    <div className="relative h-[140px] w-[140px] shrink-0" role="img" aria-label={`Score ${score} out of 100`}>
      <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
        <circle cx="60" cy="60" r={r} fill="none" stroke="#252f55" strokeWidth="10" />
        <circle cx="60" cy="60" r={r} fill="none" stroke={color} strokeWidth="10" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - score / 100)} className="score-arc" style={{ ["--c" as string]: c }} />
      </svg>
      <div className="absolute inset-0 grid place-items-center"><div className="text-center"><p className="font-[family-name:var(--font-display)] text-[40px] font-bold leading-none">{score}</p><p className="mt-1 font-mono text-[11px] text-muted">out of 100</p></div></div>
    </div>
  );
}

export default function Tool() {
  const [url, setUrl] = useState(""); const [busy, setBusy] = useState(false); const [step, setStep] = useState(0);
  const [error, setError] = useState(""); const [report, setReport] = useState<Report | null>(null); const [only, setOnly] = useState(false);
  const top = useRef<HTMLDivElement>(null);

  const run = useCallback(async (target: string) => {
    if (!target.trim()) return;
    setBusy(true); setError(""); setReport(null); setStep(0);
    const tick = setInterval(() => setStep((s) => Math.min(s + 1, STEPS.length - 1)), 1100);
    try {
      const res = await fetch("/api/check", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ url: target }) });
      const data = await res.json();
      if (!res.ok) setError(data.error ?? "Something went wrong. Please try again."); else { setReport(data); requestAnimationFrame(() => top.current?.scrollIntoView({ behavior: "smooth", block: "start" })); }
    } catch { setError("We could not reach the checker. Check your connection and try again."); }
    finally { clearInterval(tick); setBusy(false); }
  }, []);

  // Lets the homepage form hand over a website: /tools/seo-checklist?url=example.com
  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get("url");
    if (!q) return;
    const id = setTimeout(() => { setUrl(q); run(q); }, 0);
    return () => clearTimeout(id);
  }, [run]);

  const shown = report ? report.checks.filter((c) => !only || c.status === "fail" || c.status === "warn") : [];
  return (
    <div>
      <form onSubmit={(e) => { e.preventDefault(); run(url); }} className="card flex flex-col gap-3 p-4 sm:flex-row sm:p-3">
        <label htmlFor="site" className="sr-only">Your website address</label>
        <input id="site" className="field !border-0 !bg-transparent text-[18px] sm:flex-1" placeholder="yourwebsite.com" value={url} onChange={(e) => setUrl(e.target.value)} inputMode="url" autoCapitalize="none" autoCorrect="off" spellCheck={false} />
        <button className="btn btn-primary shrink-0 disabled:opacity-60" disabled={busy || !url.trim()}>{busy ? "Checking…" : "Check my website"} {!busy && <span aria-hidden>→</span>}</button>
      </form>
      <p className="mt-3 text-[14.5px] text-muted">Free. No signup. We check the one page you enter and do not store the address or the results.</p>

      <div aria-live="polite">
        {busy && (
          <div className="card mt-8 p-7">
            <ul className="space-y-3">{STEPS.map((s, i) => (<li key={s} className={`flex items-center gap-3 text-[16px] transition-opacity ${i > step ? "opacity-30" : ""}`}><span className={`grid h-6 w-6 place-items-center rounded-full text-[12px] font-bold ${i < step ? "bg-mark text-ink" : i === step ? "spin border-2 border-mark border-t-transparent" : "border border-line"}`}>{i < step ? "✓" : ""}</span>{s}</li>))}</ul>
          </div>
        )}
        {error && <p role="alert" className="mt-6 rounded-xl border border-[#e5484d]/50 bg-[#e5484d]/10 px-5 py-4 text-[16px]">{error}</p>}
      </div>

      {report && (
        <div ref={top} className="mt-10 scroll-mt-24">
          <div className="card flex flex-col items-center gap-8 p-7 sm:flex-row sm:p-9">
            <ScoreRing score={report.score} />
            <div className="min-w-0 flex-1 text-center sm:text-left">
              <p className="eyebrow">Your report</p>
              <h2 className="mt-2 break-all text-[clamp(20px,2.4vw,28px)] font-bold">{report.url.replace(/^https?:\/\//, "").replace(/\/$/, "")}</h2>
              <p className="mt-3 text-muted">{report.counts.fail === 0 && report.counts.warn === 0 ? "This page passes every check. Nice work." : `${report.counts.fail} thing${report.counts.fail === 1 ? "" : "s"} to fix and ${report.counts.warn} that could be better, out of ${report.checks.length} checks on this one page.`}</p>
              <div className="mt-5 flex flex-wrap justify-center gap-2 sm:justify-start">
                {(["fail", "warn", "pass", "info"] as Status[]).map((s) => report.counts[s] > 0 && (<span key={s} className={`rounded-full px-3.5 py-1.5 text-[14px] font-medium ${tone[s].ring}`}>{report.counts[s]} {tone[s].label.toLowerCase()}</span>))}
              </div>
            </div>
          </div>

          <label className="mt-8 flex w-fit cursor-pointer items-center gap-3 text-[15.5px]"><input type="checkbox" className="h-5 w-5 accent-[#ffd84d]" checked={only} onChange={(e) => setOnly(e.target.checked)} />Show only what needs attention</label>

          {report.groups.map((g) => {
            const items = shown.filter((c) => c.group === g); if (!items.length) return null;
            const all = report.checks.filter((c) => c.group === g); const ok = all.filter((c) => c.status === "pass").length;
            return (
              <section key={g} className="mt-10">
                <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-line pb-4"><h3 className="text-[clamp(21px,2.2vw,26px)] font-bold">{g}</h3><p className="font-mono text-[13px] text-muted">{ok} of {all.length} passed</p></div>
                <ul>{items.map((c, i) => (
                  <li key={c.id} className="check-row flex gap-4 border-b border-line py-5" style={{ animationDelay: `${Math.min(i, 8) * 60}ms` }}>
                    <Icon s={c.status} />
                    <div className="min-w-0 flex-1">
                      <p className="text-[17px] font-medium">{c.label} <span className={`ml-1 whitespace-nowrap font-mono text-[12px] ${tone[c.status].text}`}>{tone[c.status].label}</span></p>
                      <p className="mt-1.5 break-words text-[15.5px] text-muted">{c.found}</p>
                      {c.fix && <p className="mt-3 rounded-xl border-l-2 border-mark bg-panel px-4 py-3 text-[15.5px]"><strong className="text-mark">How to fix it. </strong>{c.fix}{c.learn && <> <Link className="whitespace-nowrap text-link underline underline-offset-4 hover:text-mark" href={c.learn}>Learn more</Link></>}</p>}
                    </div>
                  </li>))}</ul>
              </section>
            );
          })}

          <div className="card mt-12 grid items-center gap-6 border-l-2 !border-l-mark p-7 sm:p-9 lg:grid-cols-[1.4fr_0.6fr]">
            <div><h3 className="text-[24px] font-bold">This checked one page. Your website has many.</h3><p className="mt-3 text-muted">A full Website Checkup reads every page, finds the problems that repeat across your site, and ranks the fixes by what will bring in the most customers. A person reviews it and walks you through it on a call.</p></div>
            <div className="flex flex-wrap gap-3 lg:justify-end"><Link href="/book-a-call" className="btn btn-primary">Book a free call <span aria-hidden>→</span></Link><button type="button" onClick={() => window.print()} className="btn btn-ghost">Print or save as PDF</button></div>
          </div>
        </div>
      )}
    </div>
  );
}

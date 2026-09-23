"use client";
import Link from "next/link";
import { useState } from "react";
import type { Finding, PageResult, SiteAudit } from "@/lib/crawl";
import type { Status } from "@/lib/checker";

const TONE: Record<Status, { dot: string; text: string; word: string }> = {
  fail: { dot: "var(--bad)", text: "text-[#e8878b]", word: "Fix this" },
  warn: { dot: "var(--mid)", text: "text-[#e8c15c]", word: "Could be better" },
  pass: { dot: "var(--ok)", text: "text-[#5ec9a0]", word: "Passed" },
  info: { dot: "#5c6785", text: "text-muted", word: "For information" },
  locked: { dot: "#5c6785", text: "text-muted", word: "Locked" },
};
const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const scoreHue = (n: number) => (n >= 85 ? "var(--ok)" : n >= 60 ? "var(--mid)" : "var(--bad)");

function Ring({ score, size = 132 }: { score: number; size?: number }) {
  const r = 52, c = 2 * Math.PI * r;
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }} role="img" aria-label={`Score ${score} out of 100`}>
      <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
        <circle cx="60" cy="60" r={r} fill="none" stroke="#252f55" strokeWidth="8" />
        <circle cx="60" cy="60" r={r} fill="none" stroke={scoreHue(score)} strokeWidth="8" strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={c * (1 - score / 100)} className="score-arc" style={{ ["--c" as string]: c }} />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">
        <div>
          <p className="font-[family-name:var(--font-display)] text-[38px] font-bold leading-none">{score}</p>
          <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-muted">out of 100</p>
        </div>
      </div>
    </div>
  );
}

function Row({ f, pagesCrawled }: { f: Finding; pagesCrawled: number }) {
  const [open, setOpen] = useState(false);
  const locked = f.status === "locked";
  const share = f.total ? f.pages.length / f.total : 0;
  const problem = f.status === "fail" || f.status === "warn";
  return (
    <div className="rep-row">
      <button type="button" className="rep-open" aria-expanded={open} onClick={() => !locked && setOpen((o) => !o)} disabled={locked}>
        <span className="rep-dot" style={{ background: TONE[f.status].dot }} aria-hidden />
        <span className="min-w-0">
          <span className="block text-[15.5px] leading-snug text-[color:var(--rep-text)]">{f.label}</span>
          <span className={`mt-0.5 block font-mono text-[11px] ${TONE[f.status].text}`}>
            {TONE[f.status].word}
            {problem && pagesCrawled > 1 && <span className="text-muted md:hidden"> · {f.pages.length}/{f.total} pages</span>}
          </span>
        </span>
        {problem && pagesCrawled > 1 ? (
          <span className="rep-cov-wrap items-center gap-2.5">
            <span className="rep-cov" title={`${f.pages.length} of ${f.total} pages`}><span style={{ width: `${Math.max(share * 100, 6)}%`, background: TONE[f.status].dot }} /></span>
            <span className="whitespace-nowrap font-mono text-[11.5px] text-muted">{f.pages.length}/{f.total} pages</span>
          </span>
        ) : <span className="rep-cov-wrap" />}
        <span className="rep-chev" aria-hidden>{locked ? "🔒" : "›"}</span>
      </button>
      {open && !locked && (
        <div className="rep-body">
          {f.found && <p className="text-[15.5px] text-[color:var(--rep-text)]">{f.found}</p>}
          {f.why && <p className="rep-why mt-2">{f.why}</p>}
          {f.fix && <p className="rep-fix"><strong className="text-mark">How to fix it. </strong>{f.fix}{f.learn && <> <Link className="whitespace-nowrap text-link underline underline-offset-4 hover:text-mark" href={f.learn}>Learn more</Link></>}</p>}
          {f.pages.length > 1 && (
            <div className="rep-pages">
              <span className="font-mono text-[11.5px] text-muted">Affected:</span>
              {f.pages.slice(0, 14).map((p) => <span key={p} className="rep-page">{p}</span>)}
              {f.pages.length > 14 && <span className="rep-page">and {f.pages.length - 14} more</span>}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function PageStrip({ pages }: { pages: PageResult[] }) {
  if (pages.length < 2) return null;
  return (
    <section className="mt-12">
      <h3 className="text-[19px] font-bold">Every page we checked</h3>
      <p className="mt-1.5 text-[14.5px] text-muted">Each square is one page, coloured by its score. Hover to see which.</p>
      <div className="rep-strip mt-4">
        {[...pages].sort((a, b) => a.score - b.score).map((p) => (
          <span key={p.url} className="rep-tick" style={{ background: scoreHue(p.score) }} title={`${p.path} — ${p.score}/100, ${p.fail} to fix`}>{p.score}</span>
        ))}
      </div>
    </section>
  );
}

export default function AuditReport({ audit, onUpgrade }: { audit: SiteAudit; onUpgrade?: React.ReactNode }) {
  const [onlyProblems, setOnlyProblems] = useState(true);
  const problems = audit.findings.filter((f) => f.status === "fail" || f.status === "warn");
  const shown = (g: string) => audit.findings.filter((f) => f.group === g && (!onlyProblems || f.status !== "pass"));

  return (
    <div className="rep">
      {/* Summary */}
      <div className="card p-7 sm:p-9">
        <div className="flex flex-col items-center gap-8 sm:flex-row">
          <Ring score={audit.score} />
          <div className="min-w-0 flex-1 text-center sm:text-left">
            <p className="eyebrow">Audit report</p>
            <h2 className="mt-2 break-all text-[clamp(21px,2.6vw,30px)] font-bold">{audit.site}</h2>
            <p className="mt-2.5 text-[16px] text-[color:var(--rep-dim)]">
              {audit.pagesCrawled === 1
                ? "We checked your homepage."
                : `We crawled ${audit.pagesCrawled} pages${audit.truncated ? ` of the ${audit.pagesFound} we found` : ""} and ran ${audit.findings.length} checks on each.`}
              {" "}Took {audit.seconds} seconds.
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-x-6 gap-y-2 sm:justify-start">
              {([["fail", audit.counts.fail], ["warn", audit.counts.warn], ["pass", audit.counts.pass]] as const).map(([k, n]) => (
                <span key={k} className="flex items-center gap-2 text-[15px]">
                  <span className="rep-dot" style={{ background: TONE[k].dot }} aria-hidden />
                  <strong>{n}</strong> <span className="text-muted">{k === "fail" ? "to fix" : k === "warn" ? "could be better" : "passing"}</span>
                </span>
              ))}
            </div>
          </div>
        </div>

        {audit.priorities.length > 0 && (
          <div className="mt-8 border-t border-line pt-7">
            <p className="eyebrow">Start here</p>
            <ol className="mt-4 grid gap-2.5">
              {audit.priorities.map((id, i) => {
                const f = audit.findings.find((x) => x.id === id); if (!f) return null;
                return (
                  <li key={id} className="flex items-baseline gap-4 text-[15.5px]">
                    <span className="font-mono text-[12px] text-mark">{i + 1}</span>
                    <span className="min-w-0">
                      <span className="text-[color:var(--rep-text)]">{f.label}</span>
                      {f.pages.length > 1 && <span className="ml-2 font-mono text-[11.5px] text-muted">{f.pages.length} pages</span>}
                    </span>
                  </li>
                );
              })}
            </ol>
          </div>
        )}
      </div>

      {onUpgrade}

      {/* Findings */}
      <div className="mt-10 grid gap-10 lg:grid-cols-[200px_minmax(0,1fr)]">
        <nav aria-label="Sections" className="rep-rail hidden lg:block">
          <div className="sticky top-28">
            <p className="eyebrow mb-3">Sections</p>
            {audit.groups.map((g) => {
              const bad = audit.findings.filter((f) => f.group === g.name && (f.status === "fail" || f.status === "warn")).length;
              return (
                <a key={g.name} href={`#${slug(g.name)}`}>
                  {g.name}
                  {bad > 0 && <span className="ml-2 font-mono text-[11px] text-[#e8c15c]">{bad}</span>}
                </a>
              );
            })}
          </div>
        </nav>

        <div>
          <label className="mb-2 flex w-fit cursor-pointer items-center gap-3 text-[15px] text-muted">
            <input type="checkbox" className="h-4 w-4 accent-[#ffd84d]" checked={onlyProblems} onChange={(e) => setOnlyProblems(e.target.checked)} />
            Hide the {audit.counts.pass} checks that passed
          </label>

          {audit.groups.map((g) => {
            const rows = shown(g.name); if (!rows.length) return null;
            const bad = audit.findings.filter((f) => f.group === g.name && (f.status === "fail" || f.status === "warn")).length;
            return (
              <section key={g.name} id={slug(g.name)} className="mt-9 scroll-mt-24">
                <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-line pb-3">
                  <h3 className="text-[19px] font-bold">{g.name}</h3>
                  <p className="font-mono text-[12px] text-muted">{bad === 0 ? "all clear" : `${bad} to look at`}</p>
                </div>
                <p className="mt-2 text-[14.5px] text-[color:var(--rep-dim)]">{g.blurb}</p>
                <div className="mt-2">{rows.map((f) => <Row key={f.id} f={f} pagesCrawled={audit.pagesCrawled} />)}</div>
              </section>
            );
          })}

          {problems.length === 0 && !audit.locked && (
            <p className="mt-8 rounded-xl border border-[#5ec9a0]/40 bg-[#5ec9a0]/10 px-5 py-4 text-[16px]">
              Nothing needs fixing. Every check passed on every page we crawled.
            </p>
          )}

          <PageStrip pages={audit.pages} />
        </div>
      </div>
    </div>
  );
}

"use client";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import Sparkline from "@/components/Sparkline";
import Unlock, { KEY_STORAGE } from "@/components/Unlock";
import { actionPlan, bySite, clearHistory, deleteSite, diff, loadDone, loadRuns, toggleDone, type Run, type SavedCheck } from "@/lib/history";
import { site } from "@/lib/site";

const when = (iso: string) => {
  const d = new Date(iso), mins = Math.round((Date.now() - d.getTime()) / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  if (mins < 60 * 24) return `${Math.round(mins / 60)} hours ago`;
  if (mins < 60 * 24 * 14) return `${Math.round(mins / 1440)} days ago`;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};
const scoreColor = (n: number) => (n >= 85 ? "text-[#5fe3a8]" : n >= 60 ? "text-mark" : "text-[#ff8589]");

function Job({ item, done, onToggle }: { item: SavedCheck & { host: string; path: string; key: string }; done: boolean; onToggle: (k: string) => void }) {
  const fail = item.status === "fail";
  return (
    <li className={`flex gap-4 border-b border-line py-5 ${done ? "opacity-55" : ""}`}>
      <input type="checkbox" checked={done} onChange={() => onToggle(item.key)} className="mt-1 h-5 w-5 shrink-0 cursor-pointer accent-[#ffd84d]" aria-label={`Mark "${item.label}" as done`} />
      <div className="min-w-0 flex-1">
        <p className={`text-[17px] font-medium ${done ? "line-through" : ""}`}>{item.label}</p>
        <p className="mt-1 font-mono text-[12.5px] text-muted">{item.host}{item.path === "/" ? "" : item.path} · <span className={fail ? "text-[#ff8589]" : "text-mark"}>{fail ? "Needs fixing" : "Could be better"}</span></p>
        {!done && (
          <>
            {item.found && <p className="mt-2 text-[15.5px] text-muted">{item.found}</p>}
            {item.fix && <p className="mt-3 rounded-xl border-l-2 border-mark bg-panel px-4 py-3 text-[15.5px]"><strong className="text-mark">How to fix it. </strong>{item.fix}{item.learn && <> <Link className="whitespace-nowrap text-link underline underline-offset-4 hover:text-mark" href={item.learn}>Learn more</Link></>}</p>}
          </>
        )}
      </div>
    </li>
  );
}

function Changed({ latest, previous }: { latest: Run; previous: Run }) {
  const { fixed, broke } = diff(latest, previous);
  if (!fixed.length && !broke.length) return <p className="mt-4 text-[14.5px] text-muted">Nothing changed since the previous check.</p>;
  return (
    <div className="mt-4 space-y-1.5 text-[14.5px]">
      {fixed.slice(0, 3).map((c) => <p key={c.id} className="text-[#5fe3a8]">Fixed: <span className="text-text">{c.label ?? c.id}</span></p>)}
      {fixed.length > 3 && <p className="text-muted">and {fixed.length - 3} more fixed</p>}
      {broke.slice(0, 3).map((c) => <p key={c.id} className="text-[#ff8589]">New problem: <span className="text-text">{c.label ?? c.id}</span></p>)}
      {broke.length > 3 && <p className="text-muted">and {broke.length - 3} more new problems</p>}
    </div>
  );
}

export default function Dashboard() {
  const [ready, setReady] = useState(false);
  const [licensed, setLicensed] = useState(false);
  const [runs, setRuns] = useState<Run[]>([]);
  const [done, setDone] = useState<Record<string, string>>({});
  const [showDone, setShowDone] = useState(false);

  const refresh = useCallback(() => { setRuns(loadRuns()); setDone(loadDone()); }, []);
  useEffect(() => {
    const id = setTimeout(() => {
      try { setLicensed(!!localStorage.getItem(KEY_STORAGE)); } catch { /* private mode */ }
      refresh(); setReady(true);
    }, 0);
    return () => clearTimeout(id);
  }, [refresh]);

  const sites = useMemo(() => bySite(runs), [runs]);
  const plan = useMemo(() => actionPlan(sites, done), [sites, done]);
  const onToggle = (k: string) => setDone(toggleDone(k));
  const exportAll = () => {
    const blob = new Blob([JSON.stringify({ exported: new Date().toISOString(), runs, done }, null, 2)], { type: "application/json" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "seousingai-history.json"; a.click(); URL.revokeObjectURL(a.href);
  };

  if (!ready) return <div className="card p-8 text-muted">Loading your saved audits…</div>;

  if (!licensed) {
    return (
      <div>
        <div className="card border-l-2 !border-l-mark p-7 sm:p-9">
          <p className="eyebrow">Members only</p>
          <h2 className="mt-3 text-[clamp(24px,3vw,32px)] font-bold">Your dashboard needs a key</h2>
          <p className="mt-4 max-w-2xl text-muted">The dashboard saves every audit you run, tracks your score over time, and turns all your open problems into one ordered to-do list. It comes with lifetime access.</p>
        </div>
        <div className="mt-6"><Unlock total={94} onUnlocked={() => { setLicensed(true); refresh(); }} /></div>
      </div>
    );
  }

  const fails = plan.open.filter((i) => i.status === "fail").length;
  const avg = sites.length ? Math.round(sites.reduce((n, s) => n + s.latest.score, 0) / sites.length) : 0;

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[["Websites tracked", String(sites.length)], ["Average score", sites.length ? `${avg}/100` : "—"], ["Jobs to do", String(plan.open.length)], ["Marked done", String(plan.done.length)]].map(([k, v]) => (
          <div key={k} className="card p-6"><p className="text-[14.5px] text-muted">{k}</p><p className="mt-1 font-[family-name:var(--font-display)] text-[32px] font-bold">{v}</p></div>
        ))}
      </div>

      {!runs.length ? (
        <div className="card mt-8 p-8 sm:p-10">
          <h2 className="text-[clamp(22px,2.6vw,28px)] font-bold">No saved audits yet</h2>
          <p className="mt-3 max-w-2xl text-muted">Every check you run from now on is saved here automatically, so you can watch your score move and tick off jobs as you finish them.</p>
          <Link href="/tools/seo-checklist" className="btn btn-primary mt-7">Check a website <span aria-hidden>→</span></Link>
        </div>
      ) : (
        <>
          {/* The main event: one ordered list of what to do */}
          <section className="mt-12">
            <div className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-4">
              <div>
                <h2 className="text-[clamp(24px,3vw,32px)] font-bold">What to do next</h2>
                <p className="mt-2 max-w-2xl text-[15.5px] text-muted">Every open problem across your websites, worst first. Work down the list. Tick one off and it moves to the bottom.</p>
              </div>
              {plan.open.length > 0 && <button type="button" onClick={() => window.print()} className="btn btn-ghost !py-2.5 !text-[15px]">Print the list</button>}
            </div>
            {plan.open.length === 0 ? (
              <p className="mt-6 rounded-xl border border-[#2fd08a]/40 bg-[#2fd08a]/10 px-5 py-4 text-[16px]">Nothing left on the list. Every problem we found has been ticked off. Run a fresh check to see if anything new has appeared.</p>
            ) : (
              <>
                <p className="mt-6 text-[15px] text-muted">{fails > 0 && <><strong className="text-[#ff8589]">{fails} need fixing</strong> and </>}{plan.open.length - fails} could be better.</p>
                <ul className="mt-2">{plan.open.map((i) => <Job key={i.key} item={i} done={false} onToggle={onToggle} />)}</ul>
              </>
            )}
            {plan.done.length > 0 && (
              <div className="mt-6">
                <button type="button" onClick={() => setShowDone((v) => !v)} className="text-[15px] text-link underline underline-offset-4 hover:text-mark">{showDone ? "Hide" : "Show"} {plan.done.length} finished {plan.done.length === 1 ? "job" : "jobs"}</button>
                {showDone && <ul className="mt-2">{plan.done.map((i) => <Job key={i.key} item={i} done onToggle={onToggle} />)}</ul>}
              </div>
            )}
          </section>

          {/* Site history */}
          <section className="mt-16">
            <h2 className="border-b border-line pb-4 text-[clamp(24px,3vw,32px)] font-bold">Your websites</h2>
            <div className="mt-8 grid gap-5 lg:grid-cols-2">
              {sites.map((s) => (
                <div key={s.host} className="card p-7">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="break-all text-[19px] font-bold">{s.host}</p>
                      <p className="mt-1 font-mono text-[12.5px] text-muted">{s.latest.path} · checked {when(s.latest.checkedAt)}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <Sparkline values={[...s.runs].reverse().map((r) => r.score)} />
                      <div className="text-right">
                        <p className={`font-[family-name:var(--font-display)] text-[30px] font-bold leading-none ${scoreColor(s.latest.score)}`}>{s.latest.score}</p>
                        {s.change !== null && <p className={`mt-1 font-mono text-[12px] ${s.change > 0 ? "text-[#5fe3a8]" : s.change < 0 ? "text-[#ff8589]" : "text-muted"}`}>{s.change > 0 ? "+" : ""}{s.change} since last</p>}
                      </div>
                    </div>
                  </div>
                  {s.previous && <Changed latest={s.latest} previous={s.previous} />}
                  <p className="mt-4 font-mono text-[12.5px] text-muted">{s.runs.length} saved {s.runs.length === 1 ? "check" : "checks"} · {s.latest.counts.fail} to fix · {s.latest.counts.warn} could be better</p>
                  <div className="mt-5 flex flex-wrap gap-3">
                    <Link href={`/tools/seo-checklist?url=${encodeURIComponent(s.latest.url)}`} className="btn btn-primary !py-2.5 !px-4 !text-[15px]">Check again</Link>
                    <button type="button" onClick={() => { if (confirm(`Remove all saved checks for ${s.host}? This cannot be undone.`)) { deleteSite(s.host); refresh(); } }} className="btn btn-ghost !py-2.5 !px-4 !text-[15px]">Remove</button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="card mt-16 p-7">
            <h2 className="text-[20px] font-bold">Your data</h2>
            <p className="mt-2 max-w-2xl text-[15.5px] text-muted">Your history is saved in this browser only. We never receive a copy. That means it will not follow you to another device, and clearing your browser data will erase it. Export a copy any time.</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <button type="button" onClick={exportAll} className="btn btn-ghost !py-2.5 !px-4 !text-[15px]">Download my history</button>
              <button type="button" onClick={() => { if (confirm("Erase every saved check and tick? This cannot be undone.")) { clearHistory(); refresh(); } }} className="btn btn-ghost !py-2.5 !px-4 !text-[15px]">Erase everything</button>
            </div>
          </section>
        </>
      )}

      <div className="card mt-8 grid items-center gap-6 border-l-2 !border-l-mark p-7 lg:grid-cols-[1.4fr_0.6fr]">
        <div><h2 className="text-[22px] font-bold">Want someone to do the jobs on this list?</h2><p className="mt-2 text-muted">Send us your list on a free {site.callMinutes}-minute call and we will tell you which ones actually matter for your business, and what it would cost to have them done.</p></div>
        <div className="flex lg:justify-end"><Link href="/book-a-call" className="btn btn-primary">Book a free call <span aria-hidden>→</span></Link></div>
      </div>
    </div>
  );
}

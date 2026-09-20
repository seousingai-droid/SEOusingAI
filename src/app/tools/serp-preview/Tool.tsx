"use client";
import { useState } from "react";

const TITLE_MAX = 60, DESC_MAX = 155;
const Meter = ({ n, max }: { n: number; max: number }) => {
  const over = n > max, low = n > 0 && n < max * 0.5;
  return (
    <div className="mt-2 flex items-center gap-3">
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-line"><div className={`h-full rounded-full ${over ? "bg-red-400" : "bg-mark"}`} style={{ width: `${Math.min(100, (n / max) * 100)}%` }} /></div>
      <span className={`font-mono text-[12.5px] ${over ? "text-red-300" : "text-muted"}`}>{n}/{max}{over ? " · may be cut off" : low ? " · room to say more" : ""}</span>
    </div>
  );
};

export default function Tool() {
  const [title, setTitle] = useState("How to Use AI for SEO: Step-by-Step Guide (2026)");
  const [desc, setDesc] = useState("SEO using AI means letting AI handle research, briefs, drafts, and audits while you verify facts and add experience. Here is the full workflow.");
  const [url, setUrl] = useState("https://seousingai.com/guides/how-to-use-ai-for-seo");
  let host = "example.com", path = "";
  try { const u = new URL(url); host = u.hostname; path = u.pathname.split("/").filter(Boolean).join(" › "); } catch {}
  const cut = (s: string, m: number) => (s.length > m ? s.slice(0, m - 1).trimEnd() + "…" : s);
  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <form className="card min-w-0 space-y-6 p-7" onSubmit={(e) => e.preventDefault()}>
        <div><label className="lbl" htmlFor="t">Title tag</label><input id="t" className="field" value={title} onChange={(e) => setTitle(e.target.value)} /><Meter n={title.length} max={TITLE_MAX} /></div>
        <div><label className="lbl" htmlFor="d">Meta description</label><textarea id="d" rows={4} className="field" value={desc} onChange={(e) => setDesc(e.target.value)} /><Meter n={desc.length} max={DESC_MAX} /></div>
        <div><label className="lbl" htmlFor="u">Page URL</label><input id="u" className="field" value={url} onChange={(e) => setUrl(e.target.value)} /></div>
      </form>
      <div className="min-w-0">
        <p className="eyebrow mb-4">Google preview</p>
        <div className="rounded-2xl bg-white p-6 text-left font-[Arial,sans-serif] shadow-xl">
          <div className="flex items-center gap-3">
            <div className="grid h-7 w-7 place-items-center rounded-full bg-[#e8eaed] text-[12px] font-bold text-[#202124]">{host[0]?.toUpperCase()}</div>
            <div className="min-w-0"><p className="truncate text-[14px] leading-tight text-[#202124]">{host}</p><p className="truncate text-[12px] leading-tight text-[#4d5156]">{`https://${host}`}{path && ` › ${path}`}</p></div>
          </div>
          <p className="mt-2 break-words text-[20px] leading-[1.3] text-[#1a0dab]">{cut(title || "Your title tag", TITLE_MAX)}</p>
          <p className="mt-1 text-[14px] leading-[1.58] text-[#4d5156]">{cut(desc || "Your meta description", DESC_MAX)}</p>
        </div>
        <p className="mt-4 text-[14.5px] text-muted">Google measures snippets in pixels and sometimes rewrites them. Treat these character limits as a safe guide, not a guarantee.</p>
      </div>
    </div>
  );
}

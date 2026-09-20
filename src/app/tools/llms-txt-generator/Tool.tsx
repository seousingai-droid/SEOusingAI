"use client";
import { useMemo, useState } from "react";
import CopyButton from "@/components/CopyButton";

type Row = { name: string; url: string; desc: string };
export default function Tool() {
  const [name, setName] = useState("");
  const [sum, setSum] = useState("");
  const [rows, setRows] = useState<Row[]>([{ name: "", url: "", desc: "" }, { name: "", url: "", desc: "" }]);
  const set = (i: number, k: keyof Row, v: string) => setRows((r) => r.map((x, j) => (j === i ? { ...x, [k]: v } : x)));
  const out = useMemo(() => {
    const pages = rows.filter((r) => r.name && r.url).map((r) => `- [${r.name}](${r.url})${r.desc ? `: ${r.desc}` : ""}`);
    return [`# ${name || "Your Brand"}`, ``, `> ${sum || "One sentence on what the site is and who it serves."}`, ``, `## Key pages`, ...(pages.length ? pages : ["- [Page name](https://example.com/page): one-line description"]), ``].join("\n");
  }, [name, sum, rows]);
  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <form className="card min-w-0 space-y-6 p-7" onSubmit={(e) => e.preventDefault()}>
        <div><label className="lbl" htmlFor="n">Brand or site name</label><input id="n" className="field" value={name} onChange={(e) => setName(e.target.value)} placeholder="Acme Wallets" /></div>
        <div><label className="lbl" htmlFor="s">One-sentence description</label><textarea id="s" rows={2} className="field" value={sum} onChange={(e) => setSum(e.target.value)} placeholder="Acme Wallets sells handmade slim leather wallets to US customers." /></div>
        <fieldset className="space-y-4"><legend className="lbl">Key pages</legend>
          {rows.map((r, i) => (
            <div key={i} className="grid gap-2 rounded-xl border border-line p-3 sm:grid-cols-2">
              <input aria-label={`Page ${i + 1} name`} className="field" placeholder="Page name" value={r.name} onChange={(e) => set(i, "name", e.target.value)} />
              <input aria-label={`Page ${i + 1} URL`} className="field" placeholder="https://…" value={r.url} onChange={(e) => set(i, "url", e.target.value)} />
              <input aria-label={`Page ${i + 1} description`} className="field sm:col-span-2" placeholder="One-line description" value={r.desc} onChange={(e) => set(i, "desc", e.target.value)} />
            </div>
          ))}
          <button type="button" className="btn btn-ghost !px-4 !py-2.5 !text-[15px]" onClick={() => setRows((r) => [...r, { name: "", url: "", desc: "" }])}>Add a page</button>
        </fieldset>
      </form>
      <div className="card flex min-w-0 flex-col p-7">
        <div className="flex items-center justify-between gap-4"><p className="eyebrow">llms.txt</p><CopyButton text={out} label="Copy file" /></div>
        <pre className="mt-5 flex-1 overflow-x-auto whitespace-pre-wrap rounded-xl border border-line bg-ink p-5 font-mono text-[13.5px] leading-relaxed text-[#dfe5f7]" aria-live="polite">{out}</pre>
        <p className="mt-4 text-[14.5px] text-muted">Save it as llms.txt and upload it to the root of your site, next to robots.txt.</p>
      </div>
    </div>
  );
}

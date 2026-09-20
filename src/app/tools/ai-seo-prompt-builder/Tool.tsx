"use client";
import { useMemo, useState } from "react";
import CopyButton from "@/components/CopyButton";

const TASKS: Record<string, { label: string; role: string; source: string; ask: (k: string) => string; format: string }> = {
  keywords: { label: "Keyword research", role: "an SEO strategist", source: "Seed topics", ask: () => "List 40 search queries a real buyer would type, phrased as questions where natural. Group them by search intent (informational, commercial, transactional) and name the single page that should answer each group.", format: "A table with columns: query, intent, target page." },
  brief: { label: "Content brief", role: "a content strategist", source: "Titles and H2 headings of the top 5 ranking pages", ask: (k) => `Summarize what the ranking pages for "${k}" all cover, what they miss, and the dominant format. Then write a content brief: search intent, angle, H2 headings phrased as questions, and 5 FAQs.`, format: "A brief with clear section labels. H2s as a numbered list." },
  meta: { label: "Titles and meta descriptions", role: "an SEO copywriter", source: "The page intro or summary", ask: (k) => `Write 8 title tags (max 60 characters, "${k}" near the front, each with a different reason to click) and 5 meta descriptions (max 155 characters, written as a preview of the answer).`, format: "Two numbered lists. Show the character count after each line." },
  audit: { label: "On-page audit", role: "a technical and on-page SEO", source: "The full page content, including title, meta description, and headings", ask: (k) => `Audit this page for the query "${k}". Check intent match, answer-first structure, heading hierarchy, missing questions, internal link opportunities, and whether each section could be quoted alone by an AI answer engine.`, format: "A table with columns: priority, issue, fix, why it matters." },
  schema: { label: "Schema markup", role: "a technical SEO", source: "The page content", ask: () => "Generate valid JSON-LD for this page using the most appropriate schema.org types (for example Article, FAQPage, HowTo, or Product). Only include facts present in the content.", format: "One JSON-LD code block, then a one-line note on which types you used and why." },
};

export default function Tool() {
  const [task, setTask] = useState("keywords");
  const [biz, setBiz] = useState("");
  const [aud, setAud] = useState("");
  const [kw, setKw] = useState("");
  const t = TASKS[task];
  const prompt = useMemo(() => {
    const k = kw || "[target keyword]";
    return [
      `You are ${t.role}.`,
      ``,
      `Context: My site is about ${biz || "[what your site sells or covers]"}. My audience is ${aud || "[who you serve]"} in the United States.${task === "keywords" ? "" : ` Target query: "${k}".`}`,
      ``,
      `Source material (${t.source}):`,
      `"""`,
      `[paste here]`,
      `"""`,
      ``,
      `Task: ${t.ask(k)}`,
      ``,
      `Rules:`,
      `- Use only the source material and well-established facts.`,
      `- Do not invent statistics, search volumes, prices, quotes, ratings, or reviews.`,
      `- Mark anything you are unsure about with [verify].`,
      `- Write in plain American English.`,
      ``,
      `Output format: ${t.format}`,
    ].join("\n");
  }, [t, task, biz, aud, kw]);
  return (
    <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
      <form className="card min-w-0 space-y-6 p-7" onSubmit={(e) => e.preventDefault()}>
        <div><label className="lbl" htmlFor="task">SEO task</label>
          <select id="task" className="field" value={task} onChange={(e) => setTask(e.target.value)}>{Object.entries(TASKS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}</select></div>
        <div><label className="lbl" htmlFor="biz">What your site sells or covers</label><input id="biz" className="field" placeholder="handmade leather wallets" value={biz} onChange={(e) => setBiz(e.target.value)} /></div>
        <div><label className="lbl" htmlFor="aud">Who you serve</label><input id="aud" className="field" placeholder="men buying gifts online" value={aud} onChange={(e) => setAud(e.target.value)} /></div>
        {task !== "keywords" && <div><label className="lbl" htmlFor="kw">Target keyword</label><input id="kw" className="field" placeholder="best slim leather wallet" value={kw} onChange={(e) => setKw(e.target.value)} /></div>}
      </form>
      <div className="card flex min-w-0 flex-col p-7">
        <div className="flex items-center justify-between gap-4"><p className="eyebrow">Your prompt</p><CopyButton text={prompt} label="Copy prompt" /></div>
        <pre className="mt-5 flex-1 overflow-x-auto whitespace-pre-wrap rounded-xl border border-line bg-ink p-5 font-mono text-[13.5px] leading-relaxed text-[#dfe5f7]" aria-live="polite">{prompt}</pre>
        <p className="mt-4 text-[14.5px] text-muted">Paste it into ChatGPT, Claude, or Gemini, then replace [paste here] with your source material.</p>
      </div>
    </div>
  );
}

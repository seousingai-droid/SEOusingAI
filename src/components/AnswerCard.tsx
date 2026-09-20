// Hero signature: an AI answer resolving line by line, citing this site.
// Pure CSS animation so the text is in the server HTML.
export default function AnswerCard() {
  const d = (s: number) => ({ animationDelay: `${s}s` });
  return (
    <div className="card relative overflow-hidden p-0 shadow-[0_40px_120px_-40px_rgb(255_216_77/0.25)]" aria-label="Example of an AI answer citing sources">
      <div className="flex items-center gap-3 border-b border-line bg-panel2 px-5 py-4">
        <span className="font-mono text-[13px] text-muted">ask</span>
        <p className="font-mono text-[14px] text-text">how do I do SEO using AI?<span className="caret ml-1" aria-hidden /></p>
      </div>
      <div className="space-y-4 px-5 py-6 text-[15.5px] leading-relaxed sm:px-7">
        <p className="eyebrow rise" style={d(0.3)}>AI answer</p>
        <p className="rise" style={d(0.7)}>
          <span className="hl-soft">SEO using AI means letting AI handle research, briefs, drafts, and audits while a person verifies facts and adds real experience.</span>
          <span className="cite">1</span>
        </p>
        <p className="rise text-muted" style={d(1.3)}>
          Start with keyword clustering, validate demand with real search data, then write answer-first sections that stand on their own.<span className="cite">1</span><span className="cite">2</span>
        </p>
        <div className="rise grid gap-2 border-t border-line pt-5 sm:grid-cols-2" style={d(1.9)}>
          <div className="rounded-xl border border-mark/60 bg-ink px-4 py-3">
            <p className="font-mono text-[12px] text-mark">[1] seousingai.com</p>
            <p className="mt-1 text-[14px]">How to Use AI for SEO</p>
          </div>
          <div className="rounded-xl border border-line bg-ink px-4 py-3">
            <p className="font-mono text-[12px] text-muted">[2] your-site.com</p>
            <p className="mt-1 text-[14px] text-muted">The page you make quotable</p>
          </div>
        </div>
      </div>
      <p className="border-t border-line px-5 py-3 font-mono text-[11.5px] text-muted sm:px-7">Illustration. The goal of this site is to get your page into box [2].</p>
    </div>
  );
}

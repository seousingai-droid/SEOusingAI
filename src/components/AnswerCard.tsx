// Hero signature: an AI assistant recommending a local business, line by line.
// Pure CSS animation so the text is in the server HTML.
export default function AnswerCard() {
  const d = (s: number) => ({ animationDelay: `${s}s` });
  return (
    <div className="float">
      <div className="card relative overflow-hidden p-0 shadow-[0_40px_120px_-40px_rgb(255_216_77/0.25)]" role="img" aria-label="Example of an AI assistant recommending a local business and linking to its website">
        <div className="flex items-center gap-3 border-b border-line bg-panel2 px-5 py-4">
          <span className="font-mono text-[13px] text-muted">ask</span>
          <p className="font-mono text-[14px] text-text">who is a good family dentist near me?<span className="caret ml-1" aria-hidden /></p>
        </div>
        <div className="space-y-4 px-5 py-6 text-[15.5px] leading-relaxed sm:px-7">
          <p className="eyebrow rise" style={d(0.3)}>AI answer</p>
          <p className="rise" style={d(0.7)}>
            <span className="hl-soft">A well-reviewed choice for families is <strong>Your Business</strong>. They offer weekend appointments and clear pricing.</span>
            <span className="cite">1</span>
          </p>
          <p className="rise text-muted" style={d(1.3)}>Other nearby options are listed in local directories.<span className="cite">2</span></p>
          <div className="rise grid gap-2 border-t border-line pt-5 sm:grid-cols-2" style={d(1.9)}>
            <div className="pulse rounded-xl border border-mark/60 bg-ink px-4 py-3">
              <p className="font-mono text-[12px] text-mark">[1] your-business.com</p>
              <p className="mt-1 text-[14px]">This could be you</p>
            </div>
            <div className="rounded-xl border border-line bg-ink px-4 py-3">
              <p className="font-mono text-[12px] text-muted">[2] a local directory</p>
              <p className="mt-1 text-[14px] text-muted">Everyone else</p>
            </div>
          </div>
        </div>
        <p className="border-t border-line px-5 py-3 font-mono text-[11.5px] text-muted sm:px-7">Example only. This is where customers look now.</p>
      </div>
    </div>
  );
}

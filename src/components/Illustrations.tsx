// Code-drawn, CSS-animated illustrations. Base styles are the finished state,
// so reduced-motion users and crawlers see the complete picture.

const Frame = ({ children, label }: { children: React.ReactNode; label: string }) => (
  <div role="img" aria-label={label} className="relative h-[230px] overflow-hidden rounded-2xl border border-line bg-ink p-5">{children}</div>
);

export function SearchClimb() {
  const row = "absolute left-0 right-0 h-[56px] rounded-xl border px-4 py-2.5";
  return (
    <Frame label="Animation of a business listing climbing from third place to first place in search results">
      <div className="mb-4 flex items-center gap-3 rounded-full border border-line bg-panel px-4 py-2 font-mono text-[12.5px] text-muted">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></svg>
        emergency plumber near me
      </div>
      <div className="il-loop relative h-[184px]">
        <div className={`${row} il-you top-0 border-mark/80 bg-mark/10`}>
          <p className="text-[14.5px] font-semibold text-mark">Your business</p>
          <p className="font-mono text-[11.5px] text-muted">your-business.com</p>
        </div>
        <div className={`${row} il-push top-[64px] border-line bg-panel`}><div className="h-2.5 w-2/3 rounded bg-line" /><div className="mt-2.5 h-2 w-1/3 rounded bg-line/70" /></div>
        <div className={`${row} il-push top-[128px] border-line bg-panel`}><div className="h-2.5 w-1/2 rounded bg-line" /><div className="mt-2.5 h-2 w-1/4 rounded bg-line/70" /></div>
      </div>
    </Frame>
  );
}

export function MapPin() {
  return (
    <Frame label="Animation of a map pin dropping onto a local map next to a business card">
      <svg viewBox="0 0 320 190" className="absolute inset-0 h-full w-full" aria-hidden>
        <g stroke="#1b2447" strokeWidth="14" strokeLinecap="round" fill="none">
          <path d="M-10 60 L330 95" /><path d="M90 -10 L120 200" /><path d="M230 -10 L205 200" /><path d="M-10 150 L330 140" />
        </g>
        <g stroke="#252f55" strokeWidth="1.5" strokeDasharray="6 8" fill="none"><path d="M-10 60 L330 95" /><path d="M90 -10 L120 200" /></g>
        <circle className="il-ripple" cx="160" cy="112" r="34" fill="none" stroke="#ffd84d" strokeWidth="2" />
        <g className="il-pin">
          <path d="M160 112c-14-20-22-30-22-42a22 22 0 1 1 44 0c0 12-8 22-22 42z" fill="#ffd84d" />
          <circle cx="160" cy="70" r="8" fill="#0a0f1f" />
        </g>
      </svg>
      <div className="il-card absolute bottom-4 left-4 right-4 rounded-xl border border-line bg-panel/95 px-4 py-3 backdrop-blur">
        <p className="text-[14.5px] font-semibold">Your business</p>
        <p className="text-[12.5px] text-muted"><span className="text-mark">Open now</span> · 0.4 mi · Call · Directions</p>
      </div>
    </Frame>
  );
}

export function ChatRecommend() {
  return (
    <Frame label="Animation of an AI chat assistant recommending a business by name">
      <div className="il-q ml-auto w-fit max-w-[85%] rounded-2xl rounded-br-md bg-panel2 px-4 py-2.5 text-[14px]">Who is a good plumber near me?</div>
      <div className="relative mt-4">
        <div className="il-dots absolute left-0 top-0 flex w-fit gap-1.5 rounded-2xl rounded-bl-md border border-line bg-panel px-4 py-3.5" aria-hidden>
          <i /><i /><i />
        </div>
        <div className="il-a w-fit max-w-[92%] rounded-2xl rounded-bl-md border border-line bg-panel px-4 py-3 text-[14px] leading-relaxed">
          A well-reviewed option is <span className="hl-soft font-semibold">Your Business</span>. They offer same-day visits and clear pricing.<span className="cite">1</span>
          <p className="mt-2 font-mono text-[11.5px] text-mark">[1] your-business.com</p>
        </div>
      </div>
    </Frame>
  );
}

function Col({ title, items, human: h }: { title: string; items: string[]; human?: boolean }) {
  return (
    <div className={`rounded-2xl border p-6 ${h ? "border-mark/70 bg-mark/[0.06]" : "border-line bg-ink"}`}>
      <p className={`font-[family-name:var(--font-display)] text-[20px] font-bold ${h ? "text-mark" : ""}`}>{title}</p>
      <ul className="mt-5 space-y-3.5">
        {items.map((t, i) => (
          <li key={t} className="il-tick flex items-center gap-3 text-[15.5px]" style={{ animationDelay: `${(h ? 1.2 : 0) + i * 0.28}s` }}>
            <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-full ${h ? "bg-mark text-ink" : "bg-panel2 text-link"}`}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" aria-hidden><path d="m5 12 5 5 9-10" /></svg>
            </span>
            {t}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SplitWork() {
  const ai = ["Reads every page of your site", "Finds what customers search for", "Writes first drafts", "Builds your monthly report"];
  const human = ["Picks what matters for your business", "Checks every fact", "Makes it sound like you", "Approves before anything goes live"];
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Col title="AI does the heavy lifting" items={ai} />
      <Col title="A real person makes it right" items={human} human />
    </div>
  );
}

export const StepIcon = ({ n }: { n: 0 | 1 | 2 }) => {
  const paths = [
    <g key="c"><rect x="8" y="12" width="48" height="42" rx="8" /><path d="M8 26h48M22 6v12M42 6v12" /><rect x="34" y="34" width="12" height="10" rx="2" fill="currentColor" stroke="none" /></g>,
    <g key="d"><path d="M16 6h22l12 12v40H16z" /><path d="M38 6v12h12M24 30h18M24 40h18M24 50h10" /></g>,
    <g key="r"><circle cx="32" cy="32" r="24" /><path d="m21 33 8 8 15-17" /></g>,
  ];
  return <svg width="44" height="44" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>{paths[n]}</svg>;
};

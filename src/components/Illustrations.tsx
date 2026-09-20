// Code-drawn, CSS-animated illustrations. Base styles are the finished state,
// so reduced-motion users and crawlers see the complete picture.

const Frame = ({ children, label, tall }: { children: React.ReactNode; label: string; tall?: boolean }) => (
  <div role="img" aria-label={label} className={`relative ${tall ? "h-[300px]" : "h-[230px]"} overflow-hidden rounded-2xl border border-line bg-ink p-5`}>{children}</div>
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

export function ScanArt() {
  const flags = [["Missing page title", 52], ["Broken link", 128], ["Slow image", 204]] as const;
  return (
    <Frame tall label="Animation of a web page being scanned, with three problems flagged: a missing page title, a broken link, and a slow image">
      <div className="relative mx-auto h-full max-w-[420px]">
        <div className="absolute inset-y-0 left-0 w-[58%] rounded-xl border border-line bg-panel p-4">
          <div className="h-3 w-1/2 rounded bg-line" />
          <div className="mt-4 h-16 rounded-lg bg-panel2" />
          {[90, 75, 82, 60, 88, 70].map((w, i) => <div key={i} className="mt-3 h-2 rounded bg-line/80" style={{ width: `${w}%` }} />)}
          <div aria-hidden className="il-scan absolute inset-x-0 h-10 bg-gradient-to-b from-transparent via-mark/25 to-transparent"><div className="absolute inset-x-0 top-1/2 h-[2px] bg-mark" /></div>
        </div>
        {flags.map(([t, top], i) => (
          <div key={t} className="il-flag absolute right-0 flex w-[38%] items-center gap-2 rounded-lg border border-mark/60 bg-mark/10 px-3 py-2 text-[12.5px] font-medium" style={{ top, animationDelay: `${0.9 + i * 1.1}s` }}>
            <span className="h-2 w-2 shrink-0 rounded-full bg-mark" />{t}
          </div>
        ))}
      </div>
    </Frame>
  );
}

export function FixArt() {
  const rows = ["Page loads in 6 seconds", "14 broken links", "No business details in the code"];
  const fixed = ["Page loads in 1.4 seconds", "0 broken links", "Business details added"];
  return (
    <Frame tall label="Animation of three website problems being fixed one by one: slow loading, broken links, and missing business details">
      <div className="mx-auto flex h-full max-w-[420px] flex-col justify-center gap-3">
        {rows.map((r, i) => (
          <div key={r} className="relative h-[62px] overflow-hidden rounded-xl border border-line bg-panel">
            <div className="absolute inset-0 flex items-center gap-3 px-4 text-[14.5px] text-muted"><span className="grid h-6 w-6 place-items-center rounded-full bg-[#e5484d]/20 text-[#ff8589]">✕</span>{r}</div>
            <div className="il-fixed absolute inset-0 flex items-center gap-3 border-l-2 border-mark bg-panel2 px-4 text-[14.5px] font-medium" style={{ animationDelay: `${1 + i * 1.2}s` }}>
              <span className="grid h-6 w-6 place-items-center rounded-full bg-mark text-ink"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" aria-hidden><path d="m5 12 5 5 9-10" /></svg></span>{fixed[i]}
            </div>
          </div>
        ))}
        <p className="text-center font-mono text-[11px] text-muted">Example figures for illustration</p>
      </div>
    </Frame>
  );
}

export function WriteArt() {
  return (
    <Frame tall label="Animation of an article being drafted line by line, then stamped as checked by a person">
      <div className="relative mx-auto h-full max-w-[380px] rounded-xl border border-line bg-panel p-5">
        <div className="il-line h-4 w-3/4 rounded bg-text/80" style={{ animationDelay: ".2s" }} />
        {[95, 88, 92, 70, 0, 90, 84, 60].map((w, i) => w === 0
          ? <div key={i} className="il-line mt-5 h-3 w-2/5 rounded bg-link/70" style={{ animationDelay: `${0.5 + i * 0.3}s` }} />
          : <div key={i} className="il-line mt-3 h-2 rounded bg-line" style={{ width: `${w}%`, animationDelay: `${0.5 + i * 0.3}s` }} />)}
        <div className="il-stamp absolute bottom-5 right-5 rotate-[-6deg] rounded-lg border-2 border-mark px-3 py-1.5 font-mono text-[12px] font-bold uppercase tracking-wider text-mark">Checked by a person</div>
      </div>
    </Frame>
  );
}

export function LinksArt() {
  const nodes = [["Local news", 60, 56], ["Industry blog", 340, 50], ["Directory", 40, 210], ["Partner site", 360, 214], ["Review site", 200, 262]] as const;
  return (
    <Frame tall label="Animation of five other websites, such as local news and an industry blog, linking to your website in the center">
      <svg viewBox="0 0 400 290" className="h-full w-full" aria-hidden>
        {nodes.map(([t, x, y], i) => (<line key={t} className="il-draw" x1={x} y1={y} x2="200" y2="145" stroke="#ffd84d" strokeWidth="2" pathLength={1} style={{ animationDelay: `${0.4 + i * 0.5}s` }} />))}
        {nodes.map(([t, x, y]) => (
          <g key={t}><rect x={x - 52} y={y - 17} width="104" height="34" rx="10" fill="#111831" stroke="#2f3b69" /><text x={x} y={y + 5} textAnchor="middle" fill="#97a3c7" fontSize="12.5" fontFamily="var(--font-body), sans-serif">{t}</text></g>
        ))}
        <circle cx="200" cy="145" r="44" fill="#ffd84d" /><text x="200" y="142" textAnchor="middle" fill="#0a0f1f" fontSize="13" fontWeight="700" fontFamily="var(--font-display), sans-serif">Your</text><text x="200" y="158" textAnchor="middle" fill="#0a0f1f" fontSize="13" fontWeight="700" fontFamily="var(--font-display), sans-serif">website</text>
      </svg>
    </Frame>
  );
}

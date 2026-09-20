// Code-drawn so the labels are exact and stay crisp at any size.
const nodes = [
  { label: "Check and fix", x: 400, y: 70 },
  { label: "Plan", x: 672, y: 215 },
  { label: "Create", x: 585, y: 440 },
  { label: "Get known", x: 215, y: 440 },
  { label: "Share and report", x: 128, y: 215 },
];
export default function ServicesHub({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 800 520" role="img" aria-label="Five kinds of work, check and fix, plan, create, get known, and share and report, all connected to a human review at the center" className={className}>
      {nodes.map((n) => (<line key={n.label} x1="400" y1="265" x2={n.x} y2={n.y} stroke="#252f55" strokeWidth="2" strokeDasharray="5 7" />))}
      {nodes.map((n) => (
        <g key={n.label}>
          <rect x={n.x - 118} y={n.y - 42} width="236" height="84" rx="20" fill="#111831" stroke="#2f3b69" strokeWidth="1.5" />
          <circle cx={n.x - 88} cy={n.y} r="6" fill="#8ab4ff" />
          <text x={n.x - 70} y={n.y + 8} fill="#e9edf9" fontSize="21" fontWeight="600" fontFamily="var(--font-display), sans-serif">{n.label}</text>
        </g>
      ))}
      <circle cx="400" cy="265" r="86" fill="#ffd84d" />
      <circle cx="400" cy="236" r="13" fill="none" stroke="#0a0f1f" strokeWidth="3.5" />
      <path d="M376 274c3-14 14-20 24-20s21 6 24 20" fill="none" stroke="#0a0f1f" strokeWidth="3.5" strokeLinecap="round" />
      <text x="400" y="306" textAnchor="middle" fill="#0a0f1f" fontSize="21" fontWeight="700" fontFamily="var(--font-display), sans-serif">Human review</text>
    </svg>
  );
}

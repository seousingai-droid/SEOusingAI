export default function CallArt({ className = "" }: { className?: string }) {
  const person = (cx: number, fill: string) => (
    <g>
      <circle cx={cx} cy="150" r="24" fill={fill} />
      <path d={`M${cx - 46} 232c4-34 24-50 46-50s42 16 46 50z`} fill={fill} />
    </g>
  );
  return (
    <svg viewBox="0 0 640 420" role="img" aria-label="Illustration of a two-person video call on a laptop next to a calendar with one day selected" className={className}>
      <rect x="70" y="50" width="400" height="262" rx="18" fill="#111831" stroke="#2f3b69" strokeWidth="2" />
      <rect x="92" y="72" width="172" height="176" rx="12" fill="#172042" />
      <rect x="276" y="72" width="172" height="176" rx="12" fill="#172042" />
      <clipPath id="t1"><rect x="92" y="72" width="172" height="160" rx="12" /></clipPath>
      <clipPath id="t2"><rect x="276" y="72" width="172" height="160" rx="12" /></clipPath>
      <g clipPath="url(#t1)">{person(178, "#8ab4ff")}</g>
      <g clipPath="url(#t2)">{person(362, "#ffd84d")}</g>
      <g transform="translate(270 280)">
        <circle cx="-44" r="14" fill="#252f55" /><circle r="14" fill="#252f55" /><circle cx="44" r="14" fill="#e5484d" />
      </g>
      <path d="M30 330h480l-24 30H54z" fill="#172042" stroke="#2f3b69" strokeWidth="2" />
      <g transform="translate(410 190)">
        <rect width="200" height="196" rx="18" fill="#0a0f1f" stroke="#ffd84d" strokeWidth="2" />
        <rect width="200" height="46" rx="18" fill="#ffd84d" /><rect y="28" width="200" height="18" fill="#ffd84d" />
        <circle cx="50" cy="0" r="7" fill="#0a0f1f" /><circle cx="150" cy="0" r="7" fill="#0a0f1f" />
        {[0, 1, 2, 3].map((r) => [0, 1, 2, 3, 4].map((c) => {
          const on = r === 1 && c === 3;
          return <rect key={`${r}${c}`} x={20 + c * 34} y={62 + r * 32} width="24" height="22" rx="6" fill={on ? "#ffd84d" : "#172042"} />;
        }))}
      </g>
    </svg>
  );
}

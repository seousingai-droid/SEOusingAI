// The stick man from our videos, drawn the same way so the site and the reels
// feel like one brand. Static SVG with a gentle bob; one arm can wave.
const D = Math.PI / 180;
type Seg = [number, number]; // upper and lower limb angles: 0 points down, 90 right, 180 up
type Pose = { lean: number; aL: Seg; aR: Seg; lL: Seg; lR: Seg };

const POSES: Record<string, Pose> = {
  wave: { lean: -2, aL: [-18, -8], aR: [140, 172], lL: [-11, -5], lR: [11, 5] },
  point: { lean: 4, aL: [-20, -6], aR: [100, 96], lL: [-12, -6], lR: [12, 6] },
  cheer: { lean: 0, aL: [-150, -168], aR: [150, 168], lL: [-16, -8], lR: [16, 8] },
  lens: { lean: 3, aL: [-18, -6], aR: [112, 138], lL: [-12, -6], lR: [12, 6] },
};

type P = [number, number];
const limb = (o: P, [a1, a2]: Seg, l1: number, l2: number): [P, P] => {
  const e: P = [o[0] + Math.sin(a1 * D) * l1, o[1] + Math.cos(a1 * D) * l1];
  return [e, [e[0] + Math.sin(a2 * D) * l2, e[1] + Math.cos(a2 * D) * l2]];
};
const path = (a: P, b: P, c: P) => `M${a[0]} ${a[1]}L${b[0]} ${b[1]}L${c[0]} ${c[1]}`;

export default function Mascot({ pose = "wave", facing = 1, tone = "ink", className = "", title }: { pose?: keyof typeof POSES; facing?: 1 | -1; tone?: "ink" | "light"; className?: string; title?: string }) {
  // Light tone is for dark sections: pale lines, dark face.
  const line = tone === "light" ? "#f7f3e8" : "#141a33";
  const face = tone === "light" ? "#1d2447" : "#fffdf6";
  const p = POSES[pose];
  const T = 150, R = 46;
  const sh: P = [Math.sin(p.lean * D) * T, -Math.cos(p.lean * D) * T];
  const hc: P = [sh[0] + Math.sin(p.lean * D) * (16 + R), sh[1] - Math.cos(p.lean * D) * (16 + R)];
  const [eL, hL] = limb(sh, p.aL, 82, 78);
  const [eR, hR] = limb(sh, p.aR, 82, 78);
  const [kL, fL] = limb([0, 0], p.lL, 98, 96);
  const [kR, fR] = limb([0, 0], p.lR, 98, 96);
  const fx = 13;
  return (
    <svg viewBox="-190 -300 380 510" className={className} role={title ? "img" : undefined} aria-hidden={title ? undefined : true} aria-label={title}>
      <g className="bob" style={{ transformBox: "view-box" }}>
        <g transform={`scale(${facing} 1)`} stroke={line} strokeLinecap="round" strokeLinejoin="round" fill="none" strokeWidth={13}>
          <path d={path(fL, kL, [0, 0])} />
          <path d={path(fR, kR, [0, 0])} />
          <path d={`M0 0L${sh[0]} ${sh[1]}`} />
          <path d={path(sh, eL, hL)} />
          <g className={pose === "wave" ? "wave-arm" : undefined} style={{ transformOrigin: `${sh[0]}px ${sh[1]}px` }}>
            <path d={path(sh, eR, hR)} />
            {pose === "lens" && (
              <g transform={`translate(${hR[0]} ${hR[1]}) rotate(${180 - p.aR[1]})`}>
                <path d="M0 6V-60" strokeWidth={16} />
                <circle cx={0} cy={-132} r={66} fill="rgb(255 255 255 / .6)" strokeWidth={12} />
              </g>
            )}
          </g>
          <circle cx={hc[0]} cy={hc[1]} r={R} fill={face} strokeWidth={12} />
          <circle cx={hc[0] + fx - 14} cy={hc[1] - 6} r={6} fill={line} stroke="none" />
          <circle cx={hc[0] + fx + 14} cy={hc[1] - 6} r={6} fill={line} stroke="none" />
          <path d={`M${hc[0] + fx - 12} ${hc[1] + 13}Q${hc[0] + fx} ${hc[1] + 25} ${hc[0] + fx + 12} ${hc[1] + 13}`} strokeWidth={5} />
        </g>
      </g>
    </svg>
  );
}

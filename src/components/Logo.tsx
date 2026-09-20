// Mark: a search lens with an AI spark breaking out of it. Search, improved by AI.
export const SPARK = "M45 6.5C45 14 49 18 56.5 18C49 18 45 22 45 29.5C45 22 41 18 33.5 18C41 18 45 14 45 6.5Z";

export function LogoMark({ size = 32, bg = "#ffd84d", ink = "#0a0f1f" }: { size?: number; bg?: string; ink?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden>
      <rect width="64" height="64" rx="15" fill={bg} />
      <circle cx="26" cy="34" r="13.5" fill="none" stroke={ink} strokeWidth="6" />
      <path d="M36.5 44.5 47 55" stroke={ink} strokeWidth="7" strokeLinecap="round" />
      <circle cx="45" cy="18" r="13.5" fill={bg} />
      <path d={SPARK} fill={ink} />
    </svg>
  );
}

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 font-[family-name:var(--font-display)] text-[21px] font-bold tracking-tight ${className}`}>
      <LogoMark />
      <span>SEO<span className="text-muted">using</span>AI</span>
    </span>
  );
}

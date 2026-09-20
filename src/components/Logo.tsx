export default function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 font-[family-name:var(--font-display)] text-[21px] font-bold tracking-tight ${className}`}>
      <span aria-hidden className="grid h-8 w-8 place-items-center rounded-lg bg-mark font-mono text-[13px] font-bold text-ink">[1]</span>
      <span>
        SEO<span className="text-muted">using</span>AI
      </span>
    </span>
  );
}

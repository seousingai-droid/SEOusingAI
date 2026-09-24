"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { Session } from "./SignIn";

/** Sign-in link, or a small menu for whoever is signed in. */
export default function AccountMenu({ variant = "desktop" }: { variant?: "desktop" | "mobile" }) {
  const [state, setState] = useState<{ loading: boolean; session: Session | null }>({ loading: true, session: null });
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    let live = true;
    const id = setTimeout(async () => {
      let found: Session | null = null;
      try { found = (await (await fetch("/api/auth/me")).json()).session ?? null; } catch { /* offline */ }
      if (live) setState({ loading: false, session: found });
    }, 0);
    return () => { live = false; clearTimeout(id); };
  }, []);

  useEffect(() => {
    if (!open) return;
    const away = (e: PointerEvent) => { if (!box.current?.contains(e.target as Node)) setOpen(false); };
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("pointerdown", away); document.addEventListener("keydown", esc);
    return () => { document.removeEventListener("pointerdown", away); document.removeEventListener("keydown", esc); };
  }, [open]);

  const signOut = async () => {
    await fetch("/api/auth/signout", { method: "POST" });
    setState({ loading: false, session: null }); setOpen(false);
    router.refresh();
  };

  const { loading, session } = state;
  const mobile = variant === "mobile";
  if (loading) return mobile ? null : <span className="inline-block h-10 w-[76px]" aria-hidden />;

  if (!session) {
    return mobile
      ? <Link href="/signin" className="btn btn-ghost w-full">Sign in</Link>
      : <Link href="/signin" className="hidden rounded-lg border border-line px-4 py-2.5 text-[15px] transition-colors hover:border-muted sm:inline-flex">Sign in</Link>;
  }

  const items = (
    <>
      <p className="px-3 pb-1 pt-1 font-mono text-[11px] uppercase tracking-widest text-muted">Signed in as</p>
      <p className="break-all px-3 pb-3 text-[14.5px]">{session.email}</p>
      <div className="border-t border-line pt-2">
        <Link href="/tools" onClick={() => setOpen(false)} className="block rounded-lg px-3 py-2.5 text-[15px] hover:bg-panel2">Free tools</Link>
        <Link href="/book-a-call" onClick={() => setOpen(false)} className="block rounded-lg px-3 py-2.5 text-[15px] hover:bg-panel2">Book a call</Link>
        <button type="button" onClick={signOut} className="block w-full rounded-lg px-3 py-2.5 text-left text-[15px] text-muted hover:bg-panel2 hover:text-text">Sign out</button>
      </div>
    </>
  );

  if (mobile) return <div className="card p-2">{items}</div>;

  return (
    <div ref={box} className="relative">
      <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-haspopup="true" aria-label="Account menu"
        className="flex items-center gap-2 rounded-lg border border-line px-2.5 py-2 transition-colors hover:border-muted">
        <span aria-hidden className="grid h-6 w-6 place-items-center rounded-full bg-mark text-[12px] font-bold text-ink">{session.email[0]?.toUpperCase()}</span>
        <svg className={`h-2.5 w-2.5 text-muted transition-transform ${open ? "rotate-180" : ""}`} viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden><path d="m2 3.5 3 3 3-3" /></svg>
      </button>
      {open && <div className="nav-panel card absolute right-0 top-12 w-64 p-2">{items}</div>}
    </div>
  );
}

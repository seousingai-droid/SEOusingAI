"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { Session } from "./SignIn";

type State = { loading: boolean; session: Session | null };

/** Header account control: a sign-in link, or a menu for whoever is signed in. */
export default function AccountMenu({ variant = "desktop" }: { variant?: "desktop" | "mobile" }) {
  const [{ loading, session }, set] = useState<State>({ loading: true, session: null });
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    let live = true;
    const id = setTimeout(async () => {
      let found: Session | null = null;
      try { found = (await (await fetch("/api/auth/me")).json()).session ?? null; } catch { /* offline */ }
      if (live) set({ loading: false, session: found });
    }, 0);
    return () => { live = false; clearTimeout(id); };
  }, []);

  // Close the menu on an outside click or Escape.
  useEffect(() => {
    if (!open) return;
    const away = (e: MouseEvent) => { if (!box.current?.contains(e.target as Node)) setOpen(false); };
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("pointerdown", away); document.addEventListener("keydown", esc);
    return () => { document.removeEventListener("pointerdown", away); document.removeEventListener("keydown", esc); };
  }, [open]);

  const signOut = async () => {
    await fetch("/api/auth/signout", { method: "POST" });
    set({ loading: false, session: null });
    setOpen(false);
    router.push("/");
    router.refresh(); // drop any server-rendered view that assumed a session
  };
  const mobile = variant === "mobile";

  if (loading) return mobile ? null : <span className="h-9 w-[84px]" aria-hidden />;

  if (!session) {
    return mobile
      ? <Link href="/signin" className="rounded-lg px-3 py-3 hover:bg-panel2">Sign in</Link>
      : <Link href="/signin" className="hidden rounded-lg border border-line px-4 py-2.5 text-[15px] transition-colors hover:border-muted sm:inline-flex">Sign in</Link>;
  }

  const initial = session.email[0]?.toUpperCase() ?? "?";
  const items = (
    <>
      <p className="px-3 pb-2 pt-1 font-mono text-[12px] text-muted">{session.planName ?? "Free"} plan</p>
      <p className="break-all px-3 pb-3 text-[15px]">{session.email}</p>
      <div className="border-t border-line pt-2">
        {session.plan !== "free"
          ? <Link href="/dashboard" className="block rounded-lg px-3 py-2.5 text-[15px] hover:bg-panel2">My dashboard</Link>
          : <Link href="/pricing" className="block rounded-lg px-3 py-2.5 text-[15px] text-mark hover:bg-panel2">See the plans</Link>}
        <Link href="/tools/seo-checklist" className="block rounded-lg px-3 py-2.5 text-[15px] hover:bg-panel2">Check a website</Link>
        <button type="button" onClick={signOut} className="block w-full rounded-lg px-3 py-2.5 text-left text-[15px] text-muted hover:bg-panel2 hover:text-text">Sign out</button>
      </div>
    </>
  );

  if (mobile) return <div className="mt-2 border-t border-line pt-2">{items}</div>;

  return (
    <div ref={box} className="relative">
      <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-haspopup="menu" aria-label="Account menu"
        className="flex items-center gap-2 rounded-lg border border-line px-3 py-2 text-[15px] transition-colors hover:border-muted">
        <span aria-hidden className={`grid h-6 w-6 place-items-center rounded-full text-[12px] font-bold ${session.plan !== "free" ? "bg-mark text-ink" : "bg-panel2 text-text"}`}>{initial}</span>
        <span className="hidden xl:inline">Account</span>
        <span aria-hidden className="text-[10px] text-muted">{open ? "\u25b4" : "\u25be"}</span>
      </button>
      {open && <div className="card absolute right-0 top-12 w-64 p-2">{items}</div>}
    </div>
  );
}

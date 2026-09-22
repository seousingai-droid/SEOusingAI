"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { KEY_STORAGE } from "./Unlock";

/** Shows a dashboard link only to people who have unlocked the tool. */
export default function MemberLink({ className = "" }: { className?: string }) {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const id = setTimeout(() => { try { setOn(!!localStorage.getItem(KEY_STORAGE)); } catch { /* private mode */ } }, 0);
    return () => clearTimeout(id);
  }, []);
  if (!on) return null;
  return <Link href="/dashboard" className={className}>My dashboard</Link>;
}

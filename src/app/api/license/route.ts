import { NextResponse } from "next/server";
import { verifyKey } from "@/lib/license";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let key = "";
  try { key = String((await req.json()).key ?? ""); } catch { /* handled below */ }
  if (!process.env.LICENSE_SECRET) return NextResponse.json({ ok: false, error: "Key checking is not set up on this server yet." }, { status: 503 });
  const ok = verifyKey(key);
  return NextResponse.json(ok ? { ok: true } : { ok: false, error: "That key is not valid. Check for typos, or paste it exactly as it appears in your purchase email." }, { status: ok ? 200 : 400 });
}

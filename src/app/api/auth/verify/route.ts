import { NextResponse } from "next/server";
import { cookieOptions, COOKIE, recordLead, sign } from "@/lib/session";
import { checkCode, PENDING, pendingCookie } from "@/lib/verify";

export const runtime = "nodejs";

// The counter inside the cookie is client-held and therefore replayable, so the
// real limit lives here. Ten wrong codes from one address and it stops.
const tries = new Map<string, number[]>();
function exhausted(key: string) {
  const now = Date.now(); const list = (tries.get(key) ?? []).filter((t) => now - t < 10 * 60_000);
  list.push(now); tries.set(key, list); if (tries.size > 5000) tries.clear();
  return list.length > 10;
}

export async function POST(req: Request) {
  let body: unknown = {};
  try { body = await req.json(); } catch { /* handled below */ }
  const typed = String((body as { code?: string }).code ?? "");
  const pending = req.headers.get("cookie")?.match(/suai_pending=([^;]+)/)?.[1];

  const ip = (req.headers.get("x-forwarded-for") ?? "local").split(",")[0].trim();
  if (exhausted(`v:${ip}`)) {
    const res = NextResponse.json({ ok: false, error: "Too many attempts. Please wait a few minutes and ask for a new code.", retry: false }, { status: 429 });
    res.cookies.set(PENDING, "", { ...pendingCookie, maxAge: 0 });
    return res;
  }

  const result = checkCode(pending, typed);
  if (!result.ok) {
    const res = NextResponse.json({ ok: false, error: result.error, retry: result.retry }, { status: 400 });
    if (result.cookie) res.cookies.set(PENDING, result.cookie, pendingCookie);
    else res.cookies.set(PENDING, "", { ...pendingCookie, maxAge: 0 });
    return res;
  }

  const token = sign({ email: result.email, since: Date.now() });
  if (!token) return NextResponse.json({ ok: false, error: "Sign-in is not set up on this server yet." }, { status: 503 });
  await recordLead(result.email, { verified: true });

  const res = NextResponse.json({ ok: true, session: { email: result.email } });
  res.cookies.set(COOKIE, token, cookieOptions);
  res.cookies.set(PENDING, "", { ...pendingCookie, maxAge: 0 });
  return res;
}

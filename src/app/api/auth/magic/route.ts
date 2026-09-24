import { NextResponse } from "next/server";
import { cookieOptions, COOKIE, recordLead, sign } from "@/lib/session";
import { openMagic, PENDING, pendingCookie } from "@/lib/verify";
import { abs } from "@/lib/site";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** The one-click link from the email. Works in any browser, on any device. */
export async function GET(req: Request) {
  const email = openMagic(new URL(req.url).searchParams.get("t") ?? undefined);
  if (!email) return NextResponse.redirect(abs("/signin?expired=1"));

  const token = sign({ email, since: Date.now() });
  if (!token) return NextResponse.redirect(abs("/signin?error=1"));
  await recordLead(email, { verified: true });

  const res = NextResponse.redirect(abs("/tools?welcome=1"));
  res.cookies.set(COOKIE, token, cookieOptions);
  res.cookies.set(PENDING, "", { ...pendingCookie, maxAge: 0 });
  return res;
}

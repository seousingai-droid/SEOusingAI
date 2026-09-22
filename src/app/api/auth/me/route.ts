import { NextResponse } from "next/server";
import { currentSession } from "@/lib/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const s = await currentSession();
  return NextResponse.json({ session: s ? { email: s.email, plan: s.plan } : null }, { headers: { "Cache-Control": "no-store" } });
}

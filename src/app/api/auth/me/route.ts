import { NextResponse } from "next/server";
import { currentSession } from "@/lib/session";
import { planOf } from "@/lib/plans";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const s = await currentSession();
  if (!s) return NextResponse.json({ session: null }, { headers: { "Cache-Control": "no-store" } });
  const p = planOf(s.plan);
  return NextResponse.json({
    session: { email: s.email, plan: s.plan, planName: p.name, sites: s.sites ?? [], siteLimit: p.sites, pageLimit: p.pages, full: p.fullResults },
  }, { headers: { "Cache-Control": "no-store" } });
}

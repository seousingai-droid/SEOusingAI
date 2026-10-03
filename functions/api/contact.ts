// Contact form, as a Cloudflare Pages Function (POST /api/contact): validates the message,
// filters obvious bots, and emails it to us through Resend with Reply-To set to the sender,
// so a reply goes straight back to them.
// Needs RESEND_API_KEY and CONTACT_TO in the Cloudflare Pages project settings (Settings →
// Variables and Secrets). MAIL_FROM is optional until the domain is verified in Resend
// (until then Resend's test sender is used, which can only deliver to the Resend account's
// own address).
import { NEEDS, BUDGETS } from "../../src/lib/contact";

type Env = { RESEND_API_KEY?: string; CONTACT_TO?: string; MAIL_FROM?: string };
type Context = { request: Request; env: Env };

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json" } });

// Five messages per address per 10 minutes. Per Worker instance, which is enough to stop a script.
const hits = new Map<string, number[]>();
function limited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 10 * 60_000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 5;
}

const clean = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);

export async function onRequestPost({ request, env }: Context) {
  const ip = request.headers.get("CF-Connecting-IP") || "unknown";
  if (limited(ip)) return json({ error: "Too many messages. Please try again in a few minutes." }, 429);

  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return json({ error: "Bad request." }, 400); }

  // Bots fill the hidden field or submit instantly. Pretend it worked so they move on.
  const started = Number(body.started) || 0;
  if (clean(body.company_url, 200) || (started && Date.now() - started < 2500)) return json({ ok: true });

  const name = clean(body.name, 100);
  const email = clean(body.email, 200);
  const website = clean(body.website, 200);
  const need = (NEEDS as readonly string[]).includes(String(body.need)) ? String(body.need) : "Something else";
  const budget = (BUDGETS as readonly string[]).includes(String(body.budget)) ? String(body.budget) : "Not sure yet";
  const message = clean(body.message, 5000);

  if (!name) return json({ error: "Please add your name.", field: "name" }, 400);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return json({ error: "Please check your email address.", field: "email" }, 400);
  if (message.length < 10) return json({ error: "Please tell us a little more (at least 10 characters).", field: "message" }, 400);

  const key = env.RESEND_API_KEY;
  const to = env.CONTACT_TO;
  if (!key || !to) return json({ error: "setup" }, 503);
  const from = env.MAIL_FROM || "SEO Using AI <onboarding@resend.dev>";

  const rows: [string, string][] = [["Name", name], ["Email", email], ["Website", website || "(not given)"], ["Needs", need], ["Budget", budget]];
  const text = `${rows.map(([k, v]) => `${k}: ${v}`).join("\n")}\n\n${message}\n\nSent from seousingai.com/contact`;
  const html = `<table style="font:15px/1.5 system-ui,sans-serif;border-collapse:collapse">${rows.map(([k, v]) => `<tr><td style="padding:4px 16px 4px 0;color:#5b627c">${k}</td><td style="padding:4px 0"><strong>${esc(v)}</strong></td></tr>`).join("")}</table><p style="font:15px/1.6 system-ui,sans-serif;white-space:pre-wrap;border-left:3px solid #ffd84d;padding-left:14px">${esc(message)}</p><p style="font:13px system-ui,sans-serif;color:#5b627c">Sent from seousingai.com/contact. Reply to this email to answer ${esc(name)} directly.</p>`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from, to: to.split(",").map((s) => s.trim()), reply_to: email, subject: `New message: ${need}, from ${name}`, text, html }),
  });
  if (!res.ok) {
    console.error("contact: resend failed", res.status, await res.text().catch(() => ""));
    return json({ error: "send" }, 502);
  }
  return json({ ok: true });
}

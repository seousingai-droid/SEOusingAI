import dns from "node:dns/promises";
import net from "node:net";

// The checker fetches URLs typed by strangers, so it must never be usable to
// reach private networks (server-side request forgery). Every hop is validated.
function privateV4(ip: string) {
  const [a, b] = ip.split(".").map(Number);
  return a === 0 || a === 10 || a === 127 || a >= 224 || (a === 100 && b >= 64 && b <= 127) || (a === 169 && b === 254) ||
    (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168) || (a === 192 && b === 0) || (a === 198 && (b === 18 || b === 19));
}
function isPrivate(ip: string) {
  if (net.isIPv4(ip)) return privateV4(ip);
  const v = ip.toLowerCase();
  const mapped = v.match(/::ffff:(\d+\.\d+\.\d+\.\d+)$/);
  if (mapped) return privateV4(mapped[1]);
  return v === "::" || v === "::1" || v.startsWith("fc") || v.startsWith("fd") || v.startsWith("fe8") || v.startsWith("fe9") || v.startsWith("fea") || v.startsWith("feb");
}

export async function assertPublic(u: URL) {
  if (u.protocol !== "http:" && u.protocol !== "https:") throw new Error("Only http and https addresses can be checked.");
  if (u.username || u.password) throw new Error("Addresses with a username or password cannot be checked.");
  if (u.port && !["80", "443"].includes(u.port)) throw new Error("Only standard web ports can be checked.");
  const host = u.hostname.replace(/^\[|\]$/g, "");
  if (!host.includes(".") || host.endsWith(".local") || host.endsWith(".internal")) throw new Error("Enter a public website address, like example.com.");
  if (net.isIP(host)) { if (isPrivate(host)) throw new Error("That address is not a public website."); return; }
  let addrs: { address: string }[];
  try { addrs = await dns.lookup(host, { all: true }); } catch { throw new Error("We could not find that website. Check the spelling."); }
  if (!addrs.length || addrs.some((a) => isPrivate(a.address))) throw new Error("That address is not a public website.");
}

export type Fetched = { url: string; status: number; headers: Headers; body: string; ms: number; hops: string[]; bytes: number };
const UA = "SEOusingAI-Checker/1.0 (+https://seousingai.com/tools/seo-checklist)";

export async function safeFetch(start: string, { timeout = 10000, maxBytes = 2_000_000, maxHops = 5 } = {}): Promise<Fetched> {
  let url = new URL(start); const hops: string[] = [];
  for (let i = 0; i <= maxHops; i++) {
    await assertPublic(url);
    const t0 = Date.now(); // time only the final hop, after the DNS check
    const ctl = new AbortController(); const timer = setTimeout(() => ctl.abort(), timeout);
    try {
      const res = await fetch(url, { redirect: "manual", signal: ctl.signal, headers: { "User-Agent": UA, Accept: "text/html,application/xhtml+xml,text/plain;q=0.9,*/*;q=0.5", "Accept-Language": "en-US,en" } });
      const ms = Date.now() - t0;
      if (res.status >= 300 && res.status < 400 && res.headers.get("location")) { hops.push(url.href); url = new URL(res.headers.get("location")!, url); continue; }
      const reader = res.body?.getReader(); const chunks: Uint8Array[] = []; let bytes = 0;
      if (reader) for (;;) { const { done, value } = await reader.read(); if (done) break; bytes += value.length; if (bytes > maxBytes) { await reader.cancel(); break; } chunks.push(value); }
      return { url: url.href, status: res.status, headers: res.headers, body: Buffer.concat(chunks).toString("utf8"), ms, hops, bytes };
    } catch (e) {
      if ((e as Error).name === "AbortError") throw new Error("The website took too long to respond.");
      throw e instanceof Error && /public|Only|Enter|could not find/.test(e.message) ? e : new Error("We could not load that website. It may be blocking automated visits.");
    } finally { clearTimeout(timer); }
  }
  throw new Error("The website redirects too many times.");
}

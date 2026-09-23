import type { Check, Counts, Status } from "./checker";
import type { SiteAudit } from "./crawl";

/**
 * Saved audit history.
 *
 * Today this lives in the visitor's own browser: no account, no server copy,
 * nothing for us to leak. Everything goes through the small API below, so
 * swapping in a server-backed store later is a change to this file only.
 */
const RUNS = "suai_runs";
const DONE = "suai_done";
const MAX_RUNS = 80;

export type SavedCheck = Pick<Check, "id" | "status" | "weight"> & Partial<Pick<Check, "label" | "group" | "found" | "why" | "fix" | "learn">>;
export type Run = { id: string; url: string; host: string; path: string; checkedAt: string; score: number; counts: Counts; total: number; pages: number; checks: SavedCheck[] };
export type SiteHistory = { host: string; runs: Run[]; latest: Run; previous?: Run; change: number | null };

const read = <T,>(key: string, fallback: T): T => {
  try { const raw = localStorage.getItem(key); return raw ? (JSON.parse(raw) as T) : fallback; } catch { return fallback; }
};
const write = (key: string, value: unknown) => {
  try { localStorage.setItem(key, JSON.stringify(value)); return true; } catch { return false; }
};

/** Keeps the full text for anything actionable; passing checks keep only their id. */
function compact(c: Check): SavedCheck {
  if (c.status === "pass") return { id: c.id, status: c.status, weight: c.weight };
  return { id: c.id, status: c.status, weight: c.weight, label: c.label, group: c.group, found: c.found, why: c.why, fix: c.fix, learn: c.learn };
}

export function loadRuns(): Run[] {
  return read<Run[]>(RUNS, []).filter((r) => r && r.url && r.checkedAt).sort((a, b) => b.checkedAt.localeCompare(a.checkedAt));
}

export function saveAudit(audit: SiteAudit): Run | null {
  if (audit.locked) return null; // a part-locked report would make a misleading history entry
  const run: Run = {
    id: `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`,
    url: audit.startUrl, host: audit.site, path: new URL(audit.startUrl).pathname,
    checkedAt: audit.checkedAt, score: audit.score, counts: audit.counts,
    total: audit.findings.length, pages: audit.pagesCrawled,
    checks: audit.findings.map((f) => compact({ ...f, found: f.pages.length > 1 ? `${f.found} Affects ${f.pages.length} of ${f.total} pages.` : f.found })),
  };
  const runs = [run, ...loadRuns()].slice(0, MAX_RUNS);
  if (!write(RUNS, runs) && !write(RUNS, runs.slice(0, 20))) return null;
  return run;
}

export function deleteRun(id: string) { write(RUNS, loadRuns().filter((r) => r.id !== id)); }
export function deleteSite(host: string) { write(RUNS, loadRuns().filter((r) => r.host !== host)); }
export function clearHistory() { write(RUNS, []); write(DONE, {}); }

/** Groups runs by website, newest first, with the change since the previous check. */
export function bySite(runs: Run[]): SiteHistory[] {
  const map = new Map<string, Run[]>();
  for (const r of runs) map.set(r.host, [...(map.get(r.host) ?? []), r]);
  return [...map.entries()]
    .map(([host, list]) => {
      const sorted = [...list].sort((a, b) => b.checkedAt.localeCompare(a.checkedAt));
      const [latest, previous] = sorted;
      return { host, runs: sorted, latest, previous, change: previous ? latest.score - previous.score : null };
    })
    .sort((a, b) => b.latest.checkedAt.localeCompare(a.latest.checkedAt));
}

/** Compares two runs of the same page and says what moved. */
export function diff(latest: Run, previous: Run) {
  const before = new Map(previous.checks.map((c) => [c.id, c.status]));
  const fixed: SavedCheck[] = [], broke: SavedCheck[] = [];
  const rank: Record<Status, number> = { pass: 3, info: 2, warn: 1, fail: 0, locked: 2 };
  for (const c of latest.checks) {
    const was = before.get(c.id); if (!was || was === c.status) continue;
    if (rank[c.status] > rank[was]) fixed.push(c); else if (rank[c.status] < rank[was]) broke.push(c);
  }
  return { fixed, broke };
}

export const doneKey = (host: string, path: string, checkId: string) => `${host}${path}|${checkId}`;
export const loadDone = (): Record<string, string> => read<Record<string, string>>(DONE, {});
export function toggleDone(key: string) {
  const done = loadDone();
  if (done[key]) delete done[key]; else done[key] = new Date().toISOString();
  write(DONE, done);
  return done;
}

/** One ordered to-do list across every saved site: worst first, already-fixed items dropped. */
export function actionPlan(sites: SiteHistory[], done: Record<string, string>) {
  const items = sites.flatMap((s) =>
    s.latest.checks
      .filter((c) => c.status === "fail" || c.status === "warn")
      .map((c) => ({ ...c, host: s.host, path: s.latest.path, url: s.latest.url, key: doneKey(s.host, s.latest.path, c.id) }))
  );
  const order = (i: (typeof items)[number]) => (i.status === "fail" ? 0 : 1) * 10 - i.weight;
  return {
    open: items.filter((i) => !done[i.key]).sort((a, b) => order(a) - order(b)),
    done: items.filter((i) => done[i.key]),
  };
}

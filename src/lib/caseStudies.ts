import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";

const DIR = path.join(process.cwd(), "content", "case-studies");
export type Metric = { label: string; before: string; after: string; source: string };
export type Shot = { file: string; caption: string; alt: string };
export type CaseStudy = {
  slug: string; client: string; industry: string; location?: string; website?: string; services: string[]; period: string;
  headline: string; summary: string; metrics: Metric[]; screenshots: Shot[]; quote?: { text: string; name: string; role: string };
  published: string; html: string;
};

// Refuses to load a study that is missing any of the fields that make it verifiable.
export function getCaseStudies(): CaseStudy[] {
  if (!fs.existsSync(DIR)) return [];
  return fs.readdirSync(DIR)
    .filter((f) => f.endsWith(".md") && !f.startsWith("_"))
    .map((file) => {
      const { data, content } = matter(fs.readFileSync(path.join(DIR, file), "utf8"));
      for (const k of ["client", "industry", "period", "permission", "headline", "summary", "metrics", "published"]) {
        if (!data[k] || (Array.isArray(data[k]) && !data[k].length)) throw new Error(`Case study ${file} is missing "${k}". Every study needs real, permitted, sourced numbers.`);
      }
      for (const m of data.metrics as Metric[]) if (!m.source) throw new Error(`Case study ${file}: metric "${m.label}" has no source.`);
      return { slug: file.replace(/\.md$/, ""), client: data.client, industry: data.industry, location: data.location, website: data.website || undefined, services: data.services ?? [], period: data.period, headline: data.headline, summary: data.summary, metrics: data.metrics, screenshots: data.screenshots ?? [], quote: data.quote?.text ? data.quote : undefined, published: data.published, html: marked.parse(content, { async: false }) as string };
    })
    .sort((a, b) => b.published.localeCompare(a.published));
}
export const getCaseStudy = (slug: string) => getCaseStudies().find((c) => c.slug === slug);

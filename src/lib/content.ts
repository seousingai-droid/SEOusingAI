import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";

const DIR = path.join(process.cwd(), "content", "guides");

export type Faq = { q: string; a: string };
export type Guide = {
  slug: string;
  title: string;
  metaTitle: string;
  description: string;
  eyebrow: string;
  published: string;
  updated: string;
  readMinutes: number;
  quickAnswer: string;
  faqs: Faq[];
  html: string;
  toc: { id: string; text: string }[];
  order: number;
  image?: string;
  /** The cover's own description and caption, lifted from where it sat in the article. */
  imageAlt?: string;
  imageCaption?: string;
};

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/<[^>]+>/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

function render(md: string) {
  const toc: { id: string; text: string }[] = [];
  const renderer = new marked.Renderer();
  renderer.heading = function ({ tokens, depth }) {
    const text = this.parser.parseInline(tokens);
    const id = slugify(text);
    if (depth === 2) toc.push({ id, text: text.replace(/<[^>]+>/g, "") });
    return `<h${depth} id="${id}">${text}</h${depth}>\n`;
  };
  renderer.table = function (token) {
    const head = token.header
      .map((c) => `<th scope="col">${this.parser.parseInline(c.tokens)}</th>`)
      .join("");
    const rows = token.rows
      .map(
        (r) =>
          `<tr>${r
            .map((c) => `<td>${this.parser.parseInline(c.tokens)}</td>`)
            .join("")}</tr>`
      )
      .join("");
    return `<div class="table-wrap"><table><thead><tr>${head}</tr></thead><tbody>${rows}</tbody></table></div>`;
  };
  renderer.link = function ({ href, title, tokens }) {
    const text = this.parser.parseInline(tokens);
    const external = /^https?:\/\//.test(href) && !href.includes("seousingai.com");
    const attrs = external ? ' target="_blank" rel="noopener"' : "";
    return `<a href="${href}"${title ? ` title="${title}"` : ""}${attrs}>${text}</a>`;
  };
  renderer.image = function ({ href, title, text }) {
    return `<figure><img src="${href}" alt="${text}" width="1600" height="900" loading="lazy" decoding="async" />${title ? `<figcaption>${title}</figcaption>` : ""}</figure>`;
  };
  const html = marked.parse(md, { renderer, async: false }) as string;
  return { html, toc };
}

export function getGuides(): Guide[] {
  return fs
    .readdirSync(DIR)
    .filter((f) => f.endsWith(".md"))
    .map((file) => {
      const raw = fs.readFileSync(path.join(DIR, file), "utf8");
      const { data, content } = matter(raw);
      // The cover used to appear once inside the article as well. It is now the
      // featured image at the top, so take it out of the body to avoid showing it twice.
      let imageAlt: string | undefined, imageCaption: string | undefined;
      const body = data.image
        ? content.replace(/!\[([^\]]*)\]\(([^ )]+)(?: "([^"]*)")?\)\n?/, (m, alt: string, src: string, cap?: string) => {
            if (src !== data.image) return m;
            imageAlt = alt; imageCaption = cap;
            return "";
          })
        : content;
      const { html, toc } = render(body);
      const words = content.split(/\s+/).length;
      return {
        slug: file.replace(/\.md$/, ""),
        title: data.title,
        metaTitle: data.metaTitle ?? data.title,
        description: data.description,
        eyebrow: data.eyebrow ?? "Guide",
        published: data.published,
        updated: data.updated,
        readMinutes: Math.max(3, Math.round(words / 220)),
        quickAnswer: data.quickAnswer,
        faqs: data.faqs ?? [],
        order: data.order ?? 99,
        image: data.image,
        imageAlt,
        imageCaption,
        html,
        toc,
      } as Guide;
    })
    .sort((a, b) => a.order - b.order);
}

export function getGuide(slug: string) {
  return getGuides().find((g) => g.slug === slug);
}

export const formatDate = (iso: string) =>
  new Date(iso + "T00:00:00Z").toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });

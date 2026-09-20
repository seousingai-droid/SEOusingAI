# SEOusingAI.com

Next.js 16 (App Router, TypeScript, Tailwind v4) site for **seousingai.com**. Every page is statically generated, so it is fast and fully readable by Google and AI crawlers.

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
```

## Where things live

| What | Where |
|---|---|
| Brand facts, author, nav, contact email | `src/lib/site.ts` |
| Guides (markdown with front matter) | `content/guides/*.md` |
| Homepage sections | `src/app/page.tsx` |
| Free tools | `src/app/tools/*` |
| Design tokens (colors, type, highlighter) | `src/app/globals.css` |
| sitemap.xml, robots.txt, llms.txt | `src/app/sitemap.ts`, `robots.ts`, `llms.txt/route.ts` |

## Add a guide

Create `content/guides/your-slug.md` with the same front matter as the existing guides (`title`, `metaTitle`, `description`, `quickAnswer`, `faqs`, `published`, `updated`, `order`). It is picked up by the guides index, footer, sitemap, and llms.txt automatically, with Article, FAQPage, and BreadcrumbList schema.

House rules for guides: question H2s, first sentence answers the heading, every statistic linked to a source you have opened and checked, no software prices, update the `updated` date when you change facts.

## Deploy (Vercel)

1. Import this GitHub repo at vercel.com. Defaults work.
2. Add the domain `seousingai.com` and point DNS as Vercel instructs. Redirect `www` to the apex.
3. After it is live: verify the domain in Google Search Console and Bing Webmaster Tools, then submit `https://seousingai.com/sitemap.xml` in both. Bing matters because ChatGPT and Copilot retrieve from it.

## Before launch

- Set a real mailbox for `hello@seousingai.com` or change `email` in `src/lib/site.ts`.
- Review the author name and bio in `src/lib/site.ts`.

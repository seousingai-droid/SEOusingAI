# Google ranking checklist for seousingai.com

Based on Google Search Central: SEO Starter Guide, Search Essentials, "Creating helpful, reliable, people-first content", spam policies, and "AI features and your website". Checked by an automated crawl of all 38 sitemap URLs on 2026-09-21.

## Done in the code

| Google asks for | Status |
|---|---|
| Pages can be crawled and indexed | robots.txt allows all, no noindex, XML sitemap, RSS feed, static HTML |
| One clear title per page, unique, descriptive | 38 of 38 unique, 25 to 60 characters |
| Unique meta description per page | 38 of 38 unique, 70 to 160 characters |
| Canonical URL on every page | 38 of 38, matching the sitemap |
| One H1, logical headings | 38 of 38 |
| Descriptive URLs | Short, lowercase, hyphenated, no dates or IDs |
| Internal links with descriptive anchor text | No orphans. Least-linked page has 4 inbound links |
| Images: alt text, dimensions, modern format | All WebP or SVG, width and height set, lazy loaded below the fold |
| Mobile friendly | No horizontal scroll at 375px on any template |
| Structured data | Organization, WebSite (with site name aliases), BreadcrumbList, Article, Service, FAQPage, WebApplication, DefinedTermSet. All valid JSON-LD |
| Social sharing tags | Open Graph and Twitter card with image on every page |
| People-first content, answers the question | Quick answer at the top, question headings, plain English |
| Accuracy and sourcing | Every statistic links to its source and was checked on that page |
| Says how content is made | Editorial standards page discloses AI use and human review |
| No spam tactics | No doorway pages, no keyword stuffing, no fake reviews, no scaled unedited AI content |
| Real 404 page | Returns status 404 |
| AI features (AI Overviews, AI Mode) | Google states no extra requirements beyond the above |

## Known trade-off

Google's guidance asks "who created this content" and recommends bylines. The owner chose not to show a personal name, so content is attributed to the SEO Using AI Editorial Team. This is allowed, but a named expert with a public profile is a stronger trust signal. Revisit if rankings stall.

## Only the owner can do these

1. Deploy on HTTPS and redirect www to the root domain. Nothing ranks until the site is live.
2. Verify in Google Search Console and Bing Webmaster Tools, paste the codes into `verification` in `src/lib/site.ts`, and submit `/sitemap.xml`.
3. Create the profiles in BRAND.md and add them to `social` in `src/lib/site.ts`.
4. Earn links and mentions. A new domain with no links will not rank for competitive terms however good the pages are.
5. Add first-hand proof as it becomes available: real client results, screenshots, and named testimonials. Never invent them.
6. Keep publishing and updating. Change the `updated` date only when the content really changes.

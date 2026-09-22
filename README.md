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
| Brand facts, nav, contact email, booking link, services | `src/lib/site.ts` |
| The five offers on the homepage (add a `price` to show it) | `offers` in `src/lib/site.ts` |
| Animated illustrations and scroll reveal | `src/components/Illustrations.tsx`, `Reveal.tsx` |
| Generated images (WebP, 1600x900) | `public/images/` |
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

## The SEO Checklist Checker (paid tool)

- Engine: `src/lib/checker.ts` (94 checks). API: `src/app/api/check/route.ts`. Screen: `src/app/tools/seo-checklist/Tool.tsx`.
- Free visitors get the 5 checks marked `free: true`. A valid key in the `x-license` header unlocks all 94.
- Keys are signed with `LICENSE_SECRET`. Set it in `.env.local` locally and in your host's environment variables. Never change it: every key issued so far would stop working.
- Issue keys: `node scripts/issue-license.mjs 5`. Email one key per purchase.
- To take payments, create the product on a provider that pays out to the Philippines (Payhip works via PayPal), and paste the checkout link into `checklist.checkoutUrl` in `src/lib/site.ts`. Until then the pricing page shows "Email to buy".
- Refund promise on the pricing page: 14 days.

## Sign-in

- Running a check requires an account. `src/lib/session.ts` signs a cookie holding the person's email and plan; there is no database and no password.
- Routes: `/api/auth/signin` (email), `/api/auth/key` (licence key, upgrades the same session to lifetime), `/api/auth/signout`, `/api/auth/me`.
- `/api/check` returns 401 without a valid session, the 5 free results for a free account, and all 94 for lifetime.
- Set `AUTH_SECRET` in `.env.local` and in your host's environment variables. Changing it signs everyone out.
- Set `LEAD_WEBHOOK_URL` to a Kit, Mailchimp, Zapier, or Formspree endpoint to collect the emails people sign up with. Without it, sign-in still works and no email is kept anywhere but the cookie.
- To let people run one check before signing in, remove the 401 guard at the top of `src/app/api/check/route.ts` and pass the count through instead.

## The members dashboard (`/dashboard`)

- Saves every unlocked audit, tracks the score over time, and turns all open problems into one ordered to-do list with tick-off state.
- Storage lives in the visitor's own browser (`src/lib/history.ts`). No database, no account, no copy on our servers. It does not follow them to another device and is erased with their browser data; the page says so and offers an export.
- To add cross-device sync later, replace the read/write pair in `src/lib/history.ts` with API calls keyed by the licence key. Nothing else needs to change.
- The page is noindex, nofollow and is kept out of the sitemap on purpose.

## Before launch

- Set a real mailbox for `hello@seousingai.com` or change `email` in `src/lib/site.ts`.
- Turn on live booking: in Google Calendar choose Create, Appointment schedule, keep Google Meet as the location, save, click Share, copy the booking page link, and paste it into `bookingUrl` in `src/lib/site.ts`. Until then the page shows an email request instead.

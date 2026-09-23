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

## Plans and cost control

Crawling costs real money per audit, so the limits in `src/lib/plans.ts` are the cost control, not an upsell trick.

| Plan | Websites | Pages per audit | Results |
|---|---|---|---|
| Free | 1 | 1 | 5 of 94 |
| Basic $67 | 1 | 25 | All |
| Standard $127 | 3 | 50 | All |
| Premium $247 | 10 | 100 | All |

A licence key carries its plan in the last character of the key body, covered by the signature, so it cannot be edited upwards. Issue one with `node scripts/issue-license.mjs standard 1`.

A website is registered against the member the first time it is audited, and counted against the plan limit. The list lives in the signed session cookie. Clearing cookies resets it, which is acceptable while there is no database: it also wipes their saved history. Move this to Supabase when the limit needs to be airtight (see STACK.md).

Server-side limits, all in `src/app/api/check/route.ts`: 20 audits a minute per visitor, and 6 full crawls an hour per member.

## The SEO Checklist Checker (paid tool)

- Page checks: `src/lib/checker.ts` (94 checks). Whole-site crawl and roll-up: `src/lib/crawl.ts`. API: `src/app/api/check/route.ts`. Report: `src/components/AuditReport.tsx`.
- Pages are found from the sitemap, or by following the site's own links, then picked one per section so a large shop is not audited as 25 product pages. Findings are grouped across pages, so the reader sees "12 pages have no description" rather than the same problem twelve times.
- Free visitors get the 5 checks marked `free: true`. A valid key in the `x-license` header unlocks all 94.
- Keys are signed with `LICENSE_SECRET`. Set it in `.env.local` locally and in your host's environment variables. Never change it: every key issued so far would stop working.
- Issue keys: `node scripts/issue-license.mjs 5`. Email one key per purchase.
- To take payments, create the product on a provider that pays out to the Philippines (Payhip works via PayPal), and paste the checkout link into `checklist.checkoutUrl` in `src/lib/site.ts`. Until then the pricing page shows "Email to buy".
- Refund promise on the pricing page: 14 days.

## Is the checker accurate?

`npm run verify` runs the checker against two fixture pages whose problems are known in advance: one deliberately broken, one built properly. It asserts the verdict of 85 individual checks, and fails the run if the clean page reports a false problem, if the broken page scores too generously, or if any problem is reported without a finding, a reason, and a fix.

Run it after every change to `src/lib/checker.ts`. Add a fixture whenever you add a check.

Scoring is weighted geometrically (a critical check is worth nine routine ones), so a page that cannot rank cannot score well by passing a pile of easy checks.

## Sign-in

Two steps: someone enters an email, we send a six-digit code, they type it back. The email also carries a one-click link that works on any device. There is no password and no database.

**Turn confirmation on** by setting `RESEND_API_KEY`. Until it is set the site still works, but it signs people in without confirming the address and says so in the response. Get a key free at resend.com, then set `MAIL_FROM` to an address on a domain you have verified there.

Limits: five wrong codes per cookie, ten per visitor per ten minutes on the server, five sign-in emails per address per ten minutes. Codes expire in ten minutes.

Run `npm run verify:auth` after touching anything in `src/lib/verify.ts` or `src/lib/session.ts`.


- Running a check requires an account. `src/lib/session.ts` signs a cookie holding the person's email and plan; there is no database and no password.
- Routes: `/api/auth/signin` (sends the code), `/api/auth/verify` (checks it), `/api/auth/magic` (the one-click link), `/api/auth/key` (licence key, upgrades the same session to lifetime), `/api/auth/signout`, `/api/auth/me`.
- `/api/check` returns 401 without a valid session, the 5 free results for a free account, and all 94 for lifetime.
- Set `AUTH_SECRET` in `.env.local` and in your host's environment variables. Changing it signs everyone out and voids any code in flight.
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

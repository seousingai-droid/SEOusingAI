# How to publish a case study

The site has a full case study system. It shows nothing until a real study exists, then it appears on the homepage, the footer, the sitemap, and llms.txt automatically.

## Rules (the loader enforces the first three)
1. Every metric has a named source (Search Console, GA4, Google Business Profile, a booking system).
2. A stated period, with before and after measured the same way.
3. Written permission from the client, recorded in the `permission` field. Keep the email.
4. Screenshots are real exports. Blur private details. Never edit a number.
5. Quotes are the client's exact words.

## Steps
1. Copy `content/case-studies/_TEMPLATE.md` to `content/case-studies/<client>.md` and fill it in.
2. Export the Search Console graph (Performance, set the date range, screenshot the chart). Send it to Claude to crop, blur, resize to 1600x900 WebP, and save under `public/images/case-studies/`.
3. Run `npm run build`. If a required field is missing, the build tells you which.
4. Push. The study is live.

## Where the first three will come from
- Past WordPress clients you have already ranked. Ask for permission and a screenshot.
- The three free Website Checkups in the 90-day plan, in exchange for a testimonial and data.
- This website itself, once it has three months of Search Console data. Publish it as "Case study: seousingai.com, built in public." Honest, and nobody else can copy it.

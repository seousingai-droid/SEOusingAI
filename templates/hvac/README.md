# HVAC website template

A 16-page static site for heating and air-conditioning companies, deployed as its own
Cloudflare Worker (`hvac-demo`, root directory `templates/hvac`, branch `cloudflare`).

## Make a client site
1. Copy this folder (or branch it) for the client.
2. Edit `src/data/business.ts`: name, phone, address, hours, license, URL.
3. Edit `src/data/hvac.ts`: their services, real prices, areas, FAQs, and their real Google reviews.
4. Replace `public/images/` with the client's own photos (same file names, WebP).
5. Remove the demo pieces: `DemoBar` in `src/app/layout.tsx`, `robots: { index: false }` in the
   layout metadata, and the `X-Robots-Tag` line in `public/_headers`.
6. `npm run build` → `out/`, then deploy (`npx wrangler deploy`) with the client's domain.

Every claim must be true for that client: prices, warranties, license numbers and reviews come
from them, never from the demo.

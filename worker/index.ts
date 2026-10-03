// Cloudflare Worker for seousingai.com. The site itself is static files in out/ (served by
// Workers Static Assets, which also reads out/_headers and out/_redirects). The Worker only
// runs first for /api/* (see run_worker_first in wrangler.jsonc): today that is the contact form.
import { handleContact, type ContactEnv } from "./contact";

type Env = ContactEnv & { ASSETS: { fetch(request: Request): Promise<Response> } };

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const { pathname } = new URL(request.url);
    if (pathname === "/api/contact") {
      if (request.method !== "POST") return new Response("Method not allowed", { status: 405, headers: { Allow: "POST" } });
      return handleContact(request, env);
    }
    return env.ASSETS.fetch(request);
  },
};

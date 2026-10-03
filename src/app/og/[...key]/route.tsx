// One share card per page, rendered at build time. See src/lib/og.tsx.
import { ogCards, ogImage } from "@/lib/og";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  // The last segment carries .png so the exported file is served as an image.
  return ogCards().map((c) => ({ key: `${c.key}.png`.split("/") }));
}

export async function GET(_req: Request, { params }: { params: Promise<{ key: string[] }> }) {
  const key = (await params).key.join("/").replace(/\.png$/, "");
  const card = ogCards().find((c) => c.key === key);
  if (!card) return new Response("Not found", { status: 404 });
  return ogImage(card);
}

// Kept so links already shared with /opengraph-image still show the current card.
import { homeCard, ogImage, OG_SIZE } from "@/lib/og";

export const dynamic = "force-static";

export const alt = "SEO Using AI: we get your business found on Google, Maps and AI search";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function OG() {
  return ogImage(homeCard);
}

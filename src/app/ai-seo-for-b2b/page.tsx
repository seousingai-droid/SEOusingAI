import LandingPage, { landingMeta } from "@/components/LandingPage";
import { getLanding } from "@/lib/landingPages";

const l = getLanding("ai-seo-for-b2b");
export const metadata = landingMeta(l);
export default function Page() { return <LandingPage l={l} />; }

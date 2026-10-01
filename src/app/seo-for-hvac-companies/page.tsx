import LandingPage, { landingMeta } from "@/components/LandingPage";
import { getLanding } from "@/lib/landingPages";

const l = getLanding("seo-for-hvac-companies");
export const metadata = landingMeta(l);
export default function Page() { return <LandingPage l={l} />; }

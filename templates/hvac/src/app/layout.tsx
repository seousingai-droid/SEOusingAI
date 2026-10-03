import type { Metadata, Viewport } from "next";
import { Archivo, Public_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import { DemoBar, Footer, JsonLd, MobileBar, abs } from "@/components/site";
import { business } from "@/data/business";
import { areas, services } from "@/data/hvac";

const archivo = Archivo({ subsets: ["latin"], axes: ["wdth"], variable: "--font-archivo", display: "swap" });
const publicSans = Public_Sans({ subsets: ["latin"], variable: "--font-public", display: "swap" });
const plex = IBM_Plex_Mono({ subsets: ["latin"], weight: ["500", "600"], variable: "--font-plex", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(business.url),
  title: { default: `${business.name}: AC Repair and Heating in ${business.city}`, template: `%s | ${business.name}` },
  description: `Heating and air conditioning repair, installation and maintenance across the ${business.metro}. Same-day AC repair, upfront prices, ${business.laborWarranty}.`,
  // A demo of a template: never in search results. A live client site removes this line.
  robots: { index: false, follow: false },
};

export const viewport: Viewport = { themeColor: "#15191c" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const b = business;
  return (
    <html lang="en" className={`${archivo.variable} ${publicSans.variable} ${plex.variable}`}>
      <body>
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-50 focus:rounded-md focus:bg-white focus:px-4 focus:py-2">Skip to content</a>
        <DemoBar />
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <MobileBar />
        <JsonLd data={{
          "@context": "https://schema.org",
          "@type": "HVACBusiness",
          "@id": abs("/#business"),
          name: b.name,
          url: b.url,
          telephone: b.tel,
          email: b.email,
          foundingDate: String(b.founded),
          address: { "@type": "PostalAddress", streetAddress: b.address.street, addressLocality: b.address.city, addressRegion: b.address.region, postalCode: b.address.zip, addressCountry: "US" },
          areaServed: areas.map((a) => ({ "@type": "City", name: `${a.name}, ${b.state}` })),
          openingHours: b.hours.map((h) => h.schema),
          priceRange: "$$",
          hasOfferCatalog: { "@type": "OfferCatalog", name: "HVAC services", itemListElement: services.map((s) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: s.name, url: abs(`/services/${s.slug}`) } })) },
        }} />
      </body>
    </html>
  );
}

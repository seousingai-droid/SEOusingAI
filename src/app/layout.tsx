import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Instrument_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import { site, abs } from "@/lib/site";

const display = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-display", display: "swap" });
const body = Instrument_Sans({ subsets: ["latin"], variable: "--font-body", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap", weight: ["400", "700"] });

export const viewport: Viewport = { themeColor: "#0a0f1f" };

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: "SEO Using AI: Rank on Google and in AI Answers", template: "%s | SEO Using AI" },
  description: site.description,
  applicationName: site.name,
  alternates: { canonical: "/" },
  openGraph: { type: "website", siteName: site.name, locale: site.locale, url: site.url },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true, googleBot: { "max-snippet": -1, "max-image-preview": "large", "max-video-preview": -1 } },
};

const orgLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": abs("/#org"),
      name: site.name,
      url: site.url,
      email: site.email,
      description: site.description,
      foundingDate: site.founded,
      logo: { "@type": "ImageObject", url: abs("/icon.svg") },
    },
    {
      "@type": "WebSite",
      "@id": abs("/#website"),
      url: site.url,
      name: site.name,
      description: site.description,
      inLanguage: "en-US",
      publisher: { "@id": abs("/#org") },
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-US" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body>
        <noscript><style>{`.reveal,.reveal .il-tick{opacity:1!important;transform:none!important}`}</style></noscript>
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-mark focus:px-4 focus:py-2 focus:text-ink">Skip to content</a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <JsonLd data={orgLd} />
      </body>
    </html>
  );
}

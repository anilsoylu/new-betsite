import type { Metadata } from "next";
import { Suspense } from "react";
import Script from "next/script";
import { BuildXIPage } from "@/components/build-xi/build-xi-page";
import { BuildXISkeleton } from "@/components/build-xi/build-xi-skeleton";
import { SEO, SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: SEO.buildXI.title,
  description: SEO.buildXI.description,
  keywords: [...SEO.buildXI.keywords],
  alternates: {
    canonical: `${SITE.url}/build-xi`,
  },
  openGraph: {
    title: SEO.buildXI.title,
    description: SEO.buildXI.description,
    url: `${SITE.url}/build-xi`,
    siteName: SITE.name,
    type: "website",
    images: [
      {
        url: `${SITE.url}/og-build-xi.png`,
        width: 1200,
        height: 630,
        alt: "Build Your XI - Football Lineup Builder",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SEO.buildXI.title,
    description: SEO.buildXI.description,
    images: [`${SITE.url}/og-build-xi.png`],
  },
};

// JSON-LD Structured Data - static trusted content from constants only
const buildXIJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Build Your XI",
  description: SEO.buildXI.description,
  url: `${SITE.url}/build-xi`,
  applicationCategory: "SportsApplication",
  operatingSystem: "Any",
  browserRequirements: "Requires JavaScript",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  creator: {
    "@type": "Organization",
    name: SITE.name,
    url: SITE.url,
  },
  featureList: [
    "Choose from 8 popular football formations",
    "Search and add any football player",
    "Build club or national team lineups",
    "Save lineups locally",
    "Share lineups with short URLs",
    "Export lineups as PNG images",
  ],
};

export default function Page() {
  return (
    <>
      <Script
        id="build-xi-jsonld"
        type="application/ld+json"
        strategy="afterInteractive"
      >
        {JSON.stringify(buildXIJsonLd)}
      </Script>
      <Suspense fallback={<BuildXISkeleton />}>
        <BuildXIPage />
      </Suspense>
    </>
  );
}

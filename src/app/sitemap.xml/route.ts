/**
 * Main Sitemap Index
 * Returns a sitemapindex XML listing all section sitemaps.
 *
 * Route: GET /sitemap.xml
 */

import { NextResponse } from "next/server"
import { SITE } from "@/lib/constants"

export const revalidate = 3600 // 1 hour

export async function GET() {
  const sitemaps = [
    `${SITE.url}/sitemaps/static.xml`,
    `${SITE.url}/sitemaps/leagues.xml`,
    `${SITE.url}/sitemaps/teams.xml`,
    `${SITE.url}/sitemaps/players.xml`,
    `${SITE.url}/sitemaps/matches.xml`,
  ]

  const sitemapEntries = sitemaps
    .map((url) => `  <sitemap>\n    <loc>${url}</loc>\n  </sitemap>`)
    .join("\n")

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapEntries}
</sitemapindex>`

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  })
}

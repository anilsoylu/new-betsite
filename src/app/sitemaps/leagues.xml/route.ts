/**
 * Leagues Sitemap Index
 * Returns a sitemapindex XML listing all league sitemap pages.
 *
 * Route: GET /sitemaps/leagues.xml
 */

import { NextResponse } from "next/server"
import { SITE } from "@/lib/constants"
import { getLeaguePageCount, initializeSchema } from "@/lib/sitemap-cache"

export const revalidate = 3600 // 1 hour

export async function GET() {
  try {
    initializeSchema()
    const pageCount = getLeaguePageCount()

    const sitemapEntries = Array.from({ length: pageCount }, (_, i) => {
      const pageNum = i + 1
      return `  <sitemap>
    <loc>${SITE.url}/sitemaps/leagues/${pageNum}</loc>
  </sitemap>`
    }).join("\n")

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
  } catch (error) {
    console.error("[Sitemap] Failed to generate leagues index:", error)

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
</sitemapindex>`

    return new NextResponse(xml, {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public, max-age=300",
      },
    })
  }
}

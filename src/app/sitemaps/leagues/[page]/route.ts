/**
 * Leagues Sitemap Page
 * Returns a urlset XML with league entries for the given page.
 * Each league generates 4 URLs: main page + fixtures + standings + stats
 *
 * Route: GET /sitemaps/leagues/[page]
 */

import { NextResponse } from "next/server"
import { notFound } from "next/navigation"
import { SITE } from "@/lib/constants"
import {
  getLeaguesForSitemap,
  getLeaguePageCount,
  initializeSchema,
} from "@/lib/sitemap-cache"
import { getLeagueUrl } from "@/lib/utils"

export const revalidate = 3600 // 1 hour

// Sub-pages for each league with their priorities
const LEAGUE_SUBPAGES = [
  { path: "", priority: 0.8 },
  { path: "/fixtures", priority: 0.7 },
  { path: "/standings", priority: 0.7 },
  { path: "/stats", priority: 0.7 },
]

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ page: string }> }
) {
  const { page: pageParam } = await params

  // Require .xml extension
  if (!pageParam.endsWith(".xml")) {
    notFound()
  }

  const page = Number.parseInt(pageParam.replace(".xml", ""), 10)

  if (Number.isNaN(page) || page < 1) {
    notFound()
  }

  try {
    initializeSchema()

    const pageCount = getLeaguePageCount()
    if (page > pageCount) {
      notFound()
    }

    const leagues = getLeaguesForSitemap(page)

    const urlEntries = leagues
      .flatMap((league) => {
        const baseUrl = getLeagueUrl(league.name, league.id)
        const lastmod = league.lastModified
          ? new Date(league.lastModified).toISOString()
          : new Date().toISOString()

        // Generate URL entries for main page and all sub-pages
        return LEAGUE_SUBPAGES.map(
          (subpage) => `  <url>
    <loc>${SITE.url}${baseUrl}${subpage.path}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>daily</changefreq>
    <priority>${subpage.priority}</priority>
  </url>`
        )
      })
      .join("\n")

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>`

    return new NextResponse(xml, {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
    })
  } catch (error) {
    console.error("[Sitemap] Failed to generate leagues page:", page, error)
    notFound()
  }
}

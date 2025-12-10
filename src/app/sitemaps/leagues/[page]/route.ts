/**
 * Leagues Sitemap Page
 * Returns a urlset XML with league entries for the given page.
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

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ page: string }> }
) {
  const { page: pageParam } = await params
  const page = Number.parseInt(pageParam, 10)

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
      .map((league) => {
        const url = getLeagueUrl(league.name, league.id)
        const lastmod = league.lastModified
          ? new Date(league.lastModified).toISOString()
          : new Date().toISOString()

        return `  <url>
    <loc>${SITE.url}${url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>`
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

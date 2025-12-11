/**
 * Players Sitemap Page
 * Returns a urlset XML with player entries for the given page.
 *
 * Route: GET /sitemaps/players/[page].xml
 */

import { NextResponse } from "next/server"
import { notFound } from "next/navigation"
import { SITE } from "@/lib/constants"
import {
  getPlayersForSitemap,
  getPlayerPageCount,
  initializeSchema,
} from "@/lib/sitemap-cache"
import { getPlayerUrl } from "@/lib/utils"

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

    const pageCount = getPlayerPageCount()
    if (page > pageCount) {
      notFound()
    }

    const players = getPlayersForSitemap(page)

    const urlEntries = players
      .map((player) => {
        const url = getPlayerUrl(player.name, player.id)
        const lastmod = player.lastModified
          ? new Date(player.lastModified).toISOString()
          : new Date().toISOString()

        return `  <url>
    <loc>${SITE.url}${url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
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
    console.error("[Sitemap] Failed to generate players page:", page, error)
    notFound()
  }
}

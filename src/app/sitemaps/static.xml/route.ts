/**
 * Static Pages Sitemap
 * Returns a urlset XML with static core pages.
 *
 * Route: GET /sitemaps/static.xml
 */

import { NextResponse } from "next/server"
import { SITE } from "@/lib/constants"

export const revalidate = 86400 // 24 hours (static pages change rarely)

interface StaticPage {
  path: string
  changefreq: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly"
  priority: number
}

const STATIC_PAGES: StaticPage[] = [
  { path: "", changefreq: "always", priority: 1.0 },
  { path: "/live", changefreq: "always", priority: 0.95 },
  { path: "/matches", changefreq: "always", priority: 0.9 },
  { path: "/leagues", changefreq: "daily", priority: 0.8 },
  { path: "/teams", changefreq: "daily", priority: 0.8 },
  { path: "/players", changefreq: "daily", priority: 0.8 },
  { path: "/privacy", changefreq: "yearly", priority: 0.3 },
  { path: "/terms", changefreq: "yearly", priority: 0.3 },
]

export async function GET() {
  const now = new Date().toISOString()

  const urlEntries = STATIC_PAGES.map(
    (page) => `  <url>
    <loc>${SITE.url}${page.path}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
  ).join("\n")

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>`

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  })
}

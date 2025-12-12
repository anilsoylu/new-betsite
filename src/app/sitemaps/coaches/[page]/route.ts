/**
 * Coaches Sitemap Page
 * Returns a urlset XML with coach entries for the given page.
 *
 * Route: GET /sitemaps/coaches/[page].xml
 */

import { NextResponse } from "next/server";
import { notFound } from "next/navigation";
import { SITE } from "@/lib/constants";
import {
  getCoachesForSitemap,
  getCoachPageCount,
  initializeSchema,
} from "@/lib/sitemap-cache";
import { getCoachUrl } from "@/lib/utils";

export const revalidate = 3600; // 1 hour

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ page: string }> },
) {
  const { page: pageParam } = await params;

  // Require .xml extension
  if (!pageParam.endsWith(".xml")) {
    notFound();
  }

  const page = Number.parseInt(pageParam.replace(".xml", ""), 10);

  if (Number.isNaN(page) || page < 1) {
    notFound();
  }

  try {
    initializeSchema();

    const pageCount = getCoachPageCount();
    if (page > pageCount) {
      notFound();
    }

    const coaches = getCoachesForSitemap(page);

    const urlEntries = coaches
      .map((coach) => {
        const url = getCoachUrl(coach.name, coach.id);
        const lastmod = coach.lastModified
          ? new Date(coach.lastModified).toISOString()
          : new Date().toISOString();

        return `  <url>
    <loc>${SITE.url}${url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`;
      })
      .join("\n");

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>`;

    return new NextResponse(xml, {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
    });
  } catch (error) {
    console.error("[Sitemap] Failed to generate coaches page:", page, error);
    notFound();
  }
}

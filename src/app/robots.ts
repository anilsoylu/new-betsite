import type { MetadataRoute } from "next"
import { SITE } from "@/lib/constants"

export default function robots(): MetadataRoute.Robots {
  const baseUrl = SITE.url

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}

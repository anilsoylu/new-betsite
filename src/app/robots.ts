import type { MetadataRoute } from "next";
import { SITE } from "@/lib/constants";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = SITE.url;

  return {
    rules: [
      {
        userAgent: "*", // All search engines
        allow: "/",
        disallow: ["/api/*"], // Block API routes
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/api/*"],
      },
      {
        userAgent: "Bingbot",
        allow: "/",
        disallow: ["/api/*"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

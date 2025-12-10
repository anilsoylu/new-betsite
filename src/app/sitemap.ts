import type { MetadataRoute } from "next";
import { SITE } from "@/lib/constants";
import { TOP_LEAGUES } from "@/components/sidebar/top-leagues";

// Helper to create URL-friendly slug
function createSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SITE.url;
  const now = new Date();

  // Static core pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: "always",
      priority: 1,
    },
    {
      url: `${baseUrl}/matches`,
      lastModified: now,
      changeFrequency: "always",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/leagues`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/teams`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/players`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  // Dynamic league pages from TOP_LEAGUES
  const leaguePages: MetadataRoute.Sitemap = TOP_LEAGUES.flatMap((league) => {
    const leagueSlug = `${createSlug(league.name)}-${league.id}`;
    return [
      {
        url: `${baseUrl}/leagues/${leagueSlug}`,
        lastModified: now,
        changeFrequency: "daily" as const,
        priority: 0.8,
      },
      {
        url: `${baseUrl}/leagues/${leagueSlug}/fixtures`,
        lastModified: now,
        changeFrequency: "daily" as const,
        priority: 0.7,
      },
      {
        url: `${baseUrl}/leagues/${leagueSlug}/standings`,
        lastModified: now,
        changeFrequency: "daily" as const,
        priority: 0.7,
      },
      {
        url: `${baseUrl}/leagues/${leagueSlug}/stats`,
        lastModified: now,
        changeFrequency: "daily" as const,
        priority: 0.7,
      },
    ];
  });

  // Section sitemap indexes (XML sitemaps fed from SQLite cache)
  const sectionSitemaps: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/sitemaps/leagues.xml`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/sitemaps/teams.xml`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/sitemaps/players.xml`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/sitemaps/matches.xml`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
  ];

  return [...staticPages, ...leaguePages, ...sectionSitemaps];
}

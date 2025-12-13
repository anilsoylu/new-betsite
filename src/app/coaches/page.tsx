import { ChevronRight, Search, Users } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { JsonLdScript } from "@/components/seo";
import {
  OtherLeagues,
  StandingsWidget,
  TopLeagues,
} from "@/components/sidebar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { SEO, SITE, POPULAR_LEAGUE_IDS } from "@/lib/constants";
import { getTopLeaguesStandings } from "@/lib/queries";
import {
  generateBreadcrumbSchema,
  generateItemListSchema,
} from "@/lib/seo/json-ld";
import {
  initializeSchema,
  getCoachesForPopularLeagues,
  type LeagueWithCoaches,
} from "@/lib/sitemap-cache";
import { getCoachUrl, getTeamUrl } from "@/lib/utils";

// Revalidate every 6 hours for coach list
export const revalidate = 21600;

export const metadata: Metadata = {
  title: SEO.coaches.title,
  description: SEO.coaches.description,
  alternates: {
    canonical: `${SITE.url}/coaches`,
  },
  openGraph: {
    title: SEO.coaches.title,
    description: SEO.coaches.description,
    url: `${SITE.url}/coaches`,
    siteName: SITE.name,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: SEO.coaches.title,
    description: SEO.coaches.description,
  },
};

/**
 * Faz 4: SQLite-first approach for coaches page.
 * Fetches coaches from SQLite cache instead of making 19+ API calls.
 * This reduces TTFB dramatically and eliminates API rate limit concerns.
 */
function getCoachesFromSQLite(): Array<{
  leagueId: number;
  leagueName: string;
  leagueLogo: string;
  coaches: Array<{
    id: number;
    name: string;
    displayName: string;
    image: string | null;
    teamId: number;
    teamName: string;
    teamLogo: string;
  }>;
}> {
  // Ensure schema is initialized (uses once-guard, safe to call multiple times)
  initializeSchema();

  // Get coaches from SQLite cache - 0 API calls!
  const leaguesWithCoaches = getCoachesForPopularLeagues(
    POPULAR_LEAGUE_IDS,
    16, // Max 16 coaches per league
  );

  // Transform to match the expected UI structure
  return leaguesWithCoaches.map((league: LeagueWithCoaches) => ({
    leagueId: league.leagueId,
    leagueName: league.leagueName,
    leagueLogo: league.leagueLogo ?? "",
    coaches: league.coaches.map((coach) => ({
      id: coach.id,
      name: coach.name,
      displayName: coach.name, // SQLite stores name, use as displayName
      image: null, // SQLite doesn't store coach images (can be enhanced later)
      teamId: coach.teamId ?? 0,
      teamName: coach.teamName ?? "",
      teamLogo: coach.teamLogo ?? "",
    })),
  }));
}

export default async function CoachesPage() {
  // Faz 4: SQLite-first for coaches, API only for standings
  // Coaches: 0 API calls (from SQLite cache)
  // Standings: still uses API (can be cached separately if needed)
  const [leagueCoaches, leagueStandings] = await Promise.all([
    Promise.resolve(getCoachesFromSQLite()), // Sync SQLite call wrapped in Promise
    getTopLeaguesStandings().catch(() => []),
  ]);

  const totalCoaches = leagueCoaches.reduce(
    (sum, league) => sum + league.coaches.length,
    0,
  );

  // Generate structured data
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: SITE.url },
    { name: "Coaches", url: `${SITE.url}/coaches` },
  ]);

  // Generate ItemList schema for top 10 coaches
  const allCoaches = leagueCoaches.flatMap((league) => league.coaches);
  const itemListSchema = generateItemListSchema({
    name: "Football Managers",
    description: "Top football managers from the best leagues worldwide",
    items: allCoaches.slice(0, 10).map((coach) => ({
      name: coach.displayName,
      url: getCoachUrl(coach.displayName, coach.id),
      image: coach.image ?? undefined,
    })),
    maxItems: 10,
  });

  return (
    <main className="flex-1 overflow-auto">
      <JsonLdScript id="breadcrumb-schema" schema={breadcrumbSchema} />
      <JsonLdScript id="itemlist-schema" schema={itemListSchema} />
      <div className="container mx-auto px-4 py-4">
        {/* 3-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr_300px] gap-6">
          {/* Left Sidebar */}
          <aside className="hidden lg:flex flex-col gap-4">
            <TopLeagues />
            <OtherLeagues />
          </aside>

          {/* Center Content */}
          <div className="min-w-0">
            {/* Page Header */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold">Football Managers</h1>
              <p className="text-muted-foreground text-sm mt-1">
                {totalCoaches} managers from {leagueCoaches.length} leagues
              </p>
            </div>

            {/* Search Hint */}
            <div className="mb-6 p-4 rounded-xl border bg-muted/30">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Search className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Search for any coach</p>
                  <p className="text-xs text-muted-foreground">
                    Press{" "}
                    <kbd className="inline-flex h-5 items-center gap-1 rounded border bg-background px-1.5 font-mono text-[10px] font-medium">
                      ⌘K
                    </kbd>{" "}
                    or use the search in header
                  </p>
                </div>
              </div>
            </div>

            {/* League Managers */}
            <div className="space-y-6">
              {leagueCoaches.map((league) => (
                <Card key={league.leagueId}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <Link
                        href={`/leagues/${league.leagueName.toLowerCase().replace(/\s+/g, "-")}-${league.leagueId}`}
                        className="flex items-center gap-2 hover:opacity-80 transition-opacity group"
                      >
                        <Image
                          src={league.leagueLogo}
                          alt={league.leagueName}
                          width={24}
                          height={24}
                          className="object-contain"
                        />
                        <h2 className="text-base group-hover:text-primary transition-colors leading-none font-semibold">
                          {league.leagueName}
                        </h2>
                        <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                      <Badge variant="secondary" className="text-xs">
                        <Users className="h-3 w-3 mr-1" />
                        Managers
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {league.coaches.map((coach) => (
                        <div
                          key={coach.id}
                          className="relative flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors group"
                        >
                          {/* Main Card Link (Coach Profile) */}
                          <Link
                            href={getCoachUrl(coach.displayName, coach.id)}
                            className="absolute inset-0 z-0"
                          >
                            <span className="sr-only">
                              View {coach.displayName}'s profile
                            </span>
                          </Link>

                          {/* Coach Image */}
                          <div className="relative z-10 pointer-events-none">
                            {coach.image ? (
                              <Image
                                src={coach.image}
                                alt={coach.displayName}
                                width={40}
                                height={40}
                                className="rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-sm font-medium">
                                {coach.displayName.charAt(0)}
                              </div>
                            )}
                          </div>

                          {/* Coach Info */}
                          <div className="flex-1 min-w-0 relative z-10 pointer-events-none">
                            <h3 className="text-sm font-medium truncate group-hover:text-primary transition-colors">
                              {coach.displayName}
                            </h3>
                            <Link
                              href={getTeamUrl(coach.teamName, coach.teamId)}
                              className="flex items-center gap-1.5 hover:underline pointer-events-auto w-fit mt-0.5"
                            >
                              <Image
                                src={coach.teamLogo}
                                alt={coach.teamName}
                                width={14}
                                height={14}
                                className="object-contain"
                              />
                              <span className="text-xs text-muted-foreground truncate">
                                {coach.teamName}
                              </span>
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Empty State */}
            {leagueCoaches.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <p>No coach data available at the moment</p>
                <p className="text-sm mt-2">
                  Use the search to find coaches or browse team pages
                </p>
              </div>
            )}
          </div>

          {/* Right Sidebar */}
          <aside className="hidden md:flex flex-col gap-4">
            <StandingsWidget leagueStandings={leagueStandings} />
          </aside>
        </div>
      </div>
    </main>
  );
}

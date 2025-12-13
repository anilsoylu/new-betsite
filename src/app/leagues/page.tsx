import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Trophy, Globe, ChevronRight } from "lucide-react";
import { SITE, SEO } from "@/lib/constants";
import { getAllLeaguesFull } from "@/lib/api/cached-football-api";
import { slugify } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { JsonLdScript } from "@/components/seo/json-ld-script";

// SEO Metadata
export const metadata: Metadata = {
  title: SEO.leagues.title,
  description: SEO.leagues.description,
  keywords: [
    "football leagues",
    "soccer leagues",
    "league standings",
    "football competitions",
    "premier league",
    "la liga",
    "bundesliga",
    "serie a",
    "champions league",
  ],
  alternates: {
    canonical: `${SITE.url}/leagues`,
  },
  openGraph: {
    title: SEO.leagues.title,
    description: SEO.leagues.description,
    url: `${SITE.url}/leagues`,
    siteName: SITE.name,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: SEO.leagues.title,
    description: SEO.leagues.description,
  },
};

// Cache for 6 hours - league list rarely changes
export const revalidate = 21600;

// Top leagues IDs for featured section
const TOP_LEAGUE_IDS = new Set([
  8, 564, 82, 384, 301, 600, 72, 462, 2, 5, 2286,
]);

// International competition IDs
const INTERNATIONAL_IDS = new Set([2, 5, 2286]);

// JSON-LD Breadcrumb Schema
const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: SITE.url,
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Leagues",
      item: `${SITE.url}/leagues`,
    },
  ],
};

export default async function LeaguesPage() {
  // Fetch all leagues from API
  const allLeagues = await getAllLeaguesFull();

  // Separate into groups
  const topEuropeanLeagues = allLeagues
    .filter((l) => TOP_LEAGUE_IDS.has(l.id) && !INTERNATIONAL_IDS.has(l.id))
    .sort((a, b) => a.name.localeCompare(b.name));

  const internationalCompetitions = allLeagues
    .filter((l) => INTERNATIONAL_IDS.has(l.id))
    .sort((a, b) => a.name.localeCompare(b.name));

  // Group other leagues by country
  const otherLeagues = allLeagues.filter((l) => !TOP_LEAGUE_IDS.has(l.id));

  const leaguesByCountry = new Map<string, typeof otherLeagues>();
  for (const league of otherLeagues) {
    const countryName = league.country?.name || "International";
    if (!leaguesByCountry.has(countryName)) {
      leaguesByCountry.set(countryName, []);
    }
    leaguesByCountry.get(countryName)!.push(league);
  }

  // Sort countries alphabetically and get top 20 by league count
  const sortedCountries = Array.from(leaguesByCountry.entries())
    .map(([country, leagues]) => ({
      country,
      leagues: leagues.sort((a, b) => a.name.localeCompare(b.name)),
      flag: leagues[0]?.country?.flag || "",
    }))
    .sort((a, b) => b.leagues.length - a.leagues.length)
    .slice(0, 20);

  // ItemList schema for leagues
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Football Leagues",
    numberOfItems: allLeagues.length,
    itemListElement: [...topEuropeanLeagues, ...internationalCompetitions]
      .slice(0, 10)
      .map((league, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: league.name,
        url: `${SITE.url}/leagues/${slugify(league.name)}-${league.id}`,
      })),
  };

  return (
    <>
      <JsonLdScript id="breadcrumb-schema" schema={breadcrumbSchema} />
      <JsonLdScript id="leagues-list-schema" schema={itemListSchema} />

      <main className="flex-1 overflow-auto">
        <div className="container mx-auto px-4 py-8 max-w-5xl">
          {/* Hero Section */}
          <header className="text-center mb-10">
            <h1 className="text-3xl font-bold mb-3">Football Leagues</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore {allLeagues.length}+ football leagues and competitions
              from around the world. View standings, fixtures, top scorers and
              statistics.
            </p>
          </header>

          {/* Top European Leagues */}
          <section aria-labelledby="top-leagues-heading" className="mb-8">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle
                  id="top-leagues-heading"
                  className="flex items-center gap-2 text-lg"
                >
                  <Trophy className="h-5 w-5 text-primary" />
                  Top European Leagues
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2">
                  {topEuropeanLeagues.map((league) => (
                    <Link
                      key={league.id}
                      href={`/leagues/${slugify(league.name)}-${league.id}`}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors group"
                    >
                      <Image
                        src={league.logo}
                        alt={league.name}
                        width={32}
                        height={32}
                        className="object-contain"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate group-hover:text-primary transition-colors">
                          {league.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {league.country?.name || "Europe"}
                        </p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>

          {/* International Competitions */}
          <section aria-labelledby="intl-heading" className="mb-8">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle
                  id="intl-heading"
                  className="flex items-center gap-2 text-lg"
                >
                  <Globe className="h-5 w-5 text-primary" />
                  International Competitions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2">
                  {internationalCompetitions.map((league) => (
                    <Link
                      key={league.id}
                      href={`/leagues/${slugify(league.name)}-${league.id}`}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors group"
                    >
                      <Image
                        src={league.logo}
                        alt={league.name}
                        width={32}
                        height={32}
                        className="object-contain"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate group-hover:text-primary transition-colors">
                          {league.name}
                        </p>
                        <p className="text-xs text-muted-foreground">UEFA</p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Leagues by Country */}
          <section aria-labelledby="by-country-heading" className="mb-8">
            <h2
              id="by-country-heading"
              className="text-xl font-semibold mb-4 flex items-center gap-2"
            >
              <Globe className="h-5 w-5" />
              Leagues by Country
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {sortedCountries.map(({ country, leagues, flag }) => (
                <Card key={country}>
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-base">
                      {flag && (
                        <Image
                          src={flag}
                          alt={country}
                          width={20}
                          height={14}
                          className="object-contain rounded-sm"
                        />
                      )}
                      {country}
                      <span className="text-xs font-normal text-muted-foreground ml-auto">
                        {leagues.length} leagues
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-1">
                      {leagues.slice(0, 5).map((league) => (
                        <Link
                          key={league.id}
                          href={`/leagues/${slugify(league.name)}-${league.id}`}
                          className="flex items-center gap-2 py-1.5 px-2 -mx-2 rounded hover:bg-muted/50 transition-colors text-sm group"
                        >
                          <Image
                            src={league.logo}
                            alt={league.name}
                            width={18}
                            height={18}
                            className="object-contain"
                          />
                          <span className="truncate group-hover:text-primary transition-colors">
                            {league.name}
                          </span>
                        </Link>
                      ))}
                      {leagues.length > 5 && (
                        <p className="text-xs text-muted-foreground pt-1 pl-2">
                          +{leagues.length - 5} more leagues
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Info Cards */}
          <section aria-labelledby="features-heading" className="mb-8">
            <h2 id="features-heading" className="sr-only">
              Features
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Trophy className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">Live Standings</h3>
                      <p className="text-sm text-muted-foreground">
                        Real-time league tables updated after every match. Track
                        positions, points, and goal differences.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Globe className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">Global Coverage</h3>
                      <p className="text-sm text-muted-foreground">
                        Access data from {allLeagues.length}+ leagues worldwide
                        including domestic leagues, cups, and international
                        competitions.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}

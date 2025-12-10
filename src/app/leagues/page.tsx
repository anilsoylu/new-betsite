import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Search, Trophy, Globe, ChevronRight } from "lucide-react";
import { SITE } from "@/lib/constants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TOP_LEAGUES } from "@/components/sidebar/top-leagues";

export const metadata: Metadata = {
  title: `Leagues | ${SITE.name}`,
  description:
    "Browse football leagues and competitions from around the world. View standings, fixtures, and statistics.",
};

// Helper to create URL-friendly slug
function createSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

// Group leagues by region
const LEAGUE_GROUPS = [
  {
    title: "Top European Leagues",
    leagues: TOP_LEAGUES.filter((l) =>
      [
        "England",
        "Spain",
        "Germany",
        "Italy",
        "France",
        "Turkey",
        "Netherlands",
        "Portugal",
      ].includes(l.country),
    ),
  },
  {
    title: "International Competitions",
    leagues: TOP_LEAGUES.filter((l) =>
      ["International", "Europe"].includes(l.country),
    ),
  },
];

export default function LeaguesPage() {
  return (
    <main className="flex-1 overflow-auto">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-4">Football Leagues</h1>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            Explore football leagues and competitions from around the world.
            View standings, upcoming fixtures, and historical data.
          </p>
          <div className="flex items-center justify-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <div className="pl-10 pr-4 py-2.5 rounded-lg border bg-muted/50 text-muted-foreground text-sm w-64 text-left">
                Use search in header...
              </div>
            </div>
            <span className="text-xs text-muted-foreground">or press</span>
            <kbd className="inline-flex h-6 items-center gap-1 rounded border bg-muted px-2 font-mono text-xs font-medium">
              <span>⌘</span>K
            </kbd>
          </div>
        </div>

        {/* League Groups */}
        {LEAGUE_GROUPS.map((group) => (
          <Card key={group.title} className="mb-6">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                {group.title === "International Competitions" ? (
                  <Globe className="h-5 w-5 text-primary" />
                ) : (
                  <Trophy className="h-5 w-5 text-primary" />
                )}
                {group.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2">
                {group.leagues.map((league) => (
                  <Link
                    key={league.id}
                    href={`/leagues/${createSlug(league.name)}-${league.id}`}
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
                      <p className="font-medium truncate">{league.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {league.country}
                      </p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Info Section */}
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
                    Access data from 1,000+ leagues worldwide including domestic
                    leagues, cups, and international competitions.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}

import Link from "next/link";
import Image from "next/image";
import { cn, slugify } from "@/lib/utils";
import { getAllLeaguesFull } from "@/lib/api/cached-football-api";

// Top leagues IDs - these are shown in "Top Leagues" card
const TOP_LEAGUE_IDS = new Set([
  8, // Premier League
  564, // La Liga
  82, // Bundesliga
  384, // Serie A
  301, // Ligue 1
  600, // Süper Lig
  72, // Eredivisie
  462, // Liga Portugal
  2, // Champions League
  5, // Europa League
  2286, // Conference League
]);

// Fixed order for top leagues
const TOP_LEAGUE_ORDER = [8, 564, 82, 384, 301, 600, 72, 462, 2, 5, 2286];

// Legacy export for backward compatibility with other parts of the app
export const TOP_LEAGUES = [
  {
    id: 8,
    name: "Premier League",
    shortName: "EPL",
    country: "England",
    logo: "https://cdn.sportmonks.com/images/soccer/leagues/8/8.png",
  },
  {
    id: 564,
    name: "La Liga",
    shortName: "La Liga",
    country: "Spain",
    logo: "https://cdn.sportmonks.com/images/soccer/leagues/564.png",
  },
  {
    id: 82,
    name: "Bundesliga",
    shortName: "Bundesliga",
    country: "Germany",
    logo: "https://cdn.sportmonks.com/images/soccer/leagues/82.png",
  },
  {
    id: 384,
    name: "Serie A",
    shortName: "Serie A",
    country: "Italy",
    logo: "https://cdn.sportmonks.com/images/soccer/leagues/384.png",
  },
  {
    id: 301,
    name: "Ligue 1",
    shortName: "Ligue 1",
    country: "France",
    logo: "https://cdn.sportmonks.com/images/soccer/leagues/301.png",
  },
  {
    id: 600,
    name: "Süper Lig",
    shortName: "Süper Lig",
    country: "Turkey",
    logo: "https://cdn.sportmonks.com/images/soccer/leagues/600.png",
  },
  {
    id: 72,
    name: "Eredivisie",
    shortName: "Eredivisie",
    country: "Netherlands",
    logo: "https://cdn.sportmonks.com/images/soccer/leagues/72.png",
  },
  {
    id: 462,
    name: "Liga Portugal",
    shortName: "Liga Portugal",
    country: "Portugal",
    logo: "https://cdn.sportmonks.com/images/soccer/leagues/462.png",
  },
  {
    id: 2,
    name: "Champions League",
    shortName: "UCL",
    country: "Europe",
    logo: "https://cdn.sportmonks.com/images/soccer/leagues/2.png",
  },
  {
    id: 5,
    name: "Europa League",
    shortName: "UEL",
    country: "Europe",
    logo: "https://cdn.sportmonks.com/images/soccer/leagues/5.png",
  },
  {
    id: 2286,
    name: "Conference League",
    shortName: "UECL",
    country: "Europe",
    logo: "https://cdn.sportmonks.com/images/soccer/leagues/2286.png",
  },
];

interface TopLeaguesProps {
  className?: string;
}

export async function TopLeagues({ className }: TopLeaguesProps) {
  // Fetch all leagues from API
  const allLeagues = await getAllLeaguesFull();

  // Get top leagues and sort by predefined order
  const topLeagues = allLeagues
    .filter((league) => TOP_LEAGUE_IDS.has(league.id))
    .sort(
      (a, b) => TOP_LEAGUE_ORDER.indexOf(a.id) - TOP_LEAGUE_ORDER.indexOf(b.id),
    );

  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card overflow-hidden",
        className,
      )}
    >
      <div className="px-4 py-3 border-b border-border bg-muted/30">
        <h3 className="font-semibold text-sm">Top Leagues</h3>
      </div>
      <div className="divide-y divide-border/50">
        {topLeagues.map((league) => (
          <Link
            key={league.id}
            href={`/leagues/${slugify(league.name)}-${league.id}`}
            className={cn(
              "flex items-center gap-3 px-4 py-2.5 transition-colors",
              "hover:bg-muted/50",
            )}
          >
            <Image
              src={league.logo}
              alt={league.name}
              width={20}
              height={20}
              className="object-contain w-5 h-5"
            />
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-medium truncate">
                {league.name}
              </span>
              <span className="text-[10px] text-muted-foreground">
                {league.country?.name || "International"}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
